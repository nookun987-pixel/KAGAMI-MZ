"use strict";

const { getQueueItem, listQueueItems } = require("../queue/task_queue_authority");
const { getRunState } = require("../state/run_state_authority");

function safeClone(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value ?? fallback));
  } catch (_) {
    return fallback;
  }
}

function ensureRunIsolation(runState, queueItem) {
  try {
    const run = safeClone(runState, {});
    const queue = safeClone(queueItem, {});
    const issues = [];
    const runId = run.run_id || null;
    const queueId = queue.queue_id || null;

    if (!runId || !queueId) issues.push("missing_identity");
    if (runId && queue.run_id && runId !== queue.run_id) issues.push("run_queue_mismatch");
    if (queueId && run.latest_active_queue_id && run.latest_active_queue_id !== queueId) issues.push("active_queue_mismatch");
    if (Array.isArray(run.active_queue_ids) && queueId && !run.active_queue_ids.includes(queueId)) issues.push("queue_not_registered_on_run");

    return {
      ok: issues.length === 0,
      isolated: issues.length === 0,
      run_id: runId,
      queue_id: queueId,
      issues,
      blocked: issues.length > 0,
    };
  } catch (error) {
    return {
      ok: false,
      isolated: false,
      run_id: null,
      queue_id: null,
      issues: ["guard_error", error.message],
      blocked: true,
    };
  }
}

function detectDuplicateDispatch(run_id, queue_id) {
  try {
    const runId = run_id || null;
    const queueId = queue_id || null;
    const queueItem = queueId ? getQueueItem(queueId) : null;
    const runState = runId ? getRunState(runId) : null;
    const activeStatuses = new Set(["claimed", "running"]);
    const conflicts = listQueueItems().filter((item) => (
      item &&
      item.queue_id !== queueId &&
      item.run_id === runId &&
      activeStatuses.has(item.status)
    ));
    const reasons = [];

    if (!runId || !queueId) reasons.push("missing_identity");
    if (!queueItem) reasons.push("queue_missing");
    if (queueItem && queueItem.run_id && runId && queueItem.run_id !== runId) reasons.push("queue_run_mismatch");
    if (runState && runState.latest_active_queue_id && runState.latest_active_queue_id !== queueId && conflicts.length > 0) reasons.push("run_active_elsewhere");
    if (conflicts.length > 0) reasons.push("concurrent_same_run");
    if (queueItem && ["claimed", "running", "completed", "failed", "blocked"].includes(queueItem.status)) reasons.push(`queue_status_${queueItem.status}`);

    return {
      ok: reasons.length === 0,
      duplicate: reasons.length > 0,
      blocked: reasons.length > 0,
      run_id: runId,
      queue_id: queueId,
      conflicting_queue_ids: conflicts.map((item) => item.queue_id),
      reasons,
    };
  } catch (error) {
    return {
      ok: false,
      duplicate: true,
      blocked: true,
      run_id: run_id || null,
      queue_id: queue_id || null,
      conflicting_queue_ids: [],
      reasons: ["guard_error", error.message],
    };
  }
}

function validateFinalizeOwnership(run_id, queue_id, worker_id) {
  try {
    const runId = run_id || null;
    const queueId = queue_id || null;
    const workerId = worker_id || null;
    const queueItem = queueId ? getQueueItem(queueId) : null;
    const runState = runId ? getRunState(runId) : null;
    const reasons = [];

    if (!runId || !queueId || !workerId) reasons.push("missing_identity");
    if (!queueItem) reasons.push("queue_missing");
    if (!runState) reasons.push("run_missing");
    if (queueItem && queueItem.run_id !== runId) reasons.push("queue_run_mismatch");
    if (queueItem && (!queueItem.claim || queueItem.claim.worker_id !== workerId)) reasons.push("worker_not_owner");
    if (runState && runState.latest_active_queue_id && runState.latest_active_queue_id !== queueId) reasons.push("run_active_queue_mismatch");

    return {
      ok: reasons.length === 0,
      allowed: reasons.length === 0,
      blocked: reasons.length > 0,
      run_id: runId,
      queue_id: queueId,
      worker_id: workerId,
      reasons,
    };
  } catch (error) {
    return {
      ok: false,
      allowed: false,
      blocked: true,
      run_id: run_id || null,
      queue_id: queue_id || null,
      worker_id: worker_id || null,
      reasons: ["guard_error", error.message],
    };
  }
}

module.exports = {
  ensureRunIsolation,
  detectDuplicateDispatch,
  validateFinalizeOwnership,
};
