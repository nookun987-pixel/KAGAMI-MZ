# MIKAGE_HERO_MOUNT_EEVEE_V1_0_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_V1_0_FULL_MOUNT_INTEGRATION_BLOCKOUT`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_0.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V1_0_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock
- PUSH_STATUS = no push

## Integration Work Performed

1. STEED BODY UNIFICATION
   - Added a V1.0 blockout layer with 32 `v10_` objects.
   - Added 3 major faceted armor masses: front withers, center saddle barrel, and rear croup/drive mass.
   - Added continuous graphite under-keel and side slabs so the mount reads as one chassis at thumbnail size.

2. BALL-JOINT / TOY READ REDUCTION
   - Hidden 128 fragmented old steed render objects from the V1.0 candidate layer.
   - Added large side planes and leg socket fairings over the old joint clusters.
   - Simplified leg reads into large sockets, single tapered load struts, and compressed hoof terminals.

3. SEAT / CHASSIS / LEG CONNECTION
   - Added porcelain saddle-to-chassis bridge around the locked rider base.
   - Added dark seat-well socket shadow under the rider.
   - Added leg socket fairings tied into the 3 major chassis masses.

4. BLOB-TO-FACETED-MASS CONVERSION
   - Replaced smooth blob dominance in render with faceted wedge/cube blockout masses.
   - Avoided micro-detail; all new forms are large enough for full-front, full-side, and 3/4 thumbnail review.

## Locked Rider Preservation

- RIDER_OBJECTS_UNCHANGED = `True`
- RIDER_OBJECT_COUNT = `64`
- RIDER_FINGERPRINT_METHOD = Blender reopened V0.9 and V1.0 and compared rider mesh fingerprints for prefixes `rider`, `v08_rider`, and `v09_`, including vertex count, polygon count, dimensions, location, rotation, and render-hidden state.
- PRESERVED = helmet, exactly two violet slits, rider pose, rider scale, rider base, V0.9 cleanup layer, blade placement, and palette.

### Rider Objects Listed As Unchanged

`rider_black_underlayer_visible_side`, `rider_forward_forearm_porcelain`, `rider_forward_upper_arm_black`, `rider_front_shin_black_down_to_mount`, `rider_front_thigh_white_plate`, `rider_helmet_faceplate_clean_no_features`, `rider_left_shoulder_white_plate`, `rider_long_black_hair_separate_back_mass`, `rider_pelvis_seated_black_liner`, `rider_rear_arm_black_against_torso`, `rider_rear_shin_black_down_to_mount`, `rider_rear_thigh_white_plate`, `rider_right_shoulder_white_plate`, `rider_short_mantle_accent_not_hood_not_obi`, `rider_smooth_faceless_porcelain_helmet`, `rider_torso_white_angular_cuirass`, `rider_two_slit_signal_lower`, `rider_two_slit_signal_upper`, `v08_rider_abdominal_plate_1_stacked_porcelain`, `v08_rider_abdominal_plate_2_stacked_porcelain`, `v08_rider_abdominal_plate_3_stacked_porcelain`, `v08_rider_black_blade_handle_registered_in_gauntlet`, `v08_rider_black_hair_lower_v_taper_mass`, `v08_rider_blade_bottom_holster_registered_to_mount_side`, `v08_rider_forward_gauntlet_wrapped_around_blade_grip`, `v08_rider_graphite_underlayer_visible_between_plates`, `v08_rider_helmet_larger_porcelain_egg_form`, `v08_rider_helmet_left_subtle_grayscale_facet`, `v08_rider_helmet_right_subtle_grayscale_facet`, `v08_rider_layered_chest_cuirass_lower_porcelain`, `v08_rider_layered_chest_cuirass_upper_porcelain`, `v08_rider_left_angular_white_pauldron_hero_scale`, `v08_rider_long_black_hair_solid_mass_not_strands`, `v08_rider_mantle_left_v_taper_behind_shoulder`, `v08_rider_mantle_right_v_taper_behind_shoulder`, `v08_rider_right_angular_white_pauldron_hero_scale`, `v08_rider_two_slit_signal_lower_exactly_two`, `v08_rider_two_slit_signal_upper_exactly_one`, `v08_rider_zenith_blade_slab_gripped_not_floating`, `v09_chest_to_pelvis_graphite_centerline_machine_spine`, `v09_clean_shadow_wedge_inside_saddle_recess`, `v09_graphite_saddle_yoke_pelvis_to_steed_single_socket`, `v09_graphite_vertical_seat_spine_registering_rider_to_mount`, `v09_left_ankle_block_terminal_no_ball`, `v09_left_elbow_faceted_mechanical_coupler_no_ball`, `v09_left_forearm_unified_graphite_inside_armor`, `v09_left_knee_rectangular_armored_hinge_no_ball`, `v09_left_shin_graphite_core_sleeve_clean`, `v09_left_shin_porcelain_front_splint`, `v09_left_side_unifying_rib_under_pauldron`, `v09_left_thigh_porcelain_outer_fairing_unified`, `v09_left_upper_arm_unified_porcelain_sleeve`, `v09_porcelain_pelvis_front_armor_lock_plate`, `v09_porcelain_pelvis_rear_armor_lock_plate`, `v09_right_ankle_block_terminal_no_ball`, `v09_right_elbow_faceted_mechanical_coupler_no_ball`, `v09_right_forearm_unified_graphite_inside_armor`, `v09_right_knee_rectangular_armored_hinge_no_ball`, `v09_right_shin_graphite_core_sleeve_clean`, `v09_right_shin_porcelain_front_splint`, `v09_right_side_unifying_rib_under_pauldron`, `v09_right_thigh_porcelain_outer_fairing_unified`, `v09_right_upper_arm_unified_porcelain_sleeve`, `v09_right_wrist_blade_interface_large_readable_clamp`

## Violet / Palette Lock

- V10_NEW_VIOLET_MESH_OBJECTS = `0`
- V10_NEW_VIOLET_MATERIALS = `0`
- No new violet areas were added.
- Existing rider slits and existing hoof signal points remain the only visible violet signal elements.
- New V1.0 blockout materials are cool steel, dark graphite, and porcelain only.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 local Eevee.
- REVIEW_RENDER = `3600 x 1800` contact sheet.
- LAYOUT = `3 x 2` panels.
- PANEL_CONTENT = full-front normal, full-side normal, 3/4 normal, full-front thumbnail, full-side thumbnail, 3/4 thumbnail.
- PNG_DIMENSION_CHECK = `3600 x 1800`.
- PNG_OPEN_INSPECTION = actual rendered PNG opened with Codex image viewer and Windows System.Drawing image API.
- PNG_PIXEL_EVIDENCE = sampled non-void pixels across all six panels: `3995,3255,3855,2373,1814,2041`; sampled violet pixels: `21`, consistent with existing signal-only areas.
- VISUAL_REVIEW_NOTE = V1.0 reads as a larger integrated mechanical blockout at normal and thumbnail scale; final visual ruling remains operator-owned.

## Validation

- SAVED_BLEND_REOPENED = yes.
- RIDER_OBJECTS_UNCHANGED = `True`.
- V10_OBJECT_COUNT = `32`.
- V10_FRAGMENTED_STEED_HIDDEN = `128`.
- V10_NEW_VIOLET_MESH_OBJECTS = `0`.
- V10_NEW_VIOLET_MATERIALS = `0`.
- PNG_DIMENSIONS = `3600 x 1800`.
- BLEND1_CHECK = no `.blend1` files found under `production/character` after cleanup.
- SCRATCH_CLEANUP = temporary Blender script and raw panel directory removed before proof/commit.
- WHITELISTED_CHANGED_FILES_EXPECTED =
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V1_0.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V1_0_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V1_0_PROOF.md`

## Commands Run

- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- Read canon-control, character visual spec, cine color contract, and V0.9 proof.
- Opened V0.9 contact sheet for visual inspection.
- Ran Blender V0.9 rider/object inspection.
- Created and ran temporary Blender V1.0 mount-integration script.
- Composed contact sheet with Windows System.Drawing.
- Opened V1.0 contact sheet for actual visual inspection.
- Reopened V1.0 blend and compared rider object fingerprint against V0.9.
- Opened PNG with Windows System.Drawing for dimensions/panel/pixel evidence.
- Removed `.blend1` and temporary scratch files.
- Checked git status before proof write.

## Evidence Source

- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, Codex image viewer inspection, Windows System.Drawing PNG open/pixel inspection, git stdout.
- REPOSITORY_BASE = branch `main`, base commit `8a50cf2 Add Mikage hero mount V0.9 rider cleanup candidate`.

## Closeout

- PASS_FAIL = `PASS_CANDIDATE_CREATED_FOR_OPERATOR_REVIEW`.
- PASS_CHECK_THUMBNAIL_HERO_MACHINE = pass candidate; full-front/full-side/3/4 thumbnail panels show a larger unified chassis read.
- PASS_CHECK_RIDER_LOCK = pass; rider objects unchanged.
- PASS_CHECK_NO_NEW_VIOLET = pass; no V1.0 violet mesh objects or materials.
- BLOCKER = none.
- NEXT_SAFE_ACTION = operator visual review of V1.0 blockout; do not push unless separately authorized.
- COMMIT_STATUS = pending at proof write time; final commit hash reported in final chat after commit.
- PUSH_STATUS = no push.
