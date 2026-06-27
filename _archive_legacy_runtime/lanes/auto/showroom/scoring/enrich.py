"""Gắn phone_type, image verify, median context trước khi chấm điểm."""

from __future__ import annotations

import sqlite3
from typing import Any

from lanes.auto.showroom.collector.image_verify import verify_image_url
from lanes.auto.showroom.collector.phone_type import classify_phone
from lanes.auto.showroom.pricing.median_price import compute_price_context
from lanes.auto.showroom.scoring.vehicle_metrics import (
    attach_vehicle_metrics,
    parse_mileage_km,
)


def enrich_record(
    conn: sqlite3.Connection,
    vehicle_id: str,
    record: dict[str, Any],
) -> dict[str, Any]:
    out = dict(record)
    out["phone_type"] = classify_phone(out.get("phone"))
    iv, sz = verify_image_url(out.get("image_url"))
    out["image_valid"] = iv
    out["image_size_bytes"] = int(sz)
    out.update(compute_price_context(conn, vehicle_id, out))
    return attach_vehicle_metrics(out)


def review_reasons(record: dict[str, Any], image_valid: bool, phone_type: str) -> list[str]:
    reasons: list[str] = []
    if not image_valid:
        reasons.append("ảnh không tải được hoặc < 20KB")
    if phone_type == "NONE":
        reasons.append("thiếu số liên hệ")
    elif phone_type == "MASKED":
        reasons.append("SĐT bị che (mask)")
    if not (record.get("title") or "").strip():
        reasons.append("thiếu tiêu đề")
    if int(record.get("price") or 0) <= 0:
        reasons.append("thiếu giá")
    if int(record.get("year") or 0) <= 0:
        reasons.append("thiếu năm sản xuất")
    mkm = record.get("mileage_km")
    if mkm is None:
        mkm = parse_mileage_km(record.get("mileage"))
    if mkm is None:
        reasons.append("thiếu/không rõ km")
    return reasons
