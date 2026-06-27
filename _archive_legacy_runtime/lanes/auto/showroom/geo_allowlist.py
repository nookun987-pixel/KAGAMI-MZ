"""
GEO LOCK + lớp ưu tiên (CORE / NEAR / EXTENDED / UNKNOWN).
"""

from __future__ import annotations

import re
import unicodedata
from typing import Literal

GeoClass = Literal["IN", "OUT", "UNKNOWN"]
GeoPriority = Literal["CORE", "NEAR", "EXTENDED", "UNKNOWN"]

# --- Tài liệu bàn giao (tên hiển thị) ---
CANONICAL_REGIONS_VI: tuple[str, ...] = (
    "TP.HCM / Hồ Chí Minh / SG",
    "Bình Dương",
    "Đồng Nai",
    "Long An",
    "Bà Rịa - Vũng Tàu",
    "Cần Thơ",
    "An Giang",
)

PRIORITY_LAYER_MAP_VI: dict[str, str] = {
    "CORE": "TP.HCM (khu vực lõi)",
    "NEAR": "Bình Dương, Đồng Nai, Long An, Bà Rịa - Vũng Tàu",
    "EXTENDED": "Cần Thơ, An Giang",
    "UNKNOWN": "Chưa xếp lớp / ngoài vùng IN",
}

# Lớp 1 — TP.HCM (ưu tiên match trước NEAR)
_CORE_KEYWORDS: tuple[str, ...] = (
    "ho chi minh",
    "tp ho chi minh",
    "tp. ho chi minh",
    "tphcm",
    "tp hcm",
    "tp.hcm",
    "hcm",
    "sai gon",
    "saigon",
    "sg.",
    "quan 1",
    "quan1",
    " q1 ",
    " q2 ",
    " q3 ",
    " q4 ",
    " q5 ",
    " q6 ",
    " q7 ",
    " q8 ",
    " q9 ",
    " q10 ",
    " q11 ",
    " q12 ",
    "thu duc",
    "go vap",
    "binh thanh",
    "tan binh",
    "tan phu",
    "phu nhuan",
    "binh tan",
    "binh chanh",
    "cu chi",
    "hoc mon",
    "nha be",
    "can gio",
)

# Lớp 2 — ven TP
_NEAR_KEYWORDS: tuple[str, ...] = (
    "binh duong",
    "thu dau mot",
    "di an",
    "thuan an",
    "tan uyen",
    "ben cat",
    "bac tan uyen",
    "dau tieng",
    "phu giao",
    "dong nai",
    "bien hoa",
    "long khanh",
    "long thanh",
    "nhon trach",
    "trang bom",
    "vinh cuu",
    "long an",
    "tan an",
    "ben luc",
    "duc hoa",
    "can duoc",
    "thu thua",
    "ba ria",
    "vung tau",
    "brvt",
    "phu my",
    "xuyen moc",
    "dat do",
    "long dien",
    "con dao",
)

# Lớp 3 — miền Tây / miền Nam cho phép
_EXTENDED_KEYWORDS: tuple[str, ...] = (
    "can tho",
    "ninh kieu",
    "binh thuy",
    "cai rang",
    "o mon",
    "thot not",
    "vinh thanh",
    "co do",
    "an giang",
    "long xuyen",
    "chau doc",
    "tan chau",
    "cho moi",
)

_IN_KEYWORDS: tuple[str, ...] = _CORE_KEYWORDS + _NEAR_KEYWORDS + _EXTENDED_KEYWORDS

_OUT_KEYWORDS: tuple[str, ...] = (
    "ha noi",
    "hanoi",
    "hai phong",
    "quang ninh",
    "bac ninh",
    "bac giang",
    "vinh phuc",
    "phu tho",
    "hoa binh",
    "son la",
    "dien bien",
    "lai chau",
    "lao cai",
    "yen bai",
    "ha giang",
    "cao bang",
    "lang son",
    "bac kan",
    "thai nguyen",
    "tuyen quang",
    "nghe an",
    "ha tinh",
    "quang binh",
    "quang tri",
    "thua thien hue",
    "hue",
    "da nang",
    "quang nam",
    "quang ngai",
    "binh dinh",
    "phu yen",
    "khanh hoa",
    "nha trang",
    "cam ranh",
    "ninh hoa",
    "van ninh",
    "dien khanh",
    "ninh thuan",
    "binh thuan",
    "lam dong",
    "dak lak",
    "dak nong",
    "gia lai",
    "kon tum",
    "binh phuoc",
    "tay ninh",
    "vinh long",
    "dong thap",
    "tien giang",
    "ben tre",
    "tra vinh",
    "soc trang",
    "hau giang",
    "bac lieu",
    "ca mau",
    "kien giang",
)


def normalize_location_text(s: str) -> str:
    """Lowercase, bỏ dấu tiếng Việt, gom khoảng trắng."""
    if not s or not str(s).strip():
        return ""
    t = unicodedata.normalize("NFD", str(s))
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = t.lower()
    t = re.sub(r"[\s\-_/.,;:+]+", " ", t)
    return f" {t.strip()} "


def classify_geo(location: str | None) -> GeoClass:
    raw = (location or "").strip()
    if len(raw) < 2:
        return "UNKNOWN"

    n = normalize_location_text(raw)

    for kw in _IN_KEYWORDS:
        k = kw.strip()
        if len(k) >= 2 and k in n:
            return "IN"

    for kw in _OUT_KEYWORDS:
        if len(kw) >= 3 and kw in n:
            return "OUT"

    return "UNKNOWN"


def compute_geo_priority(location: str | None) -> GeoPriority:
    """
    Chỉ phân lớp khi đã IN; OUT/UNKNOWN địa lý → UNKNOWN (cột geo_priority).
    """
    if classify_geo(location) != "IN":
        return "UNKNOWN"
    n = normalize_location_text(location or "")
    if not n.strip():
        return "UNKNOWN"

    for kw in _CORE_KEYWORDS:
        if len(kw.strip()) >= 2 and kw.strip() in n:
            return "CORE"
    for kw in _NEAR_KEYWORDS:
        if len(kw.strip()) >= 2 and kw.strip() in n:
            return "NEAR"
    for kw in _EXTENDED_KEYWORDS:
        if len(kw.strip()) >= 2 and kw.strip() in n:
            return "EXTENDED"
    return "UNKNOWN"


def decide_with_geo(
    base_status: str,
    geo: GeoClass,
) -> str:
    if geo == "OUT":
        if base_status == "REJECT":
            return "REJECT"
        return "HOLD"
    if geo == "UNKNOWN":
        if base_status == "REJECT":
            return "REJECT"
        return "REVIEW"
    return base_status
