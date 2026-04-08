"use strict";

const { scoreTrait } = require("./trait_scorer");
const MIN_DOMINANT_EVIDENCE = Math.max(2, Number(process.env.CANON_V2_MIN_DOMINANT_EVIDENCE || 3));
const MIN_DOMINANT_CONSISTENCY = Number(process.env.CANON_V2_MIN_DOMINANT_CONSISTENCY || 0.3);
const MIN_SUPPORTIVE_CONSISTENCY = Number(process.env.CANON_V2_MIN_SUPPORTIVE_CONSISTENCY || 0.15);
const MAX_FAIL_ASSOC_RATE = Number(process.env.CANON_V2_MAX_FAIL_ASSOC_RATE || 0.34);

function normalizeText(value) {
  return String(value || "").trim();
}

function classifyTraits(records = []) {
  const maxSupport = records.reduce((max, record) => {
    const metrics = record && record.metrics || {};
    return Math.max(max, Number(metrics.support_count || record.support_count || 0));
  }, 0) || 1;
  const dominant = [];
  const supportive = [];
  const provisional_supportive = [];
  const blocked = [];

  for (const record of records) {
    const score = scoreTrait(record, maxSupport);
    const metrics = record && record.metrics || {};
    const failAssociations = metrics.fail_associations || {};
    const failAssociationTotal =
      Number(failAssociations.semantic || 0) +
      Number(failAssociations.readability || 0) +
      Number(failAssociations.canon || 0) +
      Number(failAssociations.gemini || 0);
    const failAssociationRate = Number((failAssociationTotal / Math.max(1, Number(metrics.support_count || record.support_count || 0))).toFixed(4));
    const traitEntry = {
      group: record.group,
      trait: record.trait,
      final_score: score.final_score,
      score_breakdown: score.metrics,
      support_count: Number(metrics.support_count || record.support_count || 0),
      identity_keys: Array.isArray(record.identity_keys) ? record.identity_keys : [record.identity_key].filter(Boolean),
      last_promoted_time: record.last_promoted_at || record.last_seen_at || null,
      downgrade_history: Array.isArray(record.downgrade_history) ? record.downgrade_history : [],
      fail_association_rate: failAssociationRate,
    };

    const contaminated =
      record.blocked === true ||
      record.status === "blocked" ||
      record.status === "inactive" ||
      Array.isArray(record.block_reasons) && record.block_reasons.length > 0;
    const supportCount = Number(metrics.support_count || record.support_count || 0);
    const enoughEvidence = supportCount >= MIN_DOMINANT_EVIDENCE;
    if (contaminated || failAssociationRate > MAX_FAIL_ASSOC_RATE || score.metrics.conflict_penalty > 0.4 || score.metrics.canon_alignment < 0.5) {
      blocked.push({
        ...traitEntry,
        block_reasons: record.block_reasons || [
          failAssociationRate > MAX_FAIL_ASSOC_RATE ? "fail_association_threshold_exceeded" : "conflict_heavy_or_contaminated",
        ],
      });
      continue;
    }

    if (score.final_score >= 0.82 && enoughEvidence && score.metrics.consensus_weight >= MIN_DOMINANT_CONSISTENCY) {
      dominant.push(traitEntry);
    } else if (score.final_score >= 0.62 && score.metrics.consensus_weight >= MIN_SUPPORTIVE_CONSISTENCY) {
      if (supportCount < MIN_DOMINANT_EVIDENCE) {
        provisional_supportive.push({
          ...traitEntry,
          provisional: true,
          provisional_reason: `support_count_below_min_clean_evidence_${MIN_DOMINANT_EVIDENCE}`,
        });
      } else {
        supportive.push(traitEntry);
      }
    } else {
      blocked.push({
        ...traitEntry,
        block_reasons: ["score_below_supportive_threshold"],
      });
    }
  }

  return {
    dominant,
    supportive,
    provisional_supportive,
    blocked,
  };
}

function flattenTraits(entries = []) {
  return entries.map((entry) => normalizeText(entry.trait)).filter(Boolean);
}

module.exports = {
  MAX_FAIL_ASSOC_RATE,
  MIN_DOMINANT_CONSISTENCY,
  MIN_DOMINANT_EVIDENCE,
  MIN_SUPPORTIVE_CONSISTENCY,
  classifyTraits,
  flattenTraits,
};
