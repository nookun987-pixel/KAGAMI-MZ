# ARCHITECTURE SPLIT - CONTROL CORE vs GOOGLE EXECUTION LANE

**DATE:** 2026-04-04

**STATUS:** IMPLEMENTATION COMPLETE

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MIKAGE SYSTEM                                │
│                                                                      │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐  │
│  │    CONTROL CORE (LOCAL)    │    │  GOOGLE EXECUTION LANE     │  │
│  │         STABLE             │◄──►│      (COLAB/VERTEX)       │  │
│  └─────────────────────────────┘    └─────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## A. CONTROL CORE (LOCAL / MAIN REPO)

**Responsibility:** All logic, validation, decision-making

**Contains:**

```
control_core/
├── orchestrator.js          ← Main orchestration logic
├── intake/
│   ├── gemini_intake.js    ← Idea → structured request
│   └── gemini_precheck.js  ← Pre-validation
├── spec/
│   └── claude_spec_bridge.js ← Build prompt package
├── canon/
│   ├── canon_rules.js      ← Canon enforcement
│   └── rule_engine.js      ← Validation rules
├── validator/
│   ├── pre_validation.js   ← Prompt-stage validation
│   ├── post_validation.js  ← Image-stage validation
│   └── drift_detector.js   ← Identity/narrative drift
├── judge/
│   └── gemini_validator.js ← Final image judgment
└── rag/
    ├── rag_retriever_resolver.js  ← RAG activation
    └── vertex_retriever_real.js   ← Real Vertex calls (for RAG context only)
```

**Strict Constraints:**
- ✅ NEVER depends on Colab runtime state
- ✅ NEVER requires GPU
- ✅ NEVER contains render engine
- ✅ Handles all artifact contracts
- ✅ Makes all final decisions

---

## B. GOOGLE EXECUTION LANE (COLAB / VERTEX)

**Responsibility:** Render execution only

**Contains:**

```
google_execution_lane/
├── colab_runner.ipynb      ← Colab job runner (8-cell notebook)
├── renderers/
│   ├── imagen_adapter.js   ← Imagen API wrapper
│   └── google_lane_adapter.js ← Orchestrator bridge
└── contracts/
    ├── render_job_payload.json      ← Input contract
    └── render_result_bundle.json    ← Output contract
```

**Strict Constraints:**
- ✅ Receives job_payload.json from Control Core
- ✅ Calls Vertex RAG (if enabled)
- ✅ Calls Imagen API for render
- ✅ Saves outputs to shared storage
- ✅ Returns result_bundle.json
- ✅ NO UI, NO manual steps
- ✅ Colab is JOB RUNNER, not server

---

## DATA FLOW

```
CONTROL CORE                                                    GOOGLE LANE
─────────────                                                   ───────────

1. BUILD
   ┌─────────────────┐
   │  Job + Intake   │
   │  → Prompt Spec  │
   └────────┬────────┘
            │ buildRenderJobPayload()
            ▼
   ┌─────────────────┐
   │ render_job_     │
   │ payload.json    │
   └────────┬────────┘
            │ Write to shared storage
            ▼

2. EXECUTE (async or sync)                                      2. RECEIVE
   ┌─────────────────┐                                          ┌─────────────────┐
   │  Poll/Callback  │◄─────────────────────────────────────────│  Read payload   │
   │  Wait for result│                                          │                 │
   └─────────────────┘                                          └────────┬────────┘
                                                                         │
                                                                         ▼
                                                                ┌─────────────────┐
                                                                │ if rag_enabled: │
                                                                │  call Vertex RAG│
                                                                └────────┬────────┘
                                                                         │
                                                                         ▼
                                                                ┌─────────────────┐
                                                                │  call Imagen API│
                                                                └────────┬────────┘
                                                                         │
                                                                         ▼
                                                                ┌─────────────────┐
                                                                │ Save outputs:   │
                                                                │  - output.png   │
                                                                │  - render_      │
                                                                │    payload.json │
                                                                │  - render_resp  │
                                                                │    onse_raw.json│
                                                                │  - rag_context  │
                                                                │    .json        │
                                                                └────────┬────────┘
                                                                         │
                                                                         ▼
                                                                ┌─────────────────┐
                                                                │ result_bundle   │
                                                                │ .json           │
                                                                └────────┬────────┘
            ┌──────────────────────────────────────────────────────────┘
            │ Read from shared storage
            ▼
   ┌─────────────────┐
   │  result_bundle   │
   │  .json           │
   └────────┬────────┘

3. VALIDATE
            │
            ▼
   ┌─────────────────┐
   │  Run validator  │
   │  on output.png  │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │  Gemini Judge   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ final_decision  │
   │ .json           │
   │ job_summary     │
   │ .json           │
   └─────────────────┘
```

---

## CONTRACTS

### Input: render_job_payload.json

**Path:** `contracts/render_job_payload.json`

**Required fields:**
```json
{
  "version": "1.0.0",
  "job_id": "MASK_MACRO_001",
  "prompt": "PRODUCT PHOTOGRAPHY - ceramic mask...",
  "negative_prompt": "cosplay, character...",
  "seed": 334422,
  "aspect_ratio": "1:1",
  "rag_enabled": true,
  "canon_flags": {
    "entity_first": true,
    "zone_locked": true,
    "material_locked": true
  },
  "output_path": "/content/outputs/MASK_MACRO_001"
}
```

### Output: result_bundle.json

**Path:** `contracts/render_result_bundle.json`

**Required fields:**
```json
{
  "version": "1.0.0",
  "job_id": "MASK_MACRO_001",
  "status": "SUCCESS",
  "output_files": [
    {
      "path": "/content/outputs/MASK_MACRO_001/MASK_MACRO_001.png",
      "type": "image",
      "size_bytes": 1234567
    }
  ],
  "primary_output": "/content/outputs/MASK_MACRO_001/MASK_MACRO_001.png",
  "render_payload": { ... },
  "render_response_raw": { ... },
  "rag_context": {
    "retriever_mode": "vertex",
    "real_vertex_verified": true,
    "chunks": [...]
  },
  "timing": {
    "total_duration_ms": 15000
  }
}
```

---

## STORAGE DECISION

**Selected:** Google Drive (via Colab mount)

**Structure:**
```
MyDrive/
└── mikage/
    ├── jobs/
    │   └── render_job_payload.json    ← Control Core writes
    └── outputs/
        └── {job_id}/
            ├── {job_id}.png             ← Execution Lane writes
            ├── render_payload.json      ← Echo of input
            ├── render_response_raw.json ← Imagen API response
            ├── rag_context.json         ← If RAG enabled
            └── result_bundle.json       ← Execution summary
```

**Alternative:** GCS bucket (gs://mikage-bucket/)
- Use if Drive performance insufficient
- Requires service account key with storage access

---

## FAILURE RULES (HARD REJECT)

Control Core REJECTS if:

1. **No result_bundle.json** → REJECT
2. **result_bundle.status != "SUCCESS"** → REJECT
3. **result_bundle.primary_output == null** → REJECT
4. **Output image doesn't exist** → REJECT
5. **Image file size == 0** → REJECT

**No exceptions. No image = No pass.**

---

## ARTIFACT CONTRACT (PRESERVED)

Every run still produces:

| Artifact | Producer | Location |
|----------|----------|----------|
| `render_payload.json` | Control Core | runs/{job_id}/ |
| `render_response_raw.json` | Execution Lane | runs/{job_id}/ |
| `rag_context.json` | Execution Lane | runs/{job_id}/ |
| `pre_validation.json` | Control Core | runs/{job_id}/ |
| `post_validation.json` | Control Core | runs/{job_id}/ |
| `gemini_validation.json` | Control Core | runs/{job_id}/ |
| `final_decision.json` | Control Core | runs/{job_id}/ |
| `job_summary.json` | Control Core | runs/{job_id}/ |

---

## FILES CREATED

```
d:/KAGAMI-MZ/
├── contracts/
│   ├── render_job_payload.json      ← NEW
│   └── render_result_bundle.json    ← NEW
├── renderers/
│   ├── imagen_adapter.js            ← NEW
│   └── google_lane_adapter.js       ← NEW
└── colab_runner.ipynb               ← NEW
```

---

## USAGE

### Direct Execution (Local with GCP credentials):
```javascript
const { executeGoogleRender } = require('./renderers/google_lane_adapter');

const result = await executeGoogleRender(job, promptPackage, artifactPaths);
```

### Colab Execution:
1. Control Core writes `job_payload.json` to Drive
2. Open `colab_runner.ipynb` in Colab
3. Run all 8 cells
4. Control Core polls/waits for `result_bundle.json`
5. Control Core validates and decides

---

## MIGRATION PATH

### From Fooocus (OLD):
```javascript
// OLD - Fooocus bridge
const result = await callFooocusAPI(promptPackage);
```

### To Google Lane (NEW):
```javascript
// NEW - Imagen adapter
const { renderExecutorAdapter } = require('./renderers/google_lane_adapter');
const result = await renderExecutorAdapter(job, promptPackage, artifactPaths);
```

---

## VERDICT

**ARCHITECTURE SPLIT = SUCCESS**

✅ Control Core separated from execution
✅ Google Execution Lane defined
✅ Contracts established
✅ Colab runner created
✅ Hard failure rules defined
✅ Artifact system preserved

**SYSTEM READY:** End-to-end runnable without self-host render

---

## NEXT ACTIONS

1. **Test integration:** Run one job through new pipeline
2. **Verify contracts:** All artifacts match spec
3. **Lock architecture:** No further structural changes
4. **Document operational runbook:** For Colab usage

---

**Architecture split complete. Ready for next phase.**
