"""
Showroom Di Linh — gate cứng: chỉ xe đạt chuẩn mới nằm trong dataset showroom.
Không dùng HOLD/REVIEW; xe fail bị loại khỏi DB showroom (normalized + state + raw).
"""

from __future__ import annotations

import os
import re
import sqlite3
import unicodedata
from typing import Any

from lanes.auto.showroom.geo_allowlist import classify_geo

# Bật toàn bộ lane showroom hiện tại = Di Linh (một file cấu hình).
DI_LINH_SHOWROOM = True

_MIN_MODEL_YEAR = 2021
_MAX_KM = 80000
SHOWROOM_MIN_MODEL_YEAR = _MIN_MODEL_YEAR
SHOWROOM_MAX_KM = _MAX_KM

# Cùng SĐT (chuẩn hóa) xuất hiện trên >= N tin → coi là tài khoản bán chuyên, loại khỏi showroom.
_PRO_SELLER_MIN_LISTINGS = 3

_SELLER_TYPE_REJECT = frozenset(
    {"dealer", "shop", "showroom", "salon", "agency", "company"}
)


def _fold_ascii(s: str) -> str:
    if not s:
        return ""
    t = unicodedata.normalize("NFD", s)
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return t.lower()


def _digits_phone(s: str | None) -> str:
    if not s:
        return ""
    return re.sub(r"\D+", "", str(s))


def build_phone_listing_count_map(conn: sqlite3.Connection) -> dict[str, int]:
    """Đếm số tin đang có trong normalized_vehicles theo SĐT chuẩn hóa (>= 9 số)."""
    m: dict[str, int] = {}
    for r in conn.execute("SELECT phone FROM normalized_vehicles"):
        d = _digits_phone(r["phone"])
        if len(d) < 9:
            continue
        m[d] = m.get(d, 0) + 1
    return m


def same_phone_listing_count(conn: sqlite3.Connection, phone: str | None) -> int:
    d = _digits_phone(phone)
    if len(d) < 9:
        return 0
    n = 0
    for r in conn.execute("SELECT phone FROM normalized_vehicles"):
        if _digits_phone(r["phone"]) == d:
            n += 1
    return n


def listing_count_for_phone(phone_counts: dict[str, int], phone: str | None) -> int:
    d = _digits_phone(phone or "")
    return phone_counts.get(d, 0) if len(d) >= 9 else 0


def _text_signals_salon(title: str, seller_name: str) -> bool:
    blob = _fold_ascii(f"{title} {seller_name}")
    if not blob.strip():
        return False
    vn_markers = (
        "gara",
        "moi gioi",
        "co xe",
        "salon",
        "showroom",
        "dai ly",
        "cua hang",
        "cua hang xe",
        "dai ly o to",
        "oto salon",
        "xe salon",
    )
    if any(x in blob for x in vn_markers):
        return True
    if re.search(r"(?<![a-z0-9])auto(?![a-z0-9])", blob):
        return True
    if "dealer" in blob:
        return True
    return False


def _seller_type_blocked(seller_type: str | None) -> bool:
    st = (seller_type or "").strip().lower()
    return st in _SELLER_TYPE_REJECT


def di_linh_evaluate(
    enriched: dict[str, Any],
    *,
    same_phone_listing_count: int | None = None,
) -> tuple[bool, str]:
    """
    Trả (True, "") nếu đủ điều kiện lưu showroom; else (False, mã lý do).
    Mã: SELLER_TYPE | IMAGE | GEO | AGE | KM | KM_UNKNOWN
    """
    if _seller_type_blocked(enriched.get("seller_type")):
        return False, "SELLER_TYPE"
    if _text_signals_salon(
        str(enriched.get("title") or ""),
        str(enriched.get("seller_name") or ""),
    ):
        return False, "SELLER_TYPE"
    if same_phone_listing_count is not None and int(same_phone_listing_count) >= _PRO_SELLER_MIN_LISTINGS:
        return False, "SELLER_TYPE"
    if not bool(enriched.get("image_valid")):
        return False, "IMAGE"
    if classify_geo(enriched.get("location") or "") != "IN":
        return False, "GEO"
    year_i = int(enriched.get("year") or 0)
    if year_i < _MIN_MODEL_YEAR:
        return False, "AGE"
    mkm = enriched.get("mileage_km")
    if mkm is None:
        return False, "KM_UNKNOWN"
    if int(mkm) >= _MAX_KM:
        return False, "KM"
    return True, ""


def purge_vehicle_from_showroom_dataset(
    conn: sqlite3.Connection,
    vehicle_id: str,
    source_name: str,
    source_listing_id: str,
) -> None:
    """Xóa khỏi dataset showroom (file raw trên đĩa → state → normalized → raw_listings)."""
    raw_paths: set[str] = set()
    cur = conn.execute(
        "SELECT raw_payload_ref FROM normalized_vehicles WHERE vehicle_id=?",
        (vehicle_id,),
    )
    row = cur.fetchone()
    if row and row["raw_payload_ref"]:
        raw_paths.add(str(row["raw_payload_ref"]).strip())
    cur2 = conn.execute(
        "SELECT raw_payload_path FROM raw_listings WHERE source_name=? AND source_listing_id=?",
        (source_name, str(source_listing_id)),
    )
    row2 = cur2.fetchone()
    if row2 and row2["raw_payload_path"]:
        raw_paths.add(str(row2["raw_payload_path"]).strip())

    conn.execute("DELETE FROM action_logs WHERE vehicle_id=?", (vehicle_id,))
    conn.execute("DELETE FROM showroom_state WHERE vehicle_id=?", (vehicle_id,))
    conn.execute("DELETE FROM normalized_vehicles WHERE vehicle_id=?", (vehicle_id,))
    conn.execute(
        "DELETE FROM raw_listings WHERE source_name=? AND source_listing_id=?",
        (source_name, str(source_listing_id)),
    )
    for p in raw_paths:
        if p and os.path.isfile(p):
            try:
                os.remove(p)
            except OSError:
                pass


def purge_all_not_display_ready(conn: sqlite3.Connection) -> int:
    """Dọn mọi xe không DISPLAY_READY khỏi dataset (một lần / đầu ingest)."""
    cur = conn.execute(
        """
        SELECT v.vehicle_id, v.source_name, v.source_listing_id
        FROM normalized_vehicles v
        JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
        WHERE s.display_status != 'DISPLAY_READY'
        """
    )
    n = 0
    for r in cur.fetchall():
        purge_vehicle_from_showroom_dataset(
            conn, r["vehicle_id"], r["source_name"], str(r["source_listing_id"])
        )
        n += 1
    return n
