"use strict";

const assert = require("assert");
const fs = require("fs");

const { buildCommandFromFlags, writeInboxCommand } = require("../control_plane/local_control_agent/send_command");
const { resetBridge } = require("./test_commander_bridge_helpers");

resetBridge();
const built = buildCommandFromFlags(["repo.status"]);
assert.strictEqual(built.mode, "command");
const inboxPath = writeInboxCommand(built.command);
assert.ok(fs.existsSync(inboxPath));
const payload = JSON.parse(fs.readFileSync(inboxPath, "utf8"));
assert.strictEqual(payload.action, "repo.status");
assert.strictEqual(payload.approval.status, "auto_allow");
console.log("PASS");
