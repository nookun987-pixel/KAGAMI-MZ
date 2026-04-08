"use strict";

const assert = require("assert");
const path = require("path");

const { main } = require("../control_plane/local_control_agent/send_command");
const { runOnce } = require("../control_plane/local_control_agent/index");
const { resetBridge } = require("./test_commander_bridge_helpers");
const config = require("../control_plane/local_control_agent/config");

(async () => {
  resetBridge();
  const runner = main(["repo.status", "--wait"]);
  await new Promise((resolve) => setTimeout(resolve, 250));
  await runOnce();
  const result = await runner;
  assert.strictEqual(result.mode, "complete");
  assert.ok(result.reportPath.startsWith(config.OUTBOX_DIR));
  assert.strictEqual(result.report.action, "repo.status");
  assert.strictEqual(result.report.status, "PASS");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
