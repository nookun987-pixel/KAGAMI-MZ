"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { getQueueItem, upsertQueueItem } = require("./persistent_task_queue");
const { evaluateRetry, registerRetry, readRetryState } = require("./bounded_retry_policy");

function readResumeState() {
  return readJsonSafe(config.EXECUTION_RESUME_STATE_PATH, {
    generated_at: null,
    latest_resume: null,
  });
}

function writeResumeState(payload) {
  writeJson(config.EXECUTION_RESUME_STATE_PATH, {
    generated_at: new Date().toISOString(),
    latest_resume: payload,
  });
}

function getResumePlan(taskId) {
  const item = getQueueItem(taskId);
  if (!item) {
    return { status: "BLOCKED", reason: "task_queue_item_not_found", task_id: taskId };
  }
  const completed = Array.isArray(item.completed_steps) ? item.completed_steps : [];
  const nextStepIndex = item.status === "step_failed"
    ? Number(item.current_step_index || 0)
    : completed.length;
  return {
    status: "PASS",
    task: item,
    next_step_index: nextStepIndex,
    completed_steps: completed,
  };
}

function markResumeAttempt(taskId, nextStepIndex, mode) {
  const payload = {
    task_id: taskId,
    next_step_index: nextStepIndex,
    mode,
    resumed_at: new Date().toISOString(),
  };
  writeResumeState(payload);
  return payload;
}

function prepareResume(taskId) {
  const plan = getResumePlan(taskId);
  if (plan.status !== "PASS") return plan;
  const payload = markResumeAttempt(taskId, plan.next_step_index, "resume");
  upsertQueueItem(taskId ? {
    task_id: taskId,
    status: "running",
    resume_state: payload,
  } : {});
  return {
    status: "PASS",
    queue_item: plan.task,
    next_step_index: plan.next_step_index,
    resume_state: payload,
  };
}

function prepareRetry(taskId, failureType) {
  const item = getQueueItem(taskId);
  if (!item) {
    return { status: "BLOCKED", reason: "task_queue_item_not_found", task_id: taskId };
  }
  const retryState = readRetryState().retries_by_task[String(taskId)] || { retry_count: 0 };
  const decision = evaluateRetry(taskId, failureType, retryState.retry_count || 0);
  if (!decision.allowed) {
    return {
      status: "BLOCKED",
      reason: decision.reason,
      retry_state: retryState,
    };
  }
  const next = registerRetry(taskId, failureType);
  const payload = markResumeAttempt(taskId, Number(item.current_step_index || 0), "retry");
  upsertQueueItem({
    ...item,
    status: "running",
    retry_state: {
      ...(item.retry_state || {}),
      retry_count: next.retry_count,
      last_failure_type: failureType,
      last_retry_at: next.last_retry_at,
    },
    resume_state: payload,
  });
  return {
    status: "PASS",
    queue_item: item,
    next_step_index: Number(item.current_step_index || 0),
    retry_state: next,
    resume_state: payload,
  };
}

module.exports = {
  getResumePlan,
  prepareResume,
  prepareRetry,
};
