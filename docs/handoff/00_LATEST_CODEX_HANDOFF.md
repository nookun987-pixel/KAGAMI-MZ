# 00_LATEST_CODEX_HANDOFF

## 1. LATEST_COMPLETED_TASK

ASSET-BUILD-06_PREPARE_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER

## 2. LATEST_RESULT

PASS — External GPU API handoff package prepared. Local route retired (GTX 1660 Super
6 GB VRAM cannot complete SDXL + 6× IPA + ControlNet + batch=4 in budget). Four
documents produced. No render executed. No API called.

## 3. ACTIVE_LANE

MIKAGE MASTER PIPELINE / Phase 4 Component Integration / bust bridge generation

## 4. LATEST_REPORT_PATH

docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER_REPORT.md

## 5. FILES_CREATED_OR_MODIFIED

- Created `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER_REPORT.md`
- Created `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md`
- Created `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_COST_AND_TIMEOUT_GUARD_V1.md`
- Created `docs/handoff/ASSET-BUILD-06_EXTERNAL_GPU_API_OUTPUT_REVIEW_GATE_V1.md`
- Updated `docs/handoff/00_LATEST_CODEX_HANDOFF.md`

## 6. ASSET-BUILD-06_STATE

| Field | Value |
|---|---|
| Task result | PASS |
| Render executed | NO |
| ComfyUI submitted | NO |
| External API called | NO |
| API key committed | NO |
| Canon approval created | NO |
| Asset lock created | NO |
| Phase 5 started | NO |
| Local route status | BLOCKED_TIMEOUT — retired |
| External GPU route | PREPARED_NOT_EXECUTED |

## 7. EXTERNAL_GPU_PACKET_SUMMARY

The execution packet (`ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md`) defines
a clean 26-node ComfyUI workflow incorporating all ASSET-BUILD-05 pre-submit patches:

| Setting | Value |
|---|---|
| Batch | 1 per run (4 sequential runs with different seeds) |
| Steps | 25 |
| Denoise | 0.65 (img2img) |
| IP-Adapter anchors | 6× chained IPAdapterAdvanced |
| ControlNet | diffusers_xl_canny_mid, strength 0.55 |
| Resolution | 768 × 1024 |
| Model | juggernautXL_v8Rundiffusion.safetensors (SDXL) |
| Base image | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png → ImageScale 768×1024 |

Cost cap: $5.00 USD. Session time cap: 60 minutes.
Recommended provider: RunPod (RTX 4090 or 3090, 24 GB VRAM).
Estimated cost for 4 runs: under $1.00 USD.

## 8. DIRTY_SCRIPT_NOTE

`D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` remains DIRTY.
Do NOT rerun this script. ASSET-BUILD-06 produced a clean external GPU packet instead.
The V2 script is superseded by the external GPU execution packet for this workflow.

## 9. CURRENT_NEXT_TASK

ASSET-BUILD-07_RUN_SINGLE_BUST_BRIDGE_CANDIDATE_EXTERNAL_GPU_API

ASSET-BUILD-07 requires human authorisation before execution:
1. Human confirms cost authorisation (recommended cap: $5.00 USD)
2. Human confirms GPU type and provider (RunPod RTX 4090 recommended)
3. Human provisions external GPU instance with ComfyUI + required models
4. Human uploads 6 anchor images to instance input folder
5. Human submits workflow via external GPU API (4 runs × batch=1 × 4 seeds)
6. Human syncs outputs to `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\`
7. Claude applies Quick-Pass Gate per `ASSET-BUILD-06_EXTERNAL_GPU_API_OUTPUT_REVIEW_GATE_V1.md`

Claude does not submit the cloud job. Claude does not authorise spend.

Cost authorisation checklist (must be confirmed before ASSET-BUILD-07 executes):

```
[ ] Maximum spend confirmed: $___ USD (recommended cap: $5.00)
[ ] GPU type confirmed: ___
[ ] Provider confirmed: ___
[ ] Session time limit confirmed: ___ minutes
[ ] Run count confirmed: 4
[ ] Output sync path confirmed: D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
```

## 10. PHASE5_UNBLOCKING_CONDITIONS

| Condition | Status |
|---|---|
| Held candidates have documented human decisions | MET |
| Phase 4 stack manifest updated with decisions | MET |
| Bust / upper-body bridge spec exists | MET |
| Bust / upper-body bridge generation plan + execution packet | MET |
| Bust / upper-body bridge candidate accepted | NOT MET — awaiting ASSET-BUILD-07 execution |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

## 11. ACTIVE_MANIFEST

`docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`

## 12. EXECUTION_SCRIPTS

| Script | Status |
|---|---|
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py` | DEPRECATED — do not use |
| `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` | DIRTY — do not rerun; superseded by external GPU packet |

## 13. GITHUB_REVIEW_INSTRUCTION_FOR_CHATGPT

ChatGPT should read this file first whenever the user says "check GitHub", then read the latest report path listed here. The user should not need to paste task results manually.

## 14. PROHIBITED_LANES

- IMAGE: NO
- VIDEO: NO
- RENDER: NO (local route blocked; external GPU route awaiting human authorisation)
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
