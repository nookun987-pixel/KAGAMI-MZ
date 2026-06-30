# MIKAGE MICRO GEOMETRY CORRECTION V0.2 PROOF

## Scope

- Task: `MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2`
- Governing gate: Eighteenth controlled exception in `AGENTS.md`
- Base verdict: `MIKAGE_MATCH_3D_TO_MASTER_V0_1 = PASS_WITH_FIX`
- Output status: `CANDIDATE`
- Geometry correction limited to regions A/B/C: YES
- Lookdev/material finish: NONE
- Canon-lock, asset-lock, public-render-ready claim: NONE
- Push/deploy/sync: NONE

## Source And Base

- Master opened and read: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`
- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`
- Base SHA-256 before and after: `D3E84CC810BBE33F95A1CB695118526B679B16EFE970C35624586BCE0A97A74E`
- Base overwritten: NO
- Scene/geometry import: NONE
- RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry: NONE

## Body Hashes

Aggregate method: sorted mesh datablock name, vertex coordinates, edge indices, and polygon vertex indices, SHA-256.

- `BODY_HASH_BEFORE = C7D078E1D87224BAFAB391C7FC1ABB91BB07A77D4515A323FAE0221182A52CDD`
- `BODY_HASH_AFTER = 4CA371D49D0F0116DCDB4CB3696063B7FD0E66BC05FA3F76445E90C0EF7D4838`
- Output hash after save and reopen: `4CA371D49D0F0116DCDB4CB3696063B7FD0E66BC05FA3F76445E90C0EF7D4838`
- Mesh datablock count before/after: `101 / 101`
- Geometry changed: YES, only the three named micro-fix regions.

## Fixed Only

### A — Helmet

- Preserved the existing ovoid direction and faceless identity.
- Narrowed the lateral profile slightly.
- Reduced perfect bilateral/egg regularity with restrained six-plane radial rhythm and sub-percent right-side asymmetry.
- Softly directed the crown and chin without returning to a pointed wedge.
- Added no eyes, nose, mouth, or new facial form.
- Helmet geometry hash before: `5CDC6BCDBE42F6D0776CD2068408749A12E45C1EB5FC5BD6458D5E35C7BE3976`
- Helmet geometry hash after: `5DDF973EFD63BFFCD3247A9FE05F33DA7B3218C8A2F35CC1B99A65DA89645BC5`

### B — Halo

- Reduced torus cross-section to `36%` of its prior physical thickness.
- Moved the ring slightly farther behind the helmet (`Y 0.30 -> 0.44`).
- Added a restrained `8°` yaw so the mandatory side view reads as a thin ellipse rather than a solid vertical white slab.
- Preserved the existing white halo material unchanged; no new lookdev/material pass was performed.
- Halo remains white, not violet, and is not visually brighter than the helmet in the inspected sheet.
- Halo geometry hash before: `07D1C32B61A63A647268FE120B4825AD5EB508AC10CA1D32A5B2CA62573D5D5F`
- Halo geometry hash after: `F4C0E333615658CB4A4787627A61BD8410EF1CD045C36095386702B774252979`

### C — Neck / Robe Join

- Replaced the straight post-like transition with five graduated rings that broaden naturally into the unchanged robe shoulder opening.
- The robe receives the helmet/neck as one continuous dark silhouette.
- Neck material assignment was left unchanged; this proof does not canon-lock or specify the neck material.
- Neck geometry hash before: `F1964D93BC00134BB2B83C47B8819FB0EAF65906B1EF6972A47572F742E66B00`
- Neck geometry hash after: `502B6362C7C6AFB552C27159D88A7292EEE9F04D3F5C45333AB11E1FC31EC537`

## Preserve Audit

The following geometry hashes and transforms are unchanged before/after:

- Robe: `262CF0D735F8FA6E00D8CEB273B2F43D54D655F2BFF6163A1E77376ED0F9DAB5`
- Left slit: `37AD1B42CB8B12677BED39088F6293DBF40D3572E0841B516E7DDA31570FF2E1`
- Right slit: `37AD1B42CB8B12677BED39088F6293DBF40D3572E0841B516E7DDA31570FF2E1`
- Blade slab: `C5780754E30F59F230855A62946F902F681BDEA975C459A2DEE9C8FA235FA9D3`
- Blade dark edge: `B48166238B3E53058D15EB0F5820EAEE0EA15FC08FB46DF31BF16D67120FCA5F`
- Blade front plane: `9A49F83415F1EF498553313BA106BB9B71B259BF707E08C4FB6DC62E606B3315`
- Robe silhouette changed: NO
- Body proportions changed: NO
- Slit count/relative position changed: NO
- Visible violet objects: exactly the existing left and right slit meshes.
- Blade geometry/position changed: NO
- Wholesale new helmet form: NO
- Overall ovoid direction preserved: YES

## Actual Render Inspection

- Contact sheet: `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png`
- Layout: front, three-quarter, mandatory side, helmet-plus-two-slits close-up.
- Dimensions: `1440 x 1920`.
- Actual PNG opened and inspected at original resolution: YES.
- Helmet reads less like a perfect mannequin egg while remaining ovoid/faceless: YES.
- Halo is markedly thinner: YES.
- Side halo reads as a separated thin ellipse, not a vertical white slab/column: YES.
- Halo remains white and subordinate to the helmet: YES.
- Neck transitions progressively into the robe shoulder opening: YES.
- Robe, two slits, blade, and body proportions visually preserved: YES.
- Final visual approval: NOT CLAIMED; operator ruling remains required.

## Outputs And Validation

- Output blend: `production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`
- Output blend SHA-256: `8C223400DFC115A052C7CB81285BDD01168E72ED34AAAED88487FCD770BEDD70`
- Contact sheet: `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_CONTACT_SHEET.png`
- Proof: `production/character/reviews/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2_PROOF.md`
- Output blend reopened: YES.
- `.blend1` remaining: NO after cleanup.
- Only three whitelisted repository outputs changed: YES.

## Commands And Evidence

- Verified clean start, branch `main`, starting commit `54990e3`.
- Read exception #18 and the complete V0.2 micro-correction brief.
- Opened the in-repo master PNG.
- Reported base and body hash before geometry work.
- Captured target and preserve-region geometry hashes plus transforms.
- Executed one local Blender micro-correction script with hard failure on preserve drift.
- Rendered front/three-quarter/mandatory-side/helmet-close panels and opened the actual final sheet.
- Reopened the output blend and recomputed body/region/preserve hashes.
- Evidence source: `LOCAL_COMMAND_VERIFIED`, `MASTER_PNG_VISUALLY_INSPECTED`, `BLENDER_REOPEN_VERIFIED`, `ACTUAL_OUTPUT_PNG_VISUALLY_INSPECTED`.

## RESULT

`PASS_FAIL = PASS`

`BLOCKER = NONE`

`OUTPUT_STATUS = CANDIDATE`

`BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_MATCH_3D_TO_MASTER_V0_1.blend`

`BODY_HASH_BEFORE = C7D078E1D87224BAFAB391C7FC1ABB91BB07A77D4515A323FAE0221182A52CDD`

`BODY_HASH_AFTER = 4CA371D49D0F0116DCDB4CB3696063B7FD0E66BC05FA3F76445E90C0EF7D4838`

`MICRO_FIX_SCOPE_DRIFT = NO`

`PRESERVE = robe silhouette | body proportions | two slits | vertical blade | overall ovoid helmet direction`

`FIXED_ONLY = generic egg read | halo thickness/side-read | neck-to-robe transition`

`LOOKDEV_CHANGE = NO`

`NECK_MATERIAL_CANON_LOCK = NO`

`CANON_LOCK = NO`

`ASSET_LOCK = NO`

`PUBLIC_RENDER_READY = NO`

`COMMIT_STATUS = NOT_COMMITTED`

`STARTING_COMMIT = 54990e3`

`PUSH_STATUS = NOT_PUSHED`

`NEXT_SAFE_ACTION = Lane B/operator reviews helmet character, halo side-read, and neck/robe join against the master; no further geometry or lock status change without a new explicit gate`
