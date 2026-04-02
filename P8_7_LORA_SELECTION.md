# P8-7 OBJECT-FORM LoRA SELECTION

## Selected LoRA: Product Photography
- **Source:** Civitai
- **URL:** https://civitai.com/models/628845/product-photography
- **Creator:** thanhphong8808562
- **Base Model:** SDXL 1.0
- **File Size:** 529.39 MB
- **Type:** Concept LoRA (product photography)
- **Trigger:** "Product Photography"

## Why Selected:
- ✅ Product photography focus (object-first framing)
- ✅ 529 MB (manageable size)
- ✅ SDXL 1.0 base (compatible)
- ✅ "Very Positive" reviews (139 reviews)
- ✅ Not style/cinematic/brutalism/anime/fashion
- ❌ May have some environment elements (stones, water in examples) but core is product/object

## Alternative Considered:
- SDXL Product Shot LoRA (1.7 GB) - too large
- Outdoor product photography - environment heavy, rejected

## Download Instructions:

### Step 1: Download
Go to: https://civitai.com/models/628845/product-photography

Click "Download (529.39 MB)" button

### Step 2: Rename
Original filename: `Product Photography.safetensors` or similar
Rename to: `product_object.safetensors`

### Step 3: Copy to LoRA folder
```
D:\Fooocus-main\models\loras\product_object.safetensors
```

### Step 4: Verify
Check file exists at path above

---

## P8-7B PROMPT STRATEGY (PHASE 3)

### ADD HARD TOKENS (required):
```
product photography
studio product shot
catalog object
industrial design prototype
isolated object
centered composition
single object
clean background
white backdrop
sharp edges
engineered seams
manufactured object clarity
```

### REMOVE/AVOID:
```
corridor
cinematic scene
character pose
action framing
environment storytelling
```

### NEGATIVE WALL ADD:
```
character, human, face, eyes, skin, costume, armor, cosplay, anime,
cinematic scene, environment heavy, background complexity
```

---

## P8-7C TEST CONFIGURATION

### CASE A (Baseline):
- Model: realvisxlV50_v40Bakedvae
- LoRA: None

### CASE B (Object LoRA):
- Model: realvisxlV50_v40Bakedvae
- LoRA: product_object.safetensors
- Weight: 0.8

### Render Settings:
- Width: 1024
- Height: 1024
- Performance: Quality
- Steps: 40
- Guidance Scale: 7.0

---

## Expected Outcome Checklist:
1. ✅ Object readability increases
2. ✅ Abstract composition reduces
3. ✅ Texture-only reading reduces
4. ✅ Character/costume reading reduces
5. ✅ Gemini fail reason changes
6. ✅ Case B closer to PASS than Case A

## Fallback Decision:
If no improvement → LoRA cannot solve the problem → Switch to COMPOSITION LOCK approach (not LoRA-based)

---

*P8-7 LoRA Selection Document*
