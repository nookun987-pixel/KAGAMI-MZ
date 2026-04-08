"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");
const { collectTouchedFiles } = require("./runtime_boundary_guard");

function summarizeAction(command) {
  return `Preview ${command.action} for task ${command.payload && command.payload.task_id || command.command_id}`;
}

function buildActionPreview(command, context = {}) {
  const taskId = command.payload && command.payload.task_id || command.command_id;
  if (!taskId) {
    return { status: "FAIL", reason: "missing_task_id_for_preview" };
  }
  const preview = {
    action_summary: summarizeAction(command),
    target_files: collectTouchedFiles(command),
    operation_type: context.tool_type || "unknown",
    expected_effect: context.expected_effect || `Execute ${command.action}`,
    risk_note: context.risk_note || "review before approval",
    boundary_note: context.boundary_note || "bounded by runtime boundary guard",
    plan_reference: context.plan_reference || path.join(config.TASKS_DIR, `${taskId}.md`),
    generated_at: new Date().toISOString(),
  };
  const outPath = path.join(config.ACTION_PREVIEW_DIR, `${taskId}_${Date.now()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  writeJson(outPath, preview);
  return {
    status: "PASS",
    artifact_path: outPath,
    preview,
  };
}

module.exports = {
  buildActionPreview,
};
