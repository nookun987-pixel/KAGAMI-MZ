# Recommended Next Steps

**Date:** 2026-03-31  
**Audience:** External reviewers and build planners  
**Purpose:** Strict prioritization for next development phase

---

## What Should Be Stabilized First

### 1. Model/Backend Compliance Layer

**Priority: CRITICAL**

The single highest-impact improvement is making the render backend obey the canon.

**Options (in order of preference):**

- **Option A: LoRA Training** - Fine-tune a lightweight adapter for Mikage aesthetic
  - Target: Material read (matte ceramic), color canon, lighting consistency
  - Pros: Persistent, fast inference, portable
  - Cons: Requires dataset curation, training time
  
- **Option B: Enhanced Prompt Engineering** - Stronger negative constraints, style anchoring
  - Expand negative prompts with drift categories
  - Add explicit "do not" clauses for each failure point
  - Pros: No training required, quick to implement
  - Cons: May hit prompt length limits, backend may still override
  
- **Option C: Checkpoint Swap** - Evaluate alternative base models
  - Test checkpoints with better material/color adherence
  - Pros: May find drop-in improvement
  - Cons: Time-consuming, may introduce new drift

**Recommendation:** Pursue Option A (LoRA) as primary, Option B (prompts) as immediate mitigation.

---

### 2. Validator/Semantic Alignment

**Priority: HIGH**

Close the gap between validator PASS and Gemini FAIL.

**Actions:**
- Add semantic checks to validator (surface texture detection, color distribution analysis)
- Calibrate validator thresholds against Gemini rejection patterns
- Implement "pre-flight" color check before render dispatch

---

### 3. Iterative Correction Loop

**Priority: HIGH**

Auto-retry with adjusted parameters on gate failure.

**Current State:** MAX_RENDER_RETRIES=3 exists, but correction logic not fully proven.

**Improvements:**
- Map Gemini failure categories to specific prompt adjustments
- Track which corrections actually resolve issues
- Add progressive denoise adjustment for img2img anchor mode

---

### 4. Output Delivery Hardening

**Priority: MEDIUM**

While transport is functional, edge cases need coverage.

**Actions:**
- Timeout handling for long renders (>10 min)
- Partial output detection (corrupted PNG)
- Delivery confirmation with hash verification

---

## What Should NOT Be Built Yet

### Do NOT Build: Operator V0 Coordination Layer

**Status:** Blocked until current package review is complete

The Operator V0 (human-in-the-loop approval system) is the next major coordination layer, but it depends on:
1. Stabilized render compliance (above)
2. Clear understanding of current failure modes (this package)
3. Defined handoff points between automated and human judgment

**Build this AFTER:**
- LoRA or equivalent compliance layer is working
- Validator/Gemini alignment is improved
- Current package has been reviewed and understood

---

### Do NOT Build: Advanced Memory/Planning System

**Status:** Premature

Features like:
- Long-term character memory across sessions
- Multi-shot narrative planning
- Cross-run style consistency tracking

**These require:**
- Stable single-shot quality first
- Operator workflow defined
- Feedback loop proven

---

### Do NOT Build: Distributed/Cloud Scaling

**Status:** Not needed for current phase

- Current bottleneck is quality, not throughput
- Single GPU sufficient for development
- Cloud backend adds complexity without solving compliance issue

---

## Recommended Architectural Direction

### Immediate (Next 2-4 Weeks)

```
[Current Pipeline]
    ↓
[Add LoRA Training/Integration]
    ↓
[Enhance Validator Semantic Checks]
    ↓
[Prove Correction Loop]
```

### Medium Term (1-2 Months)

```
[Stabilized Pipeline]
    ↓
[Build Operator V0 Layer]
    ↓
[Define Human Handoff Protocols]
```

### Long Term (3+ Months)

```
[Operator + Automated Hybrid]
    ↓
[Advanced Memory/Planning]
    ↓
[Scale/Optimize]
```

---

## Key Principle

**Quality before coordination.**

There is no point building an Operator layer to review outputs if the render backend cannot reliably produce canon-compliant images. Fix the compliance problem first, then build the coordination layer.

---

## Success Criteria for Next Phase

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Render obedience | 80% pass rate | Gemini gate approval rate on MASK_MACRO lane |
| Validator/Gemini agreement | 90% | Both PASS or both FAIL on same outputs |
| Auto-correction success | 50% retry success | Second attempt passes after first failure |
| Transport reliability | 99% | Successful delivery without manual intervention |

---

## Resources Needed

| Item | Effort | Blockers |
|------|--------|----------|
| LoRA dataset curation | 1-2 days | Canon understanding (this package) |
| LoRA training | 2-4 hours GPU | Dataset ready |
| Validator enhancement | 3-5 days | Failure pattern analysis |
| Correction loop tuning | 2-3 days | Multiple run attempts |

---

## Important Note on Operator V0

**Operator V0 IS the next coordination layer, BUT only after:**

1. This export package is reviewed and understood
2. Current failure patterns are documented (DONE in this package)
3. Render compliance is improved to reduce operator burden

Building Operator V0 on top of an unstable render layer would result in:
- Excessive manual reviews
- Operator fatigue
- No clear criteria for ALLOW vs REJECT

---

*End of RECOMMENDED_NEXT_STEPS.md*
