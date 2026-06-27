# MIKAGE — GPT IMAGE PROMPT PACK (V0.2)

> Status: UNCONFIRMED · prompts only · render is operator-run (Lane B).
> Brand palette LOCK: void black `#050508` · porcelain `#f2eeea` · cold grey · electric violet `#8F00FF` (signal only).
> GPT image models drift toward anime / cyberpunk warmth / added detail — generate several, REJECT any that break the exclusions.

---

## A. ~~SOLO / "PHANTOM" SINGLE COVER — COLOR FIX~~ — VOID / DO NOT USE
> WITHDRAWN 2026-06-28. False premise. Per `MIKAGE_PUBLIC_LORE_STANDARD_V1.md` (LOCKED), the
> dissolving arm's crimson `#E60000` (damage/dissolve ≤15% frame) + kintsugi gold seams are CANON
> on character covers, NOT a ban violation. Do not strip them. The PHANTOM cover/promo is compliant.
> (Kept below only as a record of the mistake.)

### Edit prompt (paste with the image)
```
Keep this exact composition, pose, faceless porcelain helmet, two thin violet sensor slits,
grey textured robe, and pure black background unchanged.
Only change the dissolving right arm: the disintegration particles and the glowing crack must be
COLD — porcelain white and faint electric-violet embers only. Remove every warm tone.
No orange, no amber, no gold, no red, no warm sparks anywhere. Monochrome cold dissolve.
Preserve grain and the quiet, monumental, high-negative-space mood.
```

### Hard exclusions (if the tool takes a negative field)
```
orange, amber, gold, warm light, red glow, embers warm, fire, kintsugi gold, anime, glossy skin,
extra characters, HUD, UI, neon, cyan, teal, busy background
```

### Filing suggestion (operator places)
`production/character/keyart_candidates/MIKAGE_PHANTOM_SINGLE_COVER_V0_3_COLDFIX_UNCONFIRMED.png`
(This is a SINGLE COVER, not the world key art — keep the names separate.)

---

## B. WORLD SIGNAL KEY ART — V0.2b (refined re-roll)
Builds on the strong V0.2 hit. Two fixes vs. last roll: (1) ghosts → fainter, featureless SIGNAL
mist (no human faces); (2) Mikage shell gets thin kintsugi GOLD seams (ART canon, fractured-but-intact).
Aspect 2:3 portrait, mid-thigh-up crop. Affirmative phrasing (GPT summons a face if you say "no face").

### Main prompt
```
A monumental editorial key-art poster, vertical 2:3, framed mid-thigh up.
CENTER: a single tall figure wearing a smooth blank porcelain-grey helmet — where a face would be
there is only smooth blank porcelain, the ONLY break is exactly two thin horizontal sensor slits
glowing a low electric-violet. The porcelain shell is fractured-but-intact, its few cracks repaired
with thin delicate kintsugi GOLD seams — gold only along the hairline cracks, sparse, well under a
sixth of the frame, never a fill or glow-flood. Heavy grey textured ceremonial robe, calm and still;
this is the ONLY solid real-material subject. NO fox ears, NO kitsune, no animal features.
BEHIND THE HELMET: one soft cold-white halo ring of light — the single brightest focus of the image.
LEFT and RIGHT, lower and smaller: two faint translucent presences made of drifting signal-mist and
particles — their forms only barely suggested, featureless, dissolving into the void, a few violet
sparks within them; clearly background memories, far weaker than the center figure.
BACKGROUND: a nameless distant skyline as a low dark silhouette horizon only, sinking into pure black.
Vast negative space, fine film grain.
One single thin violet thread of light runs subtly from the left presence, across the figure, ending
near the sensor slit. Quiet, monumental, spacious. No text.
Palette: void black, porcelain white, cold grey, electric violet, with only thin kintsugi gold on the
shell seams. Cold overall.
```

### Hard exclusions
```
cyberpunk, cyan, teal, yellow, orange fill, warm wash, neon red, fire, anime, manga, glossy skin,
recognizable human faces on the ghosts, gaming poster, HUD, UI overlay, watermark, logo, text,
lens flare, thick violet line splitting the frame, multiple bright lights, crowd, extra heroes,
mecha mount, samurai, kitsune ears, fantasy armor
```
> Note: gold is allowed ONLY as thin kintsugi seams on the shell (canon). It must NOT become a warm
> light source or a fill — the halo stays the single bright focus, and the overall read stays cold.

### Balance reminders (reject if violated)
- Halo must be the brightest thing. If a slit or the gold seams are brighter than the halo → re-roll.
- Ghosts must read as faint signal mist, NOT people. If a ghost shows a clear human face → re-roll.
- Gold seams stay thin/sparse (≤15% frame). If gold reads as a glow or warm wash → re-roll.
- If the bottom looks empty → enlarge ghosts, never add characters.
- Skyline must be unrecognizable (no Empire). If it pulls the eye → sink it darker/lower.

### Filing suggestion (operator places)
`production/character/keyart_candidates/MIKAGE_WORLD_SIGNAL_KEYART_V0_2_GPT_PASS_UNCONFIRMED.png`

---

## Note on tooling
Repo already has a keyart pipeline (`mikage_keyart_v0_1.py`, Blender EEVEE lookdev). GPT is fine for a
fast direction pass, but it will NOT hold palette/geometry as tightly as the Python/Blender route.
Treat GPT output as direction reference, not a canon-locked asset.
