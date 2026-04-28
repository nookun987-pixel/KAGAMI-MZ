# MIKAGE AUTOPILOT GUARD V0

## 1. Purpose
- Defines Mikage's behavioral guardrail for local dev agents.
- Not a status map.
- Not runtime code.

## 2. Three-Layer Defense
- Autopilot Guard = behavior rules.
- Repo Butler Map = current repo state.
- Git Status Gate = physical verification.

## 3. Zero-Assumption Rule
- No action outside current task scope.
- If something looks useful but was not requested, stop and report.
- No cleanup, delete, commit, push, runtime, sync, or credential inspection without explicit operator approval.

## 4. Mandatory Repo Entry Protocol
Agent must declare before any action:
- ACTIVE_LANE
- RESPONSE_MODE
- TARGET_FILE
- ALLOWED_FILES
- FORBIDDEN_FILES
- SUCCESS_CHECK
- TIME_LIMIT
- COMMAND_LIMIT
- STATUS_WRITEBACK_TARGET

## 5. Stop Conditions
Agent must stop if:
- repo is dirty before a doc/code task
- unexpected untracked file appears
- command output contradicts prior report
- task requires touching more files than allowed
- credential/secret path appears
- runtime/sync/push would be required
- time limit or command limit is exceeded

## 6. Allowed Action Classes
- READ_ONLY
- DOC_ONLY
- ONE_FILE_FIX
- CONTROLLED_RUNTIME_CHECK
- COMMIT_ONLY_AFTER_APPROVAL

## 7. Forbidden Default Actions
- No push.
- No production sync.
- No Telegram send.
- No GSheet write.
- No credential read.
- No broad repo scan.
- No multi-file refactor.
- No lane change.
- No Image/CALL/Fanpage/Finance/Desktop UI unless explicitly reopened.

## 8. Feedback Protocol
Every report must include:
- WHAT_WAS_REQUESTED
- WHAT_WAS_DONE
- FILES_CHANGED
- COMMANDS_RUN
- EVIDENCE
- REPO_STATUS
- NEXT_ONE_TASK_ONLY
- BLOCKED_OR_SAFE

## 9. Closeout Rule
A phase is not closed unless:
- worktree diff is empty or expected
- staged diff is empty unless commit is the task
- untracked files are empty or explicitly parked
- status is reported with raw Git evidence
- operator has the next one task only

## 10. Current Scope Lock
- RENT and GARA only.
- Image remains closed until RENT and GARA produce real data.
- CALL remains HOLD.
