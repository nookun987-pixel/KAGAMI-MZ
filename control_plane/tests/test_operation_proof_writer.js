"use strict";

const assert = require("assert");
const fs = require("fs");

const { writeOperationProof, readOperationProofs } = require("../operation_proof_writer");

const taskId = `task_proof_writer_${Date.now()}`;
const written = writeOperationProof({
  workflow_id: `task_${taskId}`,
  task_id: taskId,
  command_received: { command_id: `cmd_${taskId}` },
  final_verdict: "PASS",
  refs: ["ref_a", "ref_b"],
});

assert.ok(fs.existsSync(written.artifact_path));
assert.strictEqual(written.proof.task_id, taskId);

const listed = readOperationProofs(5);
assert.ok(Array.isArray(listed.items));
assert.ok(listed.items.some((item) => item.proof.task_id === taskId));

console.log("PASS");
