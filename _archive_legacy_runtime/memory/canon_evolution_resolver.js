"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_CANON_EVOLUTION_REGISTRY_PATH = path.join(__dirname, "canon_evolution_registry.json");
const CONTAMINATION_PATTERN = /\bkitsune\b|\bfox\b|\bhorns?\b|\bears?\b|\bdemon\b|\bfangs?\b|\bhelmet\b|\bcosplay\b|\bhuman face\b|\bhalo\b|\bring\b|\bframe\b/i;

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

function getCanonEvolutionRegistryPath() {
  return process.env.CANON_EVOLUTION_REGISTRY_PATH || DEFAULT_CANON_EVOLUTION_REGISTRY_PATH;
}

function readCanonEvolutionRegistry() {
  return readJsonSafe(getCanonEvolutionRegistryPath(), {
    version: "1.0.0",
    records: [],
  });
}

function isSafeEvolutionRecord(record = {}) {
  const text = normalizeText([
    record.identity_key,
    record.object_id,
    ...(record.trait_bundle && record.trait_bundle.material || []),
    ...(record.trait_bundle && record.trait_bundle.identity || []),
    ...(record.trait_bundle && record.trait_bundle.silhouette || []),
    ...(record.trait_bundle && record.trait_bundle.composition || []),
  ].filter(Boolean).join(" | "));
  return CONTAMINATION_PATTERN.test(text) === false;
}

function resolveCanonEvolution(context = {}) {
  const lane = normalizeLane(context.lane || context.shot_type || context.object_class);
  const registry = readCanonEvolutionRegistry();
  const records = (Array.isArray(registry.records) ? registry.records : [])
    .filter((record) => record && record.status === "active" && normalizeLane(record.lane) === lane && isSafeEvolutionRecord(record))
    .sort((a, b) => String(a.identity_key || "").localeCompare(String(b.identity_key || "")));

  const merged = {
    material: [],
    identity: [],
    silhouette: [],
    composition: [],
    negative_guards: [],
  };

  for (const record of records) {
    const traits = record.trait_bundle || {};
    merged.material = dedupeStrings([...(merged.material || []), ...(traits.material || [])]);
    merged.identity = dedupeStrings([...(merged.identity || []), ...(traits.identity || [])]);
    merged.silhouette = dedupeStrings([...(merged.silhouette || []), ...(traits.silhouette || [])]);
    merged.composition = dedupeStrings([...(merged.composition || []), ...(traits.composition || [])]);
    merged.negative_guards = dedupeStrings([...(merged.negative_guards || []), ...(traits.negative_guards || [])]);
  }

  return {
    reused: records.length > 0,
    source_keys: records.map((record) => record.identity_key),
    records,
    merged_traits: merged,
  };
}

module.exports = {
  DEFAULT_CANON_EVOLUTION_REGISTRY_PATH,
  getCanonEvolutionRegistryPath,
  readCanonEvolutionRegistry,
  resolveCanonEvolution,
};
