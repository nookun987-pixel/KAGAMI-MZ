# MIKAGE — ACTOR STAGE BUILD 01 — REPORT

**Task:** `MIKAGE_ACTOR_STAGE_BUILD_01` · **Date:** 2026-08-07
**Authority:** operator rulings **D-a / D-b / D-c**, 2026-08-07 —
[MIKAGE_ACTOR_DESIGNATION_RULING_V1.md](MIKAGE_ACTOR_DESIGNATION_RULING_V1.md)
**Built by:** Claude Code · Blender 5.1.2 headless

> **ASSET LOCK: NOT ISSUED · PRODUCTION READY: NOT ISSUED · COLLISION TESTED: NO.**
> This report records a staging build and its measurements. It approves nothing and runs no collision.

---

## 1. STAGING ANCHOR

| Field | Value |
|---|---|
| **Staging file** | `production/character/staging/MIKAGE_COLLISION_STAGE_01.blend` |
| **SHA-256 (staging anchor)** | `229c727f516b3653943c03ea687f796bd5101dd1ce30be1579d9ba4248c17e01` |
| Bytes | 533180 |
| Tripwire scope | **OUTSIDE** — filename contains neither `zenith` nor `blade`; verified by re-running both baseline commands (§5) |

**This hash is the staging anchor for `CE15_ACTOR_COLLISION_REPROOF_13_POSES`.**

---

## 2. PRE-FLIGHT — the 33 cross-variant links, and how each was handled

Enumerated from the V0.89 blend before any link operation. **All 33 are `parent`-type. There are zero
modifier and zero constraint cross-variant links** — the isolation risk flagged in audit F5 is
materially smaller than the raw count suggested.

### 2.1 Links originating in `A2_` — 20 of 33 · **ALL FOLLOWED, ZERO BROKEN**

| Target | Target type | Link kind | A2_ objects affected | Handling |
|---|---|---|---:|---|
| `MESH_PREP_HAIR_HELMET_ATTACHMENT_INTENT_EMPTY_NON_RIG` | EMPTY | parent / OBJECT | 8 | **FOLLOWED** — linked |
| `MESH_PREP_LEFT_ARM_HAND_ATTACHMENT_INTENT_EMPTY_NON_RIG` | EMPTY | parent / OBJECT | 5 | **FOLLOWED** — linked |
| `MESH_PREP_RIGHT_ARM_HAND_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` | EMPTY | parent / OBJECT | 4 | **FOLLOWED** — linked |
| `MESH_PREP_ZENITH_BLADE_ATTACHMENT_INTENT_EMPTY_NON_RIG` | EMPTY | parent / OBJECT | 1 | **FOLLOWED** — linked |
| `MESH_PREP_HELMET_BODY_RIGIDITY_INTENT_EMPTY_NON_RIG` | EMPTY | parent / OBJECT | 1 | **FOLLOWED** — linked |
| `MIKAGE_initial_armature_scaffold` | ARMATURE | parent / **BONE** (`hand.R`) | 1 | **FOLLOWED** — linked |

Every A2_-side dependency terminates in one of five intent-empties or the armature. All six were in
link scope, so **no A2_ transform is altered by a missing parent.** This is confirmed empirically by
the measurements in §4 reproducing canon exactly.

### 2.2 Links NOT originating in `A2_` — 13 of 33 · **EXCLUDED (safe)**

| Source object | Group | Target | Handling |
|---|---|---|---|
| `PUBLIC_BLOCK_cloak_vertical_black_mass` | `PUBLIC_BLOCK_` | armature (bone) | **EXCLUDED** — object not linked |
| `PUBLIC_BLOCK_V03_faceless_angular_porcelain_helmet_clean_mask` | `V03_` | helmet-rigidity empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_mask_brow_shadow_separation` | `V03_` | helmet-rigidity empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_right_forearm_porcelain_to_blade` | `V03_` | blade-attachment empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_right_hand_blade_contact_small` | `V03_` | blade-attachment empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_sensor_slit_left_violet_only` | `V03_` | helmet-rigidity empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_sensor_slit_right_violet_only` | `V03_` | helmet-rigidity empty | **EXCLUDED** |
| `PUBLIC_BLOCK_V03_zenith_blade_crisp_front_plane` | `V03_` | blade-attachment empty | **EXCLUDED** |
| `PUBLIC_BLOCK_zenith_blade_dark_edge` | `PUBLIC_BLOCK_` | blade-attachment empty | **EXCLUDED** |
| `PUBLIC_BLOCK_zenith_blade_vertical_slab` | `PUBLIC_BLOCK_` | blade-attachment empty | **EXCLUDED** |
| `V042_REVIEW_CAMERA` | other | `ZB60_NATIVE_ACTOR_ATTACHMENT_ROOT` | **EXCLUDED** |
| `V042_REVIEW_KEY` | other | `ZB60_NATIVE_ACTOR_ATTACHMENT_ROOT` | **EXCLUDED** |
| `ZB65_ACTOR_DOCKING_LOAD_ANCHOR` | `ZB` (V0.89 blade) | armature (bone) | **EXCLUDED** — see §6 note |

**BROKEN-SAFE: 0.** No linked object lost a parent. The 13 excluded links belong entirely to objects
that were not linked, so nothing dangles.

---

## 3. BUILD — what was linked and what was authored

**Link mode: LIBRARY LINK (`bpy.data.libraries.load(link=True)`), never append.** Linked datablocks
are structurally non-editable in the staging file — the read-only guarantee is enforced by Blender,
not by procedure.

| Collection | Source | Objects linked | Detail |
|---|---|---:|---|
| `ACTOR_A2_LINKED_V089` | `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend` | **32** | 26 MESH (`A2_`), 5 EMPTY (intent empties), 1 ARMATURE (23 bones) |
| `BLADE_CE15_LINKED` | `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend` | **35** | all `ZB*` objects; 30 are meshes |

**Excluded from the `A2_` group — reported, not silent:** 6 CAMERA and 2 LIGHT objects also carry the
`A2_` prefix. They are not actor geometry and are irrelevant to collision; they were **not linked**.
If the collision task needs the historical `A2_` review cameras, they are available in the source.

### Objects authored by this task — exactly one

| Object | Type | Purpose |
|---|---|---|
| `ACTOR_CANON_SCALE_ROOT` | EMPTY, `instance_type=COLLECTION` → `ACTOR_A2_LINKED_V089` | Carries the canon scale. **Scale = (0.2452706705, 0.2452706705, 0.2452706705)**, location (0,0,0) |

**Non-destructive by construction.** The scale lives on a collection-instance empty. No linked
object's transform, mesh, modifier or material was touched — none of them *can* be, through a link.
The unscaled source collection is **not** placed in the scene directly; only the scaled instance is,
so the raw 7.15 m originals cannot contaminate a measurement.

### Provenance stamped inside the file

Custom properties written to both the Scene and `ACTOR_CANON_SCALE_ROOT`: source paths, both source
sha256 values, `canon_scale_factor`, the D-a / D-b / D-c ruling texts, date,
`rigid_attachment_only: True`, `soft_deformation_rig: "BACKLOGGED - production backlog, not a
blocker"`, `asset_lock: NOT ISSUED`, `production_ready: NOT ISSUED`, `collision_tested: False`.

---

## 4. MEASUREMENTS — evaluated data, reported verbatim

Measured from `depsgraph.object_instances` after save, so the instancer transform is included. Actor
values are read through the scale root; blade values are read direct.

| Quantity | Expected | **Measured** | Deviation |
|---|---:|---:|---:|
| Actor standing height (Z) | 1.753685 m | **1.753685 m** | **0.000000** |
| Blade longest extent | 1.200000 m | **1.200000 m** | **0.000000** |
| Armature rest height | 0.853542 m | **0.853542 m** | **0.000000** |
| Blade : actor ratio | 0.684273 | **0.684273401** | **0.000000401** |

**On the ratio deviation.** It is `4.01 × 10⁻⁷`, arising from float division of two independently
rounded extents. EDGE_B1 records `0.684273317` and V0.89 records `0.684273308`; the staged value sits
in the same ninth-decimal band. Well inside the ±2 % tolerance
(`ZENITH_BLADE_DESIGN_DNA.md` §NON-NEGOTIABLE DNA). **Reported, not adjusted — nothing was forced.**

Supporting figures: actor meshes measured **25** (the 1 hidden `A2_` mesh correctly excluded from the
render-enabled bbox); blade meshes measured **30**; actor bbox extents
`[0.871986, 0.230554, 1.753685]`; blade bbox extents `[0.473372, 0.278489, 1.200000]`.

---

## 5. VALIDATION

| Check | Expected | Observed | Result |
|---|---|---|---|
| V0.89 source blend, pre → post | `15e61aa961d4bfe10a0217f6a2ddf36373622744554564411c4c58a178c94b89` | identical | **BYTE-UNCHANGED** |
| CE15 durable blend, pre → post | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | identical | **BYTE-UNCHANGED** |
| Tripwire v2 hash | `3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9` | identical | **UNCHANGED** |
| Tripwire count | 79 | 79 | **UNCHANGED** |
| Staging file inside tripwire scope? | must be NO | filter returns nothing | **CONFIRMED OUTSIDE** |
| New `.blend` files created | exactly 1 | 1 | **AS AUTHORIZED** |
| Link errors / missing objects | 0 | 0 | **CLEAN** |
| Broken parent links among linked objects | 0 | 0 | **CLEAN** |

Both baseline commands from `renders/board_v1_evidence/BASELINE_METHOD.md` were re-run verbatim.
**No rebaseline was needed and none was performed** — the staging filename was chosen specifically to
stay out of the `zenith|blade` scope.

---

## 6. CARRIED FORWARD — UNCONFIRMED / out of scope

| # | Item | Status |
|---|---|---|
| S1 | **Blade-to-actor placement in the stage.** Both are present at canon scale in one coordinate system, but the blade is at its own origin — it is **not docked to the actor's hand**. The V0.89 docking chain (`ZB65_ACTOR_DOCKING_LOAD_ANCHOR` → armature bone) belongs to the V0.89 blade, which was deliberately not linked. Establishing CE15↔actor registration is the collision task's first job. | **UNCONFIRMED — by design** |
| S2 | Audit items **U1–U7** (0.19 m scaffold figure, proxy hide date, 98-mesh figure, `MASTER_*` variant, the 1 hidden `A2_` mesh, CE15-lineage in-scene actor height) | **UNCONFIRMED** — unchanged |
| S3 | Soft-deformation rig (audit **F6**) | **BACKLOGGED** per D-c — not an asset-lock blocker; still a real limit on non-rigid pose authoring |
| S4 | Whether the 6 excluded `A2_` cameras / 2 lights are needed downstream | **UNCONFIRMED** — available in the source if required |

---

*End of MIKAGE_ACTOR_STAGE_BUILD_01_REPORT. No collision was run. No asset lock, no production claim.
No commit, no push.*
