# MIKAGE STANDING HERO MOTION V0.2 — PROOF

## RESULT

```text
TASK_ID = MIKAGE_STANDING_HERO_MOTION_V0_2
PASS_FAIL = PASS
BLOCKER = NONE
OUTPUT_STATUS = CANDIDATE / NOT CANON-LOCKED
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_MOTION_V0_1.blend
BASE_SHA256_BEFORE = F141D6814FE68AFAE2144D29F7C0937784B04F222E5B3C51C096C4DAED8B11A6
BASE_SHA256_AFTER = F141D6814FE68AFAE2144D29F7C0937784B04F222E5B3C51C096C4DAED8B11A6
BODY_HASH_BEFORE = 9433DB0541801FB09483FFC0B14DDB32D692AFC616500F2B417DBAE4B8B192B0
BODY_HASH_AFTER = 9433DB0541801FB09483FFC0B14DDB32D692AFC616500F2B417DBAE4B8B192B0
NON_CAMERA_LIGHT_TRANSFORM_HASH_BEFORE = 3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99
NON_CAMERA_LIGHT_TRANSFORM_HASH_AFTER = 3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99
GEOMETRY_CHANGED = NO
OBJECT_TRANSFORMS_CHANGED = NO
CAMERA_OR_BREATHING_ZOOM_CHANGED = NO
MATERIAL_HUE_OR_STRUCTURE_CHANGED = NO
AWAKENED_PEAK_RAISED = NO
BLOOM_INCREASED = NO
ONLY_SLIT_EMISSION_STRENGTH_CURVE_CHANGED = YES
PUSH = NO
LOCK = NO
```

## Pulse re-curve

Only `V0_8_TWO_SLITS_ONLY > Principled BSDF > Emission Strength` was re-curved:

| State | Frame | Strength | Percent of peak |
|---|---:|---:|---:|
| Dormant | 1 | 0.02 | 2% |
| Dormant hold | 100–110 | 0.02 | 2% |
| Mid ignition | 117 | 0.35 | 35% |
| Awakened | 127–145 | 1.00 | 100% |
| Mid decay | 158 | 0.35 | 35% |
| Dormant return | 169–181 | 0.02 | 2% |

- Ignition midpoint is frame 117 (`64.4%` of the clip), and peak arrives at frame 127 (`70.0%`), inside the required 60–75% window.
- Dormant is below the V0.1 baseline of 5%.
- Awakened peak remains exactly V0.1's `1.00`; no bloom or light change was used.
- Frame 1 and frame 181 match; measured loop mean absolute RGB difference is approximately `(0.000001, 0, 0)`.

## Reopen and lock verification

- Reopened the saved V0.2 blend in Blender 5.1.2.
- Object count remains `139`; mesh count remains `101`.
- BODY/mesh hash and non-camera/non-light transform hash exactly match V0.1.
- Camera object remains `V0_1_MOTION_CAMERA` with unchanged matrix and unchanged breathing driver:
  `6.70/(1.0+0.04*0.5*(1.0-cos(2.0*pi*(frame-1.0)/180.0)))`.
- Resolution, timeline, and fps remain `1080 × 1920`, frames `1–181`, `30 fps`.
- Slit Base Color and Emission Color remain linear RGB `(0.2746773064, 0, 1, 1)`, corresponding to sRGB `#8F00FF`.
- V0.1 base SHA256 remained unchanged after execution.

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

## SLIT_HUE_PIXEL_SAMPLE

The actual rendered dormant/mid/awakened frames and final keyframe sheet were opened and inspected.

| State | Core sample | Core luma | B−R |
|---|---|---:|---:|
| Dormant | `#7C19D9` | 59.8 | 92.6 |
| Mid | `#8619E8` | 62.8 | 98.6 |
| Awakened | `#971AF7` | 68.9 | 96.4 |

Awakened sample count: `580`; core count: `472`. Verdict: violet / blue-dominant, not red-dominant magenta. Violet remains confined to exactly two slits.

## Visual inspection

- Dormant, mid, and awakened states are ordered in brightness and the ignition is temporally compressed rather than spread across the clip.
- Full helmet, halo, cloak hem, and complete blade remain inside the vertical frame.
- No text/logo/watermark is burned into the MP4; no face/skin, warm color, anime treatment, fake UI, violet wash, or neon fill appears.
- Final aesthetic approval remains with the operator.

## Outputs and SHA256

- `MIKAGE_STANDING_HERO_MOTION_V0_2.blend` — `FBBA41671497E3F155C41A415B3D4ED2077B8C89228390A09FAD6AF8E235A16B`
- `MIKAGE_STANDING_HERO_MOTION_V0_2.mp4` — `F41819D818736B355102F117665A52113C7EDBB9494BE9E5AAC9E30A834187FB`
- `MIKAGE_STANDING_HERO_MOTION_V0_2_KEYFRAMES.png` — `0340A5C32D4B6C2A884FF3466E48C95B214C9617FE4EE3636AFD46D87FABBDD6`

## Process evidence

- Reliable local preflight: clean repo, branch `main`, HEAD `5b4d2d4`.
- Blender base audit, derivative render, and clean reopen audit.
- One initial Blender 5.1 Action-API access attempt aborted before save/render; no repository output was written by that attempt. The corrected run used Blender's default Bezier keyframes.
- ffmpeg H.264 encode, ffprobe stream inspection, Pillow contact-sheet generation, loop comparison, and slit pixel sampling.
- No `.blend1` remains. No commit, push, deploy, canon-lock, asset-lock, or public-ready claim.

NEXT_SAFE_ACTION = Lane B drift-check and operator visual ruling only.

