"use strict";

const assert = require("assert");

const { resolveTaskType, validateTaskGoal, normalizeObjectiveText, routeOperatorIntent } = require("../task_goal_registry");

assert.strictEqual(resolveTaskType({ objective: "Add module for governance snapshot writer" }), "add_module");
assert.strictEqual(resolveTaskType({ objective: "Fix retry queue duplicate failure bug" }), "patch_bug");
assert.strictEqual(validateTaskGoal("operator_action", "Inspect approval queue and summarize state").valid, true);
assert.strictEqual(validateTaskGoal("refactor_safe", "improve system").valid, false);
assert.strictEqual(resolveTaskType({ objective: "kiem tra trang thai he thong" }), "operator_action");
assert.strictEqual(validateTaskGoal("operator_action", "kiem tra repo control_plane dang thieu gi").valid, true);
assert.strictEqual(validateTaskGoal("operator_action", "bao cao ngan tinh trang he thong").valid, true);
assert.strictEqual(validateTaskGoal("operator_action", "xoa toan bo repo").reason, "destructive_objective_blocked");
assert.strictEqual(normalizeObjectiveText("TASK:\nkiem tra trang thai he thong"), "kiem tra trang thai he thong");
assert.strictEqual(routeOperatorIntent("kiem tra trang thai he thong").internal_action, "runtime_checker");
assert.strictEqual(routeOperatorIntent("doc workflow hien tai va bao cao ngan").internal_action, "workflow_reader");
assert.strictEqual(routeOperatorIntent("kiem tra repo control_plane dang thieu gi").internal_action, "repo_inspector");
assert.strictEqual(routeOperatorIntent("mot operator intent an toan nhung khong trung mau").internal_action, "inspection_fallback");
assert.strictEqual(routeOperatorIntent("retry loi gan nhat").internal_action, "failure_retry");

console.log("PASS");
