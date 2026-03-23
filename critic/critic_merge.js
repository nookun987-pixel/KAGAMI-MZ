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
  if (!imagePath) {
    throw new Error("[CRITIC_MERGE] imagePath is required");
  }

  // --- Layer 1: Rule-based ---
  const ruleResult = runAllRules(imagePath);

  // --- Layer 2: Vision-based ---
  const visionResult = await runVisionCritic(imagePath);

  // --- Merge ---
  const qualityScore = mergeScores(ruleResult.rule_score, visionResult.vision_score);
  const verdict = mergeVerdicts(qualityScore, ruleResult.verdict, visionResult.verdict);

  // --- Combine issues ---
  const issues = [
    ...ruleResult.issues.map((i) => `[RULE] ${i}`),
    ...visionResult.issues.map((i) => `[VISION] ${i}`),
  ];

  return {
    rule_score: ruleResult.rule_score,
    vision_score: visionResult.vision_score,
    quality_score: qualityScore,
    rule_verdict: ruleResult.verdict,
    vision_verdict: visionResult.verdict,
    verdict,
    rule_detail: ruleResult,
    vision_detail: visionResult,
    issues,
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
