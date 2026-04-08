"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_SOURCE_PATH = path.join(__dirname, "..", "memory", "design_reference_registry.json");
const DEFAULT_CLEANED_PATH = path.join(__dirname, "..", "memory", "design_reference_registry.cleaned.json");
const DEFAULT_QUARANTINE_PATH = path.join(__dirname, "..", "memory", "design_reference_registry.quarantine.json");

const CONTAMINATION_RULES = [
  { label: "kitsune", pattern: /\bkitsune\b/i },
  { label: "fox_ear", pattern: /\bfox\b|\bears?\b|\bear forms?\b|\bear tips?\b/i },
  { label: "horn", pattern: /\bhorns?\b/i },
  { label: "halo", pattern: /\bhalo\b|\bring\b|\bframe\b|\bborder\b/i },
  { label: "creature", pattern: /\bcreature\b|\banimal\b|\bdemon\b|\bmonster\b|\bfangs?\b/i },
  { label: "cosplay", pattern: /\bcosplay\b|\bhelmet\b|\bwearable\b/i },
  { label: "human_face_bias", pattern: /\bhuman face\b|\bflesh\b|\borganic\b/i },
  { label: "plastic_resin", pattern: /\bplastic\b|\bresin\b|\btoy\b|\bpvc\b/i },
  { label: "bad_background_drift", pattern: /\bbackground\b.*\babstract\b|\bambient\b|\benvironment clutter\b/i },
];

function normalizeText(value) {
  return String(value || "").trim();
}

function readJsonSafe(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

function getDesignReferencePaths() {
  return {
    sourcePath: process.env.DESIGN_REFERENCE_REGISTRY_PATH || DEFAULT_SOURCE_PATH,
    cleanedPath: process.env.DESIGN_REFERENCE_REGISTRY_CLEANED_PATH || DEFAULT_CLEANED_PATH,
    quarantinePath: process.env.DESIGN_REFERENCE_REGISTRY_QUARANTINE_PATH || DEFAULT_QUARANTINE_PATH,
  };
}

function collectReferenceText(reference = {}) {
  return normalizeText([
    reference.ref_id,
    reference.object_class,
    reference.cultural_origin,
    reference.canonical_name,
    ...(reference.key_features || []),
    ...(reference.material_tradition || []),
    ...(reference.silhouette_landmarks || []),
    ...(reference.common_ai_failures || []),
    reference.design_notes,
  ].filter(Boolean).join(" | "));
}

function classifyDesignReference(reference = {}) {
  const text = collectReferenceText(reference);
  const hits = CONTAMINATION_RULES.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
  let status = "live_safe";
  const reasons = [];

  if (!reference || !reference.ref_id || !reference.object_class) {
    status = "dead";
    reasons.push("malformed_reference");
  } else if (hits.length > 0) {
    status = "quarantine";
    reasons.push("contamination_detected");
  } else if (String(reference.object_class || "").toLowerCase() === "mask") {
    status = "historical_only";
    reasons.push("mask_reference_requires_explicit_live_promotion");
  }

  return {
    status,
    reasons,
    contamination_hits: hits,
  };
}

function sanitizeDesignReferenceRegistry(registry = {}) {
  const references = Array.isArray(registry.references) ? registry.references : [];
  const live_safe = [];
  const quarantine = [];
  const historical_only = [];
  const dead = [];

  for (const reference of references) {
    const classification = classifyDesignReference(reference);
    const entry = {
      ...reference,
      sanitation: classification,
    };
    if (classification.status === "live_safe") live_safe.push(entry);
    else if (classification.status === "historical_only") historical_only.push(entry);
    else if (classification.status === "quarantine") quarantine.push(entry);
    else dead.push(entry);
  }

  return {
    cleaned: {
      version: registry.version || "1.0.0",
      description: `${registry.description || ""} Sanitized live-safe references only.`.trim(),
      sanitized_at: new Date().toISOString(),
      sanitation_version: "v2",
      references: live_safe,
    },
    quarantine: {
      version: "1.0.0",
      sanitized_at: new Date().toISOString(),
      sanitation_version: "v2",
      historical_only,
      quarantined: quarantine,
      dead,
    },
  };
}

function persistSanitizedDesignReferences() {
  const paths = getDesignReferencePaths();
  const registry = readJsonSafe(paths.sourcePath, { version: "1.0.0", description: "", references: [] });
  const sanitized = sanitizeDesignReferenceRegistry(registry);
  writeJson(paths.cleanedPath, sanitized.cleaned);
  writeJson(paths.quarantinePath, sanitized.quarantine);
  return {
    ...sanitized,
    paths,
  };
}

function loadCleanedDesignReferences() {
  const paths = getDesignReferencePaths();
  const cleaned = readJsonSafe(paths.cleanedPath, null);
  if (cleaned && Array.isArray(cleaned.references)) {
    return cleaned;
  }
  return persistSanitizedDesignReferences().cleaned;
}

module.exports = {
  DEFAULT_SOURCE_PATH,
  DEFAULT_CLEANED_PATH,
  DEFAULT_QUARANTINE_PATH,
  getDesignReferencePaths,
  classifyDesignReference,
  sanitizeDesignReferenceRegistry,
  persistSanitizedDesignReferences,
  loadCleanedDesignReferences,
};
