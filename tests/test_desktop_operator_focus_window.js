"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.focusWindow(
  { target: "chrome" },
  {
    commandId: "desktop_focus_window_test",
    uiExecutor: () => ({ status: 0, stdout: "", stderr: "" }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.focus_window");
assert.strictEqual(report.focused_window, "chrome");
console.log("PASS");
