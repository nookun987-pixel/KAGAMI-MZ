/**
 * dispatcher/test_drive_job_writer.js
 * PHASE 6.6 — Isolated test for drive_job_writer
 *
 * Writes one dry-run job, verifies file exists, prints result, exits.
 * No queue, no watcher, no retry, no API, no UI.
 */

"use strict";

const fs = require("fs");
const { writeJobToInbox } = require("./drive_job_writer");

// Minimal dry-run patched_job_spec
const dryRunSpec = {
  job_spec: {
    job_id: "DRY_RUN_PHASE6_TEST",
    input: {
      prompt: "Phase 6.6 drive bridge contract verification",
      negative_prompt: "",
    },
    render: {
      width: 1024,
      height: 1024,
    },
  },
  provenance: {
    source_run_id: "PHASE6_CONTRACT_TEST",
  },
};

// Write
const result = writeJobToInbox(dryRunSpec);

// Verify
if (!fs.existsSync(result.file_path)) {
  console.error(`TEST_DISPATCH_FAIL: file not found at ${result.file_path}`);
  process.exit(1);
}

const written = JSON.parse(fs.readFileSync(result.file_path, "utf-8"));

if (written.job_id !== result.job_id) {
  console.error(`TEST_DISPATCH_FAIL: job_id mismatch`);
  process.exit(1);
}

if (written.execution_target !== "colab_runner") {
  console.error(`TEST_DISPATCH_FAIL: execution_target is not colab_runner`);
  process.exit(1);
}

if (!written.patched_job_spec || !written.patched_job_spec.job_spec) {
  console.error(`TEST_DISPATCH_FAIL: patched_job_spec missing`);
  process.exit(1);
}

console.log(`TEST_DISPATCH_OK: ${result.job_id}`);
