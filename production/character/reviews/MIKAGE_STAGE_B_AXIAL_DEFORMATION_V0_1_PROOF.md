# MIKAGE Stage B Axial Deformation V0.1 — Proof

TASK: `MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1`
STATUS: `CANDIDATE / NOT CANON-LOCKED / AXIAL-ONLY GATE B`
RESULT: PASS
BLOCKER: NONE

## Scope

- BASE: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
- OUTPUT: `production/character/production_actor/rig_derivatives/MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1.blend`
- CONTACT_SHEET: `production/character/reviews/MIKAGE_STAGE_B_AXIAL_DEFORMATION_V0_1_CONTACT_SHEET.png`
- Rig used: `MIKAGE_axial_rig_v0_1`
- Existing axial bones only: `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`, `head`
- Bone count before/after: `7 / 7`
- New/repositioned/removed bones: `0 / 0 / 0`
- Forbidden poses attempted: none (`arms_raised`, `left_step`, `right_step`, `blade_hold` were not attempted)

## Deterministic preservation

- GEOMETRY_HASH_BEFORE/AFTER: `017782A5B658B741CC860488CB415476E9730CB753914B24B4BCE7B6CDAD04A1`
- MATERIAL_HASH_BEFORE/AFTER: `1E7F279BE4E8EDEF951D9EA0154190E66DA6FBA5318F4BBF6760FFC6DE3F8307`
- NEW_RIG_REST_HASH_BEFORE/AFTER: `CF4648842C6AAE0F7ACC8246F1F626CB60939EE1DF6BCEEE955D7933ABFA8628`
- OLD_ARMATURE_PLUS_29_LEGACY_HASH_BEFORE/AFTER: `4568B4535947CA3365E7B4E55498A137775793AF55FC81020FBBF88DC938B607`
- Old armature bones: `23`; old legacy target meshes: `29`
- `SCOPE_VIOLATION = NO`

## Pose results

Contact sheet layout: `2700x1800`, 3×2, labels burned into the review sheet only.

| Pose | Frame / axial rotations | Deformation inspection | Rigid attachment | Halo sample | Slit sample | Result |
|---|---|---|---|---|---|---|
| `neutral` | F1; rest | Baseline intact; no tearing/clipping | Helmet/halo on head; blade on root | `#777673`, achromatic white under light | `#8907FF` | PASS |
| `quarter_turn` | F10; root local-Y `60°` | Whole form turns coherently; no tearing | Blade rotates with root; head assembly remains coherent | `#878683`, achromatic | `#8324FF` | PASS |
| `forward_bend` | F20; spine_02 local-X `10°` + chest `12°` | Smooth 22° distributed bend; upper-cloak compression visible but no severe intersection/tear | Helmet/halo follow head chain; blade remains root-bound | `#4F4E4C`, achromatic | `#7B0AFF` | PASS |
| `side_pose` | F30; spine_02 local-Z `7°` + chest `8°` | Smooth 15° lateral bend; no mesh rupture or severe clipping | Head assembly remains rigid; blade remains root-bound | `#5B5A58`, achromatic | `#8507FF` | PASS |
| `head_turn` | F40; head local-Y `40°` | Cloak stays neutral; head turns without visible separation | Helmet, slits, and halo rotate together on head; blade unchanged on root | `#4E4D4C`, achromatic | `#800AFF` | PASS |
| `backward_lean` | F50; spine_02 local-X `-5°` + chest `-7°` | Smooth distributed 12° reverse bend; no severe clipping/tear | Head assembly remains coherent; blade remains root-bound | `#AAA9A6`, achromatic | `#8F0CFF` | PASS |

All six actual rendered panels were opened and inspected. Slit values are rendered pixels closest to `#8F00FF` within the blue-dominant violet pixels of each panel. Halo samples come from the upper ring and remain neutral/achromatic; material hash is unchanged.

- `STAGE_B_DEFORMATION_FAIL = NO`
- `RIGID_ATTACH_FAIL = NO`
- `HALO_COLOR_VIOLATION = NO`
- `VIOLET_OUTSIDE_TWO_SLITS = NO` by rendered visual inspection

## Saved pose data

Six pose keys are stored at frames `1, 10, 20, 30, 40, 50`. Frame 1 is neutral. Only axial-bone `rotation_euler` channels were keyed; geometry, materials, rest bones, legacy rig, and legacy meshes were not changed.

## Status

- `.blend1 = NONE` subject to final cleanup check.
- Gate schema: `contact_sheet.png` + `contact_sheet_review_report.md` only.
- EVIDENCE_SOURCE: Blender 5.1.2 deterministic metadata/hashes + direct inspection of actual contact sheet + per-panel pixel sampling.
- PUSH_STATUS: NOT PUSHED
- NEXT_SAFE_ACTION: Lane B/operator review; the missing limb-pose Stage B remains deferred.

No canon-lock, asset-lock, production-rig-ready, final-render, push, or deploy claim is made.

