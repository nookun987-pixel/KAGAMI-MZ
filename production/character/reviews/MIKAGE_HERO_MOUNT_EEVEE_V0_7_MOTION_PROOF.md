# MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.blend`
- OUTPUT_MP4 = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.mp4`
- KEYFRAME_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_KEYFRAMES.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Motion Performed

1. CAMERA BREATHING ZOOM
   - Orthographic camera animated on a smooth/cosine-style 100 -> 104 -> 100 percent breathing zoom.
   - Vertical full-frame composition keeps the complete rider and mount inside frame.

2. COOL LIGHT SWEEP
   - Added animated cool rim light sweep across the static V0.6 model.
   - Preserved V0.6 material treatment and void background.

3. VIOLET SIGNAL PULSE
   - Animated existing violet signal material only.
   - Restricted to existing rider two slits and hoof signal points.
   - No ambient violet, halo, wash, text, logo, or audio was added.

## Locked Preservation

- MODEL_STATIC = yes; no rig, deformation, locomotion, walk cycle, mesh transform, or geometry edit.
- GEOMETRY_FINGERPRINT_UNCHANGED = `True`
- MATERIAL_GEOMETRY_POLICY = V0.6 materials preserved; only animation keyframes were added to camera, light, and violet signal strength.
- PALETTE_LOCK = void `#050508`, porcelain `#f2eeea`, violet `#8F00FF` signal only.

## Render Evidence

- FRAME_SPEC_TARGET = `1080 x 1920`, H.264, `yuv420p`, 30 fps, approximately 7 seconds, no audio.
- FRAME_RANGE = `1-210`
- FPS = `30`
- DURATION_TARGET = `7.0 seconds`
- KEYFRAME_SHEET_LAYOUT = `3 vertical keyframes: frame 1, frame 105, frame 210`
- MP4_VALIDATION =
  - `codec_name=h264`
  - `width=1080`
  - `height=1920`
  - `pix_fmt=yuv420p`
  - `r_frame_rate=30/1`
  - `avg_frame_rate=30/1`
  - `duration=7.000000`
  - `nb_frames=210`
  - audio stream probe returned no audio stream
- KEYFRAME_SHEET_DIMENSIONS = `3240 x 1920`
- VOID_BACKGROUND_CHECK = keyframe sheet sampled pixels: `20,20 = 5,4,7`; `1600,20 = 5,4,7`; `3220,20 = 5,4,7`
- VISUAL_INSPECTION = actual keyframe sheet and MP4 mid-frame were opened and inspected; model is visible, full-frame in the vertical crop, no burn text/logo, violet remains signal-only.
- VISUAL_APPROVAL = not claimed; final motion ruling belongs to operator.

## Validation

- SAVED_BLEND_REOPENED = yes, V0.7 motion blend was reopened after save.
- SOURCE_OVERWRITE_CHECK = V0.6 source opened as input; output saved to new V0.7 motion blend path.
- BLEND1_CHECK = no `.blend1` backup remains after explicit cleanup/check before commit.
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md`
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION.mp4`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_KEYFRAMES.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_7_MOTION_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source checks; Blender V0.7 motion save/reopen/render; MP4 probe; keyframe PNG dimension check; actual keyframe and mp4 inspection; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, media probe stdout, actual visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator motion review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
