"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { readFailureCenter, updateFailure } = require("./failure_center_store");

const DEFAULT_MAX_RETRY = 2;

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readRetryQueue() {
  return readJsonSafe(config.RETRY_QUEUE_PATH, {
    generated_at: null,
    queued: [],
  });
}

function writeRetryQueue(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.RETRY_QUEUE_PATH, store);
}

function requestRetry(failureId, options = {}) {
  const failure = (readFailureCenter().failures || []).find((item) => item.failure_id === failureId);
  if (!failure) return { status: "BLOCKED", reason: "failure_not_found" };
  if (!failure.retryable) return { status: "BLOCKED", reason: "failure_not_retryable", failure };
  if (["destructive", "unknown"].includes(String(failure.action_type || ""))) {
    return { status: "BLOCKED", reason: "failure_action_type_not_retryable", failure };
  }
  if (Number(failure.retry_count || 0) >= DEFAULT_MAX_RETRY) {
    const exhausted = updateFailure(failureId, {
      status: "RETRY_EXHAUSTED",
      failure_code: "RETRY_EXHAUSTED",
    });
    return { status: "BLOCKED", reason: "retry_exhausted", failure: exhausted };
  }
  const retryCount = Number(failure.retry_count || 0) + 1;
  const queue = readRetryQueue();
  const entry = {
    retry_id: `retry_${Date.now()}`,
    failure_id: failure.failure_id,
    task_id: failure.task_id,
    action_id: failure.action_id,
    retry_count: retryCount,
    staged_retry_marker: `retry_${retryCount}`,
    next_retry_at: new Date(Date.now() + (500 * Math.pow(2, retryCount - 1))).toISOString(),
    status: "queued",
    created_at: new Date().toISOString(),
  };
  queue.queued = Array.isArray(queue.queued) ? queue.queued : [];
  queue.queued.unshift(entry);
  writeRetryQueue(queue);
  appendJsonl(config.RETRY_QUEUE_HISTORY_JSONL, entry);
  updateFailure(failureId, {
    retry_count: retryCount,
    status: "retrying",
  });
  return { status: "PASS", entry };
}

module.exports = {
  DEFAULT_MAX_RETRY,
  readRetryQueue,
  writeRetryQueue,
  requestRetry,
};
