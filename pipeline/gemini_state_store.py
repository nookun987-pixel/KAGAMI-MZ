"""
Per-run Gemini state persistence (Python equivalent of gemini/gemini_state_store.js).
State lives in runs/<job_id>/gemini_state.json.
Never shared across jobs — fails open (returns None) on any I/O error.
"""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .config import RUNS_DIR

log = logging.getLogger("mikage.gemini_state_store")

EMPTY_STATE = lambda: {
    "model": None,
    "thinking_signature": None,
    "last_updated": None,
    "call_count": 0,
}


def _state_path(job_id: str) -> Path:
    return RUNS_DIR / str(job_id) / "gemini_state.json"


def read_gemini_state(job_id: Optional[str]) -> Optional[dict]:
    """Load per-run state. Returns None if missing, invalid, or job_id is falsy."""
    if not job_id:
        return None
    path = _state_path(job_id)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def write_gemini_state(job_id: Optional[str], patch: dict) -> Optional[dict]:
    """
    Merge-patch per-run state.
    Pass _increment_call=True in patch to auto-increment call_count.
    Returns updated state or None if job_id is falsy.
    """
    if not job_id:
        return None
    path = _state_path(job_id)
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
    except Exception:
        return None

    current = read_gemini_state(job_id) or EMPTY_STATE()
    increment = bool(patch.pop("_increment_call", False))

    updated = {**current, **patch}
    updated["last_updated"] = datetime.now(timezone.utc).isoformat()
    updated["call_count"] = int(current.get("call_count") or 0) + (1 if increment else 0)

    try:
        path.write_text(json.dumps(updated, indent=2, ensure_ascii=False), encoding="utf-8")
        return updated
    except Exception:
        return None


def clear_gemini_signature(job_id: Optional[str]) -> Optional[dict]:
    """Clear the thinking_signature for a job (e.g. on new session start)."""
    return write_gemini_state(job_id, {"thinking_signature": None})
