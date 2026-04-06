"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-proof-"));
  process.env.RUNS_DIR = path.join(root, "runs");
  process.env.METRICS_REGISTRY_PATH = path.join(root, "memory", "metrics_registry.json");
  process.env.PROOF_PACK_REGISTRY_PATH = path.join(root, "memory", "proof_pack_registry.json");
  process.env.TASK_QUEUE_STORE_PATH = path.join(root, "queue", "task_queue_store.json");
  process.env.STATE_STORE_PATH = path.join(root, "state", "run_state_store.json");
  process.env.COST_REGISTRY_PATH = path.join(root, "memory", "cost_registry.json");
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\artifacts\\") || key.includes("\\observability\\") || key.includes("\\queue\\task_queue_") || key.includes("\\state\\run_state_authority") || key.includes("\\cost\\")) {
      delete require.cache[key];
    }
  }
}

function loadModules() {
  clearModuleCache();
  return {
    builder: require("./run_artifact_proof_builder"),
    registry: require("./proof_pack_registry"),
    summary: require("./run_artifact_summary_writer"),
    collector: require("../observability/metrics_collector"),
    scheduler: require("../queue/task_queue_scheduler"),
    state: require("../state/run_state_authority"),
  };
}

function seedRunEnvironment(run_id, opts = {}) {
  const runDir = path.join(process.env.RUNS_DIR, run_id);
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(path.join(runDir, "final_decision.json"), JSON.stringify({ decision: opts.final_status || "ALLOW" }, null, 2));
  fs.writeFileSync(path.join(runDir, "summary.txt"), "summary");
  fs.writeFileSync(path.join(runDir, "response.json"), "{}");
  fs.writeFileSync(path.join(runDir, "request.json"), "{}");
  if (opts.image !== false) {
    fs.writeFileSync(path.join(runDir, "output.png"), "image");
  }
  return runDir;
}

test("TEST 1: completed run creates proof_pack.json", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-1", lane: "MASK_MACRO" } }, { run_id: "RUN-001" });
  seedRunEnvironment("RUN-001");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectAttemptMetric(run, { operator_verdict: "DONE", cost: 0.2 }, { attempt: 1 });
  collector.collectRunFinalize(run, { operator_verdict: "DONE", decision: "ALLOW" });
  const written = builder.writeRunArtifactProof(run, {
    operator_verdict: "DONE",
    artifacts: {
      execution: {
        transport_ok: true,
        execution_ok: true,
        artifacts: [{ type: "image", path: path.join(process.env.RUNS_DIR, "RUN-001", "output.png") }],
      },
    },
  });

  assert.equal(written.ok, true);
  assert.equal(fs.existsSync(path.join(process.env.RUNS_DIR, "RUN-001", "proof_pack.json")), true);
});

test("TEST 2: completed run creates proof_summary.md", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-2", lane: "MASK_MACRO" } }, { run_id: "RUN-002" });
  seedRunEnvironment("RUN-002");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "DONE", decision: "ALLOW" });
  builder.writeRunArtifactProof(run, {
    operator_verdict: "DONE",
    artifacts: { execution: { transport_ok: true, execution_ok: true, artifacts: [] } },
  });

  assert.equal(fs.existsSync(path.join(process.env.RUNS_DIR, "RUN-002", "proof_summary.md")), true);
});

test("TEST 3: reject run still creates truthful summary", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-3", lane: "MASK_MACRO" } }, { run_id: "RUN-003" });
  seedRunEnvironment("RUN-003", { image: false, final_status: "REJECT" });
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "REJECT", reason: "PLASTIC_MATERIAL_FAIL" });
  builder.writeRunArtifactProof(run, {
    operator_verdict: "REJECT",
    reason: "PLASTIC_MATERIAL_FAIL",
    artifacts: { execution: { transport_ok: true, execution_ok: true, artifacts: [] } },
  });
  const markdown = fs.readFileSync(path.join(process.env.RUNS_DIR, "RUN-003", "proof_summary.md"), "utf8");

  assert.equal(/Final Status: REJECT/.test(markdown), true);
  assert.equal(/PLASTIC_MATERIAL_FAIL/.test(markdown), true);
});

test("TEST 4: missing image is reported explicitly", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-4", lane: "MASK_MACRO" } }, { run_id: "RUN-004" });
  seedRunEnvironment("RUN-004", { image: false });
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "REJECT", reason: "NO_IMAGE" });
  builder.writeRunArtifactProof(run, {
    operator_verdict: "REJECT",
    reason: "NO_IMAGE",
    artifacts: { execution: { transport_ok: true, execution_ok: false, artifacts: [] } },
  });
  const markdown = fs.readFileSync(path.join(process.env.RUNS_DIR, "RUN-004", "proof_summary.md"), "utf8");

  assert.equal(/No real output image exists/.test(markdown), true);
});

test("TEST 5: artifact existence check is truthful", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-5", lane: "MASK_MACRO" } }, { run_id: "RUN-005" });
  seedRunEnvironment("RUN-005", { image: false });
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "REJECT", reason: "NO_IMAGE" });
  const written = builder.writeRunArtifactProof(run, {
    operator_verdict: "REJECT",
    reason: "NO_IMAGE",
    artifacts: {
      execution: {
        transport_ok: true,
        execution_ok: false,
        artifacts: [{ type: "image", path: path.join(process.env.RUNS_DIR, "RUN-005", "output.png") }],
      },
    },
  });
  const imageArtifact = written.proof_pack.artifacts.find((artifact) => artifact.type === "image");

  assert.equal(imageArtifact.exists, false);
});

test("TEST 6: proof bundle persists to registry", () => {
  setupEnv();
  const { builder, registry, collector, state } = loadModules();
  const run = state.createRunState({ task_type: "run_render_task", payload: { job_id: "job-proof-6", lane: "MASK_MACRO" } }, { run_id: "RUN-006" });
  seedRunEnvironment("RUN-006");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectRunFinalize(run, { operator_verdict: "DONE", decision: "ALLOW" });
  builder.writeRunArtifactProof(run, {
    operator_verdict: "DONE",
    artifacts: { execution: { transport_ok: true, execution_ok: true, artifacts: [] } },
  });
  const records = registry.readProofPackRegistry();

  assert.equal(records.length, 1);
  assert.equal(records[0].run_id, "RUN-006");
});

test("TEST 7: self-repair and canon usage appear in summary when present", () => {
  setupEnv();
  const { builder, collector, state } = loadModules();
  const run = state.createRunState({
    task_type: "run_render_task",
    payload: { job_id: "job-proof-7", lane: "MASK_MACRO" },
  }, {
    run_id: "RUN-007",
    patch_history: [{ identity: "patch-1" }],
  });
  seedRunEnvironment("RUN-007");
  collector.collectRunStart(run, { lane: "MASK_MACRO" });
  collector.collectAttemptMetric(run, {
    operator_verdict: "FAIL",
    cost: 0.2,
    artifacts: { loop_trace: { patch_plan_summary: { actions: ["tighten"] } } },
  }, {
    attempt: 1,
    canon_packet_applied: true,
  });
  collector.collectRunFinalize(run, { operator_verdict: "DONE", decision: "ALLOW" }, { canon_packet_applied: true });
  builder.writeRunArtifactProof(run, {
    operator_verdict: "DONE",
    artifacts: { execution: { transport_ok: true, execution_ok: true, artifacts: [] } },
  }, {
    canon_packet_applied: true,
  });
  const markdown = fs.readFileSync(path.join(process.env.RUNS_DIR, "RUN-007", "proof_summary.md"), "utf8");

  assert.equal(/Self-Repair Used: YES/.test(markdown), true);
  assert.equal(/Canon Packet Applied: YES/.test(markdown), true);
});

test("TEST 8: finalize hook generates proof bundle correctly", async () => {
  setupEnv();
  const { scheduler } = loadModules();
  fs.mkdirSync(path.join(process.env.RUNS_DIR, "job-proof-8"), { recursive: true });
  const execution = await scheduler.executeQueuedRun({ job_id: "job-proof-8", lane: "MASK_MACRO" }, {
    worker_id: "worker-proof",
    cost_config: {
      global_budget: 50,
      global_used: 0,
      run_budget: 2,
      run_used: 0,
      max_attempt_per_run: 5,
      max_retry_per_failure: 2,
      cost_per_attempt_estimate: 0.25,
    },
    executor: async ({ run_state }) => {
      const runDir = path.join(process.env.RUNS_DIR, run_state.run_id);
      fs.mkdirSync(runDir, { recursive: true });
      fs.writeFileSync(path.join(runDir, "final_decision.json"), JSON.stringify({ decision: "ALLOW" }, null, 2));
      fs.writeFileSync(path.join(runDir, "output.png"), "image");
      return {
        operator_verdict: "DONE",
        decision: "ALLOW",
        cost: 0.25,
        artifacts: {
          execution: {
            transport_ok: true,
            execution_ok: true,
            artifacts: [{ type: "image", path: path.join(runDir, "output.png") }],
          },
        },
      };
    },
  });

  assert.equal(execution.ok, true);
  assert.equal(fs.existsSync(path.join(process.env.RUNS_DIR, execution.run_state.run_id, "proof_pack.json")), true);
  assert.equal(fs.existsSync(path.join(process.env.RUNS_DIR, execution.run_state.run_id, "proof_summary.md")), true);
});
