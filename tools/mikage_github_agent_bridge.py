#!/usr/bin/env python3
"""
Mikage GitHub Agent Bridge V0.

Purpose:
- Pull labeled GitHub issues into local task files.
- Post local agent reports back to GitHub issues.

Safety:
- Does not run lane runtimes.
- Does not call GSheet or Telegram.
- Does not read .env, credentials, repo_credentials, keys, or secrets.
- Does not push code or merge PRs.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


DEFAULT_REPO = "nookun987-pixel/KAGAMI-MZ"
DEFAULT_LABEL = "mikage-task"
DEFAULT_OUT_DIR = str(Path(tempfile.gettempdir()) / "mikage_agent_queue")


class BridgeError(RuntimeError):
    pass


def _safe_print(value: str) -> None:
    print(value, flush=True)


def get_github_token() -> str:
    """Return GitHub token from env or gh CLI without printing it."""
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        return token.strip()

    try:
        completed = subprocess.run(
            ["gh", "auth", "token"],
            check=True,
            capture_output=True,
            text=True,
            timeout=10,
        )
        token = completed.stdout.strip()
        if token:
            return token
    except (FileNotFoundError, subprocess.SubprocessError):
        pass

    raise BridgeError(
        "GitHub token not found. Run `gh auth login` or set GITHUB_TOKEN/GH_TOKEN."
    )


def github_request(method: str, path: str, token: str, payload: dict[str, Any] | None = None) -> Any:
    url = f"https://api.github.com{path}"
    body = None
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "mikage-github-agent-bridge-v0",
    }
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = Request(url, data=body, headers=headers, method=method)
    try:
        with urlopen(request, timeout=30) as response:
            text = response.read().decode("utf-8")
            if not text:
                return None
            return json.loads(text)
    except HTTPError as exc:
        message = exc.read().decode("utf-8", errors="replace")
        raise BridgeError(f"GitHub API error {exc.code}: {message}") from exc
    except URLError as exc:
        raise BridgeError(f"GitHub API network error: {exc}") from exc


def sanitize_slug(text: str, limit: int = 60) -> str:
    text = re.sub(r"[^A-Za-z0-9_.-]+", "-", text.strip())
    text = text.strip("-._")
    return (text[:limit] or "task").lower()


def fetch_open_task_issues(repo: str, label: str, token: str, limit: int) -> list[dict[str, Any]]:
    encoded_repo = quote(repo, safe="")
    encoded_label = quote(label, safe="")
    path = f"/repos/{encoded_repo}/issues?state=open&labels={encoded_label}&per_page={limit}"
    issues = github_request("GET", path, token)
    if not isinstance(issues, list):
        raise BridgeError("Unexpected GitHub issues response")
    return [issue for issue in issues if "pull_request" not in issue]


def write_issue_task_file(issue: dict[str, Any], repo: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    number = issue.get("number")
    title = str(issue.get("title") or "untitled")
    body = str(issue.get("body") or "")
    url = str(issue.get("html_url") or "")
    created = str(issue.get("created_at") or "")
    fetched_at = datetime.now(timezone.utc).isoformat()
    slug = sanitize_slug(title)
    path = out_dir / f"issue_{number}_{slug}.md"

    content = f"""# MIKAGE_LOCAL_AGENT_TASK

## SOURCE
- repo: {repo}
- issue: #{number}
- url: {url}
- created_at: {created}
- fetched_at_utc: {fetched_at}

## TITLE
{title}

## ISSUE_BODY
{body}

## LOCAL_AGENT_RULES
- Read the issue body as the task contract.
- Do not inspect .env, credentials, repo_credentials, keys, or secrets.
- Do not run GSheet sync, Telegram send, or full runtime loop unless the issue explicitly allows it.
- Do not push directly to main.
- Report FILES_CHANGED, COMMANDS_RUN, PASS_FAIL, EVIDENCE, RISKS, REPO_STATUS, NEXT_SAFE_ACTION.
"""
    path.write_text(content, encoding="utf-8")
    return path


def cmd_pull(args: argparse.Namespace) -> int:
    token = get_github_token()
    issues = fetch_open_task_issues(args.repo, args.label, token, args.limit)
    out_dir = Path(args.out)

    _safe_print("MIKAGE_GITHUB_AGENT_BRIDGE_PULL")
    _safe_print(f"repo={args.repo}")
    _safe_print(f"label={args.label}")
    _safe_print(f"out={out_dir}")
    _safe_print(f"issues_found={len(issues)}")

    for issue in issues:
        path = write_issue_task_file(issue, args.repo, out_dir)
        _safe_print(f"WROTE issue=#{issue.get('number')} path={path}")

    return 0


def cmd_report(args: argparse.Namespace) -> int:
    report_path = Path(args.report_file)
    if not report_path.exists():
        raise BridgeError(f"Report file not found: {report_path}")

    report = report_path.read_text(encoding="utf-8", errors="replace")
    if len(report) > args.max_chars:
        report = report[: args.max_chars] + "\n\n[TRUNCATED_BY_MIKAGE_BRIDGE]"

    body = f"""## MIKAGE_AGENT_REPORT

{report}
"""
    token = get_github_token()
    encoded_repo = quote(args.repo, safe="")
    path = f"/repos/{encoded_repo}/issues/{args.issue}/comments"
    github_request("POST", path, token, {"body": body})

    _safe_print("MIKAGE_GITHUB_AGENT_BRIDGE_REPORT")
    _safe_print(f"repo={args.repo}")
    _safe_print(f"issue=#{args.issue}")
    _safe_print("comment_posted=YES")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Mikage GitHub Agent Bridge V0")
    subparsers = parser.add_subparsers(dest="command", required=True)

    pull = subparsers.add_parser("pull", help="Pull labeled GitHub issues into local task files")
    pull.add_argument("--repo", default=DEFAULT_REPO)
    pull.add_argument("--label", default=DEFAULT_LABEL)
    pull.add_argument("--limit", type=int, default=10)
    pull.add_argument("--out", default=DEFAULT_OUT_DIR)
    pull.set_defaults(func=cmd_pull)

    report = subparsers.add_parser("report", help="Post a local agent report back to a GitHub issue")
    report.add_argument("--repo", default=DEFAULT_REPO)
    report.add_argument("--issue", type=int, required=True)
    report.add_argument("--report-file", required=True)
    report.add_argument("--max-chars", type=int, default=12000)
    report.set_defaults(func=cmd_report)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        return int(args.func(args))
    except BridgeError as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
