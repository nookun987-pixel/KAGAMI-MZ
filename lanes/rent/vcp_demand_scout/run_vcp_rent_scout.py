#!/usr/bin/env python3
"""
VCP_RENT_DEMAND_SCOUT_V1 — quét nhu cầu thuê Vinhomes Central Park.
Chạy: python run_vcp_rent_scout.py [--profile path] [--links path] [--raw dir]

Default: live HTTP crawl only. Local snapshot (input_raw / contract input_raw) requires
VCP_USE_LOCAL_SNAPSHOT=1.
TODO: Optional apartment UI checkbox "Use local snapshot" → set VCP_USE_LOCAL_SNAPSHOT=1 (not wired yet).
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from datetime import datetime, timezone, timedelta

import requests


def _configure_utf8_stdio() -> None:
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream is None or not hasattr(stream, "reconfigure"):
            continue
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass


_configure_utf8_stdio()

_VN_TZ = timezone(timedelta(hours=7))

DIR = Path(__file__).resolve().parent
DEFAULT_PROFILE = DIR / "profile_VCP_RENT_DEMAND.json"
DEFAULT_LINKS = DIR / "input_links.txt"
DEFAULT_RAW = DIR / "input_raw"
DEFAULT_REAL_DEMAND = DIR / "input_real_demand"
OUT_CSV_SUPPLY = DIR / "output_vcp_supply_leads.csv"
OUT_CSV_DEMAND = DIR / "output_vcp_demand_leads.csv"
OUT_CSV_DEMAND_SALE_READY = DIR / "output_vcp_demand_sale_ready.csv"
OUT_CSV_REAL_DEMAND_SALE_READY = DIR / "output_vcp_real_demand_sale_ready.csv"
OUT_DEMAND_HANDOFF = DIR / "DEMAND_SALE_HANDOFF.md"
OUT_REAL_DEMAND_HANDOFF = DIR / "REAL_DEMAND_HANDOFF.md"
OUT_REPORT = DIR / "VCP_RENT_SELF_CHECK_REPORT.md"
OUT_REAL_SOURCE_REPORT = DIR / "VCP_REAL_SOURCE_TEST_REPORT.md"
CONTRACT_INPUT_JSON = DIR / "input" / "input.json"
CONTRACT_INPUT_RAW = DIR / "input" / "input_raw"
CONTRACT_OUTPUT_DIR = DIR / "output"
CONTRACT_LOGS_DIR = DIR / "logs"

BOILERPLATE_BLOCKLIST_PATH = DIR / "config" / "boilerplate_blocklist.txt"
DEFAULT_MIN_TEXT_RAW_CHARS = 40
DEFAULT_SAME_DOMAIN_TEMPLATE_MIN = 3
VCP_USE_LOCAL_SNAPSHOT_ENV = "VCP_USE_LOCAL_SNAPSHOT"
# Hash fingerprint = normalized prefix of body (after SOURCE strip) so minor price/contact deltas
# do not split the same SEO template across dozens of URLs.
DEFAULT_DEDUP_PREFIX_CHARS = 240

SALE_READY_FIELDS = [
    "sync_key",
    "data_origin_type",
    "collected_at_vn",
    "source_url",
    "source_title",
    "source_time",
    "content_hash",
    "business_ready",
    "lead_tier",
    "contact",
    "contact_status",
    "apartment_type",
    "bedrooms",
    "tower_block",
    "unit_code",
    "budget",
    "move_in_time",
    "urgency",
    "area",
    "demand_type",
    "price_text_raw",
    "source_title",
    "source",
    "note_short",
    "budget_confidence",
    "bedrooms_confidence",
    "source_title_confidence",
    "price_text_raw_confidence",
    "field_source_note",
]
def _norm_key_part(v: str) -> str:
    return re.sub(r"\s+", " ", (v or "").strip().lower())


def build_demand_sync_key(
    row: dict[str, Any],
    *,
    row_index: int | None = None,
) -> str:
    source = _norm_key_part(str(row.get("source") or ""))
    contact = _norm_key_part(str(row.get("contact") or ""))
    apt = _norm_key_part(str(row.get("apartment_type") or ""))
    budget = _norm_key_part(str(row.get("budget") or ""))
    if source and contact and apt:
        return f"{source}|{contact}|{apt}"
    if source and contact:
        return f"{source}|{contact}"
    if source and budget and apt:
        return f"{source}|{budget}|{apt}"
    if source and row_index is not None:
        return f"{source}|row_{row_index}"
    return ""


def _classify_data_origin(source: str, link: str) -> str:
    src = (source or "").lower()
    fname = src.split(":")[-1] if ":" in src else src
    if any(x in fname for x in ("sample", "test", "fake", "demo")):
        return "SAMPLE"
    if link and link.startswith(("http://", "https://")):
        return "REAL_SOURCE"
    if src.startswith("local:") or not link:
        return "LOCAL_TRANSFORM"
    return "UNKNOWN"


def _is_supply_row(row: dict[str, Any]) -> bool:
    """Heuristic: supply rows have demand_type containing supply / cho thuê / listing."""
    dt = str(row.get("demand_type") or "").lower()
    return "supply" in dt or "cho thuê" in dt or "listing" in dt


def _is_real_source_business_ready(row: dict[str, Any]) -> bool:
    """Check REAL_SOURCE row has minimum evidence for business_ready=yes."""
    if row.get("data_origin_type") != "REAL_SOURCE":
        return False
    url = str(row.get("source_url") or "")
    if not url.startswith(("http://", "https://")):
        return False
    if not (row.get("content_hash") or "").strip():
        return False
    title = str(row.get("source_title") or row.get("source") or "").strip()
    if not title:
        return False
    contact = str(row.get("contact") or "").strip()
    if not contact:
        return False
    return True


def _enrich_row_contract(row: dict[str, Any], row_index: int | None = None) -> None:
    """In-place add contract fields.
    Force business_ready=no for SAMPLE/UNKNOWN.
    For REAL_SOURCE supply rows, set yes only if evidence check passes.
    Demand rows keep existing business_ready (set by sale-ready V4 logic).
    """
    src = str(row.get("source") or "")
    link = str(row.get("link") or "")
    text = str(row.get("text_raw") or "")
    row["sync_key"] = build_demand_sync_key(row, row_index=row_index)
    row["data_origin_type"] = _classify_data_origin(src, link)
    row["collected_at_vn"] = datetime.now(_VN_TZ).isoformat(timespec="seconds")
    row["source_url"] = link if link.startswith(("http://", "https://")) else ""
    row["source_time"] = ""
    row["content_hash"] = text_raw_hash_key(text)
    dtype = row.get("data_origin_type")
    if dtype in ("SAMPLE", "UNKNOWN"):
        row["business_ready"] = "no"
    elif dtype == "REAL_SOURCE" and _is_supply_row(row):
        row["business_ready"] = "yes" if _is_real_source_business_ready(row) else "no"


TIER_SORT_KEY = {"HOT": 0, "WARM": 1, "COLD": 2}

EMAIL_RE = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
)
BEDROOMS_RE = re.compile(
    r"\b([1-4])\s*(?:pn|p\.n\.?|phòng\s*ngủ|br)\b",
    re.I,
)
TOWER_BLOCK_RE = re.compile(
    r"(Landmark\s*(?:81|Plus|[1-6](?:\b|(?=\s|,)))|Park\s*[1-7]|Central\s*[1-3])",
    re.I,
)
UNIT_CODE_LOOSE_RE = re.compile(
    r"(?:mã\s*(?:căn|hàng)?|căn\s*(?:số)?|unit)\s*[:\-]?\s*([A-Z0-9][A-Z0-9\.\-]{2,14})\b",
    re.I,
)
MOVE_IN_RE = re.compile(
    r"(vào\s*ở\s*ngay|ở\s*ngay|cuối\s*tháng|đầu\s*tháng|trong\s*tuần|tuần\s*này|"
    r"tháng\s*(?:[1-9]|1[0-2])(?!\d)|asap|gấp|gap\b)",
    re.I,
)
PRICE_SNIPPET_RE = re.compile(
    r"(\d+[\s.,]?\d*)\s*(?:triệu|tr\b|tỷ|ty\b)\s*(?:/|\s*per\s*)?\s*(?:tháng|month)?|"
    r"(\$\s*\d+[\d,]*)\s*(?:/|\s*)?(?:tháng|month)?",
    re.I,
)
_TEXT_SOURCE_URL_RE = re.compile(r"(?:^|\n)\s*SOURCE:\s*(https?://[^\s]+)", re.I)
_LEADING_SOURCE_LINE_RE = re.compile(
    r"^\s*SOURCE:\s*https?://\S+\s*\n?",
    re.I | re.MULTILINE,
)

# Chỉ xét phần đầu trang khi phân lane (tránh khớp ngữ cảnh sâu trong bài tin)
LANE_INTENT_HEAD_CHARS = 12000

CSV_FIELDS = [
    "sync_key",
    "data_origin_type",
    "collected_at_vn",
    "source_url",
    "source_title",
    "source_time",
    "content_hash",
    "business_ready",
    "source",
    "link",
    "text_raw",
    "contact",
    "area",
    "demand_type",
    "apartment_type",
    "budget",
    "urgency",
    "score",
    "lead_tier",
]


def _env_int(name: str, default: int) -> int:
    raw = (os.environ.get(name) or "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def use_local_snapshot_enabled() -> bool:
    """Hybrid local snapshot (input_raw / contract input_raw) only when VCP_USE_LOCAL_SNAPSHOT=1."""
    return (os.environ.get(VCP_USE_LOCAL_SNAPSHOT_ENV) or "").strip() == "1"


def normalize_text_raw_for_hash(text: str) -> str:
    s = (text or "").lower()
    s = re.sub(r"[^\w\s]", "", s, flags=re.UNICODE)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _text_body_for_dedup(text: str) -> str:
    """Strip local-raw `SOURCE: https://...` prefix so duplicate SEO bodies share one hash."""
    return _LEADING_SOURCE_LINE_RE.sub("", str(text or ""), count=1).strip()


def _text_raw_fingerprint_snippet(text: str) -> str:
    body = _text_body_for_dedup(text)
    n = _env_int("VCP_DEDUP_PREFIX_CHARS", DEFAULT_DEDUP_PREFIX_CHARS)
    if n <= 0:
        return body
    return body[:n]


def text_raw_hash_key(text: str) -> str:
    basis = normalize_text_raw_for_hash(_text_raw_fingerprint_snippet(text))
    return hashlib.sha256(basis.encode("utf-8")).hexdigest()[:32]


def load_boilerplate_blocklist(path: Path) -> list[str]:
    if not path.is_file():
        return []
    out: list[str] = []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            out.append(line)
    return out


def _infer_url_for_domain(row: dict[str, Any]) -> str:
    lk = (row.get("link") or "").strip()
    if lk.startswith(("http://", "https://")):
        return lk
    tr = str(row.get("text_raw") or "")
    m = _TEXT_SOURCE_URL_RE.search(tr[:1200])
    return m.group(1).strip() if m else ""


def row_domain_key(row: dict[str, Any]) -> str:
    url = _infer_url_for_domain(row)
    if not url:
        return ""
    return (urlparse(url).netloc or "").lower()


def _score_int(row: dict[str, Any]) -> int:
    try:
        return int(row.get("score") or 0)
    except (TypeError, ValueError):
        return 0


def _filter_min_len_and_blocklist(
    rows: list[dict[str, Any]],
    blocklist: list[str],
    min_len: int,
) -> list[dict[str, Any]]:
    phrases = [p.strip() for p in blocklist if p.strip()]
    out: list[dict[str, Any]] = []
    for r in rows:
        tr = str(r.get("text_raw") or "")
        body = _text_body_for_dedup(tr)
        if len(body) < min_len:
            continue
        tl = tr.lower()
        if any(p.lower() in tl for p in phrases):
            continue
        out.append(r)
    return out


def _filter_same_domain_template(
    rows: list[dict[str, Any]],
    min_urls: int,
) -> list[dict[str, Any]]:
    if min_urls < 2 or len(rows) < min_urls:
        return rows
    groups: defaultdict[tuple[str, str], list[dict[str, Any]]] = defaultdict(list)
    no_domain: list[dict[str, Any]] = []
    for r in rows:
        dk = row_domain_key(r)
        if not dk:
            no_domain.append(r)
            continue
        h = text_raw_hash_key(str(r.get("text_raw") or ""))
        groups[(dk, h)].append(r)
    bad = {k for k, v in groups.items() if len(v) >= min_urls}
    kept: list[dict[str, Any]] = []
    for k, vs in groups.items():
        if k in bad:
            continue
        kept.extend(vs)
    return no_domain + kept


def _dedupe_rows_by_text_hash_best_score(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    best: dict[str, dict[str, Any]] = {}
    order: list[str] = []
    for r in rows:
        h = text_raw_hash_key(str(r.get("text_raw") or ""))
        if h not in best:
            best[h] = r
            order.append(h)
            continue
        if _score_int(r) > _score_int(best[h]):
            best[h] = r
    return [best[h] for h in order]


def sanitize_lead_rows(
    rows: list[dict[str, Any]],
    blocklist: list[str],
    *,
    min_len: int,
    same_domain_min: int,
) -> list[dict[str, Any]]:
    step1 = _filter_min_len_and_blocklist(rows, blocklist, min_len)
    step2 = _filter_same_domain_template(step1, same_domain_min)
    return _dedupe_rows_by_text_hash_best_score(step2)


class _HTMLToText(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._chunks: list[str] = []

    def handle_data(self, data: str) -> None:
        self._chunks.append(data)

    def text(self) -> str:
        return "".join(self._chunks)


def strip_html(html: str) -> str:
    p = _HTMLToText()
    try:
        p.feed(html)
        p.close()
        t = p.text()
    except Exception:
        t = re.sub(r"<[^>]+>", " ", html)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def normalize_for_match(text: str) -> str:
    s = text.lower()
    s = re.sub(r"[àáạảãâầấậẩẫăằắặẳẵ]", "a", s)
    s = re.sub(r"[èéẹẻẽêềếệểễ]", "e", s)
    s = re.sub(r"[ìíịỉĩ]", "i", s)
    s = re.sub(r"[òóọỏõôồốộổỗơờớợởỡ]", "o", s)
    s = re.sub(r"[ùúụủũưừứựửữ]", "u", s)
    s = re.sub(r"[ỳýỵỷỹ]", "y", s)
    s = re.sub(r"đ", "d", s)
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Lane DEMAND: chỉ cụm thể hiện người đi thuê (tránh nav/tin tức “đầu tư cho thuê”)
DEMAND_STRONG_RE = re.compile(
    r"(?<![\w])(cần thuê|can thue)(?!\s+cho\b)|muốn thuê|muon thue|xin thuê|xin thue|"
    r"nhờ thuê|nho thue|ai có căn|ai co can|hỏi thuê|hoi thue|đang cần thuê|dang can thue|"
    r"đang tìm căn|dang tim can|\btìm thuê\b|\btim thue\b|"
    r"\btìm căn\b(?!\s*để\s*bán)",
    re.I,
)
# Copy môi giới “hỗ trợ tìm thuê” — không tính là demand cá nhân
DEMAND_BROKER_MARKETING_RE = re.compile(
    r"hỗ trợ\s+tìm thuê|ho tro\s+tim thue|tư vấn\s+tìm thuê|tu van\s+tim thue|"
    r"tìm kiếm\s+cho thuê|tim kiem\s+cho thue",
    re.I,
)


def demand_intent_ok(text: str) -> bool:
    if not DEMAND_STRONG_RE.search(text):
        return False
    if DEMAND_BROKER_MARKETING_RE.search(text):
        return False
    return True
# Lane SUPPLY: nguồn hàng / cho thuê / môi giới / đăng tin
SUPPLY_INTENT_RE = re.compile(
    r"(\bcho thuê\b|\bcho thue\b|\bcần cho thuê\b|\bcan cho thue\b|"
    r"môi giới|moi gioi|đăng tin|dang tin|đăng căn|dang can|listing|ký gửi|ky gui|"
    r"giỏ hàng cho thuê|gio hang cho thue|tin đăng|tin dang|"
    r"lh cho thuê|liên hệ cho thuê|lien he cho thue|phòng trống|phong trong)",
    re.I,
)
# Giữ alias cũ cho nhãn chung (không dùng để phân lane)
RENT_PATTERNS = re.compile(
    r"(cần thuê|can thue|cần cho thuê|can cho thue|muốn thuê|muon thue|tìm căn|tim can|"
    r"tìm thuê|tim thue|thuê căn|thue can|thuê chung cư|cho thuê|cho thue|"
    r"nhờ thuê|nho thue|ai cho thuê|can tim can)",
    re.I,
)
PHONE_RE = re.compile(
    r"(?:zalo|zl|phone|sđt|sdt|tel)[\s:]*([0-9][\d\s\.\-]{8,14}\d)|"
    r"\b(0\d{1,3}(?:\.\d{3}){2,3})\b|"
    r"\b(0\d{9,10})\b|"
    r"\b(\+84[\d\s\.\-]{9,13}\d)\b",
    re.I,
)
# Tránh khớp "2 $" hoặc "1-2" (slug); ưu tiên $306/tháng, 15 triệu, 20–25 triệu
BUDGET_RE = re.compile(
    r"(?:"
    r"\$\s*\d+[\d,]*(?:\s*/\s*tháng)?|"
    r"\d+[\.,]?\d*\s*(?:triệu|tr\b|tỷ|ty\b|usd|đô|dollar)(?!\s*\d)|"
    r"\d+\s*[-–]\s*\d+[\.,]?\d*\s+(?:triệu|tr\b|tỷ|ty\b)"
    r")",
    re.I,
)
AREA_RE = re.compile(
    r"(\d+[\.,]?\d*)\s*(m2|m²|sqm|sq\.?\s*m|mét\s*vuông|met\s*vuông|met\s*vuong)",
    re.I,
)
APT_RE = re.compile(
    r"(studio|"
    r"1\s*phòng ngủ|2\s*phòng ngủ|3\s*phòng ngủ|"
    r"1\s*pn|2\s*pn|3\s*pn|4\s*pn|"
    r"1pn|2pn|3pn|1br|2br|3br|"
    r"căn\s*hộ|căn\s+2\s*pn|căn\s+3\s*pn)",
    re.I,
)
URGENCY_RE = re.compile(
    r"(gấp|gap|asap|tuần này|tuan nay|cuối tháng|cuoi thang|"
    r"sớm|som|vào ở ngay|vao o ngay|ở ngay|trong tuần|"
    r"tháng\s*(?:[1-9]|1[0-2])(?!\d))",
    re.I,
)
# Vùng giá / căn mẫu trên trang (carousel, template — không phải quote nhu cầu khách)
LISTING_OR_AD_CONTEXT_RE = re.compile(
    r"Leasing|\|\s*Căn\s+hộ|Thuê\s+Ngắn\s+Hạn\s+Thuê\s+Landmark|"
    r"Cho\s+thuê\s+Landmark\s+\d+|theo\s+ngày.*phòng\s+ngủ|"
    r"Có\s+Thể\s+Bạn\s+Đang\s+Tìm\s+(?:Thuê\s+)?Ngắn\s+Hạn|\bReply\s+to\s+the\s+listing\b",
    re.I,
)
# Câu mang dấu hiệu nhu cầu cá nhân (ít gặp trong HTML sàn, nhưng cứ giữ để rank high)
PERSONAL_DEMAND_NEAR_RE = re.compile(
    r"(?:\btoi\b|\btôi\b|\bminh\b|\bmình\b|\bem\b|\banh\b|\bchi\b|\bchị\b)\s+"
    r"(?:cần|muốn|tìm|can|muon|tim)|cần\s+thuê\s+(?:gấp|căn)|\bcan\s+thue\s+gap\b",
    re.I,
)


def keyword_hits(norm_text: str, keywords: list[str]) -> list[str]:
    hits: list[str] = []
    for kw in keywords:
        kn = normalize_for_match(kw)
        if kn and kn in norm_text:
            hits.append(kw)
    return hits


def negative_vehicle_spam(norm_text: str, negatives: list[str], has_vcp: bool) -> bool:
    if has_vcp:
        return False
    n = 0
    for neg in negatives:
        if normalize_for_match(neg) in norm_text:
            n += 1
    return n >= 2


def extract_contact(text: str) -> str:
    parts: list[str] = []
    for m in PHONE_RE.finditer(text):
        g = next((x for x in m.groups() if x), None)
        if g:
            clean = re.sub(r"[\s\.\-]", "", g)
            if len(clean) >= 9:
                parts.append(clean)
    return "; ".join(dict.fromkeys(parts))  # dedupe preserve order


def extract_budget(text: str) -> str:
    m = re.search(
        r"(\d+\s*[-–]\s*\d+[\.,]?\d*|\d+[\.,]?\d*)\s*triệu\s*/\s*tháng",
        text,
        re.I,
    )
    if m:
        return m.group(0).strip()
    m = BUDGET_RE.search(text)
    if not m:
        return ""
    cand = m.group(0).strip()
    if re.fullmatch(r"[12]\s*\$", cand, re.I):
        return ""
    if re.fullmatch(r"\d{1,2}\s*[-–]\s*\d{1,2}", cand) and not re.search(
        r"(triệu|tỷ|tháng|\$)", cand, re.I
    ):
        return ""
    return cand


def extract_area(text: str) -> str:
    m = AREA_RE.search(text)
    return m.group(0).strip() if m else ""


def extract_apartment(text: str) -> str:
    m = APT_RE.search(text)
    return m.group(0).strip() if m else ""


def extract_urgency(text: str) -> str:
    m = URGENCY_RE.search(text)
    if not m:
        return ""
    s = m.group(0).strip()
    if re.search(r"\d{8,}", s):
        return ""
    return s


def _vn_phone_digits_ok(digits: str) -> bool:
    if len(digits) < 9 or len(digits) > 11:
        return False
    if digits.startswith("84"):
        digits = "0" + digits[2:]
    if digits.startswith("0") and len(digits) == 10 and digits[1] in "35789":
        return True
    if len(digits) == 11 and digits.startswith("0"):
        return True
    return False


def sanitize_contact_export(text: str, raw_contact: str) -> str:
    """Chỉ giữ SĐT VN / email; bỏ chunk lạ hoặc số quá ngắn."""
    parts_out: list[str] = []
    seen: set[str] = set()
    pool = (raw_contact or "").strip()
    ex = extract_contact(text)
    if ex:
        pool = f"{pool}; {ex}" if pool else ex
    for em in EMAIL_RE.finditer(text):
        e = em.group(0).strip()
        if e and e.lower() not in seen:
            seen.add(e.lower())
            parts_out.append(e)
    for segment in re.split(r"[;,\|]", pool):
        segment = segment.strip()
        if not segment:
            continue
        digits = re.sub(r"\D", "", segment)
        if len(digits) >= 9 and _vn_phone_digits_ok(digits):
            if digits not in seen:
                seen.add(digits)
                parts_out.append(digits)
    return "; ".join(parts_out)


def sanitize_area_export(raw: str, text: str) -> str:
    if not raw:
        return ""
    if not re.search(
        r"(m2|m²|sqm|mét\s*vuông|met\s*vuông|met\s*vuong|sq\.?\s*m)",
        raw + " " + text[:500],
        re.I,
    ):
        return ""
    return raw


def sanitize_urgency_export(raw: str) -> str:
    if not raw:
        return ""
    if re.search(r"\d{8,}", raw):
        return ""
    return raw


def sanitize_budget_export(raw: str, text: str) -> str:
    if not raw:
        return ""
    rs = raw.strip()
    if re.fullmatch(r"\d{1,2}", rs):
        return ""
    if rs.isdigit() and len(rs) <= 2:
        return ""
    if re.fullmatch(r"[12]\s*\$", rs, re.I):
        return ""
    if re.fullmatch(r"\d{1,2}\s*[-–]\s*\d{1,2}", rs) and not re.search(
        r"(triệu|tỷ|/\s*tháng|\$)", raw, re.I
    ):
        return ""
    low = raw.lower()
    if any(x in low for x in ("triệu", "usd", "$", "tỷ", "ty", "tr", "đô", "dollar", "/tháng")):
        return raw.strip()
    if re.search(r"\d+\s*[-–]\s*\d+", raw):
        return raw.strip()
    return ""


def extract_bedrooms(text: str) -> str:
    m = BEDROOMS_RE.search(text)
    return f"{m.group(1)}PN" if m else ""


def extract_tower_block(text: str) -> str:
    m = TOWER_BLOCK_RE.search(text)
    return m.group(0).strip() if m else ""


def extract_unit_code(text: str) -> str:
    m = UNIT_CODE_LOOSE_RE.search(text)
    return m.group(1).strip() if m else ""


def extract_move_in_time(text: str) -> str:
    m = MOVE_IN_RE.search(text)
    return m.group(0).strip() if m else ""


def extract_price_text_raw(text: str) -> str:
    m = PRICE_SNIPPET_RE.search(text)
    if not m:
        return ""
    return m.group(0).strip()[:160]


def _body_start_for_snippets(text: str) -> int:
    """Bỏ dòng SOURCE: URL để snippet không dính slug path vào cụm giá/PN."""
    if not text.lstrip().upper().startswith("SOURCE:"):
        return 0
    p = text.find("SOURCE:")
    if p == -1:
        return 0
    nl = text.find("\n", p)
    if nl == -1:
        return 0
    i = nl + 1
    while i < len(text) and text[i] in "\r\n \t":
        i += 1
    return i


def _snippet_around(text: str, start: int, end: int, pad: int = 90) -> str:
    bs = _body_start_for_snippets(text)
    lo = max(bs, start - pad)
    hi = min(len(text), end + pad)
    return re.sub(r"\s+", " ", text[lo:hi]).strip()


def tri_confidence_from_window(win: str) -> tuple[str, str]:
    listing = bool(LISTING_OR_AD_CONTEXT_RE.search(win))
    personal = bool(PERSONAL_DEMAND_NEAR_RE.search(win))
    if personal and not listing:
        return "high", "gần câu nhu cầu cá nhân"
    if listing:
        return "low", "dính block listing/carousel hoặc template trang (không phải quote khách)"
    return "medium", "không phân loại rõ nhu cầu vs block phụ"


def confidence_level_for_field(
    has_val: str, text: str, span: tuple[str, int, int] | None
) -> str:
    """high | medium | low | '' — đồng bộ với cửa sổ ±120 ký tự quanh span."""
    if not (has_val or "").strip():
        return ""
    if not span:
        return "medium"
    bs = _body_start_for_snippets(text)
    lo = max(bs, span[1] - 120)
    hi = min(len(text), span[2] + 120)
    win = text[lo:hi]
    level, _ = tri_confidence_from_window(win)
    return level


def confidence_level_for_real_demand_field(
    val: str, text: str, span: tuple[str, int, int] | None
) -> str:
    """
    Lane paste nhu cầu cá nhân (đã qua gate: không chứa khối listing/carousel).
    Không nới lỏng low; medium chỉ lên high khi cửa sổ có dấu hiệu ngôi xưng / nhu cầu cá nhân.
    """
    if not (val or "").strip():
        return ""
    base = confidence_level_for_field(val, text, span)
    if base == "high":
        return "high"
    if base == "low":
        return "low"
    if span:
        bs = _body_start_for_snippets(text)
        lo = max(bs, span[1] - 120)
        hi = min(len(text), span[2] + 120)
        win = text[lo:hi]
        if PERSONAL_DEMAND_NEAR_RE.search(win):
            return "high"
    return "low"


def extract_budget_span(text: str) -> tuple[str, int, int] | None:
    m = re.search(
        r"(\d+\s*[-–]\s*\d+[\.,]?\d*|\d+[\.,]?\d*)\s*triệu\s*/\s*tháng",
        text,
        re.I,
    )
    if m:
        return (m.group(0).strip(), m.start(), m.end())
    for m in BUDGET_RE.finditer(text):
        cand = m.group(0).strip()
        if re.fullmatch(r"[12]\s*\$", cand, re.I):
            continue
        if re.fullmatch(r"\d{1,2}\s*[-–]\s*\d{1,2}", cand) and not re.search(
            r"(triệu|tỷ|tháng|\$)", cand, re.I
        ):
            continue
        return (cand, m.start(), m.end())
    return None


def extract_bedrooms_span(text: str) -> tuple[str, int, int] | None:
    m = BEDROOMS_RE.search(text)
    if not m:
        return None
    return (f"{m.group(1)}PN", m.start(), m.end())


def extract_price_text_span(text: str) -> tuple[str, int, int] | None:
    m = PRICE_SNIPPET_RE.search(text)
    if not m:
        return None
    return (m.group(0).strip()[:160], m.start(), m.end())


def extract_area_span(text: str) -> tuple[str, int, int] | None:
    m = AREA_RE.search(text)
    if not m:
        return None
    return (m.group(0).strip(), m.start(), m.end())


def extract_urgency_span(text: str) -> tuple[str, int, int] | None:
    m = URGENCY_RE.search(text)
    if not m:
        return None
    s = m.group(0).strip()
    if re.search(r"\d{8,}", s):
        return None
    return (s, m.start(), m.end())


def extract_move_in_span(text: str) -> tuple[str, int, int] | None:
    m = MOVE_IN_RE.search(text)
    if not m:
        return None
    return (m.group(0).strip(), m.start(), m.end())


def extract_tower_span(text: str) -> tuple[str, int, int] | None:
    m = TOWER_BLOCK_RE.search(text)
    if not m:
        return None
    return (m.group(0).strip(), m.start(), m.end())


def extract_unit_span(text: str) -> tuple[str, int, int] | None:
    m = UNIT_CODE_LOOSE_RE.search(text)
    if not m:
        return None
    return (m.group(1).strip(), m.start(), m.end())


def extract_apartment_span(text: str) -> tuple[str, int, int] | None:
    m = APT_RE.search(text)
    if not m:
        return None
    return (m.group(0).strip(), m.start(), m.end())


def source_title_confidence_and_note(r: dict[str, Any], text: str) -> tuple[str, str]:
    tlns = (text or "").lstrip()
    if tlns.upper().startswith("SOURCE:"):
        first = tlns.split("\n", 1)[0]
        u = first.split("SOURCE:", 1)[-1].strip()
        if u.lower().startswith("http"):
            return (
                "high",
                "URL đầy đủ trong SOURCE — tin cậy để mở đúng trang; không phải tiêu đề (H1) của bài.",
            )
        return "medium", "SOURCE: không phải http — kiểm tra tay."
    link = str(r.get("link") or "").strip()
    if link.lower().startswith("http"):
        return "medium", "Link từ ingest (ổn định) nhưng có thể thiếu path đầy đủ."
    return "low", "Không có URL http rõ — chỉ nhãn/hostname từ source."


def build_field_source_note(
    text: str,
    budget_val: str,
    budget_conf: str,
    b_span: tuple[str, int, int] | None,
    bedrooms_val: str,
    bedrooms_conf: str,
    br_span: tuple[str, int, int] | None,
    area_val: str,
    area_span: tuple[str, int, int] | None,
    price_val: str,
    price_conf: str,
    pr_span: tuple[str, int, int] | None,
    source_title_note: str,
) -> str:
    parts: list[str] = []
    if budget_val:
        usd_hint = ""
        if re.search(r"\$|usd|dollar", budget_val, re.I):
            usd_hint = (
                "USD trong ngữ cảnh VCP-VN: thường là giá lease ngắn hạn/của sàn (carousel), "
                "không phải mức khách tự nêu. "
            )
        snip = _snippet_around(text, b_span[1], b_span[2]) if b_span else ""
        parts.append(
            f"budget[{budget_val}] conf={budget_conf}. {usd_hint}"
            f"Cụm nguồn: «{snip[:180]}»."
        )
    if bedrooms_val:
        snip = _snippet_around(text, br_span[1], br_span[2]) if br_span else ""
        parts.append(
            f"bedrooms[{bedrooms_val}] conf={bedrooms_conf}. Cụm nguồn: «{snip[:200]}»."
        )
    if area_val:
        snip = _snippet_around(text, area_span[1], area_span[2]) if area_span else ""
        parts.append(
            f"area[{area_val}] (audit): «{snip[:160]}» — thường cùng block carousel nếu trùng Landmark."
        )
    if price_val:
        snip = _snippet_around(text, pr_span[1], pr_span[2]) if pr_span else ""
        parts.append(
            f"price_text_raw[{price_val}] conf={price_conf}. Cụm: «{snip[:180]}»."
        )
    parts.append(f"source_title: {source_title_note}")
    out = " ".join(p for p in parts if p)
    return out[:780] + ("…" if len(out) > 780 else "")


def demand_type_export_label(text: str) -> str:
    head = text[:LANE_INTENT_HEAD_CHARS]
    low = head.lower()
    n = normalize_for_match(head)
    if demand_intent_ok(head):
        if "chuyen nhuong" in n or "chuyển nhượng" in low:
            return "thuê / chuyển nhượng"
        return "thuê"
    if re.search(r"\bmua\b", low) and "thuê" not in low:
        return "mua"
    return "chưa rõ"


def source_title_from_row(r: dict[str, Any], text: str) -> str:
    tlns = (text or "").lstrip()
    if tlns.upper().startswith("SOURCE:"):
        first = tlns.split("\n", 1)[0]
        return first.split("SOURCE:", 1)[-1].strip()[:200]
    link = str(r.get("link") or "").strip()
    if link:
        return (urlparse(link).netloc or link)[:200]
    return str(r.get("source") or "")[:200]


def build_demand_note_short_v2(erow: dict[str, Any]) -> str:
    """Ghi chú 1 dòng từ field đã validate (sale-ready)."""
    dtype = (erow.get("demand_type") or "").strip()
    apt = (erow.get("apartment_type") or "").strip()
    br = (erow.get("bedrooms") or "").strip()
    tw = (erow.get("tower_block") or "").strip()
    bud = (erow.get("budget") or "").strip()
    ar = (erow.get("area") or "").strip()
    urg = (erow.get("urgency") or "").strip()
    mi = (erow.get("move_in_time") or "").strip()
    cst = (erow.get("contact_status") or "").strip()
    parts: list[str] = []
    if dtype and dtype != "chưa rõ":
        head = f"Nhu cầu ({dtype})"
    else:
        head = "Nhu cầu thuê VCP"
    parts.append(head)
    if br:
        parts.append(br)
    elif apt:
        parts.append(apt)
    if tw:
        parts.append(tw)
    if bud:
        parts.append(bud)
    if ar:
        parts.append(ar)
    if mi:
        parts.append(mi)
    elif urg:
        parts.append(urg)
    if cst == "has_contact":
        parts.append("có SĐT/email")
    else:
        parts.append("không có contact trực tiếp")
    note = " | ".join(p for p in parts if p)
    return note[:320] if len(note) > 320 else note


def _apply_real_demand_business_ready_flag(erow: dict[str, str]) -> None:
    """Chỉ yes khi có contact + ≥1 field nhu cầu còn lại sau V4 (không tính source_title/note)."""
    fields = (
        "budget",
        "bedrooms",
        "area",
        "urgency",
        "move_in_time",
        "price_text_raw",
        "tower_block",
        "unit_code",
        "apartment_type",
    )
    has_detail = any((erow.get(k) or "").strip() for k in fields)
    has_ct = erow.get("contact_status") == "has_contact"
    erow["business_ready"] = "yes" if (has_ct and has_detail) else "no"


def apply_sale_ready_v4_strict(
    erow: dict[str, str],
    internal_conf: dict[str, str],
    *,
    business_ready_rule: str = "v4",
) -> None:
    """
    V4 business-safe: xóa mọi giá trị không đạt confidence=high (không đoán, không “đẹp” giả).
    Cột *_confidence đi kèm field export cũng được xóa khi giá trị bị gỡ.
    """
    qc_pairs = [
        ("budget", "budget_confidence"),
        ("bedrooms", "bedrooms_confidence"),
        ("price_text_raw", "price_text_raw_confidence"),
        ("source_title", "source_title_confidence"),
    ]
    for vk, ck in qc_pairs:
        if not (erow.get(vk) or "").strip():
            continue
        if (erow.get(ck) or "").strip().lower() != "high":
            erow[vk] = ""
            erow[ck] = ""

    for vk in (
        "area",
        "urgency",
        "move_in_time",
        "tower_block",
        "unit_code",
        "apartment_type",
    ):
        if not (erow.get(vk) or "").strip():
            continue
        if (internal_conf.get(vk) or "").strip().lower() != "high":
            erow[vk] = ""

    note_v4 = (
        "[V4 strict] Chỉ giữ field đạt confidence=high; "
        "các field khác để trống để tránh dữ liệu gây hiểu nhầm cho sale."
    )
    fs = (erow.get("field_source_note") or "").strip()
    erow["field_source_note"] = f"{fs} {note_v4}".strip() if fs else note_v4

    erow["note_short"] = build_demand_note_short_v2(erow)

    if business_ready_rule == "real_demand":
        _apply_real_demand_business_ready_flag(erow)
    else:
        trusted_detail = any(
            (erow.get(k) or "").strip()
            for k in (
                "budget",
                "bedrooms",
                "area",
                "urgency",
                "move_in_time",
                "price_text_raw",
                "tower_block",
                "unit_code",
                "apartment_type",
                "source_title",
            )
        )
        has_ct = erow.get("contact_status") == "has_contact"
        erow["business_ready"] = "yes" if (has_ct and trusted_detail) else "no"


def _demand_row_to_sale_ready_core(
    r: dict[str, Any],
    conf_fn: Any,
    *,
    business_ready_rule: str = "v4",
    real_demand_label: str | None = None,
) -> dict[str, str]:
    """Core sale-ready: conf_fn = confidence_level_for_field | confidence_level_for_real_demand_field."""
    text = str(r.get("text_raw") or "")
    raw_contact = str(r.get("contact") or "")
    raw_budget = str(r.get("budget") or "")
    raw_urg = str(r.get("urgency") or "")
    raw_area = str(r.get("area") or "")

    contact = sanitize_contact_export(text, raw_contact)
    budget = sanitize_budget_export(raw_budget, text)
    if not budget:
        budget = sanitize_budget_export(extract_budget(text), text)
    urgency = sanitize_urgency_export(raw_urg)
    if not urgency:
        urgency = sanitize_urgency_export(extract_urgency(text))
    area = sanitize_area_export(raw_area, text)
    if not area:
        area = sanitize_area_export(extract_area(text), text)

    bedrooms = extract_bedrooms(text)
    tower = extract_tower_block(text)
    unit_c = extract_unit_code(text)
    move_in = extract_move_in_time(text)
    price_snip = extract_price_text_raw(text)
    src_title = source_title_from_row(r, text)
    st_conf, st_detail = source_title_confidence_and_note(r, text)
    if real_demand_label:
        src_title = real_demand_label
        st_conf = "high"
        st_detail = "Nguồn paste nhu cầu thật (input_real_demand)."
    dtype = demand_type_export_label(text)

    ct_status = "has_contact" if contact.strip() else "no_direct_contact"

    b_span = extract_budget_span(text)
    br_span = extract_bedrooms_span(text)
    pr_span = extract_price_text_span(text)
    ar_span = extract_area_span(text) if area else None

    budget_conf = conf_fn(budget, text, b_span)
    bedrooms_conf = conf_fn(bedrooms, text, br_span)
    price_conf = conf_fn(price_snip, text, pr_span)

    field_note = build_field_source_note(
        text,
        budget,
        budget_conf,
        b_span,
        bedrooms,
        bedrooms_conf,
        br_span,
        area,
        ar_span,
        price_snip,
        price_conf,
        pr_span,
        st_detail,
    )
    if real_demand_label:
        field_note = (
            f"[REAL_DEMAND_PASTE file={real_demand_label}] " + field_note
        ).strip()[:780]

    erow = {
        "lead_tier": str(r.get("lead_tier") or ""),
        "contact": contact,
        "contact_status": ct_status,
        "apartment_type": str(r.get("apartment_type") or "").strip(),
        "bedrooms": bedrooms,
        "tower_block": tower,
        "unit_code": unit_c,
        "budget": budget,
        "move_in_time": move_in,
        "urgency": urgency,
        "area": area,
        "demand_type": dtype,
        "price_text_raw": price_snip,
        "source_title": src_title,
        "source": str(r.get("source") or ""),
        "note_short": "",
        "budget_confidence": budget_conf,
        "bedrooms_confidence": bedrooms_conf,
        "source_title_confidence": st_conf,
        "price_text_raw_confidence": price_conf,
        "field_source_note": field_note,
    }
    urg_span = extract_urgency_span(text)
    mi_span = extract_move_in_span(text)
    tw_span = extract_tower_span(text)
    uc_span = extract_unit_span(text)
    apt_span = extract_apartment_span(text)
    ar_span_ic = extract_area_span(text) if (erow.get("area") or "").strip() else None
    internal_conf = {
        "area": conf_fn(area, text, ar_span_ic),
        "urgency": conf_fn(urgency, text, urg_span),
        "move_in_time": conf_fn(move_in, text, mi_span),
        "tower_block": conf_fn(tower, text, tw_span),
        "unit_code": conf_fn(unit_c, text, uc_span),
        "apartment_type": conf_fn(
            erow["apartment_type"], text, apt_span
        ),
    }
    apply_sale_ready_v4_strict(
        erow, internal_conf, business_ready_rule=business_ready_rule
    )
    return erow


def demand_row_to_sale_ready(r: dict[str, Any], *, row_index: int | None = None) -> dict[str, str]:
    """Chỉ phục vụ export sale-ready: parse lại + validate, không đổi rule gốc lead."""
    out = _demand_row_to_sale_ready_core(
        r, confidence_level_for_field, business_ready_rule="v4"
    )
    out["_sync_key"] = build_demand_sync_key(out, row_index=row_index)
    return out


def demand_row_to_real_demand_sale_ready(
    r: dict[str, Any], filename: str, *, row_index: int | None = None
) -> dict[str, str]:
    """Sale-ready cho paste nhu cầu cá nhân (input_real_demand)."""
    out = _demand_row_to_sale_ready_core(
        r,
        confidence_level_for_real_demand_field,
        business_ready_rule="real_demand",
        real_demand_label=filename,
    )
    out["_sync_key"] = build_demand_sync_key(out, row_index=row_index)
    return out


def field_confidence_qc_one_line(idx: int, er: dict[str, str]) -> str:
    trusted: list[str] = []
    untrusted: list[str] = []
    checks: list[tuple[str, str]] = [
        ("budget", "budget_confidence"),
        ("bedrooms", "bedrooms_confidence"),
        ("source_title", "source_title_confidence"),
        ("price_text_raw", "price_text_raw_confidence"),
    ]
    for val_k, conf_k in checks:
        v = (er.get(val_k) or "").strip()
        if not v:
            continue
        c = (er.get(conf_k) or "").strip().lower()
        if c == "high":
            trusted.append(val_k)
        else:
            untrusted.append(f"{val_k}({c or '?'})")
    return (
        f"{idx}. Đáng tin: {', '.join(trusted) or '—'} | "
        f"Chưa đáng tin: {', '.join(untrusted) or '—'}"
    )


def suggest_next_minimal_rule_v3(sale_rows: list[dict[str, str]]) -> str:
    low_counts: dict[str, int] = {
        "budget": 0,
        "bedrooms": 0,
        "price_text_raw": 0,
        "source_title": 0,
    }
    keys = list(low_counts.keys())
    conf_map = {k: f"{k}_confidence" for k in keys}
    for er in sale_rows:
        for k in keys:
            if not (er.get(k) or "").strip():
                continue
            c = (er.get(conf_map[k]) or "").strip().lower()
            if c == "low":
                low_counts[k] += 1
    worst = max(low_counts, key=lambda x: low_counts[x])
    if low_counts[worst] == 0:
        return "Không có field business nào bị gắn low trên toàn bộ lead hiện tại."
    if worst == "budget":
        return (
            "Khóa budget: chỉ chấp nhận khi span không nằm trong cụm có "
            "«Leasing / | Căn hộ / Thuê Ngắn Hạn Landmark» hoặc khi có câu DEMAND_STRONG "
            "cùng đoạn (quote khách)."
        )
    if worst == "bedrooms":
        return (
            "Khóa bedrooms: chỉ high khi match nằm trong cùng câu/cụm có DEMAND_STRONG "
            "và không có «theo ngày | Leasing» trong cửa sổ ±120 ký tự."
        )
    if worst == "price_text_raw":
        return (
            "Khóa price_text_raw: bỏ qua match đầu nếu trùng vùng listing carousel; "
            "ưu tiên snippet sau đoạn chat / comment có SĐT."
        )
    return (
        "source_title: nếu cần tiêu đề H1 thật, bổ sung bước fetch meta/title "
        "thay vì chỉ URL trong SOURCE."
    )


def demand_type_label(text: str) -> str:
    if demand_intent_ok(text):
        return "demand / tìm thuê"
    t = text.lower()
    if RENT_PATTERNS.search(t):
        return "thuê / tìm căn"
    return ""


def supply_type_label(text: str) -> str:
    if SUPPLY_INTENT_RE.search(text):
        return "supply / cho thuê / listing"
    return "supply"


def score_and_tier(
    has_vcp: bool,
    has_rent: bool,
    apt: str,
    budget: str,
    urgency: str,
    contact: str,
) -> tuple[int, str]:
    s = 0
    if has_vcp:
        s += 28
    if has_rent:
        s += 28
    if apt:
        s += 14
    if budget:
        s += 12
    if urgency:
        s += 10
    if contact:
        s += 8
    # bonus if both budget and urgency
    if budget and urgency:
        s = min(100, s + 5)

    if not has_vcp or not has_rent:
        s = min(s, 45)

    if s >= 78:
        tier = "HOT"
    elif s >= 58:
        tier = "WARM"
    else:
        tier = "COLD"
    return min(100, s), tier


def include_demand_lead(
    has_vcp: bool,
    has_demand_intent: bool,
    apt: str,
    budget: str,
    urgency: str,
    contact: str,
) -> bool:
    """VCP + tín hiệu người đi thuê + ít nhất một chi tiết (budget / ở ngay / contact / loại căn)."""
    if not has_vcp or not has_demand_intent:
        return False
    details = sum(bool(x) for x in (apt, budget, urgency, contact))
    return details >= 1 and (2 + details) >= 3


def include_supply_lead(
    has_vcp: bool,
    has_supply_intent: bool,
    apt: str,
    budget: str,
    urgency: str,
    contact: str,
) -> bool:
    """VCP + tin cho thuê / môi giới / listing + chi tiết giá hoặc căn hoặc liên hệ."""
    if not has_vcp or not has_supply_intent:
        return False
    details = sum(bool(x) for x in (apt, budget, contact))
    return details >= 1 and (2 + details) >= 3


def fetch_url(url: str, timeout: float = 20.0) -> tuple[str, str | None]:
    try:
        r = requests.get(
            url,
            timeout=timeout,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                ),
                "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
            },
        )
        err = None if r.ok else f"HTTP {r.status_code}"
        return r.text, err
    except Exception as e:
        return "", str(e)


def sort_demand_for_sale(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    def key(r: dict[str, Any]) -> tuple[int, int]:
        tier = r.get("lead_tier") or "COLD"
        tk = TIER_SORT_KEY.get(str(tier).upper(), 3)
        sc = int(r.get("score") or 0)
        return (tk, -sc)

    return sorted(rows, key=key)


def write_demand_sale_ready_and_handoff(rows_demand: list[dict[str, Any]]) -> None:
    """CSV demand thu gọn + markdown handoff cho sale (sau khi đã ghi CSV gốc)."""
    ordered = sort_demand_for_sale(list(rows_demand))
    sale_rows: list[dict[str, str]] = [
        demand_row_to_sale_ready(r, row_index=i) for i, r in enumerate(ordered, start=1)
    ]
    for i, row in enumerate(sale_rows, start=1):
        _enrich_row_contract(row, row_index=i)

    with OUT_CSV_DEMAND_SALE_READY.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=SALE_READY_FIELDS, extrasaction="ignore")
        w.writeheader()
        for row in sale_rows:
            w.writerow(row)

    n = len(sale_rows)
    qc_contact = sum(1 for r in sale_rows if r.get("contact_status") == "has_contact")
    qc_budget = sum(1 for r in sale_rows if (r.get("budget") or "").strip())
    qc_urgency = sum(1 for r in sale_rows if (r.get("urgency") or "").strip())
    qc_area = sum(1 for r in sale_rows if (r.get("area") or "").strip())
    qc_bedrooms = sum(1 for r in sale_rows if (r.get("bedrooms") or "").strip())
    qc_business_ready = sum(1 for r in sale_rows if r.get("business_ready") == "yes")

    hot_d = sum(1 for r in rows_demand if r.get("lead_tier") == "HOT")
    warm_d = sum(1 for r in rows_demand if r.get("lead_tier") == "WARM")
    cold_d = sum(1 for r in rows_demand if r.get("lead_tier") == "COLD")
    top10 = list(zip(ordered[:10], sale_rows[:10]))
    lines = [
        "# DEMAND — handoff cho sale (VCP)",
        "",
        f"- Tổng lead demand: **{n}**",
        f"- HOT / WARM / COLD: **{hot_d}** / **{warm_d}** / **{cold_d}**",
        f"- File sale-ready: `{OUT_CSV_DEMAND_SALE_READY.name}`",
        f"- File đầy đủ (tham chiếu): `{OUT_CSV_DEMAND.name}`",
        "",
        "## QC (sale-ready đã validate)",
        "",
        f"- Lead có contact hợp lệ (SĐT/email): **{qc_contact}** / {n}",
        f"- Lead có budget hợp lệ: **{qc_budget}** / {n}",
        f"- Lead có urgency hợp lệ: **{qc_urgency}** / {n}",
        f"- Lead có area hợp lệ (có m²/sqm…): **{qc_area}** / {n}",
        f"- Lead có bedrooms (PN): **{qc_bedrooms}** / {n}",
        f"- **business_ready=yes** (contact + ≥1 chi tiết tin cậy sau V4): **{qc_business_ready}** / {n}",
        "",
        "## 10 dòng mẫu đầu (sale-ready, đã sắp HOT → score)",
        "",
    ]
    if not top10:
        lines.append("- *(Không có lead demand trong lần chạy này.)*")
        lines.append("")
    else:
        for i, (raw, er) in enumerate(top10, 1):
            sc = raw.get("score", "")
            tier = raw.get("lead_tier", "")
            src = (er.get("source_title") or raw.get("source") or "")[:100]
            note = er.get("note_short") or ""
            ct = er.get("contact") or "(trống)"
            cst = er.get("contact_status") or ""
            lines.append(
                f"{i}. **{tier}** (score {sc}) | {cst} — {note}"
            )
            lines.append(f"   - `{src}` | Liên hệ: {ct}")
        lines.append("")

    lines.append("## QC field confidence (V4 strict)")
    lines.append("")
    lines.append(
        "Export sale-ready đã qua **V4 strict**: mọi field không đạt **confidence=high** "
        "bị để trống (kể cả area / urgency / move-in / tower / unit / apartment_type). "
        "Cột **business_ready**: `yes` chỉ khi có contact hợp lệ và còn ít nhất một chi tiết tin cậy."
    )
    lines.append("")
    sug = suggest_next_minimal_rule_v3(sale_rows)
    lines.append(f"- Gợi ý rule tiếp (field yếu nhất): {sug}")
    lines.append("")
    for i, er in enumerate(sale_rows, 1):
        lines.append(f"- {field_confidence_qc_one_line(i, er)}")
    lines.append("")

    OUT_DEMAND_HANDOFF.write_text("\n".join(lines), encoding="utf-8")

    print("\n--- QC sale-ready (demand, V4 strict) ---")
    print(f"  Tổng lead: {n}")
    print(f"  business_ready=yes: {qc_business_ready}")
    print(f"  Contact hợp lệ: {qc_contact}")
    print(f"  Budget hợp lệ: {qc_budget}")
    print(f"  Urgency hợp lệ: {qc_urgency}")
    print(f"  Area hợp lệ: {qc_area}")
    print(f"  Có bedrooms: {qc_bedrooms}")
    print("--- Mẫu 10 dòng đầu (sale-ready) ---")
    for i, er in enumerate(sale_rows[:10], 1):
        print(
            f"  {i}. tier={er.get('lead_tier')} | {er.get('contact_status')} | "
            f"contact={er.get('contact')!r} | budget={er.get('budget')!r} | "
            f"urgency={er.get('urgency')!r} | area={er.get('area')!r}"
        )
    print("\n--- QC field confidence (V4) — từng lead (sau blank strict) ---")
    for i, er in enumerate(sale_rows, 1):
        print(f"  {field_confidence_qc_one_line(i, er)}")
    print(f"  Gợi ý rule tiếp: {suggest_next_minimal_rule_v3(sale_rows)}")


def load_local_raw(raw_dir: Path) -> list[tuple[str, str, str]]:
    """Returns list of (source, link, text)."""
    out: list[tuple[str, str, str]] = []
    if not raw_dir.is_dir():
        return out
    for p in sorted(raw_dir.iterdir()):
        if p.name.startswith(("_", ".")):
            continue
        if p.suffix.lower() not in {".txt", ".html", ".htm"}:
            continue
        raw = p.read_text(encoding="utf-8", errors="replace")
        if p.suffix.lower() in {".html", ".htm"}:
            text = strip_html(raw)
        else:
            text = raw
        label = f"local:{p.name}"
        out.append((label, "", text))
    return out


def load_real_demand_txt_files(real_demand_dir: Path) -> list[tuple[str, str]]:
    """Mỗi file .txt = một bài paste nhu cầu cá nhân."""
    out: list[tuple[str, str]] = []
    if not real_demand_dir.is_dir():
        return out
    for p in sorted(real_demand_dir.iterdir()):
        if p.name.startswith(("_", ".")):
            continue
        if p.suffix.lower() != ".txt":
            continue
        text = p.read_text(encoding="utf-8", errors="replace")
        out.append((p.name, text))
    return out


def real_demand_paste_gate(
    text: str, keywords: list[str], negatives: list[str]
) -> tuple[bool, str]:
    """Lọc nguồn paste: VCP + demand + cá nhân; tuyệt đối không chứa khối listing/carousel."""
    if not (text or "").strip():
        return False, "empty"
    head = text[:LANE_INTENT_HEAD_CHARS]
    norm = normalize_for_match(text)
    hits = keyword_hits(norm, keywords)
    has_vcp = len(hits) > 0
    if negative_vehicle_spam(norm, negatives, has_vcp):
        return False, "negative_spam"
    if not has_vcp:
        return False, "no_vcp_keywords"
    if not demand_intent_ok(head):
        return False, "no_demand_intent"
    if LISTING_OR_AD_CONTEXT_RE.search(text):
        return False, "listing_or_ad_block_present"
    if not PERSONAL_DEMAND_NEAR_RE.search(text):
        return False, "no_personal_demand_marker"
    return True, ""


def write_real_demand_sale_ready_and_handoff(
    sale_rows: list[dict[str, str]],
    skipped: list[tuple[str, str]],
) -> None:
    for i, row in enumerate(sale_rows, start=1):
        _enrich_row_contract(row, row_index=i)
    with OUT_CSV_REAL_DEMAND_SALE_READY.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=SALE_READY_FIELDS, extrasaction="ignore")
        w.writeheader()
        for row in sale_rows:
            w.writerow(row)
    n = len(sale_rows)
    br = sum(1 for r in sale_rows if r.get("business_ready") == "yes")
    lines = [
        "# REAL DEMAND — paste nhu cầu thật (VCP)",
        "",
        f"- Nguồn: `{DEFAULT_REAL_DEMAND.name}/` (`.txt`, một file = một paste).",
        f"- Lead trong CSV: **{n}**",
        f"- **business_ready=yes**: **{br}** / {n}",
        f"- Output: `{OUT_CSV_REAL_DEMAND_SALE_READY.name}`",
        "",
        "## Gate (phase 1 — không Facebook / không browser)",
        "",
        "- Có keyword **VCP** + `demand_intent_ok` + **PERSONAL_DEMAND** trong text.",
        "- **Loại** nếu khớp `LISTING_OR_AD_CONTEXT` (carousel/listing template).",
        "- Parse + **V4 strict** + `confidence_level_for_real_demand_field` (medium→high chỉ khi cửa sổ có personal).",
        "- **business_ready**: `has_contact` + ≥1 field nhu cầu còn lại sau V4 (không tính `source_title`).",
        "",
    ]
    if skipped:
        lines.append("## File bỏ qua (không đạt gate)")
        lines.append("")
        for fn, reason in skipped:
            lines.append(f"- `{fn}` — `{reason}`")
        lines.append("")
    if not sale_rows:
        lines.append("## Mẫu")
        lines.append("")
        lines.append(
            "- *(Không có dòng — thêm `.txt` vào input_real_demand/ hoặc kiểm tra gate.)*"
        )
    else:
        lines.append("## Mẫu (5 dòng đầu)")
        lines.append("")
        for i, er in enumerate(sale_rows[:5], 1):
            lines.append(
                f"{i}. business_ready={er.get('business_ready')} | "
                f"contact={er.get('contact')!r} | budget={er.get('budget')!r} | "
                f"bedrooms={er.get('bedrooms')!r}"
            )
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(
        "- **Path nghiệp vụ chính (real renter leads):** xem `PHASE2_SOURCE_INTAKE_HANDOFF.md` (cùng thư mục scout)."
    )
    OUT_REAL_DEMAND_HANDOFF.write_text("\n".join(lines), encoding="utf-8")


def run_real_demand_lane(
    profile_path: Path, real_demand_dir: Path
) -> dict[str, Any]:
    profile = json.loads(profile_path.read_text(encoding="utf-8"))
    keywords = list(profile["keywords"])
    negatives = list(profile.get("negative_keywords", []))
    sale_rows: list[dict[str, str]] = []
    skipped: list[tuple[str, str]] = []
    for fname, text in load_real_demand_txt_files(real_demand_dir):
        ok, reason = real_demand_paste_gate(text, keywords, negatives)
        if not ok:
            skipped.append((fname, reason))
            continue
        label = f"real_demand:{fname}"
        r: dict[str, Any] = {
            "source": label,
            "link": "",
            "text_raw": text,
            "contact": "",
            "area": "",
            "demand_type": "demand",
            "apartment_type": "",
            "budget": "",
            "urgency": "",
            "score": 75,
            "lead_tier": "WARM",
        }
        sale_rows.append(
            demand_row_to_real_demand_sale_ready(
                r, fname, row_index=len(sale_rows) + 1
            )
        )
    write_real_demand_sale_ready_and_handoff(sale_rows, skipped)
    br = sum(1 for r in sale_rows if r.get("business_ready") == "yes")
    return {
        "real_demand_n": len(sale_rows),
        "real_demand_business_ready": br,
        "real_demand_skipped": len(skipped),
    }


def run(
    profile_path: Path,
    links_path: Path,
    raw_dir: Path,
    *,
    max_links: int | None = None,
) -> dict[str, Any]:
    use_local = use_local_snapshot_enabled()
    if use_local:
        print(
            "[vcp_scout] mode: HYBRID (local snapshot enabled)",
            file=sys.stderr,
        )
    else:
        print(
            "[vcp_scout] mode: LIVE ONLY (local snapshot disabled, "
            "set VCP_USE_LOCAL_SNAPSHOT=1 to enable)",
            file=sys.stderr,
        )

    profile = json.loads(profile_path.read_text(encoding="utf-8"))
    assert profile.get("profile_name") == "VCP_RENT_DEMAND", "profile_name phải là VCP_RENT_DEMAND"
    keywords = list(profile["keywords"])
    negatives = list(profile.get("negative_keywords", []))

    links: list[str] = []
    if links_path.is_file():
        for line in links_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#"):
                links.append(line)
        if max_links is not None and max_links > 0:
            links = links[:max_links]

    rows_supply: list[dict[str, Any]] = []
    rows_demand: list[dict[str, Any]] = []
    rows_demand_pre_sanitize: list[dict[str, Any]] = []
    errors: list[str] = []
    scanned = 0
    demand_source_input_rows = 0
    drop_not_demand_intent = 0
    drop_no_contact = 0
    drop_no_budget = 0
    drop_no_apartment_type = 0
    drop_other = 0
    url_stats = {
        "attempted": len(links),
        "reachable": 0,
        "blocked": 0,
        "failed_fetch": 0,
    }
    source_names_scanned: set[str] = set()
    source_inputs_used: list[str] = []
    demand_pass_samples: list[dict[str, Any]] = []

    def _track_demand_drop(
        has_vcp: bool,
        has_demand: bool,
        contact: str,
        budget: str,
        apt: str,
    ) -> None:
        nonlocal drop_not_demand_intent, drop_no_contact, drop_no_budget, drop_no_apartment_type, drop_other
        if not has_vcp or not has_demand:
            drop_not_demand_intent += 1
            return
        if not contact:
            drop_no_contact += 1
            return
        if not budget:
            drop_no_budget += 1
            return
        if not apt:
            drop_no_apartment_type += 1
            return
        drop_other += 1

    # URLs
    for url in links:
        scanned += 1
        parsed = urlparse(url)
        host = parsed.netloc or "unknown"
        html, err = fetch_url(url)
        if err:
            err_l = str(err).lower()
            if "403" in err_l or "401" in err_l or "429" in err_l or "451" in err_l:
                url_stats["blocked"] += 1
            else:
                url_stats["failed_fetch"] += 1
            errors.append(f"{url}: fetch {err or 'empty'}")
            continue
        if not html or len(html) < 500:
            url_stats["failed_fetch"] += 1
            errors.append(f"{url}: empty_or_short body={len(html) if html else 0}")
            continue
        url_stats["reachable"] += 1
        text = strip_html(html)
        demand_source_input_rows += 1
        source_names_scanned.add(host)
        source_inputs_used.append(url)
        head = text[:LANE_INTENT_HEAD_CHARS]
        norm = normalize_for_match(text)
        hits = keyword_hits(norm, keywords)
        has_vcp = len(hits) > 0
        if negative_vehicle_spam(norm, negatives, has_vcp):
            continue
        contact = extract_contact(text)
        budget = extract_budget(text)
        urgency = extract_urgency(text)
        apt = extract_apartment(text)
        area = extract_area(text)
        has_demand = demand_intent_ok(head)
        has_supply = bool(SUPPLY_INTENT_RE.search(head))
        if include_demand_lead(has_vcp, has_demand, apt, budget, urgency, contact):
            score, tier = score_and_tier(has_vcp, has_demand, apt, budget, urgency, contact)
            row = {
                "source": host,
                "link": url,
                "text_raw": text[:4000],
                "contact": contact,
                "area": area,
                "demand_type": demand_type_label(head) or "demand",
                "apartment_type": apt,
                "budget": budget,
                "urgency": urgency,
                "score": score,
                "lead_tier": tier,
            }
            rows_demand_pre_sanitize.append(row)
            if len(demand_pass_samples) < 5:
                demand_pass_samples.append(row)
        else:
            _track_demand_drop(has_vcp, has_demand, contact, budget, apt)
        if include_supply_lead(has_vcp, has_supply, apt, budget, urgency, contact):
            score, tier = score_and_tier(has_vcp, has_supply, apt, budget, urgency, contact)
            rows_supply.append(
                {
                    "source": host,
                    "link": url,
                    "text_raw": text[:4000],
                    "contact": contact,
                    "area": area,
                    "demand_type": supply_type_label(head),
                    "apartment_type": apt,
                    "budget": budget,
                    "urgency": urgency,
                    "score": score,
                    "lead_tier": tier,
                }
            )

    # Local raw files (input_raw / contract input_raw) — chỉ khi VCP_USE_LOCAL_SNAPSHOT=1
    if use_local:
        for source, link, text in load_local_raw(raw_dir):
            scanned += 1
            demand_source_input_rows += 1
            source_names_scanned.add(source)
            source_inputs_used.append(link or source)
            head = text[:LANE_INTENT_HEAD_CHARS]
            norm = normalize_for_match(text)
            hits = keyword_hits(norm, keywords)
            has_vcp = len(hits) > 0
            if negative_vehicle_spam(norm, negatives, has_vcp):
                continue
            contact = extract_contact(text)
            budget = extract_budget(text)
            urgency = extract_urgency(text)
            apt = extract_apartment(text)
            area = extract_area(text)
            has_demand = demand_intent_ok(head)
            has_supply = bool(SUPPLY_INTENT_RE.search(head))
            if include_demand_lead(has_vcp, has_demand, apt, budget, urgency, contact):
                score, tier = score_and_tier(has_vcp, has_demand, apt, budget, urgency, contact)
                row = {
                    "source": source,
                    "link": link,
                    "text_raw": text[:4000],
                    "contact": contact,
                    "area": area,
                    "demand_type": demand_type_label(head) or "demand",
                    "apartment_type": apt,
                    "budget": budget,
                    "urgency": urgency,
                    "score": score,
                    "lead_tier": tier,
                }
                rows_demand_pre_sanitize.append(row)
                if len(demand_pass_samples) < 5:
                    demand_pass_samples.append(row)
            else:
                _track_demand_drop(has_vcp, has_demand, contact, budget, apt)
            if include_supply_lead(has_vcp, has_supply, apt, budget, urgency, contact):
                score, tier = score_and_tier(has_vcp, has_supply, apt, budget, urgency, contact)
                rows_supply.append(
                    {
                        "source": source,
                        "link": link,
                        "text_raw": text[:4000],
                        "contact": contact,
                        "area": area,
                        "demand_type": supply_type_label(head),
                        "apartment_type": apt,
                        "budget": budget,
                        "urgency": urgency,
                        "score": score,
                        "lead_tier": tier,
                    }
                )

    # Primary fix: always include real renter-intent paste sources.
    for fname, text in load_real_demand_txt_files(DEFAULT_REAL_DEMAND):
        scanned += 1
        demand_source_input_rows += 1
        src = f"real_demand:{fname}"
        source_names_scanned.add(src)
        source_inputs_used.append(str(DEFAULT_REAL_DEMAND / fname))
        ok, reason = real_demand_paste_gate(text, keywords, negatives)
        if not ok:
            if reason == "no_demand_intent":
                drop_not_demand_intent += 1
            elif reason in ("no_personal_demand_marker", "listing_or_ad_block_present"):
                drop_other += 1
            else:
                drop_other += 1
            continue
        row = {
            "source": src,
            "link": "",
            "text_raw": text[:4000],
            "contact": extract_contact(text),
            "area": extract_area(text),
            "demand_type": "demand",
            "apartment_type": extract_apartment(text),
            "budget": extract_budget(text),
            "urgency": extract_urgency(text),
            "score": 75,
            "lead_tier": "WARM",
        }
        rows_demand_pre_sanitize.append(row)
        if len(demand_pass_samples) < 5:
            demand_pass_samples.append(row)

    blocklist = load_boilerplate_blocklist(BOILERPLATE_BLOCKLIST_PATH)
    min_text = _env_int("VCP_BOILERPLATE_MIN_TEXT_RAW", DEFAULT_MIN_TEXT_RAW_CHARS)
    same_dom = _env_int("VCP_SAME_DOMAIN_TEMPLATE_MIN", DEFAULT_SAME_DOMAIN_TEMPLATE_MIN)
    rows_demand_after_source_filter = list(rows_demand_pre_sanitize)
    rows_supply = sanitize_lead_rows(
        rows_supply, blocklist, min_len=min_text, same_domain_min=same_dom
    )
    rows_demand_after_normalize = _filter_min_len_and_blocklist(
        rows_demand_after_source_filter, blocklist, min_len=min_text
    )
    rows_demand_after_dedup = _filter_same_domain_template(
        rows_demand_after_normalize, same_dom
    )
    rows_demand = _dedupe_rows_by_text_hash_best_score(rows_demand_after_dedup)

    def _write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
        with path.open("w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=CSV_FIELDS, extrasaction="ignore")
            w.writeheader()
            for i, r in enumerate(rows, start=1):
                _enrich_row_contract(r, row_index=i)
                w.writerow({k: r.get(k, "") for k in CSV_FIELDS})

    _write_csv(OUT_CSV_SUPPLY, rows_supply)
    _write_csv(OUT_CSV_DEMAND, rows_demand)
    write_demand_sale_ready_and_handoff(rows_demand)
    demand_sale_ready_rows = 0
    if OUT_CSV_DEMAND_SALE_READY.is_file():
        with OUT_CSV_DEMAND_SALE_READY.open("r", encoding="utf-8-sig", newline="") as f:
            demand_sale_ready_rows = sum(1 for _ in csv.DictReader(f))

    print(f"DEMAND_SOURCE_INPUT_ROWS={demand_source_input_rows}")
    print(f"DEMAND_AFTER_SOURCE_FILTER_ROWS={len(rows_demand_after_source_filter)}")
    print(f"DEMAND_AFTER_PARSE_ROWS={len(rows_demand_after_source_filter)}")
    print(f"DEMAND_AFTER_NORMALIZE_ROWS={len(rows_demand_after_normalize)}")
    print(f"DEMAND_AFTER_DEDUP_ROWS={len(rows_demand)}")
    print(f"DEMAND_LEADS_WRITTEN_ROWS={len(rows_demand)}")
    print(f"DEMAND_SALE_READY_ROWS={demand_sale_ready_rows}")
    print(f"DROP_NOT_DEMAND_INTENT={drop_not_demand_intent}")
    print(f"DROP_NO_CONTACT={drop_no_contact}")
    print(f"DROP_NO_BUDGET={drop_no_budget}")
    print(f"DROP_NO_APARTMENT_TYPE={drop_no_apartment_type}")
    print(f"DROP_OTHER={drop_other}")
    print(
        "DEMAND_SOURCES_SCANNED="
        + ",".join(sorted(source_names_scanned)[:30])
    )
    print(
        "DEMAND_INPUTS_USED="
        + ",".join(source_inputs_used[:30])
    )
    if demand_pass_samples:
        for i, r in enumerate(demand_pass_samples[:5], 1):
            print(
                f"DEMAND_PASS_SAMPLE_{i}="
                f"source={r.get('source')}|contact={r.get('contact')}|budget={r.get('budget')}|"
                f"apartment_type={r.get('apartment_type')}|link={r.get('link')}"
            )

    def _tier_counts(rows: list[dict[str, Any]]) -> tuple[int, int, int]:
        h = sum(1 for r in rows if r["lead_tier"] == "HOT")
        w = sum(1 for r in rows if r["lead_tier"] == "WARM")
        c = sum(1 for r in rows if r["lead_tier"] == "COLD")
        return h, w, c

    hot_s, warm_s, cold_s = _tier_counts(rows_supply)
    hot_d, warm_d, cold_d = _tier_counts(rows_demand)

    empty_reason = ""
    if not rows_supply and not rows_demand:
        if scanned == 0:
            empty_reason = (
                "nguồn: không có link trong input_links.txt và không có file .txt/.html trong input_raw/"
                if use_local
                else "nguồn: không có link trong input_links.txt (local snapshot tắt — set VCP_USE_LOCAL_SNAPSHOT=1 để đọc input_raw/)"
            )
        elif errors and scanned == len(errors):
            empty_reason = (
                "parser/fetch: mọi URL đều lỗi tải hoặc HTML rỗng — thử dùng input_raw/"
                if use_local
                else "parser/fetch: mọi URL đều lỗi tải hoặc HTML rỗng — set VCP_USE_LOCAL_SNAPSHOT=1 để đọc snapshot local, hoặc sửa URL"
            )
        elif not errors and scanned > 0:
            empty_reason = "rule lọc: không đủ tín hiệu VCP + thuê + chi tiết (hoặc nội dung không khớp keyword)"
        else:
            empty_reason = "hỗn hợp: một phần lỗi fetch và phần còn lại không đạt ngưỡng tín hiệu"

    raw_files = (
        (
            sum(
                1
                for p in raw_dir.iterdir()
                if p.is_file()
                and not p.name.startswith(("_", "."))
                and p.suffix.lower() in {".txt", ".html", ".htm"}
            )
            if raw_dir.is_dir()
            else 0
        )
        if use_local
        else 0
    )

    report = {
        "profile_ok": True,
        "keyword_count": len(keywords),
        "links_scanned": scanned,
        "supply_n": len(rows_supply),
        "demand_n": len(rows_demand),
        "leads_kept": len(rows_supply) + len(rows_demand),
        "hot": hot_s + hot_d,
        "warm": warm_s + warm_d,
        "cold": cold_s + cold_d,
        "supply_hot": hot_s,
        "supply_warm": warm_s,
        "supply_cold": cold_s,
        "demand_hot": hot_d,
        "demand_warm": warm_d,
        "demand_cold": cold_d,
        "errors": errors[:50],
        "sample_rows_supply": rows_supply[:5],
        "sample_rows_demand": rows_demand[:5],
        "demand_source_input_rows": demand_source_input_rows,
        "demand_after_source_filter_rows": len(rows_demand_after_source_filter),
        "demand_after_parse_rows": len(rows_demand_after_source_filter),
        "demand_after_normalize_rows": len(rows_demand_after_normalize),
        "demand_after_dedup_rows": len(rows_demand),
        "demand_leads_written_rows": len(rows_demand),
        "demand_sale_ready_rows": demand_sale_ready_rows,
        "drop_not_demand_intent": drop_not_demand_intent,
        "drop_no_contact": drop_no_contact,
        "drop_no_budget": drop_no_budget,
        "drop_no_apartment_type": drop_no_apartment_type,
        "drop_other": drop_other,
        "demand_sources_scanned": sorted(source_names_scanned),
        "demand_inputs_used": source_inputs_used[:50],
        "csv_path_supply": str(OUT_CSV_SUPPLY),
        "csv_path_demand": str(OUT_CSV_DEMAND),
        "empty_reason": empty_reason,
        "url_stats": url_stats,
        "raw_file_count": raw_files,
    }
    return report


def write_report(report: dict[str, Any]) -> None:
    lines = [
        "# VCP scout — báo cáo tự kiểm (SUPPLY vs DEMAND)",
        "",
        f"- Profile: `VCP_RENT_DEMAND` — OK: {report['profile_ok']}",
        f"- Số keyword đã nạp: {report['keyword_count']}",
        f"- Số nguồn đã quét (URL + file local): {report['links_scanned']}",
        "",
        "## Supply (nguồn hàng / cho thuê)",
        f"- Lead giữ: **{report.get('supply_n', 0)}** — HOT/WARM/COLD: "
        f"{report.get('supply_hot', 0)}/{report.get('supply_warm', 0)}/{report.get('supply_cold', 0)}",
        f"- CSV: `{report.get('csv_path_supply', '')}`",
        "",
        "## Demand (người cần thuê)",
        f"- Lead giữ: **{report.get('demand_n', 0)}** — HOT/WARM/COLD: "
        f"{report.get('demand_hot', 0)}/{report.get('demand_warm', 0)}/{report.get('demand_cold', 0)}",
        f"- CSV: `{report.get('csv_path_demand', '')}`",
        "",
    ]
    if report.get("supply_n", 0) == 0 and report.get("demand_n", 0) == 0:
        lines.append(f"- **Lý do rỗng (ước lượng):** {report['empty_reason']}")
        lines.append("")
    if report["errors"]:
        lines.append("## Lỗi fetch (tối đa 50)")
        for e in report["errors"][:20]:
            lines.append(f"- {e}")
        lines.append("")
    lines.append("## Mẫu Supply (text_raw rút gọn)")
    for i, r in enumerate(report.get("sample_rows_supply") or [], 1):
        tr = (r.get("text_raw") or "")[:200].replace("\n", " ")
        lines.append(f"{i}. tier={r.get('lead_tier')} score={r.get('score')} | {tr}...")
    lines.append("")
    lines.append("## Mẫu Demand (text_raw rút gọn)")
    for i, r in enumerate(report.get("sample_rows_demand") or [], 1):
        tr = (r.get("text_raw") or "")[:200].replace("\n", " ")
        lines.append(f"{i}. tier={r.get('lead_tier')} score={r.get('score')} | {tr}...")
    lines.append("")
    OUT_REPORT.write_text("\n".join(lines), encoding="utf-8")


def write_real_source_report(report: dict[str, Any]) -> None:
    us = report.get("url_stats") or {}
    lines = [
        "# VCP_RENT_DEMAND — real source test",
        "",
        "## Metrics",
        "",
        f"- URL sources attempted: **{us.get('attempted', 0)}**",
        f"- URL reachable (HTTP OK, body ≥500B): **{us.get('reachable', 0)}**",
        f"- URL blocked (HTTP 401/403/429/451): **{us.get('blocked', 0)}**",
        f"- URL failed / empty / short: **{us.get('failed_fetch', 0)}**",
        f"- Local raw files (non-`_` prefix): **{report.get('raw_file_count', 0)}**",
        f"- Total pipeline sources scanned: **{report.get('links_scanned', 0)}**",
        f"- Supply leads: **{report.get('supply_n', 0)}** (H/W/C: {report.get('supply_hot', 0)}/"
        f"{report.get('supply_warm', 0)}/{report.get('supply_cold', 0)})",
        f"- Demand leads: **{report.get('demand_n', 0)}** (H/W/C: {report.get('demand_hot', 0)}/"
        f"{report.get('demand_warm', 0)}/{report.get('demand_cold', 0)})",
        f"- Tổng dòng lead (supply+demand): **{report.get('leads_kept', 0)}**",
        "",
        "## Kết luận (V1)",
        "",
    ]
    reachable = us.get("reachable", 0)
    leads = report.get("leads_kept", 0)
    if leads > 0 and reachable > 0:
        lines.append(
            "- **Pipeline:** Có thể chạy trên nguồn HTML công khai (trang môi giới/tin) và sinh lead có cấu trúc."
        )
        lines.append(
            "- **Nguồn ổn nhất cho lane VCP:** Các site **môi giới / aggregators** (HTML dài, đủ keyword `Vinhomes Central Park`, "
            "`cho thuê` / `tìm thuê`, giá `triệu/tháng`, SĐT) — ví dụ nhóm trang tương tự giakhanhland, chothuecanhocaocap, batdongsan **tin tức**."
        )
        lines.append(
            "- **Tiếp tục lane VCP:** Nên — với điều kiện ưu tiên **URL đọc được** + bổ sung **input_raw** khi MXH chặn bot."
        )
    elif leads > 0:
        lines.append(
            "- **Pipeline:** Lead đạt được chủ yếu từ **file `input_raw/`** (fallback hợp lệ khi GET bị chặn)."
        )
        lines.append(
            "- **Nguồn ổn:** Vẫn là trang có thể **copy nội dung thật** vào `.txt` — không phụ thuộc hoàn toàn vào fetch."
        )
        lines.append(
            "- **Tiếp tục lane:** Có — dùng hybrid URL + raw cho đến khi có API/hội thoại."
        )
    else:
        lines.append(
            "- **Pipeline:** Chưa sinh lead từ batch này — kiểm tra rule lọc, hoặc nội dung URL không đủ tín hiệu `thuê`+VCP+chi tiết."
        )
        lines.append("- **Nguồn ổn:** Cần thử lại URL khác hoặc **input_raw** từ bài đăng demand thật.")
        lines.append("- **Tiếp tục lane:** Điều chỉnh nguồn trước khi kết luận fail.")
    lines.extend(
        [
            "",
            f"- Supply CSV: `{report.get('csv_path_supply', '')}`",
            f"- Demand CSV: `{report.get('csv_path_demand', '')}`",
            "",
        ]
    )
    OUT_REAL_SOURCE_REPORT.write_text("\n".join(lines), encoding="utf-8")


def _rel_artifact(path: Path) -> str:
    try:
        return path.relative_to(DIR).as_posix()
    except Exception:
        return str(path)


def _write_contract_output(status: str, result_summary: str, artifacts: list[str]) -> None:
    CONTRACT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (CONTRACT_OUTPUT_DIR / "output.json").write_text(
        json.dumps(
            {
                "status": status,
                "result_summary": result_summary,
                "artifacts": artifacts,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def _configure_contract_io(payload: dict[str, Any]) -> tuple[Path, Path, Path]:
    global OUT_CSV_SUPPLY, OUT_CSV_DEMAND, OUT_CSV_DEMAND_SALE_READY
    global OUT_CSV_REAL_DEMAND_SALE_READY, OUT_DEMAND_HANDOFF, OUT_REAL_DEMAND_HANDOFF
    global OUT_REPORT, OUT_REAL_SOURCE_REPORT
    CONTRACT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CONTRACT_LOGS_DIR.mkdir(parents=True, exist_ok=True)

    profile_path = DEFAULT_PROFILE
    links_path = DIR / "input" / "input_links.txt" if (DIR / "input" / "input_links.txt").is_file() else DEFAULT_LINKS
    raw_dir = CONTRACT_INPUT_RAW if CONTRACT_INPUT_RAW.is_dir() else DEFAULT_RAW
    if raw_dir.is_dir():
        has_raw_files = any(
            p.is_file()
            and not p.name.startswith(("_", "."))
            and p.suffix.lower() in {".txt", ".html", ".htm"}
            for p in raw_dir.iterdir()
        )
        if not has_raw_files and DEFAULT_RAW.is_dir() and raw_dir != DEFAULT_RAW:
            raw_dir = DEFAULT_RAW

    if isinstance(payload, dict):
        profile_raw = str(payload.get("profile_path") or "").strip()
        links_raw = str(payload.get("links_path") or "").strip()
        raw_raw = str(payload.get("raw_dir") or "").strip()
        if profile_raw:
            profile_path = Path(profile_raw)
            if not profile_path.is_absolute():
                profile_path = DIR / profile_path
        if links_raw:
            links_path = Path(links_raw)
            if not links_path.is_absolute():
                links_path = DIR / links_path
        if raw_raw:
            raw_dir = Path(raw_raw)
            if not raw_dir.is_absolute():
                raw_dir = DIR / raw_dir

    OUT_CSV_SUPPLY = CONTRACT_OUTPUT_DIR / "output_vcp_supply_leads.csv"
    OUT_CSV_DEMAND = CONTRACT_OUTPUT_DIR / "output_vcp_demand_leads.csv"
    OUT_CSV_DEMAND_SALE_READY = CONTRACT_OUTPUT_DIR / "output_vcp_demand_sale_ready.csv"
    OUT_CSV_REAL_DEMAND_SALE_READY = (
        CONTRACT_OUTPUT_DIR / "output_vcp_real_demand_sale_ready.csv"
    )
    OUT_DEMAND_HANDOFF = CONTRACT_OUTPUT_DIR / "DEMAND_SALE_HANDOFF.md"
    OUT_REAL_DEMAND_HANDOFF = CONTRACT_OUTPUT_DIR / "REAL_DEMAND_HANDOFF.md"
    OUT_REPORT = CONTRACT_OUTPUT_DIR / "VCP_RENT_SELF_CHECK_REPORT.md"
    OUT_REAL_SOURCE_REPORT = CONTRACT_OUTPUT_DIR / "VCP_REAL_SOURCE_TEST_REPORT.md"
    return profile_path, links_path, raw_dir


def main() -> int:
    if CONTRACT_INPUT_JSON.is_file():
        try:
            contract = json.loads(CONTRACT_INPUT_JSON.read_text(encoding="utf-8"))
            profile_path, links_path, raw_dir = _configure_contract_io(contract.get("payload") or {})
            if not profile_path.is_file():
                raise FileNotFoundError(f"Missing profile: {profile_path}")
            rep = run(profile_path, links_path, raw_dir)
            write_report(rep)
            write_real_source_report(rep)
            rd_stats = run_real_demand_lane(profile_path, DEFAULT_REAL_DEMAND)
            artifacts = [
                _rel_artifact(path)
                for path in [
                    OUT_CSV_SUPPLY,
                    OUT_CSV_DEMAND,
                    OUT_CSV_DEMAND_SALE_READY,
                    OUT_CSV_REAL_DEMAND_SALE_READY,
                    OUT_DEMAND_HANDOFF,
                    OUT_REAL_DEMAND_HANDOFF,
                    OUT_REPORT,
                    OUT_REAL_SOURCE_REPORT,
                ]
                if path.is_file()
            ]
            _write_contract_output(
                "PASS",
                f"Rent lane completed. Supply={rep.get('supply_n', 0)} Demand={rep.get('demand_n', 0)} "
                f"real_demand={rd_stats.get('real_demand_n', 0)} business_ready={rd_stats.get('real_demand_business_ready', 0)}",
                artifacts,
            )
            print(
                f"Done. Supply: {rep.get('supply_n', 0)} -> {OUT_CSV_SUPPLY} | "
                f"Demand: {rep.get('demand_n', 0)} -> {OUT_CSV_DEMAND} | "
                f"Sale-ready: {OUT_CSV_DEMAND_SALE_READY.name} + {OUT_DEMAND_HANDOFF.name} | "
                f"Real-demand: {OUT_CSV_REAL_DEMAND_SALE_READY.name} "
                f"(business_ready={rd_stats.get('real_demand_business_ready', 0)}/"
                f"{rd_stats.get('real_demand_n', 0)})"
            )
            return 0
        except Exception as exc:
            _write_contract_output("FAIL", f"Rent lane failed: {exc}", [])
            print(f"Rent lane failed: {exc}", file=sys.stderr)
            return 1

    ap = argparse.ArgumentParser(description="VCP_RENT_DEMAND_SCOUT_V1")
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE)
    ap.add_argument("--links", type=Path, default=DEFAULT_LINKS)
    ap.add_argument("--raw", type=Path, default=DEFAULT_RAW)
    ap.add_argument(
        "--real-demand-only",
        action="store_true",
        help="Chỉ xử lý batch file .txt trong thư mục real-demand (không quét URL / listing).",
    )
    ap.add_argument(
        "--real-demand-dir",
        type=Path,
        default=None,
        help="Thư mục chứa paste .txt (mặc định: input_real_demand/).",
    )
    ap.add_argument(
        "--max-links",
        type=int,
        default=None,
        help="Chỉ xử lý N URL đầu tiên từ input_links.txt (không tính dòng trống / comment).",
    )
    args = ap.parse_args()

    if not args.profile.is_file():
        print("Thiếu profile:", args.profile, file=sys.stderr)
        return 1

    real_demand_dir = args.real_demand_dir or DEFAULT_REAL_DEMAND
    if not real_demand_dir.is_absolute():
        real_demand_dir = DIR / real_demand_dir

    if args.real_demand_only:
        rd_stats = run_real_demand_lane(args.profile, real_demand_dir)
        print(
            f"Real-demand batch only -> {OUT_CSV_REAL_DEMAND_SALE_READY} | "
            f"{OUT_REAL_DEMAND_HANDOFF.name} | "
            f"rows={rd_stats.get('real_demand_n', 0)} "
            f"business_ready={rd_stats.get('real_demand_business_ready', 0)} "
            f"skipped_files={rd_stats.get('real_demand_skipped', 0)}"
        )
        return 0

    rep = run(args.profile, args.links, args.raw, max_links=args.max_links)
    write_report(rep)
    write_real_source_report(rep)
    rd_stats = run_real_demand_lane(args.profile, real_demand_dir)
    print(
        f"Done. Supply: {rep.get('supply_n', 0)} -> {OUT_CSV_SUPPLY} | "
        f"Demand: {rep.get('demand_n', 0)} -> {OUT_CSV_DEMAND} | "
        f"Sale-ready: {OUT_CSV_DEMAND_SALE_READY.name} + {OUT_DEMAND_HANDOFF.name} | "
        f"Real-demand: {OUT_CSV_REAL_DEMAND_SALE_READY.name} + {OUT_REAL_DEMAND_HANDOFF.name} "
        f"(business_ready={rd_stats.get('real_demand_business_ready', 0)}/"
        f"{rd_stats.get('real_demand_n', 0)}, skipped_files={rd_stats.get('real_demand_skipped', 0)})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
