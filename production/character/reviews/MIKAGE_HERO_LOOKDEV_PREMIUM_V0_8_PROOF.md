# MIKAGE HERO LOOKDEV PREMIUM V0.8 — PROOF

- TASK: `MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8`
- STATUS: `CANDIDATE_ONLY`
- BASE_SELECTED: `production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`
- OUTPUT_BLEND: `production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`
- EVIDENCE_SOURCE: local Blender 5.1.2 renders, Blender reopen inspection, and direct PNG inspection

## Geometry lock

- BODY_HASH_BEFORE: `d1c90181ff56dc88dd8b73b3dff5c3c43470f1812434369cfa091dfa1485c180`
- BODY_HASH_AFTER_REOPEN: `d1c90181ff56dc88dd8b73b3dff5c3c43470f1812434369cfa091dfa1485c180`
- BODY_HASH_UNCHANGED: `YES`
- NARROW_PERIMETER_FALLBACK_USED: `NO`
- GEOMETRY_CHANGED: `NO`

## Stage A — neutral clay validation

- OUTPUT: `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CLAY_VALIDATION.png`
- DIMENSIONS: `1400 x 1400`
- MATERIAL: matte off-white neutral clay, low specular
- LIGHT: one large neutral softbox
- HALO: hidden
- ACTUAL_PNG_INSPECTED: `YES`
- FACE_PLANE_CONTINUOUS_WITH_SHELL: `YES`
- SEPARATE_MECHANICAL_FACEPLATE_READ: `NO`

## Stage B — premium lookdev

- OUTPUT: `production/character/reviews/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8_CONTACT_SHEET.png`
- DIMENSIONS: `3600 x 900`
- PANELS: front, three-quarter, strict side, helmet close-up
- PORCELAIN: `#f2eeea`, semi-matte coat, restrained micro-bump
- UNDERLAYER: deep matte graphite
- BLADE: cold metal / muted Z-Blue family, non-emissive
- HALO: restrained white, non-emissive
- WORLD: void-black `#050508`
- LIGHTING: upper-left Rembrandt area key plus soft controlled cool rim; fill near zero
- VIOLET: `#8F00FF`, restrained emission
- VIOLET_SIGNAL_OBJECT_COUNT: `2`
- VIOLET_SIGNAL_OBJECTS: `PUBLIC_BLOCK_V03_sensor_slit_left_violet_only`; `PUBLIC_BLOCK_V03_sensor_slit_right_violet_only`
- VIOLET_OUTSIDE_TWO_SLITS: `NO`
- ACTUAL_PNG_INSPECTED: `YES`

## Validation

- OUTPUT_BLEND_REOPEN: `PASS`
- BODY_HASH_LOCK: `PASS`
- TWO_SLIT_RULE: `PASS`
- CLAY_FACE_PLANE_CHECK: `PASS`
- OUTPUT_STATUS_DISCIPLINE: `PASS — CANDIDATE only`
- `.blend1` RESULT: `NONE` after cleanup
- CANON_LOCK: `NO`
- ASSET_LOCK: `NO`
- PUBLIC_RENDER_READY: `NOT_CLAIMED`
- PRODUCTION_READY: `NOT_CLAIMED`
- PUSH_STATUS: `NOT_RUN`

## Commands run

Repo status/branch/log checks; governance, handoff, task, recipe, and SSOT reads; master-reference SHA-256 check; Blender base inspection; Blender material/light build and renders; Blender output reopen/hash check; direct image inspection; PNG dimension check; `.blend1` cleanup; task validator; local git commit.

## Result

- PASS_FAIL: `FAIL`
- BLOCKER: `VALIDATOR_SCHEMA_MISMATCH — verify_output.py requires contact_sheet.png and contact_sheet_review_report.md for CONTACT_SHEET_ONLY, but active_task.yaml does not whitelist those outputs`
- FINAL_VISUAL_RULING: `OWNER`
- COMMIT_STATUS: `NOT_RUN — validator did not PASS`
- NEXT_SAFE_ACTION: Owner/Lane B reconcile the active-task gate schema, then rerun validation and commit; stop here.
