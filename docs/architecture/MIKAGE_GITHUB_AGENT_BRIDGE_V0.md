# MIKAGE_GITHUB_AGENT_BRIDGE_V0

## Purpose

Reduce manual copy/paste between ChatGPT, GitHub, and local agents.

The bridge pulls GitHub issues labeled `mikage-task` into local task files and can post an agent report back to the source issue.

## Current Scope

This is V0. It is intentionally narrow.

It can:

- Read open GitHub issues labeled `mikage-task`.
- Write local task markdown files into `%TEMP%\mikage_agent_queue` by default.
- Post a local report file back to a GitHub issue as a comment.

It cannot yet:

- Automatically run Codex, Claude Code, Cursor, Windsurf, or another local agent.
- Automatically push code branches.
- Automatically open PRs after an agent finishes.
- Run in the background as a service.

## Safety Rules

The bridge must not:

- Inspect `.env`.
- Inspect `credentials`, `repo_credentials`, keys, or secrets.
- Run GSheet sync.
- Send Telegram messages.
- Run full runtime loops.
- Push directly to `main`.
- Merge PRs.

## Requirements

Use one of these auth paths:

1. GitHub CLI already logged in:

```bat
gh auth status
```

2. Or environment token:

```bat
set GITHUB_TOKEN=YOUR_TOKEN_HERE
```

The script never prints the token.

## Pull Tasks From GitHub

From repo root:

```bat
python tools\mikage_github_agent_bridge.py pull --repo nookun987-pixel/KAGAMI-MZ --label mikage-task --out "%TEMP%\mikage_agent_queue"
```

Or run:

```bat
tools\mikage_github_agent_bridge_pull.bat
```

Expected output:

```text
MIKAGE_GITHUB_AGENT_BRIDGE_PULL
repo=nookun987-pixel/KAGAMI-MZ
label=mikage-task
issues_found=N
WROTE issue=#123 path=...
```

## Post Agent Report Back To Issue

```bat
python tools\mikage_github_agent_bridge.py report --repo nookun987-pixel/KAGAMI-MZ --issue 123 --report-file D:\path\to\agent_report.md
```

Expected output:

```text
MIKAGE_GITHUB_AGENT_BRIDGE_REPORT
repo=nookun987-pixel/KAGAMI-MZ
issue=#123
comment_posted=YES
```

## V0 Operating Loop

1. GPT creates or updates a GitHub issue with label `mikage-task`.
2. Local bridge pulls labeled issues into `%TEMP%\mikage_agent_queue`.
3. User/agent opens the generated task file.
4. Local agent performs the task under the issue contract.
5. Agent writes a report file.
6. Bridge posts that report back to the GitHub issue.
7. GPT reviews the issue/PR in GitHub and writes the next instruction.

## Next Version

V1 should add a guarded local runner that can execute one approved agent command from the pulled task file, then capture and post the report automatically.
