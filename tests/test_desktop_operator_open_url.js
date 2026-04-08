"use strict";

const assert = require("assert");
const fs = require("fs");

const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

const result = desktopOperator.openUrl(
  { url: "https://github.com/nookun987-pixel/KAGAMI-MZ/pull/1" },
  {
    commandId: "desktop_open_url_test",
    startProcess: () => ({ status: 0 }),
  }
);

assert.strictEqual(result.status, "PASS");
assert.ok(fs.existsSync(result.report_path));
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.open_url");
assert.deepStrictEqual(report.opened_urls, ["https://github.com/nookun987-pixel/KAGAMI-MZ/pull/1"]);
console.log("PASS");
