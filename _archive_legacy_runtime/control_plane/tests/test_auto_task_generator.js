"use strict";

const assert = require("assert");
const fs = require("fs");

const { createIntentFromFailure } = require("../intent_engine");
const { resolveIntentToTask } = require("../intent_resolver");
const { createAutoTask } = require("../auto_task_generator");

const intent = createIntentFromFailure({
  failure_id: `failure_${Date.now()}`,
  workflow_id: "wf_auto_task",
  task_id: "task_auto_task",
  failure_code: "EXECUTION_FAILED",
  failure_stage: "bounded_executor",
  retryable: true,
});
const resolved = resolveIntentToTask(intent);
const created = createAutoTask(intent, resolved);

assert.strictEqual(created.status, "PASS");
assert.ok(fs.existsSync(created.task.task_path));

const duplicateResolved = resolveIntentToTask(intent);
const duplicate = createAutoTask(intent, duplicateResolved);
assert.strictEqual(duplicate.reason, "duplicate_auto_task");

fs.unlinkSync(created.task.task_path);
console.log("PASS");
