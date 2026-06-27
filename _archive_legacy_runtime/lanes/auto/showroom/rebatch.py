"""Rescore toàn bộ DB sau Phase 2 (không assert trạng thái)."""

from __future__ import annotations

from typing import Any

from lanes.auto.showroom.audit.audit_log_service import audit
from lanes.auto.showroom.db import connect, init_db, jdump, now_ts
from lanes.auto.showroom.di_linh_showroom_gate import (
    DI_LINH_SHOWROOM,
    build_phone_listing_count_map,
    di_linh_evaluate,
    listing_count_for_phone,
    purge_vehicle_from_showroom_dataset,
)
from lanes.auto.showroom.geo_allowlist import compute_geo_priority
from lanes.auto.showroom.scoring.display_gate import decide_display_status
from lanes.auto.showroom.scoring.engine import load_rules, score_vehicle
from lanes.auto.showroom.scoring.enrich import enrich_record


def rescore_all() -> dict[str, Any]:
    init_db()
    conn = connect()
    out: dict[str, Any] = {"updated": 0, "purged": 0, "purged_reasons": {}}
    try:
        cur = conn.execute(
            """
            SELECT v.*, s.display_status FROM normalized_vehicles v
            JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
            """
        )
        rules = load_rules()
        rows = cur.fetchall()
        phone_counts = build_phone_listing_count_map(conn)
        for r in rows:
            rec = {k: r[k] for k in r.keys() if k != "display_status"}
            vid = rec["vehicle_id"]
            enriched = enrich_record(conn, vid, rec)
            if DI_LINH_SHOWROOM:
                spc = listing_count_for_phone(phone_counts, rec.get("phone"))
                ok_dl, _rcode = di_linh_evaluate(
                    enriched, same_phone_listing_count=spc
                )
                if not ok_dl:
                    purge_vehicle_from_showroom_dataset(
                        conn, vid, rec["source_name"], str(rec["source_listing_id"])
                    )
                    audit(conn, vid, "RESCORE_PURGE", _rcode, {})
                    out["purged"] += 1
                    out["purged_reasons"][_rcode] = (
                        int(out["purged_reasons"].get(_rcode, 0)) + 1
                    )
                    continue
            total, flags, parts = score_vehicle(enriched, rules)
            target = decide_display_status(enriched, total)
            if DI_LINH_SHOWROOM and target != "DISPLAY_READY":
                purge_vehicle_from_showroom_dataset(
                    conn, vid, rec["source_name"], str(rec["source_listing_id"])
                )
                audit(conn, vid, "RESCORE_PURGE", target, {"score": total})
                out["purged"] += 1
                out["purged_reasons"][target] = (
                    int(out["purged_reasons"].get(target, 0)) + 1
                )
                continue
            geo_pri = compute_geo_priority(enriched.get("location"))
            conn.execute(
                """
                UPDATE showroom_state SET score=?, system_flags_json=?, score_version=?, display_status=?, updated_at=?,
                  price_ratio=?, price_bucket=?, median_price_used=?, phone_type=?, image_valid=?, image_size_bytes=?,
                  vehicle_age=?, mileage_km=?, geo_priority=?
                WHERE vehicle_id=?
                """,
                (
                    total,
                    jdump(flags),
                    rules.get("version", ""),
                    target,
                    now_ts(),
                    enriched.get("price_ratio"),
                    enriched.get("price_bucket"),
                    enriched.get("median_price_used"),
                    enriched.get("phone_type"),
                    1 if enriched.get("image_valid") else 0,
                    int(enriched.get("image_size_bytes") or 0),
                    enriched.get("vehicle_age"),
                    enriched.get("mileage_km"),
                    geo_pri,
                    vid,
                ),
            )
            audit(conn, vid, "RESCORE_P2", target, {"score": total, "parts": parts})
            out["updated"] += 1
        conn.commit()
    finally:
        conn.close()
    return out
