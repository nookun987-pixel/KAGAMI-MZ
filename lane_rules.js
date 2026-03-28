"use strict";

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

function normalizeLaneShotType(value) {
  const raw = normalizeText(value).toUpperCase();
  if (["MATERIAL_MACRO", "MASK_MACRO", "ENTITY_MEDIUM", "WEAPON_MACRO", "ENVIRONMENT_WIDE"].includes(raw)) {
    return raw;
  }
  if (/weapon|blade|sword/i.test(raw)) return "WEAPON_MACRO";
  if (/mask/i.test(raw)) return "MASK_MACRO";
  if (/material/i.test(raw)) return "MATERIAL_MACRO";
  if (/environment|wide/i.test(raw)) return "ENVIRONMENT_WIDE";
  return "ENTITY_MEDIUM";
}

const WEAPON_MACRO_RULE = Object.freeze({
  lane: "WEAPON_MACRO",
  required: [
    "weapon",
    "blade",
    "straight engineered greatsword",
    "forged metal read",
    "titanium / steel / dark industrial alloy",
    "hard edge silhouette",
    "elongated linear form",
    "visible sword geometry",
  ],
  forbidden: [
    "ceramic",
    "porcelain",
    "plastic",
    "rounded industrial object",
    "mask-like read",
    "abstract object read",
    "vessel ambiguity",
    "pod ambiguity",
    "capsule ambiguity",
    "sculpture ambiguity",
  ],
  priority_override: true,
  subject_type: "weapon",
  subject_identity: "Zenith Blade, straight engineered greatsword",
  material_primary: "forged steel / titanium / dark industrial alloy",
  material_surface: "dark industrial alloy blade with hard forged planes",
  material_finish: "dry forged metal finish with precise hard edges",
  composition: {
    shot_type: "WEAPON_MACRO",
    framing: "macro weapon study with clear blade-first silhouette",
    camera: "macro close-up preserving elongated linear sword geometry and hard edge read",
    background: "dark minimal industrial backdrop",
  },
  lighting: {
    style: "hard directional industrial macro lighting",
    constraints: [
      "sword first, material second",
      "no ceramic drift",
      "no rounded object ambiguity",
      "no mask-like silhouette",
    ],
  },
  core_risks: [
    "WEAPON_IDENTITY_MISSING",
    "SWORD_GEOMETRY_MISSING",
    "FORBIDDEN_MATERIAL_DRIFT",
    "ABSTRACT_OBJECT_DRIFT",
  ],
  anti_drift_rules: [
    "weapon lane wins over ceramic or mask bias",
    "subject must read as sword first and material second",
    "do not allow ceramic, porcelain, plastic, or rounded industrial object drift",
    "keep blade geometry elongated, straight, and engineered",
  ],
  success_criteria: [
    "image reads immediately as a straight engineered greatsword",
    "blade geometry is explicit and not abstract",
    "material reads as forged metal, steel, titanium, or dark industrial alloy",
  ],
});

function getLaneRule(shotType) {
  const normalized = normalizeLaneShotType(shotType);
  if (normalized === "WEAPON_MACRO") return WEAPON_MACRO_RULE;
  return null;
}

function applyLaneRuleToIntake(intake) {
  const safe = cloneJson(intake);
  const composition = safe.composition && typeof safe.composition === "object" ? safe.composition : {};
  const rule = getLaneRule(composition.shot_type || safe.shot_type);
  if (!rule) return safe;

  safe.subject = safe.subject && typeof safe.subject === "object" ? safe.subject : {};
  safe.material = safe.material && typeof safe.material === "object" ? safe.material : {};
  safe.composition = composition;
  safe.lighting = safe.lighting && typeof safe.lighting === "object" ? safe.lighting : {};

  safe.composition.shot_type = rule.composition.shot_type;
  safe.subject.type = rule.subject_type;

  const identity = normalizeText(safe.subject.identity);
  if (!identity || /ceramic|porcelain|mask|object|artifact|vessel|pod|capsule|sculpture/i.test(identity)) {
    safe.subject.identity = rule.subject_identity;
  }

  safe.subject.must_have = dedupeStrings([
    ...toArray(safe.subject.must_have),
    ...rule.required,
  ]);
  safe.subject.must_not_have = dedupeStrings([
    ...toArray(safe.subject.must_not_have),
    ...rule.forbidden,
  ]);

  const materialPrimary = normalizeText(safe.material.primary);
  if (!materialPrimary || /ceramic|porcelain|plastic|rounded|mask/i.test(materialPrimary)) {
    safe.material.primary = rule.material_primary;
  }
  if (!normalizeText(safe.material.surface) || /ceramic|porcelain|plastic|rounded/i.test(safe.material.surface)) {
    safe.material.surface = rule.material_surface;
  }
  if (!normalizeText(safe.material.finish) || /ceramic|porcelain|plastic|rounded/i.test(safe.material.finish)) {
    safe.material.finish = rule.material_finish;
  }
  safe.material.forbidden_reads = dedupeStrings([
    ...toArray(safe.material.forbidden_reads),
    ...rule.forbidden,
  ]);

  safe.composition.framing = normalizeText(safe.composition.framing) || rule.composition.framing;
  safe.composition.camera = normalizeText(safe.composition.camera) || rule.composition.camera;
  safe.composition.background = normalizeText(safe.composition.background) || rule.composition.background;

  safe.lighting.style = normalizeText(safe.lighting.style) || rule.lighting.style;
  safe.lighting.constraints = dedupeStrings([
    ...toArray(safe.lighting.constraints),
    ...rule.lighting.constraints,
  ]);

  safe.core_risks = dedupeStrings([
    ...toArray(safe.core_risks),
    ...rule.core_risks,
  ]);
  safe.anti_drift_rules = dedupeStrings([
    ...toArray(safe.anti_drift_rules),
    ...rule.anti_drift_rules,
  ]);
  safe.success_criteria = dedupeStrings([
    ...toArray(safe.success_criteria),
    ...rule.success_criteria,
  ]);

  if (!normalizeText(safe.creative_intent) || /ceramic|porcelain/i.test(safe.creative_intent)) {
    safe.creative_intent = "Weapon macro study with sword-first identity and forged metal geometry priority.";
  }
  if (!normalizeText(safe.direction_summary) || /ceramic|porcelain|mask|object ambiguity/i.test(safe.direction_summary)) {
    safe.direction_summary = "Zenith Blade macro, sword-first, straight engineered greatsword, forged dark industrial alloy, no ceramic drift.";
  }

  safe.lane_rule_applied = rule.lane;
  safe.lane_required_anchors = rule.required.slice();
  safe.lane_forbidden_anchors = rule.forbidden.slice();
  safe.lane_priority_override_applied = rule.priority_override === true;
  return safe;
}

module.exports = {
  WEAPON_MACRO_RULE,
  normalizeLaneShotType,
  getLaneRule,
  applyLaneRuleToIntake,
};
