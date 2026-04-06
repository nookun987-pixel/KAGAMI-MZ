"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_STORE_PATH = path.join(__dirname, "task_queue_store.json");
const ACTIVE_STATUSES = new Set(["queued", "claimed", "running"]);
const TERMINAL_STATUSES = new Set(["completed", "failed", "blocked"]);

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
  return process.env.TASK_QUEUE_STORE_PATH || DEFAULT_STORE_PATH;
}

function ensureStoreDir() {
  const storePath = getStorePath();
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readQueueStore() {
  try {
    ensureStoreDir();
    const storePath = getStorePath();
    if (!fs.existsSync(storePath)) return { version: "1", updated_at: "", queue: {} };
    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    if (!parsed.queue || typeof parsed.queue !== "object") parsed.queue = {};
    return parsed;
  } catch (error) {
    console.warn(`[QUEUE] Store read error (non-fatal): ${error.message}`);
    return { version: "1", updated_at: "", queue: {} };
  }
}

function writeQueueStore(store) {
  try {
    ensureStoreDir();
    store.updated_at = nowIso();
    fs.writeFileSync(getStorePath(), JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[QUEUE] Store write error (non-fatal): ${error.message}`);
    return false;
  }
}

function listQueueItems() {
  return Object.values(readQueueStore().queue || {}).map((item) => safeClone(item, {})).filter(Boolean);
}

function getQueueItem(queue_id) {
  try {
    if (!queue_id) return null;
    const item = readQueueStore().queue[String(queue_id)];
    return item ? safeClone(item, null) : null;
  } catch (_) {
    return null;
  }
}

function buildQueueItem(input = {}) {
  const queueId = input.queue_id || `queue_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    queue_id: queueId,
    run_id: input.run_id || null,
    job_id: input.job_id || null,
    task_type: input.task_type || "run_render_task",
    status: input.status || "queued",
    payload: safeClone(input.payload || {}, {}),
    claim: input.claim ? safeClone(input.claim, {}) : null,
    result: input.result ? safeClone(input.result, {}) : null,
    finalize_identity: input.finalize_identity || null,
    created_at: input.created_at || nowIso(),
    updated_at: nowIso(),
    metadata: safeClone(input.metadata || {}, {}),
    log_markers: Array.isArray(input.log_markers) ? [...input.log_markers] : [],
  };
}

function findActiveDuplicate(store, identity) {
  const runId = identity.run_id || null;
  const jobId = identity.job_id || null;
  return Object.values(store.queue || {}).find((item) => {
    if (!item || !ACTIVE_STATUSES.has(item.status)) return false;
    return (runId && item.run_id === runId) || (jobId && item.job_id === jobId);
  }) || null;
}

function enqueueTask(input = {}) {
  try {
    const store = readQueueStore();
    const duplicate = findActiveDuplicate(store, input);
    if (duplicate) {
      return { ok: true, duplicate: true, queue_item: safeClone(duplicate, null) };
    }

    const item = buildQueueItem(input);
    if (!item.run_id) return { ok: false, duplicate: false, queue_item: null, reason: "missing_run_id" };

    store.queue[item.queue_id] = item;
    writeQueueStore(store);
    return { ok: true, duplicate: false, queue_item: safeClone(item, null) };
  } catch (error) {
    return { ok: false, duplicate: false, queue_item: null, reason: error.message };
  }
}

function updateQueueItem(queue_id, updater) {
  try {
    if (!queue_id || typeof updater !== "function") return null;
    const store = readQueueStore();
    const current = store.queue[String(queue_id)];
    if (!current) return null;
    const next = updater(safeClone(current, {}));
    if (!next) return null;
    next.updated_at = nowIso();
    store.queue[String(queue_id)] = next;
    writeQueueStore(store);
    return safeClone(next, null);
  } catch (_) {
    return null;
  }
}

function claimTask(queue_id, worker_id, options = {}) {
  try {
    if (!queue_id || !worker_id) {
      return { ok: false, blocked: true, reason: "missing_identity", queue_item: getQueueItem(queue_id) };
    }

    const item = getQueueItem(queue_id);
    if (!item) return { ok: false, blocked: true, reason: "queue_missing", queue_item: null };
    if (TERMINAL_STATUSES.has(item.status)) return { ok: false, blocked: true, reason: "already_terminal", queue_item: item };

    if (item.claim && item.claim.worker_id === worker_id && ["claimed", "running"].includes(item.status)) {
      console.log(`[STABILITY] Duplicate claim blocked: queue_id=${queue_id}`);
      return { ok: false, blocked: true, duplicate: true, reason: "same_worker_duplicate_claim", queue_item: item };
    }

    if (item.claim && item.claim.worker_id && item.claim.worker_id !== worker_id && ["claimed", "running"].includes(item.status)) {
      console.log(`[STABILITY] Duplicate claim blocked: queue_id=${queue_id}`);
      return { ok: false, blocked: true, duplicate: true, reason: "already_claimed", queue_item: item };
    }

    const siblingConflict = listQueueItems().find((candidate) => (
      candidate &&
      candidate.queue_id !== queue_id &&
      candidate.run_id === item.run_id &&
      ["claimed", "running"].includes(candidate.status)
    ));
    if (siblingConflict) {
      console.log(`[STABILITY] Duplicate claim blocked: queue_id=${queue_id}`);
      return {
        ok: false,
        blocked: true,
        duplicate: true,
        reason: "concurrent_same_run",
        conflicting_queue_id: siblingConflict.queue_id,
        queue_item: item,
      };
    }

    const ttlMs = Number.isFinite(options.claim_ttl_ms) ? options.claim_ttl_ms : parseInt(process.env.CLAIM_TTL_MS || "60000", 10);
    const claimedAt = options.claimed_at || nowIso();
    const expiresAt = new Date(new Date(claimedAt).getTime() + ttlMs).toISOString();
    const claimed = updateQueueItem(queue_id, (current) => ({
      ...current,
      status: "claimed",
      claim: {
        worker_id,
        claimed_at: claimedAt,
        claim_expires_at: expiresAt,
      },
      metadata: {
        ...(current.metadata || {}),
        claim_count: ((current.metadata && current.metadata.claim_count) || 0) + 1,
      },
    }));

    return { ok: !!claimed, blocked: !claimed, queue_item: claimed, duplicate: false };
  } catch (error) {
    return { ok: false, blocked: true, reason: error.message, queue_item: getQueueItem(queue_id) };
  }
}

function claimNextTask(worker_id, options = {}) {
  try {
    const next = listQueueItems().find((item) => item && item.status === "queued");
    if (!next) return { ok: false, blocked: false, reason: "no_queued_items", queue_item: null };
    return claimTask(next.queue_id, worker_id, options);
  } catch (error) {
    return { ok: false, blocked: true, reason: error.message, queue_item: null };
  }
}

function markTaskRunning(queue_id, worker_id) {
  try {
    const item = getQueueItem(queue_id);
    if (!item || !item.claim || item.claim.worker_id !== worker_id) return { ok: false, queue_item: item, reason: "ownership_missing" };
    const updated = updateQueueItem(queue_id, (current) => ({ ...current, status: "running" }));
    return { ok: !!updated, queue_item: updated };
  } catch (error) {
    return { ok: false, queue_item: getQueueItem(queue_id), reason: error.message };
  }
}

function mapFinalizeStatus(result = {}) {
  if (["completed", "failed", "blocked"].includes(result.queue_status)) return result.queue_status;
  if (["completed", "failed", "blocked"].includes(result.status)) return result.status;
  if (result.operator_verdict === "DONE" || result.decision === "ALLOW") return "completed";
  if (result.operator_verdict === "REJECT") return "blocked";
  return "failed";
}

function finalizeTask(queue_id, finalize = {}) {
  try {
    const item = getQueueItem(queue_id);
    if (!item) return { ok: false, blocked: true, reason: "queue_missing", queue_item: null };

    const identity = finalize.finalize_identity ||
      [item.run_id || "run", queue_id || "queue", finalize.worker_id || "worker", finalize.result && (finalize.result.operator_verdict || finalize.result.status || finalize.result.decision || "result")].join(":");

    if (TERMINAL_STATUSES.has(item.status)) {
      if (item.finalize_identity === identity) {
        console.log(`[STABILITY] Idempotent finalize: run_id=${item.run_id} queue_id=${queue_id}`);
        return { ok: true, idempotent: true, blocked: false, queue_item: item };
      }
      return { ok: false, idempotent: false, blocked: true, reason: "already_finalized", queue_item: item };
    }

    const finalStatus = mapFinalizeStatus(finalize.result || {});
    const updated = updateQueueItem(queue_id, (current) => ({
      ...current,
      status: finalStatus,
      claim: current.claim,
      finalize_identity: identity,
      result: safeClone(finalize.result || {}, {}),
      metadata: {
        ...(current.metadata || {}),
        finalized_at: nowIso(),
        finalized_by: finalize.worker_id || null,
      },
      log_markers: [...(current.log_markers || []), finalStatus === "completed" ? "finalized_completed" : `finalized_${finalStatus}`],
    }));

    return { ok: !!updated, idempotent: false, blocked: !updated, queue_item: updated };
  } catch (error) {
    return { ok: false, blocked: true, idempotent: false, reason: error.message, queue_item: getQueueItem(queue_id) };
  }
}

function requeueTask(queue_id, reason, metadata = {}) {
  try {
    const updated = updateQueueItem(queue_id, (current) => ({
      ...current,
      status: "queued",
      claim: null,
      metadata: {
        ...(current.metadata || {}),
        requeue_reason: reason || "unknown",
        requeue_count: ((current.metadata && current.metadata.requeue_count) || 0) + 1,
        ...safeClone(metadata, {}),
      },
    }));
    return { ok: !!updated, queue_item: updated };
  } catch (error) {
    return { ok: false, queue_item: getQueueItem(queue_id), reason: error.message };
  }
}

function blockTask(queue_id, reason) {
  try {
    const updated = updateQueueItem(queue_id, (current) => ({
      ...current,
      status: "blocked",
      metadata: {
        ...(current.metadata || {}),
        blocked_reason: reason || "unknown",
      },
    }));
    return { ok: !!updated, queue_item: updated };
  } catch (error) {
    return { ok: false, queue_item: getQueueItem(queue_id), reason: error.message };
  }
}

module.exports = {
  ACTIVE_STATUSES,
  TERMINAL_STATUSES,
  readQueueStore,
  writeQueueStore,
  listQueueItems,
  getQueueItem,
  enqueueTask,
  claimTask,
  claimNextTask,
  markTaskRunning,
  finalizeTask,
  requeueTask,
  blockTask,
  updateQueueItem,
  mapFinalizeStatus,
};
