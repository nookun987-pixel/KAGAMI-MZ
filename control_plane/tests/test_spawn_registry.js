"use strict";

const assert = require("assert");

const { registerSpawn, updateSpawn, listActiveProcesses } = require("../spawn_registry");

const record = registerSpawn({
  command: "node",
  args: ["-e", "console.log('ok')"],
  owner_module: "test_spawn_registry",
  status: "RUNNING",
});

assert.ok(record.process_id);
const updated = updateSpawn(record.process_id, { status: "SUCCEEDED", exit_code: 0 });
assert.strictEqual(updated.status, "SUCCEEDED");
const active = listActiveProcesses();
assert.ok(Array.isArray(active.processes));
console.log("PASS");
