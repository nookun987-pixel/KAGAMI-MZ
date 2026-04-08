"use strict";

const assert = require("assert");
const { runtimeHealth } = require("../control_plane/local_control_agent/runtime_operator");

const health = runtimeHealth();
assert.strictEqual(health.active_runtime.queue_runtime, "runtime/drive_queue/runtime.js");
assert.ok(health.files_exist.every((item) => item.exists));
console.log("PASS");
