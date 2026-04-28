# MIKAGE GARA CURRENT FLOW MAP

## 1. Current confirmed state

- Agent Skill Docs Rollout = DONE / CLEAN
- Repo Entry Protocol = DONE / CLEAN, HEAD_SHORT = `8346108`
- GARA audit resumed
- Latest GARA evidence from master status = historical 180s timeout
- `lanes/auto/showroom/pipeline.py` timeout guard patched and committed, HEAD_SHORT = `5da5254`
- AST parse passed
- `lanes/auto/scout/chotot.py` fallback import is present
- `lanes/auto/scout/chotot.py` import-only validation = PASS
- `FetchError` present = YES
- `fetch_html` present = YES
- bounded `ingest_run` still fails with `ModuleNotFoundError: mikage_auto_scout`
- `lanes/auto/scout/runner.py` keeps legacy `mikage_auto_scout` import, but read-only diagnosis = `RELATED_TO_BOUNDED_INGEST: NO`
- `lanes/auto/showroom/launch_showroom_web.py` is not related to bounded ingest path
- workspace clean
- GSheet untouched
- Telegram not sent
- full GARA runtime not run
- push not done

## 2. Current architecture flow

Operator request
→ Repo Entry Declaration
→ `AGENTS.md`
→ selected skill docs
→ current GARA flow map
→ GARA planning/audit
→ master status evidence
→ showroom pipeline
→ source loading
→ scout/source modules
→ fetch listing page
→ fetch detail
→ filter gates
→ output/export stage
→ GSheet/Telegram only after explicit approval

## 3. Current blocker map

### BLOCKER_1 = historical 180s timeout
- STATUS = `pipeline.py` guard added, AST passed, not full-runtime proven

### BLOCKER_2 = `chotot.py` ModuleNotFoundError history
- STATUS = import-only PASS, no longer current active blocker
- EVIDENCE = `chotot.py` import-only checks passed; `FetchError`/`fetch_html` confirmed present

### BLOCKER_3 = unknown remaining `ModuleNotFoundError: mikage_auto_scout`
- STATUS = CURRENT ACTIVE BLOCKER
- EVIDENCE = bounded `ingest_run` still fails with `ModuleNotFoundError: mikage_auto_scout`
- NOTE = `runner.py` is not current bounded ingest blocker
- NOTE = `launch_showroom_web.py` is not current bounded ingest blocker

## 4. Decision rules

- Do not fix next blocker before map is current.
- Do not move from timeout blocker to import blocker without updating map.
- Do not run runtime/sync/GSheet/Telegram without explicit approval.
- One phase = one file.
- If Source Control has pending files, stop and report pending files only.
- If task changes lane or blocker, stop and request operator decision.

## 5. Next safe action after map closeout

- Do not patch any file yet.
- Next diagnostic after map commit/closeout:
  run bounded `ingest_run` with full traceback capture, no GSheet, no Telegram, no sync.
- Use traceback evidence to identify exact failing file before any patch.
