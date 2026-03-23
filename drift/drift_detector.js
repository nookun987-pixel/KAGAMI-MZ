/**
 * MIKAGE — /drift/drift_detector.js
 * Final drift assessment. Not "is it beautiful" — "is it still Mikage."
 *
 * Combines:
 *   - identity_score (from identity_score.js)
 *   - narrative_score (from narrative_score.js)
 *   - aesthetic_integrity (from critic rule_score — passed in)
 *   - anti_polish (from identity dimension)
 *
 * Flags specific drift types.
 *
 * Hard gates (from spec §8):
 *   identity_score < 0.60 → REJECT (immediate, no loop)
 *   0.60–0.75 → REVIEW
 *   >= 0.75 → PASS
 */

"use strict";

const { scoreIdentity } = require("./identity_score");
const { scoreNarrative } = require("./narrative_score");

// ===================================================================
// DRIFT FLAG DEFINITIONS
// ===================================================================

const DRIFT_FLAGS = Object.freeze({
  GLAMOUR_DRIFT:             "glamour_drift",
  SYMMETRY_DRIFT:            "symmetry_drift",
  PLASTIC_FINISH_DRIFT:      "plastic_finish_drift",
  TREND_BAIT_DRIFT:          "trend_bait_drift",
  NARRATIVE_BREAK:           "narrative_break",
  LUXURY_EDITORIAL_OVERREACH:"luxury_editorial_overreach",
  IDENTITY_EROSION:          "identity_erosion",
  COLOR_DRIFT:               "color_drift",
  WEAPON_DRIFT:              "weapon_drift",
  MASK_DRIFT:                "mask_drift",
  MATERIAL_DRIFT:            "material_drift",
});

// ===================================================================
// FLAG DETECTION
// ===================================================================

/**
 * Detect drift flags from identity and narrative results.
 *
 * @param {Object} identityResult   From scoreIdentity()
 * @param {Object} narrativeResult  From scoreNarrative()
 * @param {Object} [criticResult]   Optional critic result for cross-reference
 * @returns {string[]}              Array of drift flag strings
 */
function detectFlags(identityResult, narrativeResult, criticResult) {
  const flags = [];
  const dims = identityResult.dimensions || [];
  const failed = identityResult.failed_dimensions || [];

  // --- Identity dimension flags ---
  if (failed.includes("material")) {
    flags.push(DRIFT_FLAGS.MATERIAL_DRIFT);
  }
  if (failed.includes("mask")) {
    flags.push(DRIFT_FLAGS.MASK_DRIFT);
  }
  if (failed.includes("blade")) {
    flags.push(DRIFT_FLAGS.WEAPON_DRIFT);
  }
  if (failed.includes("color")) {
    flags.push(DRIFT_FLAGS.COLOR_DRIFT);
  }
  if (failed.includes("anti_polish")) {
    flags.push(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT);
  }

  // --- Silhouette → glamour/symmetry detection ---
  const silhouetteDim = dims.find((d) => d.dimension === "silhouette");
  if (silhouetteDim && silhouetteDim.score < 0.60) {
    flags.push(DRIFT_FLAGS.GLAMOUR_DRIFT);
  }

  // --- Anti-polish low → plastic finish ---
  const antiPolishDim = dims.find((d) => d.dimension === "anti_polish");
  if (antiPolishDim && antiPolishDim.score < 0.50 && !flags.includes(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT)) {
    flags.push(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT);
  }

  // --- Cross-reference with critic if available ---
  if (criticResult) {
    const ruleChecks = (criticResult.rule_detail && criticResult.rule_detail.checks) || [];

    // Symmetry drift from critic
    const symCheck = ruleChecks.find((c) => c.check === "symmetry");
    if (symCheck && !symCheck.pass) {
      flags.push(DRIFT_FLAGS.SYMMETRY_DRIFT);
    }

    // Smoothness from critic → plastic finish
    const smoothCheck = ruleChecks.find((c) => c.check === "surface_smoothness");
    if (smoothCheck && !smoothCheck.pass && !flags.includes(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT)) {
      flags.push(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT);
    }

    // Vision plastic detection
    if (criticResult.vision_detail) {
      const plasticDet = (criticResult.vision_detail.detections || [])
        .find((d) => d.check === "plastic_look");
      if (plasticDet && plasticDet.detected && !flags.includes(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT)) {
        flags.push(DRIFT_FLAGS.PLASTIC_FINISH_DRIFT);
      }

      const polishDet = (criticResult.vision_detail.detections || [])
        .find((d) => d.check === "over_polish");
      if (polishDet && polishDet.detected) {
        if (!flags.includes(DRIFT_FLAGS.LUXURY_EDITORIAL_OVERREACH)) {
          flags.push(DRIFT_FLAGS.LUXURY_EDITORIAL_OVERREACH);
        }
      }
    }
  }

  // --- Narrative flags ---
  if (narrativeResult) {
    // Narrative score critically low
    if (narrativeResult.narrative_score < 0.60) {
      flags.push(DRIFT_FLAGS.NARRATIVE_BREAK);
    }

    // Forbidden tones detected
    if (narrativeResult.tone && narrativeResult.tone.forbidden_hits &&
        narrativeResult.tone.forbidden_hits.length > 0) {
      if (!flags.includes(DRIFT_FLAGS.NARRATIVE_BREAK)) {
        flags.push(DRIFT_FLAGS.NARRATIVE_BREAK);
      }
    }

    // Continuity violations
    if (narrativeResult.continuity && narrativeResult.continuity.violations &&
        narrativeResult.continuity.violations.length > 0) {
      if (!flags.includes(DRIFT_FLAGS.NARRATIVE_BREAK)) {
        flags.push(DRIFT_FLAGS.NARRATIVE_BREAK);
      }
    }

    // Glamour detected in tone
    const glamTones = ["glamorous", "fashion", "editorial beauty"];
    if (narrativeResult.tone && narrativeResult.tone.forbidden_hits) {
      const hasGlam = narrativeResult.tone.forbidden_hits.some((t) =>
        glamTones.some((g) => t.toLowerCase().includes(g))
      );
      if (hasGlam && !flags.includes(DRIFT_FLAGS.GLAMOUR_DRIFT)) {
        flags.push(DRIFT_FLAGS.GLAMOUR_DRIFT);
      }
    }
  }

  // --- Identity erosion (multiple dimensions failing) ---
  if (failed.length >= 3) {
    flags.push(DRIFT_FLAGS.IDENTITY_EROSION);
  }

  // Deduplicate
  return [...new Set(flags)];
}

// ===================================================================
// VERDICT ENGINE
// ===================================================================

/**
 * Determine drift verdict from scores and flags.
 *
 * Hard gates (spec §8):
 *   identity_score < 0.60 → REJECT
 *   0.60–0.75 → REVIEW
 *   >= 0.75 → PASS
 *
 * Additional overrides:
 *   - identity_erosion flag → REJECT
 *   - narrative_break + identity < 0.70 → REJECT
 *   - Any severe flag + identity < 0.75 → REVIEW
 *
 * @param {number}   identityScore
 * @param {number}   narrativeScore
 * @param {string[]} flags
 * @returns {string} "PASS" | "REVIEW" | "REJECT"
 */
function determineVerdict(identityScore, narrativeScore, flags) {
  const f = flags || [];

  // --- Hard gate: identity ---
  if (identityScore < 0.60) {
    return "REJECT";
  }

  // --- Identity erosion is always REJECT ---
  if (f.includes(DRIFT_FLAGS.IDENTITY_EROSION)) {
    return "REJECT";
  }

  // --- Narrative break + weak identity → REJECT ---
  if (f.includes(DRIFT_FLAGS.NARRATIVE_BREAK) && identityScore < 0.70) {
    return "REJECT";
  }

  // --- Review band ---
  if (identityScore < 0.75) {
    return "REVIEW";
  }

  // --- Severe flags force REVIEW even with passing identity ---
  const severeFlags = [
    DRIFT_FLAGS.PLASTIC_FINISH_DRIFT,
    DRIFT_FLAGS.GLAMOUR_DRIFT,
    DRIFT_FLAGS.NARRATIVE_BREAK,
    DRIFT_FLAGS.MASK_DRIFT,
    DRIFT_FLAGS.WEAPON_DRIFT,
  ];
  const hasSevere = f.some((flag) => severeFlags.includes(flag));
  if (hasSevere) {
    return "REVIEW";
  }

  // --- Narrative score low but identity passes ---
  if (narrativeScore < 0.60) {
    return "REVIEW";
  }

  // --- Minor flags with passing scores ---
  if (f.length > 0 && identityScore < 0.85) {
    return "REVIEW";
  }

  return "PASS";
}

// ===================================================================
// REFINE ELIGIBILITY
// ===================================================================

/**
 * Determine if the drift issues are refineable or terminal.
 * From spec §10: sai bản chất thì dừng, không cứu bằng loop.
 *
 * @param {string[]} flags
 * @param {string[]} failedDimensions
 * @returns {{ refineable: boolean, reason: string }}
 */
function isRefineable(flags, failedDimensions) {
  const f = flags || [];
  const fd = failedDimensions || [];

  // Terminal drift — cannot fix with prompt adjustment
  const terminalFlags = [
    DRIFT_FLAGS.IDENTITY_EROSION,
    DRIFT_FLAGS.MASK_DRIFT,
    DRIFT_FLAGS.GLAMOUR_DRIFT,
  ];

  for (const flag of terminalFlags) {
    if (f.includes(flag)) {
      return { refineable: false, reason: `Terminal drift: ${flag} — aesthetic DNA fundamentally wrong` };
    }
  }

  // 3+ identity dimensions failed — too broken to refine
  if (fd.length >= 3) {
    return { refineable: false, reason: `${fd.length} identity dimensions failed — root identity drift` };
  }

  // Narrative break alone is terminal
  if (f.includes(DRIFT_FLAGS.NARRATIVE_BREAK) && fd.length >= 2) {
    return { refineable: false, reason: "Narrative break + identity damage — not refineable" };
  }

  // These CAN be fixed by prompt adjustment
  // plastic_finish → stronger negative prompt
  // symmetry_drift → composition tweak
  // color_drift → palette constraint tighten
  // weapon_drift → prompt clarification
  return { refineable: true, reason: "Issues addressable via prompt adjustment" };
}

// ===================================================================
// MAIN DETECTOR
// ===================================================================

/**
 * @typedef {Object} DriftResult
 * @property {number}   identity_score
 * @property {number}   narrative_score
 * @property {number}   aesthetic_integrity_score  (from critic, passed through)
 * @property {number}   anti_polish_score          (from identity anti_polish dimension)
 * @property {string[]} drift_flags
 * @property {string}   verdict                    "PASS" | "REVIEW" | "REJECT"
 * @property {boolean}  refineable                 Whether issues can be fixed by prompt loop
 * @property {string}   refine_reason
 * @property {Object}   identity_detail
 * @property {Object}   narrative_detail
 */

/**
 * Run full drift detection on a rendered image.
 *
 * @param {string} imagePath        Path to rendered image
 * @param {Object} narrative        Job narrative block
 * @param {Object} [criticResult]   Optional critic result for cross-reference
 * @param {string} [canonRef]       Optional Canon reference image path
 * @returns {Promise<DriftResult>}
 */
async function detectDrift(imagePath, narrative, criticResult, canonRef) {
  if (!imagePath) throw new Error("[DRIFT_DETECTOR] imagePath required");

  // --- Score identity ---
  const identityResult = await scoreIdentity(imagePath, canonRef);

  // --- Score narrative ---
  const narrativeResult = await scoreNarrative(imagePath, narrative);

  // --- Extract anti-polish dimension ---
  const antiPolishDim = (identityResult.dimensions || [])
    .find((d) => d.dimension === "anti_polish");
  const antiPolishScore = antiPolishDim ? antiPolishDim.score : 0.50;

  // --- Aesthetic integrity from critic (if available) ---
  const aestheticScore = criticResult ? criticResult.quality_score : null;

  // --- Detect flags ---
  const flags = detectFlags(identityResult, narrativeResult, criticResult);

  // --- Verdict ---
  const verdict = determineVerdict(
    identityResult.identity_score,
    narrativeResult.narrative_score,
    flags
  );

  // --- Refineable check ---
  const refineCheck = isRefineable(flags, identityResult.failed_dimensions);

  return {
    identity_score: identityResult.identity_score,
    narrative_score: narrativeResult.narrative_score,
    aesthetic_integrity_score: aestheticScore,
    anti_polish_score: antiPolishScore,
    drift_flags: flags,
    verdict,
    refineable: refineCheck.refineable,
    refine_reason: refineCheck.reason,
    identity_detail: identityResult,
    narrative_detail: narrativeResult,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  detectDrift,
  detectFlags,
  determineVerdict,
  isRefineable,
  DRIFT_FLAGS,
};
