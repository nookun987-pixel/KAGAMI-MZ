"use strict";

const fs = require("fs");
const path = require("path");

const COLAB_SHARED_ROOT = "/content/drive/MyDrive/mikage_runner";
const DEFAULT_COLAB_POLL_INTERVAL_MS = parseInt(process.env.COLAB_POLL_INTERVAL_MS || "5000", 10);
const DEFAULT_COLAB_TIMEOUT_MS = parseInt(
  process.env.SHARED_EXECUTION_TIMEOUT_MS || process.env.COLAB_TIMEOUT_MS || "300000",
  10
);

function normalizeAbsolutePath(inputPath) {
  return path.resolve(String(inputPath || "")).replace(/\//g, "\\");
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
    job_processing_path: windowsRoot ? path.join(windowsRoot, "job_processing") : null,
    job_done_path: windowsRoot ? path.join(windowsRoot, "job_done") : null,
    job_failed_path: windowsRoot ? path.join(windowsRoot, "job_failed") : null,
    outputs_path: windowsRoot ? path.join(windowsRoot, "outputs") : null,
    colab_job_inbox_path: `${COLAB_SHARED_ROOT}/job_inbox`,
    colab_job_processing_path: `${COLAB_SHARED_ROOT}/job_processing`,
    colab_job_done_path: `${COLAB_SHARED_ROOT}/job_done`,
    colab_job_failed_path: `${COLAB_SHARED_ROOT}/job_failed`,
    colab_outputs_path: `${COLAB_SHARED_ROOT}/outputs`,
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
  fs.mkdirSync(config.job_processing_path, { recursive: true });
  fs.mkdirSync(config.job_done_path, { recursive: true });
  fs.mkdirSync(config.job_failed_path, { recursive: true });
  fs.mkdirSync(config.outputs_path, { recursive: true });
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
    execution_target: executionTarget ? String(executionTarget) : null,
    idea,
    prompt,
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
  const jobFilePath = path.join(config.job_inbox_path, `${payload.job_id}.json`);

  fs.writeFileSync(jobFilePath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`LOCAL_WRITE_OK ${jobFilePath}`);

  return {
    job_id: payload.job_id,
    payload,
    job_file_path: jobFilePath,
    processing_path: path.join(config.job_processing_path, `${payload.job_id}.json`),
    done_path: path.join(config.job_done_path, `${payload.job_id}.json`),
    failed_path: path.join(config.job_failed_path, `${payload.job_id}.json`),
    result_path: path.join(config.outputs_path, payload.job_id, "result.json"),
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
  if (fs.existsSync(submissionInfo.done_path)) {
    return {
      state: "SUCCESS",
      path: submissionInfo.done_path,
      payload: safeReadJson(submissionInfo.done_path),
    };
  }

  if (fs.existsSync(submissionInfo.failed_path)) {
    return {
      state: "FAILED",
      path: submissionInfo.failed_path,
      payload: safeReadJson(submissionInfo.failed_path),
    };
  }

  if (fs.existsSync(submissionInfo.processing_path)) {
    return {
      state: "RUNNING",
      path: submissionInfo.processing_path,
      payload: safeReadJson(submissionInfo.processing_path),
    };
  }

  if (fs.existsSync(submissionInfo.job_file_path)) {
    return {
      state: "QUEUED",
      path: submissionInfo.job_file_path,
      payload: safeReadJson(submissionInfo.job_file_path),
    };
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
        done_path: submissionInfo.done_path,
        result_path: submissionInfo.result_path,
        result: parsed,
      };
    }

    if (observed.state === "FAILED") {
      const failed = observed.payload || {};
      return {
        status: "FAILED",
        state: observed.state,
        failed_path: submissionInfo.failed_path,
        result_path: submissionInfo.result_path,
        result: failed,
      };
    }

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_COLAB_POLL_INTERVAL_MS));
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
    path.join(path.dirname(submissionInfo.result_path), "output.png");

  const localOutputPath = artifactPaths.output_png || path.join(artifactPaths.run_dir || path.dirname(remoteOutputPath), "output.png");
  return {
    remote_output_path: remoteOutputPath,
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
    done_path: completion.done_path || null,
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
