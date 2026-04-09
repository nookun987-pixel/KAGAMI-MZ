"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");
const { normalizeExecutionSuccess, normalizeExecutionFailure } = require("./execution_report_normalizer");
const { getExecutorJob, updateExecutorJob } = require("./executor_job_store");
const { setExecutorStatus } = require("./executor_status_tracker");
const { estimateCost } = require("./cost_estimator");

function computeTiming(job) {
  const endTs = Date.now();
  const endTime = new Date(endTs).toISOString();
  const startTime = job.started_at || null;
  const startTs = startTime ? new Date(startTime).getTime() : null;
  const durationMs = startTs && !isNaN(startTs) ? endTs - startTs : null;
  return { start_time: startTime, end_time: endTime, duration_ms: durationMs };
}

function writeResultArtifact(jobId, kind, payload) {
  const dir = kind === "result" ? config.EXECUTION_RESULT_DIR : config.EXECUTION_FAILURE_DIR;
  const suffix = kind === "result" ? "execution_result" : "execution_failure";
  const filePath = path.join(dir, `${jobId}.${suffix}.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, payload);
  return filePath;
}

function ingestExecutionOutcome(input = {}) {
  const job = getExecutorJob(input.job_id);
  if (!job) return { status: "BLOCKED", reason: "job_not_found", job_id: input.job_id };
  if (input.outcome === "success") {
    const timing = computeTiming(job);
    const cost = estimateCost({
      executor_lane: input.executor_lane || job.executor_lane || null,
      changed_files: input.changed_files,
      tests_executed: input.tests_executed,
      requests_made: input.requests_made || 0,
      duration_ms: timing.duration_ms,
    });
    const normalized = normalizeExecutionSuccess({ ...input, ...timing, estimated_cost: cost });
    if (normalized.status !== "PASS") {
      updateExecutorJob(job.job_id, { status: "INGEST_ERROR", failure_ref: normalized.reason });
      setExecutorStatus(job.job_id, "INGEST_ERROR", { task_id: job.task_id, reason: normalized.reason });
      return normalized;
    }
    const artifactPath = writeResultArtifact(job.job_id, "result", normalized.result);
    const updated = updateExecutorJob(job.job_id, {
      status: "SUCCEEDED",
      finished_at: normalized.result.completed_at,
      result_ref: artifactPath,
      failure_ref: null,
    });
    setExecutorStatus(job.job_id, "SUCCEEDED", {
      task_id: job.task_id,
      result_ref: artifactPath,
      finished_at: normalized.result.completed_at,
    });
    return { status: "PASS", job: updated, normalized: normalized.result, artifact_path: artifactPath };
  }
  const normalized = normalizeExecutionFailure(input);
  if (normalized.status !== "PASS") {
    updateExecutorJob(job.job_id, { status: "INGEST_ERROR", failure_ref: normalized.reason });
    setExecutorStatus(job.job_id, "INGEST_ERROR", { task_id: job.task_id, reason: normalized.reason });
    return normalized;
  }
  const artifactPath = writeResultArtifact(job.job_id, "failure", normalized.failure);
  const updated = updateExecutorJob(job.job_id, {
    status: "FAILED",
    finished_at: normalized.failure.failed_at,
    result_ref: null,
    failure_ref: artifactPath,
  });
  setExecutorStatus(job.job_id, "FAILED", {
    task_id: job.task_id,
    failure_ref: artifactPath,
    finished_at: normalized.failure.failed_at,
  });
  return { status: "PASS", job: updated, normalized: normalized.failure, artifact_path: artifactPath };
}

module.exports = {
  ingestExecutionOutcome,
};
