# MIKAGE BODY FORM DE-BLOCKOUT V0.9 — CANDIDATE PROOF

## Execution

- Task: `MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9`
- Governance: `AGENTS.md` controlled exception #26
- Starting commit: `464123c chore: untrack _tmp temp gate artifacts`
- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_HERO_LOOKDEV_PREMIUM_V0_8.blend`
- Base SHA-256 before/after: `A0A20DEFABED4FA9D181F17EE1267315230BE08D55459FA26C796B2DE78A261E`
- Output SHA-256: `934068A5B53342E95805EAC616653654CBF44216407A4A6C8DBA1602DE6032FC`
- Contact sheet SHA-256: `762D1CA338F52740701FFDD2415152CA3889948352C2CB79D7FBD3EE85219104`

## Body-only change

- Replaced only `MASTER_MATCH_single_closed_draped_void_cloak` geometry.
- Built one closed tall vertical cloak mesh within the V0.8 height envelope `Z=0.14–3.28`.
- Lower body falls nearly straight; no trumpet flare.
- Shoulder mass transitions through multiple broad support rings into the existing neck region without moving the neck or helmet jaw seat.
- Four broad primary fold rhythms are present on the lower/front cloak; no micro-folds.
- No hair, prop, armor, clasp, or decorative panel added.
- Final cloak topology: `288 vertices / 552 edges / 266 faces`.
- Final cloak dimensions: `(1.568652, 0.909252, 3.140000)`.

## Hash evidence

- `BODY_HASH_BEFORE = 935F68E127F48D9C727CCA41BCE9A47FC709DDBBDD8C97AFBEDC475FE251A6F4`
- `BODY_HASH_AFTER = 6882CA68415B334596AC26F05E6A9FFAC0CCBC5FA8D99DFDF6A9B79D8E007F8A`
- `CLOAK_HASH_BEFORE = 262CF0D735F8FA6E00D8CEB273B2F43D54D655F2BFF6163A1E77376ED0F9DAB5`
- `CLOAK_HASH_AFTER = 17562ED4261BCAA5E64128CAB5E0CCEBF04A29DEAE0F29F8AB06BD5AFDF80539`
- `HELMET_HASH_BEFORE/AFTER = 2FC550B3D9E9D7FAE66E1C8F280646DD9BA492A103A156B318DF683661FC139E`
- `SLIT_HASH_EACH_BEFORE/AFTER = 37AD1B42CB8B12677BED39088F6293DBF40D3572E0841B516E7DDA31570FF2E1`
- Blade hashes before/after:
  - `9A49F83415F1EF498553313BA106BB9B71B259BF707E08C4FB6DC62E606B3315`
  - `B48166238B3E53058D15EB0F5820EAEE0EA15FC08FB46DF31BF16D67120FCA5F`
  - `C5780754E30F59F230855A62946F902F681BDEA975C459A2DEE9C8FA235FA9D3`
- `LOCKED_STATE_HASH_BEFORE/AFTER = BE5A0475E2AF5396AA41A4C0165848767522C7EC780A10363E8A2D5D837CD36A`
- `MATERIAL_LIGHT_CAMERA_WORLD_HASH_BEFORE/AFTER = 533974BA0DFC9B946FA521CF4BD9F7D0165A274DDCD5AAD31A5791C77578C3A5`

Only the allowed cloak mesh changed. Helmet, two slits, blade, neck, cameras/framing, world, all materials and all lighting remained identical.

## Visual verification

- Derivative reopened successfully in Blender 5.1.2.
- Actual `1440 x 1800` contact sheet opened at original resolution and inspected.
- Front/three-quarter/side read as a tall vertical cloak with shoulder mass and straight fall.
- V0.8 comparison confirms the proxy-cone silhouette was replaced without height growth or skirt flare.
- Candidate only; final visual ruling remains with Lane B/operator.

## RESULT

```text
RESULT = PASS
TASK_ID = MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9
PASS_FAIL = PASS
BLOCKER = NONE
BODY_SCOPE_DRIFT = NO
BODY_MESH_CHANGED = YES
HELMET_HASH_UNCHANGED = YES
SLIT_HASH_AND_PLACEMENT_UNCHANGED = YES
BLADE_HASH_UNCHANGED = YES
CAMERA_WORLD_MATERIAL_LIGHT_UNCHANGED = YES
NECK_JAW_SEAT_UNCHANGED = YES
TALL_VERTICAL_CLOAK = PASS
STRAIGHT_FALL_NO_TRUMPET = PASS
PRIMARY_FOLDS_ONLY = PASS
OUTPUT_STATUS = CANDIDATE
DIRECTLY_VERIFIED = YES
COMMIT = NO
PUSH = NO
LOCK = NO
NEXT_SAFE_TASK = Lane B drift-check and operator visual ruling on V0.9 body form
```
