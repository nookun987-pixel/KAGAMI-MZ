"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const ALLOWED_STATUSES = new Set(["PENDING", "DISPATCHED", "RUNNING", "SUCCEEDED", "FAILED", "EXPIRED", "INGEST_ERROR"]);

function readExecutorStatusTracker() {
  return readJsonSafe(config.EXECUTOR_STATUS_TRACKER_PATH, {
    generated_at: null,
    statuses: {},
  });
}

function writeExecutorStatusTracker(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.EXECUTOR_STATUS_TRACKER_PATH, store);
}

function setExecutorStatus(jobId, status, extra = {}) {
  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error(`invalid_executor_status:${status}`);
  }
  const store = readExecutorStatusTracker();
  store.statuses = store.statuses || {};
  store.statuses[jobId] = {
    job_id: jobId,
    status,
    updated_at: new Date().toISOString(),
    ...extra,
  };
  writeExecutorStatusTracker(store);
  return store.statuses[jobId];
}

function getExecutorStatus(jobId) {
  const store = readExecutorStatusTracker();
  return (store.statuses || {})[jobId] || null;
}

module.exports = {
  ALLOWED_STATUSES,
  readExecutorStatusTracker,
  writeExecutorStatusTracker,
  setExecutorStatus,
  getExecutorStatus,
};
