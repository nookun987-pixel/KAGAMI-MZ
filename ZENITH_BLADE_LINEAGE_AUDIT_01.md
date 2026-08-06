# ZENITH BLADE — CODEX-ERA LINEAGE AUDIT 01

**Task:** `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`
**Audit date:** 2026-08-07
**Mode:** STRICTLY READ-ONLY FORENSICS. No Blender. No render. No edits to any existing file.
**Recorded by:** Claude Code (documentation only)
**Companion documents:**
[ZENITH_BLADE_DELTA_TABLE_01.md](ZENITH_BLADE_DELTA_TABLE_01.md) ·
[ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png](ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png) ·
[ZENITH_BLADE_LINEAGE_AUDIT_01_SOURCE_MANIFEST.md](ZENITH_BLADE_LINEAGE_AUDIT_01_SOURCE_MANIFEST.md)

> **Scope limit.** This audit judges the HISTORY of the design record, not the CE15 canon lock.
> The CE15 canon lock of 2026-08-06 stands and is untouched by this document.
> This audit **recommends nothing about design taste**. Verdicts stop at RULED / DRIFT / UNCONFIRMED.
> No canon approval. No asset lock. No PASS. No production-ready claim. No commit. No push.

---

## 0. INTEGRITY — pre/post

| Check | Expected | Observed (pre) | Observed (post) | Result |
|---|---|---|---|---|
| Workstation tripwire v2 | `3a62ac63…44c9` | `3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9` | identical | **MATCH** |
| Tripwire file count | 79 | 79 | 79 | **MATCH** |
| CE15 anchor (`_tmp` original) | `465b212e…c3129` | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | identical | **MATCH** |
| CE15 anchor (durable copy) | `465b212e…c3129` | identical | identical | **MATCH** |
| Git tracked modifications | 0 | 0 | 0 | **MATCH** |
| Existing files modified by this task | 0 | — | 0 | **MATCH** |

Method of record for the tripwire: `renders/board_v1_evidence/BASELINE_METHOD.md`.
Only new files were created (three `.md`, one `.png`).

---

## 1. HEADLINE FINDINGS

**F1 — Every one of the seven named divergences from V0.1 is RULED, except the gold prohibition.**
Six of seven deltas trace to a dated operator ruling. The seventh (delta *d*, the ban on warm/gold
weapon colour) has **no operator ruling on record** — it exists only as a gate line inside
agent-authored dispatch briefs. See §5d.

**F2 — The premise "MAT_C2 renders visibly carry a kintsugi-gold tip" is not supported by the evidence.**
The gold-looking tip appears **only** in `MIKAGE_ZENITH_BLADE_MAT_C2_MATERIAL_ID.png` and
`…MAT_C3_MATERIAL_ID.png`, which are **false-colour material-ID diagnostics**. The ochre
RGB ≈ `(206,157,68)` is the index swatch for the `sumi` material group
(`ZB_FORM_A3_ATTACK_COLLAR_WEDGE`, `ZB46_FLUX_BASE` and siblings). A pixel sweep of all 39 PNGs in
the `MAT_C1/C2/C3 + EDGE_B1 + LIGHT_D1/D2/D3` sets found **zero** warm pixels
(`R > B+15 ∧ G > B ∧ R > 50`) in every file **except** the two MATERIAL_ID diagnostics
(1493 sampled px each). The MAT_C reports' `material_system` blocks list exactly four materials —
porcelain / graphite / sumi / inset — with `all_mesh_objects_classified: true` and `unclassified: []`.
**No gold material exists anywhere in the built Blender lineage, at any version.** Gold therefore did
not "disappear mid-arc"; it was never carried into 3D at all. Documented on the side-by-side composite.

**F3 — The direction of drift is the reverse of the brief's assumption.**
`MIKAGE_ZENITH_BLADE_SPEC_V1.md` was already **STRUCTURE CANON LOCKED on 2026-06-02** — nearly four
weeks *before* the V0.1 cine mock — and that lock already required a brutalist monolithic block and
already forbade the exact features V0.1 introduced: "**No pointed tip, no crossguard, no wrapped/leather
grip**" (§3). `MIKAGE_ZENITH_CANON_V2.md` §2.4 (LOCKED 2026-03-19) likewise forbids "curved katana form"
and "thin elegant blade". The operator's own `MIKAGE_FOUNDATION_LOCK_V0_4.md` (2026-06-22) describes the
weapon as "*slab chữ nhật nặng*" — a heavy rectangular slab. **V0.1 was the deviation from locked canon;
CE15 is the return to it.** The later rulings did not overturn V0.1 — they re-asserted a lock V0.1 had
departed from.

**F4 — The V0.1 cine lineage is an orphan in the design record (process DRIFT).**
`assets/keyart/blade/` is tracked in git but is cited by **zero** design, canon, or build documents.
It does not appear in `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md`, in `ZENITH_BLADE_DESIGN_BIBLE_V1.md`,
or in the Design DNA §REJECTED list (which names Slab V0.1/V0.1.1, V0.42, V0.29–V0.40, CE10, CE11, CE14
— but not the cine mock). V0.1 was therefore never formally rejected; it was simply never entered into
the record. Individual features were superseded correctly; the artifact itself was never dispositioned.

**F5 — V0.1 self-declared "LOCKED" with no lock document.**
The filename (`MIKAGE_ZENITH_BLADE_LOCKED_4x5.png`), the poster, and the viewer header
(`V0.1 · LOCKED`) all assert a lock. No operator lock document for it exists on disk. This predates
the project's later, well-enforced "never self-approve" discipline, but it is recorded here as the
earliest instance of the failure mode the project now guards against.

**F6 — Two locked-era documents still contradict the built asset and were never amended.**
`MIKAGE_ZENITH_CANON_V2.md` §2.4 still specifies "Deep crimson glowing core (`#E60000`)" and "dark rusty
titanium scrap plates" as LOCKED, and the cine colour contract still lists a crimson seam as a REQUIRED
ANCHOR for every frame. Both are superseded *in effect* by later operator rulings, but neither document
carries an amendment. This reproduces, independently, topic **L** of the existing Evidence Matrix.

**F7 — `OFFICIAL_VISUAL_BOUNDARY` does not exist.**
The audit brief names it as a locked-era document to check compliance against. A repo-wide search
(excluding `.git` and `node_modules`) returns no file of that name or any close variant. Compliance
against it is **UNCONFIRMED — document not on disk.**

---

## 2. EVIDENCE CORPUS (dated, path-resolved)

All dates below are from file mtime or from a date written inside the artifact. Where the two differ,
both are given. Nothing is inferred.

### 2.1 Pre-V0.1 canon layer

| Date | Path | What it establishes |
|---|---|---|
| 2026-03-19 (in-doc) | `MIKAGE_ZENITH_CANON_V2.md` §2.4 | WEAPON LOCKED: massive oversized rectangular block, absolutely straight, dark rusty titanium, crimson `#E60000` core, 35–58 in. Forbidden: curved katana, thin elegant blade. |
| 2026-06-01 (in-doc) / 2026-07-28 09:55 (mtime, rulings appended) | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | STRUCTURE CANON LOCKED 2026-06-02. B4C porcelain outer shell `#FAFAFA` + black titanium inner frame. §3: monolithic obelisk, decisive flat-cut top, "**No pointed tip, no crossguard, no wrapped/leather grip**". Later carries three appended operator rulings (2026-07-24, and two on 2026-07-28). |
| 2026-06-01 23:32 | `docs/handoff/MIKAGE_ZENITH_BLADE_OPERATOR_RULING_20260601.md` | Naming resolution (Thanh Đại Đao 3 Pha = Zenith Blade). |
| 2026-06-02 | `docs/automation/render_briefs/BRIEF_MIKAGE_ZENITH_WITH_BLADE_PHASE_2_FALLEN_EXILE_V0_1.md` | Pre-drop state of gold: "porcelain white with **kintsugi gold seams** and crimson `#E60000` bleed… no warm gold fill beyond the thin kintsugi seams." |
| **2026-06-04** (locked; git `1a8cb8b`, author BOOS BỚP) | `design_system/mikage-cine-color-contract.md` | CINE COLOR CONTRACT LOCKED. Kintsugi gold `#C39A52` — seams only, permissive. Violet `#8F00FF` = sole sanctioned emissive (slit halo **or** P3 core). REQUIRED ANCHOR: "ANY SEAM/BREAK → a Bengala crimson seam". |
| 2026-06-22 (in-doc) | `production/character/keyart_candidates/MIKAGE_FOUNDATION_LOCK_V0_4.md` | OPERATOR-AUTHORIZED FOUNDATION LOCK: "Zenith Blade = slab chữ nhật nặng… violet chỉ accent: slit/lưỡi/ensō · kintsugi mảnh." |

### 2.2 V0.1 cine layer — the reference the audit measures against

External, read-only: `C:\Users\nt\Claude\Projects\Mikage Zenith — Studio OS\BLADE_V0.1\` (17 files,
all mtime 2026-06-28 16:09 → 23:32). Two of those files are also tracked in this repo and are
**byte-identical** (sha256 verified, see manifest):

| Date | Path | What it establishes |
|---|---|---|
| 2026-06-28 16:09 | `assets/keyart/blade/MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` | The V0.1 sheet. Caption line: "**straight slab · point-down · core node**". Header: "CINE LAYER · THE EXECUTION CORE". |
| 2026-06-28 16:18 | `assets/keyart/blade/MIKAGE_BLADE_3D_INSPECT.html` | **The authoritative machine-readable V0.1 geometry.** Three.js source, read verbatim: slab profile `(-0.13,1.55)→(0.13,1.55)→(0.13,-0.95)→(0.0,-1.85)` (symmetric, tapering to a point); grip node at mid-shaft `y=0.2` containing a `BoxGeometry` band + **two `TorusGeometry(0.235,0.028)` platinum rings**; a single violet `SphereGeometry(0.075)` core with point light; a gold "menuki" dot; two crimson seam bars (`#9d2933`, emissive `#8e050f`); two kintsugi gold crack bars (`#c39a52`); Z-Blue `#4b5866` cap edge. Header text: `V0.1 · LOCKED`. |
| 2026-06-28 15:33 | `assets/keyart/CHARACTER_KEYART_V0.1/ZENITH_BLADE_REVEAL_STORYBOARD.md` | Same-session direction spec, self-labelled "DIRECTION SPEC — UNCONFIRMED. Held, not scheduled." Binds the reveal to the cine colour contract palette. |
| 2026-06-29 (git `73cccd2`, Bop Hung) | commit `art: Zenith Blade V0.1 poster + 3D viewer + Mikage figure V0.4` | Commit that placed V0.1 in the repo. |
| 2026-06-29 (in-doc) | `docs/MIKAGE_SESSION_LESSONS.md` lines 254–271 | The only narrative record of V0.1: "corrected from a wrong katana to canon — **straight monolithic slab, point-down, single violet P3 core, grip ring mid-shaft** (read from the operator's BUILD LOG 'Foundation Lock' frame)". This is the source of the shape list the audit brief calls "IMMUTABLE SHAPE". |

> **Gap.** No file on disk — in this repo or in the Studio OS folder — contains the literal string
> `IMMUTABLE SHAPE`. The list is reconstructed from the sheet caption, the viewer source, and the
> lessons entry above. Treated as **UNCONFIRMED as a verbatim document**; its five items are audited
> individually in §5g on the evidence that does exist.

### 2.3 The bridge — 2026-07-05 Codex slab brief

| Date | Path | What it establishes |
|---|---|---|
| 2026-07-05 23:47 | `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1.md` | Repo copy of the Codex brief. **Byte-identical** (`a5d25165…`) to `…Studio OS\CODEX_BRIEFS\2026-07-05_zenith-blade-slab-remodel_LANEA_BRIEF.md`. |
| 2026-07-05 | `…Studio OS\CODEX_BRIEFS\2026-07-05_zenith-blade-slab-remodel.md` (`15641630…`) | The design-side brief. Carries V0.1's DNA into 3D: **§4 GRIP RING** "at MID-SHAFT: center at 0.50 · L", material `#D6D6D6`; **§2 TIP** chisel to a blunt narrow flat, "Point DOWN is the resting orientation"; **§3 CORE SEAM** full-length emissive `#8F00FF` channel, "the ONLY emissive part"; **§6** body slab = matte graphite `#252321 / #424246` — **not porcelain**. `STATUS: geometry spec LOCKED`. |
| 2026-07-05 23:47 | `production/character/build_log/ZENITH_BLADE_SLAB_REFERENCE.svg` | Wrong-vs-right callout reference. |
| 2026-07-06 00:05 | `…/rig_derivatives/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1.blend` | First built blade. |
| **2026-07-06 (operator BOOS)** | `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_PROOF.md`, banner | "⚠️ **SUPERSEDED / WRONG CANON BASIS** (flagged 2026-07-06, operator BOOS): this V0.1 slab remodel was built from `CODEX_ZENITH_BLADE_REMODEL_BRIEF.md`, a single-state violet-seam premise that **conflicts with the already-locked** `MIKAGE_ZENITH_BLADE_SPEC_V1.md` + `MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` (locked 2026-06-02)… Kept on disk only as an audit trail — do not pull into public site/deck, do not treat as CANDIDATE for the real blade." |

### 2.4 Built lineage — production pipeline

| Dates (mtime) | Series | Key artifacts |
|---|---|---|
| 2026-07-06 → 2026-07-24 | `3PHASE_REBUILD_V0_1 → V0_9`, `P3_ONLY_SIGNAL_CORRECTION_V0_9_1` | `…3PHASE_REBUILD_V0_1_PROOF.md` … `V0_9_PROOF.md`, `V0_4_VISUAL_RULING.md`, `V0_5–V0_8_BLOCKER_ANALYSIS.md`, gate tables. Red → violet core reversal recorded in the SPEC_V1 header banner (operator rulings #54 → #58, 2026-07-06/07). |
| 2026-07-24 (all in one day) | `V0.10 → V0.26` | `MECHANICS_CANDIDATE_V0_10` · `OVERDRIVE_REFINEMENT_V0_11` · `MATERIAL_LOOKDEV_V0_12` · `NATIVE_INTEGRATION_V0_13` · `PHASE_TIMELINE_V0_14` · `SHELL_COHESION_V0_15` · `PRODUCTION_SURFACE_LOADPATH_V0_16/16_1` · `FINALIZATION_V0_17` · `CANON_BUILD_2D_TO_3D_V0_18` · `DEVELOPMENT_FILM_V0_19` · `HERO_READ_REFINEMENT_V0_20` · `CONTROLLED_GEOMETRY_FINISH_V0_21` · `STANDALONE_ASSET_V0_22` · `STANDALONE_FORM_REFINEMENT_V0_23` · `CANON_CONVERGENCE_V0_24` · `CANON_MECHANICAL_DEFINITION_V0_25` · `MATERIAL_FIDELITY_V0_26`. Narrated in `build_log/GATHER_REEL_V0_1/build_buildlog_blade.py` (the V0.13→V0.26 build-log arc, 2026-07-25 02:55) and `MIKAGE_ZENITH_BLADE_DEVELOPMENT_BUILD_LOG_V0_1.md` (2026-07-24 18:35). |
| 2026-07-28 | `V0.27 → V0.46` | `HERO_CONTEXT_VALIDATION_V0_27` · `INTERFACE_REGISTRATION_V0_28` (+ operator ruling) · `MATERIAL_FINALING_V0_29` (+ operator ruling) · `PHASE_MECHANISM_VALIDATION_V0_30` · `INTEGRATION_VALIDATION_V0_31` · `PRODUCTION_READINESS_V0_32` · **`OPERATOR_LOCK_V0_33_RULING.md`** (ASSET_LOCK: YES, PRODUCTION_READY: YES) · `DIAGNOSTIC_SHOT_V0_35` · `MOTION_STRESS_V0_36` · `INTEGRATION_PATTERN_V0_37` · **`VISUAL_NONCONFORMANCE_RESET_V0_41.md`** (revokes V0.33) · `ORIGINAL_DESIGN_REBUILD_V0_42` · **`V0_44_OPERATOR_VISUAL_RULING.md`** (FAIL) · `BRUTALIST_CORRECTION_V0_45` (+ ruling) · `MECHANICAL_DEPTH_V0_46` (+ ruling). |
| 2026-07-28 → 2026-07-31 | `V0.47 → V0.89` | Actor-integration chain: attachment clearance, docking load path, grip IK sweep, marker registration, collision ownership, mitten interface. Ends at `MITTEN_INTERFACE_CORRECTION_V0_89` (2026-07-31 00:29). |
| **2026-07-31 00:44 → ~05:00** | `FORM_A1/A2/A3 → EDGE_B1 → MAT_C1/C2/C3 → LIGHT_D1/D2/D3 → HERO_E1` | The proof series named in the audit brief. All under `production/character/reviews/`. Statuses are self-declared as `TECHNICAL_EVIDENCE_COMPLETE_AWAITING_OPERATOR_VISUAL_RULING`; MAT_C1 and MAT_C2 both carry an explicit operator `FAIL` in the next stage's report; MAT_C3 records `HUB_PASS_RANGE_MET: False` and `LIGHT_D1: BLOCKED`. `HERO_E1_QA_PROOF.md`: "Final visual approval pending operator." |
| 2026-07-30 (handoff) | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` | Operator decision logged: **Zenith Blade is FILM / RENDER-ONLY**; pipeline stages 5 (retopo) and 6 (UV/bake) LOCKED. |

### 2.5 CE candidate lineage (`_tmp/zenith_blade_hero_e1_ce01 … ce15`)

Branch point verified in the existing Evidence Matrix: CE01 reconciles against the committed
`…/rig_derivatives/MIKAGE_ZENITH_BLADE_HERO_E1.blend` at git `eb30157`.

| Folder | Stage | mtime range |
|---|---|---|
| `ce01` | form01 / interface01 / isolation / raycast / shell-depth | 2026-07-31 05:08 → 2026-08-04 06:06 |
| `ce02/form02` | **form02** — `FORM02_PROOF.md`, 9 passes | 2026-08-04 09:34 → 09:54 |
| `ce03/form03` | form03, 5 passes | 2026-08-04 10:39 → 10:52 |
| `ce04/architecture01` | **architecture cycle 1** | 2026-08-04 11:14 → 11:31 |
| `ce05/architecture02` | **architecture cycle 2** | 2026-08-04 11:45 → 12:01 |
| `ce06` … `ce08` | core-visibility / **spine-notch correction (SNC01)** | 2026-08-05 23:41 → 2026-08-06 02:57 |
| `ce09/architecture03_rebuild` | **architecture cycle 3** — `run_arch03_rebuild.py` (two-lobe chassis + central slot) | 2026-08-06 03:05 → 03:18 |
| `ce10` / `ce11` | armor-grammar refinement · load-path integration — both operator-REJECTED | 2026-08-06 03:37 → 04:12 |
| `ce12/silhouette_fusion01` | accepted silhouette basis — **contains no proof document** | 2026-08-06 09:25 → 09:28 |
| `ce13/final_form_polish01` | `FP_TECHNICAL_INTEGRITY_REPORT.md` — self-states `FINAL_FORM_VISUAL_CANDIDATE` | 2026-08-06 09:39 → 09:56 |
| `ce14/hero_design_pass01` | operator-REJECTED ("segmented plates beside dominant shell") | 2026-08-06 14:22 → 14:32 |
| **`ce15/hero_cohesion_correction01`** | `HC_TECHNICAL_INTEGRITY_REPORT.md`, `pass_03/` (64 files), candidate `465b212e…c3129` | 2026-08-06 14:56 → 15:16 |

### 2.6 Board, ruling and lock

| Date | Path |
|---|---|
| 2026-08-06 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_DECISIONS.md` (D1–D7 decision package) |
| 2026-08-06 | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` (D1=A … D7 CONFIRMED; 8 unresolved gaps listed) |
| 2026-08-06 | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png` / `.md` / `_MANIFEST.json` / `_SOURCE_MANIFEST.md` |
| 2026-08-06 | `renders/board_v1_evidence/` (durable evidence set incl. `ZENITH_BLADE_CE15_SOURCE.blend`, `BASELINE_METHOD.md`) |
| **2026-08-06** | `ZENITH_BLADE_CANON_LOCK_V1.md` (+ `_ERRATA_01`), `ZENITH_BLADE_MATERIAL_CANON_V1.md`, `ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md`, `ZENITH_BLADE_DESIGN_BIBLE_V1.md`, `ZENITH_BLADE_DESIGN_DNA.md`, `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md`, `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` |

### 2.7 Corpus gaps (findings, not blanks)

| # | Gap | Status |
|---|---|---|
| G1 | No file contains the literal string `IMMUTABLE SHAPE`. | UNCONFIRMED as a document |
| G2 | `OFFICIAL_VISUAL_BOUNDARY` — no file of that name or variant exists in the repo. | DOCUMENT NOT ON DISK |
| G3 | `_DISPATCH_56_BLADE_HELPERS` — no path, file, or directory of that name exists in the repo. The nearest match is `MIKAGE_ZENITH_BLADE_HANDOFF_PACKAGE_V0_56`. | UNCONFIRMED |
| G4 | `CODEX_BRIEFS/` does not exist in this repo. It exists only in the Studio OS folder and holds exactly four blade files, all dated 2026-07-05. | RESOLVED to external path |
| G5 | `ce12` has no proof/report document at all; `ce12`/`ce13` acceptance lives in session conversation, not in a repo artifact. | MISSING EVIDENCE (independently reproduces Evidence Matrix §Precision note) |
| G6 | No operator ruling found authorising the "warm/gold weapon colour" prohibition. | DRIFT — see §5d |
| G7 | No ruling found dropping CANON_V2's "Orbital Logic UI text wrapping blade in 3D" or "Rotating Enso core at hilt" from the weapon. | UNCONFIRMED |

---

## 3. RECONSTRUCTED TIMELINE (one chain)

| # | Date | Stage | What changed | Lane | Citation |
|---|---|---|---|---|---|
| 1 | 2026-03-19 | Canon V2 §2.4 | Weapon LOCKED as massive straight rectangular block; curved katana and thin elegant blade forbidden. | Operator canon | `MIKAGE_ZENITH_CANON_V2.md:122–159` |
| 2 | 2026-06-02 | Blade Spec V1 | STRUCTURE CANON LOCKED. Two-layer B4C porcelain / black titanium. Monolithic obelisk, flat-cut top, **no pointed tip / no crossguard / no wrapped grip**. | Operator | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:3, 63, 81` |
| 3 | 2026-06-04 | Cine colour contract | Kintsugi gold `#C39A52` locked to seams (permissive). Violet `#8F00FF` = sole emissive exception. Crimson seam declared a REQUIRED ANCHOR. | Operator (git `1a8cb8b`) | `design_system/mikage-cine-color-contract.md:3, 69–87, 24–30` |
| 4 | 2026-06-22 | Foundation Shape Lock V0.4 | "Zenith Blade = slab chữ nhật nặng" (heavy rectangular slab). | Operator | `MIKAGE_FOUNDATION_LOCK_V0_4.md:15–16` |
| 5 | **2026-06-28** | **V0.1 cine mock** | Slim symmetric spike, point-down taper, mid-shaft grip ring (2 tori), single floating violet sphere core, kintsugi-gold cracks, crimson seams, steel/platinum body. Self-labelled `V0.1 · LOCKED`. | **Lane B (Claude Code)** | `MIKAGE_BLADE_3D_INSPECT.html:42, 71–107`; `MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` |
| 6 | 2026-06-29 | Commit | V0.1 poster + viewer committed. | Operator (git `73cccd2`) | git log |
| 7 | 2026-07-05 | Codex slab brief | V0.1 DNA formalised for 3D: grip ring at 0.50·L, blunt chisel tip, full-length violet seam, **graphite body (no porcelain)**. `STATUS: geometry spec LOCKED`. | Lane A brief authorship | `CODEX_BRIEFS/2026-07-05_zenith-blade-slab-remodel.md` §§2,3,4,6 |
| 8 | 2026-07-06 00:05 | Slab Remodel V0.1 | First built blade. W/L = 0.240 (PASS), blunt tip, blocked pending KF05 compare. | Lane A (Codex) | `…SLAB_REMODEL_V0_1_PROOF.md` |
| 9 | **2026-07-06** | **Operator supersession** | Whole slab-remodel premise ruled **WRONG CANON BASIS** for conflicting with the 2026-06-02 lock. Retained as audit trail only. | **Operator (BOOS)** | `…SLAB_REMODEL_V0_1_PROOF.md`, banner |
| 10 | 2026-07-06 → 07-11 | 3-Phase Rebuild V0.1→V0.9 | Weapon core colour reversed red `#E60000` → violet `#8F00FF`; red banned at every phase. Phase-visibility driver repaired at V0.9. | Lane A + operator rulings #54→#58 | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:5–14`; `…3PHASE_REBUILD_V0_4_VISUAL_RULING.md` |
| 11 | 2026-07-24 | V0.10 → V0.26 | Mechanics → shell cohesion (four plates) → load path → geometry finish → standalone extraction → canon convergence → mechanical definition → material fidelity. **Operator ruling "V0.15 SHELL FORM" promoted 2026-07-24** (four linked plates; P2 no violet; P3 exactly one central violet core; no red at any phase). | Lane A (Codex) + operator | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:104–121`; `build_buildlog_blade.py:21–34` |
| 12 | 2026-07-24 | Gold gate appears | `V0_23_PROOF.md:39` — "no ambient violet, halo, wash, red, **gold**, or warm fill was added"; `V0_26_PROOF.md:42` — "Red/crimson, **warm/gold signal**, violet wash/halo/ambient or secondary core: none." | **Lane A dispatch-brief authorship** (AGENTS.md §V0.26/§V0.29) | see §5d |
| 13 | 2026-07-28 | V0.27→V0.33 lock | Interface registration, material finaling, phase mechanism, integration, readiness → `OPERATOR_LOCK_V0_33`: ASSET_LOCK YES, PRODUCTION_READY YES. | Operator | `…OPERATOR_LOCK_V0_33_RULING.md` |
| 14 | 2026-07-28 | V0.41 reset | V0.33 lock **REVOKED for visual form** — the four parallel shells read as "an opening box, not a unified Zenith Blade". | Operator | `…VISUAL_NONCONFORMANCE_RESET_V0_41.md` |
| 15 | 2026-07-28 | Ruling A (superseded same day) | "ORIGINAL ZENITH BLADE FORM": tapered silhouette and pointed tip **allowed**; item 8 rules the V0.1-era **violet ring is presentation-only, not asset geometry**. | Operator | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:123–139` |
| 16 | 2026-07-28 | V0.42 + V0.44 | Pointed-taper rebuild → operator `FAIL_CANON_CONVERGENCE` (`POINTED_TIP_RULE: FAIL`). | Lane A + operator | `…V0_44_OPERATOR_VISUAL_RULING.md` |
| 17 | **2026-07-28** | **Ruling B — BRUTALIST CONVERGENCE** | Explicitly supersedes Ruling A. Pointed tip and fantasy-greatsword read **forbidden**; termination flat-cut or blunt; four mechanically linked shell plates; P3 reveals exactly one recessed electric-violet core. | **Operator** | `MIKAGE_ZENITH_BLADE_SPEC_V1.md:141–161` |
| 18 | 2026-07-28 | V0.45 / V0.46 | Correction PASS, then mechanical depth PASS (`ASSET_PROMOTION: NO`). | Operator | `…V0_45_OPERATOR_RULING.md`, `…V0_46_OPERATOR_RULING.md` |
| 19 | 2026-07-28 → 07-31 | V0.47 → V0.89 | Actor-integration chain; ends `MITTEN_INTERFACE_CORRECTION_V0_89`. | Lane A (Codex) | `…V0_89_PROOF.md` |
| 20 | 2026-07-30 | Operator decision | Zenith Blade is **FILM / RENDER-ONLY**; retopo + UV/bake stages locked. | Operator | `docs/handoff/00_LATEST_CODEX_HANDOFF.md` |
| 21 | 2026-07-31 | FORM_A → EDGE_B → MAT_C → LIGHT_D → HERO_E1 | Staged shape / edge / material / light / hero series. MAT_C1 FAIL, MAT_C2 FAIL, MAT_C3 gate not met, LIGHT_D1 blocked then corrected at D2/D3, HERO_E1 eight gates technically PASS, visual approval pending. | Lane A (Codex) | `…FORM_A3_PROOF.md`, `…EDGE_B1_PROOF.md`, `…MAT_C1/2/3_PROOF.md`, `…LIGHT_D3_PROOF.md`, `…HERO_E1_QA_PROOF.md` |
| 22 | 2026-08-04 | CE01 → CE05 | form01/02/03, architecture cycles 01 and 02. | This-session lineage | `_tmp/zenith_blade_hero_e1_ce0*` |
| 23 | 2026-08-05/06 | CE06 → CE09 | Core-visibility diagnosis → **spine-notch correction (core made visible by notching the spine, not moving the core)** → architecture cycle 03 rebuild (two-lobe chassis + central slot). | This-session lineage | `…ce07/CVC01_REPORT.json`, `…ce08/SNC01_REPORT.json`, `…ce09/run_arch03_rebuild.py` |
| 24 | 2026-08-06 | CE10 → CE14 | CE10 rejected ("boxes on slab"), CE11 rejected ("cladding beside chassis"), CE12 silhouette fusion accepted, CE13 polish, CE14 rejected ("segmented plates"). | This-session + operator (conversation record) | Evidence Matrix §Precision note |
| 25 | **2026-08-06 14:56–15:16** | **CE15** | Seam hierarchy rebuilt (one dominant seam), cross-boundary curvature, consolidated terminations. All technical gates pass; 0 px silhouette deviation beyond anti-alias at 64/128 px. | This-session lineage | `HC_TECHNICAL_INTEGRITY_REPORT.md` |
| 26 | 2026-08-06 | Board V1 | 13-panel board assembled by PIL composite from existing renders; durable evidence relocated; tripwire rebaselined v1→v2 (78→79). | Documentation task | `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_SOURCE_MANIFEST.md` |
| 27 | **2026-08-06** | **Operator ruling D1–D7 + CANON LOCK V1** | CE15 = final visual-form basis; porcelain `#F2EEEA`; dual-lineage handoff; violet `#8F00FF` confirmed. `ASSET LOCK: NOT ISSUED`, `PRODUCTION READY: NOT ISSUED`. | **Operator (BOOS BỚP)** | `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md`, `ZENITH_BLADE_CANON_LOCK_V1.md` |

---

## 4. DELTA CLASSIFICATION — SUMMARY

Full evidence per delta is in [ZENITH_BLADE_DELTA_TABLE_01.md](ZENITH_BLADE_DELTA_TABLE_01.md).

| Delta | Change | Verdict |
|---|---|---|
| **a** | slim symmetric spike → wide asymmetric armored chassis | **RULED** |
| **b** | single floating violet sphere node → recessed bar behind spine window | **RULED** |
| **c** | grip ring at mid-shaft → absent | **RULED** (twice) |
| **d** | kintsugi-gold → absent in final | **See §5d — premise corrected; prohibition = DRIFT** |
| **e** | crimson / Enji seam → absent | **RULED** (with an open, unamended contract conflict) |
| **f** | porcelain mass added | **RULED** (rule predates V0.1) |
| **g** | "IMMUTABLE SHAPE" list survival | **3 survived · 1 partial · 1 dropped — all RULED; the list itself UNCONFIRMED as a document** |

---

## 5. DELTA DETAIL

### 5a — Silhouette: slim symmetric spike → wide asymmetric armored chassis · **RULED**

V0.1 geometry (viewer source, verbatim): a symmetric slab half-width `0.13`, parallel from `y=1.55`
down to `y=-0.95`, then a symmetric taper to a point at `y=-1.85`. CE15: four porcelain shell plates
over a graphite chassis, blunt mechanical termination. The audit-derived threshold mask puts the two
silhouettes at roughly `1 : 12.6` and `1 : 2.4` width-to-height — different silhouette families.

**Governing authority:** operator ruling "ZENITH BLADE BRUTALIST CONVERGENCE", 2026-07-28,
`MIKAGE_ZENITH_BLADE_SPEC_V1.md:141–161` — "Pointed tip and fantasy-greatsword read are forbidden…
The lower termination must be flat-cut or blunt mechanical, not pointed… The outer structure uses four
mechanically linked shell plates."

**Note (recorded separately, not folded into the verdict):** two earlier locks already forbade the V0.1
read — CANON_V2 §2.4 (2026-03-19, "Forbidden Traits: curved katana form, thin elegant blade") and
SPEC_V1 §3 (2026-06-02, "No pointed tip"). V0.1 therefore contradicted a live lock on the day it was made.

### 5b — Core: single floating violet sphere node → recessed bar behind spine window · **RULED**

V0.1: `SphereGeometry(0.075)` violet core parented to the mid-shaft grip node, plus a point light and
an additive glow sprite. CE15: `ZB42_P3_SINGLE_RECESSED_CORE`, fixed central position, made visible in
P3 by **notching the spine, not moving the core** (`ce08/SNC01_REPORT.json`; core transform unchanged
since CE08 per `HC_TECHNICAL_INTEGRITY_REPORT.md`).

**Governing authority (three, consistent):**
V0.15 SHELL FORM ruling, 2026-07-24 — "P3: cùng cơ cấu mở rộng hơn và lộ đúng một electric-violet weapon
core ở trung tâm"; ORIGINAL FORM ruling, 2026-07-28, item 7 — "P3 retains exactly **one recessed**
electric-violet central core"; operator decision **D7**, 2026-08-06.

The *count* (exactly one) and the *hue* (`#8F00FF`) survived from V0.1 unchanged. The *placement* and
*geometry* changed under ruling. The V0.1 glow sprite / point-light treatment is banned in the final
("no wash / halo / ambient / fill", D7).

### 5c — Grip ring at mid-shaft → absent · **RULED** (twice, independently)

Confirmed absent from CE15 without opening Blender, on two independent lines of evidence:
1. **Object set.** The CE15 build script and its pass report enumerate every weapon object:
   `ZB42_CENTRAL_LOAD_SPINE`, `ZB42_P3_SINGLE_RECESSED_CORE`, `ZB42_LOWER_DOCKING_LOAD_FOOT`,
   `ZB45_SHELL_LL/LR/UL/UR`, `ZB46_DRIVE_HUB`, `ZB46_HUB_SHOULDER_L/R`, `ZB46_BASE_CHEEK_L/R`,
   `ZB46_BASE_SPINE_RECEIVER`, `ZB46_FLUX_BASE`, `ZB48_HANDLE_REGISTERED_TO_HAND_MARKER`,
   `ZB_ARCH03R_CHASSIS`, `ZB_ARCH03R_HUB_NECK`, `ZB_LP_CHANNEL_L/R`. **No ring or torus object.**
2. **Renders.** No annular element appears in `HC_front_P3.png`, `HC_side_P3.png`, `HC_rear34_P3.png`,
   `HC_authored_P1/P2/P3.png`, or `OUT1_HERO_P3_85MM.png`, nor on Board V1 panels 1–6 and 10.

**Governing authority (two):**
(i) SPEC_V1 §3, 2026-06-02 — "No pointed tip, no crossguard, **no wrapped/leather grip**"; the interface
is "a rectangular hydraulic Drive Hub + flush concentric mechanical rings… instead of a guard" —
i.e. hub-integrated, not a free ring at mid-shaft. This lock predates V0.1.
(ii) ORIGINAL ZENITH BLADE FORM ruling, 2026-07-28, **item 8** — "**Any violet ring shown in old
presentation artwork is presentation-only and is not asset geometry**, ambient light, wash or halo."
This is a direct, dated operator disposition of the V0.1 ring.

The ring's *reintroduction* is also traceable: `CODEX_BRIEFS/2026-07-05_zenith-blade-slab-remodel.md`
§4 specified it at `0.50·L`; that entire brief was ruled WRONG CANON BASIS by the operator on 2026-07-06.

### 5d — Kintsugi-gold · **premise corrected; the prohibition is DRIFT**

This delta splits into four separately-evidenced findings. They must not be merged.

**d1 — The "MAT_C2 gold tip" is a false-colour diagnostic. PREMISE NOT SUPPORTED.**
See §1 F2 and the composite. The ochre appears only in the two `*_MATERIAL_ID.png` files, which are
index maps. Measured warm-pixel count is **0** in every beauty/proof render in the MAT_C, EDGE_B and
LIGHT_D sets.

**d2 — Gold was never present in any built 3D candidate. VERIFIED.**
The first built blade (`SLAB_REMODEL_V0_1`, 2026-07-06) was specified graphite-bodied with a violet
seam and no gold (`CODEX_BRIEFS/2026-07-05_…-slab-remodel.md` §6). The `3PHASE_REBUILD_V0_1` brief
(2026-07-06) states "no gold except literal kintsugi-line color if used"; its proof confirms
"Weapon materials are limited to off-white matte B4C, dark Titanium, and red core/cracks. **No weapon
material uses violet `#8F00FF`, orange, gold, or magenta.**" Every later material report lists four
materials and zero unclassified. Gold therefore never entered the built lineage and could not have been
"dropped mid-arc."

**d3 — The explicit prohibition on warm/gold weapon colour has no operator ruling. DRIFT.**
First appearance in an artifact: `MIKAGE_ZENITH_BLADE_STANDALONE_FORM_REFINEMENT_V0_23_PROOF.md:39`
(2026-07-24) — "no ambient violet, halo, wash, red, **gold**, or warm fill was added". It is a gate line
in the corresponding dispatch briefs (`AGENTS.md`, V0.26 block line ~3033 and V0.29 block line ~3320:
"No … red/crimson, **warm/gold weapon color**, P2 violet, ambient violet, wash, halo, secondary core").
**Lane introducing it:** Lane A dispatch-brief authorship. No dated operator ruling authorising this
prohibition was found anywhere in the corpus. None of the operator rulings of 2026-07-24, 2026-07-28
(×3), or 2026-08-06 (D1–D7) mentions gold.

**d4 — The cine colour contract is not violated by the absence, but the tightening is unruled.**
The contract (2026-06-04) makes gold **permissive** on seams, not mandatory — so an asset with no gold
does not violate it. What is unruled is the *ban*: a dispatch brief narrowed a locked operator contract
without a ruling. Per the audit's own standing rule, operator acceptance of CE15 (2026-08-06) does not
retroactively convert this into RULED. Both facts are recorded separately:
- the ban's authority is undocumented → **DRIFT**;
- the operator accepted the CE15 visual on 2026-08-06 → **a later, separate fact.**

### 5e — Crimson / Enji seam → absent · **RULED** (with an open contract conflict)

**Governing authority:** operator visual rulings #54 → #58, 2026-07-06/07, recorded verbatim in the
SPEC_V1 header banner: "the Zenith Blade core/seam signal is **electric violet, `#8F00FF` family**…
**Red/crimson is BANNED on this weapon at every phase**." Reaffirmed by operator decision **D7**
(2026-08-06) and by the V0.15 ruling item 7 (2026-07-24).

Measured: `OUT1_HERO_P3_85MM.png` (unannotated) contains **0** pixels satisfying
`R > G+40 ∧ R > B+40 ∧ R > 60`. (The annotated variant registers 310 such pixels; all of them belong to
the annotation overlay graphics, not the render.)

**Open conflict, recorded not resolved:** the cine colour contract's REQUIRED ANCHORS block still states
"ANY SEAM/BREAK → a Bengala crimson seam (repair-as-beauty)" as a per-frame requirement, and
`MIKAGE_ZENITH_CANON_V2.md` §2.4 still lists "Deep crimson glowing core (`#E60000`)" under a LOCKED
heading. Neither document has been amended. The operator ruling supersedes them **in effect** for this
weapon; the documents have not been updated to say so. This reproduces Evidence Matrix topic **L**
independently and extends it to the cine contract, which the Matrix does not cover.

### 5f — Porcelain mass added · **RULED — and the rule predates V0.1**

`MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1 (STRUCTURE CANON LOCKED **2026-06-02**): "outer = **B4C porcelain
shell** (white `#FAFAFA`, sterile, the only visible surface in P1); inner = black rusty Titanium
load-bearing frame". V0.1 (2026-06-28) instead used steel `#55555c` / platinum `#c6c8cc`, and the
2026-07-05 Codex brief §6 doubled down on a graphite body. Both departed from the standing lock.
CE15's four porcelain shell plates restore it.

Hex value: the `#FAFAFA` (spec) vs `#F2EEEA` (built) conflict was resolved by operator decision **D3**
on 2026-08-06 in favour of the built value.

### 5g — The "IMMUTABLE SHAPE" list · list UNCONFIRMED as a document; all five items RULED

No file contains the literal string. The five items are reconstructed from three artifacts that do
exist: the poster caption ("straight slab · point-down · core node"), the viewer geometry, and
`docs/MIKAGE_SESSION_LESSONS.md:257`.

| Item | Survived in CE15? | Verdict | Authority |
|---|---|---|---|
| **straight** | YES | RULED (consistent) | CANON_V2 §2.4 "Absolutely straight (zero curvature)", 2026-03-19 |
| **point-down** | **PARTIAL** — the vertical / hanging orientation survived; the **point itself was removed** | RULED | V0.15 ruling item 6 (blade held vertical at Mikage's hip), 2026-07-24; BRUTALIST CONVERGENCE item 4 (flat-cut or blunt termination), 2026-07-28 |
| **single core node** | YES in count (exactly one, `#8F00FF`, P3-only); geometry and placement changed | RULED | V0.15 item 4 · ORIGINAL FORM item 7 · D7 |
| **grip ring** | **NO — dropped** | RULED | SPEC_V1 §3 (2026-06-02) · ORIGINAL FORM item 8 (2026-07-28) — see §5c |
| **not-a-katana** | YES | RULED (predates V0.1) | CANON_V2 §2.4 Forbidden Traits · SPEC_V1 §1 "Forbidden drift (ALL phases)" |

---

## 6. CONTRACT COMPLIANCE — built CE15 against each locked-era document

Verdicts: **COMPLIES** · **VIOLATES** · **SUPERSEDED** (by a later dated operator ruling) ·
**NOT VERIFIED** (no measurement exists) · **UNCONFIRMED** (document absent).

### 6.1 Cine colour contract — `design_system/mikage-cine-color-contract.md`, LOCKED 2026-06-04

| Clause (line) | Requirement | CE15 | Verdict |
|---|---|---|---|
| §VIOLET (76–87) | `#8F00FF` allowed only as slit halo or P3 Overdrive core; no fills, washes, ambient tint | P1 violet 0 · P2 violet 0 · P3 ROI 2879 · global 0.139 % (gate ≤ 5 %) | **COMPLIES** |
| KINTSUGI GOLD (69–74) | Gold `#C39A52` permitted on kintsugi seams (permissive, not required) | No gold present | **COMPLIES** — but the *prohibition* that produced this state is unruled (§5d3) |
| REQUIRED ANCHORS (24–30) | "ANY SEAM/BREAK → a Bengala crimson seam" | 0 crimson pixels measured | **SUPERSEDED** by operator ruling 2026-07-06/07 + D7 — **contract text never amended (OPEN)** |
| COOL STEEL (63–67) | Z-Blue `#4B5866`, muted, non-emissive | MAT_C1/C2 graphite = exactly `#4B5866`, metallic 0.62–0.65, non-emissive | **COMPLIES** |
| FORBIDDEN (89–100) | No pure `#FFFFFF` / `#000000` | Background `#050508` (measured exactly at px 100,100 in LIGHT_D3); porcelain `#F2EEEA` | **COMPLIES** |
| FORBIDDEN (89–100) | No synthetic magenta range | 3PHASE V0.4→V0.9 hue gates 268–280°, R/B 0.45–0.65; peak-pixel method adopted after the V0_2 magenta catch | **COMPLIES** |
| PHYSICS/BUDGET (13–22) | Shadow ≥ 70 % of frame; max saturation ≤ 65 % HSL; noise floor ≥ 4 % grain everywhere | No frame-budget, saturation-histogram, or grain measurement exists anywhere in the corpus. CE15 renders are neutral-studio proofs, not cine-graded frames. | **NOT VERIFIED** |
| TEXTURE & LIGHT (102–109) | Keshiki on every surface; bokashi gradients; temperature-shifted shadows | MAT_C2 explicitly records "roughness-only micro variation, **no bump or color noise**" | **NOT VERIFIED** — arguably at odds with the clause; no ruling either way. Recorded, not adjudicated. |

### 6.2 `MIKAGE_ZENITH_CANON_V2.md` §2.4 — LOCKED 2026-03-19

| Clause | CE15 | Verdict |
|---|---|---|
| "Massive, oversized rectangular block" / "Absolutely straight (zero curvature)" | Brutalist monolith, four plates, straight | **COMPLIES** |
| "Length: 35–58 inches" | 1.200000 m = 47.2441 in — inside range; reconciled 2026-08-06 (`OUT4_SCALE_VS_HUMAN_ANNOTATED.png`) | **COMPLIES** |
| "Thick spine, ultra-thin edge; Appleseed geometry (convex distal taper)" | No edge-thickness measurement exists in any proof | **NOT VERIFIED** (= Evidence Matrix topic D) |
| "Dark rusty titanium scrap plates" (outer material) | Outer is B4C porcelain `#F2EEEA` | **SUPERSEDED** by SPEC_V1 two-layer ruling, 2026-06-02 |
| "Deep crimson glowing core (`#E60000`)" | Violet `#8F00FF`, P3 only | **SUPERSEDED** by 2026-07-06/07 + D7 — CANON_V2 text never amended (OPEN) |
| "Mass: 350kg" | `PHYSICAL_VOLUME_EXACT_VALUE: NOT VERIFIED`; all collision evidence is BVH triangle-overlap | **NOT VERIFIED** |
| "Hilt: 6 inches" | No hilt-length measurement found | **NOT VERIFIED** |
| "Continuous 0.5mm vibration (flux pinning)" | Retained in canon and mechanical spec; not required visible in stills (operator D6, 2026-08-06) | **COMPLIES** |
| "Orbital Logic UI text wrapping blade in 3D" | Absent from CE15 | **UNCONFIRMED** — the SPEC_V1 banner supersedes the *red* Orbital-Logic UI as part of the colour reversal, but no ruling drops the feature itself |
| "Rotating Enso core at hilt" | Absent from CE15 | **UNCONFIRMED** — no ruling found |
| "Forbidden: curved katana form / thin elegant blade / clean laser aesthetic / fantasy ornaments" | All held | **COMPLIES** |

### 6.3 `MIKAGE_ZENITH_BLADE_SPEC_V1.md` — STRUCTURE CANON LOCKED 2026-06-02 + appended rulings

| Clause | CE15 | Verdict |
|---|---|---|
| Four mechanically linked shell plates (V0.15 ruling 1–2; BRUTALIST CONVERGENCE 6) | `ZB45_SHELL_UL/UR/LL/LR` | **COMPLIES** |
| P1 closed monolith, P2 open with core off, P3 one recessed violet core | Core state `P1 false / P2 false / P3 true`, verified in `HC_PASS03_REPORT.json` | **COMPLIES** |
| Flat-cut / blunt lower termination, no point (BRUTALIST CONVERGENCE 2, 4) | Blunt mechanical termination | **COMPLIES** |
| "No pointed tip, no crossguard, no wrapped/leather grip" (§3) | Held; no grip ring | **COMPLIES** |
| Porcelain `#FAFAFA` (§1) | Built `#F2EEEA` | **SUPERSEDED** by operator D3, 2026-08-06 |
| "No red/crimson at any phase" (V0.15 ruling 7) | 0 crimson px measured | **COMPLIES** |
| "Violet bị cấm làm fill, wash, ambient, halo, secondary core" (V0.15 ruling 7) | Global violet 0.139 %, one core | **COMPLIES** |
| Mass 350 kg / flux pinning 0.5 mm | Canon-retained, unmeasured | **NOT VERIFIED** |

### 6.4 `OFFICIAL_VISUAL_BOUNDARY`

**UNCONFIRMED — the document does not exist on disk.** No compliance assessment is possible. See G2.

---

## 7. WHAT THIS AUDIT DOES NOT DO

- It does **not** reopen, weaken, or qualify the CE15 canon lock of 2026-08-06.
- It does **not** express any view on which design is better. Verdicts stop at RULED / DRIFT / UNCONFIRMED.
- It does **not** convert operator acceptance of a later artifact into retroactive authority for an
  earlier undocumented change. Where both facts exist (delta *d*), both are stated separately.
- It does **not** mark anything PASS, verified, approved, asset-locked, or production-ready.

---

## 8. OPEN ITEMS FOR THE OPERATOR (record only — no recommendation)

1. Delta *d3*: the warm/gold weapon-colour prohibition has no ruling. Rule it, or record it as an
   unruled build convention.
2. The cine colour contract's crimson REQUIRED ANCHOR and CANON_V2 §2.4's crimson core both still
   read as locked while the weapon is violet-only. Neither carries an amendment.
3. CANON_V2's "Orbital Logic UI" and "Rotating Enso core at hilt" are absent from CE15 with no ruling.
4. The V0.1 cine lineage (`assets/keyart/blade/`, and the 17-file external `BLADE_V0.1/` set including
   published WAKE lyric videos) has no disposition in the design record and is not in the Design DNA
   REJECTED list.
5. `OFFICIAL_VISUAL_BOUNDARY` is referenced as a governing document but does not exist on disk.
6. Cine-contract physical budgets (70/30 shadow, ≤65 % saturation, ≥4 % grain, keshiki) have never
   been measured against any Blade render.

---

*End of ZENITH_BLADE_LINEAGE_AUDIT_01. Read-only forensic record. No canon approval, no asset lock,
no PASS, no production-ready claim. No commit, no push.*
