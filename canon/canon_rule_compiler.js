"use strict";

const { queryCanonCases, readCanonCaseRegistry } = require("./canon_case_registry");
const { resolveCanonV2 } = require("../canon_evolution/canon_v2_resolver");

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

function normalizeContextLane(context = {}) {
  const lane = String(context.lane || context.shot_type || "").trim().toLowerCase();
  if (lane.includes("mask")) return "mask";
  return lane || "unknown";
}

function applyMaskCanonDefaults(packet = {}) {
  const positiveMaterialTraits = [
    "matte black technical ceramic",
    "boron carbide (B4C) shell logic",
    "micro-pitted engineered surface",
  ];
  const positiveIdentityTraits = [
    "manufactured object identity",
    "sealed eye region",
    "not wearable artifact read",
    "not character read",
  ];
  const positiveSilhouetteTraits = [
    "perfect bilateral symmetry",
    "severe symmetrical silhouette",
    "sharp engineered edges",
  ];
  const positiveCompositionTraits = [
    "centered front artifact shot",
    "black void background",
  ];
  const negativeTraits = [
    "human face read",
    "visible eyes",
    "creature features",
    "horns",
    "animal ears",
    "cosplay wearable helmet read",
    "plastic or resin material read",
    "halo ring frame object",
    "missing black void background",
  ];

  packet.positive_traits = packet.positive_traits || {
    material: [],
    identity: [],
    silhouette: [],
    composition: [],
  };
  packet.positive_traits.material = dedupeStrings([
    ...(packet.positive_traits.material || []),
    ...positiveMaterialTraits,
  ]);
  packet.positive_traits.identity = dedupeStrings([
    ...(packet.positive_traits.identity || []),
    ...positiveIdentityTraits,
  ]);
  packet.positive_traits.silhouette = dedupeStrings([
    ...(packet.positive_traits.silhouette || []),
    ...positiveSilhouetteTraits,
  ]);
  packet.positive_traits.composition = dedupeStrings([
    ...(packet.positive_traits.composition || []),
    ...positiveCompositionTraits,
  ]);
  packet.negative_traits = dedupeStrings([
    ...(packet.negative_traits || []),
    ...negativeTraits,
  ]);
  packet.positive_rules = dedupeStrings([
    ...(packet.positive_rules || []),
    ...positiveMaterialTraits.map((trait) => buildPositiveRule("material", trait)),
    ...positiveIdentityTraits.map((trait) => buildPositiveRule("identity", trait)),
    ...positiveSilhouetteTraits.map((trait) => buildPositiveRule("silhouette", trait)),
    ...positiveCompositionTraits.map((trait) => buildPositiveRule("composition", trait)),
  ]);
  packet.negative_rules = dedupeStrings([
    ...(packet.negative_rules || []),
    ...negativeTraits.map((trait) => buildNegativeRule(trait)),
  ]);
  packet.hard_reject_traits = dedupeStrings([
    ...(packet.hard_reject_traits || []),
    "visible eyes",
    "human face read",
    "horn or ear extension",
    "creature or character read",
    "cosplay or wearable helmet read",
    "plastic or resin read",
    "halo ring frame object",
    "missing black void background",
  ]);
  return packet;
}

function applyCanonEvolutionPacket(packet = {}, context = {}) {
  const evolution = resolveCanonV2(context);
  packet.canon_evolution_reused = evolution.reused === true;
  packet.canon_evolution_source_keys = evolution.source_keys || [];
  if (evolution.reused !== true) {
    return packet;
  }

  const dominantTraits = Array.isArray(evolution.dominant_traits) ? evolution.dominant_traits : [];
  const supportiveTraits = Array.isArray(evolution.supportive_traits) ? evolution.supportive_traits : [];
  const provisionalSupportive = Array.isArray(evolution.provisional_supportive) ? evolution.provisional_supportive : [];
  const readabilityTraits = Array.isArray(evolution.readability_cues) ? evolution.readability_cues : [];
  const blockedTraits = Array.isArray(evolution.blocked_traits) ? evolution.blocked_traits : [];
  const negativeEnforcements = Array.isArray(evolution.negative_enforcements) ? evolution.negative_enforcements : [];
  const positiveTraits = dedupeStrings([
    ...dominantTraits.map((entry) => entry && entry.trait),
    ...supportiveTraits.map((entry) => entry && entry.trait),
    ...provisionalSupportive.map((entry) => entry && entry.trait),
    ...readabilityTraits.map((entry) => entry && entry.trait),
  ]);
  const negativeTraits = dedupeStrings([
    ...negativeEnforcements.map((entry) => entry && entry.trait),
    ...blockedTraits.map((entry) => entry && entry.trait),
  ]);
  packet.positive_traits = packet.positive_traits || {
    material: [],
    identity: [],
    silhouette: [],
    composition: [],
  };
  packet.positive_traits.material = dedupeStrings([
    ...(packet.positive_traits.material || []),
    ...positiveTraits.filter((trait) => /ceramic|surface|micro|grain|matte|shadow|black/i.test(trait)),
  ]);
  packet.positive_traits.identity = dedupeStrings([
    ...(packet.positive_traits.identity || []),
    ...positiveTraits.filter((trait) => /manufactured|object|sealed|artifact|readable/i.test(trait)),
  ]);
  packet.positive_traits.silhouette = dedupeStrings([
    ...(packet.positive_traits.silhouette || []),
    ...positiveTraits.filter((trait) => /symmetry|silhouette|edge|contour|seam|jaw|cheek/i.test(trait)),
  ]);
  packet.positive_traits.composition = dedupeStrings([
    ...(packet.positive_traits.composition || []),
    ...positiveTraits.filter((trait) => /background|centered|frontal|composition|shot|frame/i.test(trait)),
  ]);
  packet.negative_traits = dedupeStrings([...(packet.negative_traits || []), ...negativeTraits]);
  packet.positive_rules = dedupeStrings([
    ...(packet.positive_rules || []),
    ...packet.positive_traits.material.map((trait) => buildPositiveRule("material", trait)),
    ...packet.positive_traits.identity.map((trait) => buildPositiveRule("identity", trait)),
    ...packet.positive_traits.silhouette.map((trait) => buildPositiveRule("silhouette", trait)),
    ...packet.positive_traits.composition.map((trait) => buildPositiveRule("composition", trait)),
  ]);
  packet.negative_rules = dedupeStrings([
    ...(packet.negative_rules || []),
    ...negativeTraits.map((trait) => buildNegativeRule(trait)),
  ]);
  packet.blocked_traits = dedupeStrings([...(packet.blocked_traits || []), ...blockedTraits.map((entry) => entry && entry.trait).filter(Boolean)]);
  return packet;
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

    const packet = {
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
    if (normalizeContextLane(context) === "mask") {
      applyMaskCanonDefaults(packet);
    }
    applyCanonEvolutionPacket(packet, context);
    return packet;
  } catch (_) {
    const packet = {
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
    if (normalizeContextLane(context) === "mask") {
      applyMaskCanonDefaults(packet);
    }
    applyCanonEvolutionPacket(packet, context);
    return packet;
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
