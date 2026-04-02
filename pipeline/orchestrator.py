"""
MIKAGE PIPELINE — orchestrator.py v2
Full E2E: Gemini intake -> Claude spec -> Fooocus render -> Validator -> Gemini gate
Now lane-aware throughout.
"""

import json
import time
import logging
import argparse
import uuid
from pathlib import Path
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s - %(name)s - %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("mikage.orchestrator")

from .config import RUNS_DIR, log_key_presence
from .gemini_intake import intake
from .claude_spec import build_fooocus_spec
from .canon_rules import detect_lane
from .render_handler import render
from .validator import validate
from .gemini_gate import final_gate
from .rag_retriever import get_mikage_memory_context


def generate_job_id() -> str:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{ts}_{uuid.uuid4().hex[:6]}"


def run_pipeline(brief: str) -> dict:
    job_id = generate_job_id()
    job_dir = RUNS_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    log.info(f"{'='*60}")
    log.info(f"MIKAGE PIPELINE - Job: {job_id}")
    log.info(f"Brief: {brief[:120]}...")
    log.info(f"Output: {job_dir}")
    log.info(f"{'='*60}")

    log_key_presence()

    # RESCUE: preserve original prompt before any stage mutates it
    original_prompt = brief

    # Detect lane early
    lane = detect_lane(brief)
    log.info(f"Lane: {lane.upper()}")

    pipeline_start = time.time()
    result = {
        "job_id": job_id, "job_dir": str(job_dir), "brief": brief,
        "lane": lane, "stages": {}, "final_decision": "REJECT", "output_files": [],
    }

    # ── STAGE 1: Gemini Intake ──
    log.info(f"\n>>> STAGE 1: Gemini Intake")
    t = time.time()
    intake_result = intake(brief)
    result["stages"]["gemini_intake"] = {**intake_result, "duration": round(time.time() - t, 1)}

    if intake_result["status"] != "success":
        log.error(f"STAGE 1 FAILED: {intake_result.get('error')}")
        result["reject_reason"] = f"Gemini intake: {intake_result.get('error')}"
        result["total_duration"] = round(time.time() - pipeline_start, 1)
        save_result(result, job_dir)
        return result

    spec = intake_result["spec"]
    (job_dir / "spec.json").write_text(json.dumps(spec, indent=2))

    # ── STAGE 1.5: RAG Memory Retrieval ──
    log.info(f"\n>>> STAGE 1.5: RAG Memory Retrieval")
    t = time.time()
    
    rag_query = f"{lane} {spec.get('subject', '')} {spec.get('material', '')}"
    mikage_memory_context, rag_raw_result = get_mikage_memory_context(rag_query)
    
    rag_status = {
        "rag_executed": True,
        "query_used": rag_query,
        "retriever_mode": rag_raw_result.get("retriever_mode", "unknown"),
        "real_vertex_verified": rag_raw_result.get("real_vertex_verified", False),
        "retrieval_success": rag_raw_result.get("totalResults", 0) > 0,
        "fallback_used": rag_raw_result.get("fallback_used", True),
        "error": rag_raw_result.get("error"),
        "chunks_returned": rag_raw_result.get("totalResults", 0),
        "sources": rag_raw_result.get("sources", []),
        "credential_status": rag_raw_result.get("credential_status", {}),
        "duration": round(time.time() - t, 1)
    }
    
    # Write RAG status artifact (always written, even on failure)
    (job_dir / "rag_status.json").write_text(json.dumps(rag_status, indent=2, default=str))
    
    # Write full RAG context if available
    if mikage_memory_context:
        rag_context_artifact = {
            "context": mikage_memory_context,
            "raw_result": rag_raw_result,
            "injected_into_spec": True
        }
        (job_dir / "rag_context.json").write_text(json.dumps(rag_context_artifact, indent=2, default=str))
        log.info(f"[RAG] Injected {rag_status['chunks_returned']} memory chunks into spec")
    else:
        rag_context_artifact = {
            "context": "",
            "raw_result": rag_raw_result,
            "injected_into_spec": False,
            "error": "No context retrieved"
        }
        (job_dir / "rag_context.json").write_text(json.dumps(rag_context_artifact, indent=2, default=str))
        log.warning(f"[RAG] No memory context retrieved: {rag_status.get('error')}")
    
    result["stages"]["rag_retrieval"] = rag_status

    # ── STAGE 2: Claude Spec ──
    log.info(f"\n>>> STAGE 2: Claude Spec Writer")
    t = time.time()
    # Inject memory context into spec before building fooocus spec
    if mikage_memory_context:
        spec["mikage_memory_context"] = mikage_memory_context
    
    fooocus_spec = build_fooocus_spec(spec)
    lane = fooocus_spec.get("lane", lane)  # Update lane from spec
    result["lane"] = lane
    result["stages"]["claude_spec"] = {"status": "success", "lane": lane,
                                        "prompt_length": len(fooocus_spec["prompt"]),
                                        "duration": round(time.time() - t, 1)}

    (job_dir / "prompt.json").write_text(json.dumps(fooocus_spec, indent=2))
    log.info(f"  Prompt (spec): {fooocus_spec['prompt'][:120]}...")

    # Use spec-processed prompt for render (proper flow)
    final_prompt = fooocus_spec["prompt"]

    # ── STAGE 3: Fooocus Render ──
    log.info(f"\n>>> STAGE 3: Fooocus Render")
    print("FINAL_PROMPT:", final_prompt)
    t = time.time()
    render_result = render(
        prompt=final_prompt,
        negative_prompt=fooocus_spec["negative_prompt"],
        params=fooocus_spec["params"],
        job_dir=job_dir,
    )
    result["stages"]["render"] = {**render_result, "duration": round(time.time() - t, 1)}

    if render_result["status"] != "success":
        log.error(f"STAGE 3 FAILED: {render_result.get('error')}")
        result["reject_reason"] = f"Render: {render_result.get('error')}"
        result["total_duration"] = round(time.time() - pipeline_start, 1)
        save_result(result, job_dir)
        return result

    output_path = render_result.get("output_path", "")

    # ── STAGE 4: Post-Validator ──
    log.info(f"\n>>> STAGE 4: Post-Validator")
    t = time.time()
    val_result = validate(output_path, job_dir)
    result["stages"]["validator"] = {**val_result, "duration": round(time.time() - t, 1)}

    if val_result["status"] == "fail":
        log.error(f"STAGE 4 FAILED: {val_result.get('hard_fails')}")
        result["reject_reason"] = f"Validator: {val_result.get('hard_fails')}"
        result["total_duration"] = round(time.time() - pipeline_start, 1)
        save_result(result, job_dir)
        return result

    pixel_report = val_result.get("pixel_report", {})

    # ── STAGE 5: Gemini Final Gate ──
    log.info(f"\n>>> STAGE 5: Gemini Final Gate (lane={lane})")
    t = time.time()
    gate_result = final_gate(output_path, pixel_report, job_dir, lane=lane)
    result["stages"]["gemini_gate"] = {**gate_result, "duration": round(time.time() - t, 1)}

    if gate_result["final_decision"] != "ALLOW":
        result["final_decision"] = "REJECT"
        result["reject_reason"] = f"Gemini gate: {gate_result.get('reasoning', 'no reason')}"
    else:
        result["final_decision"] = "ALLOW"
        result["output_files"] = ["output.png"]

    result["total_duration"] = round(time.time() - pipeline_start, 1)
    save_result(result, job_dir)

    log.info(f"\n{'='*60}")
    log.info(f"PIPELINE COMPLETE - {result['final_decision']}")
    log.info(f"  Job:      {job_id}")
    log.info(f"  Lane:     {lane}")
    log.info(f"  Duration: {result['total_duration']}s")
    if result["final_decision"] == "ALLOW":
        log.info(f"  Files:    {result['output_files']}")
    else:
        log.info(f"  Reason:   {result.get('reject_reason', '?')}")
    log.info(f"{'='*60}")

    return result


def save_result(result: dict, job_dir: Path):
    clean = json.loads(json.dumps(result, default=str))
    (job_dir / "report.json").write_text(json.dumps(clean, indent=2))


def main():
    parser = argparse.ArgumentParser(description="MIKAGE ZENITH Pipeline")
    parser.add_argument("brief", nargs="?", default=None)
    parser.add_argument("--brief", "-b", dest="brief_flag", default=None)
    args = parser.parse_args()

    brief = args.brief or args.brief_flag
    if not brief:
        brief = "porcelain kitsune mask, thin crimson seam at jawline, obsidian void background, chiaroscuro dramatic shadow, industrial precision"

    result = run_pipeline(brief)

    print(f"\n{'='*40}")
    print(f"Decision: {result['final_decision']}")
    print(f"Job ID:   {result['job_id']}")
    print(f"Lane:     {result.get('lane', '?')}")
    print(f"Duration: {result.get('total_duration', 'N/A')}s")
    print(f"{'='*40}")


if __name__ == "__main__":
    main()
