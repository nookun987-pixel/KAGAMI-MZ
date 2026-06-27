# ASSET-BUILD-06_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER_REPORT

## 1. Task Status

TASK: ASSET-BUILD-06_PREPARE_EXTERNAL_GPU_API_BUST_BRIDGE_HANDOFF_NO_RENDER
RESULT: PASS
DATE: 2026-05-12

LOCAL_ROUTE_STATUS: BLOCKED_TIMEOUT
EXTERNAL_API_ROUTE_STATUS: PREPARED_NOT_EXECUTED
RENDER_EXECUTED: NO
COMFYUI_SUBMITTED: NO
EXTERNAL_API_CALLED: NO
API_KEY_COMMITTED: NO
CANON_APPROVAL_CREATED: NO
ASSET_LOCK_CREATED: NO
PHASE5_STARTED: NO

---

## 2. Decision Record — Local Route Retired

The local GTX 1660 Super route is blocked for the bust bridge workflow.

| Evidence | Detail |
|---|---|
| ASSET-BUILD-05 result | FAIL_BLOCKED_TIMEOUT — script timed out after 600s |
| GPU | NVIDIA GeForce GTX 1660 SUPER, 6 GB VRAM |
| Workflow weight | 6× IPAdapterAdvanced chained, ControlNet canny, VAEEncode img2img, RepeatLatentBatch ×4, SDXL UNet, 30 steps |
| Diagnosis | SDXL + 6× IP-Adapter chain + ControlNet + batch=4 exceeds practical runtime budget for 6 GB VRAM on this hardware |

**Decision:** Retire the local GTX 1660 Super as the primary generation route for this
workflow. Route all further bust bridge generation attempts through an external GPU API
(RunPod, Vast.ai, or equivalent) with a higher-VRAM instance.

**Do not rerun the V2 script locally.** The V2 script is also dirty (pre-submit patches
applied in ASSET-BUILD-05 that were not formally versioned). A clean workflow JSON is
defined in the execution packet instead.

---

## 3. What This Task Produced

| Document | Purpose |
|---|---|
| `ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md` | Self-contained execution packet for external GPU API — workflow JSON, prompts, anchors, settings |
| `ASSET-BUILD-06_EXTERNAL_GPU_API_COST_AND_TIMEOUT_GUARD_V1.md` | Cost caps, timeout rules, abort conditions, provider guidance |
| `ASSET-BUILD-06_EXTERNAL_GPU_API_OUTPUT_REVIEW_GATE_V1.md` | Output acceptance criteria, sync protocol, Quick-Pass Gate template for cloud outputs |
| `docs/handoff/00_LATEST_CODEX_HANDOFF.md` | Updated pointer |

---

## 4. Workflow Changes vs V2 (Dirty) Script

The external GPU packet defines a clean workflow that incorporates all ASSET-BUILD-05
patches formally and adds hardware-appropriate settings:

| Change | V2 dirty script | External GPU packet V1 |
|---|---|---|
| Base image resize | Node 40 ImageScale 768×1024 (patched in-place) | Formally specified in packet Section 4 |
| Batch | RepeatLatentBatch ×4 (patched in-place) | Batch=1 per run; 4 sequential seeds documented |
| Steps | 30 | 25 (appropriate for higher-VRAM GPU; faster without quality loss) |
| IP-Adapter anchors | 6× chained IPAdapterAdvanced | 6× chained (unchanged — valid on high-VRAM GPU) |
| ControlNet | diffusers_xl_canny_mid strength 0.55 | Unchanged |
| Denoise | 0.65 | Unchanged |
| Script SUBMIT gate | SUBMIT=True (patched) | No gate — external packet submits directly to cloud API |

---

## 5. External GPU Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| VRAM | 16 GB | 24 GB |
| GPU family | A4000 / 3090 | A100 40 GB / 4090 |
| CUDA | 12.1 | 12.1+ |
| PyTorch | 2.5.1+cu121 | same |
| ComfyUI | 0.19.0+ | same |
| Custom nodes | ComfyUI_IPAdapter_plus | same |
| Provider | RunPod / Vast.ai | RunPod (more stable API) |

---

## 6. Workflow Not Re-Validated Locally

The external GPU packet workflow cannot be validated against `localhost:8188` because
the local ComfyUI instance runs on the 6 GB GPU that is blocked. The packet is validated
by structural inspection (node types, required inputs, connection graph) documented in
the execution packet Section 7.

The external GPU instance must confirm node availability (IPAdapterAdvanced,
CLIPVisionLoader, IPAdapterModelLoader, ControlNetApplyAdvanced, ImageScale,
RepeatLatentBatch) before running. The execution packet Section 8 defines the
pre-job verification checklist.

---

## 7. What Comes Next

ASSET-BUILD-07 is the next safe task. It submits the execution packet to the external
GPU API. It is a single candidate run (batch=1, one seed). The operator or an authorised
Codex agent executes ASSET-BUILD-07.

Claude prepares the packet. Claude does not call the external API. The human or
authorised agent submits the job, syncs outputs, and triggers Claude to apply the
Quick-Pass Gate per `ASSET-BUILD-06_EXTERNAL_GPU_API_OUTPUT_REVIEW_GATE_V1.md`.

---

## 8. Prohibited Actions Confirmed

- RENDER_EXECUTED: NO
- COMFYUI_SUBMITTED: NO
- EXTERNAL_API_CALLED: NO
- API_KEY_COMMITTED: NO
- BROWSER_RUN_USED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- PHASE5_STARTED: NO
- LOCAL_SCRIPT_RERUN: NO
- MORE_THAN_ONE_NEXT_TASK: NO
