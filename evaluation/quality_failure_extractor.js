"use strict";

const visualContract = require("../canon/MIKAGE_VISUAL_CONTRACT_V1.json");

const SUPPORTED_FAILURE_CODES = [
  "OBJECT_UNREADABLE",
  "ABSTRACT_COMPOSITION",
  "FUNCTIONAL_FORM_WEAK",
  "OBJECT_CENTRALITY_WEAK",
  "SYMBOLIC_FRAMING",
  "FASHION_COMPOSITION",
  "GENERIC_OBJECT",
  "WEAK_IDENTITY",
  "MATERIAL_TOO_CLEAN",
  "CG_PERFECTION",
  "PRODUCT_RENDER_LOOK",
  "DECORATIVE_FORM",
  "LIGHTWEIGHT_OBJECT",
  "SIGNATURE_DRIFT",
  "EDGE_TOO_CLEAN",
  "MATERIAL_UNIFORM",
  "FORM_INCONSISTENT",
  "COLOR_DRIFT",
  "TEXTURE_ONLY_FRAME",
  "CERAMIC_NOT_CONVINCING",
  "MATERIAL_PLASTIC",
  "MATERIAL_RESIN",
  "TOY_READ",
  "SURFACE_TOO_SMOOTH",
  "SILHOUETTE_NOISY",
  "CANON_DRIFT",
  "SILHOUETTE_BREAK",
  "COMPOSITION_COLLAPSE",
];

const SIGNAL_MAP = {
  unreadable_object: "OBJECT_UNREADABLE",
  object_unreadable: "OBJECT_UNREADABLE",
  subject_unclear: "OBJECT_UNREADABLE",
  unclear_object: "OBJECT_UNREADABLE",
  abstract_dominance: "ABSTRACT_COMPOSITION",
  abstract_composition: "ABSTRACT_COMPOSITION",
  symbolic_framing: "SYMBOLIC_FRAMING",
  non_literal_framing: "SYMBOLIC_FRAMING",
  fashion_composition: "FASHION_COMPOSITION",
  generic_object: "GENERIC_OBJECT",
  weak_identity: "WEAK_IDENTITY",
  material_too_clean: "MATERIAL_TOO_CLEAN",
  cg_perfection: "CG_PERFECTION",
  product_render_look: "PRODUCT_RENDER_LOOK",
  decorative_form: "DECORATIVE_FORM",
  lightweight_object: "LIGHTWEIGHT_OBJECT",
  signature_drift: "SIGNATURE_DRIFT",
  edge_too_clean: "EDGE_TOO_CLEAN",
  material_uniform: "MATERIAL_UNIFORM",
  form_inconsistent: "FORM_INCONSISTENT",
  color_drift: "COLOR_DRIFT",
  object_centrality_weak: "OBJECT_CENTRALITY_WEAK",
  functional_form_weak: "FUNCTIONAL_FORM_WEAK",
  texture_only_frame: "TEXTURE_ONLY_FRAME",
  ceramic_not_convincing: "CERAMIC_NOT_CONVINCING",
  material_read_fail: "CERAMIC_NOT_CONVINCING",
  material_fail: "CERAMIC_NOT_CONVINCING",
  material_plastic: "MATERIAL_PLASTIC",
  material_resin: "MATERIAL_RESIN",
  toy_read: "TOY_READ",
  fashion_read: "FASHION_COMPOSITION",
  silhouette_noisy: "SILHOUETTE_NOISY",
  edge_breakdown: "SILHOUETTE_NOISY",
  surface_too_smooth: "SURFACE_TOO_SMOOTH",
  neon_spill: "CANON_DRIFT",
  magenta_spill: "CANON_DRIFT",
  background_generic: "OBJECT_CENTRALITY_WEAK",
  canon_drift: "CANON_DRIFT",
  drift_fail: "CANON_DRIFT",
  canon_fail: "CANON_DRIFT",
  silhouette_break: "SILHOUETTE_BREAK",
  composition_collapse: "COMPOSITION_COLLAPSE",
};

const NOTE_PATTERNS = [
  { pattern: /abstract|texture[- ]first|atmospheric composition|conceptual frame|mood over subject|non-literal|symbolic/i, code: "ABSTRACT_COMPOSITION" },
  { pattern: /symbolic|non-literal|conceptual poster|art-poster/i, code: "SYMBOLIC_FRAMING" },
  { pattern: /subject unclear|unclear object|difficult to identify form|not clearly manufactured|object not clearly described/i, code: "OBJECT_UNREADABLE" },
  { pattern: /fragment|manufacturable read weak|shape logic weak|form logic weak|coherent manufacturable read missing/i, code: "FUNCTIONAL_FORM_WEAK" },
  { pattern: /subject does not dominate|background dominates|atmosphere dominates|semantic importance too low|environmental competition/i, code: "OBJECT_CENTRALITY_WEAK" },
  { pattern: /fashion composition|editorial fashion|fashion product/i, code: "FASHION_COMPOSITION" },
  { pattern: /generic object|generic render|generic 3d art|generic product/i, code: "GENERIC_OBJECT" },
  { pattern: /weak identity|could belong anywhere|not world specific|system identity weak/i, code: "WEAK_IDENTITY" },
  { pattern: /too clean|overly clean/i, code: "MATERIAL_TOO_CLEAN" },
  { pattern: /cg perfection|digitally perfect|perfect render/i, code: "CG_PERFECTION" },
  { pattern: /product render|catalog render|design showcase|behance render/i, code: "PRODUCT_RENDER_LOOK" },
  { pattern: /decorative geometry|ornamental curves|decorative form/i, code: "DECORATIVE_FORM" },
  { pattern: /lightweight|floating toy|accessory-like/i, code: "LIGHTWEIGHT_OBJECT" },
  { pattern: /signature drift|species drift|world drift/i, code: "SIGNATURE_DRIFT" },
  { pattern: /edge too clean|cad edge|perfectly sharp edge|plastic smooth edge/i, code: "EDGE_TOO_CLEAN" },
  { pattern: /uniform surface|material uniform|surface too uniform/i, code: "MATERIAL_UNIFORM" },
  { pattern: /form inconsistent|silhouette inconsistent|proportion drift/i, code: "FORM_INCONSISTENT" },
  { pattern: /color drift|palette drift|trendy color grading/i, code: "COLOR_DRIFT" },
  { pattern: /plastic/i, code: "MATERIAL_PLASTIC" },
  { pattern: /resin/i, code: "MATERIAL_RESIN" },
  { pattern: /toy/i, code: "TOY_READ" },
  { pattern: /too smooth|perfect smooth|cg surface/i, code: "SURFACE_TOO_SMOOTH" },
  { pattern: /noisy contour|edge readability absent|edge breakdown/i, code: "SILHOUETTE_NOISY" },
];

const CODE_RULE_MAP = {
  OBJECT_UNREADABLE: "OBJECT_READABILITY",
  ABSTRACT_COMPOSITION: "ABSTRACT_COMPOSITION",
  FUNCTIONAL_FORM_WEAK: "FUNCTIONAL_FORM",
  OBJECT_CENTRALITY_WEAK: "OBJECT_CENTRALITY",
  MATERIAL_PLASTIC: "MATERIAL_TRUTH",
  MATERIAL_RESIN: "MATERIAL_TRUTH",
  TOY_READ: "MATERIAL_TRUTH",
  CERAMIC_NOT_CONVINCING: "MATERIAL_TRUTH",
  SILHOUETTE_NOISY: "SILHOUETTE_LAW",
  SILHOUETTE_BREAK: "SILHOUETTE_LAW",
  SURFACE_TOO_SMOOTH: "SURFACE_STRUCTURE",
  CANON_DRIFT: "COLOR_LAW",
  FASHION_COMPOSITION: "BACKGROUND_LAW",
  GENERIC_OBJECT: "MIKAGE_IDENTITY_LOCK",
  WEAK_IDENTITY: "MIKAGE_IDENTITY_LOCK",
  MATERIAL_TOO_CLEAN: "MIKAGE_IDENTITY_LOCK",
  CG_PERFECTION: "MIKAGE_IDENTITY_LOCK",
  PRODUCT_RENDER_LOOK: "MIKAGE_IDENTITY_LOCK",
  DECORATIVE_FORM: "MIKAGE_IDENTITY_LOCK",
  LIGHTWEIGHT_OBJECT: "MIKAGE_IDENTITY_LOCK",
  SIGNATURE_DRIFT: "MIKAGE_SIGNATURE_LOCK",
  EDGE_TOO_CLEAN: "MIKAGE_SIGNATURE_LOCK",
  MATERIAL_UNIFORM: "MIKAGE_SIGNATURE_LOCK",
  FORM_INCONSISTENT: "MIKAGE_SIGNATURE_LOCK",
  COLOR_DRIFT: "MIKAGE_SIGNATURE_LOCK",
  SYMBOLIC_FRAMING: "ABSTRACT_COMPOSITION",
  TEXTURE_ONLY_FRAME: "ABSTRACT_COMPOSITION",
  COMPOSITION_COLLAPSE: "OBJECT_CENTRALITY",
};

function normalizeFailureCode(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  if (SUPPORTED_FAILURE_CODES.includes(raw)) {
    return raw;
  }

  const normalized = raw.toLowerCase().replace(/\s+/g, "_");
  return SIGNAL_MAP[normalized] || "";
}

function collectNoteCodes(judgeOutput = {}) {
  const status = String(judgeOutput.status || "").toUpperCase();
  const explicitFailures = Array.isArray(judgeOutput.failure_codes) ? judgeOutput.failure_codes.filter(Boolean) : [];
  if (status === "PASS" && explicitFailures.length === 0) {
    return [];
  }

  const notes = Array.isArray(judgeOutput.notes) ? judgeOutput.notes.join(" ") : String(judgeOutput.notes || "");
  if (!notes.trim()) {
    return [];
  }

  return NOTE_PATTERNS
    .filter(({ pattern }) => pattern.test(notes))
    .map(({ code }) => code);
}

function collectSignals(context = {}) {
  const judgeOutput = context.judgeOutput || {};
  const laneResult = context.laneResult || {};
  const validatorResult = context.validatorResult || laneResult.validator_result || {};

  return []
    .concat(judgeOutput.failure_codes || [])
    .concat(judgeOutput.failures || [])
    .concat(judgeOutput.signals || [])
    .concat(collectNoteCodes(judgeOutput))
    .concat(validatorResult.signals || [])
    .concat(validatorResult.issues || [])
    .filter(Boolean);
}

function inferRepairClass(failureCodes) {
  if (failureCodes.includes("CANON_DRIFT")) {
    return "canon";
  }

  if (failureCodes.length > 0) {
    return "quality";
  }

  return "";
}

function readScore(context = {}) {
  const judgeOutput = context.judgeOutput || {};
  const laneResult = context.laneResult || {};
  const validatorResult = context.validatorResult || laneResult.validator_result || {};

  const candidates = [
    judgeOutput.quality_score,
    judgeOutput.overall_score,
    validatorResult.quality_score,
    validatorResult.score,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
  }

  return 0;
}

function getPriorityOrder() {
  return Array.isArray(visualContract.PRIORITY_ORDER) ? visualContract.PRIORITY_ORDER : [];
}

function sortFailureCodes(failureCodes) {
  const priorities = getPriorityOrder();
  return [...failureCodes].sort((left, right) => {
    const leftRule = CODE_RULE_MAP[left] || "ZZZ";
    const rightRule = CODE_RULE_MAP[right] || "ZZZ";
    const leftIndex = priorities.indexOf(leftRule);
    const rightIndex = priorities.indexOf(rightRule);
    const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    if (safeLeft !== safeRight) {
      return safeLeft - safeRight;
    }
    return left.localeCompare(right);
  });
}

function derivePatchTargets(failureCodes) {
  const targets = new Set();
  for (const code of failureCodes) {
    if (["OBJECT_UNREADABLE", "FUNCTIONAL_FORM_WEAK"].includes(code)) targets.add("object_form");
    if (["ABSTRACT_COMPOSITION", "OBJECT_CENTRALITY_WEAK", "FASHION_COMPOSITION", "SYMBOLIC_FRAMING"].includes(code)) targets.add("subject_hierarchy");
    if (["CERAMIC_NOT_CONVINCING", "MATERIAL_PLASTIC", "MATERIAL_RESIN", "SURFACE_TOO_SMOOTH"].includes(code)) targets.add("material_read");
    if (["SILHOUETTE_NOISY", "SILHOUETTE_BREAK"].includes(code)) targets.add("silhouette");
    if (["GENERIC_OBJECT", "WEAK_IDENTITY", "MATERIAL_TOO_CLEAN", "CG_PERFECTION", "PRODUCT_RENDER_LOOK", "DECORATIVE_FORM", "LIGHTWEIGHT_OBJECT"].includes(code)) targets.add("identity_lock");
    if (["SIGNATURE_DRIFT", "FORM_INCONSISTENT"].includes(code)) targets.add("signature_form");
    if (["EDGE_TOO_CLEAN"].includes(code)) targets.add("edge_behavior");
    if (["MATERIAL_UNIFORM"].includes(code)) targets.add("material_fingerprint");
    if (["COLOR_DRIFT"].includes(code)) targets.add("color_identity");
  }
  return [...targets];
}

function extractQualityFailurePacket(context = {}) {
  const signals = collectSignals(context);
  const failureCodes = sortFailureCodes([...new Set(signals.map(normalizeFailureCode).filter(Boolean))]);
  const judgeOutput = context.judgeOutput || {};
  const validatorResult = context.validatorResult || context.laneResult && context.laneResult.validator_result || {};
  const score = readScore(context);
  const primaryFailureCodes = failureCodes.slice(0, 2);
  const secondaryFailureCodes = failureCodes.slice(2);

  return {
    supported_failure_codes: [...SUPPORTED_FAILURE_CODES],
    primary_failure_code: failureCodes[0] || "",
    failure_codes: failureCodes,
    primary_failure_codes: primaryFailureCodes,
    secondary_failure_codes: secondaryFailureCodes,
    repair_class: inferRepairClass(failureCodes),
    quality_score: score,
    score,
    judge_summary: {
      status: judgeOutput.status || "",
      notes: judgeOutput.notes || [],
      failure_codes: judgeOutput.failure_codes || [],
    },
    validator_summary: {
      passed: validatorResult.passed !== false,
      signals: validatorResult.signals || [],
      issues: validatorResult.issues || [],
    },
    contract_version: visualContract.contract_version || "MIKAGE_VISUAL_CONTRACT_V1",
    patch_targets: derivePatchTargets(primaryFailureCodes.concat(secondaryFailureCodes)),
  };
}

module.exports = {
  SUPPORTED_FAILURE_CODES,
  normalizeFailureCode,
  extractQualityFailurePacket,
  collectNoteCodes,
};
