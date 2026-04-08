"use strict";

const assert = require("assert");
const { runOnce } = require("../control_plane/local_control_agent/index");
const { resetBridge, writeInboxCommand, readLatestOutboxJson } = require("./test_commander_bridge_helpers");

(async () => {
  resetBridge();
  writeInboxCommand({
    command_id: "cmd_report_001",
    action: "repo.status",
    payload: {},
    approval: { status: "auto_allow" },
    requested_by: "test",
    created_at: new Date().toISOString(),
  });
  await runOnce();
  const report = readLatestOutboxJson();
  assert.ok(report);
  assert.strictEqual(report.status, "PASS");
  assert.strictEqual(report.action, "repo.status");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
