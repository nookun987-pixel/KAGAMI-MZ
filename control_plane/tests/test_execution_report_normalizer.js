"use strict";

const assert = require("assert");

const { normalizeExecutionSuccess, normalizeExecutionFailure } = require("../execution_report_normalizer");

const success = normalizeExecutionSuccess({
  job_id: "job_norm_success",
  task_id: "task_norm_success",
  changed_files: ["control_plane/example.js"],
  tests_executed: ["node test.js"],
  tests_passed: ["node test.js"],
  tests_failed: [],
  artifacts_returned: ["report.json"],
  summary: "executor finished successfully",
});
assert.strictEqual(success.status, "PASS");

const failure = normalizeExecutionFailure({
  job_id: "job_norm_failure",
  task_id: "task_norm_failure",
  failure_stage: "executor",
  failure_type: "TEST_FAILED",
  retryable: true,
  summary: "tests failed",
});
assert.strictEqual(failure.status, "PASS");

console.log("PASS");
