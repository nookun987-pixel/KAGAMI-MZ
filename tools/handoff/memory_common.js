"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { ensureDir, readJson, writeJson, fileExists, nowIso } = require("../../MIKAGE/shared/utils/fs_utils");

function rootPath(...parts) {
  return path.resolve(__dirname, "..", "..", ...parts);
}

function parseJsonFile(filePath, fallback = null) {
  return readJson(filePath, fallback);
}

function writeJsonFile(filePath, payload) {
  return writeJson(filePath, payload);
}

function listAttemptDirs(options = {}) {
  const traceRoot = path.resolve(options.traceRoot || rootPath("traces"));
  if (!fs.existsSync(traceRoot)) {
    return [];
  }

  const dirs = [];
  for (const jobDir of fs.readdirSync(traceRoot, { withFileTypes: true })) {
    if (!jobDir.isDirectory()) {
      continue;
    }
    const jobPath = path.join(traceRoot, jobDir.name);
    for (const attemptDir of fs.readdirSync(jobPath, { withFileTypes: true })) {
      if (!attemptDir.isDirectory() || !attemptDir.name.startsWith("attempt-")) {
        continue;
      }
      dirs.push(path.join(jobPath, attemptDir.name));
    }
  }

  return dirs.sort();
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function compactTimestamp(value) {
  return String(value || nowIso()).replace(/[-:.TZ]/g, "").slice(0, 14);
}

function getAttemptIndexFromDir(attemptDir) {
  const baseName = path.basename(attemptDir);
  const match = baseName.match(/attempt-(\d+)/);
  return match ? Number(match[1]) : 1;
}

function resolveArtifactPath(rawTrace, type) {
  const laneResult = rawTrace && rawTrace.laneResult || {};
  const artifact = Array.isArray(laneResult.artifacts)
    ? laneResult.artifacts.find((item) => item && item.type === type && item.path)
    : null;

  if (artifact && artifact.path) {
    return artifact.path;
  }

  const metadata = laneResult.metadata || {};
  if (type === "image") {
    return metadata.output_image_path || "";
  }
  if (type === "judge_output_json") {
    return metadata.judge_output_file_path || "";
  }
  if (type === "result_json") {
    return metadata.result_file_path || "";
  }

  return "";
}

function normalizeFinalDecision(attemptDir, options = {}) {
  const finalDecisionPath = path.join(attemptDir, "final_decision.json");
  if (fileExists(finalDecisionPath)) {
    return parseJsonFile(finalDecisionPath, null);
  }

  const snapshotPath = path.join(attemptDir, "final_decision_snapshot.json");
  if (!fileExists(snapshotPath)) {
    return null;
  }

  const snapshot = parseJsonFile(snapshotPath, null);
  if (!snapshot) {
    return null;
  }

  const variantJudgeOutput = parseJsonFile(path.join(attemptDir, "variant_judge_output.json"), null);
  const payload = {
    job_id: snapshot.job_id || path.basename(path.dirname(attemptDir)),
    attempt_index: snapshot.attempt_index || getAttemptIndexFromDir(attemptDir),
    decision: snapshot.decision || null,
    monitorReport: snapshot.monitorReport || null,
    variantJudgeOutput,
    generated_by: options.generatedBy || "tools/handoff/post_run_snapshot_refresh.js",
    generated_at: nowIso(),
  };

  writeJsonFile(finalDecisionPath, payload);
  return payload;
}

function normalizeGeminiValidation(attemptDir, options = {}) {
  const validationPath = path.join(attemptDir, "gemini_validation.json");
  if (fileExists(validationPath)) {
    return parseJsonFile(validationPath, null);
  }

  const rawTrace = parseJsonFile(path.join(attemptDir, "raw_execution_trace.json"), null);
  if (!rawTrace) {
    return null;
  }

  const laneResult = rawTrace.laneResult || {};
  const validatorResult = laneResult.validator_result || {};
  const metadata = laneResult.metadata || {};
  const judgeOutputPath = metadata.judge_output_file_path || resolveArtifactPath(rawTrace, "judge_output_json");
  const judgeOutput = validatorResult.judge_output
    || metadata.judge_output
    || (judgeOutputPath && fileExists(judgeOutputPath) ? parseJsonFile(judgeOutputPath, null) : null);

  if (!judgeOutput) {
    return null;
  }

  const payload = {
    job_id: rawTrace.taskSpec && rawTrace.taskSpec.job_id || rawTrace.job_id || null,
    attempt_index: rawTrace.attempt_index || getAttemptIndexFromDir(attemptDir),
    source: judgeOutput.source || "UNVERIFIED",
    status: judgeOutput.status || "UNVERIFIED",
    quality_score: typeof judgeOutput.quality_score === "number" ? judgeOutput.quality_score : null,
    overall_score: typeof judgeOutput.overall_score === "number" ? judgeOutput.overall_score : null,
    failure_codes: Array.isArray(judgeOutput.failure_codes) ? judgeOutput.failure_codes : [],
    notes: Array.isArray(judgeOutput.notes) ? judgeOutput.notes : judgeOutput.notes ? [judgeOutput.notes] : [],
    judge_output_path: judgeOutputPath || null,
    validator_executed: Boolean(rawTrace.monitorReport || validatorResult),
    validator_passed: Boolean(validatorResult.passed),
    proof_blocked: Boolean(validatorResult.proof_blocked || rawTrace.proof_blocked),
    generated_by: options.generatedBy || "tools/handoff/post_run_snapshot_refresh.js",
    generated_at: nowIso(),
  };

  writeJsonFile(validationPath, payload);
  return payload;
}

function normalizeAttemptArtifacts(attemptDir, options = {}) {
  return {
    finalDecision: normalizeFinalDecision(attemptDir, options),
    geminiValidation: normalizeGeminiValidation(attemptDir, options),
  };
}

function loadAttemptContext(attemptDir) {
  const rawTrace = parseJsonFile(path.join(attemptDir, "raw_execution_trace.json"), {});
  const finalDecision = parseJsonFile(path.join(attemptDir, "final_decision.json"), null);
  const geminiValidation = parseJsonFile(path.join(attemptDir, "gemini_validation.json"), null);
  const variantJudgeOutput = parseJsonFile(path.join(attemptDir, "variant_judge_output.json"), null);
  const dnaLockPacket = parseJsonFile(path.join(attemptDir, "dna_lock_packet.json"), null);
  const variationEnvelope = parseJsonFile(path.join(attemptDir, "variation_envelope.json"), null);
  const variantSpec = parseJsonFile(path.join(attemptDir, "variant_spec.json"), null);
  const qualityFailurePacket = parseJsonFile(path.join(attemptDir, "quality_failure_packet.json"), null);
  const outputImagePath = resolveArtifactPath(rawTrace, "image");
  const judgeOutputPath = resolveArtifactPath(rawTrace, "judge_output_json");

  return {
    attemptDir,
    jobId: rawTrace.taskSpec && rawTrace.taskSpec.job_id || finalDecision && finalDecision.job_id || path.basename(path.dirname(attemptDir)),
    attemptIndex: rawTrace.attempt_index || getAttemptIndexFromDir(attemptDir),
    rawTrace,
    finalDecision,
    geminiValidation,
    variantJudgeOutput,
    dnaLockPacket,
    variationEnvelope,
    variantSpec,
    qualityFailurePacket,
    outputImagePath,
    judgeOutputPath,
    outputExists: fileExists(outputImagePath),
    judgeOutputExists: fileExists(judgeOutputPath),
    finalDecisionExists: fileExists(path.join(attemptDir, "final_decision.json")),
    geminiValidationExists: fileExists(path.join(attemptDir, "gemini_validation.json")),
  };
}

function isCanonHardFail(context) {
  if (!context.variantJudgeOutput) {
    return false;
  }
  return String(context.variantJudgeOutput.verdict || "").startsWith("REJECT_");
}

function isVerifiedPassAttempt(context) {
  const decision = context.finalDecision && context.finalDecision.decision && context.finalDecision.decision.decision || "";
  const geminiSource = context.geminiValidation && String(context.geminiValidation.source || "").toLowerCase();
  return Boolean(
    context.outputExists
    && context.finalDecisionExists
    && context.geminiValidationExists
    && context.geminiValidation
    && context.geminiValidation.validator_executed === true
    && decision === "ALLOW"
    && geminiSource === "live"
    && !isCanonHardFail(context)
  );
}

function buildEntryId(seed, timestamp) {
  return `mem_${compactTimestamp(timestamp)}_${sha256(seed).slice(0, 12)}`;
}

function baseEntry(context, type, content, extra = {}) {
  const timestamp = context.finalDecision && context.finalDecision.decision && context.finalDecision.decision.timestamp
    || context.geminiValidation && context.geminiValidation.generated_at
    || nowIso();
  const semanticSeed = stableStringify({
    type,
    lane: context.rawTrace && context.rawTrace.taskSpec && context.rawTrace.taskSpec.lane || "UNVERIFIED",
    content,
    extra,
  });
  const idSeed = stableStringify({
    source_run: context.jobId,
    type,
    content,
    extra,
  });

  const entry = {
    id: buildEntryId(idSeed, timestamp),
    source_run: context.jobId,
    lane: context.rawTrace && context.rawTrace.taskSpec && context.rawTrace.taskSpec.lane || "UNVERIFIED",
    type,
    content,
    trust_score: 1,
    created_at: timestamp,
    last_used: null,
    status: "active",
    generated_by: "tools/handoff/ingest_verified_artifacts.js",
    generated_at: nowIso(),
    support_count: 1,
    reuse_count: 0,
    fingerprint: sha256(semanticSeed),
    source_artifacts: {
      output_png: context.outputImagePath || null,
      final_decision_json: path.join(context.attemptDir, "final_decision.json"),
      gemini_validation_json: path.join(context.attemptDir, "gemini_validation.json"),
    },
  };

  if (extra.family_id) {
    entry.family_id = extra.family_id;
  }
  if (extra.base_dna_id) {
    entry.base_dna_id = extra.base_dna_id;
  }
  if (extra.variant_id) {
    entry.variant_id = extra.variant_id;
  }

  return entry;
}

function createCandidateEntries(context) {
  const entries = [];
  const variantSpec = context.variantSpec || {};
  const variantJudgeOutput = context.variantJudgeOutput || {};
  const dnaLockPacket = context.dnaLockPacket || {};
  const familyId = variantSpec.variant_family || variantJudgeOutput.variant_family || undefined;
  const baseDnaId = dnaLockPacket.dna_id || variantJudgeOutput.base_dna_id || undefined;
  const outputHash = variantJudgeOutput.output_hash || undefined;
  const shotProfile = Array.isArray(context.rawTrace && context.rawTrace.taskSpec && context.rawTrace.taskSpec.constraints)
    ? (context.rawTrace.taskSpec.constraints.find((item) => String(item).startsWith("SHOT_PROFILE:")) || "").replace("SHOT_PROFILE:", "")
    : "";

  if (variantJudgeOutput && variantJudgeOutput.verdict === "PASS_CANON_VARIANT") {
    entries.push(baseEntry(context, "approved_variant", {
      variant_id: variantJudgeOutput.variant_id || undefined,
      variant_family: variantJudgeOutput.variant_family || undefined,
      base_dna_id: variantJudgeOutput.base_dna_id || undefined,
      output_hash: outputHash,
      allowed_differences: variantJudgeOutput.allowed_differences || [],
      quality_score: variantJudgeOutput.score,
      shot_profile: shotProfile || undefined,
      dna_retention_passed: variantJudgeOutput.dna_retention && variantJudgeOutput.dna_retention.passed === true,
      variant_distinctness_passed: variantJudgeOutput.variant_distinctness && variantJudgeOutput.variant_distinctness.passed === true,
    }, {
      family_id: familyId,
      base_dna_id: baseDnaId,
      variant_id: variantJudgeOutput.variant_id,
    }));
  }

  if (dnaLockPacket && dnaLockPacket.dna_id) {
    entries.push(baseEntry(context, "canon_rule", {
      base_dna_id: dnaLockPacket.dna_id,
      source_job_id: dnaLockPacket.source_job_id || undefined,
      material_dna: dnaLockPacket.material_dna || [],
      edge_dna: dnaLockPacket.edge_dna || [],
      silhouette_grammar: dnaLockPacket.silhouette_grammar || [],
      color_law: dnaLockPacket.color_law || [],
      identity_anchors: dnaLockPacket.identity_anchors || [],
      hard_forbidden_traits: dnaLockPacket.hard_forbidden_traits || [],
    }, {
      family_id: familyId,
      base_dna_id: baseDnaId,
    }));
  }

  entries.push(baseEntry(context, "object_trait", {
    output_hash: outputHash,
    quality_score: context.geminiValidation && context.geminiValidation.quality_score || null,
    material_dna: dnaLockPacket.material_dna || [],
    silhouette_grammar: dnaLockPacket.silhouette_grammar || [],
    identity_anchors: dnaLockPacket.identity_anchors || [],
    allowed_variation_axes: variantSpec.allowed_differences || [],
    shot_profile: shotProfile || undefined,
  }, {
    family_id: familyId,
    base_dna_id: baseDnaId,
    variant_id: variantSpec.variant_id,
  }));

  return entries;
}

function dedupeEntries(entries = []) {
  const map = new Map();
  for (const entry of entries) {
    const existing = map.get(entry.fingerprint);
    if (!existing) {
      map.set(entry.fingerprint, {
        ...entry,
        supporting_runs: [entry.source_run],
      });
      continue;
    }

    const supportingRuns = new Set([...(existing.supporting_runs || []), entry.source_run]);
    map.set(entry.fingerprint, {
      ...existing,
      support_count: supportingRuns.size,
      supporting_runs: [...supportingRuns].sort(),
      trust_score: Math.max(existing.trust_score, entry.trust_score),
      last_seen_at: nowIso(),
    });
  }
  return [...map.values()];
}

function sortEntries(entries = []) {
  return [...entries].sort((left, right) => {
    const trustDelta = (right.trust_score || 0) - (left.trust_score || 0);
    if (trustDelta !== 0) {
      return trustDelta;
    }
    const leftTime = Date.parse(left.last_used || left.created_at || 0);
    const rightTime = Date.parse(right.last_used || right.created_at || 0);
    return rightTime - leftTime;
  });
}

module.exports = {
  rootPath,
  parseJsonFile,
  writeJsonFile,
  listAttemptDirs,
  normalizeFinalDecision,
  normalizeGeminiValidation,
  normalizeAttemptArtifacts,
  loadAttemptContext,
  isVerifiedPassAttempt,
  isCanonHardFail,
  createCandidateEntries,
  dedupeEntries,
  sortEntries,
  sha256,
  stableStringify,
};
