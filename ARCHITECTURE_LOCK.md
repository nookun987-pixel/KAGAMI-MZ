# MIKAGE EXECUTION LANE ARCHITECTURE LOCK

**LOCK DATE:** 2026-04-04  
**LOCK VERSION:** 1.1.0  
**LOCKED BY:** COLAB_RUNNER_PRIMARY_LOCK  

---

## 1. LOCK STATUS: ACTIVE

The **Colab Runner** is now the **official primary image execution runner** for Mikage.

**Local Control Core** remains the control plane for:
- Job intake and spec generation
- Building render_job_payload.json
- Running local validation
- Gemini judgment
- Writing final_decision.json

**Colab Runner** handles:
- Receiving render_job_payload.json
- Executing Imagen API calls
- Producing output.png + result_bundle.json
- Returning results to local

---

## 2. DEFAULT CONFIGURATION

```json
{
  "execution_lane_default": "google",
  "executor_type_default": "imagen_api",
  "execution_runner_default": "colab",
  "execution_runner_status": "PRIMARY",
  "local_render_status": "FALLBACK_ONLY",
  "local_render_requires_explicit_override": true,
  "legacy_fooocus_status": "FALLBACK_ONLY",
  "legacy_fooocus_requires_explicit_override": true
}
```

---

## 3. EXECUTION FLOW (DEFAULT)

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

## 4. RUNNER HIERARCHY

### 4.1 Primary Runner (DEFAULT)
- **Runner:** `colab`
- **Lane:** `google`
- **Executor:** `imagen_api`
- **Model:** `imagen-3.0-generate-001`
- **Location:** `us-central1`
- **Status:** `PRIMARY`

### 4.2 Direct Imagen Fallback
- **Runner:** `direct_imagen`
- **Status:** `FALLBACK`
- **Trigger:** When `USE_COLAB_RUNNER` is not set to `true`
- **Use case:** When Colab is unavailable

### 4.3 Legacy Fooocus (FALLBACK ONLY)
- **Runner:** `legacy_fooocus`
- **Status:** `FALLBACK`
- **Requirements:** Explicit `USE_LEGACY_FOOOCUS: true` flag

---

## 5. ARTIFACT CONTRACT

### 5.1 Runner Metadata (Mandatory)
Every run must include these fields in `final_decision.json` and `job_summary.json`:

```json
{
  "execution_lane": "google",
  "executor_type": "imagen_api",
  "execution_runner": "colab",
  "runner_status": "PRIMARY",
  "execution_lane_status": "PRODUCTION",
  "render_model": "imagen-3.0-generate-001",
  "render_location": "us-central1",
  "execution_lane_locked": true,
  "execution_lane_lock_version": "1.1.0"
}
```

### 5.2 Summary Text Output
The `summary.txt` artifact must include:
```
execution_lane: google
executor_type: imagen_api
execution_runner: colab
runner_status: PRIMARY
execution_lane_status: PRODUCTION
```

---

## 6. REJECT RULES (UNCHANGED)

All existing reject rules remain in effect:
- NO IMAGE = NO PASS
- Validator must execute
- Gemini must parse successfully
- Hard fail rules still apply
- Color canon still enforced
- Local final decision authority preserved

---

## 7. IMPLEMENTATION DETAILS

### 7.1 Router Module
- **File:** `core/execution_lane_router.js`
- **Function:** `getExecutionLaneMetadata(job)`
- **Function:** `routeRenderExecution(job, promptPackage, artifactPaths)`

### 7.2 Colab Runner Adapter
- **File:** `renderers/colab_runner_adapter.js`
- **Function:** `executeColabRender(job, promptPackage, artifactPaths)`
- **Function:** `submitToColab(job, promptPackage, artifactPaths)`
- **Function:** `pollForCompletion(submissionInfo)`

### 7.3 Configuration File
- **File:** `config/execution_lane_lock.json`
- **Purpose:** Central lock configuration

### 7.4 Orchestrator Integration
- **File:** `orchestrator.js`
- **Import:** `const { getExecutionLaneMetadata, LOCK_CONFIG } = require("./core/execution_lane_router")`
- **Injection Point:** `orchestrateLegacy()` function
- **Lane Metadata:** Injected into `finalDecision` and `summary` objects

---

## 8. OVERRIDE PROTOCOL

### 8.1 Direct Imagen Fallback
To bypass Colab and use direct Imagen API:
```bash
unset USE_COLAB_RUNNER
# or
USE_COLAB_RUNNER=false
```

### 8.2 Legacy Fooocus
To use legacy Fooocus path (requires explicit action):
```json
{
  "job_id": "...",
  "USE_LEGACY_FOOOCUS": true
}
```

---

## 9. VERIFICATION CHECKLIST

- [x] Colab runner is primary default
- [x] Local render is marked FALLBACK_ONLY
- [x] Lane metadata visible in run artifacts
- [x] Runner metadata (execution_runner) visible in artifacts
- [x] Local validator still executes after render
- [x] Gemini judge still executes after render
- [x] Final decision still made locally
- [x] Documentation reflects locked architecture
- [x] Artifact spine unchanged
- [x] Reject behavior unchanged
- [x] final_decision.json includes execution_runner field
- [x] job_summary.json includes execution_runner field
- [x] summary.txt includes execution_runner line

---

## 10. FILES CHANGED

| File | Change |
|------|--------|
| `config/execution_lane_lock.json` | MODIFIED - Added runner configuration |
| `core/execution_lane_router.js` | MODIFIED - Added runner metadata |
| `renderers/colab_runner_adapter.js` | NEW - Colab runner implementation |
| `orchestrator.js` | MODIFIED - Added runner fields to artifacts |
| `ARCHITECTURE_LOCK.md` | MODIFIED - This documentation |

---

## 11. NEXT ACTIONS

1. **LOCK COMPLETE** - Colab Runner is primary
2. **Local render** is marked FALLBACK_ONLY
3. **Direct Imagen** is secondary fallback
4. **All new jobs** will use Colab Runner by default (when `USE_COLAB_RUNNER=true`)
5. **Monitor** for any edge cases requiring fallback

---

**END OF ARCHITECTURE LOCK DOCUMENTATION**
