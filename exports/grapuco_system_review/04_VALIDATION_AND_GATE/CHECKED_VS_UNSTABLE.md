# Checked vs Unstable

**Assessment Date:** 2026-03-31  
**Assessment Method:** Review of run artifacts, code inspection, recent failure patterns

---

## CHECKED / RELATIVELY STABLE

- **Intake Layer** - Idea parsing and normalization working consistently
- **Orchestrator Core** - Job lifecycle management, state transitions functional
- **Spec Generation** - Gemini intake produces structured specs reliably
- **Prompt Construction** - Bridge logic builds prompts from specs correctly
- **Render Dispatch** - Fooocus submission via HTTP and folder capture working
- **Output Retrieval** - Image capture from Fooocus outputs hardened
- **Artifact Recording** - JSON reports, decision trails, PNG storage operational
- **Transport Layer** - VRAM phase management prevents job conflicts
- **Basic Validator** - Pixel analysis (eyes, plastic, toon shading) functional
- **Rule Engine** - Canon rule matching against structured specs working
- **Gate Decision Logic** - ALLOW/REJECT with reasoning functional

---

## UNSTABLE / NOT YET HARDENED

- **Render Obedience** - Fooocus frequently overrides explicit prompt specifications
  - Material drift: porcelain → glossy/plastic
  - Color drift: Gofun whites → pure #FFFFFF
  - Background drift: Sumi black → pure #000000 or decorative elements
  - Crimson bleed: seams-only → full facial/neck coverage
  
- **Style Consistency** - No guarantee of consistent aesthetic across runs
  - Same spec can produce visually different outputs
  - Fooocus style engine introduces variability
  
- **Material Read** - Generated images often fail material canon
  - Expected: matte B4C technical ceramic, eggshell microtexture
  - Actual: glossy plastic, PVC sheen, toy-like finish
  
- **Color Canon Compliance** - Automated checks exist but enforcement weak
  - Pixel analyzer detects violations
  - But correction loop not fully implemented
  
- **Validator/Gemini Agreement** - Mismatched judgments common
  - Validator passes outputs that Gemini rejects (see run2 sample)
  - Indicates validator criteria insufficient for semantic compliance
  
- **VLM Availability** - Semantic analyzer backend intermittent
  - Depends on external Ollama/LLM service
  - Falls back to pixel-only when unavailable

---

## OPEN RISKS

- **Model Drift** - Base SD checkpoint may have baked-in biases conflicting with canon
  - Requires fine-tuning or LoRA for Mikage-specific aesthetic
  - Not yet implemented
  
- **Backend Reliability** - Single Fooocus instance, no failover
  - Local GPU dependency
  - No cloud backend fallback currently active
  
- **Retry Exhaustion** - MAX_RENDER_RETRIES=3 may not be sufficient
  - If canon drift is systematic, retries hit same issue
  - No escalation path to human operator yet
  
- **Feedback Loop Quality** - Correction prompts may not address root cause
  - BuildFixBrief logic exists but not proven to resolve drift
  
- **Scale Constraints** - Single-worker architecture
  - No job queueing beyond local JSON file
  - Concurrent job handling limited

---

## Evidence References

**Stable Claims Supported By:**
- `runs/server_test_001/` - Transport layer functional (VRAM conflict resolved)
- `orchestrator.js` lines 1-100 - Core imports and profile definitions
- `render/render_executor.js` lines 1-100 - Token validation, VRAM phases

**Unstable Claims Supported By:**
- `runs/20260331_194954_797868/` - Validator PASS but Gemini FAIL (see report.json, gemini_gate_report.json)
- `runs/MASK_MACRO_RUN_01/` - Material drift (final_decision.json lines 16-31)
- `runs/MASK_MACRO_RUN_02/` - Color canon violations (job_summary.json)

**Open Risks Inferred From:**
- `MIKAGE_ZENITH_CANON_V2.md` - Strict requirements vs observed outputs
- `gemini_gate_report.json` - Repeated same-category failures
- `orchestrator.js` - MAX_RENDER_RETRIES hardcoded, no model tuning code

---

## Confidence Levels

| Claim | Confidence | Basis |
|-------|------------|-------|
| Transport stable | HIGH | Direct test evidence, error resolution in logs |
| Render obedience unstable | HIGH | Repeated pattern across 10+ run artifacts |
| Validator/Gemini mismatch | HIGH | Documented in run2, multiple occurrences |
| Model drift risk | MEDIUM | Inferred from failure patterns, not directly tested |
| Backend reliability risk | MEDIUM | Single point of failure, no observed outage yet |

---

*End of CHECKED_VS_UNSTABLE.md*
