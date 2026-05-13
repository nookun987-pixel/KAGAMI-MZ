# ASSET-BUILD-10E3_MANUAL_GRAPHENE_COMPOSITE

## 1. Task Header

```
TASK_CODE:          ASSET-BUILD-10E3_MANUAL_GRAPHENE_COMPOSITE
TASK_TYPE:          E-3 — Manual post-composite (ground-truth fallback)
AUTHORIZED:         YES — 2026-05-13
STATUS:             READY FOR EXECUTION
DATE:               2026-05-13

BASE_IMAGE:         09E_inpaint_04.png (primary)
SECONDARY_REF:      09E_inpaint_05.png (reference only — do not composite from this)
TOOL:               Photoshop / Affinity Photo / GIMP (human choice)
GPU_REQUIRED:       NO
RENDER_REQUIRED:    NO
IPADAPTER:          RETIRED — do not use
FURTHER_09E_ROUNDS: NONE — do not run more inpainting
```

---

## 2. Authorization Record

```
E-1 inpainting (09E):   COMPLETE — Q-5 PASS (dark seams achieved, no bleed)
E-1 limitation:         Graphene texture NOT achievable via text-only inpainting
                        Narrow seam mask + white context = model generates shadow only
                        No structured graphene weave produced by any of 5 renders
E-3 rationale:          Manual composite provides full texture/opacity control
                        No GPU cost. No render variance. Deterministic output.
                        This is the highest-control path available.
Canon approval:         NOT GRANTED — this is a pre-canon enhancement step
Asset lock:             NOT GRANTED
```

---

## 3. Input Files

```
PRIMARY BASE:
  Filename:     09E_inpaint_04.png
  Location:     Desktop/MIKAGE_RUNPOD_ASSET_BUILD_09_PACK/outputs_download_here/
  Why this:     Best Q-5 pass. Dark seams established. Clean panel geometry.
                Use as the base layer — do not alter white panel surfaces.

SECONDARY REFERENCE (do not composite from):
  Filename:     09E_inpaint_05.png
  Why:          Contains incidental graphene mesh texture in seam area from inpainting.
                Use only as visual reference for texture character/scale.
                Extract texture from here only if needed as stamp source.
```

---

## 4. Composite Specification

### 4.1 Target Regions — Paint Here Only

```
REGION-1:   Vertical center seam
  Area:       The vertical line running from V-apex downward to bottom of faceplate
  Width:      Match existing dark seam width in base image exactly
  Note:       This seam already has dark values from E-1 — enhance only, do not widen

REGION-2:   Horizontal V-cut seam (left arm)
  Area:       The diagonal seam line running upper-left from V-apex
  Width:      Match existing seam width
  Note:       E-1 result was inconsistent here — this needs most enhancement

REGION-3:   Horizontal V-cut seam (right arm)
  Area:       The diagonal seam line running upper-right from V-apex
  Width:      Match existing seam width
  Note:       Same as REGION-2

REGION-4:   V-apex intersection point
  Area:       The junction where all three seam lines meet
  Width:      Small point — slightly wider than seam lines (natural junction)
  Note:       Should appear as deepest/darkest point — depth cue
```

### 4.2 Blend Mode and Opacity

```
METHOD:         Multiply blend mode (recommended)
  Why:          Multiply darkens without replacing base tone
                Preserves any existing dark values from E-1
                Naturally respects the underlying lighting

ALTERNATIVE:    Direct paint on new layer, blend mode = Normal, opacity 60–80%
  Why use:      More control over exact hue if Multiply pulls wrong tones

OPACITY RANGE:  60–85%
  Start at:     70% — evaluate, adjust
  Max:          85% — avoid full-black fill (should read as depth, not void)
  Min:          60% — must be visibly darker than white panel at seam boundary

LAYER ORDER:
  Bottom:   09E_inpaint_04.png (base — do not touch)
  Middle:   Graphene texture layer (clipped to seam mask)
  Top:      Final adjustments (levels/curves — optional)
```

### 4.3 Texture to Use

```
OPTION A — Source from 09E_inpaint_05.png (simplest):
  1. Open 09E_inpaint_05.png
  2. Crop the seam area where the mesh texture is visible
  3. Use this as a texture stamp/brush source
  4. Tile or stretch to fit seam regions
  Note: This texture was AI-generated but matches the aesthetic intent

OPTION B — Carbon fiber / graphene texture from free source:
  Search: "carbon fiber texture seamless free PNG dark"
  Use:    Dark (near-black) hexagonal weave or diagonal weave pattern
  Scale:  Small — the seam is narrow, texture repeat should be fine-grain

OPTION C — Procedural in Photoshop (no texture needed):
  1. Create a new layer, fill with black (#0a0a0a to #1a1a1a)
  2. Add noise filter (2-4% monochrome)
  3. Add slight diagonal motion blur (45 degrees, distance 3-5px)
  4. This simulates a matte graphene weave without external texture
  Advantage: No external file needed, fully controllable

RECOMMENDED: Option C or A. Option C is fastest.
```

### 4.4 Seam Mask (How to Select the Regions)

```
METHOD 1 — Manual selection:
  Use the Pen Tool or Lasso to trace the seam lines
  Create a selection path following the dark seam channels in 09E_inpaint_04.png
  Feather: 0px (hard edge) or 0.5px (very slight soft)

METHOD 2 — Use the existing dark values as selection:
  Color Range → Select darks in seam area
  Expand selection by 1-2px to ensure coverage
  Refine edges if needed

METHOD 3 — Use mask.png as reference:
  The original mask.png (white Y-shape on black) defines exactly which regions were
  inpainted. Import mask.png as a layer, use it to create your selection.
  This is the most precise method.

IMPORTANT: After creating selection, Contract by 1px before painting.
           This prevents any color from touching the panel surface edge.
```

---

## 5. What NOT to Touch

```
DO NOT paint on:
  [ ] White panel surfaces — any paint on white panel = FAIL
  [ ] Visor area — must remain sealed/closed
  [ ] Background (black) — leave completely untouched
  [ ] Any edge of the faceplate silhouette — do not alter shape
  [ ] Top forehead region — out of scope for this composite

DO NOT:
  [ ] Add new seam lines that don't exist in base image
  [ ] Widen seam channels beyond base image geometry
  [ ] Change white panel hue (no desaturation, no warming/cooling)
  [ ] Add specular highlights to seam (keep matte)
  [ ] Add glow effects
```

---

## 6. Q-5 Evaluation Criteria for E-3 Output

Before saving the composite as final, check:

```
Q-5 PASS (E-3 version):
  [ ] Structured dark pattern visible in seam/gap areas (not just flat black)
  [ ] Near-black to dark grey values in all three seam regions
  [ ] White panel surface UNCHANGED — no staining, no hue shift
  [ ] Visor CLOSED — no interior visible
  [ ] No face/skin/eyes/hair visible
  [ ] Dark texture does NOT extend outside seam boundary
  [ ] Seam edges clean — no feathered halo onto panel surface
  [ ] All three seam arms have consistent darkness (no arm obviously lighter)
  [ ] V-apex intersection appears as deepest point

Q-5 FAIL (E-3 version):
  [ ] Graphene texture is flat black with no structure — looks like a void
  [ ] Dark values extend onto white panel surface
  [ ] Seam arms have unequal darkness (asymmetric)
  [ ] Panel surface hue shifted (grey tint, blue tint, etc.)
  [ ] Visible selection boundary artifact at seam edge
```

---

## 7. Output Specification

```
FILENAME:           09E3_graphene_composite_v1.png
FORMAT:             PNG, same resolution as input
COLOR:              sRGB
SAVE AS:            Flattened PNG (no layers)
SAVE LOCATION:      Desktop/MIKAGE_RUNPOD_ASSET_BUILD_09_PACK/outputs_download_here/

ALSO SAVE:
  Working file:     09E3_graphene_composite_v1.psd / .afphoto (keep layers for iteration)
```

---

## 8. Review and Report

After completing composite, create a brief evaluation:
- Screenshot or note of Q-5 check result
- Which texture option was used (A/B/C)
- Any deviations from spec (if needed)
- PASS/FAIL decision

Report to be logged in session notes or new handoff file.

---

## 9. Abort Conditions

```
STOP and report if:
  - Composite cannot be constrained to seam region without panel bleed
  - Texture scale is too large for the narrow seam width (texture not visible)
  - Base image quality is insufficient for manual composite (resolution too low)
  - Visor is accidentally opened by any composite operation

DO NOT:
  - Return to E-1 inpainting rounds
  - Return to IPAdapter
  - Generate new renders
  - Proceed to bust bridge without completing E-3 Q-5 check
```

---

## 10. If E-3 Passes Q-5

```
[ ] Save 09E3_graphene_composite_v1.png
[ ] Save working file (.psd / .afphoto)
[ ] Create E-3 pass report (brief)
[ ] Update 00_LATEST_CODEX_HANDOFF.md
[ ] Commit and push
[ ] Next: Authorize ASSET-BUILD-11_BUST_BRIDGE_COMPOSITE
```

## 11. If E-3 Fails Q-5

```
[ ] Document failure mode (bleed / flat-black / uneven / artifact)
[ ] Do not save as candidate
[ ] Report back for E-3 parameter adjustment (opacity / blend mode / texture)
[ ] This path has no automatic escalation — human decision required
```
