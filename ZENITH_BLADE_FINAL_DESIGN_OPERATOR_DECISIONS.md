# ZENITH BLADE — FINAL DESIGN BOARD OPERATOR DECISION PACKAGE

**Purpose:** resolve every blocker standing between today's evidence and a buildable Final Design Board.
**Nothing here is a recommendation.** Each decision presents options with the evidence behind them. Nothing is chosen automatically. CE15 is **not** declared final.

**Read-only:** no Blender opened, no geometry created, no image rendered, no canon document edited.
Comparison sheets below are crop/scale composites of **existing** renders only.

Sources: `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md` · `ZENITH_BLADE_DESIGN_BIBLE_DRAFT.md` · `ZENITH_BLADE_FINAL_DESIGN_BOARD_BRIEF.md` · `ZENITH_BLADE_DESIGN_EVOLUTION_CONTACT_SHEET.png` · CE15 pass_03 renders · HERO_E1 technical proof renders.

---

# D1 — FINAL FORM BASIS

### Images
- `_tmp/zenith_blade_design_bible/decision_images/D1_FRONT_P3_CE12_CE13_CE15.png`
- `_tmp/zenith_blade_design_bible/decision_images/D1_HERO34_P3_CE12_CE13_CE15.png`
- `_tmp/zenith_blade_design_bible/decision_images/D1_SILHOUETTE_64_128_CE12_CE13_CE15.png`

### Differences only

| | CE12 — silhouette fusion | CE13 — final-form polish | CE15 — cohesion correction |
|---|---|---|---|
| **Silhouette** | The accepted reference. All later work is measured against it. | Identical — 0 px deviation @64/128 | Identical — 0 px beyond anti-alias @64/128 |
| **Seam hierarchy** | Contiguous adjacent lames, evenly spaced | Unchanged spacing; angle-limited bevels added to seam edges | **Rebuilt**: one dominant compression seam; secondary seams closed to ~1 mm hairlines, made oblique; seam bevel-rims suppressed (0.06) vs dominant (0.50) |
| **Porcelain mass** | Value-graded lames (edge/mid/root), flat faces | Crowned faces + satin finish + micro-grain | Continuity swell crossing lame boundaries → reads as one pressure-formed shell rather than stacked plates |
| **Graphite integration** | Right-side brace beside the porcelain | Titanium response (metallic 0.78, anisotropic) | Chassis given compound curvature on the same load axis + seating recess where porcelain roots land; rear mirror-highlight broken |
| **Upper termination** | Inherited stack (hub + shoulders + neck at differing depths) | Unchanged | Shoulder fronts aligned to hub plane, collar bulge added, dedicated matte cap material → one dark collar |
| **Lower termination** | Inherited scaffold-like tail cluster | Unchanged | Tail parts front-aligned to a single consolidated plane |

**Status of each:** CE12 and CE13 were accepted in this session's conversation (no standalone written ruling document exists in either folder). CE15 is `HERO_COHESION_VISUAL_CANDIDATE` — **never ruled**.

### ☐ A — CE15 becomes the final visual-form basis
### ☐ B — CE13/CE12 remains the basis; CE15 is rejected
### ☐ C — Hybrid basis — specify exactly which parts come from which candidate:
```
Silhouette from: ______   Seam hierarchy from: ______   Porcelain treatment from: ______
Graphite/chassis from: ______   Upper termination from: ______   Lower termination from: ______
```

---

# D2 — CHASSIS DEFINITION

Two structural descriptions exist in the project. No document cross-references them. They may be the same object described twice, or two different designs.

**Evidence for A** — `production/character/reviews/MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25_PROOF.md`:
> "Four-shell connected-seam definition: PASS."
> "Central spine and paired recessed-rail depth definition: PASS."
> "Upper hydraulic drive-hub definition: PASS."
> "Lower Flux-Pinning base definition: PASS."
> "Joint-collar/load-transition definition: PASS."

**Evidence for B** — `_tmp/zenith_blade_hero_e1_ce09/architecture03_rebuild/run_arch03_rebuild.py` (the build script for the architecture all CE12→CE15 work descends from):
> line 3: `# weapon: dominant 3D chassis, asymmetric imbricated armor mounted proud, bounded REVEAL,`
> line 98–102: `def left_lobe(): ...` / `def right_lobe(): ...`
> line 43: `Z_LOBE_TOP=1.70` · slot half-width variable `SLOT` · `def build_chassis()` assembles `left_lobe`, `right_lobe`, `base_bridge`

### ☐ A — Spine + paired rails + hub + Flux-Pinning base + collars
### ☐ B — Two-lobe chassis + central slot
### ☐ C — Same system, one unified final description: ______________________________

---

# D3 — PORCELAIN COLOUR

### Image
`_tmp/zenith_blade_design_bible/decision_images/D3_PORCELAIN_CHIPS.png` — neutral sRGB swatches drawn from the two documented hex values. No material was read from or written to any .blend.

| Option | Source |
|---|---|
| **`#FAFAFA`** | `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1 — "outer = B4C porcelain shell (white #FAFAFA...)" |
| **`#F2EEEA`** | `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C1_PROOF.md` / `MAT_C3_PROOF.md` — as actually built |

The only authorization found for `#F2EEEA` is scoped explicitly to **"the Mikage shell"** (the character's body), not the weapon — `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md`, scope note 2026-07-21.

### ☐ A — `#FAFAFA` (weapon reverts to written spec)
### ☐ B — `#F2EEEA` (weapon formally adopts the built value, matching the entity shell)

---

# D4 — GEOMETRY / RIG LINEAGE

Two arcs exist with no cross-reference between them:
- **CE01–CE15** (this session) — weapon form. Branches from `MIKAGE_ZENITH_BLADE_HERO_E1.blend` @ commit `eb30157`. Carries the accepted silhouette + core-visibility fix. **No actor rig, no docking, no collision-with-actor solution.**
- **V0.13–V0.89** (production) — actor integration. Carries pelvis docking load path, chain-5 grip IK, collision ownership, and the mitten-interface fix (`INTEGRATION_READY: YES`, awaiting operator ruling). **Its weapon form was revoked at V0.41 ("opening box").**

### Consequences

**☐ A — CE15 geometry authoritative; V0.13–V0.89 rig ported onto it**
- Keeps the accepted silhouette, core-visibility fix, and cohesion work.
- Re-does: pelvis docking anchor, chain-5 grip IK, collision ownership classification, mitten-interface clearance — all against new geometry; the V0.89 zero-overlap result does **not** transfer and must be re-proven.
- Risk: the 216-triangle mitten/shell overlap class of defect can reappear on the new shell shape.

**☐ B — V0.89 integrated actor asset authoritative; CE15 form transferred onto it**
- Keeps a working, collision-clean actor integration.
- Re-does: the entire CE12→CE15 form lineage must be rebuilt inside a file whose weapon form was already revoked once for visual nonconformance; silhouette locks would need re-verification from scratch.
- Risk: re-importing the revoked "opening box" lineage's structure alongside the new form.

**☐ C — Separate weapon asset + actor-integration asset, formal handoff boundary**
- Each side keeps its own gates; matches the existing `INTEGRATION_PATTERN_V0_37` precedent (link-preferred consumption, never overwrite the parent).
- Cost: a handoff contract must be written and maintained; two files must be kept in sync; every form change requires a re-link + re-validation cycle.

---

# D5 — FINAL BOARD CAMERA

| Option | Evidence |
|---|---|
| **A — HERO_E1** | `MIKAGE_ZENITH_BLADE_HERO_E1_QA_REPORT.json`: "85mm lens, AgX Medium High Contrast, -0.35EV, bg #050508". 8/8 technical gates PASS. Note: HERO_E1 itself was **never operator-visually-approved** — "Final visual approval pending operator." |
| **B — CE15 authored camera** | This session's ortho hero/front/side + authored-light rig; same AgX / −0.35 EV colour management; not confirmed identical lens/framing to HERO_E1. |
| **C — Ortho technical views + HERO_E1 85mm hero only** | Uses ortho for the measurable panels (front/side/silhouette/dimensions) and reserves the 85mm perspective for the single hero plate. |

### ☐ A ☐ B ☐ C

---

# D6 — FLUX-PINNING MOTION

Canon states the mechanism — `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1:
> "Linkage: Flux Pinning (Ghim từ thông) protocol, maintaining a 0.5 mm micro-vibration at the magnetic joint points."

It is **not known** whether this is still active in the CE12→CE15 geometry. The elaborate staged reveal tested in CE11 (LOCK→RELEASE→TRAVEL→LATCH) was rejected for visual reasons, and no document records whether the micro-vibration survived, was simplified, or was dropped.

### ☐ A — Retain explicit 0.5 mm micro-vibration (must be visible/measurable in motion)
### ☐ B — Retain concept in canon; do not visualise vibration in renders
### ☐ C — Remove from current implementation pending a later mechanism design pass

---

# D7 — CORE COLOUR DOCUMENT AMENDMENT

**Confirmation of the authoritative value.** `#8F00FF` electric violet is the current weapon core/seam signal, P3-only, single core, red banned at every phase:
> "the Zenith Blade core/seam signal is **electric violet, `#8F00FF` family**... Red/crimson is **BANNED** on this weapon at every phase." — `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md`, header banner, operator ruling 2026-07-06/07

Every technical gate in the current lineage enforces it (P1/P2 violet = 0; P3 violet ROI ≥ 2500; global ≤ 5%).

### Documents still carrying weapon-attached crimson — verified by line, **not edited**

**Already self-amended (banner present, no action strictly required):**

| Document | Line | Coverage |
|---|---|---|
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | 51, 63, 83 | Banner at line 6 explicitly covers "every reference in this document to a red/crimson `#E60000` weapon core" ✅ |
| `docs/handoff/MIKAGE_ZENITH_ENTITY_PHASE_SPEC_V1.md` | 38 | Scope note lines 6–8 explicitly names "the §0.5 P3 row 'core #E60000 max'" ✅ |

**Require an addendum — no override banner exists in these files:**

| # | Document | Line | Exact text |
|---|---|---|---|
| 1 | `docs/handoff/MIKAGE_ZENITH_STRUCTURE_APPROVAL_AND_LOCK_READINESS_20260602.md` | 15 | `P3 | Tri-Phase Final / Overdrive (core #E60000 max, ...)` — inside a table stamped **operator-approved / ABSOLUTE INVARIANT** |
| 2 | ″ | 22 | "Inner = black rusty Titanium load-bearing frame + Ferro-calcium core (**#E60000**), exposed when the shell splits (P2/P3)." |
| 3 | `MIKAGE_ZENITH_CANON_V2.md` | 145 | "Deep crimson glowing core (**#E60000**)" — §2.4 WEAPON. The file's top note (line 10) is **brand-palette-scoped** and states non-colour weapon content "vẫn hiệu lực", so it does **not** clearly amend this line |
| 4 | `docs/handoff/MIKAGE_ZENITH_BLADE_DRIVE_AUDIT_RECONCILIATION_20260601.md` | 45 | "black rusty Ti plates FLOATING around a red-hot Ferro-calcium core (**#E60000**)" |
| 5 | `docs/handoff/MIKAGE_ZENITH_BLADE_ACCEPTED_REFERENCE_CONTACT_SHEET_V1.md` | 76 | "Brutal Ti frame + red **#E60000** core + hilt glow, on-spec." |
| 6 | `docs/handoff/MIKAGE_ZENITH_BLADE_OPERATOR_RULING_20260601.md` | 18 | "ST4 Combat — Thermal Overload — slab + crimson **#E60000** core + heat" |

*Not listed:* files where `#E60000` refers to the **entity** (quantum blood, kintsugi seams, Ensō ring) — that crimson remains valid canon and needs no change.

### ☐ Confirmed: `#8F00FF` is authoritative; issue addenda to documents 1–6 above
### ☐ Confirmed with amendments to a different list: ______________________________

---

# OPERATOR RULING

```
D1 FINAL FORM BASIS ........... ☐ A   ☐ B   ☐ C     notes: ______________________________

D2 CHASSIS DEFINITION ......... ☐ A   ☐ B   ☐ C     notes: ______________________________

D3 PORCELAIN COLOUR ........... ☐ A   ☐ B            notes: ______________________________

D4 GEOMETRY / RIG LINEAGE ..... ☐ A   ☐ B   ☐ C     notes: ______________________________

D5 FINAL BOARD CAMERA ......... ☐ A   ☐ B   ☐ C     notes: ______________________________

D6 FLUX-PINNING MOTION ........ ☐ A   ☐ B   ☐ C     notes: ______________________________

D7 CORE COLOUR AMENDMENT ...... ☐ confirmed  ☐ amended list

RULED BY: ______________________     DATE: ______________________

ADDITIONAL DIRECTION:
______________________________________________________________________________
______________________________________________________________________________
```

---

## Evidence gaps affecting these decisions

1. **CE12 has no alpha silhouette mask.** Its `SF_sil_64/128.png` files are thumbnail-scale **colour renders** (RGB, 128×72), not masks. Only CE13 and CE15 produced true alpha silhouette proofs — shown labelled as such in the D1 silhouette sheet. A CE12-vs-CE13 pixel comparison was performed at the time (reported 0 px), but the CE12-side mask artifact was not retained.
2. **CE12 and CE13 have no standalone written ruling documents.** Their acceptance exists only in this session's conversation record; CE13's own report self-states `FINAL_FORM_VISUAL_CANDIDATE` / "Awaiting operator final ruling."
3. **No rear 3/4, no exploded load-path diagram, no core/spine section, no scale-vs-human image** exists in either lineage (see `ZENITH_BLADE_FINAL_DESIGN_BOARD_BRIEF.md` panels #4, #7, #8, #13).
4. **Dimension reconciliation absent** — canon's "35–58 inches" vs the built 1.2 m has never been explicitly cross-checked in any document.
