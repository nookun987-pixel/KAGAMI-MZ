"use strict";

const assert = require("assert");

const service = require("../commander_service");
const dispatcher = require("../local_control_agent/codex_dispatcher");
const { createExecutorHandoff } = require("../executor_handoff_manager");

const taskId = `task_real_executor_${Date.now()}`;
const built = dispatcher.buildCodexTask({
  command_id: `cmd_${taskId}`,
  action: "codex.build_task",
  requested_by: "test",
  payload: {
    task_id: taskId,
    task: "Add module for executor visibility",
    files: ["control_plane/executor_status_tracker.js"],
    success_criteria: ["executor state visible"],
    tests_required: ["node control_plane\\tests\\test_executor_status_tracker.js"],
  },
});

assert.strictEqual(built.status, "PASS");

const handoff = createExecutorHandoff(dispatcher, {
  task_id: taskId,
  workflow_id: `task_${taskId}`,
  dispatch: built.record,
  dispatch_ref: built.dispatch_pack_path,
  executor: "codex",
});
assert.strictEqual(handoff.status, "PASS");

const ingested = service.ingestExecutorResult({
  outcome: "success",
  job_id: handoff.job.job_id,
  task_id: taskId,
  changed_files: ["control_plane/executor_status_tracker.js"],
  tests_executed: ["node control_plane\\tests\\test_executor_status_tracker.js"],
  tests_passed: ["node control_plane\\tests\\test_executor_status_tracker.js"],
  tests_failed: [],
  artifacts_returned: [built.dispatch_pack_path],
  summary: "executor result ingested successfully",
});

assert.strictEqual(ingested.status, "PASS");
assert.strictEqual(ingested.job.status, "SUCCEEDED");

console.log("PASS");
