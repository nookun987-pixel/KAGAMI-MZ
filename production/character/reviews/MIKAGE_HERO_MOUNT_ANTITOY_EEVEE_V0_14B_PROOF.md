# MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend`

Brief:
- `production/character/build_log/LANEA_CODEX_TASK_ANTITOY_MATERIAL_V0_1.md`

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend`
- `production/character/reviews/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B_PROOF.md`

Contact sheet:
- Layout: 4 panels: full mount / rider slit close / grain-edge read / reveal-crop candidate
- Dimensions: `4800x900`
- Mode: RGB Eevee material render

## Scope Performed

Anti-toy lighting:
- Rebuilt task-local render lighting as directional key, soft fill, cool rim, and low contact-shadow control.
- Render exposure lowered to reduce porcelain blowout.
- Ambient occlusion enabled for contact/cavity read.
- Background/world kept void `#050508`.

Anti-toy surface:
- Porcelain material kept base hex `#f2eeea`; strengthened procedural fine grain, roughness variation, and subtle cavity value.
- Cold-steel material kept Z-Blue `#4b5866`; strengthened grain and roughness variation.
- Graphite material kept dark matte; added lighter surface micro-grain.
- No mesh object was added or removed for grain/wear.

Violet preservation:
- Violet material was not edited.
- Violet signal users before:
  - `v08_rider_graphite_underlayer_tall_core`
  - `v08_rider_two_slit_signal_lower_only`
  - `v08_rider_two_slit_signal_upper_only`
  - `v11_rider_cuirass_keystone_sharp_front`
- Violet signal users after:
  - `v08_rider_graphite_underlayer_tall_core`
  - `v08_rider_two_slit_signal_lower_only`
  - `v08_rider_two_slit_signal_upper_only`
  - `v11_rider_cuirass_keystone_sharp_front`
- Violet users unchanged: `True`
- Violet material slot mapping unchanged: `True`

## Preservation

Geometry/silhouette/pose:
- No mesh objects were added or removed.
- Mesh count before: `315`
- Mesh count after: `315`
- Mesh-count match: `True`
- Source V0.14 unchanged by timestamp check: `True`

Forbidden changes avoided:
- No rig, animation, motion, geometry, pose, violet placement/strength edit, warm color, flood, halo, crimson, or gold.
- No canon-lock, asset-lock, final/pass claim, or push.

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background open of V0.14 with `_tmp\build_v0_14b_antitoy.py`
- `python .mikage\tools\verify_output.py`
- PNG dimension check from generated image metadata
- `.blend1` cleanup check

Direct checks:
- V0.14B blend exists.
- Contact sheet exists: `4800x900`, RGB.
- Source V0.14 timestamp stayed unchanged: `True`.
- Mesh count preserved: `True`.
- Violet users preserved: `True`.

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so `_tmp/mikage_v0_14b_gate/gate_report.txt` is used for that tool PASS. Real output verification above is recorded separately by direct file, image, mesh-count, source timestamp, violet-user compare, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B

CREATED:
- production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_VIOLET_GRAIN_EEVEE_V0_14.blend
- geometry / silhouette / pose / rig / motion
- violet signal placement and material assignment
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- Blender mesh-count preservation check
- source V0.14 timestamp check
- violet material user/slot preservation check
- contact sheet dimension check `4800x900`
- V0.14B proof report contains RESULT block

BLOCKERS:
- none for V0.14B candidate creation

NEXT_SAFE_TASK:
- Lane B drift-check of V0.14B anti-toy candidate contact sheet; then BOOS approval before reveal crop or V0.15 motion.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
