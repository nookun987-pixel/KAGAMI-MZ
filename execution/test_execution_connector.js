"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-execution-"));
  process.env.EXECUTION_REGISTRY_PATH = path.join(root, "memory", "execution_registry.json");
  process.env.RUNS_DIR = path.join(root, "runs");
  process.env.DRIVE_ROOT = path.join(root, "mikage_runner");
  process.env.COLAB_POLL_INTERVAL_MS = "50";
  process.env.COLAB_TIMEOUT_MS = "2000";
  process.env.MIKAGE_ENABLE_RECOVERED_CONTROL_LANE = "false";
  process.env.MIKAGE_ENABLE_LIVE_GEMINI_CONTROL = "false";
  process.env.MIKAGE_ENABLE_POSTVALIDATION = "false";
  process.env.MIKAGE_STRICT_UNKNOWN_RULES = "false";
  return root;
}

function clearModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (
      key.includes("\\execution\\") ||
      key.includes("\\operator\\mikage_operator_agent") ||
      key.includes("\\renderers\\colab_runner_adapter") ||
      key.includes("\\renderers\\google_lane_adapter") ||
      key.endsWith("\\orchestrator.js")
    ) {
      delete require.cache[key];
    }
  }
}

function stubModule(relativePath, exportsValue) {
  const resolved = require.resolve(relativePath);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: exportsValue,
  };
}

function loadModules() {
  return {
    builder: require("./execution_packet_builder"),
    normalizer: require("./execution_result_normalizer"),
    connector: require("./execution_connector"),
    operator: require("../operator/mikage_operator_agent"),
  };
}

function waitForFile(filePath, timeoutMs = 2000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (fs.existsSync(filePath)) {
        clearInterval(interval);
        resolve(filePath);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        clearInterval(interval);
        reject(new Error(`Timed out waiting for ${filePath}`));
      }
    }, 25);
  });
}

function simulateColabWorker(sharedRoot) {
  const inboxDir = path.join(sharedRoot, "job_inbox");
  const outputsDir = path.join(sharedRoot, "outputs");
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      try {
        if (!fs.existsSync(inboxDir)) {
          if (Date.now() - startedAt >= 2000) {
            clearInterval(interval);
            reject(new Error(`Timed out waiting for inbox ${inboxDir}`));
          }
          return;
        }

        const jobFiles = fs.readdirSync(inboxDir).filter((name) => name.endsWith(".json"));
        if (jobFiles.length === 0) {
          if (Date.now() - startedAt >= 2000) {
            clearInterval(interval);
            reject(new Error(`Timed out waiting for job file in ${inboxDir}`));
          }
          return;
        }

        clearInterval(interval);
        const jobPath = path.join(inboxDir, jobFiles[0]);
        const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
        const outputDir = path.join(outputsDir, job.job_id);
        fs.mkdirSync(outputDir, { recursive: true });
        const imagePath = path.join(outputDir, "output.png");
        const resultPath = path.join(outputDir, "result.json");

        console.log(`COLAB_PICKED_UP ${job.job_id}`);
        fs.writeFileSync(imagePath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ioAAAAASUVORK5CYII=", "base64"));
        fs.writeFileSync(resultPath, JSON.stringify({
          status: "SUCCESS",
          output_file_path: imagePath,
        }, null, 2), "utf8");
        console.log(`COLAB_RESULT_WRITTEN /content/drive/MyDrive/mikage_runner/outputs/${job.job_id}/result.json`);

        resolve({ job, jobPath, resultPath, imagePath });
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 25);
  });
}

test("TEST 1: local/default target still uses existing local/orchestrator path", async () => {
  setupEnv();
  clearModuleCache();
  let called = 0;
  stubModule("../orchestrator", {
    orchestrate: async (job) => {
      called += 1;
      return {
        status: "DONE",
        output_file_path: `D:\\KAGAMI-MZ\\runs\\${job.run_id}\\output.png`,
      };
    },
  });

  const { connector } = loadModules();
  const result = await connector.dispatchExecution({
    run_id: "RUN-LOCAL-001",
    execution_target: "orchestrator_local",
    prompt: "x",
  });

  assert.equal(called, 1);
  assert.equal(result.packet.target, "orchestrator_local");
  assert.equal(result.normalized_result.status, "SUCCESS");
});

test("TEST 2: cloud/colab target dispatches to cloud/colab backend path", async () => {
  const root = setupEnv();
  clearModuleCache();
  const workerPromise = simulateColabWorker(process.env.DRIVE_ROOT);
  const { connector } = loadModules();
  const dispatchPromise = connector.dispatchExecution({
    run_id: "RUN-COLAB-001",
    execution_target: "colab_imagen",
    prompt: "compiled prompt/spec",
  });
  const [worker, result] = await Promise.all([workerPromise, dispatchPromise]);

  assert.equal(worker.job.job_id, "RUN-COLAB-001");
  assert.equal(worker.job.lane, "unknown");
  assert.equal(worker.job.idea, "compiled prompt/spec");
  assert.equal(result.packet.target, "colab_imagen");
  assert.equal(result.normalized_result.status, "SUCCESS");
  assert.equal(result.normalized_result.target, "colab_imagen");
  assert.equal(result.normalized_result.artifacts[0].path, path.join(root, "runs", "RUN-COLAB-001", "output.png"));
});

test("TEST 3: request-driven execution_target survives end-to-end and changes actual backend selection", async () => {
  setupEnv();
  clearModuleCache();
  let localCalled = 0;

  stubModule("../orchestrator", {
    orchestrate: async () => {
      localCalled += 1;
      return {
        status: "DONE",
        output_file_path: "D:\\KAGAMI-MZ\\runs\\RUN-LOCAL\\output.png",
      };
    },
  });

  const workerPromise = simulateColabWorker(process.env.DRIVE_ROOT);
  const { operator } = loadModules();
  const executionPromise = operator.runOperatorTask({
    task_id: "task-exec-live",
    task_type: "run_render_task",
    payload: {
      job_id: "job-exec-live",
      run_id: "RUN-OP-001",
      queue_id: "QUEUE-OP-001",
      worker_id: "WORKER-OP-001",
      shot_type: "MASK_MACRO",
      execution_target: "colab_runner",
      prompt: "compiled prompt/spec",
      negative_prompt: "compiled negatives",
    },
  });
  const [worker, result] = await Promise.all([workerPromise, executionPromise]);

  assert.equal(worker.job.job_id, "job-exec-live");
  assert.equal(localCalled, 0);
  assert.equal(result.operator_verdict, "DONE");
  assert.equal(result.artifacts.execution.status, "SUCCESS");
  assert.equal(result.artifacts.execution.target, "colab_runner");
});

test("TEST 4: unknown target returns a truthful structured failure", async () => {
  setupEnv();
  clearModuleCache();
  const { connector } = loadModules();
  const result = await connector.dispatchExecution({
    run_id: "RUN-UNKNOWN-001",
    execution_target: "moon_backend",
    prompt: "x",
  });

  assert.equal(result.normalized_result.status, "FAIL");
  assert.equal(result.normalized_result.error_type, "EXECUTION_FAILURE");
  assert.match(result.normalized_result.error_reason, /unsupported execution target/i);
});

test("TEST 5: existing success/failure normalization still works after dispatch patch", async () => {
  setupEnv();
  clearModuleCache();
  const { connector, normalizer } = loadModules();

  const malformed = normalizer.normalizeExecutionResponse(
    { status: "DONE" },
    { run_id: "RUN-NORM-001", attempt: 2, target: "colab_imagen" }
  );
  assert.equal(malformed.error_type, "MALFORMED_RESPONSE");

  const result = await connector.dispatchExecution({
    run_id: "RUN-NORM-002",
    prompt: "x",
  }, {
    backend: async () => ({ status: "FAIL", error: "backend returned failed status" }),
  });

  assert.equal(result.normalized_result.error_type, "EXECUTION_FAILURE");
  assert.equal(result.normalized_result.transport_ok, true);
});

test("TEST 6: execution result persists to registry with target truthfully", async () => {
  setupEnv();
  clearModuleCache();
  const workerPromise = simulateColabWorker(process.env.DRIVE_ROOT);
  const { connector } = loadModules();
  await Promise.all([
    workerPromise,
    connector.dispatchExecution({
    run_id: "RUN-REG-001",
    attempt: 4,
    execution_target: "colab_imagen",
    prompt: "x",
    }),
  ]);

  const registry = connector.readExecutionRegistry();
  assert.equal(registry.length, 1);
  assert.equal(registry[0].run_id, "RUN-REG-001");
  assert.equal(registry[0].attempt, 4);
  assert.equal(registry[0].target, "colab_imagen");
  assert.equal(registry[0].normalized_result.status, "SUCCESS");
});
