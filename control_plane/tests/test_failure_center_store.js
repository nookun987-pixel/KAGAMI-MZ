"use strict";

const assert = require("assert");

const { recordFailure, readFailureCenter } = require("../failure_center_store");

const first = recordFailure({
  workflow_id: "wf_failure",
  task_id: "task_failure",
  action_id: "cmd_fail",
  failure_code: "EXECUTION_FAILED",
  failure_stage: "bounded_executor",
  message: "boom",
  retryable: true,
});
const second = recordFailure({
  workflow_id: "wf_failure",
  task_id: "task_failure",
  action_id: "cmd_fail",
  failure_code: "EXECUTION_FAILED",
  failure_stage: "bounded_executor",
  message: "boom",
  retryable: true,
});

assert.strictEqual(first.failure_id, second.failure_id);
assert.ok(readFailureCenter().failures.length >= 1);

console.log("PASS");
