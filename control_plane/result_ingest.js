"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson, readJsonSafe } = require("./local_control_agent/bridge_writer");
const { ingestExecutionOutcome } = require("./execution_result_ingestor");

function normalizeIngestedOutcome(input = {}, ingested = {}) {
  if (ingested.status !== "PASS") {
    return {
      status: "fail",
      job_id: input.job_id || null,
      task_id: input.task_id || null,
      changed_files: [],
      output: null,
      error: ingested.reason || "ingest_failed",
      completed_at: new Date().toISOString(),
      source_artifact_ref: null,
    };
  }
  if (input.outcome === "success") {
    return {
      status: "success",
      job_id: ingested.job.job_id,
      task_id: ingested.normalized.task_id,
      changed_files: ingested.normalized.changed_files || [],
      output: ingested.normalized.summary || "",
      error: null,
      tests_executed: ingested.normalized.tests_executed || [],
      tests_passed: ingested.normalized.tests_passed || [],
      tests_failed: ingested.normalized.tests_failed || [],
      artifacts_returned: ingested.normalized.artifacts_returned || [],
      completed_at: ingested.normalized.completed_at,
      source_artifact_ref: ingested.artifact_path || null,
    };
  }
  return {
    status: "fail",
    job_id: ingested.job.job_id,
    task_id: ingested.normalized.task_id,
    changed_files: [],
    output: null,
    error: ingested.normalized.summary || ingested.normalized.failure_type || "execution_failed",
    failure_stage: ingested.normalized.failure_stage || null,
    failure_type: ingested.normalized.failure_type || null,
    retryable: !!ingested.normalized.retryable,
    completed_at: ingested.normalized.failed_at,
    source_artifact_ref: ingested.artifact_path || null,
  };
}

function writeResultIngestArtifact(normalized) {
  const filePath = path.join(config.RESULT_INGEST_DIR, `${normalized.job_id || `result_${Date.now()}`}.result_ingest.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, normalized);
  return filePath;
}

function ingestExecutorOutput(input = {}) {
  const ingested = ingestExecutionOutcome(input);
  const normalized = normalizeIngestedOutcome(input, ingested);
  const artifactPath = writeResultIngestArtifact(normalized);
  return {
    status: normalized.status === "success" ? "PASS" : (ingested.status === "PASS" ? "FAIL" : "BLOCKED"),
    normalized,
    ingest_artifact_path: artifactPath,
    raw_ingest: ingested,
  };
}

function getLatestResultIngest(jobId) {
  const filePath = path.join(config.RESULT_INGEST_DIR, `${jobId}.result_ingest.json`);
  return readJsonSafe(filePath, null);
}

module.exports = {
  normalizeIngestedOutcome,
  writeResultIngestArtifact,
  ingestExecutorOutput,
  getLatestResultIngest,
};
