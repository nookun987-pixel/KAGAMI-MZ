# MIKAGE_CHARACTER_PRODUCTION_ACTOR_RIG_EXECUTION_TASK_FROM_LOCKED_BLOCKOUT_V0_2

**Date:** 2026-05-17  
**Task:** `PREPARE_PRODUCTION_ACTOR_RIG_EXECUTION_TASK_FROM_LOCKED_BLOCKOUT_V0_2`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  
**Source checkpoint:** `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`  
**Source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Task Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_RIG_EXECUTION_TASK_STATUS | PREPARED |
| PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_REVIEW_STATUS | PASS |
| PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_REVIEW_RESULT | `APPROVED_FOR_RIG_EXECUTION_TASK_PREP` |
| ASSET_LOCK_STATUS | `LOCKED_REGISTERED` |
| PRODUCTION_ACTOR_LOCKED_ASSET_TYPE | `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK` |
| RIG_EXECUTION_STATUS | `NOT_STARTED` |
| ARMATURE_STATUS | `NOT_CREATED` |
| CONTROL_STATUS | `NOT_CREATED` |
| WEIGHT_STATUS | `NOT_CREATED` |
| CONSTRAINT_DRIVER_STATUS | `NOT_CREATED` |
| DEFORMATION_TEST_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_RIG_EXECUTION_TASK_FROM_LOCKED_BLOCKOUT_V0_2` |

This is a documentation-only rig execution task definition. It does not modify `.blend` files, create the derivative `.blend`, create an armature, start rigging, create controls, weights, constraints, drivers, deformation tests, or motion tests.

## 1. Objective Of Future Actual Rig Execution

The future actual rig execution task will create a derivative production actor rig file from the locked registered V0.2 blockout, then build an initial production rig structure inside that derivative only.

The objective of the future execution is to establish a first rig derivative with:

- Source asset lineage preserved from `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`.
- A derivative `.blend` output separate from the locked source.
- Armature and control structure created only in the derivative.
- Helmet, armor, hair mass, and blade handling defined before deformation review.
- Validation evidence sufficient for a later execution review.

This current task does not perform the execution. It only defines the future task.

## 2. Exact Locked Source Asset

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

The source asset status is `LOCKED_REGISTERED`, and the locked asset type is `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK`.

## 3. Exact Derivative Output File Path

The future actual rig execution must save the derivative rig file only here:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

This current task does not create that file or its containing directory.

## 4. Locked Source Protection Rule

The source `.blend` must never be overwritten.

The future actual rig execution must not resave, edit, rig, retopologize, re-material, or otherwise modify:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

All future armature, control, constraint, driver, weight, deformation, and inspection work must occur in the derivative file only after the future task has been reviewed and approved for implementation.

## 5. Future Implementation Steps

The future actual rig execution task should proceed in this order after a separate review approves this task:

1. Verify the locked source asset exists and remains unchanged.
2. Create or confirm the derivative output directory:

```text
production/character/production_actor/rig_derivatives/
```

3. Duplicate or append source contents from the locked source into a new derivative `.blend`.
4. Save the new derivative exactly as:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

5. Create the armature in the derivative only.
6. Define root, pelvis, spine, neck, head, arm, hand, leg, and foot controls in the derivative only.
7. Define helmet and armor handling as rigid or semi-rigid unless inspection proves soft deformation is acceptable.
8. Define broad pauldron handling with clearance checks against head, arms, torso, and hair mass.
9. Define left-side hair mass handling as rigid follow, limited follow, or a simple secondary-control candidate in the derivative only.
10. Define blade/prop attachment handling for the right-side rectangular sword slab, including parent/socket/control ownership.
11. Define deformation inspection for helmet/neck, shoulder/pauldron, torso, arms, hands, pelvis, legs, feet, hair, and blade collision zones.
12. Define rollback/failure handling before saving final execution evidence.
13. Record execution output paths and review evidence in a future execution report.

## 6. Explicit Output Files Expected For Future Execution

The future actual rig execution task is expected to produce:

| Future output | Path |
|---|---|
| Rig derivative `.blend` | `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend` |
| Rig execution report | `reports/MIKAGE_CHARACTER_PRODUCTION_ACTOR_RIG_EXECUTION_FROM_LOCKED_BLOCKOUT_V0_2.md` |

Optional future review-only evidence may be allowed by the future approved execution task, but it must not be cinematic proof, public output, or final rig readiness evidence.

## 7. Future Validation Checklist

The future actual rig execution must validate:

- Locked source asset exists and remains unchanged.
- Derivative file is created only at the approved derivative output path.
- Locked source `.blend` was not overwritten or resaved.
- Armature exists only in the derivative file.
- Root, pelvis, spine, neck, head, arm, hand, leg, and foot controls are defined only in the derivative.
- Helmet and two sensor slits remain grouped coherently under head/helmet handling.
- Porcelain armor and pauldrons use rigid or semi-rigid handling unless documented otherwise.
- Left-side hair mass handling is documented.
- Right-side blade/prop attachment handling is documented.
- Deformation inspection results are recorded for all planned risk areas.
- Failure rollback rules were followed if any inspection fails.
- No cinematic proof, public output, final rig readiness claim, final topology claim, or final material claim is made.

## 8. Pass/Fail Criteria For Future Execution Review

### PASS Criteria

The future execution review may pass only if:

- The derivative `.blend` exists at the exact approved path.
- The locked source `.blend` remains unchanged.
- Armature and any controls exist only in the derivative.
- Root, pelvis, spine, head, limbs, helmet, armor, hair mass, and blade/prop handling are documented.
- Deformation inspection has been recorded.
- Any failures were handled by derivative-only rollback or documented derivative revision.
- The future execution report does not claim final rig readiness, cinematic readiness, final material polish, final topology polish, public output, or cinematic proof.

### FAIL Criteria

The future execution review must fail if:

- The locked source `.blend` is modified, overwritten, or resaved.
- The derivative `.blend` is missing or saved to the wrong path.
- Armature, controls, weights, constraints, or drivers are created outside the derivative file.
- Motion tests or cinematic proof are created.
- Public output is created.
- Final rig readiness, cinematic readiness, final topology, or final material polish is claimed.
- Deformation inspection or rollback evidence is missing.

## 9. Explicit Forbidden Scope For This Current Task

This current task does not authorize:

- Current rig creation.
- Current derivative `.blend` creation.
- Current armature creation.
- Current control creation.
- Current skin weights.
- Current constraints.
- Current drivers.
- Current deformation tests.
- Current motion tests.
- Cinematic proof.
- Public output.
- Final rig readiness claims.
- Cinematic readiness claims.
- Final topology claims.
- Final material claims.
- Any modification to `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`.

## Next Safe Task

```text
REVIEW_PRODUCTION_ACTOR_RIG_EXECUTION_TASK_FROM_LOCKED_BLOCKOUT_V0_2
```
