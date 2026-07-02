# MIKAGE_STANDING_HERO_TURNAROUND_V0_2_PROOF

STATUS = CANDIDATE / NOT CANON-LOCKED
TASK = MIKAGE_STANDING_HERO_TURNAROUND_V0_2
DATE = 2026-07-02

## Source and deliverables

BASE_SELECTED = `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend`
OUTPUT_BLEND = `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_2.blend`
SHEET = `production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_2_SHEET.png`
INDIVIDUAL_VIEWS = 8 PNGs in `production/character/reference/turnaround_v0_2/`

## Locked-state verification

BASE_SHA256_BEFORE = `DF9BC1A0DF92A1E6615E8EC65018C3C267605EB8BB16318312DF3891C0AE0C58`
BASE_SHA256_AFTER = `DF9BC1A0DF92A1E6615E8EC65018C3C267605EB8BB16318312DF3891C0AE0C58`
BODY_HASH_BEFORE = `C92EE0D87889B79CE19BEEB57A70F1B53D051A1802FADBD9BCEE9F1F8A18633A`
BODY_HASH_AFTER_REOPEN = `C92EE0D87889B79CE19BEEB57A70F1B53D051A1802FADBD9BCEE9F1F8A18633A`
LOCKED_OBJECT_TRANSFORM_HASH_BEFORE = `3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99`
LOCKED_OBJECT_TRANSFORM_HASH_AFTER_REOPEN = `3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99`
MATERIAL_HASH_BEFORE = `E86541F691BD0D881932C7C14D8802B6BCC1091496A756970DDF806966E08D14`
MATERIAL_HASH_AFTER_REOPEN = `E86541F691BD0D881932C7C14D8802B6BCC1091496A756970DDF806966E08D14`

LOCK_RESULT = PASS. Geometry, character pose/transforms, blade, halo, helmet/slits, and materials are unchanged. Only the permitted common camera distance and derivative-only neutral fill/back lights changed.

## Camera and figure-fill result

- Camera type/focal perspective: unchanged perspective camera, 135 mm.
- Azimuth order/rotation: unchanged `000, 045, 090, 135, 180, 225, 270, 315` at exact 45-degree steps.
- Common camera distance: adjusted equally across all eight views.
- Render dimensions: unchanged 900 x 1600 per view; 3600 x 3200 sheet, 4 x 2.
- Figure fill before: approximately 26–27% in V0.1, per operator HOLD ruling.

| View | V0.2 figure fill |
|---|---:|
| 000 | 79.00% |
| 045 | 80.31% |
| 090 | 81.19% |
| 135 | 81.25% |
| 180 | 80.31% |
| 225 | 79.88% |
| 270 | 79.94% |
| 315 | 78.81% |

FIGURE_FILL_GATE = PASS (all views within 75–85%; target 80%)
CROP_CHECK = PASS — helmet, blade, complete body, and lowest geometry remain inside every frame.

## Lighting and color result

- Added derivative-only neutral cold back/fill support for 180, 225, and 270; global exposure unchanged.
- 180/225/270 show readable shoulder contour, torso volume, coat edges, lower silhouette, and blade separation.
- 000/045/315 retain helmet facets and are not cropped or visually blown out.
- Void remains `#050508`.
- SLIT_HUE_PIXEL_SAMPLE_VIEW_000 = `#8C09F9` (near `#8F00FF`, violet rather than magenta).
- VIOLET_SCOPE = exactly the two static sensor slits.

## Actual visual inspection

ACTUAL_SHEET_OPENED_AND_INSPECTED = YES
EIGHT_VIEW_ORDER = PASS
BACK_VIEW_LEGIBILITY = PASS
FRONT_HELMET_DETAIL = PASS
NEW_ANGLE_MESH_FLAG = NONE
TURNAROUND_DRIFT = NO
SLIT_HUE_FAIL = NO
FRAMING_LIGHT_FAIL = NO

## Gate, hygiene, and status

GATE_CONTENTS = exactly `contact_sheet.png` and `contact_sheet_review_report.md`
DERIVATIVE_REOPEN = PASS
BLEND1_REMAINS = NO
EVIDENCE_SOURCE = LOCAL_COMMAND_VERIFIED + ACTUAL_RENDER_INSPECTION
RESULT = PASS, pending deterministic verifier and local commit
BLOCKER = NONE
PUSH_STATUS = NOT PUSHED
NEXT_SAFE_ACTION = Lane B drift-check and BOOS visual ruling; stop after local commit.

No visual approval, master-reference approval, canon-lock, asset-lock, final, production-ready, verified, or public-ready claim is made.

