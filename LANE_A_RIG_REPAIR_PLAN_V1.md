# LANE_A_RIG_REPAIR_PLAN_V1

## FILES_READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_REPAIR_CHECKLIST_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_MESH_BINDING_TABLE_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_MARKER_ROLE_DECISION_V1.md`

## SELECTED_BASE_BLEND
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## DERIVATIVE_OUTPUT_NAME_PROPOSAL
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_RIG_REPAIR_PASS_V0_1_FROM_FIRST_MOTION_TEST_V0_1.blend`
- This is a proposal only. Do not create or save this derivative until the operator explicitly approves the repair execution task.

## OBJECTS_EXCLUDED_FROM_BINDING_REPAIR
- `hand_right_sword_hold_marker`
  - Class: `MARKER_OR_HELPER / LATER_CONTROL_TARGET`.
  - Exclusion reason: operator decision says do not bind now, do not add armature modifier now, and do not add vertex group now.
- `reference_anchor_v1_plane_hidden_from_render`
  - Class: `REFERENCE_ONLY`.
  - Exclusion reason: reference-only object, safe to leave unbound, not part of the deformation repair set.

## 29_DEFORMING_MESHES_TO_INSPECT_REPAIR
- `accent_violet_chest_center_placeholder`
- `accent_violet_left_pauldron_placeholder`
- `accent_violet_right_pauldron_placeholder`
- `arm_left_simple_black_column`
- `arm_right_simple_black_column`
- `body_black_underlayer_full_body_base`
- `foot_left_planted_block`
- `foot_right_planted_block`
- `forearm_left_porcelain_plate`
- `forearm_right_porcelain_plate`
- `hair_left_lower_weight_block`
- `hair_left_side_black_mass_shell`
- `hand_left_blockout_placeholder_bind_repair`
- `helmet_faceless_white_porcelain_ovoid`
- `helmet_sensor_slit_lower_void_black`
- `helmet_sensor_slit_upper_void_black`
- `leg_left_columnar_black`
- `leg_right_columnar_black`
- `neck_matte_black_underlayer`
- `pauldron_left_broad_porcelain_slab`
- `pauldron_right_broad_porcelain_slab`
- `pelvis_porcelain_armor_block`
- `shin_left_porcelain_front_plate`
- `shin_right_porcelain_front_plate`
- `sword_right_heavy_rectangular_slab`
- `sword_right_simple_hilt_block`
- `torso_porcelain_upper_armor_tapered`
- `torso_tapered_black_core`
- `v0_2_helmet_porcelain_gap_between_slits_reference`

## 23_BONE_SCAFFOLD_LIMITATION
- Current armature `MIKAGE_initial_armature_scaffold` has 23 bones.
- This remains below the previous audit script's production-rig threshold of 50 bones.
- Repair can improve proxy deformation/binding evidence, but cannot claim production rig readiness without a separate approved production/control hierarchy target and verification pass.

## FIRST_PASS_BINDING_LIMITATION
- The 29 deforming meshes are currently bound by first-pass armature modifiers targeting `MIKAGE_initial_armature_scaffold`.
- The binding pattern is mostly one vertex group per mesh.
- This is acceptable for rigid proxy parts, but it is not enough evidence for deformation-grade weighting where a mesh must bend or share influence.

## REPAIR_STEPS
1. Start from clean repo state and operator-approved repair scope.
2. Open the selected base in Blender.
3. Immediately save a new derivative using the proposed output name or an operator-approved replacement name.
4. Do not overwrite the selected base.
5. Exclude `hand_right_sword_hold_marker` and `reference_anchor_v1_plane_hidden_from_render` from binding repair.
6. For each of the 29 intended deforming meshes, inspect:
   - armature modifier target;
   - vertex group names;
   - vertex membership;
   - whether the one-group binding is acceptable as rigid armor/prop attachment or needs multi-bone weighting.
7. Repair only mismatched or insufficient bindings on the 29 intended deforming meshes.
8. Keep marker/helper and reference-only objects unbound.
9. Save only the approved derivative file.
10. Produce a follow-up repair result report with exact changed object list and verification evidence.

## VERIFICATION_STEPS
1. Run Blender background metadata inspection on the derivative.
2. Confirm object count and armature count.
3. Confirm excluded objects remain unbound:
   - `hand_right_sword_hold_marker`
   - `reference_anchor_v1_plane_hidden_from_render`
4. Confirm all 29 intended deforming meshes still have armature modifier targets.
5. Confirm all 29 intended deforming meshes have intended vertex groups.
6. Run a non-render in-memory pose check on representative upper-body and lower-body bones.
7. Do not render final cinematic output.
8. Do not claim production rig ready unless a later production-rig verification task proves it.

## STOP_CONDITIONS
- Any file outside the approved Lane A repair derivative path would be modified.
- Selected base would be overwritten.
- Lane B website/public page/short/audio/release file appears in the change set.
- `.env`, credential, sync, push, deploy, Telegram, or GSheet action is required.
- Blender cannot open the selected base or derivative.
- Excluded marker/reference objects become bound without explicit approval.
- Verification output is missing or inconclusive.
- Any production-ready claim would be required.

## PRODUCTION_RIG_READY
- NO

## FILES_CREATED
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_REPAIR_PLAN_V1.md`

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
