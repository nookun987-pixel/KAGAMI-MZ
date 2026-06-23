# MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.blend`

Reason:
- Used V0.9 motion blend because the task explicitly named it as base and it contained the assembled rider + steed state needed for a still derivative.
- No rig, animation, locomotion, rider, blade, helmet, hair, mantle, or armor work was performed.

Reference inputs:
- `production/character/build_log/LANEA_CODEX_TASK_STEED_CORRECTION_V0_1.md`
- `production/character/keyart_candidates/MIKAGE_HERO_MOUNT_EEVEE_V0_9_DRIFT_CHECK.md` items 1 and 2
- `MIKAGE_STEED_SKELETON_BW_V0_5` treated as DRAFT art-direction reference, not SSOT.

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10.blend`
- `production/character/reviews/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10_PROOF.md`

Contact sheet:
- Layout: 3 view, side / three-quarter / front
- Mode: grayscale contact sheet
- Dimensions: `3600x900`

## Scope Performed

1. Steed head correction only:
- Added V0.10 equine wedge head object: `v10_equine_wedge_head_forehead_muzzle_jaw_no_face`.
- Added separate lower jaw and neck sweep planes.
- Added embedded graphite sensor slit inside the head: `v10_equine_embedded_graphite_sensor_slit_no_violet_no_eye`.
- No human face, eyes, added violet, or new color signal was added.

2. Steed body correction only:
- Added continuous chassis/barrel: `v10_steed_continuous_chassis_barrel_not_flat_box`.
- Added raised withers and croup masses.
- Added curved spine plates `v10_steed_curved_spine_plate_01` through `_05`.
- Added belly keel: `v10_steed_deep_belly_keel_under_chassis`.
- Old box/platform-read head/body components were hidden from render in the derivative; leg and rider systems were preserved.

## Preservation

Rider preservation:
- Reopen inspection found `31` rider/blade V0.8 objects still present under `v08_rider*` / `v08_zenith*`.
- Rider armor, hair, mantle, blade, helmet, pose, rig, and motion were not redesigned.

Violet preservation:
- No new violet material or signal object was created.
- Reopen inspection found existing violet-signal objects only: rider two slits plus hoof signal objects already present in the base lineage.
- V0.10 sensor slit in the steed head is graphite, not violet.

Palette/material:
- Grayscale clay/contact review only.
- No warm color, halo, flood, crimson, gold, or material deepening.

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background open of V0.9 with `_tmp\build_v0_10_steed_shape.py`
- `python _tmp\make_v0_10_contact_sheet.py`
- Visual inspection of contact sheet in Codex image viewer
- Blender 5.1 background reopen of V0.10 with `_tmp\inspect_v0_10_reopen.py`
- `python -c "from PIL import Image; ..."` for PNG dimensions
- `Get-ChildItem -Recurse -Filter '*.blend1'`
- `python .mikage\tools\verify_output.py`

Direct checks:
- `validate_task.py`: PASS
- `verify_output.py`: PASS
- V0.10 blend exists and reopens.
- V0.10 object count from reopen: `15` V0.10 scope objects.
- Contact sheet exists: `3600x900`, RGB file after grayscale composite.
- `.blend1`: cleared; no `.blend1` remained in final cleanup check.
- Source V0.9 timestamp stayed `2026-06-23 19:24:54`; source was not overwritten.

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so a minimal `_tmp/mikage_v0_10_gate/gate_report.txt` marker is used for that tool PASS. Real output verification above is recorded separately by direct file, image, reopen, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10

CREATED:
- production/character/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10.blend
- production/character/reviews/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10_CONTACT_SHEET.png
- production/character/reviews/MIKAGE_HERO_MOUNT_STEED_SHAPE_CORRECTION_EEVEE_V0_10_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_MOTION.blend
- rider armor / hair / mantle / blade / helmet geometry
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- Blender reopen check
- contact sheet visual inspection
- PNG dimension check `3600x900`
- final `.blend1` cleanup check
- `validate_task.py` PASS
- `verify_output.py` PASS

BLOCKERS:
- none

NEXT_SAFE_TASK:
- Operator/Lane B review of V0.10 candidate contact sheet for drift-check items 1 and 2.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
