# ZENITH BLADE — PHASE & ATTACHMENT VALIDATION V0.47

## Result

`VALIDATION_FAIL`

The accepted V0.46 mechanical form was inspected read-only. No `.blend` was
saved and no geometry, material, driver, transform, or attachment was repaired.

## Source integrity

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_MECHANICAL_DEPTH_V0_46.blend`
- SHA-256 before:
  `97630E228EEE6CCEDBE151470A5F8EBAA992D169BBBD779FE84DCCE2FB317DE6`
- SHA-256 after:
  `97630E228EEE6CCEDBE151470A5F8EBAA992D169BBBD779FE84DCCE2FB317DE6`
- Source unchanged: `PASS`
- Reopen: `PASS`
- Missing linked libraries: `0`
- Missing file images: `0`
- `.blend1` present: `NO`

## Phase validation

- Frames tested: `1–61`
- P1 core off: `PASS`
- P2 core off: `PASS`
- P3 single-core signal on: `PASS`
- Maximum per-frame shell movement: `0.02888894 m`
- Maximum-delta object/frame: `ZB45_SHELL_UL`, frame `27 → 28`
- Continuity threshold `< 0.03 m/frame`: `PASS`
- Three P1→P2→P3→P1 snapshot cycles identical: `PASS`

## Intersection failure

Collision test used evaluated world-space BVHs.

- Collision result: `FAIL`
- Exact blade object: `ZB45_SHELL_LL`
- Exact actor object: `MASTER_MATCH_single_closed_draped_void_cloak`
- Affected frames: `28–61`
- First detected frame: `28`, `14` triangle pairs
- Frame 31: `20` triangle pairs
- Other tested Blade components did not produce a recorded actor-body/cloak hit.

This is a phase-dependent lower-left shell versus cloak intersection. It may
not be concealed by redesigning the accepted V0.46 form inside this gate.

## Attachment validation failure

- Hand marker present: `hand_right_sword_hold_marker`
- Marker overlaps the V0.46 shell/bridge envelope: `FAIL`
- Explicit V0.42–V0.46 handle geometry candidates: `0`
- Handle/gauntlet registration: `FAIL`
- Flux base overlaps the inherited lower docking foot envelope: `PASS`
- Aggregate attachment-transform proof: `FAIL`

The contact sheet cannot substitute for missing handle geometry or a failed
marker-envelope test.

## Gate

```text
V0.46_OPERATOR_ACCEPTED: YES
SIGNAL_LOGIC: PASS
PHASE_CONTINUITY: PASS
DETERMINISTIC_REPEATABILITY: PASS
DEPENDENCY_AUDIT: PASS
SOURCE_PRESERVATION: PASS

CLOAK_CLEARANCE: FAIL
  OBJECT: ZB45_SHELL_LL
  TARGET: MASTER_MATCH_single_closed_draped_void_cloak
  FRAMES: 28-61

HANDLE_GAUNTLET_REGISTRATION: FAIL
  MARKER_ENVELOPE: FAIL
  HANDLE_GEOMETRY: MISSING

DOCKING_ENVELOPE: PASS
ATTACHMENT_TRANSFORM: FAIL
V0.47_VALIDATION: FAIL

ASSET_PROMOTION: NO
ASSET_LOCK: NO
INTEGRATION_READY: NO
PRODUCTION_READY: NO
```

## Next safe action

Open a separate controlled exception limited to:

1. the transform/driver responsible for `ZB45_SHELL_LL` cloak intersection
   beginning at frame 28; and
2. explicit handle/bridge registration to `hand_right_sword_hold_marker`.

Preserve the accepted V0.46 hub, base, shell contour, core, materials, and all
passing signal/continuity behavior. Re-run this full read-only gate after the
bounded repair.

Machine evidence:
`production/character/reviews/MIKAGE_ZENITH_BLADE_PHASE_ATTACHMENT_V0_47_REPORT.json`
