"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const config = require("../local_control_agent/config");
const { buildTaskContract, writeTaskContractArtifact } = require("../task_contract");

const taskId = `task_contract_test_${Date.now()}`;
const taskPath = path.join(config.TASKS_DIR, `${taskId}.md`);
fs.mkdirSync(path.dirname(taskPath), { recursive: true });
fs.writeFileSync(taskPath, [
  `# ${taskId}`,
  "",
  "## Objective",
  "Fix retry queue duplicate failure bug",
  "",
  "## Scope In",
  "- control_plane/retry_queue_manager.js",
  "",
  "## Scope Out",
  "- runtime/drive_queue/runtime.js",
  "",
  "## Success Criteria",
  "- retry queue dedupes correctly",
  "",
  "## System Constraints",
  "- image_runtime_untouched",
  "",
].join("\n"), "utf8");

const command = {
  command_id: "cmd_task_contract",
  action: "repo.commit",
  requested_by: "test",
  payload: {
    task_id: taskId,
    message: "fix retry queue",
    files: ["control_plane/retry_queue_manager.js"],
  },
};

const resultA = buildTaskContract(command, {
  task_path: taskPath,
  tool_type: "write",
  now: "2026-04-08T00:00:00.000Z",
});
const resultB = buildTaskContract(command, {
  task_path: taskPath,
  tool_type: "write",
  now: "2026-04-08T00:00:00.000Z",
});

assert.strictEqual(resultA.status, "PASS");
assert.deepStrictEqual(resultA.contract, resultB.contract);
assert.strictEqual(resultA.contract.objective, "Fix retry queue duplicate failure bug");
assert.strictEqual(resultA.contract.approval_tier, "ask");

const artifactPath = writeTaskContractArtifact(resultA.contract);
assert.ok(fs.existsSync(artifactPath));

fs.unlinkSync(taskPath);
fs.unlinkSync(artifactPath);

console.log("PASS");
