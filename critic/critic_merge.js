/**
 * MIKAGE — /critic/critic_merge.js
 * Combines Layer 1 (rule_critic) + Layer 2 (vision_critic) into single verdict.
 *
 * Formula (from spec §7):
 *   quality_score = (rule_score * 0.6) + (vision_score * 0.4)
 *
 * Verdict:
 *   < 0.60  → REJECT
 *   0.60–0.75 → REVIEW
 *   >= 0.75 → PASS
 *
 * Either layer's standalone FAIL also triggers overall REJECT
 * regardless of combined score (defense in depth).
 */

"use strict";

const { runAllRules } = require("./rule_critic");
const { runVisionCritic } = require("./vision_critic");

// ===================================================================
// WEIGHTS — locked from spec §7
// ===================================================================

const WEIGHTS = Object.freeze({
  rule: 0.6,
  vision: 0.4,
});

// ===================================================================
// MERGE FUNCTIONS
// ===================================================================

/**
 * Merge rule_score and vision_score into quality_score.
 *
 * @param {number} ruleScore    0.0–1.0
 * @param {number} visionScore  0.0–1.0
 * @returns {number}            quality_score 0.0–1.0
 */
function mergeScores(ruleScore, visionScore) {
  const r = Math.max(0, Math.min(1, ruleScore));
  const v = Math.max(0, Math.min(1, visionScore));
  const merged = r * WEIGHTS.rule + v * WEIGHTS.vision;
  return Math.round(merged * 100) / 100;
}

/**
 * Determine verdict from quality_score and layer verdicts.
 *
 * @param {number} qualityScore    Combined score
 * @param {string} ruleVerdict     "PASS" | "REVIEW" | "FAIL"
 * @param {string} visionVerdict   "PASS" | "REVIEW" | "FAIL"
 * @returns {string}               "PASS" | "REVIEW" | "REJECT"
 */
function mergeVerdicts(qualityScore, ruleVerdict, visionVerdict) {
  // Either layer FAIL → overall REJECT (defense in depth)
  if (ruleVerdict === "FAIL" || visionVerdict === "FAIL") {
    return "REJECT";
  }

  // Score thresholds
  if (qualityScore < 0.60) {
    return "REJECT";
  }
  if (qualityScore < 0.75) {
    return "REVIEW";
  }

  // Either layer REVIEW → cap at REVIEW even if combined passes
  if (ruleVerdict === "REVIEW" || visionVerdict === "REVIEW") {
    return "REVIEW";
  }

  return "PASS";
}

// ===================================================================
// FULL CRITIC PIPELINE
// ===================================================================

/**
 * @typedef {Object} CriticResult
 * @property {number}  rule_score      Layer 1 score
 * @property {number}  vision_score    Layer 2 score
 * @property {number}  quality_score   Combined score
 * @property {string}  rule_verdict    Layer 1 verdict
 * @property {string}  vision_verdict  Layer 2 verdict
 * @property {string}  verdict         Final merged verdict: PASS | REVIEW | REJECT
 * @property {Object}  rule_detail     Full rule_critic output
 * @property {Object}  vision_detail   Full vision_critic output
 * @property {string[]} issues         Combined issues from both layers
 */

/**
 * Run the complete critic pipeline on a rendered image.
 *
 * @param {string} imagePath  Path to rendered image
 * @returns {Promise<CriticResult>}
 */
async function runCritic(imagePath) {
  const context = arguments[1] || {};
  if (!imagePath) {
    throw new Error("[CRITIC_MERGE] imagePath is required");
  }

  const ruleResult = runAllRules(imagePath, context);
  const visionResult = await runVisionCritic({
    imagePath,
    prompt: context.prompt || "",
    liveJudgeOutput: context.liveJudgeOutput || null,
  });

  if (visionResult.source !== "live") {
    return {
      source: "unavailable",
      status: "UNAVAILABLE",
      quality_score: null,
      overall_score: null,
      failure_codes: [],
      notes: ["LIVE_JUDGE_UNAVAILABLE"],
      judge_output_path: context.judgeOutputPath || null,
      rule_detail: ruleResult,
      vision_detail: visionResult,
    };
  }

  const qualityScore = typeof visionResult.quality_score === "number"
    ? visionResult.quality_score
    : typeof visionResult.vision_score === "number"
      ? visionResult.vision_score
      : null;
  const overallScore = typeof qualityScore === "number" && typeof ruleResult.rule_score === "number"
    ? mergeScores(ruleResult.rule_score, qualityScore)
    : qualityScore;
  const ruleVerdict = ruleResult.verdict === "UNAVAILABLE" ? "PASS" : ruleResult.verdict;
  const verdict = overallScore === null
    ? "UNAVAILABLE"
    : mergeVerdicts(overallScore, ruleVerdict, visionResult.verdict === "REJECT" ? "FAIL" : visionResult.verdict);
  const failureCodes = [...new Set([]
    .concat(visionResult.failure_codes || [])
    .concat(context.liveJudgeOutput && context.liveJudgeOutput.failure_codes || []))];
  const notes = []
    .concat(ruleResult.issues || [])
    .concat(visionResult.issues || [])
    .filter(Boolean);

  return {
    source: "live",
    status: verdict,
    quality_score: qualityScore,
    overall_score: overallScore,
    failure_codes: failureCodes,
    notes,
    judge_output_path: context.judgeOutputPath || null,
    rule_detail: ruleResult,
    vision_detail: visionResult,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  runCritic,

  // Merge functions (for direct testing)
  mergeScores,
  mergeVerdicts,

  // Weights (read-only)
  WEIGHTS,
};
