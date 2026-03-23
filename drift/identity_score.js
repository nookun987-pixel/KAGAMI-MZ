/**
 * MIKAGE — /drift/identity_score.js
 * Scores how much a rendered output matches Mikage Canon identity.
 * Not "is it beautiful" — "is it still Mikage."
 *
 * Identity dimensions:
 *   1. Silhouette correctness (clean, geometric, no external clutter)
 *   2. Material reads as Canon (B4C porcelain, carbon fiber, titanium, kintsugi)
 *   3. Mask geometry intact (faceless, void eyes, planar, fox-like silhouette)
 *   4. Blade visible and straight (no curve, industrial, massive)
 *   5. Color within Canon palette (white, black, crimson, gold)
 *   6. Anti-polish (imperfection present, not over-rendered)
 *
 * In production, uses image analysis + VLM.
 * Injectable backend for testing.
 */

"use strict";

// ===================================================================
// IDENTITY MARKERS — Canon checklist (from Pass/Fail checklist)
// ===================================================================

const IDENTITY_MARKERS = Object.freeze({
  silhouette: {
    weight: 0.20,
    pass_signals: [
      "clean silhouette", "geometric", "minimalist",
      "no external clutter", "sleek", "unbroken lines",
    ],
    fail_signals: [
      "bulky mecha", "organic curves", "external cables",
      "greebling", "excessive detail baked on surface",
      "phình to", "cồng kềnh",
    ],
  },
  material: {
    weight: 0.20,
    pass_signals: [
      "matte porcelain", "B4C ceramic", "white armor",
      "carbon fiber", "graphene hex", "dark titanium",
      "kintsugi gold", "crimson glow", "satin joint",
    ],
    fail_signals: [
      "rusty porcelain", "dirty armor", "glossy plastic",
      "chrome mirror", "organic skin", "fabric cloth",
      "leather", "fur", "wood on body",
    ],
  },
  mask: {
    weight: 0.15,
    pass_signals: [
      "faceless helmet", "void black sensors", "planar geometry",
      "fox-like silhouette", "narrow eye slits", "no expression",
      "black hair flowing",
    ],
    fail_signals: [
      "visible human face", "visible eyes", "visible mouth",
      "anime eyes", "animal ears", "traditional kitsune mask",
      "expressive face", "smiling", "crying",
    ],
  },
  blade: {
    weight: 0.15,
    pass_signals: [
      "straight blade", "massive sword", "industrial",
      "thick spine", "crimson core", "dark titanium scrap",
      "no curvature", "heavy", "oversized",
    ],
    fail_signals: [
      "curved katana", "thin blade", "laser sword",
      "clean glowing", "ornamental", "fantasy weapon",
      "small weapon", "no weapon visible",
    ],
  },
  color: {
    weight: 0.15,
    pass_signals: [
      "porcelain white", "#FAFAFA", "void black", "#0A0A0A",
      "crimson", "#E60000", "gold kintsugi",
      "fallen ivory", "three core colors",
    ],
    fail_signals: [
      "green", "orange", "cyan on character", "rainbow",
      "neon saturated", "bright colorful", "yellow large area",
      "pastel", "warm tones dominant",
    ],
  },
  anti_polish: {
    weight: 0.15,
    pass_signals: [
      "micro-cracks", "kintsugi fractures", "wear patterns",
      "heat scarring", "uneven surface", "imperfection",
      "texture variation", "film grain",
    ],
    fail_signals: [
      "perfect smooth", "flawless", "airbrushed",
      "plastic look", "over-polished", "generic ai beauty",
      "digital painting", "too clean",
    ],
  },
});

// ===================================================================
// IDENTITY ANALYZER — injectable
// ===================================================================

/**
 * Default analyzer. In production, uses image analysis + VLM.
 * Returns per-dimension confidence scores.
 */
let _identityAnalyzer = {
  /**
   * Analyze image against Canon identity markers.
   * @param {string} imagePath
   * @param {string} [canonReferencePath]  Optional reference image
   * @returns {Promise<Object>} Per-dimension scores 0.0–1.0 (higher = more Canon-aligned)
   */
  async analyze(imagePath, canonReferencePath) {
    // Simulated — returns passing scores by default
    return {
      silhouette: 0.85,
      material: 0.80,
      mask: 0.85,
      blade: 0.80,
      color: 0.90,
      anti_polish: 0.75,
    };
  },
};

function setIdentityAnalyzer(analyzer) {
  if (!analyzer || typeof analyzer.analyze !== "function") {
    throw new Error("[IDENTITY_SCORE] Analyzer must have async analyze()");
  }
  _identityAnalyzer = analyzer;
}

function getIdentityAnalyzer() {
  return _identityAnalyzer;
}

// ===================================================================
// SCORING
// ===================================================================

/**
 * Score identity alignment from raw dimension scores.
 *
 * @param {Object} dimensionScores  Per-dimension scores { silhouette, material, mask, blade, color, anti_polish }
 * @returns {{ identity_score: number, dimensions: Object[], failed_dimensions: string[] }}
 */
function computeIdentityScore(dimensionScores) {
  const ds = dimensionScores || {};
  const dimensions = [];
  let weightedSum = 0;
  let totalWeight = 0;
  const failedDimensions = [];

  for (const [key, marker] of Object.entries(IDENTITY_MARKERS)) {
    const raw = typeof ds[key] === "number" ? Math.max(0, Math.min(1, ds[key])) : 0;
    const w = marker.weight;

    weightedSum += raw * w;
    totalWeight += w;

    const dimResult = {
      dimension: key,
      score: raw,
      weight: w,
      pass: raw >= 0.60,
    };
    dimensions.push(dimResult);

    if (raw < 0.60) {
      failedDimensions.push(key);
    }
  }

  const identityScore = totalWeight > 0
    ? Math.round((weightedSum / totalWeight) * 100) / 100
    : 0;

  return {
    identity_score: identityScore,
    dimensions,
    failed_dimensions: failedDimensions,
  };
}

/**
 * Full identity scoring pipeline.
 *
 * @param {string} imagePath
 * @param {string} [canonReferencePath]
 * @returns {Promise<{ identity_score: number, dimensions: Object[], failed_dimensions: string[] }>}
 */
async function scoreIdentity(imagePath, canonReferencePath) {
  if (!imagePath) throw new Error("[IDENTITY_SCORE] imagePath required");

  const rawScores = await _identityAnalyzer.analyze(imagePath, canonReferencePath);
  return computeIdentityScore(rawScores);
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  scoreIdentity,
  computeIdentityScore,
  setIdentityAnalyzer,
  getIdentityAnalyzer,
  IDENTITY_MARKERS,
};
