# ASSET-BUILD-09E_GRAPHENE_INPAINT_APPROACH

## 1. Task Header

```
TASK_CODE:              ASSET-BUILD-09E_GRAPHENE_INPAINT_APPROACH
RESULT:                 AUTHORIZED — E-1 inpainting approach approved by human
INPUT_FOUND:            YES — best WF-C geometry render (from 09D session)
OUTPUT_CREATED:         NO — render not yet executed
FILES_CREATED:          1 repo report (this file)
FILES_MODIFIED:         00_LATEST_CODEX_HANDOFF.md
FORBIDDEN_ACTIONS_TRIGGERED: NO
LOCKED_ASSETS_MODIFIED: NO
APPROVAL_USED:          YES — human authorized E-1 escalation
ERRORS:                 NONE at task-creation stage
NEXT_SHORT_TASK:        Create inpainting mask → design inpainting workflow → render session
DATE:                   2026-05-13
```

---

## 2. Authorization Record

```
AUTHORIZED_APPROACH:    E-1 — Inpainting mask targeting panel gap/seam regions only
AUTHORIZED_BY:          Human (BOOS BỚP) — 2026-05-13
RETIRED_APPROACH:       IPAdapter graphene anchor (all 3 workflows, 23/23 renders FAIL)
ESCALATION_SOURCE:      ASSET-BUILD-09D_WORKFLOW_C_RESULTS_ESCALATION

RATIONALE:
  E-1 selected as lowest-cost, highest-precision escalation path.
  Targets only panel gap/seam areas — does not disturb white sealed faceplate.
  Forces dark graphene values directly into gap regions via inpainting prompt.
  Does not require new model or full-character re-render.
```

---

## 3. Q-5 Gate Definition (Still Active)

```
Q-5 REQUIREMENT:
  Dark graphene underlayer must be visibly present through panel seams/gaps.
  Seam depth must read as near-black carbon fiber texture.
  White sealed faceplate surface must remain intact.
  Visor: CLOSED — no interior visible.
  No skin, no face, no eye reveal.

PASS CONDITION:
  At least 1 inpainted candidate where panel gap regions show
  dark underlayer convincingly WITHOUT disturbing surrounding white panels.

FAIL CONDITION:
  Gap regions remain white/grey — no dark value breaks through.
  OR dark values bleed outside gap mask onto white panel surface.
  OR graphene texture becomes smear/artifact rather than structured underlayer.
```

---

## 4. E-1 Inpainting Specification

```
METHOD:             img2img inpainting with tight panel-gap mask

BASE IMAGE:         Best WF-C geometry render from ASSET-BUILD-09D session
                    Criteria: strongest panel seam/V-shape geometry definition
                    (exact filename to be confirmed at render session start)

MASK DESIGN:
  - Paint black only over panel line regions, gap channels, seam intersections
  - Mask must NOT cover white panel surface areas
  - Mask width: tight — follow panel line geometry, do not widen into surface

INPAINT PROMPT:
  Positive: "black graphene underlayer, dark carbon fiber texture visible through
             panel gap, deep near-black seam, structured graphene weave, depth"
  Negative: "white surface, smooth, uniform color, no texture, light grey"

RECOMMENDED PARAMETERS:
  Denoising strength: 0.65–0.80 (high enough to force dark values, low enough
                                  to preserve surrounding geometry)
  Steps: 30–40
  CFG: 7.0–8.0
  Sampler: DPM++ 2M Karras or Euler a

WORKFLOW TYPE:       ComfyUI img2img inpainting node
                    (workflow JSON to be designed before render session)
```

---

## 5. Constraints — DO NOT CROSS

```
DO NOT:
  - Open visor / reveal interior
  - Add skin or facial features
  - Let graphene texture spread onto white sealed surface panels
  - Use IPAdapter (retired — approach exhausted)
  - Run full-character re-render
  - Modify faceplate geometry
  - Unlock or modify any asset-locked elements

MASK DISCIPLINE:
  If mask bleeds: abort, tighten mask, retry.
  If gap area shows artifact smear: reduce denoising, retry.
  If white surface disturbed: abort, mask was too wide — tighten and retry.
```

---

## 6. Pre-Render Checklist

```
BEFORE STARTING 09E RENDER SESSION:
  [ ] RunPod pod re-started (or existing pod confirmed running)
  [ ] Best WF-C geometry render identified and downloaded
  [ ] Inpainting mask image created (black over gap regions, white elsewhere)
  [ ] Inpainting workflow JSON designed and validated
  [ ] Base image + mask loaded into ComfyUI inpainting node
  [ ] Prompt set per E-1 specification above
  [ ] Parameters set per recommendation above
  [ ] Q-5 gate criteria confirmed with human before first batch
```

---

## 7. Escalation Path If E-1 Fails

```
IF E-1 FAIL (dark values do not appear OR bleed past mask):

  STOP — do not iterate endlessly on inpainting parameter tuning.

  DO NOT:
    - Return to IPAdapter approach
    - Run more than 2 parameter adjustment rounds

  NEXT ESCALATION:
    E-3: Manual post-composite in Photoshop / Affinity
         Take best E-1 candidate (or best WF-C render)
         Paint dark graphene values into gap areas manually
         Multiply blend mode over gap regions
         This is ground truth fallback — highest control, no GPU cost

  E-2 (ControlNet) remains available but is medium-cost and requires new workflow.
  Decision between E-3 and E-2 to be made by human at that point.
```

---

## 8. Next Safe Task

```
TASK:           Create inpainting mask from best WF-C geometry render
                Design inpainting workflow JSON
                Run 09E render session targeting panel gap regions

BLOCKED_BY:     NONE — E-1 authorized.
                Execution requires: RunPod pod + mask image + workflow JSON

CODEX_NEXT:     ASSET-BUILD-09E render session
                (this file = authorization + spec; render session = execution step)

POD_NOTE:       Confirm pod status before starting.
                If pod was shut down after 09D: restart required.
```
