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

function readFailureCenter() {
  return readJsonSafe(config.FAILURE_CENTER_PATH, {
    generated_at: null,
    failures: [],
  });
}

function writeFailureCenter(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.FAILURE_CENTER_PATH, store);
}

function buildFailureFingerprint(input) {
  return crypto.createHash("sha256").update(JSON.stringify({
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    action_id: input.action_id || null,
    failure_code: input.failure_code || null,
    failure_stage: input.failure_stage || null,
    message: input.message || null,
  })).digest("hex");
}

function recordFailure(input) {
  const store = readFailureCenter();
  const fingerprint = buildFailureFingerprint(input);
  const existing = (store.failures || []).find((item) => item.fingerprint === fingerprint);
  if (existing) {
    existing.retry_count = Number(existing.retry_count || 0);
    existing.seen_count = Number(existing.seen_count || 1) + 1;
    existing.last_seen_at = new Date().toISOString();
    if (input.report_ref) existing.report_ref = input.report_ref;
    if (input.command_ref) existing.command_ref = input.command_ref;
    writeFailureCenter(store);
    appendJsonl(config.FAILURE_CENTER_HISTORY_JSONL, existing);
    return existing;
  }
  const failure = {
    failure_id: input.failure_id || `failure_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    action_id: input.action_id || null,
    action_type: input.action_type || "unknown",
    failure_code: input.failure_code || "UNKNOWN_BLOCKED",
    failure_stage: input.failure_stage || "unknown",
    message: input.message || "",
    retryable: !!input.retryable,
    retry_count: Number(input.retry_count || 0),
    first_seen_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    status: input.status || "open",
    fingerprint,
    report_ref: input.report_ref || null,
    command_ref: input.command_ref || null,
    seen_count: 1,
  };
  store.failures = Array.isArray(store.failures) ? store.failures : [];
  store.failures.unshift(failure);
  writeFailureCenter(store);
  appendJsonl(config.FAILURE_CENTER_HISTORY_JSONL, failure);
  return failure;
}

function updateFailure(failureId, patch) {
  const store = readFailureCenter();
  const item = (store.failures || []).find((failure) => failure.failure_id === failureId);
  if (!item) return null;
  Object.assign(item, patch, { last_seen_at: new Date().toISOString() });
  writeFailureCenter(store);
  appendJsonl(config.FAILURE_CENTER_HISTORY_JSONL, item);
  return item;
}

module.exports = {
  readFailureCenter,
  writeFailureCenter,
  buildFailureFingerprint,
  recordFailure,
  updateFailure,
};
