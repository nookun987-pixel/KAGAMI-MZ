# Known Failure Points

**Document Date:** 2026-03-31  
**Source:** Run artifact analysis, gate reports, validator outputs

---

## FAILURE POINT: Fooocus Style Drift / Override Behavior

- **Symptom:** Generated images deviate from explicit prompt specifications despite correct canon input. Style appears "polished" or "digital illustration" instead of "matte ceramic."
- **Likely Layer:** Render backend (Fooocus) style engine
- **Evidence Files:**
  - `runs/20260331_194954_797868/gemini_gate_report.json` - "appears as a vibrant, glossy digital rendering"
  - `runs/MASK_MACRO_RUN_01/final_decision.json` - "glossy plastic", "PVC sheen", "toy-like finish"
- **Current Status:** Unfixed - inherent to base model behavior

---

## FAILURE POINT: Background Drift

- **Symptom:** Backgrounds contain pure black (#000000) or non-canon decorative elements (blue concentric circles) instead of Sumi black or environmental context.
- **Likely Layer:** Render backend + prompt engineering
- **Evidence Files:**
  - `runs/20260331_194954_797868/gemini_gate_report.json` lines 19-21 - "pure black (#000000) and prominent vibrant blue concentric circles"
  - `runs/20260331_194954_797868/gemini_gate_report.json` lines 36-37 - "blue elements disrupt...negative space"
- **Current Status:** Unfixed - negative prompt insufficient

---

## FAILURE POINT: Crimson Seam Non-Compliance

- **Symptom:** Crimson (#E60000) appears across full facial features (ears, nose, lips, neck) instead of being limited to seams/cores only. Color also appears neon/overly vibrant.
- **Likely Layer:** Render backend color interpretation
- **Evidence Files:**
  - `runs/20260331_194954_797868/gemini_gate_report.json` lines 53-57 - "not limited to 'seams/cores ONLY'...prominently featured on ears, nose, lips"
- **Current Status:** Unfixed - requires stronger prompt constraints or model tuning

---

## FAILURE POINT: Material Read Drift

- **Symptom:** Porcelain B4C ceramic appears as glossy plastic or flat digital surface. Missing eggshell microtexture, Keshiki variation, and matte engineered finish.
- **Likely Layer:** Render backend material interpretation
- **Evidence Files:**
  - `runs/MASK_MACRO_RUN_01/final_decision.json` lines 16-22 - "glossy, reflective surface...plastic or toy-like feel"
  - `runs/MASK_MACRO_RUN_01/final_decision.json` lines 34-38 - correction guidance: "push dense matte engineered ceramic"
  - `runs/20260331_194954_797868/gemini_gate_report.json` lines 14-16 - "flat and uniform...lacking matte finish"
- **Current Status:** Unfixed - most persistent failure category

---

## FAILURE POINT: Validator Pass but Gemini Reject Mismatch

- **Symptom:** Automated pixel validator reports PASS (hard_fail_count=0) but Gemini gate rejects for semantic reasons. Indicates validator criteria insufficient.
- **Likely Layer:** Validation criteria mismatch
- **Evidence Files:**
  - `runs/20260331_194954_797868/validator_report.json` - "status": "pass", "hard_fail_count": 0
  - `runs/20260331_194954_797868/gemini_gate_report.json` - "pass_fail": "FAIL", "hard_fail_count": 1
  - `runs/20260331_194954_797868/report.json` lines 39-100 - validator checks all passing
- **Current Status:** Unfixed - validator needs semantic enhancement

---

## FAILURE POINT: Bridge / Transport / Endpoint Mismatch (Historical)

- **Symptom:** Earlier runs experienced VRAM conflicts, endpoint unreachable errors, transport timeouts.
- **Likely Layer:** Transport/connection layer
- **Evidence Files:**
  - `runs/server_test_001/error.json` - "VRAM busy with job server_test_001 in phase FOOOCUS_ACTIVE"
- **Current Status:** Partially Fixed - VRAM phase locking implemented, basic transport hardened

---

## FAILURE POINT: img2img Conditioning Wiring (Limited Evidence)

- **Symptom:** img2img with anchor images not always preserving reference structure. Some reproduction runs drift from anchor.
- **Likely Layer:** Render executor img2img handling
- **Evidence Files:**
  - `render/render_executor.js` lines 61-67 - anchor image detection logic
  - Various `img2img_retention` runs in main runs/ folder - mixed results
- **Current Status:** Uncertain - some runs show retention, others drift; needs more testing

---

## FAILURE POINT: No-Image / Missing Output Handling (Historical)

- **Symptom:** Earlier pipeline versions failed silently or crashed when Fooocus produced no output.
- **Likely Layer:** Output capture logic
- **Evidence Files:**
  - Historical test runs (not in this package) with empty output_files arrays
- **Current Status:** Fixed - error handling and empty output detection added

---

## Summary Table

| Failure Point | Layer | Status | Severity |
|---------------|-------|--------|----------|
| Fooocus style drift | Backend | Unfixed | High |
| Background drift | Backend/Prompt | Unfixed | Medium |
| Crimson seam non-compliance | Backend | Unfixed | Medium |
| Material read drift | Backend | Unfixed | High |
| Validator/Gemini mismatch | Validation | Unfixed | Medium |
| Bridge/transport mismatch | Transport | Partially Fixed | Low |
| img2img wiring | Render | Uncertain | Medium |
| No-image handling | Capture | Fixed | Low |

---

## Common Pattern

**The dominant failure mode is render backend non-compliance.** The pipeline correctly:
1. Parses requests
2. Generates specs
3. Builds prompts
4. Submits to backend

But the **backend produces outputs that drift from specifications**. This is a **model obedience problem**, not a pipeline logic problem.

---

*End of KNOWN_FAILURE_POINTS.md*
