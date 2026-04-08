"use strict";

const assert = require("assert");
const { readNextCommand } = require("../control_plane/local_control_agent/bridge_reader");
const { resetBridge, writeInboxCommand } = require("./test_commander_bridge_helpers");

resetBridge();
writeInboxCommand({
  command_id: "cmd_inbox_001",
  action: "repo.status",
  payload: {},
  approval: { status: "auto_allow" },
  requested_by: "test",
  created_at: new Date().toISOString(),
});

const next = readNextCommand();
assert.ok(next);
assert.strictEqual(next.payload.action, "repo.status");
console.log("PASS");
