# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-CANON-00_CREATE_MIKAGE_CANON_ASSET_PIPELINE_FROM_MARKET_REFERENCES_NO_RENDER_V1

## 2. LATEST_RESULT

PASS — pipeline framework created, wrong Browser Run handled, no render executed

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / bust bridge generation

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET_CANON_00_CREATE_MIKAGE_CANON_ASSET_PIPELINE_REPORT.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/pipeline/00_MIKAGE_PIPELINE_OVERVIEW.md`
- Created `docs/pipeline/01_CANON_ASSET_REGISTRY.md`
- Created `docs/pipeline/02_ASSET_LIFECYCLE_RULES.md`
- Created `docs/pipeline/03_ASSET_BUILD_ORDER.md`
- Created `docs/pipeline/04_EXECUTION_GATE_RULES.md`
- Created `docs/pipeline/05_REVIEW_QA_RULES.md`
- Created `docs/pipeline/06_CLOUD_GPU_PACKET_STANDARD.md`
- Created `docs/pipeline/07_STORYBOARD_ANIMATIC_RULES.md`
- Created `docs/pipeline/08_CINEMATIC_PRODUCTION_READINESS.md`
- Created `docs/handoff/ASSET_CANON_00_CREATE_MIKAGE_CANON_ASSET_PIPELINE_REPORT.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. WRONG_RUN_HANDLED

Browser Run output `test_minimal_00001_` (512×512, 2026-05-12) formally registered as
FAILED_DO_NOT_USE. Mismatches on: filename prefix, resolution, output directory, script
source. Documented in `docs/pipeline/01_CANON_ASSET_REGISTRY.md` entry D-04 and
`docs/pipeline/04_EXECUTION_GATE_RULES.md` Section 2.1.

## 7. PIPELINE_FRAMEWORK_SUMMARY

| Document | Purpose |
|---|---|
| `docs/pipeline/00_MIKAGE_PIPELINE_OVERVIEW.md` | Framework + market reference adaptations (Blender Studio, Kitsu, AYON, Storyboarder, OpenUSD) |
| `docs/pipeline/01_CANON_ASSET_REGISTRY.md` | All assets: status, path, evidence, allowed/forbidden use |
| `docs/pipeline/02_ASSET_LIFECYCLE_RULES.md` | Status definitions, transitions, wrong-run protocol |
| `docs/pipeline/03_ASSET_BUILD_ORDER.md` | Ordered build sequence, dependency graph |
| `docs/pipeline/04_EXECUTION_GATE_RULES.md` | Browser Run prohibition, pre-submit checklist, retry rules |
| `docs/pipeline/05_REVIEW_QA_RULES.md` | Quick-Pass Gate, formal evaluation, evidence package |
| `docs/pipeline/06_CLOUD_GPU_PACKET_STANDARD.md` | Cloud GPU packet format (parked, NOT ACTIVE) |
| `docs/pipeline/07_STORYBOARD_ANIMATIC_RULES.md` | Storyboard / animatic gates before cinematic |
| `docs/pipeline/08_CINEMATIC_PRODUCTION_READINESS.md` | 7 gates required before cinematic production |

## 8. CURRENT_NEXT_TASK

ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2

**To execute:**
1. Set `SUBMIT = True` in `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`
2. Confirm ComfyUI running on port 8188
3. Run the script — script-submitted only, NOT via Browser Run
4. Apply Quick-Pass Gate per `docs/pipeline/05_REVIEW_QA_RULES.md`
5. If pass → prepare evidence package → formal evaluation
6. If fail → ASSET-BUILD-06 repair task, do not re-run same script

**Rules:**
- No canon approval / no asset lock / no production-ready claim
- No Phase 5 / no film / no video / no shotlist
- Browser Run is forbidden — script-submitted only

## 9. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET |
| Phase 4 stack manifest updated with decisions | MET |
| Bust / upper-body bridge spec exists | MET |
| Bust / upper-body bridge generation plan + execution packet | MET |
| Bust / upper-body bridge candidate accepted | NOT MET — ASSET-BUILD-05 pending |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

## 10. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

## 11. EXECUTION_SCRIPTS

| Script | Status |
|---|---|
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py` | DEPRECATED — do not use |
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` | CURRENT — SUBMIT=False, set True for ASSET-BUILD-05 |

## 12. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 13. PROHIBITED_LANES

- IMAGE: NO
- VIDEO: NO
- RENDER: NO
- COMFYUI_BROWSER_RUN: NO (forbidden for all production routes)
- BLENDER: NO
- PUBLIC_DEPLOY: NO
- CANON_APPROVAL: NO
- ASSET_LOCK: NO
- FILM: NO
- SHOTLIST: NO
- CANDIDATES_AS_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- CINEMATIC_PRODUCTION: NO (0 of 7 gates met)
