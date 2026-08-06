# ZENITH BLADE — FINAL DESIGN BOARD BUILD SPEC

**Date:** 2026-08-06 · **Authority:** [ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md](ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md)
**Form basis:** CE15 (D1 = A) · **Camera policy:** ortho technical + HERO_E1 85 mm hero only (D5 = C)

This is the exact build instruction for the future board. **No render has been produced by this task.** Panels marked *NEW RENDER REQUIRED* cannot be built from existing evidence.

**Standing constraint:** all renders must come from the CE15 form asset consumed by **link/reference** — never by editing or overwriting it ([handoff contract](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md)).

---

## Panel index

| # | Panel | Existing evidence usable? | New render eventually required? |
|---|---|---|---|
| 1 | Main hero — 85 mm | ✗ (form yes, camera no) | **YES** |
| 2 | Front orthographic | ✓ | No |
| 3 | Side orthographic | ✓ | No |
| 4 | Rear 3/4 | ✓ | No |
| 5 | Silhouette 64 / 128 px | ✓ | No |
| 6 | P1 / P2 / P3 state strip | ✓ (assembly needed) | No |
| 7 | Core / spine section | ✗ **MISSING EVIDENCE** | **YES** |
| 8 | Exploded load-path diagram | ✗ **MISSING EVIDENCE** | **YES** + diagram work |
| 9 | Material palette | Partial | Optional (swatch card can be drawn) |
| 10 | Chassis callout | ✓ (annotation needed) | No |
| 11 | Scale / dimension | ✗ **MISSING EVIDENCE** | **YES** + reconciliation |
| 12 | Rig-integration handoff | ✓ (text/diagram) | No |
| 13 | Canon status & unresolved evidence | ✓ (text) | No |

---

### PANEL 1 — MAIN HERO (85 mm, CE15 form)
- **Source file:** `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend` (link/reference only)
- **Camera / view:** 85 mm **perspective**, three-quarter hero, P3. AgX Medium High Contrast, −0.35 EV, background `#050508` (HERO_E1 camera language per D5 = C).
- **Crop:** full weapon, hero framing, generous headroom for the violet core to read.
- **Label:** `ZENITH BLADE — P3 OVERDRIVE — HERO (CE15 form / HERO_E1 camera language)`
- **Existing evidence usable?** **NO.** `…/pass_03/HC_hero_P3.png` shows the correct CE15 form but was rendered with an **orthographic** camera (`mkortho('H', …)` in `run_cohesion01.py` line 275). D5 mandates 85 mm perspective for this plate.
- **New render required?** **YES** — this is the single most important outstanding render.
- *Interim:* `HC_hero_P3.png` may be used as a placeholder, clearly captioned "ortho placeholder — 85 mm hero pending."

### PANEL 2 — FRONT ORTHOGRAPHIC
- **Source:** `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/pass_03/HC_front_P3.png`
- **Camera / view:** orthographic front, P3 (already ortho — `mkortho('F', (0,−7,0))`)
- **Crop:** content bounding box + ~5 % margin
- **Label:** `FRONT — ORTHOGRAPHIC — P3`
- **Usable?** ✓ **Yes, directly.** · **New render?** No.

### PANEL 3 — SIDE ORTHOGRAPHIC
- **Source:** `…/pass_03/HC_side_P3.png`
- **Camera / view:** orthographic side, P3 (`mkortho('S', (7,0,0))`)
- **Crop:** content bbox + ~5 % margin
- **Label:** `SIDE — ORTHOGRAPHIC — P3`
- **Usable?** ✓ **Yes, directly.** · **New render?** No.

### PANEL 4 — REAR 3/4
- **Source:** `…/pass_03/HC_rear34_P3.png`
- **Camera / view:** orthographic rear three-quarter, P3 (`mkortho('R', (−4.0, 5.6, 0.8))`)
- **Crop:** content bbox + ~5 % margin
- **Label:** `REAR 3/4 — P3`
- **Usable?** ✓ **Yes, directly.** — **NOT missing evidence.** A rear 3/4 render exists in the CE15 set (verified 2026-08-06). It is orthographic, consistent with D5's technical-view policy.
- **New render?** No.

### PANEL 5 — SILHOUETTE 64 px / 128 px
- **Source:** `…/pass_03/SIL_ce15_064.png` · `…/pass_03/SIL_ce15_128.png`
- **Camera / view:** deterministic front ortho alpha mask, P3
- **Crop:** none — present at native pixel size, nearest-neighbour upscale for legibility
- **Label:** `SILHOUETTE — 64 px / 128 px — deviation 0 px beyond anti-alias vs CE14 baseline`
- **Usable?** ✓ **Yes, directly.** · **New render?** No.
- *Caveat to print:* CE12 has **no** alpha silhouette mask — `_tmp/zenith_blade_hero_e1_ce12/silhouette_fusion01/pass_01/SF_sil_64.png` and `SF_sil_128.png` are thumbnail-scale **colour renders** (RGB, 128×72), not masks. The CE12↔CE13 0 px comparison cannot be re-displayed from retained artifacts.

### PANEL 6 — P1 / P2 / P3 STATE STRIP
- **Sources:** `…/pass_03/HC_authored_P1.png` · `HC_authored_P2.png` · `HC_authored_P3.png` (authored-light, 1920×1080 each)
- **Alternate:** `…/pass_03/HC_reveal_strip.png` (5-frame reveal, hero angle, pre-assembled)
- **Camera / view:** authored hero-front light rig; frames 1 / 31 / 61
- **Crop:** content bbox per phase, uniform scale across the three
- **Label:** `P1 COMPACT-IDLE (core OFF) · P2 ACTIVATION (core OFF) · P3 OVERDRIVE (single violet core ON)`
- **Usable?** ✓ Yes — but the three are **separate files**; a single strip must be **assembled** (composite only, no re-render).
- **New render?** No.

### PANEL 7 — CORE / SPINE SECTION
- **Source:** ❌ **MISSING EVIDENCE**
- **Nearest existing:** `…/pass_03/HC_core_closeup.png` — a 120 mm closeup, **not** a section cut. Also `_tmp/zenith_blade_hero_e1_ce01/interface01/INTERFACE01_P1_SIDE_CROSS_SECTIONS.svg` — a **diagnostic Y-extent bar chart** from the CE01 interface study, **not** a geometric cross-section, and it predates the CE08 spine-notch fix (wrong lineage stage, P1 not P3). Neither is usable.
- **Camera / view when built:** orthographic side, clipped/boolean section through the central slot at the core plane, P3.
- **Label:** `CORE & SPINE — SECTION — P3 (spine notch restoring core visibility)`
- **New render required?** **YES.** A true section render does not exist in either lineage.

### PANEL 8 — EXPLODED LOAD-PATH DIAGRAM
- **Source:** ❌ **MISSING EVIDENCE** — none exists in either lineage.
- **Must depict** the D2 = C unified definition: *central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars as load-transition modules.*
- **Camera / view when built:** orthographic three-quarter, components separated along the load axis.
- **Label:** `LOAD PATH — EXPLODED (unified chassis definition, operator ruling 2026-08-06)`
- **New render required?** **YES**, plus annotation/diagram work (arrows, component names, load-direction callouts).

### PANEL 9 — MATERIAL PALETTE
- **Values (all from built evidence; provenance preserved — do not merge the two arcs):**

| Swatch | Value | Provenance |
|---|---|---|
| Void background | `#050508` | `HERO_E1_QA_REPORT.json`; `LIGHT_D3_PROOF.md` (measured) |
| Porcelain / B4C | **`#F2EEEA`** — authoritative (D3 = B) | `MAT_C1_PROOF.md` / `MAT_C3_PROOF.md` |
| Core violet | **`#8F00FF`** — P3 only, single core (D7) | `SPEC_V1.md` banner |
| Z-Blue graphite | `#4B5866` | `MAT_C1_PROOF.md` |
| Sumi coated metal | `#252321` | `MAT_C1_PROOF.md` |
| Violet-black inset | `#120A18` | `MAT_C1_PROOF.md` |
| Dark titanium | linear `(0.035, 0.045, 0.065)` · metallic 0.82 · roughness 0.40 | `MATERIAL_FINALING_V0_29_PROOF.md` |
| Cold-steel rails | linear `(0.12, 0.16, 0.22)` · metallic 0.95 · roughness 0.20 | `MATERIAL_FINALING_V0_29_PROOF.md` |
| P3 core emission | `(0.278, 0.0, 1.0)` · strength 0.90 | `MATERIAL_FINALING_V0_29_PROOF.md` |

- **Existing image:** `_tmp/zenith_blade_design_bible/decision_images/D3_PORCELAIN_CHIPS.png` (porcelain options only)
- **Usable?** Partial — values are documented; a full swatch card must be drawn.
- **New render?** Not required (swatches are drawn, not rendered). Optionally add a material-response closeup from `…/pass_03/HC_transition_closeup.png`.
- ⚠ **Print this caveat:** the MAT_C arc (hex) and the V0.29 arc (linear RGB) are **NOT reconciled** for graphite/titanium/steel. D3 ruled porcelain only.

### PANEL 10 — CHASSIS CALLOUT
- **Sources:** `…/pass_03/HC_wireframe_material_proof.png` (topology over shaded material) · `…/pass_03/HC_grayscale_value_P3.png` (form read without material distraction)
- **Camera / view:** existing ortho three-quarter, P3
- **Crop:** full weapon
- **Label / callout text (verbatim, D2 = C):** *"Central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars are load-transition modules."*
- **Usable?** ✓ Yes — annotation layer only, no re-render. · **New render?** No.

### PANEL 11 — SCALE / DIMENSION
- **Source:** ❌ **MISSING EVIDENCE** — no scale-vs-human image exists in either lineage.
- **Documented values:** blade/actor height ratio **0.684273** (range 0.670–0.698) — `FORM_A1_PROOF.md`; human-scale factor **0.2452706705**, blade length **1.2 m** — `EDGE_B1_PROOF.md`.
- ⚠ **NOT VERIFIED:** canon's "Length: 35–58 inches" (`MIKAGE_ZENITH_CANON_V2.md` §2.4) has never been cross-checked against the built 1.2 m. **Reconcile before printing any dimension figure.**
- **Camera / view when built:** orthographic side, weapon beside a 1.75 m human reference silhouette, shared scale.
- **Label:** `SCALE — blade : actor height = 0.684273 (±2 %) — dimensions NOT VERIFIED against canon inch range`
- **New render required?** **YES**, plus the dimension reconciliation.

### PANEL 12 — RIG-INTEGRATION HANDOFF
- **Sources (documents, not images):** `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md` · `…_DOCKING_LOAD_PATH_V0_65_PROOF.md` · `…_INTEGRATION_PATTERN_V0_37.md` · [handoff contract](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md)
- **Optional image:** `…/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_CONTACT_SHEET.png`
- **Label:** `RIG INTEGRATION — V0.89 actor asset — LINKED, NOT MERGED`
- **Must state explicitly:** geometry is **not** merged; CE15 is consumed by link/reference; V0.89's 0-overlap 8-pose result was proven against the **previous** weapon form and is **NOT VERIFIED** for CE15.
- **Usable?** ✓ Yes (text/diagram). · **New render?** No.

### PANEL 13 — CANON STATUS & UNRESOLVED EVIDENCE
- **Source:** [ZENITH_BLADE_DESIGN_BIBLE_V1.md](ZENITH_BLADE_DESIGN_BIBLE_V1.md) §14–§16; [ruling](ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md) gap table
- **Must print, verbatim in spirit:**
  - CE15 = **visual-form authority**, **NOT** a production asset lock.
  - No asset lock or production-ready status is in force anywhere in the project.
  - CE15 ↔ actor collision: **NOT VERIFIED**.
  - Physical volume: **NOT VERIFIED** (BVH triangle-overlap evidence only).
  - Canon-authority conflict (Control Map vs Blade Spec): **OPEN**.
  - Material arcs (MAT_C vs V0.29) for graphite/titanium/steel: **NOT RECONCILED**.
  - Dimension reconciliation: **NOT VERIFIED**.
- **Usable?** ✓ Yes (text). · **New render?** No.

---

## Build order (recommended)

1. Assemble panels 2, 3, 4, 5, 6, 10, 12, 13 — **buildable today from existing evidence.**
2. Draw panel 9 swatch card (with the non-reconciliation caveat).
3. Commission the four outstanding renders/diagrams: **1** (85 mm hero), **7** (core/spine section), **8** (exploded load path), **11** (scale/dimension).
4. Do **not** print any dimension figure until the canon-inches ↔ built-metres reconciliation is closed.
