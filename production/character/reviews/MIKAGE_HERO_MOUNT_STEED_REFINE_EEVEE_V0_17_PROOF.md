# MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_GEOMETRY_REFINE_EEVEE_V0_16.blend`

Brief:
- `production/character/build_log/LANEA_CODEX_TASK_STEED_REFINE_V0_1.md`

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend`
- `production/character/reviews/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17_PROOF.md`

Contact sheet:
- Layout: 4 panels: full mount / steed head close / steed leg-joint close / hero crop
- Dimensions: `4800x900`
- Mode: RGB Eevee material render

## Steed Refine Performed

Steed head:
- Hid older blob/head helper parts from render: `3`.
  - `steed_head_long_sensor_skull`
  - `v04_equine_graphite_head_main_wedge_mass`
  - `v04_equine_graphite_muzzle_low_block_mass`
- Added stylized faceless equine head/muzzle/jaw/neck forms using existing graphite, porcelain, and Z-Blue steel materials:
  - `v17_steed_equine_long_graphite_skull_faceless`
  - `v17_steed_equine_tapered_muzzle_porcelain_plane`
  - `v17_steed_equine_lower_jaw_graphite_underplane`
  - `v17_steed_equine_neck_transition_steel_keel`
  - `v17_steed_equine_no_eye_sensor_groove_graphite`

Steed legs:
- Added stylized shoulder/hip, knee/hock, lower support, and hoof contact pads to all four existing leg positions:
  - `v17_steed_front_near_shoulder_hip_joint_mass`
  - `v17_steed_front_near_upper_leg_angular_sleeve`
  - `v17_steed_front_near_knee_hock_readable_joint`
  - `v17_steed_front_near_lower_leg_tapered_support`
  - `v17_steed_front_near_hoof_contact_pad_flat_grounded`
  - `v17_steed_front_far_shoulder_hip_joint_mass`
  - `v17_steed_front_far_upper_leg_angular_sleeve`
  - `v17_steed_front_far_knee_hock_readable_joint`
  - `v17_steed_front_far_lower_leg_tapered_support`
  - `v17_steed_front_far_hoof_contact_pad_flat_grounded`
  - `v17_steed_rear_near_shoulder_hip_joint_mass`
  - `v17_steed_rear_near_upper_leg_angular_sleeve`
  - `v17_steed_rear_near_knee_hock_readable_joint`
  - `v17_steed_rear_near_lower_leg_tapered_support`
  - `v17_steed_rear_near_hoof_contact_pad_flat_grounded`
  - `v17_steed_rear_far_shoulder_hip_joint_mass`
  - `v17_steed_rear_far_upper_leg_angular_sleeve`
  - `v17_steed_rear_far_knee_hock_readable_joint`
  - `v17_steed_rear_far_lower_leg_tapered_support`
  - `v17_steed_rear_far_hoof_contact_pad_flat_grounded`

## Preservation

Source:
- Source V0.16 unchanged by timestamp check: `True`

Mesh counts:
- Mesh object count before: `315`
- Mesh object count after: `340`
- Vertex count before: `16662`
- Vertex count after: `19952`
- Polygon count before: `16610`
- Polygon count after: `20066`

Protected rider/blade/helmet:
- Protected snapshot unchanged: `True`
- Protected object count checked: `72`

Violet/material:
- Violet users before:
  - `v08_rider_graphite_underlayer_tall_core`
  - `v08_rider_two_slit_signal_lower_only`
  - `v08_rider_two_slit_signal_upper_only`
  - `v11_rider_cuirass_keystone_sharp_front`
- Violet users after:
  - `v08_rider_graphite_underlayer_tall_core`
  - `v08_rider_two_slit_signal_lower_only`
  - `v08_rider_two_slit_signal_upper_only`
  - `v11_rider_cuirass_keystone_sharp_front`
- Violet users unchanged: `True`
- New steed objects use existing material datablocks only: porcelain / graphite / Z-Blue steel.

Forbidden changes avoided:
- No rider/blade/helmet transform/material/mesh mutation, no violet-user mutation, no warm color/flood/halo/crimson/gold.
- No canon-lock, asset-lock, final/pass claim, or push.

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background open of V0.16 with `_tmp\build_v0_17_steed_refine.py`
- `python .mikage\tools\verify_output.py`
- PNG dimension check from generated image metadata
- `.blend1` cleanup check

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so `_tmp/mikage_v0_17_gate/gate_report.txt` is used for that tool PASS. Real output verification above is recorded separately by direct file, image, source timestamp, protected-object snapshot, violet-user compare, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17

CREATED:
- production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_GEOMETRY_REFINE_EEVEE_V0_16.blend
- rider / blade / helmet protected snapshot
- violet signal object assignment
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- source V0.16 timestamp check
- protected rider/blade/helmet snapshot compare
- violet-user preservation check
- contact sheet dimension check `4800x900`
- V0.17 proof report contains RESULT block

BLOCKERS:
- none for V0.17 candidate creation

NEXT_SAFE_TASK:
- Lane B drift-check V0.17 steed refine; then BOOS approval before re-rendered motion on the refined mount.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
