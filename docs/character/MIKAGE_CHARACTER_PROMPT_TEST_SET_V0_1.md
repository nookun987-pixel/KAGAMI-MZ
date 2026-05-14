# MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1

**TASK_ID:** GENERATE_CHARACTER_PROMPT_TEST_SET_V0_1_FROM_LIBRARY
**Version:** v0.1
**Date:** 2026-05-15
**Source:** docs/character/MIKAGE_CHARACTER_PROMPT_LIBRARY_v0.1.md
**Status:** READY TO USE — paste each prompt block into your image generation tool
**Canon-Locked:** NO
**Asset-Locked:** NO
**Public-Ready:** NO

> Run all 8 steps in order. Score each output against Section 12 of the library before moving to the next step.
> If Step N has a D-01 (helmet) or D-03 (sword) FAIL — STOP. Do not run Step N+1. Rebuild prompt first.

---

## UNIVERSAL NEGATIVE PROMPT

**Paste this into the NEGATIVE PROMPT field for EVERY step.**

```
eye slit, visor, glowing eyes, open helmet, eyes visible, face visible, mouth, lips, chin, jaw opening, expression, smile, frown, sad, angry, happy, horns, demon horns, skull, skull motif, warm colors, gold, orange, cream, warm ivory, red glow, red accent, fire glow, organic blade, thinning sword, pointed sword, katana, longsword, curved blade, elegant sword, runes on sword, energy blade, glowing sword, spiky armor, ornate armor, baroque armor, fantasy armor, exposed skin, skin at joints, mechanical joints, hydraulics, pistons, robot aesthetic, mech suit, anime face, anime style, chibi, cute, deformed, soft, kawaii, heroic fantasy, medieval fantasy, sci-fi hard, cyberpunk, symmetrical forward pose, portrait forward facing symmetry, over-lit, warm ambient, golden hour, sunset light, studio portrait, shallow bokeh background, 3D render, CGI sheen, photorealistic skin, photorealistic eyes, stock photo style, watermark, signature, text overlay, low quality, blurry, artifacts
```

---

## STEP 1 — Standard Helmet
**Source:** Section 3.1
**Purpose:** Establish helmet fidelity as baseline
**Primary drift risk:** Eye slit / visor / warm tint

### POSITIVE PROMPT
```
sealed porcelain white helmet, fully enclosed smooth ovoid form, no eye slit, no visor, no mouth, no facial opening of any kind, matte cool white ceramic surface, faint silver structural seam lines on surface, single small circle seal glyph in electric violet at lower face area, void black background, faint violet ambient halo light, slight silver light catch at upper left, slightly oversized relative to body, sacred ancient-tech material quality, ultra-detailed concept art render
```

### NEGATIVE PROMPT (combine with Universal above)
```
eye, eyes, visor, slit, opening, hole, mouth, lips, chin, jaw, expression, smile, frown, skull, horns, crown, spikes, warm color, gold, orange, red, glow behind visor, transparent helmet, cracked, broken, organic, skin texture, anime face, robot face, mechanical parts
```

---

## STEP 2 — Standard Sword
**Source:** Section 5.1
**Purpose:** Establish sword mass and form
**Primary drift risk:** Taper / point / katana drift

### POSITIVE PROMPT
```
massive rectangular monolith slab sword, pure matte black, no taper, same width from guard to tip, perfectly rectangular cross-section, larger and heavier than any person could carry, horizontal rectangular guard bar, single 1px silver-white edge catch highlight on one face, void black background, architectural weight, no glow no runes no energy, ink render, concept art
```

### NEGATIVE PROMPT (combine with Universal above)
```
tapered blade, pointed tip, katana, longsword, curved edge, fantasy blade, ornate crossguard, runes, inscriptions, glowing edge, energy channel, fire, lightning, decorated guard, thin blade, graceful sword, elegant weapon, warm color sword, gold guard
```

---

## STEP 3 — Standard Silhouette
**Source:** Section 6.1
**Purpose:** Validate shape read at distance
**Primary drift risk:** Shoulder width narrow / sword diagonal lost

### POSITIVE PROMPT
```
full body silhouette character art, sealed smooth round helmet, wide shoulder pauldrons, massive rectangular black monolith sword diagonal lower right, long cloak trailing as secondary edge, pure black filled mass on aged paper texture, gestural ink illustration, single figure centered, negative space composition, no face no features, architectural presence reads at distance
```

### NEGATIVE PROMPT (combine with Universal above)
```
face features, eye detail, armor texture, color, gradients, soft edges, organic hair as primary shape, thin figure, narrow shoulders, small sword, curved sword, horns, crown, cape as dominant shape
```

---

## STEP 4 — Standard Full-Body
**Source:** Section 4.1
**Purpose:** First full figure test — all drift risks active simultaneously
**Primary drift risk:** All drifts active at once

### POSITIVE PROMPT
```
Mikage full body character concept art, sealed porcelain white smooth ovoid helmet no eye slit no visor no face opening, wide flat-topped white pauldrons significantly wider than head, white plate armor chest single vertical seam, massive rectangular black slab sword held diagonally tip near ground right side, long dark cloak as secondary silhouette extension, void black background, electric violet accent glow, silver structural seam detail, sacred-tech aesthetic, ink illustration on textured paper, high contrast, monumental still pose, diagonal composition anchored by sword
```

### NEGATIVE PROMPT (combine with Universal above)
```
eye slit, visor, glowing eyes, open helmet, face, expression, smile, horns, demon, skull, spiky armor, thinning sword, pointed sword, katana, curved blade, warm colors, gold, orange, red glow, exposed skin, mechanical joints, anime style, cute, chibi, cartoon, symmetrical forward pose, cape as primary shape, over-detailed background
```

---

## STEP 5 — Helmet Close-Up
**Source:** Section 3.2
**Purpose:** Push helmet material quality
**Primary drift risk:** Transparency hint / expression hint on featureless surface

### POSITIVE PROMPT
```
extreme close-up portrait of sealed porcelain helmet, smooth featureless ovoid ceramic form, absolutely no eyes no visor no mouth no slit no opening, matte white surface with cool silver-grey tonal shift, very faint vertical center panel seam, very faint horizontal structural band mid-helmet, small circle seal glyph electric violet lower center, void black background, electric violet ambient glow behind, silver light catch upper left ridge, grain texture, ink illustration render style, high contrast, sacred stillness
```

### NEGATIVE PROMPT (combine with Universal above)
```
eye, eyes, visor, slit, opening, hole, mouth, lips, chin, jaw, expression, smile, frown, skull, horns, crown, spikes, warm color, gold, orange, red, glow behind visor, transparent helmet, cracked, broken, organic, skin texture, anime face, robot face, mechanical parts
```

---

## STEP 6 — Three-Quarter View
**Source:** Section 4.3
**Purpose:** Preferred default angle validation
**Primary drift risk:** Pose drift / sword angle loss

### POSITIVE PROMPT
```
Mikage three-quarter view character art, sealed white helmet no openings, wide shoulder pauldrons white armor, massive matte black rectangular monolith slab sword diagonal in right hand tip near ground, dark cloak flowing left secondary shape, void black background radial, electric violet edge halo faint, silver seam catch, sacred-tech ink render, textured paper, high contrast, still pose, weight and mass over speed
```

### NEGATIVE PROMPT (combine with Universal above)
```
eye slit, visor, glowing eyes, open helmet, face, expression, smile, horns, demon, skull, spiky armor, thinning sword, pointed sword, katana, curved blade, warm colors, gold, orange, red glow, exposed skin, mechanical joints, anime style, cute, chibi, cartoon, symmetrical forward pose, cape as primary shape, over-detailed background
```

---

## STEP 7 — Atmospheric Presence
**Source:** Section 8.4
**Purpose:** Full atmosphere + environment test
**Primary drift risk:** Background too busy / warm light source drift

### POSITIVE PROMPT
```
deep void black background, Mikage standing, faint violet radial glow behind at shoulder level, silver light catch from unknown source above-right, electric violet mist at feet, absolute stillness, no wind effect, sacred-tech atmosphere, zero narrative action — pure presence, sealed porcelain white ovoid helmet no openings, wide white pauldrons, massive black rectangular slab sword diagonal, dark cloak secondary shape
```

### NEGATIVE PROMPT (combine with Universal above)
```
busy background, landscape, city, ruins, temple architecture as primary, clouds, stars visible, warm light sources, fire, sunset, sunrise, colored sky, fog covering figure, busy ground texture, other figures, crowds, decorative props
```

---

## STEP 8 — Sword Planted Vertical
**Source:** Section 4.4
**Purpose:** Alternate pose / proportion + scale validation
**Primary drift risk:** Sword scale shrinks / proportion drifts

### POSITIVE PROMPT
```
Mikage full body standing pose, sword planted vertically beside figure, sealed porcelain white ovoid helmet, wide white armor pauldrons, massive rectangular black slab sword vertical to right side nearly as tall as figure, long dark cloak, void black background, faint violet atmospheric mist rising from ground, silver armor edge catch, sacred stillness, ink illustration, cinematic composition
```

### NEGATIVE PROMPT (combine with Universal above)
```
eye slit, visor, glowing eyes, open helmet, face, expression, smile, horns, demon, skull, spiky armor, thinning sword, pointed sword, katana, curved blade, warm colors, gold, orange, red glow, exposed skin, mechanical joints, anime style, cute, chibi, cartoon, symmetrical forward pose, cape as primary shape, over-detailed background
```

---

## SCORING TRACKER

Fill in after generating each step. Use the scoring table below.

| Step | Prompt Block | Helmet (20) | Sword (15) | Palette (15) | Silhouette (15) | Armor (10) | Pauldrons (10) | Aesthetic (10) | Cloak (5) | TOTAL | D-01 | D-03 | VERDICT |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Std Helmet | | — | | | — | — | | — | /65 | | — | |
| 2 | Std Sword | — | | | — | — | — | | — | /30 | — | | |
| 3 | Silhouette | | | | | | | | | /100 | | | |
| 4 | Full-Body | | | | | | | | | /100 | | | |
| 5 | Helmet CU | | — | | — | — | — | | — | /65 | | — | |
| 6 | 3Q View | | | | | | | | | /100 | | | |
| 7 | Atmosphere | | | | | | | | | /100 | | | |
| 8 | Sword Plant | | | | | | | | | /100 | | | |

**Score per criterion:** 0 = fail / 1 = partial / 2 = pass × weight
**VERDICT:** STRONG (90–100) / CONDITIONAL (75–89) / WEAK (50–74) / REJECT (<50)
**MANDATORY REJECT:** Helmet = 0 OR Sword = 0 regardless of total score.

---

## DRIFT CHECKLIST (run per image)

| # | Check | Result (PASS/FAIL) | Notes |
|---|---|---|---|
| D-01 | Helmet fully sealed — no openings | | |
| D-02 | Helmet palette — cool porcelain white only, no warm tint | | |
| D-03 | Sword form — perfectly rectangular slab, no taper | | |
| D-04 | Sword material — matte black only, no glow/runes | | |
| D-05 | Armor palette — cool white to silver only | | |
| D-06 | Armor coverage — no exposed skin | | |
| D-07 | Pauldrons width — significantly wider than head | | |
| D-08 | Silhouette read — helmet + pauldrons + sword readable at distance | | |
| D-09 | Violet usage — accent only (halo/glyph/mist), not primary surface | | |
| D-10 | Pose — diagonal, not symmetrical front-facing | | |
| D-11 | Cloak role — secondary geometry only | | |
| D-12 | Aesthetic axis — sacred-tech, not anime/mech/demon/fantasy | | |
| D-13 | Expression — none, pure sealed stillness | | |
| D-14 | Background — void black or paper/ink only | | |

**14/14 required to advance. Any D-01 or D-03 FAIL = immediate reject.**

---

*MIKAGE_CHARACTER_PROMPT_TEST_SET_V0_1 — PROMPT_LIBRARY_DRAFT — not canon-locked — not asset-locked — not public-ready*
