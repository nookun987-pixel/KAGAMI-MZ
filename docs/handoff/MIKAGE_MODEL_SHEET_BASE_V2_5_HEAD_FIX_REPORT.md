# MIKAGE MODEL SHEET BASE V2.5 — HEAD/MASK FIX REPORT

> STATUS: correction pass · NO RENDER · NO PNG · NO AI-IMAGE-GEN. Date: 2026-06-04.
> Target: `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg`.
> Addresses operator report: "mask distortion drift — front pinched, 3/4 bloated."

## 1. ROOT CAUSE (what was actually wrong)
- The mask distortion was **NOT introduced by the prior edits**. Across every prior commit the
  figure `<defs>` were byte-for-byte identical (sha256 prefix `6db990d913d1b837`), and all four
  views were placed at the **same uniform** `scale(0.78)` — no view was ever vertically stretched.
- The real defect was **inherited from the V2 source geometry**: three views (FRONT, BACK, and the
  SIDE profile) draw the head with the canonical mask def `#helm` / `#helmP` at
  `translate(430,214) scale(0.92)` (≈ **63 wide × 96 tall**), but the **3/4 view drew the head as a
  separate hand-authored polygon** (`M410,168 …`) measuring ≈ **96 wide × 96 tall** — i.e. ~53 %
  wider. That mismatch is what reads as "3/4 bloated/oversized" and makes the narrow canonical
  front mask look pinched by comparison.

## 2. FIX APPLIED
1. **3/4 head re-unified to the canonical mask.** The hand-drawn 3/4 head polygon + its facet
   lines were replaced with the exact `#helm` + `#helmFacets` + slit halos at
   `translate(430,214) scale(0.92)` — **identical shape and scale to FRONT/BACK**. The mask is now
   absolute and identical across all four views (SIDE uses the canonical profile `#helmP` at the
   same scale).
2. **CROWN + CHIN aligned.** All four heads share `translate(430,214) scale(0.92)`, so CROWN sits at
   the same height in every view (and CHIN within ~3 px on the profile). Both guides are drawn as
   magenta reference lines for verification.
3. **7.5-head reached by LOWER-BODY elongation only.** The head/mask scale is **unchanged** (no
   vertical stretch, no shrink). Instead the legs + skirt/tail were extended downward so the figure
   total = 7.5 heads and the **head equals exactly 1 grid-unit** (head 95.6 internal × 0.78 = 74.6 px
   = one 7.5-grid division). This honours "elongate the limbs, keep the head uniform."

## 3. VALIDATION
- **XML:** well-formed (parsed clean).
- **Heads:** 3 × `#helm` (front/back/3-4) + 1 × `#helmP` (side), all at `translate(430,214) scale(0.92)`.
- **Old bloated 3/4 polygon:** removed (0 occurrences of `M410,168 L438,164`).
- **defs delta:** `6db990d913d1b837` → `af7177fc57398277` — change isolated to the **3/4 head only**;
  `figFront`, `figSide`, `figBack`, and `#helm/#helmFacets/#helmP` defs verified intact.
- **No raster/visual self-check** (render/PNG forbidden in this lane) — validation is structural;
  please re-view the SVG visually to confirm.

## 4. CHANGED vs PREVIOUS V2.5
- Figure geometry change: **3/4 head only** (now canonical mask). All other figure paths unchanged.
- Lower-body elongation (skirt tail + boots lowered) is an additive overlay; SOLE guide + 7.5 ruler
  recomputed so head = 1 unit.

## 5. STILL CHUA_XAC_NHAN
- Exact per-segment 7.5 limb metrics vs master Bible (vector blockout; finalize in high-poly).
- Whether a *true* 3/4 rotation of the mask is wanted later (current 3/4 shows the canonical mask
  frontally for absolute uniformity, per the operator's "identical across all views" instruction).
- Tail cross-section / boot sculpt detail (high-poly).

*End of Head/Mask Fix Report.*
