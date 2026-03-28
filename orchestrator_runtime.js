"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const adapters = require("./runtime_adapters");

const RUNS_ROOT = path.resolve(process.env.RUNS_ROOT || path.join(__dirname, "runs"));
const MAX_AUTO_FIX_ATTEMPTS = parseInt(process.env.MAX_AUTO_FIX_ATTEMPTS || "3", 10);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

function writeJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  let jsonStr;
  try {
    jsonStr = JSON.stringify(payload, null, 2);
  } catch (e) {
    jsonStr = JSON.stringify({
      error: "SERIALIZATION_FAILED",
      message: String(e.message || e).slice(0, 500),
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  try {
    JSON.parse(jsonStr);
  } catch (_) {
    jsonStr = JSON.stringify({
      error: "JSON_INTEGRITY_CHECK_FAILED",
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  fs.writeFileSync(filePath, jsonStr, "utf-8");
}

function copyIfExists(sourcePath, targetPath) {
  if (fs.existsSync(sourcePath)) {
    ensureDir(path.dirname(targetPath));
    fs.copyFileSync(sourcePath, targetPath);
    return true;
  }
  return false;
}

function readJsonIfExists(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (_) {
    return fallback;
  }
}

async function runRuntimeJob(job) {
  const runDir = ensureDir(path.join(RUNS_ROOT, job.job_id));
  const promptDir = path.join(__dirname, "prompts");

  const intakeRequest = await adapters.normalizeIdeaRequest(job);
  writeJson(path.join(runDir, "intake_request.json"), intakeRequest);

  const geminiIntake = await adapters.runGeminiIntake({
    intakeRequest,
    promptPath: path.join(promptDir, "gemini_intake.txt"),
  });
  writeJson(path.join(runDir, "gemini_intake.json"), geminiIntake);

  const promptPackage = await adapters.buildPromptPackageFromIntake({
    job,
    intakeRequest,
    geminiIntake,
  });
  writeJson(path.join(runDir, "prompt_package.json"), promptPackage);
  writeJson(path.join(runDir, "prompt_before.json"), promptPackage);

  const canon = await adapters.loadCanonV2({});
  const canonPrecheck = {
    job_validation: await adapters.validateCanonJob({ job, canon }),
    prompt_validation: await adapters.validateCanonPromptPackage({
      spec: promptPackage.locked_prompt_package || {},
      positivePrompt: promptPackage.structured_prompt,
      negativePrompt: promptPackage.negative_prompt,
      canon,
    }),
  };
  writeJson(path.join(runDir, "runtime_precheck.json"), canonPrecheck);

  const result = await adapters.orchestrate({ job });

  const attemptCount = Math.min(Number(result.attempt_count || 1), MAX_AUTO_FIX_ATTEMPTS);
  const loopSummary = {
    job_id: job.job_id,
    attempt_count: attemptCount,
    max_auto_fix_attempts: MAX_AUTO_FIX_ATTEMPTS,
    status: result.status,
    decision: result.decision,
    final_decision_reason: result.final_decision_reason || result.decision_reason || null,
    output_files: result.output_files || [],
    validator_fail_rules: result.validator_fail_rules || result.failed_rules || [],
    telemetry_warnings: result.telemetry_warnings || [],
    final_timestamp: result.timestamp || new Date().toISOString(),
  };

  writeJson(path.join(runDir, "loop_summary.json"), loopSummary);

  copyIfExists(path.join(runDir, "job_summary.json"), path.join(runDir, "runtime_job_summary.json"));
  copyIfExists(path.join(runDir, "final_decision.json"), path.join(runDir, "runtime_final_decision.json"));

  const finalDecision = readJsonIfExists(path.join(runDir, "final_decision.json"), {
    job_id: job.job_id,
    status: result.status,
    decision: result.decision,
    decision_reason: result.final_decision_reason || result.decision_reason || "runtime result",
    output_files: result.output_files || [],
  });
  writeJson(path.join(runDir, "final_decision.json"), finalDecision);

  return {
    job_id: job.job_id,
    run_dir: runDir,
    attempt_count: attemptCount,
    status: result.status,
    decision: result.decision,
    output_files: result.output_files || [],
    loop_summary_path: path.join(runDir, "loop_summary.json"),
    final_decision_path: path.join(runDir, "final_decision.json"),
  };
}

module.exports = {
  runRuntimeJob,
};
