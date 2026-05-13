# ASSET-BUILD-09E_SESSION_LOG

## 1. Session Header

```
TASK_CODE:          ASSET-BUILD-09E_GRAPHENE_INPAINT_APPROACH
SESSION_TYPE:       E-1 Inpainting render session
APPROACH:           img2img inpainting — panel gap/seam mask only
AUTHORIZED:         YES — 2026-05-13
SESSION_STATUS:     NOT STARTED
DATE_STARTED:       [TO BE FILLED]
DATE_COMPLETED:     [TO BE FILLED]
```

---

## 2. Pre-Render Checklist

Fill in before starting any renders.

```
[ ] RunPod pod confirmed RUNNING (or restarted)
[ ] Best WF-C geometry render identified — filename: [TO BE FILLED]
[ ] Inpainting mask image created — filename: [TO BE FILLED]
[ ] Mask verified: black on gap regions only, white everywhere else
[ ] Base image loaded into ComfyUI inpainting node
[ ] Mask loaded into ComfyUI inpainting node
[ ] Prompt set per ASSET-BUILD-09E_WORKFLOW_SPEC.md
[ ] Parameters set for R1 (denoise 0.75, CFG 7.5, steps 35)
[ ] Q-5 evaluation criteria reviewed
[ ] Abort conditions reviewed
```

---

## 3. Base Image Record

```
SELECTED_BASE:      [filename]
SOURCE_SESSION:     ASSET-BUILD-09D — Workflow C
REASON_SELECTED:    [note — e.g. "strongest V-shape geometry, cleanest horizontal cut"]
RESOLUTION:         [width × height]
```

---

## 4. Mask Record

```
MASK_FILENAME:      [filename]
MASK_TOOL:          [e.g. Photoshop / GIMP / Krita]
MASK_NOTES:         [any observations about mask coverage]
```

---

## 5. Render Log

### Round 1 (R1) — Baseline

```
DENOISE:            0.75
CFG:                7.5
STEPS:              35
SAMPLER:            DPM++ 2M Karras
BATCH_SIZE:         4
```

| # | Filename | Seed | Q-5 Result | Observation |
|---|---|---|---|---|
| R1-01 | | | | |
| R1-02 | | | | |
| R1-03 | | | | |
| R1-04 | | | | |

**R1 SUMMARY:**
```
Q-5 PASS COUNT:     [0 / 4]
BEST CANDIDATE:     [filename or NONE]
PROCEED TO R2:      [YES / NO]
```

---

### Round 2 (R2) — Stronger forcing

*(Only if R1 produced no Q-5 PASS)*

```
DENOISE:            0.80
CFG:                8.0
STEPS:              35
SAMPLER:            DPM++ 2M Karras
BATCH_SIZE:         4
```

| # | Filename | Seed | Q-5 Result | Observation |
|---|---|---|---|---|
| R2-01 | | | | |
| R2-02 | | | | |
| R2-03 | | | | |
| R2-04 | | | | |

**R2 SUMMARY:**
```
Q-5 PASS COUNT:     [0 / 4]
BEST CANDIDATE:     [filename or NONE]
PROCEED TO R3:      [YES / NO]
```

---

### Round 3 (R3) — Softer (bleed correction)

*(Only if R1/R2 produced surface bleed — reduce if bleed observed)*

```
DENOISE:            0.70
CFG:                7.0
STEPS:              35
SAMPLER:            DPM++ 2M Karras
BATCH_SIZE:         4
```

| # | Filename | Seed | Q-5 Result | Observation |
|---|---|---|---|---|
| R3-01 | | | | |
| R3-02 | | | | |
| R3-03 | | | | |
| R3-04 | | | | |

**R3 SUMMARY:**
```
Q-5 PASS COUNT:     [0 / 4]
BEST CANDIDATE:     [filename or NONE]
```

---

## 6. Session Result

```
TOTAL_RENDERS:      [number]
TOTAL_ROUNDS:       [1 / 2 / 3]
Q-5_FINAL_STATUS:   [PASS / FAIL]
BEST_CANDIDATE:     [filename or NONE]
SESSION_OUTCOME:    [PASS — proceed to bridge / FAIL — escalate to E-3]
```

---

## 7. Post-Session Actions

### If Q-5 PASS

```
[ ] Best candidate identified and filename recorded
[ ] Candidate downloaded from RunPod before pod shutdown
[ ] Pod shut down (stop cost accumulation)
[ ] Create ASSET-BUILD-09E results report
[ ] Update 00_LATEST_CODEX_HANDOFF.md
[ ] Commit and push
[ ] Next task: bust bridge / canon gate evaluation
```

### If Q-5 FAIL (all rounds)

```
[ ] Best candidate from all rounds identified (least-fail)
[ ] All renders downloaded before pod shutdown
[ ] Pod shut down
[ ] Create ASSET-BUILD-09E fail report
[ ] Update 00_LATEST_CODEX_HANDOFF.md
[ ] Commit and push
[ ] Escalate to E-3 — manual post-composite (requires human authorization)
[ ] DO NOT return to IPAdapter. DO NOT run more render rounds.
```
