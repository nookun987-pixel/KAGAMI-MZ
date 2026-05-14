# MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1

**Status:** PROMPT_LIBRARY_DRAFT
**Version:** v0.1 · derived from CHARACTER_CONCEPT_MIKAGE_v0.1
**Studio:** Mikage Zenith Studio
**Last Updated:** 2026-05-14
**Canon-Locked:** NO — do not asset-lock from this document
**Asset-Locked:** NO
**Public-Ready:** NO

> This library is a controlled prompt reference for AI image generation testing.
> All prompts must be scored against the Review Scoring Table (Section 12) before any output is considered for further use.
> Do not use this document to approve canon, lock assets, or mark designs production-ready.

---

## 1. Status / Gate

| Field | Value |
|---|---|
| PROMPT_LIBRARY_STATUS | PROMPT_LIBRARY_DRAFT |
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| PUBLIC_READY | NO |
| SOURCE_CONCEPT | CHARACTER_CONCEPT_MIKAGE_v0.1.md |
| SOURCE_REVEAL | mikage_character_reveal_v02.html |
| REVIEW_CYCLE | v0.1 — first generation test set pending |
| NEXT_SAFE_TASK | GENERATE_CHARACTER_PROMPT_TEST_SET_V0_1_FROM_LIBRARY |

**Hard rules active for this library:**
- Helmet remains fully sealed: no eyes, no visor, no mouth, no face opening of any kind
- Sword remains massive rectangular monolith slab: no taper, no katana form, no ornate fantasy blade
- Armor remains sealed white porcelain: no exposed skin, no warm tones
- Palette locked: void black `#050508`, porcelain white `#f2eeea`, electric violet `#7b5ea7` / `#9d7fd0`, silver `#a0a0b0`
- No anime face, cute, warm, heroic fantasy, demon, or robot/mech drift

---

## 2. Canon-Safe Visual Constants

These values are locked for all prompt variants in this library. Do not deviate.

### 2.1 Palette

| Token | Hex | Role |
|---|---|---|
| Void black | `#050508` | Background, sword fill, shadow mass |
| Void mid | `#0d0d14` | Dark atmosphere, ambient shadow |
| Porcelain white | `#f2eeea` | Helmet primary, armor primary |
| Porcelain dim | `#c8c4be` | Armor secondary, shadow on white |
| Silver | `#a0a0b0` | Structural seams, edge catch, guard |
| Electric violet | `#7b5ea7` | Accent glow, seal glyph |
| Violet glow | `#9d7fd0` | Ambient halo, atmospheric edge |
| Violet deep | `#3d2e55` | Very subtle seam trace, subsurface only |

### 2.2 Silhouette Hierarchy (must read in this order)

1. **Helmet** — sealed ovoid, smooth, slightly oversized relative to body
2. **Pauldrons** — wide flat-topped shoulder plates, horizontal width anchor
3. **Monolith sword** — massive diagonal rectangular slab, lower-right quadrant
4. **Body/cloak** — vertical column, secondary read only

### 2.3 Absolute Prohibitions (all prompts)

- Eye slit, visor, glowing eyes, any helmet opening
- Mouth, chin strap, lower jaw opening, face cut
- Warm tones: gold, orange, cream, red in armor
- Thinning or tapered sword tip
- Organic blade curve or katana form
- Spiky or ornate armor panels
- Horns, skull motifs, demon visual language
- Exposed skin at any armor joint
- Mechanical/robotic exposed joints or hydraulics
- Symmetrical front-facing pose as default (prefer diagonal)
- Anime face, chibi form, cute softening
- Expression of any kind

---

## 3. Helmet Prompt Block

### 3.1 Standard Helmet Prompt

```
sealed porcelain white helmet, fully enclosed smooth ovoid form, no eye slit, no visor, no mouth, no facial opening of any kind, matte cool white ceramic surface, faint silver structural seam lines on surface, single small circle seal glyph in electric violet at lower face area, void black background, faint violet ambient halo light, slight silver light catch at upper left, slightly oversized relative to body, sacred ancient-tech material quality, ultra-detailed concept art render
```

### 3.2 Helmet Close-Up Prompt

```
extreme close-up portrait of sealed porcelain helmet, smooth featureless ovoid ceramic form, absolutely no eyes no visor no mouth no slit no opening, matte white surface with cool silver-grey tonal shift, very faint vertical center panel seam, very faint horizontal structural band mid-helmet, small circle seal glyph electric violet lower center, void black background, electric violet ambient glow behind, silver light catch upper left ridge, grain texture, ink illustration render style, high contrast, sacred stillness
```

### 3.3 Helmet Variant — Violet Ambient Emphasis

```
sealed porcelain white helmet close-up, smooth sealed ovoid no features, electric violet glow ambient behind and beneath helmet, silver structural edge reflection, faint seal glyph violet circle emblem, deep void black background, matte ceramic material, no eyes no expression, sacred-tech aesthetic, cinematic lighting, atmospheric illustration
```

### 3.4 Helmet Negative Prompt (append to all helmet prompts)

```
eye, eyes, visor, slit, opening, hole, mouth, lips, chin, jaw, expression, smile, frown, skull, horns, crown, spikes, warm color, gold, orange, red, glow behind visor, transparent helmet, cracked, broken, organic, skin texture, anime face, robot face, mechanical parts
```

---

## 4. Full-Body Prompt Block

### 4.1 Standard Full-Body Prompt

```
Mikage full body character concept art, sealed porcelain white smooth ovoid helmet no eye slit no visor no face opening, wide flat-topped white pauldrons significantly wider than head, white plate armor chest single vertical seam, massive rectangular black slab sword held diagonally tip near ground right side, long dark cloak as secondary silhouette extension, void black background, electric violet accent glow, silver structural seam detail, sacred-tech aesthetic, ink illustration on textured paper, high contrast, monumental still pose, diagonal composition anchored by sword
```

### 4.2 Full-Body — Distant Shot Silhouette Priority

```
Mikage character full body distant shot, sealed ovoid white helmet, wide armor pauldrons, long dark cloak, massive diagonal black rectangular slab sword at right side, full silhouette read, architectural presence, void black ground, minimal atmospheric violet ambient, ink illustration style, grain texture, sacred-tech, monumental scale, no face detail needed, pure shape language
```

### 4.3 Full-Body — Three-Quarter View

```
Mikage three-quarter view character art, sealed white helmet no openings, wide shoulder pauldrons white armor, massive matte black rectangular monolith slab sword diagonal in right hand tip near ground, dark cloak flowing left secondary shape, void black background radial, electric violet edge halo faint, silver seam catch, sacred-tech ink render, textured paper, high contrast, still pose, weight and mass over speed
```

### 4.4 Full-Body — Sword Planted (Vertical Rest)

```
Mikage full body standing pose, sword planted vertically beside figure, sealed porcelain white ovoid helmet, wide white armor pauldrons, massive rectangular black slab sword vertical to right side nearly as tall as figure, long dark cloak, void black background, faint violet atmospheric mist rising from ground, silver armor edge catch, sacred stillness, ink illustration, cinematic composition
```

### 4.5 Full-Body Negative Prompt (append to all full-body prompts)

```
eye slit, visor, glowing eyes, open helmet, face, expression, smile, horns, demon, skull, spiky armor, thinning sword, pointed sword, katana, curved blade, warm colors, gold, orange, red glow, exposed skin, mechanical joints, anime style, cute, chibi, cartoon, symmetrical forward pose, cape as primary shape, over-detailed background
```

---

## 5. Sword Prompt Block

### 5.1 Standard Sword Prompt

```
massive rectangular monolith slab sword, pure matte black, no taper, same width from guard to tip, perfectly rectangular cross-section, larger and heavier than any person could carry, horizontal rectangular guard bar, single 1px silver-white edge catch highlight on one face, void black background, architectural weight, no glow no runes no energy, ink render, concept art
```

### 5.2 Sword Detail Close-Up

```
close-up of massive black rectangular monolith sword blade, matte void black surface no reflection no glow, perfectly rectangular slab with no taper, rectangular guard bar solid horizontal, single thin silver light catch along one edge only, grain texture, dark void background, sacred-tech object concept art, weight and mass emphasis, no fantasy runes, no energy effect, no curve
```

### 5.3 Sword — Diagonal Carry Position

```
massive rectangular black slab sword held diagonally, grip at right shoulder height, tip near ground lower-right frame, rectangular slab body matte black, no taper no thinning no point, guard horizontal bar solid, arm partially obscured by sword mass, void black background, figure silhouette behind, architectural slab scale, ink illustration
```

### 5.4 Sword Negative Prompt (append to all sword prompts)

```
tapered blade, pointed tip, katana, longsword, curved edge, fantasy blade, ornate crossguard, runes, inscriptions, glowing edge, energy channel, fire, lightning, decorated guard, thin blade, graceful sword, elegant weapon, warm color sword, gold guard
```

---

## 6. Silhouette Prompt Block

### 6.1 Standard Silhouette Prompt

```
full body silhouette character art, sealed smooth round helmet, wide shoulder pauldrons, massive rectangular black monolith sword diagonal lower right, long cloak trailing as secondary edge, pure black filled mass on aged paper texture, gestural ink illustration, single figure centered, negative space composition, no face no features, architectural presence reads at distance
```

### 6.2 Silhouette — High Contrast Ink

```
pure black ink silhouette on textured off-white paper, armored figure full body, sealed ovoid head, wide pauldrons, rectangular slab sword diagonal, cloak extension secondary, one solid black mass, ink wash and grain, no color, no line detail visible, shape-only read, monumental presence, graphic design level clarity
```

### 6.3 Silhouette — Distance Read Test

```
small figure silhouette on void black background, full body readable at extreme distance, sealed round helmet visible, pauldrons width readable, diagonal rectangular sword mass clear, vertical body column, architectural composition, pure white silhouette on black, no detail only mass, sacred-tech identity legible from shape alone
```

### 6.4 Silhouette Negative Prompt

```
face features, eye detail, armor texture, color, gradients, soft edges, organic hair as primary shape, thin figure, narrow shoulders, small sword, curved sword, horns, crown, cape as dominant shape
```

---

## 7. Material / Detail Prompt Block

### 7.1 Porcelain Helmet Material

```
porcelain white matte ceramic surface, cool white with subtle silver-grey tonal shift, no shine, no gloss, no mirror reflection, micro-texture of fine ceramic grain, gentle catch of cool white light on upper curve, structural seam lines as panel construction marks only, sacred material quality, ancient-tech craft
```

### 7.2 Armor Plate Material

```
white plate armor, porcelain-to-silver-grey tonal range, matte smooth surface, no exposed joints, no skin gaps, geometric panel seams cool silver, single horizontal armor band at chest, no decoration no ornamentation, sealed total coverage, sacred-tech material, cool white only — no warm ivory no gold trim
```

### 7.3 Monolith Sword Material

```
pure matte void black slab, no surface reflection, no energy glow, no runes, slab face flat and absorbs light, single structural 1px silver-white edge catch permitted on lit face only, guard solid matte dark metal, rectangular — no organic surface quality, object of mass not weapon
```

### 7.4 Cloak Material

```
dark cloak, near-black or very deep grey, matte fabric with weight and gravity, reads as architectural shadow extension of armor, not as costume element, no color, no pattern, no embroidery, ragged hem permitted, secondary shape only — does not dominate composition
```

### 7.5 Violet Accent Material

```
electric violet accent light, #7b5ea7 to #9d7fd0 range, used only as: ambient halo behind figure, small seal glyph emblem on helmet lower face, faint seam trace accent (very subtle), atmospheric mist at ground — never as primary surface color, never as sword glow or eye glow
```

---

## 8. Environment Prompt Block

### 8.1 Void Environment (Primary)

```
void black environment, infinite dark space, no ground plane visible, no horizon, no sky, no props, no architecture — only the figure and darkness, radial void gradient darker at edges, electric violet atmospheric mist faint at lower frame, silver light source implied by armor catch — no source visible
```

### 8.2 Dark Ground Plane

```
black void ground, reflective only very slightly — figure casts downward shadow, no environmental detail, no texture on ground, low violet atmospheric mist rising near feet, figure isolated in void, cinematic single-figure composition
```

### 8.3 Paper / Ink Environment (for sketch and silhouette phases)

```
aged off-white textured paper background, ink wash grain, no environmental elements, pure figure on paper, negative space composition, graphic, flat — no shadow drop, paper color is background color
```

### 8.4 Atmospheric Presence Shot

```
deep void black background, Mikage standing, faint violet radial glow behind at shoulder level, silver light catch from unknown source above-right, electric violet mist at feet, absolute stillness, no wind effect, sacred-tech atmosphere, zero narrative action — pure presence
```

### 8.5 Environment Negative Prompt

```
busy background, landscape, city, ruins, temple architecture as primary, clouds, stars visible, warm light sources, fire, sunset, sunrise, colored sky, fog covering figure, busy ground texture, other figures, crowds, decorative props
```

---

## 9. Universal Negative Prompt

Apply to every generation without exception. Combine with section-specific negative prompts.

```
eye slit, visor, glowing eyes, open helmet, eyes visible, face visible, mouth, lips, chin, jaw opening, expression, smile, frown, sad, angry, happy, horns, demon horns, skull, skull motif, warm colors, gold, orange, cream, warm ivory, red glow, red accent, fire glow, organic blade, thinning sword, pointed sword, katana, longsword, curved blade, elegant sword, runes on sword, energy blade, glowing sword, spiky armor, ornate armor, baroque armor, fantasy armor, exposed skin, skin at joints, mechanical joints, hydraulics, pistons, robot aesthetic, mech suit, anime face, anime style, chibi, cute, deformed, soft, kawaii, heroic fantasy, medieval fantasy, sci-fi hard, cyberpunk, symmetrical forward pose, portrait forward facing symmetry, over-lit, warm ambient, golden hour, sunset light, studio portrait, shallow bokeh background, 3D render, CGI sheen, photorealistic skin, photorealistic eyes, stock photo style, watermark, signature, text overlay, low quality, blurry, artifacts
```

---

## 10. Forbidden Drift Checklist

Run against every generated image before any further use. All items must be PASS to proceed.

| # | Check | Fail Condition | Pass Condition |
|---|---|---|---|
| D-01 | Helmet sealed | Any eye slit, visor, opening, expression visible | Fully enclosed, no openings |
| D-02 | Helmet palette | Warm ivory, gold trim, warm tint on helmet | Cool porcelain white to silver-grey only |
| D-03 | Sword form | Any taper, curve, point, katana silhouette | Perfectly rectangular slab end-to-end |
| D-04 | Sword material | Glow, runes, energy, warm color | Pure matte black, 1px silver catch only |
| D-05 | Armor palette | Gold, orange, cream, red, warm tones | Cool white to silver-grey only |
| D-06 | Armor coverage | Exposed skin, gap at joints | Total sealed coverage |
| D-07 | Pauldrons width | Narrower than head | Significantly wider than head |
| D-08 | Silhouette read | Shape ambiguous at distance | Helmet + pauldrons + slab sword readable |
| D-09 | Violet usage | Violet as primary surface or sword glow | Accent only: halo, glyph, mist |
| D-10 | Pose | Symmetrical front-facing default | Diagonal stance, sword anchors angle |
| D-11 | Cloak role | Cloak dominant over armor/sword in read | Secondary geometry only |
| D-12 | Aesthetic axis | Anime, mech, demon, heroic fantasy, cute | Sacred-tech: architectural, cold, sealed |
| D-13 | Expression | Any emotional read from character | None — pure sealed stillness |
| D-14 | Background | Warm, busy, landscape, warm ambient | Void black or paper/ink only |

**Scoring:** Count PASS items. 14/14 required to advance to next review gate.
Any D-01 or D-03 FAIL = immediate reject, do not score further.

---

## 11. Recommended First Generation Sequence

Run in this order for the first test set. Each step validates a subset of canon rules before the next.

| Step | Prompt Block | Purpose | Key Drift Risk to Watch |
|---|---|---|---|
| 1 | Section 3.1 — Standard Helmet | Establish helmet fidelity as baseline | Eye slit, visor, warm tint |
| 2 | Section 5.1 — Standard Sword | Establish sword mass and form | Taper, point, katana drift |
| 3 | Section 6.1 — Standard Silhouette | Validate shape read at distance | Shoulder width, sword diagonal |
| 4 | Section 4.1 — Standard Full-Body | First full figure test | All drifts active simultaneously |
| 5 | Section 3.2 — Helmet Close-Up | Push helmet material quality | Transparency, expression hint |
| 6 | Section 4.3 — Three-Quarter View | Preferred default angle | Pose drift, sword angle loss |
| 7 | Section 8.4 — Atmospheric Presence | Full atmosphere test | Background busy, warm light |
| 8 | Section 4.4 — Sword Planted Vertical | Alternate pose validation | Proportion check, scale check |

**Scoring after each step:** Apply Forbidden Drift Checklist (Section 10) and Review Scoring Table (Section 12).
Do not advance to Step N+1 if Step N has a D-01 or D-03 FAIL.

---

## 12. Review Scoring Table

Use this table for every image reviewed from the test set.

| Criterion | Weight | Score 0 | Score 1 | Score 2 |
|---|---|---|---|---|
| Helmet sealed (no opening) | 20 | Any opening visible | Ambiguous — small shadow near face area | Fully sealed, no question |
| Sword rectangular form | 15 | Tapered or curved | Mostly rectangular, slight softening | Perfect rectangular slab |
| Palette correctness | 15 | Warm drift (gold/orange/red) | Mostly correct, minor tone shift | Void/porcelain/violet/silver accurate |
| Silhouette legibility | 15 | Cannot read at distance | Readable with effort | Immediately clear |
| Armor coverage | 10 | Exposed skin or gaps | Minor gap concern | Fully sealed |
| Pauldron width | 10 | Narrower than or equal to head | Slightly wider | Significantly wider |
| Aesthetic axis | 10 | Anime/mech/demon/fantasy | Borderline — some sacred-tech reads | Sacred-tech clearly dominant |
| Cloak hierarchy | 5 | Cloak dominates composition | Cloak competes with sword | Cloak is secondary geometry |

**Maximum score:** 100 points.

**Thresholds:**
- 90–100: Strong candidate — advance to review gate
- 75–89: Conditional — note specific fails, retry with adjusted prompt
- 50–74: Weak — significant drift detected, rebuild prompt before retry
- Below 50: Reject — do not use, document failure mode, flag drift category

**Mandatory reject regardless of score:**
- Helmet criterion score = 0 (any opening)
- Sword criterion score = 0 (tapered or curved)

---

*PROMPT_LIBRARY_DRAFT — not canon-locked — not asset-locked — not public-ready*
*Do not use to approve production assets or lock designs.*
*Maintained by Mikage Zenith Studio.*
