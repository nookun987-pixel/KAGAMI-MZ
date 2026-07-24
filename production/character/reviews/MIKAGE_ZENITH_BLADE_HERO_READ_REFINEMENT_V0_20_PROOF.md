# MIKAGE ZENITH BLADE HERO-READ REFINEMENT V0.20 — PROOF

TASK_ID: `ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20`  
TASK_RESULT: `PASS_FOR_OPERATOR_VISUAL_REVIEW`  
OUTPUT_STATUS: `REVIEW_CANDIDATE_ONLY`  
ASSET_LOCK: `NO`  
PRODUCTION_READY: `NO`  
PUSH_DONE: `NO`

## Source protection

- Source:
  `production/character/MIKAGE_ZENITH_BLADE_FINALIZATION_V0_17.blend`
- SHA-256 before/after:
  `502479163F11F397D4A9730B0F33D6825797B3487C74E88E93D12F1187CDA9C2`
- Size before/after: `381658` bytes
- UTC timestamp before/after: `2026-07-23T22:16:31.9530961Z`
- Source mutation: `NO`

## Outputs

- Blend:
  `production/character/MIKAGE_ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20.blend`
  - SHA-256:
    `56660B2661FEA3AD965F30FF67F5B5AAB1304A483DA22C1BFAF356294E207DED`
- Contact sheet:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20_CONTACT_SHEET.png`
  - SHA-256:
    `C9EC8CDE9C3601BD37826E02D97B98E2F488F7C10EDAF37E9B7FABF734B60C5E`
  - Exact dimensions: `3200 x 1600`
- Clean review crop:
  `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_READ_REFINEMENT_V0_20_REVIEW_CROP.png`
  - SHA-256:
    `9B3D0001830D390060C3D10C53CFA641B79E0D9EA8E4C4ED231374AAEFC6C1DB`
  - Exact dimensions: `1600 x 1600`
  - Labels/overlay: `NONE`

## Ten controlled passes

1. Baseline repo/source/tooling: `PASS`.
2. V0.17 scene and protected-value inspection: `PASS`.
3. Isolated V0.20 derivative save: `PASS`.
4. Exposure and review-light refinement: `PASS`.
5. B4C/Titanium material separation: `PASS`.
6. Seam/rail/load-path readability refinement: `PASS`.
7. Contact sheet and clean crop render: `PASS`.
8. Reopen and protected/color regression QA: `PASS`.
9. Visual/media/filesystem inspection and proof: `PASS`.
10. Scope audit and local commit: `PENDING_AT_PROOF_WRITE`.

## Refinement groups performed

1. Exposure and light placement:
   - Review exposure set to `-1.15`.
   - Restrained cool key/fill/edge rig added for review readability.
   - Three-quarter phase views expose shell thickness and controlled edge
     highlights without changing the Blade silhouette.
2. Material separation:
   - Four B4C shell plates use
     `ZB20_B4C_PORCELAIN_HERO_READ`.
   - Central spine, rails, joints, guard and docking load-path parts use
     `ZB20_TITANIUM_LOADPATH_HERO_READ`.
3. Functional-read refinement:
   - Existing four-plate seams, central spine, recessed rails, upper/lower
     joints, guard bridge and docking support are shown distinctly.
   - Guard and docking close-ups are included in the contact sheet.
4. Bevel/chamfer control:
   - Existing implementation-level bevels/chamfers were retained and revealed
     through the new review angle and lighting.
   - No geometry adjustment was made because protected dimensions and silhouette
     had to remain invariant.

## Protected-value regression

- V0.17 protected object locations: `MATCH`
- Rotations: `MATCH`
- Scales: `MATCH`
- Dimensions: `MATCH`
- Mesh datablock names and vertex/edge/polygon counts: `MATCH`
- Parent relationships: `MATCH`
- Frame range: `1–90`, unchanged
- Rider/steed/rig/attachment/phase transforms: `UNCHANGED`
- Evidence:
  `_tmp/mikage_zenith_blade_hero_read_v0_20_gate/protected_comparison.json`
- Reopen evidence:
  `_tmp/mikage_zenith_blade_hero_read_v0_20_gate/reopen_qa.json`

## Phase and color validation

- P1: shell closed; Blade violet off: `PASS`
- P2: industrial split; Blade violet off: `PASS`
- P3: exactly one existing central violet core object: `PASS`
- Red/crimson weapon signal: `NOT OBSERVED`
- Violet fill/wash/ambient/halo/secondary core: `NOT OBSERVED`
- Violet-core implementation was preserved from V0.17; it was not remodeled or
  duplicated.

## Visual inspection

Evidence source: direct inspection of the actual rendered contact sheet and
clean review crop.

- All three phase panels show the complete Blade: `PASS`
- P1 closed monolithic mass readable: `PASS`
- P2 central load path readable: `PASS`
- P3 single central core readable: `PASS`
- Guard and docking detail panels readable: `PASS`
- Clean crop contains the full Blade with no overlay: `PASS`
- Silhouette-critical cropping: `NONE`
- Final visual approval: reserved for operator

## Filesystem and scope

- V0.20 `.blend1` count after cleanup: `0`
- Existing `.blend` source files modified: `NO`
- V0.19 film modified: `NO`
- SSOT modified: `NO`
- External service/network action: `NO`
- Push/deploy/release/website action: `NO`
- Files changed are limited to the whitelisted V0.20 blend, contact sheet,
  clean crop and proof. Gate scripts/JSON/renders remain under the ignored
  whitelisted V0.20 gate directory.

## Commands and evidence summary

- Git baseline/status/branch/log checks.
- Explicit Blender 5.1 executable discovery.
- SHA-256 and source metadata checks before/after.
- Blender background scene inspection.
- Blender background derivative build and Eevee renders.
- Pillow contact-sheet/crop composition and exact-dimension checks.
- Direct image inspection of contact sheet and clean crop.
- Blender background reopen QA.
- `.blend1` exact-target validation and removal.
- Git scope audit, local commit and post-commit status check.

## Result

- PASS/FAIL: `PASS_FOR_OPERATOR_VISUAL_REVIEW`
- Blocker: `NONE`
- Commit status/hash: `PENDING_AT_PROOF_WRITE`
- Push status: `NOT PUSHED`
- Next safe action: operator reviews the V0.20 contact sheet and clean crop and
  either accepts the hero-read refinement or requests one narrowly scoped
  visual correction.

