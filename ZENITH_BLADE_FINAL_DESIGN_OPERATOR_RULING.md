# ZENITH BLADE — FINAL DESIGN OPERATOR RULING

**Ruling date:** 2026-08-06
**Ruled by:** Operator (BOOS BỚP / Phi Hùng), Mikage Zenith Studio
**Recorded by:** Claude Code (documentation only — no geometry, render, or Blender action taken)
**Source decision package:** [ZENITH_BLADE_FINAL_DESIGN_OPERATOR_DECISIONS.md](ZENITH_BLADE_FINAL_DESIGN_OPERATOR_DECISIONS.md) (unmodified; this is a separate record)

---

## AUTHORITY STATEMENT

This ruling is the authoritative resolution of decisions **D1–D7** for the Zenith Blade design programme. It supersedes the "unresolved / OPERATOR RULING REQUIRED" state recorded in `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md` and `ZENITH_BLADE_DESIGN_BIBLE_DRAFT.md` **for those seven questions only**.

**Scope limits — this ruling does NOT grant:**
- ❌ production approval
- ❌ asset lock
- ❌ actor-integration completion
- ❌ physical-volume verification
- ❌ push, deploy, public release, or website use

Per the project's standing rule (`PROJECT_MODEL.md` I12): *"A machine 'technical PASS' is necessary but NOT sufficient. Final acceptance is the operator's visual ruling."* This document supplies that visual ruling for **form basis only**.

---

## DECISIONS APPLIED

### D1 — FINAL FORM BASIS = **A**
**CE15 becomes the final visual-form basis.**

- Authoritative artifact: `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend`
- SHA-256: `465B212EF49A4B8AD3EACD682757D9FE0512FA5D242C1B09611439B9C76C3129`
- Review set: `…/pass_03/` (64 files)

**Explicit status:** CE15 is the **visual-form authority**. It is **NOT** a production asset lock. It carries: the CE12-locked silhouette (0 px deviation beyond anti-alias at 64/128 px), the CE08 spine-notch core-visibility fix, CE13's surface polish, and CE15's seam-hierarchy / cross-boundary curvature / consolidated-termination corrections.

### D2 — CHASSIS DEFINITION = **C** (unified description)
The two competing descriptions are ruled to be **one system**. Authoritative wording:

> **Central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars are load-transition modules.**

This reconciles `MIKAGE_ZENITH_BLADE_CANON_MECHANICAL_DEFINITION_V0_25_PROOF.md` ("spine + paired recessed rails + hub + Flux-Pinning base + collars") with `_tmp/zenith_blade_hero_e1_ce09/architecture03_rebuild/run_arch03_rebuild.py` (`left_lobe()` / `right_lobe()` / central `SLOT`). **This is an operator ruling, not a documentary finding** — no source document previously stated the equivalence.

### D3 — PORCELAIN COLOUR = **B**
**Authoritative porcelain value = `#F2EEEA`.**
Resolves the `#FAFAFA` (spec, `MIKAGE_ZENITH_BLADE_SPEC_V1.md` §1) vs `#F2EEEA` (built, `MAT_C1_PROOF.md` / `MAT_C3_PROOF.md`) conflict in favour of the built value. The weapon's porcelain now formally matches the entity shell value.

### D4 — GEOMETRY / RIG LINEAGE = **C**
**Two linked assets, formal handoff boundary, neither overwrites the other.**

| Asset | Authority over | Path |
|---|---|---|
| **CE15** | Weapon form, silhouette, seams, materials, core behaviour | `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/…CANDIDATE.blend` |
| **V0.89** | Actor integration: docking, grip IK, collision ownership, mitten clearance | `production/character/production_actor/rig_derivatives/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend` |

Consumption is by **link/reference only**. Any future form change requires integration re-link **and** fresh validation. Full terms: [ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md).

### D5 — FINAL BOARD CAMERA = **C**
- **Orthographic** technical views for: front, side, silhouette, dimensions, callouts.
- **HERO_E1 85 mm perspective** (AgX Medium High Contrast, −0.35 EV, background `#050508`) for the **main hero plate only**.

### D6 — FLUX-PINNING MOTION = **B**
The 0.5 mm micro-vibration at the magnetic joint points is **retained in canon and in the mechanical specification**. It is **not required to be visible** in still renders or on the Final Design Board.

### D7 — CORE COLOUR AMENDMENT = **CONFIRMED**
`#8F00FF` electric violet is authoritative for the Zenith Blade core/seam signal — P3-only, exactly one core, no wash/halo/ambient/fill; red banned on the weapon at every phase.
Addenda are issued to the **six verified weapon-attached crimson references** only. **Entity crimson canon (quantum blood, kintsugi seams, Ensō ring) remains valid and unchanged.**
Amendment record: [ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md](ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md).

---

## DUAL-LINEAGE HANDOFF RULE (explicit)

1. **CE15 is weapon-form authority.** No actor rig, docking, or collision-with-actor solution lives in it.
2. **V0.89 is actor-integration authority.** Its weapon *form* is superseded by CE15; its *integration solutions* are not.
3. **Neither file may overwrite the other.** Integration consumes CE15 by link/reference, following the existing `INTEGRATION_PATTERN_V0_37` precedent (link-preferred, never overwrite parent).
4. **Any CE15 form change invalidates the prior integration validation.** A re-link plus a fresh full validation pass is mandatory before any integrated candidate may be proposed.
5. **The V0.89 zero-overlap result does not transfer to CE15 geometry.** It must be re-proven against CE15's shell shape.

---

## UNRESOLVED EVIDENCE GAPS — REMAIN OPEN AFTER THIS RULING

These were **not** ruled on and are **not** silently reconciled:

| # | Gap | Status |
|---|---|---|
| 1 | **CE15 collision/clearance against the actor is unproven.** V0.89's 0-overlap, 8-pose result was achieved against the *old* weapon form. | NOT VERIFIED |
| 2 | **CE12 has no alpha silhouette mask.** `_tmp/zenith_blade_hero_e1_ce12/silhouette_fusion01/pass_01/SF_sil_64.png` and `SF_sil_128.png` are thumbnail-scale colour renders (RGB, 128×72), not masks. The CE12↔CE13 0 px comparison was performed at the time, but the CE12-side mask artifact was not retained. | MISSING EVIDENCE |
| 3 | **CE12/CE13 have no standalone written ruling documents.** Their acceptance exists only in session conversation record; CE13's own report self-states `FINAL_FORM_VISUAL_CANDIDATE` / "Awaiting operator final ruling." | MISSING EVIDENCE |
| 4 | **No rear 3/4 orthographic, exploded load-path diagram, core/spine section, or scale-vs-human image** exists in either lineage. | MISSING EVIDENCE |
| 5 | **Dimension reconciliation absent** — canon's "Length: 35–58 inches" (`MIKAGE_ZENITH_CANON_V2.md` §2.4) vs the built 1.2 m (`EDGE_B1_PROOF.md`) was never explicitly cross-checked. | NOT VERIFIED |
| 6 | **Two material value sets are not reconciled.** MAT_C1/C3 record hex values (`#F2EEEA` porcelain, `#4B5866` Z-Blue graphite, `#252321` sumi metal, `#120A18` violet-black inset); V0.29 MATERIAL_FINALING records linear RGB (porcelain `(0.72,0.69,0.65)`, dark titanium `(0.035,0.045,0.065)`, cold steel `(0.12,0.16,0.22)`). D3 resolves *porcelain* only. The graphite/titanium/steel relationship between the two arcs is **not** ruled. | NOT VERIFIED |
| 7 | **Canon authority conflict still pending.** `docs/architecture/MIKAGE_CANON_CONTROL_MAP.md` does not list a Blade mechanics/material SSOT while `MIKAGE_ZENITH_BLADE_SPEC_V1.md` self-declares one — `MIKAGE_ZENITH_BLADE_OPERATOR_PROMOTION_PACKET_V0_1.md` remains `OPERATOR_APPROVAL: PENDING`. | CONFLICT — OPEN |
| 8 | **Physical volume / penetration** remains `PHYSICAL_VOLUME_EXACT_VALUE: NOT VERIFIED` — all collision evidence is BVH triangle-overlap based. | NOT VERIFIED |

---

## OPERATOR NOTES (as supplied)

- D1: "CE15 becomes the final visual-form basis."
- D2: "Unified definition: central load spine + paired recessed rails + two structural lobes surrounding the central P3 slot; upper hub, lower Flux-Pinning base, and collars are load-transition modules."
- D3: "Authoritative porcelain value = #F2EEEA."
- D4: "Maintain two linked assets… Use link/reference handoff. Never overwrite either source. Any future form change requires integration re-link and fresh validation."
- D5: "Use orthographic technical views for front, side, silhouette, dimensions, and callouts. Use HERO_E1 85 mm perspective only for the main hero plate."
- D6: "Retain the 0.5 mm micro-vibration in canon/mechanical specification. Do not require it to be visible in still renders or the Final Design Board."
- D7: "#8F00FF electric violet is authoritative… Issue addenda only to the six verified weapon-attached crimson references listed in D7. Do not alter entity crimson canon."

---

## DOWNSTREAM DOCUMENTS UPDATED BY THIS RULING

- [ZENITH_BLADE_DESIGN_BIBLE_V1.md](ZENITH_BLADE_DESIGN_BIBLE_V1.md) — decision-resolved promotion of the Draft Bible
- [ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md](ZENITH_BLADE_FINAL_DESIGN_BOARD_BUILD_SPEC.md) — per-panel build instruction
- [ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md](ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md) — core-colour addendum record
- [ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md](ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md) — dual-lineage contract

The original decision package and the Draft Bible are **retained unmodified** as historical record.
