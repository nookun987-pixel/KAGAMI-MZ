"use strict";

const assert = require("assert");
const { diskSmartScan } = require("../control_plane/local_control_agent/disk_maintenance_agent");

const report = diskSmartScan();
assert.ok(typeof report.candidate_count === "number");
assert.ok(Array.isArray(report.candidates));
console.log("PASS");
