"use strict";

const assert = require("assert");
const fs = require("fs");
const config = require("../control_plane/local_control_agent/config");
const { runReviewedOperator } = require("../control_plane/reviewed_operator_flow");
const { writeSnapshot } = require("../control_plane/local_control_agent/snapshot_writer");

(async () => {
  const result = await runReviewedOperator({
    command_id: "cmd_reviewed_codex_002",
    action: "codex.build_task",
    approval_status: "approved",
    payload: {
      scope: "snapshot-test"
    },
    files: []
  });

  const latest = JSON.parse(fs.readFileSync(config.LOCAL_AGENT_LAST_ACTION, "utf8"));
  assert.strictEqual(latest.intent.command_id, "cmd_reviewed_codex_002");
  assert.ok(fs.existsSync(result.report_path));

  const snapshot = writeSnapshot({ agent_status: "reviewed-test" });
  assert.strictEqual(snapshot.last_action, "codex.build_task");
  assert.strictEqual(snapshot.approval_status, "approved");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
