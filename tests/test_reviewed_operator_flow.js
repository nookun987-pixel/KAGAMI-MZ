"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const { routeCommand } = require("../control_plane/local_control_agent/command_router");
const config = require("../control_plane/local_control_agent/config");

(async () => {
  const result = await routeCommand({
    command_id: "cmd_reviewed_codex_001",
    action: "codex.build_task",
    payload: {
      scope: "reviewed-test"
    },
    approval: {
      status: "approved"
    }
  });

  assert.strictEqual(result.reviewed, true);
  assert.ok(fs.existsSync(result.report_path));
  const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
  assert.strictEqual(report.intent.action, "codex.build_task");
  assert.strictEqual(report.approval_decision.approval_status, "approved");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
