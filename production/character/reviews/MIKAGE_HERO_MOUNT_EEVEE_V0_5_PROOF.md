# MIKAGE_HERO_MOUNT_EEVEE_V0_5_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_5`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_4.blend`
- DRAFT_REFERENCE = `production/character/keyart_candidates/MIKAGE_STEED_SKELETON_BW_V0_5.png`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Detail Refinement Groups Performed

1. EQUINE WEDGE HEAD
   - Refined the graphite steed head into a wedge read.
   - Added forehead, muzzle, lower jaw, cheek planes, and graphite-only sensor slit.
   - No violet was added to the steed head.

2. PISTON LEGS
   - Slimmed the four V0.4 leg reads toward articulated piston legs.
   - Added knee/hock discs, piston shafts, lower piston links, and larger compressed hoof caps.
   - Kept all four legs load-bearing under the existing V0.4 mass.

3. TORSO PANEL PLANES / SEAMS
   - Preserved V0.4 torso mass, withers, croup, curved topline, and belly keel.
   - Added flat chassis panels, side armor planes, belly seam segments, and vertical ribs to reduce blob read.
   - No material/lookdev pass was performed; still grayscale clay candidate.

## Locked Preservation

- RIDER_BLADE_HELMET_CHECK = protected rider/blade/helmet object transforms unchanged in V0.5 script validation (`PROTECTED_RIDER_BLADE_HELMET_CHANGED 0`)
- MASS_LOCK_CHECK = V0.4 overall steed mass/proportions preserved; detail planes and piston articulation added only over the existing mass
- GRAYSCALE_LOCK_CHECK = existing grayscale/clay material treatment preserved
- VIOLET_SIGNAL_LOCK_CHECK = existing violet signal treatment preserved; violet remains rider two slits and minimal hoof signal points only
- SOURCE_OVERWRITE_CHECK = V0.2/V0.3/V0.4 were not modified; V0.5 was saved as a new file

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = grayscale/clay readability
- PASS_2 = same geometry with preserved violet signal
- FULL_FRAME_CHECK = actual rendered PNG opened and inspected; review sheet shows complete rider and mount framing, including wedge head, neck/topline, all four piston legs, hoof/support terminals, rider seating relationship, and blade relationship
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.5 was reopened after save before render
- PNG_DIMENSION_CHECK = `3600 x 1800`
- BLEND1_CHECK = no `.blend1` backup found before staging
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md` for approved V0.5 exception
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_5.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_5_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; source/reference checks; Blender V0.5 build/reopen/render; PNG dimension check; actual contact sheet inspection; `.blend1` check; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator full-frame visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
