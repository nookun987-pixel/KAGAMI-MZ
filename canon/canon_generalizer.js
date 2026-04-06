"use strict";

const { storeCanonCases } = require("./canon_case_registry");

const DIMENSIONS = ["lane", "material", "identity", "silhouette", "composition", "reject_pattern"];

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = String(value || "").trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

function normalizeEvidence(input = {}) {
  const traits = input.traits || {};
  const lane = String(
    input.lane ||
    traits.lane ||
    input.scope_lane ||
    ""
  ).trim().toLowerCase() || "unknown";

  return {
    run_id: String(input.run_id || input.source || "").trim() || `RUN-${Date.now()}`,
    status: String(input.status || input.verdict || "approved").trim().toLowerCase(),
    lane,
    traits: {
      material: dedupeStrings(toArray(traits.material)),
      identity: dedupeStrings(toArray(traits.identity)),
      silhouette: dedupeStrings(toArray(traits.silhouette)),
      composition: dedupeStrings(toArray(traits.composition)),
    },
    reject_patterns: dedupeStrings(toArray(input.reject_patterns || traits.reject_pattern || traits.reject_patterns)),
    negative_traits: dedupeStrings(toArray(input.negative_traits)),
  };
}

function incrementCounter(map, key, source) {
  const lowerKey = String(key || "").trim().toLowerCase();
  if (!lowerKey) return;
  if (!map[lowerKey]) {
    map[lowerKey] = {
      trait: String(key).trim(),
      count: 0,
      sources: new Set(),
      lanes: new Set(),
    };
  }
  map[lowerKey].count += 1;
  if (source && source.run_id) map[lowerKey].sources.add(source.run_id);
  if (source && source.lane) map[lowerKey].lanes.add(source.lane);
}

function buildLaneRecord(lane, approved, rejected, index) {
  const dimensionCounters = {
    material: {},
    identity: {},
    silhouette: {},
    composition: {},
  };
  const negativeCounter = {};
  const sources = new Set();

  for (const evidence of approved) {
    sources.add(evidence.run_id);
    for (const dimension of Object.keys(dimensionCounters)) {
      for (const trait of evidence.traits[dimension] || []) {
        incrementCounter(dimensionCounters[dimension], trait, evidence);
      }
    }
  }

  for (const evidence of rejected) {
    sources.add(evidence.run_id);
    for (const trait of [...(evidence.reject_patterns || []), ...(evidence.negative_traits || [])]) {
      incrementCounter(negativeCounter, trait, evidence);
    }
  }

  const traits = {};
  for (const [dimension, counter] of Object.entries(dimensionCounters)) {
    traits[dimension] = Object.values(counter)
      .filter((entry) => entry.count >= 1)
      .sort((a, b) => b.count - a.count || a.trait.localeCompare(b.trait))
      .map((entry) => entry.trait);
  }

  const negative_traits = Object.values(negativeCounter)
    .filter((entry) => entry.count >= 2)
    .sort((a, b) => b.count - a.count || a.trait.localeCompare(b.trait))
    .map((entry) => entry.trait);

  return {
    canon_id: `CANON-GEN-LANE-${String(index).padStart(3, "0")}`,
    scope: "lane",
    lane,
    traits,
    negative_traits,
    reject_patterns: negative_traits,
    sources: [...sources],
    confidence: Number(Math.min(0.95, 0.55 + (approved.length * 0.08) + (negative_traits.length * 0.03)).toFixed(2)),
  };
}

function buildCrossLaneRecord(evidenceList, index) {
  const dimensionCounters = {
    material: {},
    identity: {},
    silhouette: {},
    composition: {},
  };
  const negativeCounter = {};
  const sources = new Set();

  for (const evidence of evidenceList.filter((item) => item.status === "approved")) {
    sources.add(evidence.run_id);
    for (const dimension of Object.keys(dimensionCounters)) {
      for (const trait of evidence.traits[dimension] || []) {
        incrementCounter(dimensionCounters[dimension], trait, evidence);
      }
    }
  }

  for (const evidence of evidenceList.filter((item) => item.status !== "approved")) {
    sources.add(evidence.run_id);
    for (const trait of [...(evidence.reject_patterns || []), ...(evidence.negative_traits || [])]) {
      incrementCounter(negativeCounter, trait, evidence);
    }
  }

  const traits = {};
  for (const [dimension, counter] of Object.entries(dimensionCounters)) {
    traits[dimension] = Object.values(counter)
      .filter((entry) => entry.sources.size >= 2 && entry.lanes.size >= 2)
      .sort((a, b) => b.sources.size - a.sources.size || a.trait.localeCompare(b.trait))
      .map((entry) => entry.trait);
  }

  const negative_traits = Object.values(negativeCounter)
    .filter((entry) => entry.sources.size >= 2)
    .sort((a, b) => b.sources.size - a.sources.size || a.trait.localeCompare(b.trait))
    .map((entry) => entry.trait);

  return {
    canon_id: `CANON-GEN-CROSS-${String(index).padStart(3, "0")}`,
    scope: "cross-lane",
    traits,
    negative_traits,
    reject_patterns: negative_traits,
    sources: [...sources],
    confidence: Number(Math.min(0.95, 0.6 + (negative_traits.length * 0.03) + (Object.values(traits).flat().length * 0.04)).toFixed(2)),
  };
}

function generalizeCanonEvidence(evidenceList = [], options = {}) {
  try {
    const normalized = evidenceList.map(normalizeEvidence);
    const byLane = new Map();

    for (const evidence of normalized) {
      if (!byLane.has(evidence.lane)) {
        byLane.set(evidence.lane, { approved: [], rejected: [] });
      }
      if (evidence.status === "approved" || evidence.status === "allow" || evidence.status === "pass") {
        byLane.get(evidence.lane).approved.push(evidence);
      } else {
        byLane.get(evidence.lane).rejected.push(evidence);
      }
    }

    let laneIndex = 1;
    const records = [];
    for (const [lane, grouped] of byLane.entries()) {
      records.push(buildLaneRecord(lane, grouped.approved, grouped.rejected, laneIndex));
      laneIndex += 1;
    }

    records.push(buildCrossLaneRecord(normalized, 1));

    if (options.persist !== false) {
      storeCanonCases(records);
    }

    return {
      ok: true,
      records,
      dimensions: DIMENSIONS,
    };
  } catch (error) {
    return {
      ok: false,
      records: [],
      dimensions: DIMENSIONS,
      reason: error.message,
    };
  }
}

module.exports = {
  DIMENSIONS,
  normalizeEvidence,
  generalizeCanonEvidence,
};
