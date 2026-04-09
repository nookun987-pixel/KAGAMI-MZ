"use strict";

const assert = require("assert");

const { normalizeIngestedOutcome } = require("../result_ingest");

const success = normalizeIngestedOutcome({ outcome: "success" }, {
  status: "PASS",
  job: { job_id: "job_1" },
  normalized: {
    task_id: "task_1",
    changed_files: ["control_plane/a.js"],
    summary: "updated a.js",
    tests_executed: [],
    tests_passed: [],
    tests_failed: [],
    artifacts_returned: [],
    completed_at: "2026-04-09T00:00:00.000Z",
  },
  artifact_path: "artifact.json",
});

assert.strictEqual(success.status, "success");
assert.deepStrictEqual(success.changed_files, ["control_plane/a.js"]);
console.log("PASS");
