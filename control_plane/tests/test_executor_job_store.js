"use strict";

const assert = require("assert");

const { createExecutorJob, getExecutorJob, updateExecutorJob } = require("../executor_job_store");

const created = createExecutorJob({
  task_id: `task_executor_store_${Date.now()}`,
  workflow_id: "task_executor_store",
  dispatch_id: "dispatch_store",
  executor: "codex",
  repo_path: "d:\\KAGAMI-MZ",
  branch_policy: "reviewed_branch",
});

assert.strictEqual(created.status, "PASS");
assert.strictEqual(getExecutorJob(created.job.job_id).job_id, created.job.job_id);
const updated = updateExecutorJob(created.job.job_id, { status: "RUNNING" });
assert.strictEqual(updated.status, "RUNNING");

console.log("PASS");
