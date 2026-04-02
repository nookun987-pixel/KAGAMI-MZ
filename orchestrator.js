"use strict";

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client: NotionClient } = require("@notionhq/client");

const { executeRender } = require("./render/render_executor");
const { issueToken } = require("./control/precheck");
const { normalizeIdeaRequest } = require("./idea_intake");
const { getGeminiConfig } = require("./gemini_env");
const { runGeminiIntake } = require("./gemini_intake");
const { runGeminiPrecheck } = require("./gemini_precheck");
const { buildPromptPackageFromIntake } = require("./claude_spec_bridge");
const { judgeRenderedImage, validateGeminiRuntime } = require("./gemini_connector");
const { getLaneRule } = require("./lane_rules");
const { buildFixBrief } = require("./fix_brief_builder");
const { buildCorrectedPromptPackage } = require("./claude_correction_bridge");
const { getMikageMemoryContext, getRetrieverMode, isRealVertexVerified, areCloudCredentialsPresent } = require("./rag/rag_retriever_resolver");
const {
  loadCanonV2,
  applyCanonV2ToSpec,
  validateCanonJob,
  validateCanonPromptPackage,
  resolveShotType,
} = require("./control/canon_v2_control");
const { runAllAnalyzers } = require("./analyzers/run_all_analyzers");
const { detectDrift } = require("./drift/drift_detector");
const { runRuleEngine } = require("./validators/mikage_rule_engine");
const { getSpecPath, getVersions } = require("./validators/load_mikage_specs");
const { isVLMAvailable } = require("./analyzers/vlm_semantic_analyzer");
const { assertPreWriteInvariants, assertCanonRecordIsAllow } = require("./core/invariants");
const { validate: validateSchema } = require("./core/schema_registry");
const { createRunTracker, STATES: SM_STATES } = require("./core/run_tracker");

const ROOT_DIR = __dirname;
const RUNS_DIR = path.resolve(process.env.RUNS_DIR || path.join(ROOT_DIR, "runs"));
const FOOOCUS_URL = process.env.FOOOCUS_API || process.env.FOOOCUS_API_URL || "http://127.0.0.1:7865";
const OLLAMA_URL = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const NOTION_API_KEY = process.env.NOTION_API_KEY || "";
const NOTION_DB_ID = process.env.MIKAGE_NOTION_DB || "";
const MAX_RENDER_RETRIES = parseInt(process.env.MAX_RENDER_RETRIES || "3", 10);
const HARD_REJECT_SIGNALS = [
  "human_eyes_detected",
  "pvc_plastic_read",
  "toon_shading",
  "magenta_neon_spill",
  "logo_overlap_ratio",
];
const SHOT_RENDER_PROFILES = {
  MATERIAL_MACRO: {
    width: 1024,
    height: 1024,
    steps: 28,
    guidance_scale: 6.2,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    sharpness: 1.7,
    candidate_count: 3,
    disable_refiner: true,
    seed_policy: "small_spread",
    atmosphere_bias: "low",
    cfg_bias: "contour_readability",
  },
  MASK_MACRO: {
    width: 1152,
    height: 1152,
    steps: 30,
    guidance_scale: 6.8,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    sharpness: 1.8,
    candidate_count: 3,
    disable_refiner: true,
    seed_policy: "small_spread",
    atmosphere_bias: "low",
    cfg_bias: "symmetry_precision",
  },
  ENTITY_MEDIUM: {
    width: 1024,
    height: 1344,
    steps: 28,
    guidance_scale: 6.5,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    sharpness: 1.5,
    candidate_count: 2,
    disable_refiner: true,
    seed_policy: "small_spread",
    atmosphere_bias: "medium",
    cfg_bias: "silhouette_layering",
  },
  WEAPON_MACRO: {
    width: 1280,
    height: 768,
    steps: 30,
    guidance_scale: 6.9,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    sharpness: 1.9,
    candidate_count: 3,
    disable_refiner: true,
    seed_policy: "small_spread",
    atmosphere_bias: "low",
    cfg_bias: "edge_geometry",
  },
  ENVIRONMENT_WIDE: {
    width: 1344,
    height: 768,
    steps: 24,
    guidance_scale: 5.8,
    sampler: "dpmpp_2m_sde_gpu",
    scheduler: "karras",
    sharpness: 1.2,
    candidate_count: 2,
    disable_refiner: true,
    seed_policy: "locked",
    atmosphere_bias: "controlled",
    cfg_bias: "figure_anchor",
  },
};
const CANDIDATE_TIER_ORDER = ["REJECT", "BEST_OF_BATCH", "USABLE_INTERNAL", "USABLE_CONTENT", "PASS_STRONG"];

function nowIso() {
  return new Date().toISOString();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function normalizeText(value) {
  return String(value || "").trim();
}

function dedupeStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

function writeJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  // Safety: verify we can serialize to valid JSON before writing
  let jsonStr;
  try {
    jsonStr = JSON.stringify(payload, null, 2);
  } catch (e) {
    // If payload itself is not serializable, write a safe error object
    jsonStr = JSON.stringify({
      error: "SERIALIZATION_FAILED",
      message: String(e.message || e).slice(0, 500),
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  // Double-check: parse the string we're about to write
  try {
    JSON.parse(jsonStr);
  } catch (_) {
    jsonStr = JSON.stringify({
      error: "JSON_INTEGRITY_CHECK_FAILED",
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
  fs.writeFileSync(filePath, jsonStr, "utf-8");
  return filePath;
}

// ---------------------------------------------------------------------------
// SCHEMA-VALIDATED WRITE HELPERS
// These MUST be used for all critical entity writes.
// Invalid data → hard throw → pipeline stops.
// ---------------------------------------------------------------------------

function writeValidatedJson(filePath, entityType, payload) {
  const result = validateSchema(entityType, payload, { strict: false });
  if (!result.valid) {
    const msg = `[SCHEMA] Cannot write ${entityType} to ${path.basename(filePath)}: ${result.errors.join("; ")}`;
    console.error(msg);
    throw new Error(msg);
  }
  return writeJson(filePath, payload);
}

function writeFinalDecision(filePath, payload) {
  return writeValidatedJson(filePath, "final_decision", payload);
}

function writePostValidation(filePath, payload) {
  return writeValidatedJson(filePath, "validator_result", payload);
}

function writeGeminiValidation(filePath, payload) {
  return writeValidatedJson(filePath, "gemini_result", payload);
}

function writeText(filePath, body) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, String(body || ""), "utf-8");
  return filePath;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function buildArtifactPaths(runDir) {
  return {
    run_dir: runDir,
    intake_request: path.join(runDir, "intake_request.json"),
    gemini_intake: path.join(runDir, "gemini_intake.json"),
    gemini_precheck: path.join(runDir, "gemini_precheck.json"),
    prompt_package: path.join(runDir, "prompt_package.json"),
    prompt_before: path.join(runDir, "prompt_before.json"),
    prompt_after: path.join(runDir, "prompt_after.json"),
    output_png: path.join(runDir, "output.png"),
    validation: path.join(runDir, "validation.json"),
    gemini_validation: path.join(runDir, "gemini_validation.json"),
    fix_brief: path.join(runDir, "fix_brief.json"),
    corrected_prompt_package: path.join(runDir, "corrected_prompt_package.json"),
    correction_diff: path.join(runDir, "correction_diff.json"),
    gemini_runtime_check: path.join(runDir, "gemini_runtime_check.json"),
    gemini_runtime_probe: path.join(runDir, "gemini_runtime_probe.json"),
    merged_decision: path.join(runDir, "merged_decision.json"),
    run_loop_trace: path.join(runDir, "run_loop_trace.json"),
    summary_txt: path.join(runDir, "summary.txt"),
    final_payload: path.join(runDir, "final_payload.json"),
    pre_validation: path.join(runDir, "pre_validation.json"),
    post_validation: path.join(runDir, "post_validation.json"),
    final_decision: path.join(runDir, "final_decision.json"),
    job_summary: path.join(runDir, "job_summary.json"),
  };
}

function mergeGeminiPrecheckIntake(geminiIntake, geminiPrecheck) {
  if (!geminiPrecheck || geminiPrecheck.status !== "REVISE") {
    return geminiIntake;
  }
  const revised = geminiPrecheck.revised_intake && typeof geminiPrecheck.revised_intake === "object"
    ? geminiPrecheck.revised_intake
    : geminiIntake;
  return {
    ...geminiIntake,
    ...revised,
    precheck_status: geminiPrecheck.status,
    precheck_risk_level: geminiPrecheck.risk_level,
    precheck_issues: toArray(geminiPrecheck.issues),
    precheck_fixes: toArray(geminiPrecheck.fixes),
  };
}

function buildPrecheckFailureDecision(job, artifactPaths, continuity, geminiPrecheck) {
  const precheckIssues = dedupeStrings(toArray(geminiPrecheck && geminiPrecheck.issues));
  const precheckFixes = dedupeStrings(toArray(geminiPrecheck && geminiPrecheck.fixes));
  const reason = precheckIssues[0] || "Gemini precheck rejected intake";
  return {
    job_id: job.job_id,
    status: "FAIL",
    decision: "REJECT",
    decision_reason: `REJECT: ${reason}`,
    final_decision_reason: `REJECT: ${reason}`,
    output_files: [],
    output_file_path: null,
    validator_executed: false,
    gemini_validation_executed: false,
    gemini_pass_fail: null,
    gemini_error: null,
    failed_rules: ["GEMINI_PRECHECK_REJECT"],
    artifact_paths: artifactPaths,
    continuity,
    attempt_count: 0,
    precheck_status: geminiPrecheck ? geminiPrecheck.status : "REJECT",
    precheck_pass: false,
    precheck_risk_level: geminiPrecheck ? geminiPrecheck.risk_level : "HIGH",
    precheck_issues: precheckIssues,
    precheck_fixes: precheckFixes,
    lane_rule_applied: geminiPrecheck ? geminiPrecheck.lane_rule_applied || null : null,
    lane_required_anchors: geminiPrecheck ? toArray(geminiPrecheck.lane_required_anchors) : [],
    lane_forbidden_anchors: geminiPrecheck ? toArray(geminiPrecheck.lane_forbidden_anchors) : [],
    lane_priority_override_applied: !!(geminiPrecheck && geminiPrecheck.lane_priority_override_applied),
    dominant_fail_reason: reason,
    precheck_artifact: artifactPaths.gemini_precheck,
  };
}

function isIdeaDrivenJob(job) {
  return !!(job && job.user_idea);
}

function getEffectiveRenderSettings(renderSpec = {}, baseRender = {}, job = {}) {
  const shotType = normalizeShotType(renderSpec.shot_type || baseRender.shot_type || "ENTITY_MEDIUM");
  const shotProfile = SHOT_RENDER_PROFILES[shotType] || SHOT_RENDER_PROFILES.ENTITY_MEDIUM;
  const profile = String(process.env.RENDER_PROFILE || "").trim() || "DEFAULT";
  
  // Test mode overrides
  const isTestMode = job.test_mode === true;
  const testCandidateCount = isTestMode ? Math.min(1, job.max_candidates || 1) : null;
  
  if (profile === "FAST_TEST" || isTestMode) {
    return {
      profile: isTestMode ? "TEST_MODE" : profile,
      shot_type: shotType,
      width: parseInt(process.env.FAST_WIDTH || String(shotProfile.width || 512), 10),
      height: parseInt(process.env.FAST_HEIGHT || String(shotProfile.height || 512), 10),
      steps: parseInt(process.env.FAST_STEPS || "16", 10),
      disable_refiner: String(process.env.FAST_DISABLE_REFINER || "true").toLowerCase() === "true",
      guidance_scale: shotProfile.guidance_scale,
      sampler: shotProfile.sampler,
      scheduler: shotProfile.scheduler,
      sharpness: shotProfile.sharpness,
      candidate_count: testCandidateCount || shotProfile.candidate_count,
      seed_policy: shotProfile.seed_policy,
      performance: baseRender.performance || renderSpec.performance || "Quality",
      test_mode: isTestMode,
    };
  }
  return {
    profile,
    shot_type: shotType,
    width: renderSpec.width || baseRender.width || shotProfile.width || 1024,
    height: renderSpec.height || baseRender.height || shotProfile.height || 1024,
    steps: parseInt(process.env.SHOT_STEPS_OVERRIDE || "", 10) || renderSpec.steps || baseRender.steps || shotProfile.steps || -1,
    disable_refiner: renderSpec.disable_refiner ?? baseRender.disable_refiner ?? shotProfile.disable_refiner ?? false,
    guidance_scale: parseFloat(process.env.SHOT_GUIDANCE_OVERRIDE || "") || renderSpec.guidance_scale || baseRender.guidance_scale || shotProfile.guidance_scale || 7,
    sampler: process.env.SHOT_SAMPLER_OVERRIDE || renderSpec.sampler || baseRender.sampler || shotProfile.sampler || null,
    scheduler: process.env.SHOT_SCHEDULER_OVERRIDE || renderSpec.scheduler || baseRender.scheduler || shotProfile.scheduler || null,
    sharpness: renderSpec.sharpness || baseRender.sharpness || shotProfile.sharpness || null,
    candidate_count: parseInt(process.env.SHOT_CANDIDATE_COUNT_OVERRIDE || "", 10) || renderSpec.candidate_count || baseRender.candidate_count || shotProfile.candidate_count || 1,
    seed_policy: process.env.SHOT_SEED_POLICY_OVERRIDE || renderSpec.seed_policy || baseRender.seed_policy || shotProfile.seed_policy || "locked",
    performance: renderSpec.performance || baseRender.performance || "Quality",
    test_mode: isTestMode,
  };
}

function getLocalRegistryPath() {
  return path.join(RUNS_DIR, "canon_memory_registry.json");
}

function normalizeContinuity(job, canonVersion) {
  return {
    entity_id:
      job.entity_id ??
      (job.identity && (job.identity.entity_id ?? job.identity.character_id)) ??
      null,
    entity_class:
      job.entity_class ??
      (job.identity && (job.identity.entity_class ?? job.identity.archetype)) ??
      null,
    zone:
      job.zone ??
      (job.narrative && job.narrative.zone) ??
      null,
    weapon:
      job.weapon ??
      (job.art_direction && job.art_direction.weapon) ??
      null,
    status:
      job.status ??
      (job.identity && job.identity.status) ??
      null,
    canon_version: canonVersion || "v2",
  };
}

function readLocalRegistry() {
  const registryPath = getLocalRegistryPath();
  if (!fs.existsSync(registryPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeLocalRegistry(records) {
  const registryPath = getLocalRegistryPath();
  writeJson(registryPath, records);
  return registryPath;
}

function findBaselineRecord(entityId) {
  if (!entityId) {
    return {
      found: false,
      source: null,
      canon_version: null,
      reference: null,
      record: null,
    };
  }

  const registry = readLocalRegistry()
    .filter((record) => record && record.entity_id === entityId && record.decision === "ALLOW")
    .sort((a, b) => String(b.timestamp || "").localeCompare(String(a.timestamp || "")));

  if (registry.length === 0) {
    return {
      found: false,
      source: null,
      canon_version: null,
      reference: null,
      record: null,
    };
  }

  const latest = registry[0];
  return {
    found: true,
    source: "local",
    canon_version: latest.canon_version || null,
    reference: latest.job_id || null,
    record: latest,
  };
}

function appendLocalRegistryRecord(record) {
  const registry = readLocalRegistry();
  registry.push(record);
  const targetPath = writeLocalRegistry(registry);
  return {
    wrote: true,
    target: "local",
    path: targetPath,
  };
}

function loadJobFromFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Job file not found: ${resolved}`);
  }
  return readJson(resolved);
}

function listToSentence(value) {
  return dedupeStrings(toArray(value));
}

function buildBaseSpec(job) {
  const art = job.art_direction || {};
  const narrative = job.narrative || {};
  const strategy = job.strategy || {};

  return {
    subject: dedupeStrings([
      job.identity && job.identity.name,
      job.identity && job.identity.archetype,
      job.identity && job.identity.visual_anchor,
    ]).join(", "),
    texture: dedupeStrings([
      ...listToSentence(art.material),
      ...listToSentence(art.texture),
      ...listToSentence(art.finish),
      ...listToSentence(art.surface),
    ]),
    lighting: dedupeStrings([
      ...listToSentence(art.lighting),
      ...listToSentence(art.light),
      ...listToSentence(art.mood),
    ]),
    composition_rules: dedupeStrings([
      ...listToSentence(art.style),
      ...listToSentence(strategy.style),
      narrative.scene,
      narrative.theme,
      narrative.mood,
      strategy.color_palette,
    ]),
    negative_prompt: dedupeStrings([
      ...listToSentence(art.forbidden),
      ...listToSentence(job.forbidden),
    ]),
  };
}

function normalizeShotType(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (["MATERIAL_MACRO", "MASK_MACRO", "ENTITY_MEDIUM", "WEAPON_MACRO", "ENVIRONMENT_WIDE"].includes(raw)) {
    return raw;
  }
  if (/macro_material|material_study|material/i.test(raw)) return "MATERIAL_MACRO";
  if (/mask/i.test(raw)) return "MASK_MACRO";
  if (/weapon|blade/i.test(raw)) return "WEAPON_MACRO";
  if (/environment|wide/i.test(raw)) return "ENVIRONMENT_WIDE";
  return "ENTITY_MEDIUM";
}

function resolveLaneRuleDebug(shotType, promptPackage = {}, extra = {}) {
  const laneRule = getLaneRule(shotType);
  return {
    lane_rule_applied:
      extra.lane_rule_applied ||
      promptPackage.lane_rule_applied ||
      (laneRule ? laneRule.lane : null),
    lane_required_anchors: dedupeStrings([
      ...toArray(promptPackage.lane_required_anchors),
      ...toArray(extra.lane_required_anchors),
      ...(laneRule ? toArray(laneRule.required) : []),
    ]),
    lane_forbidden_anchors: dedupeStrings([
      ...toArray(promptPackage.lane_forbidden_anchors),
      ...toArray(extra.lane_forbidden_anchors),
      ...(laneRule ? toArray(laneRule.forbidden) : []),
    ]),
    lane_priority_override_applied:
      extra.lane_priority_override_applied === true ||
      promptPackage.lane_priority_override_applied === true ||
      !!(laneRule && laneRule.priority_override),
  };
}

function resolveGeminiJudgePromptPath(shotType) {
  const normalized = normalizeShotType(shotType);
  if (normalized === "WEAPON_MACRO") {
    return path.join(ROOT_DIR, "prompts", "gemini_weapon_validator.txt");
  }
  return path.join(ROOT_DIR, "prompts", "gemini_material_validator.txt");
}

function resolveColorDebug(promptPackage = {}, geminiValidation = null) {
  const source = dedupeStrings([
    ...toArray(geminiValidation && geminiValidation.fail_rules),
    ...toArray(geminiValidation && geminiValidation.wrong_reads),
    geminiValidation && geminiValidation.summary,
    geminiValidation && geminiValidation.material_read,
  ]);
  const shotType = normalizeShotType(
    promptPackage.shot_type ||
    (promptPackage.render_spec && promptPackage.render_spec.shot_type) ||
    ""
  );
  const colorFailTokens = dedupeStrings([
    ...source.filter((item) => /COLOR_NEON_DRIFT|OVERSATURATION_DRIFT|PURE_WHITE_DRIFT|PURE_BLACK_DRIFT|PLASTIC_COLOR_DRIFT|CRIMSON_OVERUSE/i.test(String(item || ""))),
    ...(source.some((item) => /neon|rgb clean|magenta synthetic/i.test(String(item || ""))) ? ["COLOR_NEON_DRIFT"] : []),
    ...(source.some((item) => /oversaturat/i.test(String(item || ""))) ? ["OVERSATURATION_DRIFT"] : []),
    ...(source.some((item) => /pure white|#ffffff|sterile white/i.test(String(item || ""))) ? ["PURE_WHITE_DRIFT"] : []),
    ...(source.some((item) => /pure black|#000000|featureless void|dead black/i.test(String(item || ""))) ? ["PURE_BLACK_DRIFT"] : []),
    ...(source.some((item) => /plastic color|toy-like|synthetic clean|digital clean/i.test(String(item || ""))) ? ["PLASTIC_COLOR_DRIFT"] : []),
    ...(source.some((item) => /crimson overuse|full-frame red|red flood/i.test(String(item || ""))) ? ["CRIMSON_OVERUSE"] : []),
    ...(shotType === "WEAPON_MACRO" && source.some((item) => /ceramic|porcelain/i.test(String(item || ""))) ? ["PURE_WHITE_DRIFT"] : []),
    ...(shotType === "WEAPON_MACRO" && source.some((item) => /digital clean|rgb clean|synthetic clean|plastic color|toy-like/i.test(String(item || ""))) ? ["PLASTIC_COLOR_DRIFT"] : []),
  ]);
  const forbiddenColorDetected = colorFailTokens.slice();
  const hardFailTokens = colorFailTokens.filter((item) => ["COLOR_NEON_DRIFT", "PURE_WHITE_DRIFT", "PURE_BLACK_DRIFT", "PLASTIC_COLOR_DRIFT"].includes(item));
  const softFailTokens = colorFailTokens.filter((item) => ["OVERSATURATION_DRIFT", "CRIMSON_OVERUSE"].includes(item));
  const lanePaletteMatch = shotType === "WEAPON_MACRO"
    ? !source.some((item) => /ceramic|porcelain|digital clean|rgb clean|synthetic clean|plastic color|toy-like/i.test(String(item || "")))
    : shotType === "MATERIAL_MACRO" || shotType === "MASK_MACRO"
      ? !source.some((item) => /pure white|#ffffff|pure black|#000000|featureless void/i.test(String(item || "")))
      : true;
  return {
    color_canon_applied: promptPackage.color_canon_applied === true,
    palette_used: dedupeStrings(toArray(promptPackage.palette_used)),
    color_fail_tokens: colorFailTokens,
    hard_color_fail_tokens: hardFailTokens,
    soft_color_fail_tokens: softFailTokens,
    color_severity:
      hardFailTokens.length > 0 ? "HIGH" :
      softFailTokens.length > 0 ? "MEDIUM" :
      "LOW",
    saturation_estimate:
      softFailTokens.includes("OVERSATURATION_DRIFT") || hardFailTokens.includes("COLOR_NEON_DRIFT") ? "HIGH" :
      promptPackage.color_canon_applied === true ? "LOW" : null,
    crimson_area_estimate:
      colorFailTokens.includes("CRIMSON_OVERUSE") ? "HIGH" :
      dedupeStrings(toArray(promptPackage.palette_used)).includes("restrained_crimson") ? "CONTROLLED" : null,
    shadow_ratio_estimate: promptPackage.color_canon_applied === true ? "0.70" : null,
    lane_palette_match: lanePaletteMatch,
    forbidden_color_detected: dedupeStrings(forbiddenColorDetected),
    color_dominant_fail_reason: forbiddenColorDetected[0] || null,
  };
}

function resolveGenerationMode(job = {}, promptPackage = {}) {
  const raw =
    promptPackage.generation_mode ||
    job.generation_mode ||
    "exploration";
  return String(raw || "").trim().toLowerCase() === "reproduction" ? "reproduction" : "exploration";
}

function resolveReferenceMaster(job = {}, promptPackage = {}) {
  const source =
    (promptPackage.reference_master && typeof promptPackage.reference_master === "object" ? promptPackage.reference_master : null) ||
    (job.reference_master && typeof job.reference_master === "object" ? job.reference_master : null);
  if (!source) return null;
  return {
    candidate_id: normalizeText(source.candidate_id) || null,
    seed: Number.isFinite(source.seed) ? source.seed : null,
    image_path: normalizeText(source.image_path) || null,
    lane: normalizeShotType(source.lane || job.shot_type || promptPackage.shot_type || ""),
    silhouette_notes: normalizeText(source.silhouette_notes) || null,
    camera_notes: normalizeText(source.camera_notes) || null,
  };
}

function resolveReproductionConstraints(job = {}, promptPackage = {}, generationMode = "exploration") {
  if (generationMode !== "reproduction") return null;
  const source =
    (promptPackage.reproduction_constraints && typeof promptPackage.reproduction_constraints === "object" ? promptPackage.reproduction_constraints : null) ||
    (job.reproduction_constraints && typeof job.reproduction_constraints === "object" ? job.reproduction_constraints : null) ||
    {};
  return {
    camera_lock: source.camera_lock !== false,
    silhouette_lock: source.silhouette_lock !== false,
    proportion_lock: source.proportion_lock !== false,
    crimson_restraint_lock: source.crimson_restraint_lock !== false,
    variation_budget: normalizeText(source.variation_budget || "minimal").toLowerCase() || "minimal",
  };
}

function resolveImageAnchorConfig(job = {}, promptPackage = {}, generationMode = "exploration", shotType = null) {
  if (generationMode !== "reproduction") {
    return {
      reproduction_anchor_mode: null,
      anchor_image_path: null,
      anchor_strength: null,
      denoise_strength: null,
      composition_lock_strength: null,
      silhouette_lock_strength: null,
      anchor_method_used: null,
      anchor_image_used: null,
      anchor_strength_used: null,
      denoise_strength_used: null,
      image_anchor_success_expected: false,
      preservation_mode: null,
      reconstruction_priority: null,
      prompt_weight_reduction_when_anchor_present: null,
      weapon_baseline_applied: false,
      weapon_baseline_override_applied: false,
      weapon_baseline_override_reason: null,
    };
  }
  const mode = String(
    promptPackage.reproduction_anchor_mode ||
    job.reproduction_anchor_mode ||
    "prompt_anchored"
  ).trim().toLowerCase();
  const anchorImagePath = normalizeText(
    promptPackage.anchor_image_path ||
    job.anchor_image_path
  ) || null;
  const anchorStrength = Number(
    promptPackage.anchor_strength !== undefined ? promptPackage.anchor_strength : job.anchor_strength
  );
  const denoiseStrength = Number(
    promptPackage.denoise_strength !== undefined ? promptPackage.denoise_strength : job.denoise_strength
  );
  const compositionLockStrength = Number(
    promptPackage.composition_lock_strength !== undefined ? promptPackage.composition_lock_strength : job.composition_lock_strength
  );
  const silhouetteLockStrength = Number(
    promptPackage.silhouette_lock_strength !== undefined ? promptPackage.silhouette_lock_strength : job.silhouette_lock_strength
  );
  const anchorMethodUsed = normalizeText(promptPackage.anchor_method_used || job.anchor_method_used) || null;
  const imageAnchorSuccessExpected =
    promptPackage.image_anchor_success_expected === true ||
    job.image_anchor_success_expected === true ||
    (mode === "image_anchored" && !!anchorImagePath);
  return {
    reproduction_anchor_mode: mode,
    anchor_image_path: anchorImagePath,
    anchor_strength: Number.isFinite(anchorStrength) ? anchorStrength : null,
    denoise_strength: Number.isFinite(denoiseStrength) ? denoiseStrength : null,
    composition_lock_strength: Number.isFinite(compositionLockStrength) ? compositionLockStrength : null,
    silhouette_lock_strength: Number.isFinite(silhouetteLockStrength) ? silhouetteLockStrength : null,
    anchor_method_used: anchorMethodUsed,
    anchor_image_used: normalizeText(promptPackage.anchor_image_used || anchorImagePath) || null,
    anchor_strength_used: Number.isFinite(Number(promptPackage.anchor_strength_used)) ? Number(promptPackage.anchor_strength_used) : (Number.isFinite(anchorStrength) ? anchorStrength : null),
    denoise_strength_used: Number.isFinite(Number(promptPackage.denoise_strength_used)) ? Number(promptPackage.denoise_strength_used) : (Number.isFinite(denoiseStrength) ? denoiseStrength : null),
    image_anchor_success_expected: imageAnchorSuccessExpected,
    ...resolveWeaponBaselinePreservation(
      normalizeText(promptPackage.preservation_mode || job.preservation_mode) || null,
      normalizeText(promptPackage.reconstruction_priority || job.reconstruction_priority) || null,
      Number.isFinite(Number(promptPackage.prompt_weight_reduction_when_anchor_present)) ? Number(promptPackage.prompt_weight_reduction_when_anchor_present) : (Number.isFinite(Number(job.prompt_weight_reduction_when_anchor_present)) ? Number(job.prompt_weight_reduction_when_anchor_present) : null),
      shotType || normalizeShotType(promptPackage.shot_type || job.shot_type || "")
    ),
  };
}

function resolveWeaponBaselinePreservation(preservationMode, reconstructionPriority, promptWeightReduction, shotType) {
  const isWeaponLane = shotType === "WEAPON_MACRO";
  let finalMode = preservationMode;
  let baselineApplied = false;
  let overrideApplied = false;
  let overrideReason = null;

  if (isWeaponLane) {
    if (!finalMode) {
      finalMode = "strong_preservation";
      baselineApplied = true;
    } else if (finalMode !== "strong_preservation") {
      overrideApplied = true;
      overrideReason = "WEAPON_BASELINE_LOCK";
      finalMode = "strong_preservation";
      baselineApplied = true;
    }
  }

  const isStrong = finalMode === "strong_preservation";
  return {
    preservation_mode: finalMode,
    reconstruction_priority: reconstructionPriority || (isStrong ? "object_first" : null),
    prompt_weight_reduction_when_anchor_present: promptWeightReduction ?? (isStrong ? 0.4 : null),
    weapon_baseline_applied: baselineApplied,
    weapon_baseline_override_applied: overrideApplied,
    weapon_baseline_override_reason: overrideReason,
  };
}

function resolveReproductionDebug(job = {}, promptPackage = {}, geminiValidation = null) {
  const generationMode = resolveGenerationMode(job, promptPackage);
  const referenceMaster = resolveReferenceMaster(job, promptPackage);
  const reproductionConstraints = resolveReproductionConstraints(job, promptPackage, generationMode);
  const debugShotType = normalizeShotType(promptPackage.shot_type || (promptPackage.render_spec && promptPackage.render_spec.shot_type) || job.shot_type || "");
  const imageAnchorConfig = resolveImageAnchorConfig(job, promptPackage, generationMode, debugShotType);
  const source = dedupeStrings([
    ...toArray(geminiValidation && geminiValidation.fail_rules),
    ...toArray(geminiValidation && geminiValidation.wrong_reads),
    geminiValidation && geminiValidation.summary,
    geminiValidation && geminiValidation.material_read,
    geminiValidation && geminiValidation.object_read,
  ]);
  const failLabels = generationMode === "reproduction"
    ? dedupeStrings([
        ...(imageAnchorConfig.reproduction_anchor_mode === "image_anchored" && !imageAnchorConfig.anchor_method_used
          ? ["REPRO_ANCHOR_NOT_APPLIED"]
          : []),
        ...(imageAnchorConfig.reproduction_anchor_mode === "image_anchored" && Number.isFinite(imageAnchorConfig.anchor_strength) && imageAnchorConfig.anchor_strength < 0.7
          ? ["REPRO_ANCHOR_TOO_WEAK"]
          : []),
        ...(imageAnchorConfig.reproduction_anchor_mode === "image_anchored" && Number.isFinite(imageAnchorConfig.denoise_strength) && imageAnchorConfig.denoise_strength > 0.25
          ? ["REPRO_DENOISE_TOO_HIGH"]
          : []),
        ...(source.some((item) => /camera drift|side profile|perspective tilt|rotation|cropping|cropped blade|camera mismatch/i.test(String(item || "")))
          ? ["REPRO_CAMERA_DRIFT"]
          : []),
        ...(source.some((item) => /silhouette drift|outline drift|device-like|ring|fan|turbine|wheel|slab read|spear-like|silhouette mismatch/i.test(String(item || "")))
          ? ["REPRO_SILHOUETTE_DRIFT"]
          : []),
        ...(source.some((item) => /proportion drift|guard drift|tip redesign|body redesign|proportion mismatch|short silhouette|widening guard|narrowing/i.test(String(item || "")))
          ? ["REPRO_PROPORTION_DRIFT"]
          : []),
        ...(source.some((item) => /crimson overuse|red flood|glow spread|crimson drift|full-frame red/i.test(String(item || "")))
          ? ["REPRO_CRIMSON_DRIFT"]
          : []),
        ...(source.some((item) => /composition escape|framing escape|anchor escape|camera escape/i.test(String(item || "")))
          ? ["REPRO_COMPOSITION_ESCAPE"]
          : []),
      ])
    : [];
  const imageAnchoredUnavailable =
    generationMode === "reproduction" &&
    imageAnchorConfig.reproduction_anchor_mode === "image_anchored" &&
    (!imageAnchorConfig.anchor_image_path || !imageAnchorConfig.anchor_method_used);
  return {
    generation_mode: generationMode,
    reference_master: referenceMaster,
    reference_master_used: generationMode === "reproduction" && !!referenceMaster,
    reproduction_constraints: reproductionConstraints,
    reproduction_constraints_used: generationMode === "reproduction" && !!reproductionConstraints,
    reproduction_fail_labels: failLabels,
    reproduction_anchor_mode: imageAnchorConfig.reproduction_anchor_mode,
    anchor_image_path: imageAnchorConfig.anchor_image_path,
    anchor_strength: imageAnchorConfig.anchor_strength,
    denoise_strength: imageAnchorConfig.denoise_strength,
    composition_lock_strength: imageAnchorConfig.composition_lock_strength,
    silhouette_lock_strength: imageAnchorConfig.silhouette_lock_strength,
    anchor_method_used: imageAnchorConfig.anchor_method_used,
    anchor_image_used: imageAnchorConfig.anchor_image_used,
    anchor_strength_used: imageAnchorConfig.anchor_strength_used,
    denoise_strength_used: imageAnchorConfig.denoise_strength_used,
    image_anchor_success_expected: imageAnchorConfig.image_anchor_success_expected,
    image_anchored_reproduction_available: !imageAnchoredUnavailable,
    reproduction_mode_outcome: imageAnchoredUnavailable
      ? "IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE"
      : generationMode === "reproduction" && imageAnchorConfig.reproduction_anchor_mode === "image_anchored"
        ? "image-anchored path applied"
        : null,
    preservation_mode: imageAnchorConfig.preservation_mode || null,
    reconstruction_priority: imageAnchorConfig.reconstruction_priority || null,
    prompt_weight_reduction_when_anchor_present: imageAnchorConfig.prompt_weight_reduction_when_anchor_present ?? null,
    preservation_mode_used: imageAnchorConfig.preservation_mode || null,
    backend_method_used: imageAnchorConfig.anchor_method_used || null,
    effective_denoise_strength: imageAnchorConfig.denoise_strength ?? null,
    effective_preservation_strength: imageAnchorConfig.anchor_strength ?? null,
    weapon_baseline_applied: imageAnchorConfig.weapon_baseline_applied === true,
    weapon_baseline_override_applied: imageAnchorConfig.weapon_baseline_override_applied === true,
    weapon_baseline_override_reason: imageAnchorConfig.weapon_baseline_override_reason || null,
  };
}

function inferShotType(job, promptPackage) {
  const explicit = job.shot_type || (promptPackage && promptPackage.render_spec && promptPackage.render_spec.shot_type);
  if (explicit) return normalizeShotType(explicit);
  const source = [
    job.phase,
    job.entity_class,
    job.type,
    job.input && job.input.prompt,
    promptPackage && promptPackage.phase_target,
    promptPackage && promptPackage.structured_prompt,
    job.locked_prompt_package && job.locked_prompt_package.prompt,
  ].join(" ");
  if (/material/i.test(source)) return "MATERIAL_MACRO";
  if (/mask/i.test(source)) return "MASK_MACRO";
  if (/weapon|blade/i.test(source)) return "WEAPON_MACRO";
  if (/environment|wide/i.test(source)) return "ENVIRONMENT_WIDE";
  return "ENTITY_MEDIUM";
}

function getShotTypeRules(shotType) {
  const type = normalizeShotType(shotType);
  const common = [
    "one single main subject only",
    "subject must occupy clear central frame presence",
    "object/entity must be fully readable",
    "no abstract composition",
    "no atmospheric-only image",
    "no empty scene as final subject",
    "centered or compositionally dominant subject",
    "single clearly visible subject",
    "manufactured object clearly readable",
    "hard contour evidence",
    "not abstract",
  ];
  const perType = {
    MATERIAL_MACRO: [
      "material surface must visibly belong to a manufactured object",
      "must show manufactured ceramic surface",
      "must not read as wall, stone, or plaster slab",
      "must keep curvature, edge, rim, bevel, seam, or contour evidence",
      "visible edge, rim, bevel, curve, seam, or manufactured contour",
    ],
    MASK_MACRO: [
      "must show mask geometry, eye slit, and facial symmetry cues",
      "not allowed to collapse into abstract white texture",
      "mask geometry must remain readable as designed object",
    ],
    ENTITY_MEDIUM: [
      "full silhouette or torso readability required",
      "no crop that destroys identity",
    ],
    WEAPON_MACRO: [
      "blade edge or hilt geometry must be visible",
      "not allowed to become red blur or metal noise",
    ],
    ENVIRONMENT_WIDE: [
      "environment may dominate, but must keep a clearly visible Mikage figure anchor",
    ],
  };
  const negatives = {
    MATERIAL_MACRO: [
      "wall texture",
      "plaster slab",
      "mineral rock",
      "marble wall",
      "random flat wall surface",
      "texture-only frame",
    ],
    MASK_MACRO: [
      "abstract white texture",
      "subject cropped away",
      "facial ambiguity",
    ],
    ENTITY_MEDIUM: [
      "partial crop",
      "identity-destroying crop",
    ],
    WEAPON_MACRO: [
      "red blur",
      "metal noise",
      "unrecognizable weapon shape",
    ],
    ENVIRONMENT_WIDE: [
      "anchorless empty environment",
      "no visible Mikage figure",
    ],
  };
  return {
    shot_type: type,
    positive: dedupeStrings([...common, ...(perType[type] || [])]),
    negative: dedupeStrings([...(negatives[type] || [])]),
  };
}

function applySubjectPresenceGuard(promptPackage, job) {
  const shot = getShotTypeRules(inferShotType(job, promptPackage));
  const basePrompt = String(
    promptPackage.structured_prompt ||
    promptPackage.positivePrompt ||
    (promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.prompt) ||
    ""
  ).trim();
  const baseNegative = String(
    promptPackage.negative_prompt ||
    promptPackage.negativePrompt ||
    (promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.negative_prompt) ||
    ""
  );
  
  // ANTI-ABSTRACT DIAGNOSTIC LOCK - P3 Implementation
  // Check for abstract-risk keywords in prompt before rendering
  const abstractRiskPatterns = [
    /material study/i,
    /texture study/i,
    /macro close-up/i,
    /surface only/i,
    /wall texture/i,
    /abstract composition/i,
    /pattern without object/i,
  ];
  
  const subjectClarityPatterns = [
    /sphere|dish|plate|tile|component|object|vase|bowl|entity/i,
    /full object/i,
    /readable silhouette/i,
    /manufactured object/i,
  ];
  
  const hasAbstractRisk = abstractRiskPatterns.some(p => p.test(basePrompt));
  const hasSubjectClarity = subjectClarityPatterns.some(p => p.test(basePrompt));
  const hasAntiAbstractNegative = /abstract|texture-only|pattern without/i.test(baseNegative);
  
  const abstractRiskLevel = hasAbstractRisk && !hasSubjectClarity ? "HIGH" : 
                          hasAbstractRisk && hasSubjectClarity ? "MEDIUM" : "LOW";
  
  if (abstractRiskLevel === "HIGH") {
    console.warn(`[SUBJECT_LOCK] HIGH abstract risk detected in prompt for job ${job.job_id}`);
    console.warn(`[SUBJECT_LOCK] Prompt lacks clear subject definition. Add: sphere, dish, plate, component`);
  }
  
  // Use comma-separated tags (diffusion-friendly) instead of instruction-style text blocks
  const guardTags = shot.positive
    .map((rule) => rule.replace(/^(must |not |no |only )/i, "").trim())
    .filter(Boolean)
    .slice(0, 6);
  
  // Add subject clarity tags if abstract risk detected
  if (abstractRiskLevel !== "LOW" && !hasSubjectClarity) {
    guardTags.push("single manufactured object", "readable silhouette", "full object visible");
  }
  
  const guardedPrompt = `${basePrompt}, ${guardTags.join(", ")}`.trim();
  
  // Add anti-abstract negatives if not present
  const antiAbstractNegatives = [
    "abstract composition",
    "texture-only frame",
    "pattern without object",
    "background dominates",
    "no clear subject",
  ];
  const guardedNegative = dedupeStrings([
    ...baseNegative.split(",").map((item) => item.trim()).filter(Boolean),
    ...shot.negative,
    ...(abstractRiskLevel !== "LOW" && !hasAntiAbstractNegative ? antiAbstractNegatives : []),
  ]).join(", ");

  return {
    ...promptPackage,
    shot_type: shot.shot_type,
    structured_prompt: guardedPrompt,
    positivePrompt: guardedPrompt,
    negative_prompt: guardedNegative,
    negativePrompt: guardedNegative,
    render_spec: {
      ...(promptPackage.render_spec || {}),
      shot_type: shot.shot_type,
    },
    locked_prompt_package: {
      ...(promptPackage.locked_prompt_package || {}),
      prompt: guardedPrompt,
      negative_prompt: guardedNegative,
      composition_rules: dedupeStrings([
        ...toArray(promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.composition_rules),
        ...shot.positive,
      ]),
    },
    payload: promptPackage.payload ? {
      ...promptPackage.payload,
      prompt: guardedPrompt,
      negative_prompt: guardedNegative,
      metadata: {
        ...(promptPackage.payload.metadata || {}),
        shot_type: shot.shot_type,
      },
    } : promptPackage.payload,
    subject_presence_guard: {
      shot_type: shot.shot_type,
      positive: shot.positive,
      negative: shot.negative,
    },
    // P3: Anti-abstract diagnostic flags
    subject_readability_lock: {
      abstract_risk_level: abstractRiskLevel,
      has_abstract_keywords: hasAbstractRisk,
      has_subject_clarity: hasSubjectClarity,
      has_anti_abstract_negative: hasAntiAbstractNegative,
      guard_applied: abstractRiskLevel !== "LOW",
      diagnostic_flags: [
        ...(hasAbstractRisk ? ["ABSTRACT_KEYWORDS_DETECTED"] : []),
        ...(!hasSubjectClarity ? ["SUBJECT_CLARITY_MISSING"] : []),
        ...(!hasAntiAbstractNegative && hasAbstractRisk ? ["ANTI_ABSTRACT_NEGATIVE_MISSING"] : []),
      ],
    },
  };
}

function deriveRecoveryTags(geminiValidation) {
  const source = dedupeStrings([
    ...toArray(geminiValidation && geminiValidation.fail_rules),
    ...toArray(geminiValidation && geminiValidation.wrong_reads),
    geminiValidation && geminiValidation.summary,
    geminiValidation && geminiValidation.material_read,
  ]).map((item) => String(item || ""));
  const tags = [];
  if (source.some((item) => /WEAPON_IDENTITY_MISSING/i.test(item))) tags.push("WEAPON_IDENTITY_MISSING");
  if (source.some((item) => /SWORD_GEOMETRY_MISSING/i.test(item))) tags.push("SWORD_GEOMETRY_MISSING");
  if (source.some((item) => /FORBIDDEN_MATERIAL_DRIFT/i.test(item))) tags.push("FORBIDDEN_MATERIAL_DRIFT");
  if (source.some((item) => /ABSTRACT_OBJECT_DRIFT/i.test(item))) tags.push("ABSTRACT_OBJECT_DRIFT");
  if (source.some((item) => /subject material.*absent|subject.*entirely absent|subject absent|missing subject/i.test(item))) {
    tags.push("SUBJECT_ABSENT");
  }
  if (source.some((item) => /does not depict.*white ceramic material|material absent|absent ceramic|no ceramic/i.test(item))) {
    tags.push("MATERIAL_ABSENT");
  }
  if (source.some((item) => /abstract|noise field|pixelated texture|ambiguous object|texture study|material swatch|fragmented/i.test(item))) {
    tags.push("ABSTRACT_FRAME");
  }
  if (source.some((item) => /plaster|gypsum|chalk|stone|mineral|wall|slab|concrete|porous masonry/i.test(item))) {
    tags.push("NO_MANUFACTURED_OBJECT_READ");
  }
  return tags;
}

function buildSubjectDiagnostics(shotType, geminiValidation) {
  const tags = deriveRecoveryTags(geminiValidation);
  const normalizedShotType = normalizeShotType(shotType);
  if (normalizedShotType === "WEAPON_MACRO") {
    return {
      shot_type: normalizedShotType,
      subject_present: !tags.includes("WEAPON_IDENTITY_MISSING") && !tags.includes("SUBJECT_ABSENT"),
      manufactured_object_read:
        !tags.includes("WEAPON_IDENTITY_MISSING") &&
        !tags.includes("SWORD_GEOMETRY_MISSING") &&
        !tags.includes("ABSTRACT_OBJECT_DRIFT"),
      material_read: !tags.includes("FORBIDDEN_MATERIAL_DRIFT") && !tags.includes("MATERIAL_ABSENT"),
      abstract_risk:
        tags.includes("ABSTRACT_OBJECT_DRIFT")
          ? "HIGH"
          : tags.includes("SWORD_GEOMETRY_MISSING") || tags.includes("WEAPON_IDENTITY_MISSING")
            ? "MEDIUM"
            : "LOW",
      recovery_tags: tags,
      subject_recovery_mode_active: tags.some((tag) =>
        [
          "WEAPON_IDENTITY_MISSING",
          "SWORD_GEOMETRY_MISSING",
          "FORBIDDEN_MATERIAL_DRIFT",
          "ABSTRACT_OBJECT_DRIFT",
          "SUBJECT_ABSENT",
          "MATERIAL_ABSENT",
        ].includes(tag)
      ),
    };
  }
  return {
    shot_type: normalizedShotType,
    subject_present: !tags.includes("SUBJECT_ABSENT"),
    manufactured_object_read: !tags.includes("NO_MANUFACTURED_OBJECT_READ") && !tags.includes("MATERIAL_ABSENT"),
    material_read: !tags.includes("MATERIAL_ABSENT"),
    abstract_risk: tags.includes("ABSTRACT_FRAME") ? "HIGH" : tags.includes("SUBJECT_ABSENT") ? "MEDIUM" : "LOW",
    recovery_tags: tags,
    subject_recovery_mode_active: tags.some((tag) => ["SUBJECT_ABSENT", "MATERIAL_ABSENT", "ABSTRACT_FRAME", "NO_MANUFACTURED_OBJECT_READ"].includes(tag)),
  };
}

function computeSeed(baseSeed, jobId, candidateIndex, policy) {
  const normalizedBase = Number.isFinite(baseSeed) && baseSeed >= 0
    ? baseSeed
    : Math.abs(
        Array.from(String(jobId || "mikage")).reduce((acc, ch) => ((acc * 33) + ch.charCodeAt(0)) >>> 0, 5381)
      );
  if (policy === "locked") return normalizedBase;
  return normalizedBase + (candidateIndex * 37);
}

function computeCandidateScore({ subjectDiagnostics, postValidation, geminiValidation }) {
  let score = 0;
  if (subjectDiagnostics && subjectDiagnostics.subject_present) score += 1000;
  if (subjectDiagnostics && subjectDiagnostics.manufactured_object_read) score += 900;
  if (subjectDiagnostics && subjectDiagnostics.material_read) score += 800;
  const localPenalty = toArray(postValidation && postValidation.rule_engine && postValidation.rule_engine.failed_rules).length * 40;
  const geminiPenalty = toArray(geminiValidation && geminiValidation.fail_rules).length * 35;
  const wrongReads = toArray(geminiValidation && geminiValidation.wrong_reads);
  if (subjectDiagnostics && subjectDiagnostics.abstract_risk === "LOW") score += 250;
  if (subjectDiagnostics && subjectDiagnostics.abstract_risk === "MEDIUM") score += 100;
  score -= localPenalty;
  score -= geminiPenalty;
  score -= wrongReads.filter((item) => /gloss|plastic|pvc|toy/i.test(String(item))).length * 70;
  score -= wrongReads.filter((item) => /red|magenta|ambient/i.test(String(item))).length * 60;
  score -= wrongReads.filter((item) => /abstract|noise|pattern/i.test(String(item))).length * 90;
  score -= wrongReads.filter((item) => /plaster|stone|mineral|gypsum|chalk|concrete/i.test(String(item))).length * 80;
  return score;
}

function classifyCandidateLevel({ outputExists, subjectDiagnostics, postValidation, geminiValidation }) {
  if (!outputExists) return "REJECT";
  const localPass = !!(postValidation && postValidation.verdict === "PASS");
  const geminiPass = !!(geminiValidation && geminiValidation.parse_ok === true && geminiValidation.pass_fail === "PASS");
  if (localPass && geminiPass) return "PASS_STRONG";
  if (subjectDiagnostics && subjectDiagnostics.subject_present && subjectDiagnostics.manufactured_object_read && subjectDiagnostics.material_read) {
    return "USABLE_CONTENT";
  }
  if (subjectDiagnostics && subjectDiagnostics.subject_present && subjectDiagnostics.manufactured_object_read) {
    return "USABLE_INTERNAL";
  }
  if (outputExists) return "BEST_OF_BATCH";
  return "REJECT";
}

function buildCandidateSelectionReason(candidate) {
  if (!candidate) return "no candidate";
  const parts = [];
  if (candidate.subject_diagnostics && candidate.subject_diagnostics.subject_present) parts.push("subject present");
  if (candidate.subject_diagnostics && candidate.subject_diagnostics.manufactured_object_read) parts.push("manufactured object readable");
  if (candidate.subject_diagnostics && candidate.subject_diagnostics.material_read) parts.push("material readable");
  if (candidate.subject_diagnostics && candidate.subject_diagnostics.abstract_risk) parts.push(`abstract risk ${candidate.subject_diagnostics.abstract_risk.toLowerCase()}`);
  if (candidate.candidate_score != null) parts.push(`score ${candidate.candidate_score}`);
  return parts.join(", ") || "highest technical candidate";
}

function buildCorrectionGuidance(finalDecision, geminiValidation, subjectDiagnostics) {
  const rules = toArray(finalDecision && finalDecision.failed_rules);
  const wrongReads = toArray(geminiValidation && geminiValidation.wrong_reads);
  const hints = [];
  if (subjectDiagnostics && subjectDiagnostics.shot_type === "WEAPON_MACRO") {
    if (rules.includes("WEAPON_IDENTITY_MISSING")) {
      hints.push("WEAPON_IDENTITY_MISSING: force sword-first subject identity and keep weapon read above all material bias.");
    }
    if (rules.includes("SWORD_GEOMETRY_MISSING")) {
      hints.push("SWORD_GEOMETRY_MISSING: restore elongated straight blade geometry, hard edge silhouette, and visible sword planes.");
    }
    if (rules.includes("FORBIDDEN_MATERIAL_DRIFT")) {
      hints.push("FORBIDDEN_MATERIAL_DRIFT: remove ceramic, porcelain, and plastic drift; lock forged steel, titanium, or dark industrial alloy.");
    }
    if (rules.includes("ABSTRACT_OBJECT_DRIFT")) {
      hints.push("ABSTRACT_OBJECT_DRIFT: remove sculpture or object ambiguity and restore explicit blade-first readability.");
    }
  }
  if (rules.includes("T5")) hints.push("T5: center one dominant object and keep the full manufactured silhouette readable.");
  if (rules.includes("T6")) hints.push("T6: push dense matte engineered ceramic and suppress plaster, laminate, and plastic softness.");
  if (rules.includes("T11")) hints.push("T11: restore sacred brutalist austerity and remove generic studio softness.");
  if (rules.includes("T12")) hints.push("T12: tighten canonical geometry, symmetry, and hard-surface identity cues.");
  if (wrongReads.some((item) => /plaster|stone|mineral|gypsum|chalk|concrete/i.test(String(item)))) {
    hints.push("Need manufactured contour evidence, not flat texture field.");
  }
  if (rules.includes("COLOR_NEON_DRIFT") || wrongReads.some((item) => /neon|rgb clean/i.test(String(item)))) {
    hints.push("COLOR_NEON_DRIFT: remove neon/RGB-clean color and restore subtractive mineral restraint.");
  }
  if (rules.includes("OVERSATURATION_DRIFT") || wrongReads.some((item) => /oversaturat/i.test(String(item)))) {
    hints.push("OVERSATURATION_DRIFT: reduce chroma and keep the frame shadow-heavy with muted material response.");
  }
  if (rules.includes("PURE_WHITE_DRIFT")) {
    hints.push("PURE_WHITE_DRIFT: replace sterile pure white with warm off-white material variation and diffuse highlight control.");
  }
  if (rules.includes("PURE_BLACK_DRIFT")) {
    hints.push("PURE_BLACK_DRIFT: replace dead pure black with charcoal temperature variation and readable material depth.");
  }
  if (rules.includes("PLASTIC_COLOR_DRIFT") || wrongReads.some((item) => /plastic color|toy-like/i.test(String(item)))) {
    hints.push("PLASTIC_COLOR_DRIFT: reconnect color to texture and material grain; remove synthetic toy-like cleanliness.");
  }
  if (rules.includes("CRIMSON_OVERUSE") || wrongReads.some((item) => /crimson overuse|full-frame red/i.test(String(item)))) {
    hints.push("CRIMSON_OVERUSE: keep crimson only in seams or core accents, never as a frame-wide flood.");
  }
  if (subjectDiagnostics && subjectDiagnostics.subject_recovery_mode_active) {
    hints.push("Subject recovery mode: force one clearly readable central manufactured object and remove abstract atmosphere.");
  }
  return dedupeStrings(hints);
}

/**
 * Update shared_state.json to terminal state.
 * OWNERSHIP NOTE: This is the ONLY place the orchestrator touches shared_state.
 * All other shared_state writes go through telegram_bot/shared_state.js.
 * Uses the shared_state module to avoid concurrent write corruption.
 */
function updateSharedStateTerminal(jobId, decision, status) {
  try {
    const { updateState } = require("./telegram_bot/shared_state");
    const terminalStates = ['DONE', 'FAIL', 'REJECT', 'PASS'];
    const isTerminal = terminalStates.some(s => (status || '').toUpperCase().includes(s)) ||
                       terminalStates.some(s => (decision || '').toUpperCase().includes(s));

    const newRunState = isTerminal ? 'DONE' : (decision === 'ALLOW' ? 'PASSED' : 'FAILED_VALIDATION');
    const newStatus = decision === 'ALLOW' ? 'DONE' : (status || 'FAIL');

    updateState((state) => {
      state.activeJobId = null;
      state.currentStep = 'RUN_COMPLETED';
      state.runState = newRunState;
      state.lastJobId = jobId;
      state.lastDecision = decision;
      state.lastStatus = newStatus;
      state.completedAt = new Date().toISOString();
      return state;
    });
    console.log(`[ORCHESTRATOR] Updated shared_state to terminal: ${newRunState}`);
  } catch (err) {
    console.error(`[ORCHESTRATOR] Failed to update shared_state: ${err.message}`);
  }
}

/**
 * Sync task.status to match run.status at terminal points.
 * Mapping: RUNNING→RUNNING, DONE→DONE, FAIL→REJECT
 */
function syncTaskStatusToRun(jobId, runStatus) {
  try {
    const { updateTask, getTasks } = require("./telegram_bot/shared_state");
    const tasks = getTasks();
    const task = tasks.find(t => t.related_run_id === jobId || t.task_id === jobId);
    if (!task) return;
    
    const mapping = {
      'RUNNING': 'RUNNING',
      'DONE': 'DONE',
      'FAIL': 'REJECT',
      'PENDING': 'PENDING'
    };
    const newTaskStatus = mapping[runStatus] || task.status;
    if (newTaskStatus !== task.status) {
      updateTask(task.task_id, { status: newTaskStatus });
      console.log(`[TASK_SYNC] Task ${task.task_id} status updated: ${task.status} → ${newTaskStatus}`);
    }
  } catch (err) {
    console.error(`[TASK_SYNC] Failed to sync task status: ${err.message}`);
  }
}

function buildPromptPackage(job, canon) {
  if (
    job.input &&
    normalizeText(job.input.prompt) &&
    normalizeText(job.input.negative_prompt || "")
  ) {
    const directPrompt = String(job.input.prompt);
    const directNegative = String(job.input.negative_prompt || "");
    const render = job.render || {};
    return applySubjectPresenceGuard({
      spec: {
        subject: inferShotType(job, null),
        texture: [],
        lighting: [],
        composition_rules: [],
        negative_prompt: dedupeStrings(directNegative.split(",")),
      },
      structured_prompt: directPrompt,
      negative_prompt: directNegative,
      positivePrompt: directPrompt,
      negativePrompt: directNegative,
      payload: {
        prompt: directPrompt,
        negative_prompt: directNegative,
        seed: Number.isFinite(render.seed) ? render.seed : -1,
        width: Number.isFinite(render.width) ? render.width : 1024,
        height: Number.isFinite(render.height) ? render.height : 1024,
        steps: Number.isFinite(render.steps) ? render.steps : -1,
        disable_refiner: !!render.disable_refiner,
        performance_selection: normalizeText(render.performance) || "Quality",
        style_selections: [],
        image_number: 1,
        async_process: false,
        metadata: {
          job_id: job.job_id,
          canon_version: canon.canonVersion,
          source_files: canon.paths,
          generated_at: nowIso(),
          direct_input_prompt: true,
        },
      },
      render_spec: {
        shot_type: inferShotType(job, null),
        width: Number.isFinite(render.width) ? render.width : 1024,
        height: Number.isFinite(render.height) ? render.height : 1024,
        performance: normalizeText(render.performance) || "Quality",
        seed: Number.isFinite(render.seed) ? render.seed : -1,
      },
      locked_prompt_package: {
        prompt: directPrompt,
        negative_prompt: directNegative,
      },
    }, job);
  }
  if (
    job.locked_prompt_package &&
    normalizeText(job.locked_prompt_package.prompt) &&
    normalizeText(job.locked_prompt_package.negative_prompt)
  ) {
    const locked = job.locked_prompt_package;
    const lockedSpec = {
      subject: normalizeText(locked.subject || (job.identity && job.identity.name) || "Mikage Zenith hero entity"),
      texture: dedupeStrings(toArray(locked.texture)),
      lighting: dedupeStrings(toArray(locked.lighting)),
      composition_rules: dedupeStrings(toArray(locked.composition_rules)),
      negative_prompt: dedupeStrings(String(locked.negative_prompt).split(",")),
    };
    const render = job.render || {};
    return applySubjectPresenceGuard({
      spec: lockedSpec,
      structured_prompt: String(locked.prompt),
      negative_prompt: String(locked.negative_prompt),
      positivePrompt: String(locked.prompt),
      negativePrompt: String(locked.negative_prompt),
      payload: {
        prompt: String(locked.prompt),
        negative_prompt: String(locked.negative_prompt),
        seed: Number.isFinite(render.seed) ? render.seed : -1,
        width: Number.isFinite(render.width) ? render.width : 1024,
        height: Number.isFinite(render.height) ? render.height : 384,
        steps: Number.isFinite(render.steps) ? render.steps : -1,
        disable_refiner: !!render.disable_refiner,
        performance_selection: normalizeText(render.performance) || "Quality",
        style_selections: [],
        image_number: 1,
        async_process: false,
        metadata: {
          job_id: job.job_id,
          canon_version: canon.canonVersion,
          source_files: canon.paths,
          generated_at: nowIso(),
          locked_prompt_package: true,
        },
      },
      locked_prompt_package: {
        ...locked,
        prompt: String(locked.prompt),
        negative_prompt: String(locked.negative_prompt),
      },
    }, job);
  }

  const baseSpec = buildBaseSpec(job);
  const spec = applyCanonV2ToSpec(baseSpec, canon);
  const materialLock = [
    "matte B4C technical ceramic",
    "eggshell microtexture",
    "subtle fracture lines",
    "zero specular highlights on white surfaces",
    "cold dry ceramic read",
    "non-plastic, non-PVC, non-toy material read",
  ];
  const maskLock = [
    "perfect symmetrical kitsune mask",
    "pitch-black eye slits only",
    "no visible eyes",
    "planar forehead",
    "sharp cheek planes",
    "refined short muzzle",
    "sacred emotionless mask",
    "no cute expression",
    "no human facial read",
  ];
  const silhouetteLock = [
    "centered subject dominant",
    "clean outer silhouette",
    "strong negative space",
    "brutalist low-clutter background",
    "no heavy smoke",
    "no dense fog covering edges",
    "no particle clutter",
    "no over-busy architecture behind silhouette",
  ];
  const crimsonLock = [
    "crimson only as restrained seam accent",
    "blade core heat line only",
    "no red ambient wash",
    "no magenta spill",
    "no RGB cyberpunk glow",
    "no frame-wide red lighting",
  ];

  spec.texture = dedupeStrings([
    ...toArray(spec.texture),
    ...materialLock,
  ]);
  spec.composition_rules = dedupeStrings([
    ...toArray(spec.composition_rules),
    ...maskLock,
    ...silhouetteLock,
    ...crimsonLock,
  ]);
  spec.negative_prompt = dedupeStrings([
    ...toArray(spec.negative_prompt),
    "glossy plastic",
    "reflective white polymer",
    "toy finish",
    "PVC sheen",
    "wet shine",
    "lacquered anime surface",
    "visible human eyes",
    "kawaii muzzle",
    "mask asymmetry",
    "anime face cues",
    "heavy smoke",
    "dense fog covering edges",
    "particle clutter",
    "over-busy architecture behind silhouette",
    "red ambient wash",
    "magenta spill",
    "RGB cyberpunk glow",
    "frame-wide red lighting",
  ]);

  const positivePrompt = dedupeStrings([
    spec.subject,
    ...toArray(spec.texture),
    ...toArray(spec.lighting),
    ...toArray(spec.composition_rules),
  ]).join(", ");

  const negativePrompt = dedupeStrings(toArray(spec.negative_prompt)).join(", ");

  const render = job.render || {};
  const payload = {
    prompt: positivePrompt,
    negative_prompt: negativePrompt,
    seed: Number.isFinite(render.seed) ? render.seed : -1,
    width: Number.isFinite(render.width) ? render.width : 1024,
    height: Number.isFinite(render.height) ? render.height : 384,
    steps: Number.isFinite(render.steps) ? render.steps : -1,
    disable_refiner: !!render.disable_refiner,
    performance_selection: normalizeText(render.performance) || "Quality",
    style_selections: [],
    image_number: 1,
    async_process: false,
    metadata: {
      job_id: job.job_id,
      canon_version: canon.canonVersion,
      source_files: canon.paths,
      generated_at: nowIso(),
    },
  };

  return applySubjectPresenceGuard({
    spec,
    structured_prompt: positivePrompt,
    negative_prompt: negativePrompt,
    positivePrompt,
    negativePrompt,
    payload,
    locked_prompt_package: {
      subject: spec.subject,
      texture: toArray(spec.texture),
      lighting: toArray(spec.lighting),
      composition_rules: toArray(spec.composition_rules),
      prompt: positivePrompt,
      negative_prompt: negativePrompt,
    },
  }, job);
}

function mergePreValidation(jobValidation, promptValidation) {
  const failedChecks = dedupeStrings([
    ...toArray(jobValidation.failed_checks),
    ...toArray(promptValidation.failed_checks),
  ]);
  const forbiddenHits = dedupeStrings([
    ...toArray(jobValidation.forbidden_hits),
    ...toArray(promptValidation.forbidden_hits),
  ]);
  const criticalFailures = dedupeStrings([
    ...toArray(jobValidation.critical_failures),
    ...toArray(promptValidation.critical_failures),
  ]);
  const verdict =
    jobValidation.verdict === "PASS" &&
    promptValidation.verdict === "PASS" &&
    forbiddenHits.length === 0 &&
    criticalFailures.length === 0 &&
    failedChecks.length === 0
      ? "PASS"
      : "REJECT";

  return {
    stage: "prompt_package",
    verdict,
    canon_version: promptValidation.canon_version || jobValidation.canon_version || "v2",
    source_version: promptValidation.source_version || jobValidation.source_version || "unknown",
    source_files: promptValidation.source_files || jobValidation.source_files || {},
    passed_checks: promptValidation.passed_checks || [],
    failed_checks: failedChecks,
    forbidden_hits: forbiddenHits,
    critical_failures: criticalFailures,
    pass_ratio: promptValidation.pass_ratio,
    negative_lock_count: promptValidation.negative_lock_count || 0,
    job_input_validation: jobValidation,
  };
}

function ensureFinalPayload(artifactPaths, payload) {
  if (!fs.existsSync(artifactPaths.final_payload)) {
    writeJson(artifactPaths.final_payload, payload);
  }
}

function ensureOutputArtifact(renderOutputPath, runDir) {
  const targetPath = path.join(runDir, "output.png");
  if (!renderOutputPath) return null;

  const resolvedSource = path.resolve(renderOutputPath);
  if (!fs.existsSync(resolvedSource)) {
    return null;
  }

  if (resolvedSource !== path.resolve(targetPath)) {
    fs.copyFileSync(resolvedSource, targetPath);
  }

  if (!fs.existsSync(targetPath)) {
    return null;
  }

  const stat = fs.statSync(targetPath);
  if (!stat.isFile() || stat.size <= 0) {
    return null;
  }

  return targetPath;
}

function buildFailedPostValidation(reason, canon, analyzerSummary) {
  return {
    stage: "post_render_image",
    verdict: "REJECT",
    validator_executed: false,
    canon_version: canon.canonVersion,
    failed_checks: [],
    critical_failures: [reason],
    forbidden_hits: [],
    analyzer_signals: {},
    missing_signals: [],
    blocking_unknown_rules: [],
    analyzer_summary: analyzerSummary || {},
    source_files: canon.paths,
    reason,
  };
}

function buildGeminiRuntimeCheck() {
  const geminiConfig = getGeminiConfig();
  return {
    has_api_key: geminiConfig.hasKey,
    key_source: geminiConfig.source,
    model: geminiConfig.model,
    cwd: geminiConfig.cwd,
    env_file_detected: geminiConfig.envFileDetected,
  };
}

function buildGeminiFailure(errorCode, overrides = {}) {
  const failRules = overrides.fail_rules
    ? dedupeStrings(overrides.fail_rules)
    : errorCode
      ? [errorCode]
      : [];
  const wrongReads = overrides.wrong_reads
    ? dedupeStrings(overrides.wrong_reads)
    : [];
  const correctReads = overrides.correct_reads
    ? dedupeStrings(overrides.correct_reads)
    : [];
  const fixDirection = overrides.fix_direction
    ? dedupeStrings(overrides.fix_direction)
    : [];

  return {
    pass_fail: "FAIL",
    fail_rules: failRules,
    wrong_reads: wrongReads,
    correct_reads: correctReads,
    material_read: overrides.material_read || "unknown",
    fix_direction: fixDirection,
    summary: overrides.summary || errorCode || "Gemini validation failed",
    confidence: typeof overrides.confidence === "number" ? overrides.confidence : 0,
    gemini_validation_executed: overrides.gemini_validation_executed === true,
    parse_ok: overrides.parse_ok === true,
    error: overrides.error || errorCode || null,
    raw: overrides.raw || null,
  };
}

async function runLegacyGeminiValidation(outputFile, context = {}) {
  const promptPath = context.promptPath || resolveGeminiJudgePromptPath(context.shotType);

  if (!outputFile || !fs.existsSync(outputFile)) {
    return buildGeminiFailure("GEMINI_IMAGE_READ_FAILED", {
      summary: "GEMINI_IMAGE_READ_FAILED",
    });
  }

  if (!fs.existsSync(promptPath)) {
    return buildGeminiFailure("GEMINI_PROMPT_MISSING", {
      summary: "GEMINI_PROMPT_MISSING",
    });
  }

  try {
    const geminiResult = await judgeRenderedImage(outputFile, { promptPath });
    const raw = geminiResult && geminiResult.raw ? geminiResult.raw : {};
    const parseOk = raw.parse_ok === true;
    const executed = raw.gemini_validation_executed === true;
    const pass = geminiResult && geminiResult.decision === "PASS" && parseOk;
    const error =
      raw.error ||
      (!executed ? "GEMINI_REQUEST_FAILED" : null) ||
      (!parseOk ? "GEMINI_INVALID_JSON" : null) ||
      (!pass ? "GEMINI_VALIDATOR_FAIL" : null);

    return {
      pass_fail: pass ? "PASS" : "FAIL",
      fail_rules: dedupeStrings([
        ...toArray(raw.fail_rules),
        ...(pass ? [] : toArray(geminiResult && geminiResult.fail_rules)),
        ...(error && error !== "GEMINI_VALIDATOR_FAIL" ? [error] : []),
      ]),
      wrong_reads: dedupeStrings([
        ...toArray(raw.wrong_reads),
        ...toArray(geminiResult && geminiResult.drift_flags),
      ]),
      correct_reads: dedupeStrings(toArray(raw.correct_reads)),
      material_read: raw.material_read || (geminiResult && geminiResult.material_read) || "unknown",
      fix_direction: dedupeStrings([
        ...toArray(raw.fix_direction),
        ...toArray(geminiResult && geminiResult.corrections),
      ]),
      summary: raw.summary || (pass ? "PASS" : error || "Gemini validator FAIL"),
      confidence:
        typeof raw.confidence === "number"
          ? raw.confidence
          : typeof (geminiResult && geminiResult.confidence) === "number"
            ? geminiResult.confidence
            : 0,
      gemini_validation_executed: executed,
      parse_ok: parseOk,
      error: pass ? null : error,
      raw,
    };
  } catch (error) {
    return buildGeminiFailure("GEMINI_REQUEST_FAILED", {
      summary: error.message || "GEMINI_REQUEST_FAILED",
      raw: { message: error.message },
    });
  }
}

function summarizeAnalyzerStatus(signals) {
  return {
    use_vision_validator: String(process.env.USE_VISION_VALIDATOR || "false").toLowerCase() === "true",
    vlm_backend_ready: isVLMAvailable(),
    vlm_status: signals._vlm_status || "unknown",
    semantic_result:
      HARD_REJECT_SIGNALS.some((key) => Number(signals[key] || 0) > 0) ? "REJECT" : "PASS",
    analyzer_unavailable: toArray(signals._analyzer_status && signals._analyzer_status.errors),
    analyzer_status: signals._analyzer_status || {},
  };
}

function collectMissingSignals(ruleResults) {
  const missing = [];
  for (const result of ruleResults || []) {
    for (const signal of toArray(result.missing_signals)) {
      missing.push(signal);
    }
  }
  return dedupeStrings(missing);
}

function collectBlockingUnknownRules(ruleResults) {
  return (ruleResults || [])
    .filter(
      (result) =>
        result.status === "UNKNOWN" &&
        (result.priority === "CRITICAL" || result.priority === "ABSOLUTE")
    )
    .map((result) => result.rule_id);
}

function collectCriticalFailedRules(ruleResults) {
  return (ruleResults || [])
    .filter(
      (result) =>
        result.status === "FAIL" &&
        (result.priority === "CRITICAL" || result.priority === "ABSOLUTE")
    )
    .map((result) => result.rule_id);
}

function collectHardRejectSignals(signals) {
  return HARD_REJECT_SIGNALS.filter((key) => Number(signals[key] || 0) > 0);
}

async function buildPostValidation(job, imagePath, canon) {
  const signals = await runAllAnalyzers(imagePath);
  const analyzerSummary = summarizeAnalyzerStatus(signals);
  const ruleEngine = runRuleEngine({
    specPath: getSpecPath("image_control"),
    signals,
  });
  const drift = await detectDrift(imagePath, job.narrative || {}, null, null);
  const hardRejectHits = collectHardRejectSignals(signals);
  const blockingUnknownRules = collectBlockingUnknownRules(ruleEngine.rule_results);
  const criticalFailedRules = collectCriticalFailedRules(ruleEngine.rule_results);
  const failedChecks = dedupeStrings([
    ...toArray(ruleEngine.failed_rules),
    ...hardRejectHits,
  ]);
  const criticalFailures = dedupeStrings([
    ...criticalFailedRules,
    ...hardRejectHits,
  ]);

  const pass =
    fs.existsSync(imagePath) &&
    failedChecks.length === 0 &&
    criticalFailures.length === 0 &&
    blockingUnknownRules.length === 0 &&
    drift.verdict === "PASS";

  return {
    stage: "post_render_image",
    verdict: pass ? "PASS" : "REJECT",
    validator_executed: true,
    canon_version: canon.canonVersion,
    failed_checks: failedChecks,
    critical_failures: criticalFailures,
    forbidden_hits: hardRejectHits,
    analyzer_signals: signals,
    missing_signals: collectMissingSignals(ruleEngine.rule_results),
    blocking_unknown_rules: blockingUnknownRules,
    analyzer_summary: analyzerSummary,
    source_files: canon.paths,
    hard_reject_hits: hardRejectHits,
    rule_engine: {
      decision: ruleEngine.decision,
      passed: ruleEngine.passed,
      block_level: ruleEngine.block_level,
      failed_rules: ruleEngine.failed_rules,
      unknown_rules: ruleEngine.unknown_rules,
      stats: ruleEngine.stats,
      rule_results: ruleEngine.rule_results,
    },
    identity_analyzer: drift.identity_detail,
    narrative_analyzer: drift.narrative_detail,
    drift: {
      verdict: drift.verdict,
      refineable: drift.refineable,
      refine_reason: drift.refine_reason,
      drift_flags: drift.drift_flags,
    },
    scores: {
      identity_score: drift.identity_score,
      narrative_score: drift.narrative_score,
      aesthetic_integrity_score: drift.aesthetic_integrity_score,
      anti_polish_score: drift.anti_polish_score,
    },
  };
}

function buildDecision({
  job,
  artifactPaths,
  outputFile,
  preValidation,
  postValidation,
  geminiValidation,
  continuity,
  baseline,
  enforceGemini = true,
  promptPackage = null,
}) {
  const shotType = inferShotType(job, promptPackage);
  const laneDebug = resolveLaneRuleDebug(shotType, promptPackage || {});
  const colorDebug = resolveColorDebug(promptPackage || {}, geminiValidation);
  const reproductionDebug = resolveReproductionDebug(job, promptPackage || {}, geminiValidation);
  const subjectDiagnostics = buildSubjectDiagnostics(shotType, geminiValidation);
  const outputExists = !!outputFile && fs.existsSync(outputFile);
  const outputFiles = outputExists ? ["output.png"] : [];
  const canonRan = !!(postValidation && postValidation.validator_executed === true);
  const postPassed = canonRan && postValidation.verdict === "PASS";
  const prePassed = preValidation && preValidation.verdict === "PASS";
  const geminiRan = !!(geminiValidation && geminiValidation.gemini_validation_executed === true);
  const geminiParseOk = !!(geminiValidation && geminiValidation.parse_ok === true);
  const geminiPassed = !!(geminiValidation && geminiValidation.pass_fail === "PASS" && geminiParseOk);
  const hardFailCount =
    toArray(postValidation && postValidation.hard_reject_hits).length +
    toArray(postValidation && postValidation.critical_failures).length;
  const localFailedRules = postValidation && postValidation.rule_engine ? toArray(postValidation.rule_engine.failed_rules) : [];
  const geminiFailRules = geminiValidation ? toArray(geminiValidation.fail_rules) : [];
  const mergedFailedRules = dedupeStrings([...localFailedRules, ...geminiFailRules, ...toArray(reproductionDebug.reproduction_fail_labels)]);
  const dominantFailReason =
    subjectDiagnostics.recovery_tags[0] ||
    geminiFailRules[0] ||
    localFailedRules[0] ||
    "VALIDATION_FAIL";
  const allow = enforceGemini
    ? outputExists && prePassed && canonRan && hardFailCount === 0 && postPassed && geminiRan && geminiParseOk && geminiPassed
    : outputExists && prePassed && canonRan && hardFailCount === 0 && postPassed;
  const colorHardReject = colorDebug.hard_color_fail_tokens.length > 0 || colorDebug.lane_palette_match === false;
  const colorSoftRetry = !colorHardReject && colorDebug.soft_color_fail_tokens.length > 0;
  const imageAnchorUnavailable =
    reproductionDebug.generation_mode === "reproduction" &&
    reproductionDebug.reproduction_anchor_mode === "image_anchored" &&
    reproductionDebug.image_anchored_reproduction_available === false;

  let status = allow ? "DONE" : "FAIL";
  let decision = allow ? "ALLOW" : "REJECT";
  let reason = allow
    ? (enforceGemini ? "ALLOW: output exists + local validator PASS + Gemini PASS" : "ALLOW: real image verified + canon pass")
    : "REJECT: post-render validation failed";

  if (!outputExists) {
    console.error("[ORCHESTRATOR] No real output image found on disk; forcing FAIL/REJECT");
    status = "FAIL";
    decision = "REJECT";
    reason = "REJECT: no real image on disk";
  } else if (imageAnchorUnavailable) {
    status = "FAIL";
    decision = "REJECT";
    reason = "IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE";
  } else if (!prePassed) {
    status = "FAIL";
    decision = "REJECT";
    reason = "REJECT: pre-validation failed";
  } else if (!postValidation || !canonRan) {
    status = "FAIL";
    decision = "REJECT";
    reason = "REJECT: validator not executed";
  } else if (toArray(postValidation.hard_reject_hits).length > 0) {
    status = "DONE";
    decision = "REJECT";
    reason = `REJECT: canon hard fail: ${postValidation.hard_reject_hits.join(", ")}`;
  } else if (toArray(postValidation.critical_failures).length > 0) {
    status = "DONE";
    decision = "REJECT";
    reason = `REJECT: canon hard fail: ${postValidation.critical_failures.join(", ")}`;
  } else if (toArray(postValidation.blocking_unknown_rules).length > 0) {
    status = "DONE";
    decision = "REJECT";
    reason = `REJECT: validator blocked by unknown canon rules: ${postValidation.blocking_unknown_rules.join(", ")}`;
  } else if (!postPassed) {
    status = "DONE";
    decision = "REJECT";
    reason = "REJECT: post-render validator status = FAIL";
  } else if (enforceGemini && !geminiRan) {
    status = "FAIL";
    decision = "REJECT";
    reason = `REJECT: ${geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_REQUEST_FAILED"}`;
  } else if (enforceGemini && !geminiParseOk) {
    status = "FAIL";
    decision = "REJECT";
    reason = `REJECT: ${geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_INVALID_JSON"}`;
  } else if (enforceGemini && !geminiPassed) {
    status = "DONE";
    decision = "REJECT";
    const geminiReason =
      dedupeStrings([
        ...toArray(geminiValidation && geminiValidation.fail_rules),
        ...toArray(geminiValidation && geminiValidation.wrong_reads),
      ]).join(", ") || (geminiValidation && geminiValidation.summary) || "Gemini validator FAIL";
    reason = `REJECT: Gemini validator FAIL: ${geminiReason}`;
  }
  if (colorHardReject) {
    status = "DONE";
    decision = "REJECT";
    reason = `REJECT: color canon hard gate: ${colorDebug.hard_color_fail_tokens.join(", ") || "LANE_PALETTE_MISMATCH"}`;
  } else if (colorSoftRetry) {
    status = "RETRY";
    decision = "RETRY";
    reason = `RETRY: color canon soft gate: ${colorDebug.soft_color_fail_tokens.join(", ")}`;
  }

  const scores = postValidation && postValidation.scores
    ? {
        identity_score: postValidation.scores.identity_score,
        narrative_score: postValidation.scores.narrative_score,
        aesthetic_integrity_score: postValidation.scores.aesthetic_integrity_score,
        anti_polish_score: postValidation.scores.anti_polish_score,
      }
    : {
        identity_score: null,
        narrative_score: null,
        aesthetic_integrity_score: null,
        anti_polish_score: null,
      };

  const finalDecision = {
    job_id: job.job_id,
    status,
    decision,
    decision_reason: reason,
    canon_version: (preValidation && preValidation.canon_version) || "v2",
    output_files: outputFiles,
    output_file_path: outputExists ? outputFile : null,
    validator_executed: canonRan,
    gemini_validation_executed: geminiRan,
    gemini_pass_fail: geminiValidation ? geminiValidation.pass_fail : null,
    gemini_error: geminiValidation ? geminiValidation.error || null : null,
    gemini_fail_rules: geminiFailRules,
    gemini_summary: geminiValidation ? geminiValidation.summary || null : null,
    wrong_reads: geminiValidation ? toArray(geminiValidation.wrong_reads) : [],
    shot_type: shotType,
    generation_mode: reproductionDebug.generation_mode,
    reference_master: reproductionDebug.reference_master,
    reference_master_used: reproductionDebug.reference_master_used,
    reproduction_constraints: reproductionDebug.reproduction_constraints,
    reproduction_constraints_used: reproductionDebug.reproduction_constraints_used,
    reproduction_fail_labels: reproductionDebug.reproduction_fail_labels,
    reproduction_anchor_mode: reproductionDebug.reproduction_anchor_mode,
    anchor_image_path: reproductionDebug.anchor_image_path,
    anchor_strength: reproductionDebug.anchor_strength,
    denoise_strength: reproductionDebug.denoise_strength,
    composition_lock_strength: reproductionDebug.composition_lock_strength,
    silhouette_lock_strength: reproductionDebug.silhouette_lock_strength,
    anchor_method_used: reproductionDebug.anchor_method_used,
    anchor_image_used: reproductionDebug.anchor_image_used,
    anchor_strength_used: reproductionDebug.anchor_strength_used,
    denoise_strength_used: reproductionDebug.denoise_strength_used,
    image_anchor_success_expected: reproductionDebug.image_anchor_success_expected,
    reproduction_mode_outcome: reproductionDebug.reproduction_mode_outcome,
    lane_rule_applied: laneDebug.lane_rule_applied,
    lane_required_anchors: laneDebug.lane_required_anchors,
    lane_forbidden_anchors: laneDebug.lane_forbidden_anchors,
    lane_priority_override_applied: laneDebug.lane_priority_override_applied,
    color_canon_applied: colorDebug.color_canon_applied,
    color_fail_tokens: colorDebug.color_fail_tokens,
    color_severity: colorDebug.color_severity,
    palette_used: colorDebug.palette_used,
    saturation_estimate: colorDebug.saturation_estimate,
    crimson_area_estimate: colorDebug.crimson_area_estimate,
    shadow_ratio_estimate: colorDebug.shadow_ratio_estimate,
    lane_palette_match: colorDebug.lane_palette_match,
    forbidden_color_detected: colorDebug.forbidden_color_detected,
    color_dominant_fail_reason: colorDebug.color_dominant_fail_reason,
    dominant_fail_reason: dominantFailReason,
    correction_guidance: buildCorrectionGuidance({ failed_rules: mergedFailedRules }, geminiValidation, subjectDiagnostics),
    subject_diagnostics: subjectDiagnostics,
    canon_hard_fail_count: hardFailCount,
    failed_rules: mergedFailedRules,
    blocking_unknown_rules: postValidation ? postValidation.blocking_unknown_rules : [],
    critical_failures: postValidation ? postValidation.critical_failures : [],
    forbidden_hits: postValidation ? postValidation.forbidden_hits : [],
    analyzer_summary: postValidation ? postValidation.analyzer_summary : {},
    scores,
    drift_flags: postValidation && postValidation.drift ? postValidation.drift.drift_flags : [],
    continuity,
    registry_write: false,
    registry_target: null,
    baseline_found: !!(baseline && baseline.found),
    baseline_reference: baseline ? baseline.reference : null,
    baseline_source: baseline ? baseline.source : null,
    baseline_canon_version: baseline ? baseline.canon_version : null,
    artifact_paths: artifactPaths,
    timestamps: {
      decided_at: nowIso(),
    },
  };

  const summary = {
    job_id: job.job_id,
    status,
    decision,
    output_files: outputFiles,
    output_file_path: outputExists ? outputFile : null,
    scores,
    drift_flags: finalDecision.drift_flags,
    timestamp: nowIso(),
    artifact_paths: artifactPaths,
    canon_version: finalDecision.canon_version,
    validator_executed: canonRan,
    gemini_validation_executed: geminiRan,
    gemini_pass_fail: geminiValidation ? geminiValidation.pass_fail : null,
    gemini_error: geminiValidation ? geminiValidation.error || null : null,
    wrong_reads: geminiValidation ? toArray(geminiValidation.wrong_reads) : [],
    shot_type: shotType,
    generation_mode: reproductionDebug.generation_mode,
    reference_master: reproductionDebug.reference_master,
    reference_master_used: reproductionDebug.reference_master_used,
    reproduction_constraints: reproductionDebug.reproduction_constraints,
    reproduction_constraints_used: reproductionDebug.reproduction_constraints_used,
    reproduction_fail_labels: reproductionDebug.reproduction_fail_labels,
    reproduction_anchor_mode: reproductionDebug.reproduction_anchor_mode,
    anchor_image_path: reproductionDebug.anchor_image_path,
    anchor_strength: reproductionDebug.anchor_strength,
    denoise_strength: reproductionDebug.denoise_strength,
    composition_lock_strength: reproductionDebug.composition_lock_strength,
    silhouette_lock_strength: reproductionDebug.silhouette_lock_strength,
    anchor_method_used: reproductionDebug.anchor_method_used,
    anchor_image_used: reproductionDebug.anchor_image_used,
    anchor_strength_used: reproductionDebug.anchor_strength_used,
    denoise_strength_used: reproductionDebug.denoise_strength_used,
    image_anchor_success_expected: reproductionDebug.image_anchor_success_expected,
    reproduction_mode_outcome: reproductionDebug.reproduction_mode_outcome,
    lane_rule_applied: laneDebug.lane_rule_applied,
    lane_required_anchors: laneDebug.lane_required_anchors,
    lane_forbidden_anchors: laneDebug.lane_forbidden_anchors,
    lane_priority_override_applied: laneDebug.lane_priority_override_applied,
    color_canon_applied: colorDebug.color_canon_applied,
    color_fail_tokens: colorDebug.color_fail_tokens,
    color_severity: colorDebug.color_severity,
    palette_used: colorDebug.palette_used,
    saturation_estimate: colorDebug.saturation_estimate,
    crimson_area_estimate: colorDebug.crimson_area_estimate,
    shadow_ratio_estimate: colorDebug.shadow_ratio_estimate,
    lane_palette_match: colorDebug.lane_palette_match,
    forbidden_color_detected: colorDebug.forbidden_color_detected,
    color_dominant_fail_reason: colorDebug.color_dominant_fail_reason,
    dominant_fail_reason: dominantFailReason,
    correction_guidance: buildCorrectionGuidance({ failed_rules: mergedFailedRules }, geminiValidation, subjectDiagnostics),
    subject_diagnostics: subjectDiagnostics,
    failed_rules: finalDecision.failed_rules,
    validator_fail_rules: mergedFailedRules,
    final_decision_reason: reason,
    continuity,
    registry_write: false,
    registry_target: null,
    baseline_found: !!(baseline && baseline.found),
    baseline_reference: baseline ? baseline.reference : null,
    baseline_source: baseline ? baseline.source : null,
    baseline_canon_version: baseline ? baseline.canon_version : null,
    pre_validation_result: preValidation,
    post_validation_result: postValidation || null,
    gemini_validation_result: geminiValidation || null,
    final_decision_source: "post_render_image",
  };

  return { finalDecision, summary };
}

async function safeNotionLog(finalDecision, preValidation, postValidation) {
  if (!NOTION_API_KEY || !NOTION_DB_ID) return;

  try {
    const notion = new NotionClient({ auth: NOTION_API_KEY });
    const db = await notion.databases.retrieve({ database_id: NOTION_DB_ID });
    const titleEntry = Object.entries(db.properties || {}).find(([, prop]) => prop.type === "title");
    if (!titleEntry) return;

    const [titleName] = titleEntry;
    const content = JSON.stringify(
      {
        decision: finalDecision,
        pre_validation: preValidation,
        post_validation: postValidation,
      },
      null,
      2
    );

    await notion.pages.create({
      parent: { database_id: NOTION_DB_ID },
      properties: {
        [titleName]: {
          title: [
            {
              text: {
                content: `${finalDecision.job_id} ${finalDecision.decision}`.slice(0, 2000),
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: content.slice(0, 1900),
                },
              },
            ],
          },
        },
      ],
    });
  } catch (error) {
    console.log(`[NOTION] Logging skipped: ${error.message}`);
  }
}

async function safeNotionRegistryRecord(record) {
  if (!NOTION_API_KEY || !NOTION_DB_ID) {
    return { wrote: false, target: null };
  }

  try {
    const notion = new NotionClient({ auth: NOTION_API_KEY });
    const db = await notion.databases.retrieve({ database_id: NOTION_DB_ID });
    const titleEntry = Object.entries(db.properties || {}).find(([, prop]) => prop.type === "title");
    if (!titleEntry) {
      return { wrote: false, target: null };
    }

    const [titleName] = titleEntry;
    await notion.pages.create({
      parent: { database_id: NOTION_DB_ID },
      properties: {
        [titleName]: {
          title: [
            {
              text: {
                content: `OFFICIAL CANON ${record.entity_id || record.job_id}`.slice(0, 2000),
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: JSON.stringify(record, null, 2).slice(0, 1900),
                },
              },
            ],
          },
        },
      ],
    });
    return { wrote: true, target: "notion" };
  } catch (error) {
    console.log(`[NOTION] Registry write skipped: ${error.message}`);
    return { wrote: false, target: null };
  }
}

async function writeOfficialCanonRecord(finalDecision, continuity) {
  if (finalDecision.decision !== "ALLOW") {
    return {
      registry_write: false,
      registry_target: null,
      registry_path: null,
    };
  }

  // INV-6: Hard check — only ALLOW may enter the canon registry
  assertCanonRecordIsAllow({ decision: finalDecision.decision, job_id: finalDecision.job_id });

  const record = {
    job_id: finalDecision.job_id,
    timestamp: nowIso(),
    output_file_path: finalDecision.output_file_path,
    entity_id: continuity.entity_id,
    entity_class: continuity.entity_class,
    zone: continuity.zone,
    weapon: continuity.weapon,
    status: continuity.status,
    canon_version: continuity.canon_version,
    failed_rules: [],
    decision: "ALLOW",
    reason: finalDecision.decision_reason,
  };

  const localResult = appendLocalRegistryRecord(record);
  const notionResult = await safeNotionRegistryRecord(record);

  return {
    registry_write: !!(localResult.wrote || notionResult.wrote),
    registry_target:
      localResult.wrote && notionResult.wrote
        ? "notion+local"
        : localResult.wrote
          ? "local"
          : notionResult.wrote
            ? "notion"
            : null,
    registry_path: localResult.path || null,
  };
}

function buildJobFromPromptPackage(baseJob, promptPackage) {
  const effectiveRender = getEffectiveRenderSettings(promptPackage.render_spec || {}, baseJob.render || {});
  return {
    ...baseJob,
    __skip_legacy_gemini: true,
    render: {
      ...(baseJob.render || {}),
      width: effectiveRender.width,
      height: effectiveRender.height,
      steps: effectiveRender.steps,
      disable_refiner: effectiveRender.disable_refiner,
      guidance_scale: effectiveRender.guidance_scale,
      sampler: effectiveRender.sampler,
      scheduler: effectiveRender.scheduler,
      sharpness: effectiveRender.sharpness,
      candidate_count: effectiveRender.candidate_count,
      seed_policy: effectiveRender.seed_policy,
      performance: effectiveRender.performance,
    },
    phase: promptPackage.phase_target || baseJob.phase || "material_study",
    shot_type: promptPackage.shot_type || inferShotType(baseJob, promptPackage),
    generation_mode: promptPackage.generation_mode || baseJob.generation_mode || "exploration",
    reference_master: promptPackage.reference_master || baseJob.reference_master || null,
    reproduction_constraints: promptPackage.reproduction_constraints || baseJob.reproduction_constraints || null,
    reproduction_anchor_mode: promptPackage.reproduction_anchor_mode || baseJob.reproduction_anchor_mode || null,
    anchor_image_path: promptPackage.anchor_image_path || baseJob.anchor_image_path || null,
    anchor_strength: promptPackage.anchor_strength ?? baseJob.anchor_strength ?? null,
    denoise_strength: promptPackage.denoise_strength ?? baseJob.denoise_strength ?? null,
    composition_lock_strength: promptPackage.composition_lock_strength ?? baseJob.composition_lock_strength ?? null,
    silhouette_lock_strength: promptPackage.silhouette_lock_strength ?? baseJob.silhouette_lock_strength ?? null,
    anchor_method_used: promptPackage.anchor_method_used || baseJob.anchor_method_used || null,
    anchor_image_used: promptPackage.anchor_image_used || baseJob.anchor_image_used || null,
    anchor_strength_used: promptPackage.anchor_strength_used ?? baseJob.anchor_strength_used ?? null,
    denoise_strength_used: promptPackage.denoise_strength_used ?? baseJob.denoise_strength_used ?? null,
    image_anchor_success_expected: promptPackage.image_anchor_success_expected === true || baseJob.image_anchor_success_expected === true,
    scope_lock: promptPackage.scope_lock || [],
    do_not_touch: promptPackage.do_not_touch || [],
    locked_prompt_package: promptPackage.locked_prompt_package,
  };
}

function buildCorrectionDiff(previousPromptPackage, correctedPromptPackage) {
  const previousPromptLines = new Set(String(previousPromptPackage.structured_prompt || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
  const correctedPromptLines = String(correctedPromptPackage.corrected_prompt || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const addedPromptLines = correctedPromptLines.filter((line) => !previousPromptLines.has(line));
  const previousNegativeTerms = new Set(String(previousPromptPackage.negative_prompt || "").split(",").map((item) => item.trim()).filter(Boolean));
  const correctedNegativeTerms = String(correctedPromptPackage.corrected_negative_prompt || "").split(",").map((item) => item.trim()).filter(Boolean);
  const addedNegativeTerms = correctedNegativeTerms.filter((term) => !previousNegativeTerms.has(term));
  const targetedFailures = toArray(correctedPromptPackage.correction_summary ? [correctedPromptPackage.correction_summary] : []);
  const substantiveDelta = addedPromptLines.length >= 3 || addedNegativeTerms.length >= 3;
  return {
    previous_prompt: previousPromptPackage.structured_prompt,
    corrected_prompt: correctedPromptPackage.corrected_prompt,
    previous_negative_prompt: previousPromptPackage.negative_prompt,
    corrected_negative_prompt: correctedPromptPackage.corrected_negative_prompt,
    correction_summary: correctedPromptPackage.correction_summary,
    added_prompt_lines: addedPromptLines,
    added_negative_terms: addedNegativeTerms,
    targeted_failures: targetedFailures,
    substantive_delta: substantiveDelta,
  };
}

function enforceSubstantiveCorrectionDelta(promptPackage, correctedPromptPackage, correctionDiff, fixBrief) {
  if (correctionDiff.substantive_delta) {
    return {
      correctedPromptPackage,
      correctionDiff,
    };
  }

  const emergencyLines = dedupeStrings([
    "EMERGENCY ESCALATION LOCK",
    ...(fixBrief.required_reads_to_strengthen || []),
    ...(fixBrief.increase_signals || []),
    "full object visibility",
    "explicit product object silhouette",
    "no abstract or texture-only composition",
    "premium industrial product photo",
  ]);
  const emergencyNegative = dedupeStrings([
    ...String(correctedPromptPackage.corrected_negative_prompt || "").split(",").map((item) => item.trim()),
    ...(fixBrief.forbidden_reads_to_eliminate || []),
    ...(fixBrief.decrease_signals || []),
    "abstract",
    "fragmented form",
    "ambiguous object",
    "texture-only frame",
  ]);

  const strengthened = {
    ...correctedPromptPackage,
    corrected_prompt: `${correctedPromptPackage.corrected_prompt}\n\n${emergencyLines.join("\n")}`,
    corrected_negative_prompt: emergencyNegative.join(", "),
    corrected_render_spec: {
      ...(correctedPromptPackage.corrected_render_spec || {}),
      disable_refiner: true,
      steps: Math.max(Number(correctedPromptPackage.corrected_render_spec && correctedPromptPackage.corrected_render_spec.steps) || 24, 24),
    },
  };

  return {
    correctedPromptPackage: strengthened,
    correctionDiff: buildCorrectionDiff(promptPackage, strengthened),
  };
}

function buildClosedLoopDecision({
  job,
  artifactPaths,
  continuity,
  baseline,
  localSummary,
  localValidation,
  geminiValidation,
  attemptCount,
  trace,
}) {
  const shotType = inferShotType(job, localSummary && localSummary.prompt_package ? localSummary.prompt_package : null);
  const laneDebug = resolveLaneRuleDebug(
    shotType,
    localSummary && localSummary.prompt_package ? localSummary.prompt_package : {}
  );
  const reproductionDebug = resolveReproductionDebug(
    job,
    localSummary && localSummary.prompt_package ? localSummary.prompt_package : {},
    geminiValidation
  );
  const colorDebug = resolveColorDebug(
    localSummary && localSummary.prompt_package ? localSummary.prompt_package : {},
    geminiValidation
  );
  const subjectDiagnostics = buildSubjectDiagnostics(shotType, geminiValidation);
  const outputPath = localSummary && localSummary.output_file_path ? localSummary.output_file_path : null;
  const outputExists = !!outputPath && fs.existsSync(outputPath);
  const localRan = !!(localValidation && localValidation.validator_executed === true);
  const localPassed = !!(localValidation && localValidation.verdict === "PASS");
  const geminiRan = !!(geminiValidation && geminiValidation.gemini_validation_executed === true);
  const geminiPassed = !!(
    geminiValidation &&
    geminiValidation.gemini_validation_executed === true &&
    geminiValidation.parse_ok === true &&
    geminiValidation.pass_fail === "PASS"
  );
  const hardFailRules = dedupeStrings([
    ...(localValidation && localValidation.rule_engine ? toArray(localValidation.rule_engine.failed_rules) : []),
    ...(geminiValidation ? toArray(geminiValidation.fail_rules) : []),
    ...toArray(reproductionDebug.reproduction_fail_labels),
  ]);
  const colorHardReject = colorDebug.hard_color_fail_tokens.length > 0 || colorDebug.lane_palette_match === false;
  const colorSoftRetry = !colorHardReject && colorDebug.soft_color_fail_tokens.length > 0;
  const imageAnchorUnavailable =
    reproductionDebug.generation_mode === "reproduction" &&
    reproductionDebug.reproduction_anchor_mode === "image_anchored" &&
    reproductionDebug.image_anchored_reproduction_available === false;
  const dominantFailReason =
    subjectDiagnostics.recovery_tags[0] ||
    toArray(geminiValidation && geminiValidation.fail_rules)[0] ||
    toArray(localValidation && localValidation.rule_engine && localValidation.rule_engine.failed_rules)[0] ||
    "VALIDATION_FAIL";

  let status = "FAIL";
  let decision = "REJECT";
  let reason = "REJECT: closed-loop validation failed";

  if (!outputExists) {
    reason = "REJECT: no output.png";
  } else if (imageAnchorUnavailable) {
    reason = "IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE";
  } else if (!localRan) {
    reason = "REJECT: local validator missing";
  } else if (!geminiRan) {
    reason = `REJECT: ${geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_ENV_NOT_LOADED"}`;
  } else if (!geminiValidation.parse_ok) {
    reason = `REJECT: ${geminiValidation.error || "GEMINI_INVALID_JSON"}`;
  } else if (geminiValidation.pass_fail !== "PASS") {
    reason = `REJECT: Gemini validator FAIL: ${toArray(geminiValidation.fail_rules).join(", ") || geminiValidation.summary}`;
  } else if (!localPassed) {
    reason = `REJECT: local validator FAIL: ${toArray(localValidation.rule_engine && localValidation.rule_engine.failed_rules).join(", ")}`;
  } else if (hardFailRules.length > 0) {
    reason = `REJECT: hard fail rules active: ${hardFailRules.join(", ")}`;
  } else {
    status = "DONE";
    decision = "ALLOW";
    reason = "ALLOW: output exists + local validator PASS + Gemini PASS";
  }
  if (colorHardReject) {
    status = "DONE";
    decision = "REJECT";
    reason = `REJECT: color canon hard gate: ${colorDebug.hard_color_fail_tokens.join(", ") || "LANE_PALETTE_MISMATCH"}`;
  } else if (colorSoftRetry) {
    status = "RETRY";
    decision = "RETRY";
    reason = `RETRY: color canon soft gate: ${colorDebug.soft_color_fail_tokens.join(", ")}`;
  }

  const finalDecision = {
    job_id: job.job_id,
    status,
    decision,
    decision_reason: reason,
    canon_version: "v2",
    output_files: outputExists ? ["output.png"] : [],
    output_file_path: outputExists ? outputPath : null,
    validator_executed: localRan,
    gemini_validation_executed: geminiRan,
    gemini_pass_fail: geminiValidation ? geminiValidation.pass_fail : null,
    gemini_error: geminiValidation ? geminiValidation.error || null : "GEMINI_ENV_NOT_LOADED",
    failed_rules: hardFailRules,
    wrong_reads: geminiValidation ? toArray(geminiValidation.wrong_reads) : [],
    shot_type: shotType,
    generation_mode: reproductionDebug.generation_mode,
    reference_master: reproductionDebug.reference_master,
    reference_master_used: reproductionDebug.reference_master_used,
    reproduction_constraints: reproductionDebug.reproduction_constraints,
    reproduction_constraints_used: reproductionDebug.reproduction_constraints_used,
    reproduction_fail_labels: reproductionDebug.reproduction_fail_labels,
    reproduction_anchor_mode: reproductionDebug.reproduction_anchor_mode,
    anchor_image_path: reproductionDebug.anchor_image_path,
    anchor_strength: reproductionDebug.anchor_strength,
    denoise_strength: reproductionDebug.denoise_strength,
    composition_lock_strength: reproductionDebug.composition_lock_strength,
    silhouette_lock_strength: reproductionDebug.silhouette_lock_strength,
    anchor_method_used: reproductionDebug.anchor_method_used,
    anchor_image_used: reproductionDebug.anchor_image_used,
    anchor_strength_used: reproductionDebug.anchor_strength_used,
    denoise_strength_used: reproductionDebug.denoise_strength_used,
    image_anchor_success_expected: reproductionDebug.image_anchor_success_expected,
    reproduction_mode_outcome: reproductionDebug.reproduction_mode_outcome,
    lane_rule_applied: laneDebug.lane_rule_applied,
    lane_required_anchors: laneDebug.lane_required_anchors,
    lane_forbidden_anchors: laneDebug.lane_forbidden_anchors,
    lane_priority_override_applied: laneDebug.lane_priority_override_applied,
    color_canon_applied: colorDebug.color_canon_applied,
    color_fail_tokens: colorDebug.color_fail_tokens,
    color_severity: colorDebug.color_severity,
    palette_used: colorDebug.palette_used,
    saturation_estimate: colorDebug.saturation_estimate,
    crimson_area_estimate: colorDebug.crimson_area_estimate,
    shadow_ratio_estimate: colorDebug.shadow_ratio_estimate,
    lane_palette_match: colorDebug.lane_palette_match,
    forbidden_color_detected: colorDebug.forbidden_color_detected,
    color_dominant_fail_reason: colorDebug.color_dominant_fail_reason,
    dominant_fail_reason: dominantFailReason,
    correction_guidance: buildCorrectionGuidance({ failed_rules: hardFailRules }, geminiValidation, subjectDiagnostics),
    subject_diagnostics: subjectDiagnostics,
    final_prompt: localSummary && localSummary.prompt_package ? localSummary.prompt_package.structured_prompt || null : null,
    negative_prompt: localSummary && localSummary.prompt_package ? localSummary.prompt_package.negative_prompt || null : null,
    seed: localSummary && localSummary.prompt_package && localSummary.prompt_package.render_spec ? localSummary.prompt_package.render_spec.seed || null : null,
    candidates: localSummary && Array.isArray(localSummary.candidates) ? localSummary.candidates : [],
    best_candidate: localSummary && localSummary.best_candidate ? localSummary.best_candidate : null,
    best_candidate_summary: localSummary && localSummary.best_candidate_summary ? localSummary.best_candidate_summary : null,
    candidate_level: localSummary && localSummary.candidate_level ? localSummary.candidate_level : classifyCandidateLevel({
      outputExists,
      subjectDiagnostics,
      postValidation: localValidation,
      geminiValidation,
    }),
    analyzer_summary: localValidation ? localValidation.analyzer_summary : {},
    continuity,
    registry_write: false,
    registry_target: null,
    baseline_found: !!(baseline && baseline.found),
    baseline_reference: baseline ? baseline.reference : null,
    baseline_source: baseline ? baseline.source : null,
    baseline_canon_version: baseline ? baseline.canon_version : null,
    attempt_count: attemptCount,
    artifact_paths: artifactPaths,
    run_loop_trace: trace,
    timestamps: {
      decided_at: nowIso(),
    },
  };

  const summary = {
    job_id: job.job_id,
    status,
    decision,
    output_files: finalDecision.output_files,
    output_file_path: finalDecision.output_file_path,
    validator_executed: localRan,
    gemini_validation_executed: geminiRan,
    gemini_pass_fail: geminiValidation ? geminiValidation.pass_fail : null,
    gemini_error: geminiValidation ? geminiValidation.error || null : "GEMINI_ENV_NOT_LOADED",
    failed_rules: hardFailRules,
    validator_fail_rules: localValidation && localValidation.rule_engine ? toArray(localValidation.rule_engine.failed_rules) : [],
    wrong_reads: geminiValidation ? toArray(geminiValidation.wrong_reads) : [],
    shot_type: shotType,
    generation_mode: reproductionDebug.generation_mode,
    reference_master: reproductionDebug.reference_master,
    reference_master_used: reproductionDebug.reference_master_used,
    reproduction_constraints: reproductionDebug.reproduction_constraints,
    reproduction_constraints_used: reproductionDebug.reproduction_constraints_used,
    reproduction_fail_labels: reproductionDebug.reproduction_fail_labels,
    reproduction_anchor_mode: reproductionDebug.reproduction_anchor_mode,
    anchor_image_path: reproductionDebug.anchor_image_path,
    anchor_strength: reproductionDebug.anchor_strength,
    denoise_strength: reproductionDebug.denoise_strength,
    composition_lock_strength: reproductionDebug.composition_lock_strength,
    silhouette_lock_strength: reproductionDebug.silhouette_lock_strength,
    anchor_method_used: reproductionDebug.anchor_method_used,
    anchor_image_used: reproductionDebug.anchor_image_used,
    anchor_strength_used: reproductionDebug.anchor_strength_used,
    denoise_strength_used: reproductionDebug.denoise_strength_used,
    image_anchor_success_expected: reproductionDebug.image_anchor_success_expected,
    reproduction_mode_outcome: reproductionDebug.reproduction_mode_outcome,
    lane_rule_applied: laneDebug.lane_rule_applied,
    lane_required_anchors: laneDebug.lane_required_anchors,
    lane_forbidden_anchors: laneDebug.lane_forbidden_anchors,
    lane_priority_override_applied: laneDebug.lane_priority_override_applied,
    color_canon_applied: colorDebug.color_canon_applied,
    color_fail_tokens: colorDebug.color_fail_tokens,
    color_severity: colorDebug.color_severity,
    palette_used: colorDebug.palette_used,
    saturation_estimate: colorDebug.saturation_estimate,
    crimson_area_estimate: colorDebug.crimson_area_estimate,
    shadow_ratio_estimate: colorDebug.shadow_ratio_estimate,
    lane_palette_match: colorDebug.lane_palette_match,
    forbidden_color_detected: colorDebug.forbidden_color_detected,
    color_dominant_fail_reason: colorDebug.color_dominant_fail_reason,
    dominant_fail_reason: dominantFailReason,
    correction_guidance: buildCorrectionGuidance({ failed_rules: hardFailRules }, geminiValidation, subjectDiagnostics),
    subject_diagnostics: subjectDiagnostics,
    final_prompt: localSummary && localSummary.prompt_package ? localSummary.prompt_package.structured_prompt || null : null,
    negative_prompt: localSummary && localSummary.prompt_package ? localSummary.prompt_package.negative_prompt || null : null,
    seed: localSummary && localSummary.prompt_package && localSummary.prompt_package.render_spec ? localSummary.prompt_package.render_spec.seed || null : null,
    candidates: localSummary && Array.isArray(localSummary.candidates) ? localSummary.candidates : [],
    best_candidate: localSummary && localSummary.best_candidate ? localSummary.best_candidate : null,
    best_candidate_summary: localSummary && localSummary.best_candidate_summary ? localSummary.best_candidate_summary : null,
    candidate_level: localSummary && localSummary.candidate_level ? localSummary.candidate_level : classifyCandidateLevel({
      outputExists,
      subjectDiagnostics,
      postValidation: localValidation,
      geminiValidation,
    }),
    telemetry_warnings: localSummary && localSummary.render ? toArray(localSummary.render.telemetry_warnings || localSummary.render.telemetry_warning) : [],
    size_truth_source: localSummary && localSummary.render ? localSummary.render.size_truth_source || null : null,
    actual_file_size: localSummary && localSummary.render ? localSummary.render.actual_file_size || localSummary.render.actual_size || null : null,
    final_decision_reason: reason,
    continuity,
    registry_write: false,
    registry_target: null,
    baseline_found: !!(baseline && baseline.found),
    baseline_reference: baseline ? baseline.reference : null,
    baseline_source: baseline ? baseline.source : null,
    baseline_canon_version: baseline ? baseline.canon_version : null,
    attempt_count: attemptCount,
    timestamp: nowIso(),
    artifact_paths: artifactPaths,
    pre_validation_result: localSummary ? localSummary.pre_validation_result : null,
    post_validation_result: localValidation || null,
    gemini_validation_result: geminiValidation || null,
    final_decision_source: "closed_loop_gemini_post_render",
  };

  return { finalDecision, summary };
}

function buildSummaryText(finalDecision, geminiValidation) {
  const latestTrace = Array.isArray(finalDecision.run_loop_trace) && finalDecision.run_loop_trace.length > 0
    ? finalDecision.run_loop_trace[finalDecision.run_loop_trace.length - 1]
    : null;
  return [
    `job_id: ${finalDecision.job_id}`,
    `decision: ${finalDecision.decision}`,
    `reason: ${finalDecision.decision_reason}`,
    `shot_type: ${finalDecision.shot_type || "null"}`,
    `generation_mode: ${finalDecision.generation_mode || "exploration"}`,
    `reference_master_used: ${!!finalDecision.reference_master_used}`,
    `reference_master_candidate: ${finalDecision.reference_master ? finalDecision.reference_master.candidate_id || "null" : "null"}`,
    `reference_master_seed: ${finalDecision.reference_master ? finalDecision.reference_master.seed ?? "null" : "null"}`,
    `reproduction_constraints_used: ${!!finalDecision.reproduction_constraints_used}`,
    `reproduction_fail_labels: ${toArray(finalDecision.reproduction_fail_labels).join(", ") || "none"}`,
    `reproduction_anchor_mode: ${finalDecision.reproduction_anchor_mode || "null"}`,
    `anchor_method_used: ${finalDecision.anchor_method_used || "null"}`,
    `anchor_image_used: ${finalDecision.anchor_image_used || "null"}`,
    `anchor_strength_used: ${finalDecision.anchor_strength_used ?? "null"}`,
    `denoise_strength_used: ${finalDecision.denoise_strength_used ?? "null"}`,
    `image_anchor_success_expected: ${!!finalDecision.image_anchor_success_expected}`,
    `reproduction_mode_outcome: ${finalDecision.reproduction_mode_outcome || "null"}`,
    `lane_rule_applied: ${finalDecision.lane_rule_applied || "null"}`,
    `lane_required_anchors: ${toArray(finalDecision.lane_required_anchors).join(", ") || "none"}`,
    `lane_forbidden_anchors: ${toArray(finalDecision.lane_forbidden_anchors).join(", ") || "none"}`,
    `lane_priority_override_applied: ${!!finalDecision.lane_priority_override_applied}`,
    `color_canon_applied: ${!!finalDecision.color_canon_applied}`,
    `color_fail_tokens: ${toArray(finalDecision.color_fail_tokens).join(", ") || "none"}`,
    `color_severity: ${finalDecision.color_severity || "null"}`,
    `palette_used: ${toArray(finalDecision.palette_used).join(", ") || "none"}`,
    `saturation_estimate: ${finalDecision.saturation_estimate || "null"}`,
    `crimson_area_estimate: ${finalDecision.crimson_area_estimate || "null"}`,
    `shadow_ratio_estimate: ${finalDecision.shadow_ratio_estimate || "null"}`,
    `lane_palette_match: ${finalDecision.lane_palette_match === false ? "false" : "true"}`,
    `forbidden_color_detected: ${toArray(finalDecision.forbidden_color_detected).join(", ") || "none"}`,
    `color_dominant_fail_reason: ${finalDecision.color_dominant_fail_reason || "null"}`,
    `dominant_fail_reason: ${finalDecision.dominant_fail_reason || "null"}`,
    `candidate_level: ${finalDecision.candidate_level || "REJECT"}`,
    `attempt_count: ${finalDecision.attempt_count}`,
    `output_file_path: ${finalDecision.output_file_path || "null"}`,
    `validator_executed: ${finalDecision.validator_executed}`,
    `gemini_validation_executed: ${finalDecision.gemini_validation_executed}`,
    `gemini_pass_fail: ${finalDecision.gemini_pass_fail || "null"}`,
    `render_profile: ${latestTrace ? latestTrace.render_profile : "DEFAULT"}`,
    `width: ${latestTrace ? latestTrace.width : "n/a"}`,
    `height: ${latestTrace ? latestTrace.height : "n/a"}`,
    `requested_steps: ${latestTrace ? latestTrace.requested_steps : "n/a"}`,
    `actual_steps: ${latestTrace ? latestTrace.steps : "n/a"}`,
    `actual_steps_source: ${latestTrace ? latestTrace.actual_steps_source : "n/a"}`,
    `size_truth_source: ${latestTrace ? latestTrace.size_truth_source || "n/a" : "n/a"}`,
    `actual_file_size: ${latestTrace ? latestTrace.actual_file_size || "n/a" : "n/a"}`,
    `telemetry_warnings: ${latestTrace ? toArray(latestTrace.telemetry_warnings).join(", ") || "none" : "none"}`,
    `refiner_enabled: ${latestTrace ? latestTrace.refiner_enabled : "n/a"}`,
    `render_duration_seconds: ${latestTrace ? latestTrace.render_duration_seconds : "n/a"}`,
    `failed_rules: ${toArray(finalDecision.failed_rules).join(", ") || "none"}`,
    `wrong_reads: ${geminiValidation ? toArray(geminiValidation.wrong_reads).join(", ") || "none" : "none"}`,
    `correction_guidance: ${toArray(finalDecision.correction_guidance).join(" | ") || "none"}`,
    `subject_recovery_mode_active: ${!!(finalDecision.subject_diagnostics && finalDecision.subject_diagnostics.subject_recovery_mode_active)}`,
    `subject_present: ${finalDecision.subject_diagnostics ? finalDecision.subject_diagnostics.subject_present : "null"}`,
    `manufactured_object_read: ${finalDecision.subject_diagnostics ? finalDecision.subject_diagnostics.manufactured_object_read : "null"}`,
    `material_read: ${finalDecision.subject_diagnostics ? finalDecision.subject_diagnostics.material_read : "null"}`,
    `abstract_risk: ${finalDecision.subject_diagnostics ? finalDecision.subject_diagnostics.abstract_risk : "null"}`,
  ].join("\n");
}

async function runLegacyCandidateBatch({
  job,
  canon,
  promptPackage,
  artifactPaths,
  enforceGemini,
}) {
  // --- WEAPON BASELINE LOCK: fail-fast if weapon reproduction has no anchor ---
  const effectiveShotType = normalizeShotType(
    promptPackage.shot_type ||
    (promptPackage.render_spec && promptPackage.render_spec.shot_type) ||
    job.shot_type || ""
  );
  const effectiveGenMode = resolveGenerationMode(job, promptPackage);
  if (effectiveShotType === "WEAPON_MACRO" && effectiveGenMode === "reproduction") {
    const anchorPath = normalizeText(promptPackage.anchor_image_path || job.anchor_image_path);
    if (!anchorPath) {
      throw new Error("WEAPON_BASELINE_FAIL: weapon reproduction requires anchor_image_path — cannot render without anchor image");
    }
    if (!fs.existsSync(path.resolve(anchorPath))) {
      throw new Error(`WEAPON_BASELINE_FAIL: anchor image not found on disk: ${path.resolve(anchorPath)}`);
    }
  }
  const effectiveRender = getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {});
  const candidateCount = Math.max(1, Number(effectiveRender.candidate_count || 1));
  const candidates = [];
  const controlToken = issueToken(job.job_id, 3600);
  const attemptLabel = Number.isFinite(job.__loop_attempt) ? `attempt-${String(job.__loop_attempt).padStart(2, "0")}` : null;
  const candidateRoot = attemptLabel
    ? ensureDir(path.join(artifactPaths.run_dir, attemptLabel, "candidates"))
    : artifactPaths.run_dir;

  for (let index = 1; index <= candidateCount; index += 1) {
    const candidateId = `candidate-${String(index).padStart(2, "0")}`;
    const candidateDir = ensureDir(path.join(candidateRoot, candidateId));
    const candidateSeed = computeSeed(promptPackage.payload.seed, job.job_id, index - 1, effectiveRender.seed_policy);
    const renderResult = await executeRender(
      job,
      controlToken,
      promptPackage.spec,
      {
        prompt: promptPackage.positivePrompt,
        negative_prompt: promptPackage.negativePrompt,
        width: effectiveRender.width,
        height: effectiveRender.height,
        steps: effectiveRender.steps,
        disable_refiner: effectiveRender.disable_refiner,
        performance: effectiveRender.performance,
        guidance_scale: effectiveRender.guidance_scale,
        sampler: effectiveRender.sampler,
        scheduler: effectiveRender.scheduler,
        sharpness: effectiveRender.sharpness,
        seed: candidateSeed,
        output_dir: candidateDir,
        attempt: index,
        generation_mode: promptPackage.generation_mode || job.generation_mode || "exploration",
        reference_master: promptPackage.reference_master || job.reference_master || null,
        reproduction_constraints: promptPackage.reproduction_constraints || job.reproduction_constraints || null,
        reproduction_anchor_mode: promptPackage.reproduction_anchor_mode || job.reproduction_anchor_mode || null,
        anchor_image_path: promptPackage.anchor_image_path || job.anchor_image_path || null,
        anchor_strength: promptPackage.anchor_strength ?? job.anchor_strength ?? null,
        denoise_strength: promptPackage.denoise_strength ?? job.denoise_strength ?? null,
        composition_lock_strength: promptPackage.composition_lock_strength ?? job.composition_lock_strength ?? null,
        silhouette_lock_strength: promptPackage.silhouette_lock_strength ?? job.silhouette_lock_strength ?? null,
        anchor_method_used: promptPackage.anchor_method_used || job.anchor_method_used || null,
        image_anchor_success_expected: promptPackage.image_anchor_success_expected === true || job.image_anchor_success_expected === true,
        preservation_mode: promptPackage.preservation_mode || job.preservation_mode || null,
        reconstruction_priority: promptPackage.reconstruction_priority || job.reconstruction_priority || null,
        prompt_weight_reduction_when_anchor_present: promptPackage.prompt_weight_reduction_when_anchor_present ?? job.prompt_weight_reduction_when_anchor_present ?? null,
      }
    );

    const rawOutput =
      renderResult &&
      renderResult.render &&
      renderResult.render.output_file
        ? renderResult.render.output_file
        : null;
    const outputFile = ensureOutputArtifact(rawOutput, candidateDir);
    let postValidation;
    if (!outputFile) {
      postValidation = buildFailedPostValidation(
        renderResult && renderResult.render && renderResult.render.error
          ? renderResult.render.error
          : "render produced no output",
        canon,
        {
          use_vision_validator: String(process.env.USE_VISION_VALIDATOR || "false").toLowerCase() === "true",
          vlm_backend_ready: isVLMAvailable(),
          vlm_status: "skipped",
          semantic_result: "SKIPPED",
          analyzer_unavailable: [],
        }
      );
    } else {
      try {
        postValidation = await buildPostValidation(job, outputFile, canon);
      } catch (error) {
        postValidation = buildFailedPostValidation(`validator_not_executed:${error.message}`, canon, {
          use_vision_validator: String(process.env.USE_VISION_VALIDATOR || "false").toLowerCase() === "true",
          vlm_backend_ready: isVLMAvailable(),
          vlm_status: "error",
          semantic_result: "SKIPPED",
          analyzer_unavailable: [error.message],
        });
      }
    }

    let geminiValidation = null;
    if (enforceGemini) {
      geminiValidation = await runLegacyGeminiValidation(outputFile, {
        promptPath: resolveGeminiJudgePromptPath(effectiveRender.shot_type),
        shotType: effectiveRender.shot_type,
      });
    }

    const subjectDiagnostics = buildSubjectDiagnostics(effectiveRender.shot_type, geminiValidation);
    const candidateScore = computeCandidateScore({
      subjectDiagnostics,
      postValidation,
      geminiValidation,
    });
    const candidateLevel = classifyCandidateLevel({
      outputExists: !!outputFile,
      subjectDiagnostics,
      postValidation,
      geminiValidation,
    });
    const candidateSummary = {
      candidate_id: candidateId,
      shot_type: effectiveRender.shot_type,
      render_profile: effectiveRender.profile,
      seed: candidateSeed,
      prompt: promptPackage.structured_prompt || promptPackage.positivePrompt,
      negative_prompt: promptPackage.negative_prompt || promptPackage.negativePrompt,
      output_path: outputFile,
      output_exists: !!outputFile,
      validator_result: postValidation,
      subject_diagnostics: subjectDiagnostics,
      gemini_result: geminiValidation,
      local_diagnostics: postValidation && postValidation.rule_engine ? postValidation.rule_engine.failed_rules : [],
      candidate_score: candidateScore,
      candidate_level: candidateLevel,
      dominant_fail_reason:
        subjectDiagnostics.recovery_tags[0] ||
        toArray(geminiValidation && geminiValidation.fail_rules)[0] ||
        toArray(postValidation && postValidation.rule_engine && postValidation.rule_engine.failed_rules)[0] ||
        "VALIDATION_FAIL",
      render: renderResult ? renderResult.render || null : null,
    };

    writeText(path.join(candidateDir, "prompt.txt"), candidateSummary.prompt || "");
    writeJson(path.join(candidateDir, "validator.json"), postValidation);
    if (geminiValidation) writeJson(path.join(candidateDir, "gemini_judge.json"), geminiValidation);
    writeJson(path.join(candidateDir, "candidate_summary.json"), candidateSummary);
    candidates.push(candidateSummary);
  }

  candidates.sort((a, b) => {
    if ((b.candidate_score || 0) !== (a.candidate_score || 0)) return (b.candidate_score || 0) - (a.candidate_score || 0);
    return CANDIDATE_TIER_ORDER.indexOf(b.candidate_level) - CANDIDATE_TIER_ORDER.indexOf(a.candidate_level);
  });
  const best = candidates[0] || null;
  if (best && best.output_path && fs.existsSync(best.output_path)) {
    fs.copyFileSync(best.output_path, artifactPaths.output_png);
  }
  writeJson(path.join(candidateRoot, "candidate_index.json"), {
    shot_type: effectiveRender.shot_type,
    candidate_count: candidateCount,
    render_profile: effectiveRender.profile,
    best_candidate_id: best ? best.candidate_id : null,
    best_candidate_level: best ? best.candidate_level : "REJECT",
    candidates,
  });
  return {
    effectiveRender,
    candidates,
    bestCandidate: best,
  };
}

async function fetchJson(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (_) {
      json = text;
    }
    return {
      ok: response.ok,
      status: response.status,
      body: json,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message,
      body: null,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runHealthCheck() {
  const fooocus = await fetchJson(`${FOOOCUS_URL}/openapi.json`, {}, 5000);
  const ollama = await fetchJson(`${OLLAMA_URL}/api/tags`, {}, 5000);
  let notion = {
    configured: !!(NOTION_API_KEY && NOTION_DB_ID),
    ok: false,
    status: NOTION_API_KEY && NOTION_DB_ID ? "unverified" : "not_configured",
  };

  if (NOTION_API_KEY && NOTION_DB_ID) {
    try {
      const client = new NotionClient({ auth: NOTION_API_KEY });
      await client.databases.retrieve({ database_id: NOTION_DB_ID });
      notion = {
        configured: true,
        ok: true,
        status: "ok",
      };
    } catch (error) {
      notion = {
        configured: true,
        ok: false,
        status: error.message,
      };
    }
  }

  const analyzerReadiness = {
    pixel_analyzer: fs.existsSync(path.join(ROOT_DIR, "analyzers", "pixel_analyzer.js")),
    vlm_semantic_analyzer: fs.existsSync(path.join(ROOT_DIR, "analyzers", "vlm_semantic_analyzer.js")),
    identity_analyzer: fs.existsSync(path.join(ROOT_DIR, "drift", "identity_score.js")),
    narrative_analyzer: fs.existsSync(path.join(ROOT_DIR, "drift", "narrative_score.js")),
    rule_engine: fs.existsSync(path.join(ROOT_DIR, "validators", "mikage_rule_engine.js")),
    vlm_client_ready: isVLMAvailable(),
  };

  const overall =
    fooocus.ok &&
    ollama.ok &&
    analyzerReadiness.pixel_analyzer &&
    analyzerReadiness.identity_analyzer &&
    analyzerReadiness.narrative_analyzer &&
    analyzerReadiness.rule_engine
      ? "ok"
      : "degraded";

  return {
    fooocus: {
      ok: fooocus.ok,
      status: fooocus.status,
      url: FOOOCUS_URL,
    },
    ollama: {
      ok: ollama.ok,
      status: ollama.status,
      url: OLLAMA_URL,
    },
    notion,
    analyzers: analyzerReadiness,
    overall_status: overall,
    timestamp: nowIso(),
  };
}

async function orchestrateLegacy(job) {
  const canon = loadCanonV2();
  const specVersions = getVersions();
  const runDir = ensureDir(path.join(RUNS_DIR, job.job_id));
  const artifactPaths = buildArtifactPaths(runDir);
  const continuity = normalizeContinuity(job, canon.canonVersion);
  const baseline = findBaselineRecord(continuity.entity_id);
  const enforceGemini = job.__skip_legacy_gemini !== true;
  const promptPackage = buildPromptPackage(job, canon);
  let geminiValidation = null;
  let candidateBatch = null;

  // --- STATE MACHINE TRACKING ---
  const tracker = createRunTracker(job.job_id);
  try { tracker.advance(SM_STATES.STRUCTURED); } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to STRUCTURED: ${err.message}`); }

  writeJson(artifactPaths.final_payload, promptPackage.payload);

  try { tracker.advance(SM_STATES.PRECHECKED); } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to PRECHECKED: ${err.message}`); }
  const jobValidation = validateCanonJob(job, canon);

  // Resolve shot_type from structured fields only — never from prompt text.
  // Priority: job.shot_type → promptPackage.shot_type → spec.shot_type → spec.render_spec.shot_type → DEFAULT
  const resolvedShotType = resolveShotType(job, promptPackage.spec, promptPackage.locked_prompt_package, promptPackage.shot_type);
  const shotTypeResolution = {
    value: resolvedShotType,
    sources_checked: {
      job_shot_type: job && job.shot_type || null,
      package_shot_type: promptPackage && promptPackage.shot_type || null,
      locked_shot_type: promptPackage && promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.shot_type || null,
      spec_shot_type: promptPackage && promptPackage.spec && promptPackage.spec.shot_type || null,
      render_spec_shot_type: promptPackage && promptPackage.spec && promptPackage.spec.render_spec && promptPackage.spec.render_spec.shot_type || null,
    },
    inferred_from_prompt_text: false,
  };

  const promptValidation = validateCanonPromptPackage(
    promptPackage.spec,
    promptPackage.positivePrompt,
    promptPackage.negativePrompt,
    canon,
    resolvedShotType
  );
  const preValidation = mergePreValidation(jobValidation, promptValidation);
  preValidation.shot_type_resolution = shotTypeResolution;
  writeJson(artifactPaths.pre_validation, preValidation);
  let renderResult = null;
  let outputFile = null;
  let postValidation;

  // For direct-input jobs: allow rendering if only required canon checks fail
  // (no forbidden hits, no critical failures). This prevents canon identity keywords
  // from polluting focused product-shot prompts.
  const isDirectInput = !!(job.input && job.input.prompt);
  const hasCriticalBlock = (preValidation.forbidden_hits || []).length > 0 || (preValidation.critical_failures || []).length > 0;
  const preValidationBlocks = preValidation.verdict !== "PASS" && (!isDirectInput || hasCriticalBlock);

  if (preValidationBlocks) {
    try { tracker.fail("pre_validation_blocked"); } catch (_) { /* best-effort */ }
    postValidation = buildFailedPostValidation("pre_validation_failed", canon, {
      use_vision_validator: String(process.env.USE_VISION_VALIDATOR || "false").toLowerCase() === "true",
      vlm_backend_ready: isVLMAvailable(),
      vlm_status: "skipped",
      semantic_result: "SKIPPED",
      analyzer_unavailable: [],
    });
  } else {
    if (enforceGemini) {
      const runtimeCheck = buildGeminiRuntimeCheck();
      writeJson(artifactPaths.gemini_runtime_check, runtimeCheck);
      const runtimeProbe = !runtimeCheck.has_api_key
        ? { ok: false, http_status: null, error: "GEMINI_API_KEY_MISSING", model: runtimeCheck.model }
        : await validateGeminiRuntime();
      writeJson(artifactPaths.gemini_runtime_probe, runtimeProbe);
    }
    try {
      tracker.advance(SM_STATES.NORMALIZED);
      tracker.advance(SM_STATES.TRANSLATED);
      tracker.advance(SM_STATES.RENDERING);
    } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance rendering states: ${err.message}`); }
    candidateBatch = await runLegacyCandidateBatch({
      job,
      canon,
      promptPackage,
      artifactPaths,
      enforceGemini,
    });
    renderResult = candidateBatch.bestCandidate ? { render: candidateBatch.bestCandidate.render } : null;
    outputFile = candidateBatch.bestCandidate ? candidateBatch.bestCandidate.output_path : null;
    
    // --- EARLY INVARIANT: Stop if no output file after render ---
    if (!outputFile) {
      throw new Error('[EARLY_INVARIANT] Render produced no output file - stopping immediately');
    }
    
    postValidation = candidateBatch.bestCandidate ? candidateBatch.bestCandidate.validator_result : null;
    
    // --- EARLY INVARIANT: Stop if validator did not execute ---
    if (!postValidation || postValidation.validator_executed !== true) {
      throw new Error('[EARLY_INVARIANT] Validator did not execute - stopping immediately');
    }
    
    geminiValidation = candidateBatch.bestCandidate ? candidateBatch.bestCandidate.gemini_result : geminiValidation;
    
    // --- EARLY INVARIANT: Stop if gemini parse failed ---
    if (geminiValidation && geminiValidation.parse_ok !== true) {
      throw new Error('[EARLY_INVARIANT] Gemini validation parse failed - stopping immediately');
    }
    
    try {
      tracker.advance(SM_STATES.CRITIQUED);
      tracker.advance(SM_STATES.DRIFT_CHECKED);
      tracker.advance(SM_STATES.POSTCHECKED);
    } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance postcheck states: ${err.message}`); }
  }

  writePostValidation(artifactPaths.post_validation, postValidation);

  if (enforceGemini && !candidateBatch) {
    const runtimeCheck = buildGeminiRuntimeCheck();
    writeJson(artifactPaths.gemini_runtime_check, runtimeCheck);

    if (!runtimeCheck.has_api_key) {
      const runtimeProbe = {
        ok: false,
        http_status: null,
        error: "GEMINI_API_KEY_MISSING",
        model: runtimeCheck.model,
      };
      geminiValidation = buildGeminiFailure("GEMINI_API_KEY_MISSING", {
        summary: "GEMINI_API_KEY_MISSING",
      });
      writeJson(artifactPaths.gemini_runtime_probe, runtimeProbe);
      writeGeminiValidation(artifactPaths.gemini_validation, geminiValidation);
    } else {
      const runtimeProbe = await validateGeminiRuntime();
      writeJson(artifactPaths.gemini_runtime_probe, runtimeProbe);
      if (!runtimeProbe.ok) {
        geminiValidation = buildGeminiFailure(runtimeProbe.error || "GEMINI_REQUEST_FAILED", {
          summary: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
          raw: runtimeProbe,
        });
        } else {
          const legacyShotType = inferShotType(job, promptPackage);
          geminiValidation = await runLegacyGeminiValidation(
            outputFile,
            {
              promptPath: resolveGeminiJudgePromptPath(legacyShotType),
              shotType: legacyShotType,
            }
          );
        }
      writeGeminiValidation(artifactPaths.gemini_validation, geminiValidation);
    }
  }

  const { finalDecision, summary } = buildDecision({
    job,
    artifactPaths,
    outputFile,
    preValidation,
    postValidation,
    geminiValidation,
    continuity,
    baseline,
    enforceGemini,
    promptPackage,
  });

  const registryResult = await writeOfficialCanonRecord(finalDecision, continuity);
  finalDecision.registry_write = registryResult.registry_write;
  finalDecision.registry_target = registryResult.registry_target;
  finalDecision.registry_path = registryResult.registry_path;
  summary.registry_write = registryResult.registry_write;
  summary.registry_target = registryResult.registry_target;
  summary.registry_path = registryResult.registry_path;

  summary.spec_version = specVersions.spec_version;
  summary.z_blue_spec_version = specVersions.z_blue_spec_version;
  summary.render = renderResult ? renderResult.render || null : null;
  summary.candidates = candidateBatch ? candidateBatch.candidates : [];
  summary.best_candidate = candidateBatch ? candidateBatch.bestCandidate : null;
  summary.best_candidate_summary = candidateBatch && candidateBatch.bestCandidate ? {
    selected_candidate_id: candidateBatch.bestCandidate.candidate_id,
    why_selected: buildCandidateSelectionReason(candidateBatch.bestCandidate),
    usable_level: candidateBatch.bestCandidate.candidate_level,
    dominant_fail_reason: candidateBatch.bestCandidate.dominant_fail_reason,
  } : null;
  summary.candidate_level = candidateBatch && candidateBatch.bestCandidate ? candidateBatch.bestCandidate.candidate_level : "REJECT";
  summary.output_files = finalDecision.output_files;
  summary.shot_type = finalDecision.shot_type;
  summary.lane_rule_applied = finalDecision.lane_rule_applied;
  summary.lane_required_anchors = finalDecision.lane_required_anchors;
  summary.lane_forbidden_anchors = finalDecision.lane_forbidden_anchors;
  summary.lane_priority_override_applied = finalDecision.lane_priority_override_applied;
  summary.color_canon_applied = finalDecision.color_canon_applied;
  summary.color_fail_tokens = finalDecision.color_fail_tokens;
  summary.color_severity = finalDecision.color_severity;
  summary.palette_used = finalDecision.palette_used;
  summary.saturation_estimate = finalDecision.saturation_estimate;
  summary.crimson_area_estimate = finalDecision.crimson_area_estimate;
  summary.shadow_ratio_estimate = finalDecision.shadow_ratio_estimate;
  summary.lane_palette_match = finalDecision.lane_palette_match;
  summary.forbidden_color_detected = finalDecision.forbidden_color_detected;
  summary.color_dominant_fail_reason = finalDecision.color_dominant_fail_reason;
  // Weapon baseline enforcement audit fields
  summary.preservation_mode_used = finalDecision.preservation_mode_used || null;
  summary.baseline_applied = finalDecision.weapon_baseline_applied || false;
  summary.override_applied = finalDecision.weapon_baseline_override_applied || false;
  summary.override_reason = finalDecision.weapon_baseline_override_reason || null;
  summary.anchor_image_used = finalDecision.anchor_image_used || null;
  summary.effective_denoise_strength = finalDecision.effective_denoise_strength || null;
  summary.effective_preservation_strength = finalDecision.effective_preservation_strength || null;
  summary.composition_lock_strength = finalDecision.composition_lock_strength || null;
  summary.silhouette_lock_strength = finalDecision.silhouette_lock_strength || null;
  summary.reconstruction_priority = finalDecision.reconstruction_priority || null;
  summary.prompt_reduction_applied = finalDecision.prompt_reduction_applied || false;
  summary.dominant_fail_reason = finalDecision.dominant_fail_reason;
  summary.correction_guidance = finalDecision.correction_guidance;
  summary.subject_diagnostics = finalDecision.subject_diagnostics;
  summary.final_prompt = promptPackage.structured_prompt || promptPackage.positivePrompt || null;
  summary.negative_prompt = promptPackage.negative_prompt || promptPackage.negativePrompt || null;
  summary.seed = promptPackage.payload ? promptPackage.payload.seed : null;
  summary.requested_steps = summary.render ? summary.render.requested_steps || null : null;
  summary.actual_steps = summary.render ? summary.render.actual_steps || null : null;
  summary.actual_steps_source = summary.render ? summary.render.actual_steps_source || null : null;
  summary.requested_size = summary.render ? summary.render.requested_size || null : null;
  summary.actual_size = summary.render ? summary.render.actual_size || null : null;
  summary.actual_file_size = summary.render ? summary.render.actual_file_size || summary.render.actual_size || null : null;
  summary.size_truth_source = summary.render ? summary.render.size_truth_source || null : null;
  summary.validator_fail_rules = finalDecision.failed_rules || [];
  summary.telemetry_warnings = summary.render ? toArray(summary.render.telemetry_warnings || summary.render.telemetry_warning) : [];
  finalDecision.candidates = summary.candidates;
  finalDecision.best_candidate = summary.best_candidate;
  finalDecision.best_candidate_summary = summary.best_candidate_summary;
  finalDecision.candidate_level = summary.candidate_level;

  // --- INVARIANT GATE: validate final decision before persisting ---
  try {
    assertPreWriteInvariants(finalDecision, {
      postValidation,
      outputFilePath: outputFile,
      enforceGemini,
      sharedState: null,
    });
  } catch (invErr) {
    console.error(`[INVARIANT] Pre-write check failed: ${invErr.message}`);
    // Force REJECT if invariant violated on an ALLOW — never let a bad ALLOW through
    if (finalDecision.decision === "ALLOW") {
      finalDecision.decision = "REJECT";
      finalDecision.status = "FAIL";
      finalDecision.decision_reason = `REJECT: invariant violation: ${invErr.invariant || invErr.message}`;
      summary.decision = "REJECT";
      summary.status = "FAIL";
    }
  }

  // --- STATE MACHINE: mark decided + finalize ---
  try {
    if (tracker.getState() !== SM_STATES.FAILED) {
      tracker.advance(SM_STATES.DECIDED);
      tracker.advance(SM_STATES.LOGGED);
      tracker.advance(SM_STATES.DONE);
    } else {
      tracker.finalize();
    }
  } catch (err) { throw new Error(`[STATE_MACHINE] Failed to finalize: ${err.message}`); }
  writeJson(path.join(runDir, "state_trace.json"), tracker.getTrace());

  writeFinalDecision(artifactPaths.final_decision, finalDecision);
  writeJson(artifactPaths.job_summary, summary);
  await safeNotionLog(finalDecision, preValidation, postValidation);
  
  // --- TASK↔RUN SYNC: Sync task status to terminal state ---
  syncTaskStatusToRun(job.job_id, finalDecision.status);
  
  return summary;
}

async function orchestrateAutoLoop(job) {
  const isTestMode = job.test_mode === true || job.no_retry === true;
  const maxAttempts = isTestMode ? 1 : MAX_RENDER_RETRIES;

  // --- STATE MACHINE TRACKING (auto-loop) ---
  const tracker = createRunTracker(job.job_id);

  if (isTestMode) {
    console.log(`[ORCHESTRATOR] Test mode detected for job ${job.job_id} - limiting to ${maxAttempts} attempt(s), no retry`);
  }

  const canon = loadCanonV2();
  const runDir = ensureDir(path.join(RUNS_DIR, job.job_id));
  const artifactPaths = buildArtifactPaths(runDir);
  const continuity = normalizeContinuity(job, canon.canonVersion);
  const baseline = findBaselineRecord(continuity.entity_id);
  const trace = [];
  let geminiFailureCount = 0;
  const geminiConfig = getGeminiConfig();
  const runtimeCheck = {
    has_api_key: geminiConfig.hasKey,
    key_source: geminiConfig.source,
    model: geminiConfig.model,
    cwd: geminiConfig.cwd,
    env_file_detected: geminiConfig.envFileDetected,
  };
  writeJson(artifactPaths.gemini_runtime_check, runtimeCheck);

  if (!geminiConfig.hasKey) {
    const failure = {
      pass_fail: "FAIL",
      fail_rules: ["GEMINI_API_KEY_MISSING"],
      material_read: "unknown",
      correct_reads: [],
      wrong_reads: [],
      severity: "HIGH",
      fix_direction: [],
      summary: "GEMINI_API_KEY_MISSING",
      gemini_validation_executed: false,
      parse_ok: false,
      error: "GEMINI_API_KEY_MISSING",
    };
    writeJson(artifactPaths.gemini_runtime_probe, {
      ok: false,
      http_status: null,
      error: "GEMINI_API_KEY_MISSING",
      model: geminiConfig.model,
    });
    writeGeminiValidation(artifactPaths.gemini_validation, failure);
    const finalDecision = {
      job_id: job.job_id,
      status: "FAIL",
      decision: "REJECT",
      decision_reason: "REJECT: GEMINI_API_KEY_MISSING",
      output_files: [],
      output_file_path: null,
      validator_executed: false,
      gemini_validation_executed: false,
      gemini_pass_fail: "FAIL",
      gemini_error: "GEMINI_API_KEY_MISSING",
      failed_rules: ["GEMINI_API_KEY_MISSING"],
      artifact_paths: artifactPaths,
      continuity,
      attempt_count: 0,
    };
    writeJson(artifactPaths.merged_decision, finalDecision);
    writeFinalDecision(artifactPaths.final_decision, finalDecision);
    writeJson(artifactPaths.job_summary, finalDecision);
    writeText(artifactPaths.summary_txt, "REJECT: GEMINI_API_KEY_MISSING");
    
    // --- TASK↔RUN SYNC: Sync task status to terminal state ---
    syncTaskStatusToRun(job.job_id, finalDecision.status);
    
    return finalDecision;
  }

  const runtimeProbe = await validateGeminiRuntime();
  writeJson(artifactPaths.gemini_runtime_probe, runtimeProbe);
  if (!runtimeProbe.ok) {
    const failure = {
      pass_fail: "FAIL",
      fail_rules: [runtimeProbe.error || "GEMINI_REQUEST_FAILED"],
      material_read: "unknown",
      correct_reads: [],
      wrong_reads: [],
      severity: "HIGH",
      fix_direction: [],
      summary: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
      gemini_validation_executed: false,
      parse_ok: false,
      error: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
    };
    writeGeminiValidation(artifactPaths.gemini_validation, failure);
    const finalDecision = {
      job_id: job.job_id,
      status: "FAIL",
      decision: "REJECT",
      decision_reason: `REJECT: ${runtimeProbe.error || "GEMINI_REQUEST_FAILED"}`,
      output_files: [],
      output_file_path: null,
      validator_executed: false,
      gemini_validation_executed: false,
      gemini_pass_fail: "FAIL",
      gemini_error: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
      failed_rules: [runtimeProbe.error || "GEMINI_REQUEST_FAILED"],
      artifact_paths: artifactPaths,
      continuity,
      attempt_count: 0,
    };
    writeJson(artifactPaths.merged_decision, finalDecision);
    writeFinalDecision(artifactPaths.final_decision, finalDecision);
    writeJson(artifactPaths.job_summary, finalDecision);
    writeText(artifactPaths.summary_txt, `REJECT: ${runtimeProbe.error || "GEMINI_REQUEST_FAILED"}`);
    
    // --- TASK↔RUN SYNC: Sync task status to terminal state ---
    syncTaskStatusToRun(job.job_id, finalDecision.status);
    
    return finalDecision;
  }

  try { tracker.advance(SM_STATES.STRUCTURED); } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to STRUCTURED: ${err.message}`); }

  const intakeRequest = normalizeIdeaRequest(job);
  writeJson(artifactPaths.intake_request, intakeRequest);

  // Query Mikage Brain for relevant context
  const ragQuery = `${intakeRequest.shot_type} ${intakeRequest.generation_mode} ${intakeRequest.user_idea || ''}`;
  console.log(`[RAG] Query started: ${ragQuery}`);
  
  const mikageMemoryContext = await getMikageMemoryContext(ragQuery);
  
  // Create RAG debug artifact
  const ragDebug = {
    rag_executed: true,
    query_used: ragQuery,
    top_k: 5,
    chunks_returned: 0,
    sources: [],
    error: null,
    context_preview: "",
    retriever_mode: getRetrieverMode(),
    real_vertex_verified: isRealVertexVerified(),
    cloud_credentials_present: areCloudCredentialsPresent(),
    context_injected: false,
    // Credential detection fields for vertex mode
    credentials_file_present: false,
    credentials_env_present: false,
    project_id_present: false,
    datastore_config_present: false,
    vertex_client_init_success: false,
    credential_error: null
  };
  
  // Inject memory context into intake request
  if (mikageMemoryContext) {
    intakeRequest.mikage_memory_context = mikageMemoryContext;
    ragDebug.context_injected = true;
    console.log("[RAG] Injected Mikage memory context into intake");
    
    // Parse context for debug info
    const lines = mikageMemoryContext.split('\n');
    const memoryBlocks = lines.filter(line => line.startsWith('[MEMORY'));
    ragDebug.chunks_returned = memoryBlocks.length;
    ragDebug.context_preview = mikageMemoryContext.substring(0, 1500);
    
    // Extract sources
    memoryBlocks.forEach((block, index) => {
      const sourceLine = lines.find((line, i) => line.startsWith('Source:') && i > lines.indexOf(block));
      if (sourceLine) {
        ragDebug.sources.push({
          memory_id: index + 1,
          source: sourceLine.replace('Source:', '').trim()
        });
      }
    });
    
    console.log(`[RAG] Retrieved ${ragDebug.chunks_returned} chunks`);
    
    // Extract credential detection from context (for real vertex mode)
    if (ragDebug.retriever_mode === 'vertex') {
      // Try to extract credential info from the retriever result
      try {
        const { queryMikageBrain } = require('./rag/rag_retriever_resolver');
        const retriever = require('./rag/rag_retriever_resolver');
        // Note: This is a simplified approach - in a real implementation,
        // we'd pass the full query result back from the retriever
      } catch (e) {
        // Fallback - set basic credential detection
        ragDebug.credentials_file_present = require('fs').existsSync('service-account-key.json');
        ragDebug.credentials_env_present = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        ragDebug.project_id_present = true; // Hardcoded in retriever
        ragDebug.datastore_config_present = true; // Hardcoded in retriever
        ragDebug.vertex_client_init_success = ragDebug.chunks_returned > 0;
      }
    }
  } else {
    console.log("[RAG] Fallback path used - no context retrieved");
    ragDebug.rag_executed = false;
    ragDebug.error = "No context returned";
    
    // For vertex mode, capture credential error
    if (ragDebug.retriever_mode === 'vertex') {
      ragDebug.credentials_file_present = require('fs').existsSync('service-account-key.json');
      ragDebug.credentials_env_present = !!(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      ragDebug.project_id_present = true; // Hardcoded in retriever
      ragDebug.datastore_config_present = true; // Hardcoded in retriever
      ragDebug.vertex_client_init_success = false;
      ragDebug.credential_error = "No context returned from Vertex query";
    }
  }
  
  // Write RAG debug artifact
  writeJson(path.join(artifactPaths.run_dir, "rag_context.json"), ragDebug);

  const geminiIntake = await runGeminiIntake(
    intakeRequest,
    path.join(ROOT_DIR, "prompts", "gemini_intake.txt")
  );
  writeJson(artifactPaths.gemini_intake, geminiIntake);

  try { tracker.advance(SM_STATES.PRECHECKED); } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to PRECHECKED: ${err.message}`); }
  const geminiPrecheck = runGeminiPrecheck(geminiIntake);
  writeJson(artifactPaths.gemini_precheck, geminiPrecheck);

  if (geminiPrecheck.status === "REJECT") {
    const finalDecision = buildPrecheckFailureDecision(job, artifactPaths, continuity, geminiPrecheck);
    writeJson(artifactPaths.merged_decision, finalDecision);
    writeFinalDecision(artifactPaths.final_decision, finalDecision);
    writeJson(artifactPaths.job_summary, finalDecision);
    writeText(artifactPaths.summary_txt, finalDecision.decision_reason);
    // Update shared_state to terminal state for precheck reject
    updateSharedStateTerminal(job.job_id, finalDecision.decision, finalDecision.status);
    
    // --- TASK↔RUN SYNC: Sync task status to terminal state ---
    syncTaskStatusToRun(job.job_id, finalDecision.status);
    
    return finalDecision;
  }

  const precheckedIntake = mergeGeminiPrecheckIntake(geminiIntake, geminiPrecheck);
  writeJson(artifactPaths.gemini_intake, precheckedIntake);

  let promptPackage = buildPromptPackageFromIntake(job, intakeRequest, precheckedIntake);
  writeJson(artifactPaths.prompt_package, promptPackage);
  writeJson(artifactPaths.prompt_before, promptPackage);

  try {
    tracker.advance(SM_STATES.NORMALIZED);
    tracker.advance(SM_STATES.TRANSLATED);
  } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to NORMALIZED/TRANSLATED: ${err.message}`); }

  let lastLocalSummary = null;
  let lastLocalValidation = null;
  let lastGeminiValidation = null;

  try { tracker.advance(SM_STATES.RENDERING); } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance to RENDERING: ${err.message}`); }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const attemptDir = ensureDir(path.join(runDir, `attempt-${String(attempt).padStart(2, "0")}`));
    writeJson(artifactPaths.prompt_after, promptPackage);
    writeText(path.join(attemptDir, "prompt.txt"), promptPackage.structured_prompt || "");

    const attemptJob = buildJobFromPromptPackage(job, promptPackage);
    attemptJob.__loop_attempt = attempt;
    lastLocalSummary = await orchestrateLegacy(attemptJob);
    if (lastLocalSummary) {
      lastLocalSummary.prompt_package = promptPackage;
    }
    lastLocalValidation = fs.existsSync(artifactPaths.post_validation)
      ? readJson(artifactPaths.post_validation)
      : null;
    if (lastLocalValidation) {
      writeJson(artifactPaths.validation, lastLocalValidation);
      writeJson(path.join(attemptDir, "validator.json"), lastLocalValidation);
    }
    if (fs.existsSync(artifactPaths.final_payload)) {
      fs.copyFileSync(artifactPaths.final_payload, path.join(attemptDir, "render_payload.json"));
    }
    for (const extraArtifact of ["render_response_raw.json", "render_timing.json", "output_metadata.json"]) {
      const sourcePath = path.join(runDir, extraArtifact);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, path.join(attemptDir, extraArtifact));
      }
    }

    const outputExists = !!(lastLocalSummary && lastLocalSummary.output_file_path && fs.existsSync(lastLocalSummary.output_file_path));
    if (!outputExists) {
      trace.push({
        attempt,
        phase: intakeRequest.phase,
        render_ok: false,
        output_exists: false,
        validator_executed: false,
        gemini_validation_executed: false,
        render_profile: getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job).profile,
        width: getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job).width,
        height: getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job).height,
        steps: getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job).steps,
        refiner_enabled: !getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job).disable_refiner,
        render_duration_seconds: 0,
        decision: "FAIL",
        fail_rules: [],
        primary_failure: "missing output.png",
      });
      break;
    }

    const geminiJudge = await judgeRenderedImage(
      lastLocalSummary.output_file_path,
      {
        promptPath: resolveGeminiJudgePromptPath(promptPackage.shot_type || inferShotType(job, promptPackage)),
      }
    );
    lastGeminiValidation = geminiJudge.raw;
    writeGeminiValidation(artifactPaths.gemini_validation, lastGeminiValidation);
    writeJson(path.join(attemptDir, "gemini_judge.json"), lastGeminiValidation);
    if (outputExists) {
      fs.copyFileSync(lastLocalSummary.output_file_path, path.join(attemptDir, "output.png"));
    }
    const effectiveRender = getEffectiveRenderSettings(promptPackage.render_spec || {}, job.render || {}, job);

    const geminiOk =
      lastGeminiValidation &&
      lastGeminiValidation.gemini_validation_executed === true &&
      lastGeminiValidation.parse_ok === true;
    if (!geminiOk) {
      geminiFailureCount += 1;
    }

    const localPassed = !!(lastLocalValidation && lastLocalValidation.verdict === "PASS");
    const geminiPassed = !!(lastGeminiValidation && lastGeminiValidation.pass_fail === "PASS" && lastGeminiValidation.parse_ok === true);

    trace.push({
      attempt,
      phase: intakeRequest.phase,
      shot_type: promptPackage.shot_type || inferShotType(job, promptPackage),
      render_ok: true,
      output_exists: true,
      validator_executed: !!(lastLocalValidation && lastLocalValidation.validator_executed),
      gemini_validation_executed: !!(lastGeminiValidation && lastGeminiValidation.gemini_validation_executed),
      render_profile: effectiveRender.profile,
      width: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.actual_file_width || lastLocalSummary.render.actual_width || effectiveRender.width : effectiveRender.width,
      height: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.actual_file_height || lastLocalSummary.render.actual_height || effectiveRender.height : effectiveRender.height,
      steps: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.actual_steps || effectiveRender.steps : effectiveRender.steps,
      requested_steps: effectiveRender.steps,
      actual_steps_source: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.actual_steps_source || null : null,
      size_truth_source: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.size_truth_source || null : null,
      actual_file_size: lastLocalSummary && lastLocalSummary.render ? lastLocalSummary.render.actual_file_size || null : null,
      telemetry_warnings: lastLocalSummary && lastLocalSummary.render ? toArray(lastLocalSummary.render.telemetry_warnings || lastLocalSummary.render.telemetry_warning) : [],
      refiner_enabled: !effectiveRender.disable_refiner,
      render_duration_seconds: lastLocalSummary && lastLocalSummary.render && lastLocalSummary.render.render_time_ms
        ? Number((lastLocalSummary.render.render_time_ms / 1000).toFixed(2))
        : 0,
      decision: localPassed && geminiPassed ? "PASS" : "FAIL",
      fail_rules: dedupeStrings([
        ...(lastLocalValidation && lastLocalValidation.rule_engine ? toArray(lastLocalValidation.rule_engine.failed_rules) : []),
        ...(lastGeminiValidation ? toArray(lastGeminiValidation.fail_rules) : []),
      ]),
      recovery_tags: deriveRecoveryTags(lastGeminiValidation),
      subject_recovery_mode_active: buildSubjectDiagnostics(promptPackage.shot_type || inferShotType(job, promptPackage), lastGeminiValidation).subject_recovery_mode_active,
      primary_failure:
        (lastGeminiValidation && toArray(lastGeminiValidation.wrong_reads)[0]) ||
        (lastLocalValidation && lastLocalValidation.rule_engine && toArray(lastLocalValidation.rule_engine.failed_rules)[0]) ||
        (lastGeminiValidation && lastGeminiValidation.summary) ||
        "validation failed",
    });
    writeJson(artifactPaths.run_loop_trace, trace);
    writeJson(path.join(attemptDir, "merged_decision.json"), trace[trace.length - 1]);

    if (localPassed && geminiPassed) {
      break;
    }

    // In test mode, don't retry - just break after first attempt
    if (isTestMode) {
      console.log(`[ORCHESTRATOR] Test mode: not retrying after ${localPassed ? 'PASS' : 'FAIL'}`);
      break;
    }

    const fixBrief = buildFixBrief(job, lastLocalValidation, lastGeminiValidation, promptPackage, {
      ...intakeRequest,
      attempt,
      previous_trace: trace,
    });
    writeJson(artifactPaths.fix_brief, fixBrief);

    if (attempt >= maxAttempts) {
      break;
    }

    if (geminiFailureCount >= 2) {
      break;
    }

    let correctedPromptPackage = buildCorrectedPromptPackage(promptPackage, fixBrief);
    let correctionDiff = buildCorrectionDiff(promptPackage, correctedPromptPackage);
    ({ correctedPromptPackage, correctionDiff } = enforceSubstantiveCorrectionDelta(
      promptPackage,
      correctedPromptPackage,
      correctionDiff,
      fixBrief
    ));
    writeJson(artifactPaths.corrected_prompt_package, correctedPromptPackage);
    writeJson(artifactPaths.correction_diff, correctionDiff);

    promptPackage = {
      ...promptPackage,
      structured_prompt: correctedPromptPackage.corrected_prompt,
      negative_prompt: correctedPromptPackage.corrected_negative_prompt,
      render_spec: correctedPromptPackage.corrected_render_spec,
      scope_lock: correctedPromptPackage.scope_lock,
      locked_prompt_package: correctedPromptPackage.locked_prompt_package,
    };
  }

  writeJson(artifactPaths.run_loop_trace, trace);

  try {
    tracker.advance(SM_STATES.CRITIQUED);
    tracker.advance(SM_STATES.DRIFT_CHECKED);
    tracker.advance(SM_STATES.POSTCHECKED);
  } catch (err) { throw new Error(`[STATE_MACHINE] Failed to advance postcheck states: ${err.message}`); }

  const { finalDecision, summary } = buildClosedLoopDecision({
    job,
    artifactPaths,
    continuity,
    baseline,
    localSummary: lastLocalSummary,
    localValidation: lastLocalValidation,
    geminiValidation: lastGeminiValidation,
    attemptCount: trace.length,
    trace,
  });

  // --- STATE MACHINE: mark decided + finalize ---
  try {
    tracker.advance(SM_STATES.DECIDED);
    tracker.advance(SM_STATES.LOGGED);
    tracker.advance(SM_STATES.DONE);
  } catch (err) { throw new Error(`[STATE_MACHINE] Failed to finalize: ${err.message}`); }
  writeJson(path.join(runDir, "state_trace.json"), tracker.getTrace());

  writeJson(artifactPaths.merged_decision, finalDecision);

  // --- INVARIANT GATE (auto-loop): validate final decision before persisting ---
  try {
    assertPreWriteInvariants(finalDecision, {
      postValidation: lastLocalValidation,
      outputFilePath: finalDecision.output_file_path,
      enforceGemini: true,
      sharedState: null,
    });
  } catch (invErr) {
    console.error(`[INVARIANT] Auto-loop pre-write check failed: ${invErr.message}`);
    if (finalDecision.decision === "ALLOW") {
      finalDecision.decision = "REJECT";
      finalDecision.status = "FAIL";
      finalDecision.decision_reason = `REJECT: invariant violation: ${invErr.invariant || invErr.message}`;
      if (summary) {
        summary.decision = "REJECT";
        summary.status = "FAIL";
      }
    }
  }

  const registryResult = await writeOfficialCanonRecord(finalDecision, continuity);
  finalDecision.registry_write = registryResult.registry_write;
  finalDecision.registry_target = registryResult.registry_target;
  finalDecision.registry_path = registryResult.registry_path;
  summary.registry_write = registryResult.registry_write;
  summary.registry_target = registryResult.registry_target;
  summary.registry_path = registryResult.registry_path;

  writeFinalDecision(artifactPaths.final_decision, finalDecision);
  writeJson(artifactPaths.job_summary, summary);
  writeJson(path.join(runDir, "attempt_index.json"), {
    attempts_used: trace.length,
    latest_attempt: trace.length > 0 ? `attempt-${String(trace.length).padStart(2, "0")}` : null,
  });
  writeText(artifactPaths.summary_txt, buildSummaryText(finalDecision, lastGeminiValidation));
  await safeNotionLog(finalDecision, summary.pre_validation_result, lastLocalValidation);
  
  // Update shared_state to terminal state
  updateSharedStateTerminal(job.job_id, finalDecision.decision, finalDecision.status);
  
  // --- TASK↔RUN SYNC: Sync task status to terminal state ---
  syncTaskStatusToRun(job.job_id, finalDecision.status);
  
  return summary;
}

async function orchestrate(job) {
  // --- INPUT VALIDATION: Validate job payload before processing ---
  const jobValidation = validateSchema('run', { job_id: job.job_id, run_dir: '', status: job.status || 'RETRY', decision: job.decision || 'RETRY', shot_type: job.shot_type || 'ENTITY_MEDIUM', created_at: job.created_at || new Date().toISOString() }, { strict: false });
  if (!jobValidation.valid) {
    throw new Error(`[INPUT_VALIDATION] Invalid job payload: ${jobValidation.errors.join("; ")}`);
  }
  
  if (isIdeaDrivenJob(job)) {
    return orchestrateAutoLoop(job);
  }
  return orchestrateLegacy(job);
}

async function main() {
  const cliArgs = process.argv.slice(2);
  const isAutoMode = cliArgs[0] === "--auto";
  const arg = isAutoMode ? cliArgs[1] : cliArgs[0];
  if (!arg) {
    console.error("Usage: node orchestrator.js <job.json> | --auto <job.json> | --health");
    process.exit(1);
  }

  if (arg === "--health") {
    const health = await runHealthCheck();
    process.stdout.write(`${JSON.stringify(health, null, 2)}\n`);
    return;
  }

  try {
    const job = loadJobFromFile(arg);
    if (!job.job_id) {
      throw new Error("job_id missing in job file");
    }
    const summary = await orchestrate(job);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } catch (error) {
    const fallbackJobId =
      path.basename(arg, path.extname(arg)).replace(/\s+/g, "-") || "orchestrator-failed-run";
    const runDir = ensureDir(path.join(RUNS_DIR, fallbackJobId));
    const artifactPaths = buildArtifactPaths(runDir);
    const failure = {
      job_id: fallbackJobId,
      status: "FAIL",
      decision: "REJECT",
      output_files: [],
      scores: {
        identity_score: null,
        narrative_score: null,
        aesthetic_integrity_score: null,
        anti_polish_score: null,
      },
      drift_flags: [],
      timestamp: nowIso(),
      artifact_paths: artifactPaths,
      error: error.message,
    };
    ensureFinalPayload(artifactPaths, {
      error: error.message,
      generated_at: nowIso(),
    });
    writeJson(artifactPaths.pre_validation, {
      stage: "prompt_package",
      verdict: "REJECT",
      failed_checks: [error.message],
      forbidden_hits: [],
      critical_failures: [error.message],
      canon_version: "v2",
    });
    writePostValidation(artifactPaths.post_validation, {
      stage: "post_render_image",
      verdict: "REJECT",
      validator_executed: false,
      failed_checks: [],
      critical_failures: [error.message],
      forbidden_hits: [],
      analyzer_signals: {},
      missing_signals: [],
      source_files: {},
    });
    writeFinalDecision(artifactPaths.final_decision, {
      job_id: fallbackJobId,
      status: "FAIL",
      decision: "REJECT",
      decision_reason: error.message,
      canon_version: "v2",
      output_files: [],
      output_file_path: null,
      validator_executed: false,
      gemini_validation_executed: false,
      failed_rules: [],
      blocking_unknown_rules: [],
      critical_failures: [error.message],
      forbidden_hits: [],
      analyzer_summary: {},
      scores: failure.scores,
      drift_flags: [],
      artifact_paths: artifactPaths,
      timestamps: { decided_at: nowIso() },
    });
    writeJson(artifactPaths.job_summary, failure);
    
    // --- TASK↔RUN SYNC: Sync task status to terminal state ---
    syncTaskStatusToRun(fallbackJobId, "FAIL");
    
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  orchestrate,
  runHealthCheck,
};
