#!/usr/bin/env python3
"""Submit ASSET-BUILD-09A workflow A as a ComfyUI API prompt."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def load_workflow(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def submit_prompt(endpoint: str, client_id: str, workflow: dict) -> str:
    payload = {"prompt": workflow, "client_id": client_id}
    data = json.dumps(payload).encode("utf-8")
    request = Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlopen(request, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def main() -> int:
    default_workflow = (
        Path(__file__).resolve().parent
        / "workflows"
        / "ASSET-BUILD-09_REPAIR_CAND00002_A_SAFE_FIRST.json"
    )

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--workflow",
        default=str(default_workflow),
        help="Path to the workflow JSON to submit.",
    )
    parser.add_argument(
        "--endpoint",
        default="http://127.0.0.1:8188/prompt",
        help="ComfyUI prompt endpoint.",
    )
    parser.add_argument(
        "--client-id",
        default="ASSET-BUILD-09A",
        help="Client ID sent with the prompt request.",
    )
    args = parser.parse_args()

    workflow_path = Path(args.workflow)
    if not workflow_path.exists():
        print(f"Workflow not found: {workflow_path}", file=sys.stderr)
        return 2

    workflow = load_workflow(workflow_path)

    try:
        response_text = submit_prompt(args.endpoint, args.client_id, workflow)
    except HTTPError as exc:
        print(f"HTTP error: {exc.code} {exc.reason}", file=sys.stderr)
        return 1
    except URLError as exc:
        print(f"Connection error: {exc.reason}", file=sys.stderr)
        return 1

    print(response_text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
