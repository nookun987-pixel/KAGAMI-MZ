# LANE_A_RIG_REPAIR_CHECKLIST_V1

## FILES_READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1.md`

## DIAGNOSTIC_SUMMARY
- Selected base opens and inspects successfully in Blender 5.1.1 background mode.
- Selected base blend:
  - `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`
- Armature count: 1.
- Armature name: `MIKAGE_initial_armature_scaffold`.
- Bone count: 23.
- Mesh object count: 31.
- Armature-bound mesh count: 29.
- Total vertex groups found across meshes: 29.
- In-memory test pose was done on `clavicle.L` and `thigh.L`.
- Blend was not saved. No render was done.

## MUST_FIX
- 23-bone scaffold limit
  - Current armature is a proxy scaffold, not a production rig.
  - Must expand or validate the rig hierarchy before any production-rig readiness claim.
  - Required next evidence: named production target bone list or approved control hierarchy map.
- 1-vertex-group-per-mesh pattern
  - Current binding pattern suggests rigid first-pass assignment rather than deformation-grade weighting.
  - Must inspect intended deforming meshes for correct vertex group names, membership, and weight distribution.
  - Required next evidence: per-mesh vertex group report showing which bone each deforming mesh follows and whether any mesh needs multi-bone weights.
- 29 first-pass bound meshes
  - Current armature modifiers all target `MIKAGE_initial_armature_scaffold`, but the modifier naming shows first-pass binding.
  - Must verify each bound mesh is intentionally deforming and attached to the correct bone/control path.
  - Required next evidence: mesh-to-bone binding table with keep/repair/reference classification.

## DECISION_NEEDED
- `hand_right_sword_hold_marker`
  - Diagnostic status: mesh object with no armature modifier and no vertex groups.
  - Decision required: bind as an actual deforming/attachment target, convert to non-deforming marker/reference, or replace with a proper hand/sword attachment control in a later approved rig pass.
  - Do not auto-bind until the intended role is confirmed.
- `reference_anchor_v1_plane_hidden_from_render`
  - Diagnostic status: mesh object with no armature modifier and no vertex groups.
  - Decision required: keep as hidden reference anchor, isolate outside deforming mesh checks, or remove only if explicitly approved in a future task.
  - Do not bind this as a deforming character mesh.
- Production rig target threshold
  - Diagnostic and prior audit show production rig ready = NO.
  - Decision required: define the minimum accepted production rig structure before repair work claims readiness.

## REFERENCE_ONLY
- `reference_anchor_v1_plane_hidden_from_render`
  - Treat as reference-only unless the operator explicitly approves a different role.
  - It should be excluded from deformation failure counts after its reference-only role is confirmed.
- Existing audit screenshots and reports
  - Use as evidence for proxy rig state and pose response only.
  - Do not treat them as production deformation approval.
- Prior blockout-only `.blend` files
  - Use as visual/source reference only.
  - Do not continue Lane A rig repair from blockout-only files.

## DO_NOT_TOUCH
- Lane B short/audio/release/website/public page files.
- Existing `.blend` files unless a future task explicitly approves a scoped Lane A repair file operation.
- `D:\KAGAMI-MZ` original repo.
- `.env`, credential, secret, sync, push, deploy, Telegram, or GSheet paths/actions.
- Any public character page/reference package while performing Lane A rig/mesh/Blender repair.
- `reference_anchor_v1_plane_hidden_from_render` until its role is confirmed.

## SELECTED_BASE_BLEND
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## REPAIR_ORDER
1. Confirm object roles without modifying the `.blend`.
   - Classify `hand_right_sword_hold_marker` as deforming attachment, non-deforming marker, or later control target.
   - Confirm `reference_anchor_v1_plane_hidden_from_render` as reference-only or explicitly approve a different role.
2. Generate a read-only mesh-to-binding table from the selected base.
   - Include mesh name, armature modifier target, vertex group count, vertex group names, and current classification.
3. Define minimum production rig target.
   - Compare current 23-bone scaffold against required production/control hierarchy.
   - Identify missing bones or controls before editing.
4. Plan a scoped repair derivative.
   - Future repair should save to a new Lane A derivative `.blend` only after explicit approval.
   - Do not overwrite the selected base.
5. Repair only intended deforming meshes.
   - Add or adjust armature binding and vertex groups only for meshes classified as deforming.
   - Keep reference-only meshes outside deformation repair.

## PRODUCTION_RIG_READY
- NO

## NEXT_SAFE_TASK
- Create a read-only Lane A mesh-to-binding table for the selected base, listing every mesh object's armature modifier target, vertex group names/count, and proposed role: deforming mesh, attachment marker, or reference-only.

## FILES_CREATED
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_REPAIR_CHECKLIST_V1.md`

## FILES_MODIFIED
- NONE

## FILES_DELETED
- NONE

## BLEND_MODIFIED
- NO

## RENDER_DONE
- NO

## COMMIT_DONE
- NO

## PUSH_DONE
- NO

## PASS_FAIL
- PASS

## BLOCKERS
- NONE
