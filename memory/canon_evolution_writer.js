"use strict";

const fs = require("fs");
const path = require("path");
const { getCanonEvolutionRegistryPath } = require("./canon_evolution_resolver");
const { deriveApprovedIdentityKey, classifyApprovedObjectRecord } = require("./approved_object_memory");

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

function normalizeLane(value) {
  const lane = String(value || "").trim().toLowerCase();
  if (!lane) return "unknown";
  if (lane.includes("mask")) return "mask";
  if (lane.includes("weapon")) return "weapon";
  if (lane.includes("material")) return "material";
  return lane;
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

function extractEvolutionTraitBundle(objectSpec = {}, canonPacket = {}) {
  const mustHaveParts = Array.isArray(objectSpec.must_have_parts) ? objectSpec.must_have_parts : [];
  const silhouetteRules = objectSpec.silhouette_rules || {};
  const materialTruth = objectSpec.material_truth || {};
  const topology = objectSpec.topology || {};

  return {
    material: dedupeStrings([
      materialTruth.primary_material,
      materialTruth.surface_finish,
      materialTruth.texture_descriptor,
      ...((canonPacket.positive_traits && canonPacket.positive_traits.material) || []),
    ]),
    identity: dedupeStrings([
      objectSpec.readable_as,
      objectSpec.identity_core && objectSpec.identity_core.one_sentence,
      ...mustHaveParts
        .filter((part) => /sealed|symmetry|engineered|jaw|cheek/i.test(String(part.part_name || "") + " " + String(part.description || "")))
        .map((part) => part.description || part.part_name),
      ...((canonPacket.positive_traits && canonPacket.positive_traits.identity) || []),
    ]),
    silhouette: dedupeStrings([
      silhouetteRules.must_read_as,
      ...(silhouetteRules.key_contour_features || []),
      topology.symmetry,
      ...((canonPacket.positive_traits && canonPacket.positive_traits.silhouette) || []),
    ]),
    composition: dedupeStrings([
      ...(canonPacket.positive_traits && canonPacket.positive_traits.composition || []),
      "centered front artifact shot",
      "black void background",
    ]),
    negative_guards: dedupeStrings([
      "human face read",
      "visible eyes",
      "horn or ear extension",
      "creature or character read",
      "cosplay or wearable helmet read",
      "plastic or resin read",
      "halo ring frame object",
      "missing black void background",
    ]),
  };
}

function upsertCanonEvolutionRecord({ finalDecision, objectSpec, job = {}, canonPacket = {} }) {
  if (!finalDecision || finalDecision.decision !== "ALLOW") {
    return { wrote: false, path: getCanonEvolutionRegistryPath(), reason: "FINAL_DECISION_NOT_ALLOW" };
  }
  if (!objectSpec || typeof objectSpec !== "object") {
    return { wrote: false, path: getCanonEvolutionRegistryPath(), reason: "NO_OBJECT_SPEC" };
  }
  const classification = classifyApprovedObjectRecord(objectSpec);
  if (classification.bucket !== "KEEP") {
    return {
      wrote: false,
      path: getCanonEvolutionRegistryPath(),
      reason: `CANON_EVOLUTION_${classification.bucket}`,
      identity_key: classification.identity_key,
      source_keys: [],
    };
  }

  const targetPath = getCanonEvolutionRegistryPath();
  const registry = readJsonSafe(targetPath, {
    version: "1.0.0",
    records: [],
  });
  if (!Array.isArray(registry.records)) {
    registry.records = [];
  }

  const lane = normalizeLane(job.lane || job.shot_type || objectSpec.object_class);
  const identityKey = deriveApprovedIdentityKey(objectSpec);
  const traitBundle = extractEvolutionTraitBundle(objectSpec, canonPacket);
  const provenanceRecord = {
    run_id: finalDecision.job_id,
    job_id: finalDecision.job_id,
    timestamp: finalDecision.completed_at,
    source_object_identity: objectSpec.object_id || identityKey,
    confidence: finalDecision.gemini_pass_fail === "PASS" ? "high" : "unknown",
    reuse_level: "pass_verified",
  };

  let record = registry.records.find((entry) => entry && entry.identity_key === identityKey && normalizeLane(entry.lane) === lane);
  if (!record) {
    record = {
      lane,
      identity_key: identityKey,
      object_id: objectSpec.object_id || null,
      object_class: objectSpec.object_class || null,
      status: "active",
      trait_bundle: {
        material: [],
        identity: [],
        silhouette: [],
        composition: [],
        negative_guards: [],
      },
      provenance: [],
      promotion_count: 0,
      created_at: finalDecision.completed_at,
      last_promoted_at: finalDecision.completed_at,
    };
    registry.records.push(record);
  }

  const alreadyPromoted = (record.provenance || []).some((entry) => entry && entry.run_id === provenanceRecord.run_id);
  record.trait_bundle.material = dedupeStrings([...(record.trait_bundle.material || []), ...(traitBundle.material || [])]);
  record.trait_bundle.identity = dedupeStrings([...(record.trait_bundle.identity || []), ...(traitBundle.identity || [])]);
  record.trait_bundle.silhouette = dedupeStrings([...(record.trait_bundle.silhouette || []), ...(traitBundle.silhouette || [])]);
  record.trait_bundle.composition = dedupeStrings([...(record.trait_bundle.composition || []), ...(traitBundle.composition || [])]);
  record.trait_bundle.negative_guards = dedupeStrings([...(record.trait_bundle.negative_guards || []), ...(traitBundle.negative_guards || [])]);

  if (!alreadyPromoted) {
    record.provenance = [...(record.provenance || []), provenanceRecord];
    record.promotion_count = Number(record.promotion_count || 0) + 1;
  }
  record.last_promoted_at = finalDecision.completed_at;

  writeJson(targetPath, registry);
  return {
    wrote: true,
    target: "canon_evolution_registry",
    path: targetPath,
    identity_key: identityKey,
    action: alreadyPromoted ? "updated_idempotent" : "promoted",
    source_keys: [identityKey],
  };
}

module.exports = {
  extractEvolutionTraitBundle,
  upsertCanonEvolutionRecord,
};
