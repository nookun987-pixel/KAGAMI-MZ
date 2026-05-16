# MIKAGE_CHARACTER_PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_FROM_LOCKED_BLOCKOUT_V0_2

**Date:** 2026-05-17  
**Task:** `PREPARE_PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_FROM_LOCKED_BLOCKOUT_V0_2`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  
**Source checkpoint:** `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`  
**Source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Plan Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_STATUS | PREPARED |
| PRODUCTION_ACTOR_RIG_PLANNING_SPEC_REVIEW_STATUS | PASS |
| PRODUCTION_ACTOR_RIG_PLANNING_SPEC_REVIEW_RESULT | `APPROVED_FOR_RIG_EXECUTION_PLAN_PREP` |
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
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_FROM_LOCKED_BLOCKOUT_V0_2` |

This is a documentation-only execution plan. It does not modify the locked `.blend`, create an armature, start rigging, create controls, weights, constraints, drivers, deformation tests, or motion tests.

## 1. Execution Objective

Define the future execution path for creating a derivative production actor rig from the locked registered V0.2 blockout. The objective is to make a later rig execution task reviewable before any Blender work begins by specifying the derivative file boundary, control scope, armor/prop handling, inspection gates, and rollback criteria.

This plan prepares for a future rig execution task only. It does not authorize rig creation in the current task.

## 2. Source Asset Lock Boundary

| Item | Path / status |
|---|---|
| Locked source asset | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` |
| Lock status | `LOCKED_REGISTERED` |
| Locked asset type | `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK` |
| Allowed current use | Documentation planning reference only |

The locked source `.blend` must never be overwritten, resaved, edited, rigged, retopologized, re-materialed, or used as the output file for rig execution.

Any future rig execution must operate only in a derivative file created from the locked source.

## 3. Derivative Output File Path

Required derivative rig output path for a future rig execution task:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

This plan does not create the directory or derivative `.blend`. The path is reserved for a separately reviewed and approved future rig execution task.

## 4. Future Execution Sequence

The future rig task should execute in this order only after this plan is reviewed and approved:

1. Confirm the source asset remains `LOCKED_REGISTERED` and unchanged at `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`.
2. Create or confirm the derivative output folder `production/character/production_actor/rig_derivatives/`.
3. Duplicate or append the locked source contents into the derivative file.
4. Save the derivative file only as `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`.
5. Create any future armature only inside the derivative file.
6. Define root, pelvis, spine, neck, head, arm, hand, leg, and foot control intent inside the derivative.
7. Define helmet, porcelain armor, and shoulder/pauldron handling as rigid or semi-rigid pieces unless deformation inspection supports another treatment.
8. Define the left-side hair/silhouette mass handling as rigid follow, limited follow, or controlled secondary mass inside the derivative only.
9. Define blade/prop attachment handling for the right-side rectangular sword slab, including the intended parent/socket/control target.
10. Perform deformation inspection only after an approved execution task permits it.
11. Record any failures with screenshots or notes and roll back by discarding the derivative file, never by editing the locked source.

## 5. Future Control Scope

The future rig execution task should define the following control families before creating them:

| Control zone | Future execution intent |
|---|---|
| Root | Overall actor placement and orientation in derivative only. |
| Pelvis | Lower-body anchor, leg attachment, and center-of-mass support. |
| Spine / torso | Tapered torso support with clear armor-follow behavior. |
| Neck | Helmet/torso transition control with collision checks. |
| Head / helmet | Helmet and two-slit identity grouped to prevent slit drift. |
| Shoulders / pauldrons | Rigid or semi-rigid armor handling with lift/clearance checks. |
| Arms | Upper arm, forearm, and wrist articulation planning. |
| Hands | Hand or grip control decision for future blade interaction. |
| Legs | Hip, knee, and lower-leg articulation planning. |
| Feet | Stance, contact, and foot orientation planning. |
| Hair mass | Left-side silhouette follow or limited secondary handling. |
| Blade / prop | Attachment target and transform ownership for the sword slab. |

No controls are created by this plan.

## 6. Helmet, Armor, Hair, And Blade Handling

### Helmet / Sensor Slits

Future execution should keep the faceless helmet and exactly two black sensor slits grouped under a head/helmet control strategy. The slits should not drift independently unless a later approved facial or helmet-expression task explicitly requires it.

### Armor / Pauldrons

Future execution should treat porcelain armor and broad pauldrons as rigid or semi-rigid by default. Any soft deformation should require inspection evidence that the blockout geometry supports it without breaking the silhouette.

### Hair / Silhouette Mass

Future execution should treat the left-side hair mass as an identity and silhouette element. It may be rigidly parented, given limited follow behavior, or planned for a simple secondary-control candidate, but simulation or motion testing remains out of scope until separately approved.

### Blade / Prop Attachment

Future execution should define a blade/prop attachment rule before constraints are created. Candidate attachment points include hand, forearm, side mount, or back mount, but the approved future execution task must choose one and document collision checks against torso, arm, and pauldron volumes.

## 7. Inspection Checklist

Before a future rig execution task is approved, the reviewer should confirm:

- The locked source asset path is unchanged.
- The derivative output path is declared exactly.
- The locked source will not be overwritten.
- The future execution task creates armature and controls only in the derivative file.
- Root, pelvis, spine, neck, head, arms, hands, legs, and feet are in scope.
- Helmet and sensor slit grouping rules are defined.
- Armor and pauldron rigid/semi-rigid handling rules are defined.
- Hair mass handling is defined without authorizing simulation or motion tests.
- Blade/prop attachment handling is defined before constraints are created.
- Deformation inspection areas are listed.
- Failure rollback discards or revises the derivative only.
- The task excludes cinematic proof, public output, final rig readiness claims, and final material/topology claims.

## 8. Deformation Inspection Plan

A future approved execution task should inspect, but not assume final quality for:

- Helmet to neck clearance.
- Helmet to pauldron clearance.
- Shoulder and pauldron lift collision.
- Torso bend readability.
- Elbow and wrist deformation if soft deformation is attempted.
- Pelvis to leg transition.
- Knee bend readability for columnar legs.
- Foot contact and ankle area.
- Hair mass collision with helmet and shoulder.
- Blade collision against hand, arm, torso, and pauldron.

Inspection failures should be logged as derivative-file issues and should not trigger edits to the locked source asset.

## 9. Failure Rollback

If future execution fails any inspection or scope gate:

- Stop work in the derivative file.
- Preserve the locked source unchanged.
- Record the failure reason in a report.
- Either discard the derivative file or save a failed derivative only if the future approved task explicitly allows failure artifacts.
- Do not repair the locked source `.blend`.
- Do not claim rig readiness, cinematic readiness, or public-output readiness.

## 10. Pass/Fail Criteria For Approving Actual Rig Execution

### PASS Criteria

Actual rig execution may be approved only if a future review confirms:

- This execution plan is reviewed and approved.
- The source asset remains `LOCKED_REGISTERED`.
- The source asset type remains `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK`.
- The derivative output path is exactly `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`.
- The locked source `.blend` will not be overwritten.
- The future task defines armature creation only in the derivative.
- The future task defines root, pelvis, spine, head, limb, hair, armor, and blade/prop handling.
- The future task defines deformation inspection and rollback.
- The future task explicitly excludes cinematic proof, public output, final rig readiness, final topology claims, and final material claims.

### FAIL Criteria

Actual rig execution must be rejected if any of the following are true:

- The locked source `.blend` would be modified, overwritten, or resaved.
- The derivative path is missing, ambiguous, or points to the locked source file.
- Armature, controls, weights, constraints, drivers, deformation tests, or motion tests are started before approval.
- The task claims final rig readiness or cinematic readiness.
- The task includes cinematic proof, public output, final material polish, or final topology polish.
- The task omits rollback rules for failed derivative rig work.

## 11. Explicit Forbidden Scope

This execution plan does not authorize:

- Current rig creation.
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
REVIEW_PRODUCTION_ACTOR_RIG_EXECUTION_PLAN_FROM_LOCKED_BLOCKOUT_V0_2
```
