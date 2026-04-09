"use strict";

const assert = require("assert");

const { evaluateCleanupScope } = require("../cleanup_scope_guard");

assert.strictEqual(evaluateCleanupScope({
  objective: "Repair dead report link in control plane",
  scope_in: ["control_plane/workflow_registry.js"],
  scope_out: ["runtime/drive_queue/runtime.js"],
}).allowed, true);

assert.strictEqual(evaluateCleanupScope({
  objective: "Delete all runtime folders recursively",
  scope_in: ["runtime/colab_worker"],
}).allowed, false);

console.log("PASS");
