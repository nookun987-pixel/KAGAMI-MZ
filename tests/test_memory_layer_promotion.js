"use strict";

const assert = require("assert");
const path = require("path");

const { createTempWorkspace, writeJson } = require("./memory_test_helpers");
const { promoteMemoryEntries } = require("../tools/handoff/promote_memory_entries");
const { pruneStaleMemory } = require("../tools/handoff/prune_stale_memory");

const workspace = createTempWorkspace("mikage-memory-promote-");
const registryPath = path.join(workspace.stateRoot, "memory_registry.json");
const promotionRulesPath = path.join(workspace.stateRoot, "memory_promotion_rules.json");
const decayRulesPath = path.join(workspace.stateRoot, "memory_decay_rules.json");

writeJson(registryPath, {
  entries: [
    {
      id: "mem_promote",
      source_run: "PROMOTE_JOB",
      lane: "image",
      type: "approved_variant",
      trust_score: 1,
      support_count: 3,
      reuse_count: 2,
      created_at: "2026-03-01T00:00:00.000Z",
      last_used: "2026-04-07T00:00:00.000Z",
      status: "active",
    },
    {
      id: "mem_archive",
      source_run: "ARCHIVE_JOB",
      lane: "image",
      type: "object_trait",
      trust_score: 0.55,
      support_count: 1,
      reuse_count: 0,
      created_at: "2026-01-01T00:00:00.000Z",
      last_used: null,
      status: "active",
    }
  ],
  archived_entries: [],
});

writeJson(promotionRulesPath, {
  maximum_trust_score: 2,
  multi_run_support: { min_support: 2, increment: 0.2 },
  successful_reuse: { increment_per_hit: 0.05 },
});

writeJson(decayRulesPath, {
  stale_after_days: 30,
  decay_step: 0.1,
  archive_below: 0.5,
});

const promoted = promoteMemoryEntries({
  registryPath,
  rulesPath: promotionRulesPath,
});
const promoteEntry = promoted.entries.find((entry) => entry.id === "mem_promote");
assert.ok(promoteEntry.trust_score > 1);

const pruned = pruneStaleMemory({
  registryPath,
  rulesPath: decayRulesPath,
  now: "2026-04-08T00:00:00.000Z",
});

assert.ok(pruned.archived_entries.some((entry) => entry.id === "mem_archive"));

console.log("test_memory_layer_promotion: PASS");
