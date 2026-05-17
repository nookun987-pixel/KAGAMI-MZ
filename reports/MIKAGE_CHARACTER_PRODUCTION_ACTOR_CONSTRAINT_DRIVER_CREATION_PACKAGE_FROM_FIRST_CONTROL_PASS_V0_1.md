# MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONSTRAINT_DRIVER_CREATION_PACKAGE_FROM_FIRST_CONTROL_PASS_V0_1

**Date:** 2026-05-17  
**Task:** `PREPARE_CONSTRAINT_DRIVER_CREATION_PACKAGE_FROM_FIRST_CONTROL_PASS_V0_1`  
**Source of truth:** `docs/handoff/00_LATEST_CODEX_HANDOFF.md`  
**Input decision review:** `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_REVIEW_FROM_FIRST_CONTROL_PASS_V0_1.md`  
**Target derivative file:** `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Package Status

| Field | Value |
|---|---|
| CONSTRAINT_DRIVER_CREATION_PACKAGE_STATUS | PREPARED |
| CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_REVIEW_STATUS | PASS |
| CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_REVIEW_RESULT | `APPROVED_FOR_CONSTRAINT_DRIVER_CREATION_PREP_PACKAGE` |
| CONTROL_STATUS | CREATED |
| CONTROL_COUNT | 8 |
| ARMATURE_STATUS | CREATED |
| ARMATURE_OBJECT_COUNT | 1 |
| BONE_COUNT | 23 |
| WEIGHT_STATUS | `NOT_CREATED` |
| CONSTRAINT_DRIVER_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| FINAL_RIG_READINESS | `NOT_CLAIMED` |
| NEXT_SAFE_TASK | `REVIEW_CONSTRAINT_DRIVER_CREATION_PACKAGE_FROM_FIRST_CONTROL_PASS_V0_1` |

## 1. Target Derivative File

The only approved target for any later constraint / driver creation is:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

No other `.blend` file may be used for constraint / driver creation without a separate reviewed authorization.

## 2. Locked Source Protection Rule

The locked source asset is:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The locked source must remain unmodified. It must not be opened for saving, overwritten, resaved, constrained, driven, weighted, assigned vertex groups, given armature modifiers, used for tests, or used as an output target.

## 3. Exact Current Rig State

The creation package is based on this reviewed derivative state:

- Armature objects: 1.
- Bones: 23.
- Controls: 8.
- Constraint / driver status: `NOT_CREATED`.
- Weight status: `NOT_CREATED`.
- Motion test status: `NOT_CREATED`.
- Cinematic proof shot status: `NOT_STARTED`.
- Final rig readiness: `NOT_CLAIMED`.

Approved current controls:

```text
global_ctrl
pelvis_ctrl
chest_ctrl
head_ctrl
hand.L_ctrl
hand.R_ctrl
foot.L_ctrl
foot.R_ctrl
```

## 4. First Constraint / Driver Pass Boundary

The first constraint / driver pass, if later approved, may only connect the existing eight first-pass controls to the existing initial armature scaffold in the approved derivative file.

The first pass must remain a minimal, inspectable rigging linkage pass. It must not create mesh deformation, binding, vertex groups, weights, armature modifiers, test animations, deformation validation, motion tests, final polish systems, or cinematic output.

## 5. Exact Allowed First-Pass Constraint Candidates

A later creation task may propose only these first-pass constraint candidates:

| Control | Candidate target intent | Candidate constraint type |
|---|---|---|
| `global_ctrl` | Overall root organization for `root`. | Copy Location and Copy Rotation candidates only. |
| `pelvis_ctrl` | Pelvis placement/orientation for `pelvis`. | Copy Location and Copy Rotation candidates only. |
| `chest_ctrl` | Torso orientation for `chest`. | Copy Rotation candidate only. |
| `head_ctrl` | Head / neck orientation for `head`. | Copy Rotation candidate only. |
| `hand.L_ctrl` | Left hand placement/orientation for `hand.L`. | Copy Location and Copy Rotation candidates only. |
| `hand.R_ctrl` | Right hand placement/orientation for `hand.R`. | Copy Location and Copy Rotation candidates only. |
| `foot.L_ctrl` | Left foot placement/orientation for `foot.L`. | Copy Location and Copy Rotation candidates only. |
| `foot.R_ctrl` | Right foot placement/orientation for `foot.R`. | Copy Location and Copy Rotation candidates only. |

No IK constraints, pole targets, IK/FK switching, twist constraints, facial constraints, cloth constraints, weapon constraints, camera constraints, or final polish constraints are allowed in the first pass.

## 6. Driver Policy

Drivers remain excluded unless explicitly justified and reviewed.

The default first pass should use no drivers. If a later task proposes any driver, that task must name the driven property, driver source, expression, reason the driver is necessary, inspection method, and rollback condition. Driver creation must not occur until a separate review approves that exact driver scope.

## 7. Forbidden Scope

This package does not authorize:

- Creating constraints.
- Creating drivers.
- Creating weights.
- Creating vertex groups.
- Creating armature modifiers.
- Creating deformation tests.
- Creating motion tests.
- Creating animation.
- Creating final rig readiness claims.
- Creating cinematic readiness claims.
- Creating IK/FK switching.
- Creating twist systems.
- Creating facial controls or constraints.
- Creating cloth controls or constraints.
- Creating weapon controls or constraints.
- Creating cinematic camera controls.
- Creating final polish systems.
- Modifying the locked source `.blend`.

## 8. Required Later Task To Actually Create Constraints / Drivers

The required later task to actually create constraints or drivers is:

```text
CREATE_FIRST_CONSTRAINT_DRIVER_PASS_FROM_FIRST_CONTROL_PASS_V0_1
```

That task must not run until this package has passed its own review.

## 9. Required Review Before Actual Creation

Before any constraints or drivers are created, a review task must confirm:

- This package exists and has status `PREPARED`.
- Target derivative path is exact.
- Locked source path is exact and remains unmodified.
- Current rig state still has 1 armature, 23 bones, and 8 controls.
- `CONSTRAINT_DRIVER_STATUS = NOT_CREATED`.
- `WEIGHT_STATUS = NOT_CREATED`.
- `MOTION_TEST_STATUS = NOT_CREATED`.
- `CINEMATIC_PROOF_SHOT_STATUS = NOT_STARTED`.
- `FINAL_RIG_READINESS = NOT_CLAIMED`.
- Exact allowed first-pass constraint candidates are listed.
- Drivers remain excluded unless explicitly justified and reviewed.
- Failure conditions and inspection checklist are defined.

## 10. Required Separate Review Before Weights / Vertex Groups

Weights and vertex groups remain outside this package. A separate reviewed package must authorize any later weights or vertex groups.

That later review must define allowed meshes, allowed bones, vertex group naming, weight limits, armature modifier policy, failure conditions, and rejection criteria for deformation artifacts.

## 11. Required Separate Review Before Deformation / Motion Tests

Deformation tests and motion tests remain outside this package. A separate reviewed package must authorize any later deformation or motion testing.

That later review must define test poses or motions, evaluation criteria, output artifact boundaries, failure conditions, and explicit exclusion of cinematic proof unless separately approved.

## 12. Failure Conditions

This package or any later creation task must fail if:

- The locked source `.blend` is modified.
- Work targets any file other than the approved derivative.
- Constraints or drivers are created before this package review passes.
- Any constraint candidate appears outside the exact first-pass candidate list.
- Any driver is created without explicit justification and review.
- Weights, vertex groups, or armature modifiers are created.
- Deformation tests, motion tests, animation, public output, final rig readiness, or cinematic readiness are created or claimed.
- Current rig evidence for 1 armature, 23 bones, and 8 controls is missing.
- Scope expands into IK/FK switching, twist systems, facial rigging, cloth rigging, weapon rigging, camera controls, or final polish systems.

## 13. Inspection Checklist

The review of this package must confirm:

- Package status is `PREPARED`.
- Target derivative file is exact.
- Locked source asset is exact.
- Locked source remains unmodified.
- Current rig state is exactly 1 armature, 23 bones, and 8 controls.
- Constraint / driver status remains `NOT_CREATED`.
- Weight status remains `NOT_CREATED`.
- Motion test status remains `NOT_CREATED`.
- Cinematic proof shot status remains `NOT_STARTED`.
- Final rig readiness remains `NOT_CLAIMED`.
- First constraint / driver pass boundary is defined.
- Exact allowed first-pass constraint candidates are defined.
- Driver policy excludes drivers unless explicitly justified and reviewed.
- Forbidden weights, vertex groups, armature modifiers, deformation tests, motion tests, animation, final rig readiness, and cinematic readiness are listed.
- Required later creation task is defined.
- Required review before creation is defined.
- Required separate reviews before weights / vertex groups and deformation / motion tests are defined.
- Failure conditions are defined.

## Scope Compliance

This was a documentation-only package prep. No `.blend` files were modified. No constraints were created. No drivers were created. No weights or vertex groups were created. No armature modifiers were created. No deformation tests, motion tests, or animation were created. No final rig readiness or cinematic readiness was claimed.

## Next Safe Task

```text
REVIEW_CONSTRAINT_DRIVER_CREATION_PACKAGE_FROM_FIRST_CONTROL_PASS_V0_1
```
