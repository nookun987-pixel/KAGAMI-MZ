"""Chi tiết tin — Chợ Tốt hoặc Oto.com.vn."""

from __future__ import annotations

import html
import re
import urllib.request
from typing import Any

from lanes.auto.scout import chotot as chotot_scout
from lanes.auto.scout import oto_com as oto_scout

REQUEST_TIMEOUT_SEC = 20
chotot_scout.TIMEOUT_SECONDS = REQUEST_TIMEOUT_SEC
oto_scout.TIMEOUT_SECONDS = REQUEST_TIMEOUT_SEC
BONBANH_TIMEOUT_SEC = 10


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


def _parse_price_vnd(text: str) -> int:
    low = (text or "").lower()
    m_ty = re.search(r"(\d+[\.,]?\d*)\s*tỷ", low)
    if m_ty:
        return int(float(m_ty.group(1).replace(",", ".")) * 1_000_000_000)
    m_tr = re.search(r"(\d+[\.,]?\d*)\s*triệu", low)
    if m_tr:
        return int(float(m_tr.group(1).replace(",", ".")) * 1_000_000)
    m_num = re.search(r"(\d{7,12})", low.replace(",", "").replace(".", ""))
    if m_num:
        return int(m_num.group(1))
    return 0


def _extract_contact_box(raw_html: str) -> str:
    m = re.search(
        r'<div\s+class="contact-box">(.*?)</div>\s*(?:<!--|\s*<)',
        raw_html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    return m.group(1) if m else ""


def _bonbanh_seller_type(raw_html: str) -> str:
    box = _extract_contact_box(raw_html)
    if not box:
        return "unknown"
    low = box.lower()
    if re.search(r'href="https?://[a-z0-9\-]+\.bonbanh\.com', low):
        return "dealer"
    if any(kw in low for kw in ("salon", "showroom", "đại lý", "auto ", "garage")):
        return "dealer"
    if "chính chủ" in low or "1 chủ" in low:
        return "owner"
    return "unknown"


def _fetch_bonbanh_detail(seed_url: str, list_id: int, listing_ad: dict[str, Any] | None):
    detail_url = str((listing_ad or {}).get("bonbanh_detail_url") or "").strip()
    if not detail_url:
        return None, "", "bonbanh detail url missing"
    try:
        raw = _bonbanh_fetch_html(detail_url)
    except Exception as e:
        return None, detail_url, str(e)

    title = html.unescape((listing_ad or {}).get("subject") or "")
    if not title:
        m_title = re.search(r"<h1[^>]*>(.*?)</h1>", raw, flags=re.IGNORECASE | re.DOTALL)
        if m_title:
            title = html.unescape(re.sub(r"<[^>]+>", " ", m_title.group(1))).strip()

    m_year = re.search(r"\b(19\d{2}|20\d{2})\b", raw)
    m_km = re.search(r"(\d[\d\.,]*)\s*km", raw.lower())
    m_phone = re.search(r"tel:([0-9\s\.\-\+]{8,})", raw, flags=re.IGNORECASE)
    m_img = re.search(
        r'(?:src|data-src|data-original)="(https://s\.bonbanh\.com/uploads/[^"]+\.(?:jpg|jpeg|png|webp))',
        raw, flags=re.IGNORECASE,
    )

    km_v = 0
    if m_km:
        km_v = int(m_km.group(1).replace(",", "").replace(".", ""))
    phone = ""
    if m_phone:
        phone = re.sub(r"\D", "", m_phone.group(1))

    box = _extract_contact_box(raw)
    loc_m = re.search(r"Địa chỉ:\s*(.+?)(?:<br|</div)", box, flags=re.IGNORECASE | re.DOTALL)
    location = html.unescape(re.sub(r"<[^>]+>", " ", loc_m.group(1)).strip()) if loc_m else ""
    if not location:
        location = str((listing_ad or {}).get("region_name_v3") or "").strip()

    detail = {
        "source": "bonbanh",
        "listing_id": str(list_id),
        "detail_url": detail_url,
        "subject": title,
        "price": _parse_price_vnd(raw),
        "mfdate": int(m_year.group(1)) if m_year else 0,
        "mileage_v2": km_v,
        "region_name_v3": location,
        "seller_type": _bonbanh_seller_type(raw),
        "phone": phone,
        "image": (m_img.group(1) if m_img else ""),
    }
    if detail["seller_type"] == "dealer":
        detail["company_ad"] = True
    elif detail["seller_type"] == "owner":
        detail["company_ad"] = False
    return detail, detail_url, None


def fetch_detail(
    seed_url: str,
    list_id: int,
    *,
    listing_ad: dict[str, Any] | None = None,
    collector: str = "chotot",
):
    print(f"[DETAIL_FETCH] source={collector} seed_url={seed_url} list_id={list_id}")
    if collector == "bonbanh":
        return _fetch_bonbanh_detail(seed_url, list_id, listing_ad)
    if collector == "oto_com":
        return oto_scout.fetch_detail_ad(
            seed_url,
            list_id,
            oto_detail_url=(listing_ad or {}).get("oto_detail_url"),
        )
    return chotot_scout.fetch_detail_ad(seed_url, list_id)
