# MIKAGE CHARACTER — BATCH V2 REFINEMENT REPORT

> STATUS: DRAFT · NOT CANON · NOT ASSET-LOCKED · NO RENDER · NO PNG · NO REPAINT · NO AI-IMAGE-GEN
> Date: 2026-06-04 · One coherent build batch (single commit). Target advanced from
> "readable base turnaround" toward "operator-reviewable refined draft", SVG/vector only.
> Target file: `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg`.
> Character identity unchanged. Figure `<defs>` preserved byte-for-byte.

---

## 1. FILES READ
- `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg` (current sheet)
- `docs/handoff/MIKAGE_MODEL_SHEET_BASE_V2_BUILD_REPORT.md`
- `docs/handoff/MIKAGE_MODEL_SHEET_BASE_V2_READABILITY_PATCH_REPORT.md`

## 2. CONSOLIDATED ISSUE LIST (structural audit)

**PASS (already adequate — left untouched)**
- 4-view alignment: all four figures share one scale (0.78) and one y-offset, so landmark
  heights line up across columns; shared horizontal guides confirm it. PASS.
- Silhouette consistency: heavy/monolith column consistent front/side/back/3-4. PASS.
- Mask readability: faceless Kitsune planar mask reads in all views; exactly 2 sealed slits
  front/3-4, none on back. PASS.
- Hair mass: long heavy black, past hip, dominant in back. PASS.
- Violet signal placement: 2 slit halos (front/3-4) + one faint side slit-edge + one Ensō
  (upper back); no plate fill. PASS — left exactly as-is.
- Back center-back seam + hair part: already present (center line in figBack). PASS.
- Front skirt panel seams: already strong (3 dark + 3 light verticals). PASS.
- Guide / label readability: improved in the prior readability patch (enlarged text, callout
  numbers r10/11, 7.0–7.1 de-collided). PASS for review.

**MINOR PATCH (safe clarifications applied — see §3)**
- Coat closed center seam not explicit on the front/3-4 coat torso (only the skirt had a
  center line). → added thin center-seam hairline.
- Mitten hands read slightly placeholder (no thumb indication). → added subtle thumb-nub hairline (front).
- Boots lacked a distinct sole/ground edge separate from the shared SOLE guide. → added thin
  boot sole edges (all views).

**CHUA_XAC_NHAN (recorded, NOT "fixed" — would require operator ruling / master Bible)**
- Coat hem length: the coat-language study said "knee hem", but the V2 figures show layered
  skirt panels reaching toward the ankle. This is a design-intent question, not a defect —
  left as-is, flagged for operator. CHUA_XAC_NHAN.
- Proportion 7.1 vs 7.5 not reconciled vs master Bible (7.1 used as working master).
- Final palette / value tuning vs master Bible.
- Hands/feet final detailing (glove segmentation, boot sole geometry) — still blockout-level by design.
- Operator approval of the V2 form (CANON_LOCK / ASSET_LOCK / RENDER_ALLOWED = NO).

**DO-NOT-TOUCH (preserved, no edits)**
- Faceless mask · exactly 2 slits front/3-4, none back · no eyes/mouth/nose/skin.
- Long black hair · high standing collar · layered vertical skirt panels.
- Matte porcelain shell · graphene joints · controlled violet (slit halo + 1 Ensō).
- All four figure path groups (figFront/figSide/figBack/fig34) and helm defs.

## 3. PATCHES APPLIED (vector hairlines only — additive overlay, NOT edits to figure paths)
A new `REFINEMENT OVERLAY` layer was added AFTER the figure `<use>` elements. Each group uses
the **same** use-transform as its view, so strokes are drawn in the figure's own coordinate
space and align exactly. No figure path or def was modified.

| View | Stroke added | Coord (figure space) | Colour / width | Purpose |
|------|--------------|----------------------|----------------|---------|
| FRONT | coat center seam | M430,398→520 | #08080c · 1.6 | clarify closed center seam |
| FRONT | boot sole edges ×2 | y845, x398–430 / 436–462 | #050509 · 1.4 | clarify boots |
| FRONT | mitten thumb-nub ×2 | y554–572 | #cbc7c0 · 1.0 | clarify mitten hands |
| SIDE | boot sole edge | y846, x414–472 | #050509 · 1.4 | clarify boot |
| BACK | boot sole edges ×2 | y845, x398–428 / 436–462 | #050509 · 1.4 | clarify boots |
| 3/4 | coat center seam | M436,398→520 | #08080c · 1.6 | clarify closed center seam |
| 3/4 | boot sole edges ×2 | y845, x400–428 / 436–466 | #050509 · 1.4 | clarify boots |

All strokes are within palette (porcelain/black/charcoal). **No violet, no warm colour, no fill,
no new shapes** — thin hairlines only. None overlap the violet slits/Ensō or alter silhouette.

## 4. WHAT REMAINS CHUA_XAC_NHAN
See the CHUA_XAC_NHAN block in §2: coat-hem length intent (knee vs panels-to-ankle), 7.1/7.5
proportion reconcile, final palette/value tuning, final hands/feet detailing, and operator
approval of the V2 form. None resolved this batch (each needs an operator ruling or the master Bible).

## 5. FILES MODIFIED / CREATED
- Modified: `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg` (+21 lines, additive overlay only)
- Created: `docs/handoff/MIKAGE_CHARACTER_BATCH_V2_REFINEMENT_REPORT.md` (this report)
- (No REVIEW_NOTES file was needed.)

## 6. VALIDATION RESULT
- **Figure defs:** UNCHANGED — byte-for-byte identical (sha256 prefix `6db990d913d1b837` before and after).
- **Figure geometry:** not edited; clarifications are an additive overlay (git diff = +21, 0 removed,
  no line touching `id="fig*"`, `id="helm*"`, `<use>`, or figure path `d="M…"`).
- **XML:** well-formed (parsed clean).
- **Palette:** unchanged; overlay uses only existing porcelain/black/charcoal hairline colours.
- **Scope:** only the target SVG + this report touched; no source V1/V2 SVG outside
  `character_model_sheet_base_v2/` modified; no unrelated/untracked files staged.
- NOTE: no raster/visual verification (render/PNG forbidden) — validation is structural only.

## 7. NEXT BUILD BATCH RECOMMENDATION
Operator visual review of the refined sheet (open SVG in browser/editor — no render). Decide the
two open design questions: (a) coat-hem length (knee vs panels-to-ankle) and (b) 7.1 vs 7.5 head
proportion vs the master Bible. Once those are ruled, the next safe batch can tighten hands/feet
geometry and lock the proportion guide — still SVG, still no render/lock until operator approves.

*End of Batch V2 Refinement Report.*
