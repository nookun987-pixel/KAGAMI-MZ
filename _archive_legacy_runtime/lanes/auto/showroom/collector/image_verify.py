"""Tải ảnh đầu — kiểm tra thật (200, đủ dung lượng)."""

from __future__ import annotations

import urllib.error
import urllib.request

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

MIN_BYTES = 20 * 1024
TIMEOUT = 8
MAX_READ = 2_500_000


def verify_image_url(url: str | None) -> tuple[bool, int]:
    """
    Trả (image_valid, image_size_bytes đã đọc).
    """
    u = (url or "").strip()
    if not u.startswith("http"):
        return False, 0
    req = urllib.request.Request(
        u,
        headers={"User-Agent": USER_AGENT, "Accept": "image/*,*/*;q=0.8"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            code = getattr(resp, "status", None) or resp.getcode()
            if code != 200:
                return False, 0
            chunk = resp.read(MAX_READ + 1)
            ln = len(chunk)
            if ln > MAX_READ:
                ln = MAX_READ
            ok = ln >= MIN_BYTES
            return ok, ln
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError):
        return False, 0
    except Exception:
        return False, 0
