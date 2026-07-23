# ZENITH BLADE V0.16.1 — ATTACHMENT DEPTH CORRECTION PROOF

TASK_ID: `ZENITH_BLADE_V0_16_1_ATTACHMENT_DEPTH_CORRECTION`
TASK_RESULT: `PASS`
OUTPUT_STATUS: `CANDIDATE_CORRECTION_ONLY`
CANON_LOCK: `NO_NEW_LOCK`
ASSET_LOCK: `NO`
PRODUCTION_READY: `NO`
PUSH_DONE: `NO`

## Source protection

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_PRODUCTION_SURFACE_LOADPATH_V0_16.blend`
- Source SHA-256 before/after:
  `DC7CF7D00590FD3A6124EFAFD28B45915515FF8F3F52F0EB12C4A322AFE46D0F`
- Source size before/after: `377010` bytes
- Source UTC timestamp before/after: `2026-07-23T22:00:51.0232624Z`
- Source mutation: `NO`

## Output

- Blend:
  `production/character/MIKAGE_ZENITH_BLADE_PRODUCTION_SURFACE_LOADPATH_V0_16_1.blend`
- SHA-256:
  `8BE34EA1B9988260628228D58C8B956065E9E155AC9AE49D6F40DAA8D8835661`
- Contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_16_1_ATTACHMENT_CONTACT_SHEET.png`
- Contact sheet: `3200 x 900`, RGB, four panels.

## Exact correction

Only world/local Y depth changed:

| Object | V0.16 Y | V0.16.1 Y |
|---|---:|---:|
| `ZB16_GUARD_CLAMP_L` | -0.572 | -0.520 |
| `ZB16_GUARD_CLAMP_R` | -0.572 | -0.520 |
| `ZB16_GUARD_CROSSPIN` | -0.585 | -0.500 |
| `ZB16_DOCK_CRADLE_L` | -0.565 | -0.520 |
| `ZB16_DOCK_CRADLE_R` | -0.565 | -0.520 |
| `ZB16_DOCK_BASE_PAD` | -0.565 | -0.505 |

Automated source/output comparison found:

```text
UNEXPECTED_DIFFS: []
```

All object X/Z values, rotations, scales, dimensions, mesh vertices,
materials, shell, phase system, rider, steed, rig, and pre-existing scene data
remain unchanged.

## Attachment validation

- Guard parts contacting `ZB15_GUARD_LOAD_BRIDGE`: `3 / 3`.
- Docking parts contacting `ZB15_DOCKING_LOAD_TONGUE`: `2 / 3`.
- Guard attachment pass: `YES`.
- Docking attachment pass: `YES`.
- The base pad remains registered to the cradle/holster support while the two
  cradle cheeks provide direct tongue contact.

The front and depth review panels were opened and inspected. The corrected
parts now read as attached load-path hardware rather than camera-facing floating
details.

## Phase regression

```text
frame 1  -> P1, core off
frame 30 -> P1, core off
frame 31 -> P2, core off
frame 60 -> P2, core off
frame 61 -> P3, one core on
```

## Cleanup and next gate

- V0.16.1 `.blend1`: removed.
- SSOT edited: `NO`
- Push/deploy: `NO`

Next safe action: phase-animation polish and final-render candidate preparation.
