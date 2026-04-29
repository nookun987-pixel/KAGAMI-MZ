"""CLI: python -m mikage_auto_showroom [ingest|score|serve|web|export|rescore]"""

from __future__ import annotations

import argparse
import multiprocessing as mp
import os
import sys
import time
from pathlib import Path

from lanes.auto.showroom.db import init_db
from lanes.auto.showroom.pipeline import ingest_run, ingest_worker_main, score_run
from lanes.auto.showroom.rebatch import rescore_all
from lanes.auto.showroom.paths import data_dir
from lanes.auto.showroom.showroom.showroom_api import serve_forever
from lanes.auto.showroom.showroom.showroom_service import export_csv_secondary, export_gara_final_csv


def _master_status_path() -> Path:
    return Path(__file__).resolve().parents[3] / "docs" / "MIKAGE_MASTER_STATUS.md"


def _append_process_timeout_report(timeout_sec: int, elapsed_sec: float) -> None:
    try:
        p = _master_status_path()
        p.parent.mkdir(parents=True, exist_ok=True)
        with p.open("a", encoding="utf-8") as f:
            f.write("\n## GARA_INGEST_PROCESS_TIMEOUT_EVENT\n")
            f.write("- STATUS: BLOCKED_TIMEOUT\n")
            f.write("- STAGE: PROCESS_TIMEOUT\n")
            f.write(f"- timeout_sec: {int(timeout_sec)}\n")
            f.write(f"- runtime_seconds: {elapsed_sec:.3f}\n")
            f.write("- command: python -m lanes.auto.showroom ingest\n")
    except Exception as e:
        print(f"[WARN] timeout report append failed: {e}", file=sys.stderr)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="mikage_auto_showroom")
    sub = p.add_subparsers(dest="cmd")

    sub.add_parser("ingest", help="Chạy collector + normalize + dedup + score + gate")
    sub.add_parser("score", help="Chấm lại xe đang NORMALIZED")
    sp = sub.add_parser("serve", help="Mở Showroom UI (http://127.0.0.1:8765)")
    sp.add_argument("--host", type=str, default="127.0.0.1")
    sp.add_argument("--port", type=int, default=8765)
    wp = sub.add_parser("web", help="Giống serve — mở Showroom UI")
    wp.add_argument("--host", type=str, default="127.0.0.1")
    wp.add_argument("--port", type=int, default=8765)
    sub.add_parser("export", help="Ghi CSV phụ (không phải source of truth)")
    sub.add_parser(
        "rescore",
        help="Chấm lại toàn bộ xe trong DB (Phase 2 median/phone/ảnh)",
    )

    args = p.parse_args(argv)
    init_db()

    if args.cmd == "ingest":
        timeout_sec = int(float(os.getenv("GARA_INGEST_HARD_TIMEOUT_SEC", "120")))
        if timeout_sec <= 0:
            timeout_sec = 120
        q: mp.Queue = mp.Queue()
        p_ingest = mp.Process(target=ingest_worker_main, args=(q,), name="gara-ingest-worker")
        started = time.monotonic()
        p_ingest.start()
        p_ingest.join(timeout_sec)
        elapsed = time.monotonic() - started
        if p_ingest.is_alive():
            p_ingest.terminate()
            p_ingest.join(5)
            print("STATUS: BLOCKED_TIMEOUT")
            print("STAGE: PROCESS_TIMEOUT")
            _append_process_timeout_report(timeout_sec, elapsed)
            return 124
        if q.empty():
            print("[ERROR] ingest worker exited without payload", file=sys.stderr)
            return 1
        status, payload = q.get()
        if status == "ok":
            print(payload.get("result"))
            print(f"[contract] lanes/auto/output/final.csv written rows={payload.get('rows')}")
            return 0
        print(payload, file=sys.stderr)
        return 1
    if args.cmd == "score":
        r = score_run()
        print(r)
        try:
            n = export_gara_final_csv()
            print(f"[contract] lanes/auto/output/final.csv written rows={n}")
        except Exception as _e:
            print(f"[WARN] gara output contract write failed: {_e}", file=sys.stderr)
        return 0
    if args.cmd in ("serve", "web"):
        try:
            n = export_gara_final_csv()
            print(f"[contract] lanes/auto/output/final.csv written rows={n}")
        except Exception as _e:
            print(f"[WARN] gara output contract write failed: {_e}", file=sys.stderr)
        serve_forever(
            host=str(getattr(args, "host", "127.0.0.1")),
            port=int(getattr(args, "port", 8765)),
        )
        return 0
    if args.cmd == "export":
        path = os.path.join(data_dir(), "showroom_export.csv")
        n = export_csv_secondary(path)
        print("wrote", path, "rows", n)
        return 0
    if args.cmd == "rescore":
        r = rescore_all()
        print(r)
        return 0

    p.print_help()
    return 1


if __name__ == "__main__":
    mp.freeze_support()
    raise SystemExit(main())
