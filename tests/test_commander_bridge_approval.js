"use strict";

const assert = require("assert");
const { evaluateApproval } = require("../control_plane/local_control_agent/approval_gate");

const commitBlocked = evaluateApproval({ action: "repo.commit", approval: { status: "pending" } }, {});
assert.strictEqual(commitBlocked.allowed, false);

const statusAllowed = evaluateApproval({ action: "repo.status", approval: { status: "auto_allow" } }, {});
assert.strictEqual(statusAllowed.allowed, true);
console.log("PASS");
