# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-BUILD-03_BUST_BRIDGE_CANDIDATE_GENERATION_FAIL_REPORT_V1

## 2. LATEST_RESULT

FAIL_DO_NOT_USE — generation attempted, all outputs non-compliant, no candidate accepted

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / bust bridge generation repair

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET-BUILD-03_BUST_BRIDGE_CANDIDATE_GENERATION_FAIL_REPORT_V1.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/handoff/ASSET-BUILD-03_BUST_BRIDGE_CANDIDATE_GENERATION_FAIL_REPORT_V1.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. BLOCK_REASON

Bust bridge generation workflow produced non-compliant outputs:
- Wrong subject (no Mikage bust / upper body depicted)
- Green / grass environment drift in background
- Blurred artifact
- IP-Adapter anchor conditioning did not take effect

Root causes identified:
- `clip_vision_g.safetensors` filename does not match IPAdapterUnifiedLoader VIT-G preset regex — auto-detection silently failed
- Full txt2img (denoise 1.0) without img2img base or ControlNet depth produced unconstrained outputs
- Multi-image IPAdapterAdvanced chain wiring untested end-to-end before submit

All outputs in `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` are FAIL_DO_NOT_USE.

## 7. WHAT MUST HAPPEN BEFORE NEXT GENERATION

A workflow repair task must complete before any new ComfyUI submit:

| Repair item | Required |
|---|---|
| Fix IP-Adapter clip_vision loading (explicit CLIPVisionLoader verified) | YES |
| Fix multi-image IPAdapterAdvanced chain node wiring | YES |
| Add img2img base from valid Mikage helmet source anchor | YES |
| Add ControlNet depth conditioning from 3D helmet ortho | STRONGLY RECOMMENDED |
| Validate workflow JSON against ComfyUI API (no generation) | YES |
| Produce corrected execution packet as ASSET-BUILD-04 output | YES |

## 8. CURRENT_NEXT_TASK

ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1

**Rules for ASSET-BUILD-04:**
- NO render
- NO ComfyUI submit
- NO canon approval
- NO asset lock
- Do NOT call any output production-ready

Deliverable: corrected workflow spec / script that can be re-submitted for generation in ASSET-BUILD-05.

## 9. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET — ASSET-RESET-12 |
| Phase 4 stack manifest updated with decisions | MET — ASSET-RESET-13 (V2) |
| Bust / upper-body bridge spec exists | MET — ASSET-RESET-14 |
| Bust / upper-body bridge generation plan exists | MET — ASSET-BUILD-01 |
| Bust / upper-body bridge execution packet exists | MET — ASSET-BUILD-02 |
| Bust / upper-body bridge candidate accepted | NOT MET — generation failed |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

5 of 7 conditions MET. Blocked on compliant bust bridge candidate generation.

## 10. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

## 11. EXECUTION_PACKET

`docs/handoff/ASSET-BUILD-02_BUST_BRIDGE_LOCAL_COMFYUI_EXECUTION_PACKET_V1.md`

DO NOT re-run this packet without completing ASSET-BUILD-04 repair first.

## 12. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 13. PROHIBITED_LANES

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
