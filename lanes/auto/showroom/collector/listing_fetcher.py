"""Gom listing — Chợ Tốt hoặc Oto.com.vn (theo collector)."""

from __future__ import annotations

import html
import random
import re
import time
import urllib.request
from typing import Any

from lanes.auto.scout import chotot as chotot_scout
from lanes.auto.scout import oto_com as oto_scout

REQUEST_TIMEOUT_SEC = 20
chotot_scout.TIMEOUT_SECONDS = REQUEST_TIMEOUT_SEC
oto_scout.TIMEOUT_SECONDS = REQUEST_TIMEOUT_SEC
BONBANH_TIMEOUT_SEC = 10
MAX_ROWS_PER_PAGE = 10
MAX_TOTAL_LISTINGS = 30
MAX_DETAIL_LISTINGS = 15
FAIL_FAST_FETCH_SEC = 10.0
EXPANDED_REGIONS = ("binh-duong", "dong-nai")
_BAD_URLS: set[str] = set()
_TOTAL_LISTINGS_EMITTED = 0
_DETAIL_LISTINGS_EMITTED = 0


def _bonbanh_fetch_html(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    with urllib.request.urlopen(req, timeout=BONBANH_TIMEOUT_SEC) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def _bonbanh_page_url(seed_url: str, page: int) -> str:
    if page <= 1:
        return seed_url
    return f"{seed_url.rstrip('/')}/page,{page}"


def _bonbanh_slug_to_title(detail_url: str) -> str:
    m = re.search(r"/xe-([a-z0-9_\-]+)-(\d+)$", detail_url)
    if not m:
        return ""
    return m.group(1).replace("-", " ").replace("_", " ").strip().title()


def _parse_price_vnd(text: str) -> int:
    low = (text or "").lower()
    m_ty = re.search(r"(\d+[\.,]?\d*)\s*tỷ", low)
    if m_ty:
        val = float(m_ty.group(1).replace(",", "."))
        return int(val * 1_000_000_000)
    m_tr = re.search(r"(\d+[\.,]?\d*)\s*triệu", low)
    if m_tr:
        val = float(m_tr.group(1).replace(",", "."))
        return int(val * 1_000_000)
    m_num = re.search(r"(\d{7,12})", low.replace(",", "").replace(".", ""))
    if m_num:
        return int(m_num.group(1))
    return 0


def _fetch_bonbanh_page(seed_url: str, page: int) -> tuple[list[dict[str, Any]], str | None]:
    page_url = _bonbanh_page_url(seed_url, page)
    started = time.monotonic()
    try:
        raw = _bonbanh_fetch_html(page_url)
    except Exception as e:
        return [], str(e)
    elapsed = time.monotonic() - started
    if elapsed > FAIL_FAST_FETCH_SEC:
        return [], f"skip source slow_fetch>{FAIL_FAST_FETCH_SEC}s"

    base = seed_url.split("/oto")[0].rstrip("/")
    if not base.startswith("http"):
        base = "https://bonbanh.com"

    out: list[dict[str, Any]] = []
    seen: set[int] = set()
    for m in re.finditer(r'href=[\x22](xe-[a-z0-9_\-]+-(\d+))[\x22]', raw):
        rel_path = m.group(1).strip()
        lid = int(m.group(2))
        if lid in seen:
            continue
        seen.add(lid)
        detail_url = f"https://bonbanh.com/{rel_path}"
        window = raw[max(0, m.start() - 600) : m.end() + 600]

        title_m = re.search(r'itemprop="name"[^>]*>([^<]+)<', window)
        title = html.unescape(title_m.group(1).strip()) if title_m else _bonbanh_slug_to_title(detail_url)

        price_m = re.search(r'itemprop="price"\s+content="(\d+)"', window)
        price = int(price_m.group(1)) if price_m else _parse_price_vnd(window)

        year_m = re.search(r"\b(19\d{2}|20\d{2})\b", window)
        km_m = re.search(r"(\d[\d\.,]*)\s*km", window.lower())
        km_v = 0
        if km_m:
            km_v = int(km_m.group(1).replace(",", "").replace(".", ""))

        loc_m = re.search(r'class="cb4"[^>]*>\s*<b>([^<]+)</b>', window)
        location = html.unescape(loc_m.group(1).strip()) if loc_m else ""

        ad = {
            "source": "bonbanh",
            "list_id": lid,
            "bonbanh_detail_url": detail_url,
            "subject": title,
            "price": price,
            "mfdate": int(year_m.group(1)) if year_m else 0,
            "mileage_v2": km_v,
            "region_name_v3": location,
            "seller_type": "unknown",
        }
        out.append(ad)
        if len(out) >= MAX_ROWS_PER_PAGE:
            break
    out = _apply_limits(out)
    return out, None


def _apply_limits(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    global _TOTAL_LISTINGS_EMITTED, _DETAIL_LISTINGS_EMITTED
    out: list[dict[str, Any]] = []
    for row in rows:
        if _TOTAL_LISTINGS_EMITTED >= MAX_TOTAL_LISTINGS:
            break
        item = dict(row)
        if _DETAIL_LISTINGS_EMITTED >= MAX_DETAIL_LISTINGS:
            item["list_id"] = None
        elif isinstance(item.get("list_id"), int):
            _DETAIL_LISTINGS_EMITTED += 1
        out.append(item)
        _TOTAL_LISTINGS_EMITTED += 1
    return out


def _fetch_single_page(
    seed_url: str, page: int = 1, *, collector: str = "chotot"
) -> tuple[list[dict[str, Any]], str | None]:
    if seed_url in _BAD_URLS:
        return [], f"blocked bad url: {seed_url}"
    started = time.monotonic()
    try:
        if collector == "oto_com":
            rows, err = oto_scout.fetch_listing_ads(seed_url, page=page)
        else:
            rows, err = chotot_scout.fetch_listing_ads(seed_url, page=page)
    except Exception as e:
        err = str(e)
        rows = []
    elapsed = time.monotonic() - started
    if elapsed > FAIL_FAST_FETCH_SEC:
        _BAD_URLS.add(seed_url)
        return [], f"skip source slow_fetch>{FAIL_FAST_FETCH_SEC}s"
    if err:
        if "404" in str(err):
            _BAD_URLS.add(seed_url)
        print(
            f"[LISTING_FETCH_FAIL] source={collector} url={seed_url} page={page} attempt=1 error={err}"
        )
        return [], str(err)
    rows = list(rows or [])[:MAX_ROWS_PER_PAGE]
    rows = _apply_limits(rows)
    print(
        f"[LISTING_FETCH_OK] source={collector} url={seed_url} page={page} attempt=1 rows={len(rows)}"
    )
    return rows, None


def fetch_listing_page(
    seed_url: str, page: int = 1, *, collector: str = "chotot"
) -> tuple[list[dict[str, Any]], str | None]:
    print(f"[LISTING_FETCH] source={collector} url={seed_url} page={page}")
    if _TOTAL_LISTINGS_EMITTED >= MAX_TOTAL_LISTINGS:
        return [], None
    if collector == "bonbanh":
        rows, err = _fetch_bonbanh_page(seed_url, page)
        if err:
            print(
                f"[LISTING_FETCH_FAIL] source={collector} url={seed_url} page={page} attempt=1 error={err}"
            )
            return [], err
        print(
            f"[LISTING_FETCH_OK] source={collector} url={seed_url} page={page} attempt=1 rows={len(rows)}"
        )
        return rows, None
    if page != 1:
        return [], None
    if collector != "chotot":
        return _fetch_single_page(seed_url, page=page, collector=collector)

    mixed_rows: list[dict[str, Any]] = []
    last_err: str | None = None
    for region in EXPANDED_REGIONS:
        if _TOTAL_LISTINGS_EMITTED >= MAX_TOTAL_LISTINGS:
            break
        region_url = f"https://xe.chotot.com/mua-ban-oto-{region}"
        for p in range(1, 2):
            region_rows, err = _fetch_single_page(region_url, page=p, collector=collector)
            if err:
                last_err = err
            if not region_rows:
                break
            mixed_rows.extend(region_rows)
    random.shuffle(mixed_rows)
    return mixed_rows, last_err
