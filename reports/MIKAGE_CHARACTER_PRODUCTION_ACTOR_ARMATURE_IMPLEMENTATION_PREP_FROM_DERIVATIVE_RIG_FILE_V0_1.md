# MIKAGE_CHARACTER_PRODUCTION_ACTOR_ARMATURE_IMPLEMENTATION_PREP_FROM_DERIVATIVE_RIG_FILE_V0_1

**Date:** 2026-05-17  
**Task:** `PREPARE_ARMATURE_IMPLEMENTATION_FROM_DERIVATIVE_RIG_FILE_V0_1`  
**Source of truth:** `docs/handoff/00_LATEST_CODEX_HANDOFF.md`  
**Target derivative file:** `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Prep Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_ARMATURE_IMPLEMENTATION_PREP_STATUS | PREPARED |
| PRODUCTION_ACTOR_ACTUAL_DERIVATIVE_RIG_FILE_REVIEW_STATUS | PASS |
| PRODUCTION_ACTOR_ACTUAL_DERIVATIVE_RIG_FILE_REVIEW_RESULT | `APPROVED_FOR_ARMATURE_IMPLEMENTATION_PREP` |
| DERIVATIVE_RIG_FILE_STATUS | CREATED |
| LOCKED_SOURCE_ASSET_STATUS | UNMODIFIED |
| RIG_EXECUTION_STATUS | `NOT_STARTED` |
| ARMATURE_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_ARMATURE_IMPLEMENTATION_PREP_FROM_DERIVATIVE_RIG_FILE_V0_1` |

## 1. Armature Creation Boundary

This document prepares the boundary for a later armature creation task only. It does not authorize armature creation in this step.

The later armature task may create a single initial deformation/planning armature only after this prep is reviewed and approved. That future armature must remain a blockout-stage implementation scaffold, not a final rig, final deformation solution, or cinematic-ready control rig.

## 2. Target Derivative File Only

Any future armature implementation must target only:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

No other `.blend` file may be used as an armature output for this route.

## 3. Locked Source Protection Rule

The locked source asset must remain unchanged:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The locked source must not be opened for saving, overwritten, rigged, resaved, modified, retopologized, re-materialed, or used as an output target. It remains the registered blockout reference only.

## 4. Bone Naming Plan

Use a stable, lowercase, side-suffixed naming scheme suitable for later review:

- Root and centerline: `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`.
- Arms: `clavicle.L`, `upper_arm.L`, `forearm.L`, `hand.L`, mirrored as `.R`.
- Legs: `thigh.L`, `shin.L`, `foot.L`, `toe.L`, mirrored as `.R`.
- Helmet / head blockout support: `helmet_base`, `helmet_front`, `helmet_back`, `helmet_side.L`, `helmet_side.R` if needed by visible blockout separation.
- Optional proxy attachment bones must use the `proxy_` prefix, for example `proxy_visor` or `proxy_collar`, and require later review if added.

Do not create control bones, mechanism bones, IK/FK bones, twist chains, facial bones, cloth bones, weapon bones, or cinematic camera bones in the first armature creation task unless a later reviewed task explicitly expands scope.

## 5. Minimal Skeleton Plan

The first armature implementation should be minimal and inspectable:

- One armature object in the approved derivative file.
- A centered root/pelvis/spine/head chain.
- Symmetric upper/lower limb chains for left and right arms and legs.
- Minimal helmet/head support bones only if needed to preserve the existing blockout hierarchy.
- Neutral rest pose aligned to the current production actor blockout.
- No skin binding, no weight painting, and no deformation validation in the creation task.

The goal is to create a reviewable armature scaffold. It is not a final production rig.

## 6. Control / Constraint Exclusion For This Step

This prep step does not create or authorize controls, constraints, drivers, IK, FK, custom shapes, skin weights, vertex groups, deformation tests, or motion tests.

The next actual armature creation task must also keep controls, constraints, drivers, weights, deformation tests, and motion tests out of scope unless a later review explicitly authorizes them.

## 7. Required Next Task To Actually Create Armature

The required later task to create the armature is:

```text
CREATE_INITIAL_ARMATURE_IN_DERIVATIVE_RIG_FILE_V0_1
```

That task must explicitly state that it may modify only the approved derivative `.blend` and must preserve the locked source asset unchanged.

## 8. Required Review Before Controls / Weights / Constraints / Motion Tests

After initial armature creation, a separate review must pass before any of the following work begins:

- Control creation.
- Skin weights or vertex groups.
- Constraints.
- Drivers.
- IK/FK systems.
- Deformation tests.
- Motion tests.
- Cinematic proof.
- Final rig readiness or cinematic readiness claims.

## 9. Failure Conditions

This prep or any later armature implementation must fail if:

- The locked source `.blend` is modified, overwritten, resaved, or used as an output.
- Armature work happens anywhere except the approved derivative path.
- More than the approved initial armature scaffold is created.
- Controls, constraints, drivers, weights, deformation tests, or motion tests are created before later review approval.
- Final rig readiness, cinematic readiness, public output, final topology, or final material claims are made.
- The derivative path changes without an approved review gate.
- Review evidence for the derivative file or locked source status is missing.

## 10. Inspection Checklist

The next review must confirm:

- This prep report exists and is marked `PREPARED`.
- Target derivative path is exactly `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`.
- Locked source path is exactly `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`.
- Locked source remains unmodified.
- Armature status remains `NOT_CREATED`.
- Rig execution status remains `NOT_STARTED`.
- No controls, weights, constraints, drivers, deformation tests, or motion tests were created.
- Bone naming plan is defined.
- Minimal skeleton plan is defined.
- Next actual armature creation task is `CREATE_INITIAL_ARMATURE_IN_DERIVATIVE_RIG_FILE_V0_1`.
- No final rig readiness or cinematic readiness is claimed.

## Scope Compliance

No `.blend` files were modified. No armature was created. Rigging was not started. No controls, weights, constraints, drivers, deformation tests, or motion tests were created. No final rig readiness or cinematic readiness was claimed.

## Next Safe Task

`REVIEW_ARMATURE_IMPLEMENTATION_PREP_FROM_DERIVATIVE_RIG_FILE_V0_1`
