# MIKAGE Production Rig Rebuild V0.1 — Proof

TASK: `MIKAGE_PRODUCTION_RIG_REBUILD_V0_1`
STATUS: `CANDIDATE / NOT CANON-LOCKED`
RESULT: PASS
BLOCKER: NONE

## Base and output

- BASE_SELECTED: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_LOOKDEV_INTEGRATION_V0_1.blend`
- OUTPUT_BLEND: `production/character/production_actor/rig_derivatives/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1.blend`
- CONTACT_SHEET: `production/character/reviews/MIKAGE_PRODUCTION_RIG_REBUILD_V0_1_CONTACT_SHEET.png`

## New armature

- Object: `MIKAGE_axial_rig_v0_1`
- Datablock: `MIKAGE_axial_rig_v0_1_data`
- Bone count: exactly `7`
- Limb bones created: `0`

| Bone | World head | World tail | Parent |
|---|---|---|---|
| `root` | `(0,0,0.140)` | `(0,0,0.500)` | none |
| `pelvis` | `(0,0,0.500)` | `(0,0,0.800)` | `root` |
| `spine_01` | `(0,0,0.800)` | `(0,0,1.200)` | `pelvis` |
| `spine_02` | `(0,0,1.200)` | `(0,0,1.800)` | `spine_01` |
| `chest` | `(0,0,1.800)` | `(0,0,3.280)` | `spine_02` |
| `neck` | `(0,0,3.280)` | `(0,0,3.5000005)` | `chest` |
| `head` | `(0,0,3.5000005)` | `(0,0,4.4236197)` | `neck` |

Head center is `Z=3.9618101`, identical to the audited helmet-bbox center. Reopened output retains all seven neutral pose channels at zero/identity.

## Binding

- `MASTER_MATCH_single_closed_draped_void_cloak`: Armature target `MIKAGE_axial_rig_v0_1`; soft groups `root`, `pelvis`, `spine_01`, `spine_02`, `chest`, `neck`; up to 2 positive groups per vertex with linear blending between adjacent audited axial centers.
- Helmet, both sensor slits, and white halo: rigid group `head`, weight `1.0`, target new axial rig.
- Three visible blade slabs: rigid group `root`, weight `1.0`, target new axial rig.

Blade choice: `root`. Audit #39 shows the slabs standing independently beside the cloak with no visible hand/grip mesh. Root makes the prop follow the whole figure without inventing a hand attachment.

## Preservation hashes

- GEOMETRY_HASH_BEFORE/AFTER: `017782A5B658B741CC860488CB415476E9730CB753914B24B4BCE7B6CDAD04A1`
- MATERIAL_HASH_BEFORE/AFTER: `1E7F279BE4E8EDEF951D9EA0154190E66DA6FBA5318F4BBF6760FFC6DE3F8307`
- OLD_ARMATURE_PLUS_29_LEGACY_HASH_BEFORE/AFTER: `4568B4535947CA3365E7B4E55498A137775793AF55FC81020FBBF88DC938B607`
- OLD_ARMATURE_BONE_COUNT_BEFORE/AFTER: `23`
- OLD_ARMATURE_LEGACY_TARGET_COUNT_BEFORE/AFTER: `29`
- `LEGACY_TOUCHED = NO`
- `REBUILD_SIDE_EFFECT_DRIFT = NO`

## Sole light pose test

- Bone: `spine_02`
- Rotation: local Y `12°`
- Full Stage B poses: not attempted
- Contact sheet: `1800x900`, left neutral / right light test pose
- Actual rendered PNG opened and inspected: YES
- Cloak: continuous smooth bend; no severe tearing or clipping observed
- Helmet/slits/halo: remain rigid and follow the axial descendants
- Blade: remains rigid with root
- Pose reset after render; saved derivative remains neutral
- `REBUILD_BIND_INSUFFICIENT = NO`

## Color checks from actual pixels

- Slit samples: `#870DFF`, `#880DFF` — blue-dominant violet
- Halo sample: `#C0BEBA` — neutral white/porcelain, not violet
- `HALO_COLOR_CHECK = WHITE`
- `VIOLET_OUTSIDE_TWO_SLITS = NO` by visual inspection

## Scope/status

- Files changed: derivative blend, contact sheet, this proof, and two gate artifacts only.
- `.blend1 = NONE` subject to final cleanup check.
- EVIDENCE_SOURCE: local Blender 5.1.2 metadata/reopen verification + actual rendered PNG inspection + deterministic hashes.
- PUSH_STATUS: NOT PUSHED
- NEXT_SAFE_ACTION: Lane B/operator review; no Stage B authorization inferred.

No canon-lock, asset-lock, production-rig-ready, final-render, push, or deploy claim is made.

