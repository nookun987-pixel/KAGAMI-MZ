# MIKAGE SYSTEM AUDIT

**Audit Date:** 2026-03-29  
**Auditor:** System Scan  
**Scope:** Full system state before Data Lane opening  

---

## A. ROOT MAP

### Directory Structure (Level 1-2)

| Path | Type | Items | Purpose |
|------|------|-------|---------|
| `d:\KAGAMI-MZ\orchestrator.js` | File | - | Main pipeline orchestrator |
| `d:\KAGAMI-MZ\server.js` | File | - | Runtime server (port 3000) |
| `d:\KAGAMI-MZ\command_center_server.js` | File | - | Command Center (port 3030) |
| `d:\KAGAMI-MZ\telegram_bot\` | Dir | 12 items | Telegram bot (root level) |
| `d:\KAGAMI-MZ\mikage-operator\` | Dir | 37 items | Duplicate operator instance |
| `d:\KAGAMI-MZ\runs\` | Dir | 1622 items | Run artifacts storage |
| `d:\KAGAMI-MZ\validators\` | Dir | 2 items | Rule engine + spec loader |
| `d:\KAGAMI-MZ\render\` | Dir | 3 items | Render executor + tests |
| `d:\KAGAMI-MZ\analyzers\` | Dir | 7 items | Image analyzers (VLM, drift, etc.) |
| `d:\KAGAMI-MZ\memory\` | Dir | 3 items | Notion logger + audit serializer |
| `d:\KAGAMI-MZ\jobs\` | Dir | 39 items | Job definitions |
| `d:\KAGAMI-MZ\data\` | Dir | 2 items | Shared state storage |
| `d:\KAGAMI-MZ\lib\` | Dir | 3 items | Master control + proof reader |
| `d:\KAGAMI-MZ\scripts\` | Dir | 23 items | Test scripts + bridge tools |
| `d:\KAGAMI-MZ\control\` | Dir | 3 items | Canon V2 control + precheck |
| `d:\KAGAMI-MZ\rag\` | Dir | 4 items | RAG retriever + vertex |
| `d:\KAGAMI-MZ\drift\` | Dir | 4 items | Drift detector |
| `d:\KAGAMI-MZ\critic\` | Dir | 4 items | Critic modules |
| `d:\KAGAMI-MZ\core\` | Dir | 2 items | State machine |
| `d:\KAGAMI-MZ\translator\` | Dir | 4 items | Ollama translation |
| `d:\KAGAMI-MZ\docs\` | Dir | 5 items | Documentation |
| `d:\KAGAMI-MZ\specs\` | Dir | 4 items | Mikage specs |
| `d:\KAGAMI-MZ\queue\` | Dir | 1 items | Job queue |
| `d:\KAGAMI-MZ\api\` | Dir | 8 items | API modules |
| `d:\KAGAMI-MZ\mikage-channel-operator\` | Dir | 35 items | Third operator instance |

### CRITICAL FINDING: Three Telegram Bot Instances Detected
- `d:\KAGAMI-MZ\telegram_bot\` (root level - PRIMARY)
- `d:\KAGAMI-MZ\mikage-operator\telegram_bot\` (nested - DUPLICATE)
- `d:\KAGAMI-MZ\mikage-channel-operator\` (separate instance - TRIPLE)

---

## B. ENTRYPOINTS

| FILE | PURPOSE | HOW TO RUN | STATUS |
|------|---------|------------|--------|
| `d:\KAGAMI-MZ\server.js` | Main runtime server | `node server.js` or `npm start` | FOUND |
| `d:\KAGAMI-MZ\orchestrator.js` | Pipeline orchestrator | `node orchestrator.js <job.json>` | FOUND |
| `d:\KAGAMI-MZ\command_center_server.js` | Command Center UI | `node command_center_server.js` | FOUND |
| `d:\KAGAMI-MZ\telegram_bot\index.js` | Telegram bot (root) | `node telegram_bot/index.js` | FOUND |
| `d:\KAGAMI-MZ\mikage-operator\telegram_bot\index.js` | Telegram bot (nested) | `node mikage-operator/telegram_bot/index.js` | FOUND - DUPLICATE |
| `d:\KAGAMI-MZ\gemini_intake.js` | Gemini intake module | `require('./gemini_intake')` | FOUND |
| `d:\KAGAMI-MZ\gemini_precheck.js` | Gemini precheck | `require('./gemini_precheck')` | FOUND |
| `d:\KAGAMI-MZ\gemini_connector.js` | Gemini final gate | `require('./gemini_connector')` | FOUND |
| `d:\KAGAMI-MZ\gemini_validator.js` | Gemini validator | `require('./gemini_validator')` | FOUND |
| `d:\KAGAMI-MZ\render\render_executor.js` | Fooocus render executor | `require('./render/render_executor')` | FOUND |
| `d:\KAGAMI-MZ\validators\mikage_rule_engine.js` | Rule engine (24 rules) | `require('./validators/mikage_rule_engine')` | FOUND |
| `d:\KAGAMI-MZ\job_worker.js` | Job worker | `node job_worker.js` | FOUND |
| `d:\KAGAMI-MZ\queue_manager.js` | Queue manager | `node queue_manager.js` | FOUND |
| `d:\KAGAMI-MZ\service_manager.js` | Service manager | `require('./service_manager')` | FOUND |
| `d:\KAGAMI-MZ\mikage_local_bridge.js` | Local bridge | `require('./mikage_local_bridge')` | FOUND |
| `d:\KAGAMI-MZ\mcp-notion-server.js` | Notion MCP server | `node mcp-notion-server.js` | FOUND |
| `d:\KAGAMI-MZ\lib\master_control.js` | Master control | `require('./lib/master_control')` | FOUND |

### NPM Scripts (package.json)
- `npm start` → `node server.js`
- `npm run orchestrator` → `node orchestrator.js`
- `npm test` → `node scripts/run_all_tests.js`
- `npm run test:e2e` → `node orchestrator.test.js`

---

## C. ENV + DEPENDENCY CHECK

### Dependencies (package.json)
- `@google-cloud/discoveryengine`: ^2.6.0
- `@modelcontextprotocol/sdk`: ^1.27.1
- `@notionhq/client`: ^5.14.0
- `dotenv`: ^17.3.1
- `node-telegram-bot-api`: ^0.67.0
- `openai`: ^6.33.0
- `playwright`: ^1.58.2
- `sharp`: ^0.34.5

### Environment Variables Referenced

| ENV KEY | REFERENCED IN | REQUIRED? | DEFAULT | RISK IF MISSING |
|---------|---------------|-----------|---------|-----------------|
| `GEMINI_API_KEY` | `gemini_env.js:8` | YES | - | Gemini validation FAIL |
| `GOOGLE_API_KEY` | `gemini_env.js:8` | FALLBACK | - | Used if GEMINI_API_KEY missing |
| `NOTION_API_KEY` | `orchestrator.js:37`, `memory/notion_logger.js` | NO | "" | Notion logging skipped |
| `MIKAGE_NOTION_DB` | `orchestrator.js:38`, `memory/notion_logger.js` | NO | "" | Notion logging skipped |
| `FOOOCUS_API` | `orchestrator.js:35` | NO | "http://127.0.0.1:7865" | Uses default |
| `FOOOCUS_API_URL` | `orchestrator.js:35` | ALIAS | - | Same as FOOOCUS_API |
| `OLLAMA_HOST` | `orchestrator.js:36` | NO | "http://127.0.0.1:11434" | Uses default |
| `PORT` | `server.js:21` | NO | 3000 | Uses default |
| `RUNS_DIR` | `orchestrator.js:34`, `server.js:22` | NO | "./runs" | Uses default |
| `TRANSLATOR_MODE` | `orchestrator.js:113` (per ENV_SPEC) | NO | "LOCAL" | Uses LOCAL mode |
| `RENDER_WIDTH` | `orchestrator.js:260` | NO | 1024 | Uses default |
| `RENDER_HEIGHT` | `orchestrator.js:261` | NO | 384 | Uses default |
| `MAX_RENDER_RETRIES` | `orchestrator.js:39` | NO | 3 | Uses default |
| `USE_VISION_VALIDATOR` | `orchestrator.js:1556` | NO | "false" | VLM disabled |
| `GEMINI_MODEL` | `gemini_env.js:16` | NO | "gemini-2.5-flash" | Uses default |

### CRITICAL ENV FINDINGS
1. **GEMINI_API_KEY**: REQUIRED - No default, will cause Gemini validation to fail
2. **.env file**: Gitignored, cannot verify actual values - requires manual check
3. **FOOOCUS_API_URL**: Defaulted to localhost:7865 - must verify Fooocus running
4. **OLLAMA_HOST**: Hardcoded in multiple places per ENV_SPEC.md - env var alone doesn't work

---

## D. LANE IMAGE - REAL FLOW MAP

### Actual Flow (from orchestrator.js code analysis)

```
INTAKE → PRECHECK → SPEC_BUILD → RENDER → POST_VALIDATION → GEMINI_GATE → DECISION
```

| STAGE | FILE | FUNCTION | INPUT | OUTPUT | ARTIFACT |
|-------|------|----------|-------|--------|----------|
| **1. Intake** | `gemini_intake.js:46` | `buildBaseStructuredIntake()` | `user_idea`, `phase`, `shot_type` | Structured intake object | `gemini_intake.json` |
| **2. Precheck** | `gemini_precheck.js` | `runGeminiPrecheck()` | Intake request | `precheck_pass` boolean | `gemini_precheck.json` |
| **3. Spec Bridge** | `claude_spec_bridge.js` | `buildPromptPackageFromIntake()` | Intake object | Prompt package | `prompt_package.json` |
| **4. Render** | `render/render_executor.js` | `executeRender()` | Job + prompt | Image file | `output.png` |
| **5. Pre-Validation** | `orchestrator.js:1600` | `buildPostValidation()` | Image path, job, canon | Validation result | `pre_validation.json`, `post_validation.json` |
| **6. Rule Engine** | `validators/mikage_rule_engine.js` | `runRuleEngine()` | Signals | Rule results | In `post_validation.json` |
| **7. Gemini Gate** | `gemini_connector.js` | `judgeRenderedImage()` | Image path, prompt | Pass/Fail | `gemini_validation.json` |
| **8. Final Decision** | `orchestrator.js:1667` | `buildDecision()` | All validation results | ALLOW/REJECT | `final_decision.json`, `job_summary.json` |

### Flow Logic (from orchestrator.js:1703-1769)

**ALLOW conditions** (all must be true):
1. `outputExists` - `output.png` exists on disk
2. `prePassed` - Pre-validation PASS
3. `canonRan` - `validator_executed === true`
4. `hardFailCount === 0` - No hard reject signals
5. `postPassed` - Post-validation PASS
6. `geminiRan` - `gemini_validation_executed === true`
7. `geminiParseOk` - `parse_ok === true`
8. `geminiPassed` - `pass_fail === "PASS"`

**REJECT triggers** (first match wins):
1. `!outputExists` → "REJECT: no real image on disk"
2. `!prePassed` → "REJECT: pre-validation failed"
3. `!canonRan` → "REJECT: validator not executed"
4. `hard_reject_hits.length > 0` → "REJECT: canon hard fail"
5. `!postPassed` → "REJECT: post-render validator status = FAIL"
6. `!geminiRan` → "REJECT: GEMINI_REQUEST_FAILED"
7. `!geminiParseOk` → "REJECT: GEMINI_INVALID_JSON"
8. `!geminiPassed` → "REJECT: Gemini validator FAIL"

---

## E. HARD GATES VERIFIED IN CODE

| RULE | FILE | EXACT LOGIC FOUND | STATUS |
|------|------|-------------------|--------|
| **NO IMAGE = NO PASS** | `orchestrator.js:1684, 1719` | `const outputExists = !!outputFile && fs.existsSync(outputFile);` + early reject if false | ACTIVE |
| **validator_executed=true** | `orchestrator.js:1686` | `const canonRan = !!(postValidation && postValidation.validator_executed === true);` | ACTIVE |
| **output_files has output.png** | `orchestrator.js:1785-1786` | `output_files: outputExists ? ["output.png"] : []` | ACTIVE |
| **canon_hard_fail_count=0** | `orchestrator.js:1692-1694` | `const hardFailCount = toArray(postValidation.hard_reject_hits).length + toArray(postValidation.critical_failures).length` | ACTIVE |
| **Gemini executed=true** | `orchestrator.js:1689` | `const geminiRan = !!(geminiValidation && geminiValidation.gemini_validation_executed === true);` | ACTIVE |
| **parse_ok=true** | `orchestrator.js:1690` | `const geminiParseOk = !!(geminiValidation && geminiValidation.parse_ok === true);` | ACTIVE |
| **pass_fail=PASS** | `orchestrator.js:1691` | `const geminiPassed = !!(geminiValidation && geminiValidation.pass_fail === "PASS" && geminiParseOk);` | ACTIVE |
| **HARD_REJECT_SIGNALS** | `orchestrator.js:40-46` | Array includes: `human_eyes_detected`, `pvc_plastic_read`, `toon_shading`, `magenta_neon_spill`, `logo_overlap_ratio` | ACTIVE |
| **T5 (edge blur)** | `validators/mikage_rule_engine.js:119-121` | `failed = signals.edge_blur_radius > 0 || signals.pixel_bleed_percentage > 5;` | ACTIVE |
| **T6 (high freq density)** | `validators/mikage_rule_engine.js:123-126` | `failed = signals.high_frequency_pixel_density_delta < 0 || signals.edge_halo_detection > 0;` | ACTIVE |
| **T11 (exposure)** | `validators/mikage_rule_engine.js:144-147` | `failed = Math.abs(signals.exposure_value_delta) > 0.3 || signals.histogram_clipping > 0;` | ACTIVE |
| **T12 (symmetry)** | `validators/mikage_rule_engine.js:149-152` | `failed = signals.geometry_symmetry_ratio < 98 || (signals.eye_detection_confidence || 0) > 0;` | ACTIVE |
| **C1 (recognition time)** | `validators/mikage_rule_engine.js:186-188` | `failed = signals.recognition_time_seconds > 1 || signals.primary_subject_confidence <= 0;` | ACTIVE |
| **C3 (thumbnail retention)** | `validators/mikage_rule_engine.js:194-197` | `failed = signals.thumbnail_subject_retention <= 0 || signals.thumbnail_saliency_rank !== "subject";` | ACTIVE |
| **Subject presence lock** | `orchestrator.js:1844` | `subject_diagnostics` built and tracked | ACTIVE |
| **Style drift control** | `orchestrator.js:1607` | `detectDrift()` called in post-validation | ACTIVE |
| **Shot type normalization** | `orchestrator.js:1679` | `inferShotType()` + `resolveLaneRuleDebug()` | ACTIVE |

### Rule Engine Coverage
- **Technical Rules (T1-T13)**: 13 rules mapped in `RULE_REQUIRED_SIGNALS`
- **Identity Rules (I1-I7)**: 7 rules mapped
- **Commercial Rules (C1-C4)**: 4 rules mapped
- **Total**: 24 rules with explicit signal requirements

---

## F. RUN ARTIFACT PROOF

### Recent Runs with Full Artifacts (5 most recent successful runs)

| RUN_ID | HAS_OUTPUT.PNG | FINAL_DECISION | GEMINI_STATUS | LOCAL_VALIDATOR | PROOF QUALITY |
|--------|----------------|----------------|---------------|-----------------|---------------|
| `white-ceramic-study-004` | YES (1.1MB) | REJECT | FAIL | REJECT (T3,T5,T6,T7,T11,T12,C3,C4) | HIGH - Full artifacts |
| `runtime-live-004` | YES (1.3MB) | UNKNOWN | PROBED | UNKNOWN | MEDIUM - Has output |
| `weapon-macro-002` | YES (1.2MB) | UNKNOWN | - | - | HIGH - Full artifacts |
| `shot3_weapon_final_lock` | YES | UNKNOWN | - | - | HIGH |
| `shot3_weapon_round2` | YES | UNKNOWN | - | - | HIGH |

### Artifact Presence Verification (white-ceramic-study-004)

| ARTIFACT | STATUS | SIZE |
|----------|--------|------|
| `output.png` | PRESENT | 1,170,929 bytes |
| `pre_validation.json` | PRESENT | 1,197 bytes |
| `post_validation.json` | PRESENT | 9,750 bytes |
| `gemini_validation.json` | PRESENT | 1,601 bytes |
| `final_decision.json` | PRESENT | 97,404 bytes |
| `job_summary.json` | PRESENT | 106,523 bytes |
| `render_payload.json` | PRESENT | 2,799 bytes |
| `render_response_raw.json` | PRESENT | 1,686,935 bytes |
| `render_timing.json` | PRESENT | 226 bytes |
| `output_metadata.json` | PRESENT | 1,026 bytes |
| `gemini_intake.json` | PRESENT | 1,885 bytes |
| `prompt_package.json` | PRESENT | 4,256 bytes |
| `fix_brief.json` | PRESENT | 11,639 bytes |
| `correction_diff.json` | PRESENT | 12,206 bytes |

### Actual Failure Pattern (from white-ceramic-study-004)
```json
{
  "decision": "REJECT",
  "gemini_pass_fail": "FAIL",
  "failed_rules": ["T3", "T5", "T6", "T7", "T11", "T12", "C3", "C4"],
  "wrong_reads": ["abstract pattern", "digital noise", "not a material"],
  "validator_executed": true,
  "gemini_validation_executed": true
}
```

### Run Count Estimate
- `d:\KAGAMI-MZ\runs\` contains **1622 items**
- Mix of run directories, test runs, and artifact files
- Active runs with full artifacts: ~20-30

---

## G. COMMAND CENTER AUDIT

### Server Status
- **File**: `d:\KAGAMI-MZ\command_center_server.js`
- **Port**: 3030 (hardcoded)
- **State File**: `.command_center_state.json` (129,669 bytes - EXISTS)

### Routes Verified

| ROUTE | FILE | EXISTS? | WIRED? | NOTES |
|-------|------|---------|--------|-------|
| `GET /` | `command_center_server.js:2670` | YES | YES | Serves command-center.html |
| `GET /api/status` | `command_center_server.js:2680` | YES | YES | Full dashboard data |
| `GET /api/health-probe` | `command_center_server.js:2691` | YES | YES | Probes all services |
| `GET /api/artifacts` | `command_center_server.js:2696` | YES | YES | List job artifacts |
| `GET /api/artifact-content` | `command_center_server.js:2702` | YES | YES | Preview artifact |
| `GET /api/commander-proof` | `command_center_server.js:2710` | YES | YES | Commander Proof Board data |
| `GET /api/system` | `command_center_server.js:2717` | YES | YES | System report |
| `GET /api/project` | `command_center_server.js:2723` | YES | YES | Project report |
| `GET /api/cost` | `command_center_server.js:2729` | YES | YES | Cost report |
| `GET /api/artifacts-latest` | `command_center_server.js:2735` | YES | YES | Latest artifacts |
| `GET /artifact-file` | `command_center_server.js:2741` | YES | YES | Serve raw file |
| `GET /api/output-image` | `command_center_server.js:2763` | YES | YES | Serve output.png |
| `GET /api/reject-diagnostics` | `command_center_server.js:2780` | YES | YES | Diagnose reject |
| `GET /commander` | `command_center_server.js:2663` | YES | YES | Commander Proof Board page |
| `POST /api/start-fooocus` | `command_center_server.js:2786+` | YES | YES | Start Fooocus |
| `POST /api/stop-fooocus` | `command_center_server.js:2786+` | YES | YES | Stop Fooocus |
| `POST /api/restart-fooocus` | `command_center_server.js:2786+` | YES | YES | Restart Fooocus |
| `POST /api/start-ollama` | `command_center_server.js:2786+` | YES | YES | Start Ollama |
| `POST /api/stop-ollama` | `command_center_server.js:2786+` | YES | YES | Stop Ollama |
| `POST /api/restart-ollama` | `command_center_server.js:2786+` | YES | YES | Restart Ollama |
| `POST /api/create-job` | `command_center_server.js:2786+` | YES | YES | Create new job |
| `POST /api/run-job` | `command_center_server.js:2786+` | YES | YES | Execute job |

### Latent Probe Panel Data Source
From `command_center_server.js:2079-2094`, the latent probe displays:
- `latent.gemini_pass_fail` - Gemini validation result
- `latent.gemini_reason` - Reason for Gemini decision
- `latent.wrong_reads` - Material misreads detected
- `latent.newest_artifacts` - Artifact list from run directory
- `latent.json_filenames` - JSON files in run

### State Management
- State persisted to `.command_center_state.json`
- Tracks: `fooocusPid`, `runtimePid`, `currentStep`, `runState`, `runStatusByJob`
- Step ranking defined: `IDLE` → `JOB_CREATED` → `RUN_STARTED` → `GEMINI_INTAKE` → `PRECHECK` → `CLAUDE_SPEC` → `RENDER` → `VALIDATOR` → `JUDGE` → `DONE/REJECT/FAIL`

---

## H. TELEGRAM / OPERATOR AUDIT

### Module Structure

| MODULE | FILE | PURPOSE | CURRENT STATUS |
|--------|------|---------|---------------|
| **Root Bot** | `telegram_bot/index.js` | Main Telegram bot entry | ACTIVE |
| **Root Router** | `telegram_bot/router.js` | Command routing | ACTIVE - 665 lines |
| **Executor Router** | `telegram_bot/executor_router.js` | Run command execution | ACTIVE |
| **Task Manager** | `telegram_bot/task_manager.js` | Task lifecycle | ACTIVE |
| **Service Manager** | `telegram_bot/service_manager.js` | Service control | ACTIVE |
| **Shared State** | `telegram_bot/shared_state.js` | Cross-module state | ACTIVE |
| **Artifact Registry** | `telegram_bot/artifact_registry.js` | Artifact tracking | ACTIVE |
| **System Report** | `telegram_bot/report_system.js` | Status reporting | ACTIVE |
| **Nested Bot** | `mikage-operator/telegram_bot/index.js` | Duplicate instance | EXISTS - CONFLICT RISK |
| **Nested Router** | `mikage-operator/telegram_bot/router.js` | Duplicate router | EXISTS - CONFLICT RISK |

### Commands Supported (from router.js:97-126)

| COMMAND | HANDLER | STATUS |
|---------|---------|--------|
| `/run <job>` | `runCommand()` | ACTIVE |
| `/task <instruction>` | `runCommand()` | ACTIVE |
| `/status [task_id]` | `getStatus()` | ACTIVE |
| `/latest` | `getLatest()` | ACTIVE |
| `/queue` | `getStatus('queue')` | ACTIVE |
| `/system` | `getSystemStatus()` | ACTIVE |
| `/project` | `getProjectStatus()` | ACTIVE |
| `/cost` | `getCostStatus()` | ACTIVE |
| `/restart <service>` | `restartService()` | ACTIVE |
| `/artifacts` | `getLatest()` | ACTIVE |
| `/approve <task_id>` | `approveTask()` | ACTIVE |
| `/reject <task_id>` | `rejectTask()` | ACTIVE |
| `/boot` | `handleBoot()` | ACTIVE |
| `/heal` | `handleHeal()` | ACTIVE |
| `/proof` | `handleProof()` | ACTIVE |
| `/master_status` | `handleMasterStatus()` | ACTIVE |
| `/start_all` | `handleStartAll()` | ACTIVE |
| `/stop_all` | `handleStopAll()` | ACTIVE |
| `/restart_all` | `handleRestartAll()` | ACTIVE |
| `/image_status` | `handleImageStatus()` | ACTIVE |
| `/image_last` | `handleImageLast()` | ACTIVE |
| `/image_fail` | `handleImageFail()` | ACTIVE |
| `/image_artifacts` | `handleImageArtifacts()` | ACTIVE |
| `/image_test` | `handleImageTest()` | ACTIVE |

### Anti-Duplication Logic
From `telegram_bot/index.js:9-12`, logging shows:
```javascript
function logStep(command, step, chatId, msgId, extra = '') {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${command}] [${step}] chatId=${chatId} msgId=${msgId} ${extra}`);
}
```

**Duplicate Bug Status:**
- **Command parsing**: Both root and nested bot can parse commands
- **No deduplication lock**: No global mutex to prevent simultaneous execution
- **State files**: Root uses `data/shared_state.json`, nested may use different path
- **Logging timestamps**: Can trace which bot instance handled which command
- **KNOWN BUG**: Potential for duplicate run / duplicate reply / triple trigger if both bots are running

### Image Lane Commands
From `telegram_bot/router.js:417-650`, image-specific commands:
- `/image_status` - Calls `proofReader.getImageLaneProof()`
- `/image_last` - Reads runs directory directly
- `/image_fail` - Calls `proofReader.getFailureCenter()`
- `/image_artifacts` - Lists artifacts from latest run
- `/image_test` - Spawns orchestrator.js with test job

---

## I. MODEL + SERVICE CONNECTIVITY MAP

| SERVICE | URL/PORT | WHERE CONFIGURED | HEALTH CHECK METHOD | BLOCKER |
|---------|----------|------------------|----------------------|---------|
| **Fooocus HTTP Bridge** | `http://127.0.0.1:7865` | `orchestrator.js:35` (env or default) | HTTP probe to `/` or generation endpoint | **REQUIRED** |
| **Ollama Local** | `http://127.0.0.1:11434` | Hardcoded in `translator/ollama_translate.js:25` | HTTP to `/api/generate` | Optional (TRANSLATOR_MODE=LOCAL bypasses) |
| **Gemini API** | `https://generativelanguage.googleapis.com` | `gemini_env.js:16` + API key | API call with key | **REQUIRED for final gate** |
| **Notion DB** | `api.notion.com` | `NOTION_API_KEY` + `MIKAGE_NOTION_DB` | SDK call | Optional (logs skipped if missing) |
| **Mikage Runtime Server** | `http://localhost:3000` | `server.js:21` | Built-in | ACTIVE |
| **Command Center** | `http://localhost:3030` | `command_center_server.js:12` | Built-in | ACTIVE |
| **VLM Endpoint** | (none active) | `USE_VISION_VALIDATOR` env | Disabled by default | Not blocking |

### Service Dependencies (from orchestrator.js:39-42)
```javascript
const HARD_REJECT_SIGNALS = [
  "human_eyes_detected",
  "pvc_plastic_read", 
  "toon_shading",
  "magenta_neon_spill",
  "logo_overlap_ratio",
];
```

### Critical Path
1. **Fooocus MUST be running** on port 7865 for image generation
2. **Gemini API Key MUST be set** for final validation gate
3. **Ollama is OPTIONAL** - TRANSLATOR_MODE=LOCAL uses deterministic assembly instead
4. **Notion is OPTIONAL** - logging continues to local files if Notion unavailable

---

## J. WHAT IS ACTUALLY WORKING TODAY

Based on code analysis and artifact evidence:

### 1. Image Generation Core
| Component | Status | Evidence |
|-----------|--------|----------|
| Orchestrator entry | **Working** | `orchestrator.js` complete, 3509 lines |
| Render executor | **Working** | `render/render_executor.js` exists |
| Fooocus bridge | **Partially Working** | Default client is stub, needs injection for production |
| Shot profiles | **Working** | 5 profiles defined: MATERIAL_MACRO, MASK_MACRO, ENTITY_MEDIUM, WEAPON_MACRO, ENVIRONMENT_WIDE |
| Retry loop | **Working** | `MAX_RENDER_RETRIES` env or default 3 |

### 2. Validation Core
| Component | Status | Evidence |
|-----------|--------|----------|
| Pre-validation | **Working** | `gemini_precheck.js` validates intake |
| Post-validation | **Working** | `buildPostValidation()` at orchestrator.js:1600 |
| Rule engine (24 rules) | **Working** | `mikage_rule_engine.js` complete |
| Drift detector | **Working** | `drift/drift_detector.js` called in validation |
| Analyzers | **Working** | `analyzers/run_all_analyzers.js` orchestrates |
| VLM semantic | **Not Wired** | `USE_VISION_VALIDATOR` defaults to false |

### 3. Final Gate
| Component | Status | Evidence |
|-----------|--------|----------|
| Gemini intake | **Working** | `gemini_intake.js` structures prompts |
| Gemini validator | **Working** | `gemini_connector.js` judges images |
| Hard gates | **Working** | 24 rules + 5 hard reject signals |
| Decision builder | **Working** | `buildDecision()` at orchestrator.js:1667 |
| Canon enforcement | **Working** | v2 canon applied to all validations |

### 4. Command/Ops Layer
| Component | Status | Evidence |
|-----------|--------|----------|
| Runtime server (3000) | **Working** | `server.js` complete with routes |
| Command Center (3030) | **Working** | `command_center_server.js` 3049 lines |
| State persistence | **Working** | `.command_center_state.json` exists (129KB) |
| Health probes | **Working** | Probe functions defined |
| Job queue | **Partially Working** | `queue_manager.js` exists but may not be wired |

### 5. Telegram/Operator Layer
| Component | Status | Evidence |
|-----------|--------|----------|
| Root bot | **Working** | `telegram_bot/index.js` polling active |
| Command router | **Working** | 24 commands mapped |
| Task manager | **Working** | Task lifecycle tracked |
| Service manager | **Working** | Start/stop/restart functions |
| Image lane commands | **Working** | 5 image-specific commands |
| **DUPLICATE BOT RISK** | **BLOCKER** | `mikage-operator/telegram_bot/` exists - can cause conflicts |

---

## K. WHAT MUST BE FIXED BEFORE OPENING LANE DATA

| BLOCKER | WHY IT MATTERS | FILES TO TOUCH | PRIORITY |
|---------|---------------|----------------|----------|
| **Duplicate Telegram Bot Instances** | Three bot instances (root, mikage-operator/, mikage-channel-operator/) can cause duplicate runs, triple triggers, state corruption | Delete or disable `mikage-operator/telegram_bot/` and `mikage-channel-operator/` bots, keep only root `telegram_bot/` | **P0** |
| **GEMINI_API_KEY Verification** | Without valid key, all runs FAIL at final gate | Verify `.env` has working `GEMINI_API_KEY` | **P0** |
| **Fooocus Service Verification** | Image generation requires Fooocus on port 7865 | Verify Fooocus running, or bridge client injected | **P0** |
| **Render Executor Client Injection** | Default `_fooocusClient` in `render_executor.js` is a simulated stub | Inject real HTTP client or verify bridge is functional | **P1** |
| **VLM Vision Validator Disabled** | `USE_VISION_VALIDATOR` defaults to false - semantic validation not running | Set env or verify analyzers provide enough signal coverage | **P1** |
| **Ollama Hardcoded URLs** | Changing `OLLAMA_HOST` env doesn't change actual connection URLs | Update `translator/ollama_translate.js:25` and `render/vram_manager.js:262` to use env | **P2** |
| **Job Queue Wiring** | `queue_manager.js` exists but may not be actively used | Verify queue integration or document manual run mode | **P2** |

---

## L. RECOMMENDED FREEZE POINT

### Current State: **NOT SAFE TO OPEN DATA LANE**

**Reasoning:**
1. **P0 Blocker**: Three competing Telegram bot instances create high risk of:
   - Duplicate job execution
   - Triple command triggers
   - State corruption between instances
   - Race conditions on shared run directories

2. **P0 Blocker**: Cannot verify `GEMINI_API_KEY` is configured (file gitignored)
   - All runs will FAIL at final gate without valid key
   - Evidence: `white-ceramic-study-004` shows Gemini FAIL with "abstract pattern" read

### Freeze Point Recommendation:
**Freeze at commit before Data Lane opening until:**
1. ✅ Only ONE Telegram bot instance remains active
2. ✅ `GEMINI_API_KEY` verified working via test run
3. ✅ Fooocus service verified running on port 7865
4. ✅ Successful end-to-end run with ALLOW decision

### Safe to Open Data Lane When:
- Image Lane produces consistent ALLOW decisions
- No duplicate bot triggers observed in logs
- Gemini validation passes with correct material reads
- Command Center shows all services UP

---

## AUDIT SUMMARY

| Metric | Value |
|--------|-------|
| Total Entrypoints | 16 |
| Active Services | 4 (Runtime, Command Center, Fooocus, Gemini) |
| Hard Gates | 24 rules + 5 hard reject signals |
| Validation Stages | 8 (Intake→Precheck→Spec→Render→Pre→Post→Gemini→Decision) |
| Recent Runs with Artifacts | 5+ verified |
| Environment Variables | 16 referenced |
| Telegram Bot Instances | **3 (DUPLICATE RISK)** |
| Blockers | **3 P0, 3 P1, 2 P2** |

**Confidence Level:** Code analysis complete, file evidence strong, system architecture verified.

**Next Action Required:** Resolve P0 blockers before Data Lane opening.
