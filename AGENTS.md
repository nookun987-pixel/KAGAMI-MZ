# AGENTS — Governance Entry Guard

## Repo Entry Protocol

Before any task starts, the agent must declare:

- ACTIVE_LANE: Current lane or phase being worked on.
- RESPONSE_MODE: Required answer/work mode.
- TASK_TYPE: Type of task being performed.
- EXACT_TARGET_FILE: Exact file to modify, or `NONE` for read-only tasks.
- ALLOWED_FILES: Files allowed to be modified for this task.
- FORBIDDEN_FILES: Files or folders that must not be touched.
- TIME_LIMIT: Maximum time allowed for the task.
- COMMAND_LIMIT: Maximum number of commands allowed.
- STATUS_WRITEBACK_TARGET: Where the result/status must be written or reported.
- SUCCESS_CHECK: Exact check required before claiming PASS.

No task may proceed if any of these fields are missing.

## Stop Conditions

Stop immediately and report blocker if any condition is true:

- Dirty repo detected before task start.
- Unexpected untracked files appear during task.
- Required command output is missing or inconclusive.
- Planned action touches files outside allowed scope.
- Any `.env` or secret file is involved.
- Task requires runtime, sync, push, deploy, GSheet, Telegram, or external service actions.
- Declared time limit is exceeded.
- Declared command limit is exceeded.
- User approval is required but has not been given.
- The current workspace is not confirmed.

## Windows Command Rule

When running commands in Windows PowerShell or CMD:

- Do not chain commands with `&&`.
- Run required verification commands one by one.
- Prefer simple commands with visible stdout:
  - `git status --porcelain=v1`
  - `git branch --show-current`
  - `git log -1 --oneline`
- If command output is missing, empty when it should not be, or inconclusive, stop and report blocker.
- Do not continue into code changes when repo state cannot be verified.
- If Windsurf command output is unreliable, request external Windows CMD verification.
- Do not treat missing stdout as success.
- Do not claim repo clean unless `git status --porcelain=v1` is visibly empty from a reliable command source.

## Current Scope Lock

- Active work is `GOVERNANCE / OPERATOR_REST_MODE_V0`.
- `RENT` / `GARA` / `Image` / `Call` runtime must not run during this phase.
- Dirty original repo `D:\KAGAMI-MZ` is HOLD only.
- Clean workspace is `D:\KAGAMI-MZ_SYNC_PUSH_V2`.
- Current clean branch baseline is `main`.
- Do not touch `D:\KAGAMI-MZ` unless the task is explicitly read-only classification.

## Required Source-of-Truth Files

The agent must read these files before proposing the next action:

- `AGENTS.md`
- `docs\agent_dev_task_board.md`
- `docs\architecture\MIKAGE_AUTOPILOT_GUARD_V0.md`
- `docs\architecture\MIKAGE_REPO_BUTLER_MAP.md`

If any required file is missing, stop and report blocker.

## Operator Rule

- Once Operator Rest Mode is active, user must not be asked to manually courier long tasks.
- Agent must read current repo state and task board before proposing the next action.
- Agent must propose one next safe action only.
- Agent must not ask the user to choose between many technical options.
- Agent must not continue from chat memory alone.
- Repo files are the source of truth.

## Allowed Current Phase Actions

During `GOVERNANCE / OPERATOR_REST_MODE_V0`, allowed actions are limited to:

- Read governance files.
- Verify repo state.
- Update one explicitly declared governance file if approved.
- Report next safe action.
- Write structured status back to the requested target.

## Forbidden Current Phase Actions

During this phase, the agent must not:

- Run RENT lane.
- Run GARA lane.
- Run Image lane.
- Run Call lane.
- Run sync.
- Send Telegram messages.
- Append to GSheet.
- Inspect `.env` or credential files.
- Push to GitHub unless the user explicitly approves push for that exact task.
- Use `git add .`.
- Modify multiple files unless explicitly approved.
- Modify or delete files in `D:\KAGAMI-MZ`.

## Required Completion Report

Every task must end with this report structure:

- FILES_CHANGED =
- COMMANDS_RUN =
- REPO_STATUS =
- SUCCESS_CHECK =
- PASS_FAIL =
- BLOCKER =
- NEXT_SAFE_ACTION =
- COMMIT_DONE =
- PUSH_DONE =

The agent must not say PASS unless the success check has visible evidence.