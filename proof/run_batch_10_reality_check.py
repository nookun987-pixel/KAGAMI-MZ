import hashlib
import importlib.util
import json
import os
import sys
import time
from collections import defaultdict
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PROOF_PATH = REPO_ROOT / "proof" / "batch_10_reality_check.json"
LOCAL_SHARED_ROOT = Path(r"G:\My Drive\mikage_runner")
COLAB_SHARED_ROOT = Path("/content/drive/MyDrive/mikage_runner")
REQUIRED_ARTIFACTS = [
    "normalized_job.json",
    "request_payload.json",
    "execution_trace.json",
    "raw_response.json",
    "result.json",
    "output.png",
]


BATCH_JOBS = [
    {
        "job_id": "MASK-BATCH-001",
        "lane": "MASK_MACRO",
        "idea": "obsidian ceramic mask reality check",
        "prompt": "obsidian ceramic mask, brutalist, museum-grade product shot, ultra clean silhouette, matte technical ceramic, no human face",
        "execution_target": "colab",
    },
    {
        "job_id": "MASK-BATCH-002",
        "lane": "MASK_MACRO",
        "idea": "mask jawline seam crimson accent reality check",
        "prompt": "macro ceramic mask jawline seam crimson accent, obsidian void background, controlled light, anti plastic",
        "execution_target": "colab",
    },
    {
        "job_id": "MASK-BATCH-003",
        "lane": "MASK_MACRO",
        "idea": "ceremonial engineered ceramic mask frontal hero",
        "prompt": "ceremonial engineered ceramic mask, frontal hero shot, minimal brutal luxury, no glossy resin",
        "execution_target": "colab",
    },
    {
        "job_id": "MASK-BATCH-004",
        "lane": "MASK_MACRO",
        "idea": "porcelain minimal mask hard edge discipline",
        "prompt": "porcelain-minimal mask with hard edge discipline, black void, premium object photography, no cosplay",
        "execution_target": "colab",
    },
    {
        "job_id": "MASK-BATCH-005",
        "lane": "MASK_MACRO",
        "idea": "technical ceramic mask micro detail reality check",
        "prompt": "technical ceramic mask close shot, micro surface detail, cold authority, no neon, no toy look",
        "execution_target": "colab",
    },
    {
        "job_id": "ENTITY-BATCH-001",
        "lane": "ENTITY_MEDIUM",
        "idea": "engineered ritual figure disciplined silhouette",
        "prompt": "engineered ritual figure, medium shot, disciplined silhouette, luxury brutalist editorial, no anime",
        "execution_target": "colab",
    },
    {
        "job_id": "ENTITY-BATCH-002",
        "lane": "ENTITY_MEDIUM",
        "idea": "matte ceramic entity standing centered",
        "prompt": "matte ceramic entity, standing centered, product-like object readability, cold controlled lighting",
        "execution_target": "colab",
    },
    {
        "job_id": "ENTITY-BATCH-003",
        "lane": "ENTITY_MEDIUM",
        "idea": "premium sculptural entity museum catalog",
        "prompt": "premium sculptural entity, museum catalog style, no character cosplay, no plastic surface",
        "execution_target": "colab",
    },
    {
        "job_id": "WEAPON-BATCH-001",
        "lane": "WEAPON_MACRO",
        "idea": "engineered greatsword readability check",
        "prompt": "straight engineered greatsword, forged metal readability, elongated silhouette, premium brutalist product frame",
        "execution_target": "colab",
    },
    {
        "job_id": "WEAPON-BATCH-002",
        "lane": "WEAPON_MACRO",
        "idea": "technical ceremonial blade macro",
        "prompt": "technical ceremonial blade macro, metal edge clarity, controlled composition, no fantasy toy look",
        "execution_target": "colab",
    },
]


def detect_shared_root():
    if LOCAL_SHARED_ROOT.exists():
        return LOCAL_SHARED_ROOT
    if COLAB_SHARED_ROOT.exists():
        return COLAB_SHARED_ROOT
    raise RuntimeError("No shared runner root found")


def load_worker(worker_path: Path):
    spec = importlib.util.spec_from_file_location("mikage_shared_worker", str(worker_path))
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def write_batch_jobs(shared_root: Path):
    inbox = shared_root / "job_inbox"
    inbox.mkdir(parents=True, exist_ok=True)
    written = []
    for payload in BATCH_JOBS:
        job_path = inbox / f"{payload['job_id']}.json"
        with open(job_path, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, ensure_ascii=False)
        written.append(job_path)
    return written


def sha256_of_file(file_path: Path):
    digest = hashlib.sha256()
    with open(file_path, "rb") as handle:
        while True:
            chunk = handle.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def evaluate_outputs(shared_root: Path):
    outputs_root = shared_root / "outputs"
    total_jobs = len(BATCH_JOBS)
    completed_jobs = 0
    failed_jobs = 0
    outputs_with_png = 0
    outputs_missing_png = 0
    artifact_integrity_pass_count = 0
    artifact_integrity_fail_count = 0
    per_lane_summary = defaultdict(lambda: {
        "total_jobs": 0,
        "completed_jobs": 0,
        "failed_jobs": 0,
        "outputs_with_png": 0,
        "full_artifact_sets": 0,
        "unique_image_hash_count": 0,
    })
    runtimes = []
    visual_notes = []
    lane_hashes = defaultdict(set)

    for payload in BATCH_JOBS:
        lane = payload["lane"]
        job_id = payload["job_id"]
        out_dir = outputs_root / job_id
        per_lane_summary[lane]["total_jobs"] += 1

        result_path = out_dir / "result.json"
        png_path = out_dir / "output.png"
        if result_path.exists():
            completed_jobs += 1
            per_lane_summary[lane]["completed_jobs"] += 1
            result = json.loads(result_path.read_text(encoding="utf-8"))
            runtime_ms = result.get("execution_time_ms")
            if isinstance(runtime_ms, (int, float)):
                runtimes.append(float(runtime_ms) / 1000.0)
        else:
            failed_jobs += 1
            per_lane_summary[lane]["failed_jobs"] += 1

        if png_path.exists() and png_path.stat().st_size > 0:
            outputs_with_png += 1
            per_lane_summary[lane]["outputs_with_png"] += 1
            lane_hashes[lane].add(sha256_of_file(png_path))
        else:
            outputs_missing_png += 1

        if out_dir.exists():
            present = [name for name in REQUIRED_ARTIFACTS if (out_dir / name).exists()]
            if len(present) == len(REQUIRED_ARTIFACTS):
                artifact_integrity_pass_count += 1
                per_lane_summary[lane]["full_artifact_sets"] += 1
            else:
                artifact_integrity_fail_count += 1
                visual_notes.append(f"{job_id}: missing_artifacts={sorted(set(REQUIRED_ARTIFACTS) - set(present))}")
        else:
            artifact_integrity_fail_count += 1
            visual_notes.append(f"{job_id}: missing_output_dir")

    for lane, hashes in lane_hashes.items():
        per_lane_summary[lane]["unique_image_hash_count"] = len(hashes)
        visual_notes.append(f"{lane}: unique_png_hashes={len(hashes)}")

    average_runtime_sec = round(sum(runtimes) / len(runtimes), 3) if runtimes else 0.0

    verdict = "FAKE_PIPELINE"
    if (
        completed_jobs >= 10 and
        outputs_with_png >= 8 and
        artifact_integrity_pass_count >= 8 and
        all(per_lane_summary[lane]["unique_image_hash_count"] >= 1 for lane in per_lane_summary)
    ):
        verdict = "REAL_UPGRADE"
    elif completed_jobs >= 1:
        verdict = "PARTIAL_ONLY"

    report = {
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "outputs_with_png": outputs_with_png,
        "outputs_missing_png": outputs_missing_png,
        "average_runtime_sec": average_runtime_sec,
        "per_lane_summary": dict(per_lane_summary),
        "artifact_integrity_pass_count": artifact_integrity_pass_count,
        "artifact_integrity_fail_count": artifact_integrity_fail_count,
        "visual_read_notes": visual_notes,
        "verdict": verdict,
    }
    PROOF_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROOF_PATH.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    return report


def run_batch():
    shared_root = detect_shared_root()
    worker_path = shared_root / "colab_worker.py"
    if not worker_path.exists():
        raise RuntimeError(f"Worker not found: {worker_path}")
    worker = load_worker(worker_path)
    written_jobs = write_batch_jobs(shared_root)
    print(f"WROTE_JOBS {len(written_jobs)}")
    processed = 0
    started = time.time()
    while processed < len(BATCH_JOBS):
        result = worker.scan_once()
        if result:
            processed += 1
            print(f"PROCESSED {processed}/{len(BATCH_JOBS)} {result.get('job_id')}")
        else:
            time.sleep(1)
        if time.time() - started > 7200:
            raise TimeoutError("Batch processing exceeded 2 hours")
    report = evaluate_outputs(shared_root)
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    run_batch()
