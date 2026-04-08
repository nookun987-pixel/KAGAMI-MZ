"use strict";

const assert = require("assert");
const fs = require("fs");
const { writeBringupReport, BRINGUP_REPORT_PATH } = require("../control_plane/local_control_agent/bringup_report");

const report = writeBringupReport();
assert.ok(fs.existsSync(BRINGUP_REPORT_PATH));
assert.ok(report.machine_id);
assert.ok(report.node_role);
assert.ok(report.checklist);
console.log("PASS");
