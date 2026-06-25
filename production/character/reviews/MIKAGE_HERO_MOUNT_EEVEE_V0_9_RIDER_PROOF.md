# MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER_PROOF

## Scope

- TASK = `MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER_STRUCTURAL_CLEANUP`
- SOURCE_FILE = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_8_RIDER.blend`
- OUTPUT_BLEND = `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER.blend`
- CONTACT_SHEET = `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER_CONTACT_SHEET.png`
- STATUS = candidate only; no visual approval, no production-ready claim, no canon-lock, no asset-lock, no public-render-ready claim
- PUSH_STATUS = no push

## Cleanup Performed

1. ARM / LEG JOINT SIMPLIFICATION
   - Added V0.9 large mechanical cover layer over rider limbs.
   - Replaced visible rider rod-like limb read with larger porcelain/graphite sleeves.
   - Added faceted non-spherical elbow, knee, wrist, and ankle couplers.
   - Hidden 7 older rod-like rider proxy objects from render to reduce toy-like separation.

2. BALL-LIKE RIDER JOINT CLEANUP
   - Added rectangular/faceted armored couplers named with `no_ball` intent.
   - No new spherical V0.9 rider joint objects were added.
   - Any remaining exposed rounded forms in full-mount views belong to preserved steed geometry and were not altered by this rider-only pass.

3. PELVIS / SEAT / STEED CONNECTION
   - Added `v09_graphite_saddle_yoke_pelvis_to_steed_single_socket`.
   - Added front/rear porcelain pelvis lock plates.
   - Added vertical graphite seat spine and clean saddle-recess shadow wedge.
   - Goal was to make Mikage read seated into a mechanical socket instead of hovering on disconnected blocks.

4. RIDER SILHOUETTE CLARITY
   - Added centerline machine spine and side unifying ribs under the pauldrons.
   - Preserved rider pose, scale, helmet, blade placement, and palette.
   - Kept forms large/readable for hero-crop cameras; avoided decorative micro-detail.

## Locked Preservation

- STEED_GEOMETRY_CHANGED = `False`
- STEED_GEOMETRY_VALIDATION = Blender reopened V0.8 and V0.9 and compared steed mesh fingerprint for prefixes `steed`, `v03_`, `v04_`, and `v05_`; result `True`.
- RIDER_POSE_SCALE_HELMET_PALETTE = preserved; V0.9 is a cover/cleanup layer over the V0.8 rider candidate.
- VIOLET_LOCK = no new V0.9 violet/signal/slit objects were created; validation result `V09_NEW_VIOLET_OBJECTS 0`.
- PALETTE_LOCK = porcelain/graphite/cool steel only for new V0.9 parts; existing violet signal remains signal-only.
- STEED_LIMITATION = steed geometry and its existing rounded mechanical forms were preserved exactly as required, so V0.9 does not claim steed joint cleanup.

## Render Evidence

- RENDER_ENGINE = Blender 5.1 local Eevee.
- REVIEW_RENDER = `3600 x 1800` contact sheet.
- LAYOUT = `3 x 2` panels.
- PANEL_CONTENT = full mount front, full mount side, rider hero crop, seat connection, rider 3/4 machine read, rider side joint cleanup.
- PNG_DIMENSION_CHECK = `3600 x 1800`.
- PNG_OPEN_INSPECTION = actual rendered PNG opened with Codex image viewer and Windows System.Drawing image API.
- PNG_PIXEL_EVIDENCE = sampled non-void pixels across all six panels: `3798,3277,6046,6984,6621,2639`; sampled violet pixels: `14`, limited to existing signal areas and labels/camera sampling.
- VISUAL_REVIEW_NOTE = rider reads more unified than V0.8 in hero/front views; final visual ruling remains operator-owned.

## Validation

- SAVED_BLEND_REOPENED = yes.
- V0_9_OBJECT_COUNT = `31` new `v09_` objects.
- V0_9_HIDDEN_RODLIKE_RIDER_PARTS = `7`.
- V0_9_NEW_VIOLET_OBJECTS = `0`.
- STEED_GEOMETRY_UNCHANGED = `True`.
- PNG_DIMENSIONS = `3600 x 1800`.
- BLEND1_CHECK = no `.blend1` files found under `production/character` after cleanup.
- SCRATCH_CLEANUP = temporary Blender script and raw panel directory removed before proof/commit.
- WHITELISTED_CHANGED_FILES_EXPECTED =
  - `production/character/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER.blend`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER_CONTACT_SHEET.png`
  - `production/character/reviews/MIKAGE_HERO_MOUNT_EEVEE_V0_9_RIDER_PROOF.md`

## Commands Run

- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- Read canon-control, character visual spec, cine color contract, and V0.8 proof.
- Opened V0.8 contact sheet for visual inspection.
- Ran Blender V0.8 object inspection.
- Created and ran temporary Blender V0.9 rider-cleanup/render script.
- Composed contact sheet with Windows System.Drawing.
- Opened V0.9 contact sheet for actual visual inspection.
- Reopened V0.9 blend and compared steed geometry fingerprint against V0.8.
- Opened PNG with Windows System.Drawing for dimensions/panel/pixel evidence.
- Removed `.blend1` and temporary scratch files.
- Checked git status before proof write.

## Evidence Source

- EVIDENCE_SOURCE = local PowerShell stdout, Blender stdout, Codex image viewer inspection, Windows System.Drawing PNG open/pixel inspection, git stdout.
- REPOSITORY_BASE = branch `main`, base commit `386dd44 Add Mikage hero mount V0.8 rider detail candidate`.

## Closeout

- PASS_FAIL = `PASS_CANDIDATE_CREATED_FOR_OPERATOR_REVIEW`.
- PASS_CHECK_RIDER_COHERENT_MACHINE = pass candidate; V0.9 adds unified mechanical cover layer and hides rod-like rider proxy parts.
- PASS_CHECK_NO_EXPOSED_TOYLIKE_RIDER_BALL_JOINTS = pass candidate for rider-only scope; remaining rounded steed hardware is preserved by lock.
- PASS_CHECK_SEAT_CONNECTION_UNDERSTANDABLE = pass candidate; saddle yoke and pelvis lock plates added.
- PASS_CHECK_FULL_SILHOUETTE_CLEANER_THAN_V0_8 = pass candidate in rider front/hero views; final visual ruling belongs to operator.
- BLOCKER = none.
- NEXT_SAFE_ACTION = operator visual review of V0.9 contact sheet; do not push unless separately authorized.
- COMMIT_STATUS = pending at proof write time; final commit hash reported in final chat after commit.
- PUSH_STATUS = no push.