"use strict";

const assert = require("assert");

const { createExecutorJob, getExecutorJob } = require("../executor_job_store");
const { ingestExecutionOutcome } = require("../execution_result_ingestor");

const created = createExecutorJob({
  task_id: `task_ingest_${Date.now()}`,
  workflow_id: "task_ingest",
  dispatch_id: "dispatch_ingest",
  executor: "codex",
  repo_path: "d:\\KAGAMI-MZ",
  branch_policy: "reviewed_branch",
  status: "DISPATCHED",
});

const ingested = ingestExecutionOutcome({
  outcome: "success",
  job_id: created.job.job_id,
  task_id: created.job.task_id,
  changed_files: ["control_plane/thing.js"],
  tests_executed: ["node test.js"],
  tests_passed: ["node test.js"],
  tests_failed: [],
  artifacts_returned: ["out.json"],
  summary: "executor success",
});

assert.strictEqual(ingested.status, "PASS");
assert.strictEqual(getExecutorJob(created.job.job_id).status, "SUCCEEDED");

console.log("PASS");
