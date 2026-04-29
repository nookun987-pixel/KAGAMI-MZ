"""LOCK 5 — STATUS: chuyển trạng thái hợp lệ."""

from __future__ import annotations

# Thứ tự pipeline cho phép (đơn giản hóa V1)
_ORDER = [
    "NEW",
    "NORMALIZED",
    "SCORED",
    "DISPLAY_READY",
    "REVIEW",
    "HOLD",
    "REJECT",
    "ARCHIVED",
]

_ALLOWED = {
    "NEW": {"NORMALIZED", "REJECT"},
    "NORMALIZED": {"SCORED", "HOLD", "REJECT"},
    "SCORED": {"DISPLAY_READY", "REVIEW", "HOLD", "REJECT"},
    "DISPLAY_READY": {"ARCHIVED", "HOLD", "REVIEW"},
    "REVIEW": {"DISPLAY_READY", "HOLD", "REJECT", "ARCHIVED"},
    "HOLD": {"REVIEW", "DISPLAY_READY", "REJECT", "ARCHIVED"},
    "REJECT": {"ARCHIVED"},
    "ARCHIVED": set(),
}


def can_transition(from_s: str, to_s: str) -> bool:
    return to_s in _ALLOWED.get(from_s, set())


def assert_transition(from_s: str, to_s: str) -> None:
    if not can_transition(from_s, to_s):
        raise ValueError(f"STATUS LOCK: {from_s} -> {to_s} not allowed")
