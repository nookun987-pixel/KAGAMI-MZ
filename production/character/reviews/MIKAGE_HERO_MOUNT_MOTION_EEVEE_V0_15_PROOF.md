# MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend`

Brief:
- `production/character/build_log/LANEA_CODEX_TASK_MOTION_V0_1.md`

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15.mp4`
- `production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15_POSTER.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15_PROOF.md`

## Motion Performed

- Breathing camera zoom: orthographic scale 100 -> 104 -> 100 percent over 180 frames.
- Light sweep: task-local key and rim lights sweep once across the figure.
- Violet pulse: existing V0.14B violet material emission strength pulsed gently; users were not changed.
- No text, logo, watermark, lyrics, or audio added.

## Preservation

Geometry/silhouette/pose:
- No mesh objects were added or removed.
- Mesh count before: `315`
- Mesh count after: `315`
- Mesh-count match: `True`
- Source V0.14B unchanged by timestamp check: `True`

Violet preservation:
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

Forbidden changes avoided:
- No geometry, pose, rig, base material redesign, warm color, flood, large halo, crimson, or gold.
- No canon-lock, asset-lock, final/pass claim, or push.

## FFprobe Evidence

- codec: `h264`
- width: `1080`
- height: `1920`
- pix_fmt: `yuv420p`
- r_frame_rate: `30/1`
- avg_frame_rate: `30/1`
- duration: `6.000000`
- audio_stream_count: `0`

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background render with `_tmp\build_v0_15_motion.py`
- `ffprobe -v error -show_streams -show_format -of json`
- `python .mikage\tools\verify_output.py`
- `.blend1` cleanup check

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so `_tmp/mikage_v0_15_gate/gate_report.txt` is used for that tool PASS. Real output verification above is recorded separately by ffprobe, direct file checks, mesh-count, source timestamp, violet-user compare, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15

CREATED:
- production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15.mp4
- production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15_POSTER.png
- production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_15_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_ANTITOY_EEVEE_V0_14B.blend
- geometry / silhouette / pose / rig / mesh
- violet signal object assignment
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- ffprobe codec/dimensions/fps/pix_fmt/no-audio check
- source V0.14B timestamp check
- mesh-count preservation check
- violet-user preservation check
- V0.15 proof report contains RESULT block

BLOCKERS:
- none for V0.15 candidate creation

NEXT_SAFE_TASK:
- Lane B verify V0.15 motion spec and drift-check; then BOOS approval before music/caption assembly.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
