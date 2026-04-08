"use strict";

const assert = require("assert");

const { validateToolCommand } = require("../control_plane/tool_validator");

const validRead = validateToolCommand({
  action: "repo.status",
  payload: {},
});
assert.strictEqual(validRead.valid, true);
assert.strictEqual(validRead.tool_type, "read");

const invalidWrite = validateToolCommand({
  action: "repo.commit",
  payload: {
    message: "x",
    files: ["a.js"],
  },
});
assert.strictEqual(invalidWrite.valid, false);
assert.strictEqual(invalidWrite.reason, "missing_field:task_id");

const validWrite = validateToolCommand({
  action: "repo.commit",
  payload: {
    message: "x",
    files: ["a.js"],
    task_id: "task_001",
  },
});
assert.strictEqual(validWrite.valid, true);
assert.strictEqual(validWrite.tool_type, "write");

console.log("PASS");
