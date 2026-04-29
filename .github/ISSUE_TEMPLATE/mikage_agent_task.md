---
name: Mikage Agent Task
description: Create a locked, single-task work item for a local or GitHub agent.
title: "[MIKAGE TASK] <lane> - <short task>"
labels: ["mikage-task", "agent-ready"]
assignees: []
---

# Mikage Agent Task

## Task Identity

- ACTIVE_LANE: `GOVERNANCE | RENT | GARA | IMAGE | CALL | OTHER`
- TASK_TYPE: `READ_ONLY | ONE_FILE_FIX | BOUNDED_SMOKE | DOC_UPDATE | PR_REVIEW | OTHER`
- EXPECTED_BASELINE_HEAD: `<short SHA from docs/MIKAGE_MASTER_STATUS.md>`
- EXACT_TARGET_FILE: `<path or NONE>`

## Goal

```text
<one concrete outcome>
```

## Allowed Scope

- ALLOWED_FILES:
  - `<path>`
- ALLOWED_COMMANDS:
  - `git status --short --untracked-files=all`
  - `<bounded verify command>`

## Forbidden Actions

- No direct push to `main`.
- No auto-merge.
- No runtime loop unless explicitly approved.
- No GSheet sync unless explicitly approved.
- No Telegram send unless explicitly approved.
- No private config or credential inspection.
- No edits outside `EXACT_TARGET_FILE` or `ALLOWED_FILES`.
- No new files unless explicitly listed in `ALLOWED_FILES`.
- No refactor unless explicitly requested.

## Required Workflow

```text
DECLARE -> READ -> PLAN -> EDIT -> VERIFY -> REPORT
```

Agent must stop if any required field is missing or unclear.

## Verify Command

```bash
<command here>
```

## Pass Condition

- `<condition 1>`
- `<condition 2>`
- Final `git status --short --untracked-files=all` is clean or only expected files are changed.

## Report Format

```text
1. PRECHECK
2. FILES_CHANGED
3. COMMANDS_RUN
4. VERIFY_RESULT
5. PASS_FAIL
6. BLOCKER
7. NEXT_SAFE_ACTION
8. FINAL_GIT_STATUS
```

## PR / Handoff Rule

- Work on a branch named `agent/<issue-number>-<short-slug>` or `codex/<issue-number>-<short-slug>`.
- Open a PR back to `main`.
- Request review with this comment where supported:

```text
@codex review
```

- User approval is required before merge.
