"use strict";

const assert = require("assert");
const path = require("path");

const { createTempWorkspace, createAttemptFixture } = require("./memory_test_helpers");
const { ingestVerifiedArtifacts } = require("../tools/handoff/ingest_verified_artifacts");

const workspace = createTempWorkspace("mikage-memory-ingest-");

createAttemptFixture(workspace, {
  jobId: "PASS_JOB",
  finalDecision: "ALLOW",
  variantVerdict: "PASS_CANON_VARIANT",
});

createAttemptFixture(workspace, {
  jobId: "REJECT_JOB",
  finalDecision: "REJECT",
  variantVerdict: "REJECT_DRIFT",
});

createAttemptFixture(workspace, {
  jobId: "NO_IMAGE_JOB",
  finalDecision: "ALLOW",
  withImage: false,
});

const queue = ingestVerifiedArtifacts({
  traceRoot: workspace.traceRoot,
  queuePath: path.join(workspace.stateRoot, "memory_ingest_queue.json"),
});

assert.strictEqual(queue.candidates.length, 3, "PASS run should create three candidate entries");
assert.ok(queue.candidates.every((entry) => entry.source_run === "PASS_JOB"));
assert.ok(queue.skipped.some((item) => item.source_run === "REJECT_JOB"));
assert.ok(queue.skipped.some((item) => item.source_run === "NO_IMAGE_JOB"));

console.log("test_memory_layer_ingest: PASS");
