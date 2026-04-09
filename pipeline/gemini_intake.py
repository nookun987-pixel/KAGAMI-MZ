"""
MIKAGE PIPELINE — gemini_intake.py
Gemini parses a creative brief into a structured spec with canon checklist.
"""

import json
import logging
from typing import Optional

from .gemini_call_adapter import call_gemini_with_state, extract_response_text

log = logging.getLogger("mikage.gemini_intake")


def call_gemini(prompt: str, system: str = "", job_id: Optional[str] = None) -> dict:
    """Call Gemini API via stateful adapter. Returns {"text": str, "ok": bool}."""
    contents = [{"role": "user", "parts": [{"text": prompt}]}]
    body = {"contents": contents}
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}
    body["generationConfig"] = {
        "temperature": 0.2,
        "responseMimeType": "application/json",
    }
    result = call_gemini_with_state(body, job_id=job_id, role="intake", timeout=60)
    if not result["ok"]:
        log.error(f"Gemini HTTP {result['http_status']}: {result.get('error', '')}")
    return {
        "text": result["text"] or "",
        "ok": result["ok"],
        "error": result.get("error"),
        "gemini_trace": result.get("gemini_trace"),
    }


def intake(brief: str, job_id: Optional[str] = None) -> dict:
    """
    Parse creative brief through Gemini.
    Returns structured spec or error.
    """
    system_prompt = """You are the intake parser for MIKAGE ZENITH visual pipeline.
Your job: take a creative brief and extract a structured JSON spec.

MIKAGE VISUAL CANON (non-negotiable):
- Subject: engineered entity (porcelain kitsune mask, industrial blade)
- No human eyes, no facial expression
- Material: real ceramic/porcelain (not plastic, not plaster)
- Crimson #E60000 only at seams/core, no bloom
- Background: porcelain #FAFAFA or obsidian #0A0A0A
- Lighting: chiaroscuro ~4:1, shadow dominant
- No neon RGB, no cyberpunk
- No abstract frame, object must be clearly readable
- Negative space, clean composition

Output JSON with these fields:
{
  "subject": "what to render",
  "material": "ceramic/porcelain/metal/concrete",
  "color_accent": "crimson seam description",
  "background": "porcelain or obsidian",
  "lighting": "chiaroscuro description",
  "mood": "low energy, high control",
  "canon_flags": ["list of canon codes that need extra attention"],
  "prompt_seed": "initial prompt suggestion for Fooocus",
  "negative_hints": "things to explicitly avoid",
  "confidence": 0.0-1.0
}

If the brief conflicts with canon, flag it and adjust. Never break canon."""

    user_prompt = f"Creative brief:\n{brief}\n\nParse this into a MIKAGE spec."

    log.info("Gemini intake: parsing brief...")
    result = call_gemini(user_prompt, system=system_prompt, job_id=job_id)

    if not result["ok"]:
        return {
            "status": "fail",
            "error": result.get("error", "Gemini intake failed"),
            "gemini_executed": False,
            "parse_ok": False,
            "gemini_trace": result.get("gemini_trace"),
        }

    try:
        spec = json.loads(result["text"])
        log.info(f"Gemini intake: parsed OK, confidence={spec.get('confidence', '?')}")
        return {
            "status": "success",
            "spec": spec,
            "gemini_executed": True,
            "parse_ok": True,
            "gemini_trace": result.get("gemini_trace"),
        }
    except json.JSONDecodeError as e:
        log.error(f"Gemini returned invalid JSON: {e}")
        return {
            "status": "fail",
            "error": f"JSON parse error: {e}",
            "raw_text": result["text"][:500],
            "gemini_executed": True,
            "parse_ok": False,
            "gemini_trace": result.get("gemini_trace"),
        }
