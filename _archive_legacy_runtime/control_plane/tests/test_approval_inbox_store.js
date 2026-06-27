"use strict";

const assert = require("assert");

const { createApprovalItem, readApprovalInbox, expireApprovals } = require("../approval_inbox_store");

const suffix = Date.now();
const first = createApprovalItem({
  workflow_id: "wf_test",
  task_id: `task_approval_store_${suffix}`,
  session_id: "sess_a",
  requested_by: "test",
  action_type: "write",
  tool_name: "repo.commit",
  risk_level: "medium",
  summary: "commit reviewed files",
  reason: "approval_required",
  preview_ref: "preview.json",
  diff_ref: "NO_DIFF_AVAILABLE",
  expires_in_ms: 10,
});
const second = createApprovalItem({
  workflow_id: "wf_test",
  task_id: `task_approval_store_${suffix}`,
  session_id: "sess_a",
  requested_by: "test",
  action_type: "write",
  tool_name: "repo.commit",
  risk_level: "medium",
  summary: "commit reviewed files",
  reason: "approval_required",
  preview_ref: "preview.json",
  diff_ref: "NO_DIFF_AVAILABLE",
});

assert.strictEqual(first.created, true);
assert.strictEqual(second.deduped, true);
assert.ok(readApprovalInbox().pending.length >= 1);
const expired = expireApprovals(new Date(Date.now() + 100));
assert.ok(expired.some((item) => item.approval_id === first.item.approval_id));

console.log("PASS");
