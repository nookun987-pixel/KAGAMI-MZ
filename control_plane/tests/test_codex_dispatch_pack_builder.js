"use strict";

const assert = require("assert");
const fs = require("fs");

const { buildTaskBrief } = require("../task_brief_builder");
const { buildCodexDispatchPack, writeCodexDispatchPackArtifact } = require("../codex_dispatch_pack_builder");

const contract = {
  task_id: `dispatch_pack_${Date.now()}`,
  contract_fingerprint: "abc123",
  objective: "Add task dispatch pack builder",
  scope_in: ["control_plane/codex_dispatch_pack_builder.js"],
  target_files: ["control_plane/codex_dispatch_pack_builder.js"],
  forbidden_paths: ["MIKAGE/index.js"],
  success_criteria: ["dispatch pack written"],
  system_constraints: ["approval_engine_required"],
};

const brief = buildTaskBrief(contract, {
  tests_required: ["node control_plane\\tests\\test_codex_dispatch_pack_builder.js"],
}).brief;
const result = buildCodexDispatchPack(contract, brief);

assert.strictEqual(result.status, "PASS");
assert.strictEqual(result.dispatch.task_id, contract.task_id);
assert.deepStrictEqual(result.dispatch.files_expected_to_change, contract.target_files);
const artifactPath = writeCodexDispatchPackArtifact(contract.task_id, result.dispatch);
assert.ok(fs.existsSync(artifactPath));
fs.unlinkSync(artifactPath);

console.log("PASS");
