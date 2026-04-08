"use strict";

const assert = require("assert");
const fs = require("fs");
const { writeSnapshot } = require("../control_plane/local_control_agent/snapshot_writer");
const config = require("../control_plane/local_control_agent/config");
const { resetBridge } = require("./test_commander_bridge_helpers");

resetBridge();
writeSnapshot({ agent_status: "testing" });
const snapshot = JSON.parse(fs.readFileSync(config.SYSTEM_RUNTIME_SNAPSHOT, "utf8"));
assert.strictEqual(snapshot.agent_status, "testing");
assert.strictEqual(snapshot.active_runtime.hub, "MIKAGE/index.js");
console.log("PASS");
