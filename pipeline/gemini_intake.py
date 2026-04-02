"""
MIKAGE PIPELINE — gemini_intake.py
Gemini parses a creative brief into a structured spec with canon checklist.
"""

import json
import logging
import requests
from typing import Optional

from .config import get_gemini_key, GEMINI_MODEL

log = logging.getLogger("mikage.gemini_intake")


def call_gemini(prompt: str, system: str = "") -> dict:
    """Call Gemini API. Returns {"text": str, "ok": bool}"""
    key = get_gemini_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={key}"

    contents = [{"role": "user", "parts": [{"text": prompt}]}]
    body = {"contents": contents}
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}

    body["generationConfig"] = {
        "temperature": 0.2,
        "responseMimeType": "application/json",
    }

    try:
        r = requests.post(url, json=body, timeout=60)
        if r.status_code != 200:
            log.error(f"Gemini HTTP {r.status_code}: {r.text[:300]}")
            return {"text": "", "ok": False, "error": f"HTTP {r.status_code}"}

        data = r.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return {"text": text, "ok": True}

    except Exception as e:
        log.error(f"Gemini call failed: {e}")
        return {"text": "", "ok": False, "error": str(e)}


def intake(brief: str) -> dict:
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
    result = call_gemini(user_prompt, system=system_prompt)

    if not result["ok"]:
        return {
            "status": "fail",
            "error": result.get("error", "Gemini intake failed"),
            "gemini_executed": False,
            "parse_ok": False,
        }

    try:
        spec = json.loads(result["text"])
        log.info(f"Gemini intake: parsed OK, confidence={spec.get('confidence', '?')}")
        return {
            "status": "success",
            "spec": spec,
            "gemini_executed": True,
            "parse_ok": True,
        }
    except json.JSONDecodeError as e:
        log.error(f"Gemini returned invalid JSON: {e}")
        return {
            "status": "fail",
            "error": f"JSON parse error: {e}",
            "raw_text": result["text"][:500],
            "gemini_executed": True,
            "parse_ok": False,
        }
