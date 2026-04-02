#!/usr/bin/env python3
"""
MIKAGE — Minimal E2E Render Test
Bypasses Gemini/Claude stages. Sends a prompt directly to Bridge /generate.
Use this to verify the Bridge → Fooocus → PNG path works before running full pipeline.

Usage:
  source /workspace/venv/bin/activate
  cd /workspace/KAGAMI-MZ
  python deploy/test_e2e_render.py
"""

import os
import sys
import json
import time
import requests
from pathlib import Path

BRIDGE_URL = os.getenv("FOOOCUS_API") or os.getenv("FOOOCUS_API_URL") or "http://127.0.0.1:7865"
OUTPUT_DIR = Path(os.getenv("RUNS_ROOT", "runs")) / "e2e_test"

def main():
    print("=" * 60)
    print("MIKAGE E2E RENDER TEST (bridge-only)")
    print("=" * 60)

    # 1. Check bridge is alive
    print(f"\n[1] Checking bridge at {BRIDGE_URL}/ ...")
    try:
        r = requests.get(f"{BRIDGE_URL}/", timeout=10)
        info = r.json()
        print(f"    Bridge status: {info.get('status', '?')}")
        print(f"    Output dir:    {info.get('output_dir', '?')}")
    except Exception as e:
        print(f"    FAIL: Bridge not reachable — {e}")
        print(f"    Is fooocus_bridge.py running? Check: tmux attach -t mikage-bridge")
        sys.exit(1)

    # 2. Send minimal render request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "prompt": "white porcelain kitsune mask, matte ceramic surface, thin crimson seam at jawline, dark background, dramatic chiaroscuro lighting, studio photography, 8k",
        "negative_prompt": "human eyes, glossy, plastic, neon, cartoon, blurry, watermark",
        "image_number": 1,
        "seed": 42,
        "guidance_scale": 7.0,
        "sharpness": 2.0,
        "performance_selection": "Speed",
        "width": 1024,
        "height": 1024,
        "style_selections": [],
    }

    print(f"\n[2] Sending render request to {BRIDGE_URL}/generate ...")
    print(f"    Prompt: {payload['prompt'][:80]}...")
    print(f"    Performance: {payload['performance_selection']} (fast for test)")

    t0 = time.time()
    try:
        resp = requests.post(f"{BRIDGE_URL}/generate", json=payload, timeout=600)
    except requests.Timeout:
        print(f"    FAIL: Render timed out after 600s")
        sys.exit(1)
    except requests.ConnectionError as e:
        print(f"    FAIL: Connection error — {e}")
        sys.exit(1)

    elapsed = time.time() - t0
    print(f"    Response: HTTP {resp.status_code} in {elapsed:.1f}s")

    if resp.status_code != 200:
        print(f"    FAIL: {resp.text[:500]}")
        sys.exit(1)

    result = resp.json()

    # 3. Extract image
    images = result if isinstance(result, list) else result.get("images", result.get("results", []))
    if not images:
        print(f"    FAIL: No images in response")
        print(f"    Response: {json.dumps(result, default=str)[:500]}")
        sys.exit(1)

    first = images[0] if isinstance(images, list) else images
    output_path = OUTPUT_DIR / "test_output.png"

    if isinstance(first, dict) and first.get("base64"):
        import base64
        output_path.write_bytes(base64.b64decode(first["base64"]))
        print(f"\n[3] Image saved (base64): {output_path}")
    elif isinstance(first, dict):
        for key in ("file_path", "path", "url"):
            val = first.get(key)
            if val and Path(val).exists():
                import shutil
                shutil.copy2(val, output_path)
                print(f"\n[3] Image saved (copy from {key}): {output_path}")
                break
        else:
            print(f"    FAIL: Could not extract image file from response")
            print(f"    Keys: {list(first.keys()) if isinstance(first, dict) else type(first)}")
            sys.exit(1)
    else:
        print(f"    FAIL: Unexpected response format: {type(first)}")
        sys.exit(1)

    # 4. Verify
    if output_path.exists() and output_path.stat().st_size > 1000:
        size_kb = output_path.stat().st_size / 1024
        print(f"    Size: {size_kb:.0f} KB")
        print(f"\n{'=' * 60}")
        print(f"E2E RENDER TEST: PASS")
        print(f"  Image: {output_path}")
        print(f"  Time:  {elapsed:.1f}s")
        print(f"{'=' * 60}")

        # Save test report
        report = {
            "status": "PASS",
            "image": str(output_path),
            "size_kb": round(size_kb, 1),
            "elapsed_s": round(elapsed, 1),
            "bridge_url": BRIDGE_URL,
            "payload": payload,
        }
        (OUTPUT_DIR / "test_report.json").write_text(json.dumps(report, indent=2))
    else:
        print(f"    FAIL: Output file missing or too small")
        sys.exit(1)


if __name__ == "__main__":
    main()
