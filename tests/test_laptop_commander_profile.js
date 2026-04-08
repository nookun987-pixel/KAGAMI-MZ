"use strict";

const assert = require("assert");
const { resolveMachineProfile } = require("../control_plane/local_control_agent/machine_profile");

const profile = resolveMachineProfile({ machineId: "laptop_commander" });
assert.strictEqual(profile.machine_id, "laptop_commander");
assert.strictEqual(profile.node_role, "commander");
assert.ok(Array.isArray(profile.startup_urls));
assert.ok(profile.startup_urls.length > 0);
console.log("PASS");
