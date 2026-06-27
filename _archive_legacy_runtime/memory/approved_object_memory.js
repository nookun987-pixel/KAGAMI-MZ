"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_APPROVED_LIBRARY_PATH = path.join(__dirname, "approved_object_library.json");
const DEFAULT_APPROVED_AUDIT_PATH = path.join(__dirname, "approved_object_library.audit.json");
const DEFAULT_APPROVED_QUARANTINE_PATH = path.join(__dirname, "approved_object_library.quarantine.json");

const CONTAMINATION_PATTERNS = [
  { label: "kitsune", pattern: /\bkitsune\b/i },
  { label: "fox", pattern: /\bfox\b/i },
  { label: "animal_ear", pattern: /\banimal ears?\b|\bfox ears?\b|\bear tips?\b|\bear forms?\b/i },
  { label: "horn", pattern: /\bhorns?\b/i },
  { label: "creature_or_character", pattern: /\bcreature\b|\bmonster\b|\bcharacter\b|\bspirit archetype\b/i },
  { label: "wearable_cosplay_helmet", pattern: /\bhelmet\b|\bwearable\b|\bcosplay\b|\bface wearing a mask\b/i },
  { label: "human_face_likeness", pattern: /\bhuman face\b|\borganic facial\b/i },
  { label: "plastic_resin_toy", pattern: /\bplastic\b|\bresin\b|\btoy\b|\bpvc\b|\bvinyl\b/i },
  { label: "decorative_halo_frame_ring", pattern: /\bhalo\b|\bring\b|\bframe\b|\bborder\b/i },
];

const POSITIVE_PATTERNS = [
  { label: "manufactured_object", pattern: /\bmanufactured\b|\bartifact\b|\bengineered\b/i },
  { label: "technical_ceramic", pattern: /\btechnical ceramic\b|\bceramic\b|\bboron carbide\b|\bb4c\b/i },
  { label: "non_wearable", pattern: /\bnot worn\b|\bnot wearable\b|\bsingle isolated object\b/i },
  { label: "object_readability", pattern: /\breadable\b|\bclear central frame\b|\bfully readable\b/i },
];

function normalizeText(value) {
  return String(value || "").trim();
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = normalizeText(value);
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
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

function getApprovedMemoryPaths() {
  const libraryPath = process.env.APPROVED_OBJECT_LIBRARY_PATH || DEFAULT_APPROVED_LIBRARY_PATH;
  const baseDir = path.dirname(libraryPath);
  return {
    libraryPath,
    auditPath: process.env.APPROVED_OBJECT_LIBRARY_AUDIT_PATH || path.join(baseDir, "approved_object_library.audit.json"),
    quarantinePath:
      process.env.APPROVED_OBJECT_LIBRARY_QUARANTINE_PATH || path.join(baseDir, "approved_object_library.quarantine.json"),
  };
}

function deriveApprovedIdentityKey(record = {}) {
  const objectClass = normalizeText(record.object_class).toLowerCase();
  const name = normalizeText(record.identity_core && record.identity_core.name).toLowerCase();
  const readableAs = normalizeText(record.readable_as).toLowerCase();
  return [objectClass, name, readableAs].join("::");
}

function collectIdentityBearingText(record = {}) {
  const parts = [];
  parts.push(record.object_id);
  parts.push(record.object_class);
  parts.push(record.readable_as);
  if (record.identity_core) {
    parts.push(record.identity_core.name);
    parts.push(record.identity_core.origin);
    parts.push(record.identity_core.function);
  }
  if (record.topology) {
    parts.push(record.topology.primary_form);
    parts.push(record.topology.symmetry);
    parts.push(record.topology.orientation);
  }
  if (record.silhouette_rules) {
    parts.push(record.silhouette_rules.must_read_as);
    parts.push(...(record.silhouette_rules.key_contour_features || []));
  }
  parts.push(...(record.must_have_parts || []).map((part) => `${part.part_name} ${part.description || ""}`));
  if (record.material_truth) {
    parts.push(record.material_truth.primary_material);
    parts.push(record.material_truth.secondary_material);
    parts.push(record.material_truth.surface_finish);
    parts.push(record.material_truth.texture_descriptor);
  }
  return normalizeText(parts.filter(Boolean).join(" | "));
}

function classifyApprovedObjectRecord(record = {}) {
  const identityText = collectIdentityBearingText(record);
  const recordText = normalizeText([
    identityText,
    ...(record.anti_misread_rules || []).map((item) => item && item.rule),
  ].filter(Boolean).join(" | "));
  const contaminationHits = CONTAMINATION_PATTERNS.filter(({ pattern }) => pattern.test(identityText)).map(({ label }) => label);
  const positiveEvidence = POSITIVE_PATTERNS.filter(({ pattern }) => pattern.test(recordText)).map(({ label }) => label);
  const hasPositiveCore = positiveEvidence.includes("manufactured_object") && positiveEvidence.includes("technical_ceramic");

  let bucket = "KEEP";
  const reasons = [];
  if (!record || typeof record !== "object" || !record.object_class || !record.object_id) {
    bucket = "REMOVE";
    reasons.push("malformed_record");
  } else if (contaminationHits.length > 0) {
    bucket = "QUARANTINE";
    reasons.push("canon_contamination_detected");
  } else if (!hasPositiveCore) {
    bucket = "QUARANTINE";
    reasons.push("insufficient_canon_positive_evidence");
  }

  return {
    bucket,
    reasons: dedupeStrings(reasons),
    contamination_hits: dedupeStrings(contaminationHits),
    positive_evidence: dedupeStrings(positiveEvidence),
    identity_key: deriveApprovedIdentityKey(record),
    active_for_live_reuse: bucket === "KEEP",
  };
}

function sanitizeApprovedObjectLibrary(library = {}) {
  const sourceObjects = Array.isArray(library.objects) ? library.objects : [];
  const kept = [];
  const quarantined = [];
  const removed = [];

  for (const record of sourceObjects) {
    const classification = classifyApprovedObjectRecord(record);
    const enriched = {
      ...record,
      approved_memory_status: classification.bucket === "KEEP" ? "active" : "quarantined",
      sanitized_for_live_reuse: classification.bucket === "KEEP",
      sanitation: classification,
    };
    if (classification.bucket === "KEEP") {
      kept.push(enriched);
    } else if (classification.bucket === "QUARANTINE") {
      quarantined.push(enriched);
    } else {
      removed.push(enriched);
    }
  }

  return {
    cleanedLibrary: {
      version: library.version || "1.0.0",
      description: library.description || "Approved object definitions that have passed the readability gate. These are locked specs ready for render.",
      sanitized_at: new Date().toISOString(),
      sanitation_version: "v1",
      objects: kept,
    },
    quarantinePayload: {
      version: "1.0.0",
      quarantined_at: new Date().toISOString(),
      sanitation_version: "v1",
      objects: quarantined,
    },
    auditPayload: {
      version: "1.0.0",
      audited_at: new Date().toISOString(),
      sanitation_version: "v1",
      summary: {
        kept: kept.length,
        quarantined: quarantined.length,
        removed: removed.length,
      },
      records: sourceObjects.map((record) => ({
        object_id: record.object_id || null,
        identity_key: deriveApprovedIdentityKey(record),
        classification: classifyApprovedObjectRecord(record),
      })),
    },
  };
}

function persistApprovedLibrarySanitation() {
  const { libraryPath, auditPath, quarantinePath } = getApprovedMemoryPaths();
  const library = readJsonSafe(libraryPath, { version: "1.0.0", description: "", objects: [] });
  const sanitized = sanitizeApprovedObjectLibrary(library);
  writeJson(libraryPath, sanitized.cleanedLibrary);
  writeJson(auditPath, sanitized.auditPayload);
  writeJson(quarantinePath, sanitized.quarantinePayload);
  return {
    ...sanitized,
    paths: {
      libraryPath,
      auditPath,
      quarantinePath,
    },
  };
}

function loadSafeApprovedLibrary() {
  const { libraryPath } = getApprovedMemoryPaths();
  const library = readJsonSafe(libraryPath, { version: "1.0.0", description: "", objects: [] });
  const sanitized = sanitizeApprovedObjectLibrary(library);
  return {
    library: sanitized.cleanedLibrary,
    safeObjects: sanitized.cleanedLibrary.objects,
    quarantineCount: sanitized.quarantinePayload.objects.length,
    removedCount: sanitized.auditPayload.summary.removed,
    memory_sanitation_applied: true,
  };
}

module.exports = {
  DEFAULT_APPROVED_LIBRARY_PATH,
  DEFAULT_APPROVED_AUDIT_PATH,
  DEFAULT_APPROVED_QUARANTINE_PATH,
  getApprovedMemoryPaths,
  deriveApprovedIdentityKey,
  classifyApprovedObjectRecord,
  sanitizeApprovedObjectLibrary,
  persistApprovedLibrarySanitation,
  loadSafeApprovedLibrary,
};
