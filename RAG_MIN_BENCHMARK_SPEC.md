# RAG MINIMAL BENCHMARK SPEC

**PURPOSE:** Define exactly one minimal proof protocol to measure whether RAG contextual grounding creates meaningful operational advantage.

**NOT FOR:** Proving world-changing quality gains.
**ONLY FOR:** Measuring operational advantage of contextual grounding.

---

## 1. BENCHMARK PROTOCOL

### 1.1 Test Setup

Run the SAME job twice with ONLY RAG state differing:

| Run | RAG State | Environment |
|-----|-----------|-------------|
| A | **ON** | `USE_REAL_VERTEX_RAG=true` |
| B | **OFF** | `USE_REAL_VERTEX_RAG=false` |

### 1.2 Controlled Variables (MUST BE IDENTICAL)

```json
{
  "job_id": "RAG_BENCHMARK_TEST",
  "shot_type": "MASK_MACRO",
  "generation_mode": "exploration",
  "user_idea": "white ceramic mask macro study",
  "render": {
    "seed": 334422,
    "width": 1152,
    "height": 1152,
    "performance": "Quality"
  }
}
```

### 1.3 Variable Under Test

ONLY variable allowed to differ:
- `USE_REAL_VERTEX_RAG` environment variable

---

## 2. MEASUREMENT CRITERIA

### 2.1 Output Image Comparison

| Metric | How Measured | Threshold |
|--------|--------------|-----------|
| Visual similarity | Manual side-by-side | Note differences |
| Identity consistency | Identity validator score | Compare scores |
| Canon adherence | Canon rule check | Compare violations |

### 2.2 Validator Verdict Comparison

```
Run A (RAG ON) validator verdict:  ___
Run B (RAG OFF) validator verdict: ___

Verdict match: YES / NO
```

### 2.3 Gemini Final Verdict Comparison

```
Run A (RAG ON) Gemini verdict:  PASS / FAIL / PARTIAL
Run B (RAG OFF) Gemini verdict: PASS / FAIL / PARTIAL

Verdict match: YES / NO
Quality score A: ___
Quality score B: ___
```

### 2.4 Manual Review Note

```
Reviewer: ________________
Date: _______

Visual quality difference: NONE / MINOR / SIGNIFICANT
Contextual grounding benefit: NONE / MINOR / SIGNIFICANT
Recommendation: ________________
```

---

## 3. SUCCESS CRITERIA

### 3.1 Minimum Acceptable Result

RAG is considered operationally useful if:

1. **BOTH runs complete** without pipeline errors
2. **RAG ON retrieves >0 chunks** from Vertex AI datastore
3. **Context is injected** into prompt before spec build
4. **Validator verdicts are comparable** (not significantly worse with RAG)

### 3.2 Operational Advantage Indicators

| Indicator | Weight | Threshold |
|-----------|--------|-----------|
| Higher identity score | Medium | +5% or more |
| Fewer canon violations | High | -1 or more |
| Better Gemini verdict | High | PASS vs FAIL |
| Faster convergence | Low | Fewer retry loops |

---

## 4. EXECUTION STEPS

### Step 1: Run A (RAG ON)

```bash
export GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json
export USE_REAL_VERTEX_RAG=true
node orchestrator.js --auto jobs/RAG_BENCHMARK_TEST.json
```

Verify:
- `rag_context.json` exists in run directory
- `chunks` array has >0 items
- `retriever_mode` = "vertex"
- `real_vertex_verified` = true

### Step 2: Run B (RAG OFF)

```bash
export USE_REAL_VERTEX_RAG=false
node orchestrator.js --auto jobs/RAG_BENCHMARK_TEST.json
```

Verify:
- `rag_context.json` exists (may be empty)
- `retriever_mode` = "mock"
- `real_vertex_verified` = false

### Step 3: Compare

Fill comparison table:

| Metric | Run A (RAG ON) | Run B (RAG OFF) | Delta |
|--------|----------------|-----------------|-------|
| Chunk count | ___ | ___ | ___ |
| Context length | ___ | ___ | ___ |
| Latency | ___ | ___ | ___ |
| Validator verdict | ___ | ___ | ___ |
| Gemini verdict | ___ | ___ | ___ |
| Identity score | ___ | ___ | ___ |
| Manual review | ___ | ___ | ___ |

---

## 5. DOCUMENTATION REQUIREMENTS

After benchmark completes, save:

1. **rag_benchmark_results.json** with all metrics
2. **output_a.png** from Run A
3. **output_b.png** from Run B
4. **comparison_notes.md** with manual review

---

## 6. INTERPRETATION GUIDE

### If RAG ON shows measurable advantage:

- Activate RAG for canon-critical shots per policy
- Accept 12s latency cost for those cases

### If RAG ON shows no measurable advantage:

- Keep RAG CONDITIONAL ON status
- Do NOT expand RAG scope
- Do NOT increase latency budget

### If RAG ON shows degradation:

- Investigate retrieval quality
- Check chunk relevance
- Do NOT expand RAG scope

---

## 7. STOP RULE

After ONE benchmark execution:

- Document results
- Update RAG_STATUS_LOCK.md
- DO NOT run additional benchmarks
- DO NOT continue optimization
- Proceed to architecture split

---

**VERDICT:** Benchmark protocol defined. Execute once, document, stop.
