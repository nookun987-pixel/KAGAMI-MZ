"use strict";

const assert = require("assert");
const fs = require("fs");

const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.runShell(
  { command: "git status --short" },
  {
    commandId: "desktop_shell_test",
    execShell: () => " M control_plane/local_control_agent/send_command.js\n",
  }
);

assert.strictEqual(result.status, "PASS");
assert.ok(fs.existsSync(result.report_path));
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.run_shell");
assert.ok(report.stdout_preview.includes("send_command.js"));
console.log("PASS");
