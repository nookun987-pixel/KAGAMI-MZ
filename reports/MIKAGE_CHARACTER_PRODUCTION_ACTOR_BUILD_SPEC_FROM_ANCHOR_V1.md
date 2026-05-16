# MIKAGE_CHARACTER_PRODUCTION_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1

**Date:** 2026-05-16  
**Task:** `PREPARE_PRODUCTION_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1`  
**START_HEAD:** `d5701fb0527839c87df64bc815e451bbd1fb461b`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  

---

## Build Spec Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_BUILD_SPEC_STATUS | PREPARED |
| DOC_STEP_BEFORE_VISIBLE_ASSET | `1_OF_2` |
| MAX_DOC_STEPS_BEFORE_VISIBLE_ASSET | 2 |
| VISIBLE_ASSET_TARGET | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` |
| PRODUCTION_ACTOR_EXECUTION_STATUS | `NOT_STARTED` |
| SOURCE_ANCHOR | `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` |
| ASSET_LOCK_STATUS | `NOT_LOCKED` |
| RIG_STATUS | `PROXY_CONTROLLED_MOTION_TEST_REVIEW_PASSED_NOT_FINAL` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1` |

This is documentation step 1 of maximum 2 before visible asset build. It prepares the build specification only and does not build the actor, modify `.blend` files, render, create images, create motion, alter Anchor V1, or claim final asset lock, final rig readiness, or cinematic readiness.

---

## 1. Build Target

| Output | Path |
|---|---|
| Output blend | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` |
| Notes | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1_NOTES.md` |
| Build report | `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_BUILD_V0_1_REPORT_FROM_ANCHOR_V1.md` |

The V0.1 build target is a visible production actor candidate for review, not a final locked character asset.

---

## 2. Source References

| Source | Allowed Use |
|---|---|
| Anchor V1: `docs/character/anchor_v1_candidates/P3A_R4_HELMET_INPAINT_001.png` | Primary identity and visual reference. |
| Existing proxy blockout: `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_BLOCKOUT.blend` | Proportion and blockout logic reference only. |
| Existing rig-prep blockout: `production/character/proxy_actor/MIKAGE_PROXY_3D_ACTOR_FROM_ANCHOR_V1_RIG_PREP_BLOCKOUT.blend` | Rig logic and control grouping reference only. |
| Limited proxy rig package manifest: `production/character/proxy_actor/MIKAGE_LIMITED_PROXY_RIG_REVIEW_PACKAGE_MANIFEST_FROM_ANCHOR_V1.md` | Evidence chain and boundary reference. |
| Canon asset registry: `docs/pipeline/01_CANON_ASSET_REGISTRY.md` | Canon status and forbidden-use authority. |

Do not overwrite any existing proxy `.blend`. Do not alter Anchor V1. Do not promote source references to final production status.

---

## 3. Build Strategy

Use the HYBRID route:

- use the proxy actor as proportion and layout reference
- use the rig-prep blockout as rig logic reference
- build a cleaner production actor V0.1 structure
- do not treat proxy geometry as final
- do not claim final topology
- keep object names clean and inspectable
- prioritize visible identity fidelity over final mesh sophistication

The next execution task should create a new production actor asset from this spec, not continue endless planning.

---

## 4. Required V0.1 Components

The V0.1 production actor must include:

- full-body Mikage actor
- faceless white porcelain helmet
- exactly two narrow horizontal black sensor slits
- black underlayer/body base
- broad shoulder armor / pauldrons
- tapered torso
- columnar legs
- left-side black hair mass
- right-side heavy rectangular sword slab
- simple violet accent placeholders
- clean object names
- camera and light for inspection only

The sensor slits must remain separate objects or separately inspectable mesh/material regions. They must not merge into a visor.

---

## 5. Material Placeholders

Required placeholder materials:

- porcelain white helmet/armor
- matte black underlayer
- void black sensor slits
- dark sword material
- violet emissive placeholder accents

These are placeholder materials for V0.1 review only. They are not final material approval.

---

## 6. Forbidden Drift

- No human face.
- No eyes.
- No mouth.
- No skin.
- No anime glam face.
- No R5 replacement.
- No full-body R6.
- No cute/chibi form.
- No random robot design.
- No katana sword.
- No final asset lock claim.
- No final rig readiness claim.
- No cinematic readiness claim.

---

## 7. Execution Rules For Next Build Task

The next build execution task must:

- create `production/character/production_actor/` if missing
- create the new V0.1 blend only
- save output to `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend`
- create notes at `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1_NOTES.md`
- create build report at `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_BUILD_V0_1_REPORT_FROM_ANCHOR_V1.md`
- use existing proxy files as reference only
- do not overwrite proxy files
- do not modify Anchor V1
- do not create AI image renders
- do not create cinematic output
- generate basic inspection metadata/report
- commit and push after execution

The next build task may create the visible V0.1 asset only after the build spec review passes.

---

## 8. Review Criteria For V0.1

The visible V0.1 asset should be reviewed against:

- source identity preserved
- helmet readable
- exactly two slits correct
- silhouette resembles Mikage
- sword readable
- hair mass present
- body not human/anime
- material placeholders present
- object names inspectable
- no final claims

Failure on helmet slits, human face drift, R5/R6 replacement, missing sword, missing hair mass, overwritten proxy source files, or final readiness/lock/cinematic claims should block approval.

---

## 9. Next Safe Task

```text
REVIEW_PRODUCTION_ACTOR_BUILD_SPEC_FROM_ANCHOR_V1
```
