"use strict";

const assert = require("assert");

const config = require("../local_control_agent/config");
const { writeJson } = require("../local_control_agent/bridge_writer");
const { registerSpawn } = require("../spawn_registry");
const { runWatchdog, readProcessIncidents } = require("../process_watchdog");

writeJson(config.SPAWN_REGISTRY_PATH, { generated_at: null, processes: [] });
registerSpawn({
  command: "node",
  args: ["-e", "setTimeout(()=>{},1000)"],
  owner_module: "test_watchdog",
  status: "RUNNING",
  started_at: new Date(Date.now() - (config.PROCESS_LIMITS.stale_running_ms + 1000)).toISOString(),
});

const watchdog = runWatchdog();
assert.strictEqual(watchdog.status, "PASS");
const incidents = readProcessIncidents();
assert.ok((incidents.incidents || []).length >= 1);
console.log("PASS");
