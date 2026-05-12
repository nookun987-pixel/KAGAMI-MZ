# ASSET-BUILD-02_BUST_BRIDGE_LOCAL_COMFYUI_EXECUTION_PACKET_V1

## ── PACKET STATUS ──────────────────────────────────────────────

PACKET_TYPE: LOCAL EXECUTION PACKET — NO RENDER BY CLAUDE
RENDER_ALLOWED: NO (by Claude)
PHASE5_ALLOWED: NO
TRUE_CURRENT_PHASE: Phase 4 - Component Integration
CANON_APPROVED: NO
ASSET_LOCKED: NO
PRODUCTION_READY: NO

This document is a ready-to-use local execution packet. Open it, read top to bottom, do exactly what it says. All prompts and paths are finalized. No further interpretation is required. Claude produced this packet. Claude does not execute it.

---

## 0. SOURCE DOCUMENTS (Read these if context is needed)

| Document | Purpose |
|---|---|
| `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` | Full specification — authoritative constraint source |
| `docs/handoff/ASSET-BUILD-01_CREATE_BUST_UPPER_BODY_BRIDGE_CANDIDATE_RENDER_PLAN_V1.md` | Full render plan — workflow rationale and failure modes |
| `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md` | Active Phase 4 stack — what is currently included/held/rejected |
| `docs/handoff/MIKAGE_PHASE4_HELD_CANDIDATE_DECISION_RECORD_V1.md` | Human decisions on 05B / 06C / 08B |

For quick execution: this packet contains everything needed. Only read source documents if a judgment call is required.

---

## 1. OUTPUT FOLDER

```
D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
```

Create this folder if it does not exist. Do not save outputs anywhere else.

---

## 2. CANDIDATE NAMING CONVENTION

```
MIKAGE_BUST_BRIDGE_CAND_[XX]_[STATUS]_[DATE].png
```

| Token | Values |
|---|---|
| `[XX]` | Two-digit sequence: 01, 02, 03 … |
| `[STATUS]` | `REVIEW_CANDIDATE` · `HOLD_REWORK` · `DISCARD` |
| `[DATE]` | YYYYMMDD (e.g. 20260512) |

**Forbidden tokens in filename:** `PASS` · `CANON` · `LOCKED` · `APPROVED` · `PRODUCTION` · `FINAL`

**Example:**
```
MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512.png
```

---

## 3. REQUIRED ANCHOR REFERENCES

Load these six images as conditioning inputs. Paths are absolute and ready to paste.

### PRIMARY — Helmet Geometry (load first, highest weight)

```
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png
```
Role: Helmet faceplate geometry — front silhouette constraint
IP-Adapter weight: **0.7 – 0.9**

```
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png
```
Role: Helmet volume and depth — side silhouette constraint
IP-Adapter weight: **0.5 – 0.7**

### SECONDARY — Material and Faceplate (load second)

```
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png
```
Role: Faceplate cleanness standard
IP-Adapter weight: **0.5 – 0.7**

```
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png
```
Role: Primary armor material — matte B4C porcelain
IP-Adapter weight: **0.4 – 0.6**

```
D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png
```
Role: Black graphene underlayer visible through panel gaps
IP-Adapter weight: **0.3 – 0.5**

### TERTIARY — Style Check (load last, lowest weight)

```
D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png
```
Role: Overall identity and aesthetic coherence check
IP-Adapter weight: **0.2 – 0.4**
⚠ Do not use as primary conditioning — style check only.

### EXCLUDED — DO NOT LOAD THESE

```
❌  ...\08_HELMET_BUST_ALT\MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png
❌  Full-body candidate 001 (any variant)
❌  Controlled front canon repair V1
❌  Corrected full-body front candidate V2
❌  Brutalist void / consequence chamber V3
❌  Any video test or loop test frame
❌  Any archived film source pack frame
```

---

## 4. POSITIVE PROMPT

Copy this prompt exactly. Do not omit any line.

```
faceless armored helmet, sealed faceplate, no visor opening, no eyes, no nose, no mouth,
matte B4C porcelain armor plating, black graphene underlayer visible through panel gaps,
bust portrait, upper body crop, armored shoulders, structural neck collar,
helmet-to-shoulder armor plate continuity, panel gap seams,
matte armor surface, restrained surface detail, controlled panel geometry,
dark underlayer through gaps, no gloss, no chrome, no reflections,
neutral front-facing pose, slight three-quarter angle acceptable,
dark neutral background, near-black background, flat diffuse lighting,
consistency review framing, no scene, no environment, no action staging
```

---

## 5. NEGATIVE PROMPT

Copy this prompt exactly. Do not omit any line.

```
eyes, nose, mouth, lips, teeth, tongue, face, skin, face reveal,
open visor, cracked faceplate, visor glow, eye glow, eye slit, expressive helmet,
anime, manga, cartoon, stylized face, bishonen, bishojo, moe, chibi,
fashion portrait, glamour shot, beauty lighting, softcore, pinup,
feminine drift, masculine drift, gender coded, ornamental armor, decorative engraving,
glossy armor, chrome armor, metallic sheen, reflective surface, shiny plating,
transparent armor, holographic, energy emitting, glowing panels, neon,
full body, lower body, waist, hips, legs, feet,
action pose, combat stance, weapon brandishing, dynamic angle,
cinematic shot, film plate, environmental background, scene staging,
dramatic lighting, rim light, spotlight, god rays, vignette, lens flare,
production ready, canon approved, final, locked, official, complete
```

---

## 6. GENERATION SETTINGS PLACEHOLDER

Fill in these fields before running. Settings depend on local model and hardware.

```
Model:            ___________________________________
Sampler:          ___________________________________
Scheduler:        ___________________________________
Steps:            _____ (recommended: 25–40)
CFG scale:        _____ (recommended: 6–8)
Denoise strength: _____ (for img2img; recommended: 0.55–0.75)
Resolution:       _____ x _____ (portrait; recommend 768x1024 or 832x1152)
Batch size:       _____ (recommended: 4–8 per iteration)
Seed (first run): _____ (record all seeds for selected outputs)
Workflow file:    ___________________________________
ControlNet model: ___________________________________
ControlNet type:  depth / pose (circle one)
```

---

## 7. PRE-RUN CHECKLIST

Check every item before clicking Generate.

```
[ ] All 6 anchor images are loaded in correct priority order
[ ] No excluded asset is loaded in any node
[ ] Output folder exists: D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
[ ] Positive prompt pasted from Section 4 — no lines omitted
[ ] Negative prompt pasted from Section 5 — no lines omitted
[ ] Generation settings filled in (Section 6)
[ ] Hair / mask cues: NOT IN WORKFLOW (05B is HOLD)
[ ] Halo / orbital UI: NOT IN WORKFLOW (06C is HOLD)
[ ] 08B is NOT loaded anywhere in the workflow
[ ] Output naming convention ready (Section 2)
```

---

## 8. BATCH ITERATION PROTOCOL

### Batch 1 (first 4–8 outputs)
After generating: check every output for STOP RULE violations (Section 10) before proceeding.
If any violation → adjust negative prompt and/or weights → re-run before continuing.

### Batch 2 (next 4–8 outputs)
Check: matte B4C porcelain reads correctly. Graphene underlayer visible in gaps. No chrome / gloss.
If material is wrong → increase B4C porcelain anchor weight, add more material terms to negative.

### Batch 3+ (refinement)
Check: helmet silhouette matches front and side 3D source anchors.
Select 1–3 best outputs for formal review. Record seed for each selected output.

### Quick-Pass Gate (apply to every selected output before submission)
All 7 must be true to proceed to evidence package:

```
[ ] Faceplate completely sealed — no eyes, nose, mouth, skin visible
[ ] Helmet silhouette consistent with MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO
[ ] Helmet volume consistent with MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO
[ ] Material reads as matte B4C porcelain — no gloss, no chrome
[ ] Black graphene underlayer visible through at least one panel gap
[ ] Background dark and neutral — no scene, no environment
[ ] No anime / fashion / glamour drift visible
```

If any check fails → mark output DISCARD or HOLD_REWORK — do not submit for formal review.

---

## 9. EVIDENCE PACKAGE CHECKLIST

When a candidate passes the Quick-Pass Gate, prepare this evidence package before submitting for formal evaluation.

### Required files

```
[ ] Candidate image saved to:
    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
    MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_CANDIDATE_[DATE].png

[ ] Review report saved to:
    D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
    MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_REPORT.md
    (use template in Section 9.1 below)
```

### 9.1 Review Report Template

Copy this template into a new markdown file. Fill in every field.

```markdown
# MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_REPORT

## 1. Candidate Path
D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_CANDIDATE_[DATE].png

## 2. Generation Method
- ComfyUI model: ___________________________
- Workflow type: img2img + IP-Adapter + ControlNet
- Seed: ___________________________
- Steps: ___ / CFG: ___ / Denoise: ___
- Resolution: ___ x ___
- Date: ___________________________
- Workflow file (if saved): ___________________________

## 3. Anchor Comparison Results

| Check | Result | Notes |
|---|---|---|
| Helmet front geometry match | PASS / FAIL | |
| Helmet side volume match | PASS / FAIL | |
| Faceplate cleanness | PASS / FAIL | |
| B4C porcelain material match | PASS / FAIL | |
| Graphene underlayer match | PASS / FAIL | |
| Identity continuity (key visual V4) | PASS / FAIL | |
| Faceless standard | PASS / FAIL | |
| Anime / fashion drift | ABSENT / PRESENT | |
| Material cleanness (no gloss/chrome) | PASS / FAIL | |

## 4. Proposed Label
<!-- Choose one only -->
INCLUDE_AS_PHASE4_REFERENCE
HOLD_FOR_REWORK
REJECT_DO_NOT_USE

## 5. Forbidden Uses (state regardless of label)
- Canon approval: NO
- Asset lock: NO
- Production-ready: NO
- Phase 5 start permission: NO
- Public output: NO
- Render input: NO
- Film plate: NO

## 6. Excluded Assets Confirmed Not Used As Inputs
- 08B (MIKAGE_COMP_08B...): NOT USED
- Full-body candidate 001: NOT USED
- Controlled front canon repair V1: NOT USED
- Corrected full-body front V2: NOT USED
- Brutalist void V3: NOT USED
- Video/loop test frames: NOT USED
- Archived film source frames: NOT USED
```

### 9.2 Submission to Handoff

After both files are saved:
1. State the candidate path and review report path in the handoff loop
2. Trigger Claude or ChatGPT to execute the formal 4-step evaluation defined in:
   `docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` Section 9

---

## 10. STOP RULES

Stop immediately and do not continue if any of the following is true:

```
STOP ── Facial anatomy is visible in any output (eyes, nose, mouth, skin, open visor)
STOP ── Anime / fashion / glamour drift is present and cannot be eliminated by prompt adjustment
STOP ── Any excluded asset (08B or listed exclusions) was loaded in the workflow
STOP ── Output is saved anywhere other than 11_BUST_BRIDGE_CANDIDATES_V1\
STOP ── Any output is labeled PASS, CANON, APPROVED, LOCKED, PRODUCTION, or FINAL
STOP ── Any output is submitted as production-ready, canon-approved, or Phase 5 entry
STOP ── Phase 5 is declared started
STOP ── Film, video, short, or shotlist task is created from any output
STOP ── ComfyUI runtime is run by Claude (Claude does not run this)
```

If stopped due to drift or violations: document the issue, adjust the workflow, and restart from Batch 1.

---

## 11. AFTER CANDIDATE IS ACCEPTED

If a candidate receives `INCLUDE_AS_PHASE4_REFERENCE` through formal evaluation:

| Next step | Action | Who |
|---|---|---|
| 1 | Notify handoff loop with candidate path and review report path | Operator / Codex |
| 2 | Update Phase 4 stack manifest V2 (bust bridge slot: MISSING → INCLUDE_AS_PHASE4_REFERENCE) | Claude |
| 3 | Execute ASSET-RESET-15 — Define body continuity constraint spec | Claude (no-render) |
| 4 | Execute Phase 5 readiness re-review gate | Claude + human |
| 5 | Phase 5 proposed if re-review PASS | ChatGPT / user — human decision only |

`INCLUDE_AS_PHASE4_REFERENCE` does NOT mean canon approved, asset locked, production ready, Phase 5 started, or public output permitted.

---

## 12. PROHIBITED ACTIONS CONFIRMED

- RENDER_EXECUTED_BY_CLAUDE: NO
- COMFYUI_RUNTIME_USED: NO
- BLENDER_USED: NO
- IMAGE_GENERATED: NO
- VIDEO_GENERATED: NO
- FILM_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- ASSET_GENERATED_BY_CLAUDE: NO
