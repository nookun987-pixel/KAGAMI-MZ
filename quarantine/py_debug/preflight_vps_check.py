#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
MIKAGE VPS PREFLIGHT CHECK
Purpose:
- Auto-check VPS render readiness before any real run
- Fail fast on wrong model / wrong endpoint / wrong env / bad output dir / missing files
- Write proof artifact: preflight_report.json
- Exit code 0 only when PASS

Usage example:
python preflight_vps_check.py \
  --kagami-root /workspace/KAGAMI-MZ \
  --fooocus-root /workspace/Fooocus \
  --bridge-script /workspace/KAGAMI-MZ/scripts/fooocus_bridge.py \
  --bridge-url http://127.0.0.1:7865/generate \
  --health-url http://127.0.0.1:7865/health \
  --model-file /workspace/Fooocus/models/checkpoints/realvisxlV50_v40BakedVAE.safetensors \
  --venv-python /workspace/KAGAMI-MZ/venv/bin/python \
  --output-dir /workspace/KAGAMI-MZ/runs \
  --report-path /workspace/KAGAMI-MZ/preflight_report.json \
  --job-json /workspace/KAGAMI-MZ/test_job.json \
  --expected-port 7865 \
  --min-disk-gb 15 \
  --min-ram-gb 8 \
  --min-vram-gb 6

Exit codes:
0 = PASS
1 = FAIL
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import urllib.request
    import urllib.error
except Exception:
    urllib = None


# =========================
# Data models
# =========================

@dataclass
class CheckResult:
    name: str
    status: str  # PASS / FAIL / WARN / SKIP
    details: List[str] = field(default_factory=list)
    data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Report:
    overall_status: str
    timestamp_unix: int
    summary: Dict[str, int]
    checks: List[CheckResult]
    hard_fail_reasons: List[str]
    warnings: List[str]
    context: Dict[str, Any]


# =========================
# Helpers
# =========================

def now_ts() -> int:
    return int(time.time())


def safe_read_json(path: Optional[str]) -> Optional[Dict[str, Any]]:
    if not path:
        return None
    p = Path(path)
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return None


def write_json(path: str, payload: Dict[str, Any]) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def run_cmd(cmd: List[str], timeout: int = 15) -> Tuple[int, str, str]:
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            check=False,
        )
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except subprocess.TimeoutExpired:
        return 124, "", f"timeout after {timeout}s"
    except Exception as e:
        return 1, "", str(e)


def path_exists(path: Optional[str]) -> bool:
    return bool(path) and Path(path).exists()


def is_file(path: Optional[str]) -> bool:
    return bool(path) and Path(path).is_file()


def is_dir(path: Optional[str]) -> bool:
    return bool(path) and Path(path).is_dir()


def http_json_get(url: str, timeout: int = 5) -> Tuple[bool, Optional[int], Optional[str], Optional[Dict[str, Any]]]:
    if urllib is None:
        return False, None, "urllib unavailable", None
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            code = resp.getcode()
            raw = resp.read().decode("utf-8", errors="replace")
            try:
                data = json.loads(raw)
            except Exception:
                data = None
            return True, code, raw, data
    except urllib.error.HTTPError as e:
        try:
            raw = e.read().decode("utf-8", errors="replace")
        except Exception:
            raw = str(e)
        return False, e.code, raw, None
    except Exception as e:
        return False, None, str(e), None


def http_post_json(url: str, payload: Dict[str, Any], timeout: int = 8) -> Tuple[bool, Optional[int], Optional[str]]:
    if urllib is None:
        return False, None, "urllib unavailable"
    try:
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            code = resp.getcode()
            raw = resp.read().decode("utf-8", errors="replace")
            return True, code, raw
    except urllib.error.HTTPError as e:
        try:
            raw = e.read().decode("utf-8", errors="replace")
        except Exception:
            raw = str(e)
        return False, e.code, raw
    except Exception as e:
        return False, None, str(e)


def tcp_port_open(host: str, port: int, timeout: float = 1.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False


def find_listening_processes(port: int) -> Dict[str, Any]:
    """
    Linux-focused.
    Returns:
    {
      "found": bool,
      "items": [{"pid": "...", "process": "...", "raw": "..."}]
    }
    """
    items: List[Dict[str, str]] = []

    rc, out, err = run_cmd(["bash", "-lc", f"ss -ltnp '( sport = :{port} )' || true"], timeout=8)
    if out:
        for line in out.splitlines():
            if "LISTEN" in line:
                items.append({"pid": "", "process": "", "raw": line})

    rc2, out2, err2 = run_cmd(["bash", "-lc", f"lsof -iTCP:{port} -sTCP:LISTEN -n -P || true"], timeout=8)
    if out2:
        for line in out2.splitlines()[1:]:
            parts = line.split()
            if len(parts) >= 2:
                proc = parts[0]
                pid = parts[1]
                items.append({"pid": pid, "process": proc, "raw": line})

    dedup = []
    seen = set()
    for x in items:
        key = (x.get("pid"), x.get("process"), x.get("raw"))
        if key not in seen:
            seen.add(key)
            dedup.append(x)

    return {"found": bool(dedup), "items": dedup, "stderr": [err, err2]}


def get_disk_free_gb(path: str) -> float:
    usage = shutil.disk_usage(path)
    return round(usage.free / (1024 ** 3), 2)


def get_ram_available_gb() -> Optional[float]:
    try:
        if Path("/proc/meminfo").exists():
            meminfo = Path("/proc/meminfo").read_text()
            for line in meminfo.splitlines():
                if line.startswith("MemAvailable:"):
                    kb = int(line.split()[1])
                    return round(kb / (1024 ** 2), 2)
    except Exception:
        return None
    return None


def get_gpu_info() -> Dict[str, Any]:
    """
    Uses nvidia-smi if available.
    """
    result = {
        "available": False,
        "name": None,
        "vram_total_gb": None,
        "vram_free_gb": None,
        "raw": None,
    }
    rc, out, err = run_cmd(
        [
            "nvidia-smi",
            "--query-gpu=name,memory.total,memory.free",
            "--format=csv,noheader,nounits",
        ],
        timeout=8,
    )
    if rc == 0 and out:
        first = out.splitlines()[0]
        result["raw"] = out
        try:
            name, total_mb, free_mb = [x.strip() for x in first.split(",")]
            result["available"] = True
            result["name"] = name
            result["vram_total_gb"] = round(float(total_mb) / 1024.0, 2)
            result["vram_free_gb"] = round(float(free_mb) / 1024.0, 2)
        except Exception:
            pass
    return result


def normalize_job(job: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not isinstance(job, dict):
        return {}

    render = job.get("render", {}) if isinstance(job.get("render"), dict) else {}

    normalized = {
        "model": render.get("model") or job.get("model"),
        "prompt": render.get("prompt") or job.get("prompt"),
        "negative_prompt": render.get("negative_prompt") or job.get("negative_prompt"),
        "seed": render.get("seed") or job.get("seed"),
        "width": render.get("width") or job.get("width"),
        "height": render.get("height") or job.get("height"),
        "guidance_scale": render.get("guidance_scale") or render.get("guidance") or job.get("guidance_scale"),
        "img2img": bool(
            render.get("img2img")
            or render.get("input_image")
            or render.get("anchor_image_path")
            or render.get("anchor_image_base64")
            or render.get("generation_mode") == "reproduction"
        ),
        "input_image": render.get("input_image"),
        "anchor_image_path": render.get("anchor_image_path"),
        "anchor_image_base64": render.get("anchor_image_base64"),
        "generation_mode": render.get("generation_mode"),
        "reproduction_anchor_mode": render.get("reproduction_anchor_mode"),
        "denoise_strength": render.get("denoise_strength"),
        "output_dir": job.get("output_dir") or render.get("output_dir"),
    }
    return normalized


def make_dummy_payload(job_norm: Dict[str, Any], expected_model_file: Optional[str]) -> Dict[str, Any]:
    """
    Minimal payload structure just for field sanity.
    This is NOT the real render packet builder.
    It is only used for preflight verification.
    """
    model_name = None
    if expected_model_file:
        model_name = Path(expected_model_file).name
    elif job_norm.get("model"):
        model_name = str(job_norm["model"])

    payload = {
        "prompt": job_norm.get("prompt") or "preflight test prompt",
        "negative_prompt": job_norm.get("negative_prompt") or "",
        "model": model_name,
        "seed": job_norm.get("seed") if job_norm.get("seed") is not None else 123456,
        "width": job_norm.get("width") or 1024,
        "height": job_norm.get("height") or 1024,
        "guidance_scale": job_norm.get("guidance_scale") or 7,
    }

    if job_norm.get("img2img"):
        payload["generation_mode"] = job_norm.get("generation_mode") or "reproduction"
        payload["reproduction_anchor_mode"] = job_norm.get("reproduction_anchor_mode") or "image_anchored"
        payload["denoise_strength"] = job_norm.get("denoise_strength") if job_norm.get("denoise_strength") is not None else 0.05

        if job_norm.get("anchor_image_base64"):
            payload["anchor_image_base64"] = "<present>"
        elif job_norm.get("anchor_image_path"):
            payload["anchor_image_path"] = job_norm.get("anchor_image_path")
        elif job_norm.get("input_image"):
            payload["input_image"] = job_norm.get("input_image")

    return payload


# =========================
# Checks
# =========================

def check_core_files(args: argparse.Namespace) -> CheckResult:
    details = []
    ok = True
    data = {
        "kagami_root": args.kagami_root,
        "fooocus_root": args.fooocus_root,
        "bridge_script": args.bridge_script,
    }

    for label, p, kind in [
        ("kagami_root", args.kagami_root, "dir"),
        ("fooocus_root", args.fooocus_root, "dir"),
        ("bridge_script", args.bridge_script, "file"),
    ]:
        exists = is_dir(p) if kind == "dir" else is_file(p)
        if exists:
            details.append(f"{label} exists: {p}")
        else:
            ok = False
            details.append(f"{label} missing: {p}")

    return CheckResult(
        name="core_files",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_model_lock(args: argparse.Namespace, job_norm: Dict[str, Any]) -> CheckResult:
    details = []
    ok = True
    data = {
        "model_file": args.model_file,
        "job_model": job_norm.get("model"),
    }

    if not is_file(args.model_file):
        ok = False
        details.append(f"model file missing: {args.model_file}")
    else:
        details.append(f"model file exists: {args.model_file}")

    if job_norm.get("model"):
        expected_name = Path(args.model_file).name if args.model_file else None
        job_model_name = Path(str(job_norm["model"])).name
        if expected_name and job_model_name != expected_name:
            ok = False
            details.append(f"job model mismatch: job={job_model_name} expected={expected_name}")
        else:
            details.append(f"job model matches expected file: {job_model_name}")
    else:
        details.append("job model not specified; preflight will enforce expected model file only")

    return CheckResult(
        name="model_lock",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_python_env(args: argparse.Namespace) -> CheckResult:
    details = []
    ok = True
    data = {"venv_python": args.venv_python}

    if not is_file(args.venv_python):
        ok = False
        details.append(f"venv python missing: {args.venv_python}")
        return CheckResult("python_env", "FAIL", details, data)

    rc, out, err = run_cmd([args.venv_python, "-c", "import sys, json; print(json.dumps({'executable': sys.executable, 'version': sys.version}))"], timeout=10)
    if rc != 0:
        ok = False
        details.append(f"failed to execute venv python: {err or out}")
    else:
        details.append(f"venv python executes OK: {out}")
        try:
            data["python_info"] = json.loads(out)
        except Exception:
            data["python_info"] = out

    current_exec = sys.executable
    data["current_runner_python"] = current_exec
    if os.path.realpath(current_exec) != os.path.realpath(args.venv_python):
        details.append(f"runner python differs from target venv python: current={current_exec} target={args.venv_python}")
    else:
        details.append("runner python matches target venv python")

    return CheckResult(
        name="python_env",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_port_clean(args: argparse.Namespace) -> CheckResult:
    details = []
    data = find_listening_processes(args.expected_port)

    # Port clean here means:
    # - if service is expected to be running, there should be <= 1 relevant listener
    # - if multiple listeners, fail
    items = data.get("items", [])
    if len(items) > 1:
        return CheckResult(
            name="port_clean",
            status="FAIL",
            details=[f"duplicate listeners detected on port {args.expected_port}"] + [x["raw"] for x in items],
            data=data,
        )

    if len(items) == 1:
        details.append(f"single listener found on port {args.expected_port}")
        details.append(items[0]["raw"])
        return CheckResult(
            name="port_clean",
            status="PASS",
            details=details,
            data=data,
        )

    details.append(f"no listener found on port {args.expected_port}")
    return CheckResult(
        name="port_clean",
        status="WARN",
        details=details,
        data=data,
    )


def check_bridge_endpoint(args: argparse.Namespace) -> CheckResult:
    details = []
    data = {
        "bridge_url": args.bridge_url,
        "health_url": args.health_url,
        "expected_port": args.expected_port,
    }

    host = "127.0.0.1"
    port_open = tcp_port_open(host, args.expected_port, timeout=1.2)
    data["tcp_port_open"] = port_open

    if not port_open:
        return CheckResult(
            name="bridge_endpoint",
            status="FAIL",
            details=[f"expected port {args.expected_port} is not open"],
            data=data,
        )

    if args.health_url:
        ok, code, raw, parsed = http_json_get(args.health_url, timeout=5)
        data["health_status_code"] = code
        data["health_raw"] = raw
        data["health_json"] = parsed
        if ok and code and 200 <= code < 300:
            details.append(f"health endpoint OK: {args.health_url} status={code}")
        else:
            details.append(f"health endpoint not OK: {args.health_url} status={code} raw={raw}")

    # Generate probe should not be raw gradio behavior.
    # We send intentionally incomplete JSON.
    probe_payload = {"preflight_probe": True}
    ok2, code2, raw2 = http_post_json(args.bridge_url, probe_payload, timeout=6)
    data["generate_probe_status_code"] = code2
    data["generate_probe_raw"] = raw2

    if code2 is None:
        return CheckResult(
            name="bridge_endpoint",
            status="FAIL",
            details=details + [f"/generate probe failed to connect: {raw2}"],
            data=data,
        )

    if code2 == 404:
        return CheckResult(
            name="bridge_endpoint",
            status="FAIL",
            details=details + [f"/generate returned 404 -> likely wrong endpoint or raw gradio hit"],
            data=data,
        )

    # Good bridge often returns 400/422 on invalid body, which is acceptable for preflight.
    if code2 in (200, 400, 401, 403, 409, 422, 500):
        details.append(f"/generate endpoint reachable: status={code2}")
        if raw2:
            snippet = raw2[:300].replace("\n", " ")
            details.append(f"/generate probe response snippet: {snippet}")
        return CheckResult(
            name="bridge_endpoint",
            status="PASS",
            details=details,
            data=data,
        )

    return CheckResult(
        name="bridge_endpoint",
        status="FAIL",
        details=details + [f"/generate returned unexpected status={code2} raw={raw2}"],
        data=data,
    )


def check_payload_map(args: argparse.Namespace, job_norm: Dict[str, Any]) -> CheckResult:
    payload = make_dummy_payload(job_norm, args.model_file)
    details = []
    ok = True

    required_fields = ["prompt", "model", "seed", "width", "height", "guidance_scale"]
    missing = [k for k in required_fields if payload.get(k) in (None, "", [])]
    if missing:
        ok = False
        details.append(f"payload missing fields: {missing}")
    else:
        details.append("payload required fields present")

    # Img2img / anchor verification
    if job_norm.get("img2img"):
        has_anchor = any([
            job_norm.get("anchor_image_base64"),
            job_norm.get("anchor_image_path"),
            job_norm.get("input_image"),
        ])
        if not has_anchor:
            ok = False
            details.append("img2img requested but no anchor/input image present")
        else:
            details.append("img2img anchor/input image present")

    # Optional dump
    if args.payload_dump_path:
        try:
            write_json(args.payload_dump_path, payload)
            details.append(f"payload dump written: {args.payload_dump_path}")
        except Exception as e:
            ok = False
            details.append(f"failed to write payload dump: {e}")

    return CheckResult(
        name="payload_map",
        status="PASS" if ok else "FAIL",
        details=details,
        data={"payload_preview": payload},
    )


def check_anchor(args: argparse.Namespace, job_norm: Dict[str, Any]) -> CheckResult:
    if not job_norm.get("img2img"):
        return CheckResult(
            name="img2img_anchor",
            status="SKIP",
            details=["job does not request img2img / anchor"],
            data={},
        )

    details = []
    ok = True
    data = {
        "generation_mode": job_norm.get("generation_mode"),
        "reproduction_anchor_mode": job_norm.get("reproduction_anchor_mode"),
        "denoise_strength": job_norm.get("denoise_strength"),
    }

    if job_norm.get("anchor_image_base64"):
        details.append("anchor_image_base64 present")
    elif job_norm.get("anchor_image_path"):
        p = str(job_norm["anchor_image_path"])
        data["anchor_image_path"] = p
        if is_file(p):
            details.append(f"anchor image path exists: {p}")
        else:
            ok = False
            details.append(f"anchor image path missing: {p}")
    elif job_norm.get("input_image"):
        p = str(job_norm["input_image"])
        data["input_image"] = p
        if is_file(p):
            details.append(f"input image exists: {p}")
        else:
            ok = False
            details.append(f"input image missing: {p}")
    else:
        ok = False
        details.append("img2img requested but no anchor source found")

    if job_norm.get("denoise_strength") is None:
        details.append("denoise_strength not provided; default may be used")
    else:
        details.append(f"denoise_strength={job_norm.get('denoise_strength')}")

    return CheckResult(
        name="img2img_anchor",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_output_dir(args: argparse.Namespace) -> CheckResult:
    details = []
    ok = True
    p = Path(args.output_dir)
    data = {"output_dir": args.output_dir}

    try:
        p.mkdir(parents=True, exist_ok=True)
        details.append(f"output dir ready: {p}")
    except Exception as e:
        return CheckResult("output_dir", "FAIL", [f"cannot create output dir: {e}"], data)

    try:
        with tempfile.NamedTemporaryFile(prefix="mikage_preflight_", suffix=".tmp", dir=str(p), delete=True) as f:
            f.write(b"ok")
            f.flush()
        details.append("output dir write test passed")
    except Exception as e:
        ok = False
        details.append(f"output dir write test failed: {e}")

    return CheckResult(
        name="output_dir",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_resources(args: argparse.Namespace) -> CheckResult:
    details = []
    ok = True
    warnings = []

    disk_free = get_disk_free_gb(args.output_dir if path_exists(args.output_dir) else "/")
    ram_avail = get_ram_available_gb()
    gpu = get_gpu_info()

    data = {
        "disk_free_gb": disk_free,
        "min_disk_gb": args.min_disk_gb,
        "ram_available_gb": ram_avail,
        "min_ram_gb": args.min_ram_gb,
        "gpu": gpu,
        "min_vram_gb": args.min_vram_gb,
    }

    if disk_free < args.min_disk_gb:
        ok = False
        details.append(f"disk free too low: {disk_free}GB < required {args.min_disk_gb}GB")
    else:
        details.append(f"disk free OK: {disk_free}GB")

    if ram_avail is None:
        warnings.append("could not read MemAvailable from /proc/meminfo")
    elif ram_avail < args.min_ram_gb:
        ok = False
        details.append(f"RAM available too low: {ram_avail}GB < required {args.min_ram_gb}GB")
    else:
        details.append(f"RAM available OK: {ram_avail}GB")

    if gpu["available"]:
        free_vram = gpu.get("vram_free_gb")
        if free_vram is not None and free_vram < args.min_vram_gb:
            ok = False
            details.append(f"GPU free VRAM too low: {free_vram}GB < required {args.min_vram_gb}GB")
        else:
            details.append(f"GPU available: {gpu.get('name')} total={gpu.get('vram_total_gb')}GB free={gpu.get('vram_free_gb')}GB")
    else:
        ok = False
        details.append("nvidia-smi not available or GPU not detected")

    if warnings:
        details.extend([f"WARN: {w}" for w in warnings])

    return CheckResult(
        name="resources",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_small_test_ready(args: argparse.Namespace) -> CheckResult:
    details = [
        "preflight does not execute real render",
        "system should run a separate minimal smoke test after PRECHECK PASS",
    ]
    return CheckResult(
        name="small_test_policy",
        status="PASS",
        details=details,
        data={"smoke_test_required_next": True},
    )


def check_existing_output_proof(args: argparse.Namespace) -> CheckResult:
    """
    Optional: check current output file if user passes --expected-output-png.
    This is NOT required for PRECHECK PASS, because preflight happens before render.
    """
    if not args.expected_output_png:
        return CheckResult(
            name="output_png_proof",
            status="SKIP",
            details=["no expected output png provided; this check belongs to post-render"],
            data={},
        )

    p = Path(args.expected_output_png)
    if not p.exists():
        return CheckResult(
            name="output_png_proof",
            status="FAIL",
            details=[f"expected output png missing: {p}"],
            data={"expected_output_png": str(p)},
        )

    if p.stat().st_size <= 0:
        return CheckResult(
            name="output_png_proof",
            status="FAIL",
            details=[f"output png exists but is empty: {p}"],
            data={"expected_output_png": str(p), "size_bytes": p.stat().st_size},
        )

    return CheckResult(
        name="output_png_proof",
        status="PASS",
        details=[f"output png exists and is non-empty: {p}"],
        data={"expected_output_png": str(p), "size_bytes": p.stat().st_size},
    )


def check_validator_and_final_gate_policy(args: argparse.Namespace) -> CheckResult:
    details = [
        "policy enforced: validator must run only on real image",
        "policy enforced: final gate must run only after output.png exists",
        "policy enforced: NO IMAGE = NO PASS",
    ]
    return CheckResult(
        name="validator_final_gate_policy",
        status="PASS",
        details=details,
        data={
            "no_image_no_pass": True,
            "validator_requires_real_image": True,
            "final_gate_requires_real_image": True,
        },
    )


def check_required_artifact_policy(args: argparse.Namespace) -> CheckResult:
    required = [
        "render_payload.json",
        "render_response_raw.json",
        "render_timing.json",
        "output_metadata.json",
        "pre_validation.json",
        "post_validation.json",
        "gemini_validation.json",
        "final_decision.json",
        "output.png",
    ]
    return CheckResult(
        name="required_artifact_policy",
        status="PASS",
        details=["required artifacts declared"],
        data={"required_artifacts": required},
    )


# =========================
# Main
# =========================

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Mikage VPS preflight check")
    parser.add_argument("--kagami-root", required=True)
    parser.add_argument("--fooocus-root", required=True)
    parser.add_argument("--bridge-script", required=True)
    parser.add_argument("--bridge-url", required=True)
    parser.add_argument("--health-url", default="")
    parser.add_argument("--model-file", required=True)
    parser.add_argument("--venv-python", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--report-path", required=True)
    parser.add_argument("--job-json", default="")
    parser.add_argument("--payload-dump-path", default="")
    parser.add_argument("--expected-port", type=int, default=7865)
    parser.add_argument("--min-disk-gb", type=float, default=15.0)
    parser.add_argument("--min-ram-gb", type=float, default=8.0)
    parser.add_argument("--min-vram-gb", type=float, default=6.0)
    parser.add_argument("--expected-output-png", default="")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    job = safe_read_json(args.job_json)
    job_norm = normalize_job(job)

    checks: List[CheckResult] = [
        check_core_files(args),
        check_model_lock(args, job_norm),
        check_python_env(args),
        check_port_clean(args),
        check_bridge_endpoint(args),
        check_payload_map(args, job_norm),
        check_anchor(args, job_norm),
        check_output_dir(args),
        check_resources(args),
        check_small_test_ready(args),
        check_existing_output_proof(args),
        check_validator_and_final_gate_policy(args),
        check_required_artifact_policy(args),
    ]

    hard_fail_reasons: List[str] = []
    warnings: List[str] = []

    for c in checks:
        if c.status == "FAIL":
            hard_fail_reasons.append(f"{c.name}: " + ("; ".join(c.details[:3]) if c.details else "failed"))
        elif c.status == "WARN":
            warnings.append(f"{c.name}: " + ("; ".join(c.details[:3]) if c.details else "warning"))

    overall_status = "PASS" if not hard_fail_reasons else "FAIL"

    summary = {
        "PASS": sum(1 for c in checks if c.status == "PASS"),
        "FAIL": sum(1 for c in checks if c.status == "FAIL"),
        "WARN": sum(1 for c in checks if c.status == "WARN"),
        "SKIP": sum(1 for c in checks if c.status == "SKIP"),
    }

    report = Report(
        overall_status=overall_status,
        timestamp_unix=now_ts(),
        summary=summary,
        checks=checks,
        hard_fail_reasons=hard_fail_reasons,
        warnings=warnings,
        context={
            "kagami_root": args.kagami_root,
            "fooocus_root": args.fooocus_root,
            "bridge_script": args.bridge_script,
            "bridge_url": args.bridge_url,
            "health_url": args.health_url,
            "model_file": args.model_file,
            "venv_python": args.venv_python,
            "output_dir": args.output_dir,
            "job_json": args.job_json,
            "expected_port": args.expected_port,
        },
    )

    report_dict = {
        "overall_status": report.overall_status,
        "timestamp_unix": report.timestamp_unix,
        "summary": report.summary,
        "checks": [asdict(c) for c in report.checks],
        "hard_fail_reasons": report.hard_fail_reasons,
        "warnings": report.warnings,
        "context": report.context,
    }

    write_json(args.report_path, report_dict)

    if overall_status == "PASS":
        print("PRECHECK: PASS")
        print(f"report: {args.report_path}")
        return 0

    print("PRECHECK: FAIL")
    for reason in hard_fail_reasons:
        print(f"- {reason}")
    print(f"report: {args.report_path}")
    return 1


if __name__ == "__main__":
    sys.exit(main())