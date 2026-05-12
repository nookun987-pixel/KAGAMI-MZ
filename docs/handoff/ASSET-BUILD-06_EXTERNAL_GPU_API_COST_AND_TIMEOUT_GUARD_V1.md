# ASSET-BUILD-06_EXTERNAL_GPU_API_COST_AND_TIMEOUT_GUARD_V1

## 1. Purpose

Defines cost caps, timeout limits, abort conditions, and provider guidance for the
ASSET-BUILD-07 external GPU job. No external API may be called without these guards
in place and confirmed by the operator before submission.

---

## 2. Scope

Applies to: ASSET-BUILD-07_RUN_SINGLE_BUST_BRIDGE_CANDIDATE_EXTERNAL_GPU_API
Workflow:   ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V1.md
Runs:       4 runs × batch=1 = 4 candidate images total

---

## 3. Hardware Requirements and Cost Estimates

### 3.1 Minimum Viable Hardware

| Spec | Minimum | Notes |
|---|---|---|
| VRAM | 16 GB | A4000 / 3090 / 4080 |
| Recommended | 24 GB | RTX 4090 / A100 40 GB |
| CUDA | 12.1+ | Matches PyTorch 2.5.1+cu121 |

### 3.2 Estimated Runtime Per Run (Batch=1, 25 Steps, SDXL + IPA + CN)

| GPU | Estimated time per run | Basis |
|---|---|---|
| RTX 4090 (24 GB) | ~90–150 seconds | SDXL img2img + 6× IPA + ControlNet at full precision |
| RTX 3090 (24 GB) | ~150–240 seconds | Similar; slightly slower memory bandwidth |
| A100 40 GB (SXM) | ~60–100 seconds | Higher memory bandwidth |
| A4000 (16 GB) | ~200–360 seconds | Lower bandwidth; adequate for batch=1 |

Four runs total: multiply per-run estimate × 4 plus instance startup (~3–5 min).

### 3.3 Cost Estimates by Provider

These are approximate spot/on-demand rates as of mid-2026. Verify current rates before booking.

#### RunPod

| GPU | Rate (approx.) | 4 runs + startup est. | Estimated cost |
|---|---|---|---|
| RTX 4090 (24 GB) | $0.44/hr | ~20 min | ~$0.15 |
| A100 40 GB | $1.99/hr | ~15 min | ~$0.50 |
| RTX 3090 (24 GB) | $0.22/hr | ~25 min | ~$0.09 |

#### Vast.ai

| GPU | Rate (approx.) | 4 runs + startup est. | Estimated cost |
|---|---|---|---|
| RTX 4090 | $0.35–0.55/hr | ~20 min | ~$0.12–0.18 |
| RTX 3090 | $0.18–0.30/hr | ~25 min | ~$0.08–0.13 |

**Total expected cost: under $1.00 USD for 4 candidates on any listed GPU.**

---

## 4. Cost Cap Rules

| Rule | Value |
|---|---|
| Maximum spend per ASSET-BUILD-07 run session | $5.00 USD |
| Maximum GPU instance uptime per session | 60 minutes |
| Maximum number of runs in one session | 4 (one per seed — matches packet) |
| Abort if per-run time exceeds | 15 minutes (likely OOM or stuck) |

**If the cost cap or time cap is reached before 4 runs complete:**
1. Stop the instance immediately.
2. Save any outputs already generated.
3. Create a partial-result report.
4. Do not re-provision without human authorisation.

---

## 5. Timeout Guard

| Event | Threshold | Action |
|---|---|---|
| Single run exceeds 15 min | >900 seconds | Kill job; check for OOM; do not count as valid output |
| Instance startup exceeds 10 min | >600 seconds | Retry or switch provider |
| ComfyUI unresponsive after 5 min startup wait | — | Kill instance; do not submit workflow |
| All 4 runs complete with no outputs saved | — | FAIL_BLOCKED; create report; do not re-provision without repair |

---

## 6. Abort Conditions

Stop and terminate the instance immediately if any of the following occur:

```
ABORT — OOM error (CUDA out of memory) on any run
ABORT — ComfyUI crashes or becomes unresponsive during a run
ABORT — Workflow submits but produces zero files after 15 minutes
ABORT — Any output filename contains forbidden tokens (PASS, CANON, APPROVED, etc.)
ABORT — Any output appears to be from a wrong workflow (wrong resolution, wrong subject)
ABORT — Cost cap ($5.00) reached
ABORT — Time cap (60 min total) reached
ABORT — API key or credential is at risk of exposure
```

After any ABORT:
1. Download any outputs already saved.
2. Terminate the instance.
3. Document abort reason in the run report.
4. Apply Quick-Pass Gate only to outputs that were successfully downloaded.
5. Do not re-provision for this session.

---

## 7. Provider Selection Guidance

### 7.1 RunPod (Recommended)

Pros:
- Stable API; persistent network volumes available
- ComfyUI templates available (reduce setup time)
- GPU availability generally good for 3090/4090

Setup steps:
1. Create a RunPod account and add credits (minimum $5)
2. Choose a GPU pod with 24 GB VRAM (RTX 4090 or 3090)
3. Select a ComfyUI template or PyTorch 2.1+ base image
4. Mount a network volume for model storage (avoids re-downloading on each run)
5. Upload anchor images to the pod's input folder
6. Confirm all models and custom nodes are installed (pre-job checklist)
7. Submit workflow via RunPod's ComfyUI API endpoint

### 7.2 Vast.ai (Alternative)

Pros:
- Often cheaper spot rates
- Large GPU selection

Cons:
- Less stable; spot instances may be interrupted
- More manual setup required

If using Vast.ai: prefer interruptible=false instances for this job to avoid mid-run
interruption.

### 7.3 What NOT to Use

```
DO NOT USE:
  - Free tier GPU services with shared VRAM (insufficient for SDXL + IPA)
  - Google Colab free tier (session disconnection risk; VRAM too small)
  - Any service that does not allow custom model uploads
  - Any service that does not support ComfyUI custom nodes
  - Any service that auto-publishes outputs
```

---

## 8. Model Upload Protocol

The following model files must be uploaded to the external GPU instance before job submission.
These are local files; they must not be committed to the repository.

| File | Local path | Cloud destination |
|---|---|---|
| Checkpoint | `D:\workspace\ComfyUI\models\checkpoints\juggernautXL_v8Rundiffusion.safetensors` | `/ComfyUI/models/checkpoints/` |
| IP-Adapter | `D:\workspace\ComfyUI\models\ipadapter\ip-adapter_sdxl.safetensors` | `/ComfyUI/models/ipadapter/` |
| CLIP Vision | `D:\workspace\ComfyUI\models\clip_vision\clip_vision_g.safetensors` | `/ComfyUI/models/clip_vision/` |
| ControlNet | `D:\workspace\ComfyUI\models\controlnet\diffusers_xl_canny_mid.safetensors` | `/ComfyUI/models/controlnet/` |

**Alternative:** Use a RunPod network volume with models pre-loaded to avoid upload time and cost.

---

## 9. API Key and Credential Rules

```
NEVER commit API keys or credentials to the repository.
NEVER include API keys in any handoff document.
NEVER pass API keys as plain text in comman-line arguments visible in logs.
Store credentials in environment variables or provider-native secret management only.
Scope credentials to minimum required permissions (submit job + read output).
Revoke credentials after session if single-use tokens are available.
```

---

## 10. Cost Authorisation

A human operator must explicitly authorise spend before ASSET-BUILD-07 begins.
Authorisation must confirm:

```
[ ] Maximum spend confirmed: $___ USD (recommended cap: $5.00)
[ ] GPU type confirmed: ___
[ ] Provider confirmed: ___
[ ] Session time limit confirmed: ___ minutes
[ ] Run count confirmed: 4
[ ] Output sync path confirmed: D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
```

Claude does not submit the cloud job. Claude does not authorise spend.
Human or authorised Codex agent executes ASSET-BUILD-07.
