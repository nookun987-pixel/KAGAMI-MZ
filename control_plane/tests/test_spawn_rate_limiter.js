"use strict";

const assert = require("assert");

const config = require("../local_control_agent/config");
const { writeJson } = require("../local_control_agent/bridge_writer");
const { evaluateSpawnRate, recordSpawnLaunch, recordSpawnFailure } = require("../spawn_rate_limiter");

writeJson(config.SPAWN_RATE_LIMITER_PATH, { generated_at: null, launches: [], failures: [], cooldown_until: null });
recordSpawnLaunch({ command: "cmd", visible_window: true, owner_module: "test" }, Date.now());
recordSpawnLaunch({ command: "cmd", visible_window: true, owner_module: "test" }, Date.now());
const limited = evaluateSpawnRate({ command: "cmd", visible_window: true }, Date.now());
assert.strictEqual(limited.allowed, false);

writeJson(config.SPAWN_RATE_LIMITER_PATH, { generated_at: null, launches: [], failures: [], cooldown_until: null });
recordSpawnFailure({ command: "node", owner_module: "test", reason: "x" }, Date.now());
recordSpawnFailure({ command: "node", owner_module: "test", reason: "y" }, Date.now());
recordSpawnFailure({ command: "node", owner_module: "test", reason: "z" }, Date.now());
const cooldown = evaluateSpawnRate({ command: "node", visible_window: false }, Date.now());
assert.strictEqual(cooldown.allowed, false);
console.log("PASS");
