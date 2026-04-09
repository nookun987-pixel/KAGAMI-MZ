"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readExecutorJobRegistry() {
  return readJsonSafe(config.EXECUTOR_JOB_REGISTRY_PATH, {
    generated_at: null,
    jobs: [],
    latest_by_task: {},
  });
}

function writeExecutorJobRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.EXECUTOR_JOB_REGISTRY_PATH, store);
}

function buildExecutorJobId(taskId) {
  return `job_${String(taskId || "task").replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

function writeExecutorJobArtifact(job) {
  const filePath = path.join(config.EXECUTOR_JOB_DIR, `${job.job_id}.executor_job.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, job);
  return filePath;
}

function createExecutorJob(input) {
  const store = readExecutorJobRegistry();
  const now = new Date().toISOString();
  const job = {
    job_id: input.job_id || buildExecutorJobId(input.task_id),
    task_id: input.task_id,
    workflow_id: input.workflow_id || null,
    dispatch_id: input.dispatch_id,
    executor: input.executor || "codex",
    repo_path: input.repo_path,
    branch_policy: input.branch_policy,
    status: input.status || "PENDING",
    created_at: now,
    updated_at: now,
    started_at: input.started_at || null,
    finished_at: input.finished_at || null,
    result_ref: input.result_ref || null,
    failure_ref: input.failure_ref || null,
    dispatch_ref: input.dispatch_ref || null,
    handoff_ref: input.handoff_ref || null,
  };
  const artifactPath = writeExecutorJobArtifact(job);
  job.artifact_path = artifactPath;
  store.jobs.unshift(job);
  store.jobs = store.jobs.slice(0, 500);
  store.latest_by_task = store.latest_by_task || {};
  if (job.task_id) store.latest_by_task[job.task_id] = job;
  writeExecutorJobRegistry(store);
  appendJsonl(config.EXECUTOR_JOB_HISTORY_JSONL, job);
  return { status: "PASS", job, artifact_path: artifactPath };
}

function updateExecutorJob(jobId, patch = {}) {
  const store = readExecutorJobRegistry();
  const idx = (store.jobs || []).findIndex((job) => job.job_id === jobId);
  if (idx === -1) return null;
  const current = store.jobs[idx];
  const updated = {
    ...current,
    ...patch,
    job_id: current.job_id,
    updated_at: new Date().toISOString(),
  };
  store.jobs[idx] = updated;
  if (updated.task_id) store.latest_by_task[updated.task_id] = updated;
  const artifactPath = writeExecutorJobArtifact(updated);
  updated.artifact_path = artifactPath;
  store.jobs[idx] = updated;
  writeExecutorJobRegistry(store);
  appendJsonl(config.EXECUTOR_JOB_HISTORY_JSONL, updated);
  return updated;
}

function getExecutorJob(jobId) {
  const store = readExecutorJobRegistry();
  return (store.jobs || []).find((job) => job.job_id === jobId) || null;
}

function listExecutorJobs(limit = 50) {
  const store = readExecutorJobRegistry();
  return {
    generated_at: store.generated_at || null,
    jobs: (store.jobs || []).slice(0, limit),
    latest_by_task: store.latest_by_task || {},
  };
}

module.exports = {
  readExecutorJobRegistry,
  writeExecutorJobRegistry,
  createExecutorJob,
  updateExecutorJob,
  getExecutorJob,
  listExecutorJobs,
};
