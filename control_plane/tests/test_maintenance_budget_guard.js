"use strict";

const assert = require("assert");

const { evaluateMaintenanceBudget } = require("../maintenance_budget_guard");

const result = evaluateMaintenanceBudget({
  issue_id: "issue_test",
  severity: "medium",
});

assert.strictEqual(result.allowed, true);
assert.strictEqual(result.require_operator_review, true);

console.log("PASS");
