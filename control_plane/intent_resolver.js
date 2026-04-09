"use strict";

const path = require("path");

const config = require("./local_control_agent/config");
const { inferTaskTypeFromObjective } = require("./task_goal_registry");

function sanitizeSlug(value) {
  return String(value || "task").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "task";
}

function buildTaskMarkdown(intent, taskId) {
  const explicitScopeIn = Array.isArray(intent.constraints && intent.constraints.scope_in) ? intent.constraints.scope_in : [];
  const explicitScopeOut = Array.isArray(intent.constraints && intent.constraints.scope_out) ? intent.constraints.scope_out : [];
  const explicitSuccess = Array.isArray(intent.constraints && intent.constraints.success_criteria) ? intent.constraints.success_criteria : [];
  const scopeIn = explicitScopeIn.length ? explicitScopeIn : Object.keys(intent.constraints || {}).map((key) => `${key}: ${JSON.stringify(intent.constraints[key])}`);
  const refs = Array.isArray(intent.refs) ? intent.refs : [];
  const lines = [
    `# ${taskId}`,
    "",
    `source: ${intent.source}`,
    `intent_id: ${intent.intent_id}`,
    `task_type: ${inferTaskTypeFromObjective(intent.goal, intent.source === "completion" ? "refactor_safe" : "patch_bug")}`,
    "",
    "## Objective",
    intent.goal,
    "",
    "## Scope In",
    ...(scopeIn.length ? scopeIn.map((item) => `- ${item}`) : ["- bounded control_plane update only"]),
    "",
    "## Scope Out",
    ...(explicitScopeOut.length ? explicitScopeOut.map((item) => `- ${item}`) : [
      "- start_mikage.bat",
      "- MIKAGE/index.js",
      "- runtime/drive_queue/runtime.js",
      "- runtime/colab_worker/*",
    ]),
    "",
    "## Success Criteria",
    ...(explicitSuccess.length ? explicitSuccess.map((item) => `- ${item}`) : [
      "- bounded task artifact is created",
      "- approval_engine remains enforced",
      "- image runtime remains untouched",
    ]),
    "",
    "## System Constraints",
    "- plan_first_required",
    "- approval_engine_required",
    "- bounded_scope_tasks_only",
    "",
  ];
  if (refs.length) {
    lines.push("");
    lines.push("## Refs");
    for (const ref of refs) lines.push(`- ${ref}`);
  }
  return `${lines.join("\n")}\n`;
}

function resolveIntentToTask(intent) {
  const taskId = `${sanitizeSlug(intent.source)}_${sanitizeSlug(intent.goal).slice(0, 24)}_${Date.now()}`;
  const taskPath = path.join(config.TASKS_DIR, `${taskId}.md`);
  const explicitTaskType = intent.constraints && intent.constraints.task_type;
  return {
    task_id: taskId,
    task_path: taskPath,
    intent_ref: intent.intent_id,
    task_type: explicitTaskType || inferTaskTypeFromObjective(intent.goal, intent.source === "completion" ? "refactor_safe" : "patch_bug"),
    content: buildTaskMarkdown(intent, taskId),
  };
}

module.exports = {
  resolveIntentToTask,
};
