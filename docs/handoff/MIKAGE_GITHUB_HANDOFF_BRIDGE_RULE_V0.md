# Mikage GitHub Handoff Bridge Rule V0

## Bridge Purpose
- The real bridge is: User -> ChatGPT -> Agent PC local -> GitHub -> ChatGPT readback.
- This file defines the standard handoff rule for Mikage report-log tasks.

## Source Of Truth
- GitHub report log is the primary bridge.
- Google Doc is not used as agent input.
- Local Drive markdown sync is not trusted as the primary bridge.

## Standard Report Location
- All bridge reports must go under: `docs/handoff`

## Agent Execution Rule
- Agent must work inside: `D:\KAGAMI-MZ_SYNC_PUSH_V2`
- Agent must declare target file before editing.
- Agent must edit only allowed file(s).
- Agent must write a clear result report.
- Agent must commit and push only approved report or rule files.

## Safety Locks
- `RENT_RUN`: `NO` unless explicitly authorized
- `GARA_RUN`: `NO` unless explicitly authorized
- `IMAGE_RUN`: `NO` unless explicitly authorized
- `TELEGRAM_SENT`: `NO` unless explicitly authorized
- `GSHEET_UPDATED`: `NO` unless explicitly authorized
- `SECRET_FILES_READ`: `NO`
- `FORCE_PUSH`: `NO`

## One-File Commit Rule
- For bridge rule or test tasks, only one target file may change.
- If more than one file changes, stop and report a scope violation.

## Push Reject Recovery
- Never force push.
- Fetch.
- Diagnose divergence.
- Rebase only if safe and explicitly within task scope.
- Otherwise stop and report.

## ChatGPT Readback Rule
- After push, report commit SHA, branch, file path, final HEAD, and final origin/main.
- ChatGPT should verify the file from GitHub before issuing the next task.

## Expected Final Report Format
```text
TASK_CODE:
RESULT:
UPDATED_FILE:
CHANGED_FILES:
COMMIT_SHA:
PUSH_STATUS:
FINAL_HEAD:
FINAL_ORIGIN_MAIN:
RENT_RUN:
GARA_RUN:
IMAGE_RUN:
TELEGRAM_SENT:
GSHEET_UPDATED:
SECRET_FILES_READ:
ERRORS:
NEXT_SAFE_TASK:
```
