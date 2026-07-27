# ZENITH BLADE V0.28 — INTERFACE REGISTRATION PROOF

TASK_RESULT: `PASS_FOR_OPERATOR_REVIEW`  
OUTPUT_STATUS: `INTERFACE_REGISTRATION_CANDIDATE_ONLY`  
ASSET_LOCK / INTEGRATION_READY / PRODUCTION_READY / VISUAL_APPROVAL: `NO`

## Source and output

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_HERO_CONTEXT_VALIDATION_V0_27.blend`
- Source SHA-256:
  `AD71627F4978DBF68DCAC88DAEF336A987676E1AB8B258563D31F7F979AC0374`
- Output:
  `production/character/MIKAGE_ZENITH_BLADE_INTERFACE_REGISTRATION_V0_28.blend`
- Output SHA-256:
  `EBBA442D8BA2FE0F5DB96A99D41A7D45C89A0BCBA5E6ECC4F5551742C5FE09D0`
- V0.26, V0.27 and the actor source were not overwritten.

## Ten controlled passes

1. PASS — clean `main`; V0.27 failure evidence and source recorded.
2. PASS — marker, bridge, docking and context bounds inspected.
3. PASS — separate V0.28 derivative created.
4. PASS — existing guard/load bridge registered to the hold marker by local
   location only.
5. PASS — existing docking/load tongue raised for ground clearance by local
   location only.
6. PASS — whole-Blade root moved laterally for minimum P2/P3 cloak clearance.
7. PASS — context and phase-clearance gates rendered.
8. PASS — hand/bridge and dock/ground mechanical evidence rendered.
9. PASS — all PNGs directly inspected; one bounded correction iteration made;
   final derivative reopened and fingerprinted.
10. PASS — proof, `.blend1` cleanup, whitelist audit and local commit prepared;
    no push.

## Permitted transforms performed

- `ZB15_GUARD_LOAD_BRIDGE` total local location delta:
  `(-0.141, 0.000, -0.235)`.
- `ZB15_DOCKING_LOAD_TONGUE` total local location delta:
  `(0.000, 0.000, +0.060)`.
- `ZB22_STANDALONE_ROOT` total context location delta:
  `(+0.220, 0.000, 0.000)`.
- Review camera transforms changed for evidence only.

No scale, rotation, dimension, topology, modifier, material, driver or phase
spacing was changed.

## Quantified gate results

- Right-hand hold marker:
  approximately `(1.055, -0.025, 2.120)`.
- Final guard/load-bridge world envelope:
  - X: `1.0453–1.5454`
  - Y: `-0.1261–0.0821`
  - Z: `2.0174–2.2235`
- The marker lies inside the bridge envelope on X, Y and Z: `PASS`.
- Final docking/load-tongue minimum world Z: `0.2166 m`.
- Required minimum ground clearance: `0.20 m`.
- Docking clearance: `PASS`.
- P2/P3 shell-to-cloak gap is visible in the final front and three-quarter
  evidence: `PASS`.

## Protected regression

- Mesh topology difference count: `0`.
- Full structural fingerprint difference count: `0`.
- Fingerprint fields compared for every pre-existing object:
  object type, dimensions, materials, modifiers, vertex count, polygon count
  and drivers.
- Transform differences are restricted to:
  `ZB15_GUARD_LOAD_BRIDGE`, `ZB15_DOCKING_LOAD_TONGUE`,
  `ZB22_STANDALONE_ROOT` and the review camera.
- Actor rig, actor mesh, cloak, armor, gauntlet and pose are unchanged.
- Shell objects, central spine, rails, collars and core are unchanged.
- P1/P2 core remain off; P3 has exactly one electric-violet core.
- No red/crimson, P2 violet, ambient violet, halo, wash or secondary core.

## Render evidence

- Context gate: `3600 x 1800`, directly inspected.
- Clearance gate: `3000 x 1200`, directly inspected.
- Mechanical gate: `3600 x 900`, directly inspected.
- No silhouette-critical crop in the context or clearance gates.
- The mechanical hand views temporarily hide cloak masses for inspection only;
  saved derivative visibility remains unchanged.

## Repository and safety

- Evidence source: Blender 5.1.2 reopen/fingerprint, Eevee renders, SHA-256,
  coordinate-envelope checks and direct PNG inspection.
- Initial HEAD:
  `8cdf6d1 feat(blade): validate V0.27 hero context`.
- Changed repository files are restricted to `AGENTS.md` and the five approved
  V0.28 outputs.
- V0.28 `.blend1`: removed.
- Commit status: `LOCAL_COMMIT_PREPARED`; final hash is reported in task final
  status to avoid a self-referential hash field.
- Push status: `NOT_PUSHED`.
- Blocker: `NONE`.

## Next safe action

Operator reviews the three V0.28 gates. No V0.29 material pass may open until
the operator accepts this interface-registration candidate. Acceptance still
does not imply asset-lock, integration-ready or production-ready status.
