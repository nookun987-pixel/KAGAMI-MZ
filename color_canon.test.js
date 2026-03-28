"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const { applyColorCanonToIntake, buildColorNegative } = require("./color_rules");

const ONE_BY_ONE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WnS1xQAAAAASUVORK5CYII=";

let passed = 0;
let failed = 0;

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
    exports: { executeRender: mockImpl },
  };
}

function setAnalyzerRunnerMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "analyzers", "run_all_analyzers.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: { runAllAnalyzers: mockImpl },
  };
}

function setDriftDetectorMock(mockImpl) {
  const modulePath = path.resolve(__dirname, "drift", "drift_detector.js");
  resetModule(modulePath);
  require.cache[modulePath] = {
    id: modulePath,
    filename: modulePath,
    loaded: true,
    exports: { detectDrift: mockImpl },
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
      judgeRenderedImage: mockImpl.judgeRenderedImage,
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
    exports: { runGeminiIntake: mockImpl },
  };
}

function createTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "color-canon-test-"));
}

function writeRealPng(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, Buffer.from(ONE_BY_ONE_PNG_BASE64, "base64"));
  return targetPath;
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
  };
}

function buildColorAwareIntake({ shotType = "WEAPON_MACRO", materialPrimary = "forged steel / titanium / dark industrial alloy", identity = "Zenith Blade, straight engineered greatsword" } = {}) {
  return applyColorCanonToIntake({
    creative_intent: "Color-constrained Mikage material study.",
    subject: {
      type: shotType === "WEAPON_MACRO" ? "weapon" : "manufactured_object",
      identity,
      must_have: ["clear subject identity", "material readability"],
      must_not_have: ["neon", "pure white", "pure black"],
    },
    material: {
      primary: materialPrimary,
      surface: "matte material surface with pigment variation",
      finish: "dry matte finish",
      forbidden_reads: [],
    },
    composition: {
      shot_type: shotType,
      framing: "single clear subject",
      camera: "close-up with material-first control",
      background: "dark restrained backdrop",
    },
    lighting: {
      style: "shadow-heavy low-key lighting",
      constraints: [],
    },
    core_risks: [],
    anti_drift_rules: ["material before color"],
    success_criteria: [],
    direction_summary: "Muted Mikage palette with no neon drift.",
  });
}

async function runOrchestratorCase({ workspace, jobId, shotType, intake, judgeRaw }) {
  const runsDir = path.join(workspace, "runs");
  process.env.RUNS_DIR = runsDir;
  process.env.GEMINI_API_KEY = "test-key";
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";

  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.95,
    narrative_score: 0.9,
    aesthetic_integrity_score: 0.9,
    anti_polish_score: 0.85,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock({
    judgeRenderedImage: async () => ({
      decision: judgeRaw.pass_fail === "PASS" ? "PASS" : "FAIL",
      material_read: judgeRaw.material_read,
      drift_flags: judgeRaw.wrong_reads || [],
      fail_rules: judgeRaw.fail_rules || [],
      corrections: judgeRaw.fix_direction || [],
      confidence: 0.9,
      raw: {
        ...judgeRaw,
        gemini_validation_executed: true,
        parse_ok: true,
        error: judgeRaw.pass_fail === "PASS" ? null : "GEMINI_VALIDATOR_FAIL",
      },
    }),
  });
  setGeminiIntakeMock(async () => intake);
  setRenderExecutorMock(async (_job, _token, _spec, opts) => {
    const outputFile = writeRealPng(path.join(opts.output_dir, "mock-render.png"));
    return {
      success: true,
      render: {
        output_file: outputFile,
        seed_used: 313,
        render_time_ms: 8,
        status: "RENDERED",
      },
    };
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");
  return orchestrate({
    job_id: jobId,
    user_idea: `${jobId} idea`,
    shot_type: shotType,
    phase: "material_study",
    render: {
      width: shotType === "WEAPON_MACRO" ? 1280 : 1024,
      height: shotType === "WEAPON_MACRO" ? 768 : 1024,
      performance: "Speed",
    },
  });
}

async function caseANormalWeapon() {
  const workspace = createTempWorkspace();
  const summary = await runOrchestratorCase({
    workspace,
    jobId: "color-canon-pass-weapon",
    shotType: "WEAPON_MACRO",
    intake: buildColorAwareIntake(),
    judgeRaw: {
      pass_fail: "PASS",
      fail_rules: [],
      wrong_reads: [],
      correct_reads: ["muted restrained palette", "shadow-heavy forged metal"],
      material_read: "muted forged metal palette",
      fix_direction: [],
      summary: "PASS",
    },
  });

  assert(summary.decision === "ALLOW", "CASE A should allow a normal weapon render with restrained color.");
  assert(summary.color_canon_applied === true, "CASE A should mark color canon as applied.");
  assert(Array.isArray(summary.palette_used) && summary.palette_used.includes("charcoal_black"), "CASE A should use restrained weapon palette.");
  assert(summary.final_prompt && /subtractive mineral color logic/i.test(summary.final_prompt), "CASE A prompt should inject color canon wording.");
  assert(summary.negative_prompt && /neon|pure white|pure black/i.test(summary.negative_prompt), "CASE A negative prompt should forbid neon and pure extremes.");
}

async function caseBNeonReject() {
  const workspace = createTempWorkspace();
  const summary = await runOrchestratorCase({
    workspace,
    jobId: "color-canon-neon-reject",
    shotType: "WEAPON_MACRO",
    intake: buildColorAwareIntake(),
    judgeRaw: {
      pass_fail: "FAIL",
      fail_rules: ["COLOR_NEON_DRIFT", "OVERSATURATION_DRIFT"],
      wrong_reads: ["neon rgb glow", "oversaturated red wash"],
      correct_reads: [],
      material_read: "synthetic neon metal",
      fix_direction: ["reduce saturation"],
      summary: "FAIL due to neon drift",
    },
  });

  assert(summary.decision === "REJECT", "CASE B should reject neon drift.");
  assert(summary.failed_rules.includes("COLOR_NEON_DRIFT"), "CASE B should expose COLOR_NEON_DRIFT.");
  assert(summary.color_dominant_fail_reason === "COLOR_NEON_DRIFT", "CASE B should surface color dominant fail reason.");
}

async function caseCPureWhiteReject() {
  const workspace = createTempWorkspace();
  const summary = await runOrchestratorCase({
    workspace,
    jobId: "color-canon-pure-white-reject",
    shotType: "MATERIAL_MACRO",
    intake: buildColorAwareIntake({
      shotType: "MATERIAL_MACRO",
      materialPrimary: "matte B4C technical ceramic",
      identity: "engineered ceramic object",
    }),
    judgeRaw: {
      pass_fail: "FAIL",
      fail_rules: ["PURE_WHITE_DRIFT"],
      wrong_reads: ["sterile pure white shell"],
      correct_reads: [],
      material_read: "pure white digital fill",
      fix_direction: ["break white into warm off-white"],
      summary: "FAIL due to pure white drift",
    },
  });

  assert(summary.decision === "REJECT", "CASE C should reject pure white drift.");
  assert(summary.failed_rules.includes("PURE_WHITE_DRIFT"), "CASE C should expose PURE_WHITE_DRIFT.");
}

async function caseDCrimsonReject() {
  const workspace = createTempWorkspace();
  const summary = await runOrchestratorCase({
    workspace,
    jobId: "color-canon-crimson-reject",
    shotType: "WEAPON_MACRO",
    intake: buildColorAwareIntake(),
    judgeRaw: {
      pass_fail: "FAIL",
      fail_rules: ["CRIMSON_OVERUSE"],
      wrong_reads: ["full-frame red flood", "crimson overuse"],
      correct_reads: [],
      material_read: "crimson-dominant synthetic glow",
      fix_direction: ["limit crimson to seams and core"],
      summary: "FAIL due to crimson overuse",
    },
  });

  assert(summary.decision === "RETRY", "CASE D should force RETRY on crimson overload.");
  assert(summary.failed_rules.includes("CRIMSON_OVERUSE"), "CASE D should expose CRIMSON_OVERUSE.");
  assert(/crimson/i.test(buildColorNegative({ shot_type: "WEAPON_MACRO" }).join(" ")), "CASE D should keep crimson overuse in negative controls.");
}

async function main() {
  await caseANormalWeapon();
  await caseBNeonReject();
  await caseCPureWhiteReject();
  await caseDCrimsonReject();

  if (failed > 0) {
    console.error(`color_canon.test.js: ${failed} failed, ${passed} passed`);
    process.exit(1);
  }
  console.log(`color_canon.test.js: ${passed} passed, 0 failed`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
