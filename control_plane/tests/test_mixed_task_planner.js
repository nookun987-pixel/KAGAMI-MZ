"use strict";

const assert = require("assert");

const { planMixedTask } = require("../mixed_task_planner");

const webToWrite = planMixedTask("kiem tra web nay https://example.com va ghi note vao repo", { parent_task_id: "task_demo" });
assert.strictEqual(webToWrite.is_mixed, true);
assert.strictEqual(webToWrite.steps.length, 2);
assert.strictEqual(webToWrite.steps[0].executor_lane, "web_ops");
assert.strictEqual(webToWrite.steps[1].executor_lane, "dev_write");

const readToWrite = planMixedTask("doc workflow hien tai roi sua file tong ket", { parent_task_id: "task_demo2" });
assert.strictEqual(readToWrite.is_mixed, true);
assert.strictEqual(readToWrite.steps[0].executor_lane, "dev_read");
assert.strictEqual(readToWrite.steps[1].executor_lane, "dev_write");

console.log("PASS");
