"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const RETRYABLE_FAILURE_TYPES = new Set([
  "page_fetch_failed",
  "browser_open_failed",
  "desktop_state_capture_failed",
  "singleton_already_locked",
  "max_concurrent_children_exceeded",
  "executor_handoff_failed",
  "missing_execution_result",
  "codex_exec_failed",
]);
const MAX_RETRIES = 2;

function readRetryState() {
  return readJsonSafe(config.BOUNDED_RETRY_STATE_PATH, {
    generated_at: null,
    retries_by_task: {},
  });
}

function writeRetryState(state) {
  state.generated_at = new Date().toISOString();
  writeJson(config.BOUNDED_RETRY_STATE_PATH, state);
}

function evaluateRetry(taskId, failureType, currentCount = 0) {
  const retryable = RETRYABLE_FAILURE_TYPES.has(String(failureType || ""));
  if (!retryable) {
    return {
      allowed: false,
      retryable: false,
      reason: "failure_not_retryable",
      retry_count: currentCount,
    };
  }
  if (currentCount >= MAX_RETRIES) {
    return {
      allowed: false,
      retryable: true,
      reason: "retry_limit_exhausted",
      retry_count: currentCount,
    };
  }
  return {
    allowed: true,
    retryable: true,
    reason: "retry_allowed",
    retry_count: currentCount,
  };
}

function registerRetry(taskId, failureType) {
  const state = readRetryState();
  const current = state.retries_by_task[taskId] || {
    retry_count: 0,
    last_failure_type: null,
    last_retry_at: null,
  };
  const next = {
    retry_count: current.retry_count + 1,
    last_failure_type: failureType,
    last_retry_at: new Date().toISOString(),
  };
  state.retries_by_task[taskId] = next;
  writeRetryState(state);
  return next;
}

module.exports = {
  MAX_RETRIES,
  RETRYABLE_FAILURE_TYPES,
  readRetryState,
  evaluateRetry,
  registerRetry,
};
