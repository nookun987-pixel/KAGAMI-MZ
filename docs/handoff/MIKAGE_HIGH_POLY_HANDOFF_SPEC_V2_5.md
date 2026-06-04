# MIKAGE ZENITH — HIGH-POLY HANDOFF SPEC V2.5

> CANON_STATUS = **LOCKED_V2.5** — locked by Operator (BOOS BỚP), 2026-06-04.
> PHASE: Blockout → **High-Poly Sculpt**. EXECUTION OWNER: **Lane A / 3D pipeline** (NOT Lane B).
> This document is the vector→3D handoff brief. Lane B (this assistant) produced the locked
> SVG reference and this spec; it does **not** perform the high-poly sculpt, mesh, rig, or render.
> Source reference: `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg` (LOCKED_V2.5).

---

## 0. LANE / TOOLING BOUNDARY (read first)
High-poly sculpting, mesh generation, articulation rigging, thermal-groove modelling, and any
render are **3D-pipeline (Lane A)** tasks. They are out of scope for the Lane B SVG/vector stage
and are not executed in this file. This spec defines the targets so Lane A can sculpt from a
locked, unambiguous reference. No render / no PNG / no mesh was produced by Lane B.

## 1. LOCKED PARAMETERS (V2.5 — operator ruling 2026-06-04)

### 1.1 Tail / garment length — LOCKED: ankle-length
- The executor coat skirt / tail extends as vertical panels **down to the ankle** (Hakama-like flow).
- Intent (operator): establish an "otherworldliness" silhouette with elongated-limb read; the long
  tail also **conceals the heat-dump volumes and mechanical joint articulation** when the entity
  operates at maximum Landauer thermal-debt threshold.
- Vector status in the reference SVG: skirt extended to ankle across FRONT / SIDE / BACK / 3-4 as an
  additive blockout overlay (figure defs unchanged). Exact tail cross-section, fold count, and panel
  taper are to be finalized in the sculpt (see §4 CHUA_XAC_NHAN).

### 1.2 Head ratio — LOCKED: 7.5-head ("Realistic Tall")
- Anthropometry master = **7.5 heads**, crown→sole.
- Rationale (operator): 7.5 supports plausible gravitational load-distribution while the entity
  manipulates the 350 kg PrimeTool Zenith Blade; 7.1 risked a "blocky body" read that violates the
  AAA elongated-silhouette optimisation standard.
- Vector status: the reference SVG ruler is re-gridded to a 7.5-head guide. **Note:** the underlying
  vector figure was the V2 (~7.1) blockout; the exact 7.5-head limb elongation (legs/torso lengthened,
  head unchanged, mask undistorted) is a **sculpt target for Lane A** — do not distort the mask to hit it.

## 2. APPROVED FORM → HIGH-POLY DIRECTIVE
- Overall form: **APPROVED** by operator (records the operator's approval; Lane B does not itself
  ratify canon). Proceed Blockout → High-Poly.
- Preserve identity exactly (do NOT redesign): faceless sealed Kitsune planar mask · exactly 2 sealed
  slits (front + 3/4), none on back · no eyes/mouth/nose/skin · long heavy black hair past hip · high
  standing executor collar · closed center / center-back seam · layered vertical skirt → ankle · matte
  porcelain shell · graphene underlayer at joints · controlled violet (slit halo + 1 Ensō upper-back).

## 3. V2.5 MECHANICS TO SCULPT (Lane A)

### 3.1 Glove / finger articulation logic
- Each finger segment carries a **B4C porcelain knuckle plate**.
- Plates have a **force-dispersal slope** (chamfered leading edge) and must permit **sliding overlap**
  (telescoping plate-over-plate) when the entity performs the `execute()` command — i.e. articulation
  must close without plate interpenetration; plates ride over each other along the slope.
- Maintain the sealed mitten read at rest (no exposed fingers/nails); segmentation reveals only under
  articulation. Graphene underlayer at the wrist/knuckle joints.

### 3.2 Boot sole
- Material: **rough (matte) B4C ceramic `#FAFAFA`** shell + **Dark Titanium** structural core.
- Integrate **Landauer thermal-dissipation grooves** in the sole to shed the **>43 °C** heat generated
  by gravitational friction during operation.
- Keep the heavy sealed boot silhouette (toe + sole edge) from the locked reference.

## 4. CHUA_XAC_NHAN (resolve in / alongside the sculpt; not settled by this spec)
- Exact 7.5-head limb-length metrics (per-segment lengths) vs the master Bible — numeric confirm pending.
- Tail cross-section, fold/pleat count, and panel taper to ankle — blockout only in vector.
- Final palette/value tuning (matte porcelain tones, graphene value) vs master Bible.
- Thermal-groove geometry and count on the boot sole — engineering detail TBD in sculpt.
- Finger plate count / slope angle for `execute()` overlap — sculpt-time tuning.
- Master Bible numeric source not located in this lane's scope.

## 5. HARD RULES HELD (Lane B side)
No high-poly sculpt / no mesh / no rig / no render / no PNG / no AI-image-gen performed by Lane B ·
figure `<defs>` preserved verbatim in the reference SVG · no source V1/V2 SVG outside
`character_model_sheet_base_v2/` modified · the operator's CANON lock is recorded with attribution,
not autonomously asserted.

## 6. DELIVERABLES OF THIS HANDOFF
- `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg` — updated to V2.5
  (header `CANON_STATUS = LOCKED_V2.5`, 7.5-head grid, ankle-length tail; figure defs unchanged).
- `docs/handoff/MIKAGE_HIGH_POLY_HANDOFF_SPEC_V2_5.md` — this spec.

*End of High-Poly Handoff Spec V2.5.*
