# MIKAGE — BASIC BODY SKETCH V0 — SPEC

> Lane: CHARACTER_CAST_LANE · Level: foundation-form draft.
> NOT a render · NOT canon · NOT asset-locked · NOT production-ready.
> Created by Cowork 2026-06-03. Operator redirect: stop going wide, build the
> missing foundation form first ("móng chân").

## 0. WHY THIS EXISTS
The cast pipeline kept moving outward (IP, platform, render kits) while the
Mikage character still has **no reusable foundation form**: no body block, no
proportion lock, no clean silhouette, no model-sheet base. Every render brief was
standing on nothing. This V0 is the one missing primitive — a dead-simple,
look-once body block that everything later (pose sheet, model sheet, render
anchors) can be built and corrected against.

## 1. GOAL
One extremely simple blockout of the Mikage figure that answers, at a glance:
- what is the overall **silhouette / mass**,
- what are the **head / torso / leg proportions**,
- is the **helmet form** right (faceless, sealed),
- does the **body** read neutral (not anime / not sexualized / not lopsided),
- and **which single layer to fix** if it's wrong.

## 2. DELIVERABLE
`design/character_basic_sketch_v0/MIKAGE_BASIC_BODY_SKETCH_V0.svg`
Deterministic vector (hand-authored SVG, render-verified to PNG). Three panels +
ruler + helmet inset:
- **A · Silhouette** — solid filled shape; reads pose & mass instantly.
- **B · Blockout** — construction volumes (head egg, ribcage, pelvis bucket),
  joint dots, centerline, limb capsules.
- **C · Stick pose** — balance plumb-line + skeleton + joints.
- **Head-unit ruler** (0.0–7.5) with landmark names down the left.
- **Helmet inset** — faceless planar front, two sealed sensor slits, no eyes.

## 3. INCLUDED (and ONLY this)
head / helmet form · neck · torso · arms · legs · hands · feet · overall
silhouette · proportion ruler · joint + centerline construction.

## 4. EXCLUDED (V0 must NOT contain)
render · color · violet · background scene · lore / story · VFX · kintsugi /
crimson / scars · costume / executor coat / collar · blade or any weapon ·
platform / animation / strategy framing · text on the figure itself.

## 5. WORKING BLOCK (all PROPOSED / UNCONFIRMED vs master canon)
- Height: **7.5 head units** (per FULLBODY_PROPORTION_REFINE_SPEC_V1, marked
  PROPOSAL/CHUA_XAC_NHAN there — not yet confirmed against master canon).
- **Mid-line at hip/crotch** (~3.9 heads) — the body's vertical midpoint.
- **Broad shoulder** (~2 head-units wide) — armored/heavy build, not slim.
- **Mild taper** shoulder→waist; pelvis flares back out at hip.
- Landmarks: crown 0.0 · chin 1.0 · shoulder ~1.4 · chest 2.0 · waist 3.0 ·
  hip/crotch ~3.9 · knee ~5.6 · ankle ~7.25 · sole 7.5.

These numbers are a **starting block to react to**, not a locked rig. Operator
confirms or corrects against master canon before anything is reused.

## 6. IDENTITY INVARIANTS HELD (form only, no color)
- Helmet is **faceless** — no human face, no eyes, no anime features.
- **Two sealed sensor slits** shown as form only (no glow, no violet — V0 is
  pre-color). Matches the SEALED-monocoque ruling (MIKAGE_MASK_CANON, 2026-06-02).
- Planar (Kitsune-geometry) helmet silhouette, not a smooth featureless egg.
- Neutral genderless body mass.

## 7. EXPECTED READ (what "correct" looks like)
- See the character's stance/proportion in one look.
- Know the head : torso : leg ratio.
- Judge whether the helmet shape is right.
- Spot if the body drifts human/anime/sexy/lopsided.
- Know exactly what to fix next.

## 8. FAIL → FIX ONE LAYER (do not jump to render)
| Symptom | Fix only this |
|---|---|
| Pose / stance wrong | STICK POSE (panel C) |
| Proportion / mass wrong | BLOCKOUT volumes + ruler (panel B) |
| Helmet shape wrong | HELMET inset |
| Limb form wrong | the relevant limb capsule |

No color, no costume, no blade, no background until the block passes.

## 9. STATUS
V0 = DRAFT for operator review. No PASS / approve / asset-lock asserted.
Next step is operator look-and-react, then a single-layer revision (V0.1) if needed.
