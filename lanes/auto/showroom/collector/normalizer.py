"""Chuẩn hóa tin Chợ Tốt → schema LOCK 2."""

from __future__ import annotations

import hashlib
import json
import os
import re
from typing import Any

from lanes.auto.showroom.paths import raw_dir
from lanes.auto.showroom.collector.location_cleanup import cleanup_location_before_geo


def _vid(source_name: str, listing_id: str) -> str:
    h = hashlib.sha256(f"{source_name}:{listing_id}".encode("utf-8")).hexdigest()
    return h[:20]


def _seller_type(ad: dict[str, Any]) -> str:
    if ad.get("company_ad"):
        return "dealer"
    return "owner"


def _mileage(ad: dict[str, Any]) -> str:
    mv = ad.get("mileage_v2")
    if isinstance(mv, (int, float)) and mv > 0:
        if mv >= 1000:
            return f"{int(mv / 1000)}k km"
        return f"{int(mv)} km"
    for p in ad.get("params") or []:
        if isinstance(p, dict) and p.get("id") == "mileage_v2":
            return str(p.get("value") or "").strip()
    return ""


def _body_hint(ad: dict[str, Any]) -> str:
    # cartype 1-4 typical mapping — heuristic
    ct = ad.get("cartype_name") or ad.get("category_name")
    if isinstance(ct, str) and ct:
        low = ct.lower()
        if "suv" in low or "gầm" in low:
            return "suv"
        if "bán tải" in low or "pickup" in low:
            return "pickup"
        if "sedan" in low:
            return "sedan"
    name = f"{ad.get('carmodel_name','')} {ad.get('subject','')}".lower()
    if any(x in name for x in ("fortuner", "cx-5", "tucson", "sportage", "suv")):
        return "suv"
    if any(x in name for x in ("ranger", "bt-50", "bán tải", "pickup")):
        return "pickup"
    if any(x in name for x in ("sedan", "city", "vios", "accent", "elantra")):
        return "sedan"
    return "other"


def normalize_chotot_listing_detail(
    listing_ad: dict[str, Any],
    detail_ad: dict[str, Any] | None,
    final_url: str,
    source_name: str,
) -> tuple[dict[str, Any], str]:
    """
    Trả về (record dict cho DB, raw_payload_path).
    """
    ad = dict(listing_ad)
    if detail_ad:
        ad.update({k: v for k, v in detail_ad.items() if v is not None})

    lid = str(ad.get("list_id") or "")
    vehicle_id = _vid(source_name, lid)
    title = (ad.get("subject") or "").strip()
    brand = (ad.get("carbrand_name") or "").strip()
    model = (ad.get("carmodel_name") or "").strip()
    year = ad.get("mfdate")
    try:
        year_i = int(year) if year else 0
    except (TypeError, ValueError):
        year_i = 0
    price = ad.get("price")
    try:
        price_i = int(price) if price else 0
    except (TypeError, ValueError):
        price_i = 0

    loc_parts = [
        (ad.get("region_name_v3") or ad.get("region_name") or "").strip(),
        (ad.get("area_name") or "").strip(),
    ]
    location = ", ".join([x for x in loc_parts if x])
    cleaned_loc, loc_meta = cleanup_location_before_geo(location)
    location = cleaned_loc

    phone = (ad.get("phone") or "") or ""
    if isinstance(phone, str):
        phone = phone.strip()
    seller_name = (
        (ad.get("full_name") or ad.get("account_name") or "").strip()
    )
    img = ad.get("image") or ""
    if isinstance(ad.get("images"), list) and ad["images"]:
        img = ad["images"][0]

    collected_at = __import__("time").time()

    raw_name = f"{vehicle_id}.json"
    raw_path = os.path.join(raw_dir(), raw_name)
    payload = {"listing": listing_ad, "detail": detail_ad, "final_url": final_url}
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    record = {
        "vehicle_id": vehicle_id,
        "source_name": source_name,
        "source_listing_id": lid,
        "source_url": final_url,
        "title": title,
        "brand": brand,
        "model": model,
        "year": year_i,
        "price": price_i,
        "location": location,
        "mileage": _mileage(ad),
        "body_hint": _body_hint(ad),
        "seller_type": _seller_type(ad),
        "seller_name": seller_name,
        "phone": phone,
        "image_url": str(img or ""),
        "collected_at": collected_at,
        "raw_payload_ref": raw_path,
    }
    if loc_meta:
        record["_location_cleanup_audit"] = loc_meta
    return record, raw_path
