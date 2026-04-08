"use strict";

const path = require("path");

const {
  rootPath,
  parseJsonFile,
  writeJsonFile,
} = require("./memory_common");

function pruneStaleMemory(options = {}) {
  const registryPath = path.resolve(options.registryPath || rootPath("state", "memory_registry.json"));
  const rulesPath = path.resolve(options.rulesPath || rootPath("state", "memory_decay_rules.json"));
  const now = Date.parse(options.now || new Date().toISOString());
  const registry = parseJsonFile(registryPath, { entries: [], archived_entries: [] });
  const rules = parseJsonFile(rulesPath, defaultDecayRules());
  const active = [];
  const archived = [...(registry.archived_entries || [])];

  for (const entry of registry.entries || []) {
    const referenceTime = Date.parse(entry.last_used || entry.created_at || 0);
    const staleMs = now - referenceTime;
    const staleDays = staleMs / (1000 * 60 * 60 * 24);
    let trustScore = Number(entry.trust_score || 0);

    if (staleDays >= Number(rules.stale_after_days || 30)) {
      trustScore -= Number(rules.decay_step || 0.1);
    }

    const nextEntry = {
      ...entry,
      trust_score: Number(Math.max(trustScore, 0).toFixed(3)),
      decayed_at: staleDays >= Number(rules.stale_after_days || 30) ? new Date(now).toISOString() : entry.decayed_at || null,
    };

    if (nextEntry.trust_score < Number(rules.archive_below || 0.5)) {
      archived.push({
        ...nextEntry,
        status: "archived",
        archived_at: new Date(now).toISOString(),
      });
    } else {
      active.push(nextEntry);
    }
  }

  const payload = {
    ...registry,
    entries: active,
    archived_entries: archived,
    pruned_at: new Date(now).toISOString(),
  };

  writeJsonFile(registryPath, payload);
  return payload;
}

function defaultDecayRules() {
  return {
    stale_after_days: 30,
    decay_step: 0.1,
    archive_below: 0.5,
  };
}

module.exports = {
  pruneStaleMemory,
  defaultDecayRules,
};

if (require.main === module) {
  const registry = pruneStaleMemory();
  console.log(JSON.stringify({
    entries: registry.entries.length,
    archived_entries: registry.archived_entries.length,
  }, null, 2));
}
