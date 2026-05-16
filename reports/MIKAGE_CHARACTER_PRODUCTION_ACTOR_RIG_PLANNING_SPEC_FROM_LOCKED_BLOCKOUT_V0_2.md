# MIKAGE_CHARACTER_PRODUCTION_ACTOR_RIG_PLANNING_SPEC_FROM_LOCKED_BLOCKOUT_V0_2

**Date:** 2026-05-16  
**Task:** `PREPARE_PRODUCTION_ACTOR_RIG_PLANNING_SPEC_FROM_LOCKED_BLOCKOUT_V0_2`  
**Current route:** `CHARACTER_PRODUCTION_FROM_ANCHOR_V1`  
**Source checkpoint:** `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`  
**Source asset:** `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`

## Spec Status

| Field | Value |
|---|---|
| PRODUCTION_ACTOR_RIG_PLANNING_SPEC_STATUS | PREPARED |
| SPEC_SOURCE_ASSET | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` |
| ASSET_LOCK_STATUS | `LOCKED_REGISTERED` |
| PRODUCTION_ACTOR_LOCKED_ASSET_TYPE | `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK` |
| PRODUCTION_ACTOR_RIG_PLANNING_DECISION_REVIEW_STATUS | PASS |
| PRODUCTION_ACTOR_RIG_PLANNING_DECISION_REVIEW_RESULT | `ROUTE_STRING_CORRECTION_APPROVED` |
| RIG_EXECUTION_STATUS | `NOT_STARTED` |
| ARMATURE_STATUS | `NOT_CREATED` |
| MOTION_TEST_STATUS | `NOT_CREATED` |
| CINEMATIC_PROOF_SHOT_STATUS | `NOT_STARTED` |
| NEXT_SAFE_TASK | `REVIEW_PRODUCTION_ACTOR_RIG_PLANNING_SPEC_FROM_LOCKED_BLOCKOUT_V0_2` |

This is a documentation-only rig planning specification. It does not modify the locked `.blend`, create an armature, create skin weights, create constraints, create drivers, create controls, run deformation tests, or create motion tests.

## 1. Rig Planning Objective

Prepare a future production rig plan for Mikage using the locked registered V0.2 production actor blockout as the source reference. The planning objective is to define intended control zones, derivative-file boundaries, deformation risks, and approval criteria before any rig execution is authorized.

The future rig should preserve the V0.2 blockout identity:

- Faceless white porcelain helmet with exactly two black sensor slits.
- Black underlayer body base.
- Broad porcelain shoulder/pauldron silhouette.
- Tapered torso and columnar leg read.
- Left-side black hair/silhouette mass.
- Right-side heavy rectangular sword/blade slab.
- Violet accent placeholders as non-final material cues.

## 2. Source Asset And Lock Boundary

| Item | Path / status |
|---|---|
| Locked source asset | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` |
| Lock status | `LOCKED_REGISTERED` |
| Locked asset type | `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK` |
| Source use | Reference only for planning and future derivative setup |

The locked source `.blend` must not be overwritten, resaved, retopologized, re-materialed, rigged, or used as the direct rig output file. Any future rig work must happen in a separately approved derivative file.

## 3. Proposed Future Rig Asset Naming

Future rig derivative naming should use a clear production actor rig namespace:

```text
MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

Future iterations should increment the final rig derivative version only:

```text
MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_2.blend
MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_3.blend
```

The source blockout version marker `LOCKED_BLOCKOUT_V0_2` must remain visible in derivative names so the lineage cannot be confused with a new sculpt, public render, or final topology/material pass.

## 4. Proposed Future Output Path

Proposed derivative rig output path:

```text
production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_RIG_FROM_LOCKED_BLOCKOUT_V0_2_V0_1.blend
```

This path is proposed for a future rig execution task only. This planning task does not create the directory or file.

## 5. Control Zones

### Head / Helmet

Plan a primary head/helmet control zone that keeps the helmet, two black sensor slits, and faceless porcelain read together. Future controls should preserve the two-slit identity and avoid independent slit drift unless a later facial/helmet expression task explicitly authorizes it.

### Neck

Plan a simple neck transition zone between helmet and torso. The blockout should be inspected for clearance under the helmet mass and for deformation compression risk during look-up, look-down, and side-turn poses in a future rig task.

### Torso

Plan a torso control zone that supports the tapered black core and porcelain upper armor as a readable single body mass. Future rig work should decide whether the torso armor remains mostly rigid, partially follows spine controls, or is segmented for limited deformation.

### Shoulders

Plan separate left and right shoulder/pauldron zones. The broad porcelain slabs should be treated as high-collision-risk rigid or semi-rigid armor pieces, with explicit future clearance checks against head, upper arms, and hair mass.

### Arms

Plan standard upper arm, forearm, and wrist zones, but assume blockout-level geometry may need deformation inspection before skinning. Future execution should define whether armor pieces are parented rigidly, weighted softly, or constrained to helper bones.

### Hands

Plan hand controls only at a high level until hand geometry readiness is reviewed. Future execution criteria should define whether hands need finger controls, mitten/blockout controls, or prop-grip support for the sword/blade.

### Pelvis

Plan a pelvis/root zone that supports full-body orientation and leg attachment. The pelvis should be kept distinct from cinematic or motion-test approval; this spec only identifies where a future rig root and lower-body deformation planning would occur.

### Legs

Plan left and right leg zones for columnar black leg masses. Future rig execution should inspect knee and hip bend readability because blockout forms may not yet support production deformation without cleanup.

### Feet

Plan foot control zones for stance, ground contact, and silhouette support. Actual IK/FK setup, foot roll, and contact testing are out of scope until a later approved execution task.

### Hair / Silhouette Mass

Plan the left-side black hair/silhouette mass as a separate follow or secondary-control candidate. Because the hair is a silhouette-defining mass, future rig execution should decide whether it remains rigidly parented, uses limited follow controls, or receives simple secondary motion controls. No secondary motion setup is authorized here.

### Blade / Prop Attachment

Plan the right-side heavy rectangular sword/blade slab as a prop attachment candidate. Future rig execution should define the attachment rule, likely hand, forearm, or back/side mount depending on the approved pose system. No constraints, sockets, or prop controls are created by this spec.

## 6. Deformation Risk Notes

| Area | Risk |
|---|---|
| Helmet / neck | Helmet mass may intersect neck, shoulders, or hair during rotation. |
| Sensor slits | Slit identity could drift if separated from helmet transforms without strict grouping. |
| Pauldrons / shoulders | Broad slabs may collide with helmet, upper arms, and torso during arm lifts. |
| Torso armor | Porcelain armor may need rigid segmentation rather than soft deformation. |
| Arms / hands | Blockout geometry may not support clean elbow, wrist, or finger deformation yet. |
| Pelvis / legs | Columnar leg forms may buckle visually during knee or hip bends. |
| Feet | Foot contact controls may expose missing ankle/sole topology detail. |
| Hair mass | Left-side mass may intersect shoulder/helmet zones if secondary follow is added later. |
| Sword/blade | Prop attachment may collide with arm, torso, or pauldron volumes. |

## 7. Mesh, Topology, And Material Limitation Notes

V0.2 is a locked registered blockout, not a final topology or material-polish asset. The future rig execution review must confirm whether the mesh is suitable for deformation or whether selected armor/prop components should be treated as rigid parented pieces.

Known planning limitations:

- Topology has not been approved for final deformation.
- Materials are placeholders and must not be treated as final production materials.
- Armor and helmet forms are identity-defining but may be better suited to rigid or semi-rigid controls.
- Hair and sword readability are approved at blockout level, not as final simulated or animated systems.
- No final rig readiness or cinematic readiness is implied by this spec.

## 8. Future Derivative File Rule

The locked source `.blend` must not be overwritten.

Future rig execution must:

- Duplicate or append from the locked source into a derivative rig file.
- Save only to the approved derivative output path.
- Preserve the locked source asset unchanged.
- Record derivative provenance back to `LOCKED_REGISTERED_PRODUCTION_ACTOR_BLOCKOUT_V0_2`.
- Keep public output, cinematic proof, final material polish, and final topology claims out of scope unless separately approved.

## 9. Pass/Fail Criteria For Approving Actual Rig Execution

### PASS Criteria

Actual rig execution may be approved only if a future review confirms:

- This rig planning specification has been reviewed and approved.
- The locked source remains `LOCKED_REGISTERED`.
- The locked source asset type remains `PRODUCTION_ACTOR_3D_BLOCKOUT_LOCK`.
- The execution task names a derivative rig output file and does not overwrite the source `.blend`.
- The future task explicitly defines armature/control scope.
- The future task defines how rigid armor, helmet, hair mass, and sword attachment will be handled.
- The future task defines deformation inspection requirements and failure handling.
- The future task excludes cinematic proof, public output, final material polish, and final topology claims.

### FAIL Criteria

Actual rig execution must be rejected if any of the following occur:

- The locked source `.blend` would be modified or overwritten.
- The task claims final rig readiness before a reviewed rig exists.
- The task claims cinematic readiness or creates cinematic proof.
- The task skips derivative naming or output path controls.
- The task starts armature, weights, constraints, drivers, controls, deformation tests, or motion tests without explicit execution approval.
- The task treats V0.2 as final topology or final material polish.

## 10. Explicit Forbidden Scope

This planning specification does not authorize:

- Rig execution.
- Armature creation.
- Skin weights.
- Constraints.
- Drivers.
- Controls.
- Deformation tests.
- Motion tests.
- Cinematic proof.
- Public output.
- Final rig readiness claims.
- Cinematic readiness claims.
- Final material claims.
- Final topology claims.
- Any modification to `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend`.

## Next Safe Task

```text
REVIEW_PRODUCTION_ACTOR_RIG_PLANNING_SPEC_FROM_LOCKED_BLOCKOUT_V0_2
```
