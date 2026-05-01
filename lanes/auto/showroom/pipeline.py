"""Ingest: SOURCE LOCK → collector → SCHEMA → DEDUP → SCORE → DISPLAY GATE."""

from __future__ import annotations

import csv
import json as _json
import os
import sqlite3
import time
import traceback
from pathlib import Path
from typing import Any

from lanes.auto.scout.chotot import sleep_between_requests
from lanes.auto.showroom.audit.audit_log_service import audit
from lanes.auto.showroom.collector.detail_fetcher import fetch_detail
from lanes.auto.showroom.collector.listing_fetcher import fetch_listing_page
from lanes.auto.showroom.collector.location_cleanup import backfill_location_cleanup
from lanes.auto.showroom.collector.normalizer import normalize_chotot_listing_detail
from lanes.auto.showroom.collector.source_registry import assert_source_enabled, load_approved_sources
from lanes.auto.showroom.rebatch import rescore_all
from lanes.auto.showroom.db import connect, init_db, jdump, now_ts
from lanes.auto.showroom.dedup import find_duplicate_vehicle_id
from lanes.auto.showroom.di_linh_showroom_gate import (
    DI_LINH_SHOWROOM,
    build_phone_listing_count_map,
    di_linh_evaluate,
    listing_count_for_phone,
    purge_all_not_display_ready,
    purge_vehicle_from_showroom_dataset,
    same_phone_listing_count,
)
from lanes.auto.showroom.geo_allowlist import classify_geo, compute_geo_priority
from lanes.auto.showroom.scoring.display_gate import gate_after_score, gate_normalized_record
from lanes.auto.showroom.scoring.engine import apply_scoring_to_state, load_rules
from lanes.auto.showroom.scoring.enrich import enrich_record
from lanes.auto.showroom.scoring.status import assert_transition


_REJECTION_AUDIT_COLUMNS = [
    "listing_key",
    "title",
    "price",
    "year",
    "km",
    "location",
    "seller_type",
    "reject_reason",
    "source_url",
]


def _sanitize_csv_text(value: Any) -> str:
    s = str(value or "")
    return s.replace("\r", " ").replace("\n", " ").strip()


def _write_rejection_audit_csv(out_path: Path, rows: list[dict[str, Any]]) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(
            f,
            fieldnames=_REJECTION_AUDIT_COLUMNS,
            quoting=csv.QUOTE_ALL,
            lineterminator="\n",
            extrasaction="ignore",
        )
        w.writeheader()
        for row in rows:
            out = {k: row.get(k, "") for k in _REJECTION_AUDIT_COLUMNS}
            out["title"] = _sanitize_csv_text(out.get("title", ""))
            out["location"] = _sanitize_csv_text(out.get("location", ""))
            w.writerow(out)


def _insert_raw(
    conn: sqlite3.Connection,
    source_name: str,
    listing_id: str,
    seed_url: str,
    listing_json: str,
    raw_path: str,
) -> None:
    conn.execute(
        """
        INSERT OR IGNORE INTO raw_listings(source_name, source_listing_id, seed_url, listing_json, raw_payload_path, created_at)
        VALUES(?,?,?,?,?,?)
        """,
        (source_name, listing_id, seed_url, listing_json, raw_path, now_ts()),
    )


def _upsert_vehicle(conn: sqlite3.Connection, record: dict[str, Any]) -> None:
    conn.execute(
        """
        INSERT INTO normalized_vehicles(
          vehicle_id, source_name, source_listing_id, source_url, title, brand, model, year, price,
          location, mileage, body_hint, seller_type, seller_name, phone, image_url, collected_at, raw_payload_ref
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(vehicle_id) DO UPDATE SET
          source_url=excluded.source_url,
          title=excluded.title,
          price=excluded.price,
          mileage=excluded.mileage,
          phone=excluded.phone,
          image_url=excluded.image_url
        """,
        (
            record["vehicle_id"],
            record["source_name"],
            record["source_listing_id"],
            record["source_url"],
            record["title"],
            record["brand"],
            record["model"],
            int(record["year"] or 0),
            int(record["price"] or 0),
            record["location"],
            record["mileage"],
            record["body_hint"],
            record["seller_type"],
            record["seller_name"],
            record["phone"],
            record["image_url"],
            record["collected_at"],
            record["raw_payload_ref"],
        ),
    )
    conn.execute(
        """
        INSERT INTO showroom_state(vehicle_id, score, system_flags_json, human_flags_json, display_status, operator_state_json, score_version, updated_at, geo_priority)
        VALUES(?,0,'{}','{}','NEW','{}',?,?,'UNKNOWN')
        ON CONFLICT(vehicle_id) DO NOTHING
        """,
        (record["vehicle_id"], load_rules().get("version", ""), now_ts()),
    )


def _ingest_one_source(
    conn: sqlite3.Connection,
    cfg: dict[str, Any],
    listing_budget: int | None = None,
    per_seed_listing_cap: int | None = None,
    run_deadline_monotonic: float | None = None,
) -> dict[str, Any]:
    source_id = cfg["id"]
    collector = cfg.get("collector") or "chotot"
    seeds = cfg["seeds"]
    pages = int(cfg.get("pages_per_seed", 1))
    cap = int(cfg.get("max_vehicles_per_run", 24))
    delay = float(cfg.get("request_delay_sec", 0.5))
    max_runtime_sec = float(cfg.get("max_source_runtime_sec", os.getenv("GARA_SOURCE_TIMEOUT_SEC", "180")))
    started_at = time.monotonic()
    timed_out = False

    stats = {
        "processed": 0,
        "ingested": 0,
        "skipped_dup": 0,
        "rejected": 0,
        "rejected_geo": 0,
        "errors": [],
        "di_linh_rejected": {},
        "rejection_audit": [],
        "timeout_guard_triggered": False,
        "timeout_stage": "",
    }
    rejection_audit_enabled = listing_budget is not None

    def _push_rejection_audit(
        reject_reason: str,
        rec: dict[str, Any],
        source_url: str,
    ) -> None:
        if not rejection_audit_enabled:
            return
        if len(stats["rejection_audit"]) >= 500:
            return
        km = rec.get("mileage") or rec.get("mileage_km") or ""
        stats["rejection_audit"].append(
            {
                "listing_key": rec.get("vehicle_id") or "",
                "title": rec.get("title") or rec.get("subject") or "",
                "price": rec.get("price") or 0,
                "year": rec.get("year") or rec.get("mfdate") or 0,
                "km": km,
                "location": rec.get("location") or rec.get("region_name_v3") or "",
                "seller_type": rec.get("seller_type") or "",
                "reject_reason": reject_reason,
                "source_url": source_url or rec.get("source_url") or "",
            }
        )

    def _timeout_guard(stage: str) -> bool:
        nonlocal timed_out
        stage_name = (
            stage
            if stage in (
                "listing_page_fetch",
                "detail_fetch",
                "sleep",
                "page_loop",
                "seed_loop",
            )
            else "unknown"
        )
        if timed_out:
            return True
        now_mono = time.monotonic()
        elapsed = now_mono - started_at

        if run_deadline_monotonic is not None and now_mono > run_deadline_monotonic:
            msg = (
                f"GARA_TIMEOUT_GUARD_TRIGGERED source={source_id} collector={collector} "
                f"stage={stage_name} elapsed_sec={elapsed:.1f} "
                "guard_type=run_deadline"
            )
            stats["errors"].append(msg)
            stats["timeout_guard_triggered"] = True
            stats["timeout_stage"] = stage_name
            print(f"[INGEST_TIMEOUT] {msg}")
            timed_out = True
            return True

        if max_runtime_sec <= 0:
            return False
        if elapsed <= max_runtime_sec:
            return False
        msg = (
            f"GARA_TIMEOUT_GUARD_TRIGGERED source={source_id} collector={collector} "
            f"stage={stage_name} elapsed_sec={elapsed:.1f} limit_sec={max_runtime_sec:.1f} "
            "guard_type=source_runtime"
        )
        stats["errors"].append(msg)
        stats["timeout_guard_triggered"] = True
        stats["timeout_stage"] = stage_name
        print(f"[INGEST_TIMEOUT] {msg}")
        timed_out = True
        return True

    def _guarded_sleep() -> bool:
        if _timeout_guard("sleep"):
            return False
        sleep_between_requests(delay)
        return True

    audit(conn, None, "INGEST", "start", {"source": source_id, "collector": collector})

    for seed in seeds:
        seed_processed = 0
        if _timeout_guard("seed_loop"):
            break
        for page in range(1, pages + 1):
            if _timeout_guard("page_loop"):
                break
            if _timeout_guard("listing_page_fetch"):
                break
            ads, err = fetch_listing_page(seed, page=page, collector=collector)
            if not _guarded_sleep():
                break
            if err:
                stats["errors"].append(f"{seed} p{page}: {err}")
                continue
            for ad in ads:
                if listing_budget is not None and stats["processed"] >= listing_budget:
                    break
                if per_seed_listing_cap is not None and seed_processed >= per_seed_listing_cap:
                    break
                if _timeout_guard("detail_fetch"):
                    break
                if stats["ingested"] >= cap:
                    break
                lid = ad.get("list_id")
                if not isinstance(lid, int):
                    continue
                stats["processed"] += 1
                seed_processed += 1
                detail, final_url, derr = fetch_detail(
                    seed, lid, listing_ad=ad, collector=collector
                )
                if not _guarded_sleep():
                    break
                if derr:
                    stats["errors"].append(f"detail {lid}: {derr}")
                    continue
                listing_json = _json.dumps(ad, ensure_ascii=False)
                record, raw_path = normalize_chotot_listing_detail(
                    ad, detail, final_url, source_id
                )
                loc_audit = record.pop("_location_cleanup_audit", None)
                if loc_audit:
                    audit(
                        conn,
                        record["vehicle_id"],
                        "LOCATION_CLEANUP",
                        loc_audit["cleanup_rule_applied"],
                        {
                            "raw_location": loc_audit["raw_location"],
                            "cleaned_location": loc_audit["cleaned_location"],
                        },
                    )
                if classify_geo(record.get("location") or "") == "OUT":
                    stats["rejected_geo"] += 1
                    _push_rejection_audit(
                        "GEO_OUT",
                        record,
                        final_url,
                    )
                    audit(
                        conn,
                        record["vehicle_id"],
                        "GEO_LOCK",
                        "skip outside region",
                        {"location": record.get("location")},
                    )
                    conn.commit()
                    continue
                dup_id = find_duplicate_vehicle_id(conn, record)
                if dup_id:
                    stats["skipped_dup"] += 1
                    audit(
                        conn,
                        dup_id,
                        "DEDUP",
                        "skip duplicate",
                        {"new": record["vehicle_id"]},
                    )
                    continue

                ok, reason = gate_normalized_record(record)
                if not ok:
                    stats["rejected"] += 1
                    _push_rejection_audit(
                        f"SCHEMA:{reason}",
                        record,
                        final_url,
                    )
                    audit(
                        conn,
                        record["vehicle_id"],
                        "SCHEMA_LOCK",
                        f"reject: {reason}",
                        {},
                    )
                    continue

                _insert_raw(conn, source_id, str(lid), seed, listing_json, raw_path)
                _upsert_vehicle(conn, record)
                vid = record["vehicle_id"]
                audit(conn, vid, "COLLECTOR", "normalized", {"url": final_url})

                assert_transition("NEW", "NORMALIZED")
                conn.execute(
                    "UPDATE showroom_state SET display_status=?, updated_at=? WHERE vehicle_id=?",
                    ("NORMALIZED", now_ts(), vid),
                )

                row = dict(record)
                enriched = enrich_record(conn, vid, row)
                if DI_LINH_SHOWROOM:
                    spc = same_phone_listing_count(conn, record.get("phone"))
                    ok_dl, rcode = di_linh_evaluate(
                        enriched, same_phone_listing_count=spc
                    )
                    if not ok_dl:
                        stats["di_linh_rejected"][rcode] = (
                            int(stats["di_linh_rejected"].get(rcode, 0)) + 1
                        )
                        _push_rejection_audit(
                            f"DI_LINH:{rcode}",
                            enriched,
                            final_url,
                        )
                        purge_vehicle_from_showroom_dataset(
                            conn, vid, record["source_name"], str(record["source_listing_id"])
                        )
                        audit(
                            conn,
                            vid,
                            "DI_LINH_REJECT",
                            rcode,
                            {"title": record.get("title")},
                        )
                        conn.commit()
                        continue

                total, flags, _st, parts = apply_scoring_to_state("NORMALIZED", enriched)
                rules = load_rules()
                geo_pri = compute_geo_priority(enriched.get("location"))
                conn.execute(
                    """
                    UPDATE showroom_state SET score=?, system_flags_json=?, score_version=?, updated_at=?, display_status=?,
                      price_ratio=?, price_bucket=?, median_price_used=?, phone_type=?, image_valid=?, image_size_bytes=?,
                      vehicle_age=?, mileage_km=?, geo_priority=?
                    WHERE vehicle_id=?
                    """,
                    (
                        total,
                        jdump(flags),
                        rules.get("version", ""),
                        now_ts(),
                        "SCORED",
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
                audit(
                    conn,
                    vid,
                    "SCORING",
                    "scored",
                    {
                        "score": total,
                        "parts": parts,
                        "median": enriched.get("median_price_used"),
                    },
                )

                final_status = gate_after_score("SCORED", enriched, total, flags)
                if DI_LINH_SHOWROOM and final_status != "DISPLAY_READY":
                    stats["di_linh_rejected"]["NOT_DISPLAY_READY"] = (
                        int(stats["di_linh_rejected"].get("NOT_DISPLAY_READY", 0)) + 1
                    )
                    _push_rejection_audit(
                        "DI_LINH:NOT_DISPLAY_READY",
                        enriched,
                        final_url,
                    )
                    purge_vehicle_from_showroom_dataset(
                        conn, vid, record["source_name"], str(record["source_listing_id"])
                    )
                    audit(
                        conn,
                        vid,
                        "DI_LINH_REJECT",
                        "NOT_DISPLAY_READY",
                        {"gate_status": final_status, "score": total},
                    )
                    conn.commit()
                    continue

                conn.execute(
                    "UPDATE showroom_state SET display_status=?, updated_at=? WHERE vehicle_id=?",
                    (final_status, now_ts(), vid),
                )
                audit(conn, vid, "DISPLAY_GATE", final_status, {"score": total})

                stats["ingested"] += 1
                conn.commit()
            if (
                stats["ingested"] >= cap
                or timed_out
                or (listing_budget is not None and stats["processed"] >= listing_budget)
            ):
                break
        if (
            stats["ingested"] >= cap
            or timed_out
            or (listing_budget is not None and stats["processed"] >= listing_budget)
        ):
            break

    audit(conn, None, "INGEST", "done", {"source": source_id, **stats})
    conn.commit()
    return stats


def ingest_run() -> dict[str, Any]:
    init_db()
    run_deadline_monotonic: float | None = None
    run_timeout_raw = os.getenv("GARA_SOURCE_TIMEOUT_SEC", "180").strip()
    try:
        run_timeout_sec = float(run_timeout_raw)
        if run_timeout_sec > 0:
            run_deadline_monotonic = time.monotonic() + run_timeout_sec
    except (TypeError, ValueError):
        run_deadline_monotonic = None
    verify_limit: int | None = None
    verify_limit_raw = os.getenv("GARA_VERIFY_LIMIT", "").strip()
    if verify_limit_raw:
        try:
            parsed = int(float(verify_limit_raw))
            if parsed > 0:
                verify_limit = parsed
        except (TypeError, ValueError):
            verify_limit = None
    verify_per_seed_cap: int | None = None
    if verify_limit is not None:
        verify_per_seed_cap = int(float(os.getenv("GARA_VERIFY_PER_SEED_CAP", "5")))
        if verify_per_seed_cap <= 0:
            verify_per_seed_cap = None
    total: dict[str, Any] = {
        "processed": 0,
        "ingested": 0,
        "skipped_dup": 0,
        "rejected": 0,
        "rejected_geo": 0,
        "errors": [],
        "by_source": [],
        "rejection_audit_rows": 0,
        "rejection_audit_path": "",
        "location_backfill_rows": 0,
        "di_linh_rejected": {},
        "purged_non_display_ready": 0,
    }
    rejection_audit_rows: list[dict[str, Any]] = []
    conn = connect()
    try:
        total["location_backfill_rows"] = backfill_location_cleanup(conn)
        conn.commit()
    finally:
        conn.close()
    if DI_LINH_SHOWROOM:
        conn = connect()
        try:
            total["purged_non_display_ready"] = purge_all_not_display_ready(conn)
            conn.commit()
        finally:
            conn.close()
    rescore_all()
    if DI_LINH_SHOWROOM:
        conn = connect()
        try:
            total["purged_non_display_ready"] += purge_all_not_display_ready(conn)
            conn.commit()
        finally:
            conn.close()
    conn = connect()
    try:
        for cfg in load_approved_sources():
            remaining_budget: int | None = None
            cfg_local = dict(cfg)
            if verify_limit is not None:
                remaining_budget = verify_limit - int(total.get("processed", 0))
                if remaining_budget <= 0:
                    break
                cfg_local["pages_per_seed"] = max(
                    int(cfg_local.get("pages_per_seed", 1)),
                    int(float(os.getenv("GARA_VERIFY_PAGES_PER_SEED", "2"))),
                )
                cfg_local["request_delay_sec"] = min(
                    float(cfg_local.get("request_delay_sec", 0.5)),
                    float(os.getenv("GARA_VERIFY_REQUEST_DELAY_SEC", "0.05")),
                )
            if not cfg.get("enabled", True):
                continue
            assert_source_enabled(cfg["id"])
            st = _ingest_one_source(
                conn,
                cfg_local,
                listing_budget=remaining_budget,
                per_seed_listing_cap=verify_per_seed_cap,
                run_deadline_monotonic=run_deadline_monotonic,
            )
            total["processed"] += st.get("processed", 0)
            total["ingested"] += st["ingested"]
            total["skipped_dup"] += st["skipped_dup"]
            total["rejected"] += st["rejected"]
            total["rejected_geo"] += st.get("rejected_geo", 0)
            total["errors"].extend(
                [f"[{cfg['id']}] {e}" for e in st.get("errors", [])]
            )
            if verify_limit is not None:
                rejection_audit_rows.extend(st.get("rejection_audit", []))
            for k, v in st.get("di_linh_rejected", {}).items():
                total["di_linh_rejected"][k] = total["di_linh_rejected"].get(k, 0) + v
            total["by_source"].append({"source": cfg["id"], **st})
    finally:
        conn.close()

    if verify_limit is not None:
        audit_path_override = (os.getenv("GARA_REJECTION_AUDIT_PATH") or "").strip()
        if audit_path_override:
            out_path = Path(audit_path_override)
        else:
            out_path = Path(__file__).resolve().parents[1] / "output" / "gara_rejection_audit.csv"
        _write_rejection_audit_csv(out_path, rejection_audit_rows)
        total["rejection_audit_rows"] = len(rejection_audit_rows)
        total["rejection_audit_path"] = str(out_path)

    return total


def score_run() -> dict[str, Any]:
    """Chấm lại các xe đang ở NORMALIZED (pipeline tách bước)."""
    init_db()
    conn = connect()
    out = {"rescored": 0, "purged": 0}
    try:
        cur = conn.execute(
            """
            SELECT v.*, s.display_status AS st FROM normalized_vehicles v
            JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
            WHERE s.display_status = 'NORMALIZED'
            """
        )
        phone_counts = build_phone_listing_count_map(conn)
        for r in cur.fetchall():
            rec = {k: r[k] for k in r.keys() if k != "st"}
            vid = rec["vehicle_id"]
            enriched = enrich_record(conn, vid, rec)
            if DI_LINH_SHOWROOM:
                spc = listing_count_for_phone(phone_counts, rec.get("phone"))
                ok_dl, _ = di_linh_evaluate(
                    enriched, same_phone_listing_count=spc
                )
                if not ok_dl:
                    purge_vehicle_from_showroom_dataset(
                        conn, vid, rec["source_name"], str(rec["source_listing_id"])
                    )
                    out["purged"] += 1
                    continue
            total, flags, _ns, parts = apply_scoring_to_state("NORMALIZED", enriched)
            rules = load_rules()
            fs = gate_after_score("SCORED", enriched, total, flags)
            if DI_LINH_SHOWROOM and fs != "DISPLAY_READY":
                purge_vehicle_from_showroom_dataset(
                    conn, vid, rec["source_name"], str(rec["source_listing_id"])
                )
                out["purged"] += 1
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
                    fs,
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
            audit(conn, vid, "SCORE_RUN", fs, {"score": total, "parts": parts})
            out["rescored"] += 1
        conn.commit()
    finally:
        conn.close()
    return out


def ingest_worker_main(result_queue: Any) -> None:
    try:
        out = ingest_run()
        from lanes.auto.showroom.showroom.showroom_service import export_gara_final_csv

        rows = export_gara_final_csv()
        result_queue.put(("ok", {"result": out, "rows": rows}))
    except Exception:
        result_queue.put(("err", traceback.format_exc()))
