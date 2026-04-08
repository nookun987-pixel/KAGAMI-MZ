"use strict";

const { deriveApprovedIdentityKey } = require("../memory/approved_object_memory");

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

function buildTraitGroups(objectSpec = {}, canonPacket = {}) {
  const materialTruth = objectSpec.material_truth || {};
  const silhouette = objectSpec.silhouette_rules || {};
  const topology = objectSpec.topology || {};
  const mustHaveParts = Array.isArray(objectSpec.must_have_parts) ? objectSpec.must_have_parts : [];
  const canonPositive = canonPacket.positive_traits || {};
  const canonNegative = canonPacket.negative_traits || [];

  return {
    silhouette: dedupeStrings([
      silhouette.must_read_as,
      ...(silhouette.key_contour_features || []),
      topology.symmetry,
      ...(canonPositive.silhouette || []),
    ]),
    material: dedupeStrings([
      materialTruth.primary_material,
      ...(canonPositive.material || []),
    ]),
    surface: dedupeStrings([
      materialTruth.surface_finish,
      materialTruth.texture_descriptor,
      ...(canonPositive.material || []).filter((trait) => /surface|texture|grain|shadow|edge/i.test(String(trait))),
    ]),
    "color discipline": dedupeStrings([
      materialTruth.surface_finish,
      ...(canonNegative || []).filter((trait) => /magenta|neon|bright/i.test(String(trait))),
    ]),
    background: dedupeStrings([
      ...(canonPositive.composition || []).filter((trait) => /background|void/i.test(String(trait))),
      ...(canonNegative || []).filter((trait) => /background/i.test(String(trait))),
    ]),
    composition: dedupeStrings([
      ...(canonPositive.composition || []),
    ]),
    "anti-drift negatives": dedupeStrings([
      ...(canonNegative || []),
    ]),
    "readability cues": dedupeStrings([
      ...mustHaveParts.map((part) => part.description || part.part_name),
      silhouette.must_read_as,
      objectSpec.readable_as,
      ...(canonPositive.identity || []),
    ]),
  };
}

function extractTraits(context = {}) {
  const objectSpec = context.objectSpec || {};
  const finalDecision = context.finalDecision || {};
  const postValidation = context.postValidation || {};
  const lane = normalizeLane(context.lane || objectSpec.object_class || context.job && context.job.lane);
  const identityKey = deriveApprovedIdentityKey(objectSpec);
  const groups = buildTraitGroups(objectSpec, context.canonPacket || {});
  const timestamp = finalDecision.completed_at || new Date().toISOString();

  const readabilitySupport = typeof finalDecision.object_readability_score === "number"
    ? Math.max(0, Math.min(1, finalDecision.object_readability_score / 100))
    : 1;
  const semanticCleanliness =
    finalDecision.semantic_vlm_executed === true
      ? (Array.isArray(finalDecision.semantic_reject_signals) && finalDecision.semantic_reject_signals.length === 0 ? 1 : 0)
      : 1;
  const canonAlignment =
    Array.isArray(finalDecision.canon_hard_failures) && finalDecision.canon_hard_failures.length === 0
      ? 1
      : 0;

  const traits = [];
  for (const [group, values] of Object.entries(groups)) {
    for (const trait of values || []) {
      const normalizedTrait = normalizeText(trait);
      if (!normalizedTrait) continue;
      traits.push({
        lane,
        group,
        trait: normalizedTrait,
        trait_signature: `${lane}::${group}::${normalizedTrait.toLowerCase()}`,
        identity_key: identityKey,
        evidence_key: `${lane}::${identityKey}::${group}::${normalizedTrait.toLowerCase()}`,
        run_id: finalDecision.job_id || context.run_id || null,
        job_id: finalDecision.job_id || context.job && context.job.job_id || null,
        timestamp,
        metrics: {
          success_association: finalDecision.decision === "ALLOW" ? 1 : 0,
          readability_support: readabilitySupport,
          semantic_cleanliness: semanticCleanliness,
          canon_alignment: canonAlignment,
          consensus_seed: 1,
        },
      });
    }
  }
  return traits;
}

module.exports = {
  extractTraits,
  buildTraitGroups,
};
