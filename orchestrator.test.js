"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const ONE_BY_ONE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnS1xQAAAAASUVORK5CYII=";

let passed = 0;
let failed = 0;

function buildPassingSignals(overrides = {}) {
  return {
    bounding_box_width_percentage: 40,
    distorted_pixel_ratio: 0,
    pixel_displacement: 0,
    rgb_glitch_count: 0,
    mesh_deformation_delta: 0,
    boundary_intersection: 0,
    edge_blur_radius: 0,
    pixel_bleed_percentage: 0,
    high_frequency_pixel_density_delta: 0.1,
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
    geometry_symmetry_ratio: 99,
    line_curvature_degree: 0,
    ornament_bounding_box: 0,
    human_eyes_detected: 0,
    face_mesh_visible: 0,
    high_gloss_specular: 0,
    pvc_plastic_read: 0,
    missing_weave_texture: 0,
    soft_fabric_folds_on_joints: 0,
    magenta_neon_spill: 0,
    chaotic_particle_bloom: 0,
    toon_shading: 0,
    chibi_proportions: 0,
    cyan_magenta_overload: 0,
    lens_flare_spam: 0,
    silhouette_read_time: 0.3,
    edge_separation_score: 1,
    recognition_time_seconds: 0.5,
    primary_subject_confidence: 1,
    logo_overlap_ratio: 0,
    branding_zone_distortion_contact: 0,
    thumbnail_subject_retention: 1,
    thumbnail_saliency_rank: "subject",
    product_color_delta_e: 0,
    regional_hsv_shift: 0,
    _vlm_status: "completed",
    _analyzer_status: {},
    ...overrides,
  };
}

function assert(condition, message) {
  if (condition) {
    passed += 1;
    return;
  }
  failed += 1;
  console.error(`FAIL: ${message}`);
}

function resetModule(modulePath) {
  delete require.cache[require.resolve(modulePath)];
}

function setRenderExecutorMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "render", "render_executor.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      executeRender: mockImpl,
    },
  };
}

function setAnalyzerRunnerMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "analyzers", "run_all_analyzers.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      runAllAnalyzers: mockImpl,
    },
  };
}

function setDriftDetectorMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "drift", "drift_detector.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      detectDrift: mockImpl,
    },
  };
}

function setGeminiConnectorMock(mockImpl = {}) {
  const modulePath = path.resolve(__dirname, "gemini_connector.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      validateGeminiRuntime: mockImpl.validateGeminiRuntime || (async () => ({
        ok: true,
        http_status: 200,
        error: null,
        model: "mock-gemini",
      })),
      judgeRenderedImage: mockImpl.judgeRenderedImage || (async () => ({
        decision: "PASS",
        material_read: "correct",
        drift_flags: [],
        fail_rules: [],
        corrections: [],
        confidence: 0.95,
        raw: {
          pass_fail: "PASS",
          material_read: "correct",
          correct_reads: ["matte ceramic"],
          wrong_reads: [],
          fail_rules: [],
          fix_direction: [],
          summary: "PASS",
          confidence: 0.95,
          gemini_validation_executed: true,
          parse_ok: true,
          error: null,
        },
      })),
    },
  };
}

function setGeminiIntakeMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "gemini_intake.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: {
      runGeminiIntake: mockImpl,
    },
  };
}

function createTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "mikage-orchestrator-test-"));
}

function writeRealPng(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, Buffer.from(ONE_BY_ONE_PNG_BASE64, "base64"));
  return targetPath;
}

async function runSuccessCase() {
  const workspace = createTempWorkspace();
  return runAllowCase(workspace, "success-case", "entity-alpha");
}

async function runAllowCase(workspace, jobId, entityId) {
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, `${jobId}.png`));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock();

  setRenderExecutorMock(async (_job, _token, _spec, opts) => {
    // final_payload.json is in the run dir, which is an ancestor of output_dir
    let dir = opts.output_dir;
    let found = false;
    for (let i = 0; i < 5; i++) {
      if (fs.existsSync(path.join(dir, "final_payload.json"))) { found = true; break; }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
    if (!found) {
      throw new Error("final_payload.json missing before render");
    }
    return {
      success: true,
      render: {
        output_file: sourceImage,
        seed_used: 123,
        render_time_ms: 10,
        status: "RENDERED",
      },
    };
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: jobId,
    entity_id: entityId,
    entity_class: "guardian",
    zone: "threshold",
    weapon: "zenith_blade",
    status: "DONE",
    // IMPORTANT:
    // Do not use "zenith blade" in direct-input test fixtures unless shot_type is explicitly set.
    // It can misclassify the prompt into WEAPON_MACRO and block render before the intended test path.
    //
    // Direct-input prompt bypasses the canon spec builder and avoids the
    // validateCanonPromptPackage WEAPON_MACRO mis-classification that occurs
    // when positivePrompt contains "blade" and is used as the shot-type key.
    // "straight sword" satisfies the weapon required-check without matching /BLADE/.
    input: {
      prompt: "Mikage Zenith, faceless white cybernetic helmet, void black optical sensors, long straight black hair, boron carbide ceramic, graphene hex-grid joints, straight sword, silent disciplined tragic, slender female cyborg form",
      negative_prompt: "human face, human eyes, anime, chibi, cables, wires, katana, glossy plastic",
    },
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, jobId);
  const outputPath = path.join(runDir, "output.png");
  const summaryJson = JSON.parse(fs.readFileSync(path.join(runDir, "job_summary.json"), "utf-8"));
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));
  const registryPath = path.join(runsDir, "canon_memory_registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

  assert(fs.existsSync(outputPath), "success case should create a real output.png");
  assert(summary.decision === "ALLOW", "success case should allow when real image + canon pass");
  assert(summary.status === "DONE", "success case should complete when real image + canon pass");
  assert(summary.output_files.length === 1, "success case should populate output_files");
  assert(summary.output_files[0] === "output.png", "success case output_files should contain output.png");
  assert(summary.final_decision_reason === "ALLOW: output exists + local validator PASS + Gemini PASS", "success case should record allow reason");
  assert(summary.validator_executed === true, "success case should mark validator executed");
  assert(summary.gemini_validation_executed === true, "success case should mark Gemini executed");
  assert(summary.gemini_pass_fail === "PASS", "success case should mark Gemini pass");
  assert(summaryJson.output_files[0] === "output.png", "job_summary output_files should contain output.png");
  assert(summaryJson.validator_executed === true, "job_summary should mark validator executed");
  assert(summaryJson.gemini_validation_executed === true, "job_summary should mark Gemini executed");
  assert(summaryJson.registry_write === true, "job_summary should mark registry write on allow");
  assert(summaryJson.registry_target.includes("local"), "job_summary should record local registry target");
  assert(summaryJson.continuity.entity_id === entityId, "job_summary should include continuity payload");
  assert(decisionJson.output_files[0] === "output.png", "final_decision output_files should contain output.png");
  assert(decisionJson.validator_executed === true, "final_decision should mark validator executed");
  assert(decisionJson.gemini_validation_executed === true, "final_decision should mark Gemini executed");
  assert(decisionJson.gemini_pass_fail === "PASS", "final_decision should mark Gemini pass");
  assert(decisionJson.decision_reason === "ALLOW: output exists + local validator PASS + Gemini PASS", "final_decision should record allow reason");
  assert(fs.existsSync(path.join(runDir, "final_payload.json")), "final_payload.json should exist");
  assert(fs.existsSync(path.join(runDir, "pre_validation.json")), "pre_validation.json should exist");
  assert(fs.existsSync(path.join(runDir, "post_validation.json")), "post_validation.json should exist");
  assert(fs.existsSync(path.join(runDir, "gemini_runtime_check.json")), "gemini_runtime_check.json should exist");
  assert(fs.existsSync(path.join(runDir, "gemini_runtime_probe.json")), "gemini_runtime_probe.json should exist");
  assert(fs.existsSync(path.join(runDir, "candidate-01", "gemini_judge.json")), "gemini_judge.json should exist in candidate-01 dir");
  assert(fs.existsSync(path.join(runDir, "final_decision.json")), "final_decision.json should exist");
  assert(fs.statSync(outputPath).size > 0, "output.png should be non-empty");
  assert(Array.isArray(registry) && registry.length >= 1, "allow case should write an official registry record");
  assert(registry.some((record) => record.decision === "ALLOW"), "registry should contain an official allow");
  assert(registry.some((record) => record.entity_id === entityId), "registry record should persist entity_id");
  return { workspace, summary };
}

async function runFailureCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock();

  setRenderExecutorMock(async () => {
    return {
      success: false,
      render: {
        output_file: null,
        seed_used: null,
        render_time_ms: 10,
        status: "FAILED",
        error: "mock render failed",
      },
    };
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "failure-case",
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "failure-case");
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));
  const geminiJson = JSON.parse(fs.readFileSync(path.join(runDir, "gemini_validation.json"), "utf-8"));

  assert(summary.decision === "REJECT", "failure case must reject when no real image exists");
  assert(summary.status === "FAIL", "failure case must fail when no real image exists");
  assert(summary.final_decision_reason === "REJECT: no real image on disk", "failure case should record no-image reason");
  assert(summary.registry_write === false, "failure case must not write official registry");
  assert(Array.isArray(summary.output_files) && summary.output_files.length === 0, "failure case must not populate output_files");
  assert(!fs.existsSync(path.join(runDir, "output.png")), "failure case must not create fake output.png");
  assert(summary.gemini_pass_fail === "FAIL", "failure case should surface Gemini failure state");
  assert(geminiJson.error === "GEMINI_IMAGE_READ_FAILED", "failure case Gemini artifact should record image read failure");
  assert(decisionJson.decision === "REJECT", "final_decision must reject when image missing");
  assert(decisionJson.status === "FAIL", "final_decision must fail when image missing");
}

async function runCanonFailCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, "canon_fail.png"));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () =>
    buildPassingSignals({
      human_eyes_detected: 1,
      pvc_plastic_read: 1,
    })
  );
  setDriftDetectorMock(async () => ({
    identity_score: 0.4,
    narrative_score: 0.6,
    aesthetic_integrity_score: 0.5,
    anti_polish_score: 0.2,
    drift_flags: ["identity_drift"],
    verdict: "REJECT",
    refineable: false,
    refine_reason: "identity drift",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock();
  setRenderExecutorMock(async () => ({
    success: true,
    render: {
      output_file: sourceImage,
      seed_used: 55,
      render_time_ms: 10,
      status: "RENDERED",
    },
  }));

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "canon-fail-case",
    input: {
      prompt: "Mikage Zenith, faceless white cybernetic helmet, void black optical sensors, long straight black hair, boron carbide ceramic, graphene hex-grid joints, straight sword, silent disciplined tragic, slender female cyborg form",
      negative_prompt: "human face, human eyes, anime, chibi, cables, wires, katana, glossy plastic",
    },
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "canon-fail-case");
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));

  assert(summary.decision === "REJECT", "canon fail case must reject on canon hard fail");
  assert(summary.status === "DONE", "canon fail case should finish with reject after validator");
  assert(summary.validator_executed === true, "canon fail case should run validator");
  assert(summary.gemini_validation_executed === true, "canon fail case should still run Gemini");
  assert(summary.registry_write === false, "canon fail case must not write official registry");
  assert(summary.output_files[0] === "output.png", "canon fail case should still keep real output file");
  assert(
    summary.failed_rules.length >= 1 || summary.post_validation_result.critical_failures.length >= 1,
    "canon fail case should log failed rules"
  );
  assert(summary.final_decision_reason.includes("REJECT: canon hard fail"), "canon fail case should record canon hard fail reason");
  assert(decisionJson.decision === "REJECT", "canon fail final decision must reject");
}

async function runValidatorNotExecutedCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, "validator_skip.png"));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => {
    throw new Error("validator runner crashed");
  });
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock();
  setRenderExecutorMock(async () => ({
    success: true,
    render: {
      output_file: sourceImage,
      seed_used: 77,
      render_time_ms: 10,
      status: "RENDERED",
    },
  }));

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "validator-not-executed-case",
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "validator-not-executed-case");
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));

  assert(summary.decision === "REJECT", "validator-not-executed case must reject");
  assert(summary.status === "FAIL", "validator-not-executed case must fail");
  assert(summary.validator_executed === false, "validator-not-executed case should mark validator false");
  assert(summary.final_decision_reason === "REJECT: no real image on disk", "validator-not-executed case should record no-image reason (pre-validation blocks before render)");
  assert(summary.registry_write === false, "validator-not-executed case must not write official registry");
  assert(decisionJson.validator_executed === false, "final_decision should mark validator false");
}

async function runGeminiFailCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, "gemini_fail.png"));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock({
    judgeRenderedImage: async () => ({
      decision: "FAIL",
      material_read: "plastic",
      drift_flags: ["glossy plastic"],
      fail_rules: ["material_drift"],
      corrections: ["increase ceramic constraints"],
      confidence: 0.87,
      raw: {
        pass_fail: "FAIL",
        material_read: "plastic",
        correct_reads: [],
        wrong_reads: ["glossy plastic"],
        fail_rules: ["material_drift"],
        fix_direction: ["increase ceramic constraints"],
        summary: "material drift",
        confidence: 0.87,
        gemini_validation_executed: true,
        parse_ok: true,
        error: null,
      },
    }),
  });
  setRenderExecutorMock(async () => ({
    success: true,
    render: {
      output_file: sourceImage,
      seed_used: 91,
      render_time_ms: 10,
      status: "RENDERED",
    },
  }));

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "gemini-fail-case",
    input: {
      prompt: "Mikage Zenith, faceless white cybernetic helmet, void black optical sensors, long straight black hair, boron carbide ceramic, graphene hex-grid joints, straight sword, silent disciplined tragic, slender female cyborg form",
      negative_prompt: "human face, human eyes, anime, chibi, cables, wires, katana, glossy plastic",
    },
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "gemini-fail-case");
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));

  assert(summary.decision === "REJECT", "gemini fail case must reject");
  assert(summary.status === "DONE", "gemini fail case should finish with reject");
  assert(summary.gemini_validation_executed === true, "gemini fail case should mark Gemini executed");
  assert(summary.gemini_pass_fail === "FAIL", "gemini fail case should mark Gemini fail");
  assert(summary.registry_write === false, "gemini fail case must not write official registry");
  assert(summary.output_files[0] === "output.png", "gemini fail case should keep real output file");
  assert(summary.wrong_reads.includes("glossy plastic"), "gemini fail case should surface wrong_reads");
  assert(summary.failed_rules.includes("material_drift"), "gemini fail case should merge Gemini fail rules");
  assert(decisionJson.decision_reason === "REJECT: Gemini validator FAIL: material_drift, glossy plastic", "gemini fail reason should be explicit");
}

async function runGeminiRuntimeFailureCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, "gemini_runtime_failure.png"));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock({
    validateGeminiRuntime: async () => ({
      ok: false,
      http_status: 403,
      error: "GEMINI_HTTP_403",
      model: "mock-gemini",
    }),
  });
  setRenderExecutorMock(async () => ({
    success: true,
    render: {
      output_file: sourceImage,
      seed_used: 91,
      render_time_ms: 10,
      status: "RENDERED",
    },
  }));

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "gemini-runtime-failure-case",
    identity: {
      name: "Mikage",
      archetype: "ethereal guardian",
      visual_anchor: "silver-haired figure in moonlight",
    },
    narrative: {
      theme: "solitude at the edge of twilight",
      mood: "contemplative",
      scene: "standing alone on a cliff overlooking a starlit ocean",
    },
    strategy: {
      style: "cinematic illustration",
      color_palette: "deep blue, silver, soft violet",
    },
    art_direction: {
      mood: "melancholic",
      material: "porcelain",
      style: "wabi-sabi",
    },
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "gemini-runtime-failure-case");
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));

  assert(summary.decision === "REJECT", "gemini runtime failure should reject");
  assert(summary.status === "FAIL", "gemini runtime failure should fail");
  assert(summary.gemini_validation_executed === false, "gemini runtime failure should not mark Gemini executed");
  assert(summary.gemini_error === "GEMINI_HTTP_403", "gemini runtime failure should surface probe failure");
  assert(summary.registry_write === false, "gemini runtime failure must not write official registry");
  assert(decisionJson.decision_reason === "REJECT: no real image on disk", "gemini runtime failure: pre-validation blocks before render, so no-image reason dominates");
}

async function runGeminiInvalidJsonCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  const sourceDir = path.join(workspace, "source");
  const sourceImage = writeRealPng(path.join(sourceDir, "gemini_invalid_json.png"));

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";
  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.92,
    narrative_score: 0.88,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.82,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock({
    judgeRenderedImage: async () => ({
      decision: "FAIL",
      material_read: "unknown",
      drift_flags: [],
      fail_rules: [],
      corrections: [],
      confidence: 0,
      raw: {
        pass_fail: "FAIL",
        material_read: "unknown",
        correct_reads: [],
        wrong_reads: [],
        fail_rules: [],
        fix_direction: [],
        summary: "bad json",
        confidence: 0,
        gemini_validation_executed: true,
        parse_ok: false,
        error: "GEMINI_INVALID_JSON",
      },
    }),
  });
  setRenderExecutorMock(async () => ({
    success: true,
    render: {
      output_file: sourceImage,
      seed_used: 91,
      render_time_ms: 10,
      status: "RENDERED",
    },
  }));

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  // With input.prompt, pre-validation passes and the render happens.
  // judgeRenderedImage returns parse_ok=false, so runLegacyGeminiValidation
  // returns { parse_ok: false, gemini_validation_executed: true }.
  // The orchestrator's EARLY_INVARIANT fires immediately:
  //   "[EARLY_INVARIANT] Gemini validation parse failed - stopping immediately"
  // so orchestrate() throws instead of returning a summary.
  let caughtError = null;
  try {
    await orchestrate({
      job_id: "gemini-invalid-json-case",
      input: {
        prompt: "Mikage Zenith, faceless white cybernetic helmet, void black optical sensors, long straight black hair, boron carbide ceramic, graphene hex-grid joints, straight sword, silent disciplined tragic, slender female cyborg form",
        negative_prompt: "human face, human eyes, anime, chibi, cables, wires, katana, glossy plastic",
      },
      identity: {
        name: "Mikage",
        archetype: "ethereal guardian",
        visual_anchor: "silver-haired figure in moonlight",
      },
      narrative: {
        theme: "solitude at the edge of twilight",
        mood: "contemplative",
        scene: "standing alone on a cliff overlooking a starlit ocean",
      },
      strategy: {
        style: "cinematic illustration",
        color_palette: "deep blue, silver, soft violet",
      },
      art_direction: {
        mood: "melancholic",
        material: "porcelain",
        style: "wabi-sabi",
      },
      render: {
        width: 1024,
        height: 1024,
        performance: "Speed",
      },
    });
  } catch (err) {
    caughtError = err;
  }

  assert(caughtError !== null, "gemini invalid json should throw via EARLY_INVARIANT when parse_ok=false");
  assert(
    caughtError && caughtError.message.includes("EARLY_INVARIANT"),
    "gemini invalid json error should be an EARLY_INVARIANT throw"
  );
  assert(
    caughtError && caughtError.message.includes("parse failed"),
    "gemini invalid json EARLY_INVARIANT should mention parse failure"
  );
}

async function runBaselineCase() {
  const workspace = createTempWorkspace();
  const first = await runAllowCase(workspace, "baseline-source", "entity-baseline");
  const second = await runAllowCase(workspace, "baseline-followup", "entity-baseline");

  assert(first.summary.registry_write === true, "baseline source allow should write registry");
  assert(second.summary.baseline_found === true, "followup run should find baseline");
  assert(second.summary.baseline_reference === "baseline-source", "followup run should reference previous allowed job");
  assert(second.summary.baseline_source === "local", "followup run should report local baseline source");
}

async function runAutoPrecheckRejectCase() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  let renderCalled = false;

  process.env.RUNS_DIR = runsDir;
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";
  process.env.GEMINI_API_KEY = "test-key";

  setGeminiIntakeMock(async () => ({
    creative_intent: "abstract atmosphere board",
    subject: {
      type: "atmosphere",
      identity: "texture",
      must_have: [],
      must_not_have: [],
    },
    material: {
      primary: "ceramic",
      surface: "",
      finish: "",
      forbidden_reads: [],
    },
    composition: {
      shot_type: "",
      framing: "",
      camera: "",
      background: "",
    },
    lighting: {
      style: "",
      constraints: [],
    },
    core_risks: ["abstract drift"],
    anti_drift_rules: [],
    success_criteria: [],
    direction_summary: "abstract ceramic mood",
    connector_status: "gemini",
    gemini_executed: true,
    parse_ok: true,
  }));
  setGeminiConnectorMock({
    validateGeminiRuntime: async () => ({
      ok: true,
      http_status: 200,
      error: null,
      model: "mock-gemini",
    }),
  });
  setRenderExecutorMock(async () => {
    renderCalled = true;
    throw new Error("render should not execute after precheck reject");
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "auto-precheck-reject-case",
    user_idea: "moody ceramic atmosphere with abstract texture",
    phase: "material_study",
    render: {
      width: 1024,
      height: 1024,
      performance: "Speed",
    },
  });

  const runDir = path.join(runsDir, "auto-precheck-reject-case");
  const precheckJson = JSON.parse(fs.readFileSync(path.join(runDir, "gemini_precheck.json"), "utf-8"));
  const decisionJson = JSON.parse(fs.readFileSync(path.join(runDir, "final_decision.json"), "utf-8"));

  assert(summary.decision === "REJECT", "auto precheck reject case must reject");
  assert(summary.status === "FAIL", "auto precheck reject case must fail");
  assert(precheckJson.status === "REJECT", "precheck artifact must record reject");
  assert(precheckJson.issues.length > 0, "precheck reject must explain issues");
  assert(renderCalled === false, "render must not execute after precheck reject");
  assert(decisionJson.failed_rules.includes("GEMINI_PRECHECK_REJECT"), "final decision must record precheck rejection");
}

(async () => {
  try {
    await runSuccessCase();
    await runCanonFailCase();
    await runFailureCase();
    await runValidatorNotExecutedCase();
    await runGeminiFailCase();
    await runGeminiRuntimeFailureCase();
    await runGeminiInvalidJsonCase();
    await runBaselineCase();
    await runAutoPrecheckRejectCase();

    console.log(`${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
})();
