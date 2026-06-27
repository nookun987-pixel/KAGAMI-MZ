"use strict";

const assert = require("assert");
const fs = require("fs");

const { buildDiffPreview } = require("../diff_preview_builder");

const noDiff = buildDiffPreview({
  command_id: "cmd_no_diff",
  action: "repo.commit",
  payload: { task_id: "no_diff_task" },
});
assert.strictEqual(noDiff.status, "NO_DIFF_AVAILABLE");
assert.ok(fs.existsSync(noDiff.artifact_path));

const withDiff = buildDiffPreview({
  command_id: "cmd_with_diff",
  action: "create_file",
  payload: {
    task_id: "with_diff_task",
    path: "docs/example.txt",
    content: "hello",
  },
});
assert.strictEqual(withDiff.status, "PASS");

console.log("PASS");
