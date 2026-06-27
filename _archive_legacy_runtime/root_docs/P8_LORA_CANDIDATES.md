# MIKAGE P8 LORA CANDIDATE SHORTLIST

## Date: 2026-03-30
## Task: P8-3 - LoRA Selection for Engineered Form Discipline

---

## RESEARCH SUMMARY

**Source:** Civitai search  
**Query:** industrial design, product photography, hard surface, brutalist, ceramic  
**Results:** 5 candidates identified → 3 suitable after filtering

---

## CANDIDATE EVALUATION

### ❌ REJECTED CANDIDATES

| LoRA | Reason for Rejection |
|------|---------------------|
| Clay Sculpture Style | "fantasy clayworld", "surreal", "organic" - too artistic/ornamental |
| Industrial sci-fi SDXL | "cyberpunk-style", "digital-art illustrated" - neon risk, character bias |
| 3D Packages Design | Product packaging focus, not hard-surface form |

---

## ✅ APPROVED SHORTLIST (3 CANDIDATES)

### #1: BRUTALISM STYLE ⭐ PRIMARY CHOICE

**Name:** Brutalism Style  
**URL:** https://civitai.com/models/222758/brutalism-style  
**File:** `brutalism_style.safetensors`  
**Size:** 217.87 MB (Compact, fast download)  
**Trigger:** None required  

**Pros:**
- ✅ Architecture/form-first discipline
- ✅ "Brutalism" = raw concrete, hard surfaces, geometric forms
- ✅ No human/character training
- ✅ Non-ornamental by design
- ✅ Small file (218 MB) - easy to test
- ✅ 248 reviews, "Very Positive"

**Cons:**
- ⚠️ Architecture focus (may need object framing)

**Mikage Fit:** EXCELLENT - Brutalist aesthetic directly aligns with canon

**Download:** https://civitai.com/models/222758/brutalism-style

---

### #2: SDXL PRODUCT SHOT LORA ⭐ SECONDARY CHOICE

**Name:** SDXL Product Shot LoRA  
**URL:** https://civitai.com/models/134592/sdxl-product-shot-lora  
**File:** `product_shot_of_a.safetensors`  
**Size:** 1.7 GB (Large, high quality)  
**Trigger:** None (automatic)  
**Strength:** LOW (author recommends 0.3-0.5)

**Pros:**
- ✅ Explicitly "product shot" - commercial photography
- ✅ Studio lighting, material accuracy
- ✅ Object readability priority
- ✅ 2.5k downloads, proven
- ✅ Based on SDXL 1.0

**Cons:**
- ⚠️ Large file (1.7 GB)
- ⚠️ Must use LOW strength (overpowers if too high)
- ⚠️ Generic "product" may not enforce hard-surface discipline

**Mikage Fit:** GOOD - Product photography aligns with canon

**Download:** https://civitai.com/models/134592/sdxl-product-shot-lora

---

### #3: PRODUCT PHOTOGRAPHY LORA ⭐ TERTIARY CHOICE

**Name:** Product Photography  
**URL:** https://civitai.com/models/628845/product-photography  
**File:** `Product_Photography.safetensors`  
**Size:** 529.39 MB (Medium)  
**Trigger:** `Product Photography`  
**Strength:** 0.85 (author recommendation)

**Pros:**
- ✅ "Product Photography" - studio commercial style
- ✅ Smaller file (529 MB)
- ✅ 2k downloads, "Very Positive"
- ✅ Explicit trigger word control

**Cons:**
- ⚠️ Perfume bottle training examples (may be too specific)
- ⚠️ Nature elements in examples (stones, leaves, water)
- ⚠️ May add environmental context we don't want

**Mikage Fit:** MODERATE - Good base but may need careful prompting

**Download:** https://civitai.com/models/628845/product-photography

---

## RECOMMENDED TEST ORDER

```
Priority 1: Brutalism Style (218 MB)
    ↓ Test first (fast download, low risk)
    
Priority 2: SDXL Product Shot (1.7 GB)
    ↓ Test if Brutalism insufficient
    
Priority 3: Product Photography (529 MB)
    ↓ Fallback option
```

---

## DOWNLOAD INSTRUCTIONS

### Option A: Manual Download (Recommended)
1. Open browser → Civitai URLs above
2. Click "Download" for each LoRA
3. Save to: `D:\Fooocus-main\models\loras\`
4. Verify file sizes match above

### Option B: Automated (If Available)
```bash
cd D:\Fooocus-main\models\loras
# Download via curl or wget if working
```

---

## TEST PLAN (P8-6)

### Test Configuration:

**Base Model:** realvisxlV50_v40Bakedvae.safetensors (locked baseline)

**Test Subject:**
```
"engineered ceramic humanoid shell, hard-surface chassis, 
brutalist silhouette, industrial ceramic material, 
matte eggshell texture, geometric form discipline"
```

**LoRA Config:**
```json
{
  "lora_name": "brutalism_style.safetensors",
  "lora_weight": 0.6
}
```

**Negative Updated:**
```
cosplay, costume, apparel, character, anime, 
ornamental, decorative, fantasy, magical,
neon, plastic, glossy
```

### Success Criteria:
1. Output shows **recognizable hard-surface form** (not abstract)
2. **Brutalist/geometric discipline** visible
3. **No fantasy/cosplay elements** in Gemini validation
4. **Material read** as engineered ceramic (not plastic/costume)
5. Fewer abstract fail rules than baseline (8 → target <5)

---

## NEXT STEPS

### [P8-3] COMPLETE → Proceed to:
1. [P8-4] Update prompt vocabulary (character→engineered)
2. [P8-5] Update negative wall (cosplay/costume block)
3. Download selected LoRA(s)
4. [P8-6] Run comparison test

### Files Created:
- `P8_LORA_SELECTION_STRATEGY.md` - Strategic guidance
- `P8_LORA_CANDIDATES.md` - This shortlist

### Next File:
- `P8_LORA_WINNER.md` - After test results

---

**Shortlist Ready: 3 candidates prioritized by Mikage canon fit.**

*Document: P8_LORA_CANDIDATES.md*
