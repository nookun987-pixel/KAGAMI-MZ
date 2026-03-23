/**
 * MIKAGE — /drift/narrative_score.js
 * Scores whether rendered output matches the current narrative arc.
 *
 * Narrative dimensions:
 *   1. Emotional register (matches E-I-P-R phase)
 *   2. Tone alignment (restrained/melancholic vs cheerful/loud)
 *   3. Visual intensity (appropriate for arc position)
 *   4. Continuity coherence (doesn't contradict continuity_notes)
 *
 * In production, uses VLM to read emotional register from image.
 * Injectable backend for testing.
 */

"use strict";

// ===================================================================
// NARRATIVE PHASE → EXPECTED VISUAL REGISTER
// ===================================================================

const PHASE_EXPECTATIONS = Object.freeze({
  establisher: {
    intensity_range: [0.10, 0.35],
    tone: ["silent", "restrained", "cold", "empty", "still"],
    forbidden_tone: ["explosive", "chaotic", "bright", "energetic"],
    description: "Establishing context. Minimal action. Maximum negative space. Environment dominates.",
  },
  initial: {
    intensity_range: [0.25, 0.50],
    tone: ["restrained", "controlled", "emerging", "subtle tension"],
    forbidden_tone: ["explosive", "chaotic", "bright"],
    description: "Subject enters. Single motivated light. Tension building from stillness.",
  },
  peak: {
    intensity_range: [0.60, 0.90],
    tone: ["intense", "crimson", "active", "dramatic", "visceral"],
    forbidden_tone: ["peaceful", "empty", "serene"],
    description: "Maximum energy. Kintsugi glow active. Crimson overclock. Physical consequences visible.",
  },
  release: {
    intensity_range: [0.15, 0.40],
    tone: ["fading", "aftermath", "silent", "dissipating", "ghost"],
    forbidden_tone: ["explosive", "energetic", "bright", "chaotic"],
    description: "Energy fading. Light dimming. Only data ghost remains in empty space.",
  },
});

// Default phase when none specified
const DEFAULT_PHASE = "establisher";

// ===================================================================
// TONE VOCABULARY — Canon-aligned emotional register
// ===================================================================

const CANON_TONES = Object.freeze({
  aligned: [
    "melancholic", "restrained", "sacred", "stillness",
    "quiet", "controlled", "authoritative", "tragic",
    "disciplined", "cold", "oppressive", "silent",
    "somber", "bi tráng", "tĩnh lặng", "kỷ luật",
    "aftermath", "fading", "ghost", "empty",
    "intense", "crimson", "visceral", "dramatic",
  ],
  forbidden: [
    "cheerful", "playful", "cute", "fun",
    "energetic", "upbeat", "happy", "romantic",
    "whimsical", "humorous", "bright", "colorful",
    "warm", "cozy", "comfortable", "inviting",
    "sexy", "flirty", "glamorous",
  ],
});

// ===================================================================
// NARRATIVE ANALYZER — injectable
// ===================================================================

let _narrativeAnalyzer = {
  /**
   * Analyze image for narrative register.
   * @param {string} imagePath
   * @returns {Promise<Object>}
   */
  async analyze(imagePath) {
    return {
      perceived_intensity: 0.30,
      perceived_tones: ["restrained", "silent", "cold"],
      perceived_energy: "low",
    };
  },
};

function setNarrativeAnalyzer(analyzer) {
  if (!analyzer || typeof analyzer.analyze !== "function") {
    throw new Error("[NARRATIVE_SCORE] Analyzer must have async analyze()");
  }
  _narrativeAnalyzer = analyzer;
}

function getNarrativeAnalyzer() {
  return _narrativeAnalyzer;
}

// ===================================================================
// SCORING FUNCTIONS
// ===================================================================

/**
 * Score emotional register against E-I-P-R phase.
 *
 * @param {number}   perceivedIntensity  0.0–1.0 from analyzer
 * @param {string}   phase               "establisher" | "initial" | "peak" | "release"
 * @returns {{ score: number, detail: string }}
 */
function scoreIntensityAlignment(perceivedIntensity, phase) {
  const expectations = PHASE_EXPECTATIONS[phase] || PHASE_EXPECTATIONS[DEFAULT_PHASE];
  const [lo, hi] = expectations.intensity_range;
  const intensity = Math.max(0, Math.min(1, perceivedIntensity));

  let score;
  if (intensity >= lo && intensity <= hi) {
    // Within range — score based on how centered
    const center = (lo + hi) / 2;
    const halfRange = (hi - lo) / 2;
    const deviation = Math.abs(intensity - center) / halfRange;
    score = 1.0 - (deviation * 0.25);  // slight penalty for edge of range
  } else if (intensity < lo) {
    score = 0.50 * (intensity / lo);
  } else {
    score = 0.50 * (1 - (intensity - hi) / (1.0 - hi));
  }
  score = Math.max(0, Math.min(1, score));

  const inRange = intensity >= lo && intensity <= hi;

  return {
    score: Math.round(score * 100) / 100,
    detail: inRange
      ? `Intensity ${(intensity * 100).toFixed(0)}% within ${phase} range [${(lo * 100).toFixed(0)}%–${(hi * 100).toFixed(0)}%]`
      : `Intensity ${(intensity * 100).toFixed(0)}% outside ${phase} range [${(lo * 100).toFixed(0)}%–${(hi * 100).toFixed(0)}%]`,
  };
}

/**
 * Score perceived tones against Canon tone vocabulary.
 *
 * @param {string[]} perceivedTones  Tones detected in image
 * @returns {{ score: number, aligned: string[], forbidden_hits: string[], detail: string }}
 */
function scoreToneAlignment(perceivedTones) {
  const tones = Array.isArray(perceivedTones) ? perceivedTones : [];

  if (tones.length === 0) {
    return {
      score: 0.70,
      aligned: [],
      forbidden_hits: [],
      detail: "No tones detected — neutral score",
    };
  }

  let alignedCount = 0;
  let forbiddenCount = 0;
  const aligned = [];
  const forbidden_hits = [];

  for (const tone of tones) {
    const t = tone.toLowerCase().trim();
    if (CANON_TONES.aligned.some((a) => t.includes(a) || a.includes(t))) {
      alignedCount++;
      aligned.push(tone);
    }
    if (CANON_TONES.forbidden.some((f) => t.includes(f) || f.includes(t))) {
      forbiddenCount++;
      forbidden_hits.push(tone);
    }
  }

  let score = 0.70;  // baseline
  score += 0.10 * Math.min(alignedCount / Math.max(tones.length, 1), 1);
  score -= 0.25 * Math.min(forbiddenCount, 3);
  score = Math.max(0, Math.min(1, score));

  return {
    score: Math.round(score * 100) / 100,
    aligned,
    forbidden_hits,
    detail: forbiddenCount > 0
      ? `Forbidden tones detected: ${forbidden_hits.join(", ")}`
      : `${alignedCount}/${tones.length} tones aligned with Canon register`,
  };
}

/**
 * Score continuity coherence — check image against continuity_notes.
 *
 * @param {string[]} continuityNotes  From job narrative
 * @param {string[]} perceivedTones   From analyzer
 * @param {number}   perceivedIntensity
 * @returns {{ score: number, violations: string[], detail: string }}
 */
function scoreContinuityCoherence(continuityNotes, perceivedTones, perceivedIntensity) {
  const notes = Array.isArray(continuityNotes) ? continuityNotes : [];
  const tones = (perceivedTones || []).map((t) => t.toLowerCase());
  const violations = [];

  if (notes.length === 0) {
    return { score: 0.75, violations: [], detail: "No continuity notes — neutral" };
  }

  let penalty = 0;

  for (const note of notes) {
    const n = note.toLowerCase();

    // Check "restrained, not loud"
    if (n.includes("restrained") || n.includes("not loud")) {
      if (perceivedIntensity > 0.70) {
        violations.push(`"${note}" violated — intensity too high (${(perceivedIntensity * 100).toFixed(0)}%)`);
        penalty += 0.15;
      }
    }

    // Check "melancholy distance"
    if (n.includes("melancholy") || n.includes("distance")) {
      const hasCheerful = tones.some((t) =>
        CANON_TONES.forbidden.some((f) => t.includes(f))
      );
      if (hasCheerful) {
        violations.push(`"${note}" violated — forbidden tone detected`);
        penalty += 0.15;
      }
    }

    // Check "avoid commercial glamour"
    if (n.includes("commercial") || n.includes("glamour")) {
      const glamSignals = ["glamorous", "fashion", "editorial beauty", "luxury glam"];
      const hasGlam = tones.some((t) => glamSignals.some((g) => t.includes(g)));
      if (hasGlam) {
        violations.push(`"${note}" violated — commercial glamour detected`);
        penalty += 0.20;
      }
    }

    // Check "preserve" directives
    if (n.includes("preserve") || n.includes("maintain")) {
      // Generic preservation note — no specific violation detection
      // Just a small bonus for having the note
    }
  }

  const score = Math.max(0, Math.min(1, 0.90 - penalty));

  return {
    score: Math.round(score * 100) / 100,
    violations,
    detail: violations.length > 0
      ? `${violations.length} continuity violation(s)`
      : "Continuity notes respected",
  };
}

/**
 * Infer E-I-P-R phase from chapter string.
 *
 * @param {string} chapter  e.g., "fragment_01", "fragment_03", "climax_01"
 * @returns {string}        "establisher" | "initial" | "peak" | "release"
 */
function inferPhase(chapter) {
  if (!chapter) return DEFAULT_PHASE;
  const c = chapter.toLowerCase();

  if (c.includes("establish") || c.includes("intro") || c.includes("fragment_01")) {
    return "establisher";
  }
  if (c.includes("initial") || c.includes("fragment_02") || c.includes("fragment_03")) {
    return "initial";
  }
  if (c.includes("peak") || c.includes("climax") || c.includes("battle") || c.includes("overclock")) {
    return "peak";
  }
  if (c.includes("release") || c.includes("aftermath") || c.includes("epilogue") || c.includes("fade")) {
    return "release";
  }

  // Default to establisher for unknown chapters (safer — lower intensity expectation)
  return DEFAULT_PHASE;
}

// ===================================================================
// AGGREGATE
// ===================================================================

/**
 * Full narrative scoring pipeline.
 *
 * narrative_score = weighted average:
 *   intensity_alignment:  0.30
 *   tone_alignment:       0.35
 *   continuity_coherence: 0.35
 *
 * @param {string} imagePath
 * @param {Object} narrative  Job narrative block { arc_id, chapter, continuity_notes }
 * @returns {Promise<Object>}
 */
async function scoreNarrative(imagePath, narrative) {
  if (!imagePath) throw new Error("[NARRATIVE_SCORE] imagePath required");

  const narr = narrative || {};

  // Get perceived attributes from analyzer
  const analysis = await _narrativeAnalyzer.analyze(imagePath);

  // Infer phase
  const phase = inferPhase(narr.chapter);

  // Score each dimension
  const intensityResult = scoreIntensityAlignment(analysis.perceived_intensity, phase);
  const toneResult = scoreToneAlignment(analysis.perceived_tones);
  const continuityResult = scoreContinuityCoherence(
    narr.continuity_notes,
    analysis.perceived_tones,
    analysis.perceived_intensity
  );

  // Weighted average
  const weights = { intensity: 0.30, tone: 0.35, continuity: 0.35 };
  const narrativeScore = Math.round(
    (intensityResult.score * weights.intensity +
     toneResult.score * weights.tone +
     continuityResult.score * weights.continuity) * 100
  ) / 100;

  return {
    narrative_score: narrativeScore,
    phase,
    intensity: intensityResult,
    tone: toneResult,
    continuity: continuityResult,
    raw_analysis: analysis,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  scoreNarrative,
  scoreIntensityAlignment,
  scoreToneAlignment,
  scoreContinuityCoherence,
  inferPhase,
  setNarrativeAnalyzer,
  getNarrativeAnalyzer,
  PHASE_EXPECTATIONS,
  CANON_TONES,
};
