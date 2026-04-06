/**
 * MIKAGE COMMAND HANDLER V1 — HARDENED
 * State machine, command_id tracing, route validation, history logging,
 * phase safety, result contract.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const RUNS_DIR = path.join(ROOT_DIR, "runs");
const MEMORY_DIR = path.join(ROOT_DIR, "memory");
const HISTORY_PATH = path.join(__dirname, "command_history.json");

const { classifyFailure } = require(path.join(ROOT_DIR, "training_loop", "fail_classifier"));
const { generatePatchPlan } = require(path.join(ROOT_DIR, "training_loop", "patch_engine"));
const { runABRetest } = require(path.join(ROOT_DIR, "training_loop", "ab_retest_runner"));
const { writeTrainingCase } = require(path.join(ROOT_DIR, "training_loop", "training_case_writer"));
const { generatePatchedJobSpec } = require(path.join(ROOT_DIR, "training_loop", "patched_job_spec_generator"));
const { dispatchExecution } = require(path.join(ROOT_DIR, "execution_lane", "execution_dispatcher"));

function loadCommandMap() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "command_map.json"), "utf-8"));
}

function nowIso() { return new Date().toISOString(); }
function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

// ---------------------------------------------------------------------------
// COMMAND STATE MACHINE
// ---------------------------------------------------------------------------
const COMMAND_STATES = ["RECEIVED", "VALIDATED", "ROUTED", "RUNNING", "COMPLETED", "FAILED"];

function createCommandTracker(commandId, intent) {
  const transitions = [];
  let current = null;

  function advance(state, detail) {
    if (!COMMAND_STATES.includes(state)) throw new Error(`Invalid command state: ${state}`);
    const entry = { from: current, to: state, at: nowIso() };
    if (detail) entry.detail = detail;
    transitions.push(entry);
    current = state;
    console.log(`[COMMAND][${commandId}] ${state}${detail ? ": " + detail : ""}`);
  }

  return { advance, getState: () => current, getTransitions: () => transitions };
}

// ---------------------------------------------------------------------------
// COMMAND HISTORY
// ---------------------------------------------------------------------------
function readHistory() {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  try {
    const raw = fs.readFileSync(HISTORY_PATH, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function appendHistory(entry) {
  const history = readHistory();
  history.push(entry);
  writeJson(HISTORY_PATH, history);
}

// ---------------------------------------------------------------------------
// VALIDATION HELPERS
// ---------------------------------------------------------------------------
function validateIntent(commandMap, intent, tracker) {
  // 1. Check blocked
  const blocked = (commandMap.safety && commandMap.safety.blocked_intents) || [];
  if (blocked.includes(intent)) {
    tracker.advance("FAILED", `BLOCKED: intent "${intent}" is forbidden`);
    return { ok: false, error: `BLOCKED: intent "${intent}" is forbidden` };
  }

  // 2. Check unknown
  const cmdDef = commandMap.commands[intent];
  if (!cmdDef) {
    tracker.advance("FAILED", `UNKNOWN: intent "${intent}" not in command_map`);
    return { ok: false, error: `UNKNOWN: intent "${intent}" not found in command_map` };
  }

  // 3. Check phase
  const currentPhase = commandMap.current_phase || "PHASE_2";
  const allowedPhases = cmdDef.allowed_phase || [];
  if (allowedPhases.length > 0 && !allowedPhases.includes(currentPhase)) {
    tracker.advance("FAILED", `PHASE_INVALID: current=${currentPhase}, allowed=${allowedPhases.join(",")}`);
    return { ok: false, error: `PHASE_INVALID: intent "${intent}" requires ${allowedPhases.join("|")} but current phase is ${currentPhase}` };
  }

  // 4. Check route exists
  const routeKey = cmdDef.route;
  if (!routeKey) {
    tracker.advance("FAILED", `ROUTE_MISSING: intent "${intent}" has no route`);
    return { ok: false, error: `ROUTE_MISSING: intent "${intent}" has no route defined` };
  }
  const routeDef = (commandMap.routes || {})[routeKey];
  if (!routeDef) {
    tracker.advance("FAILED", `ROUTE_INVALID: route "${routeKey}" not in routes registry`);
    return { ok: false, error: `ROUTE_INVALID: route "${routeKey}" not found in routes registry` };
  }

  // 5. Check owner match
  if (cmdDef.owner && routeDef.owner && cmdDef.owner !== routeDef.owner) {
    tracker.advance("FAILED", `OWNER_MISMATCH: cmd.owner=${cmdDef.owner}, route.owner=${routeDef.owner}`);
    return { ok: false, error: `OWNER_MISMATCH: intent owner "${cmdDef.owner}" != route owner "${routeDef.owner}"` };
  }

  tracker.advance("VALIDATED");
  return { ok: true, cmdDef, routeDef, routeKey };
}

// ---------------------------------------------------------------------------
// SIGNAL EXTRACTION (same logic as orchestrator.js)
// ---------------------------------------------------------------------------
function extractValidationSignalsForTrainingLoop(postValidation) {
  if (!postValidation) return {};
  const signals = postValidation.analyzer_signals || {};
  const failedRules = (postValidation.rule_engine && postValidation.rule_engine.failed_rules) || [];
  const failedChecks = postValidation.failed_checks || [];
  const forbiddenHits = postValidation.forbidden_hits || [];
  const allFails = [...failedRules, ...failedChecks, ...forbiddenHits].map(s => String(s).toLowerCase());

  return {
    silhouette_clear: signals.mesh_deformation_delta === 0 && signals.boundary_intersection === 0
      ? true
      : (signals.mesh_deformation_delta > 0 || signals.boundary_intersection > 0 ? false : undefined),
    plastic_read: typeof signals.pvc_plastic_read === "number"
      ? signals.pvc_plastic_read >= 0.5
      : allFails.some(f => f.includes("plastic") || f.includes("pvc")),
    texture_only: allFails.some(f => f.includes("texture_only")),
    object_count: allFails.some(f => f.includes("multi_object") || f.includes("disconnected")) ? 2 : 1,
    eyes_visible: typeof signals.human_eyes_detected === "number"
      ? signals.human_eyes_detected >= 0.5
      : allFails.some(f => f.includes("eyes") || f.includes("human_eyes")),
  };
}

// ---------------------------------------------------------------------------
// FIND REJECT SOURCE
// ---------------------------------------------------------------------------
function findRejectSource() {
  const runDirs = fs.readdirSync(RUNS_DIR).filter(d => {
    const fdPath = path.join(RUNS_DIR, d, "final_decision.json");
    if (!fs.existsSync(fdPath)) return false;
    try {
      const fd = JSON.parse(fs.readFileSync(fdPath, "utf-8"));
      if (fd.decision !== "REJECT") return false;
      if (!fd.validator_executed) return false;
      if (!fd.output_files || fd.output_files.length === 0) return false;
      const imgPath = fd.output_file_path;
      if (!imgPath || !fs.existsSync(imgPath)) return false;
      return true;
    } catch { return false; }
  });

  if (runDirs.length === 0) return null;
  runDirs.sort((a, b) => {
    const aStat = fs.statSync(path.join(RUNS_DIR, a));
    const bStat = fs.statSync(path.join(RUNS_DIR, b));
    return bStat.mtimeMs - aStat.mtimeMs;
  });
  return runDirs[0];
}

// ---------------------------------------------------------------------------
// COMMAND EXECUTOR: run_live_reject_test
// ---------------------------------------------------------------------------
function execRunLiveRejectTest(commandId, tracker) {
  tracker.advance("RUNNING");
  const artifacts = [];

  const sourceJobId = findRejectSource();
  if (!sourceJobId) {
    tracker.advance("FAILED", "No valid REJECT source run found");
    return { ok: false, error: "No valid REJECT source run found (need validator_executed + output.png on disk)", artifacts };
  }

  const sourceRunDir = path.join(RUNS_DIR, sourceJobId);
  const finalDecision = JSON.parse(fs.readFileSync(path.join(sourceRunDir, "final_decision.json"), "utf-8"));
  const postValidation = JSON.parse(fs.readFileSync(path.join(sourceRunDir, "post_validation.json"), "utf-8"));

  const testJobId = `CMD_REJECT_TEST_${Date.now()}`;
  const testRunDir = path.join(RUNS_DIR, testJobId);
  fs.mkdirSync(testRunDir, { recursive: true });

  const testFinalDecision = { ...finalDecision, job_id: testJobId };
  const testJob = { job_id: testJobId, source_job_id: sourceJobId, type: "command_test" };
  const trainingLoopArtifactPath = path.join(testRunDir, "training_loop_result.json");
  let loopResult = null;

  try {
    console.log(`[COMMAND][${commandId}] TRAINING_LOOP triggered for REJECT job: ${testJobId}`);
    const validationSignals = extractValidationSignalsForTrainingLoop(postValidation);
    const failureAnalysis = classifyFailure(validationSignals, testFinalDecision);
    console.log(`[COMMAND][${commandId}] failure_class: ${JSON.stringify(failureAnalysis.failure_class)}`);

    const patchPlan = generatePatchPlan(failureAnalysis.failure_class);
    console.log(`[COMMAND][${commandId}] patch actions: ${JSON.stringify(patchPlan.actions)}`);

    const jobForRetest = { ...testJob, failure_class: failureAnalysis.failure_class };
    const abResult = runABRetest(jobForRetest, patchPlan);
    console.log(`[COMMAND][${commandId}] ab improved: ${abResult.delta.improved}`);

    writeTrainingCase({ job_id: testJobId, failure_class: failureAnalysis.failure_class, patch_plan: patchPlan, ab_result: abResult });
    console.log(`[COMMAND][${commandId}] case written`);

    loopResult = {
      job_id: testJobId,
      triggered: true,
      failure_analysis: { failure_class: failureAnalysis.failure_class, primary_failure: failureAnalysis.primary_failure, severity: failureAnalysis.severity },
      patch_plan: { patch_targets: patchPlan.patch_targets, actions: patchPlan.actions },
      ab_result: abResult,
      timestamp: nowIso(),
    };
    writeJson(trainingLoopArtifactPath, loopResult);
    artifacts.push(trainingLoopArtifactPath);
  } catch (err) {
    console.warn(`[COMMAND][${commandId}] TRAINING_LOOP error: ${err.message}`);
    loopResult = { job_id: testJobId, triggered: true, error: err.message, timestamp: nowIso() };
    writeJson(trainingLoopArtifactPath, loopResult);
    artifacts.push(trainingLoopArtifactPath);
  }

  // Verify
  const artifactExists = fs.existsSync(trainingLoopArtifactPath);
  const memoryCasesPath = path.join(MEMORY_DIR, "training_cases.json");
  let memoryAppended = false;
  if (fs.existsSync(memoryCasesPath)) {
    try {
      const cases = JSON.parse(fs.readFileSync(memoryCasesPath, "utf-8"));
      memoryAppended = cases.some(c => c.job_id === testJobId);
    } catch { memoryAppended = false; }
  }

  const allPassed = artifactExists && memoryAppended && loopResult && loopResult.triggered && !loopResult.error;
  tracker.advance(allPassed ? "COMPLETED" : "FAILED", allPassed ? "all checks passed" : "verification failed");

  return {
    ok: allPassed,
    job_id: testJobId,
    source_job_id: sourceJobId,
    final_decision: testFinalDecision.decision,
    training_loop: { triggered: loopResult ? loopResult.triggered : false, error: loopResult ? loopResult.error || null : "loop_not_reached" },
    artifact_check: { training_loop_result: artifactExists ? "PASS" : "FAIL", memory_appended: memoryAppended ? "PASS" : "FAIL" },
    pipeline_safety: { orchestrator_crash: false, final_decision_modified: false },
    artifacts,
  };
}

// ---------------------------------------------------------------------------
// INTENT → EXECUTOR MAP
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// COMMAND EXECUTOR: generate_patched_job_spec
// ---------------------------------------------------------------------------
function execGeneratePatchedJobSpec(commandId, tracker) {
  tracker.advance("RUNNING");

  let genResult;
  try {
    genResult = generatePatchedJobSpec();
  } catch (err) {
    tracker.advance("FAILED", `GENERATOR_CRASH: ${err.message}`);
    return { ok: false, error: err.message, artifacts: [] };
  }

  if (!genResult.ok) {
    tracker.advance("FAILED", genResult.error);
    return { ok: false, error: genResult.error, artifacts: [] };
  }

  // Verify output file exists
  const outputExists = fs.existsSync(genResult.patched_job_spec_path);
  if (!outputExists) {
    tracker.advance("FAILED", "patched_job_spec.json not written");
    return { ok: false, error: "patched_job_spec.json not written to disk", artifacts: [] };
  }

  tracker.advance("COMPLETED", `patched_job_spec written for ${genResult.source_run_id}`);

  return {
    ok: true,
    source_run_id: genResult.source_run_id,
    source_job_id: genResult.source_job_id,
    failure_classes: genResult.failure_classes,
    actions_applied: genResult.actions_applied,
    actions_skipped: genResult.actions_skipped,
    historical_matches: genResult.historical_matches,
    patched_job_spec_path: genResult.patched_job_spec_path,
    artifacts: [genResult.patched_job_spec_path],
  };
}

// ---------------------------------------------------------------------------
// COMMAND EXECUTOR: execute_patched_job_spec
// ---------------------------------------------------------------------------
async function execExecutePatchedJobSpec(commandId, tracker) {
  tracker.advance("RUNNING");

  const executionId = `EXEC-${Date.now()}-${commandId}`;
  let execResult;
  try {
    execResult = await dispatchExecution(executionId);
  } catch (err) {
    tracker.advance("FAILED", `DISPATCH_CRASH: ${err.message}`);
    return { ok: false, error: err.message, artifacts: [] };
  }

  // Map execution_state to command tracker state
  const state = execResult.execution_state;
  if (state === "EXECUTED") {
    tracker.advance("COMPLETED", `execution_state=${state} adapter=${execResult.adapter_name}`);
  } else {
    tracker.advance("FAILED", `execution_state=${state}: ${execResult.error || "unknown"}`);
  }

  return {
    ok: execResult.ok,
    execution_id: execResult.execution_id,
    execution_state: execResult.execution_state,
    patched_job_id: execResult.patched_job_id,
    source_run_id: execResult.source_run_id,
    adapter_name: execResult.adapter_name,
    output_path: execResult.output_path,
    output_exists: execResult.output_exists,
    render_time_ms: execResult.render_time_ms,
    error: execResult.error,
    adapter_response: execResult.adapter_response,
    artifacts: execResult.artifacts || [],
  };
}

const EXECUTORS = {
  run_live_reject_test: execRunLiveRejectTest,
  generate_patched_job_spec: execGeneratePatchedJobSpec,
  execute_patched_job_spec: execExecutePatchedJobSpec,
};

// ---------------------------------------------------------------------------
// MAIN ENTRY: handleCommand(commandId, intent)
// ---------------------------------------------------------------------------
async function handleCommand(commandId, intent) {
  const commandMap = loadCommandMap();
  const tracker = createCommandTracker(commandId, intent);
  const startedAt = nowIso();

  // --- RECEIVED ---
  tracker.advance("RECEIVED", intent);

  // --- VALIDATE (unknown / blocked / phase / route) ---
  const validation = validateIntent(commandMap, intent, tracker);
  if (!validation.ok) {
    const result = buildResult(commandId, intent, "FAILED", tracker, null, validation.error, startedAt);
    appendHistory(result);
    return result;
  }

  // --- ROUTED ---
  const { routeKey, routeDef } = validation;
  tracker.advance("ROUTED", `route=${routeKey} owner=${routeDef.owner} lane=${routeDef.lane}`);

  // --- EXECUTE ---
  const executor = EXECUTORS[intent];
  if (!executor) {
    tracker.advance("FAILED", `NOT_IMPLEMENTED: no executor for "${intent}"`);
    const result = buildResult(commandId, intent, "FAILED", tracker, null, `NOT_IMPLEMENTED: intent "${intent}" has no executor`, startedAt);
    appendHistory(result);
    return result;
  }

  let execResult;
  try {
    execResult = await executor(commandId, tracker);
  } catch (err) {
    tracker.advance("FAILED", `EXECUTOR_CRASH: ${err.message}`);
    const result = buildResult(commandId, intent, "FAILED", tracker, null, err.message, startedAt);
    appendHistory(result);
    return result;
  }

  // --- BUILD RESULT CONTRACT ---
  const finalStatus = tracker.getState();
  const result = buildResult(commandId, intent, finalStatus, tracker, execResult, execResult.error || null, startedAt);
  appendHistory(result);
  return result;
}

// ---------------------------------------------------------------------------
// RESULT CONTRACT BUILDER
// ---------------------------------------------------------------------------
function buildResult(commandId, intent, status, tracker, summary, error, startedAt) {
  return {
    command_id: commandId,
    intent,
    status,
    ok: status === "COMPLETED",
    summary: summary || null,
    artifacts: (summary && summary.artifacts) || [],
    error: error || null,
    state_transitions: tracker.getTransitions(),
    started_at: startedAt,
    completed_at: nowIso(),
  };
}

module.exports = { handleCommand };
