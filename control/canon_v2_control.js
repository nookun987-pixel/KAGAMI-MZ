"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_CANON_PATHS = Object.freeze({
  canonMarkdown: process.env.MIKAGE_CANON_V2_MD || path.join(__dirname, "..", "MIKAGE_ZENITH_CANON_V2.md"),
  structuredRules: process.env.MIKAGE_STRUCTURED_RULES_JSON || path.join(__dirname, "..", "MIKAGE_STRUCTURED_RULES.json"),
  checklistMarkdown: process.env.MIKAGE_PASS_FAIL_CHECKLIST_MD || path.join(__dirname, "..", "MIKAGE_PASS_FAIL_CHECKLIST.md"),
});

function dedupeList(values) {
  const seen = new Set();
  const out = [];
  for (const value of values || []) {
    const cleaned = String(value || "").trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function normalizeBullet(line) {
  return String(line || "")
    .replace(/^[\s>*-]+/, "")
    .replace(/^[^\w#(]+/, "")
    .trim();
}

function parseChecklist(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const passItems = [];
  const failItems = [];
  const criticalTriggers = [];
  let mode = null;
  let inCritical = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^##\s+A\.\s+PASS IF/i.test(line)) {
      mode = "pass";
      inCritical = false;
      continue;
    }
    if (/^##\s+B\.\s+FAIL IF/i.test(line)) {
      mode = "fail";
      inCritical = false;
      continue;
    }
    if (/^##\s+CRITICAL REJECTION TRIGGERS/i.test(line)) {
      mode = null;
      inCritical = true;
      continue;
    }
    if (/^##\s+/i.test(line)) {
      mode = null;
      inCritical = false;
      continue;
    }
    if (/^###\s+/i.test(line)) continue;

    if (inCritical && line.startsWith("-")) {
      criticalTriggers.push(normalizeBullet(line));
      continue;
    }

    const normalized = normalizeBullet(line);
    if (!normalized) continue;

    if (mode === "pass" && /clean geometric|faceless white helmet|massive, oversized|porcelain white|chiaroscuro|physical consequences|silent, controlled|only 3 colors/i.test(normalized)) {
      passItems.push(normalized);
      continue;
    }
    if (mode === "pass" && !/^(Version|Status|Use|Last Updated|Authority|Usage Protocol)/i.test(normalized)) {
      passItems.push(normalized);
      continue;
    }
    if (mode === "fail" && !/^(Version|Status|Use|Last Updated|Authority|Usage Protocol)/i.test(normalized)) {
      failItems.push(normalized);
    }
  }

  return {
    passItems: dedupeList(passItems),
    failItems: dedupeList(failItems),
    criticalTriggers: dedupeList(criticalTriggers),
  };
}

function buildLockedSubject(rules) {
  const characterName = rules.character_name || "Mikage Zenith";
  const presence = rules.core_identity && rules.core_identity.presence ? rules.core_identity.presence : "Silent, disciplined, tragic";
  const body = rules.body || {};
  const head = rules.head || {};
  const armor = rules.armor || {};
  const weapon = rules.weapon || {};

  return [
    characterName,
    presence,
    body.silhouette,
    "slender female cyborg form, restrained feminine proportions, perfect symmetry",
    head.mask_type,
    head.mask_geometry,
    "void black optical sensors",
    head.hair_rule,
    armor.outer_shell,
    armor.inner_layer,
    armor.joint_material,
    `${weapon.name || "Zenith Blade"}, ${weapon.class || "heavy industrial straight sword"}`,
    weapon.geometry,
    weapon.curvature_rule,
  ].filter(Boolean).join(", ");
}

function buildCanonTexture(rules) {
  const armor = rules.armor || {};
  const weapon = rules.weapon || {};
  return dedupeList([
    armor.outer_shell,
    armor.inner_layer,
    armor.joint_material,
    armor.surface_finish,
    armor.crack_rule,
    armor.kintsugi_rule,
    armor.energy_rule,
    weapon.material,
    weapon.energy_detail,
  ]);
}

function buildCanonLighting(rules) {
  const lighting = rules.lighting || {};
  const environment = rules.environment || {};
  return dedupeList([
    lighting.style,
    lighting.contrast,
    lighting.shadow_rule,
    lighting.highlight_rule,
    environment.priority_rule,
    "motivated physical lighting only",
  ]);
}

function buildCanonComposition(rules, canonMarkdown) {
  const camera = rules.camera || {};
  const environment = rules.environment || {};
  const tone = [];
  if (/Silent discipline/i.test(canonMarkdown)) tone.push("silent discipline, tragic isolated atmosphere, authoritative restraint");
  return dedupeList([
    camera.framing,
    camera.distance,
    camera.composition,
    camera.negative_space_rule,
    environment.detail_density,
    `allowed environment only: ${(environment.allowed || []).join(", ")}`,
    `forbidden environment: ${(environment.forbidden || []).join(", ")}`,
    ...tone,
  ]);
}

function buildCanonNegative(rules, checklist) {
  const colors = rules.colors || {};
  const weapon = rules.weapon || {};
  return dedupeList([
    ...(rules.forbidden_global || []),
    ...((colors.forbidden || []).map((item) => `${item} on character`)),
    ...(weapon.forbidden_traits || []),
    ...(checklist.failItems || []),
    ...(checklist.criticalTriggers || []),
    "outside canon",
    "identity drift",
  ]);
}

function buildValidationMatchers() {
  return {
    required: [
      { label: "identity", test: /mikage zenith/i },
      { label: "mask", test: /faceless white cybernetic helmet|faceless white helmet/i },
      { label: "optics", test: /void black optical sensors|void black/i },
      { label: "hair", test: /long,?\s+straight,?\s+heavy black hair|long straight black hair/i },
      { label: "porcelain", test: /boron carbide|b4c|porcelain white/i },
      { label: "graphene", test: /graphene hex-grid|matte black graphene/i },
      { label: "weapon", test: /zenith blade|heavy industrial straight sword|straight sword/i },
      { label: "tone", test: /silent|disciplined|tragic/i },
    ],
    forbidden: [
      { label: "human face", test: /\bhuman face\b|\bface visible\b/i, critical: true },
      { label: "human eyes", test: /\bhuman eyes\b|\bpupils?\b|\biris\b/i, critical: true },
      { label: "animal ears", test: /\bfox ears?\b|\bcat ears?\b|\banimal ears?\b/i, critical: true },
      { label: "anime drift", test: /\banime\b|\bchibi\b|\bwaifu\b/i, critical: true },
      { label: "mecha bulk", test: /\bbulky mecha\b|\bmecha armor\b|\brobotic limbs\b/i, critical: true },
      { label: "external cables", test: /\bcables?\b|\bwires?\b|\btubes?\b|\bhoses?\b/i, critical: true },
      { label: "curved blade", test: /\bkatana\b|\bcurved sword\b|\bcurved blade\b/i, critical: true },
      { label: "laser blade", test: /\blaser blade\b|\bplasma blade\b|\bholographic blade\b/i, critical: false },
      { label: "forbidden armor color", test: /\bgreen armor\b|\borange armor\b|\byellow armor\b|\bcyan armor\b|\bteal armor\b/i, critical: true },
      { label: "rainbow colorway", test: /\brainbow\b|\bmulticolor glow\b/i, critical: false },
      { label: "magic effects", test: /\bmagic circles?\b|\bmagic aura\b|\bfantasy glow\b/i, critical: false },
    ],
  };
}

function loadCanonV2(paths = DEFAULT_CANON_PATHS) {
  const resolved = {
    canonMarkdown: path.resolve(paths.canonMarkdown),
    structuredRules: path.resolve(paths.structuredRules),
    checklistMarkdown: path.resolve(paths.checklistMarkdown),
  };

  for (const [key, filePath] of Object.entries(resolved)) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`[CANON_V2] Missing ${key} file: ${filePath}`);
    }
  }

  const canonMarkdown = fs.readFileSync(resolved.canonMarkdown, "utf-8");
  const structuredRules = JSON.parse(fs.readFileSync(resolved.structuredRules, "utf-8"));
  const checklistMarkdown = fs.readFileSync(resolved.checklistMarkdown, "utf-8");
  const checklist = parseChecklist(checklistMarkdown);

  return {
    paths: resolved,
    canonMarkdown,
    structuredRules,
    checklistMarkdown,
    checklist,
    lockedSubject: buildLockedSubject(structuredRules),
    canonTexture: buildCanonTexture(structuredRules),
    canonLighting: buildCanonLighting(structuredRules),
    canonComposition: buildCanonComposition(structuredRules, canonMarkdown),
    canonNegative: buildCanonNegative(structuredRules, checklist),
    matchers: buildValidationMatchers(),
    canonVersion: "v2",
    sourceVersion: structuredRules.canon_version || "2.0",
  };
}

function applyCanonV2ToSpec(spec, canon) {
  const nextSpec = Object.assign({}, spec || {});
  nextSpec.subject = canon.lockedSubject;
  nextSpec.texture = dedupeList([...(spec.texture || []), ...canon.canonTexture]);
  nextSpec.lighting = dedupeList([...(spec.lighting || []), ...canon.canonLighting]);
  nextSpec.composition_rules = dedupeList([...(spec.composition_rules || []), ...canon.canonComposition]);
  nextSpec.negative_prompt = dedupeList([...(spec.negative_prompt || []), ...canon.canonNegative]);
  return nextSpec;
}

function validateCanonText(text, canon, stage, options = {}) {
  const haystack = String(text || "");
  const passedChecks = [];
  const failedChecks = [];
  const forbiddenHits = [];
  const criticalFailures = [];
  const skipRequired = options.skipRequired === true;

  for (const matcher of canon.matchers.required) {
    if (skipRequired) continue;
    if (matcher.test.test(haystack)) passedChecks.push(matcher.label);
    else failedChecks.push(matcher.label);
  }

  for (const matcher of canon.matchers.forbidden) {
    if (matcher.test.test(haystack)) {
      forbiddenHits.push(matcher.label);
      if (matcher.critical) criticalFailures.push(matcher.label);
    }
  }

  const totalChecks = skipRequired ? 0 : canon.matchers.required.length;
  const passRatio = totalChecks === 0 ? 1 : passedChecks.length / totalChecks;
  const verdict = criticalFailures.length > 0 || forbiddenHits.length > 0 || failedChecks.length > 0 ? "REJECT" : "PASS";

  return {
    stage,
    verdict,
    pass_ratio: Number(passRatio.toFixed(3)),
    passed_checks: passedChecks,
    failed_checks: failedChecks,
    forbidden_hits: forbiddenHits,
    critical_failures: criticalFailures,
    canon_version: canon.canonVersion,
    source_version: canon.sourceVersion,
    source_files: canon.paths,
  };
}

function validateCanonJob(job, canon) {
  const text = JSON.stringify({
    identity: job.identity || {},
    narrative: job.narrative || {},
    strategy: job.strategy || {},
    art_direction: job.art_direction || {},
  });
  return validateCanonText(text, canon, "job_input", { skipRequired: true });
}

// ---------------------------------------------------------------------------
// VALID SHOT TYPES and safe default
// ---------------------------------------------------------------------------
const VALID_SHOT_TYPES = Object.freeze([
  "ENTITY_MEDIUM",
  "WEAPON_MACRO",
  "MASK_CLOSE",
  "CHARACTER_FULL",
  "ENVIRONMENT",
]);
const DEFAULT_SHOT_TYPE = "ENTITY_MEDIUM";

/**
 * Resolve shot_type from structured fields only — never from prompt text.
 * Priority: shotTypeOverride → job.shot_type → lockedPromptPackage.shot_type
 *           → spec.shot_type → spec.render_spec.shot_type → DEFAULT_SHOT_TYPE
 *
 * @param {Object|null} job
 * @param {Object|null} spec
 * @param {Object|null} lockedPromptPackage
 * @param {string|null} [shotTypeOverride]
 * @returns {string}
 */
function resolveShotType(job, spec, lockedPromptPackage, shotTypeOverride) {
  const candidates = [
    shotTypeOverride,
    job && job.shot_type,
    lockedPromptPackage && lockedPromptPackage.shot_type,
    spec && spec.shot_type,
    spec && spec.render_spec && spec.render_spec.shot_type,
  ];
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "string" && candidate.trim()) {
      const normalized = candidate.trim().toUpperCase();
      if (VALID_SHOT_TYPES.includes(normalized)) return normalized;
      // Accept any non-empty structured value (not validated against whitelist)
      return normalized;
    }
  }
  return DEFAULT_SHOT_TYPE;
}

function validateCanonPromptPackage(spec, positivePrompt, negativePrompt, canon, shotTypeOverride) {
  const positiveText = [
    spec && spec.subject ? spec.subject : "",
    ...(spec && Array.isArray(spec.texture) ? spec.texture : []),
    ...(spec && Array.isArray(spec.lighting) ? spec.lighting : []),
    ...(spec && Array.isArray(spec.composition_rules) ? spec.composition_rules : []),
    positivePrompt || "",
  ].join("\n");
  // IMPORTANT: shot_type MUST come from structured fields only, never from prompt text.
  // The || positivePrompt fallback was removed — it caused prompt text containing "blade"
  // or "ceramic" to be interpreted as a shot_type key, triggering WEAPON_MACRO mis-classification.
  const shotType = resolveShotType(null, spec, null, shotTypeOverride);
  let result;
  if (/WEAPON_MACRO|WEAPON|BLADE|GREATSWORD/.test(shotType)) {
    const weaponCoreText = [
      spec && spec.subject ? spec.subject : "",
      ...(spec && Array.isArray(spec.texture) ? spec.texture : []),
    ].join("\n");
    const required = [
      { label: "weapon_identity", test: /weapon|blade|sword|greatsword|zenith blade/i },
      { label: "sword_geometry", test: /straight engineered greatsword|visible sword geometry|blade planes|elongated linear form/i },
      { label: "forged_metal", test: /forged metal|steel|titanium|dark industrial alloy/i },
      { label: "hard_edges", test: /hard edge silhouette|blade-first|industrial precision/i },
    ];
    const forbidden = [
      { label: "ceramic", test: /\bceramic\b|\bporcelain\b/i, critical: true },
      { label: "plastic", test: /\bplastic\b|\bpvc\b/i, critical: true },
      { label: "rounded_object", test: /rounded industrial object/i, critical: true },
      { label: "mask_bias", test: /mask-like read|faceless white helmet|cybernetic helmet/i, critical: true },
      { label: "abstract_object", test: /abstract object read|sculpture ambiguity|vessel ambiguity|pod ambiguity|capsule ambiguity/i, critical: true },
    ];
    const passedChecks = [];
    const failedChecks = [];
    const forbiddenHits = [];
    const criticalFailures = [];
    for (const matcher of required) {
      if (matcher.test.test(positiveText)) passedChecks.push(matcher.label);
      else failedChecks.push(matcher.label);
    }
    for (const matcher of forbidden) {
      if (matcher.test.test(weaponCoreText)) {
        forbiddenHits.push(matcher.label);
        if (matcher.critical) criticalFailures.push(matcher.label);
      }
    }
    result = {
      stage: "prompt_package",
      verdict: criticalFailures.length > 0 || forbiddenHits.length > 0 || failedChecks.length > 0 ? "REJECT" : "PASS",
      pass_ratio: Number((passedChecks.length / required.length).toFixed(3)),
      passed_checks: passedChecks,
      failed_checks: failedChecks,
      forbidden_hits: forbiddenHits,
      critical_failures: criticalFailures,
      canon_version: canon.canonVersion,
      source_version: canon.sourceVersion,
      source_files: canon.paths,
    };
  } else {
    result = validateCanonText(positiveText, canon, "prompt_package");
  }
  result.negative_lock_count = dedupeList(String(negativePrompt || "").split(",")).length;
  return result;
}

module.exports = {
  DEFAULT_CANON_PATHS,
  VALID_SHOT_TYPES,
  DEFAULT_SHOT_TYPE,
  loadCanonV2,
  applyCanonV2ToSpec,
  validateCanonJob,
  validateCanonPromptPackage,
  resolveShotType,
};
