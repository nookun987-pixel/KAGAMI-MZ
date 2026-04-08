"use strict";

const { scoreTrait } = require("./trait_scorer");
const { MIN_DOMINANT_EVIDENCE } = require("./trait_dominance_engine");

const MAX_FAIL_ASSOC_RATE = Number(process.env.CANON_V2_MAX_FAIL_ASSOC_RATE || 0.34);
const MIN_DOMINANT_CONSISTENCY = Number(process.env.CANON_V2_MIN_DOMINANT_CONSISTENCY || 0.3);
const MIN_SUPPORTIVE_CONSISTENCY = Number(process.env.CANON_V2_MIN_SUPPORTIVE_CONSISTENCY || 0.15);
const BLOCK_CLEAR_EVIDENCE = Math.max(MIN_DOMINANT_EVIDENCE + 1, Number(process.env.CANON_V2_BLOCK_CLEAR_EVIDENCE || 5));
const STALE_SUPPORTIVE_RECENCY = Number(process.env.CANON_V2_STALE_SUPPORTIVE_RECENCY || 0.35);
const STALE_INACTIVE_RECENCY = Number(process.env.CANON_V2_STALE_INACTIVE_RECENCY || 0.12);

function normalizeLane(value) {
  const lane = String(value || "").trim().toLowerCase();
  if (!lane) return "unknown";
  if (lane.includes("mask")) return "mask";
  if (lane.includes("entity")) return "entity";
  if (lane.includes("weapon")) return "weapon";
  if (lane.includes("material")) return "material";
  return lane;
}

function clone(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getFailAssociationCounts(record = {}) {
  const fail = record.metrics && record.metrics.fail_associations || {};
  return {
    semantic: Number(fail.semantic || 0),
    readability: Number(fail.readability || 0),
    canon: Number(fail.canon || 0),
    gemini: Number(fail.gemini || 0),
  };
}

function getTotalFailAssociations(record = {}) {
  const fail = getFailAssociationCounts(record);
  return fail.semantic + fail.readability + fail.canon + fail.gemini;
}

function getFailAssociationRate(record = {}) {
  const supportCount = Math.max(1, Number(record.metrics && record.metrics.support_count || 0));
  return Number((getTotalFailAssociations(record) / supportCount).toFixed(4));
}

function ensureRecordMetrics(record = {}) {
  record.metrics = record.metrics || {};
  record.metrics.fail_associations = {
    semantic: Number(record.metrics.fail_associations && record.metrics.fail_associations.semantic || 0),
    readability: Number(record.metrics.fail_associations && record.metrics.fail_associations.readability || 0),
    canon: Number(record.metrics.fail_associations && record.metrics.fail_associations.canon || 0),
    gemini: Number(record.metrics.fail_associations && record.metrics.fail_associations.gemini || 0),
  };
  record.metrics.clean_reinforcement_count = Number(record.metrics.clean_reinforcement_count || 0);
  record.downgrade_history = Array.isArray(record.downgrade_history) ? record.downgrade_history : [];
  return record;
}

function appendDowngradeHistory(record, nextStatus, reason, timestamp) {
  const previous = record.status || "active";
  if (previous === nextStatus && !reason) return;
  record.downgrade_history = Array.isArray(record.downgrade_history) ? record.downgrade_history : [];
  record.downgrade_history.push({
    timestamp,
    from: previous,
    to: nextStatus,
    reason,
  });
}

function applyTraitDecayView(records = [], nowIso) {
  const now = nowIso || new Date().toISOString();
  const decayed = clone(records, []);
  const maxSupport = decayed.reduce((max, record) => Math.max(max, Number(record.metrics && record.metrics.support_count || 0)), 0) || 1;
  const decayReport = [];

  for (const record of decayed) {
    ensureRecordMetrics(record);
    const score = scoreTrait(record, maxSupport);
    const failRate = getFailAssociationRate(record);
    const recency = Number(score.metrics.recency_weight || 0);
    const supportCount = Number(record.metrics && record.metrics.support_count || 0);
    const consistency = Number(score.metrics.consensus_weight || 0);
    const previousStatus = record.status || "active";
    let status = previousStatus;
    let decayReason = null;

    if (previousStatus === "blocked") {
      if (
        record.metrics.clean_reinforcement_count >= BLOCK_CLEAR_EVIDENCE &&
        failRate <= (MAX_FAIL_ASSOC_RATE / 2) &&
        recency >= 0.65
      ) {
        status = "active";
        decayReason = "cleared_by_strong_clean_evidence";
      } else {
        status = "blocked";
      }
    } else if (failRate > MAX_FAIL_ASSOC_RATE) {
      status = "blocked";
      decayReason = "fail_association_threshold_exceeded";
    } else if (recency < STALE_INACTIVE_RECENCY && supportCount < MIN_DOMINANT_EVIDENCE) {
      status = "inactive";
      decayReason = "stale_inactive_decay";
    } else if (recency < STALE_SUPPORTIVE_RECENCY) {
      status = "stale";
      decayReason = "stale_supportive_decay";
    } else {
      status = "active";
    }

    if (status !== previousStatus && decayReason) {
      appendDowngradeHistory(record, status, decayReason, now);
    }
    record.status = status;
    record.metrics.final_score = score.final_score;
    record.metrics.last_scored_at = now;
    decayReport.push({
      lane: normalizeLane(record.lane),
      trait: record.trait,
      trait_signature: record.trait_signature,
      previous_status: previousStatus,
      status,
      recency_weight: recency,
      fail_association_rate: failRate,
      support_count: supportCount,
      decay_reason: decayReason,
    });
  }

  return {
    records: decayed,
    decay_report: decayReport,
  };
}

function buildFailAnalytics(records = []) {
  const analytics = {
    by_lane: {},
    totals: {
      semantic: 0,
      readability: 0,
      canon: 0,
      gemini: 0,
    },
  };

  for (const record of records) {
    const lane = normalizeLane(record.lane);
    if (!analytics.by_lane[lane]) {
      analytics.by_lane[lane] = {
        semantic: 0,
        readability: 0,
        canon: 0,
        gemini: 0,
        traits_with_fail_association: [],
      };
    }
    const fail = getFailAssociationCounts(record);
    analytics.by_lane[lane].semantic += fail.semantic;
    analytics.by_lane[lane].readability += fail.readability;
    analytics.by_lane[lane].canon += fail.canon;
    analytics.by_lane[lane].gemini += fail.gemini;
    analytics.totals.semantic += fail.semantic;
    analytics.totals.readability += fail.readability;
    analytics.totals.canon += fail.canon;
    analytics.totals.gemini += fail.gemini;
    if (getTotalFailAssociations(record) > 0) {
      analytics.by_lane[lane].traits_with_fail_association.push({
        trait: record.trait,
        trait_signature: record.trait_signature,
        status: record.status,
        fail_associations: fail,
        fail_association_rate: getFailAssociationRate(record),
      });
    }
  }

  return analytics;
}

function buildPromotionDecisions(records = []) {
  const maxSupport = records.reduce((max, record) => Math.max(max, Number(record.metrics && record.metrics.support_count || 0)), 0) || 1;
  return records.map((record) => {
    const score = scoreTrait(record, maxSupport);
    const supportCount = Number(record.metrics && record.metrics.support_count || 0);
    const failRate = getFailAssociationRate(record);
    const consistency = Number(score.metrics.consensus_weight || 0);
    let decision = "blocked";
    let reason = "score_below_threshold";

    if (record.status === "blocked") {
      decision = "blocked";
      reason = "blocked_trait_persistence";
    } else if (record.status === "inactive") {
      decision = "inactive";
      reason = "stale_trait_suppression";
    } else if (failRate > MAX_FAIL_ASSOC_RATE) {
      decision = "blocked";
      reason = "fail_association_threshold_exceeded";
    } else if (score.final_score >= 0.82 && supportCount >= MIN_DOMINANT_EVIDENCE && consistency >= MIN_DOMINANT_CONSISTENCY) {
      decision = "dominant";
      reason = "clean_evidence_threshold_met";
    } else if (score.final_score >= 0.62 && consistency >= MIN_SUPPORTIVE_CONSISTENCY) {
      decision = supportCount >= MIN_DOMINANT_EVIDENCE ? "supportive" : "provisional_supportive";
      reason = supportCount >= MIN_DOMINANT_EVIDENCE ? "supportive_threshold_met" : "low_evidence_provisional";
    } else if (record.status === "stale") {
      decision = "provisional_supportive";
      reason = "stale_decay";
    }

    return {
      lane: normalizeLane(record.lane),
      group: record.group,
      trait: record.trait,
      trait_signature: record.trait_signature,
      decision,
      reason,
      final_score: score.final_score,
      score_components: score.metrics,
      evidence_count: supportCount,
      fail_association_rate: failRate,
      last_promoted_time: record.last_promoted_at || record.last_seen_at || null,
      downgrade_history: record.downgrade_history || [],
    };
  });
}

function buildLaneLeaderboardArtifacts(records = []) {
  const decisions = buildPromotionDecisions(records);
  const lanes = {
    MASK_MACRO: "mask",
    ENTITY_MEDIUM: "entity",
    WEAPON_MACRO: "weapon",
  };
  const output = {};

  for (const [label, laneKey] of Object.entries(lanes)) {
    const laneDecisions = decisions.filter((entry) => normalizeLane(entry.lane) === laneKey);
    output[label] = {
      lane: label,
      generated_at: new Date().toISOString(),
      dominant_traits: laneDecisions.filter((entry) => entry.decision === "dominant"),
      supportive_traits: laneDecisions.filter((entry) => entry.decision === "supportive"),
      provisional_supportive_traits: laneDecisions.filter((entry) => entry.decision === "provisional_supportive"),
      blocked_traits: laneDecisions.filter((entry) => entry.decision === "blocked" || entry.decision === "inactive"),
    };
  }

  return output;
}

module.exports = {
  BLOCK_CLEAR_EVIDENCE,
  MAX_FAIL_ASSOC_RATE,
  MIN_DOMINANT_CONSISTENCY,
  MIN_SUPPORTIVE_CONSISTENCY,
  STALE_INACTIVE_RECENCY,
  STALE_SUPPORTIVE_RECENCY,
  applyTraitDecayView,
  buildFailAnalytics,
  buildLaneLeaderboardArtifacts,
  buildPromotionDecisions,
  ensureRecordMetrics,
  getFailAssociationCounts,
  getFailAssociationRate,
  getTotalFailAssociations,
  normalizeLane,
};
