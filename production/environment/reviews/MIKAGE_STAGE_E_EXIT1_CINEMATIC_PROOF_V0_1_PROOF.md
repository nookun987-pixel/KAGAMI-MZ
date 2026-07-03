# MIKAGE Stage E Exit 1 Cinematic Proof V0.1 — Proof

TASK: `MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1`
STATUS: `CANDIDATE / PROOF SHOT / NOT CANON-LOCKED`
RESULT: PASS
BLOCKER: NONE

## Sources and derivative

- CHARACTER_SOURCE: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
- ENVIRONMENT_SOURCE: `production/environment/sets/MIKAGE_HALLWAY_ENVIRONMENT_V0_1.blend`
- DERIVATIVE_BLEND: `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend`
- VIDEO: `production/environment/reviews/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.mp4`
- KEYFRAMES: `production/environment/reviews/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1_KEYFRAMES.png`
- Character position: `(0,8,0)`.

Source SHA-256 before/after:

- Character: `f5f17e2e7bc18d387bb7477d158def823604ccf829fb660b0a986ee7980ec0c5`
- Environment: `cebf49aca4bf9257b541cdbde9a4ac10afe1db81879cd3c65ef30dc3adbd4a8c`
- `SOURCE_FILE_MODIFIED = NO` for both files.

## Technical specification — ffprobe confirmed

- Codec: H.264
- Pixel format: `yuv420p`
- Resolution: `1280×720`
- Frame rate: `24 fps`
- Duration: `7.000000 s`
- Frames: 168
- Streams: one video stream only; no audio
- This is a landscape cinematic proof specification, not Spotify Canvas.

## Slit animation

- Source emission strength: `1.75`.
- Proof awakened peak: `12.0`, selected so the signal remains readable at hallway scale.
- Dormant: `0.24` = exactly 2% of peak, frames 1–100.
- Fast ignite: frames 100→112 (`4.17→4.67 s`).
- Awakened hold: frames 112→168.
- Emission hue input before/after and at sampled frames 1/100/112/132/156/168: `(0.05,0,1,1)`, the existing approved linear violet input corresponding to the locked `#8F00FF` target.
- Only `Emission Strength` was keyed; `Emission Color` was never assigned or keyed.
- `SLIT_HUE_FAIL = NO`.

## Performance and blade lock

Performance begins after ignition and remains intentionally smaller than Gate B:

- `spine_02`: local-Z `1.0°`.
- `chest`: local-Z `1.5°`.
- `neck`: local-Y `3.0°`.
- `head`: local-Z `4.0°`.
- Existing rig bones: exactly `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`.
- New bones/meshes created: `0 / 0`.
- Locomotion/walk/step attempted: NO.
- Root rotation remains zero at all sampled frames.
- All three blade objects have no animation data and retain their rigid-to-root binding.
- `SCOPE_VIOLATION = NO`.

## Camera and cut

- Camera: `ENV_HALLWAY_STATIC_CAMERA`, fixed 48 mm lens.
- Start: `(0,-10,2.45)` at frame 1.
- End: `(0,-7,2.45)` at frame 156; held through frame 168.
- Motion: smooth 3-unit push along the hallway axis; no abrupt FOV change.
- Fade-to-black: deterministic FFmpeg post-process from `6.5→7.0 s` (frames 156→168), recorded in derivative custom metadata.
- Final extracted frame mean RGB: `(0.39,0.56,0.45)`, versus awakened frame `(12.92,15.96,18.65)`; cut-to-black verified.

## Color/environment checks

- Environment material/light violet scan: `[]`.
- `VIOLET_IN_ENVIRONMENT = NO`.
- Halo material was not changed or animated; it remains white throughout sampled frames.
- Slit violet exists only on the two character sensor slits.
- `HALO_COLOR_VIOLATION = NO`.

## Visual review

- Actual MP4 keyframes were extracted at dormant `0.0s`, mid-push `3.5s`, ignite `4.67s`, awakened `6.25s`, and cut-black `6.96s`.
- The extracted keyframe sheet was opened and inspected.
- Camera push reads continuously; subtle axial performance reads without deformation stress; blade stays planted with root; final fade reaches near-black.

## Gate/status

- Gate contains only `contact_sheet.png` and `contact_sheet_review_report.md`; MP4 remains outside gate.
- `.blend1 = NONE` subject to final cleanup check.
- PUSH_STATUS: NOT PUSHED.
- NEXT_SAFE_ACTION: Lane B/operator proof-shot review.

No final/marketing, production-ready, canon-lock, asset-lock, push, or deploy claim is made.

