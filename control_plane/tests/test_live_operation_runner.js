"use strict";

const assert = require("assert");

const { ensureTaskPlan } = require("../live_operation_runner");

const taskId = `task_live_runner_${Date.now()}`;
const planPath = ensureTaskPlan(taskId, "Validate live operation runner plan file");

assert.ok(planPath.endsWith(`${taskId}.md`));

console.log("PASS");
