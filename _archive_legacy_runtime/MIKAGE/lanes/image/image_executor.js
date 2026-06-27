"use strict";

const path = require("path");

const { nowIso } = require("../../shared/utils/fs_utils");
const { createImageIntake } = require("./image_intake");
const { validateImageArtifacts } = require("./image_validator");
const driveRuntime = require("../../../runtime/drive_queue/runtime");

const DEFAULT_POLL_INTERVAL_MS = parseInt(process.env.MIKAGE_IMAGE_POLL_INTERVAL_MS || "1000", 10);
const DEFAULT_TIMEOUT_MS = parseInt(process.env.MIKAGE_IMAGE_TIMEOUT_MS || "300000", 10);
const DEFAULT_STALE_CLAIM_MS = parseInt(process.env.MIKAGE_IMAGE_STALE_CLAIM_MS || "120000", 10);

function buildJobEnvelope(taskSpec, payload, paths) {
  return {
    job_id: taskSpec.job_id,
    lane: "image",
    objective: taskSpec.objective,
    prompt: payload.prompt,
    negative_prompt: payload.negative_prompt,
    render_mode: payload.render_mode,
    shot_profile: payload.shot_profile,
    constraints: payload.constraints,
    priority: payload.priority,
    execution_target: "colab_runner",
    runtime: {
      drive_root: paths.driveRoot,
      contract: {
        job_file: path.join(paths.jobInboxDir, `${taskSpec.job_id}.json`),
        claim_file: path.join(paths.claimsDir, `${taskSpec.job_id}.claim.json`),
        result_file: path.join(paths.outputsDir, taskSpec.job_id, "result.json"),
        image_file: path.join(paths.outputsDir, taskSpec.job_id, "output.png"),
      },
    },
    created_at: nowIso(),
    control_plane: "MIKAGE_V2",
  };
}

function getRuntimePaths(taskSpec, options = {}) {
  return driveRuntime.getJobRuntimePaths(taskSpec.job_id, options);
}

function normalizeResultStatus(rawStatus) {
  const status = String(rawStatus || "").toLowerCase();

  if (["success", "done", "completed", "complete", "ok"].includes(status)) {
    return "completed";
  }

  if (["failed", "fail", "error"].includes(status)) {
    return "failed";
  }

  if (["rejected", "reject"].includes(status)) {
    return "rejected";
  }

  if (["timeout", "timed_out"].includes(status)) {
    return "timeout";
  }

  return null;
}

function validateResultPayload(resultPayload, taskSpec) {
  const signals = [];

  if (!resultPayload || typeof resultPayload !== "object") {
    signals.push("result.json is not an object");
    return {
      ok: false,
      normalizedStatus: null,
      signals,
    };
  }

  if (!resultPayload.job_id) {
    signals.push("result.json missing job_id");
  } else if (String(resultPayload.job_id) !== String(taskSpec.job_id)) {
    signals.push("result.json job_id mismatch");
  }

  if (!resultPayload.status) {
    signals.push("result.json missing status");
  }

  const normalizedStatus = normalizeResultStatus(resultPayload.status);
  if (!normalizedStatus) {
    signals.push("result.json has unsupported status");
  }

  return {
    ok: signals.length === 0,
    normalizedStatus,
    signals,
  };
}

function normalizeJudgeOutputPath(resultPayload, runtimePaths) {
  const rawPath = resultPayload && resultPayload.judge_output_path;
  if (!rawPath) {
    return runtimePaths.judgeOutputFilePath;
  }

  if (path.isAbsolute(rawPath)) {
    return rawPath;
  }

  if (String(rawPath).startsWith("outputs\\" ) || String(rawPath).startsWith("outputs/")) {
    return path.join(runtimePaths.driveRoot, rawPath);
  }

  return path.join(runtimePaths.outputDir, rawPath);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForResult(taskSpec, runtimePaths, options = {}) {
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
  const pollIntervalMs = Number.isFinite(options.pollIntervalMs) ? options.pollIntervalMs : DEFAULT_POLL_INTERVAL_MS;
  const staleClaimMs = Number.isFinite(options.staleClaimMs) ? options.staleClaimMs : DEFAULT_STALE_CLAIM_MS;
  const startedAtMs = Date.now();
  const observedStates = [];
  const seenStates = new Set();

  while (Date.now() - startedAtMs <= timeoutMs) {
    const observation = driveRuntime.observeJob(taskSpec.job_id, {
      driveRoot: runtimePaths.driveRoot,
      staleClaimMs,
      nowMs: Date.now(),
    });

    if (observation.result.exists) {
      if (!observation.result.ok) {
        return {
          queue_state: "completed",
          terminal_status: "rejected",
          malformedResult: true,
          malformedReason: observation.result.error,
          resultPayload: null,
          claimPayload: observation.claim.payload,
          observedStates,
          staleClaim: false,
        };
      }

      const validation = validateResultPayload(observation.result.payload, taskSpec);
      const normalizedStatus = validation.normalizedStatus || "rejected";

      return {
        queue_state: "completed",
        terminal_status: validation.ok ? normalizedStatus : "rejected",
        malformedResult: !validation.ok,
        malformedSignals: validation.signals,
        resultPayload: observation.result.payload,
        claimPayload: observation.claim.payload,
        observedStates,
        staleClaim: false,
      };
    }

    const queueState = observation.queue_state;

    if (!seenStates.has(queueState)) {
      seenStates.add(queueState);
      observedStates.push({
        state: queueState,
        timestamp: new Date().toISOString(),
      });
    }

    if (queueState === "stale_claim") {
      return {
        queue_state: "claimed",
        terminal_status: "failed",
        malformedResult: false,
        resultPayload: null,
        claimPayload: observation.claim.payload,
        observedStates,
        staleClaim: true,
      };
    }

    await sleep(pollIntervalMs);
  }

  return {
    queue_state: "queued",
    terminal_status: "timeout",
    malformedResult: false,
    resultPayload: null,
    claimPayload: driveRuntime.readClaim(taskSpec.job_id, { driveRoot: runtimePaths.driveRoot }).payload,
    observedStates,
    staleClaim: false,
  };
}

async function execute(taskSpec, options = {}) {
  const started_at = nowIso();
  const payload = createImageIntake(taskSpec);
  const runtimePaths = getRuntimePaths(taskSpec, options);
  const jobEnvelope = buildJobEnvelope(taskSpec, payload, runtimePaths);

  driveRuntime.writeJob(jobEnvelope, { driveRoot: runtimePaths.driveRoot });

  const waitResult = await waitForResult(taskSpec, runtimePaths, options);
  const outputExists = driveRuntime.readOutput(taskSpec.job_id, { driveRoot: runtimePaths.driveRoot }).exists;
  const artifacts = driveRuntime.listArtifacts(taskSpec.job_id, { driveRoot: runtimePaths.driveRoot });
  const validatorSignals = [];

  if (waitResult.malformedResult) {
    validatorSignals.push("malformed result.json");
    for (const signal of waitResult.malformedSignals || []) {
      validatorSignals.push(signal);
    }
  }

  if (waitResult.terminal_status === "timeout") {
    validatorSignals.push("timeout");
  }

  if (waitResult.staleClaim) {
    validatorSignals.push("stale claim");
  }

  if ((waitResult.terminal_status === "completed" || waitResult.terminal_status === "failed" || waitResult.terminal_status === "rejected")
    && !outputExists) {
    validatorSignals.push("missing output.png");
  }

  const validator_result = await validateImageArtifacts({
    payload,
    artifacts,
    resultPayload: waitResult.resultPayload,
  });

  const mergedSignals = [...validator_result.signals, ...validatorSignals]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);

  const normalizedValidator = {
    passed: mergedSignals.length === 0 && waitResult.terminal_status === "completed" && outputExists,
    signals: mergedSignals,
    issues: mergedSignals,
    judge_output: validator_result.judge_output || null,
    judge_output_path: validator_result.judge_output_path || null,
    critic_merge: validator_result.critic_merge || null,
    proof_blocked: validator_result.proof_blocked === true,
  };

  let status = waitResult.terminal_status;
  if (status === "failed" && waitResult.malformedResult) {
    status = "rejected";
  }
  if (status === "completed" && !normalizedValidator.passed) {
    status = "rejected";
  }

  const summaryMap = {
    completed: "Image lane completed through Drive queue and Colab output contract.",
    failed: "Image lane execution failed after dispatch to Drive queue.",
    timeout: "Image lane timed out waiting for claim or outputs.",
    rejected: "Image lane produced an invalid or incomplete result.",
  };

  return {
    job_id: taskSpec.job_id,
    lane: "image",
    status,
    summary: summaryMap[status] || "Image lane finished with an unknown terminal state.",
    artifacts,
    validator_result: normalizedValidator,
    error: status === "completed" ? null : (normalizedValidator.signals[0] || "image lane execution failed"),
    started_at,
    finished_at: nowIso(),
    metadata: {
      queue_state: waitResult.queue_state,
      observed_states: waitResult.observedStates,
      drive_root: runtimePaths.driveRoot,
      job_file_path: runtimePaths.jobFilePath,
      claim_file_path: runtimePaths.claimFilePath,
      result_file_path: runtimePaths.resultFilePath,
      judge_output_file_path: normalizeJudgeOutputPath(waitResult.resultPayload, runtimePaths),
      output_image_path: runtimePaths.outputImagePath,
      claim: waitResult.claimPayload,
      result: waitResult.resultPayload,
      judge_output: validator_result.judge_output || null,
      critic_merge: validator_result.critic_merge || null,
      proof_blocked: validator_result.proof_blocked === true,
      malformed_result: waitResult.malformedResult,
      stale_claim: waitResult.staleClaim,
    },
  };
}

module.exports = {
  DEFAULT_DRIVE_ROOT: driveRuntime.DEFAULT_DRIVE_ROOT,
  resolveDrivePaths: driveRuntime.resolveDrivePaths,
  getRuntimePaths,
  buildJobEnvelope,
  validateResultPayload,
  waitForResult,
  execute,
};
