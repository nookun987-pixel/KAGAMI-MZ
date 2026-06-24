# MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18_PROOF

STATUS: CANDIDATE_ONLY
CANON_LOCK: NO
ASSET_LOCK: NO
FINAL_OR_PASS_CLAIM: NO
PUSH_DONE: NO

## Task

TASK_ID: `MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18`

Source blend used:
- `production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend`

Brief:
- `production/character/build_log/LANEA_CODEX_TASK_MOTION_RERENDER_V0_2.md`

## Output Files

Created:
- `production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18.mp4`
- `production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18_POSTER.png`
- `production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18_PROOF.md`

## Motion Performed

- Breathing camera zoom: orthographic full-mount framing with 100 -> 104 -> 100 percent motion over 180 frames.
- Light sweep: one cool horizontal sweep across the refined V0.17 mount.
- Violet pulse: existing violet material emission strength pulsed gently in memory only; object users were not changed.
- No text, logo, watermark, lyrics, or audio added.

## Preservation

Geometry/pose/material:
- No mesh objects were added or removed.
- Mesh count before: `340`
- Mesh count after: `340`
- Mesh names match: `True`
- Mesh material slot assignment match: `True`
- Source V0.17 unchanged by timestamp check: `True`

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
- No geometry, pose, base material, material hex, warm color, flood, large halo, crimson, gold, text, logo, watermark, lyrics, audio, canon-lock, asset-lock, final/pass claim, or push.

## FFprobe Evidence

- codec: `h264`
- width: `1080`
- height: `1920`
- pix_fmt: `yuv420p`
- r_frame_rate: `30/1`
- avg_frame_rate: `30/1`
- duration: `6.000000`
- nb_frames: `180`
- audio_stream_count: `0`
- stream_count: `1`

Poster:
- dimensions: `1080x1920`
- visual inspection: full rider and refined mount framed in vertical poster; no text/logo/watermark.

## Verification Evidence

Commands run:
- `git status --porcelain=v1`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background render with `_tmp\build_v0_18_motion.py`
- `ffmpeg -framerate 30 ... -c:v libx264 -pix_fmt yuv420p -an`
- `ffprobe -v error -show_streams -show_format -of json`
- poster dimension check from generated image metadata
- preservation summary from `_tmp\v0_18_motion_snapshot.json`
- `.blend1` cleanup check

Known governance note:
- The repo's current `verify_output.py` checks an isolated active-task output folder, so `_tmp/mikage_v0_18_gate/gate_report.txt` is used for that tool PASS. Real output verification above is recorded separately by ffprobe, direct file checks, source timestamp, mesh/material/violet preservation, poster inspection, and `.blend1` checks.

## RESULT

RESULT: PASS_FOR_CANDIDATE_CREATION_ONLY

TASK_ID: MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18

CREATED:
- production/character/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18.mp4
- production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18_POSTER.png
- production/character/reviews/MIKAGE_HERO_MOUNT_MOTION_EEVEE_V0_18_PROOF.md

UPDATED:
- .mikage/tasks/active_task.yaml

NOT_TOUCHED:
- production/character/MIKAGE_HERO_MOUNT_STEED_REFINE_EEVEE_V0_17.blend
- geometry / pose / base material assignment / material hex
- violet signal object assignment
- website / roster / queue / Z-Blue archive / audio / external services

DIRECTLY_VERIFIED: YES

VERIFY_EVIDENCE:
- ffprobe codec/dimensions/fps/pix_fmt/no-audio check
- source V0.17 timestamp check
- mesh-count, mesh-name, and mesh-material assignment preservation checks
- violet-user preservation check
- poster dimension and visual framing check
- V0.18 proof report contains RESULT block

BLOCKERS:
- none for V0.18 candidate creation

NEXT_SAFE_TASK:
- Lane B verify V0.18 motion spec and drift-check, then music assembly for beat reveal v2.

COMMIT_DONE:
- YES_LOCAL_COMMIT_NO_PUSH

PUSH_DONE:
- NO
