# MIKAGE_RIDER_SOLO_EEVEE_V0_3_PROOF

## Scope

- TASK = `MIKAGE_RIDER_SOLO_EEVEE_V0_3`
- SOURCE_FILE = `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_2.blend`
- DRAFT_REFERENCE = `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png` (draft art-direction reference only, not canon)
- OUTPUT_BLEND = `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_3_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Geometry Upgrade Performed

1. BLADE GRIP
   - Added porcelain gauntlet finger-wrap bars around the graphite Zenith Blade handle.
   - Added graphite palm socket, porcelain blade guard, and aligned held blade slab so the blade reads registered to the hand.

2. DE-BLOCKY / TAPER
   - Added bevel modifiers to existing visible rider meshes.
   - Added tapered forearms, tapered shins, chest facets, waist cuts, and shoulder-to-cuirass transition plates.
   - Preserved the established solo pose and silhouette read.

3. HAIR
   - Added longer graphite outer hair masses, center spine, and lower tail point behind/around the helmet.

4. MANTLE
   - Added wider graphite V-taper mantle masses behind the shoulders plus a lower V point.

## Render / Palette Lock

- Visible rider mesh count = `93`.
- V0.3 added mesh count = `25`.
- Existing visible rider meshes given bevel modifiers = `68`.
- Visible non-rider mesh count = `0`.
- Violet signal visible objects = `2`.
- Violet signal objects:
  - `v08_rider_two_slit_signal_upper_only`
  - `v08_rider_two_slit_signal_lower_only`
- Render exposure = `-1.35`.
- Porcelain material value was lowered in the V0.3 derivative to preserve form separation and reduce blown highlights.
- Violet slit emission was kept low and restricted to the two slits.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS_TARGET = `3600 x 1800`
- IMAGE_DIMENSIONS_ACTUAL = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = material, no violet signal objects rendered
- PASS_2 = material plus the two rider slit signal objects
- PANEL_PLAN =
  - column 1: full front refined rider
  - column 2: full side grip/mantle view
  - column 3: upper-body grip/armor close view
- VOID_BACKGROUND_CHECK = sampled contact sheet pixels: `20,20 = 5,5,8`; `3580,20 = 5,5,8`; `20,1780 = 5,5,8`
- HIGHLIGHT_CHECK = sampled max channel still contains small clipped edge/specular pixels, but the actual image was opened and inspected; porcelain form separation remains visible and is no longer flat rescue-grade white.
- ACTUAL_IMAGE_INSPECTION = rendered PNG opened and inspected; sheet shows solo rider on void black with readable grip, armor, graphite undersuit, long hair, V mantle, and two controlled violet slits.
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Locked Preservation

- SOLO_ISOLATION_CHECK = no steed/chassis/cargo visible for render.
- SOURCE_V0_2_OVERWRITE_CHECK = source solo V0.2 blend was not modified.
- PRIOR_BLEND_OVERWRITE_CHECK = prior solo/source blends were not modified.
- POSE_LOCK_CHECK = no animation, rig, or pose change was performed.
- PALETTE_LOCK_CHECK = void/porcelain/graphite/violet-signal palette only; no warm color, no flood, no halo.

## Validation

- SOLO_BLEND_REOPEN_CHECK = V0.3 blend was reopened in Blender before rendering.
- BLEND1_CHECK = no `.blend1` backup remains after exact cleanup/check before commit.
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md`
  - `production/character/MIKAGE_RIDER_SOLO_EEVEE_V0_3.blend`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_3_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_RIDER_SOLO_EEVEE_V0_3_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source/reference checks; Blender V0.3 geometry-upgrade save/reopen/render; PNG composition and dimension/pixel checks; actual contact sheet inspection; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator V0.3 solo-rider visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
