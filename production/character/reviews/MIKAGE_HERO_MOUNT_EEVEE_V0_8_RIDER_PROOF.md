# MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
- DRAFT_REFERENCE = `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png` (draft art-direction reference only, not canon)
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Rider Detail Performed

1. HELMET
   - Added V0.8 porcelain egg helmet with subtle flat facets.
   - Exactly two rider slit signal objects are present in the V0.8 rider group.

2. ARMOR
   - Added hero-scale porcelain pauldrons, layered cuirass, graphite underlayer, and segmented abdominal plates.

3. HAIR AND MANTLE
   - Added heavy graphite hair mass and V-taper graphite mantle behind the shoulders.

4. ZENITH BLADE
   - Added slab blade with graphite handle seated inside the gauntlet and a lower registered holster; blade is not floating.

5. RIDER SCALE / SEATING
   - Rebuilt the rider group larger than the V0.6 proxy and seated into the existing saddle location so Mikage reads as riding.

6. MATERIAL ASSIGNMENT
   - Rider shell/armor = V0.6 porcelain material `v06_rerun_porcelain_f2eeea_bright_soft_reflection`.
   - Underlayer/hair/mantle/handle = V0.6 graphite material `v06_rerun_graphite_black_hair_liner_low_reflectance`.
   - Violet = V0.6 signal material `v06_rerun_violet_8f00ff_signal_only` restricted to rider two slits and hoof points.

## Locked Preservation

- STEED_GEOMETRY_CHANGED = `False`
- STEED_FINGERPRINT_UNCHANGED = `True`
- SOURCE_OVERWRITE_CHECK = V0.6 opened as input; V0.8 saved to a new blend path.
- V0.6 material/lighting palette preserved for the review render; new rider parts use the existing V0.6 material family.
- No rig, animation, locomotion, steed redesign, new colors, warm color, halo, or violet flood was added.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS_TARGET = `3600 x 1800`
- IMAGE_DIMENSIONS_ACTUAL = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = material, no violet signal objects rendered
- PASS_2 = identical review with violet signal objects restored
- VOID_BACKGROUND_CHECK = sampled contact sheet pixels: `20,20 = 1,1,2`; `1800,20 = 1,1,2`; `3580,20 = 1,1,2`
- FULL_FRAME_CHECK = actual PNG opened and inspected; review sheet shows complete rider and mount across the three views and both passes without silhouette-critical cropping.
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.8 blend was reopened after save before render.
- BLEND1_CHECK = no `.blend1` backup remains after explicit cleanup/check before commit.
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md`
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source checks; Blender V0.8 rider save/reopen/render; PNG dimension check; actual contact sheet inspection; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator rider-detail visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
