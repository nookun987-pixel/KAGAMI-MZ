"use strict";

const assert = require("assert");

const { setExecutorStatus, getExecutorStatus } = require("../executor_status_tracker");

setExecutorStatus("job_status_test", "DISPATCHED", { task_id: "task_status_test" });
const status = getExecutorStatus("job_status_test");
assert.strictEqual(status.status, "DISPATCHED");
assert.strictEqual(status.task_id, "task_status_test");

console.log("PASS");
