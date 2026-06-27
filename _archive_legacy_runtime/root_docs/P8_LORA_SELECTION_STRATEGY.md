# MIKAGE P8 LORA SELECTION STRATEGY

## Date: 2026-03-30
## Task: P8-1 through P8-6 - LoRA Acquisition for Engineered Form Discipline

---

## ROOT FAILURE ANALYSIS

```
┌─────────────────────────────────────────────────────────────────┐
│  PROBLEM: Model interprets Mikage as CHARACTER/FANTASY image      │
│                                                                   │
│  Current Output:                                                  │
│  - Abstract patterns (not objects)                               │
│  - Neon/oversaturated (cosmetic not engineered)                  │
│  - Texture-only frame (no manufactured form)                     │
│  - Plastic/glossy (costume not chassis)                          │
│                                                                   │
│  REQUIRED SHIFT:                                                  │
│  Character/Fantasy → Engineered/Manufactured/Hard-Surface        │
└─────────────────────────────────────────────────────────────────┘
```

---

## P8 LORA SELECTION CRITERIA

### ✅ MUST HAVE (Priority Order):

| Priority | LoRA Type | Purpose |
|----------|-----------|---------|
| 1 | **Industrial Design** | Hard-surface form discipline, engineered aesthetics |
| 2 | **Product Photography** | Studio lighting, commercial readability, material accuracy |
| 3 | **Hard-Surface Object** | Geometric precision, manufacturing detail, non-organic |
| 4 | **Ceramic/Material Study** | Matte surface, eggshell texture, industrial ceramic |
| 5 | **Brutalist/Minimal** | Form-first, ornamental reduction, austere composition |

### ❌ MUST AVOID (Strictly Forbidden):

| Category | Examples | Why Rejected |
|----------|----------|--------------|
| Anime | Any anime-style LoRA | Character bias, ornamental detail |
| Sci-Fi Character | Cyberpunk, mecha pilot, android | Humanoid character focus |
| Cinematic Atmosphere | Movie still, film grain, dramatic lighting | Atmospheric over form |
| Fashion Portrait | Clothing, runway, apparel | Costume/costume bias |
| Fantasy Armor | Knight, warrior, magical gear | Ornamental metal, not engineered ceramic |
| Decorative Enhancement | Ornament, filigree, pattern | Adds non-functional detail |

---

## PROMPT DIRECTION UPDATE (P8-4)

### NEW Subject Framing (Engineered Form):

**Instead of:**
```
❌ "female warrior in ceramic armor"
❌ "anime character with white mask"
❌ "costume design, outfit details"
```

**Use:**
```
✅ "engineered humanoid shell, ceramic chassis"
✅ "manufactured ceremonial industrial object"
✅ "hard-surface geometric form, brutalist silhouette"
✅ "industrial ceramic housing, precision manufactured"
✅ "technical ceramic assembly, engineered contour"
```

### Key Vocabulary Shift:

| Avoid | Use Instead |
|-------|-------------|
| female/woman/girl | humanoid/form/shell |
| warrior/fighter | engineered/manufactured |
| armor/outfit/costume | chassis/housing/shell |
| character/person | object/form/assembly |
| costume/apparel | industrial ceramic |
| fashion/styling | geometric discipline |
| decorative/beautiful | austere/functional |

---

## NEGATIVE WALL UPDATE (P8-5)

### Priority 1 Negatives (Must Include):
```
cosplay, costume, apparel, clothing, outfit, fashion,
fantasy armor, knight, warrior, magical, ornamental,
anime, manga, cartoon, character portrait,
neon, plastic, PVC, glossy, magical glow,
decorative wiring, filigree, ornament, embellishment
```

### Full Negative Stack:
```
// Character/Fantasy Block
cosplay, costume, apparel, clothing, outfit, fashion,
character, portrait, person, human, face, expression,
warrior, knight, fighter, hero, magical, fantasy,

// Anime/Cartoon Block
anime, manga, cartoon, stylized, illustration,

// Ornamental Block
ornamental, decorative, filigree, embellishment, jewelry,
accessory, necklace, crown, tiara, buckle, strap,

// Material Drift Block
neon, plastic, PVC, glossy, shiny, wet, magical glow,
glass, crystal, gem, metal, chrome, gold trim,

// Atmosphere Block
cinematic, dramatic lighting, fog, mist, atmospheric,
sunset, sunrise, golden hour, lens flare,

// Abstract Block
abstract pattern, texture-only, background only,
soft focus, blurry, bokeh, depth of field
```

---

## LORA SEARCH TARGETS (P8-1, P8-2, P8-3)

### Primary Candidates to Research:

**1. Industrial Design / Product Photography**
- Search: "industrial design", "product photography", "studio product"
- Source: Civitai, HuggingFace

**2. Hard-Surface / Technical**
- Search: "hard surface", "technical", "mechanical", "geometric"
- Filter: NON-character, NON-mecha (robot focus ok if industrial)

**3. Ceramic / Material**
- Search: "ceramic", "porcelain", "material study", "surface texture"
- Filter: Product/studio context, not pottery/crafts

**4. Brutalist / Minimal**
- Search: "brutalist", "minimalist", "austere", "geometric"
- Filter: Form-first, no ornamental detail

### Research Sources:
- **Civitai:** https://civitai.com/tag/lora
- **HuggingFace:** https://huggingface.co/models?search=lora%20product
- **LoRA Bank:** Check local LoRA folder first

---

## NEXT STEPS (P8 Action Plan)

### [P8-1] Research Phase:
1. Search Civitai for "industrial design" + "product photography" LoRAs
2. Search HuggingFace for hard-surface/material LoRAs
3. Check existing LoRAs in Fooocus folder

### [P8-2] Filtering Phase:
1. Eliminate anime/sci-fi character/fantasy/fashion LoRAs
2. Verify remaining focus on engineered/manufactured forms
3. Check example outputs for hard-surface discipline

### [P8-3] Shortlist Phase:
1. Select 3-5 top candidates
2. Document: name, source, file size, trigger words
3. Prepare download links

### [P8-4] Prompt Update:
1. Update claude_spec_bridge.js with engineered form vocabulary
2. Replace character/costume terms with chassis/shell terms

### [P8-5] Negative Update:
1. Add cosplay/costume/apparel/fantasy armor to negative wall
2. Prioritize anti-character/anti-ornamental terms

### [P8-6] Test Phase:
1. Download selected LoRA(s)
2. Run test with: base checkpoint + LoRA + updated prompt
3. Compare: with LoRA vs without LoRA
4. Measure: abstract reduction, form clarity, material accuracy

---

## FILES TO MODIFY

| File | Purpose |
|------|---------|
| `claude_spec_bridge.js` | Update prompt vocabulary (character→engineered) |
| `orchestrator.js` | Update negative wall (cosplay/costume block) |
| `p0_5_e2e_test.js` | Add LoRA loading to test payload |

---

## DOCUMENTATION TO CREATE

| File | Content |
|------|---------|
| `P8_LORA_CANDIDATES.md` | Shortlist of 3-5 LoRAs with download links |
| `P8_LORA_WINNER.md` | Selected LoRA and test results |
| `P8_PROMPT_UPDATE.md` | Vocabulary shift documentation |

---

## SUCCESS CRITERIA

**LoRA Test Passes if:**
1. Output shows **recognizable manufactured object** (not abstract)
2. **Hard-surface form** visible (edges, silhouette, geometry)
3. **No fantasy/cosplay elements** detected by Gemini
4. **Material read** as ceramic/engineered (not plastic/costume)
5. Gemini validation: **ALLOW** or at least **fewer abstract fails**

---

*Strategy: P8_LORA_SELECTION_STRATEGY.md*
