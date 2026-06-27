"""SQLite — raw + normalized + state + audit + actions."""

from __future__ import annotations

import json
import sqlite3
import time
from typing import Any

from lanes.auto.showroom.paths import db_path


SCHEMA_VERSION = 2


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = connect()
    try:
        conn.executescript(
            """
            PRAGMA journal_mode=WAL;

            CREATE TABLE IF NOT EXISTS meta (
              key TEXT PRIMARY KEY,
              value TEXT
            );

            CREATE TABLE IF NOT EXISTS raw_listings (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              source_name TEXT NOT NULL,
              source_listing_id TEXT NOT NULL,
              seed_url TEXT,
              listing_json TEXT,
              raw_payload_path TEXT,
              created_at REAL NOT NULL,
              UNIQUE(source_name, source_listing_id)
            );

            CREATE TABLE IF NOT EXISTS normalized_vehicles (
              vehicle_id TEXT PRIMARY KEY,
              source_name TEXT NOT NULL,
              source_listing_id TEXT NOT NULL,
              source_url TEXT NOT NULL,
              title TEXT,
              brand TEXT,
              model TEXT,
              year INTEGER,
              price INTEGER,
              location TEXT,
              mileage TEXT,
              body_hint TEXT,
              seller_type TEXT,
              seller_name TEXT,
              phone TEXT,
              image_url TEXT,
              collected_at REAL NOT NULL,
              raw_payload_ref TEXT,
              pipeline_status TEXT NOT NULL DEFAULT 'NEW',
              UNIQUE(source_name, source_listing_id),
              UNIQUE(source_url)
            );

            CREATE INDEX IF NOT EXISTS idx_nv_source_listing
              ON normalized_vehicles(source_name, source_listing_id);
            CREATE INDEX IF NOT EXISTS idx_nv_collected ON normalized_vehicles(collected_at);

            CREATE TABLE IF NOT EXISTS showroom_state (
              vehicle_id TEXT PRIMARY KEY,
              score INTEGER NOT NULL DEFAULT 0,
              system_flags_json TEXT NOT NULL DEFAULT '{}',
              human_flags_json TEXT NOT NULL DEFAULT '{}',
              display_status TEXT NOT NULL DEFAULT 'NEW',
              operator_state_json TEXT NOT NULL DEFAULT '{}',
              score_version TEXT,
              updated_at REAL NOT NULL,
              FOREIGN KEY(vehicle_id) REFERENCES normalized_vehicles(vehicle_id)
            );

            CREATE TABLE IF NOT EXISTS audit_events (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              vehicle_id TEXT,
              step TEXT NOT NULL,
              message TEXT NOT NULL,
              meta_json TEXT,
              created_at REAL NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_audit_v ON audit_events(vehicle_id);

            CREATE TABLE IF NOT EXISTS action_logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              vehicle_id TEXT NOT NULL,
              action_type TEXT NOT NULL,
              meta_json TEXT,
              created_at REAL NOT NULL,
              FOREIGN KEY(vehicle_id) REFERENCES normalized_vehicles(vehicle_id)
            );
            """
        )
        conn.execute(
            "INSERT OR REPLACE INTO meta(key,value) VALUES('schema_version', ?)",
            (str(SCHEMA_VERSION),),
        )
        conn.commit()
    finally:
        conn.close()
    migrate_showroom_state_v2()
    migrate_showroom_state_quality()
    migrate_showroom_state_geo_priority()


def migrate_showroom_state_v2() -> None:
    """Phase 2: thêm cột pricing / phone / image — không phá bảng cũ."""
    conn = connect()
    try:
        cur = conn.execute("PRAGMA table_info(showroom_state)")
        cols = {str(r[1]) for r in cur.fetchall()}
        alters: list[tuple[str, str]] = [
            ("price_ratio", "REAL"),
            ("price_bucket", "TEXT"),
            ("median_price_used", "REAL"),
            ("phone_type", "TEXT"),
            ("image_valid", "INTEGER DEFAULT 0"),
            ("image_size_bytes", "INTEGER DEFAULT 0"),
        ]
        for name, decl in alters:
            if name not in cols:
                conn.execute(f"ALTER TABLE showroom_state ADD COLUMN {name} {decl}")
        conn.commit()
    finally:
        conn.close()


def migrate_showroom_state_quality() -> None:
    """Tuổi xe + km (chuẩn showroom)."""
    conn = connect()
    try:
        cur = conn.execute("PRAGMA table_info(showroom_state)")
        cols = {str(r[1]) for r in cur.fetchall()}
        for name, decl in (
            ("vehicle_age", "INTEGER"),
            ("mileage_km", "INTEGER"),
        ):
            if name not in cols:
                conn.execute(f"ALTER TABLE showroom_state ADD COLUMN {name} {decl}")
        conn.commit()
    finally:
        conn.close()


def migrate_showroom_state_geo_priority() -> None:
    """Cột geo_priority (CORE / NEAR / EXTENDED / UNKNOWN)."""
    from lanes.auto.showroom.geo_allowlist import compute_geo_priority

    conn = connect()
    try:
        cur = conn.execute("PRAGMA table_info(showroom_state)")
        cols = {str(r[1]) for r in cur.fetchall()}
        added = False
        if "geo_priority" not in cols:
            conn.execute(
                "ALTER TABLE showroom_state ADD COLUMN geo_priority TEXT NOT NULL DEFAULT 'UNKNOWN'"
            )
            added = True
        conn.commit()
        if added:
            cur = conn.execute(
                "SELECT v.vehicle_id, v.location FROM normalized_vehicles v "
                "JOIN showroom_state s ON s.vehicle_id = v.vehicle_id"
            )
            for r in cur.fetchall():
                gp = compute_geo_priority(r["location"])
                conn.execute(
                    "UPDATE showroom_state SET geo_priority=? WHERE vehicle_id=?",
                    (gp, r["vehicle_id"]),
                )
            conn.commit()
    finally:
        conn.close()


def now_ts() -> float:
    return time.time()


def jdump(d: Any) -> str:
    return json.dumps(d, ensure_ascii=False, separators=(",", ":"))


def jload(s: str | None) -> Any:
    if not s:
        return {}
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        return {}
