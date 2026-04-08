"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { createTempWorkspace, createAttemptFixture, writeJson } = require("./memory_test_helpers");
const { postRunSnapshotRefresh } = require("../tools/handoff/post_run_snapshot_refresh");

const workspace = createTempWorkspace("mikage-postrun-refresh-");
const queuePath = path.join(workspace.stateRoot, "memory_ingest_queue.json");
const registryPath = path.join(workspace.stateRoot, "memory_registry.json");
const manifestPath = path.join(workspace.stateRoot, "memory_index_manifest.json");
const promotionRulesPath = path.join(workspace.stateRoot, "memory_promotion_rules.json");
const decayRulesPath = path.join(workspace.stateRoot, "memory_decay_rules.json");

createAttemptFixture(workspace, {
  jobId: "POSTRUN_PASS",
  finalDecision: "ALLOW",
  writeFinalDecision: false,
  writeGeminiValidation: false,
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

const result = postRunSnapshotRefresh({
  traceRoot: workspace.traceRoot,
  queuePath,
  registryPath,
  manifestPath,
  promotionRulesPath,
  decayRulesPath,
  refreshHandoff: false,
  now: "2026-04-08T00:00:00.000Z",
});

assert.ok(result.normalized_count >= 1);
assert.ok(fs.existsSync(path.join(workspace.traceRoot, "POSTRUN_PASS", "attempt-01", "final_decision.json")));
assert.ok(fs.existsSync(path.join(workspace.traceRoot, "POSTRUN_PASS", "attempt-01", "gemini_validation.json")));
assert.ok(fs.existsSync(queuePath));
assert.ok(fs.existsSync(registryPath));
assert.ok(fs.existsSync(manifestPath));

console.log("test_post_run_refresh: PASS");
