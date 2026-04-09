"use strict";

const assert = require("assert");

const { routeOperatorCommand } = require("../operator_router");

const dev = routeOperatorCommand("fix parser taotask in control_plane/task_goal_registry.js");
assert.strictEqual(dev.executor_lane, "dev_write");
assert.strictEqual(dev.task_type, "patch_bug");
assert.ok(dev.target_files.includes("control_plane/task_goal_registry.js"));

const web = routeOperatorCommand("kiem tra trang thai web nay https://example.com");
assert.strictEqual(web.executor_lane, "web_ops");
assert.strictEqual(web.task_type, "web_status_check");
assert.ok(web.scope_in.includes("https://example.com"));

const read = routeOperatorCommand("doc workflow hien tai");
assert.strictEqual(read.executor_lane, "dev_read");
assert.strictEqual(read.task_type, "operator_action");

console.log("PASS");
