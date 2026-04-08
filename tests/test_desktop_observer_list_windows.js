"use strict";

const assert = require("assert");
const fs = require("fs");
const desktopObserver = require("../control_plane/local_control_agent/desktop_observer");

const result = desktopObserver.listOpenWindows({}, {
  commandId: "desktop_observer_list_test",
  collectWindowState: () => ({
    active_title: "Visual Studio Code",
    windows: [
      { title: "GitHub - Chrome", process: "chrome", pid: 101 },
      { title: "Visual Studio Code", process: "code", pid: 102 },
      { title: "Command Prompt", process: "cmd", pid: 103 },
    ],
  }),
});

assert.strictEqual(result.status, "PASS");
const report = JSON.parse(fs.readFileSync(result.report_path, "utf8"));
assert.strictEqual(report.open_windows.length, 3);
console.log("PASS");
