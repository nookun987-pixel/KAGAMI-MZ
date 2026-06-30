# MIKAGE HELMET REBUILD FROM BLOCKING V0.4 PROOF

## Scope

- Task: `MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4`
- Governing gate: Twentieth controlled exception in `AGENTS.md`
- Design target: `production/character/build_log/MIKAGE_HELMET_BLOCKING_SPEC_V0_1.md`
- Master: `production/character/reference/MIKAGE_CHARACTER_REFERENCE_16x9.png`
- Output status: `CANDIDATE`
- Helmet rebuilt from primary blocking: YES
- V0.2/V0.3 oval mesh edited or reused: NO; its mesh datablock was discarded.
- Only helmet mesh changed: YES
- Lookdev/material/light/camera/body change: NONE
- Canon-lock, asset-lock, public-render-ready claim: NONE
- Push/deploy/sync: NONE

## Base And Source Evidence

- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`
- Base SHA-256 before and after: `8C223400DFC115A052C7CB81285BDD01168E72ED34AAAED88487FCD770BEDD70`
- Base overwritten: NO
- Master and locked blocking spec read before geometry: YES
- Imported geometry/scene: NONE
- RIDER / HEAD-GRAFT / HERO-MOUNT / STEED / FIGURE_V0.4 geometry: NONE

## Body And Helmet Hashes

- `BODY_HASH_BEFORE = 4CA371D49D0F0116DCDB4CB3696063B7FD0E66BC05FA3F76445E90C0EF7D4838`
- `BODY_HASH_AFTER = 8ECC4390491674A56800F51B19ECBE2E74143659D3572F334B5BFDCB2D9D70B3`
- Output body hash after save and reopen: `8ECC4390491674A56800F51B19ECBE2E74143659D3572F334B5BFDCB2D9D70B3`
- Discarded oval helmet hash: `5DDF973EFD63BFFCD3247A9FE05F33DA7B3218C8A2F35CC1B99A65DA89645BC5`
- New blocking helmet hash: `1AB765BEDEEC8060F8E81FD79E45A3160EE7CA42E7855A555A427A3E57EA1C94`
- New mesh datablock: `HELMET_BLOCKING_V0_4_faceplane_crown_wedge`
- New helmet topology: `85 vertices / 74 polygons`
- New helmet dimensions: `0.713589 x 0.548936 x 0.800000`

## Primary Blocking Result

1. **Face-plane:** built as a wide, near-flat front surface with a restrained central concavity. It is structurally separate from the curved rear skull.
2. **Recessed slits:** two explicit rectangular openings were cut into the front-plane topology. Shallow cavity walls place the two existing slit objects inside the face plane rather than on a smooth oval surface.
3. **Crown/brow break:** the front plane retreats sharply between the slit band and crown section, producing a readable break in three-quarter view.
4. **Temples:** front corners turn into narrowed temple planes before transitioning to the curved rear skull; no round side bulge was retained.
5. **Wedge jaw:** the lower sections taper through two broad jaw stages into a controlled base around the preserved neck opening. No round chin remains.
6. **Side profile:** strict side separates the near-flat face plane from the curved back skull.
7. **Low/wide proportion:** height is `0.800`, width is `0.714`; the rebuild is materially lower and wider than the discarded oval.
8. **Faceless lock:** no eyes, nose, mouth, anatomy, fox/kitsune/samurai/anime/gaming-mask language, seams, vents, decorative panels, or added mechanical ornament.

## Jaw/Neck Seating

- Preserved neck top Z: `3.525000`
- New helmet bottom Z: `3.500000`
- Controlled overlap: approximately `0.025`
- New jaw base encloses the existing neck-top footprint without moving or editing the neck: YES
- Neck transform/hash changed: NO

## Preserve Verification

- `NON_HELMET_MESH_HASH_BEFORE = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `NON_HELMET_MESH_HASH_AFTER = E4F2DDE40F734CD474BC5B2B5B71A317EE4212D83A4084AACFC616F4BF75F2D0`
- `CAMERA_STATE_HASH_BEFORE = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- `CAMERA_STATE_HASH_AFTER = 728C66AAFAFDC4C834EC9ECD924E8C97510C38D3CCE9D96A9842D4E6A99E9882`
- Robe byte-identical: YES
- Neck byte-identical: YES
- Halo byte-identical: YES
- Blade byte-identical: YES
- Slit geometry/count/position byte-identical: YES
- Camera scale/transform byte-identical: YES
- All body geometry byte-identical: YES
- Helmet object transform unchanged: YES
- Helmet material assignment unchanged: `HERO_FINISH_glazed_sacred_porcelain`
- Visible violet remains exactly the two approved slit objects: YES
- `HELMET_SCOPE_DRIFT = NO`

## Render And Success Test

- Contact sheet: `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png`
- Dimensions: `2880 x 1920`
- Normal panels: front, strict side, three-quarter, helmet/recessed-slit close-up.
- Comparison: V0.3 silhouette extracted from the prior approved evidence sheet.
- Success-test panels: V0.4 front, three-quarter, and side with slit objects hidden and a temporary unlit white silhouette override.
- Temporary success-test material was never saved to the output blend.
- Actual contact sheet opened and inspected at original resolution: YES
- Front reads a broad face-plane plus controlled wedge jaw, not an oval: YES
- Three-quarter reads face-plane versus rear skull with a crown/brow break: YES
- Strict side reads near-flat front versus curved back: YES
- Slits/material/lighting conceptually off, silhouette remains distinct from V0.3 mannequin/egg: YES
- Free-build result still oval/egg: NO
- Fallback `NEEDS_LOCKED_2D_PROFILE_GUIDE`: NOT TRIGGERED
- Final visual approval: NOT CLAIMED; operator ruling remains required.

## Outputs And Validation

- Output blend: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4.blend`
- Output blend SHA-256: `B9FD428B23342AABB0450D2EC98EC3B3AAA4C7290F2EF06F82B3BA67C92DDA7A`
- Contact sheet: `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_CONTACT_SHEET.png`
- Proof: `production/character/reviews/MIKAGE_HELMET_REBUILD_FROM_BLOCKING_V0_4_PROOF.md`
- Output blend reopened and hashes reproduced: YES
- `.blend1` remaining: NO after cleanup
- Only three whitelisted repository outputs changed: YES

## Commands And Evidence

- Verified clean start, branch `main`, starting commit `3508908`.
- Read exception #20, the locked helmet blocking spec, and the complete V0.4 brief.
- Opened the in-repo master PNG.
- Reported base/body/discarded-helmet/non-helmet/camera hashes before geometry work.
- Measured the preserved neck opening and slit transforms.
- Generated one new helmet mesh from seven primary blocking sections; no oval vertices were reused.
- Hard-failed on any non-helmet mesh, camera, object state, transform, material assignment, or mesh-count drift.
- Rendered normal and unlit/no-slit success-test panels; opened the actual final sheet.
- Reopened the output blend and verified all required hashes.
- Evidence source: `LOCAL_COMMAND_VERIFIED`, `MASTER_PNG_VISUALLY_INSPECTED`, `BLOCKING_SPEC_APPLIED`, `BLENDER_REOPEN_VERIFIED`, `ACTUAL_OUTPUT_PNG_VISUALLY_INSPECTED`.

## RESULT

`PASS_FAIL = PASS`

`BLOCKER = NONE`

`OUTPUT_STATUS = CANDIDATE`

`BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_MICRO_GEOMETRY_CORRECTION_V0_2.blend`

`BODY_HASH_BEFORE = 4CA371D49D0F0116DCDB4CB3696063B7FD0E66BC05FA3F76445E90C0EF7D4838`

`BODY_HASH_AFTER = 8ECC4390491674A56800F51B19ECBE2E74143659D3572F334B5BFDCB2D9D70B3`

`NEW_HELMET_HASH = 1AB765BEDEEC8060F8E81FD79E45A3160EE7CA42E7855A555A427A3E57EA1C94`

`HELMET_SCOPE_DRIFT = NO`

`SUCCESS_TEST_UNLIT_NO_SLIT = PASS`

`OVAL_EGG_READ = NO`

`NEEDS_LOCKED_2D_PROFILE_GUIDE = NO`

`LOOKDEV_CHANGE = NO`

`CANON_LOCK = NO`

`ASSET_LOCK = NO`

`PUBLIC_RENDER_READY = NO`

`COMMIT_STATUS = NOT_COMMITTED`

`STARTING_COMMIT = 3508908`

`PUSH_STATUS = NOT_PUSHED`

`NEXT_SAFE_ACTION = operator/Lane B performs the owner review against the locked blocking spec; stop here with no further helmet polish, lock, or readiness claim until a new explicit gate`
