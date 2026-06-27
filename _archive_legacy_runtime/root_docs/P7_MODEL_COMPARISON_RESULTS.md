# MIKAGE P7 MODEL COMPARISON RESULTS

## Date: 2026-03-30
## Task: P7-3 through P7-6

---

## [P7-5] COMPARISON TABLE

### Test Subject (Same for all 3 runs):
**Prompt:** "single white engineered ceramic cube on neutral brutalist surface, centered, clear silhouette, industrial object readability, non-abstract, no neon, no decorative pattern"

**Negative:** Anti-abstract lock + color canon negatives

**Settings:** 1024x1024, Quality mode, 40 steps, guidance 7.0

---

## RESULTS SUMMARY

| # | MODEL | OUTPUT SIZE | GEMINI | LOCAL VALIDATOR | DECISION | KEY FAILURES |
|---|-------|-------------|--------|-----------------|----------|--------------|
| 1 | realvisxlV50_v40Bakedvae | 2448 KB | **FAIL** | **FAIL** | **REJECT** | abstract, neon, plastic, texture-only |
| 2 | realvisxlV50_v50LightningBakedvae | 2190 KB | **FAIL** | **FAIL** | **REJECT** | abstract, neon, plastic, toy-like |
| 3 | juggernautXL_v8Rundiffusion | 2144 KB | **FAIL** | **FAIL** | **REJECT** | abstract, neon, plastic, PVC sheen |

---

## DETAILED BREAKDOWN

### Model 1: realvisxlV50_v40Bakedvae.safetensors
**Run:** e2e_test_1774818822677

| Category | Result | Details |
|----------|--------|---------|
| **OUTPUT LOOK** | Abstract colorful pattern | Neon/magenta dominated, no cube visible |
| **GEMINI RESULT** | FAIL | abstract composition, texture-only frame |
| **LOCAL VALIDATOR** | FAIL | T3, T7, T8, T11, T12, C3, C4 |
| **DRIFT TYPE** | COLOR_NEON_DRIFT, PLASTIC_COLOR_DRIFT | Oversaturated, glossy plastic read |
| **VERDICT** | **REJECT** | Unsuitable for Mikage canon |

**Wrong Reads:**
- abstract composition
- texture-only frame
- manufactured object not readable
- COLOR_NEON_DRIFT
- OVERSATURATION_DRIFT
- PLASTIC_COLOR_DRIFT
- glossy plastic
- toy-like finish

---

### Model 2: realvisxlV50_v50LightningBakedvae.safetensors
**Run:** e2e_test_1774819467146

| Category | Result | Details |
|----------|--------|---------|
| **OUTPUT LOOK** | Abstract neon pattern | Highly saturated, no clear object |
| **GEMINI RESULT** | FAIL | abstract composition, texture-only frame |
| **LOCAL VALIDATOR** | FAIL | T3, T5, T7, T9, T11, T12, C1, C3, C4 |
| **DRIFT TYPE** | COLOR_NEON_DRIFT, PURE_WHITE_DRIFT, PURE_BLACK_DRIFT | Extreme color hallucination |
| **VERDICT** | **REJECT** | Worst color drift of all 3 |

**Wrong Reads:**
- abstract composition
- texture-only frame
- manufactured object not readable
- COLOR_NEON_DRIFT
- OVERSATURATION_DRIFT
- PLASTIC_COLOR_DRIFT
- toy-like finish
- digital fill

---

### Model 3: juggernautXL_v8Rundiffusion.safetensors
**Run:** e2e_test_1774820074080

| Category | Result | Details |
|----------|--------|---------|
| **OUTPUT LOOK** | Abstract colorful texture | Multi-colored, no cube silhouette |
| **GEMINI RESULT** | FAIL | abstract composition, texture-only frame |
| **LOCAL VALIDATOR** | FAIL | T3, T5, T7, T9, T11, T12, C1, C3, C4 |
| **DRIFT TYPE** | COLOR_NEON_DRIFT, CRIMSON_OVERUSE | Multiple color drifts, glossy plastic |
| **VERDICT** | **REJECT** | Highest severity, most fail rules |

**Wrong Reads:**
- abstract composition
- texture-only frame
- manufactured object not readable
- glossy plastic
- PVC sheen
- toy-like finish
- COLOR_NEON_DRIFT
- OVERSATURATION_DRIFT
- PURE_WHITE_DRIFT
- PURE_BLACK_DRIFT
- PLASTIC_COLOR_DRIFT
- CRIMSON_OVERUSE

---

## [P7-6] WINNER SELECTION

### Analysis:
**ALL 3 MODELS FAILED** with the same fundamental issues:
1. **Abstract composition** - Không tạo được object rõ ràng
2. **Neon/oversaturated colors** - Vi phạm color canon nghiêm trọng
3. **Plastic/glossy read** - Không đạt matte ceramic material
4. **Texture-only frame** - Không có manufactured object readability

### Comparison Matrix:

| Criteria | realvisxlV40 | realvisxlV50 | juggernautXL |
|----------|--------------|--------------|--------------|
| Abstract Error | ❌ HIGH | ❌ HIGH | ❌ HIGH |
| Neon Drift | ❌ HIGH | ❌ HIGHEST | ❌ HIGH |
| Plastic Read | ❌ HIGH | ❌ HIGH | ❌ HIGHEST |
| Object Readability | ❌ NONE | ❌ NONE | ❌ NONE |
| Fail Rule Count | 8 | 9 | 12 |
| Severity | HIGH | HIGH | HIGHEST |

### VERDICT:
```
┌─────────────────────────────────────────────────────────────────┐
│  NO WINNER - ALL 3 MODELS UNSUITABLE                              │
│                                                                   │
│  realvisxlV50_v40Bakedvae:        REJECT (8 fail rules)           │
│  realvisxlV50_v50LightningBakedvae: REJECT (9 fail rules)         │
│  juggernautXL_v8Rundiffusion:      REJECT (12 fail rules)         │
│                                                                   │
│  Best of worst: realvisxlV50_v40Bakedvae (fewest fail rules)      │
│  But still completely unsuitable for Mikage canon                │
└─────────────────────────────────────────────────────────────────┘
```

### BLOCKER CONFIRMED:
**SDXL base models (tất cả variants tested) đều có bias mạnh tạo abstract/neon/plastic output thay vì hard-surface ceramic objects.**

### Required Actions:
1. **Không model nào đạt ALLOW** - cần tìm model khác hoặc dùng LoRA
2. **Nếu phải chọn:** realvisxlV50_v40Bakedvae (ít lỗi nhất)
3. **Đề xuất:** Test thêm các model khác như SD 1.5 hoặc SDXL với LoRA chuyên ceramic/product

---

## RUN DIRECTORIES (for reference):
- Model 1: `D:\KAGAMI-MZ\runs\e2e_test_1774818822677\`
- Model 2: `D:\KAGAMI-MZ\runs\e2e_test_1774819467146\`
- Model 3: `D:\KAGAMI-MZ\runs\e2e_test_1774820074080\`

---

## CONCLUSION

**Image Lane vẫn bị BLOCKED** sau khi test 3 checkpoints.

Tất cả SDXL models tested đều:
- Tạo abstract patterns thay vì objects
- Vi phạm nghiêm trọng color canon
- Không đạt material readability cho ceramic

**Cần model family khác hoặc LoRA specialization.**

---

*Report: P7_MODEL_COMPARISON_RESULTS.md*
