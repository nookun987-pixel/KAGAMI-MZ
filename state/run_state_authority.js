"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_STORE_PATH = path.join(__dirname, "run_state_store.json");
const DEFAULT_MAX_ATTEMPTS = 3;
const VALID_STATUSES = ["created", "queued", "claimed", "running", "retrying", "rejected", "escalated", "completed", "failed", "blocked", "repair_needed"];
const TERMINAL_STATUSES = new Set(["completed", "failed", "blocked", "rejected"]);

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function getStorePath() {
  return process.env.STATE_STORE_PATH || DEFAULT_STORE_PATH;
}

function readStateStore() {
  try {
    const storePath = getStorePath();
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(storePath)) return { version: "1", updated_at: "", runs: {} };
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    if (!parsed.runs || typeof parsed.runs !== "object") parsed.runs = {};
    return parsed;
  } catch (error) {
    console.warn(`[STATE] Store read error (non-fatal): ${error.message}`);
    return { version: "1", updated_at: "", runs: {} };
  }
}

function writeStateStore(store) {
  try {
    store.updated_at = nowIso();
    const storePath = getStorePath();
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[STATE] Store write error (non-fatal): ${error.message}`);
    return false;
  }
}

function buildRecord(task = {}, overrides = {}) {
  const payload = task.payload || {};
  return {
    run_id: overrides.run_id || payload.run_id || `run_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    task_type: task.task_type || "run_render_task",
    job_id: payload.job_id || null,
    entity_id: payload.entity_id || null,
    status: overrides.status || "created",
    attempt_count: overrides.attempt_count ?? 1,
    max_attempts: overrides.max_attempts ?? DEFAULT_MAX_ATTEMPTS,
    created_at: overrides.created_at || nowIso(),
    updated_at: nowIso(),
    last_decision: overrides.last_decision || null,
    last_reason: overrides.last_reason || null,
    context_mode: overrides.context_mode || null,
    sources_used: safeClone(overrides.sources_used || [], []),
    failure_patterns: safeClone(overrides.failure_patterns || [], []),
    patch_history: safeClone(overrides.patch_history || [], []),
    decision_history: safeClone(overrides.decision_history || [], []),
    operator_result_summary: safeClone(overrides.operator_result_summary || {}, {}),
    latest_active_queue_id: overrides.latest_active_queue_id || null,
    active_queue_ids: safeClone(overrides.active_queue_ids || [], []),
    queue_history: safeClone(overrides.queue_history || [], []),
    active_worker_id: overrides.active_worker_id || null,
    finalized_identity: overrides.finalized_identity || null,
    metadata: safeClone(overrides.metadata || {}, {}),
  };
}

function listRunStates() {
  return Object.values(readStateStore().runs || {}).map((run) => safeClone(run, {})).filter(Boolean);
}

function getRunState(run_id) {
  try {
    if (!run_id) return null;
    const run = readStateStore().runs[String(run_id)];
    return run ? safeClone(run, null) : null;
  } catch (_) {
    return null;
  }
}

function loadRunState(task = {}) {
  try {
    const payload = task.payload || {};
    const store = readStateStore();

    if (payload.run_id && store.runs[payload.run_id]) {
      const exact = store.runs[payload.run_id];
      if (!TERMINAL_STATUSES.has(exact.status)) return safeClone(exact, null);
    }

    if (!payload.job_id) return null;
    const active = Object.values(store.runs)
      .filter((run) => run.job_id === payload.job_id && !TERMINAL_STATUSES.has(run.status))
      .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")));
    return active[0] ? safeClone(active[0], null) : null;
  } catch (_) {
    return null;
  }
}

function createRunState(task = {}, overrides = {}) {
  try {
    const record = buildRecord(task, overrides);
    const store = readStateStore();
    store.runs[record.run_id] = record;
    writeStateStore(store);
    return safeClone(record, null);
  } catch (error) {
    console.warn(`[STATE] createRunState error: ${error.message}`);
    return buildRecord(task, overrides);
  }
}

function updateRunState(run_id, patch = {}) {
  try {
    if (!run_id) return null;
    const store = readStateStore();
    const current = store.runs[String(run_id)];
    if (!current) return null;
    const next = { ...current, ...safeClone(patch, {}), updated_at: nowIso() };
    if (next.status && !VALID_STATUSES.includes(next.status)) next.status = current.status;
    store.runs[String(run_id)] = next;
    writeStateStore(store);
    return safeClone(next, null);
  } catch (_) {
    return null;
  }
}

function dedupeArray(values) {
  return Array.from(new Set((values || []).filter(Boolean)));
}

function linkQueueToRun(run_id, queue_id, metadata = {}) {
  try {
    const current = getRunState(run_id);
    if (!current || !queue_id) return null;
    return updateRunState(run_id, {
      latest_active_queue_id: queue_id,
      active_queue_ids: dedupeArray([...(current.active_queue_ids || []), queue_id]),
      queue_history: dedupeArray([...(current.queue_history || []), queue_id]),
      metadata: {
        ...(current.metadata || {}),
        last_queue_link: {
          queue_id,
          queue_status: metadata.queue_status || null,
          duplicate: !!metadata.duplicate,
        },
      },
    });
  } catch (_) {
    return null;
  }
}

function markRunQueued(run_id, queue_id) {
  const current = getRunState(run_id);
  if (!current) return null;
  return updateRunState(run_id, {
    status: "queued",
    latest_active_queue_id: queue_id || current.latest_active_queue_id,
    active_queue_ids: dedupeArray([...(current.active_queue_ids || []), queue_id || current.latest_active_queue_id]),
  });
}

function markRunStarted(run_id, queue_id, worker_id) {
  const current = getRunState(run_id);
  if (!current) return null;
  return updateRunState(run_id, {
    status: "running",
    latest_active_queue_id: queue_id || current.latest_active_queue_id,
    active_worker_id: worker_id || current.active_worker_id,
    active_queue_ids: dedupeArray([...(current.active_queue_ids || []), queue_id || current.latest_active_queue_id]),
  });
}

function mapResultToStatus(result) {
  if (["completed", "failed", "blocked"].includes(result.status)) return result.status;
  if (result.operator_verdict === "DONE" || result.decision === "ALLOW") return "completed";
  if (result.operator_verdict === "REJECT") return "blocked";
  return "failed";
}

function mapDecision(result) {
  if (result.operator_verdict === "DONE" || result.decision === "ALLOW") return "COMPLETE";
  if (result.operator_verdict === "REJECT") return "REJECT";
  return "FAIL";
}

function finalizeRunState(run_id, result = {}, contextMeta = {}) {
  try {
    if (!run_id) return { ok: false, idempotent: false, run_state: null, reason: "missing_run_id" };
    const store = readStateStore();
    const current = store.runs[String(run_id)];
    if (!current) return { ok: false, idempotent: false, run_state: null, reason: "run_missing" };

    const finalizeIdentity = contextMeta.finalize_identity ||
      [run_id, contextMeta.queue_id || "queue", contextMeta.worker_id || "worker", result.operator_verdict || result.status || result.decision || "unknown"].join(":");

    if (TERMINAL_STATUSES.has(current.status)) {
      if (current.finalized_identity === finalizeIdentity) return { ok: true, idempotent: true, run_state: safeClone(current, null) };
      return { ok: false, idempotent: false, run_state: safeClone(current, null), reason: "already_finalized" };
    }

    const loopTrace = result.artifacts && result.artifacts.loop_trace;
    const decisionItem = {
      identity: finalizeIdentity,
      timestamp: nowIso(),
      decision: mapDecision(result),
      reason: ((loopTrace && loopTrace.decision_reason) || result.result_summary || "").slice(0, 240),
    };
    const patchSummary = loopTrace && loopTrace.patch_plan_summary;
    const patchItem = patchSummary ? {
      identity: finalizeIdentity,
      timestamp: nowIso(),
      source: patchSummary.source || "generic",
      actions: safeClone(patchSummary.actions || [], []),
      negative_additions: safeClone(patchSummary.negative_additions || [], []),
      positive_additions: safeClone(patchSummary.positive_additions || [], []),
      parameter_adjustments: safeClone(patchSummary.parameter_adjustments || {}, {}),
    } : null;

    const decisionHistory = (current.decision_history || []).some((entry) => entry.identity === finalizeIdentity)
      ? current.decision_history
      : [...(current.decision_history || []), decisionItem];
    const patchHistory = !patchItem
      ? (current.patch_history || [])
      : (current.patch_history || []).some((entry) => entry.identity === finalizeIdentity)
        ? current.patch_history
        : [...(current.patch_history || []), patchItem];

    const next = {
      ...current,
      status: mapResultToStatus(result),
      last_decision: decisionItem.decision,
      last_reason: decisionItem.reason,
      latest_active_queue_id: contextMeta.queue_id || current.latest_active_queue_id,
      active_worker_id: null,
      active_queue_ids: (current.active_queue_ids || []).filter((queueId) => queueId !== contextMeta.queue_id),
      decision_history: decisionHistory,
      patch_history: patchHistory,
      operator_result_summary: {
        operator_verdict: result.operator_verdict || null,
        called_module: result.called_module || null,
        result_summary: (result.result_summary || "").slice(0, 300),
        error: result.error || null,
        queue_id: contextMeta.queue_id || null,
        worker_id: contextMeta.worker_id || null,
      },
      finalized_identity: finalizeIdentity,
      metadata: {
        ...(current.metadata || {}),
        last_finalize_queue_id: contextMeta.queue_id || null,
      },
      updated_at: nowIso(),
    };

    store.runs[String(run_id)] = next;
    writeStateStore(store);
    return { ok: true, idempotent: false, run_state: safeClone(next, null) };
  } catch (error) {
    return { ok: false, idempotent: false, run_state: null, reason: error.message };
  }
}

function markRunRepairNeeded(run_id, details = {}) {
  const current = getRunState(run_id);
  if (!current) return null;
  return updateRunState(run_id, {
    status: "repair_needed",
    metadata: {
      ...(current.metadata || {}),
      repair_needed: true,
      repair_reason: details.reason || "repair_needed",
      repair_details: safeClone(details, {}),
    },
  });
}

function isRetryExhausted(runState) {
  if (!runState || typeof runState !== "object") return false;
  const count = runState.attempt_count ?? 0;
  const max = runState.max_attempts ?? DEFAULT_MAX_ATTEMPTS;
  return count >= max;
}

module.exports = {
  VALID_STATUSES,
  DEFAULT_MAX_ATTEMPTS,
  TERMINAL_STATUSES,
  readStateStore,
  writeStateStore,
  listRunStates,
  createRunState,
  loadRunState,
  updateRunState,
  finalizeRunState,
  getRunState,
  linkQueueToRun,
  markRunQueued,
  markRunStarted,
  markRunRepairNeeded,
  isRetryExhausted,
};
