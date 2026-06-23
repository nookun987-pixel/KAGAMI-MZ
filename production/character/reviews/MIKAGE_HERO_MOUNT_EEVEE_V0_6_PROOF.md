# MIKAGE_HERO_MOUNT_EEVEE_V0_6_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_6`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Material Lookdev Performed

RE-RUN NOTE: overwrite V0.6 candidate outputs only; material and lighting correction only; geometry V0.5 kept unchanged.

1. PORCELAIN
   - Assigned `v06_rerun_porcelain_f2eeea_bright_soft_reflection`.
   - Used on rider shell and armor surfaces.
   - Bright value with soft reflection.

2. GRAPHITE
   - Assigned `v06_rerun_graphite_black_hair_liner_low_reflectance`.
   - Used on underlayer, hair mass, black liner, and graphite structural reads.
   - Dark low-reflectance value; hair remains a solid mass, not strands.

3. COLD STEEL
   - Assigned `v06_rerun_cold_steel_darker_neutral_sharp_specular`.
   - Used on steed chassis, panels, legs, and mechanical support surfaces.
   - Darker neutral cool grey with sharper cool specular edges.

4. VIOLET SIGNAL
   - Assigned `v06_rerun_violet_8f00ff_signal_only`.
   - Restricted to rider two slits and hoof signal points.
   - Steed head sensor/slit objects are graphite, not violet.

## Lighting Performed

- Added neutral soft key light.
- Added contact-shadow support under hooves.
- Added stronger cool rim lights for head, hair, withers, and croup separation.
- Rendered over VOID black `#050508` via transparent render composite.
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
- VOID_BACKGROUND_CHECK = sampled background pixels after render/composite: `20,20 = 1,1,2`; `600,100 = 1,1,2`; `1180,20 = 1,1,2`; `1800,100 = 1,1,2`; `3000,100 = 1,1,2`
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.6 was reopened after save before render
- PNG_DIMENSION_CHECK = `3600 x 1800`
- BLEND1_CHECK = no `.blend1` backup found after explicit cleanup and before staging
- FILES_CHANGED_EXPECTED =
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_6.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_6_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; exception verification; source checks; Blender V0.6 material-lighting save/reopen/render; PNG dimension and background pixel check; actual contact sheet inspection; `.blend1` cleanup/check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator full-frame material/lighting review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
