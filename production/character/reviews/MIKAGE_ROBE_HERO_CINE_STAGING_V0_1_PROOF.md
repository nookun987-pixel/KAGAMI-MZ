# MIKAGE Robe Hero Cine Staging V0.1 — Proof

TASK: `MIKAGE_ROBE_HERO_CINE_STAGING_V0_1`
STATUS: `CANDIDATE / ROUTE A / NOT FINAL`
RESULT: PASS
BLOCKER: NONE

## Base and scope

- Extended directly from `MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend`; source SHA-256 before/after: `507e3cd3558c514d956ecf2445f28b1df884d2f9ac5ba461047bb330832c2765`.
- Every source character mesh datablock was hashed before staging and matched after render; armature/bone signature also matched. Five new meshes are environment-only: floor, two monoliths, two Z-Blue depth layers.
- No armor, limb geometry, limb reveal, blade animation or character-topology change.

## Staging and lighting

- Eevee; reflective graphite floor roughness `0.34`, two dark monoliths, two distant Z-Blue depth layers.
- Neutral-cool World Volume Scatter density `0.0004`; haze catches the neutral rim/halo without violet lighting.
- Key `680 W`, low fill `48 W`, Z-Blue rim `1050 W`; black-world negative fill.
- S2-only white halo practical: `260 W` at ignition, settling to `210 W`. It provides the floor/haze interaction. No violet environment light was added because the hard rule forbids violet on floor/haze.
- Existing #47 porcelain/robe material recipe was preserved; no optional gold/crimson was introduced.

## State machine

| State | Slits | Halo emission | White practical |
|---|---:|---:|---:|
| S0 DORMANT | 0.18 | 0 | 0 W |
| S1 AWARE | 28 | 0 | 0 W |
| S2 COMBAT | 28 | 18 | 260 W |

Halo is matte at S0/S1 and glows white only at S2. The actual final-MP4 frames were inspected and the order reads correctly.

## Camera and blocking

- 85 mm perspective, f/2.2, low angle.
- Hero clip: 96 frames / 4.0 s, push-in plus subtle crane from `(1.15,-25,2.15)` to `(0.8,-23,2.55)`.
- Camera reaches its closest position at source frame 180; S2 halo emission and the 260 W practical switch on at that exact frame. Position holds through frame 196 while halo settles.
- Minimal blocking only: coherent head group lift `0.04 m`; continuous-cloak drift `±0.22°`. No walk or implied limbs.

## HALO COLOR CHECK

Samples are from final MP4 frames. State values list top/right/bottom/left:

- S0: `#B0AFB2`, `#C8CCD0`, `#B3BBC4`, `#C5C6C9`.
- S1: `#B0B0B8`, `#C8CBD4`, `#B3BBC4`, `#C3C3CB`.
- S2: `#FAFAFA`, `#FDFDFD`, `#BBC0C6`, `#FDFDFD`.
- Hero ignition/closest: `#FAFAFA`, `#FDFDFD`, `#B6BEC5`, `#FDFCFF`.
- Hero end: `#FAFAFA`, `#FDFDFD`, `#B4BCC3`, `#FFFFFF`.

All 96 hero frames were sampled at four cardinal halo regions: maximum channel spread `20/255`; maximum violet index `2/255` (compression/grain variance), with no visible or systematic violet tint. `HALO_COLOR_VIOLATION = NO`.

## VOID OCCUPANCY

- S0 `88.29%`; S1 `88.22%`; S2 `80.94%`.
- All 96 final hero frames measured: minimum `80.85%`, maximum `89.19%`; start `89.19%`, ignition/closest `80.85%`, end `81.71%`.
- Every checked frame exceeds 70%. `VOID_RATIO_VIOLATION = NO`.

## Visual and technical verification

- The final gate sheet was opened and inspected: floor/ground shadow, haze and depth staging distinguish this pass from #47 while retaining a single robe mass.
- Palette remains cool; Z-Blue is the only secondary accent beyond the two violet slits. No warm wash or violet environment wash.
- Three state clips: H.264/yuv420p, 720×1280, 24 fps, 2.0 s, no audio.
- Hero clip: H.264/yuv420p, 720×1280, 24 fps, 4.0 s, no audio.
- S2 still: 1440×2560.
- Saved derivative reopened; state values, practical-light state and camera positions matched metadata.
- Gate contains exactly `contact_sheet.png` and `contact_sheet_review_report.md`.
- `.blend1 = NONE`; `python .mikage/tools/verify_output.py = PASS` (recorded after final validation).
- PUSH_STATUS: NOT PUSHED.

No canon-lock, asset-lock, final, marketing or production-ready claim is made.
