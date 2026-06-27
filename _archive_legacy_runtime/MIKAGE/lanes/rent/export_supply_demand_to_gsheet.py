#!/usr/bin/env python3
"""
Sync VCP rent CSV to Google Sheet: dedupe by _sync_key, preserve manual sale columns,
append only new keys; merge-update system columns for existing keys.

Env:
  RENT_GSHEET_ID (required) - spreadsheet id
  RENT_GSHEET_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS - service account JSON path

Tabs: SUPPLY_PRIORITY, DEMAND_READY, BATCH_OVERVIEW (created if missing in the same run).
"""
from __future__ import annotations

import sys

def _configure_stdio_utf8() -> None:
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream is None or not hasattr(stream, "reconfigure"):
            continue
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


_configure_stdio_utf8()

import csv
import argparse
import json
import os
import re
import socket
import subprocess
import traceback
import unicodedata
from urllib.parse import urlparse
from datetime import datetime, timezone, timedelta
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

_RENT_OUTPUT_DIR = _SCRIPT_DIR.parents[2] / "lanes" / "rent" / "output"
RENT_FINAL_CSV = _RENT_OUTPUT_DIR / "final.csv"
_TG_STATE_PATH = _RENT_OUTPUT_DIR / "rent_telegram_state.json"
_BATCH_HISTORY_PATH = _RENT_OUTPUT_DIR / "rent_batch_history.jsonl"

# Load .env files so all runtime vars (RENT_GSHEET_ID, TELEGRAM_*) resolve when
# this script is run as a subprocess (rent_runtime_loop) or standalone.
# override=False: env already set by parent process always wins.
try:
    from dotenv import load_dotenv as _ld
    _repo_root_env = _SCRIPT_DIR.parents[2]
    _ld(_repo_root_env / ".env", override=False)
    _ld(_repo_root_env / "mikage-operator" / ".env", override=False)
    del _ld, _repo_root_env
except ImportError:
    pass

TAB_SUPPLY = "SUPPLY_PRIORITY"
TAB_DEMAND = "DEMAND_READY"
TAB_OVERVIEW = "BATCH_OVERVIEW"

# This script drives the Rent lane only; used for TELEGRAM_CHAT_ID_<LANE> routing.
LANE_NAME = "rent"
SYNC_KEY_COL = "_sync_key"
LISTING_KEY_COL = "listing_key"
COL_BATCH_ID = "batch_id"
COL_SYNCED_AT_VN = "synced_at_vn"

# Populated per run in main(); injected into every appended row.
RUN_BATCH_ID = ""
RUN_SYNCED_AT_VN = ""

# Default header row when tab is new or row 1 is empty (does not overwrite existing data).
HEADER_SUPPLY = [
    "_sync_key",
    "listing_key",
    "batch_id",
    "synced_at_vn",
    "source",
    "link",
    "text_raw",
    "contact",
    "phone",
    "area",
    "apartment_type",
    "budget",
    "supply_source_type",
    "owner_confidence",
    "review_priority",
    "contacted_status",
    "sale_owner",
    "contact_result",
    "follow_up_date",
    "status",
    "note",
]
HEADER_DEMAND = [
    "_sync_key",
    "listing_key",
    "batch_id",
    "synced_at_vn",
    "source",
    "link",
    "text_raw",
    "contact",
    "phone",
    "area",
    "demand_type",
    "apartment_type",
    "budget",
    "sale_owner",
    "contact_result",
    "follow_up_date",
    "status",
    "note",
]
HEADER_OVERVIEW = ["synced_at_vn", "content"]

def get_vn_time_str() -> str:
    """Return current Vietnam time (UTC+7) as 'YYYY-MM-DD HH:MM:SS'."""
    vn_now = datetime.now(timezone.utc) + timedelta(hours=7)
    return vn_now.strftime("%Y-%m-%d %H:%M:%S")


# Operator-edited in Sheet — never overwrite from CSV on merge.
SALE_MANUAL_COLS = frozenset(
    {"sale_owner", "contact_result", "follow_up_date", "status", "note"}
)


@dataclass(frozen=True)
class WorksheetSyncResult:
    """Result of sync_worksheet for post-sync verification."""

    skipped: bool  # True: sync aborted (e.g. missing _sync_key column); do not trust sheet
    batch_keys: frozenset[str]
    preserved_manual: dict[str, dict[str, str]]
    empty_key_skips: int
    inserts: int = 0
    updates: int = 0
    row_count_after: int | None = None  # forensic: nonempty data rows after successful writes
    existing_keys_from_sheet: int = 0
    incoming_rows: int = 0
    duplicate_vs_sheet: int = 0
    duplicate_in_batch: int = 0
    same_blocked_by_phone: int = 0
    contract_guard_skips: int = 0
    blocked_rows_by_reason: tuple[tuple[str, int], ...] = ()
    appended_row_dicts: tuple = ()  # original CSV row dicts for newly appended rows


def _norm_src(s: str) -> str:
    return (s or "").strip().replace("\n", " ").replace("\r", "")


def _norm_key_part(v: str) -> str:
    return re.sub(r"\s+", " ", (v or "").strip().lower())


def _build_demand_sync_key_fallback(row: dict[str, str], *, row_index: int) -> str:
    source = _norm_key_part(row.get("source", ""))
    contact = _norm_key_part(row.get("contact", ""))
    apt = _norm_key_part(row.get("apartment_type", ""))
    budget = _norm_key_part(row.get("budget", ""))
    if source and contact and apt:
        return f"{source}|{contact}|{apt}"
    if source and contact:
        return f"{source}|{contact}"
    if source and budget and apt:
        return f"{source}|{budget}|{apt}"
    if source:
        return f"{source}|row_{row_index}"
    return ""


def _phone_from_row(row: dict[str, str]) -> str:
    c = (row.get("contact") or "").strip()
    if c and re.search(r"\d{8,}", c):
        return re.sub(r"\s+", "", c)
    raw = str(row.get("text_raw") or "")
    m = re.search(
        r"(?:\+84[\d\s\.]{9,14}|\b0\d{2}[\d\s\.]{8,}\d|\b0\d{9,10}\b)",
        raw,
    )
    if m:
        return re.sub(r"[\s\.]+", "", m.group(0))
    return ""


def supply_sync_key(row: dict[str, str]) -> str:
    return f"{_norm_src(row.get('source', ''))}|{_phone_from_row(row)}"


def demand_sync_key(row: dict[str, str]) -> str:
    apt = (row.get("apartment_type") or "").strip()
    return f"{_norm_src(row.get('source', ''))}|{_phone_from_row(row)}|{apt}"


_MARKET_ALLOW_KEYWORDS = (
    "vinhomes central park",
    "vcp",
    "bình thạnh",
    "binh thanh",
    "landmark",
    "central park",
)

_MARKET_REJECT_KEYWORDS = (
    "tin tuc",
    "tin tức",
    "bài viết",
    "bai viet",
    "hướng dẫn",
    "huong dan",
    "kinh nghiệm",
    "kinh nghiem",
    "cẩm nang",
    "cam nang",
    "phân tích",
    "phan tich",
    "đầu tư",
    "dau tu",
    "quy hoạch",
    "quy hoach",
    "chính sách",
    "chinh sach",
    "wiki",
    "seo",
    "trang chủ",
    "trang chu",
    "mua bán",
    "mua ban",
    "dự án",
    "du an",
)

_FRESH_KEYWORDS = (
    "mới",
    "moi",
    "new",
    "fresh",
    "hôm nay",
    "hom nay",
    "today",
    "vừa đăng",
    "vua dang",
    "ngày đăng",
    "ngay dang",
    "cập nhật",
    "cap nhat",
)

_MARKET_BASELINE_VND = {
    "1PN": (18_000_000, 18_000_000),
    "2PN": (22_000_000, 25_000_000),
    "3PN": (30_000_000, 999_000_000),
}


def _confidence_points(value: str) -> int:
    v = (value or "").strip().lower()
    if v == "high":
        return 10
    if v == "medium":
        return 5
    return 0


def _missing_required_telegram_env_for_rent() -> list[str]:
    required = ("TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID_RENT")
    return [k for k in required if not str(os.environ.get(k, "")).strip()]


def _parse_score_value(value: str) -> int | None:
    try:
        return int(float(str(value or "").strip()))
    except (TypeError, ValueError):
        return None


def _row_market_text(item: dict[str, str]) -> str:
    parts = [
        item.get("source", ""),
        item.get("source_title", ""),
        item.get("title", ""),
        item.get("note_short", ""),
        item.get("tower_block", ""),
        item.get("apartment_type", ""),
        item.get("demand_type", ""),
        item.get("supply_source_type", ""),
        item.get("text_raw", ""),
        item.get("link", ""),
        item.get("url", ""),
    ]
    return _norm_text(" ".join(str(x or "") for x in parts))


def _looks_like_seo_or_article(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    if not text:
        return True
    if any(keyword in text for keyword in _MARKET_REJECT_KEYWORDS):
        return True
    if "cho thuê" not in text and "cho thue" not in text and "cần thuê" not in text and "can thue" not in text:
        return True
    return False


def _is_vcp_market_row(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    return any(keyword in text for keyword in _MARKET_ALLOW_KEYWORDS)


def _contact_method_value(item: dict[str, str]) -> str:
    return " ".join(
        [
            str(item.get("contact", "") or ""),
            str(item.get("phone", "") or ""),
            str(item.get("email", "") or ""),
        ]
    ).strip()


def _has_contact_method(item: dict[str, str]) -> bool:
    text = _contact_method_value(item)
    if not text:
        return False
    if _phone_from_row(item):
        return True
    return bool(re.search(r"[\w.+-]+@[\w.-]+\.\w+", text))


def _has_soft_price_text(item: dict[str, str]) -> bool:
    text = _norm_text(
        " ".join(
            [
                str(item.get("budget", "") or ""),
                str(item.get("price_text_raw", "") or ""),
                str(item.get("text_raw", "") or ""),
            ]
        )
    )
    return any(token in text for token in ("inbox", "liên hệ", "lien he", "thoả thuận", "thoa thuan"))


def _has_supply_listing_info(item: dict[str, str]) -> bool:
    return any(
        (str(item.get(key, "") or "")).strip()
        for key in ("apartment_type", "unit_code", "listing_key", "_sync_key", "tower_block", "link")
    )


def _has_demand_need(item: dict[str, str]) -> bool:
    text = _norm_text(
        " ".join(
            [
                str(item.get("demand_type", "") or ""),
                str(item.get("note_short", "") or ""),
                str(item.get("text_raw", "") or ""),
                str(item.get("source", "") or ""),
            ]
        )
    )
    return any(token in text for token in ("thuê", "thue", "mua", "buy", "rent", "cần", "can"))


def _has_demand_requirement(item: dict[str, str]) -> bool:
    return any(
        (str(item.get(key, "") or "")).strip()
        for key in ("budget", "move_in_time", "area", "apartment_type", "bedrooms", "tower_block", "price_text_raw")
    )


def _is_pure_noise_row(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    signal = " ".join(
        [
            _contact_method_value(item),
            str(item.get("apartment_type", "") or ""),
            str(item.get("unit_code", "") or ""),
            str(item.get("listing_key", "") or ""),
            str(item.get("budget", "") or ""),
            str(item.get("price_text_raw", "") or ""),
            str(item.get("move_in_time", "") or ""),
            str(item.get("area", "") or ""),
        ]
    ).strip()
    return not text and not signal


def _is_supply_row(item: dict[str, str]) -> bool:
    record_type = _norm_text(item.get("record_type", ""))
    if record_type == "supply":
        return True
    demand_type = _norm_text(item.get("demand_type", ""))
    return "supply" in demand_type or "cho thuê" in demand_type or "cho thue" in demand_type


def _is_usable_sale_callable_row(item: dict[str, str]) -> bool:
    if _is_pure_noise_row(item):
        return False
    if not _has_contact_method(item):
        return False
    if _is_supply_row(item):
        if not _has_supply_listing_info(item):
            return False
        if _parse_price_vnd(item) is None and not _has_soft_price_text(item):
            return False
        return True
    if not _has_demand_need(item):
        return False
    if not _has_demand_requirement(item):
        return False
    return True


def _passes_contract_guard(row: dict[str, str]) -> tuple[bool, str]:
    """Hard guard: only REAL_SOURCE or LOCAL_TRANSFORM rows with business_ready=yes may sync."""
    dtype = str(row.get("data_origin_type") or "").strip()
    if not dtype:
        return False, "missing_data_origin_type"
    if dtype == "SAMPLE":
        return False, "SAMPLE_blocked"
    if dtype == "UNKNOWN":
        return False, "UNKNOWN_blocked"
    if dtype not in ("REAL_SOURCE", "LOCAL_TRANSFORM"):
        return False, f"unexpected_data_origin_type:{dtype}"
    br = str(row.get("business_ready") or "").strip().lower()
    if not br:
        return False, "missing_business_ready"
    if br != "yes":
        return False, "business_ready_not_yes"
    sk = str(row.get("sync_key") or row.get("_sync_key") or "").strip()
    if not sk:
        return False, "empty_sync_key"
    ch = str(row.get("content_hash") or "").strip()
    if not ch:
        return False, "empty_content_hash"
    return True, ""


def _apartment_bucket(item: dict[str, str]) -> str:
    text = _norm_text(
        " ".join(
            [
                item.get("apartment_type", ""),
                item.get("bedrooms", ""),
                item.get("note_short", ""),
                item.get("text_raw", ""),
            ]
        )
    )
    if any(token in text for token in ("studio", "1pn", "1 pn", "1 phòng ngủ", "1 phong ngu")):
        return "1PN"
    if any(token in text for token in ("2pn", "2 pn", "2 phòng ngủ", "2 phong ngu")):
        return "2PN"
    if any(token in text for token in ("3pn", "3 pn", "3 phòng ngủ", "3 phong ngu", "4pn", "4 pn", "4 phòng ngủ", "4 phong ngu")):
        return "3PN"
    return ""


def _parse_price_vnd(item: dict[str, str]) -> int | None:
    raw = " ".join(
        [
            str(item.get("budget", "") or ""),
            str(item.get("price_text_raw", "") or ""),
        ]
    ).lower()
    if not raw.strip():
        return None
    nums = [float(x.replace(",", ".")) for x in re.findall(r"\d+(?:[.,]\d+)?", raw)]
    if not nums:
        return None
    value = min(nums)
    if "tỷ" in raw or "ty" in raw:
        return int(value * 1_000_000_000)
    if "triệu" in raw or "trieu" in raw or "m " in raw or "m/" in raw or raw.endswith("m"):
        return int(value * 1_000_000)
    if "k" in raw and value < 1000:
        return int(value * 1_000)
    if value >= 1_000_000:
        return int(value)
    return None


def _is_owner_direct(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    source_type = _norm_text(item.get("supply_source_type", ""))
    return (
        "owner_direct" in source_type
        or "owner" in source_type
        or "chính chủ" in text
        or "chinh chu" in text
        or "owner direct" in text
        or "direct owner" in text
    )


def _is_fresh_listing(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    return any(keyword in text for keyword in _FRESH_KEYWORDS)


def calculate_score(item: dict[str, str]) -> int:
    if not _is_vcp_market_row(item):
        return 0
    if _looks_like_seo_or_article(item):
        return 0

    score = 25
    phone = _phone_from_row(item)
    if phone:
        score += 25
    else:
        score -= 30

    apt_bucket = _apartment_bucket(item)
    if apt_bucket:
        score += 15
    else:
        score -= 20

    price_vnd = _parse_price_vnd(item)
    if price_vnd is None:
        score -= 25
    else:
        score += 10
        low, high = _MARKET_BASELINE_VND.get(apt_bucket, (0, 0))
        if low and price_vnd < low:
            score += 25
        elif high and low <= price_vnd <= high:
            score += 10
        elif low and price_vnd > max(high, low) * 1.2:
            score -= 10

    if _is_owner_direct(item):
        score += 15
    if _is_fresh_listing(item):
        score += 10

    text = _row_market_text(item)
    if "vinhomes central park" in text or "vcp" in text:
        score += 15
    if "bình thạnh" in text or "binh thanh" in text:
        score += 10
    if "landmark" in text or "central park" in text:
        score += 10

    if (item.get("area") or "").strip():
        score += 5
    if (item.get("urgency") or "").strip():
        score += 5
    if (item.get("business_ready") or "").strip().lower() == "yes":
        score += 10

    score += _confidence_points(item.get("budget_confidence", ""))
    score += _confidence_points(item.get("bedrooms_confidence", ""))
    score += _confidence_points(item.get("source_title_confidence", ""))
    score += _confidence_points(item.get("price_text_raw_confidence", ""))
    return max(0, min(100, score))


def _apply_score_filter_sort(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    kept: list[dict[str, str]] = []
    for row in rows:
        scored = dict(row)
        score = calculate_score(scored)
        scored["score"] = str(score)
        if score >= 40:
            kept.append(scored)
    kept.sort(key=lambda row: (-calculate_score(row), build_listing_key(row), row.get("_sync_key", "")))
    return kept


def _has_unit_or_listing_code(item: dict[str, str]) -> bool:
    return any(
        (str(item.get(key, "") or "")).strip()
        for key in ("unit_code", "listing_key", "_sync_key")
    )


def _has_detail_fields(item: dict[str, str]) -> bool:
    return any(
        (str(item.get(key, "") or "")).strip()
        for key in ("area", "tower_block", "move_in_time")
    ) or any(token in _row_market_text(item) for token in ("tầng", "tang", "floor", "view"))


def _has_customer_or_owner_intent(item: dict[str, str]) -> bool:
    text = _row_market_text(item)
    return _is_owner_direct(item) or any(
        token in text for token in ("cần thuê", "can thue", "muốn thuê", "muon thue", "tôi cần", "toi can", "khách", "khach")
    )


def calculate_score(item: dict[str, str]) -> int:
    if not _is_usable_sale_callable_row(item):
        return 0

    score = 20
    if _has_unit_or_listing_code(item):
        score += 20
    if _phone_from_row(item):
        score += 25
    else:
        score += 12

    apt_bucket = _apartment_bucket(item)
    if apt_bucket:
        score += 15
    else:
        score += 5

    price_vnd = _parse_price_vnd(item)
    if price_vnd is None:
        if _has_soft_price_text(item):
            score += 4
        else:
            score += 2
    else:
        score += 18
        low, high = _MARKET_BASELINE_VND.get(apt_bucket, (0, 0))
        if low and price_vnd < low:
            score += 25
        elif high and low <= price_vnd <= high:
            score += 10
        elif low and price_vnd > max(high, low) * 1.2:
            score -= 10

    if _has_detail_fields(item):
        score += 12
    if (item.get("move_in_time") or "").strip():
        score += 10
    if _has_customer_or_owner_intent(item):
        score += 15
    if _is_fresh_listing(item):
        score += 10
    if _is_vcp_market_row(item):
        score += 15
    if (item.get("urgency") or "").strip():
        score += 5
    if (item.get("business_ready") or "").strip().lower() == "yes":
        score += 10
    if _looks_like_seo_or_article(item):
        score -= 12

    score += _confidence_points(item.get("budget_confidence", ""))
    score += _confidence_points(item.get("bedrooms_confidence", ""))
    score += _confidence_points(item.get("source_title_confidence", ""))
    score += _confidence_points(item.get("price_text_raw_confidence", ""))
    return max(0, min(100, score))


def _apply_score_filter_sort(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    kept: list[dict[str, str]] = []
    for row in rows:
        scored = dict(row)
        score = calculate_score(scored)
        scored["score"] = str(score)
        if _is_usable_sale_callable_row(scored):
            kept.append(scored)
    kept.sort(key=lambda row: (-calculate_score(row), build_listing_key(row), row.get("_sync_key", "")))
    return kept


def _load_csv_raw(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.is_file():
        return [], []
    # utf-8-sig strips BOM so first header is "_sync_key" not "\ufeff_sync_key" (breaks column match).
    with path.open(encoding="utf-8-sig", newline="") as f:
        r = csv.DictReader(f)
        fn = [((x or "").replace("\ufeff", "").strip()) for x in (r.fieldnames or [])]
        rows: list[dict[str, str]] = []
        for row in r:
            rows.append(
                {
                    (k or "").replace("\ufeff", "").strip(): (
                        str(v) if v is not None else ""
                    )
                    for k, v in row.items()
                }
            )
    return fn, rows


def _load_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    fn, rows = _load_csv_raw(path)
    return fn, _apply_score_filter_sort(rows)


def _schema_check_local_only(run_id: str, log: list[str]) -> int:
    paths = {
        "final": RENT_FINAL_CSV,
        "supply": _RENT_OUTPUT_DIR / "supply.csv",
        "demand": _RENT_OUTPUT_DIR / "demand.csv",
    }

    if not paths["final"].is_file():
        err = "FINAL_CSV_MISSING"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        return 1

    final_fieldnames, final_rows = _load_csv_raw(paths["final"])
    if not final_fieldnames or not final_rows:
        err = "FINAL_CSV_EMPTY_OR_HEADER_ONLY"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        return 1

    supply_fieldnames, supply_rows = _load_csv_raw(paths["supply"])
    demand_fieldnames, demand_rows = _load_csv_raw(paths["demand"])
    if not supply_fieldnames:
        err = "SUPPLY_CSV_UNREADABLE_OR_MISSING"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        return 1
    if not demand_fieldnames:
        err = "DEMAND_CSV_UNREADABLE_OR_MISSING"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        return 1

    blocked_rows_by_reason: dict[str, int] = {}

    def _check_rows(rows: list[dict[str, str]]) -> int:
        eligible = 0
        for row in rows:
            ok_guard, reason = _passes_contract_guard(row)
            if ok_guard:
                eligible += 1
            else:
                blocked_rows_by_reason[reason] = blocked_rows_by_reason.get(reason, 0) + 1
        return eligible

    eligible_supply_rows = _check_rows(supply_rows)
    eligible_demand_rows = _check_rows(demand_rows)

    stats = {
        "final_rows": len(final_rows),
        "supply_rows": len(supply_rows),
        "demand_rows": len(demand_rows),
        "eligible_supply_rows": eligible_supply_rows,
        "eligible_demand_rows": eligible_demand_rows,
        "blocked_rows_by_reason": blocked_rows_by_reason,
    }
    for k, v in stats.items():
        line = _run_stamp(run_id, f"SCHEMA_CHECK {k}={json.dumps(v, ensure_ascii=False, sort_keys=True)}")
        print(line)
        log.append(line)

    if (eligible_supply_rows + eligible_demand_rows) <= 0:
        err = "SCHEMA_CHECK_NO_ELIGIBLE_ROWS"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        return 1
    ok = _run_stamp(run_id, "SCHEMA_CHECK PASS")
    print(ok)
    log.append(ok)
    return 0


def _ensure_worksheet(sh, title: str, log: list[str]):
    """Get worksheet by title; create if missing."""
    from gspread.exceptions import WorksheetNotFound

    try:
        return sh.worksheet(title)
    except WorksheetNotFound:
        ws = sh.add_worksheet(title=title, rows=2000, cols=40)
        log.append(f"[GSHEET] created worksheet: {title}")
        return ws


def _write_default_headers_if_empty(ws, headers: list[str], log: list[str]) -> None:
    """Write default header row if sheet empty or row 1 has no non-blank cells."""
    allv = ws.get_all_values()
    first = (allv[0] if allv else []) or []
    empty = not allv or not any(str(c).strip() for c in first)
    if not empty or not headers:
        return
    n = len(headers)
    end = _col_letter(n)
    ws.update(f"A1:{end}1", [headers])
    log.append(f"[GSHEET] wrote headers: {ws.title}")


def _ensure_required_columns(ws, required_cols: list[str], log: list[str]) -> list[str]:
    """
    Ensure required header columns exist on row 1.
    Appends missing columns at the end and returns the latest header.
    """
    allv = ws.get_all_values()
    first = (allv[0] if allv else []) or []
    header = [str(c).strip() for c in first]
    missing = [c for c in required_cols if c not in header]
    if not missing:
        return header
    start_idx = len(header) + 1
    end_idx = len(header) + len(missing)
    ws.update(f"{_col_letter(start_idx)}1:{_col_letter(end_idx)}1", [missing])
    log.append(f"[GSHEET] appended missing headers: {ws.title} -> {', '.join(missing)}")
    allv = ws.get_all_values()
    first = (allv[0] if allv else []) or []
    return [str(c).strip() for c in first]


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[3]


def _resolve_credentials(run_id: str, log: list[str]) -> tuple[str | None, str | None]:
    """
    Pick the first existing credential file from env (in order) then repo fallbacks.
    Log every candidate with exists=true/false (no early FAIL on a missing env path alone).
    """
    repo = _repo_root()
    raw_candidates: list[tuple[str, str]] = []
    r1 = (os.environ.get("RENT_GSHEET_CREDENTIALS_JSON") or "").strip()
    if r1:
        raw_candidates.append(("RENT_GSHEET_CREDENTIALS_JSON", r1))
    r2 = (os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") or "").strip()
    if r2:
        raw_candidates.append(("GOOGLE_APPLICATION_CREDENTIALS", r2))
    for name in ("gsheet_key.json", "google_credentials.json", "service_account.json"):
        raw_candidates.append((f"repo:credentials/{name}", str(repo / "credentials" / name)))

    ordered: list[tuple[str, Path]] = []
    for label, raw in raw_candidates:
        p = Path(raw).expanduser()
        if not p.is_absolute():
            p = (repo / p).resolve()
        else:
            p = p.resolve()
        ordered.append((label, p))

    chosen: str | None = None
    chosen_label: str | None = None
    for label, path in ordered:
        exists = path.is_file()
        line = _run_stamp(
            run_id,
            f"CRED_CANDIDATE source={label} path={path} exists={exists}",
        )
        print(line)
        log.append(line)
        if exists and chosen is None:
            chosen = str(path)
            chosen_label = label
    if chosen:
        sel = _run_stamp(run_id, f"CRED_SELECTED source={chosen_label} path={chosen}")
        print(sel)
        log.append(sel)
    return chosen, chosen_label


def _emit_gsheet_runtime_json(
    *,
    run_id: str,
    code: str,
    credential_path_used: str | None,
    credential_file_exists: bool | None,
    credential_source: str | None,
    api_detail: str,
    log: list[str],
) -> None:
    payload = {
        "run_id": run_id,
        "code": code,
        "credential_path_used": credential_path_used or "",
        "credential_file_exists": credential_file_exists,
        "credential_source": credential_source or "",
        "api_detail": (api_detail or "")[:4000],
    }
    line = "GSHEET_RUNTIME_JSON " + json.dumps(payload, ensure_ascii=False)
    print(line)
    log.append(line)
    sys.stdout.flush()


def _classify_gsheet_exception(exc: BaseException) -> tuple[str, str]:
    """Map exception to KEY_MISSING / AUTH_FAIL / NETWORK_FAIL / SYNC_FAIL."""
    msg = str(exc)
    low = msg.lower()
    mname = type(exc).__name__
    try:
        from google.auth.exceptions import GoogleAuthError
    except Exception:  # pragma: no cover
        GoogleAuthError = None  # type: ignore[misc,assignment]
    try:
        import gspread.exceptions as ge
    except Exception:  # pragma: no cover
        ge = None  # type: ignore[assignment]

    if GoogleAuthError is not None and isinstance(exc, GoogleAuthError):
        return "AUTH_FAIL", f"{mname}: {msg}"
    if ge is not None and isinstance(exc, ge.APIError):
        if "503" in msg or "429" in msg or "timeout" in low:
            return "NETWORK_FAIL", msg
        if "404" in msg or "not found" in low:
            return "AUTH_FAIL", msg
        if "403" in msg or "permission" in low:
            return "AUTH_FAIL", msg
        return "NETWORK_FAIL", msg
    if isinstance(exc, (TimeoutError, ConnectionError, BrokenPipeError)):
        return "NETWORK_FAIL", f"{mname}: {msg}"
    if isinstance(exc, OSError):
        if "timed out" in low or "10060" in msg or "10054" in msg:
            return "NETWORK_FAIL", f"{mname}: {msg}"
    if isinstance(exc, FileNotFoundError):
        return "KEY_MISSING", msg
    if isinstance(exc, json.JSONDecodeError):
        return "AUTH_FAIL", f"invalid_json:{msg}"
    return "AUTH_FAIL", f"{mname}: {msg}"


def _get_client_from_path(cred_path: str):
    import gspread
    from google.oauth2.service_account import Credentials

    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(cred_path, scopes=scopes)
    return gspread.authorize(creds)


def _col_letter(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s or "A"


def _pad_row_cells(row: list[str], n: int) -> list[str]:
    r = [str(c) if c is not None else "" for c in row]
    while len(r) < n:
        r.append("")
    return r[:n]


def _row_cells_to_dict(header: list[str], cells: list[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for i, h in enumerate(header):
        if not h:
            continue
        out[h] = cells[i] if i < len(cells) else ""
    return out


def _row_dict_to_sheet_line(
    header: list[str],
    row: dict[str, str],
    key_fn: Callable[[dict[str, str]], str],
    sync_key_override: str | None = None,
) -> list[str]:
    out: list[str] = []
    for h in header:
        if not h:
            out.append("")
        elif h == SYNC_KEY_COL:
            out.append(sync_key_override if sync_key_override is not None else key_fn(row))
        elif h == LISTING_KEY_COL:
            out.append(build_listing_key(row))
        elif h == COL_BATCH_ID:
            out.append(RUN_BATCH_ID)
        elif h == COL_SYNCED_AT_VN:
            out.append(RUN_SYNCED_AT_VN)
        else:
            out.append(row.get(h, ""))
    return out


def _norm_text(v: str) -> str:
    s = (v or "").strip().lower()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = re.sub(r"\s+", " ", s)
    return s


def _canonical_url(v: str) -> str:
    u = (v or "").strip()
    if not u:
        return ""
    u = u.split("#", 1)[0]
    u = u.split("?", 1)[0]
    try:
        p = urlparse(u if re.match(r"^[a-z]+://", u, re.I) else f"https://{u}")
        host = (p.netloc or "").lower()
        if host.startswith("www."):
            host = host[4:]
        path = re.sub(r"/+", "/", p.path or "/").rstrip("/")
        if not path:
            path = "/"
        return f"{host}{path}"
    except Exception:
        u = u.rstrip("/")
        return _norm_text(u)


def _only_digits(v: str) -> str:
    return re.sub(r"\D+", "", v or "")


def _norm_phone_for_key(v: str) -> str:
    """
    Canonical phone for dedupe:
    - keep digits only
    - normalize +84... to local form base
    - drop leading 0 noise so 0912... and 912... map together
    """
    d = _only_digits(v)
    if d.startswith("84") and len(d) >= 10:
        d = d[2:]
    d = d.lstrip("0")
    return d


def _norm_price(v: str) -> str:
    d = _only_digits(v)
    return d or "0"


def _norm_area(v: str) -> str:
    m = re.search(r"\d+(?:[.,]\d+)?", v or "")
    if not m:
        return "0"
    return m.group(0).replace(",", ".")


def build_listing_key(row: dict[str, str]) -> str:
    source = _norm_text(
        row.get("source", "") or row.get("source_name", "") or row.get("src", "")
    )
    url = _canonical_url(
        row.get("link", "")
        or row.get("tax_raw", "")
        or row.get("source_url", "")
        or row.get("url", "")
    )
    phone = _norm_phone_for_key(_phone_from_row(row))
    if source and phone and url:
        return f"{source}|{phone}|{url}"
    if source and phone:
        return f"{source}|{phone}"
    if source and url:
        return f"{source}|{url}"
    title = _norm_text(row.get("title", "") or row.get("text_raw", ""))
    area = _norm_area(row.get("area", ""))
    price = _norm_price(row.get("price", "") or row.get("budget", ""))
    return f"{source}|{title}|{area}|{price}|{phone}"


def _merge_row_keep_manual(
    header: list[str],
    old_cells: list[str],
    csv_row: dict[str, str],
    key_fn: Callable[[dict[str, str]], str],
) -> list[str]:
    """Fill non-manual columns from CSV; keep existing sheet values for sale manual cols."""
    old = _pad_row_cells(old_cells, len(header))
    merged: list[str] = []
    for i, h in enumerate(header):
        if not h:
            merged.append("")
        elif h == SYNC_KEY_COL:
            merged.append(key_fn(csv_row))
        elif h in SALE_MANUAL_COLS:
            merged.append(old[i] if i < len(old) else "")
        else:
            merged.append(csv_row.get(h, ""))
    return merged


def _extract_manual_from_line(header: list[str], cells: list[str]) -> dict[str, str]:
    pad = _pad_row_cells(list(cells), len(header))
    out: dict[str, str] = {}
    for i, h in enumerate(header):
        if h in SALE_MANUAL_COLS and i < len(pad):
            out[h] = pad[i]
    return out


def _scan_sheet_key_occurrences(
    allv: list[list[str]], header: list[str]
) -> dict[str, list[int]]:
    """Map stripped _sync_key -> list of 1-based data row numbers (sheet truth)."""
    if SYNC_KEY_COL not in header:
        return {}
    key_idx = header.index(SYNC_KEY_COL)
    occ: dict[str, list[int]] = {}
    for rnum, data_row in enumerate(allv[1:], start=2):
        cells = _pad_row_cells(list(data_row), len(header))
        k = cells[key_idx].strip()
        if not k:
            continue
        occ.setdefault(k, []).append(rnum)
    return occ


def _delete_extra_rows_for_duplicate_keys(
    ws,
    occ: dict[str, list[int]],
    tab_name: str,
    log: list[str],
) -> int:
    """Remove duplicate data rows: keep lowest row number per _sync_key, delete the rest."""
    extras: list[int] = []
    for _k, rnums in occ.items():
        if len(rnums) <= 1:
            continue
        sorted_r = sorted(rnums)
        extras.extend(sorted_r[1:])
    extras.sort(reverse=True)
    for rnum in extras:
        ws.delete_rows(rnum)
    n = len(extras)
    if n:
        log.append(f"  [GSHEET] sheet_dedupe_removed_rows={n} tab={tab_name}")
    return n


def _force_clean_duplicates_before_verify(ws, log: list[str]) -> int:
    """Final pass before verify: keep first row per _sync_key, delete extras bottom-up; re-fetch implied by next read."""
    allv = ws.get_all_values()
    if not allv:
        return 0
    header = [str(c).strip() for c in (allv[0] if allv else []) or []]
    if SYNC_KEY_COL not in header:
        return 0
    occ = _scan_sheet_key_occurrences(allv, header)
    tab_name = ws.title
    return _delete_extra_rows_for_duplicate_keys(ws, occ, tab_name, log)


def sync_worksheet(
    ws,
    csv_path: Path,
    key_fn: Callable[[dict[str, str]], str],
    log: list[str],
) -> WorksheetSyncResult:
    """Append-only for Rent periodic scan: every run writes a new batch, no overwrite."""
    _fieldnames, rows = _load_csv(csv_path)
    if not _fieldnames:
        log.append(f"  [{ws.title}] skip - cannot read CSV: {csv_path}")
        return WorksheetSyncResult(True, frozenset(), {}, 0)

    if not rows:
        log.append(f"  [{ws.title}] CSV has no data rows <- {csv_path.name}")
        return WorksheetSyncResult(False, frozenset(), {}, 0)

    preserved_manual: dict[str, dict[str, str]] = {}
    batch_keys_set: set[str] = set()

    allv = ws.get_all_values()
    first = (allv[0] if allv else []) or []
    is_empty = not allv or not any(str(c).strip() for c in first)
    if is_empty:
        header = HEADER_SUPPLY if ws.title == TAB_SUPPLY else HEADER_DEMAND
        n = len(header)
        ws.update(f"A1:{_col_letter(n)}1", [header])
        allv = ws.get_all_values()
        first = (allv[0] if allv else []) or []

    header = [str(c).strip() for c in first]
    if SYNC_KEY_COL not in header:
        msg = f"[GSHEET] abort: missing {SYNC_KEY_COL} column in {ws.title}"
        log.append(msg)
        return WorksheetSyncResult(True, frozenset(), {}, 0)
    tab_name = ws.title
    empty_sync_key_skips = 0
    appends: list[list[str]] = []
    appended_rows_raw: list[dict[str, str]] = []
    seen_listing_keys_batch: set[str] = set()
    incoming_rows = 0
    duplicate_vs_sheet = 0
    duplicate_in_batch = 0
    skipped_debug = 0
    contract_guard_skips = 0
    blocked_rows_by_reason: dict[str, int] = {}

    use_sync_key_only = ws.title == TAB_DEMAND
    is_supply_tab = ws.title == TAB_SUPPLY
    existing_listing_keys: set[str] = set()
    existing_keys: set[str] = set()
    existing_phones: set[str] = set()  # supply-only: normalized phones already in sheet
    same_blocked_by_phone = 0
    listing_idx = header.index(LISTING_KEY_COL) if LISTING_KEY_COL in header else -1
    sync_idx = header.index(SYNC_KEY_COL) if SYNC_KEY_COL in header else -1
    phone_idx = header.index("phone") if "phone" in header else -1
    for data_row in allv[1:]:
        cells = _pad_row_cells(list(data_row), len(header))
        stored_sync_key = cells[sync_idx].strip() if sync_idx >= 0 else ""
        if use_sync_key_only:
            if stored_sync_key:
                existing_keys.add(stored_sync_key)
            continue
        row_dict = _row_cells_to_dict(header, cells)
        recomputed_key = build_listing_key(row_dict)
        stored_key = cells[listing_idx].strip() if listing_idx >= 0 else ""
        if stored_key:
            existing_listing_keys.add(stored_key)
        if recomputed_key:
            existing_listing_keys.add(recomputed_key)
        if stored_sync_key:
            existing_listing_keys.add(stored_sync_key)
        if is_supply_tab:
            stored_phone_raw = cells[phone_idx] if phone_idx >= 0 else ""
            norm_phone = _norm_phone_for_key(stored_phone_raw) or _norm_phone_for_key(_phone_from_row(row_dict))
            if norm_phone:
                existing_phones.add(norm_phone)
    existing_keys_count = len(existing_keys) if use_sync_key_only else len(existing_listing_keys)
    demand_sheet_existing_row_count = len(allv[1:]) if use_sync_key_only else 0
    demand_batch_seen_keys_count_initial = 0
    log.append(f"EXISTING_KEYS_FROM_SHEET={existing_keys_count}")
    def _emit_trace(msg: str) -> None:
        log.append(msg)
        if use_sync_key_only:
            print(msg)

    if use_sync_key_only:
        _emit_trace(f"DEMAND_SHEET_EXISTING_KEYS_COUNT={existing_keys_count}")
        _emit_trace(f"DEMAND_SHEET_EXISTING_ROW_COUNT={demand_sheet_existing_row_count}")
        _emit_trace(
            f"DEMAND_BATCH_SEEN_KEYS_COUNT_INITIAL={demand_batch_seen_keys_count_initial}"
        )
        existing_keys_preview = sorted(existing_keys)[:10]
        _emit_trace(f"DEMAND_EXISTING_KEYS_PREVIEW={existing_keys_preview}")

    seen_keys_batch: set[str] = set()
    incoming_keys_preview: list[str] = []
    for row in rows:
        incoming_rows += 1
        key = (row.get(SYNC_KEY_COL, "") or "").strip() if use_sync_key_only else (key_fn(row) or "").strip()
        ok_guard, guard_reason = _passes_contract_guard(row)
        if not ok_guard:
            contract_guard_skips += 1
            blocked_rows_by_reason[guard_reason] = blocked_rows_by_reason.get(guard_reason, 0) + 1
            if use_sync_key_only:
                _emit_trace(f"ROW_INDEX={incoming_rows}")
                _emit_trace(f"ROW_SYNC_KEY={key!r}")
                _emit_trace("SKIP_REASON=contract_guard")
                _emit_trace(f"GUARD_REASON={guard_reason}")
                _emit_trace("matched_existing_key=NO")
                _emit_trace("matched_batch_key=NO")
                _emit_trace("missing_required_field=YES")
                _emit_trace("append_candidate=NO")
            continue
        if use_sync_key_only and not key:
            key = _build_demand_sync_key_fallback(row, row_index=incoming_rows)
        if use_sync_key_only and len(incoming_keys_preview) < 10:
            incoming_keys_preview.append(key)
        if not key:
            empty_sync_key_skips += 1
            if use_sync_key_only:
                _emit_trace(f"ROW_INDEX={incoming_rows}")
                _emit_trace(f"ROW_SYNC_KEY={key!r}")
                _emit_trace("SKIP_REASON=blank_sync_key")
                _emit_trace("matched_existing_key=NO")
                _emit_trace("matched_batch_key=NO")
                _emit_trace("missing_required_field=YES")
                _emit_trace("append_candidate=NO")
            continue
        if use_sync_key_only:
            matched_existing = key in existing_keys
            matched_batch = key in seen_keys_batch
            if key in existing_keys:
                duplicate_vs_sheet += 1
                if skipped_debug < 10:
                    log.append(f"DUP_SKIP key={key} reason=sheet")
                    skipped_debug += 1
                _emit_trace(f"ROW_INDEX={incoming_rows}")
                _emit_trace(f"ROW_SYNC_KEY={key!r}")
                _emit_trace("SKIP_REASON=existing_key_match")
                _emit_trace("matched_existing_key=YES")
                _emit_trace("matched_batch_key=NO")
                _emit_trace("missing_required_field=NO")
                _emit_trace("append_candidate=NO")
                _emit_trace(f"MATCHED_EXISTING_KEY={key!r}")
                _emit_trace("MATCHED_KEY_SOURCE=DEMAND_READY_COLUMN_A")
                continue
            batch_keys_set.add(key)
            if key in seen_keys_batch:
                duplicate_in_batch += 1
                if skipped_debug < 10:
                    log.append(f"DUP_SKIP key={key} reason=batch")
                    skipped_debug += 1
                _emit_trace(f"ROW_INDEX={incoming_rows}")
                _emit_trace(f"ROW_SYNC_KEY={key!r}")
                _emit_trace("SKIP_REASON=batch_key_match")
                _emit_trace("matched_existing_key=NO")
                _emit_trace("matched_batch_key=YES")
                _emit_trace("missing_required_field=NO")
                _emit_trace("append_candidate=NO")
                continue
            seen_keys_batch.add(key)
            log.append(f"[SYNC] {ws.title} APPEND key={key}")
            line = _row_dict_to_sheet_line(header, row, key_fn, sync_key_override=key)
            appends.append(line)
            appended_rows_raw.append(row)
            existing_keys.add(key)
            _emit_trace(f"ROW_INDEX={incoming_rows}")
            _emit_trace(f"ROW_SYNC_KEY={key!r}")
            _emit_trace("SKIP_REASON=unknown")
            _emit_trace(f"matched_existing_key={'YES' if matched_existing else 'NO'}")
            _emit_trace(f"matched_batch_key={'YES' if matched_batch else 'NO'}")
            _emit_trace("missing_required_field=NO")
            _emit_trace("append_candidate=YES")
            continue
        listing_key = build_listing_key(row)
        if is_supply_tab:
            norm_phone = _norm_phone_for_key(_phone_from_row(row))
            if norm_phone and norm_phone in existing_phones:
                same_blocked_by_phone += 1
                if skipped_debug < 10:
                    log.append(
                        f"DUP_SKIP key={listing_key} reason=phone phone_norm={norm_phone}"
                    )
                    skipped_debug += 1
                continue
        if listing_key in existing_listing_keys:
            duplicate_vs_sheet += 1
            if skipped_debug < 10:
                log.append(f"DUP_SKIP key={listing_key} reason=sheet")
                skipped_debug += 1
            continue
        batch_keys_set.add(key)
        if listing_key in seen_listing_keys_batch:
            duplicate_in_batch += 1
            if skipped_debug < 10:
                log.append(f"DUP_SKIP key={listing_key} reason=batch")
                skipped_debug += 1
            continue
        seen_listing_keys_batch.add(listing_key)
        log.append(f"[SYNC] {ws.title} APPEND key={key}")
        line = _row_dict_to_sheet_line(header, row, key_fn)
        appends.append(line)
        appended_rows_raw.append(row)
        existing_listing_keys.add(listing_key)
        existing_listing_keys.add(key)
        if is_supply_tab:
            norm_phone = _norm_phone_for_key(_phone_from_row(row))
            if norm_phone:
                existing_phones.add(norm_phone)

    pending_new_unique = len(appends)
    appended_new = len(appends)
    if use_sync_key_only:
        _emit_trace(f"DEMAND_INCOMING_KEYS_PREVIEW={incoming_keys_preview}")

    log.append(
        f"[SYNC SUMMARY] {ws.title} inserts={appended_new} updates=0"
    )

    row_count_before_writes = _nonempty_data_rows_below_header(ws)
    log.append(
        f"[GSHEET WRITE PLAN] {ws.title} inserts={appended_new} updates=0"
    )

    if appends:
        try:
            ws.append_rows(appends, value_input_option="USER_ENTERED")
        except Exception as e:
            log.append(
                f"[GSHEET WRITE ERROR] {ws.title}: {type(e).__name__}: {e!r}"
            )
            print(
                f"[GSHEET WRITE ERROR] {ws.title}: {type(e).__name__}: {e!r}",
                file=sys.stderr,
            )
            raise
    sys.stdout.flush()

    row_count_after = _nonempty_data_rows_below_header(ws)
    log.append(
        f"[GSHEET WRITE DONE] {ws.title} appended={appended_new} updated=0"
    )
    log.append(f"[GSHEET TAB AFTER] title={ws.title} row_count_after={row_count_after}")
    if row_count_after == row_count_before_writes and appended_new > 0:
        anom = (
            f"[GSHEET ANOMALY] INSERT CLAIMED BUT SHEET ROW COUNT DID NOT CHANGE: "
            f"{ws.title}"
        )
        log.append(anom)
        print(anom, file=sys.stderr)

    counters = [
        ("empty_key_skips", empty_sync_key_skips),
        ("pending_new_unique", pending_new_unique),
        ("duplicate_vs_sheet", duplicate_vs_sheet),
        ("duplicate_in_batch", duplicate_in_batch),
        ("merged_existing", 0),
        ("appended_new", appended_new),
    ]
    if is_supply_tab:
        counters.append(("SAME_BLOCKED_BY_PHONE", same_blocked_by_phone))
    for label, val in counters:
        log.append(f"  [GSHEET] {label}={val} tab={tab_name}")
    if is_supply_tab:
        msg = f"SAME_BLOCKED_BY_PHONE={same_blocked_by_phone} tab={tab_name}"
        print(msg)
        log.append(msg)

    return WorksheetSyncResult(
        False,
        frozenset(batch_keys_set),
        preserved_manual,
        empty_sync_key_skips,
        appended_new,
        0,
        row_count_after,
        existing_keys_count,
        incoming_rows,
        duplicate_vs_sheet,
        duplicate_in_batch,
        same_blocked_by_phone,
        contract_guard_skips,
        tuple(sorted(blocked_rows_by_reason.items())),
        tuple(appended_rows_raw),
    )


def _override_overview_demand_counts(text: str, demand_rows: int) -> str:
    """Keep overview demand totals consistent with actual DEMAND_READY sheet rows."""
    out = text
    patterns = [
        r"(?im)\btotal_demand\s*[:=]\s*\d+",
        r"(?im)\bdemand_sale_ready_total\s*[:=]\s*\d+",
    ]
    replacements = [
        f"total_demand={demand_rows}",
        f"demand_sale_ready_total={demand_rows}",
    ]
    for pat, repl in zip(patterns, replacements):
        if re.search(pat, out):
            out = re.sub(pat, repl, out)
        else:
            if out and not out.endswith("\n"):
                out += "\n"
            out += repl
    return out


def sync_overview(ws, path: Path, log: list[str], demand_rows: int) -> None:
    if not path.is_file():
        log.append(f"  [{ws.title}] skip - file missing: {path}")
        return
    text = path.read_text(encoding="utf-8", errors="replace")
    text = _override_overview_demand_counts(text, demand_rows)
    ts = get_vn_time_str()

    allv = ws.get_all_values()
    end_c = _col_letter(len(HEADER_OVERVIEW))
    first = (allv[0] if allv else []) or []
    # Write header row when sheet is empty or header is missing
    if not allv or not any(str(c).strip() for c in first):
        ws.update(range_name=f"A1:{end_c}1", values=[HEADER_OVERVIEW])
        allv = ws.get_all_values()

    # Append a new history row — do NOT clear old rows (preserves run history)
    next_row = len(allv) + 1
    need_cols = len(HEADER_OVERVIEW)
    if ws.col_count < need_cols:
        ws.add_cols(need_cols - ws.col_count)
        log.append(f"[BATCH_OVERVIEW] expanded cols to {need_cols}")
    if ws.row_count < next_row:
        ws.add_rows(next_row - ws.row_count + 10)
        log.append(f"[BATCH_OVERVIEW] expanded rows to accommodate row {next_row}")
    ws.update(
        range_name=f"A{next_row}:{end_c}{next_row}",
        values=[[ts, text]],
        value_input_option="USER_ENTERED",
    )
    sys.stdout.flush()
    log.append(f"[BATCH_OVERVIEW] appended row {next_row} ({len(text)} chars) <- {path.name}")


def _repo_logs_dir() -> Path:
    return Path(__file__).resolve().parents[3] / "logs"


def _append_log(path: Path, lines: list[str]) -> None:
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
    except OSError:
        pass


def _lane_rent_logs_dir() -> Path:
    """MIKAGE/lanes/rent/logs/ — one file per gsheet sync run."""
    return Path(__file__).resolve().parent / "logs"


def _write_run_report(run_id: str, log: list[str]) -> None:
    """Full log for this run only: logs/gsheet_sync_<RUN_ID>.log"""
    path = _lane_rent_logs_dir() / f"gsheet_sync_{run_id}.log"
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("\n".join(log) + "\n", encoding="utf-8")
    except OSError:
        pass


def _nonempty_data_rows_below_header(ws) -> int:
    """Count data rows (row 2+) with at least one non-blank cell."""
    allv = ws.get_all_values()
    if len(allv) <= 1:
        return 0
    n = 0
    for row in allv[1:]:
        if any(str(c).strip() for c in row):
            n += 1
    return n


def _fmt_summary_num(v: int | None) -> str | int:
    return v if v is not None else "n/a"


def _fmt_summary_str(v: str | None) -> str:
    if v is None or not str(v).strip():
        return "n/a"
    return str(v)


def _run_stamp(run_id: str, msg: str) -> str:
    return f"[RUN {run_id}] {msg}"


def _print_append_metrics(
    *,
    run_id: str,
    existing_keys_from_sheet: int,
    incoming_rows: int,
    new_rows_to_append: int,
    duplicate_vs_sheet: int,
    duplicate_in_batch: int,
    sync_result: str,
    log: list[str],
) -> None:
    lines = [
        f"EXISTING_KEYS_FROM_SHEET={existing_keys_from_sheet}",
        f"INCOMING_ROWS={incoming_rows}",
        f"DUPLICATE_VS_SHEET={duplicate_vs_sheet}",
        f"DUPLICATE_IN_BATCH={duplicate_in_batch}",
        f"NEW_ROWS_TO_APPEND={new_rows_to_append}",
        f"SYNC_RESULT = {sync_result}",
    ]
    for line in lines:
        stamped = _run_stamp(run_id, line)
        print(stamped)
        log.append(stamped)
    sys.stdout.flush()


def _print_final_summary(
    *,
    run_id: str,
    supply_csv: int,
    demand_csv: int,
    supply_sheet: int | None,
    demand_sheet: int | None,
    overview: str,
    result: str,
    supply_inserts: int = 0,
    supply_updates: int = 0,
    demand_inserts: int = 0,
    demand_updates: int = 0,
    sheet_id: str | None = None,
    spreadsheet_title: str | None = None,
    supply_before: int | None = None,
    supply_after: int | None = None,
    demand_before: int | None = None,
    demand_after: int | None = None,
    first_blocker: str | None = None,
    log: list[str] | None = None,
) -> None:
    fs = (
        f"FINAL SUMMARY: sheet_id={_fmt_summary_str(sheet_id)} "
        f"spreadsheet_title={_fmt_summary_str(spreadsheet_title)} "
        f"supply_before={_fmt_summary_num(supply_before)} "
        f"supply_after={_fmt_summary_num(supply_after)} "
        f"demand_before={_fmt_summary_num(demand_before)} "
        f"demand_after={_fmt_summary_num(demand_after)} "
        f"supply_csv={supply_csv} demand_csv={demand_csv} "
        f"supply_sheet={_fmt_summary_num(supply_sheet)} "
        f"demand_sheet={_fmt_summary_num(demand_sheet)} "
        f"supply_inserts={supply_inserts} supply_updates={supply_updates} "
        f"demand_inserts={demand_inserts} demand_updates={demand_updates} "
        f"overview={overview} result={result}"
    )
    fs_line = _run_stamp(run_id, fs)
    print(fs_line)
    sys.stdout.flush()
    if log is not None:
        log.append(fs_line)
    if result == "FAIL" and first_blocker:
        fb_line = _run_stamp(run_id, f"FIRST_BLOCKER: {first_blocker}")
        print(fb_line)
        sys.stdout.flush()
        if log is not None:
            log.append(fb_line)


def _first_blocker_sync_verify(
    *,
    n_supply: int,
    n_demand: int,
    sheet_rs: int | None,
    sheet_rd: int | None,
    sheet_ro: int | None,
    overview_nonempty: bool,
    ok_s: bool,
    ok_d: bool,
    ok_o: bool,
) -> str:
    if n_supply > 0 and sheet_rs == 0:
        return "GSHEET_VERIFY_FAIL: no sheet data rows written (SUPPLY_PRIORITY)"
    if n_demand > 0 and sheet_rd == 0:
        return "GSHEET_VERIFY_FAIL: no sheet data rows written (DEMAND_READY)"
    if overview_nonempty and sheet_ro == 0:
        return "GSHEET_VERIFY_FAIL: no sheet data rows written (BATCH_OVERVIEW)"
    if not ok_s:
        return "SUPPLY_PRIORITY tab verification failed"
    if not ok_d:
        return "DEMAND_READY tab verification failed"
    if not ok_o:
        return "BATCH_OVERVIEW tab verification failed"
    return "verify pipeline failed"


def _verify_supply_or_demand_tab(
    ws,
    tab_label: str,
    sync_result: WorksheetSyncResult,
    log: list[str],
) -> bool:
    """Read back sheet: batch keys present, no duplicate _sync_key, manual cols unchanged."""
    if sync_result.skipped:
        msg = f"[VERIFY] {tab_label} FAIL: sync did not complete (aborted or unreadable CSV)"
        log.append(msg)
        return False

    allv = ws.get_all_values()
    if not allv:
        msg = f"[VERIFY] {tab_label} FAIL: empty worksheet after sync"
        log.append(msg)
        return False

    header = [str(c).strip() for c in allv[0]]
    if SYNC_KEY_COL not in header:
        msg = f"[VERIFY] {tab_label} FAIL: missing {SYNC_KEY_COL} after readback"
        log.append(msg)
        return False

    key_idx = header.index(SYNC_KEY_COL)
    key_occurrences: dict[str, list[int]] = {}
    for rnum, data_row in enumerate(allv[1:], start=2):
        cells = _pad_row_cells(list(data_row), len(header))
        k = cells[key_idx].strip()
        if not k:
            continue
        key_occurrences.setdefault(k, []).append(rnum)

    sheet_keys = set(key_occurrences.keys())
    for bk in sync_result.batch_keys:
        if bk not in sheet_keys:
            msg = f"[VERIFY] {tab_label} FAIL: batch key missing on sheet {bk!r}"
            log.append(msg)
            return False

    # Append-only lane: verify current batch rows are really appended and tagged.
    if COL_BATCH_ID in header:
        batch_idx = header.index(COL_BATCH_ID)
        rows_in_batch = 0
        for data_row in allv[1:]:
            cells = _pad_row_cells(list(data_row), len(header))
            if cells[batch_idx].strip() == RUN_BATCH_ID:
                rows_in_batch += 1
        if rows_in_batch < sync_result.inserts:
            msg = (
                f"[VERIFY] {tab_label} FAIL: appended rows not found for batch "
                f"{RUN_BATCH_ID} (expected_at_least={sync_result.inserts}, found={rows_in_batch})"
            )
            log.append(msg)
            return False

    for key, before_manual in sync_result.preserved_manual.items():
        if key not in key_occurrences:
            msg = f"[VERIFY] {tab_label} FAIL: merge key {key!r} missing after readback"
            log.append(msg)
            return False
        rnum = min(key_occurrences[key])
        row_cells = allv[rnum - 1]
        after_manual = _extract_manual_from_line(header, row_cells)
        for col, val in before_manual.items():
            if col not in header:
                continue
            if (after_manual.get(col, "")) != (val or ""):
                msg = (
                    f"[VERIFY] {tab_label} FAIL: manual column {col!r} changed "
                    f"unexpectedly for key {key!r}"
                )
                log.append(msg)
                return False

    nkeys = len(sync_result.batch_keys)
    msg = (
        f"[VERIFY] {tab_label} PASS keys={nkeys} append_only=1 "
        f"empty_csv_keys={sync_result.empty_key_skips}"
    )
    log.append(msg)
    return True


def _verify_batch_overview_tab(ws, log: list[str]) -> bool:
    """Row 1 = header; at least one non-empty data row from row 2 downward."""
    allv = ws.get_all_values()
    if not allv:
        msg = "[VERIFY] BATCH_OVERVIEW FAIL: empty worksheet"
        log.append(msg)
        return False

    nonempty_below = 0
    for i in range(1, len(allv)):
        row = allv[i]
        if any(str(c).strip() for c in row):
            nonempty_below += 1

    if nonempty_below < 1:
        msg = (
            f"[VERIFY] BATCH_OVERVIEW FAIL: expected at least 1 non-empty data row below header, "
            f"got {nonempty_below}"
        )
        log.append(msg)
        return False

    msg = f"[VERIFY] BATCH_OVERVIEW PASS rows={nonempty_below}"
    log.append(msg)
    return True


def load_telegram_state() -> dict:
    """Load persistent Telegram dedup state from disk (returns {} on missing/corrupt)."""
    if not _TG_STATE_PATH.is_file():
        return {}
    try:
        return json.loads(_TG_STATE_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_telegram_state(state: dict) -> None:
    """Persist Telegram dedup state to disk so it survives between runs."""
    _TG_STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    _TG_STATE_PATH.write_text(
        json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def append_batch_history(entry: dict) -> None:
    """Append one run-record to the JSONL history file (never overwrites)."""
    _BATCH_HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _BATCH_HISTORY_PATH.open("a", encoding="utf-8") as _f:
        _f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _safe(v: str) -> str:
    """Return value as-is, or 'N/A' when blank."""
    return v if (v or "").strip() else "N/A"


def build_ma_can(row: dict) -> str:
    """Derive a display ID: prefer explicit field, fall back to tail of URL."""
    return (
        row.get("ma_can")
        or row.get("listing_key")
        or row.get("unit_code")
        or row.get("_sync_key")
        or row.get("link", "")[-12:]
    )


def clean_area(area) -> str:
    """Normalise area string to '<int> m2', or 'N/A' when out of range / unparseable."""
    try:
        val = float(str(area or "").replace("m2", "").replace("m²", "").strip())
        if val < 20 or val > 500:
            return "N/A"
        return f"{int(val)} m2"
    except Exception:
        return "N/A"


def clean_price(p) -> str:
    """Return price string as-is, or 'N/A' when falsy."""
    if not p:
        return "N/A"
    return str(p)


def pick_image(row: dict) -> str:
    """Return the first non-empty image URL found."""
    return row.get("image") or row.get("image_url") or row.get("anh") or ""


def normalize_telegram_row(row: dict) -> dict:
    """
    Map upstream CSV column names to canonical Telegram display fields.

    Upstream supply columns:  link, contact, budget, area, source
    Upstream demand columns:  _sync_key, contact, budget, area, unit_code
    """
    return {
        "ma_can":       build_ma_can(row),
        "gia_thue":     clean_price(row.get("gia_thue") or row.get("budget")),
        "gia_ban":      "N/A",
        "sdt_lien_he":  row.get("sdt_lien_he") or row.get("sdt_khach") or row.get("phone") or row.get("contact") or "N/A",
        "dien_tich":    clean_area(row.get("dien_tich") or row.get("area")),
        "thoi_gian_dang": (
            row.get("thoi_gian_dang")
            or row.get("thoi_gian")
            or row.get("synced_at_vn")
            or ""
        ),
        "link": row.get("link") or row.get("url") or "",
        "anh":  pick_image(row),
    }


def format_telegram_message(row: dict, status: str) -> str:
    """
    Format one listing as a Telegram message.
    status = "NEW"    → prefix [MỚI]
    status = "UPDATE" → prefix [CẬP NHẬT]
    Only call for status in ("NEW", "UPDATE") — never for SAME / INVALID / ERROR.
    """
    prefix = "[MỚI]" if status == "NEW" else "[CẬP NHẬT]"
    return (
        f"{prefix}\n"
        f"Mã: {_safe(row.get('ma_can', ''))}\n"
        f"Giá thuê: {_safe(row.get('gia_thue', ''))}\n"
        f"Giá bán: {_safe(row.get('gia_ban', ''))}\n"
        f"SĐT liên hệ: {_safe(row.get('sdt_lien_he', ''))}\n"
        f"Diện tích: {_safe(row.get('dien_tich', ''))}\n"
        f"Thời gian: {_safe(row.get('thoi_gian_dang', ''))}\n"
        f"Link: {_safe(row.get('link', ''))}\n"
        f"Ảnh: {_safe(row.get('anh', ''))}"
    )


def is_valid_listing(row: dict) -> bool:
    """
    Validate a *normalized* Telegram row (output of normalize_telegram_row).
    Requires: non-empty link AND non-empty / non-N/A sdt_lien_he.
    Demand rows (no URL) are intentionally blocked here.
    """
    if not (row.get("link") or "").strip():
        return False
    sdt = (row.get("sdt_lien_he") or "").strip()
    if not sdt or sdt == "N/A":
        return False
    return True


def _try_notify_listing(
    row: dict,
    status: str,
    sent_state: dict,
    lane: str = LANE_NAME,
) -> str:
    """
    Single choke-point for all per-listing Telegram sends.
    Guards (in order):
      1. status must be NEW or UPDATE
      2. normalize upstream CSV fields → canonical tg_row
      3. tg_row must pass is_valid_listing (link + phone required)
      4. tg_row must not be a duplicate of a previously sent hash (cross-run anti-spam)

    Returns one of: "SENT", "SAME", "INVALID", "BLOCKED"
    sent_state is mutated in-place (keyed by canonical link, value = tg_row hash).
    """
    if status not in ("NEW", "UPDATE"):
        return "BLOCKED"
    tg_row = normalize_telegram_row(row)
    if not is_valid_listing(tg_row):
        return "INVALID"
    # Use normalized link as dedup key; fall back to raw _sync_key for demand
    key = (tg_row.get("link") or "").strip() or (row.get("_sync_key") or "").strip()
    if not key:
        return "INVALID"
    row_hash = str(hash(frozenset(sorted(tg_row.items()))))
    if sent_state.get(key) == row_hash:
        return "SAME"
    sent_state[key] = row_hash
    send_telegram_message(format_telegram_message(tg_row, status), lane=lane)
    return "SENT"


def _resolve_chat_id_for_lane(lane: str) -> str:
    """Return TELEGRAM_CHAT_ID_<LANE> for the given lane, or '' if unset.

    No cross-lane fallback: if the lane-specific var is missing, we refuse to
    send so we never route a lane's listing to the wrong chat.
    """
    key = f"TELEGRAM_CHAT_ID_{(lane or '').upper()}"
    return (os.environ.get(key) or "").strip()


def send_telegram_message(text: str, lane: str = LANE_NAME) -> None:
    """
    Fire-and-forget Telegram notification, routed by lane.
    Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID_<LANE> (e.g. TELEGRAM_CHAT_ID_RENT,
    TELEGRAM_CHAT_ID_GARA) from env. Silently skips if either is unset.
    Never raises — sync result is unaffected.
    """
    import urllib.request as _urlreq

    token = (os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip()
    chat_id = _resolve_chat_id_for_lane(lane)
    if not chat_id:
        print(
            f"[TELEGRAM] TELEGRAM_CHAT_ID_MISSING_FOR_LANE lane={lane} "
            f"env=TELEGRAM_CHAT_ID_{lane.upper()}",
            file=sys.stderr,
        )
        return
    if not token:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = _urlreq.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with _urlreq.urlopen(req, timeout=10) as _resp:
            _resp.read()
    except Exception as _exc:
        print(f"[TELEGRAM] send failed: {_exc}", file=sys.stderr)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--schema-check",
        action="store_true",
        help="Local-only CSV schema/contract check. No GSheet write and no Telegram send.",
    )
    args = ap.parse_args()

    log: list[str] = []
    run_id = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
    global RUN_BATCH_ID, RUN_SYNCED_AT_VN
    RUN_BATCH_ID = run_id
    RUN_SYNCED_AT_VN = get_vn_time_str()
    log.append(_run_stamp(run_id, f"RUN_ID={run_id}"))
    print(_run_stamp(run_id, f"RUN_ID={run_id}"))
    sys.stdout.flush()

    # Set global socket timeout — prevents any network call from blocking forever.
    socket.setdefaulttimeout(60)

    log.append(_run_stamp(run_id, "gsheet sync start"))
    print(_run_stamp(run_id, "gsheet sync start"))
    sys.stdout.flush()

    if args.schema_check:
        return _schema_check_local_only(run_id, log)

    missing_tg = _missing_required_telegram_env_for_rent()
    if missing_tg:
        err = "TELEGRAM_ENV_REQUIRED_FOR_RENT_SYNC"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=None,
            credential_file_exists=None,
            credential_source=None,
            api_detail=err,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=(os.environ.get("RENT_GSHEET_ID") or "").strip() or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=err,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    if not RENT_FINAL_CSV.is_file():
        err = f"STOP: lanes/rent/output/final.csv not found — run rent scout first ({RENT_FINAL_CSV})"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=None,
            credential_file_exists=None,
            credential_source=None,
            api_detail=err,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=(os.environ.get("RENT_GSHEET_ID") or "").strip() or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=err,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    final_fieldnames, final_rows = _load_csv_raw(RENT_FINAL_CSV)
    if not final_fieldnames or not final_rows:
        err = "FINAL_CSV_EMPTY_OR_HEADER_ONLY"
        print(_run_stamp(run_id, err), file=sys.stderr)
        log.append(_run_stamp(run_id, err))
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=None,
            credential_file_exists=None,
            credential_source=None,
            api_detail=err,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=(os.environ.get("RENT_GSHEET_ID") or "").strip() or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=err,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    cred_path, cred_label = _resolve_credentials(run_id, log)
    if not cred_path:
        detail = "No service account JSON found after scanning env + repo credentials/* fallbacks"
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="KEY_MISSING",
            credential_path_used=None,
            credential_file_exists=False,
            credential_source=None,
            api_detail=detail,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=(os.environ.get("RENT_GSHEET_ID") or "").strip() or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker="KEY_MISSING: " + detail,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    sheet_id = (os.environ.get("RENT_GSHEET_ID") or "").strip()
    if not sheet_id:
        detail = "RENT_GSHEET_ID is not set"
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="CONFIG_MISSING",
            credential_path_used=cred_path,
            credential_file_exists=True,
            credential_source=cred_label,
            api_detail=detail,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=detail,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    paths = {
        "supply_priority_live": _RENT_OUTPUT_DIR / "supply.csv",
        "demand_sale_ready": _RENT_OUTPUT_DIR / "demand.csv",
        "batch_overview": _RENT_OUTPUT_DIR / "overview.txt",
    }
    log.append(_run_stamp(run_id, f"output_dir={_RENT_OUTPUT_DIR.resolve()}"))

    missing = [(k, p) for k, p in paths.items() if not p.is_file()]
    if missing:
        for k, p in missing:
            err = f"STOP: missing CSV under output — {k}={p.resolve()}"
            print(_run_stamp(run_id, err), file=sys.stderr)
            log.append(_run_stamp(run_id, err))
        first = missing[0][0]
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=cred_path,
            credential_file_exists=True,
            credential_source=cred_label,
            api_detail=f"missing input CSV ({first})",
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=sheet_id or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=f"missing input CSV ({first})",
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    p_sup = paths["supply_priority_live"]
    p_dem = paths["demand_sale_ready"]
    p_ov = paths["batch_overview"]

    cs = f"CSV FOUND: supply={p_sup.resolve()}"
    print(_run_stamp(run_id, cs))
    log.append(_run_stamp(run_id, cs))
    _fn_s, rows_s = _load_csv(p_sup)

    cd = f"CSV FOUND: demand={p_dem.resolve()}"
    print(_run_stamp(run_id, cd))
    log.append(_run_stamp(run_id, cd))
    _fn_d, rows_d = _load_csv(p_dem)

    n_supply = len(rows_s)
    n_demand = len(rows_d)

    chk_s = f"[CHECK] supply_rows={n_supply}"
    chk_d = f"[CHECK] demand_rows={n_demand}"
    print(_run_stamp(run_id, chk_s))
    print(_run_stamp(run_id, chk_d))
    log.append(_run_stamp(run_id, chk_s))
    log.append(_run_stamp(run_id, chk_d))

    if n_supply == 0:
        w = "[WARN] SUPPLY CSV EMPTY"
        print(_run_stamp(run_id, w))
        log.append(_run_stamp(run_id, w))
    if n_demand == 0:
        w = "[WARN] DEMAND CSV EMPTY"
        print(_run_stamp(run_id, w))
        log.append(_run_stamp(run_id, w))

    if n_supply == 0 and n_demand == 0:
        abort = "GSHEET_SYNC_ABORT: NO DATA (supply=0, demand=0)"
        log.append(_run_stamp(run_id, abort))
        print(_run_stamp(run_id, abort))
        print(_run_stamp(run_id, abort), file=sys.stderr)
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=cred_path,
            credential_file_exists=True,
            credential_source=cred_label,
            api_detail=abort,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=0,
            demand_csv=0,
            supply_sheet=None,
            demand_sheet=None,
            overview="SKIPPED",
            result="FAIL",
            sheet_id=sheet_id or None,
            spreadsheet_title=None,
            supply_before=None,
            supply_after=None,
            demand_before=None,
            demand_after=None,
            first_blocker=abort,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        _write_run_report(run_id, log)
        return 1

    raw_ov = p_ov.read_text(encoding="utf-8-sig", errors="replace")
    overview_nonempty = bool(raw_ov.strip())
    log.append(_run_stamp(run_id, f"batch_overview ok={overview_nonempty}"))
    if not overview_nonempty:
        ov_warn = "[WARN] BATCH_OVERVIEW EMPTY - SKIP OVERVIEW SYNC"
        print(_run_stamp(run_id, ov_warn))
        log.append(_run_stamp(run_id, ov_warn))

    sheet_rs: int | None = None
    sheet_rd: int | None = None
    sheet_ro: int | None = None
    supply_inserts = supply_updates = demand_inserts = demand_updates = 0
    spreadsheet_title: str | None = None
    supply_before: int | None = None
    supply_after: int | None = None
    demand_before: int | None = None
    demand_after: int | None = None
    existing_keys_from_sheet = 0
    incoming_rows = 0
    new_rows_to_append = 0
    duplicate_vs_sheet = 0
    duplicate_in_batch = 0

    try:
        _ck = _run_stamp(run_id, "[GSHEET] creds:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        gc = _get_client_from_path(cred_path)
        _ck = _run_stamp(
            run_id,
            f"[GSHEET] creds:ok path={cred_path} (real authorize + API calls follow)",
        )
        print(_ck); log.append(_ck); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] open_by_key:start sheet_id={sheet_id}")
        print(_ck); log.append(_ck); sys.stdout.flush()
        sh = gc.open_by_key(sheet_id)
        spreadsheet_title = sh.title
        tgt1 = f"[GSHEET TARGET] sheet_id={sheet_id}"
        tgt2 = f"[GSHEET TARGET] spreadsheet_title={spreadsheet_title}"
        log.append(tgt1); log.append(tgt2)
        _ck = _run_stamp(run_id, f"[GSHEET] open_by_key:ok title={spreadsheet_title}")
        print(_run_stamp(run_id, tgt1)); print(_run_stamp(run_id, tgt2))
        print(_ck); log.append(_ck); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] worksheet:{TAB_SUPPLY}:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        ws_s = _ensure_worksheet(sh, TAB_SUPPLY, log)
        _ck = _run_stamp(run_id, f"[GSHEET] worksheet:{TAB_SUPPLY}:ok")
        print(_ck); log.append(_ck); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] worksheet:{TAB_DEMAND}:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        ws_d = _ensure_worksheet(sh, TAB_DEMAND, log)
        _ck = _run_stamp(run_id, f"[GSHEET] worksheet:{TAB_DEMAND}:ok")
        print(_ck); log.append(_ck); sys.stdout.flush()

        _write_default_headers_if_empty(ws_s, HEADER_SUPPLY, log)
        _write_default_headers_if_empty(ws_d, HEADER_DEMAND, log)

        supply_before = _nonempty_data_rows_below_header(ws_s)
        _m = f"[GSHEET TAB] title={ws_s.title} row_count_before={supply_before}"
        log.append(_m); print(_run_stamp(run_id, _m)); sys.stdout.flush()

        demand_before = _nonempty_data_rows_below_header(ws_d)
        _m = f"[GSHEET TAB] title={ws_d.title} row_count_before={demand_before}"
        log.append(_m); print(_run_stamp(run_id, _m)); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] read_csv:supply_priority_live:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        res_s = sync_worksheet(ws_s, paths["supply_priority_live"], supply_sync_key, log)
        supply_inserts, supply_updates = res_s.inserts, res_s.updates
        supply_after = res_s.row_count_after
        _ck = _run_stamp(run_id, f"[GSHEET] write:{TAB_SUPPLY}:ok inserts={supply_inserts} updates={supply_updates}")
        print(_ck); log.append(_ck); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] read_csv:demand_sale_ready:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        res_d = sync_worksheet(ws_d, paths["demand_sale_ready"], demand_sync_key, log)
        demand_inserts, demand_updates = res_d.inserts, res_d.updates
        demand_after = res_d.row_count_after
        _ck = _run_stamp(run_id, f"[GSHEET] write:{TAB_DEMAND}:ok inserts={demand_inserts} updates={demand_updates}")
        print(_ck); log.append(_ck); sys.stdout.flush()
        for line in (
            f"DEMAND_EXISTING_KEYS={res_d.existing_keys_from_sheet}",
            f"DEMAND_INCOMING_ROWS={res_d.incoming_rows}",
            f"DEMAND_DUPLICATE_VS_SHEET={res_d.duplicate_vs_sheet}",
            f"DEMAND_DUPLICATE_IN_BATCH={res_d.duplicate_in_batch}",
            f"DEMAND_NEW_ROWS_TO_APPEND={res_d.inserts}",
        ):
            stamped = _run_stamp(run_id, line)
            print(stamped)
            log.append(stamped)
        sys.stdout.flush()

        # ── SYNC DIAGNOSIS block ─────────────────────────────────────────────
        _s_ready   = res_s.incoming_rows
        _s_same    = res_s.duplicate_vs_sheet + res_s.same_blocked_by_phone
        _s_append  = res_s.inserts
        _d_ready   = res_d.incoming_rows
        _d_same    = res_d.duplicate_vs_sheet + res_d.same_blocked_by_phone
        _d_append  = res_d.inserts
        _t_ready   = _s_ready  + _d_ready
        _t_same    = _s_same   + _d_same
        _t_append  = _s_append + _d_append

        _diag_lines = [
            "=" * 52,
            "SYNC DIAGNOSIS",
            f"{'TAB':<20} {'READY':>6} {'SAME_BLOCKED':>13} {'APPENDED':>9}",
            f"{TAB_SUPPLY:<20} {_s_ready:>6} {_s_same:>13} {_s_append:>9}",
            f"{TAB_DEMAND:<20} {_d_ready:>6} {_d_same:>13} {_d_append:>9}",
            f"{'TOTAL':<20} {_t_ready:>6} {_t_same:>13} {_t_append:>9}",
        ]

        if _t_ready > 0 and _t_append == 0:
            if _t_same == _t_ready:
                _why = "ALL_SAME: every incoming row already exists in sheet (dedup blocked all)"
            elif res_s.duplicate_in_batch + res_d.duplicate_in_batch > 0:
                _why = "BATCH_DUP: some rows were duplicated within the CSV batch itself"
            else:
                _why = "FILTERED: rows were skipped before append (check empty_sync_key_skips)"
            _diag_lines.append(f"WHY_NOT_APPENDED = {_why}")
        elif _t_append > 0:
            _diag_lines.append(f"APPENDED_OK = {_t_append} new row(s) written to sheet")

        _diag_lines += [
            f"SUPPLY_TAB  = {TAB_SUPPLY}",
            f"DEMAND_TAB  = {TAB_DEMAND}",
            f"OVERVIEW_TAB = {TAB_OVERVIEW}",
            "=" * 52,
        ]
        for _dl in _diag_lines:
            _stamped = _run_stamp(run_id, _dl)
            print(_stamped)
            log.append(_stamped)
        sys.stdout.flush()
        # ── end SYNC DIAGNOSIS ───────────────────────────────────────────────

        demand_rows_for_overview = _nonempty_data_rows_below_header(ws_d)

        existing_keys_from_sheet = res_s.existing_keys_from_sheet
        incoming_rows = res_s.incoming_rows
        new_rows_to_append = res_s.inserts
        duplicate_vs_sheet = res_s.duplicate_vs_sheet
        duplicate_in_batch = res_s.duplicate_in_batch

        ws_o = None
        if overview_nonempty:
            _ck = _run_stamp(run_id, f"[GSHEET] worksheet:{TAB_OVERVIEW}:start")
            print(_ck); log.append(_ck); sys.stdout.flush()
            ws_o = _ensure_worksheet(sh, TAB_OVERVIEW, log)
            _write_default_headers_if_empty(ws_o, HEADER_OVERVIEW, log)
            ov_before = _nonempty_data_rows_below_header(ws_o)
            _m = f"[GSHEET TAB] title={ws_o.title} row_count_before={ov_before}"
            log.append(_m); print(_run_stamp(run_id, _m)); sys.stdout.flush()
            _ck = _run_stamp(run_id, f"[GSHEET] write:{TAB_OVERVIEW}:start")
            print(_ck); log.append(_ck); sys.stdout.flush()
            sync_overview(ws_o, paths["batch_overview"], log, demand_rows_for_overview)
            _ck = _run_stamp(run_id, f"[GSHEET] write:{TAB_OVERVIEW}:ok")
            print(_ck); log.append(_ck); sys.stdout.flush()

        pre_verify_removed_s = 0
        pre_verify_removed_d = 0
        pv = (
            f"  [GSHEET] pre_verify_duplicate_rows_removed_total="
            f"{pre_verify_removed_s + pre_verify_removed_d} "
            f"tab_supply={pre_verify_removed_s} tab_demand={pre_verify_removed_d}"
        )
        log.append(_run_stamp(run_id, pv))

        sheet_rs = _nonempty_data_rows_below_header(ws_s)
        sheet_rd = _nonempty_data_rows_below_header(ws_d)
        if ws_o is not None:
            sheet_ro = _nonempty_data_rows_below_header(ws_o)
            sheet_line = (
                f"SHEET ROWS: {TAB_SUPPLY}={sheet_rs} {TAB_DEMAND}={sheet_rd} "
                f"{TAB_OVERVIEW}={sheet_ro}"
            )
        else:
            sheet_ro = None
            sheet_line = (
                f"SHEET ROWS: {TAB_SUPPLY}={sheet_rs} {TAB_DEMAND}={sheet_rd} "
                f"{TAB_OVERVIEW}=SKIPPED"
            )
        print(_run_stamp(run_id, sheet_line))
        log.append(_run_stamp(run_id, sheet_line))

        wr_ok = True
        if n_supply > 0 and sheet_rs == 0:
            fail_wr = "GSHEET_VERIFY_FAIL: no sheet data rows written"
            print(_run_stamp(run_id, fail_wr), file=sys.stderr)
            log.append(_run_stamp(run_id, fail_wr))
            wr_ok = False
        if n_demand > 0 and sheet_rd == 0:
            fail_wr = "GSHEET_VERIFY_FAIL: no sheet data rows written"
            print(_run_stamp(run_id, fail_wr), file=sys.stderr)
            log.append(_run_stamp(run_id, fail_wr))
            wr_ok = False
        if overview_nonempty and sheet_ro == 0:
            fail_wr = "GSHEET_VERIFY_FAIL: no sheet data rows written"
            print(_run_stamp(run_id, fail_wr), file=sys.stderr)
            log.append(_run_stamp(run_id, fail_wr))
            wr_ok = False

        _ck = _run_stamp(run_id, f"[GSHEET] verify:{TAB_SUPPLY}:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        ok_s = _verify_supply_or_demand_tab(ws_s, TAB_SUPPLY, res_s, log)
        _ck = _run_stamp(run_id, f"[GSHEET] verify:{TAB_SUPPLY}:{'ok' if ok_s else 'FAIL'}")
        print(_ck); log.append(_ck); sys.stdout.flush()

        _ck = _run_stamp(run_id, f"[GSHEET] verify:{TAB_DEMAND}:start")
        print(_ck); log.append(_ck); sys.stdout.flush()
        ok_d = _verify_supply_or_demand_tab(ws_d, TAB_DEMAND, res_d, log)
        _ck = _run_stamp(run_id, f"[GSHEET] verify:{TAB_DEMAND}:{'ok' if ok_d else 'FAIL'}")
        print(_ck); log.append(_ck); sys.stdout.flush()

        ok_o = (
            _verify_batch_overview_tab(ws_o, log)
            if ws_o is not None
            else True
        )
        if ws_o is not None:
            _ck = _run_stamp(run_id, f"[GSHEET] verify:{TAB_OVERVIEW}:{'ok' if ok_o else 'FAIL'}")
            print(_ck); log.append(_ck); sys.stdout.flush()

        verify_ok = wr_ok and ok_s and ok_d and ok_o
        actual_supply_appended = (
            max(0, int(sheet_rs or 0) - int(supply_before or 0))
            if supply_before is not None and sheet_rs is not None
            else max(0, int(supply_inserts or 0))
        )
        actual_demand_appended = (
            max(0, int(sheet_rd or 0) - int(demand_before or 0))
            if demand_before is not None and sheet_rd is not None
            else max(0, int(demand_inserts or 0))
        )
        actual_appended_rows = actual_supply_appended + actual_demand_appended
        eligible_rows = (
            (res_s.incoming_rows + res_d.incoming_rows)
            - (res_s.contract_guard_skips + res_d.contract_guard_skips)
            - (res_s.empty_key_skips + res_d.empty_key_skips)
        )
        if eligible_rows < 0:
            eligible_rows = 0
        dedup_skipped_rows = (
            res_s.duplicate_vs_sheet
            + res_d.duplicate_vs_sheet
            + res_s.duplicate_in_batch
            + res_d.duplicate_in_batch
            + res_s.same_blocked_by_phone
            + res_d.same_blocked_by_phone
        )
        blocked_rows_by_reason: dict[str, int] = {}
        for reason, count in (*res_s.blocked_rows_by_reason, *res_d.blocked_rows_by_reason):
            blocked_rows_by_reason[reason] = blocked_rows_by_reason.get(reason, 0) + int(count)
        blocked_rows_by_reason_json = json.dumps(blocked_rows_by_reason, ensure_ascii=False, sort_keys=True)
        ov_summary = "SYNCED" if overview_nonempty else "SKIPPED"
        if verify_ok:
            send_decision = "SEND" if actual_appended_rows > 0 else "SKIP"
            _app_line = _run_stamp(run_id, f"APPENDED_ROWS={actual_appended_rows}")
            _dec_line = _run_stamp(run_id, f"FINAL_DECISION={send_decision}")
            print(_app_line)
            print(_dec_line)
            log.append(_app_line)
            log.append(_dec_line)
            _eligible_line = _run_stamp(run_id, f"ELIGIBLE_ROWS={eligible_rows}")
            _dedup_line = _run_stamp(run_id, f"DEDUP_SKIPPED_ROWS={dedup_skipped_rows}")
            _blocked_line = _run_stamp(run_id, f"BLOCKED_ROWS_BY_REASON={blocked_rows_by_reason_json}")
            print(_eligible_line)
            print(_dedup_line)
            print(_blocked_line)
            log.append(_eligible_line)
            log.append(_dedup_line)
            log.append(_blocked_line)
            sys.stdout.flush()
            if actual_appended_rows == 0:
                is_dedup_only_noop = eligible_rows > 0 and dedup_skipped_rows >= eligible_rows
                if is_dedup_only_noop:
                    result_status = "DEDUP_ONLY_NOOP"
                    _status_line = _run_stamp(run_id, f"RESULT_STATUS={result_status}")
                    print(_status_line)
                    log.append(_status_line)
                    _print_append_metrics(
                        run_id=run_id,
                        existing_keys_from_sheet=existing_keys_from_sheet,
                        incoming_rows=incoming_rows,
                        new_rows_to_append=new_rows_to_append,
                        duplicate_vs_sheet=duplicate_vs_sheet,
                        duplicate_in_batch=duplicate_in_batch,
                        sync_result=result_status,
                        log=log,
                    )
                    _emit_gsheet_runtime_json(
                        run_id=run_id,
                        code="DEDUP_ONLY_NOOP",
                        credential_path_used=cred_path,
                        credential_file_exists=True,
                        credential_source=cred_label,
                        api_detail=(
                            f"eligible_rows={eligible_rows} appended_rows=0 "
                            f"dedup_skipped_rows={dedup_skipped_rows} blocked_rows_by_reason={blocked_rows_by_reason_json}"
                        ),
                        log=log,
                    )
                    _print_final_summary(
                        run_id=run_id,
                        supply_csv=n_supply,
                        demand_csv=n_demand,
                        supply_sheet=sheet_rs,
                        demand_sheet=sheet_rd,
                        overview=ov_summary,
                        result="PASS",
                        supply_inserts=supply_inserts,
                        supply_updates=supply_updates,
                        demand_inserts=demand_inserts,
                        demand_updates=demand_updates,
                        sheet_id=sheet_id or None,
                        spreadsheet_title=spreadsheet_title,
                        supply_before=supply_before,
                        supply_after=sheet_rs,
                        demand_before=demand_before,
                        demand_after=sheet_rd,
                        log=log,
                    )
                    _append_log(_repo_logs_dir() / "rent_gsheet_sync.log", log)
                    _write_run_report(run_id, log)
                    return 0
                fail_zero = "RENT SYNC FAILED - 0 ROW"
                _status_line = _run_stamp(run_id, "RESULT_STATUS=SYNC_FAIL_ZERO_APPEND")
                print(_status_line)
                log.append(_status_line)
                print(_run_stamp(run_id, fail_zero), file=sys.stderr)
                print(_run_stamp(run_id, fail_zero))
                log.append(_run_stamp(run_id, fail_zero))
                _emit_gsheet_runtime_json(
                    run_id=run_id,
                    code="SYNC_FAIL",
                    credential_path_used=cred_path,
                    credential_file_exists=True,
                    credential_source=cred_label,
                    api_detail=(
                        f"{fail_zero} | eligible_rows={eligible_rows} appended_rows=0 "
                        f"dedup_skipped_rows={dedup_skipped_rows} blocked_rows_by_reason={blocked_rows_by_reason_json}"
                    ),
                    log=log,
                )
                _print_final_summary(
                    run_id=run_id,
                    supply_csv=n_supply,
                    demand_csv=n_demand,
                    supply_sheet=sheet_rs,
                    demand_sheet=sheet_rd,
                    overview=ov_summary,
                    result="FAIL",
                    supply_inserts=supply_inserts,
                    supply_updates=supply_updates,
                    demand_inserts=demand_inserts,
                    demand_updates=demand_updates,
                    sheet_id=sheet_id or None,
                    spreadsheet_title=spreadsheet_title,
                    supply_before=supply_before,
                    supply_after=sheet_rs,
                    demand_before=demand_before,
                    demand_after=sheet_rd,
                    first_blocker=fail_zero,
                    log=log,
                )
                _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
                _write_run_report(run_id, log)
                return 1
            _status_line = _run_stamp(run_id, "RESULT_STATUS=SYNC_SUCCESS")
            print(_status_line)
            log.append(_status_line)
            log.append(_run_stamp(run_id, "SYNC DONE"))
            print(_run_stamp(run_id, "SYNC DONE"))
            print(_run_stamp(run_id, "KẾT LUẬN CUỐI: PASS"))
            _print_append_metrics(
                run_id=run_id,
                existing_keys_from_sheet=existing_keys_from_sheet,
                incoming_rows=incoming_rows,
                new_rows_to_append=new_rows_to_append,
                duplicate_vs_sheet=duplicate_vs_sheet,
                duplicate_in_batch=duplicate_in_batch,
                sync_result="PASS",
                log=log,
            )
            sys.stdout.flush()
            _print_final_summary(
                run_id=run_id,
                supply_csv=n_supply,
                demand_csv=n_demand,
                supply_sheet=sheet_rs,
                demand_sheet=sheet_rd,
                overview=ov_summary,
                result="PASS",
                supply_inserts=supply_inserts,
                supply_updates=supply_updates,
                demand_inserts=demand_inserts,
                demand_updates=demand_updates,
                sheet_id=sheet_id or None,
                spreadsheet_title=spreadsheet_title,
                supply_before=supply_before,
                supply_after=supply_after,
                demand_before=demand_before,
                demand_after=demand_after,
                log=log,
            )
            _emit_gsheet_runtime_json(
                run_id=run_id,
                code="SYNC_SUCCESS",
                credential_path_used=cred_path,
                credential_file_exists=True,
                credential_source=cred_label,
                api_detail=(
                    f"verify_ok=1 supply_inserts={supply_inserts} demand_inserts={demand_inserts} "
                    f"spreadsheet={spreadsheet_title!r}"
                ),
                log=log,
            )
            _append_log(_repo_logs_dir() / "rent_gsheet_sync.log", log)
            _write_run_report(run_id, log)
            # --- persistent state: load before loop, save after ---
            _tg_state = load_telegram_state()
            _tg_counters: dict[str, int] = {"SENT": 0, "SAME": 0, "INVALID": 0, "BLOCKED": 0}
            _telegram_candidates = sorted(
                (*res_s.appended_row_dicts, *res_d.appended_row_dicts),
                key=lambda row: (-calculate_score(row), build_listing_key(row), row.get("_sync_key", "")),
            )[:5]
            for _row in _telegram_candidates:
                _outcome = _try_notify_listing(_row, "NEW", _tg_state)
                _tg_counters[_outcome] = _tg_counters.get(_outcome, 0) + 1
            save_telegram_state(_tg_state)
            _total_appended = len(res_s.appended_row_dicts) + len(res_d.appended_row_dicts)
            append_batch_history({
                "batch_id": run_id,
                "started_at_vn": RUN_SYNCED_AT_VN,
                "ended_at_vn": get_vn_time_str(),
                "source_count": _total_appended,
                "valid_count": _tg_counters["SENT"] + _tg_counters["SAME"],
                "invalid_count": _tg_counters["INVALID"],
                "new_count": _tg_counters["SENT"],
                "same_count": _tg_counters["SAME"],
                "update_count": 0,
                "append_count": actual_appended_rows,
                "telegram_sent_count": _tg_counters["SENT"],
                "result": "PASS",
                "error_summary": "",
            })
            return 0
        print(_run_stamp(run_id, "KẾT LUẬN CUỐI: FAIL"), file=sys.stderr)
        print(_run_stamp(run_id, "KẾT LUẬN CUỐI: FAIL"))
        sys.stdout.flush()
        log.append(_run_stamp(run_id, "KẾT LUẬN CUỐI: FAIL"))
        _print_append_metrics(
            run_id=run_id,
                existing_keys_from_sheet=existing_keys_from_sheet,
            incoming_rows=incoming_rows,
            new_rows_to_append=new_rows_to_append,
                duplicate_vs_sheet=duplicate_vs_sheet,
                duplicate_in_batch=duplicate_in_batch,
            sync_result="FAIL",
            log=log,
        )
        fb = _first_blocker_sync_verify(
            n_supply=n_supply,
            n_demand=n_demand,
            sheet_rs=sheet_rs,
            sheet_rd=sheet_rd,
            sheet_ro=sheet_ro,
            overview_nonempty=overview_nonempty,
            ok_s=ok_s,
            ok_d=ok_d,
            ok_o=ok_o,
        )
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code="SYNC_FAIL",
            credential_path_used=cred_path,
            credential_file_exists=True,
            credential_source=cred_label,
            api_detail=fb,
            log=log,
        )
        _print_final_summary(
            run_id=run_id,
            supply_csv=n_supply,
            demand_csv=n_demand,
            supply_sheet=sheet_rs,
            demand_sheet=sheet_rd,
            overview=ov_summary,
            result="FAIL",
            supply_inserts=supply_inserts,
            supply_updates=supply_updates,
            demand_inserts=demand_inserts,
            demand_updates=demand_updates,
            sheet_id=sheet_id or None,
            spreadsheet_title=spreadsheet_title,
            supply_before=supply_before,
            supply_after=supply_after,
            demand_before=demand_before,
            demand_after=demand_after,
            first_blocker=fb,
            log=log,
        )
        _write_run_report(run_id, log)
        return 1
    except Exception as e:
        err = traceback.format_exc()
        print("GSHEET SYNC FAILED")
        print(err)
        sys.stdout.flush()
        log.append("GSHEET SYNC FAILED")
        log.append(err)
        summary = f"GSHEET_SYNC_ERROR {type(e).__name__}: {e!r}"
        print(_run_stamp(run_id, summary))
        log.append(_run_stamp(run_id, summary))
        cls, detail = _classify_gsheet_exception(e)
        _emit_gsheet_runtime_json(
            run_id=run_id,
            code=cls,
            credential_path_used=cred_path,
            credential_file_exists=bool(cred_path and Path(cred_path).is_file()),
            credential_source=cred_label,
            api_detail=detail + " | " + summary[:2000],
            log=log,
        )
        _print_append_metrics(
            run_id=run_id,
            existing_keys_from_sheet=existing_keys_from_sheet,
            incoming_rows=incoming_rows,
            new_rows_to_append=new_rows_to_append,
            duplicate_vs_sheet=duplicate_vs_sheet,
            duplicate_in_batch=duplicate_in_batch,
            sync_result="FAIL",
            log=log,
        )
        ov_summary_ex = "SYNCED" if overview_nonempty else "SKIPPED"
        _print_final_summary(
            run_id=run_id,
            supply_csv=n_supply,
            demand_csv=n_demand,
            supply_sheet=sheet_rs,
            demand_sheet=sheet_rd,
            overview=ov_summary_ex,
            result="FAIL",
            supply_inserts=supply_inserts,
            supply_updates=supply_updates,
            demand_inserts=demand_inserts,
            demand_updates=demand_updates,
            sheet_id=sheet_id or None,
            spreadsheet_title=spreadsheet_title,
            supply_before=supply_before,
            supply_after=supply_after,
            demand_before=demand_before,
            demand_after=demand_after,
            first_blocker=summary,
            log=log,
        )
        _append_log(_repo_logs_dir() / "rent_gsheet_sync_error.log", log)
        print(_run_stamp(run_id, "KẾT LUẬN CUỐI: FAIL"))
        log.append(_run_stamp(run_id, "KẾT LUẬN CUỐI: FAIL"))
        _write_run_report(run_id, log)
        return 1


if __name__ == "__main__":
    _exit = main()
    try:
        if "--schema-check" not in sys.argv:
            _repo_root = Path(__file__).resolve().parents[3]
            _merge = _repo_root / "scripts" / "rent_status_merge_gsheet.py"
            subprocess.run(
                [sys.executable, str(_merge), "FAIL" if _exit else "OK"],
                cwd=str(_repo_root),
                timeout=30,
            )
    except Exception:
        pass
    raise SystemExit(_exit)
