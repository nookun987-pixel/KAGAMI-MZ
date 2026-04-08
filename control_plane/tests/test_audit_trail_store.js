"use strict";

const assert = require("assert");

const { appendAuditRecord, getAuditTrailByTask } = require("../audit_trail_store");

const taskId = `task_audit_${Date.now()}`;
appendAuditRecord({
  workflow_id: "wf_audit",
  task_id: taskId,
  actor_type: "dashboard_operator",
  actor_id: "tester",
  action: "approval.approve",
  decision: "approved",
  reason: "manual approval",
  refs: [],
});

const audit = getAuditTrailByTask(taskId);
assert.ok(audit.records.length >= 1);
assert.strictEqual(audit.records[0].task_id, taskId);

console.log("PASS");
