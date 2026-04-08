"use strict";

const assert = require("assert");
const fs = require("fs");

const config = require("../control_plane/local_control_agent/config");
const {
  registerWorkflowRun,
  getWorkflowHistory,
} = require("../control_plane/workflow_registry");

for (const filePath of [config.WORKFLOW_REGISTRY_JSON, config.WORKFLOW_REGISTRY_JSONL]) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

registerWorkflowRun({
  id: "wf_test_pass",
  workflow: "WAKE_VERIFY",
  requested_by: "test",
  reviewed_by: null,
  approval_state: "auto_allow",
  execution_state: "completed",
  started_at: new Date().toISOString(),
  ended_at: new Date().toISOString(),
  artifacts_written: [config.WORKFLOW_REGISTRY_JSON],
  final_verdict: "PASS",
  blocker_reason: null,
  status: "PASS",
});

const history = getWorkflowHistory(5);
assert.strictEqual(history.latest_successful_workflow.id, "wf_test_pass");
assert.ok(Array.isArray(history.runs));
assert.ok(fs.existsSync(config.WORKFLOW_REGISTRY_JSON));
assert.ok(fs.existsSync(config.WORKFLOW_REGISTRY_JSONL));

console.log("PASS");
