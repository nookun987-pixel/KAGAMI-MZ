"""Median theo nhóm brand+model+year — fallback brand+model (Phase 2)."""

from __future__ import annotations

import sqlite3
from typing import Any


def _median(vals: list[int]) -> float | None:
    if not vals:
        return None
    s = sorted(vals)
    n = len(s)
    m = n // 2
    if n % 2:
        return float(s[m])
    return (s[m - 1] + s[m]) / 2.0


def _prices_for_group(
    conn: sqlite3.Connection,
    exclude_vehicle_id: str,
    brand: str,
    model: str,
    year: int | None,
    use_year: bool,
) -> list[int]:
    b = (brand or "").strip() or "unknown"
    m = (model or "").strip() or "unknown"
    y = int(year or 0)
    if use_year and y > 0:
        q = """
        SELECT v.price FROM normalized_vehicles v
        JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
        WHERE s.display_status IN ('DISPLAY_READY','REVIEW')
          AND v.price > 0
          AND v.vehicle_id != ?
          AND lower(trim(coalesce(v.brand,''))) = lower(trim(?))
          AND lower(trim(coalesce(v.model,''))) = lower(trim(?))
          AND v.year = ?
        """
        cur = conn.execute(q, (exclude_vehicle_id, b, m, y))
    else:
        q = """
        SELECT v.price FROM normalized_vehicles v
        JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
        WHERE s.display_status IN ('DISPLAY_READY','REVIEW')
          AND v.price > 0
          AND v.vehicle_id != ?
          AND lower(trim(coalesce(v.brand,''))) = lower(trim(?))
          AND lower(trim(coalesce(v.model,''))) = lower(trim(?))
        """
        cur = conn.execute(q, (exclude_vehicle_id, b, m))
    return [int(r[0]) for r in cur.fetchall()]


def compute_price_context(
    conn: sqlite3.Connection,
    vehicle_id: str,
    record: dict[str, Any],
) -> dict[str, Any]:
    """
    Trả dict: median_price_used, price_ratio, price_bucket (GIA_TOT|GIA_BINH_THUONG|GIA_CAO|UNKNOWN)
    """
    price = int(record.get("price") or 0)
    if price <= 0:
        return {
            "median_price_used": None,
            "price_ratio": None,
            "price_bucket": "UNKNOWN",
        }

    brand = record.get("brand")
    model = record.get("model")
    year = int(record.get("year") or 0)

    prices = _prices_for_group(conn, vehicle_id, str(brand), str(model), year, use_year=True)
    used_fallback = False
    if len(prices) < 5:
        prices = _prices_for_group(conn, vehicle_id, str(brand), str(model), year, use_year=False)
        used_fallback = True

    med = _median(prices)
    if med is None or med <= 0:
        return {
            "median_price_used": None,
            "price_ratio": None,
            "price_bucket": "UNKNOWN",
            "median_fallback": used_fallback,
        }

    ratio = price / float(med)
    if ratio <= 0.85:
        bucket = "GIA_TOT"
    elif ratio <= 1.15:
        bucket = "GIA_BINH_THUONG"
    else:
        bucket = "GIA_CAO"

    return {
        "median_price_used": float(med),
        "price_ratio": float(ratio),
        "price_bucket": bucket,
        "median_fallback": used_fallback,
        "median_sample_n": len(prices),
    }
