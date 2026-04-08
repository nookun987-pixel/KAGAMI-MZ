"use strict";

const path = require("path");

const { refreshHandoffPack } = require("./refresh_handoff_pack");
const { listAttemptDirs, normalizeAttemptArtifacts, rootPath } = require("./memory_common");
const { ingestVerifiedArtifacts } = require("./ingest_verified_artifacts");
const { buildMemoryRegistry } = require("./build_memory_registry");
const { promoteMemoryEntries } = require("./promote_memory_entries");
const { pruneStaleMemory } = require("./prune_stale_memory");

function postRunSnapshotRefresh(options = {}) {
  const traceRoot = path.resolve(options.traceRoot || rootPath("traces"));
  const attemptDirs = listAttemptDirs({ traceRoot });
  const normalized = [];

  for (const attemptDir of attemptDirs) {
    const result = normalizeAttemptArtifacts(attemptDir, {
      generatedBy: "tools/handoff/post_run_snapshot_refresh.js",
    });
    if (result.finalDecision || result.geminiValidation) {
      normalized.push({
        attempt_dir: attemptDir,
        final_decision: Boolean(result.finalDecision),
        gemini_validation: Boolean(result.geminiValidation),
      });
    }
  }

  if (options.refreshHandoff !== false) {
    refreshHandoffPack();
  }
  const ingestQueue = ingestVerifiedArtifacts({
    traceRoot,
    queuePath: options.queuePath,
  });
  const memoryRegistry = buildMemoryRegistry({
    queuePath: options.queuePath,
    registryPath: options.registryPath,
    manifestPath: options.manifestPath,
  });
  const promotedRegistry = promoteMemoryEntries({
    registryPath: options.registryPath,
    rulesPath: options.promotionRulesPath,
  });
  const prunedRegistry = pruneStaleMemory({
    registryPath: options.registryPath,
    rulesPath: options.decayRulesPath,
    now: options.now,
  });

  return {
    normalized_count: normalized.length,
    ingest_candidates: ingestQueue.candidates.length,
    ingest_skipped: ingestQueue.skipped.length,
    registry_entries: memoryRegistry.registry.entries.length,
    promoted_entries: promotedRegistry.entries.length,
    active_entries_after_prune: prunedRegistry.entries.length,
    archived_entries_after_prune: prunedRegistry.archived_entries.length,
  };
}

module.exports = {
  postRunSnapshotRefresh,
};

if (require.main === module) {
  const result = postRunSnapshotRefresh();
  console.log(JSON.stringify(result, null, 2));
}
