"use strict";

const assert = require("assert");

const service = require("../commander_service");
const { createApprovalItem } = require("../approval_inbox_store");
const { runOnce } = require("../local_control_agent/index");

(async () => {
  const approval = createApprovalItem({
    workflow_id: "wf_approval_exec",
    task_id: "task_approval_exec",
    session_id: "sess_exec",
    requested_by: "test",
    action_type: "write",
    tool_name: "repo.commit",
    risk_level: "medium",
    summary: "execute bounded command after approval",
    reason: "approval_required",
    preview_ref: "preview.json",
    diff_ref: "NO_DIFF_AVAILABLE",
    command_snapshot: {
      action: "repo.status",
      payload: {},
      requested_by: "test",
    },
  }).item;

  const loop = setInterval(() => {
    runOnce().catch(() => {});
  }, 200);
  const approved = await service.approveApproval(approval.approval_id, "test_operator");
  clearInterval(loop);

  assert.strictEqual(approved.status, "PASS");
  assert.ok(approved.execution);
  assert.strictEqual(approved.execution.status, "PASS");

  const rejectedApproval = createApprovalItem({
    workflow_id: "wf_approval_reject",
    task_id: "task_approval_reject",
    session_id: "sess_exec",
    requested_by: "test",
    action_type: "write",
    tool_name: "repo.commit",
    risk_level: "medium",
    summary: "reject should not execute",
    reason: "approval_required",
    preview_ref: "preview.json",
    diff_ref: "NO_DIFF_AVAILABLE",
    command_snapshot: {
      action: "repo.status",
      payload: {},
      requested_by: "test",
    },
  }).item;

  const rejected = service.rejectApproval(rejectedApproval.approval_id, "test_operator");
  assert.strictEqual(rejected.status, "BLOCKED");
  assert.strictEqual(rejected.execution, undefined);

  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
