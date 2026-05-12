# ASSET-BUILD-06C_AMEND_EXECUTION_PACKET_WITH_REPAIRED_ANCHORS_NO_RENDER_REPORT

## 1. Task Header

```
TASK_ID:           ASSET-BUILD-06C_AMEND_EXECUTION_PACKET_WITH_REPAIRED_ANCHORS_NO_RENDER
RESULT:            PASS
DATE:              2026-05-12
RENDER_EXECUTED:   NO
COMFYUI_SUBMITTED: NO
EXTERNAL_API_CALLED: NO
API_KEY_COMMITTED: NO
CANON_APPROVAL:    NO
ASSET_LOCK:        NO
GPU_SPEND_AUTHORISED: NO
```

---

## 2. What This Task Did

Produced `ASSET-BUILD-06_EXTERNAL_GPU_API_EXECUTION_PACKET_V2.md` — a corrected
execution packet incorporating the findings from ASSET-BUILD-06B source image audit.

Two deficient primary anchors from V1 were repaired:

| Issue | V1 | V2 fix |
|---|---|---|
| Anchor 1 (img2img base + IPA 0.8) was near-zero contrast dark 3D blockout | MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png | MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png |
| Anchor 2 (IPA 0.6 side) was top-down camera angle, not a side profile | MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png | DROPPED — no acceptable side ortho exists |

All other content unchanged: positive/negative prompts, sampler settings, output spec,
cost cap, naming convention, review gate.

---

## 3. Node Changes

| Node | V1 | V2 |
|---|---|---|
| Node 4 (img2img base) | dark ortho | MIKAGE_COMP_01A faceplate |
| Node 10 (IPA anchor 0) | dark ortho, weight 0.8 | MIKAGE_COMP_01A faceplate, weight 0.8 |
| Node 11 (IPA anchor 1) | side ortho, weight 0.6 | DROPPED |
| Node 21 (IPAdapterAdvanced side) | model from [20,0] | DROPPED |
| Node 22 (IPAdapterAdvanced faceplate) | model: [21,0] | model: [20,0] |
| Node 40 (ImageScale comment) | "2048×2048 → 768×1024" | "input → 768×1024" |

Total node count: 26 → 24.

---

## 4. Upload Count Change

V1 required 6 file uploads to external instance.
V2 requires **4 file uploads**:

```
1. MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
2. MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png
3. MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png
4. MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png
```

Do NOT upload the two retired V1 anchors.

---

## 5. ASSET-BUILD-07 Gate Status

ASSET-BUILD-07 (external GPU submission) may now be opened for human cost authorisation.
The execution packet is repaired and ready.

Human cost authorisation checklist (from `00_LATEST_CODEX_HANDOFF.md`):

```
[ ] Maximum spend confirmed: $___ USD (recommended cap: $5.00)
[ ] GPU type confirmed: ___
[ ] Provider confirmed: ___
[ ] Session time limit confirmed: ___ minutes
[ ] Run count confirmed: 4
[ ] Output sync path confirmed: D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
[ ] Execution packet confirmed: V2 (not V1)
```

---

## 6. Prohibited Actions Confirmed

```
RENDER_EXECUTED:         NO
COMFYUI_SUBMITTED:       NO
EXTERNAL_API_CALLED:     NO
API_KEY_COMMITTED:       NO
GPU_SPEND_AUTHORISED:    NO
CANON_APPROVAL_CREATED:  NO
ASSET_LOCK_CREATED:      NO
PHASE5_STARTED:          NO
FILM_TASK_CREATED:       NO
MORE_THAN_ONE_NEXT_TASK: NO
```

---

## 7. Next Safe Task

```
ASSET-BUILD-07_RUN_SINGLE_BUST_BRIDGE_CANDIDATE_EXTERNAL_GPU_API
```

Gate: Human cost authorisation required first (see Section 5 checklist).
Use execution packet V2, not V1.
