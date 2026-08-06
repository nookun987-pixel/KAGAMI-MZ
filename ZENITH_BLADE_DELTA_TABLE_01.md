# ZENITH BLADE — DELTA TABLE 01 (V0.1 cine mock → CE15 canon-locked)

**Task:** `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01`
**Date:** 2026-08-07 · **Mode:** read-only forensics · **Parent:** [ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md)

**Reference (left side of every delta):** `BLADE_V0.1`, file-dated 2026-06-28.
**Final (right side):** CE15, canon-locked 2026-08-06, blend sha256 `465b212e…c3129`.

### Verdict definitions

| Verdict | Meaning |
|---|---|
| **RULED** | A dated operator ruling or lock document authorises the change. The exact document and date are cited. |
| **DRIFT** | No ruling found. The first artifact carrying the change and the lane that introduced it are named. |
| **UNCONFIRMED** | The record is insufficient to decide. What is missing is stated. |

**Standing rule applied throughout:** operator acceptance of a LATER artifact (e.g. Board V1 or the
CE15 canon lock of 2026-08-06) does **not** retroactively convert an earlier undocumented change into
RULED. Where both facts exist, both are recorded separately in the Notes column.

---

## A. The seven named deltas

| # | Feature | V0.1 (2026-06-28) | CE15 (2026-08-06) | **VERDICT** | Governing evidence (document · date · line) | Notes / second facts |
|---|---|---|---|---|---|---|
| **a** | **Silhouette** | Slim symmetric spike. Slab half-width `0.13`, parallel `y=1.55 → −0.95`, symmetric taper to a point at `y=−1.85`. Derived mask ≈ 1 : 12.6 w:h. | Wide asymmetric armored chassis: four porcelain shell plates over a graphite chassis, blunt mechanical termination. `SIL_ce15_128.png` ≈ 1 : 2.4 w:h. | **RULED** | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md:141–161` — operator ruling **"ZENITH BLADE BRUTALIST CONVERGENCE", 2026-07-28**: "Pointed tip and fantasy-greatsword read are forbidden… lower termination must be flat-cut or blunt mechanical, not pointed… four mechanically linked shell plates." Explicitly supersedes the same-day "ORIGINAL ZENITH BLADE FORM" ruling. Enforcement evidence: `…V0_44_OPERATOR_VISUAL_RULING.md` — `POINTED_TIP_RULE: FAIL`, `MONOLITHIC_BRUTALISM: FAIL`. | Two earlier locks already forbade the V0.1 read: `MIKAGE_ZENITH_CANON_V2.md:155–159` (2026-03-19, "thin elegant blade" forbidden) and `SPEC_V1.md:81` (2026-06-02, "No pointed tip"). V0.1 contradicted a live lock on the day it was made. |
| **b** | **Core** | Single floating violet sphere, `SphereGeometry(0.075)`, parented to the mid-shaft grip node; plus `PointLight(0x8f00ff)` and an additive glow sprite. | `ZB42_P3_SINGLE_RECESSED_CORE` — one recessed core at a fixed central position, revealed in P3 by notching the spine. Core transform unchanged since CE08. | **RULED** | `SPEC_V1.md:111` — V0.15 SHELL FORM ruling, **2026-07-24**: "P3: … lộ đúng một electric-violet weapon core ở trung tâm." · `SPEC_V1.md:133` — ORIGINAL FORM ruling, **2026-07-28**, item 7: "P3 retains exactly one **recessed** electric-violet central core." · `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` **D7**, 2026-08-06. Implementation: `_tmp/…ce08/spine_notch_correction01/SNC01_REPORT.json`. | **Survived unchanged:** the count (exactly one) and the hue (`#8F00FF`). **Changed under ruling:** placement, geometry, and the emission treatment — V0.1's glow sprite / point light is banned by D7 ("no wash / halo / ambient / fill"). |
| **c** | **Grip ring** | Metal ring at mid-shaft: `TorusGeometry(0.235, 0.028)` ×2 (crossed), platinum `#c6c8cc`, inside a `0.34×0.34×0.20` band. Formalised for 3D at `0.50·L`, `#D6D6D6`, by the 2026-07-05 Codex brief §4. | **Absent.** | **RULED** (two independent authorities) | (i) `SPEC_V1.md:81, 84` — STRUCTURE CANON LOCKED **2026-06-02**: "No pointed tip, no crossguard, **no wrapped/leather grip**"; the interface is a "rectangular hydraulic Drive Hub + flush concentric mechanical rings… instead of a guard" (hub-integrated, not a free mid-shaft ring). **This lock predates V0.1.** (ii) `SPEC_V1.md:134` — ORIGINAL FORM ruling, **2026-07-28**, item 8: "**Any violet ring shown in old presentation artwork is presentation-only and is not asset geometry**, ambient light, wash or halo." | **Absence confirmed without Blender**, two ways: (1) the CE15 object enumeration in `run_cohesion01.py` + `HC_PASS03_REPORT.json` contains no ring/torus object; (2) no annular element appears in `HC_front_P3` / `HC_side_P3` / `HC_rear34_P3` / `HC_authored_P1-P3` / `OUT1_HERO_P3_85MM`, or Board V1 panels 1–6, 10. The reintroducing brief was itself ruled WRONG CANON BASIS by the operator on **2026-07-06** (`…SLAB_REMODEL_V0_1_PROOF.md`, banner). |
| **d** | **Kintsugi-gold** | Present: two `#c39a52` emissive crack bars + one gold "menuki" sphere (viewer source, lines 100–107). | Absent — and **never present in any built 3D candidate**. | **See d1–d4 below. Net: premise corrected; the prohibition is DRIFT.** | — | The audit brief's premise ("MAT_C2 renders visibly carry a kintsugi-gold tip") is **not supported**. Broken out below. |
| **e** | **Crimson / Enji seam** | Two seam bars, base `#9d2933` (Enji), emissive `#8e050f` (Bengala), one per face. | Absent. Measured: **0** pixels satisfying `R>G+40 ∧ R>B+40 ∧ R>60` in `OUT1_HERO_P3_85MM.png` (unannotated). | **RULED** | `SPEC_V1.md:5–14` — header banner recording operator visual rulings **#54 → #58, 2026-07-06/07**: "the Zenith Blade core/seam signal is electric violet, `#8F00FF` family… **Red/crimson is BANNED on this weapon at every phase**." · `SPEC_V1.md:114` — V0.15 ruling item 7, 2026-07-24. · `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` **D7**, 2026-08-06. | **Separate open fact:** the cine colour contract's REQUIRED ANCHORS block (`mikage-cine-color-contract.md:24–30`) still mandates "ANY SEAM/BREAK → a Bengala crimson seam", and `MIKAGE_ZENITH_CANON_V2.md:145` still lists "Deep crimson glowing core (#E60000)" under a LOCKED heading. Neither has been amended. The ruling supersedes them in effect; the documents do not say so. |
| **f** | **Porcelain mass** | Not present. Body materials are steel `#55555c`, dark steel `#33333a`, platinum `#c6c8cc`, Z-Blue `#4b5866` cap edge. | Four porcelain shell plates `ZB45_SHELL_UL/UR/LL/LR`, `#F2EEEA`, metallic 0, roughness 0.46. | **RULED — the rule predates V0.1** | `SPEC_V1.md:63` — STRUCTURE CANON LOCKED **2026-06-02**: "outer = **B4C porcelain shell** (white `#FAFAFA`, sterile, the only visible surface in P1); inner = black rusty Titanium load-bearing frame." | Hex conflict `#FAFAFA` (spec) vs `#F2EEEA` (built) resolved by operator **D3**, 2026-08-06, in favour of the built value. The 2026-07-05 Codex brief §6 had specified a graphite body (`#252321 / #424246`) — a second departure from the same lock, closed by the 2026-07-06 supersession. |
| **g** | **"IMMUTABLE SHAPE" list** | The five-item list named in the audit brief. | See per-item table §B. | **List itself: UNCONFIRMED as a document. All five items individually RULED.** | No file in this repo or in the Studio OS folder contains the literal string `IMMUTABLE SHAPE`. Reconstructed from: the poster caption "straight slab · point-down · core node"; the viewer geometry; `docs/MIKAGE_SESSION_LESSONS.md:257`. | **Missing:** the source sheet or note that carried the list verbatim. If it exists, it is outside both searched roots. |

---

## d — Kintsugi-gold, broken out

| Sub | Finding | Verdict | Evidence |
|---|---|---|---|
| **d1** | The gold-looking tip in the MAT_C2 set is a **false-colour MATERIAL-ID diagnostic**, not a gold material. Ochre RGB ≈ `(206,157,68)` is the index swatch for the `sumi` group (`ZB_FORM_A3_ATTACK_COLLAR_WEDGE`, `ZB46_FLUX_BASE` and siblings). | **PREMISE NOT SUPPORTED** | Pixel sweep of all 39 PNGs in `MAT_C1/C2/C3 + EDGE_B1 + LIGHT_D1/D2/D3`: warm pixels (`R>B+15 ∧ G>B ∧ R>50`) = **0** in every file **except** `…MAT_C2_MATERIAL_ID.png` and `…MAT_C3_MATERIAL_ID.png` (1493 sampled px each). Same crop box in `…MAT_C2_NEUTRAL_RENDER.png` reads dark sumi `#252321 / #23211F`. Documented visually in `ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png`. |
| **d2** | Gold was **never present in any built 3D candidate**, so it cannot have been "dropped mid-arc". | **VERIFIED** | `CODEX_BRIEFS/2026-07-05_zenith-blade-slab-remodel.md` §6 (first built blade: graphite body, violet seam, no gold). `LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_1.md:94` — "no gold except literal kintsugi-line color if used"; `…3PHASE_REBUILD_V0_1_PROOF.md:41` — "Weapon materials are limited to off-white matte B4C, dark Titanium, and red core/cracks. No weapon material uses violet `#8F00FF`, orange, **gold**, or magenta." `MAT_C1/C2/C3_REPORT.json` `material_system` = porcelain / graphite / sumi / inset, `all_mesh_objects_classified: true`, `unclassified: []`. |
| **d3** | The explicit prohibition on **warm/gold weapon colour** has no operator ruling behind it. | **DRIFT** | First artifact: `…STANDALONE_FORM_REFINEMENT_V0_23_PROOF.md:39` (**2026-07-24**) — "no ambient violet, halo, wash, red, **gold**, or warm fill was added". Restated `…MATERIAL_FIDELITY_V0_26_PROOF.md:42` and `…MATERIAL_FINALING_V0_29_PROOF.md:81`. Source of the gate: dispatch-brief text in `AGENTS.md` (V0.26 block ≈ line 3033; V0.29 block ≈ line 3320) — "No … red/crimson, **warm/gold weapon color**, P2 violet, ambient violet, wash, halo, secondary core". **Lane that introduced it: Lane A dispatch-brief authorship.** No operator ruling of 2026-07-24, 2026-07-28 (×3), or 2026-08-06 (D1–D7) mentions gold. |
| **d4** | The absence of gold does not violate the cine colour contract — the contract is **permissive**, not mandatory, on gold. What is unruled is the **ban**. | **DRIFT (scope: the prohibition only)** | `mikage-cine-color-contract.md:69–74` — "**Only on** Kintsugi seams" (a restriction on where gold may appear, not a requirement that it appear). A dispatch brief narrowed a locked operator contract without a ruling. **Second, separate fact:** the operator accepted the CE15 visual on 2026-08-06 (`…OPERATOR_RULING.md` D1=A) and issued the canon lock. That acceptance is recorded here as a later fact and is **not** treated as retroactive authority for d3. |

---

## B. "IMMUTABLE SHAPE" — item by item

| Item | Survived in CE15? | **VERDICT** | Authority · date |
|---|---|---|---|
| **straight** | **YES** | **RULED** (consistent, never challenged) | `MIKAGE_ZENITH_CANON_V2.md:129` — "**Absolutely straight** (zero curvature)", LOCKED 2026-03-19 |
| **point-down** | **PARTIAL** — the vertical / point-downward *orientation* survived; the *point itself* was removed | **RULED** | `SPEC_V1.md:113` — V0.15 ruling item 6, 2026-07-24 ("Blade giữ vị trí dọc sát hông Mikage"); `SPEC_V1.md:150` — BRUTALIST CONVERGENCE item 4, 2026-07-28 ("lower termination must be flat-cut or blunt mechanical, not pointed") |
| **single core node** | **YES** in count and hue; geometry and placement changed | **RULED** | `SPEC_V1.md:111` (V0.15 item 4, 2026-07-24) · `SPEC_V1.md:133` (ORIGINAL FORM item 7, 2026-07-28) · D7 (2026-08-06) |
| **grip ring** | **NO — dropped** | **RULED** | `SPEC_V1.md:81, 84` (2026-06-02, predates V0.1) · `SPEC_V1.md:134` (ORIGINAL FORM item 8, 2026-07-28 — explicit disposition of the ring) |
| **not-a-katana** | **YES** | **RULED** (predates V0.1) | `MIKAGE_ZENITH_CANON_V2.md:155–159` (2026-03-19) · `SPEC_V1.md:68` — "Forbidden drift (ALL phases): curved katana, thin elegant blade…" (2026-06-02) |

---

## C. Process-level findings (about the record, not about any feature)

| # | Finding | **VERDICT** | Evidence |
|---|---|---|---|
| **P1** | The V0.1 cine lineage was **never dispositioned** in the design record. `assets/keyart/blade/` is git-tracked but cited by zero design/canon/build documents. It is absent from `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md`, `ZENITH_BLADE_DESIGN_BIBLE_V1.md`, and the Design DNA §REJECTED list (which does name Slab V0.1/V0.1.1, V0.42, V0.29–V0.40, CE10, CE11, CE14). | **DRIFT** (process) | Repo-wide grep for `keyart/blade`, `BLADE_V0.1`, `MIKAGE_ZENITH_BLADE_LOCKED_4x5`, `BLADE_3D_INSPECT` returns only `.claude/settings.local.json` entries from this audit session — no design-document reference. `ZENITH_BLADE_DESIGN_DNA.md:72` |
| **P2** | V0.1 **self-declared "LOCKED"** with no lock document: the filename, the poster, and the viewer header (`V0.1 · LOCKED`) all assert it. | **DRIFT** | `MIKAGE_BLADE_3D_INSPECT.html:42`; filename `MIKAGE_ZENITH_BLADE_LOCKED_4x5.png`. No corresponding operator lock document exists. |
| **P3** | Seventeen V0.1 derivative media files (turntable, 2D→3D build, WAKE lyric videos EN/JP, inspect showcases) exist in the external `BLADE_V0.1/` folder. Their publication status is not recorded anywhere in the repo. | **UNCONFIRMED** | `…Studio OS\BLADE_V0.1\` directory listing, all mtime 2026-06-28. `docs/MIKAGE_SESSION_LESSONS.md:257–272` describes them but records no publication disposition. |
| **P4** | Two same-day operator rulings on 2026-07-28 point in opposite directions on the pointed tip; the second explicitly supersedes the first, but both remain in the same file in reading order. | **RULED** (correctly resolved on paper) | `SPEC_V1.md:123–139` then `:141–161`. Independently flagged as a misread risk by `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md` topic C. |
| **P5** | `OFFICIAL_VISUAL_BOUNDARY`, named in the audit brief as a locked-era document, does not exist on disk. | **UNCONFIRMED — document absent** | Repo-wide search (excluding `.git`, `node_modules`) returns no file of that name or variant. |
| **P6** | `_DISPATCH_56_BLADE_HELPERS`, named in the audit brief, does not exist as a path, file, or directory. Nearest match: `MIKAGE_ZENITH_BLADE_HANDOFF_PACKAGE_V0_56`. | **UNCONFIRMED** | `find` over the repo returns no `*DISPATCH_56*` path. |
| **P7** | CANON_V2's "Orbital Logic UI text wrapping blade in 3D" and "Rotating Enso core at hilt" are absent from CE15. The SPEC_V1 banner supersedes the *red* Orbital-Logic UI as part of the colour reversal, but no ruling drops either feature. | **UNCONFIRMED** | `MIKAGE_ZENITH_CANON_V2.md:148, 152`; `SPEC_V1.md:5–14`. No later ruling found addressing them. |

---

## D. Verdict tally

| Verdict | Count | Items |
|---|---|---|
| **RULED** | 11 | deltas a, b, c, e, f · IMMUTABLE-SHAPE items straight, point-down, single core node, grip ring, not-a-katana · process P4 |
| **DRIFT** | 3 | d3 / d4 (gold prohibition — one finding, two scopes) · P1 (V0.1 never dispositioned) · P2 (self-declared lock) |
| **UNCONFIRMED** | 5 | delta g (the list as a document) · P3 · P5 · P6 · P7 |
| **PREMISE CORRECTED** | 1 | d1 — the MAT_C2 "gold tip" |
| **VERIFIED (supporting)** | 1 | d2 — gold never entered the built lineage |

---

*End of ZENITH_BLADE_DELTA_TABLE_01. This table records authority, not preference. No design
recommendation is made or implied. No canon approval, no asset lock, no PASS, no production-ready
claim. No commit, no push.*
