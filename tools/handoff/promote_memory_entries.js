"use strict";

const path = require("path");

const {
  rootPath,
  parseJsonFile,
  writeJsonFile,
} = require("./memory_common");

function promoteMemoryEntries(options = {}) {
  const registryPath = path.resolve(options.registryPath || rootPath("state", "memory_registry.json"));
  const rulesPath = path.resolve(options.rulesPath || rootPath("state", "memory_promotion_rules.json"));
  const registry = parseJsonFile(registryPath, { entries: [], archived_entries: [] });
  const rules = parseJsonFile(rulesPath, defaultPromotionRules());

  registry.entries = (registry.entries || []).map((entry) => {
    let trustScore = Number(entry.trust_score || 0);
    const notes = [];

    if (Number(entry.support_count || 0) >= Number(rules.multi_run_support.min_support || 2)) {
      trustScore += Number(rules.multi_run_support.increment || 0);
      notes.push("multi_run_support");
    }

    if (Number(entry.reuse_count || 0) > 0) {
      trustScore += Number(entry.reuse_count || 0) * Number(rules.successful_reuse.increment_per_hit || 0);
      notes.push("successful_reuse");
    }

    trustScore = Math.min(trustScore, Number(rules.maximum_trust_score || 2));

    return {
      ...entry,
      trust_score: Number(trustScore.toFixed(3)),
      promotion_notes: notes,
      promoted_at: notes.length > 0 ? new Date().toISOString() : entry.promoted_at || null,
    };
  });

  writeJsonFile(registryPath, registry);
  return registry;
}

function defaultPromotionRules() {
  return {
    maximum_trust_score: 2,
    multi_run_support: {
      min_support: 2,
      increment: 0.2,
    },
    successful_reuse: {
      increment_per_hit: 0.05,
    },
  };
}

module.exports = {
  promoteMemoryEntries,
  defaultPromotionRules,
};

if (require.main === module) {
  const registry = promoteMemoryEntries();
  console.log(JSON.stringify({
    entries: registry.entries.length,
  }, null, 2));
}
