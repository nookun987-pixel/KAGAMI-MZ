# 06_CLOUD_GPU_PACKET_STANDARD

## 1. Purpose

Defines the format standard for cloud GPU execution packets. A cloud GPU packet is a
self-contained document that allows a remote GPU service (RunPod, Vast.ai, AWS, etc.)
to execute a Mikage generation job without requiring interactive operator intervention.

**Cloud GPU execution is NOT ACTIVE in the current pipeline phase.**
This document parks the standard for future use. No cloud GPU job may be submitted
based on the current local scripts alone.

---

## 2. When Cloud GPU Is Permitted

Cloud GPU execution requires ALL of the following:

1. A cloud GPU execution packet document exists (this standard defines its format)
2. The packet has been validated locally against ComfyUI object_info (same as local validate-only mode)
3. The output storage path is a named, accessible cloud or network location
4. Credentials / API key scope is documented and limited to the job scope
5. A human has explicitly authorised the cloud job submission
6. The cloud packet is version-matched to the local execution packet (same workflow version)

---

## 3. Cloud Packet Document Format

A cloud GPU packet document must contain all of the following sections:

### Section 1 — Packet Header

```
PACKET_TYPE: CLOUD_GPU_EXECUTION_PACKET
PACKET_VERSION: [e.g., V1]
LOCAL_PACKET_REF: [path to matching local execution packet]
DATE: [YYYY-MM-DD]
AUTHORISED_BY: [human name or role]
STATUS: APPROVED_FOR_CLOUD / DRAFT / DEPRECATED
CLOUD_PROVIDER: [RunPod / Vast.ai / AWS / GCP / Azure / other]
```

### Section 2 — Output Storage

```
CLOUD_OUTPUT_BUCKET: [bucket name or volume path]
CLOUD_OUTPUT_PREFIX: [same naming convention as local packet Section 2]
LOCAL_SYNC_PATH: [where cloud outputs will be synced locally after job]
FILENAME_CONVENTION: MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_CANDIDATE_[DATE].png
```

### Section 3 — Environment Requirements

```
GPU_TYPE: [minimum required, e.g., NVIDIA A100 40GB / RTX 4090 24GB]
VRAM_MINIMUM_GB: [number]
PYTORCH_VERSION: [e.g., 2.5.1+cu121]
COMFYUI_VERSION: [e.g., 0.19.0]
PYTHON_VERSION: [e.g., 3.10.x]
CUSTOM_NODES_REQUIRED:
  - ComfyUI_IPAdapter_plus [version or commit hash]
  - [other required custom nodes]
```

### Section 4 — Model Paths (Cloud)

```
CHECKPOINT: [cloud path or model hub ID]
IPADAPTER_MODEL: [cloud path or model hub ID]
CLIP_VISION: [cloud path or model hub ID]
CONTROLNET: [cloud path or model hub ID]
```

### Section 5 — Anchor Images (Cloud)

All 6 anchor images must be staged in cloud storage before job submission.
For each anchor:
```
ANCHOR_01:
  LOCAL_PATH: [absolute local path]
  CLOUD_PATH: [cloud storage path]
  VERIFIED_UPLOAD: YES / NO
  WEIGHT: [number]
  PRIORITY: PRIMARY / SECONDARY / TERTIARY
```

### Section 6 — Workflow JSON

The complete workflow JSON (as produced by the local script `build_workflow()` function)
must be embedded or referenced in the cloud packet. This ensures the cloud job uses
the exact same node graph as the locally validated workflow.

```
WORKFLOW_JSON_PATH: [path to saved workflow JSON in repo or cloud storage]
WORKFLOW_HASH: [SHA-256 of workflow JSON for integrity verification]
```

### Section 7 — Generation Parameters

```
SEED_RANGE: [range or specific seeds]
STEPS: 30
CFG: 7.0
SAMPLER: dpmpp_2m
SCHEDULER: karras
DENOISE: 0.65
RESOLUTION: 768x1024
BATCH_SIZE: 4
```

### Section 8 — Pre-Job Verification

Before the cloud job is submitted, confirm:
```
[ ] Cloud output bucket accessible and writable
[ ] All anchor images uploaded and hash-verified
[ ] Model files present at cloud paths
[ ] Workflow JSON hash matches local validated copy
[ ] ComfyUI version on cloud instance matches requirement
[ ] All custom nodes installed and confirmed on cloud instance
[ ] Credential scope limited to this job only
```

### Section 9 — Post-Job Protocol

After the cloud job completes:
```
[ ] Sync cloud outputs to local path
[ ] Verify file count matches batch size
[ ] Verify filenames match naming convention
[ ] Apply Quick-Pass Gate to all outputs
[ ] Record results in run log
[ ] If FAIL: create fail report, do not re-submit without repair
```

### Section 10 — Forbidden Actions (Cloud)

- Do not use cloud GPU Browser UI for production runs
- Do not modify workflow JSON after validation without re-validating
- Do not store outputs only in cloud — must sync to local pipeline path
- Do not accept cloud outputs without applying local Quick-Pass Gate
- Do not submit cloud job for a slot that has not completed local validation

---

## 4. Cloud Packet Versioning

Cloud packets follow the same versioning rules as local execution packets.
If the local workflow is repaired (V2 → V3), a new cloud packet must be created
to match. The old cloud packet is DEPRECATED.

---

## 5. Cost Control Rules

- Maximum batch size for a cloud GPU job: defined per packet (default 4 per run, max 3 runs before human review)
- Cloud job must be terminated if all outputs in a batch fail Quick-Pass Gate
- No open-ended cloud GPU job (run until told to stop) — all jobs have a defined batch scope

---

## 6. Current Status

CLOUD_GPU_EXECUTION: NOT ACTIVE
REASON: Pipeline is in Phase 4 local generation. Cloud GPU is not required until
local workflows are proven and Phase 5 or later requires scale.
PARKED_UNTIL: Human decision after Phase 4 bust bridge slot is filled and accepted.
