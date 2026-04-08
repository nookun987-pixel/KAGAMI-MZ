"use strict";

const assert = require("assert");
const desktopObserver = require("../control_plane/local_control_agent/desktop_observer");

const collector = () => ({
  active_title: "ChatGPT - Chrome",
  windows: [
    { title: "ChatGPT - Chrome", process: "chrome", pid: 101 },
    { title: "Visual Studio Code", process: "code", pid: 102 },
  ],
});

const windowResult = desktopObserver.verifyWindow({ target: "chrome" }, {
  commandId: "desktop_verify_window_test",
  collectWindowState: collector,
});
assert.strictEqual(windowResult.status, "PASS");

const tabResult = desktopObserver.verifyTab({ target: "chatgpt" }, {
  commandId: "desktop_verify_tab_test",
  collectWindowState: collector,
});
assert.strictEqual(tabResult.status, "PASS");
console.log("PASS");
