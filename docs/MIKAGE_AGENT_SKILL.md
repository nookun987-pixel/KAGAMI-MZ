# MIKAGE AGENT SKILL V1

## 1. Mission
Mikage is an operator-controlled AI business system. Agents must execute narrow tasks safely, not improvise.

## 2. Required first-read files
Before any task, read:
- AGENTS.md
- docs/MIKAGE_MASTER_STATUS.md
- docs/MIKAGE_AGENT_SKILL.md

If the task touches Git, also check:
- git log -5 --oneline
- git status --short --untracked-files=all
- git diff --name-status
- git diff --cached --name-status

## 3. Current lane status
- GARA: READY_FOR_OPERATOR_APPROVAL
- RENT: READY_FOR_OPERATOR_APPROVAL
- CALL: HOLD
- Desktop UI: HOLD until Git state is stabilized
- Git tracked diff: clean as of latest verification
- Git push: HOLD / not approved yet

Known local commits:
- c66d6e9 lock gara rent ops safety gates
- 81e73b5 fix gara bonbanh showroom ingestion
- 9bb7c67 fix rent export supply demand schema

Known untracked runtime artifacts:
- _LEGACY_ARCHIVE_/control_plane/commander_bridge/state/action_previews/*

## 4. Hard Git rules
Allowed by default:
- git status
- git diff
- git log
- git show
- git ls-files

Forbidden unless explicitly requested:
- git restore
- git clean
- git reset
- git commit
- git push
- deleting files
- accepting/rejecting all Agent review changes

Commit rules:
- Only commit selected files from an explicit allowlist.
- Always verify staged files with:
  git diff --cached --name-status
- If staged files include anything outside allowlist:
  git restore --staged .
  STOP.
- Never commit runtime/temp files.

## 5. Runtime/lane rules
Never run production lane commands unless explicitly approved.

Forbidden by default:
- GARA ingest
- RENT production loop
- CALL lane
- Telegram send
- GSheet append
- live scrape/fetch
- sync/export to live targets

Dry-run is allowed only when task explicitly says dry-run.

## 6. Current protected commands
GARA pre-release gate:
- python scripts/launcher/dispatch.py gara-contract --dry-run

GARA production command, approval required:
- python scripts/launcher/dispatch.py gara-contract

RENT pre-release gate:
- python scripts/launcher/dispatch.py rent-contract --dry-run

RENT production command, approval required:
- run_rent_auto_30m.bat

## 7. File ownership safety
High-risk files:
- START.vbs
- START.bat
- run_mikage_desktop.bat
- run_all_lanes.bat
- scripts/launcher/dispatch.py
- queue/jobs.json
- .env
- repo_credentials/*
- lanes/auto/showroom/*
- lanes/auto/scout/*
- lanes/rent/*
- _LEGACY_ARCHIVE_/*

Never modify these unless explicitly included in ALLOWED FILES.

## 8. Runtime/temp files never commit
Never commit:
- queue/jobs.json
- tmp_*.txt
- *_out.txt
- *_log.txt
- _LEGACY_ARCHIVE_/control_plane/commander_bridge/state/action_previews/*
- .venv*
- node_modules
- __pycache__
- *.pyc

## 9. Required task format
Every agent task must include:
- TIME LIMIT
- ALLOWED FILES
- FORBIDDEN
- TASK
- VERIFY
- OUTPUT REQUIRED

If missing, ask for clarification or produce report-only.

## 10. Required output format
Every result must include:
1. CURRENT STATE
2. FILES CHANGED
3. COMMANDS RUN
4. REAL RESULT
5. PASS / FAIL
6. REMAINING ERROR
7. NEXT SAFE ACTION

Never say DONE unless verified.

## 11. Stop conditions
Stop immediately if:
- Git state is inconsistent.
- Task asks to broaden scope.
- More files changed than allowed.
- Live Telegram/GSheet would be touched without approval.
- A command would delete, reset, clean, or push.
- Required files are missing.
- You cannot verify result.

Use:
CHƯA XÁC NHẬN
when evidence is missing.

## 12. Current Git warning
Do not push until:
- git diff --name-status is empty
- git diff --cached --name-status is empty
- runtime/temp untracked files are not staged
- push is explicitly approved
