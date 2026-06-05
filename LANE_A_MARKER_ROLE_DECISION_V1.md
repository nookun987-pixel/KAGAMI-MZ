# LANE_A_MARKER_ROLE_DECISION_V1

## FILES_READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_REPAIR_CHECKLIST_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_MESH_BINDING_TABLE_V1.md`

## SELECTED_BASE_BLEND
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## ROLE_DECISIONS
- `hand_right_sword_hold_marker = MARKER_OR_HELPER / LATER_CONTROL_TARGET`
  - Do not bind it now.
  - Do not add an armature modifier now.
  - Do not add a vertex group now.
  - Keep it as a non-deforming marker/helper for future attachment/control work.
  - Exclude it from the deformation failure count after this decision.
- `reference_anchor_v1_plane_hidden_from_render = REFERENCE_ONLY`
  - Do not bind it now.
  - Do not add an armature modifier now.
  - Do not add a vertex group now.
  - Keep it outside the deforming mesh repair set.
  - Exclude it from the deformation failure count.

## FIRST_REPAIR_PASS_BOUNDARY
- Neither `hand_right_sword_hold_marker` nor `reference_anchor_v1_plane_hidden_from_render` should be bound in the first repair pass.
- First repair pass should focus only on the 29 intended deforming meshes already identified in `LANE_A_MESH_BINDING_TABLE_V1.md`.
- No `.blend` modification is authorized by this decision report.

## PRODUCTION_RIG_READY
- NO

## FILES_CREATED
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_MARKER_ROLE_DECISION_V1.md`

## FILES_MODIFIED
- NONE

## FILES_DELETED
- NONE

## BLEND_MODIFIED
- NO

## RENDER_DONE
- NO

## PUSH_DONE
- NO

## PASS_FAIL
- PASS

## BLOCKERS
- NONE
