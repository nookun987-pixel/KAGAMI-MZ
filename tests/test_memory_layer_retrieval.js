"use strict";

const assert = require("assert");
const path = require("path");

const { createTempWorkspace, writeJson } = require("./memory_test_helpers");
const { queryMemoryIndex } = require("../tools/handoff/query_memory_index");

const workspace = createTempWorkspace("mikage-memory-query-");
const registryPath = path.join(workspace.stateRoot, "memory_registry.json");

writeJson(registryPath, {
  entries: [
    {
      id: "mem_a",
      source_run: "A",
      lane: "image",
      type: "approved_variant",
      family_id: "HERO_LOCK",
      trust_score: 1.3,
      created_at: "2026-04-08T00:00:00.000Z",
      last_used: "2026-04-08T01:00:00.000Z",
      status: "active",
    },
    {
      id: "mem_b",
      source_run: "B",
      lane: "image",
      type: "approved_variant",
      family_id: "HERO_LOCK",
      trust_score: 1.1,
      created_at: "2026-04-08T00:30:00.000Z",
      last_used: null,
      status: "active",
    },
    {
      id: "mem_c",
      source_run: "C",
      lane: "image",
      type: "canon_rule",
      family_id: "WORLD_LOCK",
      trust_score: 1.5,
      created_at: "2026-04-07T00:00:00.000Z",
      last_used: null,
      status: "active",
    },
  ],
  archived_entries: [],
});

const query = queryMemoryIndex({
  lane: "image",
  type: "approved_variant",
  family_id: "HERO_LOCK",
  min_trust_score: 1.0,
  limit: 2,
}, {
  registryPath,
});

assert.strictEqual(query.total, 2);
assert.strictEqual(query.entries[0].id, "mem_a");
assert.strictEqual(query.entries[1].id, "mem_b");

console.log("test_memory_layer_retrieval: PASS");
