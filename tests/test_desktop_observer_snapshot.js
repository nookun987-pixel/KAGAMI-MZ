"use strict";

const assert = require("assert");
const desktopObserver = require("../control_plane/local_control_agent/desktop_observer");
const snapshotWriter = require("../control_plane/local_control_agent/snapshot_writer");

desktopObserver.captureDesktopState({}, {
  commandId: "desktop_capture_state_test",
  collectWindowState: () => ({
    active_title: "Visual Studio Code",
    windows: [
      { title: "Visual Studio Code", process: "code", pid: 102 },
      { title: "ChatGPT - Chrome", process: "chrome", pid: 101 },
    ],
  }),
});

const snapshot = snapshotWriter.writeSnapshot({ agent_status: "observer-test" });
assert.ok(snapshot.active_window);
assert.ok(typeof snapshot.active_window.title === "string");
assert.ok(Array.isArray(snapshot.open_windows));
assert.ok(snapshot.desktop_state_last_capture);
console.log("PASS");
