# LANE_A_MESH_BINDING_TABLE_V1

## FILES_READ
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_DEFORMATION_DIAGNOSTIC_REPORT_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_RIG_REPAIR_CHECKLIST_V1.md`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`

## INSPECTION_SCOPE
- Lane A read-only mesh binding table.
- Blender executable: `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`
- Blender runtime observed: 5.1.1.
- Selected base blend:
  - `D:\KAGAMI-MZ_SYNC_PUSH_V2\production\character\production_actor\rig_derivatives\MIKAGE_PRODUCTION_ACTOR_FIRST_MOTION_TEST_FROM_APPROVED_GATE_V0_1.blend`
- `.blend` saved: NO
- Render done: NO
- Production rig ready: NO

## SUMMARY
- Mesh objects inspected: 31.
- Meshes with armature modifier: 29.
- Meshes with vertex groups: 29.
- Meshes classified `DEFORMING_MESH`: 29.
- Meshes classified `REFERENCE_ONLY`: 1.
- Meshes classified `DECISION_NEEDED`: 1.
- Safe to leave unbound:
  - `reference_anchor_v1_plane_hidden_from_render`
- Needs operator decision before repair:
  - `hand_right_sword_hold_marker`

## MESH_BINDING_TABLE
| Mesh object | Armature modifier | Vertex group | Intended class | Safe unbound | Decision before repair |
|---|---:|---:|---|---:|---:|
| `accent_violet_chest_center_placeholder` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `chest` | DEFORMING_MESH | NO | NO |
| `accent_violet_left_pauldron_placeholder` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `clavicle.L` | DEFORMING_MESH | NO | NO |
| `accent_violet_right_pauldron_placeholder` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `clavicle.R` | DEFORMING_MESH | NO | NO |
| `arm_left_simple_black_column` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `upper_arm.L` | DEFORMING_MESH | NO | NO |
| `arm_right_simple_black_column` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `upper_arm.R` | DEFORMING_MESH | NO | NO |
| `body_black_underlayer_full_body_base` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `pelvis` | DEFORMING_MESH | NO | NO |
| `foot_left_planted_block` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `foot.L` | DEFORMING_MESH | NO | NO |
| `foot_right_planted_block` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `foot.R` | DEFORMING_MESH | NO | NO |
| `forearm_left_porcelain_plate` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `forearm.L` | DEFORMING_MESH | NO | NO |
| `forearm_right_porcelain_plate` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `forearm.R` | DEFORMING_MESH | NO | NO |
| `hair_left_lower_weight_block` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |
| `hair_left_side_black_mass_shell` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |
| `hand_left_blockout_placeholder_bind_repair` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `hand.L` | DEFORMING_MESH | NO | NO |
| `hand_right_sword_hold_marker` | NO | NO | DECISION_NEEDED | NO | YES |
| `helmet_faceless_white_porcelain_ovoid` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |
| `helmet_sensor_slit_lower_void_black` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |
| `helmet_sensor_slit_upper_void_black` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |
| `leg_left_columnar_black` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `thigh.L` | DEFORMING_MESH | NO | NO |
| `leg_right_columnar_black` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `thigh.R` | DEFORMING_MESH | NO | NO |
| `neck_matte_black_underlayer` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `neck` | DEFORMING_MESH | NO | NO |
| `pauldron_left_broad_porcelain_slab` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `clavicle.L` | DEFORMING_MESH | NO | NO |
| `pauldron_right_broad_porcelain_slab` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `clavicle.R` | DEFORMING_MESH | NO | NO |
| `pelvis_porcelain_armor_block` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `pelvis` | DEFORMING_MESH | NO | NO |
| `reference_anchor_v1_plane_hidden_from_render` | NO | NO | REFERENCE_ONLY | YES | NO |
| `shin_left_porcelain_front_plate` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `shin.L` | DEFORMING_MESH | NO | NO |
| `shin_right_porcelain_front_plate` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `shin.R` | DEFORMING_MESH | NO | NO |
| `sword_right_heavy_rectangular_slab` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `hand.R` | DEFORMING_MESH | NO | NO |
| `sword_right_simple_hilt_block` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `hand.R` | DEFORMING_MESH | NO | NO |
| `torso_porcelain_upper_armor_tapered` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `chest` | DEFORMING_MESH | NO | NO |
| `torso_tapered_black_core` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `spine_01` | DEFORMING_MESH | NO | NO |
| `v0_2_helmet_porcelain_gap_between_slits_reference` | YES -> `MIKAGE_initial_armature_scaffold` | YES: `head` | DEFORMING_MESH | NO | NO |

## SAFE_TO_LEAVE_UNBOUND
- `reference_anchor_v1_plane_hidden_from_render`
  - Reason: checklist classifies it as reference-only unless operator approves a different role.

## NEEDS_OPERATOR_DECISION_BEFORE_REPAIR
- `hand_right_sword_hold_marker`
  - Current state: no armature modifier, no vertex group.
  - Decision needed: choose whether it is a true deforming/attachment target, a non-deforming marker/helper, or a later control target.

## REPAIR_IMPLICATIONS
- Do not start repair from this table alone.
- The next repair should not bind `reference_anchor_v1_plane_hidden_from_render`.
- The next repair should not auto-bind `hand_right_sword_hold_marker` until its intended role is approved.
- The 29 currently bound meshes are first-pass bound and need deformation-quality review before production-rig readiness can be claimed.
- The one-vertex-group-per-mesh pattern remains a proxy-level risk for any mesh that must bend or share influence between bones.

## FILES_CREATED
- `D:\KAGAMI-MZ_SYNC_PUSH_V2\LANE_A_MESH_BINDING_TABLE_V1.md`

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
