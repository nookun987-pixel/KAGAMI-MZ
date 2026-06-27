# MIKAGE COMMANDER PACKAGE V1

**Package Date:** 2026-04-04  
**Lock Version:** 1.1.0  
**Locked By:** COLAB_RUNNER_PRIMARY_LOCK  

---

## LOCKED ARCHITECTURE SUMMARY

This package contains the **locked and production-ready** Mikage architecture.

### Execution Lane
- **Google Lane** is the production default
- **Imagen API** is the executor
- **Model:** imagen-3.0-generate-001
- **Location:** us-central1

### Runner
- **Colab Runner** is the primary runner
- **Local render** is fallback only (requires explicit override)
- **Legacy Fooocus** is deprecated and fallback only

### Control Core Authority
The local Control Core remains authoritative for:
- Job intake and spec generation
- Building render_job_payload.json
- Running local validation
- Gemini judgment
- Writing final_decision.json

### Enforcement Rules
- **NO IMAGE = NO PASS** remains enforced
- Validator must execute
- Gemini must parse successfully
- Hard fail rules still apply
- Color canon still enforced

---

## PACKAGE STRUCTURE

```
MIKAGE_COMMANDER_PACKAGE_V1/
├── control_core/          # Local orchestration and judgment
│   ├── orchestrator.js
│   ├── core/
│   │   ├── execution_lane_router.js
│   │   ├── invariants.js
│   │   ├── run_tracker.js
│   │   ├── schema_registry.js
│   │   └── state_machine.js
│   ├── validators/        # Validation logic
│   ├── rag/              # RAG retrieval
│   └── config/
│       └── execution_lane_lock.json
├── contracts/            # API contracts
│   ├── render_job_payload.json
│   └── render_result_bundle.json
├── renderers/            # Renderer adapters
│   ├── google_lane_adapter.js
│   ├── imagen_adapter.js
│   └── colab_runner_adapter.js
├── colab_runner/         # Colab execution
│   └── colab_runner.ipynb
├── runs/                 # Proof artifacts
│   └── GOOGLE_LANE_E2E_001/
├── commander/            # Placeholder for V1
└── README_LOCKED.md      # This file
```

---

## EXECUTION FLOW

```
Local Control Core
    ↓
Build render_job_payload.json
    ↓
Submit to Colab Runner (PRIMARY)
    ↓
Colab executes Imagen API
    ↓
Save output.png + result_bundle.json
    ↓
Local reads returned bundle
    ↓
Local validator executes
    ↓
Gemini judge executes
    ↓
final_decision.json written locally
```

---

## USAGE

### Environment Setup
```bash
# Required for Google Lane
export GOOGLE_APPLICATION_CREDENTIALS=service-account-key.json

# Required for Colab Runner
export USE_COLAB_RUNNER=true
export COLAB_INPUT_PATH=./colab_jobs
export COLAB_OUTPUT_PATH=./colab_outputs
```

### Running a Job
```javascript
const job = require('./jobs/your_job.json');
const { orchestrateLegacy } = require('./control_core/orchestrator');

orchestrateLegacy(job).then(result => {
  console.log('Job complete:', result);
});
```

---

## OVERRIDE PROTOCOLS

### Fallback to Direct Imagen (no Colab)
```bash
unset USE_COLAB_RUNNER
# or
USE_COLAB_RUNNER=false
```

### Fallback to Legacy Fooocus
```json
{
  "job_id": "your_job",
  "USE_LEGACY_FOOOCUS": true
}
```

---

## PROOF OF LOCK

The proof run folder `runs/GOOGLE_LANE_E2E_001/` contains the verified execution artifacts demonstrating the locked architecture.

---

## VERIFICATION

All runs must include in artifacts:
```json
{
  "execution_lane": "google",
  "executor_type": "imagen_api",
  "execution_runner": "colab",
  "runner_status": "PRIMARY",
  "execution_lane_locked": true,
  "execution_lane_lock_version": "1.1.0"
}
```

---

**END OF README**
