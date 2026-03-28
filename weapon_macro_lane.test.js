"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const { normalizeIdeaRequest } = require("./idea_intake");
const { runGeminiPrecheck } = require("./gemini_precheck");
const { buildPromptPackageFromIntake } = require("./claude_spec_bridge");
const { applyLaneRuleToIntake } = require("./lane_rules");

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
    exports: {
      runGeminiIntake: mockImpl,
    },
  };
}

function createTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "weapon-macro-lane-test-"));
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

function buildWeaponIntake(overrides = {}) {
  return applyLaneRuleToIntake({
    creative_intent: "Weapon macro study with industrial sword readability.",
    subject: {
      type: "weapon",
      identity: "Zenith Blade, straight engineered greatsword",
      must_have: [
        "weapon",
        "blade",
        "visible sword geometry",
        "hard edge silhouette",
      ],
      must_not_have: [],
    },
    material: {
      primary: "forged steel / titanium / dark industrial alloy",
      surface: "dark metal spine with forged planes",
      finish: "dry forged metal finish",
      forbidden_reads: [],
    },
    composition: {
      shot_type: "WEAPON_MACRO",
      framing: "macro blade-first framing",
      camera: "macro close-up preserving elongated linear sword geometry",
      background: "dark industrial backdrop",
    },
    lighting: {
      style: "hard directional industrial macro lighting",
      constraints: ["sword first, material second"],
    },
    core_risks: [],
    anti_drift_rules: ["weapon lane wins over ceramic or mask bias"],
    success_criteria: ["image reads immediately as a straight engineered greatsword"],
    direction_summary: "Zenith Blade macro, forged dark industrial alloy, no ceramic drift.",
    ...overrides,
  });
}

async function runCaseAPassableWeapon() {
  const workspace = createTempWorkspace();
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
    judgeRenderedImage: async (_imagePath, context = {}) => ({
      decision: "PASS",
      material_read: "forged metal",
      drift_flags: [],
      fail_rules: [],
      corrections: [],
      confidence: 0.97,
      raw: {
        pass_fail: "PASS",
        material_read: "forged metal",
        correct_reads: ["weapon", "blade", "straight engineered greatsword"],
        wrong_reads: [],
        fail_rules: [],
        fix_direction: [],
        summary: context.promptPath && /gemini_weapon_validator\.txt$/i.test(context.promptPath) ? "PASS" : "WRONG_PROMPT",
        confidence: 0.97,
        gemini_validation_executed: true,
        parse_ok: true,
        error: null,
      },
    }),
  });
  setGeminiIntakeMock(async () => buildWeaponIntake());
  setRenderExecutorMock(async (_job, _token, _spec, opts) => {
    const outputFile = writeRealPng(path.join(opts.output_dir, "mock-render.png"));
    return {
      success: true,
      render: {
        output_file: outputFile,
        seed_used: 777,
        render_time_ms: 12,
        status: "RENDERED",
      },
    };
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "weapon-macro-pass-case",
    user_idea: "Zenith Blade macro, straight engineered greatsword, dark metal spine, crimson heated core, industrial precision",
    shot_type: "WEAPON_MACRO",
    phase: "material_study",
    render: {
      width: 1280,
      height: 768,
      performance: "Speed",
    },
  });

  const promptPackage = JSON.parse(fs.readFileSync(path.join(runsDir, "weapon-macro-pass-case", "prompt_package.json"), "utf-8"));
  assert(summary.decision === "ALLOW", "CASE A should pass end-to-end for a clear weapon macro brief.");
  assert(summary.shot_type === "WEAPON_MACRO", "CASE A should keep WEAPON_MACRO shot type.");
  assert(summary.lane_rule_applied === "WEAPON_MACRO", "CASE A should record WEAPON_MACRO lane rule.");
  assert(/straight engineered greatsword/i.test(promptPackage.structured_prompt), "CASE A prompt package should preserve greatsword identity.");
  assert(/forged metal|steel|titanium|alloy/i.test(promptPackage.structured_prompt), "CASE A prompt package should preserve forged metal identity.");
  assert(/ceramic/i.test(promptPackage.negative_prompt), "CASE A negative prompt should explicitly block ceramic drift.");
}

function runCaseBCeramicDriftBlock() {
  const job = {
    job_id: "weapon-macro-ceramic-drift",
    user_idea: "weapon macro for Mikage Zenith",
    shot_type: "WEAPON_MACRO",
    phase: "material_study",
  };
  const intakeRequest = normalizeIdeaRequest(job);
  const ambiguousIntake = {
    creative_intent: "dramatic object study",
    subject: {
      type: "manufactured_object",
      identity: "Mikage artifact",
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
      shot_type: "WEAPON_MACRO",
      framing: "",
      camera: "",
      background: "",
    },
    lighting: {
      style: "",
      constraints: [],
    },
    core_risks: [],
    anti_drift_rules: [],
    success_criteria: [],
    direction_summary: "weapon macro for Mikage Zenith",
  };

  const precheck = runGeminiPrecheck(ambiguousIntake);
  const promptPackage = buildPromptPackageFromIntake(job, intakeRequest, precheck.revised_intake);
  assert(precheck.status === "REVISE" || precheck.status === "PASS", "CASE B should normalize ambiguous weapon input without rejecting the lane.");
  assert(/weapon/i.test(precheck.revised_intake.subject.type), "CASE B should normalize subject.type to weapon.");
  assert(/greatsword|blade|sword/i.test(precheck.revised_intake.subject.identity), "CASE B should normalize identity to a sword-first subject.");
  assert(/steel|titanium|alloy|forged|metal/i.test(precheck.revised_intake.material.primary), "CASE B should normalize material to forged metal canon.");
  assert(!/ceramic|porcelain/i.test(precheck.revised_intake.material.primary), "CASE B should block ceramic material drift in weapon lane.");
  assert(/rounded industrial object/i.test(promptPackage.negative_prompt), "CASE B should block rounded object drift in the final prompt package.");
}

function runCaseCMaskBiasConflict() {
  const job = {
    job_id: "weapon-macro-mask-bias",
    user_idea: "Mikage Zenith mask relic, porcelain precision, weapon macro",
    shot_type: "WEAPON_MACRO",
    phase: "material_study",
  };
  const intakeRequest = normalizeIdeaRequest(job);
  const maskBiasedIntake = {
    creative_intent: "porcelain relic study",
    subject: {
      type: "mask",
      identity: "porcelain relic",
      must_have: ["mask symmetry"],
      must_not_have: [],
    },
    material: {
      primary: "porcelain ceramic",
      surface: "smooth porcelain shell",
      finish: "clean matte ceramic",
      forbidden_reads: [],
    },
    composition: {
      shot_type: "WEAPON_MACRO",
      framing: "macro object crop",
      camera: "",
      background: "",
    },
    lighting: {
      style: "",
      constraints: [],
    },
    core_risks: [],
    anti_drift_rules: [],
    success_criteria: [],
    direction_summary: "weapon macro with porcelain relic cues",
  };

  const precheck = runGeminiPrecheck(maskBiasedIntake);
  const promptPackage = buildPromptPackageFromIntake(job, intakeRequest, precheck.revised_intake);
  assert(precheck.lane_rule_applied === "WEAPON_MACRO", "CASE C should recognize the WEAPON_MACRO lane.");
  assert(/weapon/i.test(precheck.revised_intake.subject.type), "CASE C should keep weapon type even when mask-biased words appear.");
  assert(/sword|blade|greatsword/i.test(precheck.revised_intake.subject.identity), "CASE C should keep sword-first identity despite mask bias.");
  assert(precheck.lane_priority_override_applied === true, "CASE C should record priority override for weapon lane.");
  assert(/mask-like read/i.test(promptPackage.negative_prompt), "CASE C should explicitly forbid mask-like read in prompt package.");
  assert(!/porcelain/i.test(precheck.revised_intake.material.primary), "CASE C should stop porcelain bleed into weapon lane.");
}

async function runCaseDAbstractFailDiagnostic() {
  const workspace = createTempWorkspace();
  const runsDir = path.join(workspace, "runs");
  process.env.RUNS_DIR = runsDir;
  process.env.GEMINI_API_KEY = "test-key";
  process.env.NOTION_API_KEY = "";
  process.env.MIKAGE_NOTION_DB = "";

  setAnalyzerRunnerMock(async () => buildPassingSignals());
  setDriftDetectorMock(async () => ({
    identity_score: 0.9,
    narrative_score: 0.9,
    aesthetic_integrity_score: 0.85,
    anti_polish_score: 0.8,
    drift_flags: [],
    verdict: "PASS",
    refineable: true,
    refine_reason: "none",
    identity_detail: {},
    narrative_detail: {},
  }));
  setGeminiConnectorMock({
    judgeRenderedImage: async (_imagePath, context = {}) => ({
      decision: "FAIL",
      material_read: "ambiguous object",
      drift_flags: ["abstract object read"],
      fail_rules: ["WEAPON_IDENTITY_MISSING", "SWORD_GEOMETRY_MISSING", "ABSTRACT_OBJECT_DRIFT"],
      corrections: ["restore sword-first geometry"],
      confidence: 0.81,
      raw: {
        pass_fail: "FAIL",
        material_read: "ambiguous object",
        correct_reads: [],
        wrong_reads: ["abstract object read", "rounded industrial object"],
        fail_rules: ["WEAPON_IDENTITY_MISSING", "SWORD_GEOMETRY_MISSING", "ABSTRACT_OBJECT_DRIFT"],
        fix_direction: ["restore sword-first geometry"],
        summary: context.promptPath && /gemini_weapon_validator\.txt$/i.test(context.promptPath)
          ? "FAIL: ambiguous abstract object instead of sword"
          : "FAIL: wrong validator prompt",
        confidence: 0.81,
        gemini_validation_executed: true,
        parse_ok: true,
        error: null,
      },
    }),
  });
  setGeminiIntakeMock(async () => buildWeaponIntake());
  setRenderExecutorMock(async (_job, _token, _spec, opts) => {
    const outputFile = writeRealPng(path.join(opts.output_dir, "mock-render.png"));
    return {
      success: true,
      render: {
        output_file: outputFile,
        seed_used: 979,
        render_time_ms: 9,
        status: "RENDERED",
      },
    };
  });

  resetModule(path.resolve(__dirname, "orchestrator.js"));
  const { orchestrate } = require("./orchestrator");

  const summary = await orchestrate({
    job_id: "weapon-macro-diagnostic-fail",
    user_idea: "Zenith Blade macro with abstract heated core silhouette",
    shot_type: "WEAPON_MACRO",
    phase: "material_study",
    render: {
      width: 1280,
      height: 768,
      performance: "Speed",
    },
  });

  assert(summary.decision === "REJECT", "CASE D should reject when the judge sees ambiguous abstract object drift.");
  assert(summary.failed_rules.includes("WEAPON_IDENTITY_MISSING"), "CASE D should expose WEAPON_IDENTITY_MISSING.");
  assert(summary.failed_rules.includes("SWORD_GEOMETRY_MISSING"), "CASE D should expose SWORD_GEOMETRY_MISSING.");
  assert(summary.failed_rules.includes("ABSTRACT_OBJECT_DRIFT"), "CASE D should expose ABSTRACT_OBJECT_DRIFT.");
  assert(
    /WEAPON_IDENTITY_MISSING|SWORD_GEOMETRY_MISSING|ABSTRACT_OBJECT_DRIFT/.test(String(summary.dominant_fail_reason || "")),
    "CASE D should report a weapon-specific dominant fail reason."
  );
}

async function main() {
  await runCaseAPassableWeapon();
  runCaseBCeramicDriftBlock();
  runCaseCMaskBiasConflict();
  await runCaseDAbstractFailDiagnostic();

  if (failed > 0) {
    console.error(`weapon_macro_lane.test.js: ${failed} failed, ${passed} passed`);
    process.exit(1);
  }
  console.log(`weapon_macro_lane.test.js: ${passed} passed, 0 failed`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
