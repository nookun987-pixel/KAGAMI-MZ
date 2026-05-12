# ASSET-BUILD-09D_WORKFLOW_C_RESULTS_ESCALATION

## 1. Task Header

```
TASK_CODE:              ASSET-BUILD-09D_WORKFLOW_C_RESULTS_ESCALATION
RESULT:                 FAIL — Q-5 gate not cleared; IPAdapter approach exhausted
INPUT_FOUND:            YES
OUTPUT_CREATED:         YES — 9 Workflow C renders evaluated
FILES_CREATED:          1 repo report (this file)
FILES_MODIFIED:         00_LATEST_CODEX_HANDOFF.md
FORBIDDEN_ACTIONS_TRIGGERED: NO
LOCKED_ASSETS_MODIFIED: NO
APPROVAL_USED:          NO
ERRORS:                 Q-5 graphene underlayer — FAIL all Workflow C renders
NEXT_SHORT_TASK:        ESCALATE — design new approach; IPAdapter anchor strategy retired
DATE:                   2026-05-12
```

---

## 2. Workflow C Render Results

```
WORKFLOW:       ASSET-BUILD-09_REPAIR_CAND00002_C_VISOR_SUPPRESS_STANDBY.json
RENDER_COUNT:   9
Q-5 RESULT:     FAIL — all 9 renders

OBSERVATION:
  Panel seam geometry slightly more defined than WF-A/WF-B (cleaner V-shape and
  horizontal cut definition on several candidates). Surface remains uniformly
  white matte. No dark graphene underlayer visible through any seam or gap.
  Visor-suppress variant changed panel geometry expression but did not unlock
  underlayer color visibility.
```

---

## 3. Full Session Q-5 Gate Summary

| Workflow | Renders | Q-5 Result |
|---|---|---|
| Workflow A (safe first) | 7 | FAIL — all |
| Workflow B (stronger anchor) | 7 | FAIL — all |
| Workflow C (visor suppress) | 9 | FAIL — all |
| **TOTAL** | **23** | **FAIL — 23/23** |

---

## 4. Root Cause Analysis

```
APPROACH:       IPAdapter Advanced (SDXL) with graphene anchor reference images
FAILURE_MODE:   Base model (JuggernautXL) white surface bias overwhelms IPAdapter
                graphene signal at all tested weight configurations

SPECIFIC FAILURE:
  - Graphene anchor images carry dark/black color reference
  - IPAdapter transfers texture/style but base model surface prior dominates
  - Panel seams render as shallow geometry depressions in white surface
  - Dark underlayer color never breaks through gap areas
  - Weight escalation (WF-A → WF-B) did not change outcome
  - Visor suppress variant (WF-C) changed geometry expression, not surface color

CONCLUSION:
  IPAdapter graphene anchor approach is structurally insufficient for Q-5.
  This is not a tuning problem. The method cannot force a dark-value underlayer
  to show through panel gaps without a fundamentally different compositing strategy.
```

---

## 5. Escalation — Required New Approach

The following approaches are ordered by implementation cost and expected reliability. One must be authorized before work continues.

### Option E-1: Inpainting Mask — Panel Gap Regions Only (RECOMMENDED)
```
METHOD:         img2img inpainting with mask targeting panel gap/seam areas only
INPUTS:         Best WF-C render (strongest panel geometry) as base
                Mask: paint black over panel line/gap regions
                Prompt: "black graphene underlayer, dark carbon fiber visible through
                         gap, panel seam depth, near-black"
ADVANTAGE:      Precise control; does not disturb white panel surface areas
COST:           Low — requires mask image creation only
EXPECTED:       High — inpainting into gap regions forces dark values directly
```

### Option E-2: ControlNet Depth/Lineart + Graphene Base Layer
```
METHOD:         Generate dark graphene base render first, then use ControlNet
                lineart/canny to overlay panel structure
INPUTS:         New base prompt targeting black graphene texture
                ControlNet: lineart or canny map from best WF-C geometry render
ADVANTAGE:      Bottom-up approach; graphene is primary color, panels overlay it
COST:           Medium — requires new workflow design
EXPECTED:       Medium-High
```

### Option E-3: Post-Composite in Photoshop / Affinity
```
METHOD:         Manual: take best WF-C render, paint dark values into gap areas
                using layer blend modes (Multiply or direct paint)
COST:           Manual artist time, no GPU cost
EXPECTED:       High if done carefully; manual precision
```

---

## 6. Pod Shutdown Recommendation

```
POD_STATUS:         RUNNING (still incurring cost)
RENDER_WORK_DONE:   YES — all 3 workflows exhausted
FURTHER_RENDERS:    NOT AUTHORIZED without new approach approval
RECOMMENDATION:     SHUT DOWN POD NOW — no more IPAdapter renders justified
                    Download outputs before shutdown if needed
```

---

## 7. Next Safe Task

```
TASK:           ESCALATE — Authorize one of E-1/E-2/E-3 above
                Shut down RunPod pod to stop cost accumulation
                If E-1 authorized: create inpainting mask from best WF-C geometry render,
                design inpainting workflow, next session targets panel gap regions only

CODEX_NEXT:     ASSET-BUILD-09E_GRAPHENE_INPAINT_APPROACH
                (only after human authorizes escalation approach)

BLOCKED_BY:     Human decision required — choose escalation option E-1, E-2, or E-3
```
