"use strict";

const path = require("path");

const config = require("./local_control_agent/config");

function sanitizeSlug(value) {
  return String(value || "task").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "task";
}

function buildTaskMarkdown(intent, taskId) {
  const lines = [
    `# ${taskId}`,
    "",
    `source: ${intent.source}`,
    `intent_id: ${intent.intent_id}`,
    `goal: ${intent.goal}`,
    `risk_level: ${intent.risk_level}`,
    "",
    "constraints:",
  ];
  for (const [key, value] of Object.entries(intent.constraints || {})) {
    lines.push(`- ${key}: ${JSON.stringify(value)}`);
  }
  if (Array.isArray(intent.refs) && intent.refs.length) {
    lines.push("");
    lines.push("refs:");
    for (const ref of intent.refs) lines.push(`- ${ref}`);
  }
  lines.push("");
  lines.push("execution_policy:");
  lines.push("- plan_first_required: true");
  lines.push("- approval_engine_required: true");
  lines.push("- bounded_scope: tasks_only");
  return `${lines.join("\n")}\n`;
}

function resolveIntentToTask(intent) {
  const taskId = `${sanitizeSlug(intent.source)}_${sanitizeSlug(intent.goal).slice(0, 24)}_${Date.now()}`;
  const taskPath = path.join(config.TASKS_DIR, `${taskId}.md`);
  return {
    task_id: taskId,
    task_path: taskPath,
    intent_ref: intent.intent_id,
    content: buildTaskMarkdown(intent, taskId),
  };
}

module.exports = {
  resolveIntentToTask,
};
