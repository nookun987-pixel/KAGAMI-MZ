# ASSET-BUILD-01_CREATE_BUST_UPPER_BODY_BRIDGE_CANDIDATE_RENDER_PLAN_V1

## 1. Executive Decision

TRUE_CURRENT_PHASE: Phase 4 - Component Integration

PHASE5_ALLOWED: NO

PLAN_STATUS: PLAN_ONLY — NO RENDER

RENDER_ALLOWED: NO (by Claude)

This document is a no-render generation plan for the Mikage bust / upper-body bridge candidate. It provides step-by-step operational instructions for Codex or the local ComfyUI operator to execute when ready. Claude writes the plan. Claude does not execute the plan, does not run ComfyUI, does not use Blender, does not generate images, and does not approve any output. This document is a planning artifact only.

---

## 2. Why This Plan Exists

### 2.1 Gap

The Phase 4 stack (V2 manifest: `docs/handoff/MIKAGE_PHASE4_STACK_MANIFEST_V2.md`) has no accepted bust / upper-body bridge component. The only bust-adjacent candidate previously reviewed — 08B — received a HIGH canon risk rating, confirmed anime / fashion drift, and a human REJECT decision in ASSET-RESET-12. It is permanently excluded.

Phase 5 (upper-body consistency review) cannot begin until a new bust / upper-body bridge candidate is accepted into the Phase 4 stack as `INCLUDE_AS_PHASE4_REFERENCE`.

### 2.2 Specification Authority

All generation constraints are defined in:

`docs/handoff/MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md`

This plan translates that spec into operational ComfyUI workflow steps. The spec is authoritative; this plan is its operational translation. In any conflict, the spec takes precedence.

### 2.3 Who Executes This Plan

| Party | Role |
|---|---|
| Claude | Wrote this plan — no further execution role |
| Codex (local) | Primary executor — runs ComfyUI workflow locally |
| User (local ComfyUI) | Alternate executor — may operate ComfyUI directly |
| ChatGPT | Coordinator — may review the plan before execution is triggered |

---

## 3. Pre-Generation Checklist

Before beginning ComfyUI generation, the operator must confirm all items below.

### 3.1 Source Anchors Present And Accessible

| Anchor | Required path | Purpose |
|---|---|---|
| Unified key visual V4 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_UNIFIED_KEY_VISUAL_V4_FROM_CLEAN_SOURCES_00001_.png` | Overall identity / style reference |
| Helmet front 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_HELMET_FRONT_VIEW_3D_SOURCE_V1_ORTHO.png` | Helmet faceplate geometry — front |
| Helmet side 3D source V1 | `D:\workspace\ComfyUI\MIKAGE_CANON\08_CHARACTER_REVIEW_CANDIDATES\MIKAGE_VOLUME_FIRST_3D_HELMET_SIDE_V1_ORTHO.png` | Helmet volume / depth — side |
| Helmet faceplate Phase 4 ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\01_HELMET_FACEPLATE\MIKAGE_COMP_01A_HELMET_FACEPLATE_CLEAN_PASS.png` | Faceplate cleanness standard |
| B4C porcelain material ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\03_B4C_PORCELAIN_MATERIAL\MIKAGE_COMP_03A_B4C_PORCELAIN_PANEL_GAP_PASS.png` | Primary armor material |
| Graphene underlayer ref | `D:\workspace\ComfyUI\MIKAGE_CANON\10_COMPONENT_CANDIDATE_SET_V1\04_GRAPHENE_UNDERLAYER\MIKAGE_COMP_04A_GRAPHENE_UNDERLAYER_HEX_GAP_PASS.png` | Gap / underlayer material |

All six anchors must be accessible before generation starts. If any path is missing, stop and locate the file before proceeding.

### 3.2 Excluded Assets Confirmed Absent From Workflow

The following must NOT be loaded into the ComfyUI workflow as any input — not as reference image, not as IP-adapter source, not as controlnet input, not as style transfer source:

| Excluded asset | Reason |
|---|---|
| `MIKAGE_COMP_08B_HELMET_BUST_NEGATIVE_SPACE_ALT_PASS_TECHNICAL.png` | REJECT_DO_NOT_USE — anime/fashion drift |
| Full-body candidate 001 (any variant) | REJECT_DO_NOT_USE |
| Controlled front canon repair V1 | FAIL_DO_NOT_USE |
| Corrected full-body front candidate V2 | Review-only; not a positive source |
| Brutalist void / consequence chamber V3 | Failed environment — not an identity source |
| Any video test or loop test frame | REJECT_DO_NOT_USE |
| Any archived film source pack frame | Archive-only |

### 3.3 Output Directory Ready

Create the output directory before running:

```
D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
```

If this directory does not exist, create it. Do not output to any existing candidate set directory from Phase 4 component review.

### 3.4 Optional Elements — Current Status

Due to ASSET-RESET-12 decisions, the following optional elements from the spec are currently NOT permitted:

| Optional element | Current permission | Reason |
|---|---|---|
| Hair / mask cues | NOT PERMITTED | 05B decision is HOLD, not PASS |
| Halo / orbital UI | NOT PERMITTED | 06C decision is HOLD, not PASS |
| Zenith blade (partial) | PERMITTED (constrained) | No outstanding HOLD on blade reference; must not override geometry reads |

---

## 4. Recommended Workflow Structure

This section describes the recommended ComfyUI workflow node configuration. It is a plan — the operator may adapt the exact node topology to their local setup while preserving all constraint requirements.

### 4.1 Workflow Type

Recommended: **img2img + IP-Adapter + ControlNet (depth or pose)**

The workflow must use the Phase 4 locked anchors as conditioning inputs, not as stylistic loose references. The goal is a constrained, anchor-faithful output, not a creative free generation.

### 4.2 Anchor Loading Priority Order

Load anchors in this priority order so the workflow weights them correctly:

1. **Primary conditioning**: Helmet front 3D source V1 + Helmet side 3D source V1
   - These define the most constrained geometry requirement (faceless helmet shape and volume)
2. **Secondary conditioning**: Helmet faceplate Phase 4 ref + B4C porcelain material ref + Graphene underlayer ref
   - These enforce material and surface language
3. **Tertiary style anchor**: Unified key visual V4
   - Overall identity and aesthetic coherence check — use at lower weight to avoid stylistic override of geometry

Do not use the unified key visual V4 as the primary conditioning source. It is an overall style check, not a geometry driver.

### 4.3 Composition Target

| Parameter | Target |
|---|---|
| Framing | Bust / upper-body crop — approximately head to mid-chest or collar |
| Pose | Neutral, front-facing or slight 3/4 angle; no action, no combat, no tilt |
| Background | Dark neutral — solid dark grey or near-black; no scene, no environment, no lighting drama |
| Lighting | Flat to soft diffuse; sufficient to read material and geometry detail; no cinematic rim, no dramatic spotlight |
| Resolution | Match or exceed Phase 4 component reference resolution |
| Aspect ratio | Portrait (taller than wide) — standard bust portrait proportion |

### 4.4 Positive Prompt Framework

The operator should build the positive prompt from these elements in order:

```
[1. Helmet / identity anchor]
faceless armored helmet, sealed faceplate, no visor opening, no eyes, 
matte B4C porcelain armor, black graphene underlayer visible through panel gaps,

[2. Upper-body / bust framing]  
bust portrait, upper body, armored shoulders, collar, 
helmet-to-shoulder armor plate continuity, structural neck collar,

[3. Material discipline]
matte armor surface, panel gap detail, no gloss, no chrome, no reflections,
restrained surface, controlled seams, dark underlayer,

[4. Composition discipline]
neutral pose, dark neutral background, flat lighting, consistency review framing,
no scene, no environment, no action
```

The operator may adapt specific phrasing to their model's vocabulary while keeping all four categories covered. Do not omit any category.

### 4.5 Negative Prompt Framework

The negative prompt must include all of the following without exception:

```
[Identity violations]
eyes, nose, mouth, lips, face, skin, face reveal, open visor, cracked faceplate,
visor glow, eye glow, expressive helmet,

[Drift violations]
anime, manga, cartoon, fashion, glamour, portrait, beauty, softcore, feminine drift,
masculine drift, generic sci-fi, ornamental, decorative, engraved,

[Material violations]
glossy, chrome, metallic sheen, reflective armor, transparent, holographic,
energy emitting surface, glowing armor panels,

[Compositional violations]
full body, action pose, combat stance, weapon brandishing, cinematic shot,
environmental background, scene staging, film plate, dramatic lighting,
rim light, spotlight, vignette,

[Status violations]
production ready, canon approved, final, locked, official
```

### 4.6 ControlNet / Depth Guidance

If using ControlNet depth or pose:

- Generate or use a simple depth map showing a helmeted upper-body figure at neutral pose
- Do not use any existing character depth map from rejected assets
- Keep the depth map generic (helmet blob + shoulder geometry) — do not use a detailed face depth map

### 4.7 IP-Adapter Weight Guidance

| Anchor | Suggested IP-Adapter weight range | Note |
|---|---|---|
| Helmet front 3D source | 0.7 – 0.9 | High weight; geometry must track closely |
| Helmet side 3D source | 0.5 – 0.7 | Medium-high; volume reference |
| Faceplate Phase 4 ref | 0.5 – 0.7 | Material + cleanness |
| B4C porcelain material ref | 0.4 – 0.6 | Material language |
| Graphene underlayer ref | 0.3 – 0.5 | Gap detail; lower weight to avoid tiling |
| Unified key visual V4 | 0.2 – 0.4 | Style check; must not override geometry |

Adjust weights based on output review. If anime / fashion drift appears, reduce unified key visual V4 weight and increase helmet geometry anchor weights.

---

## 5. Generation Batch Strategy

### 5.1 Recommended Batch Size

Generate in small batches of 4–8 outputs per iteration. Do not generate a large batch before reviewing at least one iteration for drift indicators.

### 5.2 Iteration Checkpoints

| After batch | Check for |
|---|---|
| Batch 1 (4–8 outputs) | Drift indicators: anime proportions, exposed face geometry, fashion framing, glossy material, cinematic lighting. If any drift is present, adjust negative prompt and weights before continuing. |
| Batch 2 (4–8 outputs) | Material accuracy: matte B4C porcelain reads correctly, graphene underlayer visible in gaps, no chrome or gloss. |
| Batch 3+ | Geometry accuracy: helmet front and side silhouette consistent with anchors. Select 1–3 best candidates for formal review. |

### 5.3 Seed Management

Record the seed for any output selected for formal review. The seed must be included in the evidence package submitted for evaluation.

### 5.4 Selection Criteria For Formal Review Submission

Select a candidate for formal review only if it passes ALL of the following quick checks:

- [ ] Faceplate is completely sealed — no eyes, nose, mouth, skin
- [ ] Helmet silhouette is consistent with front and side 3D source anchors
- [ ] Material reads as matte B4C porcelain — no gloss, no chrome
- [ ] Black graphene underlayer is visible through at least one panel gap area
- [ ] Background is dark and neutral — no scene staging
- [ ] Pose is neutral — no action, no combat
- [ ] No anime / fashion / glamour drift visible

Any output that fails one or more checks should be discarded or held for rework, not submitted for formal review.

---

## 6. Output File Naming Convention

All generated outputs must follow this naming convention:

```
MIKAGE_BUST_BRIDGE_CAND_[XX]_[STATUS]_[DATE].png
```

Where:
- `[XX]` = two-digit candidate number (01, 02, 03, ...)
- `[STATUS]` = one of: `REVIEW_CANDIDATE`, `DISCARD`, `HOLD_REWORK`
- `[DATE]` = YYYYMMDD

Examples:
```
MIKAGE_BUST_BRIDGE_CAND_01_REVIEW_CANDIDATE_20260512.png
MIKAGE_BUST_BRIDGE_CAND_02_DISCARD_20260512.png
MIKAGE_BUST_BRIDGE_CAND_03_HOLD_REWORK_20260512.png
```

Do not use any name that includes `PASS`, `CANON`, `LOCKED`, `APPROVED`, `PRODUCTION`, or `FINAL` at this stage.

All outputs must be saved to:
```
D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\
```

---

## 7. Evidence Package — Required For Formal Evaluation

When submitting a candidate for the 4-step evaluation process defined in `MIKAGE_BUST_UPPER_BODY_BRIDGE_ASSET_REQUEST_SPEC_V1.md` Section 9, the operator must prepare the following evidence package:

### 7.1 Required Files

| Item | Content |
|---|---|
| Candidate image | File at path above with naming convention applied |
| Review report | Markdown file at `D:\workspace\ComfyUI\MIKAGE_CANON\11_BUST_BRIDGE_CANDIDATES_V1\MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_REPORT.md` |

### 7.2 Required Review Report Contents

The review report must include:

```markdown
# MIKAGE_BUST_BRIDGE_CAND_[XX]_REVIEW_REPORT

## 1. Candidate Path
[absolute path]

## 2. Generation Method
ComfyUI / [model name] / img2img + IP-Adapter + ControlNet
Seed: [seed value]
Date: [YYYYMMDD]
Workflow file: [path if saved]

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
[INCLUDE_AS_PHASE4_REFERENCE / HOLD_FOR_REWORK / REJECT_DO_NOT_USE]

## 5. Forbidden Uses
[List forbidden uses regardless of label]

## 6. Excluded Anchors Confirmed Not Used
[Confirm 08B and other excluded assets were not used as inputs]
```

### 7.3 Submission To Handoff

After evidence package is prepared, submit via the handoff loop:
- Save candidate and review report to output directory
- Update or create a task doc referencing the candidate path and review report path
- Trigger Claude or ChatGPT to execute the formal 4-step evaluation from the spec

---

## 8. Failure Modes And Mitigations

| Failure mode | Indicator | Mitigation |
|---|---|---|
| Anime / fashion drift | Softened face proportions, fashion-portrait framing, expressive helmet | Increase negative prompt weight for anime/fashion terms; reduce unified key visual V4 IP-Adapter weight; increase helmet geometry anchor weight |
| Face reveal / visor glow | Visible eyes, nose, mouth, or glowing slit implying eyes | Add explicit negative terms: "visible eyes", "eye glow", "visor opening"; use ControlNet depth to block face region |
| Glossy / chrome material | Reflective or shiny armor surface | Add "glossy", "metallic", "chrome", "shiny", "reflective" to negative; increase B4C porcelain material anchor weight |
| Cinematic framing | Dramatic lighting, rim light, background glow, environmental staging | Add "cinematic", "dramatic lighting", "rim light", "vignette" to negative; reduce unified key visual V4 weight |
| Helmet geometry mismatch | Helmet proportions inconsistent with front/side 3D anchors | Increase helmet front 3D source and helmet side 3D source IP-Adapter weights; use ControlNet depth with a helmet-matching depth map |
| Full-body bleed | Figure extends below upper torso / shoulders | Use inpainting or crop to restrict framing; add "full body", "lower body", "waist", "legs" to negative |

---

## 9. What Happens After A Successful Candidate

If a candidate passes the 4-step evaluation (Section 9 of the spec) and receives `INCLUDE_AS_PHASE4_REFERENCE`:

| Step | Action | Party |
|---|---|---|
| 1 | Update `MIKAGE_PHASE4_STACK_MANIFEST_V2.md` bust bridge slot: MISSING → INCLUDE_AS_PHASE4_REFERENCE | Claude (ASSET-RESET-13 amendment or new V3 manifest) |
| 2 | Execute ASSET-RESET-15 — Define body continuity constraint spec | Claude (no-render) |
| 3 | Execute Phase 5 readiness re-review gate | Claude + human |
| 4 | Phase 5 can be proposed if re-review PASS | ChatGPT / user — human decision |

Receiving `INCLUDE_AS_PHASE4_REFERENCE` does NOT mean:
- Canon approved
- Asset locked
- Production ready
- Phase 5 started
- Public output permitted

---

## 10. Phase 5 Unblocking Status After This Plan

This plan is a documentation artifact. It does not itself unblock Phase 5.

| Condition | Status after ASSET-BUILD-01 |
|---|---|
| Held candidates have documented human decisions | MET |
| Phase 4 stack manifest updated with decisions | MET |
| Bust / upper-body bridge spec exists | MET |
| Bust / upper-body bridge candidate accepted | NOT MET — plan written; generation not yet executed |
| Phase 5 readiness re-review PASS | NOT MET |

PHASE5_ALLOWED: NO

---

## 11. Prohibited Actions Confirmed

- RENDER_EXECUTED_BY_CLAUDE: NO
- COMFYUI_RUNTIME_USED: NO
- BLENDER_USED: NO
- IMAGE_GENERATED: NO
- VIDEO_GENERATED: NO
- FILM_TASK_CREATED: NO
- SHORT_VIDEO_TASK_CREATED: NO
- SHOTLIST_CREATED: NO
- CANON_APPROVAL_CREATED: NO
- ASSET_LOCK_CREATED: NO
- CANDIDATES_CALLED_PRODUCTION_READY: NO
- PHASE5_STARTED: NO
- ASSET_GENERATED_BY_CLAUDE: NO
