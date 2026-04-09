"use strict";

const assert = require("assert");

const { evaluateAutonomyBudget } = require("../autonomy_budget_guard");

const ok = evaluateAutonomyBudget({
  goal_id: "goal_guarded_autonomy",
  current_stage: "active",
  retry_class: "none",
});

assert.strictEqual(ok.allowed, true);

console.log("PASS");
