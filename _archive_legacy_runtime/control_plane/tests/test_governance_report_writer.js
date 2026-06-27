"use strict";

const assert = require("assert");

const { writeGovernanceReport, readGovernanceReportByWorkflow } = require("../governance_report_writer");

const workflowId = `wf_gov_${Date.now()}`;
const result = writeGovernanceReport({
  workflow_id: workflowId,
  task_id: "task_gov_report",
  session_id: "sess_gov",
  report_type: "APPROVAL_PENDING",
  summary: "approval requested",
  risk_level: "medium",
  approval_state: "pending",
  execution_state: "awaiting_approval",
  refs: ["preview.json"],
});

assert.strictEqual(result.emitted, true);
assert.strictEqual(readGovernanceReportByWorkflow(workflowId).workflow_id, workflowId);

console.log("PASS");
