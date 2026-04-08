"use strict";

const assert = require("assert");

const { writeGovernanceSnapshot } = require("../governance_snapshot_writer");

const snapshot = writeGovernanceSnapshot({
  workflow_status: "approval_pending",
  current_approval_state: "pending",
  pending_actions_count: 1,
  last_executor_result: "awaiting_approval",
  latest_task_id: "task_gov",
});

assert.strictEqual(snapshot.workflow_status, "approval_pending");
assert.ok(snapshot.reporting_timestamp);

console.log("PASS");
