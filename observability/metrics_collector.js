"use strict";

const {
  readMetricsRegistry,
  writeMetricsRegistry,
  getRunMetrics,
} = require("./run_metrics_registry");

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function nowIso() {
  return new Date().toISOString();
}

function inferLane(payload = {}, runState = {}) {
  return String(
    payload.lane ||
    payload.shot_type ||
    (payload.render && payload.render.shot_type) ||
    runState.task_type ||
    "unknown"
  ).trim() || "unknown";
}

function normalizeFinalStatus(execution = {}, fallbackReason = null) {
  if (execution.reason && /LIMIT_REACHED|BUDGET_EXCEEDED|GLOBAL_BUDGET_EXCEEDED|AUTH_REQUIRED|INVALID_/i.test(execution.reason)) {
    return "STOP";
  }
  if (execution.operator_verdict === "DONE" || execution.decision === "ALLOW") return "ALLOW";
  if (execution.operator_verdict === "REJECT" || execution.reason || fallbackReason) return "REJECT";
  return "FAIL";
}

function collectRunStart(runState, payload = {}) {
  try {
    if (!runState || !runState.run_id) return { ok: false, run: null, reason: "missing_run_state" };
    const registry = readMetricsRegistry();
    const existing = registry.runs[runState.run_id] || {};
    const next = {
      run_id: runState.run_id,
      lane: inferLane(payload, runState),
      attempts: toNumber(existing.attempts, 0),
      retry_count: toNumber(existing.retry_count, 0),
      final_status: existing.final_status || null,
      final_reason: existing.final_reason || null,
      cost_used: toNumber(existing.cost_used, 0),
      canon_packet_applied: existing.canon_packet_applied === true,
      started_at: existing.started_at || nowIso(),
      finished_at: existing.finished_at || null,
    };
    registry.runs[runState.run_id] = next;
    writeMetricsRegistry(registry);
    return { ok: true, run: next };
  } catch (error) {
    return { ok: false, run: null, reason: error.message };
  }
}

function collectAttemptMetric(runState, execution = {}, options = {}) {
  try {
    if (!runState || !runState.run_id) return { ok: false, attempt: null, reason: "missing_run_state" };
    const registry = readMetricsRegistry();
    const current = registry.runs[runState.run_id] || {
      run_id: runState.run_id,
      lane: inferLane(options.payload || {}, runState),
      attempts: 0,
      retry_count: 0,
      final_status: null,
      final_reason: null,
      cost_used: 0,
      canon_packet_applied: false,
      started_at: nowIso(),
      finished_at: null,
    };
    const attemptNumber = Math.max(1, toNumber(options.attempt, current.attempts + 1));
    const reason = execution.reason || execution.error || options.reason || null;
    const attemptRecord = {
      run_id: runState.run_id,
      attempt: attemptNumber,
      status: execution.operator_verdict || execution.status || (execution.decision === "ALLOW" ? "DONE" : "FAIL"),
      reason,
      patch_applied: !!(execution.artifacts && execution.artifacts.loop_trace && execution.artifacts.loop_trace.patch_plan_summary),
      cost: toNumber(execution.cost || (execution.cost_authority && execution.cost_authority.actual_cost), 0),
      timestamp: options.timestamp || nowIso(),
    };

    registry.attempts.push(attemptRecord);
    const updatedRun = {
      ...current,
      attempts: Math.max(current.attempts || 0, attemptNumber),
      retry_count: Math.max(current.retry_count || 0, toNumber(options.retry_count, 0)),
      cost_used: Number((toNumber(current.cost_used, 0) + attemptRecord.cost).toFixed(4)),
      canon_packet_applied: current.canon_packet_applied || !!(execution.artifacts && execution.artifacts.summary && execution.artifacts.summary.generalized_canon_packet) || !!(options.canon_packet_applied),
    };
    registry.runs[runState.run_id] = updatedRun;
    writeMetricsRegistry(registry);
    return { ok: true, attempt: attemptRecord, run: updatedRun };
  } catch (error) {
    return { ok: false, attempt: null, reason: error.message };
  }
}

function collectRunFinalize(runState, execution = {}, options = {}) {
  try {
    if (!runState || !runState.run_id) return { ok: false, run: null, reason: "missing_run_state" };
    const registry = readMetricsRegistry();
    const current = registry.runs[runState.run_id] || {};
    const final_reason = execution.reason || execution.error || options.reason || null;
    const next = {
      run_id: runState.run_id,
      lane: current.lane || inferLane(options.payload || {}, runState),
      attempts: toNumber(current.attempts, 0),
      retry_count: Math.max(toNumber(current.retry_count, 0), toNumber(options.retry_count, 0)),
      final_status: options.final_status || normalizeFinalStatus(execution, final_reason),
      final_reason,
      cost_used: toNumber(current.cost_used, 0),
      canon_packet_applied: current.canon_packet_applied === true || !!(execution.artifacts && execution.artifacts.summary && execution.artifacts.summary.generalized_canon_packet) || !!(options.canon_packet_applied),
      started_at: current.started_at || nowIso(),
      finished_at: options.finished_at || nowIso(),
    };
    registry.runs[runState.run_id] = next;
    writeMetricsRegistry(registry);
    return { ok: true, run: next };
  } catch (error) {
    return { ok: false, run: null, reason: error.message };
  }
}

module.exports = {
  collectRunStart,
  collectAttemptMetric,
  collectRunFinalize,
  getRunMetrics,
};
