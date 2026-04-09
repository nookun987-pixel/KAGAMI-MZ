"use strict";

const assert = require("assert");
const fs = require("fs");

const { buildTaskBrief, writeTaskBriefArtifact } = require("../task_brief_builder");

const contract = {
  task_id: `task_brief_${Date.now()}`,
  objective: "Add governance report writer module",
  scope_in: ["control_plane/governance_report_writer.js"],
  forbidden_paths: ["runtime/drive_queue/runtime.js"],
  success_criteria: ["module exists", "tests pass"],
  system_constraints: ["image_runtime_untouched"],
};

const result = buildTaskBrief(contract, {
  tests_required: ["node control_plane\\tests\\test_governance_report_writer.js"],
});

assert.strictEqual(result.status, "PASS");
assert.ok(result.brief.implementation_brief.what_to_build.includes("governance report writer"));
const artifactPath = writeTaskBriefArtifact(contract.task_id, result.brief);
assert.ok(fs.existsSync(artifactPath));
fs.unlinkSync(artifactPath);

console.log("PASS");
