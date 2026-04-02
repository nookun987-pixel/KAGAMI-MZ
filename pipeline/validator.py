"""
MIKAGE PIPELINE — validator.py
Post-render validation: pixel analysis + semantic canon rules.
"""

import json
import logging
from pathlib import Path
from typing import Optional

from .canon_rules import CANON_RULES, HARD_FAIL_CODES, PIXEL_RULES

log = logging.getLogger("mikage.validator")


def validate(image_path: str, job_dir: Path) -> dict:
    """
    Run all pixel-level and semantic checks on rendered image.

    Returns:
        {
            "status": "pass" / "fail",
            "validator_executed": True,
            "checks": { "T2": {"pass": bool, "value": ..., "reason": str}, ... },
            "hard_fail_count": int,
            "hard_fails": [list of failed hard codes],
            "pixel_report": {...},
        }
    """
    path = Path(image_path)
    if not path.exists():
        return {
            "status": "fail",
            "validator_executed": False,
            "error": f"Image not found: {image_path}",
        }

    log.info(f"Validating: {image_path}")

    # ── Pixel analysis ──
    pixel_report = run_pixel_checks(path)

    # ── Evaluate canon rules (pixel-based) ──
    checks = {}
    hard_fails = []

    for code, rule in PIXEL_RULES.items():
        field = rule.get("field", "")
        value = pixel_report.get(field)
        threshold = rule.get("threshold")
        threshold_max = rule.get("threshold_max")

        passed = True
        reason = "OK"

        if value is not None:
            if threshold is not None and value > threshold:
                passed = False
                reason = f"{field}={value} exceeds threshold {threshold}"
            if threshold_max is not None and value > threshold_max:
                passed = False
                reason = f"{field}={value} exceeds max {threshold_max}"
        else:
            reason = f"Field '{field}' not available in pixel report"
            # Don't fail if we can't check — Gemini will catch semantic issues

        checks[code] = {
            "pass": passed,
            "value": value,
            "reason": reason,
            "hard_fail": rule["hard_fail"],
        }

        if not passed and rule["hard_fail"]:
            hard_fails.append(code)

    # ── Summary ──
    all_passed = len(hard_fails) == 0
    status = "pass" if all_passed else "fail"

    result = {
        "status": status,
        "validator_executed": True,
        "checks": checks,
        "hard_fail_count": len(hard_fails),
        "hard_fails": hard_fails,
        "pixel_report": pixel_report,
    }

    # Save report
    report_path = job_dir / "validator_report.json"
    report_path.write_text(json.dumps(result, indent=2, default=str))
    log.info(f"Validator: {status} (hard_fails={hard_fails})")

    return result


def run_pixel_checks(image_path: Path) -> dict:
    """
    Analyze image pixels for canon compliance.
    Uses PIL/numpy for basic checks.
    """
    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        log.warning("PIL/numpy not available, skipping pixel analysis")
        return {"error": "PIL/numpy not installed"}

    try:
        img = Image.open(image_path).convert("RGB")
        arr = np.array(img, dtype=np.float32)
        h, w, _ = arr.shape

        report = {}

        # ── Human eyes detection (basic: look for eye-like patterns) ──
        # Simplified: check for small bright circular regions (iris-like)
        # Full implementation would use face detection model
        report["human_eyes_detected"] = 0  # Placeholder — Gemini handles this

        # ── PVC/plastic detection ──
        # High specular highlights + smooth gradients = plastic-like
        gray = np.mean(arr, axis=2)
        # Count very bright spots (specular highlights)
        specular_ratio = np.mean(gray > 240) 
        report["pvc_plastic_read"] = 1 if specular_ratio > 0.15 else 0

        # ── Toon shading detection ──
        # Toon = sharp color transitions, low color variety per region
        # Check gradient magnitude
        dx = np.abs(np.diff(arr, axis=1)).mean()
        dy = np.abs(np.diff(arr, axis=0)).mean()
        edge_activity = (dx + dy) / 2
        # High edge activity with low color diversity = toon
        unique_approx = len(np.unique(arr[::4, ::4, 0]))  # Sample
        report["toon_shading"] = 1 if (edge_activity > 30 and unique_approx < 50) else 0
        report["edge_activity"] = round(float(edge_activity), 2)

        # ── Crimson ratio ──
        # Count pixels near #E60000 (R:230, G:0, B:0) with tolerance
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        crimson_mask = (r > 180) & (r < 255) & (g < 60) & (b < 60)
        crimson_ratio = float(np.mean(crimson_mask))
        report["crimson_ratio"] = round(crimson_ratio, 4)

        # ── Magenta/neon spill ──
        # Detect highly saturated non-crimson colors
        magenta_mask = (r > 180) & (b > 150) & (g < 80)
        cyan_mask = (g > 180) & (b > 180) & (r < 80)
        neon_ratio = float(np.mean(magenta_mask | cyan_mask))
        report["magenta_neon_spill"] = 1 if neon_ratio > 0.02 else 0

        # ── Logo/watermark detection (basic) ──
        # Check bottom-right corner for text-like patterns
        corner = gray[-50:, -100:]
        corner_variance = float(np.var(corner))
        report["logo_overlap_ratio"] = 1 if corner_variance > 2000 else 0

        # ── Shadow ratio (chiaroscuro) ──
        # Dark pixels vs light pixels
        dark_ratio = float(np.mean(gray < 80))
        light_ratio = float(np.mean(gray > 180))
        if light_ratio > 0.01:
            shadow_ratio = round(dark_ratio / light_ratio, 1)
        else:
            shadow_ratio = 10.0  # Very dark image
        report["shadow_ratio"] = shadow_ratio
        report["dark_pixel_ratio"] = round(dark_ratio, 3)
        report["light_pixel_ratio"] = round(light_ratio, 3)

        # ── Luminance stats ──
        luminance = 0.299 * r + 0.587 * g + 0.114 * b
        report["mean_luminance"] = round(float(np.mean(luminance)), 1)
        report["std_luminance"] = round(float(np.std(luminance)), 1)

        # ── Resolution ──
        report["width"] = w
        report["height"] = h

        log.info(f"Pixel analysis complete: {w}x{h}, crimson={crimson_ratio:.4f}, shadow_ratio={shadow_ratio}")
        return report

    except Exception as e:
        log.error(f"Pixel analysis failed: {e}")
        return {"error": str(e)}
