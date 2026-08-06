# ZENITH BLADE — FINAL DESIGN BOARD V1 (panel index)

**Assembled:** 2026-08-06 · **Image:** `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png` (3400 × 5980)
**Built per:** [ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md)
**Layout source:** approved [Board V0](ZENITH_BLADE_DESIGN_BOARD_V0.md) — V0 files are byte-unchanged, V1 is a new set
**Form basis:** CE15 (operator ruling D1=A, 2026-08-06) · **Camera policy:** D5=C
**Source manifest:** [ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_SOURCE_MANIFEST.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_SOURCE_MANIFEST.md)

> **COMPLETE BOARD — all 13 panels built.**
> Composite/layout only, from files already on disk. **No render, retouch, regeneration or content
> change was produced in this task.** Images are fit-to-panel scaled, never above 1:1. No imagery
> was faked, upscaled or substituted.
>
> **"FINAL … V1" means the DESIGN BOARD is complete — nothing else.**
> **NOT a canon approval · NOT an asset lock · NOT production-ready.**

---

## Panel status

| # | Panel | State | Source(s) |
|---|---|---|---|
| 1 | Main hero (85 mm perspective) | ✅ **Built — was PENDING RENDER #1** | `renders/board_v1_evidence/OUT1_HERO_P3_85MM_ANNOTATED.png` |
| 2 | Front orthographic | ✅ Built (carried from V0) | `renders/board_v1_evidence/pass_03/HC_front_P3.png` |
| 3 | Side orthographic | ✅ Built (carried from V0) | `renders/board_v1_evidence/pass_03/HC_side_P3.png` |
| 4 | Rear 3/4 | ✅ Built (carried from V0) | `renders/board_v1_evidence/pass_03/HC_rear34_P3.png` |
| 5 | Silhouette 64 / 128 px | ✅ Built (carried from V0) | `renders/board_v1_evidence/pass_03/SIL_ce15_064.png` · `…/SIL_ce15_128.png` |
| 6 | P1 / P2 / P3 state strip | ✅ Built, assembled (carried from V0) | `renders/board_v1_evidence/pass_03/HC_authored_P1.png` · `HC_authored_P2.png` · `HC_authored_P3.png` |
| 7 | Core / spine section | ✅ **Built — was PENDING RENDER #2** | `renders/board_v1_evidence/OUT2_CORE_SPINE_SECTION_ANNOTATED.png` |
| 8 | Exploded load-path | ✅ **Built — was PENDING RENDER #3** | `renders/board_v1_evidence/OUT3_EXPLODED_LOADPATH_ANNOTATED.png` |
| 9 | Material palette | ✅ **Built — was DEFERRED in V0** | `renders/board_v1_evidence/OUT5_MATERIAL_SWATCH_CARD.png` |
| 10 | Chassis callout | ✅ Built (carried from V0) | `renders/board_v1_evidence/pass_03/HC_wireframe_material_proof.png` |
| 11 | Scale / dimension | ✅ **Built — was PENDING RENDER #4** | `renders/board_v1_evidence/OUT4_SCALE_VS_HUMAN_ANNOTATED.png` |
| 12 | Rig integration handoff | ✅ Built (carried from V0) | `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_CONTACT_SHEET.png` |
| 13 | Canon status & unresolved evidence | ✅ Built (text) — **rewritten for V1 with provenance** | see below |

**Built: 13 · Pending render: 0 · Deferred: 0**

**Slot mapping verified against the build spec:** panels **1 / 7 / 8 / 11** are the four *NEW RENDER
REQUIRED* slots (build spec panel index, rows 1, 7, 8, 11). This matches the task brief — **no
deviation.** Panel 9 was marked *Optional (swatch card can be drawn)* in the build spec and
*DEFERRED* in V0; V1 fills it with `OUT5_MATERIAL_SWATCH_CARD.png`.

---

## Honest framing labels (printed on the board, mandatory)

| Panel | Label printed on the panel |
|---|---|
| 7 | **TRUE SECTION EVIDENCE — not an engineering section drawing.** |
| 8 | **LOAD-PATH EVIDENCE DIAGRAM — not a manufacturing exploded view.** |
| 11 | Reference is a **TEMPORARY 1.75 m primitive proxy** per spec — **NOT a character asset.** |
| 9 | **NOT RECONCILED** — MAT_C arc (hex) vs V0.29 arc (linear RGB) for graphite / titanium / steel. |

---

## Panel 7 — section method and cutter bounds

Pulled from the OUT2 run log (`renders/board_v1_evidence/RUN_LOG_outstanding_renders_v2.json`,
`outputs.OUT2`):

| Field | Value |
|---|---|
| Cut plane | Z (horizontal, world) |
| `coordinate_world_z` | **0.376932** — passes through the P3 core centre |
| `cutter_bounds.min` | **(−1.987736, −2.184326, 0.376932)** |
| `cutter_bounds.max` | **(2.485636, 2.094163, 2.924670)** |
| Method | non-destructive BOOLEAN DIFFERENCE on 32 duplicates; **modifier NOT applied**; originals untouched and hidden from that render |
| Viewport clipping used | `false` |
| Camera | 85 mm perspective, `TMP_SECT_CAM`; AgX Medium High Contrast, −0.35 EV |

**No clearance dimensions are asserted by panel 7** — geometric relationship only.

---

## Panel 8 — load-path diagram method

| Field | Value |
|---|---|
| Primary explode axis | world **−Y** (lateral assembly axis, mapped from measured layer centroids *before* any transform) |
| Step | 0.12 blade width = **0.056805 m** |
| Max total offset | 0.48 blade width = **0.227219 m** — within the 0.55 blade-width budget |
| Method | **translation only** on duplicates; **no rotation**, no geometry edit; originals untouched |
| Anchors | chassis / spine and hub / handle axis **stay** (offset 0) |

---

## Panel 13 — canon status, rewritten for V1 with provenance

Evidence legitimately changed between V0 and V1, so the V0 list is **not** carried verbatim.
Every change below is stamped with its provenance; everything not listed as resolved is carried
verbatim and unchanged.

### STATUS (unchanged from V0)
- CE15 = **VISUAL-FORM AUTHORITY** (operator ruling D1=A, 2026-08-06)
- CE15 is **NOT** a production asset lock
- No asset lock or production-ready status is in force anywhere in the project
- The single historical grant (V0.33) was revoked by V0.41

### RESOLVED SINCE V0
**Provenance for all five: task `ZENITH_BLADE_OUTSTANDING_RENDERS_01`, 2026-08-06.**

| Item | Status | Output file |
|---|---|---|
| 85 mm perspective hero on CE15 form | **RESOLVED** | `OUT1_HERO_P3_85MM_ANNOTATED.png` |
| Core / spine section render | **RESOLVED** | `OUT2_CORE_SPINE_SECTION_ANNOTATED.png` |
| Exploded load-path diagram | **RESOLVED** | `OUT3_EXPLODED_LOADPATH_ANNOTATED.png` |
| Scale-vs-human image | **RESOLVED** | `OUT4_SCALE_VS_HUMAN_ANNOTATED.png` |
| Scale / dimension check | **RESOLVED — see below** | `OUT4_SCALE_VS_HUMAN_ANNOTATED.png` |

**Scale line (rewritten).** Measured blade length **1.200000 m = 47.2441 in**, which is **INSIDE**
the canon range **35–58 in (0.889–1.4732 m)**. The prior "dimension conflict" flag is **WITHDRAWN**
— it was an un-converted unit check, not a real disagreement. *Provenance: OUT4 + evaluated-scene
measurement (`RUN_LOG_outstanding_renders_v2.json`, `outputs.OUT4_blade_measurement`,
`inside_canon_range: true`).*

### STILL OPEN — carried verbatim from V0, nothing reconciled, merged or dropped
- CE15 ↔ actor collision/clearance — **NOT VERIFIED** (V0.89's 0-overlap 8-pose result was proven against the previous form)
- CE12 alpha silhouette mask — **MISSING** (its `sil` files are thumbnail colour renders)
- CE12/CE13 standalone written rulings — **MISSING** (session-record only)
- Material arcs MAT_C vs V0.29 (graphite/titanium/steel) — **NOT RECONCILED**
- Canon-authority promotion packet — **OPEN / PENDING**
- `PHYSICAL_VOLUME_EXACT_VALUE` — **NOT VERIFIED**

### NEW IN V1
- **In-scene actor height — UNCONFIRMED.** The evaluated scene's non-blade meshes measure
  **3.450 m** top-to-bottom because overlaid `PUBLIC_BLOCK` blade variants dominate the bounding
  box (`PUBLIC_BLOCK_zenith_blade_vertical_slab` = 3.45 m, `…_dark_edge` = 3.25 m,
  `sword_right_heavy_rectangular_slab` = 2.92 m). The only armature present is
  `MIKAGE_initial_armature_scaffold` (0.19 m scaffold **per task brief — not re-verified in this
  task**). No in-scene reference of plausible human height exists, so OUT4 used a **temporary
  1.75 m primitive proxy** per spec (`OUT4_reference_decision` =
  `TEMP_PRIMITIVE_PROXY`). The proxy is **NOT a character asset**.

---

## Boundary statement (printed in the board footer)

> **"FINAL … V1" means the DESIGN BOARD is complete.** This is an evidence/design document.
> **NOT canon approval · NOT asset lock · NOT production-ready.**
> **Production asset lock remains BLOCKED on the CE15 ↔ actor collision/clearance re-proof.**

---

## Durable-path status — CLOSED by task `ZENITH_BLADE_BOARD_V1_HARDENING_01` (2026-08-06)

Panels **2, 3, 4, 5, 6 and 10** previously cited
`_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/pass_03/`, which is **gitignored**
(`.gitignore:62`). Those **nine files** (six panels, nine distinct images) were relocated to
`renders/board_v1_evidence/pass_03/` with SHA-256 verified identical pre- and post-copy, and the
citations above now point at the durable path. The `_tmp/` originals were **not** deleted.

**Every image cited by this board is now on a durable, non-gitignored path.** No unresolved durable
paths remain.

The board **PNG is byte-unchanged** by that relocation — the citation update is a documentation
change only. **Board V0 keeps its original `_tmp/` citations**: it is the historical record of what
was on disk at V0 assembly time and is deliberately left byte-unchanged.

### Machine-readable bundle
[ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json](ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_MANIFEST.json)
carries the same facts in verifiable form: every path, every SHA-256, the panel mapping, the
unresolved list, and the explicit `NOT_ISSUED` status of the production asset lock and canon lock.

### Status of this candidate
- `candidate_status` = **PENDING_OPERATOR_VISUAL_RULING**
- `technical_actor_clearance` = **NOT_VERIFIED** — BLOCKED_PENDING_OPERATOR_VISUAL_ACCEPTANCE
- `production_asset_lock` = **NOT_ISSUED** · `canon_lock` = **NOT_ISSUED**
- Authorized next step: **OPERATOR_VISUAL_RULING_CE15_FROM_BOARD_V1**

### Source-integrity anchor
The CE15 source blend `MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend`
is SHA-256 `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129`, byte-identical to the
pre-render capture taken before the outstanding-renders run. **This is the verified content-integrity
anchor.** A byte-identical durable copy now exists at
`renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend`; the `_tmp` original was retained. The
`_tmp` durability gap flagged in earlier tasks is **closed**.

The workstation blend baseline is **REPRODUCIBLE_VERIFIED** as of 2026-08-06. It is now at **v2 =
`3a62ac63…44c9`, count 79**. Baseline **v1 = `cfbda510…8895e`, count 78** is retained as the
historical value; it was verified matching immediately before being deliberately superseded. The
rebaseline was caused by adding the durable CE15 blend copy, whose filename falls inside the
baseline scope — a **durability relocation, not a Blender write.** The earlier
`LEGACY_BASELINE_UNREPRODUCIBLE` status is **withdrawn**. Method of record:
[`renders/board_v1_evidence/BASELINE_METHOD.md`](renders/board_v1_evidence/BASELINE_METHOD.md).

The two checks are **complementary, not redundant**. The baseline is an **mtime+path tripwire**: it
catches any Blender write across the 79-file blade set, including a byte-identical re-save, but it
does **not** catch a content change that preserves mtime. The CE15 sha256 catches exactly that. Use
both.

### Separate documentation-sync issue (not addressed here)
`ZENITH_BLADE_DESIGN_DNA.md` line ~83 still lists the 85 mm hero, core/spine section, exploded
load-path and scale-vs-human image as **MISSING imagery**. All four are resolved as of
2026-08-06. That file was explicitly **out of scope for this task and was not edited.** Flagged for
a documentation-sync pass.
