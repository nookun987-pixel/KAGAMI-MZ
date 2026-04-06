"use strict";

const { enqueueTask, claimTask, finalizeTask, getQueueItem, markTaskRunning, blockTask } = require("./task_queue_authority");
const { createRunState, loadRunState, linkQueueToRun, markRunQueued, markRunStarted, finalizeRunState, getRunState, updateRunState } = require("../state/run_state_authority");
const { validateFinalizeOwnership } = require("../stability/multi_run_guard");
const { checkExecutionBudget, recordExecutionCost } = require("../cost/cost_authority");
const { collectRunStart, collectAttemptMetric, collectRunFinalize } = require("../observability/metrics_collector");
const { writeRunArtifactProof } = require("../artifacts/run_artifact_proof_builder");

function prepareQueuedRun(payload = {}, options = {}) {
  try {
    const task = {
      task_id: options.task_id || payload.job_id || payload.run_id || "run-task",
      task_type: options.task_type || "run_render_task",
      payload,
    };
    const existingRun = loadRunState(task);
    const runState = existingRun || createRunState(task, { run_id: payload.run_id || null });
    const queued = enqueueTask({
      run_id: runState.run_id,
      job_id: payload.job_id || null,
      task_type: task.task_type,
      payload: { ...payload, run_id: runState.run_id },
      metadata: { request_source: options.request_source || "server" },
    });

    if (!queued.ok || !queued.queue_item) {
      return { ok: false, duplicate: false, run_state: runState, queue_item: null, reason: queued.reason || "queue_failed" };
    }

    linkQueueToRun(runState.run_id, queued.queue_item.queue_id, {
      queue_status: queued.queue_item.status,
      duplicate: queued.duplicate,
    });
    markRunQueued(runState.run_id, queued.queue_item.queue_id);

    return {
      ok: true,
      duplicate: !!queued.duplicate,
      run_state: getRunState(runState.run_id),
      queue_item: queued.queue_item,
    };
  } catch (error) {
    return { ok: false, duplicate: false, run_state: null, queue_item: null, reason: error.message };
  }
}

async function executeQueuedRun(payload = {}, options = {}) {
  try {
    const workerId = options.worker_id || `worker_${process.pid}`;
    const prepared = options.queue_id
      ? { ok: true, duplicate: false, queue_item: getQueueItem(options.queue_id), run_state: getRunState(payload.run_id || (getQueueItem(options.queue_id) || {}).run_id) }
      : prepareQueuedRun(payload, options);

    if (!prepared.ok || !prepared.queue_item) {
      return { ok: false, blocked: true, reason: prepared.reason || "prepare_failed", prepared };
    }

    collectRunStart(prepared.run_state, payload);

    if (prepared.duplicate && prepared.queue_item && ["claimed", "running"].includes(prepared.queue_item.status)) {
      return { ok: true, duplicate: true, blocked: true, queue_item: prepared.queue_item, run_state: prepared.run_state };
    }

    const queueId = prepared.queue_item.queue_id;
    const runId = prepared.queue_item.run_id;
    const costGuard = checkExecutionBudget(prepared.run_state, {
      config: options.cost_config || payload.cost_config,
      estimated_cost: options.estimated_cost ?? payload.estimated_cost,
      attempt: options.attempt ?? payload.attempt ?? payload.attempt_count,
      retry_count: options.retry_count ?? payload.retry_count,
    });
    if (!costGuard.allowed) {
      const blockedQueue = blockTask(queueId, costGuard.reason);
      const currentRun = getRunState(runId) || prepared.run_state;
      const blockedRun = updateRunState(runId, {
        status: "blocked",
        metadata: {
          ...(currentRun && currentRun.metadata || {}),
          cost_guard: costGuard,
        },
      });
      collectRunFinalize(blockedRun || prepared.run_state, {
        operator_verdict: "REJECT",
        reason: costGuard.reason,
      }, {
        retry_count: costGuard.retry_count,
      });
      return {
        ok: false,
        blocked: true,
        reason: costGuard.reason,
        budget_guard: costGuard,
        queue_item: blockedQueue.queue_item || prepared.queue_item,
        run_state: blockedRun || prepared.run_state,
      };
    }

    const claimed = claimTask(queueId, workerId, options);
    if (!claimed.ok || !claimed.queue_item) {
      return { ok: false, blocked: true, duplicate: !!claimed.duplicate, reason: claimed.reason || "claim_failed", queue_item: claimed.queue_item, run_state: prepared.run_state };
    }

    markTaskRunning(queueId, workerId);
    markRunStarted(runId, queueId, workerId);

    const executor = options.executor;
    const execution = executor
      ? await executor({
        queue_item: getQueueItem(queueId),
        run_state: getRunState(runId),
        worker_id: workerId,
      })
      : {
        operator_verdict: "FAIL",
        called_module: "task_queue_scheduler",
        result_summary: "No executor configured",
        error: "missing_executor",
      };

    const normalizedResult = {
      ...(execution || {}),
      queue_id: queueId,
      run_id: runId,
      worker_id: workerId,
    };
    const costRecord = recordExecutionCost(getRunState(runId) || prepared.run_state, {
      config: options.cost_config || payload.cost_config,
      estimated_cost: costGuard.estimated_cost,
      actual_cost: options.actual_cost ?? normalizedResult.actual_cost ?? normalizedResult.cost,
      attempt: costGuard.attempt,
    });
    normalizedResult.cost_authority = costRecord;
    normalizedResult.artifacts = {
      ...(normalizedResult.artifacts || {}),
      cost_authority: costRecord,
    };

    const latestBeforeFinalize = getRunState(runId) || prepared.run_state;
    updateRunState(runId, {
      metadata: {
        ...(latestBeforeFinalize && latestBeforeFinalize.metadata || {}),
        cost_guard: costGuard,
        cost_record: costRecord.entry,
        cost_flags: costRecord.flags,
      },
    });
    collectAttemptMetric(getRunState(runId) || prepared.run_state, normalizedResult, {
      attempt: costGuard.attempt,
      retry_count: costGuard.retry_count,
      canon_packet_applied: !!(normalizedResult.artifacts && normalizedResult.artifacts.summary && normalizedResult.artifacts.summary.generalized_canon_packet),
    });

    const finalizeIdentity = options.finalize_identity ||
      [runId, queueId, workerId, normalizedResult.operator_verdict || normalizedResult.status || normalizedResult.decision || "unknown"].join(":");
    const ownership = validateFinalizeOwnership(runId, queueId, workerId);
    if (!ownership.allowed) {
      return { ok: false, blocked: true, reason: ownership.reasons.join(","), queue_item: getQueueItem(queueId), run_state: getRunState(runId) };
    }

    const queueFinal = finalizeTask(queueId, {
      worker_id: workerId,
      result: normalizedResult,
      finalize_identity: finalizeIdentity,
    });
    const stateFinal = finalizeRunState(runId, normalizedResult, {
      queue_id: queueId,
      worker_id: workerId,
      finalize_identity: finalizeIdentity,
    });
    collectRunFinalize(stateFinal.run_state || getRunState(runId) || prepared.run_state, normalizedResult, {
      retry_count: costGuard.retry_count,
      canon_packet_applied: !!(normalizedResult.artifacts && normalizedResult.artifacts.summary && normalizedResult.artifacts.summary.generalized_canon_packet),
    });
    writeRunArtifactProof(stateFinal.run_state || getRunState(runId) || prepared.run_state, normalizedResult, {
      canon_packet_applied: !!(normalizedResult.artifacts && normalizedResult.artifacts.summary && normalizedResult.artifacts.summary.generalized_canon_packet),
    });

    return {
      ok: queueFinal.ok && !!stateFinal.ok,
      duplicate: false,
      queue_item: queueFinal.queue_item,
      run_state: stateFinal.run_state,
      execution: normalizedResult,
      queue_finalize: queueFinal,
      state_finalize: stateFinal,
    };
  } catch (error) {
    return { ok: false, blocked: true, reason: error.message, queue_item: null, run_state: null };
  }
}

module.exports = {
  prepareQueuedRun,
  executeQueuedRun,
};
