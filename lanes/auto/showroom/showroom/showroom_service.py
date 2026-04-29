"""Truy vấn sàn showroom MIKAGE — chỉ DISPLAY_READY; không expanded/review UI."""

from __future__ import annotations

import json
import os
import sqlite3
import time
from datetime import date
from datetime import datetime
from typing import Any

_ORDER_COLLECTED_DESC = "v.collected_at DESC"
_ORDER_SCORE_DESC = "s.score DESC, v.collected_at DESC"
GARA_SPREADSHEET_TITLE = "GARA QP - MIKAGE"
GARA_WORKSHEET_TITLE = "GARA_LISTING"
GARA_LISTING_HEADER = [
    "listing_url",
    "title",
    "price",
    "year",
    "odometer_km",
    "region",
    "source",
    "created_at",
]

from lanes.auto.showroom.di_linh_showroom_gate import (
    DI_LINH_SHOWROOM,
    SHOWROOM_MIN_MODEL_YEAR,
    SHOWROOM_MAX_KM,
    _text_signals_salon,
    _SELLER_TYPE_REJECT,
)
from lanes.auto.showroom.geo_allowlist import classify_geo
from lanes.auto.showroom.db import connect, jload, init_db
from lanes.auto.showroom.scoring.engine import load_rules
from lanes.auto.showroom.scoring.enrich import review_reasons


def _main_floor_min_model_year() -> int:
    return int(SHOWROOM_MIN_MODEL_YEAR)


def _sql_main_floor_rules_clause() -> str:
    """SQL: năm đăng ký đủ mới + km trong ngưỡng + ảnh hợp lệ."""
    y0 = _main_floor_min_model_year()
    km = int(SHOWROOM_MAX_KM)
    img = " AND s.image_valid = 1 " if DI_LINH_SHOWROOM else ""
    return (
        f" AND COALESCE(v.year, 0) >= {y0} "
        f" AND s.mileage_km IS NOT NULL AND s.mileage_km < {km} "
        + img
    )


def _row_passes_geo_main_floor(r: sqlite3.Row) -> bool:
    loc = r["location"] if r["location"] is not None else ""
    return classify_geo(str(loc)) == "IN"


def _expanded_reason_codes(r: sqlite3.Row, c: dict[str, Any]) -> list[str]:
    """Nhãn lý do trên xe mở rộng (không đổi gate engine — chỉ hiển thị)."""
    codes: list[str] = []
    year_i = int(r["year"] or 0)
    if year_i > 0 and year_i < SHOWROOM_MIN_MODEL_YEAR:
        codes.append("HOLD_AGE")
    mkm = c.get("mileage_km")
    if mkm is not None and int(mkm) >= SHOWROOM_MAX_KM:
        codes.append("HOLD_KM")
    g = classify_geo(str(r["location"] or ""))
    if g == "OUT":
        codes.append("HOLD_GEO")
    elif g == "UNKNOWN":
        codes.append("REVIEW_GEO")
    st = (r["display_status"] or "").strip().upper()
    if st == "REVIEW" and not codes:
        codes.append("REVIEW_OTHER")
    elif st == "HOLD" and not codes:
        codes.append("HOLD_OTHER")
    return codes


def _row_to_card(r: sqlite3.Row) -> dict[str, Any]:
    flags = jload(r["system_flags_json"])
    human = jload(r["human_flags_json"])
    out: dict[str, Any] = {
        "vehicle_id": r["vehicle_id"],
        "source_name": r["source_name"],
        "title": r["title"],
        "brand": r["brand"],
        "model": r["model"],
        "year": int(r["year"] or 0),
        "price": int(r["price"] or 0),
        "location": r["location"],
        "mileage": r["mileage"],
        "body_hint": r["body_hint"],
        "seller_type": r["seller_type"],
        "seller_name": r["seller_name"],
        "phone": r["phone"],
        "image_url": r["image_url"],
        "source_url": r["source_url"],
        "collected_at": r["collected_at"],
        "score": int(r["score"] or 0),
        "flags": flags,
        "human": human,
        "display_status": r["display_status"],
    }
    ks = set(r.keys())
    if "geo_priority" in ks:
        out["geo_priority"] = (r["geo_priority"] or "UNKNOWN").strip() or "UNKNOWN"
    else:
        out["geo_priority"] = "UNKNOWN"
    if "price_ratio" in ks:
        out["price_ratio"] = r["price_ratio"]
        out["price_bucket"] = r["price_bucket"]
        out["median_price_used"] = r["median_price_used"]
        out["phone_type"] = r["phone_type"]
        iv = r["image_valid"]
        out["image_valid"] = bool(iv) if iv is not None else False
        out["image_size_bytes"] = int(r["image_size_bytes"] or 0)
    if "vehicle_age" in ks and r["vehicle_age"] is not None:
        out["vehicle_age"] = int(r["vehicle_age"])
    if "mileage_km" in ks and r["mileage_km"] is not None:
        out["mileage_km"] = int(r["mileage_km"])
    return out


def _load_env_once() -> None:
    try:
        from dotenv import load_dotenv as _ld
        _repo_root = __import__("pathlib").Path(__file__).resolve().parents[4]
        _ld(_repo_root / ".env", override=False)
        _ld(_repo_root / "mikage-operator" / ".env", override=False)
    except Exception:
        pass


def _format_created_at(value: Any) -> str:
    try:
        ts = float(value or 0)
        if ts <= 0:
            return ""
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return ""


def _gara_output_rows() -> list[dict[str, str]]:
    rows = list_display_ready("private_only", private_only=True)
    out: list[dict[str, str]] = []
    for r in rows:
        listing_url = str(r.get("source_url") or "").strip()
        if not listing_url:
            continue
        odometer_km = r.get("mileage_km")
        out.append(
            {
                "listing_url": listing_url,
                "title": str(r.get("title") or "").strip(),
                "price": str(r.get("price") or "").strip(),
                "year": str(r.get("year") or "").strip(),
                "odometer_km": str(odometer_km or ""),
                "region": str(r.get("location") or "").strip(),
                "source": str(r.get("source_name") or "").strip(),
                "created_at": _format_created_at(r.get("collected_at")),
            }
        )
    return out


def _authorize_gsheet_client():
    _load_env_once()
    cred_path = (
        (os.environ.get("GARA_GSHEET_CREDENTIALS_JSON") or "").strip()
        or (os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") or "").strip()
    )
    if not cred_path:
        raise RuntimeError("GARA_GSHEET_CREDENTIALS_MISSING")
    import gspread
    from google.oauth2.service_account import Credentials

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(cred_path, scopes=scopes)
    return gspread.authorize(creds)


def _ensure_worksheet(spreadsheet, title: str):
    from gspread.exceptions import WorksheetNotFound

    try:
        return spreadsheet.worksheet(title)
    except WorksheetNotFound:
        return spreadsheet.add_worksheet(title=title, rows=2000, cols=len(GARA_LISTING_HEADER))


def _write_gara_listing_sheet(rows: list[dict[str, str]]) -> int:
    client = _authorize_gsheet_client()
    sheet_id = (os.environ.get("GARA_GSHEET_ID") or "").strip()
    if not sheet_id:
        raise RuntimeError("GARA_GSHEET_ID_MISSING")
    sh = client.open_by_key(sheet_id)
    ws = _ensure_worksheet(sh, GARA_WORKSHEET_TITLE)
    values = [GARA_LISTING_HEADER]
    for row in rows:
        values.append([row.get(k, "") for k in GARA_LISTING_HEADER])
    ws.clear()
    ws.update("A1", values)
    return max(0, len(values) - 1)


def _format_gara_telegram_message(row: dict[str, str]) -> str:
    return (
        f"{row.get('title', '')}\n"
        f"Giá: {row.get('price', '')}\n"
        f"Năm: {row.get('year', '')}\n"
        f"Km: {row.get('odometer_km', '')}\n"
        f"Khu vực: {row.get('region', '')}\n"
        f"Nguồn: {row.get('source', '')}\n"
        f"Link: {row.get('listing_url', '')}"
    )


def _send_gara_telegram_message(text: str) -> bool:
    _load_env_once()
    token = (os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip()
    chat_id = (os.environ.get("TELEGRAM_CHAT_ID_GARA") or "").strip()
    if not token or not chat_id:
        return False
    import urllib.parse as _urlparse
    import urllib.request as _urlreq

    body = _urlparse.urlencode({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = _urlreq.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with _urlreq.urlopen(req, timeout=20) as resp:
            return int(getattr(resp, "status", 200)) == 200
    except Exception:
        return False


def export_gara_listing_output() -> dict[str, Any]:
    rows = _gara_output_rows()
    rows_written = _write_gara_listing_sheet(rows) if rows else 0
    telegram_sent = 0
    for row in rows:
        if _send_gara_telegram_message(_format_gara_telegram_message(row)):
            telegram_sent += 1
    return {
        "rows_written": rows_written,
        "telegram_sent": telegram_sent,
        "sample_rows": rows[:2],
    }


_SELECT_JOIN = """
        SELECT v.*, s.score, s.system_flags_json, s.human_flags_json, s.display_status,
               s.price_ratio, s.price_bucket, s.median_price_used, s.phone_type, s.image_valid, s.image_size_bytes,
               s.vehicle_age, s.mileage_km, s.geo_priority
        FROM normalized_vehicles v
        JOIN showroom_state s ON s.vehicle_id = v.vehicle_id
"""


def _normalize_filter_key(filter_key: str | None) -> str:
    fk = (filter_key or "all").strip().lower()
    return fk if fk else "all"


def _exclude_vehicle_clause(exclude: set[str] | None) -> tuple[str, list[Any]]:
    if not exclude:
        return "", []
    xs = sorted(exclude)
    ph = ",".join("?" * len(xs))
    return f" AND v.vehicle_id NOT IN ({ph})", list(xs)


def _fetch_display_ready_slice(
    conn: sqlite3.Connection,
    filter_key: str,
    order_sql: str,
    limit: int | None,
    exclude: set[str] | None,
) -> list[dict[str, Any]]:
    if order_sql not in {_ORDER_COLLECTED_DESC, _ORDER_SCORE_DESC}:
        raise ValueError("invalid order_sql")
    ex_clause, ex_params = _exclude_vehicle_clause(exclude)
    q = (
        _SELECT_JOIN
        + """
        WHERE s.display_status = 'DISPLAY_READY'
        """
        + _sql_main_floor_rules_clause()
        + _sql_vehicle_filter_clauses(filter_key)
        + ex_clause
        + " ORDER BY "
        + order_sql
    )
    if limit is not None:
        q += " LIMIT " + str(int(limit))
    cur = conn.execute(q, ex_params)
    out: list[dict[str, Any]] = []
    for r in cur.fetchall():
        if not _row_passes_geo_main_floor(r):
            continue
        out.append(_row_to_card(r))
    return out


def _sql_vehicle_filter_clauses(filter_key: str | None) -> str:
    """Điều kiện AND trên bảng normalized_vehicles (alias v) — dùng chung kho DISPLAY_READY và khu mở rộng."""
    fk = _normalize_filter_key(filter_key)
    if fk == "all":
        return ""
    if fk == "under_500m":
        return " AND v.price > 0 AND v.price < 500000000"
    if fk == "under_1b":
        return " AND v.price > 0 AND v.price < 1000000000"
    if fk == "sedan":
        return " AND v.body_hint = 'sedan'"
    if fk == "suv":
        return " AND v.body_hint = 'suv'"
    if fk == "pickup":
        return " AND v.body_hint = 'pickup'"
    if fk == "owner":
        return " AND v.seller_type = 'owner'"
    if fk == "has_phone":
        return " AND length(trim(coalesce(v.phone,''))) > 4"
    if fk == "private_only":
        return (
            " AND (v.seller_type IS NULL OR trim(v.seller_type) = ''"
            " OR lower(v.seller_type) NOT IN ('dealer','shop','showroom','salon','agency','company'))"
        )
    return ""


def _is_private_only(card: dict[str, Any]) -> bool:
    """Post-filter: loại bỏ salon/showroom/đại lý dựa trên seller_type, title, seller_name.
    Dùng sau SQL để bắt edge case gate không dính."""
    st = (card.get("seller_type") or "").strip().lower()
    if st in _SELLER_TYPE_REJECT:
        return False
    if _text_signals_salon(str(card.get("title") or ""), str(card.get("seller_name") or "")):
        return False
    return True


def list_display_ready(
    filter_key: str = "all",
    exclude_vehicle_ids: list[str] | None = None,
    private_only: bool = False,
) -> list[dict[str, Any]]:
    """Kho DISPLAY_READY (mặc định sort theo điểm). Có thể loại một số vehicle_id (vd: đã dùng ở strip trên).
    private_only=True → chỉ trả xe cá nhân (không salon/showroom/đại lý)."""
    init_db()
    ex = set(exclude_vehicle_ids) if exclude_vehicle_ids else None
    conn = connect()
    try:
        rows = _fetch_display_ready_slice(
            conn, filter_key, _ORDER_SCORE_DESC, None, ex
        )
    finally:
        conn.close()
    if private_only:
        rows = [r for r in rows if _is_private_only(r)]
    return rows


def list_expanded_inventory(filter_key: str = "all") -> list[dict[str, Any]]:
    """
    XE MỞ RỘNG: chỉ HOLD/REVIEW (không DISPLAY_READY).
    Lọc tối thiểu: ảnh hợp lệ, có title, giá > 0; áp bộ lọc dropdown như kho.
    """
    if DI_LINH_SHOWROOM:
        return []
    init_db()
    conn = connect()
    try:
        extra = _sql_vehicle_filter_clauses(filter_key)
        q = (
            _SELECT_JOIN
            + """
        WHERE s.display_status IN ('HOLD', 'REVIEW')
          AND s.image_valid = 1
          AND length(trim(coalesce(v.title, ''))) > 0
          AND v.price > 0
        """
            + extra
            + " ORDER BY s.score DESC, v.collected_at DESC"
        )
        cur = conn.execute(q, [])
        out: list[dict[str, Any]] = []
        for r in cur.fetchall():
            c = _row_to_card(r)
            c["inventory_tier"] = "expanded"
            st = (r["display_status"] or "").strip().upper()
            rc = _expanded_reason_codes(r, c)
            c["reason_codes"] = rc
            if st == "HOLD":
                c["status_label"] = "TẠM GIỮ (HOLD) — không đủ điều kiện sàn chính"
                c["expanded_badges"] = [
                    "XE MỞ RỘNG",
                    "HOLD",
                    "KHÔNG HIỂN THỊ Ở SÀN CHÍNH",
                ]
            else:
                c["status_label"] = "CẦN XEM LẠI — chưa đủ điều kiện sàn chính"
                c["expanded_badges"] = [
                    "XE MỞ RỘNG",
                    "REVIEW",
                    "KHÔNG HIỂN THỊ Ở SÀN CHÍNH",
                ]
            out.append(c)
        return out
    finally:
        conn.close()


def list_review_queue() -> list[dict[str, Any]]:
    if DI_LINH_SHOWROOM:
        return []
    init_db()
    conn = connect()
    try:
        cur = conn.execute(
            _SELECT_JOIN
            + """
            WHERE s.display_status = 'REVIEW'
            ORDER BY s.score DESC, v.collected_at DESC
            """
        )
        cards: list[dict[str, Any]] = []
        for r in cur.fetchall():
            c = _row_to_card(r)
            iv = bool(c.get("image_valid"))
            pt = (c.get("phone_type") or "NONE").upper()
            c["review_reasons"] = review_reasons(c, iv, pt)
            cards.append(c)
        return cards
    finally:
        conn.close()


def sections(private_only: bool = False) -> dict[str, Any]:
    """Strip trên: dataset tách — không dùng chung một list; không lặp vehicle giữa các hàng.
    private_only=True → chỉ trả xe cá nhân (không salon/showroom/đại lý)."""
    init_db()
    rules = load_rules()
    th = rules.get("thresholds", {})
    new_n = int(th.get("new_floor_top_n", 6))
    top_n = int(th.get("highlight_top_n", 8))
    urgent_max = int(th.get("urgent_top_n", 16))

    conn = connect()
    try:
        # 1) Mới lên sàn: DISPLAY_READY, collected_at giảm dần, top N
        new_floor = _fetch_display_ready_slice(
            conn, "all", _ORDER_COLLECTED_DESC, new_n, None
        )
        if private_only:
            new_floor = [c for c in new_floor if _is_private_only(c)]
        new_ids = {c["vehicle_id"] for c in new_floor}

        # 2) Nổi bật: DISPLAY_READY, điểm giảm dần, loại trùng với (1)
        highlight_today = _fetch_display_ready_slice(
            conn, "all", _ORDER_SCORE_DESC, top_n, new_ids
        )
        if private_only:
            highlight_today = [c for c in highlight_today if _is_private_only(c)]
        hi_ids = {c["vehicle_id"] for c in highlight_today}
        used_strip = new_ids | hi_ids

        # 3) Cần gọi ngay: cờ NEN_GOI_NGAY, không trùng (1)∪(2)
        pool = _fetch_display_ready_slice(
            conn, "all", _ORDER_SCORE_DESC, None, used_strip
        )
        if private_only:
            pool = [c for c in pool if _is_private_only(c)]
        urgent = [c for c in pool if c["flags"].get("NEN_GOI_NGAY")][:urgent_max]
        ur_ids = {c["vehicle_id"] for c in urgent}

        strip_vehicle_ids = sorted(new_ids | hi_ids | ur_ids)

        return {
            "new_on_floor": new_floor,
            "highlight_today": highlight_today,
            "call_now": urgent,
            "strip_vehicle_ids": strip_vehicle_ids,
        }
    finally:
        conn.close()


def vehicle_detail(vehicle_id: str) -> dict[str, Any] | None:
    from lanes.auto.showroom.audit.audit_log_service import audit_summary_for_vehicle

    init_db()
    conn = connect()
    try:
        cur = conn.execute(
            _SELECT_JOIN + " WHERE v.vehicle_id = ?",
            (vehicle_id,),
        )
        r = cur.fetchone()
        if not r:
            return None
        card = _row_to_card(r)
        card["audit_tail"] = audit_summary_for_vehicle(vehicle_id, limit=12)
        iv = bool(card.get("image_valid"))
        pt = (card.get("phone_type") or "NONE").upper()
        card["review_reasons"] = review_reasons(card, iv, pt)
        return card
    finally:
        conn.close()


def export_gara_final_csv() -> int:
    """Write lanes/auto/output/final.csv — output contract for gara lane.
    Returns row count. Raises RuntimeError if display-ready set is empty."""
    import csv as _csv
    from pathlib import Path as _Path

    _repo_root = _Path(__file__).resolve().parents[4]
    out_dir = _repo_root / "lanes" / "auto" / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "final.csv"

    rows = list_display_ready("private_only", private_only=True)
    fields = [
        "vehicle_id", "title", "brand", "model", "year", "price",
        "location", "mileage", "seller_type", "seller_name", "phone",
        "image_url", "source_url", "score", "display_status",
        "price_bucket", "phone_type", "geo_priority",
    ]
    with out_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = _csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow({k: (r.get(k) if r.get(k) is not None else "") for k in fields})

    if not rows:
        raise RuntimeError(f"GARA_OUTPUT_CONTRACT_ERROR: final.csv is empty — no DISPLAY_READY private-only vehicles in DB")

    return len(rows)


def export_csv_secondary(path: str) -> int:
    """Output phụ — không dùng làm source of truth."""
    import csv

    rows = list_display_ready("private_only", private_only=True)
    fields = [
        "vehicle_id",
        "title",
        "price",
        "year",
        "location",
        "mileage",
        "seller_type",
        "phone",
        "source_url",
        "score",
        "flags_json",
        "price_bucket",
        "phone_type",
    ]
    with open(path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow(
                {
                    "vehicle_id": r["vehicle_id"],
                    "title": r["title"],
                    "price": r["price"],
                    "year": r["year"],
                    "location": r["location"],
                    "mileage": r["mileage"],
                    "seller_type": r["seller_type"],
                    "phone": r["phone"],
                    "source_url": r["source_url"],
                    "score": r["score"],
                    "flags_json": json.dumps(r["flags"], ensure_ascii=False),
                    "price_bucket": r.get("price_bucket") or "",
                    "phone_type": r.get("phone_type") or "",
                }
            )
    return len(rows)
