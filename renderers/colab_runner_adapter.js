"use strict";

const fs = require("fs");
const path = require("path");
const driveRuntime = require("../runtime/drive_queue/runtime");
const { runAllAnalyzers } = require("../analyzers/run_all_analyzers");
const { isVLMAvailable } = require("../analyzers/vlm_semantic_analyzer");
const { runRuleEngine } = require("../validators/mikage_rule_engine");
const { getSpecPath } = require("../validators/load_mikage_specs");

const COLAB_SHARED_ROOT = "/content/drive/MyDrive/mikage_runner";
const DEFAULT_COLAB_POLL_INTERVAL_MS = parseInt(process.env.COLAB_POLL_INTERVAL_MS || "5000", 10);
const DEFAULT_COLAB_TIMEOUT_MS = parseInt(
  process.env.SHARED_EXECUTION_TIMEOUT_MS || process.env.COLAB_TIMEOUT_MS || "300000",
  10
);
const HARD_REJECT_SIGNALS = [
  "human_eyes_detected",
  "pvc_plastic_read",
  "toon_shading",
  "magenta_neon_spill",
  "logo_overlap_ratio",
];

function normalizeAbsolutePath(inputPath) {
  return path.resolve(String(inputPath || "")).replace(/\//g, "\\");
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = String(value || "").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

function collectBlockingUnknownRules(ruleResults) {
  if (String(process.env.MIKAGE_STRICT_UNKNOWN_RULES || "false").toLowerCase() !== "true") {
    return [];
  }
  return (ruleResults || [])
    .filter((result) => result.status === "UNKNOWN" && (result.priority === "CRITICAL" || result.priority === "ABSOLUTE"))
    .map((result) => result.rule_id);
}

function collectCriticalFailedRules(ruleResults) {
  return (ruleResults || [])
    .filter((result) => result.status === "FAIL" && (result.priority === "CRITICAL" || result.priority === "ABSOLUTE"))
    .map((result) => result.rule_id);
}

function collectHardRejectSignals(signals = {}) {
  return HARD_REJECT_SIGNALS.filter((key) => Number(signals[key] || 0) > 0);
}

function isRecoveredPostValidationEnabled() {
  return String(process.env.MIKAGE_ENABLE_POSTVALIDATION || "true").toLowerCase() !== "false";
}

async function runRecoveredPostValidation(outputPath, artifactPaths = {}) {
  const signals = await runAllAnalyzers(outputPath, {
    stop_before_semantics_on_hard_fail: true,
  });
  const lane = artifactPaths.lane || artifactPaths.shot_type || "unknown";
  const ruleEngine = runRuleEngine({
    specPath: getSpecPath("image_control"),
    signals,
    lane,
  });
  const hardRejectHits = collectHardRejectSignals(signals);
  const criticalFailedRules = collectCriticalFailedRules(ruleEngine.rule_results);
  const blockingUnknownRules = collectBlockingUnknownRules(ruleEngine.rule_results);
  const failedChecks = dedupeStrings([...(ruleEngine.failed_rules || []), ...hardRejectHits]);
  const criticalFailures = dedupeStrings([...criticalFailedRules, ...hardRejectHits]);
  const semanticVlmExecuted =
    isVLMAvailable() &&
    signals._vlm_status !== "unavailable" &&
    signals._vlm_status !== "disabled" &&
    signals._vlm_status !== "skipped_due_to_hard_fail" &&
    signals._vlm_status !== "unconfigured";
  const semanticRejectSignals = dedupeStrings(ruleEngine.semantic_reject_signals || []);
  const canonHardFailures = dedupeStrings(ruleEngine.canon_hard_failures || []);
  const semanticBlocking = semanticVlmExecuted && semanticRejectSignals.length > 0;
  const canonBlocking = canonHardFailures.length > 0 || criticalFailures.length > 0 || blockingUnknownRules.length > 0;
  const pass =
    fs.existsSync(outputPath) &&
    ruleEngine.passed === true &&
    semanticBlocking === false &&
    canonBlocking === false;
  const semanticMode = signals._vlm_mode || (isVLMAvailable() ? "local+semantic" : "local_only");
  const payload = {
    stage: "post_render_image",
    verdict: pass ? "PASS" : "REJECT",
    validator_executed: true,
    validator_verdict: ruleEngine.validator_verdict || (pass ? "PASS" : "REJECT"),
    validation_mode: semanticMode,
    semantic_vlm_executed: semanticVlmExecuted,
    semantic_vlm_mode: semanticMode,
    semantic_reject_signals: semanticRejectSignals,
    semantic_summary: {
      status: signals._vlm_status || "unknown",
      mode: semanticMode,
      local_only: semanticVlmExecuted === false,
      executed: semanticVlmExecuted,
      reject_signal_count: semanticRejectSignals.length,
    },
    semantic_blocking: semanticBlocking,
    canon_hard_failures: canonHardFailures,
    canon_blocking: canonBlocking,
    failed_checks: failedChecks,
    critical_failures: criticalFailures,
    forbidden_hits: hardRejectHits,
    hard_reject_hits: hardRejectHits,
    blocking_unknown_rules: blockingUnknownRules,
    analyzer_signals: signals,
    analyzer_summary: {
      vlm_backend_ready: isVLMAvailable(),
      vlm_status: signals._vlm_status || "unknown",
      analyzer_status: signals._analyzer_status || {},
    },
    missing_signals: (ruleEngine.rule_results || []).flatMap((result) => result.missing_signals || []),
    rule_engine: {
      decision: ruleEngine.decision,
      passed: ruleEngine.passed,
      block_level: ruleEngine.block_level,
      failed_rules: ruleEngine.failed_rules,
      unknown_rules: ruleEngine.unknown_rules,
      stats: ruleEngine.stats,
      rule_results: ruleEngine.rule_results,
    },
    source_files: {
      image_control_spec: getSpecPath("image_control"),
    },
  };

  if (artifactPaths.run_dir) {
    writeJson(path.join(artifactPaths.run_dir, "post_validation.json"), payload);
    writeJson(path.join(artifactPaths.run_dir, "validation.json"), payload);
  }
  return payload;
}

function getWindowsSharedRoot() {
  if (process.platform !== "win32") {
    return null;
  }

  const configured = process.env.DRIVE_ROOT;
  if (!configured) {
    return null;
  }

  return normalizeAbsolutePath(configured);
}

function getRunnerConfig() {
  const windowsRoot = getWindowsSharedRoot();
  return {
    windows_shared_root: windowsRoot,
    colab_shared_root: COLAB_SHARED_ROOT,
    job_inbox_path: windowsRoot ? path.join(windowsRoot, "job_inbox") : null,
    claims_path: windowsRoot ? path.join(windowsRoot, "claims") : null,
    outputs_path: windowsRoot ? path.join(windowsRoot, "outputs") : null,
    logs_path: windowsRoot ? path.join(windowsRoot, "logs") : null,
    colab_job_inbox_path: `${COLAB_SHARED_ROOT}/job_inbox`,
    colab_claims_path: `${COLAB_SHARED_ROOT}/claims`,
    colab_outputs_path: `${COLAB_SHARED_ROOT}/outputs`,
    colab_logs_path: `${COLAB_SHARED_ROOT}/logs`,
    poll_interval_ms: DEFAULT_COLAB_POLL_INTERVAL_MS,
    timeout_ms: DEFAULT_COLAB_TIMEOUT_MS,
  };
}

function isColabRunnerEnabled() {
  return Boolean(getWindowsSharedRoot());
}

function ensureLocalDriveContract(config) {
  if (!config.windows_shared_root) {
    throw new Error("DRIVE_ROOT is required for colab execution on Windows");
  }

  fs.mkdirSync(config.job_inbox_path, { recursive: true });
  fs.mkdirSync(config.claims_path, { recursive: true });
  fs.mkdirSync(config.outputs_path, { recursive: true });
  fs.mkdirSync(config.logs_path, { recursive: true });
}

function buildJobContract(job = {}, promptPackage = {}) {
  const lane = String(job.lane || promptPackage.shot_type || job.shot_type || "unknown");
  const executionTarget = job.execution_target || job.target || null;
  const idea = String(job.idea || job.user_idea || "");
  const prompt = String(job.prompt || promptPackage.structured_prompt || "");
  const effectivePrompt = String(prompt || idea || "");
  const sharedRoot = getWindowsSharedRoot();

  return {
    job_id: String(job.job_id || `JOB-${Date.now()}`),
    lane,
    idea,
    prompt,
    execution_target: executionTarget ? String(executionTarget) : "colab_runner",
    effective_prompt: effectivePrompt,
    backend_requested: "real_renderer",
    created_at: new Date().toISOString(),
    origin: "local_command",
    contract_version: "v2",
    shared_root: sharedRoot,
    artifact_expectation: {
      result_json: true,
      status_txt: true,
      output_image: true,
      execution_trace: true,
    },
  };
}

async function submitToColab(job, promptPackage, artifactPaths) {
  const config = getRunnerConfig();
  ensureLocalDriveContract(config);

  const payload = buildJobContract(job, promptPackage);
  const written = driveRuntime.writeJob(payload, { driveRoot: config.windows_shared_root });
  console.log(`LOCAL_WRITE_OK ${written.jobFilePath}`);

  return {
    job_id: payload.job_id,
    payload,
    job_file_path: written.jobFilePath,
    claim_path: written.claimFilePath,
    output_dir: written.outputDir,
    result_path: written.resultFilePath,
    log_path: path.join(config.logs_path, `${payload.job_id}.log`),
    poll_interval_ms: config.poll_interval_ms,
    timeout_ms: config.timeout_ms,
    artifact_paths: artifactPaths || {},
  };
}

function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return null;
  }
}

function observeSharedState(submissionInfo) {
  const observation = driveRuntime.observeJob(submissionInfo.job_id, {
    driveRoot: path.dirname(path.dirname(submissionInfo.job_file_path)),
  });

  if (observation.result.exists && observation.result.ok) {
    const payload = observation.result.payload || {};
    const status = String(payload.status || payload.final_status || "").toLowerCase();
    if (["success", "done", "completed", "complete", "ok"].includes(status)) {
      return { state: "SUCCESS", path: observation.resultFilePath, payload };
    }
    if (["failed", "fail", "error", "rejected"].includes(status)) {
      return { state: "FAILED", path: observation.resultFilePath, payload };
    }
  }

  if (observation.claim.exists) {
    return { state: "RUNNING", path: observation.claimFilePath, payload: observation.claim.payload };
  }

  if (fs.existsSync(submissionInfo.job_file_path)) {
    return { state: "QUEUED", path: submissionInfo.job_file_path, payload: safeReadJson(submissionInfo.job_file_path) };
  }

  return {
    state: "UNKNOWN",
    path: null,
    payload: null,
  };
}

async function pollForCompletion(submissionInfo, timeoutMs = submissionInfo.timeout_ms || DEFAULT_COLAB_TIMEOUT_MS) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const observed = observeSharedState(submissionInfo);

    if (observed.state === "SUCCESS") {
      const parsed = safeReadJson(submissionInfo.result_path) || {};
      console.log(`LOCAL_RESULT_FOUND ${submissionInfo.result_path}`);
      return {
        status: "SUCCESS",
        state: observed.state,
        result_path: submissionInfo.result_path,
        result: parsed,
      };
    }

    if (observed.state === "FAILED") {
      const failed = observed.payload || {};
      return {
        status: "FAILED",
        state: observed.state,
        result_path: submissionInfo.result_path,
        result: failed,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, submissionInfo.poll_interval_ms || DEFAULT_COLAB_POLL_INTERVAL_MS));
  }

  return {
    status: "FAILED",
    state: "TIMEOUT_FAILED",
    result_path: submissionInfo.result_path,
    result: {
      status: "FAILED",
      error: "TIMEOUT_FAILED",
      error_reason: `No completion artifact after ${timeoutMs}ms`,
      timeout_ms: timeoutMs,
      job_id: submissionInfo.job_id,
    },
  };
}

function resolveOutputPath(result = {}, submissionInfo = {}, artifactPaths = {}) {
  const remoteOutputPath =
    result.output_file_path ||
    result.output_path ||
    result.output_png ||
    (Array.isArray(result.artifacts) && result.artifacts[0] && result.artifacts[0].path) ||
    path.join(submissionInfo.output_dir || path.dirname(submissionInfo.result_path), "output.png");

  const sharedOutputPath = path.join(submissionInfo.output_dir || path.dirname(submissionInfo.result_path), "output.png");
  const localOutputPath = artifactPaths.output_png || path.join(artifactPaths.run_dir || path.dirname(sharedOutputPath), "output.png");
  return {
    remote_output_path: fs.existsSync(remoteOutputPath) ? remoteOutputPath : sharedOutputPath,
    local_output_path: localOutputPath,
  };
}

async function executeColabRender(job, promptPackage, artifactPaths) {
  const submission = await submitToColab(job, promptPackage, artifactPaths);
  const completion = await pollForCompletion(submission);
  const result = completion.result || {};

  if (completion.status === "FAILED") {
    return {
      job_id: submission.job_id,
      status: "FAIL",
      result_type: "execution_dispatch",
      execution_runner: "colab",
      execution_lane: "google_drive_colab",
      executor_type: "drive_bridge",
      error: result.error || "TIMEOUT_FAILED",
      error_reason: result.error_reason || "Colab execution failed",
      timeout_ms: result.timeout_ms || null,
      result_path: completion.result_path || submission.result_path,
      claim_path: submission.claim_path,
      raw_result: result,
    };
  }

  const outputPaths = resolveOutputPath(result, submission, artifactPaths);
  if (outputPaths.remote_output_path && fs.existsSync(outputPaths.remote_output_path)) {
    fs.mkdirSync(path.dirname(outputPaths.local_output_path), { recursive: true });
    if (normalizeAbsolutePath(outputPaths.remote_output_path) !== normalizeAbsolutePath(outputPaths.local_output_path)) {
      fs.copyFileSync(outputPaths.remote_output_path, outputPaths.local_output_path);
    }
  }

  const finalOutputPath = fs.existsSync(outputPaths.local_output_path)
    ? outputPaths.local_output_path
    : outputPaths.remote_output_path;

  const postValidation = isRecoveredPostValidationEnabled()
    ? await runRecoveredPostValidation(finalOutputPath, {
        ...(artifactPaths || {}),
        lane: job.lane || job.shot_type || promptPackage.shot_type || "unknown",
        shot_type: promptPackage.shot_type || job.shot_type || job.lane || "unknown",
      })
    : {
        stage: "post_render_image",
        verdict: "PASS",
        validator_executed: false,
        validation_mode: "disabled",
      };
  if (postValidation.verdict !== "PASS") {
    return {
      job_id: submission.job_id,
      status: "FAIL",
      result_type: "execution_dispatch",
      execution_runner: "colab",
      execution_lane: "google_drive_colab",
      executor_type: "drive_bridge",
      error: "LOCAL_VALIDATION_REJECT",
      error_reason: `Local validation rejected render: ${(postValidation.critical_failures || postValidation.failed_checks || []).join(", ") || "UNKNOWN"}`,
      output_file_path: finalOutputPath,
      output_files: finalOutputPath ? [{ path: finalOutputPath, type: "image" }] : [],
      result_path: completion.result_path,
      post_validation: postValidation,
      raw_result: result,
    };
  }

  return {
    job_id: submission.job_id,
    status: "DONE",
    output_file_path: finalOutputPath,
    output_files: finalOutputPath ? [{ path: finalOutputPath, type: "image" }] : [],
    result_type: "image_generation",
    execution_runner: "colab",
    execution_lane: "google_drive_colab",
    executor_type: "drive_bridge",
    result_path: completion.result_path,
    claim_path: submission.claim_path,
    post_validation: postValidation,
    raw_result: result,
  };
}

async function colabRunnerAdapter(job, promptPackage, artifactPaths) {
  return executeColabRender(job, promptPackage, artifactPaths);
}

module.exports = {
  COLAB_SHARED_ROOT,
  isColabRunnerEnabled,
  getRunnerConfig,
  buildJobContract,
  submitToColab,
  pollForCompletion,
  executeColabRender,
  colabRunnerAdapter,
  executeRender: colabRunnerAdapter,
  EXECUTION_RUNNER: "colab",
};
