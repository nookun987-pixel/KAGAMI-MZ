"use strict";

const assert = require("assert");

const { readGoalStateRegistry, getGoalState } = require("../goal_state_registry");

const registry = readGoalStateRegistry();
assert.ok(Array.isArray(registry.goals));
assert.ok(registry.goals.length >= 1);
assert.ok(getGoalState("goal_guarded_autonomy"));

console.log("PASS");
