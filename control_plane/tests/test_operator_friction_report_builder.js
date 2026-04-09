"use strict";

const assert = require("assert");
const fs = require("fs");

const { writeOperatorFrictionReport } = require("../operator_friction_report_builder");

const taskId = `task_friction_${Date.now()}`;
const written = writeOperatorFrictionReport({
  proof: {
    workflow_id: `task_${taskId}`,
    task_id: taskId,
    final_verdict: "PASS",
    approval_item: { reason: "approval_required" },
    refs: ["a"],
  },
  anomalies: [{ anomaly_type: "TIMELINE_GOVERNANCE_MISMATCH" }],
  lifecycle: {
    events: new Array(9).fill(0).map((_, index) => ({ stage: `s${index}` })),
  },
});

assert.ok(fs.existsSync(written.artifact_path));
assert.strictEqual(written.report.task_id, taskId);
assert.ok(written.report.friction_points.length >= 3);

console.log("PASS");
