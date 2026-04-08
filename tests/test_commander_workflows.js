"use strict";

const assert = require("assert");

const { WORKFLOW_STEPS } = require("../control_plane/commander_service");

assert.ok(WORKFLOW_STEPS.WAKE_VERIFY);
assert.ok(WORKFLOW_STEPS.DESKTOP_CHECK);
assert.ok(WORKFLOW_STEPS.REPO_CHECK);
assert.ok(WORKFLOW_STEPS.DAILY_HEALTH);
assert.ok(WORKFLOW_STEPS.SAFE_SHUTDOWN);

assert.ok(WORKFLOW_STEPS.WAKE_VERIFY.some((step) => step.type === "agent.start"));
assert.ok(WORKFLOW_STEPS.WAKE_VERIFY.some((step) => step.action === "desktop.get_active_window"));
assert.ok(WORKFLOW_STEPS.WAKE_VERIFY.some((step) => step.action === "repo.status"));

assert.ok(WORKFLOW_STEPS.DAILY_HEALTH.some((step) => step.action === "runtime.health"));
assert.ok(WORKFLOW_STEPS.DAILY_HEALTH.some((step) => step.action === "disk.smart_scan"));

console.log("PASS");
