# MIKAGE_CHARACTER_PRODUCTION_ACTOR_DERIVATIVE_RIG_IMPLEMENTATION_PACKAGE_FROM_LOCKED_BLOCKOUT_V0_2

**Date:** 2026-05-17  
**Task:** `PREPARE_DERIVATIVE_RIG_IMPLEMENTATION_PACKAGE_FROM_LOCKED_BLOCKOUT_V0_2`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  
**Source checkpoint:** `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`  
**Locked source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Package Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_DERIVATIVE_RIG_IMPLEMENTATION_PACKAGE_STATUS | PREPARED |
| PRODUCTION_ACTOR_RIG_IMPLEMENTATION_AUTHORIZATION_DECISION_REVIEW_STATUS | PASS |
| PRODUCTION_ACTOR_RIG_IMPLEMENTATION_AUTHORIZATION_DECISION_REVIEW_RESULT | `APPROVED_FOR_DERIVATIVE_RIG_IMPLEMENTATION_PREP_PACKAGE` |
| IMPLEMENTATION_AUTHORIZATION_DECISION | `AUTHORIZE_DERIVATIVE_RIG_IMPLEMENTATION_PREP_ONLY` |
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
| NEXT_SAFE_TASK | `REVIEW_DERIVATIVE_RIG_IMPLEMENTATION_PACKAGE_FROM_LOCKED_BLOCKOUT_V0_2` |

This is a documentation-only derivative rig implementation package. It does not modify `.blend` files, create a derivative `.blend`, create an armature, start rigging, create controls, weights, constraints, drivers, deformation tests, or motion tests.

## 1. Locked Source Boundary

Locked source asset:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

Boundary:

- The source asset is `LOCKED_REGISTERED`.
- The source asset type is `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK`.
- The locked source is the reference baseline only.
- The locked source must remain unchanged through this package and any future derivative preparation.

## 2. Future Derivative Output Path

Future derivative output path:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

This package does not create the derivative file or its containing directory.

## 3. Locked Source Overwrite Rule

The locked source `.blend` must never be overwritten.

The following file must not be modified, resaved, rigged, retopologized, re-materialed, or used as an output file:

```text
production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend
```

## 4. Derivative Creation Rule For This Package

The derivative `.blend` must not be created in this package-prep task.

This package may define the future derivative path, boundaries, review gates, failure conditions, and inspection checklist only.

## 5. Required Later Task Name For Actual Derivative Creation

Actual derivative creation may only be considered after this package is reviewed and approved. The required later task name is:

```text
PREPARE_ACTUAL_DERIVATIVE_RIG_FILE_FROM_LOCKED_BLOCKOUT_V0_2
```

That later task must explicitly authorize derivative file creation. Without that explicit authorization, no derivative `.blend` may be created.

## 6. Required Later Review Before Armature / Rigging

Before any armature, controls, weights, constraints, drivers, deformation tests, or motion tests are created, a later review must approve the derivative file creation result and confirm:

- The derivative `.blend` exists only at the approved path.
- The locked source `.blend` remains unchanged.
- The derivative is safe to use for armature and rig implementation.
- The next task explicitly authorizes armature or rig work.

Until that later review passes, armature and rigging remain blocked.

## 7. Allowed Future Implementation Boundaries

If later reviewed tasks explicitly authorize implementation, work must stay within these boundaries:

- Create derivative work only at the approved derivative path.
- Preserve locked source asset unchanged.
- Create armature only in the derivative.
- Create controls, weights, constraints, and drivers only in the derivative after explicit approval.
- Keep deformation inspection limited to derivative-only review artifacts.
- Keep motion tests blocked unless separately approved.
- Keep cinematic proof, public output, final rig readiness, final topology claims, and final material claims blocked unless separately approved.

## 8. Forbidden Scope

This package does not authorize:

- Locked source modification.
- Derivative `.blend` creation.
- Armature creation.
- Rigging.
- Control creation.
- Skin weights.
- Constraints.
- Drivers.
- Deformation tests.
- Motion tests.
- Cinematic proof.
- Public output.
- Final rig readiness claims.
- Cinematic readiness claims.
- Final topology claims.
- Final material claims.

## 9. Failure Conditions

This package or any later derivative preparation must fail if:

- The locked source `.blend` is modified, overwritten, or resaved.
- The derivative `.blend` is created before explicit approval.
- The derivative path differs from the approved path.
- Armature or rigging begins before a derivative creation review passes.
- Motion tests, cinematic proof, or public output are created.
- Final rig readiness, cinematic readiness, final topology, or final material polish is claimed.
- Required review evidence is missing.

## 10. Inspection Checklist For Future Derivative Creation

A future derivative creation review must inspect:

- Locked source path remains `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`.
- Locked source file has not been modified or resaved.
- Derivative path is exactly `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend`.
- Derivative was created only after explicit approval.
- Derivative contains copied/appended source content, not edits to the locked source.
- No armature exists unless separately authorized after derivative review.
- No controls, weights, constraints, drivers, deformation tests, or motion tests exist unless separately authorized.
- No cinematic proof, public output, final rig readiness, final topology claim, or final material claim is present.

## Next Safe Task

```text
REVIEW_DERIVATIVE_RIG_IMPLEMENTATION_PACKAGE_FROM_LOCKED_BLOCKOUT_V0_2
```
