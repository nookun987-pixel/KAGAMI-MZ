"use strict";

const { computeConsensusWeight } = require("./trait_consensus_engine");

function clamp01(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(1, numeric));
}

function computeRecencyWeight(record = {}) {
  const lastSeen = Date.parse(record.last_seen_at || record.updated_at || record.created_at || 0);
  if (!lastSeen) return 0;
  const ageMs = Math.max(0, Date.now() - lastSeen);
  const days = ageMs / (1000 * 60 * 60 * 24);
  return clamp01(1 - (days / 30));
}

function scoreTrait(record = {}, maxSupport = 1) {
  const metrics = record && record.metrics || {};
  const supportCount = Math.max(0, Number(metrics.support_count || record.support_count || 0));
  const successCount = Math.max(0, Number(metrics.success_total || record.success_count || 0));
  const conflictCount = Math.max(0, Number(metrics.conflict_count || record.conflict_count || 0));
  const frequencyNorm = clamp01(maxSupport > 0 ? supportCount / maxSupport : 0);
  const successAssociation = clamp01(supportCount > 0 ? successCount / supportCount : 0);
  const readabilitySupport = clamp01(supportCount > 0 ? Number(metrics.readability_total || record.readability_sum || 0) / supportCount : 0);
  const semanticCleanliness = clamp01(supportCount > 0 ? Number(metrics.semantic_total || record.semantic_clean_sum || 0) / supportCount : 0);
  const canonAlignment = clamp01(supportCount > 0 ? Number(metrics.canon_alignment_total || record.canon_alignment_sum || 0) / supportCount : 0);
  const recencyWeight = computeRecencyWeight(record);
  const consensusWeight = computeConsensusWeight(record);
  const conflictPenalty = clamp01(supportCount > 0 ? conflictCount / supportCount : 0);

  const finalScore =
    (0.20 * frequencyNorm) +
    (0.20 * successAssociation) +
    (0.15 * readabilitySupport) +
    (0.15 * semanticCleanliness) +
    (0.15 * canonAlignment) +
    (0.10 * recencyWeight) +
    (0.10 * consensusWeight) -
    (0.20 * conflictPenalty);

  return {
    final_score: Number(finalScore.toFixed(4)),
    metrics: {
      frequency_norm: Number(frequencyNorm.toFixed(4)),
      success_association: Number(successAssociation.toFixed(4)),
      readability_support: Number(readabilitySupport.toFixed(4)),
      semantic_cleanliness: Number(semanticCleanliness.toFixed(4)),
      canon_alignment: Number(canonAlignment.toFixed(4)),
      recency_weight: Number(recencyWeight.toFixed(4)),
      consensus_weight: Number(consensusWeight.toFixed(4)),
      conflict_penalty: Number(conflictPenalty.toFixed(4)),
    },
  };
}

module.exports = {
  scoreTrait,
};
