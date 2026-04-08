"use strict";

const assert = require("assert");
const snapshotWriter = require("../control_plane/local_control_agent/snapshot_writer");
const desktopOperator = require("../control_plane/local_control_agent/desktop_operator");

desktopOperator.typeText(
  { text: "snapshot-check" },
  {
    commandId: "desktop_snapshot_test",
    uiExecutor: () => ({ status: 0, stdout: "", stderr: "" }),
  }
);

const snapshot = snapshotWriter.writeSnapshot({ agent_status: "desktop-test" });
assert.strictEqual(snapshot.last_desktop_action, "desktop.type_text");
assert.ok(snapshot.last_typed_text_hash);
assert.strictEqual(snapshot.desktop_status, "PASS");
console.log("PASS");
