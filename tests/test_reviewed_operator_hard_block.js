"use strict";

const assert = require("assert");
const { runReviewedOperator } = require("../control_plane/reviewed_operator_flow");

(async () => {
  const result = await runReviewedOperator({
    command_id: "cmd_push_main_blocked",
    action: "repo.push",
    approval_status: "approved",
    branch: "main",
    remote: "origin",
    files: []
  });

  assert.strictEqual(result.status, "BLOCKED");
  assert.strictEqual(result.record.execution_result.reason, "push_to_main_blocked_without_explicit_review");
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
