"""Tuổi xe (năm) + km chuẩn hóa từ text tin Chợ Tốt."""

from __future__ import annotations

import re
from datetime import date
from typing import Any


_FALLBACK_MIN_PASS_YEAR = 2021
_FALLBACK_MAX_PASS_MILEAGE = 79999


def current_model_year() -> int:
    """Năm hiện tại (đồng bộ với scoring / gate)."""
    return date.today().year


def vehicle_age_from_year(year: int | None) -> int | None:
    y = int(year or 0)
    if y <= 0:
        return None
    return max(0, current_model_year() - y)


def _normalize_two_digit_year(num: int) -> int | None:
    if not (0 <= int(num) <= 99):
        return None
    base = 2000 + int(num)
    if 2000 <= base <= current_model_year() + 1:
        return base
    return None


def parse_model_year(*values: Any) -> int | None:
    candidates: list[int] = []
    for value in values:
        if value is None:
            continue
        if isinstance(value, int):
            if 1900 <= value <= current_model_year() + 1:
                candidates.append(int(value))
            continue
        raw = str(value).strip()
        if not raw:
            continue

        for m in re.finditer(r"\b((?:19|20)\d{2})\s*/\s*((?:19|20)\d{2})\b", raw):
            candidates.append(max(int(m.group(1)), int(m.group(2))))

        for m in re.finditer(r"\b(?:19|20)\d{2}\b", raw):
            candidates.append(int(m.group(0)))

        for m in re.finditer(r"(?:\b(?:doi|doi xe|sx|san xuat|nam)\s*['’]?\s*|\b['’])(\d{2})\b", raw, re.I):
            y = _normalize_two_digit_year(int(m.group(1)))
            if y is not None:
                candidates.append(y)

    if not candidates:
        return None
    return max(candidates)


def parse_mileage_km(mileage_text: str | None) -> int | None:
    """
    Chuẩn hóa mileage → km (số nguyên).
    - k / K: nhân 1.000 (vd: 80k → 80.000 km).
    - vạn / 万 (萬): nhân 10.000 (vd: 8 vạn → 80.000 km, 7.5万 → 75.000 km).
    - Chỉ giữ [0-9.,kK] cho nhánh thường (sau khi đã thử vạn/万).
    Không parse được → None (REVIEW).
    """
    if mileage_text is None:
        return None
    raw = str(mileage_text).strip()
    if not raw:
        return None

    norm = raw.lower().strip()
    norm = re.sub(r"[~≈]", "", norm)
    norm = re.sub(r"\bnghin\b", "nghìn", norm)
    norm = re.sub(r"\bvan\b", "vạn", norm)
    norm = re.sub(r"\s+", " ", norm)

    # Bỏ đơn vị km trước (tránh chữ "k" trong "km" bị coi là hậu tố ×1000).
    raw = re.sub(r"(?i)km", "", raw)
    norm = re.sub(r"(?i)km", "", norm)

    m_range_wan = re.search(
        r"(?P<a>\d+(?:[.,]\d+)?)\s*-\s*(?P<b>\d+(?:[.,]\d+)?)\s*(?:vạn|万|萬)",
        norm,
        re.IGNORECASE,
    )
    if m_range_wan:
        hi = _parse_numeric_token(m_range_wan.group("b"))
        if hi is not None:
            return int(round(hi * 10000))

    m_near_wan = re.search(
        r"(?:gan|gần|hon|hơn)?\s*(?P<num>\d+(?:[.,]\d+)?)\s*(?:vạn|万|萬)",
        norm,
        re.IGNORECASE,
    )
    if m_near_wan:
        v = _parse_numeric_token(m_near_wan.group("num"))
        if v is None:
            return None
        if re.search(r"\bhon\b|hơn", norm, re.IGNORECASE):
            return int(round(v * 10000 + 1000))
        return int(round(v * 10000))

    m_thousand = re.search(
        r"(?P<num>\d+(?:[.,]\d+)?)\s*nghìn",
        norm,
        re.IGNORECASE,
    )
    if m_thousand:
        v = _parse_numeric_token(m_thousand.group("num"))
        if v is None:
            return None
        return int(round(v * 1000))

    # --- vạn / 万: 1 đơn vị = 10.000 km ---
    m_wan = re.search(
        r"(?P<num>[\d]+(?:[.,][\d]+)?)\s*(?:vạn|万|萬)",
        raw,
        re.IGNORECASE,
    )
    if m_wan:
        v = _parse_numeric_token(m_wan.group("num"))
        if v is None:
            return None
        return int(round(v * 10000))

    # --- Chỉ giữ số, dấu phân tách, k/K ---
    slim = re.sub(r"[^0-9.,kK]", "", raw)
    if not slim:
        return None

    # --- Hậu tố k/K: nhân 1.000 ---
    if slim[-1] in "kK":
        num_part = slim[:-1]
        if not num_part:
            return None
        v = _parse_numeric_token(num_part)
        if v is None:
            return None
        return int(round(v * 1000))

    v = _parse_numeric_token(slim)
    if v is None:
        return None
    return int(round(v))


def _parse_numeric_token(t: str) -> float | None:
    """
    Parse một token số: 80.000 (nghìn VN), 80000, 7.5 (thập phân).
    """
    t = t.strip().replace(" ", "")
    if not t:
        return None

    # Một dấu chấm: 80.000 → 80000; 7.5 → 7.5
    if t.count(".") == 1:
        left, right = t.split(".")
        if left.isdigit() and right.isdigit():
            if len(right) == 3:
                return float(left + right)
            return float(f"{left}.{right}")

    # Một dấu phẩy: 80,000 (nghìn) hoặc hiếm khi thập phân
    if t.count(",") == 1 and "." not in t:
        left, right = t.split(",")
        if left.isdigit() and right.isdigit():
            if len(right) == 3:
                return float(left + right)
            return float(f"{left}.{right}")

    t_flat = t.replace(".", "").replace(",", "")
    if t_flat.isdigit():
        return float(t_flat)
    try:
        return float(t.replace(",", "."))
    except ValueError:
        return None


def attach_vehicle_metrics(record: dict[str, Any]) -> dict[str, Any]:
    """Gắn vehicle_age, mileage_km vào record (không đổi record gốc nếu gọi với copy)."""
    out = record
    parse_unknown_fields: list[str] = []

    y = parse_model_year(out.get("year"), out.get("title"))
    if y is None:
        parse_unknown_fields.append("year")
        y = _FALLBACK_MIN_PASS_YEAR
    out["year"] = int(y)
    out["vehicle_age"] = vehicle_age_from_year(y)

    mkm = parse_mileage_km(out.get("mileage"))
    if mkm is None:
        parse_unknown_fields.append("mileage_km")
        mkm = _FALLBACK_MAX_PASS_MILEAGE
    out["mileage_km"] = int(mkm)
    out["PARSE_UNKNOWN"] = bool(parse_unknown_fields)
    out["parse_unknown_fields"] = parse_unknown_fields
    return out
