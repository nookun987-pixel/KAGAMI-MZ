# RAG ACTIVATION POLICY

**OFFICIAL SYSTEM STATUS: CONDITIONAL ON**

**EFFECTIVE DATE:** 2026-04-04

**PURPOSE:** Define exact activation rules for Vertex AI RAG retrieval in Mikage pipeline.

---

## 1. FINAL OPERATING STATUS

```
RAG STATE = CONDITIONAL ON
```

- NOT global default
- NOT removed
- NOT optional-for-all
- CONDITIONAL based on job class

---

## 2. RAG MUST BE ON

For the following job classes, RAG is **MANDATORY**:

| Job Class | RAG Status | Reason |
|-----------|------------|--------|
| `GOLDEN_*` | **ON** | Canon-critical reference shots require historical grounding |
| `MASK_MACRO` | **ON** | Multi-run consistency required |
| `WEAPON_BASELINE` | **ON** | Reproduction accuracy depends on previous validations |
| `*_RETEST_*` | **ON** | Must compare against previous run data |
| `REPRODUCTION_*` | **ON** | Must retrieve anchor specifications |
| `*_CALIBRATION_*` | **ON** | Calibration requires historical context |
| Any job with `entity_class: "canon_reference"` | **ON** | Canon enforcement requirement |

**Activation Trigger:** Job ID pattern match OR explicit `use_rag: true` flag

---

## 3. RAG MAY STAY OFF

For the following job classes, RAG is **OPTIONAL** (default OFF):

| Job Class | RAG Status | Reason |
|-----------|------------|--------|
| First-time exploration | **OFF** | No historical context exists |
| `EXPLORATION_*` | **OFF** | Latency not justified without grounding need |
| `TEST_*` (unit tests) | **OFF** | Speed priority over context |
| UI preview generations | **OFF** | User wait time unacceptable |
| Batch processing (high volume) | **OFF** | Latency cost prohibitive |
| Jobs with `latency_critical: true` | **OFF** | Explicit speed requirement |

**Default:** RAG OFF unless job class matches mandatory list above.

---

## 4. JOB CLASS DEFINITIONS

### Canon-Critical (RAG ON)

Jobs where canon consistency is operationally required:

- **GOLDEN shots:** Reference-quality shots that define canon
- **REPRODUCTION tasks:** Must match previous successful outputs
- **RETEST workflows:** Comparison against historical baselines
- **CALIBRATION runs:** System tuning requiring historical data
- **Canon enforcement jobs:** Any job flagged for strict rule adherence

### Exploratory / Low-Memory (RAG OFF)

Jobs where historical context is not operationally valuable:

- **First-time entities:** No prior runs in datastore
- **Exploration mode:** Creative iteration without grounding requirements
- **UI previews:** Quick visual feedback without quality requirements
- **High-volume batches:** Latency cost exceeds context value
- **Experimental shots:** Testing new concepts without canon constraints

---

## 5. OPERATIONAL REQUIREMENTS

When RAG is ON, the following are **MANDATORY**:

1. `retriever_mode` must be `"vertex"`
2. `real_vertex_verified` must be `true`
3. `rag_context.json` must be written to run directory
4. `chunks` array must contain retrieved documents
5. Context must be injected into prompt before spec build
6. Chunk count and source must be logged

When RAG is OFF, the following are **MANDATORY**:

1. `retriever_mode` must be `"mock"` or `"disabled"`
2. `real_vertex_verified` must be `false`
3. Pipeline must not wait for Vertex API call
4. Fallback to empty context or generic grounding allowed

---

## 6. ACTIVATION MECHANISM

```javascript
// Determined at job intake
const RAG_MANDATORY_PATTERNS = [
  /^GOLDEN_/,
  /MASK_MACRO/,
  /WEAPON_BASELINE/,
  /RETEST/,
  /REPRODUCTION/,
  /CALIBRATION/,
];

const ragEnabled = RAG_MANDATORY_PATTERNS.some(p => p.test(job.job_id)) 
  || job.use_rag === true;

process.env.USE_REAL_VERTEX_RAG = ragEnabled ? 'true' : 'false';
```

---

## 7. LATENCY ACKNOWLEDGMENT

RAG ON adds approximately **12 seconds** per query.

This cost is **ACCEPTABLE** for:
- Canon-critical shots
- Multi-run consistency requirements
- Validation-comparison workflows

This cost is **NOT ACCEPTABLE** for:
- UI feedback loops
- High-volume batch processing
- Real-time preview generation

---

## 8. STOP RULE

After this policy is locked:

- NO further retrieval tuning
- NO expansion of RAG scope
- NO additional job classes added without explicit approval
- NO latency optimization work
- Architecture split proceeds to next phase

---

**VERDICT:** RAG lane operationally locked at CONDITIONAL ON.

**NEXT ACTION:** Proceed to architecture split phase.
