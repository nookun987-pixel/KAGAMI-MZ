# MIKAGE Production Rig Armature Audit V0.1

Status: `READ-ONLY AUDIT / CANDIDATE EVIDENCE`

Audited file: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`

## Executive finding

The file contains the inherited armature `MIKAGE_initial_armature_scaffold`, but it is not a soft-deformation production rig. Exactly 29 legacy-lineage meshes carry an Armature modifier. Across those meshes, no vertex has positive weight in more than one group. The visible production blade and visible white halo are completely unbound static objects. The visible integrated master helmet/cloak meshes likewise do not appear in the 29 Armature-modifier records.

## 1. Armature object

- Armature object count: `1`
- Object: `MIKAGE_initial_armature_scaffold`
- Datablock: `MIKAGE_initial_armature_scaffold_data`
- Identity result: exact name match with the older rig-repair lineage; it is not a differently named/new armature.
- Bones, 23 total: `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`, `clavicle.L`, `upper_arm.L`, `forearm.L`, `hand.L`, `clavicle.R`, `upper_arm.R`, `forearm.R`, `hand.R`, `thigh.L`, `shin.L`, `foot.L`, `toe.L`, `thigh.R`, `shin.R`, `foot.R`, `toe.R`.

`NO_ARMATURE_FOUND = FALSE`

## 2. Every mesh carrying an Armature modifier

All 29 records below use modifier `FIRST_PASS_ARMATURE_BIND_MIKAGE_initial_armature_scaffold`, target `MIKAGE_initial_armature_scaffold`, vertex groups enabled, bone envelopes disabled. `weighted` is the number of vertices with positive weight in that named group.

| Mesh | Vertex groups | Binding evidence |
|---|---|---|
| `accent_violet_chest_center_placeholder` | 1: `chest` (8 weighted) | rigid, max 1 weighted group/vertex |
| `accent_violet_left_pauldron_placeholder` | 1: `clavicle.L` (8) | rigid |
| `accent_violet_right_pauldron_placeholder` | 1: `clavicle.R` (8) | rigid |
| `arm_left_simple_black_column` | 1: `upper_arm.L` (8) | rigid |
| `arm_right_simple_black_column` | 1: `upper_arm.R` (8) | rigid |
| `body_black_underlayer_full_body_base` | 3 declared: `pelvis` (4), `spine_01` (0), `chest` (4) | partitioned rigid; max 1 weighted group/vertex, not soft |
| `foot_left_planted_block` | 1: `foot.L` (8) | rigid |
| `foot_right_planted_block` | 1: `foot.R` (8) | rigid |
| `forearm_left_porcelain_plate` | 1: `forearm.L` (8) | rigid |
| `forearm_right_porcelain_plate` | 1: `forearm.R` (8) | rigid |
| `hair_left_lower_weight_block` | 1: `head` (8) | rigid |
| `hair_left_side_black_mass_shell` | 1: `head` (266) | rigid |
| `hand_left_blockout_placeholder_bind_repair` | 1: `hand.L` (8) | rigid |
| `helmet_faceless_white_porcelain_ovoid` | 1: `head` (482) | rigid |
| `helmet_sensor_slit_lower_void_black` | 1: `head` (8) | rigid |
| `helmet_sensor_slit_upper_void_black` | 1: `head` (8) | rigid |
| `leg_left_columnar_black` | 1: `thigh.L` (8) | rigid |
| `leg_right_columnar_black` | 1: `thigh.R` (8) | rigid |
| `neck_matte_black_underlayer` | 0 groups | modifier exists but no vertex-group deformation; envelopes are off |
| `pauldron_left_broad_porcelain_slab` | 1: `clavicle.L` (8) | rigid |
| `pauldron_right_broad_porcelain_slab` | 1: `clavicle.R` (8) | rigid |
| `pelvis_porcelain_armor_block` | 1: `pelvis` (8) | rigid |
| `shin_left_porcelain_front_plate` | 1: `shin.L` (8) | rigid |
| `shin_right_porcelain_front_plate` | 1: `shin.R` (8) | rigid |
| `sword_right_heavy_rectangular_slab` | 1: `hand.R` (8) | rigid; hidden legacy blade |
| `sword_right_simple_hilt_block` | 1: `hand.R` (8) | rigid; hidden legacy blade |
| `torso_porcelain_upper_armor_tapered` | 1: `chest` (8) | rigid |
| `torso_tapered_black_core` | 3 declared: `spine_01` (4), `spine_02` (0), `chest` (4) | partitioned rigid; max 1 weighted group/vertex, not soft |
| `v0_2_helmet_porcelain_gap_between_slits_reference` | 1: `head` (8) | rigid |

Summary: 26 meshes declare one group, 2 declare multiple groups but have zero blended vertices, and 1 has zero groups. `SOFT_VERTICES_TOTAL = 0`.

## 3. No-armature branch

Not applicable because one Armature exists. Explicit result: `NO_ARMATURE_FOUND = FALSE`; the file is not purely static, but substantial visible production geometry remains static/unbound.

## 4. Joint-equivalent bones

- Shoulder: `clavicle.L/R` and `upper_arm.L/R` exist. No bone literally named `shoulder`.
- Elbow: functional upper/lower-arm chain `upper_arm.L/R` → `forearm.L/R` exists. No bone literally named `elbow`.
- Hip: `pelvis` and `thigh.L/R` exist. No bone literally named `hip`.
- Knee: functional upper/lower-leg chain `thigh.L/R` → `shin.L/R` exists. No bone literally named `knee`.
- Spine: `spine_01`, `spine_02`, and `chest` exist.

These bones establish nominal joint locations, but the inspected weights do not provide blended deformation across those joints.

## 5. Rigid-one-group finding

`RIGID_1_GROUP_LIKE_OLD_FILE = TRUE` for all positively weighted vertices. There are no vertices influenced by two or more positive-weight groups. The two meshes with three declared groups are rigidly partitioned; their middle spine group has zero weighted vertices. The neck underlayer is even less complete: modifier present, zero groups.

## 6. Blade and halo binding

- Visible production blade objects `PUBLIC_BLOCK_V03_zenith_blade_crisp_front_plane`, `PUBLIC_BLOCK_zenith_blade_dark_edge`, and `PUBLIC_BLOCK_zenith_blade_vertical_slab`: visible/render-enabled, no Armature modifier, no vertex groups, no parent, no parent bone. They are static world/object-space meshes.
- Hidden legacy blade objects `sword_right_heavy_rectangular_slab` and `sword_right_simple_hilt_block`: Armature modifier targets `MIKAGE_initial_armature_scaffold`, one group `hand.R`, rigid binding; both are hidden from viewport and render.
- Other `PUBLIC_BLOCK*blade*` / blade-contact/grip meshes: hidden, with no Armature modifier, no vertex groups, and no parent.
- Visible `MASTER_MATCH_white_halo_ring`: no Armature modifier, no vertex groups, no parent, no parent bone. It is static and not attached to `head` through either armature deformation or direct parenting.

## 7. Audit method and prohibited actions

- Metadata inspected in Blender 5.1.2 background mode: object types, armature datablock/bones, Armature modifiers, modifier targets/options, vertex-group names and positive-weight membership, parent fields, and visibility flags.
- `POSE_ATTEMPTED = NO`
- `RENDER_ATTEMPTED = NO`
- `BLEND_SAVE_ATTEMPTED = NO`
- No object, mesh, armature, bone, vertex group, material, transform, pose, or render setting was created, deleted, or modified.

## Integrity and disposition

- SHA-256 before audit: `A4A028E756B34940DDA60C7408141A444A750AA5171B45B0839F318DA2944F6E`
- SHA-256 after audit: `A4A028E756B34940DDA60C7408141A444A750AA5171B45B0839F318DA2944F6E`
- `ARMATURE_AUDIT_FILE_MODIFIED = NO`
- `BLOCKER = NONE`
- Next safe action: Lane B/operator may scope a separate rig-upgrade task from these findings. This audit does not authorize that work.
- No canon-lock, asset-lock, production-rig-ready, push, or deploy claim is made.
