"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const config = require("../control_plane/local_control_agent/config");
const { runAutoAgentLoop } = require("../control_plane/auto_agent_loop");

fs.mkdirSync(config.TASKS_DIR, { recursive: true });
const taskPath = path.join(config.TASKS_DIR, "auto_loop_test.md");
fs.writeFileSync(taskPath, "# auto loop test\n", "utf8");

(async () => {
  const report = await runAutoAgentLoop({
    filePath: path.join(config.INBOX_DIR, "cmd_auto_loop_test.json"),
    payload: {
      command_id: "cmd_auto_loop_test",
      action: "repo.status",
      payload: {
        task_id: "auto_loop_test",
      },
      approval: {
        status: "auto_allow",
      },
      requested_by: "test",
    },
  });

  assert.strictEqual(report.status, "PASS");
  assert.strictEqual(report.result.state_record.state, "done");
  assert.ok(Array.isArray(report.result.state_record.history));
  fs.unlinkSync(taskPath);
  console.log("PASS");
})().catch((error) => {
  if (fs.existsSync(taskPath)) fs.unlinkSync(taskPath);
  console.error(error);
  process.exit(1);
});
