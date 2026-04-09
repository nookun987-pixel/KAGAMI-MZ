"use strict";

const assert = require("assert");

const { registerMaintenanceIssues } = require("../maintenance_issue_registry");

const registry = registerMaintenanceIssues({
  issues: [
    {
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

assert.ok(Array.isArray(registry.issues));
assert.ok(registry.issues.length >= 1);

console.log("PASS");
