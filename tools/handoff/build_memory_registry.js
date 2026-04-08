"use strict";

const path = require("path");

const {
  rootPath,
  parseJsonFile,
  writeJsonFile,
  dedupeEntries,
  sortEntries,
} = require("./memory_common");

function buildMemoryRegistry(options = {}) {
  const queuePath = path.resolve(options.queuePath || rootPath("state", "memory_ingest_queue.json"));
  const registryPath = path.resolve(options.registryPath || rootPath("state", "memory_registry.json"));
  const manifestPath = path.resolve(options.manifestPath || rootPath("state", "memory_index_manifest.json"));
  const existing = parseJsonFile(registryPath, { entries: [], archived_entries: [] });
  const queue = parseJsonFile(queuePath, { candidates: [] });
  const existingByFingerprint = new Map((existing.entries || []).map((entry) => [entry.fingerprint, entry]));
  const dedupedQueueEntries = dedupeEntries(queue.candidates || []);
  const entries = sortEntries(dedupedQueueEntries.map((entry) => {
    const previous = existingByFingerprint.get(entry.fingerprint);
    if (!previous) {
      return entry;
    }
    return {
      ...entry,
      trust_score: previous.trust_score || entry.trust_score,
      last_used: previous.last_used || entry.last_used,
      reuse_count: previous.reuse_count || entry.reuse_count,
      support_count: Math.max(previous.support_count || 0, entry.support_count || 0),
      supporting_runs: [...new Set([...(previous.supporting_runs || []), ...(entry.supporting_runs || [])])].sort(),
      promotion_notes: previous.promotion_notes || entry.promotion_notes,
      promoted_at: previous.promoted_at || entry.promoted_at || null,
      decayed_at: previous.decayed_at || entry.decayed_at || null,
    };
  }));

  const registry = {
    generated_at: new Date().toISOString(),
    generated_by: "tools/handoff/build_memory_registry.js",
    entries,
    archived_entries: existing.archived_entries || [],
  };

  const manifest = {
    generated_at: new Date().toISOString(),
    total_entries: entries.length,
    archived_entries: registry.archived_entries.length,
    by_type: countBy(entries, "type"),
    by_lane: countBy(entries, "lane"),
    by_status: countBy(entries, "status"),
    family_ids: [...new Set(entries.map((entry) => entry.family_id).filter(Boolean))].sort(),
  };

  writeJsonFile(registryPath, registry);
  writeJsonFile(manifestPath, manifest);

  return {
    registry,
    manifest,
  };
}

function countBy(entries, key) {
  return entries.reduce((acc, entry) => {
    const value = entry[key] || "UNVERIFIED";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

module.exports = {
  buildMemoryRegistry,
};

if (require.main === module) {
  const result = buildMemoryRegistry();
  console.log(JSON.stringify({
    entries: result.registry.entries.length,
    archived_entries: result.registry.archived_entries.length,
  }, null, 2));
}
