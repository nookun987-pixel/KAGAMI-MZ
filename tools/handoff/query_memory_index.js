"use strict";

const path = require("path");

const {
  rootPath,
  parseJsonFile,
  writeJsonFile,
  sortEntries,
} = require("./memory_common");

function queryMemoryIndex(filters = {}, options = {}) {
  const registryPath = path.resolve(options.registryPath || rootPath("state", "memory_registry.json"));
  const registry = parseJsonFile(registryPath, { entries: [], archived_entries: [] });
  const limit = Number.isInteger(filters.limit) ? filters.limit : Number(filters.limit || 10);
  const minTrust = Number.isFinite(Number(filters.min_trust_score)) ? Number(filters.min_trust_score) : 0;

  let entries = (registry.entries || []).filter((entry) => entry.status !== "archived");
  if (filters.lane) {
    entries = entries.filter((entry) => entry.lane === filters.lane);
  }
  if (filters.type) {
    entries = entries.filter((entry) => entry.type === filters.type);
  }
  if (filters.family_id) {
    entries = entries.filter((entry) => entry.family_id === filters.family_id);
  }
  entries = entries.filter((entry) => Number(entry.trust_score || 0) >= minTrust);
  entries = sortEntries(entries).slice(0, limit);

  if (filters.mark_used) {
    const now = new Date().toISOString();
    const byId = new Set(entries.map((entry) => entry.id));
    registry.entries = (registry.entries || []).map((entry) => (
      byId.has(entry.id)
        ? {
          ...entry,
          last_used: now,
          reuse_count: Number(entry.reuse_count || 0) + 1,
        }
        : entry
    ));
    writeJsonFile(registryPath, registry);
    entries = entries.map((entry) => ({
      ...entry,
      last_used: now,
      reuse_count: Number(entry.reuse_count || 0) + 1,
    }));
  }

  return {
    filters,
    total: entries.length,
    entries,
  };
}

function parseArgs(argv) {
  const filters = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) {
      filters[match[1]] = match[2];
      continue;
    }
    if (arg === "--mark-used") {
      filters.mark_used = true;
    }
  }
  return filters;
}

module.exports = {
  queryMemoryIndex,
};

if (require.main === module) {
  const result = queryMemoryIndex(parseArgs(process.argv.slice(2)));
  console.log(JSON.stringify(result, null, 2));
}
