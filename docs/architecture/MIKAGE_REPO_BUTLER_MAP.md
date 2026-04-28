# MIKAGE REPO BUTLER MAP

## 1. Purpose
- This file is Mikage's central repo butler map.
- It records current repo state, allowed lanes, blocked lanes, stop point, and next one task.
- It is not runtime code.
- It does not replace Autopilot Guard.

## 2. Required First Reads
Every agent must read:
- AGENTS.md
- docs/architecture/MIKAGE_AUTOPILOT_GUARD_V0.md
- docs/architecture/MIKAGE_REPO_BUTLER_MAP.md
- docs/MIKAGE_MASTER_STATUS.md
- docs/architecture/MIKAGE_AGENT_GATE_MAP_V1.md

## 3. Current Source of Truth
- Local repo: D:\KAGAMI-MZ
- GitHub remote: not trusted yet because push is not done
- Chat memory: not source of truth
- Git raw output beats agent summary

## 4. Current Stop Point
- STOP_POINT = POST_AUTOPILOT_GUARD_COMMIT
- HEAD_SHORT = c9e49c3
- REPO_CLEAN = YES
- PUSH_DONE = NO

## 5. Active / Held Lanes
- ACTIVE_SCOPE = RENT + GARA governance / approval preparation
- RENT = READY_FOR_OPERATOR_APPROVAL
- GARA = READY_FOR_OPERATOR_APPROVAL
- IMAGE = CLOSED until RENT + GARA produce real data
- CALL = HOLD
- Fanpage / Finance / Desktop UI = CLOSED unless operator explicitly reopens

## 6. Current Forbidden Actions
- No push
- No production sync
- No Telegram send
- No GSheet write
- No credential inspection
- No runtime lane execution
- No Image/CALL/Fanpage/Finance/Desktop UI
- No broad cleanup
- No multi-file refactor

## 7. Current Quarantine Note
- Some previously pending files were moved outside repo to:
  D:\MIKAGE_QUARANTINE\
- Do not restore, inspect, delete, or commit quarantine files unless operator explicitly approves.

## 8. Next One Task
- NEXT_ONE_TASK_ONLY = commit docs/architecture/MIKAGE_REPO_BUTLER_MAP.md only after review

## 9. Required State Pack
Every session must report:
- REPO_PATH
- CURRENT_STOP_POINT
- ACTIVE_LANE
- HELD_LANES
- ALLOWED_SCOPE
- FORBIDDEN_SCOPE
- STATUS_PORCELAIN_RAW
- WORKTREE_DIFF_RAW
- STAGED_DIFF_RAW
- UNTRACKED_RAW
- LAST_COMMIT_RAW
- NEXT_ONE_TASK_ONLY
- REPO_CLEAN
- SAFE_TO_PROCEED
- BLOCKER

## 10. Closeout Rule
Before any next phase:
- Verify path-specific diff
- Verify staged diff
- Verify last commit if committed
- Do not claim success without raw evidence
