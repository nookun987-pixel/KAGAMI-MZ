"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-cost-"));
  process.env.COST_REGISTRY_PATH = path.join(root, "memory", "cost_registry.json");
  process.env.TASK_QUEUE_STORE_PATH = path.join(root, "queue", "task_queue_store.json");
  process.env.STATE_STORE_PATH = path.join(root, "state", "run_state_store.json");
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\cost\\") || key.includes("\\queue\\task_queue_") || key.includes("\\state\\run_state_authority")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    costAuthority: require("./cost_authority"),
    costTracker: require("./cost_tracker"),
    scheduler: require("../queue/task_queue_scheduler"),
    state: require("../state/run_state_authority"),
  };
}

function baseConfig(overrides = {}) {
  return {
    global_budget: 50,
    global_used: 0,
    run_budget: 2.0,
    run_used: 0,
    max_attempt_per_run: 5,
    max_retry_per_failure: 2,
    cost_per_attempt_estimate: 0.25,
    ...overrides,
  };
}

test("TEST 1: exceed run budget -> reject", async () => {
  setupEnv();
  const { scheduler } = loadModules();
  let executed = false;

  const result = await scheduler.executeQueuedRun({
    job_id: "job-run-budget",
  }, {
    worker_id: "worker-cost-1",
    cost_config: baseConfig({ run_budget: 0.2 }),
    executor: async () => {
      executed = true;
      return { operator_verdict: "DONE", decision: "ALLOW" };
    },
  });

  assert.equal(result.blocked, true);
  assert.equal(result.reason, "BUDGET_EXCEEDED");
  assert.equal(result.budget_guard.status, "REJECT");
  assert.equal(executed, false);
});

test("TEST 2: exceed global budget -> reject", async () => {
  setupEnv();
  const { scheduler, costTracker } = loadModules();
  costTracker.writeCostRegistry([
    {
      run_id: "seed-run",
      attempt: 1,
      cost: 0.3,
      cumulative_run_cost: 0.3,
      cumulative_global_cost: 0.3,
      estimated_cost: 0.25,
      flags: [],
      timestamp: new Date().toISOString(),
    },
  ]);

  const result = await scheduler.executeQueuedRun({
    job_id: "job-global-budget",
  }, {
    worker_id: "worker-cost-2",
    cost_config: baseConfig({ global_budget: 0.5 }),
    executor: async () => ({ operator_verdict: "DONE", decision: "ALLOW" }),
  });

  assert.equal(result.blocked, true);
  assert.equal(result.reason, "GLOBAL_BUDGET_EXCEEDED");
  assert.equal(result.budget_guard.status, "REJECT");
});

test("TEST 3: exceed retry limit -> stop", async () => {
  setupEnv();
  const { scheduler } = loadModules();

  const result = await scheduler.executeQueuedRun({
    job_id: "job-retry-limit",
    retry_count: 3,
  }, {
    worker_id: "worker-cost-3",
    cost_config: baseConfig({ max_retry_per_failure: 2 }),
    executor: async () => ({ operator_verdict: "DONE", decision: "ALLOW" }),
  });

  assert.equal(result.blocked, true);
  assert.equal(result.reason, "RETRY_LIMIT_REACHED");
  assert.equal(result.budget_guard.status, "STOP");
});

test("TEST 4: exceed attempt limit -> stop", async () => {
  setupEnv();
  const { scheduler } = loadModules();

  const result = await scheduler.executeQueuedRun({
    job_id: "job-attempt-limit",
    attempt: 6,
  }, {
    worker_id: "worker-cost-4",
    cost_config: baseConfig({ max_attempt_per_run: 5 }),
    executor: async () => ({ operator_verdict: "DONE", decision: "ALLOW" }),
  });

  assert.equal(result.blocked, true);
  assert.equal(result.reason, "ATTEMPT_LIMIT_REACHED");
  assert.equal(result.budget_guard.status, "STOP");
});

test("TEST 5: cost spike anomaly -> flag", async () => {
  setupEnv();
  const { scheduler, costTracker } = loadModules();

  const result = await scheduler.executeQueuedRun({
    job_id: "job-cost-anomaly",
  }, {
    worker_id: "worker-cost-5",
    cost_config: baseConfig(),
    executor: async () => ({
      operator_verdict: "DONE",
      decision: "ALLOW",
      actual_cost: 0.51,
    }),
  });

  const records = costTracker.readCostRegistry();
  assert.equal(result.ok, true);
  assert.equal(result.execution.cost_authority.flagged, true);
  assert.equal(result.execution.cost_authority.flags.includes("COST_ANOMALY"), true);
  assert.equal(records.length, 1);
  assert.equal(records[0].flags.includes("COST_ANOMALY"), true);
});

test("TEST 6: normal execution -> pass and persist record", async () => {
  setupEnv();
  const { scheduler, costTracker } = loadModules();

  const result = await scheduler.executeQueuedRun({
    job_id: "job-normal-cost",
  }, {
    worker_id: "worker-cost-6",
    cost_config: baseConfig(),
    executor: async () => ({
      operator_verdict: "DONE",
      decision: "ALLOW",
      actual_cost: 0.25,
    }),
  });

  const records = costTracker.readCostRegistry();
  assert.equal(result.ok, true);
  assert.equal(result.execution.cost_authority.flagged, false);
  assert.equal(records.length, 1);
  assert.equal(records[0].run_id, result.run_state.run_id);
  assert.equal(records[0].cost, 0.25);
  assert.equal(records[0].cumulative_run_cost, 0.25);
  assert.equal(records[0].cumulative_global_cost, 0.25);
});
