"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");

function resetModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (
      key.includes("\\execution\\execution_connector.js") ||
      key.includes("\\renderers\\colab_runner_adapter.js") ||
      key.includes("\\analyzers\\run_all_analyzers.js") ||
      key.includes("\\analyzers\\vlm_semantic_analyzer.js") ||
      key.includes("\\analyzers\\pixel_analyzer.js") ||
      key.includes("\\analyzers\\silhouette_check.js") ||
      key.includes("\\analyzers\\saliency_map.js") ||
      key.includes("\\analyzers\\safe_zone_mask.js") ||
      key.includes("\\analyzers\\z_blue_detector.js") ||
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-live-semantic-"));
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
  process.env.USE_VISION_VALIDATOR = "true";
  process.env.VLM_MODEL = "mock-vlm";
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

function stubPassingGemini() {
  stubModule("../gemini_intake", {
    runGeminiIntake: async () => ({
      creative_intent: "Controlled manufactured object render",
      subject: {
        type: "manufactured_object",
        identity: "technical ceramic mask artifact",
        must_have: ["single readable mask object", "sealed eye region", "perfect bilateral symmetry"],
        must_not_have: ["human face", "horns", "plastic", "halo ring"],
      },
      material: {
        primary: "boron carbide (B4C) technical ceramic",
        surface: "micro-pitted technical ceramic",
        finish: "matte black",
        forbidden_reads: ["plastic", "resin", "toy", "fabric", "wearable helmet"],
      },
      composition: {
        shot_type: "MASK_MACRO",
        framing: "centered front view",
        camera: "artifact shot",
        background: "black void background",
      },
      lighting: {
        style: "controlled studio",
        constraints: ["no neon", "no magenta"],
      },
      anti_drift_rules: ["manufactured object only", "no character read", "no cosplay"],
      success_criteria: ["mask reads immediately", "ceramic material reads immediately"],
      direction_summary: "matte black boron carbide technical ceramic mask, centered front artifact shot",
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
      lane_required_anchors: ["centered front view", "black void background"],
      lane_forbidden_anchors: ["character face", "wearable helmet"],
      lane_priority_override_applied: true,
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
      confidence: 0.98,
      raw: {
        pass_fail: "PASS",
        fail_rules: [],
        wrong_reads: [],
        correct_reads: ["technical ceramic", "mask artifact", "black void background"],
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

function stubDeterministicLocalAnalyzers(localSignals = {}) {
  stubModule("../analyzers/pixel_analyzer", {
    analyzePixels: async () => ({
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
      exposure_value_delta: 0,
      histogram_clipping: 0,
      ...localSignals.pixel,
    }),
  });
  stubModule("../analyzers/silhouette_check", {
    analyzeSilhouette: async () => ({
      geometry_symmetry_ratio: 100,
      line_curvature_degree: 0,
      ornament_bounding_box: 0,
      silhouette_read_time: 0.4,
      edge_separation_score: 1,
      ...localSignals.silhouette,
    }),
  });
  stubModule("../analyzers/saliency_map", {
    analyzeSaliency: async () => ({
      primary_subject_confidence: 1,
      thumbnail_subject_retention: 1,
      thumbnail_saliency_rank: "subject",
      saliency_peak_zone: "product_safe_zone",
      recognition_time_seconds: 0.4,
      ...localSignals.saliency,
    }),
  });
  stubModule("../analyzers/safe_zone_mask", {
    analyzeSafeZone: async () => ({
      boundary_intersection: 0,
      ...localSignals.safe_zone,
    }),
  });
  stubModule("../analyzers/z_blue_detector", {
    detectZBlue: async () => ({
      z_blue_delta_e: 0,
      z_blue_color_shift_detected: 0,
      rgb_chromatic_split_noise: 0,
      vhs_noise_pattern: 0,
      ...localSignals.color,
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

async function startMockVlmServer(responseMap) {
  let requestCount = 0;
  const server = http.createServer((req, res) => {
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "method_not_allowed" }));
      return;
    }

    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk.toString("utf8");
    });
    req.on("end", () => {
      let parsed = {};
      try {
        parsed = JSON.parse(rawBody);
      } catch (_) {}
      const userContent = parsed &&
        parsed.messages &&
        parsed.messages[1] &&
        parsed.messages[1].content;
      const userText = Array.isArray(userContent)
        ? userContent.map((item) => item && item.text || "").join("\n")
        : String(userContent || "");
      let body = responseMap.geometry_branding;
      if (/human_eyes_detected|human_face_read|plastic_or_resin_read/i.test(userText)) {
        body = responseMap.identity_material;
      } else if (/magenta_neon_spill|halo_ring_frame_object|missing_black_void_background/i.test(userText)) {
        body = responseMap.energy_atmosphere;
      } else if (/line_angle_deviation|logo_overlap_ratio|branding_zone_distortion_contact/i.test(userText)) {
        body = responseMap.geometry_branding;
      }
      requestCount += 1;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify(body),
            },
          },
        ],
      }));
    });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    url: `http://127.0.0.1:${address.port}/v1/chat/completions`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
    getRequestCount: () => requestCount,
  };
}

test("semantic VLM active valid mask case passes and exposes semantic execution truthfully", async () => {
  const root = setupEnv();
  resetModuleCache();
  stubPassingGemini();
  stubDeterministicLocalAnalyzers();

  const vlm = await startMockVlmServer({
      identity_material: {
      human_eyes_detected: 0,
      face_mesh_visible: 0,
      high_gloss_specular: 0,
      pvc_plastic_read: 0,
      missing_weave_texture: 0,
      soft_fabric_folds_on_joints: 0,
      toon_shading: 0,
      chibi_proportions: 0,
      human_face_read: 0,
      visible_eyes_detected: 0,
      cosplay_or_wearable_read: 0,
      creature_features_detected: 0,
      horn_or_ear_extension_detected: 0,
      plastic_or_resin_read: 0,
      non_ceramic_material_read: 0,
      abstract_unreadable_object: 0,
      },
      energy_atmosphere: {
      magenta_neon_spill: 0,
      chaotic_particle_bloom: 0,
      cyan_magenta_overload: 0,
      lens_flare_spam: 0,
      halo_ring_frame_object: 0,
      missing_black_void_background: 0,
      },
      geometry_branding: {
      line_angle_deviation: 0,
      grid_snap_variance: 0,
      logo_overlap_ratio: 0,
      branding_zone_distortion_contact: 0,
      },
  });

  process.env.VLM_ENDPOINT = vlm.url;

  try {
    const connector = require("./execution_connector");
    const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
    const dispatchPromise = connector.dispatchExecution({
      run_id: "RUN-SEMANTIC-PASS-001",
      execution_target: "colab_runner",
      lane: "MASK_MACRO",
      prompt: "matte black technical ceramic mask front view",
    });
    const [, result] = await Promise.all([workerPromise, dispatchPromise]);

    const runDir = path.join(root, "runs", "RUN-SEMANTIC-PASS-001");
    const promptPackage = JSON.parse(fs.readFileSync(path.join(runDir, "prompt_package.json"), "utf8"));
    const postValidation = JSON.parse(fs.readFileSync(path.join(runDir, "post_validation.json"), "utf8"));
    const finalDecision = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf8"));

    assert.equal(result.normalized_result.status, "SUCCESS");
    assert.equal(postValidation.semantic_vlm_executed, true);
    assert.equal(postValidation.semantic_vlm_mode, "openai_compatible_http");
    assert.deepEqual(postValidation.semantic_reject_signals, []);
    assert.equal(postValidation.validator_verdict, "PASS");
    assert.equal(finalDecision.decision, "ALLOW");
    assert.equal(finalDecision.semantic_blocking, false);
    assert.equal(finalDecision.canon_blocking, false);
    assert.equal(finalDecision.output_verified, true);
    assert.match(promptPackage.structured_prompt, /boron carbide|B4C|technical ceramic/i);
    assert.match(promptPackage.structured_prompt, /perfect bilateral symmetry|sealed eye region|black void background/i);
    assert.match(promptPackage.negative_prompt, /human|plastic|resin|halo|wearable/i);
    assert.equal(vlm.getRequestCount(), 3);
  } finally {
    await vlm.close();
  }
});

test("semantic VLM active horn eyes plastic halo human-face drift hard rejects final gate", async () => {
  const root = setupEnv();
  resetModuleCache();
  stubPassingGemini();
  stubDeterministicLocalAnalyzers();

  const vlm = await startMockVlmServer({
      identity_material: {
      human_eyes_detected: 1,
      face_mesh_visible: 1,
      high_gloss_specular: 0,
      pvc_plastic_read: 1,
      missing_weave_texture: 0,
      soft_fabric_folds_on_joints: 0,
      toon_shading: 0,
      chibi_proportions: 0,
      human_face_read: 1,
      visible_eyes_detected: 1,
      cosplay_or_wearable_read: 1,
      creature_features_detected: 1,
      horn_or_ear_extension_detected: 1,
      plastic_or_resin_read: 1,
      non_ceramic_material_read: 1,
      abstract_unreadable_object: 0,
      },
      energy_atmosphere: {
      magenta_neon_spill: 0,
      chaotic_particle_bloom: 0,
      cyan_magenta_overload: 0,
      lens_flare_spam: 0,
      halo_ring_frame_object: 1,
      missing_black_void_background: 1,
      },
      geometry_branding: {
      line_angle_deviation: 0,
      grid_snap_variance: 0,
      logo_overlap_ratio: 0,
      branding_zone_distortion_contact: 0,
      },
  });

  process.env.VLM_ENDPOINT = vlm.url;

  try {
    const connector = require("./execution_connector");
    const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
    const dispatchPromise = connector.dispatchExecution({
      run_id: "RUN-SEMANTIC-REJECT-001",
      execution_target: "colab_runner",
      lane: "MASK_MACRO",
      prompt: "matte black technical ceramic mask front view",
    });
    const [, result] = await Promise.all([workerPromise, dispatchPromise]);

    const runDir = path.join(root, "runs", "RUN-SEMANTIC-REJECT-001");
    const postValidation = JSON.parse(fs.readFileSync(path.join(runDir, "post_validation.json"), "utf8"));
    const finalDecision = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf8"));
    const approvedLibrary = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, "utf8"));

    assert.equal(result.normalized_result.status, "FAIL");
    assert.equal(postValidation.semantic_vlm_executed, true);
    assert.equal(postValidation.validator_verdict, "REJECT");
    assert.deepEqual(postValidation.semantic_reject_signals.sort(), [
      "cosplay_or_wearable_read",
      "creature_features_detected",
      "halo_ring_frame_object",
      "horn_or_ear_extension_detected",
      "human_face_read",
      "missing_black_void_background",
      "non_ceramic_material_read",
      "plastic_or_resin_read",
      "visible_eyes_detected",
    ].sort());
    assert.deepEqual(postValidation.canon_hard_failures.sort(), [
      "cosplay_or_wearable_read",
      "creature_or_character_read",
      "halo_ring_frame_object",
      "horn_or_ear_extension_detected",
      "human_face_read",
      "missing_black_void_background",
      "non_ceramic_material_read",
      "plastic_or_resin_read",
      "visible_eyes",
    ].sort());
    assert.equal(finalDecision.decision, "REJECT");
    assert.equal(finalDecision.semantic_blocking, true);
    assert.equal(finalDecision.canon_blocking, true);
    assert.equal(finalDecision.gemini_pass_fail, "PASS");
    assert.match(finalDecision.decision_reason, /semantic VLM reject|canon hard fail/i);
    assert.ok(finalDecision.block_reasons.some((reason) => reason.includes("SEMANTIC_REJECT:visible_eyes_detected")));
    assert.ok(finalDecision.block_reasons.some((reason) => reason.includes("CANON_HARD_REJECT:human_face_read")));
    assert.equal(approvedLibrary.objects.length, 0);
    assert.equal(vlm.getRequestCount(), 3);
  } finally {
    await vlm.close();
  }
});
