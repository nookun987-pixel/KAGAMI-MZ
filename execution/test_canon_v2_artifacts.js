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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-canon-v2-artifacts-"));
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
  process.env.CANON_TRAIT_REGISTRY_PATH = path.join(root, "memory", "canon_trait_registry.json");
  process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH = path.join(root, "memory", "canon_trait_registry.audit.json");
  process.env.DESIGN_REFERENCE_REGISTRY_PATH = path.join(root, "memory", "design_reference_registry.json");
  process.env.DESIGN_REFERENCE_REGISTRY_CLEANED_PATH = path.join(root, "memory", "design_reference_registry.cleaned.json");
  process.env.DESIGN_REFERENCE_REGISTRY_QUARANTINE_PATH = path.join(root, "memory", "design_reference_registry.quarantine.json");
  fs.mkdirSync(path.join(root, "memory"), { recursive: true });
  fs.writeFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, JSON.stringify({ version: "1.0.0", objects: [] }, null, 2));
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, JSON.stringify({ version: "2.0.0", records: [] }, null, 2));
  fs.writeFileSync(process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH, JSON.stringify({ version: "2.0.0", events: [] }, null, 2));
  fs.writeFileSync(process.env.DESIGN_REFERENCE_REGISTRY_PATH, JSON.stringify({
    version: "1.0.0",
    references: [
      { ref_id: "kitsune_noh_mask", object_class: "mask", canonical_name: "Kitsune Fox Mask", key_features: ["fox ears"] }
    ],
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

function stubPassingGemini() {
  stubModule("../gemini_intake", {
    runGeminiIntake: async () => ({
      creative_intent: "Controlled manufactured object render",
      subject: { identity: "technical ceramic mask artifact", must_have: ["sealed eye region"], must_not_have: ["human face"] },
      material: { primary: "boron carbide (B4C) technical ceramic", surface: "micro-pitted technical ceramic", finish: "matte black", forbidden_reads: ["plastic"] },
      composition: { shot_type: "MASK_MACRO", framing: "centered front view", camera: "artifact shot", background: "black void background" },
      lighting: { style: "controlled studio", constraints: ["no neon"] },
      anti_drift_rules: ["manufactured object only"],
      success_criteria: ["mask reads immediately"],
      direction_summary: "matte black technical ceramic mask, centered front view",
      connector_status: "gemini",
      gemini_executed: true,
      parse_ok: true,
    }),
  });
  stubModule("../gemini_precheck", {
    runGeminiPrecheck: () => ({ pass: true, status: "PASS", issues: [], fixes: [], risk_level: "LOW" }),
  });
  stubModule("../gemini_connector", {
    validateGeminiRuntime: async () => ({ ok: true, http_status: 200, error: null, model: "mock-gemini" }),
    judgeRenderedImage: async () => ({
      decision: "PASS",
      raw: {
        pass_fail: "PASS",
        fail_rules: [],
        wrong_reads: [],
        correct_reads: ["technical ceramic", "mask artifact"],
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
        fs.writeFileSync(path.join(claimsDir, `${job.job_id}.json`), JSON.stringify({ job_id: job.job_id }, null, 2));
        const outputDir = path.join(outputsDir, job.job_id);
        fs.mkdirSync(outputDir, { recursive: true });
        const imagePath = path.join(outputDir, "output.png");
        fs.writeFileSync(imagePath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2ioAAAAASUVORK5CYII=", "base64"));
        fs.writeFileSync(path.join(outputDir, "result.json"), JSON.stringify({ job_id: job.job_id, status: "SUCCESS", output_file_path: imagePath }, null, 2));
        resolve(job);
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 25);
  });
}

test("artifact emission writes canon v2 observability files into run directory", async () => {
  const root = setupEnv();
  resetModuleCache();
  stubPassingGemini();
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
      _vlm_status: "disabled",
      _analyzer_status: {},
    }),
  });

  const connector = require("./execution_connector");
  const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
  const dispatchPromise = connector.dispatchExecution({
    run_id: "RUN-CANON-V2-ARTIFACTS-001",
    execution_target: "colab_runner",
    lane: "MASK_MACRO",
    prompt: "matte black technical ceramic mask front view",
  });
  await Promise.all([workerPromise, dispatchPromise]);

  const runDir = path.join(root, "runs", "RUN-CANON-V2-ARTIFACTS-001");
  const resolved = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_traits_resolved.json"), "utf8"));
  const written = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_traits_written.json"), "utf8"));
  const sanitation = JSON.parse(fs.readFileSync(path.join(runDir, "design_reference_sanitation_report.json"), "utf8"));
  const failAnalytics = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_fail_analytics.json"), "utf8"));
  const decayReport = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_decay_report.json"), "utf8"));
  const promotionDecisions = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_promotion_decisions.json"), "utf8"));
  const leaderboardMask = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_lane_leaderboard_MASK_MACRO.json"), "utf8"));
  const leaderboardEntity = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_lane_leaderboard_ENTITY_MEDIUM.json"), "utf8"));
  const leaderboardWeapon = JSON.parse(fs.readFileSync(path.join(runDir, "canon_v2_lane_leaderboard_WEAPON_MACRO.json"), "utf8"));
  const summary = JSON.parse(fs.readFileSync(path.join(runDir, "job_summary.json"), "utf8"));
  const promptPackage = JSON.parse(fs.readFileSync(path.join(runDir, "prompt_package.json"), "utf8"));
  const canonPacket = JSON.parse(fs.readFileSync(path.join(runDir, "canon_packet.json"), "utf8"));

  assert.ok(Array.isArray(resolved.dominant_traits));
  assert.ok(Array.isArray(written.records));
  assert.equal(sanitation.quarantined_count, 1);
  assert.ok(Object.prototype.hasOwnProperty.call(failAnalytics, "by_lane"));
  assert.ok(Array.isArray(decayReport));
  assert.ok(Array.isArray(promotionDecisions));
  assert.equal(leaderboardMask.lane, "MASK_MACRO");
  assert.equal(leaderboardEntity.lane, "ENTITY_MEDIUM");
  assert.equal(leaderboardWeapon.lane, "WEAPON_MACRO");
  assert.ok(Array.isArray(summary.dominant_traits));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, "lane_trait_leaderboards"));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, "canon_v2_fail_analytics"));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, "canon_v2_promotion_decisions"));
  assert.equal(promptPackage.canon_v2_trait_reuse_affected_prompt, false);
  assert.equal(canonPacket.canon_v2_trait_reuse_affected_canon_packet, false);
});
