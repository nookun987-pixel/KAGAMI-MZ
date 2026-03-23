/**
 * MIKAGE — /middleware/constraints.js
 * Hard aesthetic constraints derived from Canon.
 * Returns structured constraint objects and compiles negative prompts.
 * Validates art_direction against Canon requirements — rejects violations.
 *
 * No creativity. No randomness. Pure enforcement.
 */

"use strict";

// ===================================================================
// HARD CONSTRAINTS — LOCKED
// ===================================================================

const HARD_CONSTRAINTS = Object.freeze({
  philosophy: "Wabi-Sabi + Porcelain Minimalism",
  symmetry_tolerance: 0.4,
  negative_space_min: 0.40,
  subject_max_ratio: 0.30,
  detail_ratio: "70/30",
  chiaroscuro_ratio: "4:1",
  broken_symmetry_required: true,
  imperfection_required: true,
  texture_variation_required: true,
  micro_humanity_motif_min: 1,
  three_axis_rule: true,
});

// ===================================================================
// TEXTURE REQUIREMENTS — what surfaces MUST show
// ===================================================================

const TEXTURE_REQUIREMENTS = Object.freeze([
  "micro-cracks on matte ceramic surface",
  "uneven matte B4C finish with wear patterns",
  "gold kintsugi seams with faint internal crimson glow",
  "heat-stress micro-scarring",
  "aged grain variation",
  "subsurface scattering on porcelain for bone-depth translucency",
]);

// ===================================================================
// MICRO-HUMANITY MOTIFS — at least 1 required per frame
// ===================================================================

const MICRO_HUMANITY_MOTIFS = Object.freeze([
  "breath fog condensing on visor interior",
  "broken analog clock held in titanium hand",
  "acid rain droplet reflecting Enso circle",
  "autoimmune cough blood on white porcelain",
  "piezo hum vibration on blade surface",
  "mechanical clock ticking artifact",
  "heat scar erythema ab igne pattern",
  "medical station blood-for-water exchange",
  "orbital wobble after gravitational strike",
  "data burn fracture on ceramic surface",
]);

// ===================================================================
// NEGATIVE PROMPT — CORE (always injected)
// ===================================================================

const NEGATIVE_PROMPT_CORE = Object.freeze([
  // Anti-AI artifacts
  "perfect skin",
  "plastic look",
  "plastic skin",
  "over-smooth surfaces",
  "over-smoothing",
  "AI polished look",
  "generic ai beauty",
  "airbrushed",
  "digital painting look",
  "artificial sharpness",
  "3d render",
  "CGI look",
  // Anti-symmetry
  "perfect symmetry",
  "hyper-symmetry",
  // Anti-organic
  "organic softness",
  "organic anatomy exaggeration",
  "soft chest contour",
  "curved waist",
  "exaggerated hips",
  // Anti-anime
  "anime",
  "anime style",
  "anime eyes",
  "chibi",
  "kawaii",
  "cute",
  // Anti-identity-break
  "exposed human face",
  "visible human eyes",
  "visible pupils",
  "traditional anime kitsune mask",
  "animal ears",
  // Anti-weapon-drift
  "curved katana",
  "thin blade",
  "clean laser sword",
  "neon rainbow blade",
  // Anti-environment-drift
  "cyberpunk clutter",
  "neon pollution",
  "cluttered messy cyberpunk",
  "sunny nature",
  "generic bright sci-fi",
  // Anti-style-drift
  "fantasy ornament overload",
  "magic effects",
  "magic circle",
  "floating glowing spells",
  "aura glow",
  "bloom effects",
  "lens flare overload",
  "flat 2D HUD screens",
  "shaky cam",
  // Anti-mecha-drift
  "bulky mecha suit",
  "heavy robotic suit",
  "external messy cables",
  "external wires on armor",
  "greebling",
  // Anti-commercial-drift
  "glossy luxury finish",
  "glossy toy look",
  "fashion editorial",
  "beauty photography",
  "sexy",
  "sexualized",
  "waifu",
  // Anti-material-drift
  "rusty porcelain",
  "dirty armor",
  "rust on ceramic",
  // Anti-anatomy
  "extra limbs",
  "bad anatomy",
  "deformed structural proportions",
]);

// ===================================================================
// COLOR CONSTRAINTS
// ===================================================================

const COLOR_CONSTRAINTS = Object.freeze({
  subject_allowed: {
    primary: "#FAFAFA",
    secondary: "#0A0A0A",
    accent: "#E60000",
    kintsugi: "gold",
  },
  subject_forbidden: [
    "green", "orange", "yellow large area",
    "cyan on character", "rainbow", "neon green",
    "neon pink", "neon orange",
  ],
  environment_allowed: [
    "cyan", "violet", "industrial orange",
    "neon grid colors", "acid rain green tint",
  ],
});

// ===================================================================
// COMPOSITION CONSTRAINTS
// ===================================================================

const COMPOSITION_CONSTRAINTS = Object.freeze({
  wide: {
    subject_max_ratio: 0.30,
    negative_space_min: 0.40,
    description: "subject occupies max 30% of frame, heavy negative space",
  },
  mid: {
    framing: "waist to thigh",
    blade_visible: true,
    description: "waist/thigh framing, blade must be visible",
  },
  close: {
    mask_coverage: 0.50,
    darkness_coverage: 0.50,
    description: "mask fills 50% of frame, rest is darkness",
  },
  universal: {
    foreground_required: true,
    foreground_options: ["mist", "rain", "sparks", "debris", "frozen fog", "acid rain"],
    aspect_ratios: ["2.35:1", "2.39:1", "2.76:1"],
    lens_sim: "ARRI ALEXA 65 + Panavision Ultra Vista Anamorphic",
    film_grain: true,
  },
});

// ===================================================================
// PUBLIC API
// ===================================================================

/**
 * Get the complete Mikage constraint set.
 * @returns {Object}
 */
function getConstraints() {
  return {
    hard: HARD_CONSTRAINTS,
    texture_requirements: TEXTURE_REQUIREMENTS,
    micro_humanity_motifs: MICRO_HUMANITY_MOTIFS,
    color: COLOR_CONSTRAINTS,
    composition: COMPOSITION_CONSTRAINTS,
  };
}

/**
 * Get the core negative prompt array.
 * @returns {string[]}
 */
function getNegativePromptCore() {
  return [...NEGATIVE_PROMPT_CORE];
}

/**
 * Compile a full negative prompt from core + art_direction.forbidden + custom additions.
 * Deduplicates and sorts by length (shorter = higher priority in SD weighting).
 *
 * @param {string[]} [artDirectionForbidden]  Additional forbidden terms from job
 * @param {string[]} [custom]                 Extra terms for specific job needs
 * @returns {string[]}
 */
function compileNegativePrompt(artDirectionForbidden, custom) {
  const all = [
    ...NEGATIVE_PROMPT_CORE,
    ...(artDirectionForbidden || []),
    ...(custom || []),
  ];

  // Deduplicate (case-insensitive)
  const seen = new Set();
  const deduped = [];
  for (const term of all) {
    const key = term.toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(term.trim());
    }
  }

  // Sort: shorter terms first (higher SD weighting priority)
  deduped.sort((a, b) => a.length - b.length);

  return deduped;
}

// ===================================================================
// CONSTRAINT VALIDATION
// ===================================================================

/**
 * @typedef {Object} ConstraintViolation
 * @property {string}  rule       Which constraint was violated
 * @property {*}       expected   What the constraint requires
 * @property {*}       actual     What was found
 * @property {string}  severity   "REJECT" | "WARN"
 */

/**
 * Validate an art_direction composition block against hard constraints.
 * Returns violations array. Empty = all passed.
 *
 * @param {Object} composition  The art_direction.composition object
 * @returns {{ valid: boolean, violations: ConstraintViolation[] }}
 */
function validateComposition(composition) {
  const violations = [];
  const comp = composition || {};

  // --- negative_space_min ---
  if (comp.negative_space_min !== undefined) {
    if (comp.negative_space_min < HARD_CONSTRAINTS.negative_space_min) {
      violations.push({
        rule: "negative_space_min",
        expected: `>= ${HARD_CONSTRAINTS.negative_space_min}`,
        actual: comp.negative_space_min,
        severity: "REJECT",
      });
    }
  }

  // --- broken_symmetry_required ---
  if (comp.broken_symmetry_required === false) {
    violations.push({
      rule: "broken_symmetry_required",
      expected: true,
      actual: false,
      severity: "REJECT",
    });
  }

  // --- imperfection_required ---
  if (comp.imperfection_required === false) {
    violations.push({
      rule: "imperfection_required",
      expected: true,
      actual: false,
      severity: "REJECT",
    });
  }

  // --- texture_variation_required ---
  if (comp.texture_variation_required === false) {
    violations.push({
      rule: "texture_variation_required",
      expected: true,
      actual: false,
      severity: "REJECT",
    });
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Validate full art_direction against all constraints.
 * Checks composition + material presence + forbidden terms.
 *
 * @param {Object} art_direction
 * @returns {{ valid: boolean, violations: ConstraintViolation[] }}
 */
function validateArtDirection(art_direction) {
  const violations = [];
  const ad = art_direction || {};

  // --- Composition ---
  const compResult = validateComposition(ad.composition);
  violations.push(...compResult.violations);

  // --- Materials must exist ---
  const materials = Array.isArray(ad.material) ? ad.material : [];
  if (materials.length === 0) {
    violations.push({
      rule: "material_required",
      expected: "at least 1 Canon material",
      actual: 0,
      severity: "WARN",
    });
  }

  // --- Mood must exist ---
  const moods = Array.isArray(ad.mood) ? ad.mood : [];
  if (moods.length === 0) {
    violations.push({
      rule: "mood_required",
      expected: "at least 1 mood descriptor",
      actual: 0,
      severity: "WARN",
    });
  }

  // --- Style must exist ---
  const styles = Array.isArray(ad.style) ? ad.style : [];
  if (styles.length === 0) {
    violations.push({
      rule: "style_required",
      expected: "at least 1 style descriptor",
      actual: 0,
      severity: "WARN",
    });
  }

  return {
    valid: violations.filter((v) => v.severity === "REJECT").length === 0,
    violations,
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Constraint data
  HARD_CONSTRAINTS,
  TEXTURE_REQUIREMENTS,
  MICRO_HUMANITY_MOTIFS,
  NEGATIVE_PROMPT_CORE,
  COLOR_CONSTRAINTS,
  COMPOSITION_CONSTRAINTS,

  // API
  getConstraints,
  getNegativePromptCore,
  compileNegativePrompt,

  // Validation
  validateComposition,
  validateArtDirection,
};
