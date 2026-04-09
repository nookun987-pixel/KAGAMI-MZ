"use strict";

const fs = require("fs");
const path = require("path");
const { buildExecutionPacket } = require("./execution_packet_builder");
const { normalizeExecutionResponse } = require("./execution_result_normalizer");
const { runObjectDefinitionLane, extractSpecInheritance } = require("../object_definition/object_definition_bridge");
const { compileCanonPacket } = require("../canon/canon_rule_compiler");
const { runGeminiIntake } = require("../gemini_intake");
const { runGeminiPrecheck } = require("../gemini_precheck");
const { judgeRenderedImage, validateGeminiRuntime } = require("../gemini_connector");
const { classifyApprovedObjectRecord, deriveApprovedIdentityKey } = require("../memory/approved_object_memory");
const { persistSanitizedDesignReferences } = require("../canon_evolution/design_reference_sanitizer");
const { resolveCanonV2 } = require("../canon_evolution/canon_v2_resolver");
const { observeCanonV2Failure, upsertCanonV2Traits } = require("../canon_evolution/canon_v2_writer");

const DEFAULT_EXECUTION_REGISTRY_PATH = path.join(__dirname, "..", "memory", "execution_registry.json");
const DEFAULT_RUNS_DIR = path.join(__dirname, "..", "runs");
const DEFAULT_APPROVED_OBJECT_LIBRARY_PATH = path.join(__dirname, "..", "memory", "approved_object_library.json");
const DEFAULT_GEMINI_INTAKE_PROMPT_PATH = path.join(__dirname, "..", "prompts", "gemini_intake.txt");
const DEFAULT_GEMINI_MATERIAL_PROMPT_PATH = path.join(__dirname, "..", "prompts", "gemini_material_validator.txt");
const DEFAULT_GEMINI_WEAPON_PROMPT_PATH = path.join(__dirname, "..", "prompts", "gemini_weapon_validator.txt");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function normalizeText(value) {
  return String(value || "").trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = normalizeText(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

function getRegistryPath() {
  return process.env.EXECUTION_REGISTRY_PATH || DEFAULT_EXECUTION_REGISTRY_PATH;
}

function ensureRegistryFile() {
  try {
    const registryPath = getRegistryPath();
    const dir = path.dirname(registryPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(registryPath)) fs.writeFileSync(registryPath, "[]", "utf8");
    return registryPath;
  } catch (_) {
    return getRegistryPath();
  }
}

function readExecutionRegistry() {
  try {
    const parsed = JSON.parse(fs.readFileSync(ensureRegistryFile(), "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`[EXECUTION] Registry read error (non-fatal): ${error.message}`);
    return [];
  }
}

function writeExecutionRegistry(records) {
  try {
    fs.writeFileSync(ensureRegistryFile(), JSON.stringify(Array.isArray(records) ? records : [], null, 2), "utf8");
    return true;
  } catch (error) {
    console.warn(`[EXECUTION] Registry write error (non-fatal): ${error.message}`);
    return false;
  }
}

function appendExecutionRegistry(entry) {
  const records = readExecutionRegistry();
  records.push(entry);
  writeExecutionRegistry(records);
  return entry;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

function writeJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

function readJsonSafe(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function dedupeCsvSegments(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const parts = String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    for (const part of parts) {
      const key = part.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      output.push(part);
    }
  }
  return output;
}

function mergePromptSegments(...values) {
  return dedupeCsvSegments(values).join(", ");
}

function buildBlockReasons(rawResponse, objectReadabilityPassed, outputExists, outputArtifactExists, postValidation, geminiValidation) {
  const reasons = [];
  if (rawResponse && rawResponse.control_stage && (rawResponse.error_reason || rawResponse.error)) {
    reasons.push(rawResponse.error_reason || rawResponse.error);
  }
  if (!outputExists) reasons.push("NO_REAL_IMAGE_ON_DISK");
  if (!outputArtifactExists) reasons.push("OUTPUT_PNG_MISSING");
  if (!objectReadabilityPassed) reasons.push("OBJECT_READABILITY_FAIL");

  for (const value of toArray(postValidation && postValidation.canon_hard_failures)) {
    reasons.push(`CANON_HARD_REJECT:${value}`);
  }
  for (const value of toArray(postValidation && postValidation.hard_reject_hits)) {
    reasons.push(`VALIDATOR_HARD_REJECT:${value}`);
  }
  for (const value of toArray(postValidation && postValidation.critical_failures)) {
    reasons.push(`VALIDATOR_CRITICAL_FAIL:${value}`);
  }
  for (const value of toArray(postValidation && postValidation.blocking_unknown_rules)) {
    reasons.push(`VALIDATOR_UNKNOWN_BLOCK:${value}`);
  }
  if (postValidation && postValidation.validator_executed === true && postValidation.validator_verdict === "REJECT") {
    reasons.push("LOCAL_VALIDATOR_REJECT");
  }
  if (postValidation && postValidation.semantic_vlm_executed === true) {
    for (const value of toArray(postValidation.semantic_reject_signals)) {
      reasons.push(`SEMANTIC_REJECT:${value}`);
    }
  }
  if (!(geminiValidation && geminiValidation.gemini_validation_executed === true)) {
    reasons.push(geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_REQUEST_FAILED");
  } else if (!(geminiValidation && geminiValidation.parse_ok === true)) {
    reasons.push(geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_INVALID_JSON");
  } else if (!(geminiValidation && geminiValidation.pass_fail === "PASS")) {
    reasons.push("GEMINI_JUDGE_FAIL");
    reasons.push(...toArray(geminiValidation && geminiValidation.fail_rules));
    reasons.push(...toArray(geminiValidation && geminiValidation.wrong_reads));
  }
  return dedupeStrings(reasons);
}

function normalizeCanonLane(rawLane) {
  const lane = String(rawLane || "").trim().toLowerCase();
  if (!lane) return "unknown";
  if (lane.includes("mask")) return "mask";
  if (lane.includes("weapon")) return "weapon";
  if (lane.includes("material")) return "material";
  if (lane.includes("entity")) return "entity";
  if (lane.includes("environment")) return "environment";
  return lane.replace(/_macro|_medium|_wide/g, "");
}

function normalizeTarget(target) {
  const value = String(target || "orchestrator_local").trim().toLowerCase();
  if (!value) return "orchestrator_local";

  if (
    value === "orchestrator_local" ||
    value === "local" ||
    value === "local_orchestrator" ||
    value === "default"
  ) {
    return "orchestrator_local";
  }

  if (
    value === "colab" ||
    value === "colab_runner" ||
    value === "colab_imagen" ||
    value === "cloud" ||
    value === "cloud_colab"
  ) {
    return "colab_runner";
  }

  if (
    value === "google" ||
    value === "google_imagen" ||
    value === "direct_imagen" ||
    value === "imagen_api"
  ) {
    return "direct_imagen";
  }

  return value;
}

function isRecoveredControlLaneEnabled(packet) {
  if (String(process.env.MIKAGE_ENABLE_RECOVERED_CONTROL_LANE || "true").toLowerCase() === "false") {
    return false;
  }
  const target = normalizeTarget(packet && packet.target);
  return target === "colab_runner" || target === "direct_imagen";
}

function isLiveGeminiControlEnabled(packet) {
  if (!isRecoveredControlLaneEnabled(packet)) return false;
  return String(process.env.MIKAGE_ENABLE_LIVE_GEMINI_CONTROL || "true").toLowerCase() !== "false";
}

function getRunDir(runId) {
  return ensureDir(path.join(process.env.RUNS_DIR || DEFAULT_RUNS_DIR, runId));
}

function buildLiveArtifactPaths(runDir) {
  return {
    run_dir: runDir,
    gemini_intake: path.join(runDir, "gemini_intake.json"),
    gemini_precheck: path.join(runDir, "gemini_precheck.json"),
    pre_validation: path.join(runDir, "pre_validation.json"),
    object_definition: path.join(runDir, "object_definition.json"),
    prompt_package: path.join(runDir, "prompt_package.json"),
    canon_packet: path.join(runDir, "canon_packet.json"),
    canon_v2_traits_resolved: path.join(runDir, "canon_v2_traits_resolved.json"),
    canon_v2_traits_written: path.join(runDir, "canon_v2_traits_written.json"),
    design_reference_sanitation_report: path.join(runDir, "design_reference_sanitation_report.json"),
    canon_v2_fail_analytics: path.join(runDir, "canon_v2_fail_analytics.json"),
    canon_v2_decay_report: path.join(runDir, "canon_v2_decay_report.json"),
    canon_v2_promotion_decisions: path.join(runDir, "canon_v2_promotion_decisions.json"),
    canon_v2_lane_leaderboard_mask_macro: path.join(runDir, "canon_v2_lane_leaderboard_MASK_MACRO.json"),
    canon_v2_lane_leaderboard_entity_medium: path.join(runDir, "canon_v2_lane_leaderboard_ENTITY_MEDIUM.json"),
    canon_v2_lane_leaderboard_weapon_macro: path.join(runDir, "canon_v2_lane_leaderboard_WEAPON_MACRO.json"),
    post_validation: path.join(runDir, "post_validation.json"),
    gemini_validation: path.join(runDir, "gemini_validation.json"),
    final_decision: path.join(runDir, "final_decision.json"),
    job_summary: path.join(runDir, "job_summary.json"),
    output_png: path.join(runDir, "output.png"),
    render_payload: path.join(runDir, "render_job_payload.json"),
    final_payload: path.join(runDir, "final_payload.json"),
  };
}

function buildControlRejectResponse(packet, detail = {}) {
  return {
    status: "FAIL",
    decision: "REJECT",
    result_type: "execution_dispatch",
    error: detail.error || "Recovered control lane rejected request",
    error_reason: detail.error || "Recovered control lane rejected request",
    run_id: packet && packet.run_id || null,
    attempt: packet && packet.attempt || null,
    target: packet && packet.target || null,
    control_stage: detail.control_stage || "object_definition",
    object_definition: detail.object_definition || null,
    canon_packet: detail.canon_packet || null,
    gemini_intake: detail.gemini_intake || null,
    gemini_precheck: detail.gemini_precheck || null,
    pre_validation: detail.pre_validation || null,
  };
}

function buildGeminiIntakeRequest(job = {}, packet = {}) {
  const prompt = normalizeText(job.prompt || job.structured_prompt || packet.spec && packet.spec.prompt || "");
  const idea = normalizeText(job.idea || job.user_idea || prompt);
  return {
    user_idea: idea || prompt,
    phase: normalizeText(job.phase) || "material_study",
    shot_type: normalizeText(job.shot_type || job.lane || packet.lane) || "MASK_MACRO",
    priority_target:
      normalizeText(job.priority_target) ||
      "Controlled manufactured object render with locked material identity and immediate readability.",
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

function buildIntentFromStructuredIntake(basePrompt, intake = {}) {
  const subject = intake.subject && typeof intake.subject === "object" ? intake.subject : {};
  const material = intake.material && typeof intake.material === "object" ? intake.material : {};
  const composition = intake.composition && typeof intake.composition === "object" ? intake.composition : {};
  const lighting = intake.lighting && typeof intake.lighting === "object" ? intake.lighting : {};

  return mergePromptSegments(
    basePrompt,
    intake.direction_summary,
    intake.creative_intent,
    subject.identity,
    material.primary,
    material.surface,
    material.finish,
    composition.shot_type,
    composition.framing,
    composition.camera,
    composition.background,
    lighting.style,
    ...(subject.must_have || []),
    ...(intake.success_criteria || []),
    ...(intake.anti_drift_rules || [])
  );
}

function buildPreValidationPayload({ geminiIntake, geminiPrecheck, effectiveIntake, reason, verdict }) {
  const resolvedVerdict = verdict || (
    geminiIntake && geminiIntake.gemini_executed === true &&
    geminiIntake.parse_ok === true &&
    geminiPrecheck && geminiPrecheck.status !== "REJECT"
      ? "PASS"
      : "REJECT"
  );
  return {
    stage: "pre_render_control",
    verdict: resolvedVerdict,
    gemini_intake_executed: !!(geminiIntake && geminiIntake.gemini_executed === true),
    gemini_parse_ok: !!(geminiIntake && geminiIntake.parse_ok === true),
    precheck_executed: !!geminiPrecheck,
    precheck_pass: !!(geminiPrecheck && geminiPrecheck.pass === true),
    precheck_status: geminiPrecheck ? geminiPrecheck.status : "NOT_RUN",
    precheck_risk_level: geminiPrecheck ? geminiPrecheck.risk_level || null : null,
    precheck_issues: geminiPrecheck ? dedupeStrings(toArray(geminiPrecheck.issues)) : [],
    precheck_fixes: geminiPrecheck ? dedupeStrings(toArray(geminiPrecheck.fixes)) : [],
    revised_applied: !!(geminiPrecheck && geminiPrecheck.status === "REVISE"),
    lane_rule_applied: geminiPrecheck ? geminiPrecheck.lane_rule_applied || null : null,
    lane_required_anchors: geminiPrecheck ? dedupeStrings(toArray(geminiPrecheck.lane_required_anchors)) : [],
    lane_forbidden_anchors: geminiPrecheck ? dedupeStrings(toArray(geminiPrecheck.lane_forbidden_anchors)) : [],
    lane_priority_override_applied: !!(geminiPrecheck && geminiPrecheck.lane_priority_override_applied),
    effective_direction_summary: effectiveIntake ? effectiveIntake.direction_summary || null : null,
    reason: reason || null,
  };
}

function resolveGeminiJudgePromptPath(job = {}, packet = {}) {
  const shotType = String(job.shot_type || job.lane || packet.lane || "").toUpperCase();
  if (shotType.includes("WEAPON")) {
    return DEFAULT_GEMINI_WEAPON_PROMPT_PATH;
  }
  return DEFAULT_GEMINI_MATERIAL_PROMPT_PATH;
}

function buildGeminiValidationFailure(errorCode, overrides = {}) {
  return {
    pass_fail: "FAIL",
    fail_rules: dedupeStrings([...(overrides.fail_rules || []), errorCode]),
    material_read: overrides.material_read || "unknown",
    correct_reads: dedupeStrings(overrides.correct_reads || []),
    wrong_reads: dedupeStrings(overrides.wrong_reads || []),
    severity: overrides.severity || "HIGH",
    fix_direction: dedupeStrings(overrides.fix_direction || []),
    summary: overrides.summary || errorCode || "Gemini validation failed",
    confidence: typeof overrides.confidence === "number" ? overrides.confidence : 0,
    gemini_validation_executed: overrides.gemini_validation_executed === true,
    parse_ok: overrides.parse_ok === true,
    error: overrides.error || errorCode || null,
    source_of_truth: "gemini",
    raw: overrides.raw || null,
  };
}

function buildTransportFailure(packet, error) {
  return {
    status: "FAIL",
    transport_ok: false,
    execution_ok: false,
    result_type: null,
    artifacts: [],
    raw_response_present: false,
    raw_response: null,
    error_type: "TRANSPORT_FAILURE",
    error_reason: error.message,
    run_id: packet.run_id || null,
    attempt: packet.attempt || null,
    target: packet.target || null,
    error: error.message,
  };
}

function ensureOutputArtifact(rawResponse, artifactPaths) {
  const outputPath = rawResponse && (
    rawResponse.output_file_path ||
    rawResponse.output_file ||
    rawResponse.path ||
    (Array.isArray(rawResponse.output_files) && rawResponse.output_files[0] && rawResponse.output_files[0].path) ||
    (Array.isArray(rawResponse.output_files) && typeof rawResponse.output_files[0] === "string" ? rawResponse.output_files[0] : null)
  );

  if (outputPath && fs.existsSync(outputPath) && path.resolve(outputPath) !== path.resolve(artifactPaths.output_png)) {
    ensureDir(path.dirname(artifactPaths.output_png));
    fs.copyFileSync(outputPath, artifactPaths.output_png);
  }

  if (fs.existsSync(artifactPaths.output_png)) return artifactPaths.output_png;
  return outputPath && fs.existsSync(outputPath) ? outputPath : null;
}

function getApprovedObjectLibraryPath() {
  return process.env.APPROVED_OBJECT_LIBRARY_PATH || DEFAULT_APPROVED_OBJECT_LIBRARY_PATH;
}

function upsertApprovedObjectRecord(objectSpec, context = {}) {
  if (!objectSpec || typeof objectSpec !== "object") {
    return { wrote: false, target: null, path: null, reason: "NO_OBJECT_SPEC" };
  }

  const targetPath = getApprovedObjectLibraryPath();
  ensureDir(path.dirname(targetPath));
  const library = readJsonSafe(targetPath, {
    version: "1.0.0",
    description: "Approved object definitions that have passed the readability gate. These are locked specs ready for render.",
    objects: [],
  }) || {};

  if (!Array.isArray(library.objects)) {
    library.objects = [];
  }

  const classification = classifyApprovedObjectRecord(objectSpec);
  if (classification.bucket !== "KEEP") {
    return {
      wrote: false,
      target: "approved_object_library",
      path: targetPath,
      reason: `APPROVED_MEMORY_${classification.bucket}`,
      identity_key: classification.identity_key,
    };
  }

  const identityKey = deriveApprovedIdentityKey(objectSpec);
  const approvedAt = context.timestamp || new Date().toISOString();
  const nextRecord = {
    ...safeClone(objectSpec, {}),
    approved: true,
    approved_at: approvedAt,
    approved_memory_status: "active",
    sanitized_for_live_reuse: true,
    memory_origin: "live_pass",
    last_validated_run_id: context.run_id || null,
  };

  const existingIndex = library.objects.findIndex((entry) => deriveApprovedIdentityKey(entry) === identityKey);
  if (existingIndex >= 0) {
    const existing = library.objects[existingIndex];
    library.objects[existingIndex] = {
      ...existing,
      ...nextRecord,
      object_id: existing.object_id || nextRecord.object_id,
      approved: true,
      approved_at: existing.approved_at || approvedAt,
    };
  } else {
    library.objects.push(nextRecord);
  }

  writeJson(targetPath, library);
  return {
    wrote: true,
    target: "approved_object_library",
    path: targetPath,
    identity_key: identityKey,
    action: existingIndex >= 0 ? "updated" : "created",
  };
}

function getCanonMemoryRegistryPath() {
  return process.env.CANON_MEMORY_REGISTRY_PATH || path.join(process.env.RUNS_DIR || DEFAULT_RUNS_DIR, "canon_memory_registry.json");
}

function appendCanonMemoryRecord(finalDecision, job = {}) {
  const targetPath = getCanonMemoryRegistryPath();
  ensureDir(path.dirname(targetPath));
  const records = readJsonSafe(targetPath, []);
  const nextRecords = Array.isArray(records) ? records : [];
  const existingIndex = nextRecords.findIndex((entry) => entry && entry.job_id === finalDecision.job_id);
  const record = {
    job_id: finalDecision.job_id,
    timestamp: finalDecision.completed_at,
    output_file_path: finalDecision.output_file_path,
    entity_id: job.entity_id || null,
    entity_class: job.entity_class || null,
    zone: job.zone || null,
    weapon: job.weapon || null,
    status: job.status || null,
    canon_version: "v2",
    failed_rules: [],
    decision: "ALLOW",
    reason: finalDecision.decision_reason,
  };

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = record;
  } else {
    nextRecords.push(record);
  }

  writeJson(targetPath, nextRecords);
  return {
    wrote: true,
    target: "canon_memory_registry",
    path: targetPath,
    action: existingIndex >= 0 ? "updated" : "created",
  };
}

async function runLiveGeminiJudge(outputPath, job = {}, packet = {}, runId = null) {
  if (!outputPath || !fs.existsSync(outputPath)) {
    return buildGeminiValidationFailure("GEMINI_IMAGE_READ_FAILED", {
      summary: "GEMINI_IMAGE_READ_FAILED",
    });
  }

  const runtimeProbe = await validateGeminiRuntime();
  if (!runtimeProbe.ok) {
    return buildGeminiValidationFailure(runtimeProbe.error || "GEMINI_REQUEST_FAILED", {
      summary: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
      raw: runtimeProbe,
      error: runtimeProbe.error || "GEMINI_REQUEST_FAILED",
    });
  }

  const promptPath = resolveGeminiJudgePromptPath(job, packet);
  if (!fs.existsSync(promptPath)) {
    return buildGeminiValidationFailure("GEMINI_PROMPT_MISSING", {
      summary: "GEMINI_PROMPT_MISSING",
    });
  }

  try {
    const judged = await judgeRenderedImage(outputPath, { promptPath, job_id: runId });
    const raw = judged && judged.raw ? judged.raw : {};
    const parseOk = raw.parse_ok === true;
    const executed = raw.gemini_validation_executed === true;
    const pass = judged && judged.decision === "PASS" && parseOk && executed;
    const error =
      raw.error ||
      (!executed ? "GEMINI_REQUEST_FAILED" : null) ||
      (!parseOk ? "GEMINI_INVALID_JSON" : null) ||
      (!pass ? "GEMINI_VALIDATOR_FAIL" : null);

    return {
      pass_fail: pass ? "PASS" : "FAIL",
      fail_rules: dedupeStrings([
        ...toArray(raw.fail_rules),
        ...(pass ? [] : toArray(judged && judged.fail_rules)),
        ...(error && error !== "GEMINI_VALIDATOR_FAIL" ? [error] : []),
      ]),
      wrong_reads: dedupeStrings([
        ...toArray(raw.wrong_reads),
        ...toArray(judged && judged.drift_flags),
      ]),
      correct_reads: dedupeStrings(toArray(raw.correct_reads)),
      material_read: raw.material_read || (judged && judged.material_read) || "unknown",
      fix_direction: dedupeStrings([
        ...toArray(raw.fix_direction),
        ...toArray(judged && judged.corrections),
      ]),
      summary: raw.summary || (pass ? "PASS" : error || "Gemini validator FAIL"),
      confidence:
        typeof raw.confidence === "number"
          ? raw.confidence
          : typeof (judged && judged.confidence) === "number"
            ? judged.confidence
            : 0,
      gemini_validation_executed: executed,
      parse_ok: parseOk,
      error: pass ? null : error,
      source_of_truth: "gemini",
      raw,
    };
  } catch (error) {
    return buildGeminiValidationFailure("GEMINI_REQUEST_FAILED", {
      summary: error.message || "GEMINI_REQUEST_FAILED",
      raw: { message: error.message },
      error: "GEMINI_REQUEST_FAILED",
    });
  }
}

function buildFinalDecision(packet, job, artifactPaths, rawResponse, objectDefinition, postValidation, geminiValidation, outputPath) {
  const outputExists = !!outputPath && fs.existsSync(outputPath);
  const outputArtifactExists = fs.existsSync(artifactPaths.output_png);
  const objectReadabilityPassed = !!(objectDefinition && objectDefinition.verdict === "PASS");
  const hardRejectHits = dedupeStrings(toArray(postValidation && postValidation.hard_reject_hits));
  const criticalFailures = dedupeStrings(toArray(postValidation && postValidation.critical_failures));
  const blockingUnknownRules = dedupeStrings(toArray(postValidation && postValidation.blocking_unknown_rules));
  const semanticRejectSignals = dedupeStrings(toArray(postValidation && postValidation.semantic_reject_signals));
  const canonHardFailures = dedupeStrings(toArray(postValidation && postValidation.canon_hard_failures));
  const semanticVlmExecuted = !!(postValidation && postValidation.semantic_vlm_executed === true);
  const semanticBlocking = semanticVlmExecuted && semanticRejectSignals.length > 0;
  const canonBlocking = canonHardFailures.length > 0 || hardRejectHits.length > 0 || criticalFailures.length > 0 || blockingUnknownRules.length > 0;
  const localValidatorPassed =
    !!(
      postValidation &&
      postValidation.validator_executed === true &&
      postValidation.validator_verdict === "PASS" &&
      postValidation.verdict === "PASS"
    ) &&
    canonBlocking === false &&
    semanticBlocking === false;
  const geminiJudgePassed =
    !!(geminiValidation &&
      geminiValidation.gemini_validation_executed === true &&
      geminiValidation.parse_ok === true &&
      geminiValidation.pass_fail === "PASS");
  const allow =
    outputExists &&
    outputArtifactExists &&
    objectReadabilityPassed &&
    localValidatorPassed &&
    semanticBlocking === false &&
    geminiJudgePassed &&
    canonBlocking === false;
  const blockReasons = buildBlockReasons(
    rawResponse,
    objectReadabilityPassed,
    outputExists,
    outputArtifactExists,
    postValidation,
    geminiValidation
  );

  let reason = "ALLOW: real image exists + object readability PASS + local validator PASS + Gemini PASS";
  if (rawResponse && rawResponse.control_stage && (rawResponse.error_reason || rawResponse.error)) {
    reason = rawResponse.error_reason || rawResponse.error;
  } else if (!outputExists) {
    reason = "REJECT: no real image on disk";
  } else if (!outputArtifactExists) {
    reason = "REJECT: output.png missing";
  } else if (!objectReadabilityPassed) {
    reason = "REJECT: object readability gate failed";
  } else if (canonHardFailures.length > 0) {
    reason = `REJECT: canon hard fail: ${canonHardFailures.join(", ")}`;
  } else if (hardRejectHits.length > 0) {
    reason = `REJECT: validator hard reject: ${hardRejectHits.join(", ")}`;
  } else if (criticalFailures.length > 0) {
    reason = `REJECT: validator critical failure: ${criticalFailures.join(", ")}`;
  } else if (blockingUnknownRules.length > 0) {
    reason = `REJECT: validator blocked by unknown canon rules: ${blockingUnknownRules.join(", ")}`;
  } else if (semanticBlocking) {
    reason = `REJECT: semantic VLM reject: ${semanticRejectSignals.join(", ")}`;
  } else if (!localValidatorPassed) {
    reason = rawResponse && (rawResponse.error_reason || rawResponse.error) || "REJECT: local validator failed";
  } else if (!(geminiValidation && geminiValidation.gemini_validation_executed === true)) {
    reason = `REJECT: ${geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_REQUEST_FAILED"}`;
  } else if (!(geminiValidation && geminiValidation.parse_ok === true)) {
    reason = `REJECT: ${geminiValidation && geminiValidation.error ? geminiValidation.error : "GEMINI_INVALID_JSON"}`;
  } else if (!geminiJudgePassed) {
    const geminiReason = dedupeStrings([
      ...toArray(geminiValidation && geminiValidation.fail_rules),
      ...toArray(geminiValidation && geminiValidation.wrong_reads),
      geminiValidation && geminiValidation.summary,
    ]).join(", ");
    reason = `REJECT: Gemini validator FAIL${geminiReason ? `: ${geminiReason}` : ""}`;
  }

  return {
    job_id: packet.run_id || job.job_id || null,
    status: allow ? "DONE" : "FAIL",
    decision: allow ? "ALLOW" : "REJECT",
    decision_reason: reason,
    final_decision_reason: reason,
    source_of_truth: "gemini",
    output_file_path: outputExists ? outputPath : null,
    output_files: outputExists ? ["output.png"] : [],
    execution_runner: normalizeTarget(packet.target),
    validator_executed: !!(postValidation && postValidation.validator_executed === true),
    gemini_validation_executed: !!(geminiValidation && geminiValidation.gemini_validation_executed === true),
    gemini_pass_fail: geminiValidation ? geminiValidation.pass_fail : null,
    gemini_error: geminiValidation ? geminiValidation.error || null : null,
    block_reasons: allow ? [] : blockReasons,
    failed_rules: dedupeStrings([
      ...toArray(postValidation && postValidation.failed_checks),
      ...toArray(postValidation && postValidation.critical_failures),
      ...toArray(postValidation && postValidation.blocking_unknown_rules),
      ...toArray(geminiValidation && geminiValidation.fail_rules),
    ]),
    wrong_reads: geminiValidation ? dedupeStrings(toArray(geminiValidation.wrong_reads)) : [],
    object_readability_verdict: objectDefinition ? objectDefinition.verdict : null,
    object_readability_score: objectDefinition ? objectDefinition.readability_score : null,
    object_readability_passed: objectReadabilityPassed,
    local_validation_pass: localValidatorPassed,
    validator_verdict: postValidation ? postValidation.validator_verdict || null : null,
    semantic_vlm_executed: semanticVlmExecuted,
    semantic_vlm_mode: postValidation ? postValidation.semantic_vlm_mode || postValidation.validation_mode || null : null,
    semantic_validation_mode: postValidation ? postValidation.validation_mode || null : null,
    semantic_reject_signals: semanticRejectSignals,
    semantic_blocking: semanticBlocking,
    canon_hard_failures: canonHardFailures,
    canon_blocking: canonBlocking,
    canon_hard_fail_count: canonHardFailures.length + hardRejectHits.length + criticalFailures.length,
    hard_reject_hits: hardRejectHits,
    critical_failures: criticalFailures,
    blocking_unknown_rules: blockingUnknownRules,
    output_verified: outputExists && outputArtifactExists,
    completed_at: new Date().toISOString(),
    registry_write: false,
    registry_target: null,
    registry_paths: [],
    approved_memory_reused: !!(objectDefinition && objectDefinition.approved_memory_reused),
    approved_memory_identity: objectDefinition && objectDefinition.approved_memory_identity || null,
    memory_sanitation_applied: !!(objectDefinition && objectDefinition.memory_sanitation_applied),
    canon_evolution_reused: !!(
      (objectDefinition && objectDefinition.canon_evolution_reused) ||
      (job && job.canon_evolution_reused) ||
      (job && Array.isArray(job.canon_evolution_source_keys) && job.canon_evolution_source_keys.length > 0)
    ),
    canon_evolution_source_keys: dedupeStrings([
      ...toArray(objectDefinition && objectDefinition.canon_evolution_source_keys),
      ...toArray(job && job.canon_evolution_source_keys),
    ]),
    canon_evolution_writeback: false,
  };
}

function buildJobSummary(packet, job, artifactPaths, objectDefinition, preValidation, postValidation, geminiValidation, finalDecision) {
  const evolution = objectDefinition && objectDefinition.object_spec && objectDefinition.object_spec.canon_evolution || {};
  return {
    job_id: finalDecision.job_id,
    run_id: packet.run_id || null,
    target: packet.target || null,
    lane: job.lane || job.shot_type || packet.lane || null,
    status: finalDecision.status,
    decision: finalDecision.decision,
    decision_reason: finalDecision.decision_reason,
    source_of_truth: finalDecision.source_of_truth,
    artifact_paths: artifactPaths,
    execution_runner: finalDecision.execution_runner,
    object_definition_result: objectDefinition || null,
    pre_validation_result: preValidation || null,
    post_validation_result: postValidation || null,
    gemini_validation_result: geminiValidation || null,
    final_decision_result: finalDecision,
    registry_write: finalDecision.registry_write,
    registry_target: finalDecision.registry_target,
    registry_paths: finalDecision.registry_paths,
    approved_memory_reused: finalDecision.approved_memory_reused,
    approved_memory_identity: finalDecision.approved_memory_identity,
    memory_sanitation_applied: finalDecision.memory_sanitation_applied,
    canon_evolution_reused: finalDecision.canon_evolution_reused,
    canon_evolution_writeback: finalDecision.canon_evolution_writeback,
    canon_evolution_source_keys: finalDecision.canon_evolution_source_keys,
    dominant_traits: evolution.dominant_traits || [],
    supportive_traits: evolution.supportive_traits || [],
    provisional_supportive: evolution.provisional_supportive || [],
    blocked_traits: evolution.blocked_traits || [],
    canon_v2_trait_reuse_affected_prompt: !!(job && job.canon_v2_trait_reuse_affected_prompt),
    canon_v2_trait_reuse_affected_canon_packet: !!(job && job.canon_v2_trait_reuse_affected_canon_packet),
    lane_trait_leaderboards: finalDecision.lane_trait_leaderboards || {},
    canon_v2_fail_analytics: finalDecision.canon_v2_fail_analytics || {},
    canon_v2_promotion_decisions: finalDecision.canon_v2_promotion_decisions || [],
  };
}

function writeCanonV2ObservabilityArtifacts(artifactPaths, resolvedCanonV2) {
  if (!artifactPaths || !resolvedCanonV2) return;
  writeJson(artifactPaths.canon_v2_fail_analytics, resolvedCanonV2.fail_analytics || {});
  writeJson(artifactPaths.canon_v2_decay_report, resolvedCanonV2.decay_report || []);
  writeJson(artifactPaths.canon_v2_promotion_decisions, resolvedCanonV2.promotion_decisions || []);
  writeJson(artifactPaths.canon_v2_lane_leaderboard_mask_macro, resolvedCanonV2.leaderboards_detailed && resolvedCanonV2.leaderboards_detailed.MASK_MACRO || {
    lane: "MASK_MACRO",
    dominant_traits: [],
    supportive_traits: [],
    provisional_supportive_traits: [],
    blocked_traits: [],
  });
  writeJson(artifactPaths.canon_v2_lane_leaderboard_entity_medium, resolvedCanonV2.leaderboards_detailed && resolvedCanonV2.leaderboards_detailed.ENTITY_MEDIUM || {
    lane: "ENTITY_MEDIUM",
    dominant_traits: [],
    supportive_traits: [],
    provisional_supportive_traits: [],
    blocked_traits: [],
  });
  writeJson(artifactPaths.canon_v2_lane_leaderboard_weapon_macro, resolvedCanonV2.leaderboards_detailed && resolvedCanonV2.leaderboards_detailed.WEAPON_MACRO || {
    lane: "WEAPON_MACRO",
    dominant_traits: [],
    supportive_traits: [],
    provisional_supportive_traits: [],
    blocked_traits: [],
  });
}

async function applyRecoveredControlLane(packet) {
  if (!isRecoveredControlLaneEnabled(packet)) {
    return { ok: true, packet };
  }

  const job = safeClone(packet && packet.spec && packet.spec.job_payload, {}) || {};
  const runId = packet.run_id || job.run_id || job.job_id || "RUN-UNKNOWN";
  const runDir = getRunDir(runId);
  const artifactPaths = buildLiveArtifactPaths(runDir);
  const lane = job.lane || job.shot_type || packet.lane || "unknown";
  const canonLane = normalizeCanonLane(lane);
  const originalPrompt =
    job.prompt ||
    job.structured_prompt ||
    job.user_idea ||
    packet.spec && packet.spec.prompt ||
    "";
  const existingNegative =
    job.negative_prompt ||
    packet.spec && packet.spec.negative_prompt ||
    "";

  let effectiveIntake = null;
  let geminiIntake = null;
  let geminiPrecheck = null;
  let preValidation = null;

  if (isLiveGeminiControlEnabled(packet)) {
    const intakeRequest = buildGeminiIntakeRequest(job, packet);
    geminiIntake = await runGeminiIntake(intakeRequest, DEFAULT_GEMINI_INTAKE_PROMPT_PATH, runId);
    writeJson(artifactPaths.gemini_intake, geminiIntake);

    if (!(geminiIntake && geminiIntake.gemini_executed === true && geminiIntake.parse_ok === true)) {
      preValidation = buildPreValidationPayload({
        geminiIntake,
        geminiPrecheck: null,
        effectiveIntake: null,
        verdict: "REJECT",
        reason: geminiIntake && geminiIntake.error ? geminiIntake.error : "GEMINI_REQUEST_FAILED",
      });
      writeJson(artifactPaths.pre_validation, preValidation);
      return {
        ok: false,
        rawResponse: buildControlRejectResponse(packet, {
          error: preValidation.reason,
          control_stage: "gemini_intake",
          gemini_intake: geminiIntake,
          pre_validation: preValidation,
        }),
      };
    }

    geminiPrecheck = runGeminiPrecheck(geminiIntake);
    effectiveIntake = mergeGeminiPrecheckIntake(geminiIntake, geminiPrecheck);
    preValidation = buildPreValidationPayload({
      geminiIntake,
      geminiPrecheck,
      effectiveIntake,
      verdict: geminiPrecheck && geminiPrecheck.status === "REJECT" ? "REJECT" : "PASS",
      reason: geminiPrecheck && geminiPrecheck.status === "REJECT"
        ? (dedupeStrings(toArray(geminiPrecheck.issues))[0] || "Gemini precheck rejected intake")
        : null,
    });
    writeJson(artifactPaths.gemini_precheck, geminiPrecheck);
    writeJson(artifactPaths.pre_validation, preValidation);

    if (geminiPrecheck && geminiPrecheck.status === "REJECT") {
      return {
        ok: false,
        rawResponse: buildControlRejectResponse(packet, {
          error: preValidation.reason || "Gemini precheck rejected intake",
          control_stage: "gemini_precheck",
          gemini_intake: geminiIntake,
          gemini_precheck: geminiPrecheck,
          pre_validation: preValidation,
        }),
      };
    }
  }

  const objectDefinitionInput = effectiveIntake
    ? buildIntentFromStructuredIntake(originalPrompt, effectiveIntake)
    : originalPrompt;
  const sanitation = persistSanitizedDesignReferences();
  const resolvedCanonV2 = resolveCanonV2({ lane: canonLane });
  writeJson(artifactPaths.design_reference_sanitation_report, {
    sanitized_at: sanitation.cleaned && sanitation.cleaned.sanitized_at || new Date().toISOString(),
    cleaned_reference_count: Array.isArray(sanitation.cleaned && sanitation.cleaned.references) ? sanitation.cleaned.references.length : 0,
    historical_only_count: Array.isArray(sanitation.quarantine && sanitation.quarantine.historical_only) ? sanitation.quarantine.historical_only.length : 0,
    quarantined_count: Array.isArray(sanitation.quarantine && sanitation.quarantine.quarantined) ? sanitation.quarantine.quarantined.length : 0,
    dead_count: Array.isArray(sanitation.quarantine && sanitation.quarantine.dead) ? sanitation.quarantine.dead.length : 0,
    cleaned_path: sanitation.paths && sanitation.paths.cleanedPath || null,
    quarantine_path: sanitation.paths && sanitation.paths.quarantinePath || null,
  });
  writeJson(artifactPaths.canon_v2_traits_resolved, resolvedCanonV2);
  writeCanonV2ObservabilityArtifacts(artifactPaths, resolvedCanonV2);

  const objectDefinition = runObjectDefinitionLane(objectDefinitionInput, {
    shot_type: job.shot_type || lane,
    lane: canonLane,
    entity_id: job.entity_id || null,
  });
  const canonPacket = compileCanonPacket({ lane: canonLane });

  writeJson(artifactPaths.object_definition, objectDefinition);
  writeJson(artifactPaths.canon_packet, canonPacket);

  if (objectDefinition.verdict === "REJECT" || objectDefinition.verdict === "NORMALIZER_REJECT") {
    writeJson(artifactPaths.prompt_package, {
      rejected: true,
      lane,
      raw_intent: objectDefinitionInput,
      object_definition_verdict: objectDefinition.verdict,
      object_definition_reason: objectDefinition.rejection_reason,
      canon_packet: canonPacket,
      gemini_intake_executed: !!(geminiIntake && geminiIntake.gemini_executed === true),
      pre_validation: preValidation,
    });
    return {
      ok: false,
      rawResponse: buildControlRejectResponse(packet, {
        error: objectDefinition.rejection_reason || "Object definition rejected request",
        control_stage: "object_definition",
        object_definition: objectDefinition,
        canon_packet: canonPacket,
        gemini_intake: geminiIntake,
        gemini_precheck: geminiPrecheck,
        pre_validation: preValidation,
      }),
    };
  }

  const inheritance = objectDefinition.object_spec
    ? extractSpecInheritance(objectDefinition.object_spec)
    : null;
  const compiledPrompt = mergePromptSegments(
    objectDefinition.compiled_prompt || "",
    objectDefinitionInput,
    ...(canonPacket.positive_rules || [])
  );
  const compiledNegative = mergePromptSegments(
    objectDefinition.compiled_negative || "",
    existingNegative,
    ...(effectiveIntake && effectiveIntake.subject && effectiveIntake.subject.must_not_have || []),
    ...(effectiveIntake && effectiveIntake.material && effectiveIntake.material.forbidden_reads || []),
    ...(canonPacket.negative_rules || [])
  );

  const promptPackage = {
    lane,
    structured_prompt: compiledPrompt,
    negative_prompt: compiledNegative,
    object_definition_inheritance: inheritance,
    object_definition_applied: !!inheritance,
    object_definition_verdict: objectDefinition.verdict,
    canon_packet: canonPacket,
    gemini_intake_executed: !!(geminiIntake && geminiIntake.gemini_executed === true),
    pre_validation: preValidation,
    approved_memory_reused: !!objectDefinition.approved_memory_reused,
    approved_memory_identity: objectDefinition.approved_memory_identity || null,
    memory_sanitation_applied: !!objectDefinition.memory_sanitation_applied,
    canon_evolution_reused: !!(
      objectDefinition.canon_evolution_reused ||
      canonPacket.canon_evolution_reused
    ),
    canon_evolution_source_keys: dedupeStrings([
      ...toArray(objectDefinition.canon_evolution_source_keys),
      ...toArray(canonPacket.canon_evolution_source_keys),
    ]),
    canon_v2_trait_reuse_applied: !!resolvedCanonV2.reused,
    canon_v2_trait_reuse_affected_prompt: !!resolvedCanonV2.reused,
    canon_v2_trait_reuse_groups: {
      dominant: (resolvedCanonV2.dominant_traits || []).length,
      supportive: (resolvedCanonV2.supportive_traits || []).length,
      provisional_supportive: (resolvedCanonV2.provisional_supportive || []).length,
      blocked: (resolvedCanonV2.blocked_traits || []).length,
    },
  };
  writeJson(artifactPaths.prompt_package, promptPackage);
  canonPacket.canon_v2_trait_reuse_applied = !!resolvedCanonV2.reused;
  canonPacket.canon_v2_trait_reuse_affected_canon_packet = !!resolvedCanonV2.reused;
  canonPacket.canon_v2_trait_reuse_groups = promptPackage.canon_v2_trait_reuse_groups;
  canonPacket.lane_trait_leaderboards = resolvedCanonV2.leaderboards || {};
  writeJson(artifactPaths.canon_packet, canonPacket);

  const nextJob = {
    ...job,
    run_id: runId,
    lane,
    shot_type: job.shot_type || lane,
    prompt: compiledPrompt,
    structured_prompt: compiledPrompt,
    idea: job.idea || job.user_idea || originalPrompt,
    user_idea: job.user_idea || job.idea || originalPrompt,
    negative_prompt: compiledNegative,
    negativePrompt: compiledNegative,
    object_definition_inheritance: inheritance,
    object_definition_applied: !!inheritance,
    object_definition_verdict: objectDefinition.verdict,
    object_definition_result: objectDefinition,
    canon_packet: canonPacket,
    generalized_canon_packet: canonPacket,
    approved_memory_reused: !!objectDefinition.approved_memory_reused,
    approved_memory_identity: objectDefinition.approved_memory_identity || null,
    memory_sanitation_applied: !!objectDefinition.memory_sanitation_applied,
    canon_evolution_reused: !!(
      objectDefinition.canon_evolution_reused ||
      canonPacket.canon_evolution_reused
    ),
    canon_evolution_source_keys: dedupeStrings([
      ...toArray(objectDefinition.canon_evolution_source_keys),
      ...toArray(canonPacket.canon_evolution_source_keys),
    ]),
    canon_v2_trait_reuse_applied: !!resolvedCanonV2.reused,
    canon_v2_trait_reuse_affected_prompt: !!resolvedCanonV2.reused,
    canon_v2_trait_reuse_affected_canon_packet: !!resolvedCanonV2.reused,
    canon_v2_traits_resolved: resolvedCanonV2,
    gemini_intake: geminiIntake,
    gemini_precheck: geminiPrecheck,
    pre_validation: preValidation,
  };

  const nextPacket = {
    ...packet,
    canon_packet: canonPacket,
    spec: {
      ...(packet.spec || {}),
      prompt: compiledPrompt,
      negative_prompt: compiledNegative,
      job_payload: nextJob,
    },
    metadata: {
      ...(packet.metadata || {}),
      recovered_control_lane: true,
      recovered_control_lane_run_dir: runDir,
      live_artifact_paths: artifactPaths,
    },
  };

  return { ok: true, packet: nextPacket };
}

function buildColabExecutionArgs(packet) {
  const job = safeClone(packet.spec && packet.spec.job_payload, {}) || {};
  const runId = packet.run_id || job.run_id || job.job_id || "RUN-UNKNOWN";
  const jobId = job.job_id || runId;
  const runDir = getRunDir(runId);
  const resolvedLane = job.lane || job.shot_type || packet.lane || "unknown";
  const resolvedPrompt = job.prompt || job.structured_prompt || packet.spec && packet.spec.prompt || "";
  const resolvedIdea = job.idea || job.user_idea || resolvedPrompt || "";
  const resolvedTarget = job.execution_target || job.target || packet.target || null;
  const promptPackage = {
    shot_type: resolvedLane,
    structured_prompt: resolvedPrompt,
    negative_prompt: packet.spec && packet.spec.negative_prompt || "",
    render_spec: safeClone(job.render_spec || job.render || {}, {}),
  };

  return {
    job: {
      ...job,
      job_id: jobId,
      run_id: runId,
      lane: resolvedLane,
      shot_type: job.shot_type || resolvedLane,
      prompt: resolvedPrompt,
      idea: resolvedIdea,
      user_idea: job.user_idea || resolvedIdea,
      execution_target: resolvedTarget,
    },
    promptPackage,
    artifactPaths: {
      ...(packet.metadata && packet.metadata.live_artifact_paths || buildLiveArtifactPaths(runDir)),
      run_dir: runDir,
      output_png: path.join(runDir, "output.png"),
      render_payload: path.join(runDir, "render_job_payload.json"),
      final_payload: path.join(runDir, "final_payload.json"),
    },
  };
}

async function colabRunnerBackend(packet) {
  const { colabRunnerAdapter } = require("../renderers/colab_runner_adapter");
  if (typeof colabRunnerAdapter !== "function") {
    throw new Error("colabRunnerAdapter is not available");
  }

  const args = buildColabExecutionArgs(packet);
  return colabRunnerAdapter(args.job, args.promptPackage, args.artifactPaths);
}

async function directImagenBackend(packet) {
  const { renderExecutorAdapter } = require("../renderers/google_lane_adapter");
  if (typeof renderExecutorAdapter !== "function") {
    throw new Error("renderExecutorAdapter is not available");
  }

  const args = buildColabExecutionArgs(packet);
  return renderExecutorAdapter(args.job, args.promptPackage, args.artifactPaths);
}

async function defaultBackend(packet) {
  const orchestrator = require("../orchestrator");
  if (typeof orchestrator.orchestrate !== "function") {
    throw new Error("orchestrator.orchestrate is not available");
  }
  return orchestrator.orchestrate(packet.spec && packet.spec.job_payload ? packet.spec.job_payload : {});
}

function getDefaultTargetBackends() {
  return {
    orchestrator_local: defaultBackend,
    colab_runner: colabRunnerBackend,
    direct_imagen: directImagenBackend,
  };
}

function resolveBackend(packet, options = {}) {
  if (typeof options.backend === "function") {
    return options.backend;
  }

  const requestedTarget = normalizeTarget(packet && packet.target);
  const targetBackends = {
    ...getDefaultTargetBackends(),
    ...(options.targetBackends || {}),
  };

  if (typeof targetBackends[requestedTarget] === "function") {
    return targetBackends[requestedTarget];
  }

  return async () => ({
    status: "FAIL",
    error: `unsupported execution target: ${packet && packet.target ? packet.target : "unknown"}`,
    error_reason: `unsupported execution target: ${packet && packet.target ? packet.target : "unknown"}`,
    result_type: "execution_dispatch",
    run_id: packet && packet.run_id || null,
    attempt: packet && packet.attempt || null,
    target: packet && packet.target || null,
  });
}

async function finalizeLiveExecution(packet, rawResponse) {
  if (!isRecoveredControlLaneEnabled(packet)) {
    return rawResponse;
  }
  if (!isLiveGeminiControlEnabled(packet)) {
    return rawResponse;
  }

  const job = safeClone(packet && packet.spec && packet.spec.job_payload, {}) || {};
  const runId = packet.run_id || job.run_id || job.job_id || "RUN-UNKNOWN";
  const runDir = packet.metadata && packet.metadata.recovered_control_lane_run_dir
    ? packet.metadata.recovered_control_lane_run_dir
    : getRunDir(runId);
  const artifactPaths = packet.metadata && packet.metadata.live_artifact_paths
    ? packet.metadata.live_artifact_paths
    : buildLiveArtifactPaths(runDir);

  const objectDefinition = readJsonSafe(artifactPaths.object_definition, null);
  const preValidation = readJsonSafe(artifactPaths.pre_validation, job.pre_validation || null);
  const postValidation =
    rawResponse && rawResponse.post_validation
      ? rawResponse.post_validation
      : readJsonSafe(artifactPaths.post_validation, null);
  const outputPath = ensureOutputArtifact(rawResponse || {}, artifactPaths);
  const geminiValidation = isLiveGeminiControlEnabled(packet)
    ? await runLiveGeminiJudge(outputPath, job, packet, runId)
    : buildGeminiValidationFailure("GEMINI_DISABLED_FOR_TEST", {
        summary: "Gemini live control disabled",
        gemini_validation_executed: false,
        parse_ok: false,
        error: "GEMINI_DISABLED_FOR_TEST",
      });

  writeJson(artifactPaths.gemini_validation, geminiValidation);

  const finalDecision = buildFinalDecision(
    packet,
    job,
    artifactPaths,
    rawResponse || {},
    objectDefinition,
    postValidation,
    geminiValidation,
    outputPath
  );

  const registryWrites = [];
  if (finalDecision.decision === "ALLOW" && objectDefinition && objectDefinition.object_spec) {
    registryWrites.push(upsertApprovedObjectRecord(objectDefinition.object_spec, {
      timestamp: finalDecision.completed_at,
      run_id: finalDecision.job_id,
    }));
    registryWrites.push(upsertCanonV2Traits({
      finalDecision,
      objectSpec: objectDefinition.object_spec,
      job,
      canonPacket: job.canon_packet || packet.canon_packet || {},
      postValidation,
      geminiValidation,
    }));
    registryWrites.push(appendCanonMemoryRecord(finalDecision, job));
  } else if (objectDefinition && objectDefinition.object_spec) {
    const downgradeResult = observeCanonV2Failure({
      finalDecision,
      objectSpec: objectDefinition.object_spec,
      job,
      postValidation,
    });
    if (downgradeResult && downgradeResult.traits_written_payload) {
      writeJson(artifactPaths.canon_v2_traits_written, downgradeResult.traits_written_payload);
    }
  }

  const successfulRegistryWrites = registryWrites.filter((entry) => entry && entry.wrote);
  finalDecision.registry_write = successfulRegistryWrites.length > 0;
  finalDecision.registry_target = dedupeStrings(successfulRegistryWrites.map((entry) => entry && entry.target)).join("+") || null;
  finalDecision.registry_paths = dedupeStrings(successfulRegistryWrites.map((entry) => entry && entry.path));
  finalDecision.canon_evolution_writeback = registryWrites.some((entry) => entry && entry.target === "canon_trait_registry" && entry.wrote);
  finalDecision.canon_evolution_source_keys = dedupeStrings([
    ...toArray(finalDecision.canon_evolution_source_keys),
    ...registryWrites
      .filter((entry) => entry && entry.target === "canon_trait_registry")
      .flatMap((entry) => entry.source_keys || []),
  ]);
  const writtenTraitsEntry = registryWrites.find((entry) => entry && entry.target === "canon_trait_registry");
  if (writtenTraitsEntry && writtenTraitsEntry.traits_written_payload) {
    writeJson(artifactPaths.canon_v2_traits_written, writtenTraitsEntry.traits_written_payload);
  }
  const postWriteCanonV2 = resolveCanonV2({ lane: job.lane || job.shot_type || packet.lane || "unknown" });
  finalDecision.lane_trait_leaderboards = postWriteCanonV2.leaderboards || {};
  finalDecision.canon_v2_fail_analytics = postWriteCanonV2.fail_analytics || {};
  finalDecision.canon_v2_promotion_decisions = postWriteCanonV2.promotion_decisions || [];
  writeCanonV2ObservabilityArtifacts(artifactPaths, postWriteCanonV2);

  const summary = buildJobSummary(
    packet,
    job,
    artifactPaths,
    objectDefinition,
    preValidation,
    postValidation,
    geminiValidation,
    finalDecision
  );

  writeJson(artifactPaths.final_decision, finalDecision);
  writeJson(artifactPaths.job_summary, summary);

  return {
    ...(rawResponse || {}),
    status: finalDecision.decision === "ALLOW" ? "DONE" : "FAIL",
    decision: finalDecision.decision,
    error: finalDecision.decision === "ALLOW" ? null : finalDecision.decision_reason,
    error_reason: finalDecision.decision === "ALLOW" ? null : finalDecision.decision_reason,
    output_file_path: finalDecision.output_file_path,
    output_files: finalDecision.output_file_path ? [{ path: finalDecision.output_file_path, type: "image" }] : [],
    post_validation: postValidation,
    gemini_validation: geminiValidation,
    final_decision: finalDecision,
    job_summary: summary,
    result_type: rawResponse && rawResponse.result_type ? rawResponse.result_type : "execution_dispatch",
  };
}

async function dispatchExecution(context = {}, options = {}) {
  let packet = options.packet || buildExecutionPacket(context, options);
  const recoveredControl = await applyRecoveredControlLane(packet);
  if (!recoveredControl.ok) {
    const finalizedRaw = await finalizeLiveExecution(packet, recoveredControl.rawResponse);
    const normalized = normalizeExecutionResponse(finalizedRaw, packet);
    appendExecutionRegistry({
      run_id: packet.run_id,
      attempt: packet.attempt,
      target: packet.target,
      packet,
      normalized_result: normalized,
      timestamp: new Date().toISOString(),
    });
    return {
      packet: safeClone(packet, null),
      normalized_result: normalized,
    };
  }

  packet = recoveredControl.packet;
  const backend = resolveBackend(packet, options);
  let rawResponse;
  try {
    rawResponse = await backend(packet);
  } catch (error) {
    rawResponse = buildTransportFailure(packet, error);
  }

  const finalizedRaw = await finalizeLiveExecution(packet, rawResponse);
  const normalized = normalizeExecutionResponse(finalizedRaw, packet);
  appendExecutionRegistry({
    run_id: packet.run_id,
    attempt: packet.attempt,
    target: packet.target,
    packet,
    normalized_result: normalized,
    timestamp: new Date().toISOString(),
  });
  return {
    packet: safeClone(packet, null),
    normalized_result: normalized,
  };
}

module.exports = {
  DEFAULT_EXECUTION_REGISTRY_PATH,
  getRegistryPath,
  ensureRegistryFile,
  readExecutionRegistry,
  writeExecutionRegistry,
  normalizeTarget,
  resolveBackend,
  dispatchExecution,
};
