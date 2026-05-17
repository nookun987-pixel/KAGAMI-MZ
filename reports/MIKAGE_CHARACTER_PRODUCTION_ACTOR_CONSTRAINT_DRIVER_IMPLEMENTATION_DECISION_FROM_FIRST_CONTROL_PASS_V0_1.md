# MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_FROM_FIRST_CONTROL_PASS_V0_1

**Date:** 2026-05-17  
**Task:** `PREPARE_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_FROM_FIRST_CONTROL_PASS_V0_1`  
**Source of truth:** `docs/handoff/00_LATEST_CODEX_HANDOFF.md`  
**Input first control pass review:** `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_FIRST_CONTROL_RIG_PASS_REVIEW_FROM_INITIAL_ARMATURE_V0_1.md`  
**Target derivative file:** `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Decision Status

| Field | Value |
|---|---|
| CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_STATUS | PREPARED |
| CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION | `AUTHORIZE_CONSTRAINT_DRIVER_IMPLEMENTATION_PREP_ONLY` |
| FIRST_CONTROL_RIG_PASS_REVIEW_STATUS | PASS |
| FIRST_CONTROL_RIG_PASS_REVIEW_RESULT | `APPROVED_FOR_CONSTRAINT_DRIVER_PREP_DECISION` |
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
| NEXT_SAFE_TASK | `REVIEW_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_FROM_FIRST_CONTROL_PASS_V0_1` |

## 1. Constraint / Driver Implementation Decision

Constraint / driver implementation should proceed only to the next preparation/review gate.

Decision:

```text
AUTHORIZE_CONSTRAINT_DRIVER_IMPLEMENTATION_PREP_ONLY
```

This decision does not authorize creating constraints or drivers in this task. It authorizes a later review to decide whether a separate constraint / driver creation package may be prepared.

## 2. Exact Approved Derivative Target

Any future constraint or driver preparation must target only:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

No other `.blend` may be used as the constraint / driver target without a separate approved review gate.

## 3. Locked Source Protection Rule

The locked source asset must remain unchanged:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The locked source must not be opened for saving, overwritten, resaved, modified, constrained, driven, weighted, re-exported, or used as an output target.

## 4. Constraint / Driver Boundary

The current derivative state contains one armature scaffold and eight first-pass controls. Constraint / driver work, if later approved, must only connect the existing first-pass controls to the existing armature scaffold inside the approved derivative file.

Constraint / driver work must not bind mesh deformation, create weights, create vertex groups, create deformation validation, create motion tests, create animation, or claim final rig behavior.

## 5. Allowed First Constraint / Driver Prep Scope

A later prep package may define a minimal, inspectable first constraint / driver pass for:

- Mapping `global_ctrl` to root-level rig organization.
- Mapping `pelvis_ctrl` to pelvis control intent.
- Mapping `chest_ctrl` to torso orientation intent.
- Mapping `head_ctrl` to head / neck control intent.
- Mapping `hand.L_ctrl` and `hand.R_ctrl` to hand control intent.
- Mapping `foot.L_ctrl` and `foot.R_ctrl` to foot control intent.
- Identifying which constraints, if any, are candidates for a first pass.
- Identifying whether any drivers are necessary; drivers should remain excluded unless a later review explicitly approves them.

This decision does not select final constraint types and does not authorize implementation.

## 6. Forbidden Scope

This decision prep does not authorize:

- Creating constraints.
- Creating drivers.
- Creating weights or vertex groups.
- Creating armature modifiers.
- Creating deformation tests.
- Creating motion tests.
- Creating animation.
- Creating IK/FK switching.
- Creating twist systems.
- Creating facial, cloth, weapon, cinematic camera, or final polish systems.
- Modifying the locked source.
- Claiming final rig readiness.
- Claiming cinematic readiness.
- Creating public output.

## 7. Required Next Task If Approved

The required next task is:

```text
REVIEW_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_FROM_FIRST_CONTROL_PASS_V0_1
```

Only after that review passes may a separate prep task define the actual constraint / driver creation package.

## 8. Required Review Before Actual Constraints / Drivers Are Created

Before constraints or drivers are created, a later review must confirm:

- This decision is approved.
- The target derivative path is exact.
- The locked source remains unchanged.
- The derivative still has one armature object, 23 bones, and exactly eight approved controls unless a reviewed task changes it.
- The constraint / driver creation task names exact allowed constraints and driver properties.
- Weights, vertex groups, deformation tests, motion tests, final rig readiness, and cinematic readiness remain excluded unless separately approved.

## 9. Required Separate Review Before Weights / Vertex Groups

Weights and vertex groups require a separate review after constraint / driver planning and inspection. They must not be created in the decision prep, decision review, or first constraint / driver prep stages.

Any later weights / vertex groups package must define:

- Which meshes may receive vertex groups.
- Which bones may receive weights.
- Whether armature modifiers may be added.
- Failure conditions.
- Inspection checklist.
- Rejection criteria for deformation artifacts.

## 10. Required Separate Review Before Deformation Or Motion Tests

Deformation tests and motion tests require separate reviewed authorization after weights / constraints / drivers are inspected. They must not be created in this decision or in any constraint / driver prep task.

Any later test package must define:

- Test poses or motions.
- Evaluation criteria.
- Failure conditions.
- Output artifact boundaries.
- Explicit exclusion of cinematic proof unless separately approved.

## 11. Failure Conditions

This decision or any later constraint / driver preparation must fail if:

- The locked source `.blend` is modified.
- Constraint / driver work targets any file other than the approved derivative.
- Constraints or drivers are created before the required review approves actual creation.
- Weights or vertex groups are created before their own review gate.
- Deformation tests, motion tests, animation, cinematic proof, or public output are created.
- Final rig readiness or cinematic readiness is claimed.
- Constraint / driver scope expands beyond the reviewed first-pass control set.
- Required evidence for control count, armature count, bone count, or forbidden artifact absence is missing.

## 12. Inspection Checklist

The review of this decision must confirm:

- Decision status is `PREPARED`.
- Decision is `AUTHORIZE_CONSTRAINT_DRIVER_IMPLEMENTATION_PREP_ONLY`.
- Target derivative file is exact.
- Locked source asset path is exact.
- Locked source remains unmodified.
- Control status remains `CREATED`.
- Control count remains 8.
- Armature status remains `CREATED`.
- Armature object count remains 1.
- Bone count remains 23.
- Weight status remains `NOT_CREATED`.
- Constraint / driver status remains `NOT_CREATED`.
- Motion test status remains `NOT_CREATED`.
- Cinematic proof shot status remains `NOT_STARTED`.
- Final rig readiness remains `NOT_CLAIMED`.
- Required next task and required reviews are defined.
- Failure conditions are defined.

## Scope Compliance

No `.blend` files were modified. No constraints or drivers were created. No weights or vertex groups were created. No deformation tests or motion tests were created. No animation was created. No final rig readiness or cinematic readiness was claimed.

## Next Safe Task

`REVIEW_CONSTRAINT_DRIVER_IMPLEMENTATION_DECISION_FROM_FIRST_CONTROL_PASS_V0_1`
