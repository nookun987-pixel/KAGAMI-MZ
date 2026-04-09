"use strict";

const assert = require("assert");

const { getGoalState } = require("../goal_state_registry");
const { planNextTasks } = require("../next_task_planner");

const planned = planNextTasks(getGoalState("goal_guarded_autonomy"), {
  progress: {
    latest_failure: {
      failure_code: "EXECUTION_FAILED",
      failure_stage: "bounded_executor",
      message: "executor failed",
      report_ref: "report.json",
      command_ref: "cmd_1",
    },
    latest_blocked: null,
    latest_success: null,
  },
});

assert.strictEqual(planned.status, "PASS");
assert.ok(planned.decision);
assert.ok(planned.decision.objective.toLowerCase().includes("execution_failed"));

console.log("PASS");
