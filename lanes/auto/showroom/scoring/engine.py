"""Scoring 0–100 + system flags — Phase 2: median giá, phone, ảnh thật."""

from __future__ import annotations

import json
import os
import time
from typing import Any

from lanes.auto.showroom.scoring.status import assert_transition


def _rules_path() -> str:
    return os.path.join(os.path.dirname(__file__), "scoring_rules.json")


def load_rules() -> dict[str, Any]:
    with open(_rules_path(), encoding="utf-8") as f:
        return json.load(f)


def score_vehicle(record: dict[str, Any], rules: dict[str, Any] | None = None) -> tuple[int, dict[str, bool], dict[str, float]]:
    """
    record phải đã enrich: phone_type, image_valid, price_ratio, price_bucket, median_price_used.
    """
    r = rules or load_rules()
    w = r["weights"]
    th = r["thresholds"]
    fr = r["flag_rules"]
    now = time.time()
    collected = float(record.get("collected_at") or now)
    age_h = max(0.0, (now - collected) / 3600.0)
    recency = max(0.0, 1.0 - min(1.0, age_h / max(1, int(th.get("new_hours", 72))))) * w[
        "recency_score"
    ]

    fields_ok = 0
    for k in ("title", "year", "price", "location", "mileage"):
        v = record.get(k)
        if k == "year" and int(v or 0) > 0:
            fields_ok += 1
        elif k == "price" and int(v or 0) > 0:
            fields_ok += 1
        elif k in ("title", "location", "mileage") and str(v or "").strip():
            fields_ok += 1
    completeness = (fields_ok / 5.0) * w["completeness_score"]

    # --- price_signal: theo median (Phase 2) ---
    price_signal = 0.0
    med = record.get("median_price_used")
    rto = record.get("price_ratio")
    if med and rto is not None:
        rtf = float(rto)
        # rẻ hơn median => điểm cao hơn
        price_signal = w["price_signal_score"] * max(0.0, min(1.0, (1.35 - min(rtf, 1.35)) / 0.5))
    else:
        price_signal = w["price_signal_score"] * 0.35

    image_valid = bool(record.get("image_valid"))
    image_quality = (1.0 if image_valid else 0.08) * w["image_quality_score"]

    st = (record.get("seller_type") or "unknown").lower()
    if st == "owner":
        seller_signal = w["seller_signal_score"]
    elif st == "dealer":
        seller_signal = w["seller_signal_score"] * 0.35
    else:
        seller_signal = w["seller_signal_score"] * 0.55

    pt = (record.get("phone_type") or "NONE").upper()
    if pt == "REAL":
        contactability = w["contactability_score"] * 0.95
    elif pt == "MASKED":
        contactability = w["contactability_score"] * 0.55
    else:
        contactability = w["contactability_score"] * 0.22

    parts = {
        "recency_score": recency,
        "completeness_score": completeness,
        "price_signal_score": price_signal,
        "image_quality_score": image_quality,
        "seller_signal_score": seller_signal,
        "contactability_score": contactability,
    }
    total = int(round(sum(parts.values())))
    if pt == "REAL":
        total += int(fr.get("bonus_real_phone", 5))
    if not image_valid:
        total -= int(fr.get("penalty_bad_image", 10))

    va = record.get("vehicle_age")
    if va is not None:
        total += 10 if int(va) <= 6 else -15
    mk = record.get("mileage_km")
    if mk is not None:
        total += 10 if int(mk) <= 80000 else -15

    total = max(0, min(100, total))

    bucket = (record.get("price_bucket") or "UNKNOWN").upper()
    flags: dict[str, bool] = {
        "MOI_LEN_SAN": age_h <= float(fr.get("MOI_LEN_SAN_hours", 48)),
        "GIA_TOT": bucket == "GIA_TOT",
        "GIA_BINH_THUONG": bucket == "GIA_BINH_THUONG",
        "GIA_CAO": bucket == "GIA_CAO",
        "TIN_RO_RANG": fields_ok >= int(fr.get("TIN_RO_RANG_min_fields", 5)),
        "ANH_ON": image_valid,
        "CHU_DANG": st == "owner",
        "SALON": st == "dealer",
        "HAS_PHONE_REAL": pt == "REAL",
        "HAS_PHONE_MASKED": pt == "MASKED",
        "NEN_GOI_NGAY": (
            total >= int(fr.get("NEN_GOI_min_score", 76))
            and pt == "REAL"
            and image_valid
        ),
        "THEO_DOI": 55 <= total < int(th.get("call_now_score", 78)),
        "UU_TIEN_SALE": total >= int(th.get("display_ready_min_score", 62)),
        "XE_MOI": va is not None and int(va) <= 6,
        "KM_THAP": mk is not None and int(mk) <= 80000,
    }
    return total, flags, parts


def apply_scoring_to_state(
    current_status: str,
    record: dict[str, Any],
    rules: dict[str, Any] | None = None,
) -> tuple[int, dict[str, bool], str, dict[str, float]]:
    """NORMALIZED -> SCORED."""
    r = rules or load_rules()
    total, flags, parts = score_vehicle(record, r)
    assert_transition(current_status, "SCORED")
    return total, flags, "SCORED", parts
