"""LOCK 6 — DISPLAY GATE (Phase 2: bắt buộc ảnh hợp lệ)."""

from __future__ import annotations

from typing import Any

from lanes.auto.showroom.geo_allowlist import classify_geo, decide_with_geo
from lanes.auto.showroom.scoring.engine import load_rules
from lanes.auto.showroom.scoring.status import assert_transition
from lanes.auto.showroom.scoring.vehicle_metrics import vehicle_age_from_year


def _decide_display_status_core(record: dict[str, Any], score: int) -> str:
    """Trạng thái theo điểm / tuổi / ảnh — trước GEO LOCK."""
    rules = load_rules()
    th = rules["thresholds"]
    min_disp = int(th["display_ready_min_score"])
    min_rev = int(th["review_min_score"])

    title = (record.get("title") or "").strip()
    price = int(record.get("price") or 0)
    url = (record.get("source_url") or "").strip()
    image_valid = bool(record.get("image_valid"))

    if not url or not title or price <= 0:
        return "REJECT"

    year_i = int(record.get("year") or 0)
    mileage_km = record.get("mileage_km")
    if year_i <= 0 or mileage_km is None:
        return "REVIEW"

    va = record.get("vehicle_age")
    if va is None:
        va = vehicle_age_from_year(year_i)
    if va is not None and va > 6:
        return "HOLD"
    if int(mileage_km) > 80000:
        return "HOLD"

    if not image_valid:
        return "REVIEW"

    if score >= min_disp:
        return "DISPLAY_READY"

    if score >= min_rev:
        return "REVIEW"

    return "HOLD"


def decide_display_status(record: dict[str, Any], score: int) -> str:
    """GEO LOCK: ngoài vùng → HOLD; không rõ khu vực → REVIEW (trừ REJECT)."""
    core = _decide_display_status_core(record, score)
    geo = classify_geo(record.get("location") or "")
    return decide_with_geo(core, geo)


def gate_after_score(
    from_status: str,
    record: dict[str, Any],
    score: int,
    flags: dict[str, bool],
) -> str:
    target = decide_display_status(record, score)
    assert_transition(from_status, target)
    return target


def gate_normalized_record(record: dict[str, Any]) -> tuple[bool, str | None]:
    """LOCK 2 gate tối thiểu: title, price, source_url, collected_at."""
    if not (record.get("title") or "").strip():
        return False, "missing title"
    if int(record.get("price") or 0) <= 0:
        return False, "missing price"
    if not (record.get("source_url") or "").strip():
        return False, "missing source_url"
    if not record.get("collected_at"):
        return False, "missing collected_at"
    return True, None
