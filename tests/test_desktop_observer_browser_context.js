"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopObserver = require("../control_plane/local_control_agent/desktop_observer");

const result = desktopObserver.getBrowserContext({}, {
  commandId: "desktop_observer_browser_test",
  collectWindowState: () => ({
    active_title: "KAGAMI-MZ pull request - GitHub - Chrome",
    windows: [
      { title: "KAGAMI-MZ pull request - GitHub - Chrome", process: "chrome", pid: 101 },
    ],
  }),
});

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.browser_context.target, "github");
console.log("PASS");
