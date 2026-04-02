# MIKAGE IMAGE MODEL WINNER SELECTION (P7-6 FINAL)

## Task: P7-3 through P7-6 - 3-Model Comparison & Winner Selection
**Date:** 2026-03-30  
**Status:** COMPLETED - Baseline Locked

---

## [P7-3] FOOOCUS CHECKPOINT VERIFICATION - ✅ COMPLETE

### Models Tested:
1. **realvisxlV50_v40Bakedvae.safetensors** (6.9 GB)
2. **realvisxlV50_v50LightningBakedvae.safetensors** (6.9 GB)
3. **juggernautXL_v8Rundiffusion.safetensors** (7.1 GB)

All models successfully loaded by Fooocus bridge.

---

## [P7-4] CONTROLLED COMPARISON - ✅ COMPLETE

### Test Parameters (Identical for all 3 runs):
- **Subject:** "single white engineered ceramic cube on neutral brutalist surface, centered, clear silhouette, industrial object readability"
- **Negative:** Anti-abstract lock + color canon negatives
- **Resolution:** 1024x1024
- **Performance:** Quality
- **Steps:** 40
- **Guidance:** 7.0

---

## [P7-5] COMPARISON TABLE

| MODEL | OUTPUT | GEMINI | LOCAL VALIDATOR | FAIL RULES | VERDICT |
|-------|--------|--------|-----------------|------------|---------|
| realvisxlV50_v40Bakedvae | Abstract neon pattern | FAIL | FAIL | 8 | **REJECT** |
| realvisxlV50_v50LightningBakedvae | Abstract neon pattern | FAIL | FAIL | 9 | **REJECT** |
| juggernautXL_v8Rundiffusion | Abstract multi-color | FAIL | FAIL | 12 | **REJECT** |

### Detailed Results:

**Model 1: realvisxlV50_v40Bakedvae**
- Run: `e2e_test_1774818822677`
- Output: 2448 KB
- Drift: COLOR_NEON_DRIFT, PLASTIC_COLOR_DRIFT
- Wrong reads: abstract, texture-only, toy-like

**Model 2: realvisxlV50_v50LightningBakedvae**
- Run: `e2e_test_1774819467146`
- Output: 2190 KB
- Drift: COLOR_NEON_DRIFT, PURE_WHITE_DRIFT, PURE_BLACK_DRIFT
- Wrong reads: abstract, texture-only, digital fill

**Model 3: juggernautXL_v8Rundiffusion**
- Run: `e2e_test_1774820074080`
- Output: 2144 KB
- Drift: COLOR_NEON_DRIFT, CRIMSON_OVERUSE, PLASTIC_COLOR_DRIFT
- Wrong reads: abstract, PVC sheen, glossy plastic, crimson overuse

---

## [P7-6] WINNER SELECTION & BASELINE LOCK

### Analysis:
**ALL 3 MODELS FAILED** but realvisxlV40 has fewest fail rules.

| Criteria | V40 | V50 | Juggernaut |
|----------|-----|-----|------------|
| Fail Rule Count | 8 | 9 | 12 |
| Neon Drift | HIGH | HIGHEST | HIGH |
| Plastic Read | HIGH | HIGH | HIGHEST |
| Object Readability | NONE | NONE | NONE |

### WINNER: realvisxlV50_v40Bakedvae.safetensors
**Reason:** "Least bad" option - fewest validation failures

### BASELINE LOCKED:
```json
// D:\KAGAMI-MZ\config.txt
{
    "default_model": "realvisxlV50_v40Bakedvae.safetensors"
}
```

**Note:** Winner still produces REJECT results. Needs prompt tuning + LoRA for quality improvement.

---

## [P6→P7] FINAL CONCLUSION

```
┌─────────────────────────────────────────────────────────────────┐
│  BASELINE LOCKED: realvisxlV50_v40Bakedvae                        │
│                                                                   │
│  Status: Image Lane OPERATIONAL but LOW QUALITY                  │
│  - Pipeline: ✅ Functional                                       │
│  - Model: ⚠️ Suboptimal (REJECT output)                          │
│  - Needs: LoRA + prompt refinement                               │
└─────────────────────────────────────────────────────────────────┘
```

### Evidence Summary:
- All 3 SDXL models tested → All REJECT
- Common failures: abstract composition, neon drift, plastic read
- Best option: realvisxlV50_v40Bakedvae (8 vs 9 vs 12 fail rules)

### Files Created:
- `MODEL_BASELINE_AUDIT.md` - Audit details
- `P7_MODEL_COMPARISON_RESULTS.md` - Full comparison
- `P7_CHECKPOINT_DOWNLOAD_GUIDE.md` - Download instructions
- `P7_CHECKPOINT_STATUS_REPORT.md` - Status reports
- `P7_MANUAL_DOWNLOAD_INSTRUCTIONS.md` - Manual guide
- `P7_FINAL_STATUS.md` - Final status

### Modified Files:
- `config.txt` - Updated default_model

---

**Image Lane baseline locked to realvisxlV50_v40Bakedvae.**

*Updated: 2026-03-30*
