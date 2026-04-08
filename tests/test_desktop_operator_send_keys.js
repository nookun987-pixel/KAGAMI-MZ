"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.sendKeys(
  { keys: "ctrl+l" },
  {
    commandId: "desktop_send_keys_test",
    uiExecutor: () => ({ status: 0, stdout: "", stderr: "" }),
  }
);

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.send_keys");
assert.strictEqual(report.sent_keys, "ctrl+l");
console.log("PASS");
