# MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1

**Status:** PROMPT_LIBRARY_DRAFT — CANON PATCH APPLIED 2026-05-15
**Version:** v0.1 · derived from CHARACTER_CONCEPT_MIKAGE_v0.1 · patched per MIKAGE_CANON_CONFLICT_RESOLUTION_V1
**Studio:** Mikage Zenith Studio
**Last Updated:** 2026-05-15
**Canon-Locked:** NO — do not asset-lock from this document
**Asset-Locked:** NO
**Public-Ready:** NO

> This library is a controlled prompt reference for AI image generation testing.
> All prompts must be scored against the Review Scoring Table (Section 12) before any output is considered for further use.
> Do not use this document to approve canon, lock assets, or mark designs production-ready.

**PATCH NOTES 2026-05-15:**
- Helmet: sensor slits now REQUIRED (two ultra-narrow horizontal void-black slits) — not fully sealed blank
- Accent color: #8F00FF (primary violet) / #7B2FFF (video/UI variant) — crimson is legacy/deprecated for Character V1
- Hair: long heavy straight black hair added to all full-body and silhouette prompts — mandatory

---

## 1. Status / Gate

| Field | Value |
|---|---|
| PROMPT_LIBRARY_STATUS | PROMPT_LIBRARY_DRAFT — canon patch applied |
| CANON_LOCKED | NO |
| ASSET_LOCKED | NO |
| PUBLIC_READY | NO |
| SOURCE_CONCEPT | CHARACTER_CONCEPT_MIKAGE_v0.1.md |
| SOURCE_REVEAL | mikage_character_reveal_v02.html |
| CANON_PATCH | MIKAGE_CANON_CONFLICT_RESOLUTION_V1 (2026-05-15) |
| REVIEW_CYCLE | v0.1 — patched — first generation test set pending |
| NEXT_SAFE_TASK | MIKAGE_CHARACTER_SOURCE_PACK_V1 |

**Hard rules active for this library:**
- Helmet: matte white porcelain with two ultra-narrow horizontal void-black sensor slits — no pupils, no iris, not human eyes
- Sword remains massive rectangular monolith slab: no taper, no katana form, no ornate fantasy blade
- Armor remains sealed white porcelain: no exposed skin, no warm tones
- Palette locked: void black `#050508`, porcelain white `#f2eeea`, electric violet `#8F00FF` / `#7B2FFF`
- Hair: long heavy straight black hair — mandatory in full-body and silhouette prompts
- Crimson `#E60000` is LEGACY/DEPRECATED for Character V1 — do not use as accent

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
| Electric violet | `#8F00FF` | Primary accent — halo, seal glyph, sensor slit ambient |
| Violet UI variant | `#7B2FFF` | Video/UI overlay, atmospheric edge |
| Sensor slit | `#050508` / void black | The slit surface itself — no glow, no color |
| Crimson (LEGACY) | `#E60000` | DEPRECATED for Character V1 — do not use as prompt accent |

### 2.2 Silhouette Hierarchy (must read in this order)

1. **Helmet** — matte white porcelain ovoid, slightly oversized, two ultra-narrow horizontal void-black sensor slits at eye level
2. **Pauldrons** — wide flat-topped shoulder plates, horizontal width anchor
3. **Monolith sword** — massive diagonal rectangular slab, lower-right quadrant
4. **Hair** — long heavy straight black hair, secondary downward mass, contributes to silhouette
5. **Body/cloak** — vertical column, tertiary read only

### 2.3 Absolute Prohibitions (all prompts)

- Human pupils, irises, human eye shape behind any slit or surface
- Glowing eyes, colored eye glow, anime eye effect
- Mouth, chin strap, lower jaw opening, face cut, nose visible
- Warm tones: gold, orange, cream, red in armor
- Thinning or tapered sword tip
- Organic blade curve or katana form
- Spiky or ornate armor panels
- Horns, skull motifs, demon visual language
- Exposed skin at any armor joint
- Mechanical/robotic exposed joints or hydraulics
- Symmetrical front-facing pose as default (prefer diagonal)
- Anime face, chibi form, cute softening
- Expression of any kind — sensor slits are void, not expressive
- Colored or short hair — hair must be long, straight, heavy, black only
- Crimson as accent color

---

## 3. Helmet Prompt Block

### 3.1 Standard Helmet Prompt

```
matte white porcelain helmet, smooth ovoid ceramic form, two ultra-narrow horizontal void-black sensor slits at eye level, no pupils no iris no human eye shape, sensor slits are void black not glowing, cool white ceramic surface, faint silver structural seam lines, single small circle seal glyph in electric violet #8F00FF at lower face area, void black background, faint violet ambient halo light, slight silver light catch at upper left, slightly oversized relative to body, sacred ancient-tech material quality, ultra-detailed concept art render
```

### 3.2 Helmet Close-Up Prompt

```
extreme close-up portrait of matte white porcelain helmet, smooth ceramic ovoid form, two ultra-narrow horizontal void-black sensor slits, no pupils no iris no expression behind slits — slits are pure void black, cool white surface with silver-grey tonal shift, very faint vertical center panel seam, very faint horizontal structural band mid-helmet, small circle seal glyph electric violet #8F00FF lower center, void black background, electric violet #8F00FF ambient glow behind helmet, silver light catch upper left ridge, grain texture, ink illustration render style, high contrast, sacred stillness
```

### 3.3 Helmet Variant — Violet Ambient Emphasis

```
matte white porcelain helmet close-up, smooth ovoid with two ultra-narrow void-black sensor slits, electric violet #8F00FF glow ambient behind and beneath helmet, silver structural edge reflection, faint seal glyph violet circle emblem, deep void black background, matte ceramic material, no human expression no pupils, sacred-tech aesthetic, cinematic lighting, atmospheric illustration
```

### 3.4 Helmet Negative Prompt (append to all helmet prompts)

```
human eyes, pupils, irises, glowing eyes, colored eye, anime eye, glowing slit, visor glow, expression, smile, frown, mouth, lips, chin, jaw, skull, horns, crown, spikes, warm color, gold, orange, red, transparent helmet, cracked helmet, broken helmet, organic surface, skin texture, anime face, robot face, mechanical exposed parts, short hair, colored hair
```

---

## 4. Full-Body Prompt Block

### 4.1 Standard Full-Body Prompt

```
Mikage full body character concept art, matte white porcelain helmet with two ultra-narrow void-black horizontal sensor slits, wide flat-topped white pauldrons significantly wider than head, white plate armor chest single vertical seam, massive rectangular black slab sword held diagonally tip near ground right side, long heavy straight black hair falling behind armor as secondary silhouette, long dark cloak as tertiary silhouette extension, void black background, electric violet #8F00FF accent glow, silver structural seam detail, sacred-tech aesthetic, ink illustration on textured paper, high contrast, monumental still pose, diagonal composition anchored by sword
```

### 4.2 Full-Body — Distant Shot Silhouette Priority

```
Mikage character full body distant shot, white helmet with narrow void sensor slits, wide armor pauldrons, long heavy black hair visible behind armor, long dark cloak, massive diagonal black rectangular slab sword at right side, full silhouette read, architectural presence, void black ground, minimal atmospheric violet #8F00FF ambient, ink illustration style, grain texture, sacred-tech, monumental scale, shape language priority
```

### 4.3 Full-Body — Three-Quarter View

```
Mikage three-quarter view character art, matte white helmet narrow void-black sensor slits no human eyes, wide shoulder pauldrons white armor, massive matte black rectangular monolith slab sword diagonal in right hand tip near ground, long heavy straight black hair flowing down behind, dark cloak secondary shape, void black background radial, electric violet #8F00FF edge halo faint, silver seam catch, sacred-tech ink render, textured paper, high contrast, still pose, weight and mass over speed
```

### 4.4 Full-Body — Sword Planted (Vertical Rest)

```
Mikage full body standing pose, sword planted vertically beside figure, matte white porcelain helmet narrow horizontal sensor slits, wide white armor pauldrons, long heavy straight black hair behind armor, massive rectangular black slab sword vertical to right side nearly as tall as figure, long dark cloak, void black background, faint violet #8F00FF atmospheric mist rising from ground, silver armor edge catch, sacred stillness, ink illustration, cinematic composition
```

### 4.5 Full-Body Negative Prompt (append to all full-body prompts)

```
human eyes, pupils, irises, glowing eyes, open face, expression, smile, horns, demon, skull, spiky armor, thinning sword, pointed sword, katana, curved blade, warm colors, gold, orange, red glow, exposed skin, mechanical joints, anime style, cute, chibi, cartoon, symmetrical forward pose, cape as primary shape, over-detailed background, short hair, colored hair, hair pinned up, hair revealing face
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
tapered blade, pointed tip, katana, longsword, curved edge, fantasy blade, ornate crossguard, runes, inscriptions, glowing edge, energy channel, fire, lightning, decorated guard, thin blade, graceful sword, elegant weapon, warm color sword, gold guard, crimson glow
```

---

## 6. Silhouette Prompt Block

### 6.1 Standard Silhouette Prompt

```
full body silhouette character art, white helmet with two narrow dark sensor slits, wide shoulder pauldrons, long heavy straight black hair contributing to lower silhouette mass, massive rectangular black monolith sword diagonal lower right, long cloak trailing as secondary edge, pure black filled mass on aged paper texture, gestural ink illustration, single figure centered, negative space composition, architectural presence reads at distance
```

### 6.2 Silhouette — High Contrast Ink

```
pure black ink silhouette on textured off-white paper, armored figure full body, helmet with sensor slits, wide pauldrons, long straight black hair as downward mass, rectangular slab sword diagonal, cloak extension secondary, one solid black mass, ink wash and grain, no color, monumental presence, graphic design level clarity
```

### 6.3 Silhouette — Distance Read Test

```
small figure silhouette on void black background, full body readable at extreme distance, helmet with narrow horizontal slits visible, pauldrons width readable, long black hair mass visible, diagonal rectangular sword mass clear, vertical body column, architectural composition, pure white silhouette on black, no detail only mass, sacred-tech identity legible from shape alone
```

### 6.4 Silhouette Negative Prompt

```
human face features, eye detail visible as human eyes, armor texture, color, gradients, soft edges, thin figure, narrow shoulders, small sword, curved sword, horns, crown, cape as dominant shape, short hair, colorful hair, bundled hair
```

---

## 7. Material / Detail Prompt Block

### 7.1 Porcelain Helmet Material

```
porcelain white matte ceramic surface, cool white with subtle silver-grey tonal shift, no shine, no gloss, no mirror reflection, micro-texture of fine ceramic grain, gentle catch of cool white light on upper curve, structural seam lines as panel construction marks only, two ultra-narrow horizontal recessed void-black sensor slit channels — recessed not glowing, sacred material quality, ancient-tech craft
```

### 7.2 Armor Plate Material

```
white plate armor, porcelain-to-silver-grey tonal range, matte smooth surface, no exposed joints, no skin gaps, geometric panel seams cool silver, single horizontal armor band at chest, no decoration no ornamentation, sealed total coverage, sacred-tech material, cool white only — no warm ivory no gold trim no crimson
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
electric violet accent light, #8F00FF to #7B2FFF range, used only as: ambient halo behind figure, small seal glyph emblem on helmet lower face, faint seam trace accent (very subtle), atmospheric mist at ground, faint ambient within sensor slit recess — never as primary surface color, never as sword glow, never as crimson replacement fill
```

---

## 8. Environment Prompt Block

### 8.1 Void Environment (Primary)

```
void black environment, infinite dark space, no ground plane visible, no horizon, no sky, no props, no architecture — only the figure and darkness, radial void gradient darker at edges, electric violet #8F00FF atmospheric mist faint at lower frame, silver light source implied by armor catch — no source visible
```

### 8.2 Dark Ground Plane

```
black void ground, reflective only very slightly — figure casts downward shadow, no environmental detail, no texture on ground, low violet #8F00FF atmospheric mist rising near feet, figure isolated in void, cinematic single-figure composition
```

### 8.3 Paper / Ink Environment (for sketch and silhouette phases)

```
aged off-white textured paper background, ink wash grain, no environmental elements, pure figure on paper, negative space composition, graphic, flat — no shadow drop, paper color is background color
```

### 8.4 Atmospheric Presence Shot

```
deep void black background, Mikage standing, faint violet #8F00FF radial glow behind at shoulder level, silver light catch from unknown source above-right, electric violet mist at feet, absolute stillness, no wind effect, sacred-tech atmosphere, zero narrative action — pure presence, long heavy straight black hair falling still
```

### 8.5 Environment Negative Prompt

```
busy background, landscape, city, ruins, temple architecture as primary, clouds, stars visible, warm light sources, fire, sunset, sunrise, colored sky, fog covering figure, busy ground texture, other figures, crowds, decorative props, crimson ambient
```

---

## 9. Universal Negative Prompt

Apply to every generation without exception. Combine with section-specific negative prompts.

```
human eyes, pupils, irises, human eye shape, glowing eyes behind slit, colored eye effect, visor glow, open face, face visible, mouth, lips, chin, jaw opening, expression, smile, frown, sad, angry, happy, horns, demon horns, skull, skull motif, warm colors, gold, orange, cream, warm ivory, red glow, red accent, crimson accent, fire glow, organic blade, thinning sword, pointed sword, katana, longsword, curved blade, elegant sword, runes on sword, energy blade, glowing sword, spiky armor, ornate armor, baroque armor, fantasy armor, exposed skin, skin at joints, mechanical joints, hydraulics, pistons, robot aesthetic, mech suit, anime face, anime style, chibi, cute, deformed, soft, kawaii, heroic fantasy, medieval fantasy, sci-fi hard, cyberpunk, symmetrical forward pose, portrait forward facing symmetry, over-lit, warm ambient, golden hour, sunset light, studio portrait, shallow bokeh background, 3D render, CGI sheen, photorealistic skin, photorealistic eyes, stock photo style, watermark, signature, text overlay, low quality, blurry, artifacts, short hair, colored hair, bundled hair, hair pinned up, floating hair
```

---

## 10. Forbidden Drift Checklist

Run against every generated image before any further use. All items must be PASS to proceed.

| # | Check | Fail Condition | Pass Condition |
|---|---|---|---|
| D-01 | Helmet sensor slits | Human eye shape / pupil / iris visible; OR sensor slits completely absent | Two ultra-narrow void-black horizontal slits present, no human eye read |
| D-02 | Helmet palette | Warm ivory, gold trim, warm tint on helmet | Cool porcelain white to silver-grey only |
| D-03 | Sword form | Any taper, curve, point, katana silhouette | Perfectly rectangular slab end-to-end |
| D-04 | Sword material | Glow, runes, energy, warm color, crimson | Pure matte black, 1px silver catch only |
| D-05 | Armor palette | Gold, orange, cream, red, warm tones, crimson | Cool white to silver-grey only |
| D-06 | Armor coverage | Exposed skin, gap at joints | Total sealed coverage |
| D-07 | Pauldrons width | Narrower than head | Significantly wider than head |
| D-08 | Silhouette read | Shape ambiguous at distance | Helmet + pauldrons + slab sword + hair mass readable |
| D-09 | Violet usage | Crimson as accent; or violet as primary surface fill | Violet #8F00FF as accent only: halo, glyph, mist, slit ambient |
| D-10 | Pose | Symmetrical front-facing default | Diagonal stance, sword anchors angle |
| D-11 | Cloak role | Cloak dominant over armor/sword in read | Secondary geometry only |
| D-12 | Aesthetic axis | Anime, mech, demon, heroic fantasy, cute | Sacred-tech: architectural, cold, sealed |
| D-13 | Expression | Any emotional read from character; slit appearing expressive | None — slits are void, not eyes |
| D-14 | Background | Warm, busy, landscape, warm ambient, crimson ambient | Void black or paper/ink only |
| D-15 | Hair | Short hair, colorful hair, missing hair in full-body shots, hair revealing face | Long heavy straight black hair — present, not dominant |

**Scoring:** Count PASS items. 15/15 required to advance to next review gate.
Any D-01 or D-03 FAIL = immediate reject, do not score further.
D-01 NOTE: Sensor slits absent (fully blank helmet) also = FAIL — slits are identity-defining.

---

## 11. Recommended First Generation Sequence

Run in this order for the first test set. Each step validates a subset of canon rules before the next.

| Step | Prompt Block | Purpose | Key Drift Risk to Watch |
|---|---|---|---|
| 1 | Section 3.1 — Standard Helmet | Establish helmet + sensor slit fidelity as baseline | Human eye read in slit / slit absent / warm tint |
| 2 | Section 5.1 — Standard Sword | Establish sword mass and form | Taper, point, katana drift |
| 3 | Section 6.1 — Standard Silhouette | Validate shape read at distance | Shoulder width, sword diagonal, hair mass |
| 4 | Section 4.1 — Standard Full-Body | First full figure test | All drifts active simultaneously |
| 5 | Section 3.2 — Helmet Close-Up | Push helmet material + slit quality | Human eye drift in close-up / slit glow |
| 6 | Section 4.3 — Three-Quarter View | Preferred default angle | Pose drift, sword angle loss, hair |
| 7 | Section 8.4 — Atmospheric Presence | Full atmosphere test | Background busy, warm light, crimson drift |
| 8 | Section 4.4 — Sword Planted Vertical | Alternate pose validation | Proportion check, scale check, hair |

**Scoring after each step:** Apply Forbidden Drift Checklist (Section 10) and Review Scoring Table (Section 12).
Do not advance to Step N+1 if Step N has a D-01 or D-03 FAIL.

---

## 12. Review Scoring Table

Use this table for every image reviewed from the test set.

| Criterion | Weight | Score 0 | Score 1 | Score 2 |
|---|---|---|---|---|
| Helmet + sensor slits (identity) | 20 | Human eye visible; OR slits absent entirely | Slits present but ambiguous — approaching human eye read OR barely visible | Two ultra-narrow void-black horizontal slits, clearly present, no human eye read |
| Sword rectangular form | 15 | Tapered or curved | Mostly rectangular, slight softening | Perfect rectangular slab |
| Palette correctness | 15 | Warm drift (gold/orange/red/crimson as accent) | Mostly correct, minor tone shift | Void/porcelain/violet(#8F00FF)/silver accurate |
| Silhouette legibility | 15 | Cannot read at distance | Readable with effort | Immediately clear — helmet + pauldrons + sword + hair |
| Armor coverage | 10 | Exposed skin or gaps | Minor gap concern | Fully sealed |
| Pauldron width | 10 | Narrower than or equal to head | Slightly wider | Significantly wider |
| Aesthetic axis | 10 | Anime/mech/demon/fantasy | Borderline — some sacred-tech reads | Sacred-tech clearly dominant |
| Hair presence + hierarchy | 5 | Hair absent in full-body shot; or hair dominates composition | Hair present but short/colored/styled wrong | Long heavy straight black hair — present, contributes to silhouette, not dominant |

**Maximum score:** 100 points.

**Thresholds:**
- 90–100: Strong candidate — advance to review gate
- 75–89: Conditional — note specific fails, retry with adjusted prompt
- 50–74: Weak — significant drift detected, rebuild prompt before retry
- Below 50: Reject — do not use, document failure mode, flag drift category

**Mandatory reject regardless of score:**
- Helmet criterion score = 0 (human eye visible OR slits absent)
- Sword criterion score = 0 (tapered or curved)

---

*PROMPT_LIBRARY_DRAFT — canon patch applied 2026-05-15 — not canon-locked — not asset-locked — not public-ready*
*Do not use to approve production assets or lock designs.*
*Maintained by Mikage Zenith Studio.*
