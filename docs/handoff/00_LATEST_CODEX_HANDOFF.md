# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2

## 2. LATEST_RESULT

FAIL_BLOCKED_TIMEOUT — script submitted, job still running on GPU at report time, zero outputs collected

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / bust bridge generation

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET-BUILD-05_BUST_BRIDGE_CANDIDATES_V2_TIMEOUT_OR_RESULT_REPORT.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/handoff/ASSET-BUILD-05_BUST_BRIDGE_CANDIDATES_V2_TIMEOUT_OR_RESULT_REPORT.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. ASSET-BUILD-05_STATE

| Field | Value |
|---|---|
| Script submitted | YES — `MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` via API |
| Browser Run | NO |
| Prompt ID | `91a86ec8-4ee0-44ee-b01f-06de5a13b642` |
| Script timeout | 600s (10 min) |
| ComfyUI job state | STILL RUNNING at report time |
| Outputs in target dir | ZERO ASSET-BUILD-05 outputs |
| Pre-submit patches applied | YES — ImageScale 768×1024, RepeatLatentBatch ×4, SUBMIT=True |
| Script state | DIRTY — patches not formally versioned |

## 7. DIRTY_SCRIPT_NOTE

`D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` has three patches applied
during ASSET-BUILD-05 pre-submit that were not part of the ASSET-BUILD-04 validated state:
- Node 40: ImageScale 768×1024 (base image was 2048×2048)
- Node 41: RepeatLatentBatch ×4 (VAEEncode produces batch=1)
- SUBMIT = True

Do NOT rerun this script. ASSET-BUILD-06 must produce a clean V3 with these patches
formally incorporated and statically validated.

## 8. STILL-RUNNING JOB PROTOCOL

ComfyUI job `91a86ec8-4ee0-44ee-b01f-06de5a13b642` may still be processing.
If it completes and produces files, BEFORE accepting any output:

1. Confirm filename prefix: `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512`
2. Confirm resolution: 768×1024
3. Confirm directory: `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\`
4. Apply Quick-Pass Gate (7 checks, `docs/pipeline/05_REVIEW_QA_RULES.md`)
5. If all pass → create evidence package → submit as ASSET-BUILD-05B evaluation
6. If any fail → FAILED_DO_NOT_USE → proceed to ASSET-BUILD-06

## 9. CURRENT_NEXT_TASK

ASSET-BUILD-06_REPAIR_BUST_BRIDGE_CANDIDATE_GENERATION_AFTER_V2_FAIL_NO_RERUN

ASSET-BUILD-06 must (no render, no submit):
1. Check if still-running job produced valid outputs; evaluate if so
2. Formally document all ASSET-BUILD-05 pre-submit patches
3. Produce a clean V3 script: batch=1 (or configurable), steps 20–25
4. Static validation PASS before any submit authorised
5. No generation during ASSET-BUILD-06

## 10. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET |
| Phase 4 stack manifest updated with decisions | MET |
| Bust / upper-body bridge spec exists | MET |
| Bust / upper-body bridge generation plan + execution packet | MET |
| Bust / upper-body bridge candidate accepted | NOT MET — generation timed out |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

## 11. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

## 12. EXECUTION_SCRIPTS

| Script | Status |
|---|---|
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py` | DEPRECATED — do not use |
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` | DIRTY — do not rerun; patches applied in ASSET-BUILD-05 pre-submit, must be formally versioned in ASSET-BUILD-06 |

## 13. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 14. PROHIBITED_LANES

- IMAGE: NO
- VIDEO: NO
- RENDER: NO (ASSET-BUILD-05 submitted but timed out — do not rerun)
- COMFYUI_BROWSER_RUN: NO (forbidden)
- BLENDER: NO
- PUBLIC_DEPLOY: NO
- CANON_APPROVAL: NO
- ASSET_LOCK: NO
- FILM: NO
- SHOTLIST: NO
- CANDIDATES_AS_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- CINEMATIC_PRODUCTION: NO
