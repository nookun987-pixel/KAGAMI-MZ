"use strict";

const fs = require("fs");
const path = require("path");

const COLOR_CANON_PATH = path.join(__dirname, "mikage_color_canon.json");

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
  const colorBlock = [
    "COLOR",
    ...colorConstraints,
  ].join("\n");

  safe.structured_prompt = dedupeStrings([
    normalizeText(safe.structured_prompt),
    colorBlock,
  ]).join("\n\n");
  safe.negative_prompt = dedupeStrings([
    ...String(safe.negative_prompt || "").split(",").map((item) => item.trim()),
    ...colorNegative,
  ]).join(", ");
  safe.positivePrompt = normalizeText(safe.positivePrompt) || safe.structured_prompt;
  safe.negativePrompt = normalizeText(safe.negativePrompt) || safe.negative_prompt;

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
  return safe;
}

module.exports = {
  applyColorCanonToIntake,
  applyColorCanonToSpec,
  buildColorConstraints,
  buildColorNegative,
};
