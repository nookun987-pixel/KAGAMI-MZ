# MIKAGE — ACTOR VARIANT INVENTORY 01

**Task:** `MIKAGE_ACTOR_REFERENCE_AUDIT_01` · **Date:** 2026-08-07 · **Mode:** strictly read-only
**Parent:** [MIKAGE_ACTOR_REFERENCE_AUDIT_01.md](MIKAGE_ACTOR_REFERENCE_AUDIT_01.md)

All values verbatim from evaluated scene data, Blender 5.1.2 headless (`--background --factory-startup`).
**No file was saved, edited or created.** Bounding boxes are world-space unions over evaluated meshes.
**No value is merged or averaged across variants.**

> **NOT a ruling · NOT an asset lock · NOT a production claim.** Inventory only.

---

## 1. Scenes inspected

| Tag | Path | sha256 | Objects | Meshes | Units |
|---|---|---|---|---|---|
| **CE15** | `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend` | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | 242 | 158 | METRIC, scale_length 1.0 |
| **V0.89** | `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend` | `15e61aa961d4bfe10a0217f6a2ddf36373622744554564411c4c58a178c94b89` | 197 | 151 | METRIC, scale_length 1.0 |

Both opened read-only; sha256 re-verified identical after the read (§5).

---

## 2. Variant inventory — CE15 scene

| Variant prefix | Objects | Render-enabled | Hidden from render | Z-extent, ALL objects (m) | Z-extent, RENDER-ENABLED only (m) |
|---|---:|---:|---:|---:|---:|
| `A2_` | 26 | **0** | 26 | 2.9748 | — (none render-enabled) |
| `PUBLIC_BLOCK_` | 28 | **0** | 28 | 3.4500 | — |
| `PUBLIC_BLOCK_V03_` | 15 | **0** | 15 | 3.0359 | — |
| `ZB*` (blade) | 30 | 30 | 0 | 1.2000 | **1.2000** |
| other | 59 | 2 | 57 | 3.0650 | **1.0718** |

**Collections:** `A2_` → `Collection`, `MESH_PREP_deform_candidate_groups`, `MESH_PREP_rigid_attachment_groups` ·
`PUBLIC_BLOCK_*` → `Collection`, `MESH_PREP_rigid_attachment_groups` ·
`ZB*` → `Scene Collection`, `ZENITH_BLADE_V056_CLEAN_HANDOFF` ·
other → `Collection`, `MESH_PREP_deform_candidate_groups`, `MIKAGE_PRODUCTION_ACTOR_V0_2_REFINED_CANDIDATE`

**Armature:** `MIKAGE_initial_armature_scaffold` — 23 bones, rest height **0.853542 m**, `hide_render` False.

**Cross-variant links:** **84** (parent / modifier / constraint relations crossing prefix groups).

**Standing height, CE15:** **NOT MEASURABLE as an actor.** Every `A2_`, `PUBLIC_BLOCK_` and
`PUBLIC_BLOCK_V03_` mesh is hidden from render. The only two render-enabled non-blade meshes are
`LOOKDEV_V0_1_helmet_faceted_porcelaingofun_polish_plate_*` at a combined 1.0718 m — helmet plates,
not a body. **No standing figure is render-enabled in this scene.**

---

## 3. Variant inventory — V0.89 scene

| Variant prefix | Objects | Render-enabled | Hidden from render | Z-extent, ALL objects (m) | Z-extent, RENDER-ENABLED only (m) |
|---|---:|---:|---:|---:|---:|
| **`A2_`** | 26 | **25** | 1 | 8.1900 | **7.1500** |
| `PUBLIC_BLOCK_` | 28 | 2 | 26 | 4.7150 | 2.2305 |
| `PUBLIC_BLOCK_V03_` | 15 | 14 | 1 | 8.1465 | 5.3232 |
| `ZB*` (blade) | 25 | 24 | 1 | 4.9900 | **4.8926** |
| other | 57 | 19 | 38 | 4.8164 | 1.7014 |

**Armature:** `MIKAGE_initial_armature_scaffold` — 23 bones, rest height **3.4800 m**, `hide_render` False.

**Cross-variant links:** **33**.

**Standing height, V0.89:** **MEASURABLE.** Render-enabled non-blade meshes (57 after excluding
legacy blade-named proxies) give **7.1500 m**, set by the `A2_` group. This reproduces V0.89's own
`scale_audit.actor_total_height_m` = `7.149999842` exactly.

---

## 4. The two competing measurement methods, run on both scenes

| Method | Exclusion rule | CE15 result | V0.89 result |
|---|---|---:|---:|
| **OUT4 method** | ZB-prefix only | 2 meshes → 1.0718 m | 60 meshes → 7.1500 m |
| **V0.89 method** | ZB-prefix **+ legacy blade-named non-ZB proxies** (`BLADE` / `SWORD` / `SLAB` in name) | 2 meshes → 1.0718 m | 57 meshes → 7.1500 m |

> **Neither method produces 3.45 m on a render-enabled basis.** The board's 3.45 m figure came from
> counting **hidden** meshes: OUT4 reported `non_blade_mesh_count: 126` against a scene whose
> render-enabled non-blade mesh count is **2**. See audit §3 finding F2.

### Legacy blade-named non-ZB meshes (identical set in both scenes)

| Object | Z-extent (m) | Render state in CE15 | Render state in V0.89 |
|---|---:|---|---|
| `PUBLIC_BLOCK_zenith_blade_vertical_slab` | 3.45 | hidden | hidden |
| `PUBLIC_BLOCK_zenith_blade_dark_edge` | 3.25 | hidden | hidden |
| `sword_right_heavy_rectangular_slab` | 2.92 | hidden | hidden |
| `PUBLIC_BLOCK_V03_zenith_blade_crisp_front_plane` | 2.75 | hidden | hidden |
| `PUBLIC_BLOCK_zenith_blade_violet_signal` | 2.65 | hidden | hidden |
| `A2_blade_material_dark_front_weight_refinement` | 2.56 | hidden | hidden |
| `PUBLIC_BLOCK_V02_right_forearm_to_blade` | 0.52 | hidden | hidden |
| `PUBLIC_BLOCK_blade_lower_dark_counterweight` | 0.45 | hidden | hidden |

> `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md:79` (2026-07-03) describes the first
> three `PUBLIC_BLOCK*zenith_blade*` objects as *"visible/render-enabled"* at that date. **They are
> hidden in both scenes inspected here (2026-08-07).** Their render state changed between those
> dates; no record of when or by which task was located. **UNCONFIRMED.**

---

## 5. Scale relationship between the two scenes — EXACT

The two scenes are the **same content at a uniform scale**. EDGE_B1's human-scale lock factor is
`0.2452706705` (`MIKAGE_ZENITH_BLADE_EDGE_B1_REPORT.json` → `human_scale_lock.uniform_scale_factor`).

| Quantity | V0.89 (measured) | × 0.2452706705 | CE15 / canon | Match |
|---|---:|---:|---:|---|
| Armature rest height | 3.4800 | **0.853542** | 0.853542 (measured CE15) | ✅ exact to 6 dp |
| Actor standing height | 7.1500 | **1.753685** | 1.753685 (EDGE_B1 canon) | ✅ exact to 6 dp |
| Blade longest extent | 4.892554045 | **1.200000** | 1.2000 (measured CE15) | ✅ exact to 6 dp |
| Blade : actor ratio | 0.684273308 | — | 0.684273317 (EDGE_B1) | ✅ Δ = 9 × 10⁻⁹ |

**Three independent quantities agree to six decimal places.** The V0.89 lineage is the pre-scale-lock
coordinate system; the CE15 lineage is the same content post-lock.

---

## 6. Integrity — read-only confirmation

| Check | Value | Result |
|---|---|---|
| CE15 blend sha256, pre-read | `465b212e…c3129` | — |
| CE15 blend sha256, post-read | `465b212e…c3129` | **UNCHANGED** |
| V0.89 blend sha256, pre-read | `15e61aa9…4b89` | — |
| V0.89 blend sha256, post-read | `15e61aa9…4b89` | **UNCHANGED** |
| Blender invocation | `--background --factory-startup --python <script> --` | no save operator called |
| Files created in repo by the read | 0 | JSON written to scratchpad outside the repo |

---

*End of MIKAGE_ACTOR_VARIANT_INVENTORY_01. Read-only measurement record. No ruling, no asset lock,
no production claim. No commit, no push.*
