"use strict";

const fs = require("fs");
const path = require("path");
const { classifyTraits } = require("./trait_dominance_engine");
const {
  applyTraitDecayView,
  buildFailAnalytics,
  buildLaneLeaderboardArtifacts,
  buildPromotionDecisions,
} = require("./canon_v2_lifecycle");

const DEFAULT_TRAIT_REGISTRY_PATH = path.join(__dirname, "..", "memory", "canon_trait_registry.json");

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

function getCanonTraitRegistryPath() {
  return process.env.CANON_TRAIT_REGISTRY_PATH || DEFAULT_TRAIT_REGISTRY_PATH;
}

function readCanonTraitRegistry() {
  return readJsonSafe(getCanonTraitRegistryPath(), {
    version: "2.0.0",
    records: [],
  });
}

function normalizeGroup(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "_");
}

function buildLaneLeaderboards(records = []) {
  const leaderboards = buildLaneLeaderboardArtifacts(records);
  return {
    MASK_MACRO: leaderboards.MASK_MACRO.dominant_traits
      .concat(leaderboards.MASK_MACRO.supportive_traits, leaderboards.MASK_MACRO.provisional_supportive_traits, leaderboards.MASK_MACRO.blocked_traits)
      .slice(0, 10),
    ENTITY_MEDIUM: leaderboards.ENTITY_MEDIUM.dominant_traits
      .concat(leaderboards.ENTITY_MEDIUM.supportive_traits, leaderboards.ENTITY_MEDIUM.provisional_supportive_traits, leaderboards.ENTITY_MEDIUM.blocked_traits)
      .slice(0, 10),
    WEAPON_MACRO: leaderboards.WEAPON_MACRO.dominant_traits
      .concat(leaderboards.WEAPON_MACRO.supportive_traits, leaderboards.WEAPON_MACRO.provisional_supportive_traits, leaderboards.WEAPON_MACRO.blocked_traits)
      .slice(0, 10),
  };
}

function resolveCanonV2(context = {}) {
  const lane = normalizeLane(context.lane || context.shot_type || context.object_class);
  const registry = readCanonTraitRegistry();
  const decayView = applyTraitDecayView(Array.isArray(registry.records) ? registry.records : [], context.now_iso);
  const laneTraits = (Array.isArray(decayView.records) ? decayView.records : []).filter((record) => normalizeLane(record.lane) === lane);
  const classified = classifyTraits(laneTraits);
  const leaderboardsDetailed = buildLaneLeaderboardArtifacts(decayView.records || []);

  const output = {
    dominant_traits: classified.dominant,
    supportive_traits: classified.supportive,
    provisional_supportive: classified.provisional_supportive || [],
    blocked_traits: classified.blocked,
    readability_cues: [
      ...classified.dominant.filter((entry) => normalizeGroup(entry.group) === "readability_cues"),
      ...classified.supportive.filter((entry) => normalizeGroup(entry.group) === "readability_cues"),
      ...(classified.provisional_supportive || []).filter((entry) => normalizeGroup(entry.group) === "readability_cues"),
    ],
    negative_enforcements: [
      ...classified.dominant.filter((entry) => normalizeGroup(entry.group) === "anti-drift_negatives"),
      ...classified.supportive.filter((entry) => normalizeGroup(entry.group) === "anti-drift_negatives"),
      ...(classified.provisional_supportive || []).filter((entry) => normalizeGroup(entry.group) === "anti-drift_negatives"),
    ],
  };

  return {
    ...output,
    reused:
      output.dominant_traits.length > 0 ||
      output.supportive_traits.length > 0 ||
      output.provisional_supportive.length > 0 ||
      output.negative_enforcements.length > 0,
    source_keys: Array.from(new Set(laneTraits.flatMap((record) => record.identity_keys || [record.identity_key]).filter(Boolean))),
    lane,
    leaderboards: buildLaneLeaderboards(decayView.records || []),
    leaderboards_detailed: leaderboardsDetailed,
    fail_analytics: buildFailAnalytics(decayView.records || []),
    decay_report: decayView.decay_report || [],
    promotion_decisions: buildPromotionDecisions(decayView.records || []),
  };
}

module.exports = {
  DEFAULT_TRAIT_REGISTRY_PATH,
  buildLaneLeaderboards,
  getCanonTraitRegistryPath,
  readCanonTraitRegistry,
  resolveCanonV2,
};
