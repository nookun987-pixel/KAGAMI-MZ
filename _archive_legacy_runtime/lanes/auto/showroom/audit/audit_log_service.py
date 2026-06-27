"""Audit + action log (LOCK 8, LOCK 7)."""

from __future__ import annotations

import sqlite3
from typing import Any

from lanes.auto.showroom.db import connect, jdump, now_ts
def audit(
    conn: sqlite3.Connection,
    vehicle_id: str | None,
    step: str,
    message: str,
    meta: dict[str, Any] | None = None,
) -> None:
    conn.execute(
        """
        INSERT INTO audit_events(vehicle_id, step, message, meta_json, created_at)
        VALUES(?,?,?,?,?)
        """,
        (vehicle_id, step, message, jdump(meta or {}), now_ts()),
    )


def log_action(
    conn: sqlite3.Connection,
    vehicle_id: str,
    action_type: str,
    meta: dict[str, Any] | None = None,
) -> None:
    conn.execute(
        """
        INSERT INTO action_logs(vehicle_id, action_type, meta_json, created_at)
        VALUES(?,?,?,?)
        """,
        (vehicle_id, action_type, jdump(meta or {}), now_ts()),
    )
    audit(conn, vehicle_id, "ACTION", action_type, meta)


def audit_summary_for_vehicle(vehicle_id: str, limit: int = 30) -> list[dict[str, Any]]:
    conn = connect()
    try:
        cur = conn.execute(
            """
            SELECT step, message, meta_json, created_at FROM audit_events
            WHERE vehicle_id = ? ORDER BY id DESC LIMIT ?
            """,
            (vehicle_id, limit),
        )
        rows = []
        for r in cur.fetchall():
            rows.append(
                {
                    "step": r["step"],
                    "message": r["message"],
                    "meta": r["meta_json"],
                    "created_at": r["created_at"],
                }
            )
        return list(reversed(rows))
    finally:
        conn.close()
