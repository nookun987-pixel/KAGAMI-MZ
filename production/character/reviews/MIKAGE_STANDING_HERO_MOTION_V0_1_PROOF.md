# MIKAGE STANDING HERO MOTION V0.1 — PROOF

## RESULT

```text
TASK_ID = MIKAGE_STANDING_HERO_MOTION_V0_1
PASS_FAIL = PASS
BLOCKER = NONE
OUTPUT_STATUS = CANDIDATE / NOT CANON-LOCKED
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend
BASE_SHA256 = C0D8A9785C794683004561CEFFA59F378F629EC83B2A498C1F42E20B9394239A
BODY_HASH_BEFORE = 9433DB0541801FB09483FFC0B14DDB32D692AFC616500F2B417DBAE4B8B192B0
BODY_HASH_AFTER = 9433DB0541801FB09483FFC0B14DDB32D692AFC616500F2B417DBAE4B8B192B0
NON_CAMERA_LIGHT_TRANSFORM_HASH_BEFORE = 3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99
NON_CAMERA_LIGHT_TRANSFORM_HASH_AFTER = 3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99
GEOMETRY_CHANGED = NO
NON_CAMERA_LIGHT_OBJECT_TRANSFORMS_CHANGED = NO
MATERIAL_HUE_OR_STRUCTURE_CHANGED = NO
ONLY_SLIT_EMISSION_STRENGTH_ANIMATED = YES
PUSH = NO
LOCK = NO
```

## Motion performed

- New derivative camera only; locked V0.14 mesh objects were not moved, rotated, or scaled.
- Orthographic breathing zoom is a cosine loop: `100 → 104 → 100%` over frames 1–91–181.
- The existing `V0_8_TWO_SLITS_ONLY` Principled emission strength alone is driven from `0.05 → 1.00 → 0.05` with the same cosine loop.
- Slit Base Color and Emission Color remain linear RGB `(0.2746773064, 0, 1, 1)`, corresponding to sRGB `#8F00FF`.
- Existing V0.14 cold single-key/void lighting is preserved. No halo, blade, body, or background violet was added.
- No text, logo, watermark, face/skin, warm color, anime treatment, or UI/HUD appears in the MP4.

## Reopen/hash verification

- Reopened `MIKAGE_STANDING_HERO_MOTION_V0_1.blend` in Blender 5.1.2.
- Mesh count: `101` before / `101` after.
- Object count: `138` before / `139` after; the sole addition is `V0_1_MOTION_CAMERA`.
- BODY/mesh hash is byte-for-byte identical before/after.
- Transform hash over every non-camera/non-light object is identical before/after, including the blade.
- Slit material driver found only at `Principled BSDF > Emission Strength`:
  `0.05+(1.00-0.05)*0.5*(1.0-cos(2.0*pi*(frame-1.0)/180.0))`.
- Locked source blend SHA256 remained `C0D8A9785C794683004561CEFFA59F378F629EC83B2A498C1F42E20B9394239A`.

## Canvas verification (ffprobe)

```text
codec_name = h264
codec_type = video
width = 1080
height = 1920
pix_fmt = yuv420p
r_frame_rate = 30/1
duration = 6.033333
audio_streams = 0
```

- Frame 1 and frame 181 are visually identical; measured mean absolute RGB difference rounds to `(0.0, 0.0, 0.0)`.
- Actual dormant/mid/awakened renders and the generated keyframe strip were opened and inspected.
- Full body, helmet, halo, cloak hem, and complete blade remain inside frame in all inspected states.

## SLIT_HUE_PIXEL_SAMPLE

Awakened frame `F091`, sampled from the two visible slit cores:

```text
sample_count = 585
sample_mean_rgb = (150.3, 35.1, 243.6)
sample_hex = #9623F4
core_count = 458
core_mean_rgb = (150.8, 23.9, 248.0)
core_hex = #9718F8
core_B_minus_R = 97.2
verdict = VIOLET / NOT RED-DOMINANT MAGENTA
```

## Outputs and SHA256

- `MIKAGE_STANDING_HERO_MOTION_V0_1.blend` — `F141D6814FE68AFAE2144D29F7C0937784B04F222E5B3C51C096C4DAED8B11A6`
- `MIKAGE_STANDING_HERO_MOTION_V0_1.mp4` — `A6680C56BAA411E7B3D5D39DCC49972618D70A999C861EB09A9CF77CD218B4CE`
- `MIKAGE_STANDING_HERO_MOTION_V0_1_KEYFRAMES.png` — `F56F3E00157300BD15D5DC4747B3431FE229E05ADE312C070500D8E1E199A318`

## Validation notes

- Gate folder is restricted to `contact_sheet.png` and `contact_sheet_review_report.md`; the MP4 is not in the gate.
- No `.blend1` backup remains.
- No commit, push, deploy, canon-lock, or asset-lock was performed.
- Final visual ruling remains with the operator.

## Commands/evidence

- Reliable local PowerShell preflight: workspace, clean porcelain status, branch `main`, HEAD `e0c1e52`.
- Blender 5.1.2 base audit, derivative save, Eevee frame render, and clean reopen audit.
- ffmpeg 8.1.1 H.264 encode; ffprobe stream/format inspection.
- Pillow keyframe-strip generation, loop comparison, and slit pixel sampling.
- `python .mikage\tools\verify_output.py` used as final deterministic gate validator.

NEXT_SAFE_ACTION = Lane B drift-check and operator visual ruling only.

