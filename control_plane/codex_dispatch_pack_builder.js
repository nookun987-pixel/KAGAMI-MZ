"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");

function buildCodexDispatchPack(contract, brief, context = {}) {
  const dispatch = {
    dispatch_id: `dispatch_${contract.task_id}_${crypto.createHash("sha1").update(contract.contract_fingerprint).digest("hex").slice(0, 8)}`,
    task_id: contract.task_id,
    task_type: contract.task_type,
    repo_path: config.ROOT,
    branch_policy: context.branch_policy || "reviewed_branch_or_explicit_approved_path",
    scope_in: contract.scope_in,
    forbidden_paths: contract.forbidden_paths,
    system_constraints: contract.system_constraints,
    approval_tier: contract.approval_tier,
    implementation_brief: brief.implementation_brief,
    files_expected_to_change: context.files_expected_to_change || contract.target_files,
    tests_required: brief.implementation_brief.tests_must_pass,
    executor_lane: context.executor_lane || null,
    mixed_plan: context.mixed_plan || null,
    output_report_schema: context.output_report_schema || {
      status: "PASS|FAIL|BLOCKED",
      files_changed: [],
      tests_run: [],
      artifacts_written: [],
      summary: "string",
    },
  };
  return { status: "PASS", dispatch };
}

function writeCodexDispatchPackArtifact(taskId, dispatch) {
  const filePath = path.join(config.CODEX_DISPATCH_PACK_DIR, `${taskId}.codex_dispatch_pack.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, dispatch);
  return filePath;
}

module.exports = {
  buildCodexDispatchPack,
  writeCodexDispatchPackArtifact,
};
