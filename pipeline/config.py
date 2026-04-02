"""
MIKAGE PIPELINE — config.py
Loads .env from project root. NEVER logs API keys.
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv

log = logging.getLogger("mikage.config")

_this_dir = Path(__file__).resolve().parent
PROJECT_ROOT = _this_dir.parent
ENV_FILE = PROJECT_ROOT / ".env"

if ENV_FILE.exists():
    load_dotenv(ENV_FILE, override=True)
    log.info(f".env loaded from {ENV_FILE}")
else:
    log.warning(f".env NOT found at {ENV_FILE}")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GOOGLE_AI_KEY = os.getenv("GOOGLE_AI_KEY", "")

def get_gemini_key() -> str:
    for k in [GEMINI_API_KEY, GOOGLE_API_KEY, GOOGLE_AI_KEY]:
        if k:
            return k
    raise RuntimeError("No Gemini API key found in .env")

def log_key_presence():
    log.info(f"GEMINI_API_KEY present = {bool(GEMINI_API_KEY)}")
    log.info(f"GOOGLE_API_KEY present = {bool(GOOGLE_API_KEY)}")
    log.info(f"GOOGLE_AI_KEY  present = {bool(GOOGLE_AI_KEY)}")

# ALL-IN-POD / BRIDGE-ONLY: Python pipeline hits Fooocus Direct Bridge on :7865
FOOOCUS_BRIDGE_URL = os.getenv("FOOOCUS_API") or os.getenv("FOOOCUS_API_URL") or os.getenv("FOOOCUS_PROXY_URL") or "http://127.0.0.1:7865"

RUNS_DIR = PROJECT_ROOT / "runs"
RUNS_DIR.mkdir(parents=True, exist_ok=True)
PIPELINE_DIR = _this_dir

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_VISION_MODEL = os.getenv("GEMINI_VISION_MODEL", "gemini-2.5-flash")