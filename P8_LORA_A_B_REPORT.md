# P8 LORA A/B COMPARISON REPORT

## Date: 2026-03-30
## Task: P8-6 - LoRA Effectiveness Test

---

## TEST MATRIX

| Case | Model | LoRA | Weight | Result |
|------|-------|------|--------|--------|
| A (Baseline) | realvisxlV50_v40Bakedvae | None | N/A | ❌ REJECT |
| B (Baseline+LoRA) | realvisxlV50_v40Bakedvae | brutalism_style.safetensors | 0.7 | ❌ REJECT |

---

## ARTIFACT PATHS

### CASE A (Baseline)
- **Run Directory:** `D:\KAGAMI-MZ\runs\e2e_test_1774824430658`
- **Output PNG:** `D:\KAGAMI-MZ\runs\e2e_test_1774824430658\output.png` (2148.9 KB)
- **Final Decision:** `D:\KAGAMI-MZ\runs\e2e_test_1774824430658\final_decision.json`
- **Gemini Validation:** `D:\KAGAMI-MZ\runs\e2e_test_1774824430658\gemini_validation.json`

### CASE B (Baseline + LoRA)
- **Run Directory:** `D:\KAGAMI-MZ\runs\e2e_test_lora_1774826102104`
- **Output PNG:** `D:\KAGAMI-MZ\runs\e2e_test_lora_1774826102104\output.png` (2118.4 KB)
- **Final Decision:** `D:\KAGAMI-MZ\runs\e2e_test_lora_1774826102104\final_decision.json`
- **Gemini Validation:** `D:\KAGAMI-MZ\runs\e2e_test_lora_1774826102104\gemini_validation.json`

---

## QUESTION 1: Did object readability improve?

**Answer: NO**

Both cases failed with "manufactured object not readable" in wrong_reads.
- Case A: manufactured object not readable ❌
- Case B: manufactured object not readable ❌

No improvement in object readability.

---

## QUESTION 2: Did abstract composition reduce?

**Answer: NO**

Both cases show identical abstract composition failure:
- Case A: "abstract composition", "texture-only frame" ❌
- Case B: "abstract composition", "texture-only frame" ❌

No reduction in abstract composition.

---

## QUESTION 3: Did texture-only reading reduce?

**Answer: NO**

Both cases show "texture-only frame" in wrong_reads.
No change in texture-only reading.

---

## QUESTION 4: Did character/costume/cosplay/plastic reading reduce?

**Answer: NO**

Both cases show identical plastic/toy-like failures:
- Case A: "glossy plastic", "toy-like finish", "PLASTIC_COLOR_DRIFT" ❌
- Case B: "glossy plastic", "toy-like finish", "PLASTIC_COLOR_DRIFT" ❌

No reduction in plastic reading. LoRA did not counteract plastic drift.

---

## QUESTION 5: Did Gemini fail reason change?

**Answer: NO - IDENTICAL FAILURES**

### CASE A Gemini Fail Rules:
- abstract, atmosphere-first, texture-only, or subjectless
- manufactured object not readable
- glossy, plastic, PVC-like, or toy-like
- neon, RGB-clean, or oversaturated
- pure white, pure black, synthetic magenta

### CASE B Gemini Fail Rules:
- abstract, atmosphere-first, texture-only, or subjectless
- manufactured object not readable
- glossy, plastic, PVC-like, or toy-like
- neon, RGB-clean, or oversaturated
- pure white, pure black, synthetic magenta

**Identical fail reasons. LoRA produced no change in validation results.**

---

## QUESTION 6: Which case is closer to PASS?

**Answer: NEITHER - Both failed equally**

Both cases:
- Decision: REJECT
- Pass/Fail: FAIL
- Severity: HIGH
- Wrong reads: 8 identical items
- Fail rules: 5 identical rules

No measurable difference in failure severity.

---

## KEY EXCERPTS FROM FINAL_DECISION.JSON

### CASE A Final Decision:
```json
{
  "status": "DONE",
  "decision": "REJECT",
  "decision_reason": "REJECT: color canon hard gate: COLOR_NEON_DRIFT, PLASTIC_COLOR_DRIFT, PURE_WHITE_DRIFT, PURE_BLACK_DRIFT",
  "decision_source": "closed_loop_gemini_post_render"
}
```

### CASE B Final Decision:
```json
{
  "status": "DONE",
  "decision": "REJECT",
  "decision_reason": "REJECT: color canon hard gate: COLOR_NEON_DRIFT, PLASTIC_COLOR_DRIFT, PURE_WHITE_DRIFT, PURE_BLACK_DRIFT",
  "decision_source": "closed_loop_gemini_post_render"
}
```

---

## KEY EXCERPTS FROM GEMINI_VALIDATION.JSON

### CASE A Gemini Summary:
```
"summary": "The image is an abstract, highly saturated digital pattern 
that completely fails to represent a manufactured object or matte ceramic 
material. The neon teal and crimson colors, lack of object definition, 
and overall digital aesthetic are severe deviations from the target 
material study."
```

### CASE B Gemini Summary:
```
"summary": "The image fails completely as a white ceramic material study. 
It presents as an abstract, highly oversaturated, neon-colored digital 
texture with no discernible manufactured object. The material read is 
glossy and toy-like, directly contradicting the matte ceramic target."
```

---

## EXACT CONFIGURATION USED

### Model:
- **Checkpoint:** realvisxlV50_v40Bakedvae.safetensors
- **Location:** D:\Fooocus-main\models\checkpoints\realvisxlV50_v40Bakedvae.safetensors

### LoRA (CASE B only):
- **File:** brutalism_style.safetensors
- **Location:** D:\Fooocus-main\models\loras\brutalism_style.safetensors
- **Weight:** 0.7
- **Source:** Civitai Brutalism Style LoRA

### Render Settings (Both Cases):
- **Width:** 1024
- **Height:** 1024
- **Performance:** Quality
- **Steps:** 40
- **Guidance Scale:** 7.0

---

## VERDICT

### Binary Decision:
**BASELINE better (LoRA provided no improvement)**

### Reasoning:
1. Brutalism Style LoRA at 0.7 weight produced NO measurable improvement
2. Both cases failed with IDENTICAL error patterns
3. Object readability did not improve
4. Abstract composition did not reduce
5. Plastic/toy-like reading did not reduce
6. Gemini validation results were equivalent

### Recommendation:
**REJECT brutalism_style.safetensors LoRA immediately**
- Do not keep for further testing
- Do not iterate on weight tuning
- Architecture/form-first LoRA did not override model's character/costume bias
- Base model's inherent bias is too strong for this LoRA to overcome

---

## ONE FINAL LINE

**"Did this LoRA improve how the model reads the subject as a manufactured object?"**

**NO.** The Brutalism Style LoRA at weight 0.7 produced no improvement in manufactured object readability. The model still reads Mikage as abstract texture/plastic rather than engineered ceramic shell.

---

*Report: P8_LORA_A_B_REPORT.md*
