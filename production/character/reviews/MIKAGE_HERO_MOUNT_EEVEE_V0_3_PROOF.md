# MIKAGE_HERO_MOUNT_EEVEE_V0_3_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_3`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_2.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_3.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock

## Approved Corrections Performed

1. EQUINE READABILITY
   - Strengthened the existing equine head and neck read.
   - Raised withers, croup, and existing curved spine plates to reduce flat-platform silhouette.
   - Added only small structural graphite/metal masses needed for head-neck readability.

2. LOAD-BEARING LEGS
   - Corrected all four legs with heavier upper-leg mass.
   - Added controlled taper support and broader hoof/contact terminals.
   - Slightly widened stance where needed for weight readability.

3. RIDER SEATING
   - Lowered Mikage and the existing weapon relationship into the mount.
   - Reduced the visible docking/platform mass beneath the rider.
   - Added a small graphite seating recess so the silhouette reads as riding rather than standing.

## Locked Preservation

- NO_MESH_REDESIGN_CHECK = no full redesign, no new ornaments, no new armor language, no new appendages outside leg support correction, no blade redesign
- GRAYSCALE_LOCK_CHECK = existing grayscale material treatment preserved
- VIOLET_SIGNAL_LOCK_CHECK = existing violet signal treatment preserved; violet remains only rider slits and minimal hoof signal points
- V0_2_OVERWRITE_CHECK = V0.2 source blend was opened as input only and V0.3 was saved as a new file

## Render Evidence

- RENDER_ENGINE = Blender 5.1 Eevee local render
- IMAGE_DIMENSIONS = `3600 x 1800`
- LAYOUT = `3 views x 2 passes`
- PASS_1 = grayscale/clay readability
- PASS_2 = same geometry with preserved violet signal
- FULL_FRAME_CHECK = contact sheet opened and inspected; panels show complete rider and mount framing for review, including mount head, neck, topline, all four legs, hoof/support terminals, rider seating, and blade relationship
- VISUAL_APPROVAL = not claimed; final visual ruling belongs to operator

## Validation

- SAVED_BLEND_REOPENED = yes, V0.3 was reopened after save before render
- BLEND1_CHECK = no `.blend1` backup found after explicit cleanup and before staging
- FILES_CHANGED_EXPECTED =
  - `AGENTS.md` for approved V0.3 exception
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_3.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_3_PROOF.md`

## Closeout Fields

- COMMANDS_RUN = governance reads; git status/branch/log; AGENTS diff verification; Blender scene inspection; Blender V0.3 build/reopen/render; PNG dimension check; image open inspection; `.blend1` check/delete; git stage/commit/final verification
- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, actual PNG visual inspection
- REPO_STATUS = pre-commit file set limited to `AGENTS.md` approved exception plus three V0.3 candidate outputs; final clean status to be verified after commit
- PASS_FAIL = candidate created for operator review only; no visual approval claim
- BLOCKER = none at proof write time
- NEXT_SAFE_ACTION = hold for operator full-frame visual review; do not push unless separately authorized
- COMMIT_DONE = to be verified after local commit
- COMMIT_HASH = final hash reported after commit
- PUSH_DONE = no
