# MIKAGE HELMET CROWN LIGHT-ROTATION DIAGNOSTIC V0.7 — PROOF

## Execution evidence

- Task: `MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7`
- Governance: `AGENTS.md` controlled exception #25
- Starting commit: `3c00930 dispatch #16: crown light-rotation diagnostic V0.7 (exception #25)`
- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend`
- Base SHA-256 before/after: `D3EE43423B3B6AE03780E669B758AB346BC3E7F8AD8EAAC93056FAB2E46776E0`
- Contact sheet SHA-256: `2AA0292CA3EC4612BD9748C024E4B374B7312444B152862A093FC6A20B91F80E`
- Contact sheet dimensions: `1800 x 1800`
- Render engine: local Eevee
- Camera fixed for all frames: location `(3.45, -5.45, 4.32)`, rotation `(1.533605, 0, 0.564351)`, ortho scale `1.32`
- One neutral Area light, relative azimuths `0° / 18° / 36° / 54°`
- Temporary neutral matte clay override; halo and saved lights hidden in memory only
- Source file was never saved; no derivative `.blend` was created

## Geometry lock

- `BODY_HASH_BEFORE = 935F68E127F48D9C727CCA41BCE9A47FC709DDBBDD8C97AFBEDC475FE251A6F4`
- `BODY_HASH_AFTER = 935F68E127F48D9C727CCA41BCE9A47FC709DDBBDD8C97AFBEDC475FE251A6F4`
- Geometry/subdivision/support-loop edit: `NO`
- Mesh or camera movement between frames: `NO`
- Material/lookdev saved to source: `NO`

## Direct visual verdict

The actual contact sheet was opened at original resolution and inspected. The highlight changes position and intensity with the Area light. The front crown band visible at `0°–18°` weakens substantially by `36°–54°`, while the bright response migrates toward the right crown/temple. It does not remain fixed to the same mesh location.

Therefore the diagnostic rule resolves to: bands track the light → geometry clean.

## RESULT

```text
RESULT = PASS
TASK_ID = MIKAGE_HELMET_CROWN_LIGHTROT_DIAG_V0_7
VERDICT = PASS
BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HELMET_SURFACE_CONTROL_V0_7.blend
BODY_HASH_UNCHANGED = YES
GEOMETRY_CLEAN_DIAGNOSTIC = YES
LOCAL_FIX_NEEDED = NO
CREATED = CONTACT_SHEET + PROOF + TWO-FILE_GATE_MIRROR
UPDATED = NONE
NOT_TOUCHED = SOURCE_BLEND / GEOMETRY / SSOT / CONTROL_FILES
DIRECTLY_VERIFIED = YES
BLOCKERS = NONE
OUTPUT_STATUS = CANDIDATE
COMMIT = NO
PUSH = NO
LOCK = NO
NEXT_SAFE_TASK = Lane B reads the contact sheet and operator issues the final geometry-base ruling
```
