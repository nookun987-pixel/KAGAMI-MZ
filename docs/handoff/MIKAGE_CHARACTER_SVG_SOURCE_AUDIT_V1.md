# MIKAGE CHARACTER — SVG SOURCE AUDIT V1

> STATUS: DRAFT · NOT CANON · NOT ASSET-LOCKED · NO RENDER · NO AI-IMAGE-GEN
> Date: 2026-06-04 · Lane: character reference / documentation only (no mesh, no rig, no render).
> Purpose: audit every existing SVG under `design/*character*` and `design/*zenith_blade*`,
> pick the latest usable reference, and extract the character construction rules from the
> SVGs themselves — so the next build step continues from existing vector sources, not from scratch.
> Nothing here approves canon, locks an asset, or authorizes a render. Unknowns = `CHUA_XAC_NHAN`.

---

## 1. SCOPE / METHOD
- Read-only audit of 19 `.svg` files. No source SVG was modified, overwritten, or deleted.
- Rules were extracted from each SVG's own embedded `<text>` labels and `<!-- comments -->`
  (these files are self-documenting model sheets), plus path geometry where labels were absent.
- Raster previews (e.g. `*_PREVIEW.png`) were noted but NOT used as a source and NOT touched.

## 2. FILE INVENTORY (design/*character* + design/*zenith_blade*)

| # | File (under design/) | Rev | Role | Self-declared status |
|---|----------------------|-----|------|----------------------|
| 1 | character_basic_sketch_v0/MIKAGE_BASIC_BODY_SKETCH_V0.svg | V0 | Foundation form, 3-panel (silhouette/blockout/stick) | DRAFT · proportions UNCONFIRMED |
| 2 | character_basic_sketch_v0/..._V0_1.svg | V0.1 | Monolith/heavy merge, sealed planar helmet | DRAFT |
| 3 | character_basic_sketch_v0/..._V0_2.svg | V0.2 | Helmet+neck integration (mask nests in gorget) | DRAFT |
| 4 | character_basic_sketch_v0/..._V0_3.svg | V0.3 | Silhouette refine, arms merged into body mass | DRAFT |
| 5 | character_basic_sketch_v0/..._V0_4.svg | V0.4 | Silhouette rebalance, clearer arm read | DRAFT |
| 6 | character_basic_sketch_v0/..._V0_5.svg | V0.5 | Final polish: segmented armored shell + plated arms | DRAFT — front "source of truth" for model sheet |
| 7 | character_model_sheet_base_v1/MIKAGE_MODEL_SHEET_BASE_V1.svg | V1 | 4-view base turnaround, derived from V0.5 front | DRAFT |
| 8 | character_model_sheet_base_v1/..._V1_1.svg | V1.1 | Patch: true-depth SIDE + true-turn 3/4 | DRAFT |
| 9 | character_model_sheet_base_v1/..._V1_2.svg | V1.2 | Patch: 3/4 stabilized (front-dominant) | DRAFT |
| 10 | character_model_sheet_base_v1/..._V1_3_MASK_ONLY.svg | V1.3 | Patch: Kitsune planar mask (faceted), sealed slits | DRAFT |
| 11 | character_model_sheet_base_v1/..._V1_4_HANDS_FEET.svg | V1.4 | Patch: mitten hands + sealed boots; completes "locked V1.4 form" | DRAFT |
| 12 | character_surface_material_v1/MIKAGE_SURFACE_MATERIAL_STUDY_V1.svg | V1 | Material/value zone map over V1.4 (grayscale, no violet) | STUDY DRAFT |
| 13 | character_costume_layer_v1/MIKAGE_COSTUME_COAT_LAYER_V1.svg | V1 | High-collar executor coat language (front/side) | STUDY DRAFT |
| 14 | character_costume_layer_v1/..._V1_1_4VIEW.svg | V1.1 | Executor coat, 4-view, over V1.4 ghost | STUDY DRAFT |
| 15 | character_combined_reference_v1/MIKAGE_COMBINED_CHARACTER_REFERENCE_V1.svg | V1 | One-sheet index: V1.4 form + material + coat (grayscale, NO violet) | DRAFT |
| 16 | character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_FRONT.svg | V2.1 | Front only: 5 operator rulings on V1.4 form | DRAFT |
| 17 | **character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_4VIEW.svg** | **V2 · 4-VIEW** | **Latest integrated 4-view (front/side/back/3-4) + palette + violet** | **DRAFT — SELECTED LATEST SOURCE** |
| 18 | zenith_blade_clean_v1/MIKAGE_ZENITH_BLADE_REST_CLEAN_V1.svg | V2.5 | Weapon "PrimeTool" idle/rest (P1) | "STRUCTURE CANON · LOCKED V2.5" (self-declared; see §7) |
| 19 | zenith_blade_clean_v1/MIKAGE_ZENITH_BLADE_COMBAT_ACTIVE_CLEAN_V1.svg | V2.5 | Weapon active P2/P3 overdrive | "STRUCTURE CANON · LOCKED V2.5" (self-declared; see §7) |

## 3. LINEAGE (dependency chain)

```
V0 → V0.1 → V0.2 → V0.3 → V0.4 → V0.5   (basic body sketch — form evolution)
        |                         └─ front "source of truth"
        v
MODEL SHEET BASE  V1 → V1.1 → V1.2 → V1.3(mask) → V1.4(hands+feet)  = "locked V1.4 form"
        |                                                  |
        |                       ┌──────────────────────────┼──────────────────────────┐
        v                       v                          v                          v
 SURFACE MATERIAL V1     COSTUME COAT V1 → V1.1(4-view)   COMBINED REF V1 (index)
        └───────────────────────┴──────────────┬───────────┘
                                                v
                                COMBINED REF V2 FRONT (V2.1)
                                                v
                          >>> COMBINED REF V2 · 4-VIEW  (LATEST) <<<

ZENITH BLADE (PrimeTool, weapon) — REST V2.5 + COMBAT V2.5 : parallel prop track, not body form.
```

## 4. LATEST USABLE SOURCE — SELECTED
**`design/character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_4VIEW.svg`**
- Newest character reference by modified time (2026-06-03 16:57) and the most complete:
  it is the only file carrying all four views (front/side/back/3-4) **with** the integrated
  palette and the controlled-violet signal placement.
- It builds directly on the locked V1.4 base form + the V2.1 front integration of the
  five operator rulings, so selecting it preserves the whole chain rather than restarting.
- It explicitly self-labels `DRAFT · NOT CANON · NOT ASSET-LOCKED · NO RENDER` and
  `CANON_LOCK = NO · ASSET_LOCK = NO · RENDER_ALLOWED = NO`. Treated as DRAFT source only.

## 5. CONSTRUCTION RULES EXTRACTED (CONFIRMED — present in the source SVGs)

**Proportion** — Master ratio in V2 = **7.1 heads** (`7.1 HEAD`). Vertical landmarks on the
V2 ruler: CROWN → HIP → SKIRT(hem) → SOLE. (Earlier V0/V1 sketches used a 7.5-head working
block; the V2 master value is 7.1 — see §6 for the unreconciled gap.)

**Helmet / mask** — Faceless **sealed Kitsune planar mask** (faceted faceplate + muzzle
wedge, planar cheeks). **Exactly 2 sealed slits**, flush-engraved (not open emitters),
present on **front and 3/4 only**; **NONE on the back**. No eyes, no mouth, no nose, no skin.
Matte (no gloss). Mask nests into a gorget collar (minimal exposed neck).

**Hair** — REQUIRED. Long, heavy, **black**; wider mass at head + shoulders; straight
vertical fall; tail clearly **past the hip**. In BACK view the hair is the dominant
silhouette and covers the back; side/3-4 show it falling down the back.

**Coat (executor)** — High standing collar rising from the shoulders, framing the mask in a
clean V; head emerges above it. Closed **center seam** (front/3-4) / single **center-back
seam** (back, no slits). Straight sleeves to the wrist (hands exposed below cuff). Heavy
single hem at the **knee**. Hangs straight and heavy — **not a cape, no train, no flare**.

**Skirt panels** — Layered **vertical skirt panels** below the coat hem; outer panels reach
toward the ankle → "sacred long-line flow." Panel separations stay readable as recessed
hairline seams in all four views (visible below the hair mass in back).

**Front view** — slit halo (violet, ~0.45 opacity on the 2 slits) · hair · skirt panels.
**Side view** — hair down the back · skirt depth · one faint violet slit edge near the eye.
**Back view** — no helmet slits · hair covers the back · **Ensō violet ring at upper back / nape**.
**3/4 view** — mask + hair + coat + skirt + violet check; 2 sealed slits foreshortened; visible side plane.

**Body / silhouette** — Female-coded **but non-sexual**: defined waist + long vertical column
(hair + coat + skirt); no breast/waist/anatomy emphasis, no glamor/fanservice. Heavy/monolith
calm mass; segmented sealed porcelain shell — "not a human mannequin, not robot armor, not a mascot blob."

**Hands / feet** — Sealed-shell **mitten hands** (segmented ceramic glove, no fingers/nails,
thumb nub). **Heavy sealed boots** with toe + sole edge, grounded.

**Surface / material** — Matte unglazed B4C **porcelain shell** (fine ceramic micro-grain),
**graphene charcoal underlayer at every joint** (neck/shoulder/elbow/wrist/hip/knee/ankle),
flush engraved slit grooves, recessed gorget + minimal panel seams. **MATTE LOCK**: no gloss,
chrome, subsurface glow, or specular hotspot.

**Palette (canon: white + black + violet only)**
| Token | Hex | Use |
|-------|-----|-----|
| Porcelain albedo | `#FAFAFA` | white armor shell (dominant) |
| Garment / hair black | `#16161c` (deep blacks `#0d0d12`/`#09090d`/`#08080c`) | coat · skirt · long hair · recesses |
| Graphene underlayer | `#24242b` | matte charcoal at joints |
| Electric violet | `#8F00FF` | SIGNAL ONLY |
| (material-study values) | `#8d8a83` / `#c4c0b8` / `#ece9e3` / slit groove `#3a3a42` / void `#050508` | grayscale shading values in the material study, not extra palette colors |

**Violet signal usage** — Signal only, never a plate fill: (a) ultra-thin halo on the 2
sealed slits (front + 3/4; one faint edge in side), and (b) **one** Ensō ring on the upper
back. No broad violet across plates, no ambient tint.

**Ensō** — Present in the source (V2 BACK: violet ring + arc at upper back / nape). Therefore
the Ensō upper-back is permitted to carry forward (it already exists in-source).

**Forbidden elements (consolidated from the SVGs)** — no eyes/mouth/nose/visible skin;
no gloss/chrome/specular/subsurface; no broad violet fill on armor; no cape/train/flare;
no decorative armor; no anime fashion/mascot; no sensual tailoring; no busy seams; no
buttons/zipper clutter; no warm colors; no cyberpunk/HUD clutter; no lore phrasing
(geometry-first per operator ruling Layer B).

## 6. CHUA_XAC_NHAN (unconfirmed / ambiguous — must NOT be treated as settled)
- **Operator approval of V2** — V2 4-view is a DRAFT integration of the 5 operator rulings,
  **not operator-approved**. `CANON_LOCK = NO · ASSET_LOCK = NO · RENDER_ALLOWED = NO`.
- **Proportion number** — 7.1 heads (V2 master) vs 7.5-head working block (V0/V1 sketches)
  is **not numerically reconciled** against the master Bible. CHUA_XAC_NHAN.
- **Final palette / value tuning** — exact porcelain tones, contrast, and value steps are
  PROPOSED / UNCONFIRMED vs master Bible.
- **"Locked V1.4 form"** — the V1.4 state is the cumulative model-sheet base after the
  V1.3 mask + V1.4 hands/feet patches; there is no single file literally named base "V1_4"
  turnaround (the file present is `..._V1_4_HANDS_FEET.svg`). Lineage is clear, but the exact
  "locked" snapshot file is implied, not a standalone master file. CHUA_XAC_NHAN.
- **Master Bible numbers** — referenced repeatedly as the authority but the Bible file itself
  was not located in this audit scope. CHUA_XAC_NHAN.
- **Zenith Blade canon status** — files self-declare "STRUCTURE CANON · LOCKED V2.5"; this
  audit records that claim but does **not** ratify it (no canon approval in scope).
- **Hands/feet + glove segmentation + boot sole** — self-labeled placeholder/blockout-refined.

## 7. NOTE — ZENITH BLADE (weapon, parallel track)
The blade ("PrimeTool") is a prop, not body form: B4C porcelain shell `#FAFAFA`, black Ti
frame + Ferro-Calcium core, ~350 kg; REST = P1 idle (core dim, 43°C), COMBAT = P2/P3 overdrive
(shell splits Kintsugi-style, core `#E60000` overload glow, Orbital-Logic UI). The red core
glow belongs to the cinematic/film layer (crimson active core), consistent with the locked
cine color contract — it is **not** part of the character's white+black+violet armor palette.
Recorded for completeness only; no change, no lock, no render.

## 8. HARD RULES HELD THIS PASS
No render · no AI image generation · no raster art · no redesign from scratch · no overwrite
of any source SVG · no file deleted · no canon approval · no asset lock · repo structure preserved.

## 9. SOURCES (all read-only, under design/)
All 19 SVGs listed in §2. Primary: `character_combined_reference_v2/MIKAGE_COMBINED_CHARACTER_REFERENCE_V2_4VIEW.svg`.

*End of SVG Source Audit V1.*
