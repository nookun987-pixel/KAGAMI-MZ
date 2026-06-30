# MIKAGE PUBLIC HERO RENDER CANDIDATE V0.1 PROOF

## Result

`PASS_FAIL = FAIL`

`OUTPUT_STATUS = CANDIDATE_EVIDENCE_ONLY`

`BLOCKER = SSOT_TOY_LIKE_BLOCKY_SOURCE_READ`

`NEXT_SAFE_ACTION = operator opens a separately scoped geometry refinement gate from an approved non-toy public-figure base; do not promote this render`

## Fresh Source Evidence

- SOURCE_BLEND: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_ACTOR_COMPLETION_LOOKDEV_V0_2.blend`
- SOURCE_BLEND_SHA256: `C1FEE277C2B614E2E24CE6CA88E237973BFD84EE12DA2B2E2001BED63F01EC1B`
- SOURCE_OBJECT_COUNT_BEFORE_RENDER: `122`
- SOURCE_OBJECT_COUNT_AT_RENDER: `122`
- RENDER_TIMESTAMP_START: `2026-06-30T16:02:43.622+07:00`
- Blender: `5.1.2`
- Render engine: `BLENDER_EEVEE`
- Source loaded directly in background mode: YES
- Source `.blend` saved or edited: NO
- Geometry, rig, material, constraint, driver, or animation edit: NONE

The hash and object count were reported before the fresh render began. Blender then reported the same exact source path and object count while producing the six fresh panels.

## Outputs

- Plain contact sheet: `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_CONTACT_SHEET.png`
- Proof: `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PROOF.md`
- Contact-sheet dimensions: `2160 x 1920`
- Layout: plain `3 x 2`, six source-camera renders
- Styled `FORMATION` poster treatment: NONE
- Additional repository output: NONE

## Actual Render Inspection

The final contact sheet was opened and inspected at original resolution after the fresh render.

- Fresh source evidence: confirmed from V0.2 at the timestamp above.
- Faceless helmet: visible.
- Sensor slits: exactly two visible violet slits.
- Violet wash/fill outside slits: not observed.
- Blade: visible as a separate vertical slab.
- Full-figure evidence: present in front, three-quarter, side, and full-body views.
- Toy-like/blocky read: **FAIL**. The torso is a flat rectangular slab; arms/hands and attached pieces retain primitive proxy construction; the overall figure reads as a technical blockout rather than premium public-character form.
- SSOT rule applied: `docs/mikage_character_visual_spec.md`, section `7. ABSOLUTE FORBIDDEN` — plastic/PVC/toy-like surface read is forbidden.
- Commercial/public hero readiness: **FAIL**. The figure does not satisfy the SSOT requirement for a premium public-facing character read.

## Status Locks

- PUBLIC_RENDER_READY: NO
- PRODUCTION_RIG_READY: NO
- ASSET_LOCK: NO
- CANON_LOCK: NO
- VISUAL_APPROVAL: NO
- PUSH_STATUS: NOT_PUSHED
- DEPLOY_STATUS: NOT_DEPLOYED

## Files Changed

- `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_CONTACT_SHEET.png`
- `production/character/reviews/MIKAGE_PUBLIC_HERO_RENDER_CANDIDATE_V0_1_PROOF.md`

## Evidence Source

- `LOCAL_COMMAND_VERIFIED`
- `FRESH_EEVEE_RENDER_FROM_EXACT_V0_2_SOURCE`
- `ACTUAL_FINAL_PNG_VISUALLY_INSPECTED`

This proof records candidate evidence only. It does not promote, approve, lock, or declare the rendered figure ready for public use.
