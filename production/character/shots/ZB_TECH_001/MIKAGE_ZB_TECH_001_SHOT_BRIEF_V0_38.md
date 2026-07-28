# MIKAGE ZB_TECH_001 — Shot Brief V0.38

```text
SHOT_ID: ZB_TECH_001
STATUS: BRIEF_LOCKED_FOR_CONTROLLED_BUILD
PURPOSE: INTERNAL_TECHNICAL_SHOWCASE
PUBLIC_RELEASE: NO
SHOT_APPROVAL: NO
```

## Sources

- Locked Blade parent:
  `production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29.blend`
- Parent SHA-256:
  `317678F6173D1FED3789DCA68FEC7B880D8E7955A45E2495BC7EC2D08C863BE5`
- Validated diagnostic pattern:
  `production/character/shots/MIKAGE_ZENITH_BLADE_DIAGNOSTIC_SHOT_V0_35.blend`
- Pattern SHA-256:
  `268F5248A95A3411E413F72594370ED9614B41042AE0F89AA29820BF695819A9`

V0.35 is a technical reference only. The shot build must create a separately
named derivative and must not overwrite V0.29 or V0.35.

## Delivery contract

```text
RESOLUTION: 1080 x 1920
FRAME_RATE: 30 fps
FRAME_RANGE: 1–61
DURATION: 2.033 seconds
PIXEL_FORMAT_TARGET: yuv420p
AUDIO: NONE
TEXT / LOGO / LYRICS: NONE
DELIVERY: INTERNAL REVIEW
```

The planning gate does not authorize MP4 encoding. Encoding requires the shot
build and validation gates to pass first.

## Phase timing

| Range | State | Signal |
|---|---|---|
| Frame 1 | P1 reference | Blade violet off |
| Frames 2–30 | Existing P1→P2 authored behavior | Blade violet off |
| Frame 31 | P2 reference | Blade violet off |
| Frames 32–60 | Existing P2→P3 authored behavior | Blade violet off |
| Frame 61 | P3 reference | Exactly one central violet core |

Use the existing locked driver/timeline behavior. Do not retime, duplicate or
replace `ZB13_PHASE_CONTROL["blade_phase"]`.

## Camera intent

- Vertical full-body technical three-quarter.
- Mikage and the complete Blade remain inside frame at every frame.
- No handheld shake, roll, snap zoom or silhouette-critical crop.
- Camera motion, if added, must be subtle and namespaced `ZB_TECH_001_SHOT_*`.
- The Blade must continue to read as heavy and registered to the actor.

## Lighting intent

- Neutral cool technical review light.
- Preserve accepted B4C, dark Titanium and cold-steel separation.
- No dramatic exposure, warm light, ambient violet, wash, halo or bloom.
- P3 violet remains one recessed signal only.

## Allowed shot-only changes

- New shot camera and camera animation.
- New neutral review lights and light animation.
- Shot render/output settings.
- Shot metadata and technical helpers under `ZB_TECH_001_SHOT_*`.

## Forbidden changes

- Any Blade/actor mesh, material, driver, phase timing, transform,
  registration, bridge, docking, rig or pose change.
- Any overwrite of V0.29, V0.35 or accepted evidence.
- Audio, logo, copy, narrative event, public claim, push or deploy.

## Build acceptance

The shot derivative must pass:

1. Parent and pattern hash verification.
2. Protected fingerprint diff `0`.
3. Reopen test.
4. Frames 1–61 phase and signal audit.
5. Full-range world-space clearance.
6. Full-range camera containment.
7. Frame-spec and no-audio verification.
8. Actual keyframe-sheet and clip inspection.
9. Operator shot ruling.

## Next gate

`ZENITH_BLADE_V0_39_ZB_TECH_001_SHOT_BUILD`.
