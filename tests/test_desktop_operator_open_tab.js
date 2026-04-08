"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const url = "https://github.com/nookun987-pixel/KAGAMI-MZ/pull/1";
const result = desktopOperator.openTab(
  { url },
  {
    commandId: "desktop_open_tab_test",
    startProcess: () => ({ status: 0 }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.open_tab");
assert.strictEqual(report.tab_target, url);
console.log("PASS");
