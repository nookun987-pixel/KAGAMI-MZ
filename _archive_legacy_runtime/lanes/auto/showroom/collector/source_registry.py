"""
LOCK 1 — SOURCE LOCK: chỉ nguồn đã duyệt, có config riêng.
"""

from __future__ import annotations

import json
import os
from typing import Any

from lanes.auto.showroom.paths import project_root


def _bonbanh_source_config() -> dict[str, Any]:
    return {
        "id": "bonbanh.com",
        "enabled": True,
        "label": "Bonbanh",
        "collector": "bonbanh",
        "seeds": [
            "https://bonbanh.com/binh-duong/oto",
            "https://bonbanh.com/dong-nai/oto",
        ],
        "pages_per_seed": 1,
        "max_vehicles_per_run": 20,
        "request_delay_sec": 0.2,
        "max_source_runtime_sec": 30,
    }


def _registry_path() -> str:
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base, "collector", "approved_sources.json")


def load_approved_sources() -> list[dict[str, Any]]:
    forced_source = str(os.getenv("GARA_SOURCE", "")).strip().lower()
    if forced_source == "bonbanh":
        return [_bonbanh_source_config()]

    path = _registry_path()
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    sources = data.get("sources", [])
    if forced_source:
        return [
            s
            for s in sources
            if str(s.get("id", "")).strip().lower() == forced_source
            or str(s.get("collector", "")).strip().lower() == forced_source
        ]
    return sources


def get_source_config(source_id: str) -> dict[str, Any] | None:
    for s in load_approved_sources():
        if s.get("id") == source_id and s.get("enabled", True):
            return s
    return None


def assert_source_enabled(source_id: str) -> dict[str, Any]:
    cfg = get_source_config(source_id)
    if not cfg:
        raise PermissionError(f"SOURCE LOCK: nguồn không được phép: {source_id}")
    return cfg
