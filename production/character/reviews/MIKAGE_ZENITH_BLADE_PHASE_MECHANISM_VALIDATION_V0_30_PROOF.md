# Zenith Blade Phase & Mechanism Validation V0.30 — Proof

## Status

```text
MILESTONE: ZENITH_BLADE_PHASE_MECHANISM_VALIDATION_V0_30
EXECUTION_RULING: PASS
OPERATOR_VISUAL_RULING: PENDING
ASSET_LOCK: NO
INTEGRATION_READY: NO
PRODUCTION_READY: NO
```

## Source

- Read-only baseline:
  `production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29.blend`
- SHA-256 before and after:
  `317678F6173D1FED3789DCA68FEC7B880D8E7955A45E2495BC7EC2D08C863BE5`
- Blender source save: `NO`
- Derivative `.blend` output: `NONE`

## Ten-pass result

1. Repository/source preflight: `PASS`.
2. Driver, variable, target and driven-path inventory: `PASS`.
3. Protected state capture: `PASS`.
4. Locked phase frames 1/31/61: `PASS`.
5. Transition frames 25/28/55/58: `PASS`.
6. Frame 1–61 transform continuity: `PASS`; maximum delta
   `0.01324082 m`, `ZB13_L_UP_SHELL`, frame 27 to 28.
7. Three P1 -> P2 -> P3 -> P1 repeat cycles: `PASS`; normalized snapshots
   identical.
8. Evaluated world-space shell/core collision test at all seven diagnostic
   frames: `PASS`; zero intersections.
9. Timeline and continuity gate images opened and inspected: `PASS`.
10. Whitelist, source hash and no-save validation: `PASS`.

## Phase signal

```text
P1 / frames 1,25,28: Blade core off
P2 / frames 31,55,58: Blade core off
P3 / frame 61: exactly one violet core
VIOLET WASH / HALO / SECONDARY CORE: NONE OBSERVED
```

## Corrected collision method

The first V0.30 attempt produced a false positive because
`BVHTree.FromObject()` trees were compared in object-local coordinates. The
controlled rerun evaluated each mesh, transformed every evaluated vertex by
that object's `matrix_world`, and constructed both BVHs in the same world
space before overlap testing.

Corrected result:

```text
FRAMES: 1, 25, 28, 31, 55, 58, 61
SHELL/CLOAK INTERSECTIONS: 0
P3 CORE/CLOAK INTERSECTIONS: 0
ACTIVE TARGET: MASTER_MATCH_single_closed_draped_void_cloak
```

## Evidence

- `MIKAGE_ZENITH_BLADE_PHASE_MECHANISM_VALIDATION_V0_30_TIMELINE_GATE.png`
- `MIKAGE_ZENITH_BLADE_PHASE_MECHANISM_VALIDATION_V0_30_CONTINUITY_GATE.png`
- `MIKAGE_ZENITH_BLADE_PHASE_MECHANISM_VALIDATION_V0_30_REPEATABILITY_REPORT.json`

## Scope and repository

- Asset/geometry/material/registration/driver edits: `NONE`.
- Task-created `.blend1`: `NONE`.
- Pre-existing ignored legacy backup (not touched and outside task scope):
  `production/character/MIKAGE_ZENITH_BLADE_PHASE_TIMELINE_V0_14.blend1`,
  last modified before this task.
- Push/deploy: `NOT PERFORMED`.
- Local commit: `PENDING AT PROOF WRITE TIME`.
- Next safe action: operator reviews this evidence and issues the final V0.30
  ruling. V0.31 remains closed until that ruling.
