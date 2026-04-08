"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

function resetModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (
      key.includes("\\execution\\execution_connector.js") ||
      key.includes("\\renderers\\colab_runner_adapter.js") ||
      key.includes("\\analyzers\\run_all_analyzers.js") ||
      key.includes("\\validators\\mikage_rule_engine.js")
    ) {
      delete require.cache[key];
    }
  }
}

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-live-control-"));
  process.env.EXECUTION_REGISTRY_PATH = path.join(root, "memory", "execution_registry.json");
  process.env.RUNS_DIR = path.join(root, "runs");
  process.env.DRIVE_ROOT = path.join(root, "mikage_runner");
  process.env.COLAB_POLL_INTERVAL_MS = "25";
  process.env.COLAB_TIMEOUT_MS = "2000";
  process.env.MIKAGE_ENABLE_RECOVERED_CONTROL_LANE = "true";
  process.env.MIKAGE_ENABLE_LIVE_GEMINI_CONTROL = "false";
  process.env.MIKAGE_ENABLE_POSTVALIDATION = "true";
  process.env.MIKAGE_STRICT_UNKNOWN_RULES = "false";
  return root;
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

function simulateWorker(sharedRoot) {
  const inboxDir = path.join(sharedRoot, "job_inbox");
  const claimsDir = path.join(sharedRoot, "claims");
  const outputsDir = path.join(sharedRoot, "outputs");
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      try {
        if (!fs.existsSync(inboxDir)) {
          if (Date.now() - startedAt > 2000) throw new Error("inbox timeout");
          return;
        }
        const files = fs.readdirSync(inboxDir).filter((name) => name.endsWith(".json"));
        if (!files.length) {
          if (Date.now() - startedAt > 2000) throw new Error("job timeout");
          return;
        }
        clearInterval(interval);
        const jobPath = path.join(inboxDir, files[0]);
        const job = JSON.parse(fs.readFileSync(jobPath, "utf8"));
        fs.mkdirSync(claimsDir, { recursive: true });
        fs.writeFileSync(path.join(claimsDir, `${job.job_id}.json`), JSON.stringify({
          job_id: job.job_id,
          claimed_at: new Date().toISOString(),
          worker_id: "colab-proof",
        }, null, 2), "utf8");
        const outputDir = path.join(outputsDir, job.job_id);
        fs.mkdirSync(outputDir, { recursive: true });
        const imagePath = path.join(outputDir, "output.png");
        fs.writeFileSync(imagePath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ioAAAAASUVORK5CYII=", "base64"));
        fs.writeFileSync(path.join(outputDir, "result.json"), JSON.stringify({
          job_id: job.job_id,
          status: "SUCCESS",
          output_file_path: imagePath,
        }, null, 2), "utf8");
        resolve(job);
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 25);
  });
}

test("recovered control lane writes object definition before live colab dispatch", async () => {
  const root = setupEnv();
  resetModuleCache();

  stubModule("../analyzers/run_all_analyzers", {
    runAllAnalyzers: async () => ({
      bounding_box_width_percentage: 40,
      distorted_pixel_ratio: 0,
      pixel_displacement: 0,
      rgb_glitch_count: 0,
      mesh_deformation_delta: 0,
      boundary_intersection: 0,
      edge_blur_radius: 0,
      pixel_bleed_percentage: 0,
      high_frequency_pixel_density_delta: 1,
      edge_halo_detection: 0,
      z_blue_delta_e: 0,
      z_blue_color_shift_detected: 0,
      saliency_peak_zone: "product_safe_zone",
      rgb_chromatic_split_noise: 0,
      vhs_noise_pattern: 0,
      line_angle_deviation: 0,
      grid_snap_variance: 0,
      exposure_value_delta: 0,
      histogram_clipping: 0,
      geometry_symmetry_ratio: 100,
      line_curvature_degree: 0,
      ornament_bounding_box: 0,
      recognition_time_seconds: 0.5,
      primary_subject_confidence: 1,
      thumbnail_subject_retention: 1,
      thumbnail_saliency_rank: "subject",
      _vlm_status: "unavailable",
      _analyzer_status: {},
    }),
  });

  const { connector } = { connector: require("./execution_connector") };
  const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
  const dispatchPromise = connector.dispatchExecution({
    run_id: "RUN-SALVAGE-001",
    execution_target: "colab_runner",
    lane: "MASK_MACRO",
    prompt: "a symmetrical japanese kitsune porcelain mask, matte ceramic, fox-shaped",
  });
  const [job, result] = await Promise.all([workerPromise, dispatchPromise]);

  const runDir = path.join(root, "runs", "RUN-SALVAGE-001");
  const objectDefinition = JSON.parse(fs.readFileSync(path.join(runDir, "object_definition.json"), "utf8"));
  const promptPackage = JSON.parse(fs.readFileSync(path.join(runDir, "prompt_package.json"), "utf8"));
  const postValidation = JSON.parse(fs.readFileSync(path.join(runDir, "post_validation.json"), "utf8"));

  assert.equal(job.job_id, "RUN-SALVAGE-001");
  assert.equal(objectDefinition.verdict, "PASS");
  assert.equal(promptPackage.object_definition_applied, true);
  assert.match(promptPackage.structured_prompt, /kitsune|fox|ceramic/i);
  assert.equal(postValidation.validator_executed, true);
  assert.equal(result.normalized_result.status, "SUCCESS");
});

test("recovered control lane rejects abstract prompt before render dispatch", async () => {
  const root = setupEnv();
  resetModuleCache();
  const connector = require("./execution_connector");
  const result = await connector.dispatchExecution({
    run_id: "RUN-SALVAGE-REJECT-001",
    execution_target: "colab_runner",
    lane: "MASK_MACRO",
    prompt: "abstract texture gradient mood",
  });

  const runDir = path.join(root, "runs", "RUN-SALVAGE-REJECT-001");
  const objectDefinition = JSON.parse(fs.readFileSync(path.join(runDir, "object_definition.json"), "utf8"));

  assert.equal(objectDefinition.ok, false);
  assert.match(objectDefinition.verdict, /REJECT/);
  assert.equal(result.normalized_result.status, "FAIL");
  assert.match(result.normalized_result.error_reason, /abstract_reject|texture-only|concrete designed object/i);
  assert.equal(fs.existsSync(path.join(process.env.DRIVE_ROOT, "job_inbox", "RUN-SALVAGE-REJECT-001.json")), false);
});
