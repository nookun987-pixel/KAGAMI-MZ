"""Controlled GARA V2 seed path.

This module seeds exactly one private-party showroom row using the existing
showroom DB contract. It avoids the legacy scout collectors and honors the
SHOWROOM_DATA_DIR redirect via the shared DB connection helpers.
"""

from __future__ import annotations

import json
from collections.abc import Mapping
from typing import Any, Dict

from lanes.auto.showroom.db import connect, init_db
from lanes.auto.showroom.geo_allowlist import compute_geo_priority

SEED_SOURCE_NAME = "gara_seed_v2"
SEED_SOURCE_LISTING_ID = "gara-v2-private-party-0001"
SEED_VEHICLE_ID = "gara-v2-private-party-0001"
SEED_SEED_URL = "https://example.com/gara/v2/seed/private-party-0001"
SEED_SOURCE_URL = "https://example.com/gara/v2/listings/private-party-0001"
SEED_RAW_PAYLOAD_REF = "seed:gara_v2:private_party_0001"
SEED_RAW_PAYLOAD_PATH = ""
SEED_COLLECTED_AT = "2025-05-01T00:00:00+00:00"
SEED_SCORE_VERSION = "gara_seed_v2"


def build_seed_record() -> Dict[str, Any]:
    """Return the single controlled row that this module writes."""

    location = "TP HCM, Quan 7"
    record: Dict[str, Any] = {
        "vehicle_id": SEED_VEHICLE_ID,
        "source_name": SEED_SOURCE_NAME,
        "source_listing_id": SEED_SOURCE_LISTING_ID,
        "seed_url": SEED_SEED_URL,
        "source_url": SEED_SOURCE_URL,
        "title": "Mazda CX5 2022 chinh chu gia dinh",
        "brand": "Mazda",
        "model": "CX-5",
        "year": 2022,
        "price": 835000000,
        "location": location,
        "mileage": 42000,
        "mileage_km": 42000,
        "body_hint": "SUV",
        "seller_type": "private",
        "seller_name": "Chu xe",
        "phone": "0900000000",
        "image_url": "https://example.com/gara/v2/listings/private-party-0001.jpg",
        "collected_at": SEED_COLLECTED_AT,
        "raw_payload_ref": SEED_RAW_PAYLOAD_REF,
        "pipeline_status": "NORMALIZED",
        "display_status": "DISPLAY_READY",
        "score": 90,
        "geo_priority": compute_geo_priority(location),
        "score_version": SEED_SCORE_VERSION,
    }
    return record


def _coerce_scoring_result(
    result: Any,
    record: Mapping[str, Any],
) -> tuple[int, Dict[str, Any]]:
    """Normalize a scoring helper result into a score and flags dict."""

    score_value = record.get("score", 0)
    flags: Dict[str, Any] = {}

    if isinstance(result, tuple):
        if result:
            score_value = result[0]
        if len(result) > 1 and isinstance(result[1], Mapping):
            flags = dict(result[1])
    elif isinstance(result, Mapping):
        score_value = result.get("score", result.get("total", score_value))
        maybe_flags = result.get("flags", result.get("system_flags", {}))
        if isinstance(maybe_flags, Mapping):
            flags = dict(maybe_flags)

    try:
        score_int = int(score_value)
    except (TypeError, ValueError):
        score_int = int(record.get("score", 0))

    return score_int, flags


def _coerce_gate_result(result: Any, fallback: str = "DISPLAY_READY") -> str:
    """Normalize the gate helper result into a display status string."""

    if isinstance(result, str) and result:
        return result
    if isinstance(result, Mapping):
        status = result.get("display_status") or result.get("status")
        if isinstance(status, str) and status:
            return status
    if isinstance(result, tuple) and result:
        first = result[0]
        if isinstance(first, str) and first:
            return first
    if result:
        return fallback
    return "REJECTED"


def _update_showroom_state(
    conn,
    vehicle_id: str,
    score: int,
    display_status: str,
    flags: Mapping[str, Any],
    record: Mapping[str, Any],
) -> None:
    system_flags_json = json.dumps(flags, ensure_ascii=False, sort_keys=True)
    human_flags_json = json.dumps({}, ensure_ascii=False, sort_keys=True)
    operator_state_json = json.dumps(
        {
            "seed": SEED_SCORE_VERSION,
            "source_name": record.get("source_name"),
            "source_listing_id": record.get("source_listing_id"),
        },
        ensure_ascii=False,
        sort_keys=True,
    )
    conn.execute(
        """
        UPDATE showroom_state
        SET score = ?,
            display_status = ?,
            system_flags_json = ?,
            human_flags_json = ?,
            operator_state_json = ?,
            score_version = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE vehicle_id = ?
        """,
        (
            score,
            display_status,
            system_flags_json,
            human_flags_json,
            operator_state_json,
            SEED_SCORE_VERSION,
            vehicle_id,
        ),
    )


def seed_gara_v2(conn=None) -> Dict[str, Any]:
    """Seed one controlled private-party vehicle row into the showroom DB."""

    from lanes.auto.showroom.pipeline import (
        _insert_raw,
        _upsert_vehicle,
        apply_scoring_to_state,
        gate_after_score,
        gate_normalized_record,
    )

    init_db()
    close_conn = False
    if conn is None:
        conn = connect()
        close_conn = True

    try:
        record = build_seed_record()

        validation = gate_normalized_record(record)
        if not validation:
            raise ValueError("GARA V2 seed record failed normalized gating")

        raw_payload = {
            "seed_version": SEED_SCORE_VERSION,
            "record": record,
            "notes": "Controlled private-party seed row for showroom contract validation.",
        }
        raw_payload_json = json.dumps(raw_payload, ensure_ascii=False, sort_keys=True)

        _insert_raw(
            conn,
            record["source_name"],
            record["source_listing_id"],
            record["seed_url"],
            raw_payload_json,
            SEED_RAW_PAYLOAD_PATH,
        )
        _upsert_vehicle(conn, record)

        scoring_result = apply_scoring_to_state("NORMALIZED", record)
        score, flags = _coerce_scoring_result(scoring_result, record)

        gate_result = gate_after_score("SCORED", record, score, flags)
        display_status = _coerce_gate_result(gate_result, fallback="DISPLAY_READY")
        if display_status == "REJECTED":
            raise ValueError("GARA V2 seed row did not pass final gating")

        record["score"] = score
        record["display_status"] = display_status
        record["geo_priority"] = compute_geo_priority(record.get("location"))
        record["score_version"] = SEED_SCORE_VERSION

        _update_showroom_state(
            conn=conn,
            vehicle_id=record["vehicle_id"],
            score=score,
            display_status=display_status,
            flags=flags,
            record=record,
        )
        conn.commit()
        return record
    finally:
        if close_conn:
            conn.close()


def main() -> int:
    """CLI entrypoint for manual use."""

    seed_gara_v2()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
