# MIKAGE_STANDING_HERO_TURNAROUND_V0_1_PROOF

STATUS = CANDIDATE / NOT CANON-LOCKED
TASK = MIKAGE_STANDING_HERO_TURNAROUND_V0_1
DATE = 2026-07-02

## Source and outputs

BASE_SELECTED = `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_POLISH_V0_14.blend`
OUTPUT_BLEND = `production/character/production_actor/rig_derivatives/MIKAGE_STANDING_HERO_TURNAROUND_V0_1.blend`
SHEET = `production/character/reviews/MIKAGE_STANDING_HERO_TURNAROUND_V0_1_SHEET.png`
INDIVIDUAL_VIEWS = 8 PNG files in `production/character/reference/turnaround_v0_1/`

## Locked-state evidence

BASE_SHA256_BEFORE = `C0D8A9785C794683004561CEFFA59F378F629EC83B2A498C1F42E20B9394239A`
BASE_SHA256_AFTER = `C0D8A9785C794683004561CEFFA59F378F629EC83B2A498C1F42E20B9394239A`
BODY_HASH_BEFORE = `C92EE0D87889B79CE19BEEB57A70F1B53D051A1802FADBD9BCEE9F1F8A18633A`
BODY_HASH_AFTER_REOPEN = `C92EE0D87889B79CE19BEEB57A70F1B53D051A1802FADBD9BCEE9F1F8A18633A`
OBJECT_TRANSFORM_HASH_BEFORE = `3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99`
OBJECT_TRANSFORM_HASH_AFTER_REOPEN = `3B73720914AEC94CC7EFAAD514CE76D0B013D488F48E7B2F057A9DF3E1D50F99`
MATERIAL_HASH_BEFORE = `E86541F691BD0D881932C7C14D8802B6BCC1091496A756970DDF806966E08D14`
MATERIAL_HASH_AFTER_REOPEN = `E86541F691BD0D881932C7C14D8802B6BCC1091496A756970DDF806966E08D14`

LOCK_RESULT = PASS — no geometry, locked-object transform, or material change.

## Camera, lighting, and renders

- Azimuth order: `000, 045, 090, 135, 180, 225, 270, 315`.
- Step: exactly 45 degrees.
- Camera: 135 mm, identical chest-level height, distance, target, and framing for all views.
- Render size: 900 x 1600 PNG per view.
- Sheet: 3600 x 3200 PNG, exact 4 x 2 layout with internal angle labels.
- Lighting: derivative-only neutral cold key + fill + rim + back-fill; no warm light.
- Full figure is visible in every panel with consistent margins. At the 14-character-height orbit, the geometric perspective scale bound from the locked model depth is below 2%. A conservative luminance-threshold diagnostic varied 419–431 px because near-black edge pixels merge into the void; this is a visibility threshold, not camera/framing drift.

SLIT_HUE_PIXEL_SAMPLE_VIEW_000 = `#8918F2` (nearest rendered pixel to canonical `#8F00FF`; violet, not magenta)
VIOLET_SCOPE = two static sensor slits only
VOID = `#050508`

## Visual inspection

ACTUAL_SHEET_OPENED_AND_INSPECTED = YES
ALL_EIGHT_FULL_BODY_VIEWS_PRESENT = YES
NEW_ANGLE_MESH_FLAG = NONE OBSERVED
HALO_BRIGHTER_THAN_HELMET = NO
TURNAROUND_DRIFT = NO
SLIT_HUE_FAIL = NO

## Gate and hygiene

GATE_CONTENTS = exactly `contact_sheet.png` and `contact_sheet_review_report.md`
BLEND_REOPEN = PASS
BLEND1_REMAINS = NO
PUSH_STATUS = NOT PUSHED
CLAIMS = no visual approval, no canon-lock, no asset-lock, no production/public-ready claim

## Commands run

- `git status --porcelain=v1`
- `git branch --show-current`
- `git log -1 --oneline`
- `python .mikage\tools\validate_task.py`
- Blender 5.1 background render and deterministic save/reopen validation
- Pillow sheet assembly and pixel diagnostics
- `python .mikage\tools\verify_output.py`

EVIDENCE_SOURCE = LOCAL_COMMAND_VERIFIED + ACTUAL_RENDER_INSPECTION
RESULT = PASS, pending deterministic verifier and local commit
BLOCKER = NONE
NEXT_SAFE_ACTION = Lane B drift-check plus operator ruling; stop after local commit. No push.

