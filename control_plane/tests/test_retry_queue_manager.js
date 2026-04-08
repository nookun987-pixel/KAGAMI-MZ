"use strict";

const assert = require("assert");

const { recordFailure, updateFailure } = require("../failure_center_store");
const { requestRetry } = require("../retry_queue_manager");

const suffix = Date.now();
const failure = recordFailure({
  workflow_id: "wf_retry",
  task_id: `task_retry_${suffix}`,
  action_id: `cmd_retry_${suffix}`,
  action_type: "write",
  failure_code: "EXECUTION_FAILED",
  failure_stage: "bounded_executor",
  message: "retry me",
  retryable: true,
});

const first = requestRetry(failure.failure_id);
assert.strictEqual(first.status, "PASS");

updateFailure(failure.failure_id, { retry_count: 2 });
const exhausted = requestRetry(failure.failure_id);
assert.strictEqual(exhausted.reason, "retry_exhausted");

console.log("PASS");
