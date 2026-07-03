# MIKAGE Stage E Cinematic V0.1 — Proof

TASK: `MIKAGE_STAGE_E_CINEMATIC_V0_1`
STATUS: `CANDIDATE / NOT FINAL / NOT CANON-LOCKED`
RESULT: PASS
BLOCKER: NONE

## Template and outputs

- Template extended directly: `production/environment/rig_derivatives/MIKAGE_STAGE_E_EXIT1_CINEMATIC_PROOF_V0_1.blend`.
- No reconstruction from the character/environment sources was performed.
- Derivative: `production/environment/rig_derivatives/MIKAGE_STAGE_E_CINEMATIC_V0_1.blend`.
- Video: `production/environment/reviews/MIKAGE_STAGE_E_CINEMATIC_V0_1.mp4`.
- Keyframes: `production/environment/reviews/MIKAGE_STAGE_E_CINEMATIC_V0_1_KEYFRAMES.png`.
- The only scene-setting change was render resolution `1280×720 → 1920×1080`; choreography, camera, lighting, materials, and colors were preserved.

SHA-256 before/after (identical):

- Template: `40e802658a095e2785c73793d6ba379e104c167aedb946af1a516a30fb2a5949`.
- Character source: `f5f17e2e7bc18d387bb7477d158def823604ccf829fb660b0a986ee7980ec0c5`.
- Environment source: `cebf49aca4bf9257b541cdbde9a4ac10afe1db81879cd3c65ef30dc3adbd4a8c`.
- `SOURCE_FILE_MODIFIED = NO`.

## Technical result — ffprobe confirmed

- H.264, `yuv420p`, `1920×1080`, landscape 16:9.
- `24 fps`, 168 frames, `7.000000 s`.
- One video stream only; no audio stream.
- Cut-to-black is the preserved deterministic post-process from `6.5→7.0 s` (frames 156→168).

## Choreography identity

- Sampled frames: `1, 100, 112, 132, 156, 168`.
- Stored template signature and derivative signature matched exactly for slit strength/hue, camera transform/lens, every axial-bone pose value, rest bones, and fade metadata.
- Order remains `dormant → ignite → awakened → cut to black`.
- Slit strength: `0.24` at frames 1/100; `12.0` at frames 112/132/156/168.
- Camera: same 48 mm lens and same push from `(0,-10,2.45)` to `(0,-7,2.45)`.
- Axial performance remains `spine_02 Z 1°`, `chest Z 1.5°`, `neck Y 3°`, `head Z 4°` after ignition; root stays zero.

## Color and scope checks

- Slit hue at every sampled frame: `(0.05,0,1,1)`, the approved linear input corresponding to `#8F00FF`; only strength animates.
- Halo material/color was unchanged and unanimated; halo remains white.
- Environment material/light violet scan: `[]`; `VIOLET_IN_ENVIRONMENT = NO`.
- Reopened derivative contains exactly seven bones: `root, pelvis, spine_01, spine_02, chest, neck, head`.
- New bones/meshes: `0 / 0`; locomotion: NO.
- All three blades remain unanimated and rigid-to-root; no separate blade animation.
- Audio: NONE.

## Verification and visual review

- Reopened saved derivative: `1920×1080`, 24 fps, frames 1–168, expected seven-bone rig and original camera.
- Actual MP4 frames were extracted at dormant `0.0s`, mid-push `3.5s`, ignite `4.67s`, awakened `6.25s`, and cut-black `6.96s`.
- The actual keyframe sheet was opened and inspected: framing/choreography match the proof template and the final frame reaches near-black.
- Gate schema: exactly `contact_sheet.png` and `contact_sheet_review_report.md`; MP4 remains outside gate.
- `.blend1 = NONE`.
- Validator: `python .mikage/tools/verify_output.py = PASS` (recorded after final gate validation).
- PUSH_STATUS: NOT PUSHED.
- NEXT_SAFE_ACTION: Lane B/operator review of this candidate.

No final/marketing, production-ready, canon-lock, asset-lock, push, or deploy claim is made.
