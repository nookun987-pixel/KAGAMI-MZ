"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const config = require("../control_plane/local_control_agent/config");
const { enforcePlanFirst } = require("../control_plane/plan_guard");

fs.mkdirSync(config.TASKS_DIR, { recursive: true });
const taskPath = path.join(config.TASKS_DIR, "plan_guard_test.md");
fs.writeFileSync(taskPath, "# plan\n", "utf8");

const readAllowed = enforcePlanFirst("read", { payload: {} });
assert.strictEqual(readAllowed.allowed, true);

const writeBlocked = enforcePlanFirst("write", { payload: {} });
assert.strictEqual(writeBlocked.allowed, false);
assert.strictEqual(writeBlocked.reason, "missing_task_id");

const writeAllowed = enforcePlanFirst("write", { payload: { task_id: "plan_guard_test" } });
assert.strictEqual(writeAllowed.allowed, true);
assert.strictEqual(writeAllowed.task_path, taskPath);

fs.unlinkSync(taskPath);
console.log("PASS");
