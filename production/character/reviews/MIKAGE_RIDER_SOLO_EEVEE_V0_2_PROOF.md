# MIKAGE_RIDER_SOLO_EEVEE_V0_2_PROOF

## Scope

- TASK = `MIKAGE_RIDER_SOLO_EEVEE_V0_2`
- SOURCE_FILE = `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_1.blend`
- DRAFT_REFERENCE = `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png` (draft art-direction reference only, not canon)
- OUTPUT_BLEND = `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_2.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_2_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Rider Detail-Build Performed

1. HAIR MASS
   - Added graphite crown side-wraps, a heavy rear hair sheet, and a lower V-tail block around/behind the helmet.

2. MANTLE
   - Added graphite V-taper mantle masses behind the shoulders plus a center graphite shadow spine.

3. LAYERED ARMOR
   - Added angular porcelain pauldron top planes and drop facets.
   - Added raised porcelain chest cuirass keystone and upper breast ridge.
   - Added graphite torso side/joint underlayer and waist shadow.
   - Added segmented porcelain abdominal plates.

4. HELMET
   - Preserved the egg helmet form.
   - Added subtle porcelain front/cheek facets and graphite under-chin shadow.
   - Preserved exactly two rider slit signal objects.

5. ZENITH BLADE / GAUNTLET
   - Added visible graphite blade handle, porcelain gauntlet clamp, graphite hand connection bridge, and a reseated porcelain blade slab/inset so the blade reads held in the gauntlet rather than floating.

6. PROPORTION READ
   - Added chest, waist, limb-taper, thigh, and knee-joint blocks to reduce the generic mannequin read while staying within the approved solo rider detail-build scope.

## Material And Signal Lock

- Porcelain shell/armor uses `v06_rerun_porcelain_f2eeea_bright_soft_reflection`.
- Graphite hair/mantle/underlayer/joints/handle uses `v06_rerun_graphite_black_hair_liner_low_reflectance`.
- Violet signal visible objects = `2`.
- Violet signal objects:
  - `v08_rider_two_slit_signal_upper_only`
  - `v08_rider_two_slit_signal_lower_only`
- Visible non-rider mesh count = `0`.
- V0.2 added mesh count = `37`.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS_TARGET = `3600 x 1800`
- IMAGE_DIMENSIONS_ACTUAL = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = material, no violet signal objects rendered
- PASS_2 = material plus the two rider slit signal objects
- PANEL_PLAN =
  - column 1: full front rider detail view
  - column 2: full side blade/mantle view
  - column 3: upper-body detail close view
- VOID_BACKGROUND_CHECK = sampled contact sheet pixels: `20,20 = 5,5,8`; `3580,20 = 5,5,8`; `20,1780 = 5,5,8`
- ACTUAL_IMAGE_INSPECTION = rendered PNG opened and inspected; sheet shows solo rider on void black with full-figure and upper-body close framing for armor, hair, mantle, two slits, and blade-gauntlet review.
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Locked Preservation

- SOLO_ISOLATION_CHECK = no steed/chassis/cargo is visible for render.
- SOURCE_V0_1_OVERWRITE_CHECK = source solo V0.1 blend was not modified.
- PRIOR_BLEND_OVERWRITE_CHECK = V0.2-V0.8 prior blends were not modified.
- PALETTE_LOCK_CHECK = void/porcelain/graphite/violet-signal palette only; no warm color, no flood, no halo.
- NO_RIG_ANIMATION_CHECK = no rig or animation work performed.

## Validation

- SOLO_BLEND_REOPEN_CHECK = V0.2 blend was reopened in Blender before rendering.
- BLEND1_CHECK = no `.blend1` backup remains after explicit check before commit.
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md`
  - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_2.blend`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_2_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_2_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source/reference checks; Blender V0.2 detail-build save/reopen/render; PNG composition and dimension/pixel checks; actual contact sheet inspection; `.blend1` check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator V0.2 solo-rider visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
