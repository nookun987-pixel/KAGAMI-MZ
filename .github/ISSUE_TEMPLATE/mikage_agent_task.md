---
name: Mikage Agent Task
description: Create a locked Mikage task for an agent/dev run
title: "[MIKAGE TASK] "
labels: ["mikage-task", "agent-run"]
assignees: []
---

# MIKAGE_AGENT_TASK

## USER_INTENT
<!-- Viết bằng ngôn ngữ thường. Không cần thuật ngữ kỹ thuật. -->


## TASK_TYPE
<!-- READ_ONLY_AUDIT / ONE_FILE_FIX / BOUNDED_VERIFY / PR_REVIEW / DOC_UPDATE -->


## ACTIVE_LANE
<!-- RENT / GARA / GOVERNANCE / GITHUB_AUTOMATION / OTHER -->


## TARGET
<!-- File, phase, issue, hoặc mục tiêu cần xử lý. Nếu chưa rõ, ghi CHUA_XAC_NHAN. -->


## ALLOWED_ACTIONS
- Read only unless this issue explicitly allows edits.
- Edit only files listed in ALLOWED_FILES.
- Run only bounded verification commands listed in VERIFY_COMMANDS.

## ALLOWED_FILES
- CHUA_XAC_NHAN

## FORBIDDEN_ACTIONS
- No direct push to main.
- No full runtime loop.
- No GSheet sync.
- No Telegram send.
- No .env, credentials, repo_credentials, keys, or secrets inspection.
- No output/log/cache/temp artifact commit.
- No cross-lane edits unless explicitly allowed.

## VERIFY_COMMANDS
```bash
# Add exact bounded commands here.
```

## EXPECTED_AGENT_REPORT
Agent must report exactly:
1. FILES_CHANGED
2. COMMANDS_RUN
3. PASS_FAIL
4. EVIDENCE
5. RISKS
6. REPO_STATUS
7. NEXT_SAFE_ACTION

## GPT_REVIEW_GATE
- PR must include MIKAGE_GUARD_REPORT from GitHub Actions.
- PR must not be merged until GPT/user review is written back in the PR conversation.
