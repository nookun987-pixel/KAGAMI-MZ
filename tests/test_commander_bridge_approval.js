"use strict";

const assert = require("assert");
const { evaluateActionApproval } = require("../control_plane/approval_engine");

const commitBlocked = evaluateActionApproval({ command_id: "cmd1", action: "repo.commit", payload: { task_id: "task1" }, approval: { status: "pending" } }, "write", {});
assert.strictEqual(commitBlocked.allowed, false);

const statusAllowed = evaluateActionApproval({ command_id: "cmd2", action: "repo.status", payload: {}, approval: { status: "pending" } }, "read", {});
assert.strictEqual(statusAllowed.allowed, true);
console.log("PASS");
