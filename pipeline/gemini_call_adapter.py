"""
Gemini call adapter with thinking_signature migration layer (Python).
Python equivalent of gemini/gemini_call_adapter.js.

Migration surface (update ONLY these two functions when Gemini 3 API is confirmed):
  - augment_body_with_signature()  ← request field name
  - extract_thinking_signature()   ← response field name
"""

import json
import logging
from typing import Optional

import requests

from .config import get_gemini_key, GEMINI_MODEL
from .gemini_state_store import read_gemini_state, write_gemini_state

log = logging.getLogger("mikage.gemini_call_adapter")

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# ─── model-specific helpers (Gemini 3 migration surface) ─────────────────────

# Models whose prefixes support thinking_signature injection.
# Update here when Gemini 3 is confirmed.
_THINKING_SIGNATURE_PREFIXES = [
    "gemini-3",
    # "gemini-2.5-pro",
]


def _supports_thinking_signature(model: str) -> bool:
    m = str(model or "").lower()
    return any(m.startswith(p) for p in _THINKING_SIGNATURE_PREFIXES)


def augment_body_with_signature(body: dict, signature: str) -> dict:
    """
    Attach thinking_signature to request body.
    TODO(gemini3): Confirm exact request field name when Gemini 3 API is published.
    """
    return {**body, "thinkingSignature": signature}


def extract_thinking_signature(payload: dict) -> Optional[str]:
    """
    Extract thinking_signature from Gemini response.
    Checks two candidate locations. Update here when field name is confirmed.
    """
    if not payload:
        return None
    # Candidate 1: top-level
    if payload.get("thinkingSignature"):
        return payload["thinkingSignature"]
    # Candidate 2: inside candidates[0]
    try:
        sig = payload["candidates"][0].get("thinkingSignature")
        if sig:
            return sig
    except (KeyError, IndexError, TypeError):
        pass
    return None


# ─── standard text extraction ────────────────────────────────────────────────

def extract_response_text(payload: dict) -> Optional[str]:
    """Standard Gemini generateContent text extraction."""
    try:
        return payload["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError):
        return None


# ─── main adapter ────────────────────────────────────────────────────────────

def call_gemini_with_state(
    body: dict,
    model: Optional[str] = None,
    job_id: Optional[str] = None,
    role: str = "unknown",
    timeout: int = 120,
) -> dict:
    """
    Stateful Gemini HTTP POST wrapper.

    Drop-in replacement for raw requests.post(generateContent).
    Maintains per-run thinking_signature in runs/<job_id>/gemini_state.json.

    Returns:
        {
          "payload": dict,          # raw Gemini JSON response
          "ok": bool,               # HTTP success
          "http_status": int,
          "text": str|None,         # extracted response text (convenience)
          "signature_updated": bool,
          "error": str|None,
          "gemini_trace": dict,     # trace fields for run artifacts
        }
    """
    resolved_model = model or GEMINI_MODEL
    key = get_gemini_key()
    url = f"{GEMINI_BASE_URL}/{resolved_model}:generateContent"
    ctx = {"role": role, "job_id": job_id, "model": resolved_model}

    # ── 1. Load per-run state ─────────────────────────────────────────────────
    state = read_gemini_state(job_id)
    saved_signature = (state or {}).get("thinking_signature") if state else None

    # ── 2. Optionally attach signature ────────────────────────────────────────
    request_body = dict(body)
    signature_attached = False

    if saved_signature:
        if _supports_thinking_signature(resolved_model):
            request_body = augment_body_with_signature(request_body, saved_signature)
            signature_attached = True
            log.info(f"[gemini_state] signature_attached {ctx}")
        else:
            log.info(f"[gemini_state] signature_not_supported {ctx}")
    elif not job_id:
        log.debug(f"[gemini_state] no_job_id {ctx}")
    else:
        log.debug(f"[gemini_state] signature_missing {ctx}")

    # ── 3. HTTP call ──────────────────────────────────────────────────────────
    try:
        r = requests.post(url, params={"key": key}, json=request_body, timeout=timeout)
    except Exception as exc:
        log.error(f"[gemini_state] request_exception {ctx}: {exc}")
        return {
            "payload": {},
            "ok": False,
            "http_status": None,
            "text": None,
            "signature_updated": False,
            "error": str(exc),
        }

    try:
        payload = r.json()
    except Exception:
        payload = {}

    # ── 4. Extract and persist signature from response ────────────────────────
    returned_signature = extract_thinking_signature(payload)
    signature_updated = False

    if job_id:
        patch = {"model": resolved_model, "_increment_call": True}
        if returned_signature:
            patch["thinking_signature"] = returned_signature
            signature_updated = True
            log.info(f"[gemini_state] signature_updated {ctx}")
        else:
            log.debug(f"[gemini_state] signature_not_returned {ctx}")
        write_gemini_state(job_id, patch)

    text = extract_response_text(payload)

    from pathlib import Path as _Path
    _state_path_str = str(RUNS_DIR / str(job_id) / "gemini_state.json") if job_id else None
    gemini_trace = {
        "model_used": resolved_model,
        "role": role,
        "job_id": job_id,
        "gemini_state_path": _state_path_str,
        "thinking_signature_present_before_call": bool(saved_signature),
        "thinking_signature_attached": signature_attached,
        "thinking_signature_returned": bool(returned_signature),
        "thinking_signature_updated": signature_updated,
        "call_count_before": int((state or {}).get("call_count") or 0),
    }

    return {
        "payload": payload,
        "ok": r.status_code == 200,
        "http_status": r.status_code,
        "text": text,
        "signature_updated": signature_updated,
        "error": None if r.status_code == 200 else f"HTTP {r.status_code}",
        "gemini_trace": gemini_trace,
    }
