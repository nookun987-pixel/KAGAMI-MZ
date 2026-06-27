"use strict";

const assert = require("assert");

const {
  createIntentFromFailure,
  createIntentFromRetry,
  createIntentFromCompletion,
  createIntentFromOperatorHint,
} = require("../intent_engine");

const failureIntent = createIntentFromFailure({
  failure_id: "failure_test",
  workflow_id: "wf_test",
  task_id: "task_test",
  failure_code: "EXECUTION_FAILED",
  failure_stage: "bounded_executor",
  retryable: true,
  report_ref: "report.json",
  command_ref: "cmd_x",
});
assert.strictEqual(failureIntent.source, "failure");

const retryIntent = createIntentFromRetry({
  retry_id: "retry_test",
  failure_id: "failure_test",
  task_id: "task_test",
  retry_count: 1,
  staged_retry_marker: "retry_1",
});
assert.strictEqual(retryIntent.source, "retry");

const completionIntent = createIntentFromCompletion({
  workflow_id: "wf_done",
  task_id: "task_done",
  status: "PASS",
  refs: ["report.json"],
});
assert.strictEqual(completionIntent.source, "completion");

const hintIntent = createIntentFromOperatorHint({
  goal: "inspect failure cluster",
  hint: "operator requested follow-up",
  risk_level: "medium",
});
assert.strictEqual(hintIntent.source, "operator_hint");

console.log("PASS");
