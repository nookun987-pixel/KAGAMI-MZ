"use strict";

const assert = require("assert");

const { planSelfHeal } = require("../self_heal_planner");

const planned = planSelfHeal({
  issues: [
    {
      issue_id: "issue_1",
      issue_type: "dead_report_link",
      severity: "medium",
      component: "workflow_registry",
      evidence_refs: ["missing.json"],
      repairability: "repairable",
      suggested_task_type: "patch_bug",
      summary: "missing workflow artifact",
    },
  ],
});

assert.strictEqual(planned.status, "PASS");
assert.ok(planned.decision);
assert.ok(planned.decision.objective.includes("dead_report_link"));

console.log("PASS");
