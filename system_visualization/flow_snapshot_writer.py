"""
MIKAGE — Flow Snapshot Writer (Observability Layer)
Reads registry files, checks latest run artifacts and service health,
writes latest_flow_snapshot.json + latest_flow_snapshot.md.

Usage:
    python system_visualization/flow_snapshot_writer.py
"""
from __future__ import annotations

import json
import os
import socket
import sys
import urllib.request
from pathlib import Path
from datetime import datetime
from typing import Any

# ---------------------------------------------------------------------------
# Paths — auto-detect ROOT from script location
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
RUNS_DIR = ROOT / "runs"
VIS_DIR = SCRIPT_DIR

SYSTEM_MAP_PATH = VIS_DIR / "system_map.json"
STAGE_REGISTRY_PATH = VIS_DIR / "stage_registry.json"
SERVICE_REGISTRY_PATH = VIS_DIR / "service_registry.json"

LATEST_JSON_PATH = VIS_DIR / "latest_flow_snapshot.json"
LATEST_MD_PATH = VIS_DIR / "latest_flow_snapshot.md"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def find_latest_run_dir() -> Path | None:
    if not RUNS_DIR.exists():
        return None
    candidates = [p for p in RUNS_DIR.iterdir() if p.is_dir()]
    if not candidates:
        return None
    candidates.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return candidates[0]


def artifact_exists(run_dir: Path, name: str) -> bool:
    return (run_dir / name).exists()


def read_json_if_exists(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {"_parse_error": True}


def check_http(url: str, timeout: float = 2.0) -> dict[str, Any]:
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:
            return {"alive": True, "status_code": resp.getcode()}
    except Exception as e:
        return {"alive": False, "error": str(e)[:300]}


def check_port(port: int, host: str = "127.0.0.1", timeout: float = 1.0) -> bool:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((host, port))
        return True
    except Exception:
        return False
    finally:
        sock.close()


# ---------------------------------------------------------------------------
# Stage resolution
# ---------------------------------------------------------------------------

def resolve_stage_status(run_dir: Path, stage: dict[str, Any]) -> dict[str, Any]:
    outputs = stage.get("output", [])
    existing = [name for name in outputs if artifact_exists(run_dir, name)]

    if len(existing) == len(outputs) and outputs:
        status = "PASS"
    elif existing:
        status = "PARTIAL"
    else:
        status = "MISSING"

    return {
        "id": stage["id"],
        "name": stage["name"],
        "layer": stage["layer"],
        "status": status,
        "expected_outputs": outputs,
        "present_outputs": existing,
    }


# ---------------------------------------------------------------------------
# Build snapshot
# ---------------------------------------------------------------------------

def build_snapshot() -> dict[str, Any]:
    system_map = load_json(SYSTEM_MAP_PATH, {})
    stage_registry = load_json(STAGE_REGISTRY_PATH, {"stages": []})
    service_registry = load_json(SERVICE_REGISTRY_PATH, {"services": []})

    latest_run = find_latest_run_dir()
    latest_run_name = latest_run.name if latest_run else None

    stages_status: list[dict[str, Any]] = []
    final_decision: dict[str, Any] = {}
    gemini_validation: dict[str, Any] = {}
    post_validation: dict[str, Any] = {}

    if latest_run:
        for stage in stage_registry.get("stages", []):
            stages_status.append(resolve_stage_status(latest_run, stage))

        final_decision = read_json_if_exists(latest_run / "final_decision.json")
        gemini_validation = read_json_if_exists(latest_run / "gemini_validation.json")
        post_validation = read_json_if_exists(latest_run / "post_validation.json")

    services_status: list[dict[str, Any]] = []
    for svc in service_registry.get("services", []):
        http_status = check_http(svc["healthcheck"])
        port_open = check_port(int(svc["port"]))
        services_status.append({
            "name": svc["name"],
            "port": svc["port"],
            "port_open": port_open,
            "http_alive": http_status.get("alive", False),
            "http_status_code": http_status.get("status_code"),
            "http_error": http_status.get("error"),
        })

    snapshot = {
        "system_name": system_map.get("system_name", "MIKAGE-MZ"),
        "generated_at": datetime.now().isoformat(),
        "latest_run_id": latest_run_name,
        "layers": system_map.get("layers", []),
        "edges": system_map.get("edges", []),
        "stages_status": stages_status,
        "services_status": services_status,
        "final_decision": final_decision,
        "gemini_validation": gemini_validation,
        "post_validation": post_validation,
    }

    return snapshot


# ---------------------------------------------------------------------------
# Build markdown
# ---------------------------------------------------------------------------

def build_markdown(snapshot: dict[str, Any]) -> str:
    lines: list[str] = []
    lines.append(f"# {snapshot.get('system_name', 'MIKAGE-MZ')} — Latest Flow Snapshot")
    lines.append("")
    lines.append(f"- **Generated at:** {snapshot.get('generated_at')}")
    lines.append(f"- **Latest run:** {snapshot.get('latest_run_id') or 'none'}")
    lines.append("")

    lines.append("## Stage Status")
    lines.append("")
    for item in snapshot.get("stages_status", []):
        outputs = ", ".join(item["present_outputs"]) or "none"
        lines.append(
            f"- **[{item['status']}]** {item['name']} ({item['layer']}) — outputs: {outputs}"
        )
    if not snapshot.get("stages_status"):
        lines.append("- (no runs found)")
    lines.append("")

    lines.append("## Service Status")
    lines.append("")
    for svc in snapshot.get("services_status", []):
        state = "UP" if svc["port_open"] or svc["http_alive"] else "DOWN"
        lines.append(
            f"- **[{state}]** {svc['name']} — port={svc['port']}, "
            f"http_alive={svc['http_alive']}, code={svc['http_status_code']}"
        )
    lines.append("")

    decision = snapshot.get("final_decision", {})
    if decision:
        lines.append("## Final Decision")
        lines.append("")
        lines.append(f"- **decision:** {decision.get('decision', 'N/A')}")
        lines.append(f"- **reason:** {decision.get('reason') or decision.get('summary', 'N/A')}")
        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    VIS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[SNAPSHOT] ROOT: {ROOT}")
    print(f"[SNAPSHOT] RUNS_DIR: {RUNS_DIR}")

    snapshot = build_snapshot()

    LATEST_JSON_PATH.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    LATEST_MD_PATH.write_text(build_markdown(snapshot), encoding="utf-8")

    # Proof output
    print(f"[SNAPSHOT] Latest run detected: {snapshot.get('latest_run_id') or '(none)'}")
    print(f"[SNAPSHOT] Stages resolved: {len(snapshot.get('stages_status', []))}")
    print(f"[SNAPSHOT] Services checked: {len(snapshot.get('services_status', []))}")
    print(f"[SNAPSHOT] Wrote: {LATEST_JSON_PATH}")
    print(f"[SNAPSHOT] Wrote: {LATEST_MD_PATH}")


if __name__ == "__main__":
    main()
