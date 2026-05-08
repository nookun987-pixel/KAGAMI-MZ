BRIDGE PURPOSE
- The real bridge is: User -> ChatGPT -> Agent PC local -> GitHub -> ChatGPT readback.
- This file defines the standard handoff rule for Mikage report-log tasks.

SOURCE OF TRUTH
- GitHub report log is the primary bridge.
- Google Doc is not used as agent input.
- Local Drive markdown sync is not trusted as the primary bridge.

STANDARD REPORT LOCATION
- All bridge reports must go under: `docs/handoff`

AGENT EXECUTION RULE
- Agent must work inside: `D:\KAGAMI-MZ_SYNC_PUSH_V2`
- Agent must declare target file before editing.
- Agent must edit only allowed file(s).
- Agent must write a clear result report.
- Agent must commit and push only approved report or rule files.

SAFETY LOCKS
- RENT_RUN: NO unless explicitly authorized
- GARA_RUN: NO unless explicitly authorized
- IMAGE_RUN: NO unless explicitly authorized
- TELEGRAM_SENT: NO unless explicitly authorized
- GSHEET_UPDATED: NO unless explicitly authorized
- SECRET_FILES_READ: NO
- FORCE_PUSH: NO

ONE-FILE COMMIT RULE
- For bridge rule or test tasks, only one target file may change.
- If more than one file changes, stop and report a scope violation.

PUSH REJECT RECOVERY
- Never force push.
- Fetch.
- Diagnose divergence.
- Rebase only if safe and explicitly within task scope.
- Otherwise stop and report.

CHATGPT READBACK RULE
- After push, report commit SHA, branch, file path, final HEAD, and final origin/main.
- ChatGPT should verify the file from GitHub before issuing the next task.

EXPECTED FINAL REPORT FORMAT
TASK_CODE:
RESULT:
CREATED_FILE:
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
