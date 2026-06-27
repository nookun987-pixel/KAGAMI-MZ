# ASSET-BUILD-03_BUST_BRIDGE_CANDIDATE_GENERATION_FAIL_REPORT_V1

## 1. Status

RESULT: FAIL_DO_NOT_USE
GENERATION_ATTEMPTED: YES
CANDIDATE_ACCEPTED: NO
CANON_APPROVED: NO
ASSET_LOCKED: NO
PRODUCTION_READY: NO
PHASE5_STARTED: NO

---

## 2. Attempt Summary

| Field | Value |
|---|---|
| Date | 2026-05-12 |
| Model | juggernautXL_v8Rundiffusion.safetensors (SDXL) |
| Workflow | ComfyUI API — txt2img + IPAdapterAdvanced (chained x6) + CLIPVisionLoader |
| IP-Adapter model | ip-adapter_sdxl.safetensors |
| CLIP Vision model | clip_vision_g.safetensors |
| Sampler | dpmpp_2m / karras |
| Steps | 30 |
| CFG | 7.0 |
| Resolution | 768 × 1024 |
| Batch size | 4 |
| Output folder | `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` |

---

## 3. Failure Findings

All outputs from this attempt are designated **FAIL_DO_NOT_USE**. None may be submitted for formal evaluation, added to any stack, or used as a reference.

### 3.1 Observed Violations

| Violation | Severity |
|---|---|
| Wrong subject — Mikage bust / upper body NOT depicted | HARD FAIL |
| Green / grass environment drift in background | SPEC VIOLATION — Section 6.3 |
| No armored helmet or sealed faceplate visible | HARD FAIL |
| Blurred artifact present | HARD FAIL |
| Background non-compliant — environmental scene present | SPEC VIOLATION |
| Not compliant with bust bridge spec anchors | HARD FAIL |

### 3.2 Quick-Pass Gate Result

All 7 gate checks FAIL:

```
[ ] Faceplate completely sealed — FAIL (no helmet depicted)
[ ] Helmet silhouette consistent with MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO — FAIL
[ ] Helmet volume consistent with MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO — FAIL
[ ] Material reads as matte B4C porcelain — FAIL
[ ] Black graphene underlayer visible through at least one panel gap — FAIL
[ ] Background dark and neutral — FAIL (green/grass environment drift)
[ ] No anime / fashion / glamour drift — UNVERIFIABLE (wrong subject)
```

---

## 4. Root Cause Assessment

### 4.1 Workflow Failure Points Identified

| Issue | Root Cause |
|---|---|
| IPAdapterUnifiedLoader ClipVision model not found | `clip_vision_g.safetensors` filename does not match VIT-G preset regex pattern (`ViT.bigG.14.*39B.b160k\|ipadapter.*sdxl\|sdxl.*model`) — auto-detection failed |
| Wrong subject generated | IP-Adapter image conditioning not applied correctly; model generated from text prompt alone without effective anchor conditioning |
| Environment / grass drift | Positive prompt insufficient to suppress environment; txt2img base without anchor constraint produces scene content |
| Blurred output | Resolution / model mismatch or denoising artefact without reference image grounding |
| No Mikage-specific geometry | Anchor images not effectively conditioning the model; ComfyUI node wiring for multi-image IP-Adapter chain requires validation before re-run |

### 4.2 What Was NOT Attempted in This Repair Iteration

- ControlNet depth / pose conditioning (not yet added)
- img2img base image from an existing Mikage helmet source
- Denoise < 1.0 (ran full txt2img denoise = 1.0)
- Validated multi-anchor IP-Adapter chaining (wiring untested end-to-end before submit)

---

## 5. Disposition of Outputs

| Output location | Status |
|---|---|
| `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\` | FAIL_DO_NOT_USE — all files in this folder from this run |

**These outputs must not be:**
- Used as a reference
- Submitted for formal evaluation
- Added to any phase stack
- Labeled with any positive status
- Used as an img2img source for future runs without explicit human review

---

## 6. Next Required Action

Do NOT re-run the same workflow. A repair task is required before any new generation attempt.

**Next safe task:** `ASSET-BUILD-04_REPAIR_BUST_BRIDGE_GENERATION_WORKFLOW_NO_RENDER_V1`

This task must:
1. Audit the current workflow script (`D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE.py`) against the ASSET-BUILD-02 execution packet
2. Fix IP-Adapter anchor conditioning (verify node wiring, clip_vision loading, multi-image chain)
3. Add img2img base from a valid Mikage helmet source to anchor subject identity
4. Add ControlNet depth conditioning using the existing 3D helmet ortho sources
5. Validate the workflow JSON against ComfyUI API without running generation
6. Produce a corrected execution packet as `ASSET-BUILD-04` output

**No render permitted during ASSET-BUILD-04.**

---

## 7. Prohibited Actions Confirmed

- RENDER_EXECUTED: ATTEMPTED — OUTPUTS ARE FAIL_DO_NOT_USE
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- CANON_APPROVED: NO
- ASSET_LOCKED: NO
- PHASE5_STARTED: NO
- FILM_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- OUTPUTS_ADDED_TO_STACK: NO
