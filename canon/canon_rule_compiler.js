"use strict";

const { queryCanonCases, readCanonCaseRegistry } = require("./canon_case_registry");

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

function buildPositiveRule(dimension, trait) {
  switch (dimension) {
    case "material":
      return `Preserve ${trait}`;
    case "identity":
      return `Preserve ${trait}`;
    case "silhouette":
      return `Maintain ${trait}`;
    case "composition":
      return `Enforce ${trait}`;
    default:
      return `Preserve ${trait}`;
  }
}

function buildNegativeRule(trait) {
  return `Reject ${trait}`;
}

function compileCanonPacket(context = {}, providedRecords) {
  try {
    const records = queryCanonCases(context, providedRecords || readCanonCaseRegistry());
    const positive_rules = [];
    const negative_rules = [];
    const positive_traits = {
      material: [],
      identity: [],
      silhouette: [],
      composition: [],
    };
    const negative_traits = [];
    const sources = new Set();
    const scopes = new Set();

    for (const record of records) {
      scopes.add(record.scope);
      for (const source of record.sources || []) sources.add(source);
      for (const [dimension, traits] of Object.entries(record.traits || {})) {
        for (const trait of traits || []) {
          positive_traits[dimension] = dedupeStrings([...(positive_traits[dimension] || []), trait]);
          positive_rules.push(buildPositiveRule(dimension, trait));
        }
      }
      for (const trait of record.negative_traits || []) {
        negative_traits.push(trait);
        negative_rules.push(buildNegativeRule(trait));
      }
    }

    const scope = scopes.has("lane") && scopes.has("cross-lane")
      ? "lane+cross-lane"
      : (scopes.has("lane") ? "lane" : "cross-lane");

    return {
      scope,
      positive_rules: dedupeStrings(positive_rules),
      negative_rules: dedupeStrings(negative_rules),
      source_count: sources.size,
      positive_traits: {
        material: dedupeStrings(positive_traits.material),
        identity: dedupeStrings(positive_traits.identity),
        silhouette: dedupeStrings(positive_traits.silhouette),
        composition: dedupeStrings(positive_traits.composition),
      },
      negative_traits: dedupeStrings(negative_traits),
    };
  } catch (_) {
    return {
      scope: "cross-lane",
      positive_rules: [],
      negative_rules: [],
      source_count: 0,
      positive_traits: {
        material: [],
        identity: [],
        silhouette: [],
        composition: [],
      },
      negative_traits: [],
    };
  }
}

function injectCompiledCanonPacket(spec = {}, packet = {}) {
  const next = { ...(spec || {}) };
  next.texture = dedupeStrings([
    ...((spec && spec.texture) || []),
    ...((packet.positive_traits && packet.positive_traits.material) || []),
    ...((packet.positive_traits && packet.positive_traits.identity) || []),
  ]);
  next.composition_rules = dedupeStrings([
    ...((spec && spec.composition_rules) || []),
    ...((packet.positive_traits && packet.positive_traits.silhouette) || []),
    ...((packet.positive_traits && packet.positive_traits.composition) || []),
    ...(packet.positive_rules || []),
  ]);
  next.negative_prompt = dedupeStrings([
    ...((spec && spec.negative_prompt) || []),
    ...(packet.negative_traits || []),
    ...(packet.negative_rules || []),
  ]);
  next.generalized_canon_packet = packet;
  return next;
}

module.exports = {
  compileCanonPacket,
  injectCompiledCanonPacket,
};
