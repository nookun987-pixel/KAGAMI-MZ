# Zenith Blade Production Handoff V0.34

## Locked source

```text
ASSET:
production/character/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29.blend

SHA256:
317678F6173D1FED3789DCA68FEC7B880D8E7955A45E2495BC7EC2D08C863BE5

ASSET_LOCK: YES
INTEGRATION_READY: YES
PRODUCTION_READY: YES
```

Never overwrite, rename, repack or save into this file. A hash mismatch means
the asset must not be used until the discrepancy is resolved.

## Consumption policy

1. Prefer linking the locked collection/object data into a new shot derivative.
2. If append is required by the pipeline, append into a separately named shot
   file and preserve the source hash record.
3. Never edit the linked/appended Blade mesh, topology, modifiers, material
   assignments, phase drivers, core emission or registration transforms.
4. Every shot derivative must identify this V0.29 file as `PARENT_ASSET`.
5. Shot files must use a new version and must not use `V0_29` as their output
   version.

Recommended derivative pattern:

```text
MIKAGE_<SHOT>_ZENITH_BLADE_INTEGRATION_V0_1.blend
```

## Phase map

| Phase | Reference frame | Blade state | Violet rule |
|---|---:|---|---|
| P1 | 1 | Closed | Blade signal off |
| P2 | 31 | Open | Blade signal off |
| P3 | 61 | Open | Exactly one central violet core |

Transition diagnostic frames are `25`, `28`, `55` and `58`. The control object
is `ZB13_PHASE_CONTROL`, custom property `blade_phase`.

Violet must never become fill, ambient light, wash or halo. No secondary Blade
core is allowed.

## Registration and load path

Protected interface objects:

- `hand_right_sword_hold_marker`
- `ZB15_GUARD_LOAD_BRIDGE`
- `ZB15_DOCKING_LOAD_TONGUE`
- `ZB13_L_LOW_SHELL`
- `ZB13_L_UP_SHELL`
- `ZB13_R_LOW_SHELL`
- `ZB13_R_UP_SHELL`
- `ZB13_P3_SINGLE_VIOLET_CORE`

Accepted docking clearance is `0.2166 m`; the minimum gate is `0.2000 m`.
Do not reposition the Blade, actor, gauntlet, bridge or docking system merely
to conceal a shot-specific intersection.

## Locked material behavior

- B4C: off-white matte mineral/ceramic response.
- Dark Titanium: restrained graphite load-bearing frame.
- Cold steel: cool neutral rail separation.
- P1/P2: Blade violet off.
- P3: one recessed violet core only.

Do not simulate material quality using dramatic exposure, colored environment
light, bloom or violet contamination.

## Required shot validation

Every downstream shot derivative must pass:

1. Parent SHA-256 verification.
2. Link/append dependency audit.
3. Attachment and docking transform check.
4. P1/P2/P3 signal-state check.
5. Evaluated world-space cloak/body collision across the shot range.
6. Extreme-pose gauntlet, cloak and docking clearance.
7. Reopen and deterministic playblast/render check.
8. Operator shot approval.

The asset lock does not authorize a shot, animation, push, deployment, website
use or public release.

## Evidence chain

- V0.28 Interface Registration: operator accepted.
- V0.29 Material Finaling: operator accepted.
- V0.30 Phase & Mechanism: operator accepted.
- V0.31 Integration Validation: pass.
- V0.32 Production Readiness Validation: pass.
- V0.33 Operator Lock: accepted and locked.
