/**
 * MIKAGE — /critic/vision_critic.js
 * Layer 2 — AI vision critic. Detects 3 specific issues only.
 *
 * Detections:
 *   1. Plastic/synthetic look
 *   2. Lack of depth (foreground/background separation)
 *   3. Over-polish (too clean, too perfect)
 *
 * In production, calls a VLM (GPT-4V, LLaVA, Qwen2-VL) with
 * task-aligned prompting. The module exposes an injectable VLM
 * backend for testability.
 *
 * vision_score = weighted average of 3 detection confidences (inverted).
 */

"use strict";

// ===================================================================
// THRESHOLDS
// ===================================================================

const THRESHOLDS = Object.freeze({
  plastic_max: 0.35,       // confidence above this = plastic detected
  depth_lack_max: 0.40,    // confidence above this = depth missing
  overpolish_max: 0.35,    // confidence above this = over-polished
});

// ===================================================================
// TASK-ALIGNED PROMPT — sent to VLM in production
// ===================================================================

const VLM_SYSTEM_PROMPT = Object.freeze(
  "You are a technical image quality inspector for a hard sci-fi porcelain " +
  "armor character project. You do NOT evaluate subjective beauty. You report " +
  "structural issues only.\n\n" +
  "Analyze the provided image for exactly 3 criteria. For each, return a " +
  "confidence score from 0.0 (not detected) to 1.0 (strongly detected).\n\n" +
  "1. PLASTIC_LOOK: Are surfaces unnaturally smooth, waxy, or synthetic? " +
  "Does skin or armor read as molded plastic rather than matte ceramic? " +
  "Check for uniform surface finish lacking micro-detail.\n\n" +
  "2. LACK_OF_DEPTH: Is foreground-background separation weak? Are layers " +
  "visually flat? Is there no atmospheric perspective, no depth-of-field " +
  "gradient, no foreground element creating dimensionality?\n\n" +
  "3. OVER_POLISH: Is the image too clean, too perfect, too uniform? " +
  "Are there no imperfections, no wear marks, no micro-cracks, no " +
  "asymmetries? Does it read as digitally perfect rather than physically real?\n\n" +
  "RESPOND ONLY with a JSON object:\n" +
  '{"plastic_look": 0.0, "lack_of_depth": 0.0, "over_polish": 0.0}'
);

// ===================================================================
// VLM BACKEND — injectable for testing
// ===================================================================

/**
 * Default VLM backend. In production, calls a vision-language model.
 * Replace via setVLMBackend() for testing.
 */
let _vlmBackend = {
  /**
   * Analyze an image with the VLM.
   *
   * @param {string} imagePath
   * @param {string} prompt
   * @returns {Promise<{ plastic_look: number, lack_of_depth: number, over_polish: number }>}
   */
  async analyze(imagePath, prompt) {
    // Simulated — passes all checks by default
    return {
      plastic_look: 0.15,
      lack_of_depth: 0.20,
      over_polish: 0.10,
    };
  },
};

/**
 * Inject a custom VLM backend.
 * @param {Object} backend  Must have async analyze(imagePath, prompt)
 */
function setVLMBackend(backend) {
  if (!backend || typeof backend.analyze !== "function") {
    throw new Error("[VISION_CRITIC] VLM backend must have analyze(imagePath, prompt)");
  }
  _vlmBackend = backend;
}

/** Get current VLM backend. */
function getVLMBackend() {
  return _vlmBackend;
}

// ===================================================================
// INDIVIDUAL DETECTIONS
// ===================================================================

/**
 * @typedef {Object} DetectionResult
 * @property {string}  check       Detection name
 * @property {boolean} detected    Whether the issue was found
 * @property {number}  confidence  0.0–1.0 (how confident the defect exists)
 * @property {number}  score       0.0–1.0 (quality score — higher = better, inverted from confidence)
 * @property {number}  threshold   Max allowed confidence before flagging
 * @property {string}  detail      Human-readable description
 */

/**
 * Evaluate plastic look detection result.
 *
 * @param {number} confidence  0.0–1.0 from VLM
 * @returns {DetectionResult}
 */
function evaluatePlasticLook(confidence) {
  const c = Math.max(0, Math.min(1, confidence));
  const threshold = THRESHOLDS.plastic_max;
  const detected = c > threshold;

  // Score is inverse of confidence — less plastic = higher score
  const score = Math.round((1.0 - c) * 100) / 100;

  return {
    check: "plastic_look",
    detected,
    confidence: c,
    score,
    threshold,
    detail: detected
      ? `Plastic/synthetic surface detected (confidence ${(c * 100).toFixed(0)}% > threshold ${(threshold * 100).toFixed(0)}%)`
      : `Surface reads as physically authentic (confidence ${(c * 100).toFixed(0)}% within tolerance)`,
  };
}

/**
 * Evaluate lack of depth detection result.
 *
 * @param {number} confidence  0.0–1.0 from VLM
 * @returns {DetectionResult}
 */
function evaluateLackOfDepth(confidence) {
  const c = Math.max(0, Math.min(1, confidence));
  const threshold = THRESHOLDS.depth_lack_max;
  const detected = c > threshold;

  const score = Math.round((1.0 - c) * 100) / 100;

  return {
    check: "lack_of_depth",
    detected,
    confidence: c,
    score,
    threshold,
    detail: detected
      ? `Foreground-background separation weak (confidence ${(c * 100).toFixed(0)}% > threshold ${(threshold * 100).toFixed(0)}%)`
      : `Depth layering adequate (confidence ${(c * 100).toFixed(0)}% within tolerance)`,
  };
}

/**
 * Evaluate over-polish detection result.
 *
 * @param {number} confidence  0.0–1.0 from VLM
 * @returns {DetectionResult}
 */
function evaluateOverPolish(confidence) {
  const c = Math.max(0, Math.min(1, confidence));
  const threshold = THRESHOLDS.overpolish_max;
  const detected = c > threshold;

  const score = Math.round((1.0 - c) * 100) / 100;

  return {
    check: "over_polish",
    detected,
    confidence: c,
    score,
    threshold,
    detail: detected
      ? `Over-polished/too-perfect surface (confidence ${(c * 100).toFixed(0)}% > threshold ${(threshold * 100).toFixed(0)}%)`
      : `Appropriate imperfection present (confidence ${(c * 100).toFixed(0)}% within tolerance)`,
  };
}

// ===================================================================
// AGGREGATE
// ===================================================================

/**
 * Run full vision critic analysis.
 *
 * vision_score = weighted average of individual scores:
 *   plastic_look:   0.40  (most critical — Canon anti-AI rule)
 *   lack_of_depth:  0.25
 *   over_polish:    0.35  (imperfection is Canon core)
 *
 * verdict:
 *   vision_score < 0.60 → FAIL
 *   vision_score 0.60–0.75 → REVIEW
 *   vision_score >= 0.75 → PASS
 *
 * @param {string} imagePath
 * @returns {Promise<{ vision_score: number, detections: DetectionResult[], issues: string[], verdict: string }>}
 */
async function runVisionCritic(imagePath) {
  if (!imagePath) {
    throw new Error("[VISION_CRITIC] imagePath is required");
  }

  // Call VLM backend
  const raw = await _vlmBackend.analyze(imagePath, VLM_SYSTEM_PROMPT);

  // Validate VLM response
  const plasticConf = typeof raw.plastic_look === "number" ? raw.plastic_look : 0.5;
  const depthConf = typeof raw.lack_of_depth === "number" ? raw.lack_of_depth : 0.5;
  const polishConf = typeof raw.over_polish === "number" ? raw.over_polish : 0.5;

  // Evaluate each
  const detections = [
    evaluatePlasticLook(plasticConf),
    evaluateLackOfDepth(depthConf),
    evaluateOverPolish(polishConf),
  ];

  // Weights
  const weights = {
    plastic_look: 0.40,
    lack_of_depth: 0.25,
    over_polish: 0.35,
  };

  let weightedSum = 0;
  for (const d of detections) {
    const w = weights[d.check] || 0.33;
    weightedSum += d.score * w;
  }
  const visionScore = Math.round(weightedSum * 100) / 100;

  // Issues
  const issues = detections.filter((d) => d.detected).map((d) => d.detail);

  // Verdict
  let verdict;
  if (visionScore < 0.60) {
    verdict = "FAIL";
  } else if (visionScore < 0.75) {
    verdict = "REVIEW";
  } else {
    verdict = "PASS";
  }

  return {
    vision_score: visionScore,
    detections,
    issues,
    verdict,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  runVisionCritic,

  // Individual evaluators (for testing with known confidences)
  evaluatePlasticLook,
  evaluateLackOfDepth,
  evaluateOverPolish,

  // VLM backend injection
  setVLMBackend,
  getVLMBackend,

  // Constants
  THRESHOLDS,
  VLM_SYSTEM_PROMPT,
};
