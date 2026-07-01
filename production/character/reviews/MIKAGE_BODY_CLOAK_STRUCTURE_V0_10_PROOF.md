# MIKAGE BODY CLOAK STRUCTURE V0.10 — CANDIDATE PROOF

## Execution

- Task: `MIKAGE_BODY_CLOAK_STRUCTURE_V0_10`
- Governance: `AGENTS.md` controlled exception #27
- Starting commit: `223353e dispatch #18: body cloak structure V0.10 (exception #27)`
- `BASE_SELECTED = production/character/production_actor/rig_derivatives/MIKAGE_BODY_FORM_DEBLOCKOUT_V0_9.blend`
- Base SHA-256 before/after: `934068A5B53342E95805EAC616653654CBF44216407A4A6C8DBA1602DE6032FC`
- Output SHA-256: `BBA6F9D7527468DEBBFF3BD8ADE539262C542E4C9AC480319F5ABD2544B54E51`
- Contact sheet SHA-256: `12B52E4C7B2D9953E106BF1A3879BF7FE5813BC796EAC3B24C6E63C25482B5B4`

## Cloak-only structure pass

- Deformed only `MASTER_MATCH_single_closed_draped_void_cloak`; topology remained `288 vertices / 552 edges / 266 faces`.
- Lowered the outer shoulder mass by at most `0.035` Blender unit and narrowed the localized shoulder ring by `2.5%`, reducing the continuous dome without removing shoulder weight.
- Added four broad asymmetric front fold bands with different centers, widths, and amplitudes. Their influence begins below the shoulder and fades before the hem.
- Increased below-shoulder front-to-back depth by up to `7.5%` for a wrapping-cloak strict-side read.
- Preserved height/envelope `Z=0.14–3.28`, vertical outer edges, and a straight stable hem.
- No topology increase, micro-fold, small hem wave, hair, prop, armor, panel, material, light, camera, neck, or helmet edit.

## Hash evidence

- `BODY_HASH_BEFORE = 6882CA68415B334596AC26F05E6A9FFAC0CCBC5FA8D99DFDF6A9B79D8E007F8A`
- `BODY_HASH_AFTER = DC566BA1BFFEB657853F38C4ECF4029AB31D0BF221373E3ADEF9E360835B0C62`
- `CLOAK_HASH_BEFORE = 17562ED4261BCAA5E64128CAB5E0CCEBF04A29DEAE0F29F8AB06BD5AFDF80539`
- `CLOAK_HASH_AFTER = 2F01DB11360576458EFE650245FAA89FD749433E343CC1BB99080C7D2BF2C742`
- `HELMET_HASH_BEFORE/AFTER = 2FC550B3D9E9D7FAE66E1C8F280646DD9BA492A103A156B318DF683661FC139E`
- `SLIT_HASH_EACH_BEFORE/AFTER = 37AD1B42CB8B12677BED39088F6293DBF40D3572E0841B516E7DDA31570FF2E1`
- Blade hashes before/after: `9A49F83415F1EF498553313BA106BB9B71B259BF707E08C4FB6DC62E606B3315`, `B48166238B3E53058D15EB0F5820EAEE0EA15FC08FB46DF31BF16D67120FCA5F`, `C5780754E30F59F230855A62946F902F681BDEA975C459A2DEE9C8FA235FA9D3`
- `LOCKED_STATE_HASH_BEFORE/AFTER = BE5A0475E2AF5396AA41A4C0165848767522C7EC780A10363E8A2D5D837CD36A`
- `MATERIAL_LIGHT_CAMERA_WORLD_HASH_BEFORE/AFTER = 533974BA0DFC9B946FA521CF4BD9F7D0165A274DDCD5AAD31A5791C77578C3A5`
- Dimensions before: `(1.5686516, 0.9092520, 3.1399999)`
- Dimensions after/reopened: `(1.5307268, 1.0130472, 3.1399989)`

## Direct visual verification

- Derivative reopened successfully in Blender 5.1.2.
- Actual `1440 x 1800` contact sheet opened at original resolution and inspected.
- Three to four of the four encoded broad fold bands read under the locked V0.9 lighting; spacing and strength are asymmetric.
- Folds start below the shoulders, outer edges remain vertical, and the hem stays straight/heavy.
- Strict side has visibly more depth than V0.9 and no longer reads as a thin slab.
- Output is candidate only; final visual ruling remains with Lane B/operator.

## RESULT

```text
RESULT = PASS
TASK_ID = MIKAGE_BODY_CLOAK_STRUCTURE_V0_10
PASS_FAIL = PASS
BLOCKER = NONE
CLOAK_STRUCTURE_DRIFT = NO
BODY_MESH_CHANGED = YES
HELMET_SLIT_BLADE_HASHES_UNCHANGED = YES
CAMERA_WORLD_MATERIAL_LIGHT_UNCHANGED = YES
NECK_JAW_SEAT_UNCHANGED = YES
SHOULDER_DOME_REDUCED = PASS
PRIMARY_FOLDS_3_TO_5_ASYMMETRIC = PASS
STRICT_SIDE_DEPTH = PASS
VERTICAL_EDGES_NO_TRUMPET = PASS
HEAVY_STRAIGHT_HEM = PASS
MICRO_FOLDS = NO
OUTPUT_STATUS = CANDIDATE
DIRECTLY_VERIFIED = YES
COMMIT = NO
PUSH = NO
LOCK = NO
NEXT_SAFE_TASK = Lane B drift-check and operator visual ruling on V0.10 cloak structure
```
