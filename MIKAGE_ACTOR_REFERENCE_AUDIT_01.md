# MIKAGE — ACTOR REFERENCE AUDIT 01

**Task:** `MIKAGE_ACTOR_REFERENCE_AUDIT_01`
**Date:** 2026-08-07 · **Mode:** STRICTLY READ-ONLY — investigation only, changes nothing
**By:** Claude Code · Blender 5.1.2 headless data-read (authorized), no save, no edit, no new `.blend`
**Companions:** [MIKAGE_ACTOR_VARIANT_INVENTORY_01.md](MIKAGE_ACTOR_VARIANT_INVENTORY_01.md) ·
[MIKAGE_ACTOR_REFERENCE_AUDIT_01_SOURCE_MANIFEST.md](MIKAGE_ACTOR_REFERENCE_AUDIT_01_SOURCE_MANIFEST.md)

> **This audit rules nothing and changes nothing.** No asset lock, no production claim, no collision
> run, no geometry or material action. Options in §4 are engineering options, not recommendations —
> the choice is the operator's.

---

## 0. HEADLINE

**A clean, measurable, documented actor exists.** It is the `A2_` variant in the **V0.89** scene,
standing at **7.1500 m** in that scene's pre-scale-lock coordinate system, which is **exactly**
`1.753685 m` after the canonical EDGE_B1 scale factor. Three independent quantities — armature rest
height, actor height, blade length — reproduce to six decimal places.

**The blocker as stated does not match the scenes on disk.** Three of its four premises are wrong:

| Premise as briefed | Measured 2026-08-07 | Verdict |
|---|---|---|
| "98 meshes in the inspected context" | CE15 158 meshes · V0.89 151 meshes | **does not match either scene** |
| "combined bbox contaminated (~3.30 m)" | Contamination comes from counting **hidden** meshes. Render-enabled non-blade: CE15 = 2 meshes / 1.07 m; V0.89 = 57 meshes / 7.15 m | **artifact of the measuring method, not of the scene** |
| "the only armature is a 0.19 m scaffold" | One armature, `MIKAGE_initial_armature_scaffold`, 23 bones — rest height **0.853542 m** (CE15) / **3.4800 m** (V0.89) | **0.19 m is not reproduced in either scene** |
| "no measurable verified actor" | V0.89's `A2_` group measures cleanly at 7.1500 m and reproduces canon exactly | **a measurable actor exists** |

What is genuinely true: **the CE15 scene has no render-enabled actor at all** — every `A2_`,
`PUBLIC_BLOCK_` and `PUBLIC_BLOCK_V03_` mesh in it is hidden from render. That is a different
problem from "contaminated", and it has a different fix.

---

## 1. INTEGRITY

| Check | Pre | Post | Result |
|---|---|---|---|
| Workstation tripwire v2 | `3a62ac63…44c9` @79 | `3a62ac63…44c9` @79 | **UNCHANGED** |
| CE15 anchor (both copies) | `465b212e…c3129` | `465b212e…c3129` | **UNCHANGED** |
| V0.89 blend sha256 | `15e61aa9…4b89` | `15e61aa9…4b89` | **UNCHANGED** |
| `ZENITH_BLADE_PAPERWORK_VALIDATOR.py` | PASS | PASS | **UNCHANGED** |
| Tracked modifications **by this task** | — | **0** | **CLEAN** |

> **Carried-in tracked modifications: 4.** `docs/MIKAGE_SESSION_LESSONS.md`,
> `…BOARD_V1_MANIFEST.json`, `…BOARD_V1_SOURCE_MANIFEST.md`, `ZENITH_BLADE_PAPERWORK_VALIDATOR.py`
> were left uncommitted by `ZENITH_BLADE_DOCTRINE_ISSUE_01`. This task did not touch them and did
> not revert them. The whitelist of NONE was honoured: **this task's own tracked-mod count is 0.**

Opening a `.blend` in `--background` mode does not alter its mtime; the tripwire is mtime+path based
and held across both reads, confirmed post-run.

---

## 2. STEP 1 — DATED DOCUMENT CORPUS

| Date (mtime) | Path | What it establishes |
|---|---|---|
| 2026-05-16 16:49 | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_1.blend` | Earliest production-actor build on disk |
| 2026-05-16 16:49 | `production/character/production_actor/MIKAGE_PRODUCTION_ACTOR_FROM_ANCHOR_V1_V0_2.blend` | Second production-actor build; the collection name `MIKAGE_PRODUCTION_ACTOR_V0_2_REFINED_CANDIDATE` present in both inspected scenes traces to this lineage |
| 2026-06-06 22:17 | `production/character/reviews/MIKAGE_PRODUCTION_RIG_READINESS_AUDIT_V0_1.md` | Rig-readiness assessment |
| 2026-06-06 22:27 | `production/character/reviews/MIKAGE_MESH_PREP_BEFORE_RIG_TEST_V0_1_PROOF.md` | Mesh-prep state before rig testing |
| 2026-06-06 22:34 | `production/character/reviews/MIKAGE_MESH_PREP_OPERATOR_REVIEW_V0_1.md` | **25 tagged deform-candidate objects + 17 rigid-attachment candidates** (`:36`). Names the protected violet slit meshes `PUBLIC_BLOCK_V03_sensor_slit_left/right_violet_only` (`:55`) |
| **2026-07-03 17:04** | `docs/reports/MIKAGE_PRODUCTION_RIG_ARMATURE_AUDIT_V0_1.md` | **The rig's true state.** `MIKAGE_initial_armature_scaffold` is *"not a soft-deformation production rig"*; 29 legacy meshes carry an Armature modifier; **no vertex has positive weight in more than one group**; joint-equivalent bones exist (`clavicle`/`upper_arm`/`forearm`/`pelvis`/`thigh`/`shin`) but *"the inspected weights do not provide blended deformation across those joints"* (`:9`, `:65–71`) |
| 2026-07-03 17:57 | `docs/reports/MIKAGE_MESH_TOPOLOGY_AUDIT_V0_1.md` | Companion topology audit |
| **2026-07-31 00:30** | `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md` | The 0-overlap 8-pose result. Geometry target: `A2_right_porcelain_mitten_hand_attached_read` **only** (`:17`) |
| 2026-07-31 00:40 | `…_V0_89_REPORT.json` | **`scale_audit`**: actor 7.149999842 m, blade 4.892554045 m, ratio 0.684273308, `operator_scale_lock_pending: true`. Method excludes ZB-prefixed blade objects **and hidden legacy blade proxy/reference meshes** |
| 2026-07-31 02:46 | `production/character/reviews/MIKAGE_ZENITH_BLADE_EDGE_B1_PROOF.md` | `HUMAN_SCALE_FACTOR: 0.2452706705` · `ACTOR_HEIGHT_M: 1.753685243` · `BLADE_ACTOR_RATIO: 0.684273317` |
| 2026-07-31 | `…_EDGE_B1_REPORT.json` → `human_scale_lock` | `actor_height_before_m: 7.149999842047691` → `actor_height_after_m: 1.7536852434277534`, uniform root `MIKAGE_HUMAN_SCALE_ROOT_EDGE_B1` |
| 2026-08-06 | `renders/board_v1_evidence/RUN_LOG_outstanding_renders_v2.json` → `OUT4_actor_measurement` | `non_blade_mesh_count: 126`, `measured_height_m: 3.45`, `OUT4_reference_decision: TEMP_PRIMITIVE_PROXY` |
| 2026-08-06 17:26 | `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` | Dual-lineage contract: CE15 = weapon form; V0.89 = actor integration |
| 2026-08-07 | `ZENITH_BLADE_OPERATION_DOCTRINE_V1.md` §4 | The 13-row pose matrix awaiting this actor |

### Corpus gaps (findings, not blanks)

| # | Gap | Status |
|---|---|---|
| G1 | **Source of the "0.19 m scaffold" figure.** `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md:130` attributes it *"per task brief — not re-verified in this task"*. No measurement producing 0.19 m was located anywhere in the corpus. Measured values are 0.853542 m (CE15) and 3.4800 m (V0.89). | **UNCONFIRMED — figure not reproducible** |
| G2 | **When the `PUBLIC_BLOCK*zenith_blade*` proxies became hidden.** The 2026-07-03 armature audit (`:79`) records them as *"visible/render-enabled"*; both scenes inspected 2026-08-07 have them hidden. No task record of the change was found. | **UNCONFIRMED** |
| G3 | **Source of the "98 meshes" figure** in the task brief. Neither inspected scene has 98 meshes (158 / 151). | **UNCONFIRMED** |
| G4 | **No `MASTER_*` prefix objects exist** in either inspected scene. `MASTER_MATCH_white_halo_ring` is named in the 2026-07-03 armature audit (`:82`) but is not present under a `MASTER_` prefix in CE15 or V0.89. | **UNCONFIRMED — variant absent from both scenes** |
| G5 | **No soft-deformation rig exists anywhere in the record.** The 2026-07-03 audit is explicit; nothing later supersedes it. Pose authoring beyond rigid attachment has no verified rig. | **CONFIRMED ABSENT** |

---

## 3. STEP 2 — FINDINGS

Full tables: [MIKAGE_ACTOR_VARIANT_INVENTORY_01.md](MIKAGE_ACTOR_VARIANT_INVENTORY_01.md).

**F1 — The V0.89 actor is clean and measurable.** 25 of 26 `A2_` meshes render-enabled, world Z-extent
**7.1500 m**, reproducing V0.89's own reported `actor_total_height_m` 7.149999842 exactly. The other
variants in that scene sit inside it (`PUBLIC_BLOCK_V03_` 5.32 m, `PUBLIC_BLOCK_` 2.23 m).

**F2 — The 3.45 m "contamination" is a measurement artifact, not a scene defect.** OUT4 counted
`non_blade_mesh_count: 126` in a scene whose render-enabled non-blade mesh count is **2**. It measured
hidden objects. Its tall entries — `PUBLIC_BLOCK_zenith_blade_vertical_slab` (3.45 m),
`…dark_edge` (3.25 m), `sword_right_heavy_rectangular_slab` (2.92 m) — are **all hidden from render in
both scenes**. Re-running either exclusion method on a render-enabled basis yields 1.07 m (CE15) or
7.15 m (V0.89); neither yields 3.45 m.

**F3 — CE15 has no render-enabled actor at all.** Every `A2_`, `PUBLIC_BLOCK_` and `PUBLIC_BLOCK_V03_`
mesh is hidden. The two render-enabled non-blade meshes are helmet lookdev plates
(`LOOKDEV_V0_1_helmet_faceted_porcelaingofun_polish_plate_*`, 1.0718 m combined). **CE15 is a
blade-presentation scene; the actor is present as data but disabled.**

**F4 — The two lineages are the same content at one uniform scale, proven to 6 dp.**

| Quantity | V0.89 | × 0.2452706705 | CE15 / canon |
|---|---:|---:|---:|
| Armature rest height | 3.4800 | 0.853542 | 0.853542 (measured) |
| Actor height | 7.1500 | 1.753685 | 1.753685 (EDGE_B1 canon) |
| Blade length | 4.892554045 | 1.200000 | 1.2000 (measured) |
| Blade : actor ratio | 0.684273308 | — | 0.684273317 (Δ 9 × 10⁻⁹) |

**F5 — Cross-variant coupling differs sharply between the scenes.** CE15: **84** cross-prefix links
(parent / modifier / constraint). V0.89: **33**. Any isolation attempt must resolve these; the CE15
count is the larger problem.

**F6 — No soft-deformation rig exists.** Per the 2026-07-03 armature audit: 29 meshes bound, **no
vertex weighted to more than one group**, no blended deformation across joints. Joint-equivalent
bones exist by name only. **This is a separate blocker from the actor-reference question and is not
resolved by anything in this audit.**

---

## 4. STEP 3 — OPTIONS (engineering only; no recommendation)

### 4a. Which variant is the documented production actor?

**`A2_` — with a partial provenance chain.**

| Link | Evidence |
|---|---|
| V0.89's bounded correction targeted `A2_right_porcelain_mitten_hand_attached_read` **only** | `…V0_89_PROOF.md:17` |
| The 0-overlap 8-pose result was computed against the `A2_`-dominated render set | `…V0_89_REPORT.json` → `pose_validation`, `scale_audit` |
| `A2_` is the render-enabled variant that sets actor height in V0.89 | measured, §3 F1 |
| `A2_` carries the `MESH_PREP_deform_candidate_groups` tag; 25 deform candidates were recorded 2026-06-06 — matching `A2_`'s 25 render-enabled meshes | `MIKAGE_MESH_PREP_OPERATOR_REVIEW_V0_1.md:36` |
| V0.89 is the actor-integration authority | `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md`; operator ruling D4 |

**Gap in the chain:** no document *names* `A2_` as "the production actor" in those words. The
designation is inferred from convergent evidence, not stated. **Confirming it is an operator ruling,
not a documentary finding.**

### 4b. Options to isolate a clean measurable actor reference — no source file edited

All options create a **new working file** and leave every existing `.blend` byte-unchanged.

| # | Option | Method | Cost / risk | Tripwire implication |
|---|---|---|---|---|
| **O1** | **Link `A2_` from V0.89 into a new working file** | `bpy.ops.wm.link` the `A2_` objects (or their collection) from the V0.89 blend into a fresh scene | Lowest risk — link is read-only by nature; source cannot be written through a link. Must resolve the **33 cross-variant links**: linked objects whose parents/targets are not linked will lose those relations, changing evaluated transforms. **Every dropped relation must be enumerated before measuring.** | New file named to **avoid** `zenith`/`blade` → tripwire scope unchanged, no rebaseline |
| **O2** | **Append `A2_` into a new working file** | `bpy.ops.wm.append` — copies datablocks | Independent of the source afterwards, so later source changes do not propagate. Same 33-link problem. Duplicates data (larger file). Appended copies can be edited, so the read-only guarantee becomes procedural rather than structural | Same as O1 |
| **O3** | **Measure in place with an explicit exclusion set, no new file at all** | Re-run the V0.89 method, publishing the exact object list used | **Zero risk — already done in this audit.** Produces a number (7.1500 m / 1.753685 m scaled) but **not a usable posing target**: the pose matrix needs a scene to pose in | None — no file created |
| **O4** | **New working file at CE15 scale**, linking `A2_` and applying the EDGE_B1 uniform root | O1 plus a `MIKAGE_HUMAN_SCALE_ROOT`-equivalent at 0.2452706705 | Puts actor and CE15 blade in one coordinate system — what the collision re-proof actually needs. Highest complexity: scale must be applied at link time, and the 33 links plus the scale interaction must both be verified | Depends on naming — see below |

**Tripwire-scope warning (applies to O1, O2, O4).** The workstation tripwire matches
`.blend` filenames containing `zenith` or `blade`, case-insensitive
(`renders/board_v1_evidence/BASELINE_METHOD.md`). **A new working file whose name contains either
token moves the count 79 → 80 and changes the baseline hash.** Per the `BASELINE_METHOD.md`
precedent (v1 → v2 rebaseline, 78 → 79), that is acceptable **only** as a declared, deliberate
rebaseline captured immediately with the reason recorded — never a silent update to make a check
pass. **Naming the working file without `zenith`/`blade` avoids the issue entirely** (e.g.
`MIKAGE_ACTOR_REFERENCE_WORKING_V0_1.blend`).

**Common prerequisite for O1 / O2 / O4:** enumerate and publish the cross-variant links that will be
broken. CE15 has 84, V0.89 has 33. Isolating from V0.89 is the smaller job by a factor of ~2.5.

### 4c. Genuinely unrecoverable from the record — UNCONFIRMED

| # | Item | Why unrecoverable |
|---|---|---|
| U1 | The **0.19 m scaffold** figure | Not reproduced by measurement; its originating brief is not on disk. See G1 |
| U2 | **When and by which task** the `PUBLIC_BLOCK*zenith_blade*` proxies were hidden | No task record found between 2026-07-03 and 2026-08-07. See G2 |
| U3 | The **98-mesh** context in the task brief | Matches neither inspected scene. See G3 |
| U4 | Whether a **`MASTER_*` variant** ever existed as a distinct prefix group | Absent from both scenes; referenced only as one object name in a 2026-07-03 audit. See G4 |
| U5 | Whether `A2_` is **formally designated** the production actor | Convergent evidence only; no document says it. Operator ruling required. See §4a |
| U6 | Whether the **1 hidden `A2_` mesh** in V0.89 is intentional | No record of the exclusion |
| U7 | **In-scene actor height in the CE15 lineage** | Cannot be measured — no actor is render-enabled there (F3). Only derivable by scaling V0.89's measurement |

---

## 5. WHAT THIS AUDIT DOES NOT DO

- It does **not** unblock the collision re-proof. It establishes that a measurable actor exists and
  where; building a usable posing scene is a separate, authorized task.
- It does **not** rule that `A2_` is the production actor. §4a gives the evidence; the designation is
  the operator's.
- It does **not** address the missing soft-deformation rig (F6), which blocks pose authoring
  independently of the reference question.
- It grants no asset lock and makes no production claim.

---

*End of MIKAGE_ACTOR_REFERENCE_AUDIT_01. Read-only investigation. No ruling, no edit, no asset lock,
no production claim, no collision run. No commit, no push.*
