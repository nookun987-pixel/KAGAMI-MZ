"use strict";

const path = require("path");

const { ensureDir, writeJson, readJson, fileExists } = require("../../MIKAGE/shared/utils/fs_utils");

const DEFAULT_DRIVE_ROOT = process.env.DRIVE_ROOT || path.resolve(__dirname);

function resolveDrivePaths(options = {}) {
  const driveRoot = path.resolve(options.driveRoot || process.env.DRIVE_ROOT || DEFAULT_DRIVE_ROOT);

  return {
    driveRoot,
    jobInboxDir: path.join(driveRoot, "job_inbox"),
    claimsDir: path.join(driveRoot, "claims"),
    outputsDir: path.join(driveRoot, "outputs"),
  };
}

function ensureDriveContract(options = {}) {
  const paths = resolveDrivePaths(options);
  ensureDir(paths.jobInboxDir);
  ensureDir(paths.claimsDir);
  ensureDir(paths.outputsDir);
  return paths;
}

function getJobRuntimePaths(jobId, options = {}) {
  const paths = ensureDriveContract(options);

  return {
    ...paths,
    jobFilePath: path.join(paths.jobInboxDir, `${jobId}.json`),
    claimFilePath: path.join(paths.claimsDir, `${jobId}.claim.json`),
    outputDir: path.join(paths.outputsDir, jobId),
    resultFilePath: path.join(paths.outputsDir, jobId, "result.json"),
    judgeOutputFilePath: path.join(paths.outputsDir, jobId, "judge_output.json"),
    outputImagePath: path.join(paths.outputsDir, jobId, "output.png"),
  };
}

function writeJob(payload, options = {}) {
  if (!payload || !payload.job_id) {
    throw new Error("Drive runtime writeJob requires payload.job_id");
  }

  const runtimePaths = getJobRuntimePaths(payload.job_id, options);
  writeJson(runtimePaths.jobFilePath, payload);

  return {
    ...runtimePaths,
    payload,
  };
}

function readClaim(jobId, options = {}) {
  const runtimePaths = getJobRuntimePaths(jobId, options);
  return {
    ...runtimePaths,
    exists: fileExists(runtimePaths.claimFilePath),
    payload: readJson(runtimePaths.claimFilePath, null),
  };
}

function readResult(jobId, options = {}) {
  const runtimePaths = getJobRuntimePaths(jobId, options);

  if (!fileExists(runtimePaths.resultFilePath)) {
    return {
      ...runtimePaths,
      exists: false,
      ok: false,
      payload: null,
      error: null,
    };
  }

  try {
    return {
      ...runtimePaths,
      exists: true,
      ok: true,
      payload: JSON.parse(require("fs").readFileSync(runtimePaths.resultFilePath, "utf-8")),
      error: null,
    };
  } catch (error) {
    return {
      ...runtimePaths,
      exists: true,
      ok: false,
      payload: null,
      error: error.message,
    };
  }
}

function readOutput(jobId, options = {}) {
  const runtimePaths = getJobRuntimePaths(jobId, options);
  return {
    ...runtimePaths,
    exists: fileExists(runtimePaths.outputImagePath),
  };
}

function observeJob(jobId, options = {}) {
  const staleClaimMs = Number.isFinite(options.staleClaimMs) ? options.staleClaimMs : 120000;
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const runtimePaths = getJobRuntimePaths(jobId, options);
  const claim = readClaim(jobId, options);
  const result = readResult(jobId, options);
  const output = readOutput(jobId, options);

  if (result.exists) {
    return {
      ...runtimePaths,
      queue_state: "completed",
      claim,
      result,
      output,
      stale_claim: false,
    };
  }

  if (claim.exists) {
    const claimedAt = claim.payload && claim.payload.claimed_at ? Date.parse(claim.payload.claimed_at) : NaN;
    const stale_claim = Number.isFinite(claimedAt) && nowMs - claimedAt > staleClaimMs;
    const status = String(claim.payload && claim.payload.status || "claimed").toLowerCase();

    return {
      ...runtimePaths,
      queue_state: stale_claim ? "stale_claim" : status === "running" ? "running" : "claimed",
      claim,
      result,
      output,
      stale_claim,
    };
  }

  return {
    ...runtimePaths,
    queue_state: "queued",
    claim,
    result,
    output,
    stale_claim: false,
  };
}

function listArtifacts(jobId, options = {}) {
  const runtimePaths = getJobRuntimePaths(jobId, options);
  const artifacts = [];

  if (fileExists(runtimePaths.jobFilePath)) {
    artifacts.push({ type: "job_json", label: "job_json", path: runtimePaths.jobFilePath });
  }
  if (fileExists(runtimePaths.claimFilePath)) {
    artifacts.push({ type: "claim_json", label: "claim_json", path: runtimePaths.claimFilePath });
  }
  if (fileExists(runtimePaths.resultFilePath)) {
    artifacts.push({ type: "result_json", label: "result_json", path: runtimePaths.resultFilePath });
  }
  if (fileExists(runtimePaths.judgeOutputFilePath)) {
    artifacts.push({ type: "judge_output_json", label: "judge_output_json", path: runtimePaths.judgeOutputFilePath });
  }
  if (fileExists(runtimePaths.outputImagePath)) {
    artifacts.push({ type: "image", label: "output_image", path: runtimePaths.outputImagePath });
  }

  return artifacts;
}

module.exports = {
  DEFAULT_DRIVE_ROOT,
  resolveDrivePaths,
  ensureDriveContract,
  getJobRuntimePaths,
  writeJob,
  readClaim,
  readResult,
  readOutput,
  observeJob,
  listArtifacts,
};
