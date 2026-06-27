"""
Làm sạch chuỗi location trước GEO (không đụng geo_allowlist).
Chỉ sửa khi nguồn gán sai tỉnh so với địa danh con (Long An).
"""

from __future__ import annotations

import sqlite3

from lanes.auto.showroom.audit.audit_log_service import audit

_PROVINCE_WRONG = "Tây Ninh"
_PROVINCE_TARGET = "Long An"

# Thứ tự ưu tiên kiểm tra (địa danh thuộc Long An, không hardcode trong GEO engine)
_MARKERS: tuple[tuple[str, str], ...] = (
    ("Tân An", "override_province_long_an_tan_an"),
    ("Bến Lức", "override_province_long_an_ben_luc"),
    ("Thủ Thừa", "override_province_long_an_thu_thua"),
)


def cleanup_location_before_geo(location: str | None) -> tuple[str, dict[str, str] | None]:
    """
    Trả về (location_sau_cleanup, meta hoặc None).
    meta gồm: raw_location, cleaned_location, cleanup_rule_applied
    """
    raw = (location or "").strip()
    if not raw or _PROVINCE_WRONG not in raw:
        return raw, None
    for marker, rule in _MARKERS:
        if marker not in raw:
            continue
        cleaned = raw.replace(_PROVINCE_WRONG, _PROVINCE_TARGET, 1)
        if cleaned == raw:
            continue
        return cleaned, {
            "raw_location": raw,
            "cleaned_location": cleaned,
            "cleanup_rule_applied": rule,
        }
    return raw, None


def backfill_location_cleanup(conn: sqlite3.Connection) -> int:
    """Cập nhật normalized_vehicles + audit; trả số bản ghi đã đổi."""
    n = 0
    cur = conn.execute("SELECT vehicle_id, location FROM normalized_vehicles")
    for row in cur.fetchall():
        vid = row["vehicle_id"]
        loc = row["location"]
        cleaned, meta = cleanup_location_before_geo(loc)
        if not meta:
            continue
        conn.execute(
            "UPDATE normalized_vehicles SET location=? WHERE vehicle_id=?",
            (cleaned, vid),
        )
        audit(
            conn,
            vid,
            "LOCATION_CLEANUP",
            meta["cleanup_rule_applied"],
            {
                "raw_location": meta["raw_location"],
                "cleaned_location": meta["cleaned_location"],
            },
        )
        n += 1
    return n
