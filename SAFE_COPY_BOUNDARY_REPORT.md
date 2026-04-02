# SAFE FILE COPY BOUNDARY REPORT — CORRECTED
## KAGAMI-MZ → MIKAGE-DATA-OPERATOR

**Generated:** Mar 29, 2026 (CORRECTED)  
**Source Root:** `D:\KAGAMI-MZ`  
**Target Root:** `D:\MIKAGE-DATA-OPERATOR`

---

## CRITICAL FINDING

**GROUP A — SAFE TO COPY is EMPTY**

After strict re-verification, NO files in KAGAMI-MZ are completely domain-agnostic. Every examined file contains image pipeline references.

---

## A. GROUP A — SAFE TO COPY

**STATUS: EMPTY — NO FILES QUALIFY**

All files in KAGAMI-MZ contain one or more of:
- `run` / `job` / `candidate` terminology tied to image pipeline
- References to `output.png`, `final_decision.json`, validation artifacts
- Image service dependencies (Fooocus, Ollama, port 7865/11434)
- State names: `RENDERING`, `CRITIQUED`, `DRIFT_CHECKED`, `POSTCHECKED`
- Bridge URLs pointing to image pipeline (`LOCAL_MIKAGE_BRIDGE_URL`)
- `artifacts` tied to image runs
- `retryCount` tied to image candidate loops

---

## B. GROUP B — REFERENCE ONLY / REWRITE

### B.1 State & Audit Patterns

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\core\state_machine.js` | State transition validation pattern | States: RENDERING, CRITIQUED, DRIFT_CHECKED, POSTCHECKED are image-specific | `src\state_machine.js` with data states: RECEIVED, PARSED, VALIDATED, TRANSFORMED, ANALYZED, EXPORTED |
| `D:\KAGAMI-MZ\memory\audit_serializer.js` | Trace entry builder, delta records, serialization | VALID_STEPS: FOOOCUS_RENDER, VRAM_OLLAMA_LOAD, CRITIC_VISION, DRIFT_IDENTITY, MATERIAL_SWAP, LOOP_CONTINUE, RENDERED | `src\audit_serializer.js` with data pipeline steps |

### B.2 Queue & Job Management

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\queue_manager.js` | Job queue CRUD, JSON persistence, status transitions | `jobs.json`, `job_id`, `execution_guard` tied to image job lifecycle with approval gates | `src\task_queue.js` with data task lifecycle |
| `D:\KAGAMI-MZ\mikage-operator\agent\state_store.js` | JSON state persistence, mutator pattern | `getLastJob`, `setLastJob`, `retryCount` tied to image job retry loop | `src\state_store.js` with `getLastTask`, `setLastTask` (no retry counter) |

### B.3 API Endpoints (All Image-Coupled)

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\api\create-job.js` | HTTP handler, JSON body parsing, fetch proxy | `LOCAL_MIKAGE_BRIDGE_URL` env var hardcoded to image bridge (port 3031) | `src\api\create-task.js` with data service URL |
| `D:\KAGAMI-MZ\api\status.js` | Health check endpoint pattern | `bridgeUrl` points to image bridge; `services` structure assumes Fooocus/Ollama | `src\api\health.js` with data service checks |
| `D:\KAGAMI-MZ\api\queue.js` | Queue status endpoint | Proxies to image bridge `/queue` endpoint | `src\api\queue.js` with data queue |
| `D:\KAGAMI-MZ\api\artifacts-latest.js` | Artifact fetch pattern | `/artifacts/latest` is image artifact endpoint | `src\api\exports-latest.js` |
| `D:\KAGAMI-MZ\api\latest-run.js` | Latest run endpoint | `/latest-run` is image run concept | `src\api\latest-batch.js` |
| `D:\KAGAMI-MZ\api\logs.js` | Logs endpoint | Proxies to image bridge | `src\api\logs.js` with data logs |
| `D:\KAGAMI-MZ\api\services.js` | Services status endpoint | Returns image service status | `src\api\services.js` for data services |
| `D:\KAGAMI-MZ\api\approve-job.js` | Approval endpoint | `approveJob()` is image pipeline approval gate | `src\api\approve-task.js` |

### B.4 Telegram Bot Patterns

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\telegram_bot\shared_state.js` | State persistence with tasks/services/runs/artifacts/costs/alerts | `artifacts`, `runs`, `costs` tied to image pipeline; hardcoded `../data/shared_state.json` | `src\state_store.js` with `datasets`, `jobs`, `exports` |
| `D:\KAGAMI-MZ\telegram_bot\router.js` | Command dispatch switch/case pattern | 15+ image commands: `/image_status`, `/image_last`, `/image_fail`, `/image_artifacts`, `/image_test`; imports `proof_reader` | `src\router.js` with data commands: `/load`, `/normalize`, `/analyze`, `/export`, `/insights` |
| `D:\KAGAMI-MZ\telegram_bot\task_manager.js` | Task lifecycle (QUEUED → RUNNING → DONE) | Hardcoded `../data/tasks.json`; image-specific status values | `src\task_manager.js` with data task states |
| `D:\KAGAMI-MZ\telegram_bot\report_system.js` | System status report with emoji formatting | Checks `tasklist \| findstr python` for Fooocus; `tasklist \| findstr ollama` | `src\report_system.js` checking data pipeline |
| `D:\KAGAMI-MZ\telegram_bot\report_project.js` | Project aggregation pattern | `related_run_id` field ties to image runs | `src\report_project.js` with `related_dataset_id` |
| `D:\KAGAMI-MZ\telegram_bot\report_cost.js` | Cost aggregation with date filtering | Cost categories assume image inference costs | `src\report_cost.js` with data processing costs |
| `D:\KAGAMI-MZ\telegram_bot\artifact_registry.js` | Artifact listing with file stats | `RUNS_DIR` hardcoded; filters `.png` (image artifacts) | `src\export_registry.js` for data exports |
| `D:\KAGAMI-MZ\telegram_bot\executor_router.js` | Command execution with spawn | Hardcoded `cwd: 'D:\\KAGAMI-MZ'`; Windows cmd spawn | `src\executor.js` with portable paths |
| `D:\KAGAMI-MZ\telegram_bot\service_manager.js` | Service restart with tasklist | Services: fooocus, ollama only | `src\service_manager.js` for data services |
| `D:\KAGAMI-MZ\telegram_bot\index.js` | Telegram bot entry point | Imports `router` which has image commands | `src\bot.js` clean entry point |

### B.5 Operator Patterns

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\mikage-operator\telegram_bot\router.js` | Cleaner command router | Imports `executor_router` calling orchestrator; `serviceManager` checks Fooocus/Ollama | `src\command_router.js` |
| `D:\KAGAMI-MZ\mikage-operator\telegram_bot\shared_state.js` | State shape enforcement | `runs`, `artifacts` fields | `src\state_store.js` |
| `D:\KAGAMI-MZ\mikage-operator\telegram_bot\task_manager.js` | Task CRUD | `related_run_id` field | `src\job_manager.js` |
| `D:\KAGAMI-MZ\mikage-operator\executor\local_executor.js` | Spawn with logging | `commands.json` references image scripts; writes to image `runsDir` | `src\executor\data_executor.js` |
| `D:\KAGAMI-MZ\mikage-operator\lib\proof_reader.js` | Proof generation pattern | 100% image: checks `output.png`, `post_validation.json`, `gemini_validation.json`, `final_decision.json`, `render_timing.json`; queries Fooocus/Ollama | `src\data_validator.js` checking data files |
| `D:\KAGAMI-MZ\mikage-operator\agent\approval.js` | Approval gate pattern | Stub 389 bytes — safe pattern but image context | `src\approval.js` |
| `D:\KAGAMI-MZ\mikage-operator\agent\brain.js` | Intent mapper pattern | Currently greets — safe pattern | `src\intent_mapper.js` |

### B.6 Control & Verification Patterns

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\lib\master_control.js` | Service orchestration with locks | Imports `service_runner` (Fooocus/Ollama), `verification_layer` (image checks), `proof_reader` (image proof); all methods start/stop image services | `src\service_control.js` |
| `D:\KAGAMI-MZ\lib\verification_layer.js` | Health check with caching | `checkFooocus()`, `checkOllama()`, `checkVisionValidator()`, `verifyImageLane()` — all image-specific | `src\health_checker.js` |
| `D:\KAGAMI-MZ\lib\service_runner.js` | Service lifecycle | SERVICE_CONFIG hardcodes Fooocus (port 7865) and Ollama (port 11434); `startCmd` launches `fooocus_bridge.py` | `src\service_runner.js` |
| `D:\KAGAMI-MZ\control\precheck.js` | Pre-execution validation | 26KB of Canon rule checking for image jobs | `src\preflight.js` |
| `D:\KAGAMI-MZ\control\canon_v2_control.js` | Canon control gate | Image Canon validation | `src\schema_validator.js` |

### B.7 Middleware & Drift Patterns

| Full Path | What to Learn | Why Not Safe | New File |
|-----------|--------------|--------------|----------|
| `D:\KAGAMI-MZ\middleware\constraints.js` | Constraint validation framework | All constants are image aesthetic: `TEXTURE_REQUIREMENTS`, `MICRO_HUMANITY_MOTIFS`, `NEGATIVE_PROMPT_CORE` | `src\validators\constraints.js` |
| `D:\KAGAMI-MZ\middleware\mapper.js` | Object mapping pattern | 21KB of image-specific mapping (art_direction, composition, material, mood, style) | `src\mapper.js` |
| `D:\KAGAMI-MZ\drift\drift_detector.js` | Drift detection framework | Detects image drift: `GLAMOUR_DRIFT`, `SYMMETRY_DRIFT`, `PLASTIC_FINISH_DRIFT`; calls `scoreIdentity(imagePath)` | `src\anomaly_detector.js` |

---

## C. GROUP C — FORBIDDEN

| Full Path | Reason |
|-----------|--------|
| `D:\KAGAMI-MZ\render\` | Render executor, VRAM manager — hard image dependency |
| `D:\KAGAMI-MZ\scripts\fooocus_bridge.py` | Fooocus Python bridge |
| `D:\KAGAMI-MZ\analyzers\` | All pixel/image analysis |
| `D:\KAGAMI-MZ\critic\` | Image rule critic, vision critic |
| `D:\KAGAMI-MZ\validators\` | Canon rule engine |
| `D:\KAGAMI-MZ\drift\identity_score.js` | Image identity scoring |
| `D:\KAGAMI-MZ\drift\narrative_score.js` | Image narrative scoring |
| `D:\KAGAMI-MZ\runs\` | 1,634 image run artifacts |
| `D:\KAGAMI-MZ\orchestrator.js` | Main image pipeline (154KB) |
| `D:\KAGAMI-MZ\orchestrator_runtime.js` | Orchestrator adapter |
| `D:\KAGAMI-MZ\gemini_*.js` | All Gemini image validation |
| `D:\KAGAMI-MZ\color_rules.js` | Image color Canon |
| `D:\KAGAMI-MZ\lane_rules.js` | Image lane rules |
| `D:\KAGAMI-MZ\translator\` | Ollama prompt translation for images |
| `D:\KAGAMI-MZ\rag\` | Image prompt enhancement |
| `D:\KAGAMI-MZ\specs\` | Image Canon specs |
| `D:\KAGAMI-MZ\MIKAGE_*.md` | Image Canon documentation |
| `D:\KAGAMI-MZ\MIKAGE_STRUCTURED_RULES.json` | Image rules |
| `D:\KAGAMI-MZ\mikage_color_canon.json` | Image colors |
| `D:\KAGAMI-MZ\prompts\` | Gemini prompts for image validation |
| `D:\KAGAMI-MZ\command_center_server.js` | Image control UI (118KB) |
| `D:\KAGAMI-MZ\server.js` | Image API server |
| `D:\KAGAMI-MZ\worker.js` | Image background worker |
| `D:\KAGAMI-MZ\jobs\` | Image job definitions (39 JSON files) |
| `D:\KAGAMI-MZ\tmp_gradio_config.json` | Fooocus/Gradio config |
| `D:\KAGAMI-MZ\test_*.js` | Image test files |
| `D:\KAGAMI-MZ\verify_*.js` | Image verification scripts |
| `D:\KAGAMI-MZ\e2e_*.js` | Image E2E tests |
| `D:\KAGAMI-MZ\mikage-channel-operator\` | Content extraction for image prompts |
| `D:\KAGAMI-MZ\local_bridge\` | API bridge with image job locking |

---

## D. SAFE STARTER SET FOR LANE DATA

**DO NOT COPY — CREATE FRESH:**

```
D:\MIKAGE-DATA-OPERATOR\
├── src\
│   ├── config.js                    # Environment loader (pattern from api/*)
│   ├── state_store.js               # Clean state: tasks, datasets, exports
│   ├── task_queue.js                # Queue CRUD (pattern from queue_manager)
│   ├── state_machine.js             # Data states only (pattern from core/)
│   ├── audit_serializer.js          # Data pipeline steps only
│   │
│   ├── data\
│   │   ├── load_data.js             # CSV/JSON/Parquet loader
│   │   ├── normalize_columns.js     # Column mapping (pattern from middleware/)
│   │   ├── validate_schema.js       # Schema validation (pattern from constraints/)
│   │   └── detect_anomalies.js      # Data drift (pattern from drift/)
│   │
│   ├── analysis\
│   │   ├── summarize.js             # Statistical summary
│   │   ├── insights.js               # Pattern detection
│   │   └── profile.js                # Data profiling
│   │
│   ├── reports\
│   │   ├── export_report.js         # Report generation (pattern from report_*)
│   │   ├── format_markdown.js       # Markdown output
│   │   └── format_json.js           # JSON output
│   │
│   ├── bot\
│   │   ├── router.js                # Command dispatch (pattern from telegram_bot/)
│   │   ├── commands.js              # Command definitions
│   │   └── formatters.js            # Response formatters
│   │
│   ├── api\
│   │   ├── health.js                # Health check (pattern from api/status)
│   │   ├── create-task.js           # Task creation (pattern from api/create-job)
│   │   ├── queue.js                 # Queue status
│   │   └── exports.js               # Export listing
│   │
│   ├── services\
│   │   ├── service_control.js       # Service orchestration (pattern from master_control)
│   │   ├── service_runner.js        # Service lifecycle (pattern from service_runner)
│   │   └── health_checker.js        # Health checks (pattern from verification_layer)
│   │
│   └── utils\
│       ├── file_helpers.js          # JSON/CSV read/write
│       └── date_helpers.js          # Date formatting
│
├── data\
│   ├── state.json
│   ├── tasks.json
│   └── exports\
│
├── config\
│   └── commands.json
│
└── package.json
```

---

## E. FINAL COPY PLAN

### E.1 COPY STRAIGHT

**STATUS: NONE**

No files qualify for direct copy. Every file requires rewrite.

### E.2 REWRITE (Pattern Reference Only)

| Pattern Source | Concept to Preserve | New Implementation |
|---------------|---------------------|------------------|
| `core/state_machine.js` | Transition validation, HAPPY_PATH, TERMINAL_STATES | Clean implementation with data states |
| `memory/audit_serializer.js` | Trace entries, delta records, serialization | Clean with data pipeline steps |
| `queue_manager.js` | Queue CRUD, job ID generation, status updates | Task queue with data lifecycle |
| `telegram_bot/shared_state.js` | getState/updateState mutator pattern | Clean state_store |
| `telegram_bot/router.js` | Command dispatch switch/case | Clean router with data commands |
| `lib/master_control.js` | Lock/unlock operation safety | Service control without image refs |
| `lib/verification_layer.js` | Cached health check pattern | Health checker for data sources |
| `middleware/constraints.js` | validateArtDirection() framework | Schema validation framework |
| `drift/drift_detector.js` | detectFlags() and determineVerdict() | Anomaly detection framework |
| `proof_reader.js` | Proof generation structure | Data validation proof |
| `report_*.js` | Report formatting with emoji/status | Data report formatters |
| `api/*.js` | HTTP handler patterns, fetch proxy | Clean API endpoints |

### E.3 ABSOLUTELY FORBIDDEN

- Any file in `render/`, `analyzers/`, `critic/`, `validators/`, `drift/identity_score.js`, `drift/narrative_score.js`
- `orchestrator.js` and all orchestrator variants
- `runs/` folder
- `jobs/` JSON files
- Any file containing `output.png`, `final_decision.json`, `post_validation.json`, `gemini_validation.json`
- Any file with `fooocus`, `ollama`, `render`, `candidate`, `vision` references

---

## F. STATE FIELD MAPPING (for rewrites)

| Image Lane Concept | Lane Data Equivalent |
|-------------------|----------------------|
| `job_id` | `task_id` |
| `run_id` | `batch_id` or `process_id` |
| `runState` | `taskState` |
| `activeJobId` | `activeTaskId` |
| `output.png` | `output.csv` / `output.json` |
| `artifacts` | `exports` |
| `runs` | `batches` or `processes` |
| `render` | `process` |
| `candidates` | `attempts` |
| `final_decision` | `validation_result` |
| `post_validation` | `schema_validation` |
| `gemini_validation` | `quality_check` |
| `identity_score` | `completeness_score` |
| `drift_flags` | `anomaly_flags` |
| `retryCount` | `attemptCount` (remove entirely if not needed) |

---

## G. VERIFICATION CHECKLIST

- [ ] ZERO imports from `D:\KAGAMI-MZ`
- [ ] ZERO references to `fooocus`, `ollama`, `output.png`, `render`
- [ ] ZERO `job` terminology (use `task` instead)
- [ ] ZERO `run` terminology (use `batch` or `process`)
- [ ] Self-contained `package.json`
- [ ] No `sharp`, `playwright` image-native deps
- [ ] Clean `src/` with only data-focused code

---

**END OF CORRECTED REPORT**
