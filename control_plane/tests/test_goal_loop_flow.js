"use strict";

const assert = require("assert");

const service = require("../commander_service");

const result = service.getNextTaskPlan();

assert.strictEqual(result.status, "PASS");
assert.ok(result.goal_state);
assert.ok(result.progress);
assert.ok(Array.isArray(result.candidates));

console.log("PASS");
