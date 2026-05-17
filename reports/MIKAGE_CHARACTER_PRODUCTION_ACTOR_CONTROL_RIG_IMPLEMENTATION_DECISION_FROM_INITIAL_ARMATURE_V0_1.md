# MIKAGE_CHARACTER_PRODUCTION_ACTOR_CONTROL_RIG_IMPLEMENTATION_DECISION_FROM_INITIAL_ARMATURE_V0_1

**Date:** 2026-05-17  
**Task:** `PREPARE_CONTROL_RIG_IMPLEMENTATION_DECISION_FROM_INITIAL_ARMATURE_V0_1`  
**Source of truth:** `docs/handoff/00_LATEST_CODEX_HANDOFF.md`  
**Input initial armature review:** `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_INITIAL_ARMATURE_REVIEW_FROM_DERIVATIVE_RIG_FILE_V0_1.md`  
**Target derivative file:** `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Decision Status

| Field | Value |
|---|---|
| CONTROL_RIG_IMPLEMENTATION_DECISION_STATUS | PREPARED |
| CONTROL_RIG_IMPLEMENTATION_DECISION | `AUTHORIZE_CONTROL_RIG_IMPLEMENTATION_PREP_ONLY` |
| INITIAL_ARMATURE_REVIEW_STATUS | PASS |
| INITIAL_ARMATURE_REVIEW_RESULT | `APPROVED_FOR_CONTROL_RIG_IMPLEMENTATION_DECISION_PREP` |
| ARMATURE_STATUS | `CREATED` |
| ARMATURE_OBJECT_COUNT | 1 |
| BONE_COUNT | 23 |
| RIG_EXECUTION_STATUS | `ARMATURE_SCAFFOLD_CREATED_NOT_RIGGED` |
| CONTROL_STATUS | `NOT_CREATED` |
| WEIGHT_STATUS | `NOT_CREATED` |
| CONSTRAINT_DRIVER_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_CONTROL_RIG_IMPLEMENTATION_DECISION_FROM_INITIAL_ARMATURE_V0_1` |

## 1. Control Rig Implementation Decision

Control rig implementation should proceed only to the next preparation/review gate.

Decision:

```text
AUTHORIZE_CONTROL_RIG_IMPLEMENTATION_PREP_ONLY
```

This decision does not authorize creating controls in this task. It authorizes a later review to decide whether a separate control creation prep package may be prepared.

## 2. Exact Approved Derivative Target

Any future control rig preparation or implementation must target only:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

No other `.blend` may be used as the control rig target for this route without a separate approved review gate.

## 3. Locked Source Protection Rule

The locked source asset must remain unchanged:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The locked source must not be opened for saving, overwritten, resaved, modified, rigged, constrained, weighted, re-exported, or used as an output target.

## 4. Control Rig Boundary

The current rig state is an armature scaffold only. Control rig work must remain separate from final rig readiness and cinematic readiness.

Future control rig work, if later approved, may add animator-facing control objects or control bones only inside the approved derivative file. It must not bind mesh weights, add deformation validation, add motion tests, or claim final rig behavior.

## 5. Allowed Control Scope For First Control Pass

If later explicitly approved, the first control pass may define a minimal inspectable control scaffold for the existing armature:

- Root / global control.
- Pelvis control.
- Chest / torso orientation control.
- Head / neck control.
- Basic hand controls for left and right hands.
- Basic foot controls for left and right feet.
- Optional pole-vector planning controls only if the next prep review explicitly includes them.

The first control pass must stay minimal and reviewable. It must not include full IK/FK switching, twist systems, facial controls, cloth controls, weapon controls, cinematic camera controls, or final polish controls unless a later reviewed task expands scope.

## 6. Forbidden Scope

This decision prep does not authorize:

- Creating controls.
- Creating control bones.
- Creating custom shapes.
- Creating weights or vertex groups.
- Creating constraints.
- Creating drivers.
- Creating IK/FK switching.
- Creating deformation tests.
- Creating motion tests.
- Creating animation.
- Modifying the locked source.
- Claiming final rig readiness.
- Claiming cinematic readiness.
- Creating public output.

## 7. Required Next Task If Approved

The required next task is:

```text
REVIEW_CONTROL_RIG_IMPLEMENTATION_DECISION_FROM_INITIAL_ARMATURE_V0_1
```

Only after that review passes may a separate prep task define the actual first control creation package.

## 8. Required Review Before Controls Are Actually Created

Before any controls are created, a later review must confirm:

- This decision is approved.
- The target derivative path is exact.
- The locked source remains unchanged.
- The existing armature still has one armature object and 23 bones unless a reviewed task changes it.
- The control creation task names the exact control scope.
- The control creation task excludes weights, constraints, drivers, deformation tests, motion tests, final rig readiness, and cinematic readiness unless separately approved.

## 9. Required Review Before Weights / Constraints / Drivers

Weights, constraints, and drivers require a separate review after controls are created and inspected. They must not be created in the decision prep, decision review, or first control prep stages.

Any later weights / constraints / drivers task must explicitly define:

- Mesh binding boundaries.
- Constraint types and target bones/controls.
- Driver purpose and affected properties.
- Failure conditions.
- Inspection checklist.
- Rollback or rejection criteria.

## 10. Failure Conditions

This decision or any later control preparation must fail if:

- The locked source `.blend` is modified.
- Control rig work targets any file other than the approved derivative `.blend`.
- Controls are created before the required review approves control creation.
- Weights, vertex groups, constraints, or drivers are created before their own review gate.
- Deformation tests, motion tests, animation, cinematic proof, or public output are created.
- Final rig readiness or cinematic readiness is claimed.
- The existing armature scaffold is treated as a final production rig.
- Required evidence for armature count, bone count, or forbidden artifact absence is missing.

## Scope Compliance

No `.blend` files were modified. No controls were created. No weights or vertex groups were created. No constraints or drivers were created. No deformation tests or motion tests were created. No final rig readiness or cinematic readiness was claimed.

## Next Safe Task

`REVIEW_CONTROL_RIG_IMPLEMENTATION_DECISION_FROM_INITIAL_ARMATURE_V0_1`
