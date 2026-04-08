"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { readJson, writeJson, ensureDir } = require("../MIKAGE/shared/utils/fs_utils");
const variantFailureCodes = require("./variant_failure_codes.json");

const DRIFT_CODES = ["SIGNATURE_DRIFT", "COLOR_DRIFT", "CANON_DRIFT", "ABSTRACT_COMPOSITION", "SYMBOLIC_FRAMING", "FASHION_COMPOSITION", "OBJECT_CENTRALITY_WEAK"];
const IDENTITY_CODES = ["GENERIC_OBJECT", "WEAK_IDENTITY", "PRODUCT_RENDER_LOOK", "DECORATIVE_FORM", "LIGHTWEIGHT_OBJECT"];
const MATERIAL_CODES = ["MATERIAL_PLASTIC", "MATERIAL_RESIN", "SURFACE_TOO_SMOOTH", "MATERIAL_TOO_CLEAN", "MATERIAL_UNIFORM", "CG_PERFECTION"];
const SILHOUETTE_CODES = ["OBJECT_UNREADABLE", "FUNCTIONAL_FORM_WEAK", "FORM_INCONSISTENT", "SILHOUETTE_BREAK", "SILHOUETTE_NOISY"];

function dedupe(values) {
  return [...new Set((values || []).filter(Boolean).map((value) => String(value)))];
}

function stableNormalize(value) {
  if (Array.isArray(value)) {
    return value.map(stableNormalize);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        const current = value[key];
        if (current === undefined) {
          return acc;
        }
        acc[key] = stableNormalize(current);
        return acc;
      }, {});
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return Number(value.toFixed(6));
  }

  return value;
}

function sha256Json(payload) {
  return crypto.createHash("sha256").update(JSON.stringify(stableNormalize(payload))).digest("hex").toUpperCase();
}

function getCodes(packet = {}, judgeOutput = {}) {
  return dedupe([]
    .concat(packet.primary_failure_codes || [])
    .concat(packet.secondary_failure_codes || [])
    .concat(packet.failure_codes || [])
    .concat(judgeOutput.failure_codes || []));
}

function getOutputPath(laneResult = {}) {
  const imageArtifact = (laneResult.artifacts || []).find((artifact) => artifact.type === "image" && artifact.path);
  if (imageArtifact) {
    return imageArtifact.path;
  }
  return laneResult.metadata && laneResult.metadata.output_image_path || "";
}

function getOutputHash(laneResult = {}) {
  const explicit = laneResult.metadata && laneResult.metadata.output_sha256;
  if (explicit) {
    return String(explicit);
  }
  const outputPath = getOutputPath(laneResult);
  if (!outputPath || !fs.existsSync(outputPath)) {
    return "";
  }
  return crypto.createHash("sha256").update(fs.readFileSync(outputPath)).digest("hex").toUpperCase();
}

function getJudgeCachePath(options = {}) {
  return path.resolve(options.judgeCachePath || path.join(process.cwd(), "memory", "judge_cache.json"));
}

function loadJudgeCache(options = {}) {
  const filePath = getJudgeCachePath(options);
  ensureDir(path.dirname(filePath));
  const cache = readJson(filePath, { entries: {} });
  if (!cache.entries || typeof cache.entries !== "object") {
    cache.entries = {};
  }
  return { cache, filePath };
}

function writeJudgeCache(cache, options = {}) {
  const filePath = getJudgeCachePath(options);
  writeJson(filePath, cache);
  return filePath;
}

function buildNormalizedJudgeInput(context = {}, outputHash = "") {
  const variantSpec = context.variantSpec || {};
  const taskSpec = context.taskSpec || {};
  return stableNormalize({
    version: "DETERMINISTIC_VARIANT_JUDGE_V1",
    lane: taskSpec.lane || context.lane || "image",
    output_hash: outputHash,
    base_dna_id: variantSpec.base_dna_id || "",
    variant_id: variantSpec.variant_id || "",
    variant_family: variantSpec.variant_family || "",
    allowed_differences: [...(variantSpec.allowed_differences || [])].sort(),
    render_mode: taskSpec.context && taskSpec.context.requested_render_mode || "",
    shot_profile: Array.isArray(taskSpec.constraints)
      ? (taskSpec.constraints.find((item) => String(item).startsWith("SHOT_PROFILE:")) || "")
      : "",
    contract: {
      drift_codes: DRIFT_CODES,
      identity_codes: IDENTITY_CODES,
      material_codes: MATERIAL_CODES,
      silhouette_codes: SILHOUETTE_CODES,
    },
  });
}

function classifyObservedVerdict(params = {}) {
  const {
    distinctnessPassed,
    repeatabilityConfirmed,
    driftCodes,
    identityCodes,
    materialCodes,
    silhouetteCodes,
  } = params;

  let verdict = "PASS_CANON_VARIANT";
  if (!distinctnessPassed && !repeatabilityConfirmed) {
    verdict = "REJECT_TOO_SIMILAR";
  } else if (driftCodes.length > 0) {
    verdict = "REJECT_DRIFT";
  } else if (identityCodes.length > 0) {
    verdict = "REJECT_IDENTITY_LOSS";
  } else if (materialCodes.length > 0) {
    verdict = "REJECT_MATERIAL_BREAK";
  } else if (silhouetteCodes.length > 0) {
    verdict = "REJECT_SILHOUETTE_BREAK";
  }
  return verdict;
}

function collectHistoricalObservations(context = {}, outputHash = "", normalizedInputHash = "") {
  const traceRoot = path.resolve(context.traceRoot || path.join(process.cwd(), "traces"));
  const observations = [];
  if (!fs.existsSync(traceRoot)) {
    return observations;
  }

  const jobDirs = fs.readdirSync(traceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  for (const jobDir of jobDirs) {
    const attemptDir = path.join(traceRoot, jobDir.name, "attempt-01");
    const variantJudgePath = path.join(attemptDir, "variant_judge_output.json");
    if (!fs.existsSync(variantJudgePath)) {
      continue;
    }

    const payload = readJson(variantJudgePath, {});
    if (!payload || payload.output_hash !== outputHash) {
      continue;
    }
    if (normalizedInputHash && payload.normalized_input_hash && payload.normalized_input_hash !== normalizedInputHash) {
      continue;
    }
    observations.push({
      job_id: payload.job_id || jobDir.name,
      observed_verdict: payload.observed_verdict || payload.verdict || "",
      final_verdict: payload.verdict || "",
      raw_failure_codes: payload.raw_failure_codes || [],
    });
  }

  return observations;
}

function summarizeConsensus(observations = []) {
  const counts = observations.reduce((acc, item) => {
    const verdict = item.observed_verdict || item.final_verdict || "";
    if (!verdict) {
      return acc;
    }
    acc[verdict] = (acc[verdict] || 0) + 1;
    return acc;
  }, {});

  const ordered = Object.entries(counts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const winner = ordered[0] ? ordered[0][0] : "";
  const winnerCount = ordered[0] ? ordered[0][1] : 0;
  const mismatch = ordered.length > 1;

  return {
    counts,
    winner,
    winner_count: winnerCount,
    unstable: mismatch,
  };
}

function judgeVariant(context = {}) {
  const variantSpec = context.variantSpec || {};
  const qualityFailurePacket = context.qualityFailurePacket || {};
  const judgeOutput = context.judgeOutput || {};
  const registry = context.approvedVariantRegistry || { approved_variants: [], rejected_drift_reasons: [] };
  const baseDnaId = variantSpec.base_dna_id || "";
  const outputHash = getOutputHash(context.laneResult || {});
  const normalizedJudgeInput = buildNormalizedJudgeInput(context, outputHash);
  const normalizedInputHash = sha256Json(normalizedJudgeInput);
  const cacheKey = `${outputHash}:${normalizedInputHash}`;
  const codes = getCodes(qualityFailurePacket, judgeOutput);
  const siblings = (registry.approved_variants || []).filter((entry) => entry.base_dna_id === baseDnaId);
  const sameVariant = siblings.find((entry) => entry.variant_id === variantSpec.variant_id);
  const siblingCollision = siblings.find((entry) => entry.variant_id !== variantSpec.variant_id && entry.output_hash && entry.output_hash === outputHash);
  const distinctnessPassed = Boolean((variantSpec.allowed_differences || []).length > 0) && !siblingCollision;
  const repeatabilityConfirmed = Boolean(sameVariant && sameVariant.output_hash && sameVariant.output_hash === outputHash);
  const driftCodes = codes.filter((code) => DRIFT_CODES.includes(code));
  const identityCodes = codes.filter((code) => IDENTITY_CODES.includes(code));
  const materialCodes = codes.filter((code) => MATERIAL_CODES.includes(code));
  const silhouetteCodes = codes.filter((code) => SILHOUETTE_CODES.includes(code));
  const observedVerdict = classifyObservedVerdict({
    distinctnessPassed,
    repeatabilityConfirmed,
    driftCodes,
    identityCodes,
    materialCodes,
    silhouetteCodes,
  });

  const historicalObservations = collectHistoricalObservations(context, outputHash, normalizedInputHash);
  const { cache, filePath } = loadJudgeCache(context);
  const existingEntry = cache.entries[cacheKey] || null;
  const observations = dedupe([])
    .concat((existingEntry && existingEntry.observations || []).map((item) => JSON.stringify(item)))
    .concat(historicalObservations.map((item) => JSON.stringify(item)))
    .concat(JSON.stringify({
      job_id: context.jobId || "",
      observed_verdict: observedVerdict,
      final_verdict: observedVerdict,
      raw_failure_codes: codes,
    }))
    .map((item) => JSON.parse(item));
  const consensus = summarizeConsensus(observations);
  const finalVerdict = existingEntry && existingEntry.final_verdict
    ? existingEntry.final_verdict
    : consensus.winner || observedVerdict;
  const consistencyStatus = consensus.unstable
    ? "HISTORICAL_CONSENSUS"
    : existingEntry && existingEntry.final_verdict
      ? "CACHE_HIT"
      : "LOCKED_SINGLE_VERDICT";

  cache.entries[cacheKey] = {
    cache_key: cacheKey,
    image_hash: outputHash,
    normalized_input_hash: normalizedInputHash,
    normalized_input: normalizedJudgeInput,
    final_verdict: finalVerdict,
    consistency_status: consistencyStatus,
    observation_counts: consensus.counts,
    observations,
    last_job_id: context.jobId || "",
  };
  writeJudgeCache(cache, context);

  const score = typeof judgeOutput.quality_score === "number"
    ? judgeOutput.quality_score
    : typeof qualityFailurePacket.quality_score === "number"
      ? qualityFailurePacket.quality_score
      : 0;
  const finalDriftCodes = finalVerdict === "REJECT_DRIFT" ? driftCodes : [];
  const finalIdentityCodes = finalVerdict === "REJECT_IDENTITY_LOSS" ? identityCodes : [];
  const finalMaterialCodes = finalVerdict === "REJECT_MATERIAL_BREAK" ? materialCodes : [];
  const finalSilhouetteCodes = finalVerdict === "REJECT_SILHOUETTE_BREAK" ? silhouetteCodes : [];
  const dnaRetentionPassed = finalVerdict === "PASS_CANON_VARIANT" || finalVerdict === "REJECT_TOO_SIMILAR";

  return {
    job_id: context.jobId || "",
    variant_id: variantSpec.variant_id || "",
    variant_family: variantSpec.variant_family || "",
    base_dna_id: baseDnaId,
    supported_failure_codes: variantFailureCodes.failure_codes || [],
    allowed_differences: variantSpec.allowed_differences || [],
    output_hash: outputHash,
    normalized_input_hash: normalizedInputHash,
    normalized_judge_input: normalizedJudgeInput,
    observed_verdict: observedVerdict,
    raw_failure_codes: codes,
    consistency_control: {
      cache_key: cacheKey,
      cache_path: filePath,
      consistency_status: consistencyStatus,
      historical_observation_count: observations.length,
      observation_counts: consensus.counts,
      unstable_judge: consensus.unstable,
    },
    verdict: finalVerdict,
    repeatability_confirmed: repeatabilityConfirmed,
    dna_retention: {
      passed: dnaRetentionPassed,
      blocked_by: dedupe([].concat(finalDriftCodes, finalIdentityCodes, finalMaterialCodes, finalSilhouetteCodes)),
    },
    variant_distinctness: {
      passed: distinctnessPassed || repeatabilityConfirmed,
      sibling_collision_variant_id: siblingCollision && siblingCollision.variant_id || "",
    },
    drift_violation: {
      passed: finalDriftCodes.length === 0,
      codes: finalDriftCodes,
    },
    identity_loss: {
      passed: finalIdentityCodes.length === 0,
      codes: finalIdentityCodes,
    },
    material_integrity: {
      passed: finalMaterialCodes.length === 0,
      codes: finalMaterialCodes,
    },
    silhouette_integrity: {
      passed: finalSilhouetteCodes.length === 0,
      codes: finalSilhouetteCodes,
    },
    score,
  };
}

function buildVariantDeltaReport(context = {}) {
  const variantJudgeOutput = context.variantJudgeOutput || {};
  const approvedVariantRegistry = context.approvedVariantRegistry || { approved_variants: [] };
  const siblings = (approvedVariantRegistry.approved_variants || []).filter((entry) => (
    entry.base_dna_id === variantJudgeOutput.base_dna_id
    && entry.variant_family === variantJudgeOutput.variant_family
    && entry.variant_id !== variantJudgeOutput.variant_id
  ));
  const driftDetected = !(variantJudgeOutput.drift_violation && variantJudgeOutput.drift_violation.passed !== false);
  const signatureConsistency = variantJudgeOutput.verdict === "PASS_CANON_VARIANT" ? 1 : driftDetected ? 0.5 : 0.75;

  return {
    job_id: context.jobId || "",
    variant_id: variantJudgeOutput.variant_id || "",
    variant_family: variantJudgeOutput.variant_family || "",
    base_dna_id: variantJudgeOutput.base_dna_id || "",
    dna_retention_passed: Boolean(variantJudgeOutput.dna_retention && variantJudgeOutput.dna_retention.passed),
    variant_distinctness_passed: Boolean(variantJudgeOutput.variant_distinctness && variantJudgeOutput.variant_distinctness.passed),
    drift_detected: driftDetected,
    signature_consistency: signatureConsistency,
    approved_sibling_count: siblings.length,
    repeatability_exists: siblings.some((entry) => entry.variant_family === variantJudgeOutput.variant_family),
    allowed_differences: variantJudgeOutput.allowed_differences || [],
    verdict: variantJudgeOutput.verdict || "REJECT_DRIFT",
  };
}

module.exports = {
  judgeVariant,
  buildVariantDeltaReport,
  buildNormalizedJudgeInput,
};
