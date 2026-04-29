"""LOCK 3 — DEDUP: không tạo card trùng."""

from __future__ import annotations

import re
import sqlite3
from typing import Any


def _norm_title(t: str) -> str:
    t = (t or "").lower().strip()
    t = re.sub(r"\s+", " ", t)
    return t[:120]


def find_duplicate_vehicle_id(
    conn: sqlite3.Connection,
    record: dict[str, Any],
) -> str | None:
    """Trả vehicle_id trùng nếu có."""
    cur = conn.execute(
        "SELECT vehicle_id FROM normalized_vehicles WHERE source_url = ?",
        (record["source_url"],),
    )
    row = cur.fetchone()
    if row:
        return str(row[0])

    cur = conn.execute(
        """
        SELECT vehicle_id FROM normalized_vehicles
        WHERE source_name = ? AND source_listing_id = ?
        """,
        (record["source_name"], record["source_listing_id"]),
    )
    row = cur.fetchone()
    if row:
        return str(row[0])

    nt = _norm_title(record.get("title") or "")
    price = int(record.get("price") or 0)
    loc = (record.get("location") or "")[:40]
    phone = (record.get("phone") or "").replace(" ", "")

    cur = conn.execute(
        """
        SELECT vehicle_id, title, price, location, phone FROM normalized_vehicles
        WHERE source_name = ?
        """,
        (record["source_name"],),
    )
    for r in cur.fetchall():
        if phone and (r["phone"] or "").replace(" ", "") == phone:
            if _norm_title(r["title"] or "") == nt:
                return str(r["vehicle_id"])
        if (
            nt
            and _norm_title(r["title"] or "") == nt
            and int(r["price"] or 0) == price
            and loc
            and (r["location"] or "")[:40] == loc
        ):
            return str(r["vehicle_id"])
    return None
