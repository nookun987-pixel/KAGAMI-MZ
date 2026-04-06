#!/usr/bin/env python3
"""
MIKAGE PREFLIGHT CHECK
Runs before VPS boot / render to validate environment readiness.

Checks:
  - Model file exists and matches config
  - Fooocus path exists
  - Bridge file exists (scripts/fooocus_bridge.py)
  - Python executable path valid
  - Output directory writable
  - Required folders exist (runs/, outputs/)
  - Port plan defined (no missing config)
  - Render entry file exists (render_workflow.py)
  - Config consistency (no hardcoded wrong model)

Output: PASS / FAIL with check list and BLOCKERS
"""

import json
import os
import sys
import tempfile
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import Any, Dict, List, Optional

# Project root = KAGAMI-MZ
PROJECT_ROOT = Path(r"D:\KAGAMI-MZ")
sys.path.insert(0, str(PROJECT_ROOT))


# =============================================================================
# Data models
# =============================================================================

@dataclass
class CheckResult:
    name: str
    status: str  # PASS / FAIL / WARN / SKIP
    details: List[str] = field(default_factory=list)
    data: Dict[str, Any] = field(default_factory=dict)


# =============================================================================
# Helpers
# =============================================================================

def now_iso() -> str:
    from datetime import datetime
    return datetime.now().isoformat()


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


# =============================================================================
# Checks
# =============================================================================

def check_model_file() -> CheckResult:
    """Model file must exist and be listed in config."""
    details = []
    ok = True

    # Try to read model from config
    model_file = None
    config_data = safe_read_json(str(PROJECT_ROOT / "config.txt"))
    if config_data and isinstance(config_data, dict):
        model_file = config_data.get("model_file") or config_data.get("model")
    if not model_file:
        model_file = os.getenv("FOOOCUS_MODEL_FILE", "")

    data = {"configured_model": model_file}

    if not model_file:
        ok = False
        details.append("model_file not found in config.txt or FOOOCUS_MODEL_FILE env")
    elif not Path(model_file).exists():
        ok = False
        details.append(f"model file missing: {model_file}")
    else:
        details.append(f"model file OK: {model_file}")

    return CheckResult(
        name="model_file",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_fooocus_path() -> CheckResult:
    """Fooocus root directory must exist."""
    details = []
    ok = True

    fooocus_root = os.getenv("FOOOCUS_ROOT", str(PROJECT_ROOT.parent / "Fooocus"))
    data = {"fooocus_root": fooocus_root}

    if not Path(fooocus_root).exists():
        ok = False
        details.append(f"Fooocus root missing: {fooocus_root}")
    else:
        details.append(f"Fooocus root OK: {fooocus_root}")

    return CheckResult(
        name="fooocus_path",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_bridge_file() -> CheckResult:
    """scripts/fooocus_bridge.py must exist."""
    details = []
    ok = True

    bridge_path = PROJECT_ROOT / "scripts" / "fooocus_bridge.py"
    data = {"bridge_script": str(bridge_path)}

    if not bridge_path.exists():
        ok = False
        details.append(f"bridge script missing: {bridge_path}")
    else:
        details.append(f"bridge script OK: {bridge_path}")

    return CheckResult(
        name="bridge_file",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_python_executable() -> CheckResult:
    """Python executable path must be valid."""
    details = []
    ok = True

    python_exe = sys.executable
    data = {"python_executable": python_exe}

    if not Path(python_exe).exists():
        ok = False
        details.append(f"python executable missing: {python_exe}")
    else:
        details.append(f"python executable OK: {python_exe}")

    return CheckResult(
        name="python_executable",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_output_dir() -> CheckResult:
    """Output directory must be writable."""
    details = []
    ok = True

    output_dir = os.getenv("MIKAGE_OUTPUT_DIR", str(PROJECT_ROOT / "outputs"))
    data = {"output_dir": output_dir}
    p = Path(output_dir)

    try:
        p.mkdir(parents=True, exist_ok=True)
        details.append(f"output dir ready: {p}")
    except Exception as e:
        ok = False
        details.append(f"cannot create output dir: {e}")
        return CheckResult("output_dir", "FAIL", details, data)

    try:
        with tempfile.NamedTemporaryFile(prefix="preflight_", suffix=".tmp", dir=str(p), delete=True) as f:
            f.write(b"ok")
            f.flush()
        details.append("output dir write test OK")
    except Exception as e:
        ok = False
        details.append(f"output dir write test FAILED: {e}")

    return CheckResult(
        name="output_dir",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_required_folders() -> CheckResult:
    """runs/ and outputs/ must exist."""
    details = []
    ok = True

    required = ["runs", "outputs"]
    data = {"required_folders": required}
    missing = []

    for folder in required:
        folder_path = PROJECT_ROOT / folder
        if not folder_path.exists():
            ok = False
            missing.append(folder)
            details.append(f"missing folder: {folder_path}")
        else:
            details.append(f"folder OK: {folder_path}")

    return CheckResult(
        name="required_folders",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_port_plan() -> CheckResult:
    """Port plan must be defined (no missing config)."""
    details = []
    ok = True

    port = os.getenv("FOOOCUS_PORT", os.getenv("FOOOCUS_API_PORT", "7865"))
    bridge_url = os.getenv("FOOOCUS_BRIDGE_URL", os.getenv("FOOOCUS_API", ""))
    data = {"port": port, "bridge_url": bridge_url}

    if not port:
        ok = False
        details.append("port not defined in FOOOCUS_PORT or FOOOCUS_API_PORT")
    else:
        details.append(f"port defined: {port}")

    if not bridge_url:
        ok = False
        details.append("bridge URL not defined in FOOOCUS_BRIDGE_URL or FOOOCUS_API")
    else:
        details.append(f"bridge URL defined: {bridge_url}")

    return CheckResult(
        name="port_plan",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_render_entry() -> CheckResult:
    """render_workflow.py must exist."""
    details = []
    ok = True

    render_entry = PROJECT_ROOT / "render_workflow.py"
    data = {"render_workflow": str(render_entry)}

    if not render_entry.exists():
        ok = False
        details.append(f"render_workflow.py missing: {render_entry}")
    else:
        details.append(f"render_workflow.py OK: {render_entry}")

    return CheckResult(
        name="render_entry",
        status="PASS" if ok else "FAIL",
        details=details,
        data=data,
    )


def check_config_consistency() -> CheckResult:
    """No hardcoded wrong model in config.txt."""
    details = []
    ok = True

    config_data = safe_read_json(str(PROJECT_ROOT / "config.txt"))
    hardcoded_model = None

    if config_data and isinstance(config_data, dict):
        model_in_config = config_data.get("model_file") or config_data.get("model")
        if model_in_config:
            hardcoded_model = model_in_config
            details.append(f"config model: {model_in_config}")

            # Check if file actually exists
            if not Path(model_in_config).exists():
                ok = False
                details.append(f"HARD ERROR: config references missing model: {model_in_config}")
            else:
                details.append("config model file exists")

    env_model = os.getenv("FOOOCUS_MODEL_FILE", "")
    if env_model:
        details.append(f"env model: {env_model}")
        if hardcoded_model and env_model != hardcoded_model:
            details.append(f"WARNING: env model differs from config model")

    return CheckResult(
        name="config_consistency",
        status="PASS" if ok else "FAIL",
        details=details,
        data={"hardcoded_model": hardcoded_model, "env_model": env_model},
    )


# =============================================================================
# Run all checks
# =============================================================================

def run_all_checks() -> List[CheckResult]:
    return [
        check_model_file(),
        check_fooocus_path(),
        check_bridge_file(),
        check_python_executable(),
        check_output_dir(),
        check_required_folders(),
        check_port_plan(),
        check_render_entry(),
        check_config_consistency(),
    ]


# =============================================================================
# Build report
# =============================================================================

def build_report(checks: List[CheckResult]) -> Dict[str, Any]:
    hard_fail_reasons = []
    warnings = []

    for c in checks:
        if c.status == "FAIL":
            hard_fail_reasons.append(f"{c.name}: " + "; ".join(c.details[:3]))
        elif c.status == "WARN":
            warnings.append(f"{c.name}: " + "; ".join(c.details[:3]))

    overall = "PASS" if not hard_fail_reasons else "FAIL"

    summary = {
        "PASS": sum(1 for c in checks if c.status == "PASS"),
        "FAIL": sum(1 for c in checks if c.status == "FAIL"),
        "WARN": sum(1 for c in checks if c.status == "WARN"),
        "SKIP": sum(1 for c in checks if c.status == "SKIP"),
    }

    report = {
        "overall_status": overall,
        "timestamp": now_iso(),
        "summary": summary,
        "checks": [asdict(c) for c in checks],
        "blockers": hard_fail_reasons,
        "warnings": warnings,
    }

    return report


# =============================================================================
# CLI
# =============================================================================

def main() -> int:
    print("=" * 60)
    print("MIKAGE PREFLIGHT CHECK")
    print("=" * 60)
    print()

    checks = run_all_checks()
    report = build_report(checks)

    # Write JSON report
    report_path = PROJECT_ROOT / "preflight" / "preflight_report.json"
    write_json(str(report_path), report)
    print(f"Report: {report_path}")
    print()

    # Print summary
    print(f"[SUMMARY] PASS={report['summary']['PASS']}  FAIL={report['summary']['FAIL']}  WARN={report['summary']['WARN']}  SKIP={report['summary']['SKIP']}")
    print()

    # Print individual checks
    for c in checks:
        symbol = {"PASS": "✓", "FAIL": "✗", "WARN": "!", "SKIP": "-"}.get(c.status, "?")
        print(f"  [{symbol}] {c.name}: {c.status}")
        for detail in c.details:
            print(f"        {detail}")
    print()

    # Print blockers
    if report["blockers"]:
        print("BLOCKERS:")
        for b in report["blockers"]:
            print(f"  • {b}")
        print()

    # Final verdict
    print("=" * 60)
    if report["overall_status"] == "PASS":
        print("RESULT: PASS  — Ready to boot")
    else:
        print("RESULT: FAIL  — Blocked")
    print("=" * 60)

    return 0 if report["overall_status"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
