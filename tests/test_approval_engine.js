"use strict";

const assert = require("assert");

const {
  resolveActionPolicy,
  evaluateActionApproval,
} = require("../control_plane/approval_engine");

assert.strictEqual(resolveActionPolicy("read"), "auto");
assert.strictEqual(resolveActionPolicy("write"), "ask");
assert.strictEqual(resolveActionPolicy("destructive"), "block");
assert.strictEqual(resolveActionPolicy("unknown"), "block");

const readAllowed = evaluateActionApproval({
  command_id: "cmd_read_1",
  action: "repo.status",
  payload: {},
  approval: { status: "pending" },
}, "read", {});
assert.strictEqual(readAllowed.allowed, true);

const writeQueued = evaluateActionApproval({
  command_id: "cmd_write_1",
  action: "repo.commit",
  payload: { task_id: "task_a" },
  approval: { status: "pending" },
  requested_by: "test",
}, "write", { reason: "approval_required" });
assert.strictEqual(writeQueued.allowed, false);
assert.strictEqual(writeQueued.approval_state, "pending");
assert.ok(writeQueued.queued);

const destructivePlanQueued = evaluateActionApproval({
  command_id: "cmd_clean_1",
  action: "disk.safe_clean",
  payload: { task_id: "task_clean", targets: [{ path: "C:\\temp\\x.log" }] },
  approval: { status: "pending" },
  requested_by: "test",
}, "destructive", { reason: "missing_task_plan_file" });
assert.strictEqual(destructivePlanQueued.allowed, false);
assert.strictEqual(destructivePlanQueued.approval_state, "pending");
assert.ok(destructivePlanQueued.queued);

const writeApproved = evaluateActionApproval({
  command_id: "cmd_write_2",
  action: "repo.commit",
  payload: { task_id: "task_b" },
  approval: { status: "approved" },
}, "write", {});
assert.strictEqual(writeApproved.allowed, true);

console.log("PASS");
