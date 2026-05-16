# MIKAGE_CHARACTER_PRODUCTION_ACTOR_V0_2_REFINEMENT_SPEC_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PRODUCTION_ACTOR_V0_2_REFINEMENT_SPEC_FROM_ANCHOR_V1`  
**START_HEAD:** `868f604876a4e21915deb7457d76da4b51b2b324`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Refinement Spec Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_V0_2_REFINEMENT_SPEC_STATUS | PREPARED |
| PRODUCTION_ACTOR_V0_2_EXECUTION_STATUS | `NOT_STARTED` |
| SOURCE_BASELINE | `V0_1_PASS_TO_REFINE` |
| PRODUCTION_ACTOR_V0_1_REVIEW_STATUS | PASS_TO_REFINE |
| PRODUCTION_ACTOR_V0_1_SCORE | 89/100 |
| PRODUCTION_ACTOR_V0_2_TARGET_SCORE | `92_PLUS` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| RIG_STATUS | `PROXY_CONTROLLED_MOTION_TEST_REVIEW_PASSED_NOT_FINAL` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_V0_2_REFINEMENT_SPEC_FROM_ANCHOR_V1` |

This is a documentation-only V0.2 refinement specification. It does not modify `.blend` files, build V0.2, render, create AI images, alter Anchor V1, or claim final asset lock, final rig readiness, or cinematic readiness.

---

## 1. Source Baseline

| Source | Path / Value |
|---|---|
| V0.1 blend | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` |
| V0.1 notes | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1_NOTES.md` |
| V0.1 build report | `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_BUILD_V0_1_REPORT_FROM_ANCHOR_V1.md` |
| V0.1 review report | `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_V0_1_REVIEW_FROM_ANCHOR_V1.md` |
| Review status | `PASS_TO_REFINE` |
| Score | 89/100 |

V0.1 preview paths:

- `production/character/production_actor/review_previews/MIKAGE_PRODUCTION_ACTOR_V0_1_FRONT_REVIEW.png`
- `production/character/production_actor/review_previews/MIKAGE_PRODUCTION_ACTOR_V0_1_SIDE_REVIEW.png`
- `production/character/production_actor/review_previews/MIKAGE_PRODUCTION_ACTOR_V0_1_3Q_REVIEW.png`
- `production/character/production_actor/review_previews/MIKAGE_PRODUCTION_ACTOR_V0_1_CONTACT_SHEET.png`

---

## 2. V0.2 Refinement Goal

Refine V0.1 into a stronger production actor candidate while preserving the accepted Anchor V1 identity and V0.1 pass-to-refine baseline.

V0.2 must preserve:

- Anchor V1 identity
- exactly two sensor slits
- full-body actor structure
- left-side hair mass
- right-side rectangular sword slab
- broad pauldrons
- non-final status

The goal is a higher-quality visible candidate, not a final locked asset.

---

## 3. Allowed V0.2 Changes

Allowed refinement work:

- improve silhouette readability
- clean helmet form
- sharpen or separate sensor slit geometry if needed
- improve pauldron mass balance
- improve torso and leg proportion readability
- improve hair mass placement and readability
- improve sword slab placement and readability
- improve material placeholder organization
- clean object names and grouping
- add simple inspection camera/light updates if needed

All changes must be made as a V0.2 successor asset, not by overwriting V0.1.

---

## 4. Forbidden Changes

- No R5 replacement.
- No full-body R6.
- No new AI image generation.
- No cinematic render.
- No human face.
- No eyes, mouth, or skin.
- No anime glam face.
- No katana.
- No final topology claim.
- No final rig readiness claim.
- No asset lock claim.
- No cinematic readiness claim.
- No overwrite of V0.1 file.
- No Anchor V1 modification.

---

## 5. Required V0.2 Output Target

| Output | Path |
|---|---|
| V0.2 blend | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` |
| V0.2 notes | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2_NOTES.md` |
| V0.2 build report | `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_BUILD_V0_2_REPORT_FROM_ANCHOR_V1.md` |

The V0.2 build must create new files and must not overwrite the V0.1 `.blend`.

---

## 6. Review Target

```text
PRODUCTION_ACTOR_V0_2_TARGET_SCORE = 92_PLUS
```

V0.2 should improve the score from 89/100 by addressing the V0.1 refinement priorities:

- silhouette polish
- material readability
- proportional elegance
- pauldron and torso shaping
- preservation and clarity of the two-slit helmet identity

---

## 7. Execution Boundaries For Future V0.2 Build

The future V0.2 build task may refine from V0.1, but must:

- save a new V0.2 `.blend`
- create new V0.2 notes
- create a new V0.2 build report
- keep V0.1 intact
- keep Anchor V1 intact
- avoid AI image generation
- avoid cinematic render output
- avoid final asset lock, final rig readiness, and cinematic readiness claims

---

## 8. Next Safe Task

```text
REVIEW_PRODUCTION_ACTOR_V0_2_REFINEMENT_SPEC_FROM_ANCHOR_V1
```
