# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1

## 2. LATEST_RESULT

COMPLETE — workflow repaired, static validation PASS, no generation executed

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / bust bridge generation

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/handoff/ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1.md`
- Created `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` (corrected script, SUBMIT=False)
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. WORKFLOW_V2_SUMMARY

Script: `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`
Submit gate: `SUBMIT = False` — blocked until ASSET-BUILD-05 authorised

Fixes applied vs ASSET-BUILD-03 FAIL:

| Fix | Change |
|---|---|
| clip_vision loading | Replaced `IPAdapterUnifiedLoader` with explicit `CLIPVisionLoader` + `IPAdapterModelLoader` |
| Subject anchor | Added `LoadImage` → `VAEEncode` (img2img base: HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO) |
| ControlNet | Added `ControlNetApplyAdvanced` with `diffusers_xl_canny_mid.safetensors` (strength 0.55) |
| Denoise | 1.0 → 0.65 (img2img preserves helmet geometry) |
| Negative prompt | Added grass/outdoor/blur suppressors |
| Node wiring | All connections verified by static validator |

Validation result: PASS (24 nodes, all types confirmed, all references resolved)

## 7. CURRENT_NEXT_TASK

ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2

**To execute:**
1. Set `SUBMIT = True` in `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py`
2. Run the script (ComfyUI must be running on port 8188)
3. Apply Quick-Pass Gate to all outputs (per ASSET-BUILD-02 Section 8)
4. If pass → prepare evidence package per ASSET-BUILD-02 Section 9
5. If fail → create ASSET-BUILD-06 repair task, do not re-run same workflow

**Rules for ASSET-BUILD-05:**
- No canon approval
- No asset lock
- No production-ready claim
- No Phase 5
- No film / video / short / shotlist

## 8. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET — ASSET-RESET-12 |
| Phase 4 stack manifest updated with decisions | MET — ASSET-RESET-13 (V2) |
| Bust / upper-body bridge spec exists | MET — ASSET-RESET-14 |
| Bust / upper-body bridge generation plan exists | MET — ASSET-BUILD-01 |
| Bust / upper-body bridge execution packet exists | MET — ASSET-BUILD-02 |
| Bust / upper-body bridge candidate accepted | NOT MET — ready to attempt with V2 workflow |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

5 of 7 conditions MET. V2 workflow validated and ready for ASSET-BUILD-05 generation attempt.

## 9. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

## 10. EXECUTION_SCRIPTS

| Script | Status |
|---|---|
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py` | SUPERSEDED — do not use |
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` | CURRENT — SUBMIT=False, ready for ASSET-BUILD-05 |

## 11. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 12. PROHIBITED_LANES

- IMAGE: NO
- VIDEO: NO
- RENDER: NO
- COMFYUI: NO
- BLENDER: NO
- PUBLIC_DEPLOY: NO
- CANON_APPROVAL: NO
- ASSET_LOCK: NO
- FILM: NO
- SHOTLIST: NO
- CANDIDATES_AS_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
