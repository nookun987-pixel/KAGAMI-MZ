"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-observe-"));
  process.env.METRICS_REGISTRY_PATH = path.join(root, "memory", "metrics_registry.json");
  process.env.TASK_QUEUE_STORE_PATH = path.join(root, "queue", "task_queue_store.json");
  process.env.STATE_STORE_PATH = path.join(root, "state", "run_state_store.json");
  process.env.COST_REGISTRY_PATH = path.join(root, "memory", "cost_registry.json");
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\observability\\") || key.includes("\\queue\\task_queue_") || key.includes("\\state\\run_state_authority") || key.includes("\\cost\\")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    registry: require("./run_metrics_registry"),
    collector: require("./metrics_collector"),
    summary: require("./system_summary_builder"),
    scheduler: require("../queue/task_queue_scheduler"),
    state: require("../state/run_state_authority"),
  };
}

function makeRun(state, job_id, lane = "MASK_MACRO") {
  return state.createRunState({
    task_type: "run_render_task",
    payload: { job_id, lane },
  });
}

test("TEST 1: run start creates metrics record", () => {
  setupEnv();
  const { collector, registry, state } = loadModules();
  const run = makeRun(state, "job-start");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  const stored = registry.getRunMetrics(run.run_id);

  assert.equal(!!stored, true);
  assert.equal(stored.run_id, run.run_id);
  assert.equal(stored.lane, "MASK_MACRO");
});

test("TEST 2: attempt metrics persist correctly", () => {
  setupEnv();
  const { collector, registry, state } = loadModules();
  const run = makeRun(state, "job-attempt");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectAttemptMetric(run, { operator_verdict: "FAIL", reason: "ABSTRACT_TEXTURE_ONLY", cost: 0.26 }, { attempt: 2, retry_count: 1 });
  const attempts = registry.listAttemptMetrics();

  assert.equal(attempts.length, 1);
  assert.equal(attempts[0].attempt, 2);
  assert.equal(attempts[0].reason, "ABSTRACT_TEXTURE_ONLY");
  assert.equal(attempts[0].cost, 0.26);
});

test("TEST 3: finalize updates final status/reason", () => {
  setupEnv();
  const { collector, registry, state } = loadModules();
  const run = makeRun(state, "job-finalize");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "REJECT", reason: "PLASTIC_MATERIAL_FAIL" });
  const stored = registry.getRunMetrics(run.run_id);

  assert.equal(stored.final_status, "REJECT");
  assert.equal(stored.final_reason, "PLASTIC_MATERIAL_FAIL");
});

test("TEST 4: retry count aggregates correctly", () => {
  setupEnv();
  const { collector, registry, state } = loadModules();
  const run = makeRun(state, "job-retry");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectAttemptMetric(run, { operator_verdict: "FAIL", reason: "A", cost: 0.1 }, { attempt: 1, retry_count: 1 });
  collector.collectAttemptMetric(run, { operator_verdict: "FAIL", reason: "B", cost: 0.1 }, { attempt: 2, retry_count: 2 });
  collector.collectRunFinalize(run, { operator_verdict: "REJECT", reason: "B" }, { retry_count: 2 });
  const stored = registry.getRunMetrics(run.run_id);

  assert.equal(stored.retry_count, 2);
  assert.equal(stored.attempts, 2);
});

test("TEST 5: cost totals aggregate correctly", () => {
  setupEnv();
  const { collector, summary, state } = loadModules();
  const run = makeRun(state, "job-cost");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectAttemptMetric(run, { operator_verdict: "FAIL", reason: "A", cost: 0.25 }, { attempt: 1 });
  collector.collectAttemptMetric(run, { operator_verdict: "DONE", decision: "ALLOW", cost: 0.53 }, { attempt: 2 });
  collector.collectRunFinalize(run, { operator_verdict: "DONE", decision: "ALLOW" });
  const built = summary.buildSystemSummary();

  assert.equal(built.total_cost, 0.78);
});

test("TEST 6: top reject reasons summarize correctly", () => {
  setupEnv();
  const { collector, summary, state } = loadModules();
  const runA = makeRun(state, "job-reject-a");
  const runB = makeRun(state, "job-reject-b");
  collector.collectRunStart(runA, { lane: "MASK_MACRO" });
  collector.collectRunStart(runB, { lane: "WEAPON_MACRO" });
  collector.collectRunFinalize(runA, { operator_verdict: "REJECT", reason: "PLASTIC_MATERIAL_FAIL" });
  collector.collectRunFinalize(runB, { operator_verdict: "REJECT", reason: "PLASTIC_MATERIAL_FAIL" });
  const built = summary.buildSystemSummary();

  assert.equal(built.top_reject_reasons[0], "PLASTIC_MATERIAL_FAIL");
});

test("TEST 7: lane breakdown summarizes correctly", () => {
  setupEnv();
  const { collector, summary, state } = loadModules();
  const runA = makeRun(state, "job-lane-a", "MASK_MACRO");
  const runB = makeRun(state, "job-lane-b", "MASK_MACRO");
  const runC = makeRun(state, "job-lane-c", "WEAPON_MACRO");
  collector.collectRunStart(runA, { lane: "MASK_MACRO" });
  collector.collectRunStart(runB, { lane: "MASK_MACRO" });
  collector.collectRunStart(runC, { lane: "WEAPON_MACRO" });
  collector.collectRunFinalize(runA, { operator_verdict: "DONE", decision: "ALLOW" });
  collector.collectRunFinalize(runB, { operator_verdict: "REJECT", reason: "X" });
  collector.collectRunFinalize(runC, { operator_verdict: "REJECT", reason: "Y" });
  const built = summary.buildSystemSummary();

  assert.equal(built.lane_breakdown.MASK_MACRO.runs, 2);
  assert.equal(built.lane_breakdown.MASK_MACRO.allow_rate, 0.5);
});

test("TEST 8: missing optional canon fields do not break metrics", () => {
  setupEnv();
  const { collector, registry, state } = loadModules();
  const run = makeRun(state, "job-optional");
  collector.collectRunStart(run, {});
  collector.collectAttemptMetric(run, { operator_verdict: "FAIL", cost: 0.11 }, { attempt: 1 });
  collector.collectRunFinalize(run, { operator_verdict: "FAIL" });
  const stored = registry.getRunMetrics(run.run_id);

  assert.equal(!!stored, true);
  assert.equal(stored.canon_packet_applied, false);
});

test("TEST 9: system summary builds from stored registry truthfully", async () => {
  setupEnv();
  const { scheduler, summary, registry } = loadModules();
  const execution = await scheduler.executeQueuedRun({ job_id: "job-scheduler", lane: "MASK_MACRO" }, {
    worker_id: "worker-observe",
    cost_config: {
      global_budget: 50,
      global_used: 0,
      run_budget: 2,
      run_used: 0,
      max_attempt_per_run: 5,
      max_retry_per_failure: 2,
      cost_per_attempt_estimate: 0.25,
    },
    executor: async () => ({
      operator_verdict: "DONE",
      decision: "ALLOW",
      cost: 0.25,
      artifacts: {},
    }),
  });
  const built = summary.buildSystemSummary(registry.readMetricsRegistry());

  assert.equal(execution.ok, true);
  assert.equal(built.total_runs, 1);
  assert.equal(built.status_counts.ALLOW, 1);
  assert.equal(built.total_cost, 0.25);
  assert.equal(built.average_attempts_per_run, 1);
});
