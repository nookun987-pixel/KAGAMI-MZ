# LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1

## FILES_READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_ACTOR_CONTINUATION_DECISION_REPORT_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## BLENDER_EXE_USED
- `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`
- Runtime observed in stdout: Blender 5.1.1.

## SELECTED_BASE_BLEND
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## ARMATURE_COUNT
- 1
- Armature name: `MIKAGE_initial_armature_scaffold`

## BONE_COUNT
- 23
- Bone hierarchy observed:
  - `root`
  - `pelvis` parent `root`
  - `spine_01` parent `pelvis`
  - `spine_02` parent `spine_01`
  - `chest` parent `spine_02`
  - `neck` parent `chest`
  - `head` parent `neck`
  - `clavicle.L` parent `chest`
  - `upper_arm.L` parent `clavicle.L`
  - `forearm.L` parent `upper_arm.L`
  - `hand.L` parent `forearm.L`
  - `clavicle.R` parent `chest`
  - `upper_arm.R` parent `clavicle.R`
  - `forearm.R` parent `upper_arm.R`
  - `hand.R` parent `forearm.R`
  - `thigh.L` parent `pelvis`
  - `shin.L` parent `thigh.L`
  - `foot.L` parent `shin.L`
  - `toe.L` parent `foot.L`
  - `thigh.R` parent `pelvis`
  - `shin.R` parent `thigh.R`
  - `foot.R` parent `shin.R`
  - `toe.R` parent `foot.R`

## MESH_OBJECTS
- Mesh object count: 31
- Mesh objects with armature modifier and vertex groups: 29
- Mesh objects without armature modifier and without vertex groups:
  - `hand_right_sword_hold_marker`
  - `reference_anchor_v1_plane_hidden_from_render`
- Mesh object names inspected:
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
  - `hand_right_sword_hold_marker`
  - `helmet_faceless_white_porcelain_ovoid`
  - `helmet_sensor_slit_lower_void_black`
  - `helmet_sensor_slit_upper_void_black`
  - `leg_left_columnar_black`
  - `leg_right_columnar_black`
  - `neck_matte_black_underlayer`
  - `pauldron_left_broad_porcelain_slab`
  - `pauldron_right_broad_porcelain_slab`
  - `pelvis_porcelain_armor_block`
  - `reference_anchor_v1_plane_hidden_from_render`
  - `shin_left_porcelain_front_plate`
  - `shin_right_porcelain_front_plate`
  - `sword_right_heavy_rectangular_slab`
  - `sword_right_simple_hilt_block`
  - `torso_porcelain_upper_armor_tapered`
  - `torso_tapered_black_core`
  - `v0_2_helmet_porcelain_gap_between_slits_reference`

## ARMATURE_MODIFIERS_FOUND
- 29 armature modifiers found.
- All found armature modifiers target `MIKAGE_initial_armature_scaffold`.
- Modifier name used across bound meshes: `FIRST_PASS_ARMATURE_BIND_MIKAGE_initial_armature_scaffold`.
- Additional non-armature modifiers observed on some mesh objects:
  - `v0_2_softened_inspection_edges` type `BEVEL`
  - `v0_2_weighted_placeholder_normals` type `WEIGHTED_NORMAL`

## VERTEX_GROUPS_FOUND
- Total vertex groups counted across mesh objects: 29.
- Bound mesh pattern: most bound meshes have 1 vertex group each.
- Missing vertex groups:
  - `hand_right_sword_hold_marker`
  - `reference_anchor_v1_plane_hidden_from_render`

## TEST_POSE_DONE
- YES
- Non-destructive in-memory pose only.
- Pose bones rotated:
  - `clavicle.L`
  - `thigh.L`
- Blend save was not called.

## DEFORMATION_RISK_ITEMS
- `BONE_COUNT_BELOW_PRODUCTION_AUDIT_THRESHOLD`: 23 bones is below the prior audit script's production-rig threshold of 50 bones.
- `MESH_OBJECTS_WITHOUT_ARMATURE_MODIFIER`: `hand_right_sword_hold_marker`, `reference_anchor_v1_plane_hidden_from_render`.
- `MESH_OBJECTS_WITHOUT_VERTEX_GROUPS`: `hand_right_sword_hold_marker`, `reference_anchor_v1_plane_hidden_from_render`.
- Current binding appears first-pass and proxy-level. Evidence supports a rig/deformation repair pass, not a production-ready claim.

## PRODUCTION_RIG_READY
- NO

## NEXT_SAFE_TASK
- Create a Lane A-only rig repair checklist from this diagnostic:
  - decide whether `hand_right_sword_hold_marker` is a true bind target or a non-deforming marker;
  - keep `reference_anchor_v1_plane_hidden_from_render` as reference-only unless operator approves removal or isolation;
  - add/repair vertex groups and armature binding only for intended deforming meshes;
  - expand or validate the armature/control hierarchy before any production-rig readiness claim.

## FILES_CREATED
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1.md`

## FILES_MODIFIED
- NONE

## FILES_DELETED
- NONE

## BLEND_SAVED
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
