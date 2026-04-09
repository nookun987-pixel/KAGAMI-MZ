"use strict";

const assert = require("assert");

const { evaluateProgress } = require("../progress_evaluator");

const result = evaluateProgress({
  governance_snapshot: { workflow_status: "approval_pending" },
  failure_center: { failures: [{ failure_id: "f1", status: "open" }] },
  workflow_history: {
    latest_successful_workflow: { task_id: "task_ok" },
    latest_blocked_workflow: { blocker_reason: "approval_required" },
    latest_failed_workflow: { blocker_reason: "executor_failed" },
  },
  executor_jobs: { jobs: [{ status: "SUCCEEDED" }] },
});

assert.strictEqual(result.status, "PASS");
assert.ok(result.progress.moved_forward.length >= 1);
assert.ok(result.progress.blocked.length >= 1);
assert.ok(result.progress.regressed.length >= 1);

console.log("PASS");
