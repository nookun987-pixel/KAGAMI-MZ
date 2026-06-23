# MIKAGE_RIDER_SOLO_EEVEE_V0_1_PROOF

## Scope

- TASK = `MIKAGE_RIDER_SOLO_EEVEE_V0_1`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_1.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_1_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Isolation Performed

- Created a new derivative blend from the V0.8 rider blend.
- Hidden/excluded steed, chassis, cargo, floor/background, and all other non-rider mesh objects from render.
- Preserved the existing V0.8 Mikage rider and Zenith Blade geometry; no rider redesign or re-proportioning was performed.
- Rider mesh count visible for render = `31`.
- Non-rider mesh count hidden for render = `174`.
- Non-rider mesh count visible for render = `0`.

## Material And Signal Lock

- Rider porcelain shell/armor material family preserved from V0.6/V0.8.
- Rider graphite underlayer/hair/mantle material family preserved from V0.6/V0.8.
- Violet signal objects in the solo rider blend = `2`.
- Violet signal objects:
  - `v08_rider_two_slit_signal_upper_only`
  - `v08_rider_two_slit_signal_lower_only`
- Violet is restricted to the two rider slits in the rendered solo sheet.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS_TARGET = `3600 x 1800`
- IMAGE_DIMENSIONS_ACTUAL = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = material, no violet signal objects rendered
- PASS_2 = material plus the two rider slit signal objects
- PANEL_PLAN =
  - column 1: solo rider full-figure front hero view
  - column 2: solo rider full-figure side/blade view
  - column 3: solo rider upper-body close view
- VOID_BACKGROUND_CHECK = sampled contact sheet pixels: `20,20 = 5,5,8`; `3580,20 = 5,5,8`; `20,1780 = 5,5,8`
- RIDER_GEOMETRY_FINGERPRINT_UNCHANGED = `True`
- SOLO_BLEND_REOPEN_CHECK = output blend reopened in Blender read-only verification after save.
- ACTUAL_IMAGE_INSPECTION = rendered PNG opened and inspected; it shows only solo Mikage rider plus Zenith Blade on void black, with full-figure and upper-body close framing.
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Locked Preservation

- SOURCE_V0_8_OVERWRITE_CHECK = source V0.8 blend was not modified.
- V0_2_TO_V0_8_OVERWRITE_CHECK = prior V0.2-V0.8 blend files were not modified.
- NO_RIDER_REDESIGN_CHECK = rider geometry was not edited; only isolation, camera/framing, temporary lights, and render output were changed.
- NO_STEED_REDESIGN_CHECK = steed/chassis/cargo were hidden in the solo derivative and not redesigned.

## Validation

- BLEND1_CHECK = no `.blend1` backup remains after explicit cleanup/check before commit.
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md`
  - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_1.blend`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_1_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_1_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; Blender solo derivative save/reopen/render; PNG composition and dimension check; actual contact sheet inspection; solo blend read-only verification; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator solo-rider visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
