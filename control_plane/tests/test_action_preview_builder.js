"use strict";

const assert = require("assert");
const fs = require("fs");

const { buildActionPreview } = require("../action_preview_builder");

const result = buildActionPreview({
  command_id: "cmd_preview",
  action: "repo.commit",
  payload: {
    task_id: "preview_task",
    files: ["control_plane/approval_engine.js"],
  },
}, {
  tool_type: "write",
  plan_reference: "tasks/preview_task.md",
});

assert.strictEqual(result.status, "PASS");
assert.ok(fs.existsSync(result.artifact_path));
assert.strictEqual(result.preview.operation_type, "write");

console.log("PASS");
