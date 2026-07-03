# MIKAGE Cinematic Lighting Pass V0.1 — Proof

TASK: `MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1`
STATUS: `CANDIDATE / THREE RAW STATE CLIPS / NOT FINAL`
RESULT: PASS
BLOCKER: NONE

## Source and organization

- Source: `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_1.blend`.
- Source SHA-256 before/after: `c2c3ade3741d6c01b805fdd9f63721bfa421c51f6216cb62943269107bdc5d29` (unchanged).
- Derivative: `production/character/production_actor/rig_derivatives/MIKAGE_CINEMATIC_LIGHTING_PASS_V0_1.blend`.
- One scene contains three frame-states: frame 1 S0, frame 2 S1, frame 3 S2. Camera, lighting, materials and grade are shared; only slit/halo emission strength is state-keyed.
- Geometry hash before/after: `ca02a61ff9ec5a67cebd52bb1479c4437855f32b656084b55c1e8c811a29359a` (identical). Mesh/armature counts remain `101 / 1`.

## Shared six-layer base

1. Lighting: 45° area key 720 W, low fill 60 W (`1:12`), cool-neutral rim 850 W; near-black world opposite the key acts as negative fill. No violet key/fill.
2. Violet signal: locked linear emission input `(0.05,0,1,1)`, corresponding to `#8F00FF`; only the two slits use it.
3. Atmosphere: Eevee World Volume Scatter, neutral-cool, density `0.0004`, anisotropy `0.15`. This avoids adding a volume mesh/set and keeps all states identical.
4. Porcelain: roughness `0.34`, subtle SSS `0.07`, coat `0.12` / coat roughness `0.18`. Cloak: roughness `0.62`, sheen `0.16` for rim readability.
5. Camera: perspective 85 mm, f/2.2, slight low-angle, `(0.8,-21,2.5)` targeting `(0,0,2.85)`; identical in all clips.
6. Grade: AgX Medium High Contrast, exposure `-0.35`, cool mono, restrained temporal grain and vignette. No teal-orange/anime/HUD styling.

## State machine

| State | Slit strength | Halo strength | Result |
|---|---:|---:|---|
| S0 DORMANT | 0.18 | 0.0 | near-off violet ember; passive matte white halo |
| S1 AWARE | 28.0 | 0.0 | full saturated violet slits; halo remains passive/matte |
| S2 COMBAT | 28.0 | 18.0 | same full slits plus strong white halo glow |

The saved derivative was reopened and these exact frame values were confirmed. S0/S1 halo emission is exactly zero; only S2 emits. Three separate 2-second raw hold clips were produced—no transition, cutting, captions or cover card.

## HALO COLOR CHECK

Samples are from frames extracted at 1.0 s from each final MP4. Four cardinal halo regions were searched locally for the brightest neutral ring pixel. All samples remain neutral/cool-white; none has red-blue violet separation.

| State | Top | Right | Bottom | Left |
|---|---|---|---|---|
| S0 | `#B8B9BE` (184,185,190) | `#DADAE6` (218,218,230) | `#A8A9AE` (168,169,174) | `#D0D0DC` (208,208,220) |
| S1 | `#B7B7BF` (183,183,191) | `#D8DCE9` (216,220,233) | `#A8A9AE` (168,169,174) | `#CED3DB` (206,211,219) |
| S2 | `#FAFAFA` (250,250,250) | `#FDFDFD` (253,253,253) | `#ACADB2` (172,173,178) | `#FCFCFC` (252,252,252) |

- `HALO_COLOR_VIOLATION = NO`.
- S2 luminance rises strongly while remaining white; S0/S1 remain materially passive.

## Image/state verification

- Actual final-MP4 frames were opened and inspected side-by-side.
- State order is visually distinct and ascending: ember → full slits → full slits plus white halo burst.
- Measured void occupancy (pixels with all channels ≤24): S0 `82.85%`, S1 `82.42%`, S2 `74.26%`; all exceed 70%.
- Directional key/negative fill model the helmet; cool rim separates cloak from void; porcelain reads coated rather than flat plastic.
- Violet is confined to the two slits; no violet environment/body/halo wash was observed.
- Blade has no animation; no geometry, rig, bone, topology or environment/set was added.
- `STATE_MACHINE_VIOLATION = NO`; `CANON_COLOR_DRIFT = NO`; `STYLE_VIOLATION = NO`; `SCOPE_VIOLATION = NO`.

## Deliverable verification

- Clips: `_S0_DORMANT`, `_S1_AWARE`, `_S2_COMBAT`; each H.264/yuv420p, 720×1280, 24 fps, 2.000 s, video-only/no audio.
- Gate contains exactly labeled `contact_sheet.png` plus `contact_sheet_review_report.md`; no MP4 is in gate.
- `.blend1 = NONE`.
- `python .mikage/tools/verify_output.py = PASS` (recorded after final validation).
- PUSH_STATUS: NOT PUSHED.
- NEXT_SAFE_ACTION: Lane B/operator review of the three raw state clips before the separate edit pass.

No final/marketing, production-ready, canon-lock, asset-lock, cutting/export, push or deploy claim is made.
