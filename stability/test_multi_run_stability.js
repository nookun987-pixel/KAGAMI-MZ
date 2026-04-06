"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function tempEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-stability-"));
  process.env.TASK_QUEUE_STORE_PATH = path.join(root, "queue", "task_queue_store.json");
  process.env.STATE_STORE_PATH = path.join(root, "state", "run_state_store.json");
  process.env.CLAIM_TTL_MS = "25";
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\queue\\task_queue_") ||
        key.includes("\\state\\run_state_authority") ||
        key.includes("\\stability\\multi_run_guard") ||
        key.includes("\\stability\\watchdog_sweeper") ||
        key.includes("\\operator\\mikage_operator_agent")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    queue: require("../queue/task_queue_authority"),
    scheduler: require("../queue/task_queue_scheduler"),
    state: require("../state/run_state_authority"),
    guard: require("./multi_run_guard"),
    sweeper: require("./watchdog_sweeper"),
    operator: require("../operator/mikage_operator_agent"),
  };
}

function captureLogs(fn) {
  const logs = [];
  const original = console.log;
  console.log = (...args) => logs.push(args.join(" "));
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      console.log = original;
    })
    .then((result) => ({ result, logs }));
}

test("two different runs execute safely", async () => {
  tempEnv();
  const { scheduler, queue, state } = loadModules();
  const executor = async ({ queue_item, run_state, worker_id }) => ({
    operator_verdict: "DONE",
    called_module: "test.executor",
    result_summary: `ok:${run_state.run_id}`,
    decision: "ALLOW",
    worker_id,
    queue_id: queue_item.queue_id,
    run_id: run_state.run_id,
  });

  const first = await scheduler.executeQueuedRun({ job_id: "job-a" }, { worker_id: "worker-a", executor });
  const second = await scheduler.executeQueuedRun({ job_id: "job-b" }, { worker_id: "worker-b", executor });

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.notEqual(first.run_state.run_id, second.run_state.run_id);
  assert.notEqual(first.queue_item.queue_id, second.queue_item.queue_id);
  assert.equal(queue.getQueueItem(first.queue_item.queue_id).run_id, first.run_state.run_id);
  assert.equal(queue.getQueueItem(second.queue_item.queue_id).run_id, second.run_state.run_id);
  assert.equal(state.getRunState(first.run_state.run_id).latest_active_queue_id, first.queue_item.queue_id);
  assert.equal(state.getRunState(second.run_state.run_id).latest_active_queue_id, second.queue_item.queue_id);
});

test("duplicate claim blocked and concurrent same-run dispatch blocked", async () => {
  tempEnv();
  const { queue, state, guard } = loadModules();
  const runState = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-dup" } });
  const first = queue.enqueueTask({ run_id: runState.run_id, job_id: "job-dup", payload: { job_id: "job-dup" } });
  const manualSecondId = "queue_manual_same_run";
  const store = queue.readQueueStore();
  store.queue[manualSecondId] = {
    queue_id: manualSecondId,
    run_id: runState.run_id,
    job_id: "job-dup-2",
    task_type: "run_render_task",
    status: "queued",
    payload: { job_id: "job-dup-2", run_id: runState.run_id },
    claim: null,
    result: null,
    finalize_identity: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {},
    log_markers: [],
  };
  queue.writeQueueStore(store);

  const claimed = queue.claimTask(first.queue_item.queue_id, "worker-1");
  const duplicateSameWorker = queue.claimTask(first.queue_item.queue_id, "worker-1");
  const duplicateOtherWorker = queue.claimTask(first.queue_item.queue_id, "worker-2");
  const concurrent = queue.claimTask(manualSecondId, "worker-2");
  const detected = guard.detectDuplicateDispatch(runState.run_id, manualSecondId);

  assert.equal(claimed.ok, true);
  assert.equal(duplicateSameWorker.blocked, true);
  assert.equal(duplicateOtherWorker.blocked, true);
  assert.equal(concurrent.blocked, true);
  assert.equal(detected.duplicate, true);
});

test("duplicate finalize becomes idempotent no-op and state history stays single-entry", async () => {
  tempEnv();
  const { scheduler, queue, state } = loadModules();
  const finalizeIdentity = "same-finalize";
  const executor = async ({ queue_item, run_state, worker_id }) => ({
    operator_verdict: "DONE",
    called_module: "test.executor",
    result_summary: "done",
    decision: "ALLOW",
    worker_id,
    queue_id: queue_item.queue_id,
    run_id: run_state.run_id,
    artifacts: {
      loop_trace: {
        decision_reason: "complete",
        patch_plan_summary: {
          source: "test",
          actions: ["noop"],
        },
      },
    },
  });

  const executed = await scheduler.executeQueuedRun({ job_id: "job-finalize" }, {
    worker_id: "worker-finalize",
    executor,
    finalize_identity: finalizeIdentity,
  });
  const repeatQueue = queue.finalizeTask(executed.queue_item.queue_id, {
    worker_id: "worker-finalize",
    finalize_identity: finalizeIdentity,
    result: executed.execution,
  });
  const repeatState = state.finalizeRunState(executed.run_state.run_id, executed.execution, {
    queue_id: executed.queue_item.queue_id,
    worker_id: "worker-finalize",
    finalize_identity: finalizeIdentity,
  });

  assert.equal(repeatQueue.idempotent, true);
  assert.equal(repeatState.idempotent, true);
  assert.equal(state.getRunState(executed.run_state.run_id).decision_history.length, 1);
  assert.equal(state.getRunState(executed.run_state.run_id).patch_history.length, 1);
});

test("stale claim recovery repairs expired claims", () => {
  tempEnv();
  const { queue, state, sweeper } = loadModules();
  const runState = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-stale" } });
  const queued = queue.enqueueTask({ run_id: runState.run_id, job_id: "job-stale", payload: { job_id: "job-stale" } });
  queue.claimTask(queued.queue_item.queue_id, "worker-stale", { claim_ttl_ms: -10, claimed_at: "2020-01-01T00:00:00.000Z" });

  const repaired = sweeper.sweepExpiredClaims("2020-01-01T00:00:01.000Z");
  const item = queue.getQueueItem(queued.queue_item.queue_id);

  assert.equal(repaired.ok, true);
  assert.equal(repaired.recovered_queue_ids.includes(queued.queue_item.queue_id), true);
  assert.equal(item.status, "queued");
  assert.equal(item.claim, null);
});

test("orphan running task repair requeues invalid running work", () => {
  tempEnv();
  const { queue, state, sweeper } = loadModules();
  const runState = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-orphan" } });
  const queued = queue.enqueueTask({ run_id: runState.run_id, job_id: "job-orphan", payload: { job_id: "job-orphan" } });
  queue.claimTask(queued.queue_item.queue_id, "worker-orphan");
  queue.markTaskRunning(queued.queue_item.queue_id, "worker-orphan");
  queue.updateQueueItem(queued.queue_item.queue_id, (item) => ({ ...item, claim: null }));

  const repaired = sweeper.repairOrphanRunningTasks();
  const item = queue.getQueueItem(queued.queue_item.queue_id);

  assert.equal(repaired.ok, true);
  assert.equal(repaired.repaired.some((entry) => entry.queue_id === queued.queue_item.queue_id), true);
  assert.equal(item.status, "queued");
});

test("queue and run mismatch detection plus dangling run repair", () => {
  tempEnv();
  const { queue, state, guard, sweeper } = loadModules();
  const runState = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-mismatch" } });
  const queued = queue.enqueueTask({ run_id: runState.run_id, job_id: "job-mismatch", payload: { job_id: "job-mismatch" } });
  state.linkQueueToRun(runState.run_id, "different-queue");
  const isolation = guard.ensureRunIsolation(state.getRunState(runState.run_id), queue.getQueueItem(queued.queue_item.queue_id));

  state.markRunStarted(runState.run_id, "missing-active-queue", "worker-x");
  const repaired = sweeper.repairDanglingRunStates();
  const updatedRun = state.getRunState(runState.run_id);

  assert.equal(isolation.blocked, true);
  assert.equal(repaired.ok, true);
  assert.equal(updatedRun.metadata.repair_needed, true);
});

test("null and empty inputs stay safe and never throw", () => {
  tempEnv();
  const { guard, sweeper, queue, state } = loadModules();
  assert.doesNotThrow(() => guard.ensureRunIsolation(null, null));
  assert.doesNotThrow(() => guard.detectDuplicateDispatch(null, null));
  assert.doesNotThrow(() => guard.validateFinalizeOwnership(null, null, null));
  assert.doesNotThrow(() => sweeper.sweepExpiredClaims());
  assert.doesNotThrow(() => sweeper.repairOrphanRunningTasks());
  assert.doesNotThrow(() => sweeper.repairDanglingRunStates());
  assert.doesNotThrow(() => queue.finalizeTask(null, {}));
  assert.doesNotThrow(() => state.finalizeRunState(null, {}, {}));
});

test("operator carries worker queue and run metadata without finalizing", async () => {
  tempEnv();
  const { operator } = loadModules();
  const result = await operator.runOperatorTask({
    task_id: "task-operator",
    task_type: "run_render_task",
    payload: {
      job_id: "job-operator",
      worker_id: "worker-operator",
      queue_id: "queue-operator",
      run_id: "run-operator",
    },
  }, {
    executor: async (payload) => ({ decision: "ALLOW", payload_seen: payload.job_id }),
  });

  assert.equal(result.operator_verdict, "DONE");
  assert.equal(result.worker_id, "worker-operator");
  assert.equal(result.queue_id, "queue-operator");
  assert.equal(result.run_id, "run-operator");
});

test("stability logs include required markers", async () => {
  tempEnv();
  const { queue, state, sweeper } = loadModules();
  const runState = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-logs" } });
  const queued = queue.enqueueTask({ run_id: runState.run_id, job_id: "job-logs", payload: { job_id: "job-logs" } });

  const { logs } = await captureLogs(async () => {
    queue.claimTask(queued.queue_item.queue_id, "worker-log");
    queue.claimTask(queued.queue_item.queue_id, "worker-log");
    queue.finalizeTask(queued.queue_item.queue_id, {
      worker_id: "worker-log",
      finalize_identity: "log-finalize",
      result: { operator_verdict: "DONE", decision: "ALLOW" },
    });
    queue.finalizeTask(queued.queue_item.queue_id, {
      worker_id: "worker-log",
      finalize_identity: "log-finalize",
      result: { operator_verdict: "DONE", decision: "ALLOW" },
    });
    const second = queue.enqueueTask({ run_id: "run-stale", job_id: "job-stale-log", payload: { job_id: "job-stale-log" } });
    queue.claimTask(second.queue_item.queue_id, "worker-stale", { claim_ttl_ms: -10, claimed_at: "2020-01-01T00:00:00.000Z" });
    sweeper.sweepExpiredClaims("2020-01-01T00:00:01.000Z");
  });

  assert.equal(logs.some((line) => line.includes("[STABILITY] Duplicate claim blocked")), true);
  assert.equal(logs.some((line) => line.includes("[STABILITY] Idempotent finalize")), true);
  assert.equal(logs.some((line) => line.includes("[STABILITY] Recovered expired claim")), true);
});
