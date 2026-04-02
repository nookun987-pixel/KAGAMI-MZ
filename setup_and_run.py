"""
MIKAGE ZENITH — setup_and_run.py
================================
1 file, 1 lenh, tu dong:
  - Cai dependencies
  - Chay full E2E pipeline

Chay:
    cd D:\KAGAMI-MZ
    python setup_and_run.py
"""

import subprocess
import sys
import os

# ── Step 0: Cai dependencies ──
print("\n[SETUP] Installing dependencies...")
deps = ["python-dotenv", "Pillow", "numpy", "requests"]
for dep in deps:
    subprocess.run([sys.executable, "-m", "pip", "install", dep, "-q"], check=False)
print("[SETUP] Dependencies OK\n")

# ── Step 1: Chay pipeline ──
print("[RUN] Starting full pipeline...\n")
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from pipeline.orchestrator import run_pipeline

brief = "porcelain kitsune mask, thin crimson seam at jawline, obsidian void background, chiaroscuro dramatic shadow, industrial precision"

result = run_pipeline(brief)

# ── Step 2: Report ──
import json
from pathlib import Path

job_dir = Path(result["job_dir"])
output_png = job_dir / "output.png"

print(f"\n{'='*50}")
print(f"  MIKAGE PIPELINE - FINAL REPORT")
print(f"{'='*50}")
print(f"  run folder:                  {job_dir}")
print(f"  output.png exists:           {output_png.exists()}")
print(f"  output.png absolute path:    {output_png.resolve() if output_png.exists() else 'N/A'}")

val = result.get("stages", {}).get("validator", {})
print(f"  post_validation.status:      {val.get('status', 'N/A')}")

gate = result.get("stages", {}).get("gemini_gate", {})
print(f"  gemini_validation.executed:  {gate.get('gemini_executed', 'N/A')}")
print(f"  gemini_validation.parse_ok:  {gate.get('parse_ok', 'N/A')}")
print(f"  gemini_validation.pass_fail: {gate.get('pass_fail', 'N/A')}")

print(f"  final_decision:              {result.get('final_decision', 'N/A')}")
print(f"  reject/block reason:         {result.get('reject_reason', 'none')}")
print(f"  total_duration:              {result.get('total_duration', 'N/A')}s")
print(f"{'='*50}")
