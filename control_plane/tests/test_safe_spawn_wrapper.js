"use strict";

const assert = require("assert");

const { runSpawnSync, runExecFileSync } = require("../safe_spawn_wrapper");

const syncResult = runSpawnSync({
  command: process.execPath,
  args: ["-e", "console.log('wrapper-ok')"],
  timeout_ms: 5000,
});
assert.strictEqual(syncResult.status, "PASS");
assert.ok(syncResult.stdout.includes("wrapper-ok"));

const execResult = runExecFileSync({
  command: "git",
  args: ["rev-parse", "--is-inside-work-tree"],
  timeout_ms: 5000,
});
assert.strictEqual(execResult.status, "PASS");
console.log("PASS");
