"""HTTP API tối thiểu (stdlib)."""

from __future__ import annotations

import json
import os
import socket
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from lanes.auto.showroom.audit.audit_log_service import audit, log_action
from lanes.auto.showroom.db import connect, init_db, jdump, jload, now_ts
from lanes.auto.showroom.showroom.showroom_service import (
    export_csv_secondary,
    list_display_ready,
    list_expanded_inventory,
    list_review_queue,
    sections,
    vehicle_detail,
)


def _json(handler: BaseHTTPRequestHandler, code: int, obj: object) -> None:
    data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
    handler.send_response(code)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.end_headers()
    handler.wfile.write(data)


def _static_dir() -> str:
    return os.path.join(os.path.dirname(__file__), "static")


class ShowroomHTTPServer(ThreadingHTTPServer):
    """IPv4-only; SO_EXCLUSIVEADDRUSE on Windows to avoid duplicate binds on same port."""

    address_family = socket.AF_INET
    allow_reuse_address = False

    def server_bind(self) -> None:
        if hasattr(socket, "SO_EXCLUSIVEADDRUSE"):
            try:
                self.socket.setsockopt(
                    socket.SOL_SOCKET,
                    socket.SO_EXCLUSIVEADDRUSE,  # type: ignore[attr-defined]
                    1,
                )
            except OSError:
                pass
        super().server_bind()


class ShowroomHandler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        return

    def do_GET(self) -> None:  # noqa: N802
        u = urlparse(self.path)
        path = u.path
        if path == "/" or path == "/index.html":
            return self._file("index.html", "text/html; charset=utf-8")
        if path.startswith("/static/"):
            name = path[len("/static/") :]
            return self._file(name, self._guess_type(name))
        if path == "/api/showroom/sections":
            qs = parse_qs(u.query or "")
            po = (qs.get("private_only") or [""])[0].strip()
            return _json(self, 200, sections(private_only=(po in ("1", "true", "yes"))))
        if path == "/api/showroom/review":
            return _json(self, 200, {"items": list_review_queue()})
        if path == "/api/showroom/list":
            qs = parse_qs(u.query or "")
            fk = (qs.get("filter") or ["all"])[0]
            ex_raw = (qs.get("exclude") or [""])[0]
            po = (qs.get("private_only") or [""])[0].strip()
            exclude_ids = [
                x.strip() for x in ex_raw.replace("%2C", ",").split(",") if x.strip()
            ]
            items = list_display_ready(
                fk, exclude_vehicle_ids=exclude_ids or None,
                private_only=(po in ("1", "true", "yes"))
            )
            return _json(self, 200, {"items": items})
        if path == "/api/showroom/expanded":
            qs = parse_qs(u.query or "")
            fk = (qs.get("filter") or ["all"])[0]
            return _json(self, 200, {"items": list_expanded_inventory(fk)})
        if path == "/api/showroom/highlight":
            qs = parse_qs(u.query or "")
            po = (qs.get("private_only") or [""])[0].strip()
            return _json(self, 200, {"items": sections(private_only=(po in ("1", "true", "yes")))["highlight_today"]})
        if path == "/api/showroom/urgent":
            qs = parse_qs(u.query or "")
            po = (qs.get("private_only") or [""])[0].strip()
            return _json(self, 200, {"items": sections(private_only=(po in ("1", "true", "yes")))["call_now"]})
        if path.startswith("/api/vehicle/"):
            vid = path.rstrip("/").split("/")[-1]
            if not vid:
                return _json(self, 400, {"error": "bad id"})
            d = vehicle_detail(vid)
            if not d:
                return _json(self, 404, {"error": "not found"})
            return _json(self, 200, d)
        if path == "/api/export/csv":
            from lanes.auto.showroom.paths import data_dir

            p = os.path.join(data_dir(), "showroom_export.csv")
            n = export_csv_secondary(p)
            return _json(self, 200, {"path": p, "rows": n})
        return _json(self, 404, {"error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        u = urlparse(self.path)
        if u.path.startswith("/api/vehicle/") and u.path.endswith("/action"):
            parts = u.path.strip("/").split("/")
            if len(parts) < 4:
                return _json(self, 400, {"error": "bad path"})
            vid = parts[2]
            ln = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(ln).decode("utf-8", "replace") if ln else "{}"
            try:
                body = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                body = {}
            action = (body.get("type") or "").strip()
            init_db()
            conn = connect()
            try:
                cur = conn.execute(
                    "SELECT human_flags_json FROM showroom_state WHERE vehicle_id=?",
                    (vid,),
                )
                row = cur.fetchone()
                if not row:
                    return _json(self, 404, {"error": "not found"})
                human = jload(row[0])
                if action == "save_sale":
                    human["luu_sale"] = True
                elif action == "priority":
                    human["uu_tien"] = True
                elif action == "watch":
                    human["theo_doi"] = True
                elif action == "contacted":
                    human["da_lien_he"] = True
                else:
                    return _json(self, 400, {"error": "unknown action"})
                conn.execute(
                    "UPDATE showroom_state SET human_flags_json=?, updated_at=? WHERE vehicle_id=?",
                    (jdump(human), now_ts(), vid),
                )
                log_action(conn, vid, action, {"via": "showroom_ui"})
                audit(conn, vid, "ACTION_LOCK", action, {"human": human})
                conn.commit()
            finally:
                conn.close()
            return _json(self, 200, {"ok": True, "human_flags": human})
        return _json(self, 404, {"error": "not found"})

    def _guess_type(self, name: str) -> str:
        low = name.lower()
        if low.endswith(".js"):
            return "application/javascript; charset=utf-8"
        if low.endswith(".css"):
            return "text/css; charset=utf-8"
        if low.endswith(".png"):
            return "image/png"
        return "application/octet-stream"

    def _file(self, name: str, ctype: str) -> None:
        path = os.path.join(_static_dir(), name)
        if not os.path.isfile(path):
            return _json(self, 404, {"error": "missing static"})
        with open(path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.end_headers()
        self.wfile.write(data)


def serve_forever(host: str = "127.0.0.1", port: int = 8765) -> None:
    init_db()
    try:
        httpd = ShowroomHTTPServer((host, port), ShowroomHandler)
    except OSError as e:
        print(f"[showroom] port {port} occupied ({e}); aborting", flush=True)
        sys.exit(1)
    print(f"MIKAGE ZENITH — GARA QP — http://{host}:{port}/", flush=True)
    httpd.serve_forever()
