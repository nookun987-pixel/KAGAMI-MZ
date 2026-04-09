"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");

function buildTaskBrief(contract, context = {}) {
  const brief = {
    task_id: contract.task_id,
    implementation_brief: {
      what_to_build: contract.objective,
      where_to_build: contract.scope_in,
      do_not_touch: contract.forbidden_paths,
      tests_must_pass: context.tests_required || ["node MIKAGE\\mikage.test.js"],
      artifacts_required: context.artifacts_required || [
        "task_contract.json",
        "task_brief.json",
        "codex_dispatch_pack.json",
      ],
      success_criteria: contract.success_criteria,
      system_constraints: contract.system_constraints,
    },
    generated_at: context.now || new Date().toISOString(),
  };
  return { status: "PASS", brief };
}

function writeTaskBriefArtifact(taskId, brief) {
  const filePath = path.join(config.TASK_BRIEF_DIR, `${taskId}.task_brief.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, brief);
  return filePath;
}

module.exports = {
  buildTaskBrief,
  writeTaskBriefArtifact,
};
