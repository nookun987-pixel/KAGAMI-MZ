"use strict";

const assert = require("assert");

const dispatcher = require("../local_control_agent/codex_dispatcher");
const { createExecutorHandoff } = require("../executor_handoff_manager");

const dispatch = {
  dispatch_id: `dispatch_${Date.now()}`,
  repo_path: "d:\\KAGAMI-MZ",
  branch_policy: "reviewed_branch",
};

const result = createExecutorHandoff(dispatcher, {
  task_id: `task_handoff_${Date.now()}`,
  workflow_id: "task_handoff",
  dispatch,
  dispatch_ref: "control_plane/commander_bridge/state/codex_dispatch_packs/example.json",
  executor: "codex",
});

assert.strictEqual(result.status, "PASS");
assert.strictEqual(result.job.status, "DISPATCHED");
assert.strictEqual(result.handoff.status, "DISPATCHED");

console.log("PASS");
