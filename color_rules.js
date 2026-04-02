"use strict";

const fs = require("fs");
const path = require("path");

const COLOR_CANON_PATH = path.join(__dirname, "mikage_color_canon.json");

// MASK CANON COMPLIANCE CONSTANTS
const MASK_CANON = Object.freeze({
  BACKGROUND_HEX: "#0A0A0A",
  CRIMSON_SEAM_HEX: "#E60000",
  MAX_CRIMSON_RATIO: 0.02,
  OBSIDIAN_PROMPT: "obsidian void background #0A0A0A, deep velvet black, no grey, no gradient",
  CRIMSON_SEAM_PROMPT: "thin Bengala crimson seam at jawline, #E60000, no glow, no spread, strictly embedded in fracture lines",
  HARD_NEGATIVES: ["no grey background", "no neutral studio backdrop", "no mid-tone background"],
});

// P1 — CERAMIC MATERIAL MICROSTRUCTURE TOKENS (MANDATORY)
const CERAMIC_MATERIAL_TOKENS = Object.freeze({
  MICROSTRUCTURE: "boron carbide (B4C) technical ceramic, micro-pitted surface, sub-micron grain structure, irregular light scattering, non-uniform matte diffusion, microscopic edge chipping, density-weighted material response",
  LIGHT_BREAKUP: "anisotropic micro-shadowing, subtle surface noise under grazing light, non-continuous highlight rolloff",
  EDGE_IMPERFECTION: "micro abrasions on edges, subtle wear inconsistencies, non-perfect curvature continuity",
});

// P1 — ANTI-PLASTIC NEGATIVE TOKENS (MANDATORY)
const ANTI_PLASTIC_NEGATIVES = [
  "smooth resin",
  "injection molded plastic",
  "uniform surface",
  "toy-like finish",
  "synthetic polymer",
  "perfect smoothness",
  "CG plastic shading",
];

// P2 — CERAMIC VALIDATOR FLAGS
const CERAMIC_VALIDATOR_FLAGS = Object.freeze({
  PLASTIC_RISK_HIGH: "PLASTIC_RISK_HIGH",
  CERAMIC_CONFIRMED: "CERAMIC_CONFIRMED",
});

function normalizeText(value) {
  return String(value || "").trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function dedupeStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function loadColorCanon() {
  return JSON.parse(fs.readFileSync(COLOR_CANON_PATH, "utf-8"));
}

function isMaskMacro(intakeOrSpec = {}) {
  const shotType = normalizeText(
    intakeOrSpec.shot_type ||
    (intakeOrSpec.composition && intakeOrSpec.composition.shot_type) ||
    (intakeOrSpec.render_spec && intakeOrSpec.render_spec.shot_type)
  ).toUpperCase();
  return shotType === "MASK_MACRO";
}

function resolvePaletteKeys(intakeOrSpec = {}) {
  const shotType = normalizeText(
    intakeOrSpec.shot_type ||
    (intakeOrSpec.composition && intakeOrSpec.composition.shot_type) ||
    (intakeOrSpec.render_spec && intakeOrSpec.render_spec.shot_type)
  ).toUpperCase();
  const materialPrimary = normalizeText(
    intakeOrSpec.material && intakeOrSpec.material.primary ||
    intakeOrSpec.material_primary ||
    intakeOrSpec.materialPrimary
  );

  if (shotType === "WEAPON_MACRO") {
    return ["charcoal_black", "restrained_crimson", "muted_earth"];
  }
  if (/ceramic|porcelain|b4c/i.test(materialPrimary) || shotType === "MATERIAL_MACRO" || shotType === "MASK_MACRO") {
    return ["ceramic_off_white", "charcoal_black", "restrained_crimson", "muted_earth"];
  }
  return ["charcoal_black", "restrained_crimson", "muted_earth"];
}

function buildColorConstraints(intakeOrSpec = {}) {
  const canon = loadColorCanon();
  const paletteKeys = resolvePaletteKeys(intakeOrSpec);
  const isMask = isMaskMacro(intakeOrSpec);
  const lines = [
    "subtractive mineral color logic",
    "color must follow form then material, never override them",
    "low saturation, no neon",
    "matte-first material response",
    "shadow-dominant composition (70%)",
    "bokashi gradient, non-linear",
    "no flat color, always material texture variation",
    "diffuse highlights, not specular",
    "pure white and pure black are forbidden",
    "plastic-clean RGB color is forbidden",
  ];

  // MASK CANON COMPLIANCE: Force background lock
  if (isMask) {
    lines.push(MASK_CANON.OBSIDIAN_PROMPT);
    lines.push(MASK_CANON.CRIMSON_SEAM_PROMPT);
  }

  if (paletteKeys.includes("ceramic_off_white")) {
    lines.push("ceramic off-white must stay warm and broken, never sterile pure white");
  }
  if (paletteKeys.includes("charcoal_black")) {
    lines.push("charcoal black must keep temperature variation, never dead pure black");
  }
  if (paletteKeys.includes("restrained_crimson")) {
    lines.push("restrained crimson only in seams, cores, or controlled heat accents");
  }
  if (paletteKeys.includes("muted_earth")) {
    lines.push("muted earth support only, low saturation material support tones");
  }

  return dedupeStrings([
    ...lines,
    ...toArray(canon.required_anchors),
  ]);
}

function buildColorNegative(intakeOrSpec = {}) {
  const canon = loadColorCanon();
  const paletteKeys = resolvePaletteKeys(intakeOrSpec);
  const isMask = isMaskMacro(intakeOrSpec);
  const negatives = [
    "neon",
    "neon rgb",
    "oversaturation",
    "pure white",
    "pure black",
    "rgb clean plastic color",
    "magenta synthetic",
    "flat color no texture",
    "plastic color drift",
    "crimson overuse",
    "full-frame red wash",
  ];

  // MASK CANON COMPLIANCE: Hard negatives for grey/neutral backgrounds
  if (isMask) {
    negatives.push(...MASK_CANON.HARD_NEGATIVES);
  }

  // P1 — ANTI-PLASTIC NEGATIVE TOKENS for MASK/CERAMIC
  if (isMask || paletteKeys.includes("ceramic_off_white")) {
    negatives.push(...ANTI_PLASTIC_NEGATIVES);
  }

  for (const key of paletteKeys) {
    const paletteEntry = canon.palette[key];
    if (!paletteEntry) continue;
    negatives.push(...toArray(paletteEntry.forbidden));
  }
  negatives.push(...toArray(canon.forbidden));
  return dedupeStrings(negatives);
}

function applyColorCanonToIntake(intake) {
  const canon = loadColorCanon();
  const safe = cloneJson(intake);
  safe.lighting = safe.lighting && typeof safe.lighting === "object" ? safe.lighting : {};
  safe.material = safe.material && typeof safe.material === "object" ? safe.material : {};

  const paletteUsed = resolvePaletteKeys(safe);
  const colorConstraints = buildColorConstraints(safe);
  const colorNegative = buildColorNegative(safe);

  safe.lighting.constraints = dedupeStrings([
    ...toArray(safe.lighting.constraints),
    "color must remain subordinate to material identity",
    ...colorConstraints,
  ]);
  safe.anti_drift_rules = dedupeStrings([
    ...toArray(safe.anti_drift_rules),
    "form -> material -> color priority is mandatory",
    "do not allow neon, pure white, pure black, or plastic-clean RGB drift",
    "crimson may appear only as restrained seam/core accent when applicable",
  ]);
  safe.core_risks = dedupeStrings([
    ...toArray(safe.core_risks),
    "COLOR_NEON_DRIFT",
    "OVERSATURATION_DRIFT",
    "PURE_WHITE_DRIFT",
    "PURE_BLACK_DRIFT",
    "PLASTIC_COLOR_DRIFT",
    "CRIMSON_OVERUSE",
  ]);
  safe.success_criteria = dedupeStrings([
    ...toArray(safe.success_criteria),
    "color feels subtractive and pigment-like, never RGB-clean",
    "shadow mass dominates and color remains materially grounded",
  ]);
  safe.material.forbidden_reads = dedupeStrings([
    ...toArray(safe.material.forbidden_reads),
    ...colorNegative,
  ]);
  safe.color_canon_applied = true;
  safe.palette_used = paletteUsed;
  safe.color_constraints = colorConstraints;
  safe.color_negative = colorNegative;
  safe.color_priority_order = ["form", "material", "color"];
  safe.color_canon_id = canon.system_id;
  return safe;
}

function applyColorCanonToSpec(promptPackage, intake = {}) {
  const safe = cloneJson(promptPackage);
  const isMask = isMaskMacro({ ...intake, ...safe, render_spec: safe.render_spec });
  const paletteUsed = resolvePaletteKeys({
    ...intake,
    ...safe,
    render_spec: safe.render_spec,
  });
  const colorConstraints = buildColorConstraints({
    ...intake,
    ...safe,
    render_spec: safe.render_spec,
  });
  const colorNegative = buildColorNegative({
    ...intake,
    ...safe,
    render_spec: safe.render_spec,
  });

  // MASK CANON COMPLIANCE: Force inject background and crimson seam into positive prompt
  // P1 — CERAMIC MATERIAL MICROSTRUCTURE TOKENS for MASK/CERAMIC
  let positivePromptSegments = [];
  if (isMask) {
    positivePromptSegments.push(MASK_CANON.OBSIDIAN_PROMPT);
    positivePromptSegments.push(MASK_CANON.CRIMSON_SEAM_PROMPT);
  }

  // P1 — ADD CERAMIC MATERIAL TOKENS for MASK or CERAMIC palette
  if (isMask || paletteUsed.includes("ceramic_off_white")) {
    positivePromptSegments.push(CERAMIC_MATERIAL_TOKENS.MICROSTRUCTURE);
    positivePromptSegments.push(CERAMIC_MATERIAL_TOKENS.LIGHT_BREAKUP);
    positivePromptSegments.push(CERAMIC_MATERIAL_TOKENS.EDGE_IMPERFECTION);
  }

  // P3 — HARD ASSERT: CERAMIC SPEC MANDATORY CHECK
  if (isMask || paletteUsed.includes("ceramic_off_white")) {
    const fullPrompt = safe.structured_prompt || "";
    const hasBoronCarbide = fullPrompt.toLowerCase().includes("boron carbide") || fullPrompt.toLowerCase().includes("b4c");
    const hasMicroPitted = fullPrompt.toLowerCase().includes("micro-pitted") || fullPrompt.toLowerCase().includes("micro pitted");
    if (!hasBoronCarbide || !hasMicroPitted) {
      throw new Error("CERAMIC SPEC MISSING — WILL FAIL GEMINI: prompt must include 'boron carbide (B4C)' and 'micro-pitted' tokens");
    }
  }

  const colorBlock = [
    "COLOR",
    ...colorConstraints,
  ].join("\n");

  // Prepend mask-specific segments to structured prompt
  const structuredParts = [];
  if (positivePromptSegments.length > 0) {
    structuredParts.push(...positivePromptSegments);
  }
  structuredParts.push(normalizeText(safe.structured_prompt), colorBlock);

  safe.structured_prompt = dedupeStrings(structuredParts).join("\n\n");
  safe.negative_prompt = dedupeStrings([
    ...String(safe.negative_prompt || "").split(",").map((item) => item.trim()),
    ...colorNegative,
  ]).join(", ");
  safe.positivePrompt = normalizeText(safe.positivePrompt) || safe.structured_prompt;
  safe.negativePrompt = normalizeText(safe.negativePrompt) || safe.negative_prompt;

  // STYLE KILL SWITCH: Disable Fooocus auto enhancement drift for MASK_MACRO
  if (isMask) {
    safe.style_selections = [];
    safe.styles = [];
    if (safe.payload && typeof safe.payload === "object") {
      safe.payload.style_selections = [];
    }
  }

  safe.spec = safe.spec && typeof safe.spec === "object" ? safe.spec : {};
  safe.spec.texture = dedupeStrings([
    ...toArray(safe.spec.texture),
    "subtractive mineral color logic",
    "matte-first material response",
  ]);
  safe.spec.lighting = dedupeStrings([
    ...toArray(safe.spec.lighting),
    "shadow-dominant composition (70%)",
    "low saturation, no neon",
    "bokashi gradient, non-linear",
  ]);
  safe.spec.composition_rules = dedupeStrings([
    ...toArray(safe.spec.composition_rules),
    "no flat color, always material texture variation",
    "form then material then color",
  ]);
  safe.spec.negative_prompt = dedupeStrings([
    ...toArray(safe.spec.negative_prompt),
    ...colorNegative,
  ]);

  safe.payload = safe.payload && typeof safe.payload === "object" ? safe.payload : {};
  safe.payload.prompt = safe.structured_prompt;
  safe.payload.negative_prompt = safe.negative_prompt;
  // STYLE KILL SWITCH: Force empty styles in payload
  if (isMask) {
    safe.payload.style_selections = [];
  }

  safe.locked_prompt_package = safe.locked_prompt_package && typeof safe.locked_prompt_package === "object" ? safe.locked_prompt_package : {};
  safe.locked_prompt_package.texture = dedupeStrings([
    ...toArray(safe.locked_prompt_package.texture),
    "subtractive mineral color logic",
    "matte-first material response",
  ]);
  safe.locked_prompt_package.lighting = dedupeStrings([
    ...toArray(safe.locked_prompt_package.lighting),
    "shadow-dominant composition (70%)",
    "low saturation, no neon",
    "bokashi gradient, non-linear",
  ]);
  safe.locked_prompt_package.composition_rules = dedupeStrings([
    ...toArray(safe.locked_prompt_package.composition_rules),
    "no flat color, always material texture variation",
    "form then material then color",
  ]);
  safe.locked_prompt_package.negative_prompt = safe.negative_prompt;

  safe.color_canon_applied = true;
  safe.palette_used = paletteUsed;
  safe.color_constraints = colorConstraints;
  safe.color_negative = colorNegative;
  safe.color_priority_order = ["form", "material", "color"];
  // MASK CANON COMPLIANCE: Mark if mask enforcement is active
  safe.mask_canon_enforced = isMask;
  return safe;
}

// ===================================================================
// MASK CANON COMPLIANCE: POST-RENDER ASSERTIONS
// ===================================================================

/**
 * Check if a color value is "near black" (close to #0A0A0A obsidian)
 * @param {string} hexColor - Hex color string
 * @returns {boolean}
 */
function isNearBlack(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return false;
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Near black: all channels should be very low (< 30 for near #0A0A0A)
  return r < 30 && g < 30 && b < 30;
}

/**
 * Check if a color value is "near gofun" (warm off-white highlight)
 * @param {string} hexColor - Hex color string
 * @returns {boolean}
 */
function isNearGofun(hexColor) {
  if (!hexColor || typeof hexColor !== "string") return false;
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Near gofun: warm off-white, red slightly higher than blue
  return r > 220 && g > 215 && b > 200 && r > b;
}

/**
 * MASK CANON COMPLIANCE: Assert background is near black or near gofun
 * @param {string} backgroundHex - Detected background hex color
 * @returns {{pass: boolean, reason: string|null}}
 */
function assertMaskBackground(backgroundHex) {
  if (!backgroundHex) {
    return { pass: false, reason: "BACKGROUND_NULL" };
  }
  if (isNearBlack(backgroundHex) || isNearGofun(backgroundHex)) {
    return { pass: true, reason: null };
  }
  return {
    pass: false,
    reason: `BACKGROUND_REJECT: ${backgroundHex} is not near_black (#0A0A0A) or near_gofun`,
  };
}

/**
 * MASK CANON COMPLIANCE: Assert crimson ratio is within bounds (0 < ratio < 0.02)
 * @param {number} crimsonRatio - Detected crimson pixel ratio
 * @returns {{pass: boolean, reason: string|null}}
 */
function assertCrimsonRatio(crimsonRatio) {
  if (typeof crimsonRatio !== "number" || isNaN(crimsonRatio)) {
    return { pass: false, reason: "CRIMSON_RATIO_INVALID" };
  }
  if (crimsonRatio === 0) {
    return { pass: false, reason: "CRIMSON_RATIO_ZERO: no crimson seam detected" };
  }
  if (crimsonRatio >= MASK_CANON.MAX_CRIMSON_RATIO) {
    return {
      pass: false,
      reason: `CRIMSON_RATIO_EXCESS: ${crimsonRatio.toFixed(4)} >= ${MASK_CANON.MAX_CRIMSON_RATIO}`,
    };
  }
  return { pass: true, reason: null };
}

/**
 * MASK CANON COMPLIANCE: Run all post-render assertions
 * @param {{backgroundHex: string, crimsonRatio: number}} analysis - Image analysis results
 * @returns {{pass: boolean, assertions: Object, reasons: string[]}}
 */
function assertMaskCanonCompliance(analysis) {
  const bgResult = assertMaskBackground(analysis.backgroundHex);
  const crimsonResult = assertCrimsonRatio(analysis.crimsonRatio);

  const reasons = [];
  if (!bgResult.pass) reasons.push(bgResult.reason);
  if (!crimsonResult.pass) reasons.push(crimsonResult.reason);

  return {
    pass: bgResult.pass && crimsonResult.pass,
    assertions: {
      background: bgResult,
      crimson: crimsonResult,
    },
    reasons: reasons,
    expected: {
      background_near: "#0A0A0A (obsidian) or gofun",
      crimson_ratio_min: "> 0",
      crimson_ratio_max: `< ${MASK_CANON.MAX_CRIMSON_RATIO}`,
    },
  };
}

module.exports = {
  applyColorCanonToIntake,
  applyColorCanonToSpec,
  buildColorConstraints,
  buildColorNegative,
  // MASK CANON COMPLIANCE exports
  isMaskMacro,
  MASK_CANON,
  assertMaskCanonCompliance,
  assertMaskBackground,
  assertCrimsonRatio,
  isNearBlack,
  isNearGofun,
};
