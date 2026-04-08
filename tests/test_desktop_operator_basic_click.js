"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.basicClick(
  { x: 100, y: 200 },
  {
    commandId: "desktop_basic_click_test",
    uiExecutor: () => ({ status: 0, stdout: "", stderr: "" }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.basic_click");
assert.deepStrictEqual(report.click_action, { x: 100, y: 200 });
console.log("PASS");
