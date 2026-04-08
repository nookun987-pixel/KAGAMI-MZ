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
      key.includes("\\gemini_intake.js") ||
      key.includes("\\gemini_precheck.js") ||
      key.includes("\\gemini_connector.js") ||
      key.includes("\\memory\\approved_object_memory.js") ||
      key.includes("\\canon_evolution\\canon_v2_resolver.js") ||
      key.includes("\\canon_evolution\\canon_v2_writer.js") ||
      key.includes("\\canon_evolution\\design_reference_sanitizer.js") ||
      key.includes("\\canon_evolution\\trait_extractor.js") ||
      key.includes("\\object_definition\\object_spec_generator.js") ||
      key.includes("\\canon\\canon_rule_compiler.js")
    ) {
      delete require.cache[key];
    }
  }
}

function seedContaminatedRecord() {
  return {
    spec_version: "1.0.0",
    object_id: "MASK_KITSUNE_CERAMIC_001",
    object_class: "mask",
    identity_core: {
      name: "Kitsune Porcelain Mask",
      origin: "Japanese Noh theater - fox spirit archetype, adapted to engineered ceramic",
      function: "Ceremonial/decorative wall-mount mask representing the kitsune (fox) spirit",
      one_sentence: "A viewer sees this and immediately knows it is a white ceramic Japanese fox mask with precise manufactured form.",
    },
    readable_as: "a symmetrical Japanese kitsune porcelain mask - white ceramic, fox-shaped, clearly a manufactured artifact",
    topology: {
      primary_form: "ovoid with tapered snout",
      symmetry: "bilateral",
      orientation: "frontal",
      dominant_axis: "vertical",
    },
    silhouette_rules: {
      must_read_as: "a mask face-shape with pointed fox ears at top and a tapered snout at center",
      key_contour_features: [
        "pointed ear tips at 10-o'clock and 2-o'clock",
        "tapered snout narrowing toward nose",
      ],
      forbidden_silhouettes: ["human face oval"],
    },
    must_have_parts: [
      {
        part_name: "fox_ears",
        description: "Two pointed ear forms at top of mask, clearly part of the mask structure",
        visibility: "required_visible",
      },
    ],
    forbidden_parts: ["human eyes or realistic eyeballs"],
    material_truth: {
      primary_material: "engineered technical ceramic (B4C-inspired porcelain)",
      surface_finish: "matte",
      texture_descriptor: "dry dense eggshell microtexture",
      forbidden_materials: ["plastic", "PVC"],
    },
    anti_misread_rules: [
      {
        rule: "Fox ears must be structurally present at mask crown",
        enforcement: "positive_prompt",
      },
    ],
    part_priority_order: ["fox_ears"],
    approved: true,
    approved_at: "2026-04-06T00:00:00.000Z",
  };
}

function setupEnv({ seedContaminatedLibrary = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mikage-memory-"));
  process.env.EXECUTION_REGISTRY_PATH = path.join(root, "memory", "execution_registry.json");
  process.env.RUNS_DIR = path.join(root, "runs");
  process.env.DRIVE_ROOT = path.join(root, "mikage_runner");
  process.env.COLAB_POLL_INTERVAL_MS = "25";
  process.env.COLAB_TIMEOUT_MS = "2000";
  process.env.MIKAGE_ENABLE_RECOVERED_CONTROL_LANE = "true";
  process.env.MIKAGE_ENABLE_LIVE_GEMINI_CONTROL = "true";
  process.env.MIKAGE_ENABLE_POSTVALIDATION = "true";
  process.env.MIKAGE_STRICT_UNKNOWN_RULES = "false";
  process.env.USE_VISION_VALIDATOR = "false";
  process.env.APPROVED_OBJECT_LIBRARY_PATH = path.join(root, "memory", "approved_object_library.json");
  process.env.APPROVED_OBJECT_LIBRARY_AUDIT_PATH = path.join(root, "memory", "approved_object_library.audit.json");
  process.env.APPROVED_OBJECT_LIBRARY_QUARANTINE_PATH = path.join(root, "memory", "approved_object_library.quarantine.json");
  process.env.CANON_MEMORY_REGISTRY_PATH = path.join(root, "runs", "canon_memory_registry.json");
  process.env.CANON_EVOLUTION_REGISTRY_PATH = path.join(root, "memory", "canon_evolution_registry.json");
  process.env.CANON_TRAIT_REGISTRY_PATH = path.join(root, "memory", "canon_trait_registry.json");
  process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH = path.join(root, "memory", "canon_trait_registry.audit.json");
  process.env.DESIGN_REFERENCE_REGISTRY_PATH = path.join(root, "memory", "design_reference_registry.json");
  process.env.DESIGN_REFERENCE_REGISTRY_CLEANED_PATH = path.join(root, "memory", "design_reference_registry.cleaned.json");
  process.env.DESIGN_REFERENCE_REGISTRY_QUARANTINE_PATH = path.join(root, "memory", "design_reference_registry.quarantine.json");
  fs.mkdirSync(path.join(root, "memory"), { recursive: true });
  fs.writeFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, JSON.stringify({
    version: "1.0.0",
    description: "test approved library",
    objects: seedContaminatedLibrary ? [seedContaminatedRecord()] : [],
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
    references: [
      {
        ref_id: "kitsune_noh_mask",
        object_class: "mask",
        canonical_name: "Kitsune (Fox) Noh Mask",
        key_features: ["pointed ear forms at top"],
        silhouette_landmarks: ["pointed ears"],
        common_ai_failures: ["human face drift"],
        design_notes: "fox spirit mask",
      }
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
      subject: {
        type: "manufactured_object",
        identity: "technical ceramic mask artifact",
        must_have: ["single readable mask object"],
        must_not_have: ["human face", "horns", "cosplay"],
      },
      material: {
        primary: "boron carbide (B4C) technical ceramic",
        surface: "micro-pitted technical ceramic",
        finish: "matte black",
        forbidden_reads: ["plastic", "resin", "toy"],
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
      anti_drift_rules: ["manufactured object only"],
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
      lane_forbidden_anchors: ["character face"],
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
      confidence: 0.97,
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
    recognition_time_seconds: 0.4,
    primary_subject_confidence: 1,
    thumbnail_subject_retention: 1,
    thumbnail_saliency_rank: "subject",
    _vlm_status: "disabled",
    _vlm_mode: "inactive",
    _analyzer_status: {},
  };
}

function buildRejectSignals() {
  return {
    ...buildPassingSignals(),
    human_eyes_detected: 1,
    visible_eyes_detected: 1,
    human_face_read: 1,
    pvc_plastic_read: 1,
    plastic_or_resin_read: 1,
    _vlm_status: "disabled",
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

async function dispatchMaskRun(runId, prompt) {
  const connector = require("./execution_connector");
  const workerPromise = simulateWorker(process.env.DRIVE_ROOT);
  const dispatchPromise = connector.dispatchExecution({
    run_id: runId,
    execution_target: "colab_runner",
    lane: "MASK_MACRO",
    prompt,
  });
  return Promise.all([workerPromise, dispatchPromise]);
}

test("contaminated approved library is sanitized and no longer biases MASK_MACRO reuse", async () => {
  const root = setupEnv({ seedContaminatedLibrary: true });
  resetModuleCache();
  stubPassingGemini();
  stubModule("../analyzers/run_all_analyzers", {
    runAllAnalyzers: async () => buildPassingSignals(),
  });

  const approvedMemory = require("../memory/approved_object_memory");
  approvedMemory.persistApprovedLibrarySanitation();

  await dispatchMaskRun("RUN-SANITIZE-001", "matte black porcelain ceramic mask front view");

  const runDir = path.join(root, "runs", "RUN-SANITIZE-001");
  const objectDefinition = JSON.parse(fs.readFileSync(path.join(runDir, "object_definition.json"), "utf8"));
  const promptPackage = JSON.parse(fs.readFileSync(path.join(runDir, "prompt_package.json"), "utf8"));
  const cleanedLibrary = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, "utf8"));
  const quarantine = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_QUARANTINE_PATH, "utf8"));
  const audit = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_AUDIT_PATH, "utf8"));
  const cleanedReferences = JSON.parse(fs.readFileSync(process.env.DESIGN_REFERENCE_REGISTRY_CLEANED_PATH, "utf8"));
  const quarantinedReferences = JSON.parse(fs.readFileSync(process.env.DESIGN_REFERENCE_REGISTRY_QUARANTINE_PATH, "utf8"));

  assert.equal(cleanedLibrary.objects.length, 1);
  assert.equal(quarantine.objects.length, 1);
  assert.equal(audit.summary.quarantined, 1);
  assert.equal(objectDefinition.approved_memory_reused, false);
  assert.equal(objectDefinition.memory_sanitation_applied, true);
  assert.equal(promptPackage.approved_memory_reused, false);
  assert.equal(promptPackage.memory_sanitation_applied, true);
  assert.equal(cleanedLibrary.objects[0].sanitized_for_live_reuse, true);
  assert.doesNotMatch(JSON.stringify(cleanedLibrary.objects[0]), /kitsune|fox-shaped|fox_ears/i);
  assert.equal(cleanedReferences.references.length, 0);
  assert.equal(quarantinedReferences.quarantined.length, 1);
  assert.match(JSON.stringify(quarantinedReferences), /kitsune|fox/i);
  assert.doesNotMatch(promptPackage.structured_prompt, /kitsune|fox ears|fox-shaped/i);
});

test("clean PASS runs write canon evolution safely and later runs reuse it without duplicating identity records", async () => {
  const root = setupEnv();
  resetModuleCache();
  stubPassingGemini();
  stubModule("../analyzers/run_all_analyzers", {
    runAllAnalyzers: async () => buildPassingSignals(),
  });

  await dispatchMaskRun("RUN-EVOLVE-001", "matte black technical ceramic mask front view");
  await dispatchMaskRun("RUN-EVOLVE-002", "matte black technical ceramic mask front view");

  const run1Dir = path.join(root, "runs", "RUN-EVOLVE-001");
  const run2Dir = path.join(root, "runs", "RUN-EVOLVE-002");
  const final1 = JSON.parse(fs.readFileSync(path.join(run1Dir, "final_decision.json"), "utf8"));
  const final2 = JSON.parse(fs.readFileSync(path.join(run2Dir, "final_decision.json"), "utf8"));
  const prompt2 = JSON.parse(fs.readFileSync(path.join(run2Dir, "prompt_package.json"), "utf8"));
  const traitRegistry = JSON.parse(fs.readFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, "utf8"));
  const traitAudit = JSON.parse(fs.readFileSync(process.env.CANON_TRAIT_REGISTRY_AUDIT_PATH, "utf8"));

  assert.equal(final1.decision, "ALLOW");
  assert.equal(final1.canon_evolution_writeback, true);
  assert.equal(final2.decision, "ALLOW");
  assert.equal(final2.canon_evolution_reused, true);
  assert.ok(final2.canon_evolution_source_keys.length >= 1);
  assert.equal(prompt2.canon_evolution_reused, true);
  assert.ok(prompt2.canon_evolution_source_keys.length >= 1);
  assert.ok(traitRegistry.records.length >= 1);
  const identityKeys = new Set(traitRegistry.records.map((record) => record.identity_key));
  assert.equal(identityKeys.size, 1);
  assert.ok(traitAudit.events.length >= 1);
});

test("reject runs do not pollute approved memory or canon evolution memory", async () => {
  const root = setupEnv();
  resetModuleCache();
  stubPassingGemini();
  stubModule("../analyzers/run_all_analyzers", {
    runAllAnalyzers: async () => buildRejectSignals(),
  });

  await dispatchMaskRun("RUN-REJECT-MEM-001", "matte black technical ceramic mask front view");

  const runDir = path.join(root, "runs", "RUN-REJECT-MEM-001");
  const finalDecision = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf8"));
  const approvedLibrary = JSON.parse(fs.readFileSync(process.env.APPROVED_OBJECT_LIBRARY_PATH, "utf8"));
  const traitRegistry = JSON.parse(fs.readFileSync(process.env.CANON_TRAIT_REGISTRY_PATH, "utf8"));

  assert.equal(finalDecision.decision, "REJECT");
  assert.equal(finalDecision.canon_evolution_writeback, false);
  assert.equal(approvedLibrary.objects.length, 0);
  assert.equal(traitRegistry.records.length, 0);
});
