"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopObserver = require("../control_plane/local_control_agent/desktop_observer");

const result = desktopObserver.getActiveWindow({}, {
  commandId: "desktop_observer_active_test",
  collectWindowState: () => ({
    active_title: "GitHub - Chrome",
    windows: [
      { title: "GitHub - Chrome", process: "chrome", pid: 101 },
      { title: "Visual Studio Code", process: "code", pid: 102 },
    ],
  }),
});

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.action, "desktop.get_active_window");
assert.strictEqual(report.active_window.title, "GitHub - Chrome");
console.log("PASS");
