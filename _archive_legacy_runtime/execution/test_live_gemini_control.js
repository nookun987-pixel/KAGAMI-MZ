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
      key.includes("\\canon_evolution\\canon_v2_resolver.js") ||
      key.includes("\\canon_evolution\\canon_v2_writer.js") ||
      key.includes("\\canon_evolution\\design_reference_sanitizer.js") ||
      key.includes("\\gemini_intake.js") ||
      key.includes("\\gemini_precheck.js") ||
      key.includes("\\gemini_connector.js")
    ) {
      delete require.cache[key];
    }
  }
}

function setupEnv() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-live-gemini-"));
  process.env.EXECUTION_REGISTRY_PATH = path.join(root, "memory", "execution_registry.json");
  process.env.RUNS_DIR = path.join(root, "runs");
  process.env.DRIVE_ROOT = path.join(root, "mikage_runner");
  process.env.COLAB_POLL_INTERVAL_MS = "25";
  process.env.COLAB_TIMEOUT_MS = "2000";
  process.env.MIKAGE_ENABLE_RECOVERED_CONTROL_LANE = "true";
  process.env.MIKAGE_ENABLE_LIVE_GEMINI_CONTROL = "true";
  process.env.MIKAGE_ENABLE_POSTVALIDATION = "true";
  process.env.MIKAGE_STRICT_UNKNOWN_RULES = "false";
  process.env.APPROVED_OBJECT_LIBRARY_PATH = path.join(root, "memory", "approved_object_library.json");
  process.env.CANON_MEMORY_REGISTRY_PATH = path.join(root, "runs", "canon_memory_registry.json");
  process.env.CANON_EVOLUTION_REGISTRY_PATH = path.join(root, "memory", "canon_evolution_registry.json");
  process.env.CANON_TRAIT_REGISTRY_PATH = path.join(root, "memory", "canon_trait_registry.json");
  process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH = path.join(root, "memory", "canon_trait_registry.audit.json");
  process.env.DESIGN_REFERENCE_REGISTRY_PATH = path.join(root, "memory", "design_reference_registry.json");
  process.env.DESIGN_REFERENCE_REGISTRY_CLEANED_PATH = path.join(root, "memory", "design_reference_registry.cleaned.json");
  process.env.DESIGN_REFERENCE_REGISTRY_QUARANTINE_PATH = path.join(root, "memory", "design_reference_registry.quarantine.json");
  fs.mkdirSync(path.dirname(process.env.APPROVED_OBJECT_LIBRARY_PATH), { recursive: true });
  fs.writeFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, JSON.stringify({
    version: "1.0.0",
    description: "test approved library",
    objects: [],
  }, null, 2));
  fs.writeFileSync(process.env.CANON_EVOLUTION_REGISTRY_PATH, JSON.stringify({
    version: "1.0.0",
    records: [],
  }, null, 2));
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, JSON.stringify({
    version: "2.0.0",
    records: [],
  }, null, 2));
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH, JSON.stringify({
    version: "2.0.0",
    events: [],
  }, null, 2));
  fs.writeFileSync(process.env.DESIGN_REFERENCE_REGISTRY_PATH, JSON.stringify({
    version: "1.0.0",
    references: [],
  }, null, 2));
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

function buildPassingSignals() {
  return {
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
  };
}

function stubPassingGemini() {
  stubModule("../gemini_intake", {
    runGeminiIntake: async () => ({
      creative_intent: "Controlled manufactured object render",
      subject: {
        type: "manufactured_object",
        identity: "technical ceramic mask artifact",
        must_have: ["single readable mask object", "visible contour evidence", "sealed eye region"],
        must_not_have: ["texture-only frame", "abstract-first composition", "character face", "fox ears"],
      },
      material: {
        primary: "boron carbide (B4C) technical ceramic",
        surface: "dry ceramic microtexture",
        finish: "matte black",
        forbidden_reads: ["plastic", "resin", "toy"],
      },
      composition: {
        shot_type: "MASK_MACRO",
        framing: "centered front view",
        camera: "front hero shot",
        background: "black void background",
      },
      lighting: {
        style: "controlled studio",
        constraints: ["no neon", "no magenta"],
      },
      anti_drift_rules: ["preserve one clearly readable manufactured object"],
      success_criteria: ["mask reads immediately"],
      direction_summary: "matte black technical ceramic mask, centered front view",
      connector_status: "gemini",
      gemini_executed: true,
      parse_ok: true,
    }),
  });

  stubModule("../gemini_precheck", {
    runGeminiPrecheck: () => ({
      pass: true,
      status: "PASS",
      issues: [],
      fixes: [],
      risk_level: "LOW",
      revised_intake: null,
      lane_rule_applied: "MASK_MACRO",
      lane_required_anchors: ["centered front view"],
      lane_forbidden_anchors: ["abstract-first composition"],
      lane_priority_override_applied: false,
    }),
  });

  stubModule("../gemini_connector", {
    validateGeminiRuntime: async () => ({
      ok: true,
      http_status: 200,
      error: null,
      model: "mock-gemini",
    }),
    judgeRenderedImage: async () => ({
      decision: "PASS",
      material_read: "boron carbide (B4C) technical ceramic",
      drift_flags: [],
      fail_rules: [],
      corrections: [],
      confidence: 0.95,
      raw: {
        pass_fail: "PASS",
        fail_rules: [],
        wrong_reads: [],
        correct_reads: ["boron carbide (B4C) technical ceramic", "centered front mask"],
        material_read: "boron carbide (B4C) technical ceramic",
        fix_direction: [],
        summary: "PASS",
        gemini_validation_executed: true,
        parse_ok: true,
        error: null,
      },
    }),
  });
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
        fs.unlinkSync(jobPath);
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

test("live lane writes Gemini artifacts and updates approved memory only on true PASS", async () => {
  const root = setupEnv();
  resetModuleCache();

  stubPassingGemini();
  stubModule("../analyzers/run_all_analyzers", {
    runAllAnalyzers: async () => buildPassingSignals(),
  });

  const connector = require("./execution_connector");

  for (const runId of ["RUN-GEMINI-001", "RUN-GEMINI-002"]) {
    const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
    const dispatchPromise = connector.dispatchExecution({
      run_id: runId,
      execution_target: "colab_runner",
      lane: "MASK_MACRO",
      prompt: "matte black technical ceramic mask front view",
    });
    const [, result] = await Promise.all([workerPromise, dispatchPromise]);
    assert.equal(result.normalized_result.status, "SUCCESS");
  }

  const runDir = path.join(root, "runs", "RUN-GEMINI-001");
  const finalDecision = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf8"));
  const geminiValidation = JSON.parse(fs.readFileSync(path.join(runDir, "gemini_validation.json"), "utf8"));
  const postValidation = JSON.parse(fs.readFileSync(path.join(runDir, "post_validation.json"), "utf8"));
  const approvedLibrary = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, "utf8"));
  const canonRegistry = JSON.parse(fs.readFileSync(process.env.CANON_MEMORY_REGISTRY_PATH, "utf8"));

  for (const fileName of [
    "gemini_intake.json",
    "pre_validation.json",
    "object_definition.json",
    "prompt_package.json",
    "canon_packet.json",
    "post_validation.json",
    "gemini_validation.json",
    "final_decision.json",
    "job_summary.json",
    "output.png",
  ]) {
    assert.equal(fs.existsSync(path.join(runDir, fileName)), true, `${fileName} should exist`);
  }

  assert.equal(finalDecision.decision, "ALLOW");
  assert.equal(geminiValidation.pass_fail, "PASS");
  assert.equal(postValidation.semantic_vlm_executed, false);
  assert.equal(approvedLibrary.objects.length, 1);
  assert.equal(approvedLibrary.objects[0].approved, true);
  assert.equal(finalDecision.canon_evolution_writeback, true);
  assert.equal(canonRegistry.length, 2);
});

test("live lane rejects truthfully when Gemini intake is unavailable", async () => {
  const root = setupEnv();
  resetModuleCache();

  stubModule("../gemini_intake", {
    runGeminiIntake: async () => ({
      connector_status: "fallback_local",
      gemini_executed: false,
      parse_ok: true,
      error: "GEMINI_API_KEY missing",
      direction_summary: "fallback local intake",
    }),
  });

  const connector = require("./execution_connector");
  const result = await connector.dispatchExecution({
    run_id: "RUN-GEMINI-REJECT-001",
    execution_target: "colab_runner",
    lane: "MASK_MACRO",
    prompt: "matte black technical ceramic mask",
  });

  const runDir = path.join(root, "runs", "RUN-GEMINI-REJECT-001");
  const preValidation = JSON.parse(fs.readFileSync(path.join(runDir, "pre_validation.json"), "utf8"));
  const finalDecision = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf8"));

  assert.equal(preValidation.verdict, "REJECT");
  assert.equal(finalDecision.decision, "REJECT");
  assert.match(finalDecision.decision_reason, /GEMINI_API_KEY missing|GEMINI_REQUEST_FAILED/i);
  assert.equal(fs.existsSync(path.join(process.env.DRIVE_ROOT, "job_inbox", "RUN-GEMINI-REJECT-001.json")), false);
  assert.equal(result.normalized_result.status, "FAIL");
});
