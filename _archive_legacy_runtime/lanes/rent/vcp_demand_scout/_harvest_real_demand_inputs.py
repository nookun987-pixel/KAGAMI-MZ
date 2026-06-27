"""
Thu thập đoạn chữ công khai (verbatim) từ các trang vinhomeshcmc — cùng khối UI 'Đang Tìm Thuê'
nhưng SOURCE khác nhau để tăng số dòng demand trong CSV.
Chạy: python _harvest_real_demand_inputs.py
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

import requests

DIR = Path(__file__).resolve().parent
RAW = DIR / "input_raw"

spec = importlib.util.spec_from_file_location("scout", DIR / "run_vcp_rent_scout.py")
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(mod)
profile = json.loads((DIR / "profile_VCP_RENT_DEMAND.json").read_text(encoding="utf-8"))
K = list(profile["keywords"])
N = list(profile.get("negative_keywords", []))


class _P(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._c: list[str] = []

    def handle_data(self, data: str) -> None:
        self._c.append(data)

    def text(self) -> str:
        return "".join(self._c)


def strip_html(html: str) -> str:
    p = _P()
    p.feed(html)
    p.close()
    return re.sub(r"\s+", " ", p.text()).strip()


def qualifies(text: str) -> bool:
    head = text[: mod.LANE_INTENT_HEAD_CHARS]
    norm = mod.normalize_for_match(text)
    hits = mod.keyword_hits(norm, K)
    has_vcp = len(hits) > 0
    if not has_vcp or mod.negative_vehicle_spam(norm, N, has_vcp):
        return False
    if not mod.demand_intent_ok(head):
        return False
    apt = mod.extract_apartment(text)
    budget = mod.extract_budget(text)
    urgency = mod.extract_urgency(text)
    contact = mod.extract_contact(text)
    return mod.include_demand_lead(
        has_vcp, True, apt, budget, urgency, contact
    )


def extract_block(t: str) -> str:
    low = t.lower()
    i = low.find("có thể bạn đang tìm thuê")
    if i == -1:
        i = low.find("tìm thuê")
    if i == -1:
        return ""
    chunk = t[i : i + 1700]
    for cut in (" window.", " document.", "<script"):
        j = chunk.find(cut)
        if j != -1:
            chunk = chunk[:j]
    return chunk.strip()


# Các trang public VCP (đường dẫn /properties/ — đã kiểm tra có khối tìm thuê + keyword).
URLS = [
    "https://vinhomeshcmc.vn/properties/cho-thue-can-ho-vinhomes-central-park/",
    "https://vinhomeshcmc.vn/properties/cho-thue-can-ho-vinhomes-central-park-theo-ngay-1-2-3-4/",
    "https://vinhomeshcmc.vn/properties/cho-thue-can-ho-3-pn-toa-park-5-vinhomes/",
    "https://vinhomeshcmc.vn/properties/mua-can-ho-vinhomes-central-park/",
    "https://vinhomeshcmc.vn/properties/cho-thue-shophouse-160m2-mat-tien-dep-gia-tot/",
    "https://vinhomeshcmc.vn/properties/ban-can-ho-vinhomes-central-park-can-ho-1-2-3-4-phong-ngu/",
    "https://vinhomeshcmc.vn/properties/vinhomes-central-park-for-rent-apartment-1-2-3-4-bedroom/",
]


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    RAW.mkdir(parents=True, exist_ok=True)
    n = 0
    seen: set[str] = set()

    for url in URLS:
        try:
            r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=45)
            if not r.ok:
                print("skip", url, r.status_code)
                continue
            body = extract_block(strip_html(r.text))
            if not body:
                print("no_block", url)
                continue
            if not qualifies(body):
                print("no_qualify", url)
                continue
            h = hashlib.sha256(body.encode("utf-8")).hexdigest()[:16]
            if h in seen:
                print("skip_dup_content", url)
                continue
            seen.add(h)
            slug = url.rstrip("/").split("/")[-1][:40]
            fname = f"real_demand_pub_vinhomeshcmc_{slug}.txt"
            p = RAW / fname
            p.write_text(f"SOURCE: {url}\n\n{body}\n", encoding="utf-8")
            print("OK", fname)
            n += 1
        except Exception as e:
            print("ERR", url, e)

    print("written", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
