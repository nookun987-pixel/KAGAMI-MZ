/**
 * MIKAGE — /critic/rule_critic.js
 * Layer 1 — Rule-based hard checks. No AI. Pure constraint validation.
 *
 * Checks:
 *   1. Negative space ratio (must be >= 0.40)
 *   2. Symmetry (must be broken — tolerance 0.4)
 *   3. Texture variation (must have variation across surface)
 *   4. Surface smoothness (must NOT be too smooth — anti-AI)
 *   5. Subject-to-frame ratio (must be <= 0.30 for wide shots)
 *
 * In production, these use image analysis libraries (sharp, jimp, opencv).
 * The module exposes an injectable analyzer for testability.
 *
 * Scoring: each check returns 0.0–1.0.
 * rule_score = weighted average of all checks.
 * Any single check below 0.40 → verdict FAIL.
 */

"use strict";

// ===================================================================
// THRESHOLDS — from Canon + spec §7
// ===================================================================

const THRESHOLDS = Object.freeze({
  negative_space_min: 0.40,
  symmetry_max: 0.60,          // above this = too symmetrical
  texture_variance_min: 0.30,  // below this = too uniform
  smoothness_max: 0.55,        // above this = plastic/AI look
  subject_ratio_max: 0.30,     // subject max 30% of frame (wide)
  single_check_fail: 0.40,    // any check below this = overall FAIL
});

// ===================================================================
// IMAGE ANALYZER — injectable for testing
// ===================================================================

/**
 * Default analyzer. In production, uses sharp/opencv/jimp.
 * Replace via setAnalyzer() for testing.
 *
 * Each method takes an image path and returns a numeric score.
 */
let _analyzer = {
  /**
   * Measure negative space ratio (0.0 = no space, 1.0 = all space).
   * Production: count pixels below luminance threshold / total pixels.
   */
  measureNegativeSpace(imagePath) {
    return { ratio: 0.50, detail: "simulated" };
  },

  /**
   * Measure bilateral symmetry (0.0 = fully asymmetric, 1.0 = perfect mirror).
   * Production: flip image horizontally, compute SSIM between halves.
   */
  measureSymmetry(imagePath) {
    return { score: 0.35, detail: "simulated" };
  },

  /**
   * Measure texture variance across the image (0.0 = uniform, 1.0 = highly varied).
   * Production: compute local standard deviation of Laplacian across grid cells.
   */
  measureTextureVariance(imagePath) {
    return { variance: 0.55, detail: "simulated" };
  },

  /**
   * Measure surface smoothness (0.0 = rough/textured, 1.0 = perfectly smooth).
   * Production: inverse of high-frequency energy in FFT domain.
   */
  measureSmoothness(imagePath) {
    return { smoothness: 0.40, detail: "simulated" };
  },

  /**
   * Measure subject-to-frame ratio (0.0 = no subject, 1.0 = fills frame).
   * Production: foreground segmentation, compute bounding box area / total area.
   */
  measureSubjectRatio(imagePath) {
    return { ratio: 0.25, detail: "simulated" };
  },
};

/**
 * Inject a custom image analyzer (for testing or alternative backends).
 * @param {Object} analyzer  Must have all measure* methods
 */
function setAnalyzer(analyzer) {
  const required = [
    "measureNegativeSpace",
    "measureSymmetry",
    "measureTextureVariance",
    "measureSmoothness",
    "measureSubjectRatio",
  ];
  for (const method of required) {
    if (typeof analyzer[method] !== "function") {
      throw new Error(`[RULE_CRITIC] Analyzer missing method: ${method}`);
    }
  }
  _analyzer = analyzer;
}

/** Get current analyzer (for inspection). */
function getAnalyzer() {
  return _analyzer;
}

// ===================================================================
// INDIVIDUAL CHECKS
// ===================================================================

/**
 * @typedef {Object} CheckResult
 * @property {string}  check     Check name
 * @property {boolean} pass      Whether it passed
 * @property {number}  score     0.0–1.0 (higher = better)
 * @property {number}  measured  Raw measured value
 * @property {number}  threshold Canon threshold
 * @property {string}  detail    Human-readable explanation
 */

/**
 * Check 1: Negative space ratio.
 * Canon: >= 40% of frame must be negative space.
 *
 * @param {string} imagePath
 * @returns {CheckResult}
 */
function checkNegativeSpace(imagePath) {
  const measurement = _analyzer.measureNegativeSpace(imagePath);
  const ratio = measurement.ratio;
  const threshold = THRESHOLDS.negative_space_min;

  // Score: linear mapping where threshold = 0.75 score, 1.0 ratio = 1.0 score
  // Below threshold: proportional drop
  let score;
  if (ratio >= threshold) {
    score = 0.75 + 0.25 * ((ratio - threshold) / (1.0 - threshold));
  } else {
    score = 0.75 * (ratio / threshold);
  }
  score = Math.max(0, Math.min(1, score));

  return {
    check: "negative_space",
    pass: ratio >= threshold,
    score: Math.round(score * 100) / 100,
    measured: ratio,
    threshold,
    detail: ratio >= threshold
      ? `Negative space ${(ratio * 100).toFixed(1)}% meets Canon minimum ${(threshold * 100).toFixed(0)}%`
      : `Negative space ${(ratio * 100).toFixed(1)}% below Canon minimum ${(threshold * 100).toFixed(0)}%`,
  };
}

/**
 * Check 2: Symmetry (must be broken).
 * Canon: broken symmetry required. symmetry_tolerance = 0.4.
 * Too symmetrical = fail.
 *
 * @param {string} imagePath
 * @returns {CheckResult}
 */
function checkSymmetry(imagePath) {
  const measurement = _analyzer.measureSymmetry(imagePath);
  const symmetryScore = measurement.score;
  const maxAllowed = THRESHOLDS.symmetry_max;

  // Lower symmetry = better (broken symmetry is Canon).
  // Score: inversely proportional — 0.0 symmetry = 1.0 score, max symmetry = 0.0 score.
  let score;
  if (symmetryScore <= maxAllowed) {
    score = 0.75 + 0.25 * ((maxAllowed - symmetryScore) / maxAllowed);
  } else {
    score = 0.75 * (1 - (symmetryScore - maxAllowed) / (1.0 - maxAllowed));
  }
  score = Math.max(0, Math.min(1, score));

  return {
    check: "symmetry",
    pass: symmetryScore <= maxAllowed,
    score: Math.round(score * 100) / 100,
    measured: symmetryScore,
    threshold: maxAllowed,
    detail: symmetryScore <= maxAllowed
      ? `Symmetry ${(symmetryScore * 100).toFixed(1)}% within broken-symmetry tolerance`
      : `Symmetry ${(symmetryScore * 100).toFixed(1)}% exceeds maximum ${(maxAllowed * 100).toFixed(0)}% — too perfect`,
  };
}

/**
 * Check 3: Texture variation.
 * Canon: texture_variation_required = true.
 * Uniform surfaces = fail.
 *
 * @param {string} imagePath
 * @returns {CheckResult}
 */
function checkTextureVariation(imagePath) {
  const measurement = _analyzer.measureTextureVariance(imagePath);
  const variance = measurement.variance;
  const minRequired = THRESHOLDS.texture_variance_min;

  let score;
  if (variance >= minRequired) {
    score = 0.75 + 0.25 * ((variance - minRequired) / (1.0 - minRequired));
  } else {
    score = 0.75 * (variance / minRequired);
  }
  score = Math.max(0, Math.min(1, score));

  return {
    check: "texture_variation",
    pass: variance >= minRequired,
    score: Math.round(score * 100) / 100,
    measured: variance,
    threshold: minRequired,
    detail: variance >= minRequired
      ? `Texture variance ${(variance * 100).toFixed(1)}% shows adequate material differentiation`
      : `Texture variance ${(variance * 100).toFixed(1)}% too uniform — insufficient material break`,
  };
}

/**
 * Check 4: Surface smoothness (anti-AI / anti-plastic).
 * Canon: imperfection_required = true. No over-smooth surfaces.
 * High smoothness = fail.
 *
 * @param {string} imagePath
 * @returns {CheckResult}
 */
function checkSurfaceSmoothness(imagePath) {
  const measurement = _analyzer.measureSmoothness(imagePath);
  const smoothness = measurement.smoothness;
  const maxAllowed = THRESHOLDS.smoothness_max;

  // Lower smoothness = better (imperfection is Canon).
  let score;
  if (smoothness <= maxAllowed) {
    score = 0.75 + 0.25 * ((maxAllowed - smoothness) / maxAllowed);
  } else {
    score = 0.75 * (1 - (smoothness - maxAllowed) / (1.0 - maxAllowed));
  }
  score = Math.max(0, Math.min(1, score));

  return {
    check: "surface_smoothness",
    pass: smoothness <= maxAllowed,
    score: Math.round(score * 100) / 100,
    measured: smoothness,
    threshold: maxAllowed,
    detail: smoothness <= maxAllowed
      ? `Surface smoothness ${(smoothness * 100).toFixed(1)}% within acceptable imperfection range`
      : `Surface smoothness ${(smoothness * 100).toFixed(1)}% exceeds ${(maxAllowed * 100).toFixed(0)}% — reads as AI/plastic`,
  };
}

/**
 * Check 5: Subject-to-frame ratio.
 * Canon (wide): subject max 30% of frame.
 *
 * @param {string} imagePath
 * @returns {CheckResult}
 */
function checkSubjectRatio(imagePath) {
  const measurement = _analyzer.measureSubjectRatio(imagePath);
  const ratio = measurement.ratio;
  const maxAllowed = THRESHOLDS.subject_ratio_max;

  let score;
  if (ratio <= maxAllowed) {
    score = 0.75 + 0.25 * ((maxAllowed - ratio) / maxAllowed);
  } else {
    score = 0.75 * (1 - (ratio - maxAllowed) / (1.0 - maxAllowed));
  }
  score = Math.max(0, Math.min(1, score));

  return {
    check: "subject_ratio",
    pass: ratio <= maxAllowed,
    score: Math.round(score * 100) / 100,
    measured: ratio,
    threshold: maxAllowed,
    detail: ratio <= maxAllowed
      ? `Subject ratio ${(ratio * 100).toFixed(1)}% within Canon maximum ${(maxAllowed * 100).toFixed(0)}%`
      : `Subject ratio ${(ratio * 100).toFixed(1)}% exceeds Canon maximum ${(maxAllowed * 100).toFixed(0)}%`,
  };
}

// ===================================================================
// AGGREGATE
// ===================================================================

/**
 * Run all rule checks and produce aggregate result.
 *
 * rule_score = weighted average:
 *   negative_space:    0.25
 *   symmetry:          0.20
 *   texture_variation: 0.20
 *   surface_smoothness:0.20
 *   subject_ratio:     0.15
 *
 * verdict:
 *   Any single check score < 0.40 → FAIL
 *   rule_score < 0.60 → FAIL
 *   rule_score 0.60–0.75 → REVIEW
 *   rule_score >= 0.75 → PASS
 *
 * @param {string} imagePath
 * @returns {{ rule_score: number, checks: CheckResult[], issues: string[], verdict: string }}
 */
function runAllRules(imagePath) {
  if (!imagePath) {
    throw new Error("[RULE_CRITIC] imagePath is required");
  }

  const checks = [
    checkNegativeSpace(imagePath),
    checkSymmetry(imagePath),
    checkTextureVariation(imagePath),
    checkSurfaceSmoothness(imagePath),
    checkSubjectRatio(imagePath),
  ];

  // Weights
  const weights = {
    negative_space: 0.25,
    symmetry: 0.20,
    texture_variation: 0.20,
    surface_smoothness: 0.20,
    subject_ratio: 0.15,
  };

  // Weighted average
  let weightedSum = 0;
  for (const c of checks) {
    const w = weights[c.check] || 0.20;
    weightedSum += c.score * w;
  }
  const ruleScore = Math.round(weightedSum * 100) / 100;

  // Collect issues (failed checks)
  const issues = checks.filter((c) => !c.pass).map((c) => c.detail);

  // Check for catastrophic single-check failure
  const catastrophic = checks.some((c) => c.score < THRESHOLDS.single_check_fail);

  // Verdict
  let verdict;
  if (catastrophic || ruleScore < 0.60) {
    verdict = "FAIL";
  } else if (ruleScore < 0.75) {
    verdict = "REVIEW";
  } else {
    verdict = "PASS";
  }

  return {
    rule_score: ruleScore,
    checks,
    issues,
    verdict,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  runAllRules,

  // Individual checks
  checkNegativeSpace,
  checkSymmetry,
  checkTextureVariation,
  checkSurfaceSmoothness,
  checkSubjectRatio,

  // Analyzer injection
  setAnalyzer,
  getAnalyzer,

  // Thresholds (read-only)
  THRESHOLDS,
};
