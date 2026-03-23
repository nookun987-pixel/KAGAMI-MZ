/**
 * MIKAGE — /control/precheck.js
 * PRE-CONTROL gate. Evaluates identity / narrative / strategic alignment
 * before any downstream module (Middleware, Translator, Render) can execute.
 *
 * Decisions: ALLOW | REVIEW | REJECT | AUTO_SAFE
 * Issues control_token on ALLOW only.
 *
 * All Canon rules are hardcoded. No external config files.
 * Single Source of Truth: Mikage Master Bible V2.0 + Locked Prompt.
 */

"use strict";

const crypto = require("crypto");

// ===================================================================
// CANON — HARDCODED SINGLE SOURCE OF TRUTH
// ===================================================================

const CANON = Object.freeze({

  // --- Materials allowed ON subject ---
  MATERIALS_SUBJECT: Object.freeze([
    "boron carbide", "b4c", "porcelain", "ceramic",
    "carbon fiber", "graphene", "matte hex",
    "titanium", "dark titanium", "satin titanium",
    "kintsugi", "gold kintsugi",
    "ferro-calcium", "polymer 2d",
  ]),

  // --- Materials allowed in ENVIRONMENT only ---
  MATERIALS_ENVIRONMENT: Object.freeze([
    "concrete", "brutalist concrete", "acid-stained concrete",
    "charred wood", "burnt wood",
    "corroded metal", "rusted steel",
    "acid rain", "frozen mist",
    "neon grid", "cable", "industrial pipe",
    "heat-warped carbon fiber",
    "weathered ceramic",
  ]),

  // --- Colors allowed ---
  COLORS_ALLOWED: Object.freeze({
    primary:   ["#FAFAFA", "porcelain white", "bone white"],
    secondary: ["#0A0A0A", "void black", "graphite black", "matte black"],
    accent:    ["#E60000", "crimson", "internal crimson", "restricted red"],
    kintsugi:  ["gold", "kintsugi gold"],
  }),

  // --- Colors absolutely forbidden on subject ---
  COLORS_FORBIDDEN: Object.freeze([
    "green", "orange", "rainbow", "cyan", "teal",
    "bright blue", "neon green", "neon pink", "neon orange",
    "large gold area", "metallic gold coverage",
  ]),

  // --- Valid color modes ---
  COLOR_MODES: Object.freeze([
    "fallen ivory", "neon wound", "cathedral halo",
    "void regent", "crimson overclock", "royal machine",
  ]),

  // --- Absolute forbidden (any appearance = instant fail) ---
  FORBIDDEN_ABSOLUTE: Object.freeze([
    "anime", "waifu", "sexy", "sexualized",
    "chibi", "cute", "kawaii",
    "organic softness", "organic anatomy",
    "curved blade", "katana curve",
    "magic effects", "magic circle", "aura glow",
    "cyberpunk clutter", "neon pollution",
    "greebling", "meaningless mechanical detail",
    "bloom effects", "lens flare overload",
    "plastic look", "glossy toy", "3d render look",
    "perfect skin", "human face", "visible eyes",
    "visible mouth", "visible ears",
    "kitsune mask",  // Canon: never use this phrase in prompts
    "flat 2d ui", "2d hud overlay",
    "shaky cam", "handheld camera",
    "fantasy ornament", "decorative filigree",
    "rust on porcelain",  // porcelain cracks and repairs, never rusts
    "superhero", "bright heroic",
  ]),

  // --- Aesthetic signals that indicate glam drift ---
  GLAM_DRIFT_SIGNALS: Object.freeze([
    "luxury glamour", "fashion editorial", "vogue",
    "beauty photography", "high fashion", "runway",
    "commercial beauty", "product shot",
    "instagram aesthetic", "influencer",
    "smooth skin", "flawless", "airbrushed",
    "over-polished", "hyper-symmetry",
    "generic ai beauty", "ai art style",
    "trending", "viral", "popular style",
  ]),

  // --- Engagement bait signals ---
  ENGAGEMENT_BAIT_SIGNALS: Object.freeze([
    "clickbait", "shock value", "controversy",
    "sex appeal", "fan service",
    "meme", "viral potential",
    "algorithm friendly", "engagement optimization",
  ]),

  // --- Valid narrative phases (E-I-P-R) ---
  NARRATIVE_PHASES: Object.freeze([
    "establisher", "initial", "peak", "release",
  ]),

  // --- Valid narrative tones ---
  NARRATIVE_TONES: Object.freeze([
    "melancholic", "restrained", "sacred", "stillness",
    "quiet", "controlled", "authoritative",
    "tragic", "disciplined", "cold",
    "oppressive", "silent", "somber",
    "bi tráng", "tĩnh lặng", "kỷ luật",
  ]),

  // --- Tones that conflict with Mikage ---
  NARRATIVE_TONES_FORBIDDEN: Object.freeze([
    "cheerful", "playful", "cute", "fun",
    "energetic", "upbeat", "happy",
    "romantic", "whimsical", "humorous",
    "bright", "colorful", "warm",
    "cozy", "comfortable", "inviting",
  ]),

  // --- Valid strategy objectives ---
  STRATEGY_OBJECTIVES: Object.freeze([
    "identity_consistency", "aesthetic_integrity",
    "narrative_continuity", "core_visual_language",
    "world_building", "character_development",
  ]),

  // --- Strategy objectives that signal drift ---
  STRATEGY_DRIFT_OBJECTIVES: Object.freeze([
    "engagement", "virality", "growth",
    "follower_acquisition", "trend_riding",
    "mass_appeal", "broad_audience",
  ]),

  // --- Composition rules ---
  COMPOSITION: Object.freeze({
    negative_space_min: 0.40,
    subject_max_ratio: 0.30,
    broken_symmetry_required: true,
    imperfection_required: true,
    texture_variation_required: true,
    detail_ratio: "70/30",     // 70% empty, 30% detail
    chiaroscuro_ratio: "4:1",
  }),
});


// ===================================================================
// UTILITY — Token-based text analysis
// ===================================================================

/**
 * Normalize a string for matching: lowercase, trim, collapse whitespace.
 */
function norm(str) {
  if (!str) return "";
  return String(str).toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Flatten any nested structure (string, array, object values) into
 * a single lowercase string for keyword scanning.
 */
function flattenToString(obj) {
  if (obj === null || obj === undefined) return "";
  if (typeof obj === "string") return norm(obj);
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) return obj.map(flattenToString).join(" ");
  if (typeof obj === "object") return Object.values(obj).map(flattenToString).join(" ");
  return "";
}

/**
 * Check if a haystack string contains any needle from a list.
 * Returns array of matched terms.
 */
function findMatches(haystack, needles) {
  const h = norm(haystack);
  return needles.filter((n) => h.includes(norm(n)));
}


// ===================================================================
// SCORING FUNCTIONS
// ===================================================================

/**
 * Score identity alignment of art_direction against Canon.
 *
 * Checks:
 * 1. Materials are in Canon stack (subject vs environment)
 * 2. No forbidden elements present
 * 3. No glam drift signals
 * 4. Colors are within Canon palette
 * 5. Composition rules respected
 *
 * @param {Object} art_direction  Job art_direction block
 * @param {Object} identity       Job identity block
 * @returns {{ score: number, reasons: string[], flags: string[] }}
 */
function scoreIdentity(art_direction, identity) {
  let score = 1.0;
  const reasons = [];
  const flags = [];

  const ad = art_direction || {};
  // Exclude ad.forbidden from scan — it's a NEGATIVE prompt list (things to avoid),
  // not positive content. Scanning it would false-positive on Canon-correct negatives.
  const { forbidden: _excluded, ...adPositive } = ad;
  const allText = flattenToString(adPositive);

  // --- 1. Check materials ---
  const materials = Array.isArray(ad.material) ? ad.material : [];
  const allCanonMaterials = [...CANON.MATERIALS_SUBJECT, ...CANON.MATERIALS_ENVIRONMENT];

  for (const mat of materials) {
    const m = norm(mat);
    const inSubject = CANON.MATERIALS_SUBJECT.some((c) => m.includes(norm(c)));
    const inEnvironment = CANON.MATERIALS_ENVIRONMENT.some((c) => m.includes(norm(c)));

    if (!inSubject && !inEnvironment) {
      // Completely unknown material
      const partial = allCanonMaterials.some((c) => {
        const cn = norm(c);
        return m.includes(cn) || cn.includes(m);
      });
      if (partial) {
        score -= 0.05;
        reasons.push(`Material "${mat}" is partially Canon — verify placement`);
      } else {
        score -= 0.15;
        reasons.push(`Material "${mat}" is NOT in Canon material stack`);
        flags.push("unknown_material");
      }
    }
  }

  // --- 2. Absolute forbidden scan ---
  const forbiddenHits = findMatches(allText, CANON.FORBIDDEN_ABSOLUTE);
  if (forbiddenHits.length > 0) {
    score -= 0.25 * forbiddenHits.length;
    for (const hit of forbiddenHits) {
      reasons.push(`Absolute forbidden element detected: "${hit}"`);
    }
    flags.push("forbidden_element");
  }

  // --- 3. Glam drift scan ---
  const glamHits = findMatches(allText, CANON.GLAM_DRIFT_SIGNALS);
  if (glamHits.length > 0) {
    score -= 0.10 * glamHits.length;
    for (const hit of glamHits) {
      reasons.push(`Glam drift signal: "${hit}"`);
    }
    flags.push("glamour_drift");
  }

  // --- 4. Color check ---
  const colorText = flattenToString(ad.color_mode || ad.colors || "");
  if (colorText) {
    const forbiddenColorHits = findMatches(colorText, CANON.COLORS_FORBIDDEN);
    if (forbiddenColorHits.length > 0) {
      score -= 0.20 * forbiddenColorHits.length;
      for (const hit of forbiddenColorHits) {
        reasons.push(`Forbidden color on subject: "${hit}"`);
      }
      flags.push("forbidden_color");
    }
  }

  // --- 5. Composition constraints ---
  const comp = ad.composition || {};
  if (comp.negative_space_min !== undefined && comp.negative_space_min < CANON.COMPOSITION.negative_space_min) {
    score -= 0.10;
    reasons.push(`Negative space ${comp.negative_space_min} below Canon minimum ${CANON.COMPOSITION.negative_space_min}`);
  }
  if (comp.broken_symmetry_required === false) {
    score -= 0.10;
    reasons.push("Broken symmetry is required by Canon but was disabled");
  }
  if (comp.imperfection_required === false) {
    score -= 0.10;
    reasons.push("Imperfection is required by Canon but was disabled");
  }

  // --- 6. Forbidden array in art_direction ---
  const forbidden = Array.isArray(ad.forbidden) ? ad.forbidden : [];
  // Verify that art_direction's own forbidden list doesn't contradict Canon
  // (This is a sanity check — forbidden should match Canon, not fight it)

  // --- 7. Character identity version ---
  if (identity && identity.character_id !== "mikage_core") {
    score -= 0.05;
    reasons.push(`Unknown character_id: "${identity.character_id}"`);
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    reasons,
    flags,
  };
}


/**
 * Score narrative continuity alignment.
 *
 * Checks:
 * 1. Continuity notes don't contradict Canon tone
 * 2. Mood aligns with Mikage emotional register
 * 3. No forbidden narrative tones
 * 4. E-I-P-R phase consistency (if declared)
 * 5. Anti-drift continuity notes honored
 *
 * @param {Object} narrative       Job narrative block
 * @param {Object} art_direction   Job art_direction block
 * @returns {{ score: number, reasons: string[] }}
 */
function scoreNarrative(narrative, art_direction) {
  let score = 1.0;
  const reasons = [];

  const narr = narrative || {};
  const ad = art_direction || {};
  const { forbidden: _excluded, ...adPositive } = ad;
  const allNarrText = flattenToString(narr);
  const allAdText = flattenToString(adPositive);

  // --- 1. Forbidden narrative tones ---
  const toneHits = findMatches(allAdText, CANON.NARRATIVE_TONES_FORBIDDEN);
  if (toneHits.length > 0) {
    score -= 0.15 * toneHits.length;
    for (const hit of toneHits) {
      reasons.push(`Forbidden narrative tone: "${hit}"`);
    }
  }

  // --- 2. Mood alignment ---
  const moods = Array.isArray(ad.mood) ? ad.mood : [];
  let alignedMoods = 0;
  let misalignedMoods = 0;

  for (const mood of moods) {
    const m = norm(mood);
    const isAligned = CANON.NARRATIVE_TONES.some((t) => m.includes(norm(t)));
    const isForbidden = CANON.NARRATIVE_TONES_FORBIDDEN.some((t) => m.includes(norm(t)));

    if (isForbidden) {
      misalignedMoods++;
      reasons.push(`Mood "${mood}" conflicts with Mikage emotional register`);
    } else if (isAligned) {
      alignedMoods++;
    }
    // Unknown moods are neutral — neither bonus nor penalty
  }

  if (moods.length > 0) {
    const alignmentRatio = alignedMoods / moods.length;
    if (misalignedMoods > 0) {
      score -= 0.15 * misalignedMoods;
    }
    // Bonus for strong alignment
    if (alignmentRatio >= 0.8) {
      score = Math.min(1, score + 0.05);
    }
  }

  // --- 3. Continuity notes scan ---
  const notes = Array.isArray(narr.continuity_notes) ? narr.continuity_notes : [];
  const antiDriftKeywords = [
    "restrained", "not loud", "melancholy", "distance",
    "avoid commercial", "avoid glamour", "no drift",
    "preserve", "maintain", "consistent",
  ];
  let antiDriftCount = 0;
  for (const note of notes) {
    const n = norm(note);
    if (antiDriftKeywords.some((k) => n.includes(k))) {
      antiDriftCount++;
    }
    // Check if note contradicts Canon
    const contradictions = findMatches(n, CANON.NARRATIVE_TONES_FORBIDDEN);
    if (contradictions.length > 0) {
      score -= 0.10;
      reasons.push(`Continuity note contradicts Canon: "${note}"`);
    }
  }
  // Bonus for explicit anti-drift notes
  if (antiDriftCount > 0) {
    score = Math.min(1, score + 0.02 * Math.min(antiDriftCount, 3));
  }

  // --- 4. Narrative completeness ---
  if (!narr.arc_id) {
    score -= 0.05;
    reasons.push("Missing arc_id — narrative context incomplete");
  }
  if (!narr.chapter) {
    score -= 0.05;
    reasons.push("Missing chapter — narrative context incomplete");
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    reasons,
  };
}


/**
 * Score strategic alignment.
 *
 * Checks:
 * 1. Primary objective is Canon-aligned
 * 2. No engagement-bait objectives
 * 3. Campaign tag sanity
 * 4. No trend-chasing signals
 *
 * @param {Object} strategy        Job strategy block
 * @param {Object} art_direction   Job art_direction block
 * @returns {{ score: number, reasons: string[], flags: string[] }}
 */
function scoreStrategic(strategy, art_direction) {
  let score = 1.0;
  const reasons = [];
  const flags = [];

  const strat = strategy || {};
  const allText = flattenToString(strat);
  const ad = art_direction || {};
  const { forbidden: _excluded, ...adPositive } = ad;
  const adText = flattenToString(adPositive);

  // --- 1. Primary objective ---
  const primary = norm(strat.objective || "");
  if (primary) {
    const isValid = CANON.STRATEGY_OBJECTIVES.some((o) => primary.includes(norm(o)));
    const isDrift = CANON.STRATEGY_DRIFT_OBJECTIVES.some((o) => primary.includes(norm(o)));

    if (isDrift) {
      score -= 0.30;
      reasons.push(`Primary objective "${strat.objective}" signals engagement drift`);
      flags.push("engagement_drift");
    } else if (!isValid) {
      score -= 0.10;
      reasons.push(`Primary objective "${strat.objective}" not in Canon strategy set`);
    }
  } else {
    score -= 0.05;
    reasons.push("No primary objective declared");
  }

  // --- 2. Secondary objective ---
  const secondary = norm(strat.secondary_objective || "");
  if (secondary) {
    const isDrift = CANON.STRATEGY_DRIFT_OBJECTIVES.some((o) => secondary.includes(norm(o)));
    if (isDrift) {
      score -= 0.15;
      reasons.push(`Secondary objective "${strat.secondary_objective}" signals drift`);
      flags.push("secondary_drift");
    }
  }

  // --- 3. Engagement bait scan across strategy + art_direction ---
  const baitHits = findMatches(allText + " " + adText, CANON.ENGAGEMENT_BAIT_SIGNALS);
  if (baitHits.length > 0) {
    score -= 0.20 * baitHits.length;
    for (const hit of baitHits) {
      reasons.push(`Engagement bait signal: "${hit}"`);
    }
    flags.push("engagement_bait");
  }

  // --- 4. Campaign tag ---
  const tag = norm(strat.campaign_tag || "");
  if (tag) {
    const suspiciousTags = ["promo", "ad", "sponsor", "collab", "brand deal", "paid"];
    const tagHits = findMatches(tag, suspiciousTags);
    if (tagHits.length > 0) {
      score -= 0.10;
      reasons.push(`Campaign tag "${strat.campaign_tag}" suggests commercial intent`);
      flags.push("commercial_drift");
    }
  }

  return {
    score: Math.max(0, Math.min(1, score)),
    reasons,
    flags,
  };
}


/**
 * Calculate composite risk score.
 *
 * Risk increases when:
 * - Identity score is low
 * - Any drift flags are present
 * - Strategy is drift-prone
 * - Forbidden elements detected
 *
 * @param {number}   identity_check
 * @param {number}   narrative_check
 * @param {number}   strategic_check
 * @param {string[]} identity_flags
 * @param {string[]} strategic_flags
 * @returns {number} 0.0 (no risk) to 1.0 (maximum risk)
 */
function calculateRisk(identity_check, narrative_check, strategic_check, identity_flags, strategic_flags) {
  // Base risk is inverse of lowest score
  const minScore = Math.min(identity_check, narrative_check, strategic_check);
  let risk = 1.0 - minScore;

  // Flag amplifiers
  const allFlags = [...(identity_flags || []), ...(strategic_flags || [])];
  const severeFlags = ["forbidden_element", "forbidden_color", "engagement_bait", "engagement_drift"];
  const moderateFlags = ["glamour_drift", "unknown_material", "commercial_drift", "secondary_drift"];

  for (const flag of allFlags) {
    if (severeFlags.includes(flag)) {
      risk = Math.min(1, risk + 0.15);
    } else if (moderateFlags.includes(flag)) {
      risk = Math.min(1, risk + 0.08);
    }
  }

  return Math.round(risk * 100) / 100;
}


// ===================================================================
// DECISION ENGINE
// ===================================================================

/**
 * PRE-CONTROL decision.
 *
 * Rules (from spec §3):
 *   REJECT if:
 *     - identity_check < 0.60
 *     - request has glam drift / trend chasing / engagement bait
 *     - request contradicts current narrative
 *     - prompt directs toward "AI beauty" over visual DNA
 *
 *   REVIEW if:
 *     - 0.60 ≤ identity_check < 0.75
 *     - narrative ambiguous
 *     - aesthetic looks right but strategic intent is off
 *
 *   ALLOW if:
 *     - identity_check ≥ 0.75
 *     - narrative_check ≥ 0.75
 *     - strategic_check ≥ 0.75
 *     - risk_score low (< 0.35)
 *
 *   AUTO_SAFE if:
 *     - request is unclear but no hard violations
 *     - safe for internal draft, not for publish
 */
function decide(identity_check, narrative_check, strategic_check, risk_score, identity_flags, strategic_flags) {
  const allFlags = [...(identity_flags || []), ...(strategic_flags || [])];

  // --- REJECT gates (hard) ---

  if (identity_check < 0.60) {
    return {
      decision: "REJECT",
      reasons: [`identity_check ${identity_check} below absolute minimum 0.60`],
    };
  }

  // Forbidden element = instant reject regardless of score
  if (allFlags.includes("forbidden_element")) {
    return {
      decision: "REJECT",
      reasons: ["Absolute forbidden element detected in art_direction"],
    };
  }

  if (allFlags.includes("forbidden_color")) {
    return {
      decision: "REJECT",
      reasons: ["Forbidden color detected on subject"],
    };
  }

  if (allFlags.includes("engagement_bait")) {
    return {
      decision: "REJECT",
      reasons: ["Engagement bait detected — violates identity-first policy"],
    };
  }

  if (allFlags.includes("engagement_drift") && strategic_check < 0.60) {
    return {
      decision: "REJECT",
      reasons: ["Strategy is engagement-driven — contradicts Mikage core principle"],
    };
  }

  // Narrative hard fail
  if (narrative_check < 0.50) {
    return {
      decision: "REJECT",
      reasons: [`narrative_check ${narrative_check} critically low — narrative contradiction`],
    };
  }

  // --- REVIEW gates ---

  if (identity_check < 0.75) {
    return {
      decision: "REVIEW",
      reasons: [`identity_check ${identity_check} in review band (0.60–0.75)`],
    };
  }

  if (narrative_check < 0.75) {
    return {
      decision: "REVIEW",
      reasons: [`narrative_check ${narrative_check} in review band — narrative ambiguous`],
    };
  }

  if (strategic_check < 0.75) {
    return {
      decision: "REVIEW",
      reasons: [`strategic_check ${strategic_check} in review band — strategic intent unclear`],
    };
  }

  if (risk_score >= 0.50) {
    return {
      decision: "REVIEW",
      reasons: [`risk_score ${risk_score} elevated — manual review recommended`],
    };
  }

  // Glam drift without hard reject still triggers review
  if (allFlags.includes("glamour_drift")) {
    return {
      decision: "REVIEW",
      reasons: ["Glamour drift signals detected — verify aesthetic alignment"],
    };
  }

  // --- AUTO_SAFE gate ---

  // If scores pass but risk is moderate and mode suggests ambiguity
  if (risk_score >= 0.35) {
    return {
      decision: "AUTO_SAFE",
      reasons: [`Scores pass but risk ${risk_score} is moderate — safe draft only, no publish`],
    };
  }

  // --- ALLOW ---

  return {
    decision: "ALLOW",
    reasons: [],
  };
}


// ===================================================================
// CONTROL TOKEN
// ===================================================================

/**
 * Issue a control token. Only callable when decision is ALLOW.
 *
 * @param {string} job_id
 * @param {number} [ttl_seconds=300]
 * @returns {{ job_id: string, control_token: string, issued_at: string, expires_in: number }}
 */
function issueToken(job_id, ttl_seconds) {
  const ttl = ttl_seconds || 300;
  const payload = `${job_id}:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  const token = crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex")
    .slice(0, 32);

  return {
    job_id,
    control_token: `prechecked_${token}`,
    issued_at: new Date().toISOString(),
    expires_in: ttl,
  };
}

/**
 * Validate a control token (basic structure check).
 * In production, this would check expiry against a token store.
 *
 * @param {Object} token_obj
 * @returns {boolean}
 */
function validateToken(token_obj) {
  if (!token_obj) return false;
  if (!token_obj.control_token) return false;
  if (!token_obj.control_token.startsWith("prechecked_")) return false;
  if (!token_obj.job_id) return false;
  if (!token_obj.expires_in || token_obj.expires_in <= 0) return false;

  // Expiry check
  if (token_obj.issued_at) {
    const issued = new Date(token_obj.issued_at).getTime();
    const now = Date.now();
    if (now - issued > token_obj.expires_in * 1000) return false;
  }

  return true;
}


// ===================================================================
// MAIN PRECHECK FUNCTION
// ===================================================================

/**
 * Execute full PRE-CONTROL evaluation.
 *
 * @param {Object} job  Must contain: identity, narrative, strategy, art_direction
 * @returns {Object}    PRE-CONTROL result with scores, decision, reasons, and optional token
 */
function precheck(job) {
  if (!job || typeof job !== "object") {
    throw new Error("[PRECHECK] Job object is null or not an object");
  }

  const identity = job.identity || {};
  const narrative = job.narrative || {};
  const strategy = job.strategy || {};
  const art_direction = job.art_direction || {};

  // --- Score all dimensions ---
  const identityResult = scoreIdentity(art_direction, identity);
  const narrativeResult = scoreNarrative(narrative, art_direction);
  const strategicResult = scoreStrategic(strategy, art_direction);

  const identity_check = Math.round(identityResult.score * 100) / 100;
  const narrative_check = Math.round(narrativeResult.score * 100) / 100;
  const strategic_check = Math.round(strategicResult.score * 100) / 100;

  // --- Calculate risk ---
  const risk_score = calculateRisk(
    identity_check,
    narrative_check,
    strategic_check,
    identityResult.flags,
    strategicResult.flags
  );

  // --- Decide ---
  const decisionResult = decide(
    identity_check,
    narrative_check,
    strategic_check,
    risk_score,
    identityResult.flags,
    strategicResult.flags
  );

  // --- Compile all reasons ---
  const allReasons = [
    ...identityResult.reasons,
    ...narrativeResult.reasons,
    ...strategicResult.reasons,
    ...decisionResult.reasons,
  ];

  // --- Build output ---
  const output = {
    identity_check,
    narrative_check,
    strategic_check,
    risk_score,
    decision: decisionResult.decision,
    reasons: allReasons,
    flags: [...identityResult.flags, ...strategicResult.flags],
  };

  // --- Issue token only on ALLOW ---
  if (decisionResult.decision === "ALLOW") {
    output.control_token = issueToken(job.job_id || "unknown");
  } else {
    output.control_token = null;
  }

  return output;
}


// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  precheck,

  // Individual scorers (for testing / inspection)
  scoreIdentity,
  scoreNarrative,
  scoreStrategic,
  calculateRisk,
  decide,

  // Token management
  issueToken,
  validateToken,

  // Canon (read-only, for downstream modules to reference)
  CANON,
};
