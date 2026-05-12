# ASSET-BUILD-05_BUST_BRIDGE_CANDIDATES_V2_TIMEOUT_OR_RESULT_REPORT

## 1. Task Status

TASK: ASSET-BUILD-05_GENERATE_BUST_BRIDGE_CANDIDATES_V2
RESULT: FAIL_BLOCKED_TIMEOUT
DATE: 2026-05-12

SCRIPT_SUBMITTED: YES
BROWSER_RUN_USED: NO
RENDER_RUNTIME_SECONDS: >600 (script timeout; ComfyUI job still in queue at report time)
TIMEOUT_OCCURRED: YES
OUTPUTS_CREATED: 0 (no ASSET-BUILD-05 outputs in target directory)
VALID_OUTPUTS: 0
CANDIDATES_PASSING_QUICK_GATE: 0
CANDIDATES_FAILED: 0
VALIDATION_DIRTY_BEFORE_SUBMIT: YES (see Section 3)
CANON_APPROVAL_CREATED: NO
ASSET_LOCK_CREATED: NO
PHASE5_STARTED: NO

---

## 2. Execution Summary

| Field | Value |
|---|---|
| Script | `D:\workspace\ComfyUI\MIKAGE_BUST_BRIDGE_EXECUTE_V2.py` |
| Prompt ID | `91a86ec8-4ee0-44ee-b01f-06de5a13b642` |
| Submitted via | Python script API call to `http://127.0.0.1:8188/prompt` |
| Browser Run | NO |
| Script timeout | 600 seconds (10 minutes) |
| ComfyUI job state at report time | STILL RUNNING in queue (not completed, not errored) |
| History entry at report time | NOT YET WRITTEN (job still active) |
| Outputs in target dir | ZERO ASSET-BUILD-05 outputs |

ComfyUI continued processing the job after the Python script timed out. The job was
still in `queue_running` with 0 pending when the state was checked. The GTX 1660 Super
(6 GB VRAM) is running a heavy workflow: 6× chained IPAdapterAdvanced, ControlNet canny,
img2img VAEEncode, RepeatLatentBatch ×4, 30 steps. This combination exceeded 10 minutes
on this hardware.

---

## 3. Pre-Submit Patch Applied (VALIDATION_DIRTY)

Two fixes were applied to the V2 script before submission to address pre-submit
checklist failures discovered during inspection:

| Fix | Issue found | Resolution |
|---|---|---|
| `ImageScale` node 40 (768×1024, lanczos) | Base image `MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` is 2048×2048; packet expects 768×1024 output | Added `ImageScale` between `LoadImage` and `VAEEncode`; updated `ControlNetApplyAdvanced` to use scaled image |
| `RepeatLatentBatch` node 41 (amount=4) | `VAEEncode` from single image produces batch=1; packet expects batch=4 | Added `RepeatLatentBatch` after `VAEEncode`, before `KSampler` |
| `SUBMIT = True` | Script gate was `False` for ASSET-BUILD-04 validate-only mode | Set `True` for this authorised ASSET-BUILD-05 run |

Static validation after patching: PASS (26 nodes, all types confirmed, all references resolved).

These fixes make the script dirty relative to the ASSET-BUILD-04 validated state. The
script must be formally re-versioned as V2-patched or V3 in ASSET-BUILD-06 before
any further generation attempts.

---

## 4. Output Directory State

**Target directory:** `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\`

| File | Size | Timestamp | Resolution | Status |
|---|---|---|---|---|
| `test_minimal_00001_.png` | 260 KB | 2026-05-12 08:33:13 | 512×512 | **FAILED_DO_NOT_USE** — prior wrong Browser Run |

No ASSET-BUILD-05 outputs present at report time.

The `test_minimal_00001_.png` file is the unauthorised Browser Run output registered as
registry entry D-04 in `docs/pipeline/01_CANON_ASSET_REGISTRY.md`. It is FAILED_DO_NOT_USE
and must not be reviewed as a candidate.

---

## 5. Quick-Pass Gate

Quick-Pass Gate not applied. No ASSET-BUILD-05 outputs exist to evaluate.

---

## 6. Root Cause Assessment

### 6.1 Timeout Root Cause

The workflow as submitted is too heavy for the available GPU (GTX 1660 Super, 6 GB VRAM)
to complete within 10 minutes. Identified contributors:

| Factor | Impact |
|---|---|
| 6× chained IPAdapterAdvanced nodes | Each node runs a full CLIP Vision encode + attention injection pass |
| RepeatLatentBatch ×4 | Quadruples the latent workload for all subsequent nodes |
| ControlNet canny on 768×1024 image | Additional pass per step |
| 30 steps, dpmpp_2m | Standard step count but multiplied by batch=4 |
| SDXL base model (juggernautXL_v8) | SDXL UNet is substantially larger than SD1.5; slow on 6 GB VRAM |
| img2img VAEEncode of 768×1024 | Additional encode pass |

### 6.2 Options for ASSET-BUILD-06

| Option | Description | Trade-off |
|---|---|---|
| A — Reduce batch to 1 | Remove RepeatLatentBatch; run script 4 times manually | Manageable runtime; requires 4 separate runs |
| B — Reduce steps to 20 | Lower step count; faster per-image | Slightly lower quality |
| C — Reduce IPA chain | Use 3 strongest anchors instead of 6 | Less constraint; may drift |
| D — Wait for current job | Job may still complete on GPU (ComfyUI still running it) | No action required if outputs appear |
| E — Reduce denoise | Lower denoise = fewer effective steps | Faster; may under-denoise |

**Recommended for ASSET-BUILD-06:** Option A (batch=1) + Option B (steps 20–25) as the
minimal repair. Reduces runtime to roughly 2–4 minutes per image on 1660 Super.

### 6.3 Dirty Script State

The V2 script now has three patches applied that were not part of the ASSET-BUILD-04
validated state. ASSET-BUILD-06 must clean these into a properly versioned V3 script
with full static validation before the next generation attempt.

---

## 7. What Must NOT Happen

- Do NOT rerun the current patched V2 script.
- Do NOT use the ComfyUI Browser Run button.
- Do NOT accept `test_minimal_00001_.png` as a candidate.
- Do NOT accept any output that may appear from the still-running job without first
  verifying: filename matches naming convention, resolution is 768×1024, directory is
  `11_BUST_BRIDGE_CANDIDATES_V1\`, and Quick-Pass Gate PASS.
- Do NOT start Phase 5.
- Do NOT create canon approval or asset lock.

---

## 8. If Outputs Appear From the Still-Running Job

The ComfyUI job `91a86ec8-4ee0-44ee-b01f-06de5a13b642` was still active at report time.
If it completes and produces files, before accepting any output:

1. Confirm filename prefix: `MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512`
2. Confirm resolution: 768×1024
3. Confirm directory: `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\`
4. Apply Quick-Pass Gate (7 checks from `docs/pipeline/05_REVIEW_QA_RULES.md`)
5. If all pass: create evidence package and report as ASSET-BUILD-05B task
6. If any fail: register as FAILED_DO_NOT_USE; proceed to ASSET-BUILD-06

---

## 9. Prohibited Actions Confirmed

- RENDER_EXECUTED: YES (script-submitted, not Browser Run; timed out before completion)
- BROWSER_RUN_USED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- PHASE5_STARTED: NO
- OUTPUTS_ACCEPTED_AS_CANDIDATES: NO
- WRONG_RUN_OUTPUT_USED: NO

---

## 10. Next Safe Task

ASSET-BUILD-06_REPAIR_BUST_BRIDGE_CANDIDATE_GENERATION_AFTER_V2_FAIL_NO_RERUN

ASSET-BUILD-06 must:
1. Check if the still-running job produced valid outputs (if so, evaluate before repairing)
2. Document all script patches applied in ASSET-BUILD-05 pre-submit
3. Produce a clean V3 script with: batch=1 (or configurable), steps=20–25, all patches
   formally incorporated and statically validated
4. Confirm static validation PASS before any submit
5. NOT submit during ASSET-BUILD-06 (repair-only task)

Rules for ASSET-BUILD-06:
- No render
- No ComfyUI submit
- No Browser Run
- No canon approval
- No asset lock
- No Phase 5
