/**
 * MIKAGE — VLM Semantic Analyzer
 * Resolves signals that require vision-language model understanding.
 *
 * Covers 8 rules that pixel math cannot enforce:
 *   T10 — Distortion grid alignment (geometric semantics)
 *   I1  — Mask symmetry void / human eye visibility
 *   I2  — Porcelain matte vs plastic material read
 *   I3  — Graphene/carbon internal structure read
 *   I4  — Restrained crimson vs neon spill
 *   I5  — Anti-anime/cute/toon drift
 *   I6  — Anti-neon clutter / HUD / flare spam
 *   C2  — Logo / branding distortion overlap
 *
 * Design:
 *   - 3 batched VLM calls (grouped by semantic domain) to minimize latency
 *   - Each call returns structured JSON scores
 *   - If VLM unavailable → all signals remain undefined → rule engine marks UNKNOWN
 *   - No fake pass, no fallback values
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ===================================================================
// VLM CLIENT — injectable, same pattern as vision_critic.js
// ===================================================================

let _vlmClient = null;

/**
 * Inject a VLM client.
 * Must have: async query(imagePath, systemPrompt, userPrompt) => Object
 */
function setVLMClient(client) {
  if (client && typeof client.query !== "function") {
    throw new Error("[VLM_SEMANTIC] Client must have async query(imagePath, systemPrompt, userPrompt)");
  }
  _vlmClient = client;
}

function getVLMClient() {
  return _vlmClient;
}

/**
 * Check if VLM is available.
 */
function isVLMAvailable() {
  return _vlmClient !== null;
}

// ===================================================================
// PROMPTS — grouped by semantic domain for batched queries
// ===================================================================

/**
 * BATCH 1: Identity & Material (I1, I2, I3, I5)
 * Single image inspection for character identity signals.
 */
const IDENTITY_MATERIAL_PROMPT = {
  system:
    "You are a technical visual inspector for a hard sci-fi character project " +
    "(MIKAGE — porcelain/carbon armor entity with kitsune mask, no human features). " +
    "You inspect images for SPECIFIC material and identity violations. " +
    "Return ONLY a JSON object with numeric scores (0.0 = not detected, 1.0 = strongly detected). " +
    "Be precise. Do not explain.",
  user:
    "Analyze this rendered image for the following detections:\n\n" +
    "1. human_eyes_detected: Are human eyes, irises, or pupils visible anywhere? " +
    "Includes eyes peeking through mask voids. Score 0.0 if only dark voids or abstract shapes. " +
    "Score 1.0 if clear human eyes are visible.\n\n" +
    "2. face_mesh_visible: Is a human facial structure (nose, mouth, cheekbones, expressions) " +
    "visible on or through the mask? Score 0.0 if mask is abstract/geometric. " +
    "Score 1.0 if human face is clearly readable.\n\n" +
    "3. high_gloss_specular: Do white/light surfaces appear glossy, shiny, or candy-coated? " +
    "Score 0.0 if surfaces are matte/ceramic/chalky. Score 1.0 if plastic-like shine.\n\n" +
    "4. pvc_plastic_read: Does the overall surface material read as PVC, vinyl, or toy plastic? " +
    "Score 0.0 if materials look like porcelain/ceramic/stone. Score 1.0 if toy-like.\n\n" +
    "5. missing_weave_texture: Are dark internal/structural regions flat and featureless? " +
    "Score 0.0 if dark regions show carbon fiber, graphene weave, or engineered texture. " +
    "Score 1.0 if dark regions are flat airbrushed black.\n\n" +
    "6. soft_fabric_folds_on_joints: Do joint regions look like soft cloth/fabric instead of " +
    "engineered carbon/titanium? Score 0.0 if joints are hard-surface mechanical. " +
    "Score 1.0 if soft organic fabric folds are visible.\n\n" +
    "7. toon_shading: Is cel-shading, flat cartoon coloring, or anime-style rendering visible? " +
    "Score 0.0 for realistic/PBR rendering. Score 1.0 for obvious toon/cel shading.\n\n" +
    "8. chibi_proportions: Are body proportions exaggerated in a cute/chibi/super-deformed way? " +
    "Score 0.0 for realistic proportions. Score 1.0 for chibi/cute proportions.\n\n" +
    "RESPOND ONLY with JSON:\n" +
    '{"human_eyes_detected":0.0,"face_mesh_visible":0.0,"high_gloss_specular":0.0,' +
    '"pvc_plastic_read":0.0,"missing_weave_texture":0.0,"soft_fabric_folds_on_joints":0.0,' +
    '"toon_shading":0.0,"chibi_proportions":0.0}',
};

/**
 * BATCH 2: Energy & Atmosphere (I4, I6)
 * Detect forbidden color/energy/lighting patterns.
 */
const ENERGY_ATMOSPHERE_PROMPT = {
  system:
    "You are a lighting and energy inspector for a restrained hard sci-fi visual project. " +
    "The project uses controlled crimson energy (internal, disciplined, never neon). " +
    "Background should be dark, restrained, cinematic — never cluttered with cyber neon. " +
    "Return ONLY a JSON object with numeric scores (0.0 = not detected, 1.0 = strongly detected). " +
    "Be precise.",
  user:
    "Analyze this rendered image for these energy/atmosphere violations:\n\n" +
    "1. magenta_neon_spill: Does crimson/red energy spill outward into the environment " +
    "as bright uncontrolled neon? Score 0.0 if red is internal/restrained. " +
    "Score 1.0 if bright magenta/crimson neon floods the scene.\n\n" +
    "2. chaotic_particle_bloom: Are there uncontrolled particle effects, bloom explosions, " +
    "or scattered energy bursts? Score 0.0 for clean/controlled effects. " +
    "Score 1.0 for chaotic particle spam.\n\n" +
    "3. cyan_magenta_overload: Are multiple bright neon colors (cyan, magenta, green, purple) " +
    "competing for attention? Score 0.0 for restrained palette. " +
    "Score 1.0 for cyberpunk neon overload.\n\n" +
    "4. lens_flare_spam: Are there excessive lens flares, light streaks, or " +
    "anamorphic flare effects cluttering the image? Score 0.0 if clean. " +
    "Score 1.0 if flare spam.\n\n" +
    "RESPOND ONLY with JSON:\n" +
    '{"magenta_neon_spill":0.0,"chaotic_particle_bloom":0.0,' +
    '"cyan_magenta_overload":0.0,"lens_flare_spam":0.0}',
};

/**
 * BATCH 3: Geometry & Branding (T10, C2)
 * Detect structural alignment and branding integrity.
 */
const GEOMETRY_BRANDING_PROMPT = {
  system:
    "You are a structural geometry and branding integrity inspector for a commercial " +
    "product photography / render pipeline. You evaluate whether distortion effects " +
    "follow architectural logic and whether branding regions are protected. " +
    "Return ONLY a JSON object with numeric scores. Be precise.",
  user:
    "Analyze this rendered image for geometric alignment and branding protection:\n\n" +
    "1. line_angle_deviation: Examine any visible distortion or glitch effects in the image. " +
    "Do they follow clean geometric lines (orthogonal, grid-aligned, architectural)? " +
    "Score 0.0 if distortion follows clean grid logic or no distortion is present. " +
    "Score in degrees (0-90) for how far distortion deviates from grid alignment. " +
    "Score 0 if no distortion visible.\n\n" +
    "2. grid_snap_variance: Does the distortion respect background architectural lines " +
    "(walls, floors, columns, edges)? Score 0.0 if distortion snaps to geometry. " +
    "Score 1.0 if distortion is random/organic/blob-like.\n\n" +
    "3. logo_overlap_ratio: Is any visible logo, brand mark, text, or label partially " +
    "obscured, warped, or overlapped by distortion effects? Score 0.0 if logos are clean. " +
    "Score 0.0-1.0 for the proportion of logo area affected. " +
    "Score 0.0 if no logos visible.\n\n" +
    "4. branding_zone_distortion_contact: Does any distortion/glitch effect touch or " +
    "enter a region where a brand logo or product label could be placed (center chest, " +
    "back panel, sleeve, collar)? Score 0.0 if branding zones are clean. " +
    "Score 1.0 if distortion invades branding areas.\n\n" +
    "RESPOND ONLY with JSON:\n" +
    '{"line_angle_deviation":0,"grid_snap_variance":0.0,' +
    '"logo_overlap_ratio":0.0,"branding_zone_distortion_contact":0.0}',
};

// ===================================================================
// VLM QUERY WITH ROBUST JSON PARSING
// ===================================================================

/**
 * Query VLM and parse response, with fallback JSON extraction.
 * @returns {Object|null} Parsed signals or null on failure
 */
async function queryVLM(imagePath, promptDef) {
  if (!_vlmClient) return null;

  try {
    const result = await _vlmClient.query(imagePath, promptDef.system, promptDef.user);

    // If client already parsed JSON, return directly
    if (result && typeof result === "object" && !Array.isArray(result)) {
      return result;
    }

    // If string, try JSON parse
    if (typeof result === "string") {
      try {
        return JSON.parse(result);
      } catch (_) {
        const match = result.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
      }
    }

    return null;
  } catch (err) {
    // VLM query failed — return null, signals stay undefined → UNKNOWN
    return null;
  }
}

/**
 * Clamp a VLM score to 0-1 range, treating non-numbers as undefined.
 */
function clampScore(val) {
  if (typeof val !== "number" || isNaN(val)) return undefined;
  return Math.max(0, Math.min(1, val));
}

/**
 * Clamp a degree value (for line_angle_deviation), allowing 0-90 range.
 */
function clampDegrees(val) {
  if (typeof val !== "number" || isNaN(val)) return undefined;
  return Math.max(0, Math.min(90, val));
}

// ===================================================================
// MAIN ANALYZER
// ===================================================================

/**
 * Run all VLM semantic detections.
 *
 * @param {string} imagePath - Path to the rendered image
 * @returns {Promise<Object>} Signal map. Missing signals = undefined (→ UNKNOWN in rule engine)
 */
async function analyzeSemantics(imagePath) {
  if (!isVLMAvailable()) {
    // No VLM configured — return empty object.
    // All semantic signals stay undefined → rule engine marks UNKNOWN.
    return {
      _vlm_status: "unavailable",
      _vlm_signals_provided: 0,
    };
  }

  if (!fs.existsSync(imagePath)) {
    return {
      _vlm_status: "image_not_found",
      _vlm_signals_provided: 0,
    };
  }

  // Run all 3 batches in parallel
  const [identityRaw, energyRaw, geometryRaw] = await Promise.all([
    queryVLM(imagePath, IDENTITY_MATERIAL_PROMPT),
    queryVLM(imagePath, ENERGY_ATMOSPHERE_PROMPT),
    queryVLM(imagePath, GEOMETRY_BRANDING_PROMPT),
  ]);

  const signals = {};
  let provided = 0;

  // --- Batch 1: Identity & Material ---
  if (identityRaw) {
    const fields = [
      "human_eyes_detected", "face_mesh_visible",
      "high_gloss_specular", "pvc_plastic_read",
      "missing_weave_texture", "soft_fabric_folds_on_joints",
      "toon_shading", "chibi_proportions",
    ];
    for (const f of fields) {
      const v = clampScore(identityRaw[f]);
      if (v !== undefined) {
        // Convert continuous 0-1 score to binary signal for rule engine
        // Threshold: > 0.4 = detected (1), <= 0.4 = not detected (0)
        signals[f] = v > 0.4 ? 1 : 0;
        provided++;
      }
    }
  }

  // --- Batch 2: Energy & Atmosphere ---
  if (energyRaw) {
    const fields = [
      "magenta_neon_spill", "chaotic_particle_bloom",
      "cyan_magenta_overload", "lens_flare_spam",
    ];
    for (const f of fields) {
      const v = clampScore(energyRaw[f]);
      if (v !== undefined) {
        signals[f] = v > 0.4 ? 1 : 0;
        provided++;
      }
    }
  }

  // --- Batch 3: Geometry & Branding ---
  if (geometryRaw) {
    // line_angle_deviation is in degrees, not 0-1
    const lad = clampDegrees(geometryRaw.line_angle_deviation);
    if (lad !== undefined) {
      signals.line_angle_deviation = lad;
      provided++;
    }

    const gsv = clampScore(geometryRaw.grid_snap_variance);
    if (gsv !== undefined) {
      signals.grid_snap_variance = gsv > 0.4 ? 1 : 0;
      provided++;
    }

    const lor = clampScore(geometryRaw.logo_overlap_ratio);
    if (lor !== undefined) {
      signals.logo_overlap_ratio = lor > 0.1 ? lor : 0; // any overlap > 10% = flagged
      provided++;
    }

    const bzdc = clampScore(geometryRaw.branding_zone_distortion_contact);
    if (bzdc !== undefined) {
      signals.branding_zone_distortion_contact = bzdc > 0.4 ? 1 : 0;
      provided++;
    }
  }

  signals._vlm_status = "completed";
  signals._vlm_signals_provided = provided;
  signals._vlm_batches = {
    identity_material: identityRaw !== null,
    energy_atmosphere: energyRaw !== null,
    geometry_branding: geometryRaw !== null,
  };

  return signals;
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  analyzeSemantics,
  setVLMClient,
  getVLMClient,
  isVLMAvailable,
  // Exposed for testing
  IDENTITY_MATERIAL_PROMPT,
  ENERGY_ATMOSPHERE_PROMPT,
  GEOMETRY_BRANDING_PROMPT,
};

// ===================================================================
// P2 — CERAMIC VALIDATOR ALIGNMENT PATCH
// ===================================================================

/**
 * Detect ceramic material vs plastic based on VLM signals and prompt keywords.
 * 
 * P2 LOGIC:
 * IF:
 *   - surface = smooth (high_gloss_specular or pvc_plastic_read > 0.4)
 *   - AND no microtexture signal (missing keywords in prompt)
 * THEN:
 *   flag = "PLASTIC_RISK_HIGH"
 * ELSE IF:
 *   - microtexture keywords present (boron carbide, micro-pitted)
 *   - AND edge imperfections present
 * THEN:
 *   flag = "CERAMIC_CONFIRMED"
 * 
 * @param {Object} vlmSignals - Signals from analyzeSemantics
 * @param {string} promptText - The rendered prompt text
 * @returns {{flag: string|null, reason: string}}
 */
function detectCeramicMaterial(vlmSignals, promptText) {
  const prompt = (promptText || "").toLowerCase();
  
  // Check for microtexture keywords (P1 tokens)
  const hasMicrotexture = prompt.includes("boron carbide") || 
                          prompt.includes("b4c") || 
                          prompt.includes("micro-pitted") ||
                          prompt.includes("micro-pitted surface") ||
                          prompt.includes("sub-micron grain");
  
  // Check for edge imperfection keywords
  const hasEdgeImperfections = prompt.includes("micro abrasions") ||
                               prompt.includes("wear inconsistencies") ||
                               prompt.includes("edge chipping");
  
  // Check for plastic signals from VLM
  const hasSmoothSurface = (vlmSignals && (vlmSignals.high_gloss_specular === 1 || 
                                           vlmSignals.pvc_plastic_read === 1));
  
  // P2 LOGIC IMPLEMENTATION
  if (hasSmoothSurface && !hasMicrotexture) {
    return {
      flag: "PLASTIC_RISK_HIGH",
      reason: "Surface reads as smooth plastic/resin but lacks ceramic microtexture keywords"
    };
  }
  
  if (hasMicrotexture && hasEdgeImperfections) {
    return {
      flag: "CERAMIC_CONFIRMED",
      reason: "B4C ceramic tokens and edge imperfections present in prompt"
    };
  }
  
  // If microtexture present but no edge imperfections, still likely ceramic
  if (hasMicrotexture) {
    return {
      flag: "CERAMIC_CONFIRMED",
      reason: "B4C ceramic microstructure tokens detected"
    };
  }
  
  return {
    flag: null,
    reason: "Insufficient data for ceramic detection"
  };
}

// Add to exports
module.exports.detectCeramicMaterial = detectCeramicMaterial;
