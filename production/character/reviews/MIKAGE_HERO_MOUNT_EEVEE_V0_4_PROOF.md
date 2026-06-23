# MIKAGE_HERO_MOUNT_EEVEE_V0_4_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_4`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_3.blend`
- DRAFT_REFERENCE = `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_4.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Re-Mass Groups Performed

1. STEED TORSO
   - Added curved organic mechanical barrel mass.
   - Added readable withers, croup, curved topline plates, and belly keel.
   - Reduced the table-like flat chassis read by lowering/shrinking older platform masses under the new body.

2. EQUINE HEAD AND NECK
   - Added graphite equine head, low muzzle, jaw underplane, and two-part neck sweep.
   - Head remains graphite only.
   - No violet was added to the steed head.

3. LEG BLENDING
   - Preserved and strengthened the existing V0.3 four-leg support layout.
   - Added body sockets, upper load columns, and hoof ground pads so the legs read under the new torso mass.

4. RIDER SEATING READ
   - Rider, blade, helmet, and face-rule objects were not remodeled or transformed.
   - The steed back/recess was re-massed around the existing rider position so the rider reads more seated into the mount.

## Locked Preservation

- RIDER_BLADE_HELMET_CHECK = protected rider/blade/helmet object transforms unchanged in V0.4 script validation (`PROTECTED_RIDER_BLADE_HELMET_CHANGED 0`)
- GRAYSCALE_LOCK_CHECK = existing grayscale material treatment preserved
- VIOLET_SIGNAL_LOCK_CHECK = existing violet signal treatment preserved; violet remains rider two slits and minimal hoof signal points only
- V0_3_OVERWRITE_CHECK = V0.3 source blend was opened as input only; V0.4 was saved as a new file
- V0_2_OVERWRITE_CHECK = V0.2 was not modified

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = grayscale/clay readability
- PASS_2 = same geometry with preserved violet signal
- FULL_FRAME_CHECK = actual rendered PNG opened and inspected; review sheet shows complete rider and mount framing, including steed head, neck, topline, all four legs, hoof/support terminals, rider seating relationship, and blade relationship
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.4 was reopened after save before render
- PNG_DIMENSION_CHECK = `3600 x 1800`
- BLEND1_CHECK = no `.blend1` backup found before staging
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md` for approved V0.4 exception
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_4.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_4_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source/reference checks; reference PNG open; Blender V0.4 build/reopen/render; PNG dimension check; actual contact sheet inspection; `.blend1` check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator full-frame visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
