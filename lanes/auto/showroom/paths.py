"""Đường dẫn dữ liệu local (MIKAGE AUTO SHOWROOM)."""

from __future__ import annotations

import os
import sys


def project_root() -> str:
    if getattr(sys, "frozen", False):
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def data_dir() -> str:
    d = os.path.join(project_root(), "data", "mikage_auto_showroom")
    os.makedirs(d, exist_ok=True)
    return d


def db_path() -> str:
    return os.path.join(data_dir(), "showroom.db")


def raw_dir() -> str:
    d = os.path.join(data_dir(), "raw_payloads")
    os.makedirs(d, exist_ok=True)
    return d
