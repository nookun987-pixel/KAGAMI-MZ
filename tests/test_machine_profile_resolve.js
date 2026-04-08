"use strict";

const assert = require("assert");
const { resolveMachineProfile } = require("../control_plane/local_control_agent/machine_profile");

const byHostname = resolveMachineProfile({ hostname: "DESKTOP-Q1LN2G9" });
assert.strictEqual(byHostname.machine_id, "desktop_main");
assert.strictEqual(byHostname.node_role, "commander");

const byMachineId = resolveMachineProfile({ machineId: "laptop_commander" });
assert.strictEqual(byMachineId.machine_id, "laptop_commander");
console.log("PASS");
