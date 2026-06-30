# MIKAGE V0.2 HERO FINISH LOOKDEV V0.1 PROOF

## Scope

- Task: `MIKAGE_V0_2_HERO_FINISH_LOOKDEV_V0_1`
- Governing exception: Sixteenth controlled exception in `AGENTS.md`
- Work type: material, shading, lighting, world, and render only
- Output status: `CANDIDATE`
- Geometry, silhouette, proportions, helmet, slit geometry, blade position, body mass, rig, animation, and UV rebuild: NOT CHANGED
- Canon-lock, asset-lock, public-render-ready claim, production-ready claim: NONE
- Push/deploy/sync: NONE

## Source And Output

- Source V0.2: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
- Source V0.2 SHA-256 before and after: `C1FEE277C2B614E2E24CE6CA88E237973BFD84EE12DA2B2E2001BED63F01EC1B`
- Output blend: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend`
- Output blend SHA-256: `1874E2F844A26692BD86C6A8D578410FF1F0137C891BF55008986369F7377D71`
- Contact sheet: `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_CONTACT_SHEET.png`
- Proof: `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_PROOF.md`
- Source overwritten: NO

## Geometry Preservation

Aggregate hash method: sorted mesh datablock name, vertex coordinates, edge indices, and polygon vertex indices, SHA-256.

- Source object count: `122`
- Output object count after reopen: `122`
- Source mesh datablock count: `100`
- Output mesh datablock count after reopen: `100`
- Source aggregate mesh hash: `3914AF0516A878222A8605804F9572182CDC2F812B7A1B3D8BADD8DAF73E8DFD`
- Output aggregate mesh hash before save: `3914AF0516A878222A8605804F9572182CDC2F812B7A1B3D8BADD8DAF73E8DFD`
- Output aggregate mesh hash after save and reopen: `3914AF0516A878222A8605804F9572182CDC2F812B7A1B3D8BADD8DAF73E8DFD`
- Mesh hash unchanged: YES
- Geometry preserved: YES

## Lookdev Applied

- `HERO_FINISH_glazed_sacred_porcelain`: `#f2eeea`, soft SSS, coat weight `1.0`, coat roughness `0.06`, base roughness `0.22`, subtle procedural craquelure micro-bump.
- `HERO_FINISH_deep_matte_graphite`: deep neutral graphite, high matte roughness with restrained fine variation.
- `HERO_FINISH_cold_zenith_metal`: muted cold-metal value, metallic response, controlled sharp reflectance.
- `HERO_FINISH_violet_two_slits_only`: `#8F00FF`, restrained emission strength `0.75`.
- Violet material object count: `2`.
- Violet objects:
  - `PUBLIC_BLOCK_V03_sensor_slit_left_violet_only`
  - `PUBLIC_BLOCK_V03_sensor_slit_right_violet_only`
- Violet outside the two slits: NO.
- Gold, crimson, ambient violet, halo, wash, or flood: NONE.

## Lighting And World

- Render engine: Blender 5.1.2 / Eevee, local.
- World: exact sRGB `#050508`, film transparency off.
- Active key: `HERO_FINISH_Rembrandt_key_upper_left`, area light, upper-left and angled down, energy `1375`.
- Active rim: `HERO_FINISH_thin_restrained_rim`, restrained area rim, energy `390`.
- Other source lights: energy set to zero in the candidate derivative.
- Fill: world strength `0.008`, near zero.
- View transform look: `Medium High Contrast`; exposure `-0.35`.
- Authorized fallback applied after first visual inspection: tighter key, sharper porcelain coat, subtler micro-bump, thinner rim, and quieter slit emission. No geometry action was taken.

## Actual Contact-Sheet Inspection

- Final PNG opened and inspected at original resolution: YES.
- Layout: front, three-quarter, side, helmet-plus-two-slits close-up.
- Dimensions: `1440 x 1920`.
- Complete figure visible without silhouette-critical crop in front, three-quarter, and side views: YES.
- Helmet and exactly two slits readable in close-up: YES.
- Void background visually black rather than grey: YES.
- Porcelain, graphite body mass, and cold-metal blade separate by value/reflectance: YES.
- Violet remains confined to the two slit meshes: YES.
- Visual approval: NOT CLAIMED; final visual ruling belongs to the operator.

## Validation And Files Changed

- Output blend reopened: YES.
- Source V0.2 hash unchanged: YES.
- Output mesh hash equals source mesh hash: YES.
- `.blend1` remaining: NO; generated backup was removed before final status.
- Only intended repository outputs:
  - `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_HERO_FINISH_LOOKDEV_V0_1.blend`
  - `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_FINISH_LOOKDEV_V0_1_PROOF.md`

## Commands And Evidence

- Verified clean start, branch `main`, and starting commit `07cdf38`.
- Read the task brief, Sixteenth controlled exception, and lookdev recipe.
- Inspected the source scene and computed the source aggregate mesh hash.
- Applied lookdev through a temporary Blender script outside the repository.
- Saved the approved derivative only and rendered four Eevee evidence panels.
- Assembled the contact sheet locally with FFmpeg.
- Opened and visually inspected the actual PNG twice, including after the fallback adjustment.
- Reopened the output blend and recomputed its mesh hash.
- Rechecked source/output file hashes and removed `.blend1` plus temporary working files.
- Evidence source: `LOCAL_COMMAND_VERIFIED`, `BLENDER_REOPEN_VERIFIED`, `ACTUAL_PNG_VISUALLY_INSPECTED`.

## Result

`PASS_FAIL = PASS`

`OUTPUT_STATUS = CANDIDATE`

`BLOCKER = NONE`

`GEOMETRY_HASH_UNCHANGED = YES`

`PUBLIC_RENDER_READY = NO`

`PRODUCTION_RIG_READY = NO`

`ASSET_LOCK = NO`

`CANON_LOCK = NO`

`COMMIT_STATUS = NOT_COMMITTED`

`STARTING_COMMIT = 07cdf38`

`PUSH_STATUS = NOT_PUSHED`

`NEXT_SAFE_ACTION = operator/Lane B performs the final visual ruling on this candidate contact sheet; no geometry, readiness, or lock status changes without a new explicit gate`
