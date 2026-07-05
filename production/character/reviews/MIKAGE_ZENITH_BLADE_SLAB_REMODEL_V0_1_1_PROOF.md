> ⚠️ SUPERSEDED / WRONG CANON BASIS (flagged 2026-07-06, operator BOOS): this whole V0.1/V0.1.1 slab
> line was built from `CODEX_ZENITH_BLADE_REMODEL_BRIEF.md`, a single-state violet-seam premise that
> conflicts with the already-locked `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` +
> `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` (locked 2026-06-02): the real canon weapon is a SYNCED
> 3-PHASE B4C-ceramic/Titanium block (P1 Compact-Idle closed monolith / P2 Brutal Industrial
> Activation cracked-open / P3 Overdrive core blazing `#E60000` RED, not violet). The geometry/color
> work below is technically correct FOR THE WRONG TARGET and must not be used as the production
> blade. See AGENTS.md "Fifty-fourth controlled exception" for the real rebuild. Kept on disk only
> as an audit trail — do not pull into public site/deck, do not treat as CANDIDATE for the real
> blade.

# MIKAGE Zenith Blade Slab Remodel V0.1.1 — Seam Hue Proof

TASK: `MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1`
STATUS: `CANDIDATE / MATERIAL-ONLY`
RESULT: `PASS`
BLOCKER: `NONE`

## Source and outputs

- Source: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1.blend`
- Derivative: `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1.blend`
- Wireframe: `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1_WIREFRAME.png`
- Turnaround: `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1_TURNTABLE.png`
- Key art: `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_1_KEYART.png`

## Exact material change

- Seam emission linear input before: `(0.560784, 0.0, 1.0)`.
- Seam emission linear input after: `(0.24, 0.0, 1.0)`.
- Emission strength before: `3.0`.
- Emission strength after: `1.0`.
- Bloom, exposure, geometry, transforms, lights, and all other materials: unchanged.
- A first test at `(0.05, 0.0, 1.0)` / strength `3.0` rendered too desaturated under AgX (`#97A2FA`, green above red). It was rejected rather than reported as PASS.

## Actual rendered-pixel samples

Samples were read from the final PNG files after rendering and color management, not from the material node.

| Render | Point | Pixel coordinate | RGB | Hex | Channel test |
|---|---|---:|---:|---:|---|
| Key art | core | `(327, 1100)` | `(128, 97, 219)` | `#8061DB` | `B-R=91`, `R-G=31` |
| Key art | falloff edge | `(354, 1100)` | `(119, 90, 212)` | `#775AD4` | `B-R=93`, `R-G=29` |
| Turnaround 000 | core | `(158, 400)` | `(127, 96, 218)` | `#7F60DA` | `B-R=91`, `R-G=31` |
| Turnaround 000 | falloff edge | `(157, 400)` | `(116, 86, 208)` | `#7456D0` | `B-R=92`, `R-G=30` |

All samples are blue-dominant violet: blue is clearly above red, and green is the lowest channel. The prior pink/lavender samples (`#DBB1F5`, `#A36BCC`) are not present at the measured seam points.

## Locked-scope validation

- Blade geometry/transform hash, V0.1 and V0.1.1: `70089dc9f7e244b31aae07d62b0982d33a508fbd528c9e3bb740858a391958fd` — exact match.
- Non-seam material hash, V0.1 and V0.1.1: `04a55ea3e13fb9ccd3721623f89a49b1d83c1ad2c19b4aed302f46766a32334c` — exact match.
- Width/length ratio: `0.240`, unchanged.
- Parallel fraction `0.87`, tip fraction `0.13`, blunt tip width `0.02L`: unchanged.
- Ring, grip, slab body materials: unchanged.
- Actual final turnaround and key-art PNGs were opened and visually inspected.
- `.blend1`: none retained.
- KF05 comparison: intentionally omitted per exception #53.

## Status

- Commit: `NOT COMMITTED`.
- Push: `NOT PUSHED`.
- Next safe action: operator/Lane B visual review only.

No canon-lock, asset-lock, final, or production-ready claim is made.
