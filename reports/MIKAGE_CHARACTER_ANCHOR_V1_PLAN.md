# MIKAGE_CHARACTER_ANCHOR_V1_PLAN

**Status:** PLAN DRAFT — not canon-locked  
**Date:** 2026-05-15  
**Goal:** Define the generation path from locked silhouette spec → Character Anchor V1  
**Do not render. Do not generate final character. Do not claim final canon.**

---

## 1. WHAT IS CHARACTER ANCHOR V1

The Character Anchor V1 is the first generated full-body image of Mikage that:

- Passes all 15 drift checks (Section 10, prompt library)
- Scores 90+ on the review scoring table (Section 12, prompt library)
- Matches the B_MONOLITH silhouette geometry (MIKAGE_SILHOUETTE_CANON_V1_LOCK_SPEC.md)
- Correctly renders all material zones (see Section 4 below)
- Contains no warm tones, no human eye read, no taper on the blade

It is NOT the final canon image. It is NOT asset-locked. It is the first accepted reference for all subsequent generation, IPAdapter input, inpainting sessions, and further development. Once an output is accepted as Anchor V1, it becomes the visual baseline for the character pipeline.

---

## 2. SILHOUETTE GEOMETRY CONSTRAINTS (from LOCK_SPEC)

All generated outputs must conform to these rules derived from B_MONOLITH.

| Element | Rule |
|---|---|
| Helmet H:W ratio | 1.33:1 (B primary) to 1.44:1 (D variant max) — portrait ovoid only |
| Sensor slits | 2 ultra-narrow horizontal voids, each ~5% helmet height, 70% helmet width, symmetric about helmet vertical center |
| Hair mass | Single solid downward mass from helmet crown, falls ~80% figure height, occupies left negative space |
| Pauldrons | 2.40× to 2.90× helmet width total span; right pauldron slightly wider than left |
| Body taper | Pauldrons (3.2× chest) → chest → waist (80% of chest) → hips (105% of chest) → columnar legs |
| Blade | Perfect rectangle 1:8 ratio, vertical planted right side, tip at ground, guard 2× blade width |
| Asymmetry | Hair LEFT negative space / sword RIGHT negative space — not mirrored, right-dominant |

Any generated image that fails silhouette geometry at thumbnail scale (100×175px read) is rejected before material review.

---

## 3. MATERIAL ZONES

The character has 5 distinct material zones. Each zone has strict palette and surface rules.

### Zone 1 — Porcelain Helmet + Armor Plates (PRIMARY SURFACE)

| Property | Value |
|---|---|
| Color | #F2EEEA (warm off-white) to #F6F5F6 (cool neutral) — canon anchor refs: ceramic_off_white |
| Surface | Matte ceramic — NOT glossy, NOT plastic sheen, NOT metallic |
| Tonal shift | Cool white at top curved surface → silver-grey shadow at underplane |
| Seam lines | Thin structural panel lines, cool silver only, no warm color |
| Covers | Helmet full surface, pauldron top plates, chest plate front, lower armor plates |
| Forbidden | Gold trim, warm ivory, warm cream, orange tint, glossy finish, reflective surface, skin texture |

**Prompt keywords:** `matte white porcelain ceramic surface, cool white to silver-grey tonal shift, fine ceramic grain micro-texture, structural panel seam lines cool silver, no gloss no shine no reflection`

**Anti-drift reference:** REJECT_GOLDEN_MASK_001 (warm tone helmet drift), REJECT_BAD_PLASTIC_00 (plastic surface drift)

### Zone 2 — Black Graphene Underlayer (VISIBLE IN GAPS)

| Property | Value |
|---|---|
| Color | #050508 (void black) |
| Surface | Structured graphene weave pattern — dark carbon fiber visible through panel gaps |
| Visible at | Panel seam interiors, shoulder joint beneath pauldrons, arm joint gaps, waist transition |
| Depth read | Shadow inside seam — the gap has interior depth, not a painted line |
| Covers | All panel joints where armor plates meet; beneath and behind pauldrons |
| Forbidden | Warm color seam, red interior, gold seam line, light reflecting out of gap |

**Prompt keywords:** `dark graphene underlayer visible through panel gaps, black carbon fiber texture at seam interiors, structured graphene weave pattern, deep near-black seam depth, shadow inside panel gap`

**Note:** This is the zone that the 09E ComfyUI inpainting workflow (ASSET-BUILD-09E_COMFYUI_WORKFLOW.json) was designed for. Positive prompt in node 4 = graphene underlayer description. The 09E workflow cannot be used in Phase 1 (no base image yet), but is the correct tool for underlayer refinement in later sessions.

### Zone 3 — Violet Accent (STRICTLY CONSTRAINED)

| Property | Value |
|---|---|
| Color | #8F00FF (primary) / #7B2FFF (video-UI variant) |
| Permitted use | Ambient halo behind figure at shoulder level; small seal glyph on helmet lower face; faint seam trace accent (very subtle); atmospheric mist at ground; faint ambient within sensor slit recess |
| Forbidden use | Primary surface fill; sword glow; armor color; eye glow; background color; dominant light source |
| Coverage | Under 5% of total image area |

**Prompt keywords:** `faint electric violet #8F00FF ambient halo behind figure, small violet seal glyph emblem on helmet lower face, violet atmospheric mist at feet, violet accent only — not surface color`

### Zone 4 — Zenith Blade (MATTE VOID)

| Property | Value |
|---|---|
| Color | #050508 (void black) |
| Surface | Pure matte — absorbs light, no reflection, no energy glow, no runes |
| Edge catch | Single 1px silver-white edge highlight on lit face only — structural, not decorative |
| Shape | Perfect rectangle, no taper, no curve, no tip |
| Forbidden | Glow, runes, energy, warm color, crimson, reflective face, decorative guard |

**Prompt keywords:** `massive matte void black rectangular slab sword, no reflection no energy no runes, single thin silver light catch edge, architectural weight object, pure matte black face absorbs light`

### Zone 5 — Hair Mass (PURE BLACK, SECONDARY GEOMETRY)

| Property | Value |
|---|---|
| Color | #050508 (void black) — matches sword and underlayer |
| Surface | Single solid mass — no strand separation at reading distance |
| Shape | Straight downward fall, slight gravity curve left, fills left negative space |
| Length | Falls to near-ankle level (~80% of figure height) |
| Forbidden | Color, highlights, volumetric fluff, strand detail, short length, pinned-up, revealing face |

**Prompt keywords:** `long heavy straight black hair as single solid mass, falls to near ankle behind armor, fills left negative space, secondary silhouette element, no color no highlights`

---

## 4. ANTI-DRIFT REFERENCE INDEX

These reject examples in `docs/character/references/reject_examples/` define specific failure modes to avoid. Reference against every generated output.

| File | Drift type | What it shows | Prompt defense |
|---|---|---|---|
| REJECT_GOLDEN_MASK_001 | Warm tone helmet drift | Golden/warm ceramic — entire helmet reads as warm metal mask | Negative: `gold, warm ceramic, warm white, ivory, golden mask, warm tint` |
| REJECT_BAD_PLASTIC_00 | Plastic surface drift | Helmet looks like painted plastic toy, zero material character | Positive: `ceramic grain, matte porcelain` / Negative: `plastic, shiny, smooth plastic, toy surface` |
| REJECT_BAD_FLAT_00 | Flat no-texture drift | Surface completely flat, no tonal shift, reads as filled color block | Positive: `cool white to silver-grey tonal shift, micro-texture` / Negative: `flat surface, no texture, filled block` |
| REJECT_BAD_NOISE_00 | Noise drift | Excessive grain/noise overrides form — edges unreadable | Negative: `noise artifacts, grain overriding form, low quality, overprocessed` |
| REJECT_BAD_MULTISHAPE_00 | Silhouette confusion drift | Figure reads as multiple shapes or props — no clean hierarchy | Positive: `single figure, silhouette hierarchy reads clearly` / Negative: `busy composition, multiple shapes, cluttered` |

---

## 5. GENERATION PHASE PLAN

Four phases, each building validation evidence before proceeding. Human executes generation. Agent scores outputs after each phase.

### Phase 1 — Silhouette Geometry Validation

**Goal:** Confirm the model can produce B_MONOLITH geometry before adding material complexity.  
**Tool:** Fooocus or ComfyUI txt2img (NOT 09E inpainting workflow — no base image yet)  
**Shots needed:** 3–5 per step, accept best 1

| Step | Prompt source | Focus | Accept gate |
|---|---|---|---|
| P1-A | Library Section 6.1 (Silhouette) | Helmet + pauldrons + sword mass + hair mass shape hierarchy | Silhouette reads at thumbnail scale; hair left, sword right |
| P1-B | Library Section 5.1 (Sword) | Blade rectangular form only | No taper, no curve, no point |
| P1-C | Library Section 6.3 (Distance read) | Whole figure at extreme distance | All 5 shape elements readable |

**Pass condition:** At least 1 output per step passes 8/8 thumbnail readability criteria (LOCK_SPEC Section 9).  
**Fail action:** Adjust prompt, retry. Do not proceed to Phase 2 until P1 passes.

### Phase 2 — Material Zone Validation

**Goal:** Confirm ceramic vs graphene material read is achievable with this model.  
**Tool:** Fooocus or ComfyUI txt2img  
**Build on:** Best silhouette from Phase 1 as visual target reference (do not IPAdapter yet — visual reference only)

| Step | Prompt source | Focus | Accept gate |
|---|---|---|---|
| P2-A | Library Section 3.1 (Helmet) + Zone 1 keywords | Porcelain surface quality, sensor slits | Ceramic not plastic; slits void not glowing; cool tonal shift |
| P2-B | Library Section 7.1 (Porcelain material) | Isolated helmet material surface | Passes D-02 (palette), D-01 (slits present) |
| P2-C | Library Section 7.3 (Sword material) | Blade matte black surface quality | Passes D-04 (no glow, no runes, 1px catch only) |

**Pass condition:** P2-A output must score 2/2 on Helmet criterion (scoring table Section 12).  
**Fail action:** Check against REJECT_BAD_PLASTIC_00 and REJECT_GOLDEN_MASK_001. Adjust negative prompt.

### Phase 3 — Full Figure Assembly (Anchor Candidates)

**Goal:** Produce full-body outputs combining silhouette geometry + material quality.  
**Tool:** Fooocus or ComfyUI txt2img  
**Settings (recommended):**

```
Model: juggernautXL_v8Rundiffusion.safetensors
Aspect ratio: 2:3 portrait (1024×1536 or 896×1344)
Steps: 35
CFG / Guidance: 7.5
Sampler: dpmpp_2m karras
Negative: Universal Negative (Section 9, prompt library) + Zone-specific negatives
Seed: randomize — run 5–8 candidates per prompt, select best
```

| Step | Prompt source | Stance | Focus |
|---|---|---|---|
| P3-A | Library Section 4.4 (Sword Planted) | B_MONOLITH — vertical sword | PRIMARY stance — must match silhouette spec |
| P3-B | Library Section 4.3 (Three-quarter view) | B_MONOLITH — 3/4 angle | Default viewing angle |
| P3-C | Library Section 8.4 (Atmospheric Presence) | B_MONOLITH — void environment | Violet accent + full atmosphere |
| P3-D (optional) | Library Section 4.1 (Standard Full-Body) | diagonal sword variant | Explore before D_PRESENCE |

**Material enhancement:** Add Zone 1 + Zone 2 keywords to each P3 prompt. Add Zone 3 violet accent keywords only in P3-C.

**Pass condition:** At least 1 output from P3-A or P3-B scores 90+ on scoring table AND passes all 15 drift checks.

### Phase 4 — Anchor Selection

**Goal:** Human selects best qualifying output as Character Anchor V1.  
**Input:** All passing outputs from Phase 3 (each scoring 90+, 15/15 drift checks)  
**Selection criteria (in priority order):**

1. Sensor slits clearly present — void black, no human eye read (D-01)
2. Sword rectangular slab — no taper (D-03)
3. Ceramic surface reads as matte porcelain — not plastic, not warm (D-02, D-05)
4. Hair mass present — fills left negative space (D-15)
5. Silhouette matches B_MONOLITH geometry at thumbnail scale
6. Highest total score on scoring table

**Output:** Human designates 1 image as `CHARACTER_ANCHOR_V1_CANDIDATE.png`. Agent scores, documents, and records in handoff.

---

## 6. GENERATION PROMPT ASSEMBLY (READY TO PASTE)

These are assembled prompts combining library blocks + material zone keywords. Human can paste directly.

### P3-A: SWORD PLANTED FULL BODY (Primary Anchor Candidate)

**Positive:**
```
Mikage full body standing pose, sword planted vertically beside figure, matte white porcelain helmet elongated ovoid two ultra-narrow void-black horizontal sensor slits no pupils no iris, wide flat-topped white pauldrons significantly wider than head, long heavy straight black hair as single solid downward mass filling left negative space falling to near ankle behind armor, massive rectangular black slab sword vertical to right side nearly as tall as figure no taper no curve no point, long dark cloak secondary silhouette extension, black graphene underlayer visible through panel gaps dark carbon fiber texture at seam interiors, void black background, faint electric violet #8F00FF ambient halo behind figure at shoulder height, small violet seal glyph on helmet lower face, violet atmospheric mist at feet, silver structural seam lines cool only, matte ceramic grain surface, cool white to silver-grey tonal shift on armor, single thin silver light catch on sword edge, sacred-tech aesthetic, ink illustration on textured paper, high contrast, monumental stillness, architectural weight, diagonal composition
```

**Negative:**
```
human eyes, pupils, irises, glowing eyes behind slit, colored eye effect, visor glow, open face, face visible, mouth, lips, chin, expression, horns, demon, skull, warm colors, gold, warm ivory, orange tint, cream, red glow, crimson accent, warm ceramic, plastic surface, shiny helmet, glossy, organic blade, thinning sword, pointed sword, tapered blade, katana, curved blade, runes, energy blade, glowing sword, spiky armor, ornate armor, exposed skin, mechanical joints, robot aesthetic, anime face, anime style, chibi, cute, symmetrical forward pose, busy background, landscape, warm ambient light, short hair, colored hair, hair pinned up, bundled hair, hair revealing face, excessive noise, grain overriding form, watermark, text
```

### P3-B: THREE-QUARTER VIEW (Secondary Anchor Candidate)

**Positive:**
```
Mikage three-quarter view full body character art, matte white porcelain helmet elongated ovoid two ultra-narrow void-black horizontal sensor slits no human eyes, wide white pauldrons significantly wider than head, massive matte black rectangular monolith slab sword diagonal lower right side no taper no point, long heavy straight black hair single solid mass behind armor left side falling to ankle, dark cloak secondary shape, black graphene underlayer visible at panel gaps carbon fiber seam depth, void black background radial, faint electric violet #8F00FF edge halo, silver cool seam detail, matte ceramic surface, cool white armor, sacred-tech ink render, textured paper, high contrast, stillness, weight over speed
```

**Negative:** *(same as P3-A negative)*

### P3-C: ATMOSPHERIC PRESENCE (Violet Accent Test)

**Positive:**
```
Mikage standing full body, matte white porcelain helmet elongated two narrow void-black sensor slits no pupils no iris, wide armor pauldrons, long heavy straight black hair downward mass left side, massive rectangular matte black slab sword vertical right side planted, deep void black background, faint electric violet #8F00FF radial glow behind figure at shoulder level, electric violet mist at feet ground level, silver armor edge catch from unknown light above right, black graphene weave visible through armor seam gaps, small violet seal glyph helmet, absolute stillness, no wind, long dark cloak, sacred-tech atmosphere, ink illustration, cinematic composition, pure presence
```

**Negative:** *(same as P3-A negative)*

---

## 7. REFERENCE FILES TO COMPARE AGAINST

After each generation, compare outputs against these files in `docs/character/references/`:

| Reference | Path | Use for |
|---|---|---|
| SP-001 key visual (mask/body silhouette) | `mask_body_silhouette/REF_SP001_...png` | Silhouette shape, overall proportions |
| SP-002 blade | `blade/REF_SP002_...png` | Sword rectangular form and scale |
| SP-003 environment | `environment/REF_SP003_...png` | Void background, atmosphere |
| Good ceramic 00–04 | `material/REF_GOOD_CERAMIC_0*__MATERIAL.png` | Porcelain white surface quality |
| Rejects (all 5) | `reject_examples/REJECT_*.png` | Confirm output does NOT match any drift pattern |

---

## 8. ANCHOR ACCEPTANCE GATE

An output may be designated Character Anchor V1 only if ALL of the following are met:

- [ ] Passes all 15 drift checks (D-01 through D-15) — see review checklist
- [ ] Scores 90+ on scoring table (Section 12, prompt library)
- [ ] D-01 and D-03: score = 2 (not 1, not 0) — mandatory
- [ ] Silhouette reads correctly at thumbnail 100×175px — all 8 readability criteria
- [ ] Material zones 1–5 correctly rendered (ceramic / graphene / violet accent / matte blade / hair)
- [ ] No warm tones anywhere in the image
- [ ] Human visual approval

**The anchor does not require:** Perfect proportions, perfect material, perfect composition. It requires: valid enough to be a stable starting point for IPAdapter and inpainting refinement.

---

## 9. WHAT HAPPENS AFTER ANCHOR IS ACCEPTED

Once Character Anchor V1 is selected and documented:

1. Anchor image saved to `docs/character/anchor/CHARACTER_ANCHOR_V1.png`
2. Agent writes `reports/MIKAGE_CHARACTER_ANCHOR_V1_RECORD.md` with score, gate status, generation parameters
3. 09E inpainting workflow can now be used for panel gap / underlayer refinement (requires anchor as `base_image.png` input)
4. Anchor becomes IPAdapter reference image for controlled variation generation
5. Next pipeline task: use anchor as base for detail refinement or environment testing

---

## 10. WHAT IS NOT PLANNED HERE

- No IPAdapter usage planned in this task (no base image yet)
- No ControlNet pose transfer planned in this task
- No ComfyUI inpainting (09E) planned in this task — requires base image
- No final canon lock
- No asset lock
- No production approval

---

*Generated: 2026-05-15 | Task: MIKAGE_CHARACTER_ANCHOR_V1_PLAN | Not canon-locked*
