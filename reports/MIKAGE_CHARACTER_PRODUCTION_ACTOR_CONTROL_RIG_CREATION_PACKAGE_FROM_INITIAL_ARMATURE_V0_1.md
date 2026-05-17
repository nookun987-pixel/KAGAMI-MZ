# MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONTROL_RIG_CREATION_PACKAGE_FROM_INITIAL_ARMATURE_V0_1

**Date:** 2026-05-17  
**Task:** `PREPARE_CONTROL_RIG_CREATION_PACKAGE_FROM_INITIAL_ARMATURE_V0_1`  
**Source of truth:** `docs/handoff/00_LATEST_CODEX_HANDOFF.md`  
**Input decision review:** `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONTROL_RIG_IMPLEMENTATION_DECISION_REVIEW_FROM_INITIAL_ARMATURE_V0_1.md`  
**Target derivative file:** `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Package Status

| Field | Value |
|---|---|
| CONTROL_RIG_CREATION_PACKAGE_STATUS | PREPARED |
| CONTROL_RIG_IMPLEMENTATION_DECISION_REVIEW_STATUS | PASS |
| CONTROL_RIG_IMPLEMENTATION_DECISION_REVIEW_RESULT | `APPROVED_FOR_CONTROL_RIG_CREATION_PREP_PACKAGE` |
| ARMATURE_STATUS | `CREATED` |
| ARMATURE_OBJECT_COUNT | 1 |
| BONE_COUNT | 23 |
| RIG_EXECUTION_STATUS | `ARMATURE_SCAFFOLD_CREATED_NOT_RIGGED` |
| CONTROL_STATUS | `NOT_CREATED` |
| WEIGHT_STATUS | `NOT_CREATED` |
| CONSTRAINT_DRIVER_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_CONTROL_RIG_CREATION_PACKAGE_FROM_INITIAL_ARMATURE_V0_1` |

## 1. Target Derivative File

The first control creation package targets only the approved derivative `.blend`:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

No other `.blend` may be used for this control pass without a separate reviewed decision.

## 2. Locked Source Protection Rule

The locked source asset remains protected:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The locked source must not be opened for saving, overwritten, resaved, modified, rigged, constrained, weighted, re-exported, or used as an output target.

## 3. First Control Pass Scope

The first control pass may only prepare a minimal animator-facing control scaffold around the existing initial armature. It must be reviewable, small, and limited to transform controls for the existing armature scaffold.

The first control pass must not change mesh deformation behavior, bind mesh weights, add drivers, add constraints, create animation, or validate deformation.

## 4. Exact Allowed Controls For First Pass

If a later task is reviewed and approved to create controls, the exact allowed controls for the first pass are:

- `global_ctrl` / root control.
- `pelvis_ctrl`.
- `chest_ctrl` / torso control.
- `head_ctrl` / neck control.
- `hand.L_ctrl`.
- `hand.R_ctrl`.
- `foot.L_ctrl`.
- `foot.R_ctrl`.

These controls may be created only in the approved derivative file and only after the required review approves actual control creation.

## 5. Forbidden Controls

The first control pass must not create:

- Full IK/FK switching.
- Twist systems.
- Facial controls.
- Cloth controls.
- Weapon controls.
- Cinematic camera controls.
- Final polish controls.

## 6. Exclusion Of Weights / Constraints / Drivers In This Package

This package does not authorize or create:

- Weights.
- Vertex groups.
- Constraints.
- Drivers.
- IK constraints.
- Driver-based control behavior.
- Deformation tests.
- Motion tests.

Weights, constraints, and drivers require their own later reviewed gate after controls are created and inspected.

## 7. Required Later Task To Actually Create Controls

The required later task to actually create the first control pass is:

```text
CREATE_FIRST_CONTROL_RIG_PASS_FROM_INITIAL_ARMATURE_V0_1
```

That task must explicitly state it may modify only the approved derivative `.blend` and must preserve the locked source unchanged.

## 8. Required Review Before Control Creation

Before any controls are created, a separate review must pass and confirm:

- This package exists and is `PREPARED`.
- The target derivative path is exact.
- The locked source path is exact and unchanged.
- Existing armature state remains one armature object with 23 bones unless a reviewed task changes it.
- The allowed control list is exactly the first-pass list in this package.
- No weights, constraints, drivers, deformation tests, motion tests, final rig readiness, or cinematic readiness are authorized.

## 9. Required Review Before Weights / Constraints / Drivers

After control creation, weights, constraints, and drivers remain blocked until a later review approves a separate package for those systems.

That later package must define:

- Which meshes may receive weights or vertex groups.
- Which controls and bones may receive constraints.
- Which driver properties may be created.
- How driver dependencies are inspected.
- Failure conditions.
- Inspection checklist.

## 10. Failure Conditions

This package or any later control creation task must fail if:

- The locked source `.blend` is modified.
- Control work targets any file other than the approved derivative.
- Controls are created before the required control creation review passes.
- Controls outside the exact first-pass allowed list are created.
- Weights, vertex groups, constraints, drivers, deformation tests, motion tests, or animation are created before their own review gate.
- Full IK/FK switching, twist systems, facial controls, cloth controls, weapon controls, cinematic camera controls, or final polish controls are created.
- Final rig readiness or cinematic readiness is claimed.
- Required evidence for file scope, control count, and forbidden artifact absence is missing.

## 11. Inspection Checklist

The review of this package must confirm:

- Package status is `PREPARED`.
- Target derivative file is exact.
- Locked source asset path is exact.
- Locked source remains unmodified.
- Control status remains `NOT_CREATED`.
- Weight status remains `NOT_CREATED`.
- Constraint / driver status remains `NOT_CREATED`.
- Motion test status remains `NOT_CREATED`.
- Cinematic proof shot status remains `NOT_STARTED`.
- First control pass scope is defined.
- Exact allowed controls are listed.
- Forbidden controls are listed.
- Weights, constraints, and drivers are excluded.
- Required later task is `CREATE_FIRST_CONTROL_RIG_PASS_FROM_INITIAL_ARMATURE_V0_1`.
- Required reviews before controls and before weights / constraints / drivers are defined.
- No final rig readiness or cinematic readiness is claimed.

## Scope Compliance

No `.blend` files were modified. No controls, control bones, custom shapes, weights, vertex groups, constraints, drivers, deformation tests, or motion tests were created. No final rig readiness or cinematic readiness was claimed.

## Next Safe Task

`REVIEW_CONTROL_RIG_CREATION_PACKAGE_FROM_INITIAL_ARMATURE_V0_1`
