# MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC

**Status:** DRAFT — not canon-locked  
**Source SVGs:** SILHOUETTE_B_THE_MONOLITH.svg (primary) + SILHOUETTE_D_THE_PRESENCE.svg (secondary variant)  
**Canvas reference:** 400×720px (all measurements derived from this coordinate space)  
**Do not render. Do not generate final character. Do not claim final canon.**

---

## 1. SELECTION SUMMARY

| Candidate | Role | Status |
|---|---|---|
| B — THE MONOLITH | PRIMARY silhouette | Carry forward to lock |
| D — THE PRESENCE | SECONDARY / presence variant | Carry forward (pauldron rule only) |
| A — THE DIAGONAL | Motion/action exploration only | Do not lock |
| C — THE CARRY | Rejected — CONDITIONAL score | Do not carry forward |

---

## 2. HELMET SHAPE RULE

**Source:** B primary  
**SVG:** `<ellipse cx="188" cy="112" rx="57" ry="76"/>`

| Rule | Value | Derivation |
|---|---|---|
| Shape | Portrait ovoid (ellipse) | NOT round, NOT visor-flat, NOT dome |
| Width | rx=57 → diameter 114px | 28.5% of 400px canvas |
| Height | ry=76 → diameter 152px | 38.0% of 400px canvas |
| Height-to-width ratio | **1.33:1** | 76÷57 = 1.333 |
| D variant ratio | **1.44:1** | 78÷54 — maximum elongation |
| Allowed range | 1.33:1 to 1.44:1 | B=minimum, D=maximum |
| Head-to-figure ratio | **1:4.05** | Helmet H 152px ÷ Figure H 616px |

**Rule text:** The helmet is an elongated portrait ovoid. Height must be 1.33× to 1.44× its own width. It is never a circle. It is never a flat visor shape. It is never wider than it is tall.

---

## 3. SENSOR SLIT PLACEMENT RULE

**Source:** B primary  
**SVG:** Two `<rect>` elements (white fill) cut into the black helmet ellipse.

```
Slit 1: x=148, y=100, width=80, height=7
Slit 2: x=148, y=117, width=80, height=7
```

| Rule | Value | Derivation |
|---|---|---|
| Count | 2 slits exactly | No single slit. No triple slit. No mesh. |
| Slit height | 7px on 152px helmet H | 4.6% of helmet height each |
| Slit width | 80px on 114px helmet W | **70.2% of helmet width** |
| Horizontal alignment | Centered on helmet cx | Left margin = right margin = 17px from ellipse edge |
| Slit 1 vertical center | y=103.5 | 44.4% down from helmet top (y=36) |
| Slit 2 vertical center | y=120.5 | 55.6% down from helmet top |
| Vertical symmetry | Both equidistant from helmet center | Slit 1 = 8.5px above y=112; Slit 2 = 8.5px below y=112 |
| Gap between slits | 10px | 6.6% of helmet height |
| Combined slit zone | ~30px vertical span | Both slits occupy center 20% of helmet height |
| Color | White (void through helmet) | Not glow, not colored light, not pupil |

**Rule text:** Two ultra-narrow horizontal void slits, each 4–5% of helmet height, positioned symmetrically about the helmet's vertical center point. Each slit spans 70% of helmet width, horizontally centered. The gap between slits equals 6–7% of helmet height. Both slits are voids (white/transparent cuts) — no glow, no iris, no pupil shape.

---

## 4. HAIR MASS RULE

**Source:** B primary  
**SVG:** Single filled path, straight left-side mass.

```
M 170,48  C 148,42 118,56 98,95
C 76,138 72,210 74,300
C 76,388 86,472 102,538
C 110,516 110,448 108,378
C 106,305 112,238 130,192
C 142,165 160,142 168,110  Z
```

| Rule | Value | Derivation |
|---|---|---|
| Mass shape | Single solid contiguous mass | Not strands, not wisps, not volume clouds |
| Starting point | Crown of helmet (y=48 ≈ helmet top y=36) | Hair begins at/above helmet crown level |
| Bottom extent | y=538 | 87% of canvas height — falls near ankle |
| Hair length vs figure height | **79.5%** | 490px hair ÷ 616px figure height |
| Left extent (widest) | x≈72 — 59px left of helmet left edge (x=131) | Extends clearly beyond helmet silhouette |
| Hair fills | LEFT negative space | Between hair left edge and body left edge |
| Role | Secondary downward mass | Counterweights sword on right side |
| Silhouette contribution | Large left-side mass broadens lower body read | Prevents figure reading as a thin column |

**D variant:** Hair extends further left (x≈55–84 at widest), creating even larger left mass. Acceptable for presence variant.

**Rule text:** Long heavy straight black hair forms a single solid filled mass originating at the helmet crown and falling to approximately 80% of figure height (near ankle level). The mass extends beyond the helmet's left edge and occupies the left negative space of the figure. It is not separated into strands. It is not short. It is not colored. It reads as a single downward shape at thumbnail scale.

---

## 5. BODY PROPORTION RULE

**Source:** B primary

| Section | Width | x-span | Note |
|---|---|---|---|
| Pauldron total span | 274px | x=62→336 | 68.5% canvas width |
| Shoulder bridge | 86px | x=150→236 | connects pauldrons |
| Chest | 86px | x=150→236 | matches shoulder bridge |
| Waist | 70px | x=158→228 | 81.4% of chest — inward taper |
| Hips | 90px | x=148→238 | 105% of chest — slight outward flare |
| Leg (each) | 40px | — | planted parallel |
| Inner leg gap | 10px | x=188→198 | minimal gap — statue stance |
| Total leg span | 90px | x=148→238 | matches hips |

**Vertical section heights:**

| Section | y-span | Height |
|---|---|---|
| Helmet | y=36→188 | 152px |
| Neck+shoulder | y=180→220 | 40px |
| Chest | y=220→324 | 104px |
| Waist | y=324→374 | 50px |
| Hips | y=374→430 | 56px |
| Legs | y=430→652 | 222px |
| **Total figure** | y=36→652 | **616px** |

**Taper rule:** Pauldrons (274px) → Chest (86px) → Waist (70px) → Hips (90px). Pauldrons are 3.2× wider than the chest. The body does not match pauldron width. The figure reads as an inverted triangle from shoulder to waist, then a gentle hip flare. Legs are columnar.

**Rule text:** Figure proportions follow strict taper: pauldrons are minimum 2.4× the chest width. Waist narrows to approximately 80% of chest. Hips flare slightly (105% of chest). Legs are rectangular columns planted parallel with minimal inner gap. Total figure height (helmet top to foot) occupies approximately 85% of the generation canvas.

---

## 6. PAULDRON WIDTH RULE

**Source:** B primary (minimum), D secondary (maximum)

| Variant | Total span | Helmet W | Ratio |
|---|---|---|---|
| B — PRIMARY | 274px (x=62→336) | 114px | **2.40× helmet W** |
| D — PRESENCE | 312px (x=44→356) | 108px | **2.89× helmet W** |
| Minimum rule | — | — | 2.40× |
| Maximum rule | — | — | 2.90× |

**Left pauldron (B):** x=62→170, top width 108px. Extends 69px left of body left edge (x=150).  
**Right pauldron (B):** x=212→336, top width 124px. Extends 100px right of body right edge (x=236).  
**Right pauldron is wider** — intentional asymmetry. Sword-side shoulder carries more visual mass at shoulder level to balance hair mass below.

**Rule text:** Pauldrons must span a minimum of 2.40× the helmet width (B standard) and a maximum of 2.90× (D variant for high-presence shots). Pauldrons extend significantly further on both sides than the chest below them. Right pauldron is slightly wider than left (sword-side weight).

---

## 7. ZENITH BLADE SLAB RULE

**Source:** B primary (planted vertical = canonical position)

**SVG:**
```
Blade: <rect x="286" y="295" width="46" height="358" rx="2"/>
Guard: <rect x="264" y="278" width="90" height="22" rx="2"/>
```

| Rule | Value | Derivation |
|---|---|---|
| Shape | Perfect rectangle — no taper, no tip, no curve | rx=2 (minimal rounding for aliasing only) |
| Blade width | 46px | 11.5% of canvas width |
| Blade height | 358px | 58% of figure height (616px) |
| Blade W:H ratio | 1:7.78 | Extremely thin slab |
| Guard width | 90px | 1.96× blade width — guard ≈ 2× blade |
| Guard height | 22px | 47.8% of blade width — thin horizontal bar |
| Canonical position | Planted vertical, right side | Tip y=653 ≈ ground. Blade center x=309 |
| Sword center offset from figure center | +116px right | 309 - 193 = 116px |
| Sword right edge clearance | x=332 vs canvas x=400 | 68px from canvas right edge |

**D variant sword:** translate(258,440) rotate(-10) — nearly vertical (-10°), hugs body right side. Tip falls below waist. Acceptable presence variant (not the primary stance).

**Rule text:** The Zenith Blade is a perfect rectangular slab — no taper, no curve, no point. Width-to-height ratio approximately 1:8. Guard is approximately 2× the blade width and thin (under 50% of blade width tall). In canonical stance the blade is planted vertically on the right side, tip at ground level. Blade center sits approximately 116px (29% of canvas) right of figure center.

---

## 8. ASYMMETRY RULE

**Source:** B primary (defines canonical asymmetry balance)

| Element | x-span | Side | Role |
|---|---|---|---|
| Hair mass | x≈72→170 | LEFT | organic downward mass |
| Body center | x≈188–193 | CENTER | anchor point |
| Sword (blade center) | x≈309 | RIGHT | weapon mass |
| Left mass centroid | ~x=121 | LEFT | |
| Right mass centroid | ~x=309 | RIGHT | |

**Balance:** Left hair centroid is 72px left of figure center (193). Sword blade center is 116px right of figure center. The figure is **right-dominant by ~44px** — sword side is heavier, balanced by the longer hair fall on the left.

**Rule text:** The figure is deliberately asymmetric. Hair occupies the left negative space; sword occupies the right negative space. The two masses do not mirror each other. At thumbnail scale, the figure should read as: hair-side left (organic, falling) vs. sword-side right (rigid, planted). No element may bridge both sides simultaneously.

---

## 9. THUMBNAIL READABILITY RULE

Derived from scoring at 100×175px (0.25× scale of 400×720px canvas).

| Element | Minimum required at thumbnail | B score | D score |
|---|---|---|---|
| Helmet oval | Readable as portrait oval — NOT round | PASS | PASS |
| Sensor slits | Two horizontal thin gaps visible | PASS | PASS |
| Sword slab | Vertical rectangle distinct from body | PASS | PASS |
| Hair mass | Left-side solid mass distinct from body | PASS | PASS |
| Pauldrons | Shoulder line clearly wider than helmet | PASS | PASS |
| Asymmetry | Left-right imbalance readable | PASS | PASS |
| Not samurai | Silhouette does NOT read as kimono/katana | PASS | PASS |
| Memorability | Identified in under 2 seconds | PASS | PASS |

**Rule text:** At any scale down to 100×175px (thumbnail), all eight criteria above must remain readable. If a pose or camera angle causes any element to fail at thumbnail scale, that output fails the readability gate.

---

## 10. CANDIDATE STATUS TABLE

| Candidate | Status | Permitted use |
|---|---|---|
| B — THE MONOLITH | **PRIMARY — carry forward** | Canon proportions baseline. Planted sword stance. |
| D — THE PRESENCE | **SECONDARY variant** | Pauldron width rule extension. Near-vertical sword. High-presence shots only. |
| A — THE DIAGONAL | Motion/action exploration only | May use for action poses in future exploration. Not for lock. |
| C — THE CARRY | **REJECTED — CONDITIONAL (85)** | Sword/pauldron merge at thumbnail. Do not carry forward. |

---

## 11. WHAT IS NOT LOCKED

- This document defines proportion rules only.
- No material, color, texture, or detail is locked here.
- No generation outputs are approved by this document.
- Final canon lock requires a separate CANON_LOCK decision event.
- These are silhouette geometry constraints only.

---

*Generated: 2026-05-15 | Task: MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC | Not canon-locked*
