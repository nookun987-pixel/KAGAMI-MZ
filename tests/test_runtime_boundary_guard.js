"use strict";

const assert = require("assert");

const { evaluateRuntimeBoundary } = require("../control_plane/runtime_boundary_guard");

const safe = evaluateRuntimeBoundary({
  action: "repo.status",
  payload: {},
});
assert.strictEqual(safe.allowed, true);

const blocked = evaluateRuntimeBoundary({
  action: "repo.commit",
  payload: {
    files: ["runtime/drive_queue/runtime.js"],
  },
});
assert.strictEqual(blocked.allowed, false);
assert.strictEqual(blocked.reason, "runtime_sensitive_target");

console.log("PASS");
