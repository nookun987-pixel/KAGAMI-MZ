"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");

function resolveTaskFile(taskId) {
  if (!taskId) return null;
  return path.join(config.TASKS_DIR, `${String(taskId).trim()}.md`);
}

function resolveTaskIntake(commandEntry) {
  const command = commandEntry.payload || commandEntry;
  const payload = command.payload || {};
  const taskId = String(payload.task_id || command.command_id || "task").trim();
  const taskPath = resolveTaskFile(taskId);
  return {
    task_id: taskId,
    action: command.action,
    command,
    source_file: commandEntry.filePath || null,
    payload,
    requested_by: command.requested_by || "local_control_agent",
    approval_status: command.approval && command.approval.status || "pending",
    task_path: taskPath,
    task_present: !!(taskPath && fs.existsSync(taskPath)),
    resolved_at: new Date().toISOString(),
  };
}

module.exports = {
  resolveTaskFile,
  resolveTaskIntake,
};
