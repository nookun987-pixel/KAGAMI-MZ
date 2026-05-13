# ASSET-BUILD-09E_WORKFLOW_SPEC

## 1. Spec Header

```
TASK_CODE:          ASSET-BUILD-09E_GRAPHENE_INPAINT_APPROACH
SPEC_TYPE:          ComfyUI Inpainting Workflow Parameter Spec
APPROACH:           E-1 — img2img inpainting, panel gap/seam mask only
AUTHORIZED:         YES — 2026-05-13
STATUS:             READY FOR EXECUTION
DATE:               2026-05-13
```

---

## 2. Input Files Required

```
FILE_1 — BASE IMAGE:
  Source:     Best WF-C geometry render from ASSET-BUILD-09D session
  Criteria:   Strongest panel seam/V-shape geometry definition
              Cleanest horizontal cut line
              White surface intact — no artifacts
  Format:     PNG, original render resolution
  Note:       Do NOT use any WF-A or WF-B render as base — WF-C showed
              superior panel geometry across the session

FILE_2 — INPAINTING MASK:
  Source:     Manually created from base image
  Format:     PNG, same resolution as base image, grayscale or RGB
  Mask rules:
    - BLACK  = inpaint this area (panel gaps, seam channels, intersection points)
    - WHITE  = preserve this area (white panel surfaces, faceplate, visor, background)
  Mask width: TIGHT — trace panel line geometry precisely
              Do NOT widen mask into white panel surface areas
              If uncertain about boundary, go narrower and iterate
  Key areas to mask BLACK:
    - Vertical panel gap lines on chest armor
    - Horizontal seam cut lines
    - V-shape apex intersection
    - Any visible gap channel between panel elements
```

---

## 3. ComfyUI Node Configuration

```
NODE:           KSampler (img2img inpainting mode)
WORKFLOW TYPE:  Load Image → Load Mask → VAE Encode (inpaint) → KSampler → VAE Decode → Save

CHECKPOINT:     JuggernautXL (same base model as 09D session)
                Do NOT switch to a different checkpoint — Q-5 must be passed
                with the same model that will be used for final asset production

VAE:            Default / matched to checkpoint

CLIP:           Default SDXL dual encoder
```

---

## 4. Prompt Specification

### Positive Prompt
```
black graphene underlayer, dark carbon fiber texture visible through panel gap,
deep near-black seam interior, structured graphene weave pattern, matte dark surface,
panel gap depth, shadow inside seam, dark underlayer
```

### Negative Prompt
```
white surface, smooth, uniform color, no texture, light grey, bright, 
cream, glossy, plastic, uniform fill, closed gap
```

---

## 5. Sampling Parameters

```
PARAMETER           RECOMMENDED         NOTES
-----------         -----------         -----
Denoising strength  0.70 – 0.80         Start at 0.75
                                        Increase if dark values won't appear
                                        Decrease if white surface disturbs
Steps               35                  Range: 30–40
CFG Scale           7.5                 Range: 7.0–8.0
Sampler             DPM++ 2M Karras     Euler a acceptable as alternative
Scheduler           Karras
Seed                -1 (random)         Lock seed on any strong candidate
Batch size          4                   Evaluate 4 per parameter set
```

---

## 6. Parameter Sweep Sequence

Run in this order. Stop at first batch that produces a Q-5 PASS candidate.

```
ROUND   DENOISE     CFG     NOTES
-----   -------     ---     -----
R1      0.75        7.5     Baseline — expected best balance
R2      0.80        8.0     Stronger forcing if R1 gap still white
R3      0.70        7.0     Softer if R1/R2 causes surface bleed
STOP    --          --      Do not exceed 3 parameter rounds (max 2 adj rounds)
```

---

## 7. Q-5 Evaluation Criteria

Evaluate each candidate immediately after batch completes.

```
Q-5 PASS:
  [ ] Dark (near-black or dark grey) values visible in panel gap/seam areas
  [ ] Graphene texture or structured dark pattern present in gap
  [ ] White sealed faceplate surface UNCHANGED outside mask area
  [ ] Visor CLOSED — no interior visible
  [ ] No skin, face, eyes, hair visible
  [ ] Dark values do NOT bleed outside panel gap mask boundary
  [ ] No smearing artifact in gap region

Q-5 FAIL:
  [ ] Gap area remains white/light grey — no dark breakthrough
  [ ] Dark values bleed onto white panel surface
  [ ] Graphene becomes artifact smear (not structured)
  [ ] Any face/skin/eye visible
  [ ] Visor opened by inpainting
```

---

## 8. Candidate Logging

For each batch, log in `ASSET-BUILD-09E_SESSION_LOG.md`:

```
BATCH:          [R1 / R2 / R3]
FILENAME:       [filename of candidate]
DENOISE:        [value used]
CFG:            [value used]
SEED:           [seed if locked]
Q-5 RESULT:     [PASS / FAIL]
OBSERVATION:    [brief — what happened in gap area]
```

---

## 9. Abort Conditions

```
ABORT AND STOP if:
  - Visor opens in any candidate → Stop batch immediately
  - Skin/face visible in any candidate → Stop batch immediately
  - White surface grossly disturbed (not a minor seam line) → Tighten mask, retry once

DO NOT:
  - Run more than 3 parameter rounds total
  - Return to IPAdapter approach
  - Switch base model mid-session
  - Generate new full-character renders outside mask
```

---

## 10. If Session Fails All Rounds

```
IF R1 + R2 + R3 all produce Q-5 FAIL:

  STOP render session.
  Log all rounds in ASSET-BUILD-09E_SESSION_LOG.md.
  Create session fail report.
  Update 00_LATEST_CODEX_HANDOFF.md.

  NEXT ESCALATION:
    E-3 — Manual post-composite in Photoshop / Affinity
    Take best candidate from E-1 session (least-fail)
    Apply dark graphene values manually into gap areas
    Use Multiply blend mode or direct paint into gap channel
    This is the ground-truth fallback — highest control, no GPU cost

  DO NOT proceed to E-2 without new human authorization.
```
