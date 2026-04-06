"""
MIKAGE PIPELINE — gemini_gate.py v2
Lane-aware Gemini vision final gate.
"""

import json
import base64
import logging
import requests
from pathlib import Path

from .config import get_gemini_key, GEMINI_VISION_MODEL
from .canon_rules import build_canon_checklist_prompt, HARD_FAIL_CODES

log = logging.getLogger("mikage.gemini_gate")


def final_gate(image_path: str, pixel_report: dict, job_dir: Path, lane: str = "mask") -> dict:
    path = Path(image_path)
    if not path.exists():
        return {
            "source_of_truth": "gemini",
            "gemini_executed": False, "gemini_validation_executed": False,
            "parse_ok": False, "pass_fail": "FAIL", "final_decision": "REJECT",
            "error": f"Image not found: {image_path}", "errors": [f"Image not found: {image_path}"],
        }

    image_bytes = path.read_bytes()
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    suffix = path.suffix.lower()
    mime_map = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
    mime_type = mime_map.get(suffix, "image/png")

    canon_checklist = build_canon_checklist_prompt(lane=lane)

    pixel_summary = ""
    if pixel_report and "error" not in pixel_report:
        pixel_summary = f"""
Pixel analysis (automated):
- crimson_ratio: {pixel_report.get('crimson_ratio', 'N/A')}
- shadow_ratio: {pixel_report.get('shadow_ratio', 'N/A')}
- mean_luminance: {pixel_report.get('mean_luminance', 'N/A')}
- edge_activity: {pixel_report.get('edge_activity', 'N/A')}
- magenta_neon_spill: {pixel_report.get('magenta_neon_spill', 'N/A')}
"""

    prompt = f"""You are the FINAL GATE for MIKAGE ZENITH visual pipeline.

{canon_checklist}

{pixel_summary}

HARD FAIL codes (instant REJECT): {', '.join(HARD_FAIL_CODES)}

IMPORTANT: Material check (T4) is LANE-DEPENDENT:
- MASK lane: expects ceramic/porcelain
- WEAPON lane: expects dark rusty titanium/ferro-calcium metal (metal IS correct for weapon)
- CHARACTER lane: expects porcelain shell + graphene/titanium joints

Output JSON only. If ANY hard fail code fails, final_decision MUST be REJECT.
Be strict on identity. No drift."""

    key = get_gemini_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_VISION_MODEL}:generateContent?key={key}"

    body = {
        "contents": [{"role": "user", "parts": [
            {"inlineData": {"mimeType": mime_type, "data": image_b64}},
            {"text": prompt},
        ]}],
        "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"},
    }

    log.info(f"Gemini gate: sending image ({len(image_bytes)} bytes), lane={lane}")

    try:
        r = requests.post(url, json=body, timeout=120)

        if r.status_code != 200:
            log.error(f"Gemini HTTP {r.status_code}: {r.text[:300]}")
            _err = f"Gemini HTTP {r.status_code}"
            return {
                "source_of_truth": "gemini",
                "gemini_executed": False, "gemini_validation_executed": False,
                "parse_ok": False, "pass_fail": "FAIL", "final_decision": "REJECT",
                "error": _err, "errors": [_err],
            }

        data = r.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]

        try:
            gate_result = json.loads(text)
            log.info(f"Gemini gate: decision={gate_result.get('final_decision', '?')}")

            gate_path = job_dir / "gemini_gate_report.json"
            gate_path.write_text(json.dumps(gate_result, indent=2))

            result = {
                "gemini_executed": True,
                "gemini_validation_executed": True,   # JS compat alias
                "parse_ok": True,
                "pass_fail": gate_result.get("pass_fail", "FAIL"),
                "final_decision": gate_result.get("final_decision", "REJECT"),
                "hard_fail_count": gate_result.get("hard_fail_count", -1),
                "checks": gate_result.get("checks", []),
                "reasoning": gate_result.get("reasoning", ""),
                "errors": [],
            }
            gate_path.write_text(json.dumps(result, indent=2))
            return result
        except json.JSONDecodeError as e:
            log.error(f"Gemini invalid JSON: {e}")
            return {
                "source_of_truth": "gemini",
                "gemini_executed": True,
                "gemini_validation_executed": True,
                "parse_ok": False,
                "pass_fail": "FAIL",
                "final_decision": "REJECT",
                "error": f"JSON parse: {e}",
                "errors": [f"JSON parse: {e}"],
                "raw_text": text[:500],
            }

    except Exception as e:
        log.error(f"Gemini gate error: {e}")
        return {
            "source_of_truth": "gemini",
            "gemini_executed": False,
            "gemini_validation_executed": False,
            "parse_ok": False,
            "pass_fail": "FAIL",
            "final_decision": "REJECT",
            "error": str(e),
            "errors": [str(e)],
        }
