"use strict";

const { applyLaneRuleToIntake, getLaneRule, normalizeLaneShotType } = require("./lane_rules");

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

function hasCue(value, patterns) {
  const source = normalizeText(value).toLowerCase();
  return patterns.some((pattern) => pattern.test(source));
}

const MANUFACTURED_TYPE_PATTERNS = [
  /manufactured/,
  /object/,
  /product/,
  /device/,
  /tool/,
  /vessel/,
  /container/,
  /helmet/,
  /mask/,
  /artifact/,
  /prop/,
];

const ABSTRACT_PATTERNS = [
  /abstract/,
  /atmosphere/,
  /texture/,
  /surface only/,
  /mood board/,
  /light study/,
  /form study/,
  /shape study/,
];

const GENERIC_IDENTITY_PATTERNS = [
  /^object$/,
  /^thing$/,
  /^form$/,
  /^shape$/,
  /^surface$/,
  /^texture$/,
  /^material$/,
  /^atmosphere$/,
];

const CONTOUR_PATTERNS = [
  /edge/,
  /rim/,
  /bevel/,
  /seam/,
  /curvature/,
  /contour/,
  /outline/,
  /profile/,
];

const MATERIAL_SOLID_PATTERNS = [
  /ceramic/,
  /porcelain/,
  /b4c/,
  /boron carbide/,
  /engineered/,
  /technical/,
];

const MATERIAL_VAGUE_PATTERNS = [
  /^material$/,
  /^ceramic$/,
  /^white$/,
  /^matte$/,
  /^hard surface$/,
  /^composite$/,
];

const FORBIDDEN_MATERIAL_DRIFTS = [
  "plaster",
  "gypsum",
  "chalk",
  "concrete",
  "carved stone",
  "mineral banding",
  "rough rock",
  "glossy plastic",
  "PVC sheen",
  "toy-like finish",
];

const WEAPON_IDENTITY_PATTERNS = [
  /weapon/,
  /blade/,
  /sword/,
  /greatsword/,
  /zenith blade/,
];

const WEAPON_GEOMETRY_PATTERNS = [
  /blade/,
  /edge/,
  /straight/,
  /elongated/,
  /linear/,
  /sword geometry/,
  /greatsword/,
];

const WEAPON_FORBIDDEN_MATERIALS = [
  /ceramic/,
  /porcelain/,
  /plastic/,
  /mask/,
  /rounded/,
  /vessel/,
  /pod/,
  /capsule/,
  /sculpture/,
];

function normalizeIntake(intake) {
  const safe = intake && typeof intake === "object" ? applyLaneRuleToIntake(intake) : {};
  const subject = safe.subject && typeof safe.subject === "object" ? safe.subject : {};
  const material = safe.material && typeof safe.material === "object" ? safe.material : {};
  const composition = safe.composition && typeof safe.composition === "object" ? safe.composition : {};
  const lighting = safe.lighting && typeof safe.lighting === "object" ? safe.lighting : {};

  return {
    creative_intent: normalizeText(safe.creative_intent),
    subject: {
      type: normalizeText(subject.type),
      identity: normalizeText(subject.identity),
      must_have: dedupeStrings(subject.must_have),
      must_not_have: dedupeStrings(subject.must_not_have),
    },
    material: {
      primary: normalizeText(material.primary),
      surface: normalizeText(material.surface),
      finish: normalizeText(material.finish),
      forbidden_reads: dedupeStrings(material.forbidden_reads),
    },
    composition: {
      shot_type: normalizeText(composition.shot_type),
      framing: normalizeText(composition.framing),
      camera: normalizeText(composition.camera),
      background: normalizeText(composition.background),
    },
    lighting: {
      style: normalizeText(lighting.style),
      constraints: dedupeStrings(lighting.constraints),
    },
    core_risks: dedupeStrings(safe.core_risks),
    anti_drift_rules: dedupeStrings(safe.anti_drift_rules),
    success_criteria: dedupeStrings(safe.success_criteria),
    direction_summary: normalizeText(safe.direction_summary),
    lane_rule_applied: normalizeText(safe.lane_rule_applied),
    lane_required_anchors: dedupeStrings(safe.lane_required_anchors),
    lane_forbidden_anchors: dedupeStrings(safe.lane_forbidden_anchors),
    lane_priority_override_applied: safe.lane_priority_override_applied === true,
  };
}

function buildSuggestedRevision(intake) {
  const revised = cloneJson(intake);
  const laneRule = getLaneRule(revised.composition.shot_type || revised.lane_rule_applied);

  if (laneRule) {
    return applyLaneRuleToIntake(revised);
  }

  if (!hasCue(revised.subject.type, MANUFACTURED_TYPE_PATTERNS) || hasCue(revised.subject.type, ABSTRACT_PATTERNS)) {
    revised.subject.type = "manufactured_object";
  }

  if (!revised.subject.identity || GENERIC_IDENTITY_PATTERNS.some((pattern) => pattern.test(revised.subject.identity.toLowerCase()))) {
    revised.subject.identity = "engineered ceramic object";
  }

  revised.subject.must_have = dedupeStrings([
    ...toArray(revised.subject.must_have),
    "exactly one manufactured object as the clear subject",
    "visible edge, rim, bevel, seam, or contour evidence",
    "material visibly attached to the object",
  ]);

  revised.subject.must_not_have = dedupeStrings([
    ...toArray(revised.subject.must_not_have),
    "texture-only frame",
    "atmosphere-first image",
    "abstract-first composition",
    "subject dissolved into background",
  ]);

  if (!revised.material.primary || MATERIAL_VAGUE_PATTERNS.some((pattern) => pattern.test(revised.material.primary.toLowerCase()))) {
    revised.material.primary = "matte B4C technical ceramic";
  }
  if (!revised.material.surface) {
    revised.material.surface = "porcelain-white eggshell microtexture";
  }
  if (!revised.material.finish) {
    revised.material.finish = "dry matte engineered finish";
  }

  revised.material.forbidden_reads = dedupeStrings([
    ...toArray(revised.material.forbidden_reads),
    ...FORBIDDEN_MATERIAL_DRIFTS,
  ]);

  if (!revised.composition.shot_type) {
    revised.composition.shot_type = "macro product study";
  }
  if (!revised.composition.framing) {
    revised.composition.framing = "single dominant object with immediate readability";
  }
  if (!revised.composition.camera) {
    revised.composition.camera = "macro close-up with contour evidence";
  }
  if (!revised.composition.background) {
    revised.composition.background = "controlled minimal background";
  }

  if (!revised.lighting.style) {
    revised.lighting.style = "controlled low-key product lighting";
  }
  revised.lighting.constraints = dedupeStrings([
    ...toArray(revised.lighting.constraints),
    "no ambient color wash",
    "no neon spill",
    "no glossy hotspots",
  ]);

  revised.anti_drift_rules = dedupeStrings([
    ...toArray(revised.anti_drift_rules),
    "always preserve one clearly readable manufactured object",
    "do not allow abstract, texture-only, or atmosphere-first subject drift",
    "keep material identity explicit and stable",
  ]);

  revised.success_criteria = dedupeStrings([
    ...toArray(revised.success_criteria),
    "manufactured object read is immediate",
    "matte ceramic read is immediate",
    "image does not read as plaster, stone, or glossy plastic",
  ]);

  if (!revised.direction_summary) {
    revised.direction_summary = "Single manufactured ceramic object with immediate contour and material readability.";
  }

  return revised;
}

function runGeminiPrecheck(intake) {
  const normalized = normalizeIntake(intake);
  const revised = buildSuggestedRevision(normalized);
  const laneRule = getLaneRule(normalized.composition.shot_type || normalized.lane_rule_applied || normalized.shot_type);
  const issues = [];
  const fixes = [];
  let reject = false;
  let revise = false;
  let riskLevel = "LOW";

  const clearObjectType = laneRule
    ? hasCue(normalized.subject.type, WEAPON_IDENTITY_PATTERNS)
    : hasCue(normalized.subject.type, MANUFACTURED_TYPE_PATTERNS) &&
      !hasCue(normalized.subject.type, ABSTRACT_PATTERNS);
  const clearIdentity = laneRule
    ? hasCue(normalized.subject.identity, WEAPON_IDENTITY_PATTERNS)
    : !!normalized.subject.identity &&
      !GENERIC_IDENTITY_PATTERNS.some((pattern) => pattern.test(normalized.subject.identity.toLowerCase())) &&
      !hasCue(normalized.subject.identity, ABSTRACT_PATTERNS);

  if (!clearObjectType || !clearIdentity) {
    reject = true;
    riskLevel = "HIGH";
    issues.push(laneRule
      ? "WEAPON_IDENTITY_MISSING: intake does not define a sword-first weapon subject."
      : "Subject clarity failed: intake does not define one clear manufactured object.");
    fixes.push(laneRule
      ? "Set subject.type to weapon and subject.identity to a straight engineered greatsword or Zenith Blade."
      : "Set subject.type to a manufactured object class and name the exact object in subject.identity.");
  }

  const contourProtected = normalized.subject.must_have.some((entry) => hasCue(entry, laneRule ? WEAPON_GEOMETRY_PATTERNS : CONTOUR_PATTERNS));
  const compositionReady =
    !!normalized.composition.shot_type &&
    !!normalized.composition.framing &&
    !!normalized.composition.camera;
  if (!reject && (!contourProtected || !compositionReady)) {
    revise = true;
    if (riskLevel === "LOW") riskLevel = "MEDIUM";
    issues.push(laneRule
      ? "SWORD_GEOMETRY_MISSING: blade geometry or weapon framing is too weak."
      : "Manufactured object readability risk: contour evidence or camera/framing lock is too weak.");
    fixes.push(laneRule
      ? "Add blade geometry anchors, hard edge silhouette, and elongated linear framing before render."
      : "Add contour evidence to subject.must_have and lock composition to a readable single-object frame.");
  }

  const strongMaterialPrimary = laneRule
    ? !!normalized.material.primary &&
      !WEAPON_FORBIDDEN_MATERIALS.some((pattern) => pattern.test(normalized.material.primary.toLowerCase())) &&
      /steel|titanium|alloy|forged|metal/i.test(normalized.material.primary)
    : !!normalized.material.primary &&
      hasCue(normalized.material.primary, MATERIAL_SOLID_PATTERNS) &&
      !MATERIAL_VAGUE_PATTERNS.some((pattern) => pattern.test(normalized.material.primary.toLowerCase()));
  if (!strongMaterialPrimary || !normalized.material.surface || !normalized.material.finish) {
    revise = true;
    riskLevel = riskLevel === "HIGH" ? "HIGH" : "MEDIUM";
    issues.push(laneRule
      ? "FORBIDDEN_MATERIAL_DRIFT: weapon lane material is missing forged metal identity or is drifting toward ceramic/object ambiguity."
      : "Material clarity is too weak: primary, surface, or finish is missing or vague.");
    fixes.push(laneRule
      ? "Lock weapon lane material to forged steel, titanium, or dark industrial alloy and forbid ceramic drift."
      : "Lock material.primary, material.surface, and material.finish to a specific engineered matte ceramic read.");
  }

  const abstractIntent =
    hasCue(normalized.creative_intent, ABSTRACT_PATTERNS) ||
    hasCue(normalized.direction_summary, ABSTRACT_PATTERNS) ||
    normalized.subject.must_not_have.length === 0 ||
    normalized.anti_drift_rules.length === 0;
  if (abstractIntent) {
    revise = true;
    riskLevel = riskLevel === "HIGH" ? "HIGH" : "MEDIUM";
    issues.push(laneRule
      ? "ABSTRACT_OBJECT_DRIFT: weapon lane is not sufficiently locked to sword-first behavior."
      : "Abstract drift risk is elevated: intake does not sufficiently lock object-first behavior.");
    fixes.push(laneRule
      ? "Add sword-first anti-drift rules and ban abstract object, mask-like, rounded object, and ceramic reads."
      : "Add anti-drift rules and explicit bans on texture-only, atmosphere-first, and abstract-first outcomes.");
  }

  const mustHaveSet = new Set(normalized.subject.must_have.map((entry) => entry.toLowerCase()));
  const mustNotHaveSet = new Set(normalized.subject.must_not_have.map((entry) => entry.toLowerCase()));
  const directCanonConflict = [...mustHaveSet].filter((entry) => mustNotHaveSet.has(entry));
  const forbiddenPrimaryConflict = normalized.material.forbidden_reads.some((entry) =>
    normalized.material.primary && normalized.material.primary.toLowerCase().includes(entry.toLowerCase())
  );
  if (directCanonConflict.length > 0 || forbiddenPrimaryConflict) {
    if (directCanonConflict.length > 0) {
      reject = true;
      riskLevel = "HIGH";
      issues.push("Canon conflict is explicit: the same requirement appears in both must_have and must_not_have.");
      fixes.push("Remove direct contradictions between subject.must_have and subject.must_not_have.");
    } else {
      revise = true;
      riskLevel = riskLevel === "HIGH" ? "HIGH" : "MEDIUM";
      issues.push("Canon conflict risk: material.primary overlaps with forbidden reads.");
      fixes.push("Align material.primary with the allowed ceramic target and keep forbidden reads strictly negative.");
    }
  }

  const status = reject ? "REJECT" : revise ? "REVISE" : "PASS";
  return {
    pass: status === "PASS",
    status,
    issues,
    fixes,
    risk_level: riskLevel,
    revised_intake: revised,
    lane_rule_applied: laneRule ? normalizeLaneShotType(laneRule.lane) : null,
    lane_required_anchors: laneRule ? laneRule.required.slice() : [],
    lane_forbidden_anchors: laneRule ? laneRule.forbidden.slice() : [],
    lane_priority_override_applied: !!(laneRule && laneRule.priority_override),
  };
}

module.exports = {
  runGeminiPrecheck,
};
