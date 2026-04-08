"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.switchTab(
  { target: "github" },
  {
    commandId: "desktop_switch_tab_test",
    startProcess: () => ({ status: 0 }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.switch_tab");
assert.strictEqual(report.tab_target, "github");
console.log("PASS");
