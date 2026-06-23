# MIKAGE_HERO_MOUNT_EEVEE_V0_6_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_6`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Material Lookdev Performed

1. PORCELAIN
   - Assigned `v06_porcelain_f2eeea_soft_reflection`.
   - Used on rider shell and armor surfaces.
   - Light value with soft reflection.

2. GRAPHITE
   - Assigned `v06_graphite_dark_low_reflectance_hair_mass`.
   - Used on underlayer, hair mass, black liner, and graphite structural reads.
   - Hair remains a solid mass, not strands.

3. COLD STEEL
   - Assigned `v06_cold_steel_mid_gray_sharp_cool_specular`.
   - Used on steed chassis, panels, legs, and mechanical support surfaces.
   - Mid-value neutral cool grey with sharper cool specular edges.

4. VIOLET SIGNAL
   - Assigned `v06_violet_8f00ff_signal_only`.
   - Restricted to rider two slits and hoof signal points.
   - Steed head sensor/slit objects are graphite, not violet.

## Lighting Performed

- Added neutral soft key light.
- Added contact-shadow support under hooves.
- Added cool rim lights for head, hair, withers, and croup separation.
- No ambient violet, halo, warm color, red, crimson, or gold was added.

## Geometry Lock

- GEOMETRY_CHANGED = `False`
- Blender script validated mesh fingerprint before save and after reopen:
  - `GEOMETRY_FINGERPRINT_UNCHANGED True`
- No mesh transform, dimensions, vertex count, polygon count, silhouette, or proportion changes were made.
- SOURCE_OVERWRITE_CHECK = V0.2/V0.3/V0.4/V0.5 were not modified; V0.6 was saved as a new file.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = material lookdev with neutral cool light, no violet
- PASS_2 = identical material lookdev with violet signal restored
- FULL_FRAME_CHECK = actual rendered PNG opened and inspected; review sheet shows complete rider and mount framing in all panels
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.6 was reopened after save before render
- PNG_DIMENSION_CHECK = `3600 x 1800`
- BLEND1_CHECK = no `.blend1` backup found after explicit cleanup and before staging
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md` for approved V0.6 exception
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source checks; Blender V0.6 material-lighting save/reopen/render; PNG dimension check; actual contact sheet inspection; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator full-frame material/lighting review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
