"use strict";

const assert = require("assert");

const { governedSpawnSync, getGovernorStatus } = require("../process_governor");

const result = governedSpawnSync({
  command: process.execPath,
  args: ["-e", "console.log('governor-ok')"],
  owner_module: "test_process_governor",
  timeout_ms: 5000,
});

assert.strictEqual(result.status, "PASS");
const view = getGovernorStatus(20);
assert.ok(Array.isArray(view.recent_processes.processes));
console.log("PASS");
