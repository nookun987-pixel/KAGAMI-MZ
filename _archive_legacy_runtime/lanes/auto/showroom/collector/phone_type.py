"""Phân loại số REAL / MASKED / NONE."""

from __future__ import annotations

import re


def classify_phone(phone: str | None) -> str:
    p = (phone or "").strip()
    if not p:
        return "NONE"
    if "*" in p:
        return "MASKED"
    low = p.lower()
    if "xxx" in low:
        return "MASKED"
    # mặt nạ kiểu 09xx•••• hoặc toàn dấu hỏi
    if re.search(r"[x]{3,}", low):
        return "MASKED"
    digits = re.sub(r"\D", "", p)
    if len(digits) < 9:
        return "MASKED"
    return "REAL"
