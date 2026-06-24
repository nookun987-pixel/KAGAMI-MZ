# MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13.blend`

Brief:
- `production/character/build_log/LANEA_CODEX_TASK_VIOLET_GRAIN_V0_1.md`

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend`
- `production/character/reviews/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_PROOF.md`

Contact sheet:
- Layout: 4 panels: full mount / rider slit-core close / steed grain read / reveal-crop candidate
- Dimensions: `4800x900`
- Mode: RGB Eevee material render

## Scope Performed

Violet signal pass:
- Created material `v14_violet_8f00ff_controlled_signal_slit_core_one_seam`.
- Assigned violet only to:
  - `v08_rider_graphite_underlayer_tall_core`
  - `v08_rider_two_slit_signal_lower_only`
  - `v08_rider_two_slit_signal_upper_only`
  - `v11_rider_cuirass_keystone_sharp_front`
- Demoted prior violet hoof signal objects to non-emissive cold steel so V0.14 remains slit/core/one-seam only:
  - `steed_front_far_tiny_violet_hoof_signal_point`
  - `steed_front_near_tiny_violet_hoof_signal_point`
  - `steed_rear_far_tiny_violet_hoof_signal_point`
  - `steed_rear_near_tiny_violet_hoof_signal_point`
  - `v02_03_front_far_minimal_hoof_signal_point`
  - `v02_03_front_near_minimal_hoof_signal_point`
  - `v02_03_rear_far_minimal_hoof_signal_point`
  - `v02_03_rear_near_minimal_hoof_signal_point`
- Steed head sensor slits remain graphite/no-violet.

Anti-toy surface:
- Added procedural fine-grain bump to porcelain: `v13_porcelain_f2eeea_soft_matte_reflection`. Applied: `True`.
- Added procedural fine-grain bump to cold steel: `v13_cold_steel_zblue_4b5866_non_emissive_sharp_specular`. Applied: `True`.
- No mesh objects were added for grain; this is material-node surface texture only.

## Preservation

Geometry/silhouette/pose:
- No mesh objects were added or removed.
- Mesh count before: `315`
- Mesh count after: `315`
- Mesh-count match: `True`
- Source V0.13 unchanged by timestamp check: `True`

Forbidden changes avoided:
- No rig, animation, motion, warm color, flood, large halo, crimson, or gold.
- No canon-lock, asset-lock, final/pass claim, or push.

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background open of V0.13 with `_tmp\build_v0_14_violet_grain.py`
- `python .mikage\tools\verify_output.py`
- PNG dimension check from generated image metadata
- `.blend1` cleanup check

Direct checks:
- V0.14 blend exists and was saved at timestamp `1782279609.117077`.
- Contact sheet exists: `4800x900`, RGB.
- Source V0.13 timestamp stayed unchanged: `True`.
- Mesh count preserved: `True`.

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so `_tmp/mikage_v0_14_gate/gate_report.txt` is used for that tool PASS. Real output verification above is recorded separately by direct file, image, mesh-count, source timestamp, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14

CREATED:
- production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_MATERIAL_EEVEE_V0_13.blend
- geometry / silhouette / pose / rig / motion
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- Blender mesh-count preservation check
- source V0.13 timestamp check
- contact sheet dimension check `4800x900`
- V0.14 proof report contains RESULT block

BLOCKERS:
- none for V0.14 candidate creation

NEXT_SAFE_TASK:
- Lane B drift-check of V0.14 candidate contact sheet; then BOOS approval before reveal crop or V0.15 motion.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
