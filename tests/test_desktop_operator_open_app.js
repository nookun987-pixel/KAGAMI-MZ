"use strict";

const assert = require("assert");
const fs = require("fs");

const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");
const config = require("../control_plane/local_control_agent/config");

const result = desktopOperator.openApp(
  { app: "cmd" },
  {
    commandId: "desktop_open_app_test",
    startProcess: () => ({ status: 0 }),
  }
);

assert.strictEqual(result.status, "PASS");
assert.ok(fs.existsSync(result.report_path));
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.open_app");
assert.deepStrictEqual(report.opened_apps, ["cmd"]);
assert.strictEqual(JSON.parse(fs.readFileSync(config.LOCAL_AGENT_LAST_DESKTOP_ACTION, "utf8")).action, "desktop.open_app");
console.log("PASS");
