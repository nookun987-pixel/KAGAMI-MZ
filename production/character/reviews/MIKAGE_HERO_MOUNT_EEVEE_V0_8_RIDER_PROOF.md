# MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
- SOURCE_REVIEW_REFERENCE = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
- DRAFT_ART_DIRECTION_REFERENCE = `production/character/keyart_candidates/MIKAGE_SOLO_BW_V0_4.png` (DRAFT only; not canon)
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock, no public-render-ready claim

## Rider Detail Groups Performed

1. HELMET
   - Added `v08_rider_helmet_larger_porcelain_egg_form`.
   - Added subtle grayscale facet planes.
   - Added exactly two V0.8 violet signal slits: `v08_rider_two_slit_signal_upper_exactly_one` and `v08_rider_two_slit_signal_lower_exactly_two`.

2. ARMOR
   - Added hero-scale angular white pauldrons.
   - Added layered porcelain chest cuirass.
   - Added graphite underlayer read.
   - Added stacked abdominal plates.

3. HAIR / MANTLE
   - Added long black hair as a solid mass, not strands.
   - Added lower V-taper hair mass.
   - Added graphite V-taper mantle accents behind shoulders.

4. BLADE / GAUNTLET REGISTRATION
   - Added porcelain gauntlet around the blade grip.
   - Added visible graphite handle.
   - Added steel slab Zenith Blade registered to the gauntlet.
   - Added lower holster/clamp read against the mount side.

5. RIDER PRESENCE / MATERIALS
   - Added 24 V0.8 rider-detail objects over the existing rider proxy/detail layer.
   - Assigned V0.6-compatible materials: porcelain shell/armor, graphite underlayer/hair/mantle, cool steel blade, violet signal only.

## Locked Preservation

- STEED_GEOMETRY_CHANGED = `False`
- STEED_GEOMETRY_VALIDATION = Blender reopened V0.8 and compared steed mesh fingerprint against V0.6; result `True`.
- RIDER_BLADE_HELMET_SCOPE = rider/blade/helmet were detailed within V0.8 scope; no steed redesign.
- STEED_MASS_LOCK = preserved; no V0.5/V0.6 steed geometry transforms, mesh edits, or proportion changes were performed.
- PALETTE_LOCK = void `#050508`, porcelain `#f2eeea`, violet `#8F00FF`; steel/graphite remain cool greys.
- VIOLET_SIGNAL_LOCK = violet restricted to rider two slits plus existing hoof signal points; no ambient violet, halo, flood, wash, crimson, red, gold, or warm-tone additions.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 local Eevee.
- REVIEW_RENDER = `3600 x 1800` contact sheet.
- LAYOUT = `3 views x 2 passes`.
- PASS_1 = material pass with violet signal hidden.
- PASS_2 = identical geometry/material pass with violet signal restored.
- PANEL_CONTENT = one full-mount context view plus two tight rider close-up views per pass.
- PNG_DIMENSION_CHECK = `3600 x 1800`.
- PNG_OPEN_INSPECTION = actual PNG opened with Windows System.Drawing image API because app `view_image` and in-app browser inspection were blocked by Windows sandbox helper errors.
- PNG_PIXEL_EVIDENCE = sampled non-void pixels across all six panels: `2889,7239,5229,2889,7239,5230`; sampled violet pixels: `5`, supporting signal-only behavior.
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator.

## Validation

- SAVED_BLEND_REOPENED = yes.
- V0_8_OBJECT_COUNT = `24` new `v08_` objects.
- EXACT_TWO_V0_8_SLITS = yes.
- V0_2_TO_V0_7_SOURCE_OVERWRITE_CHECK = git status showed no modifications to V0.2-V0.7 files during final pre-proof status check.
- WHITELISTED_CHANGED_FILES_EXPECTED =
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER_PROOF.md`
- BLEND1_CHECK = no `.blend1` files found under `production/character` after cleanup.
- SCRATCH_CLEANUP = temporary Blender script and panel directory removed before proof/commit.

## Commands Run

- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- Read canon-control and SSOT files.
- Checked V0.6 source and V0.4 solo draft reference presence.
- Ran Blender object/bounding-box inspection on V0.6.
- Created and ran temporary Blender V0.8 rider-detail/render script.
- Composed contact sheet with Windows System.Drawing after Blender Python lacked PIL.
- Reopened V0.8 blend and validated steed fingerprint unchanged against V0.6.
- Opened PNG with Windows System.Drawing and checked dimensions/panel pixel evidence.
- Removed V0.8 `.blend1` backup and temporary scratch files.
- Checked `.blend1` absence.
- Checked git status before proof write.

## Evidence Source

- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, Windows System.Drawing PNG open/pixel inspection, git stdout.
- REPOSITORY_BASE = branch `main`, base commit `a6f8d02 Round 02 V0.20 review files + npm lockfiles + Windows setup scripts`.

## Closeout

- PASS_FAIL = `PASS_CANDIDATE_CREATED_FOR_OPERATOR_REVIEW`; no visual approval claim.
- BLOCKER = none for candidate creation; note that app-level visual viewer/browser tools were blocked by Windows sandbox helper, so PNG inspection was programmatic rather than tool-visible.
- NEXT_SAFE_ACTION = operator visual review of V0.8 contact sheet; do not push unless separately authorized.
- COMMIT_STATUS = pending at proof write time; final commit hash reported in final chat after commit.
- PUSH_STATUS = no push.