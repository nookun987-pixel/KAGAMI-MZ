"use strict";

const assert = require("assert");
const snapshotWriter = require("../control_plane/local_control_agent/snapshot_writer");
const { readRuntimeStatus } = require("../control_plane/runtime_status_reader");

snapshotWriter.writeSnapshot({ agent_status: "status-reader-test" });
const status = readRuntimeStatus();

assert.strictEqual(status.machine_id, "desktop_main");
assert.strictEqual(status.node_role, "commander");
assert.ok(status.active_runtime);
assert.ok(status.system_entrypoints);
console.log("PASS");
