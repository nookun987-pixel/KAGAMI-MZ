"use strict";

const { listQueueItems, requeueTask, blockTask } = require("../queue/task_queue_authority");
const { listRunStates, updateRunState, markRunRepairNeeded } = require("../state/run_state_authority");

function sweepExpiredClaims(now = new Date().toISOString()) {
  try {
    const nowMs = new Date(now).getTime();
    const recovered = [];

    for (const item of listQueueItems()) {
      const claim = item && item.claim;
      const expiresAt = claim && claim.claim_expires_at;
      if (!expiresAt) continue;
      if (!["claimed", "running"].includes(item.status)) continue;
      if (new Date(expiresAt).getTime() > nowMs) continue;

      const repair = requeueTask(item.queue_id, "expired_claim", { recovered_at: now });
      if (repair.ok) {
        console.log(`[STABILITY] Recovered expired claim: queue_id=${item.queue_id}`);
        recovered.push(repair.queue_item.queue_id);
      }
    }

    return { ok: true, recovered_queue_ids: recovered };
  } catch (error) {
    return { ok: false, recovered_queue_ids: [], error: error.message };
  }
}

function repairOrphanRunningTasks() {
  try {
    const repaired = [];

    for (const item of listQueueItems()) {
      const hasValidClaim = !!(item && item.claim && item.claim.worker_id && item.claim.claimed_at);
      if (item.status !== "running") continue;

      if (!hasValidClaim) {
        const repair = requeueTask(item.queue_id, "orphan_running_task", { repair: "missing_claim" });
        if (repair.ok) {
          repaired.push({ queue_id: item.queue_id, action: "requeued" });
          continue;
        }

        const blocked = blockTask(item.queue_id, "orphan_running_task");
        repaired.push({ queue_id: item.queue_id, action: blocked.ok ? "blocked" : "noop" });
      }
    }

    return { ok: true, repaired };
  } catch (error) {
    return { ok: false, repaired: [], error: error.message };
  }
}

function repairDanglingRunStates() {
  try {
    const queueItems = listQueueItems();
    const activeQueueIds = new Set(queueItems
      .filter((item) => item && ["queued", "claimed", "running"].includes(item.status))
      .map((item) => item.queue_id));
    const repaired = [];

    for (const runState of listRunStates()) {
      if (!runState || runState.status !== "running") continue;
      if (runState.latest_active_queue_id && activeQueueIds.has(runState.latest_active_queue_id)) continue;

      const updated = markRunRepairNeeded(runState.run_id, {
        reason: "dangling_running_state",
        latest_active_queue_id: runState.latest_active_queue_id || null,
      });
      if (updated) {
        repaired.push(runState.run_id);
      } else {
        updateRunState(runState.run_id, {
          metadata: {
            ...(runState.metadata || {}),
            repair_needed: true,
            repair_reason: "dangling_running_state",
          },
        });
        repaired.push(runState.run_id);
      }
    }

    return { ok: true, repaired_run_ids: repaired };
  } catch (error) {
    return { ok: false, repaired_run_ids: [], error: error.message };
  }
}

module.exports = {
  sweepExpiredClaims,
  repairOrphanRunningTasks,
  repairDanglingRunStates,
};
