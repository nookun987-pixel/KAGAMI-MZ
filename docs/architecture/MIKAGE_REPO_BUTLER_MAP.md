# MIKAGE REPO BUTLER V1

## 1. Role (Brain / Router / Hygiene)
- This file is the central repo brain/router/hygiene rule for `D:\KAGAMI-MZ_SYNC_PUSH_V2`.
- Brain: define the single trusted workspace and resume rules.
- Router: choose only the next smallest allowed task.
- Hygiene: block unsafe scope changes and stop on missing evidence.

## 2. Main Repo Lock
- MAIN_REPO = `D:\KAGAMI-MZ_SYNC_PUSH_V2`
- BASE_BRANCH = `main`
- All active work must run from MAIN_REPO only.

## 3. Old Repo Source-Recovery Rule
- OLD_REPO = `D:\KAGAMI-MZ` is HOLD.
- OLD_REPO may be accessed only for explicitly approved read-only source-recovery classification.
- No modify/delete/commit/push/runtime action is allowed in OLD_REPO.

## 4. Required Source-of-Truth Files
Before proposing or executing next action, agent must read:
- `AGENTS.md`
- `docs/agent_dev_task_board.md`
- `docs/architecture/MIKAGE_AUTOPILOT_GUARD_V0.md`
- `docs/architecture/MIKAGE_REPO_BUTLER_MAP.md`

## 5. Missing-Doc Read-Only Discovery Rule
- If a required doc is missing at the declared path, stop mutation tasks immediately.
- Allowed fallback is read-only discovery only (list filenames / search filename patterns in the same scope).
- Report exact missing path, discovery evidence, and blocker.
- Do not recreate missing docs from memory or chat.

## 6. No-Copy Resume Rule
- Resume strictly from current files in MAIN_REPO.
- Do not copy forward stale status from chat memory.
- Do not duplicate or regenerate governance content from another repo copy.
- If state mismatch appears, report mismatch and request one next safe action approval.

## 7. Routing Rule (One Task Only)
- Route each request into exactly one task class:
  - `READ_ONLY_VERIFICATION`
  - `READ_ONLY_PROPOSAL`
  - `ONE_FILE_GOVERNANCE_UPDATE`
  - `CONTROLLED_VERIFICATION` (no runtime unless explicitly approved)
- Propose and execute only one smallest scoped task per turn.

## 8. Stop Conditions
Stop immediately and report blocker if any condition is true:
- Repo state evidence is missing or inconclusive.
- Planned action touches files outside approved scope.
- Any `.env` or credential path appears.
- Task requires runtime, sync, push, Telegram, or GSheet without explicit approval.
- Unexpected untracked files appear during scoped task.
- Time limit or command limit is exceeded.

## 9. Closeout Reporting Contract
Every task must end with:
- `FILES_CHANGED`
- `COMMANDS_RUN`
- `EVIDENCE_SOURCE`
- `REPO_STATUS`
- `PASS_FAIL`
- `BLOCKER`
- `NEXT_SAFE_ACTION`

Do not claim PASS without visible evidence.
