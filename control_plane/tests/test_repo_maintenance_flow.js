"use strict";

const assert = require("assert");

const service = require("../commander_service");

const health = service.getRepoHealthView();
const heal = service.getSelfHealPlan();

assert.strictEqual(health.status, "PASS");
assert.strictEqual(heal.status, "PASS");
assert.ok(heal.self_heal_plan);

console.log("PASS");
