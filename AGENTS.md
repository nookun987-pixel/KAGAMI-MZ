# AGENTS — Governance Entry Guard

## Repo Entry Protocol
- ACTIVE_LANE: GOVERNANCE / OPERATOR_REST_MODE_V0
- RESPONSE_MODE: REPO_GUARD_MODE
- TASK_TYPE: ONE_TASK_ONE_SCOPE
- EXACT_TARGET_FILE: Must be declared per task before execution.
- ALLOWED_FILES: Must be declared per task; modify only listed paths.
- FORBIDDEN_FILES: Any path outside declared allowed scope.
- TIME_LIMIT: Must be declared per task.
- COMMAND_LIMIT: Must be declared per task.
- STATUS_WRITEBACK_TARGET: Structured completion block in assistant response.
- SUCCESS_CHECK: Verify command outputs and scope constraints before PASS.

## Stop Conditions
Stop immediately and report blocker if any condition is true:
- Dirty repo detected before task start.
- Unexpected untracked files appear during task.
- Required command output is missing or inconclusive.
- Planned action touches files outside allowed scope.
- Any `.env` or secret file is involved.
- Task requires runtime, sync, or push operations.
- Declared time limit is exceeded.

## Current Scope Lock
- Active work is `GOVERNANCE / OPERATOR_REST_MODE_V0`.
- `RENT` / `GARA` / `Image` / `Call` runtime must not run during this phase.
- Dirty original repo `D:\KAGAMI-MZ` is HOLD only.
- Clean workspace is `D:\KAGAMI-MZ_SYNC_PUSH_V2`.

## Required Source-of-Truth Files
- `docs\architecture\MIKAGE_AUTOPILOT_GUARD_V0.md`
- `docs\architecture\MIKAGE_REPO_BUTLER_MAP.md`
- `docs\agent_dev_task_board.md` (required once created)

## Operator Rule
- Once Operator Rest Mode is active, user must not be asked to manually courier long tasks.
- Agent must read current repo state and task board before proposing the next action.
