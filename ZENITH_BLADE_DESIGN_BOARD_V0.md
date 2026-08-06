# ZENITH BLADE — DESIGN BOARD V0 (panel index)

**Assembled:** 2026-08-06 · **Image:** `ZENITH_BLADE_DESIGN_BOARD_V0.png` (3400 × 5140)
**Built per:** [ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md)
**Form basis:** CE15 (operator ruling D1=A, 2026-08-06) · **Camera policy:** D5=C

> **PARTIAL BOARD — V0. NOT the final board. NOT V1.**
> Composite/annotation only, from files already on disk. **No render was produced.** No imagery was faked, upscaled, regenerated or substituted.
> **NOT a canon approval · NOT an asset lock · NOT production-ready.**

---

## Panel status

| # | Panel | State | Source(s) |
|---|---|---|---|
| 1 | Main hero (85 mm) | ⏳ **PENDING RENDER** (#1 of 4) | — |
| 2 | Front orthographic | ✅ Built | `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/pass_03/HC_front_P3.png` |
| 3 | Side orthographic | ✅ Built | `…/pass_03/HC_side_P3.png` |
| 4 | Rear 3/4 | ✅ Built | `…/pass_03/HC_rear34_P3.png` |
| 5 | Silhouette 64 / 128 px | ✅ Built | `…/pass_03/SIL_ce15_064.png` · `…/pass_03/SIL_ce15_128.png` |
| 6 | P1 / P2 / P3 state strip | ✅ Built (assembled) | `…/pass_03/HC_authored_P1.png` · `HC_authored_P2.png` · `HC_authored_P3.png` |
| 7 | Core / spine section | ⏳ **PENDING RENDER** (#2 of 4) | — |
| 8 | Exploded load-path | ⏳ **PENDING RENDER** (#3 of 4, + diagram work) | — |
| 9 | Material palette | ⚠ **DEFERRED — not in V0 build list; requires NO render** | values documented (see below) |
| 10 | Chassis callout | ✅ Built | `…/pass_03/HC_wireframe_material_proof.png` |
| 11 | Scale / dimension | ⏳ **PENDING RENDER** (#4 of 4) | — |
| 12 | Rig integration handoff | ✅ Built | `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_CONTACT_SHEET.png` |
| 13 | Canon status & unresolved evidence | ✅ Built (text) | — |

**Built: 8 · Pending render: 4 · Deferred: 1**

### Note on panel 9 (scope)
Panel 9 was **not** in the authorised V0 build list (2, 3, 4, 5, 6, 10, 12, 13) and it does **not** require any of the four outstanding renders — the build spec states swatches are *drawn*, not rendered. It is therefore rendered on the board as an explicitly-labelled **DEFERRED** slot showing the documented values, **not** as "PENDING RENDER" (which would misstate what it needs). Building the full swatch card is a one-line scope extension the operator can authorise. **UNCONFIRMED** whether it was intended for V0.

---

## The four outstanding renders (blocking panels 1, 7, 8, 11)

| # | Render | Spec (from build spec) |
|---|---|---|
| 1 | **85 mm perspective hero on CE15 form** | 85 mm perspective, three-quarter hero, P3. AgX Medium High Contrast, −0.35 EV, background `#050508`. CE15's existing hero renders are **orthographic** (`mkortho('H', …)`, `run_cohesion01.py:275`) — D5=C requires 85 mm perspective. |
| 2 | **Core / spine section** | Orthographic side, clipped/boolean section through the central slot at the core plane, P3. Nearest existing artifact is a 120 mm **closeup**, not a section; the CE01 cross-section SVG is a diagnostic bar chart from a pre-spine-notch P1 stage — not usable. |
| 3 | **Exploded load-path diagram** | Orthographic three-quarter, components separated along the load axis, plus annotation (arrows, component names, load direction). Must depict the D2=C unified chassis definition. None exists in either lineage. |
| 4 | **Scale / dimension** | Orthographic side, weapon beside a 1.75 m human reference silhouette at shared scale. **Do not print any dimension figure until the canon-inches ↔ built-metres reconciliation is closed.** |

---

## Material values shown on panel 9 (documented, not merged)

| Swatch | Value | Provenance |
|---|---|---|
| Void background | `#050508` | `HERO_E1_QA_REPORT.json` |
| Porcelain / B4C | **`#F2EEEA`** — authoritative (D3=B) | `MAT_C1_PROOF.md` / `MAT_C3_PROOF.md` |
| Core violet | **`#8F00FF`** — P3 only, single core (D7) | `MIKAGE_ZENITH_BLADE_SPEC_V1.md` banner |
| Z-Blue graphite | `#4B5866` | `MAT_C1_PROOF.md` |
| Sumi coated metal | `#252321` | `MAT_C1_PROOF.md` |
| Violet-black inset | `#120A18` | `MAT_C1_PROOF.md` |

⚠ **NOT RECONCILED** — the MAT_C arc (hex, above) and the V0.29 arc (linear RGB: dark titanium `(0.035,0.045,0.065)` met 0.82 rough 0.40; cold steel `(0.12,0.16,0.22)` met 0.95 rough 0.20; core emission `(0.278,0,1.0)` str 0.90) are separate value sets. **D3 ruled porcelain ONLY.**

---

## Canon status (panel 13) — carried verbatim, nothing reconciled, merged or dropped

**Status**
- CE15 = **VISUAL-FORM AUTHORITY** (operator ruling D1=A, 2026-08-06)
- CE15 is **NOT** a production asset lock
- No asset lock or production-ready status is in force anywhere in the project
- The single historical grant (V0.33) was revoked by V0.41

**MISSING EVIDENCE / NOT VERIFIED**
- CE15 ↔ actor collision/clearance — **NOT VERIFIED** (V0.89's 0-overlap 8-pose result was proven against the previous form)
- Core/spine section render — **MISSING** (CE01 cross-section SVG is a diagnostic bar chart, wrong lineage/phase)
- Exploded load-path diagram — **MISSING** (both lineages)
- Scale-vs-human image — **MISSING**; canon "35–58 in" vs built 1.2 m — **NOT VERIFIED**
- 85 mm perspective hero on CE15 form — does not exist (CE15 hero is orthographic)
- CE12 alpha silhouette mask — **MISSING** (its `sil` files are thumbnail colour renders)
- CE12/CE13 standalone written rulings — **MISSING** (session-record only)
- Material arcs MAT_C vs V0.29 (graphite/titanium/steel) — **NOT RECONCILED**
- Canon-authority promotion packet — **OPEN / PENDING**
- `PHYSICAL_VOLUME_EXACT_VALUE` — **NOT VERIFIED**
