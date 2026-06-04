# MIKAGE MODEL SHEET BASE V2 — BUILD REPORT

> STATUS: DRAFT · NOT CANON · NOT ASSET-LOCKED · NO RENDER · NO AI-IMAGE-GEN · NO RASTER
> Date: 2026-06-04 · Lane: vector character reference (SVG) only — no mesh, no rig, no render, no repaint.
> Artifact built: `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg`
> Method in one line: the four V2 figures were **reused verbatim** and re-presented as a clean
> labelled 4-view turnaround with shared 7.1-head guides. No geometry was redrawn or repainted.

---

## 1. SOURCES READ (read-only)
- `docs/handoff/MIKAGE_CHARACTER_SVG_SOURCE_AUDIT_V1.md` — inventory, lineage, rule extraction.
- `design/character_model_sheet_base_v1/MIKAGE_CHARACTER_MODEL_SHEET_CONTINUATION_SPEC_V1.md` — the build spec for this step.
- `design/character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_4VIEW.svg` — **primary geometry source** (figFront/figSide/figBack/fig34 + helm defs).
- Supporting lineage (context only, not re-drawn): `character_combined_reference_v2/..._V2_FRONT.svg`,
  `character_model_sheet_base_v1/*` (V1–V1.4), `character_surface_material_v1/*`,
  `character_costume_layer_v1/*`, `character_combined_reference_v1/*`, `character_basic_sketch_v0/*`.

## 2. FILES CREATED
- `design/character_model_sheet_base_v2/` (new folder)
- `design/character_model_sheet_base_v2/MIKAGE_MODEL_SHEET_BASE_V2.svg` (new; 305 lines; viewBox 1680×1180; XML well-formed)
- `docs/handoff/MIKAGE_MODEL_SHEET_BASE_V2_BUILD_REPORT.md` (this report)

No PNG/preview produced. No existing SVG overwritten or deleted.

## 3. METHOD (no redesign, no repaint)
- The `<defs>` block of the V2 4-view — the four figure groups (`figFront`, `figSide`,
  `figBack`, `fig34`) and the shared helmet paths (`helm`, `helmFacets`, `helmP`) — was copied
  **byte-for-byte** into V2 of the model sheet (verified: DEFS VERBATIM MATCH). The figures are
  placed with the **same** `scale(0.78)` and `y` offset for all four views, so every view shares
  one scale and the landmark heights line up.
- Only the **presentation layer** is new: header, shared horizontal landmark guides, a left
  head-count ruler (7.1-head working master), per-view labels + sub-captions, numbered callouts
  on the front view, and a palette / legend strip. None of this alters the character geometry.
- All character violet (2 slit halos on front, 1 faint slit-edge on side, slit halos on 3/4,
  and the Ensō ring on the back) is carried inside the reused figures — preserved exactly.
  The only added `#8F00FF` is the palette-key swatch (a legend chip, not on the figure).

## 4. WHAT WAS PRESERVED FROM SOURCE (verbatim)
- Faceless sealed **Kitsune planar mask**; **exactly 2 sealed slits on FRONT + 3/4 only**; **none on BACK**.
- No eyes, no mouth, no nose, no visible skin; matte porcelain (no gloss).
- Long heavy **black hair**, past the hip; dominant back silhouette; falls down the back in side/3-4.
- **High standing executor collar**; closed **center seam** (front/3-4) / **center-back seam** (back);
  straight heavy coat, **knee hem, not a cape**.
- **Layered vertical skirt panels** (sacred long-line flow), separations readable in all views.
- **Female-coded, non-sexual** silhouette (defined waist by silhouette only; no anatomy emphasis).
- **Mitten hands** (no fingers/nails); **sealed heavy boots** (toe + sole).
- **Matte porcelain shell** + **graphene underlayer at joints**.
- Palette **white `#FAFAFA` + black `#16161c` + graphene `#24242b` + violet `#8F00FF`** only.
- **Violet = signal only**: thin slit halo + **one Ensō** at upper back. No plate fill, no warm color,
  no decorative clutter, no anime-mascot styling, no cyberpunk/HUD clutter.

## 5. GUIDE / PROPORTION SYSTEM
- Left ruler = **7.1-head working master**, CROWN→SOLE, evenly ticked 0.0–7.1.
- Shared horizontal landmark guides across all four columns: CROWN · CHIN · SHOULDER · CHEST ·
  WAIST · HIP · KNEE · SKIRT-HEM · SOLE. Computed from the figures' own coordinate transform so
  they cross all four views at the same anatomical level. **Guides are reference annotations only.**

## 6. CHUA_XAC_NHAN (kept in the report, NOT asserted inside the art)
- **Proportion reconcile** — 7.1-head is used as the *working master* per instruction, but the
  7.1 (V2) vs 7.5 (V0/V1 working block) gap is **not** numerically reconciled against the master Bible.
- **Operator approval** — the V2 form is an unapproved DRAFT; CANON_LOCK / ASSET_LOCK / RENDER_ALLOWED = NO.
- **Final palette / value tuning** — exact porcelain tones + contrast UNCONFIRMED vs master Bible.
- **Landmark guide exactness** — guide y-positions are derived/approximate reference lines, not
  Bible-confirmed anatomical measurements.
- **Hands/feet detail** — mitten segmentation + boot sole inherited as placeholder from V1.4.
- **Master Bible** — referenced authority not located in scope.

## 7. HARD RULES HELD
No render · no raster/PNG · no AI image gen · no mesh/rig · no repaint pass · no weapon integration ·
no lore-block expansion · no redesign from scratch · no overwrite of any V1/V2 source SVG · no file
deleted · no canon lock · no asset lock · repo structure preserved.

## 8. VALIDATION DONE
- XML well-formedness: PASS (parsed clean).
- Defs (figure geometry) vs source: VERBATIM MATCH.
- Source V2 4-view: untouched (git diff empty).
- All four `<use>` references resolve to defined ids.
- NOTE: no visual/raster verification was performed (render/PNG is forbidden); validation is
  structural only.

## 9. SOURCES
Primary geometry: `design/character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_4VIEW.svg`.
Spec/audit: `docs/handoff/MIKAGE_CHARACTER_SVG_SOURCE_AUDIT_V1.md`,
`design/character_model_sheet_base_v1/MIKAGE_CHARACTER_MODEL_SHEET_CONTINUATION_SPEC_V1.md`.

*End of Build Report.*
