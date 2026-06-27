"use strict";

const path = require("path");
const { writeJson } = require("./bridge_writer");
const config = require("./config");

function buildCodexTask(command) {
  const taskId = `codex_${Date.now()}`;
  const filePath = path.join(config.STATE_DIR, `${taskId}.json`);
  const record = {
    task_id: taskId,
    source_command_id: command.command_id,
    action: command.action,
    scope: command.payload || {},
    approval: command.approval || {},
    result_pointer: null,
    created_at: new Date().toISOString(),
  };
  writeJson(filePath, record);
  return { taskId, filePath, record };
}

module.exports = {
  buildCodexTask,
};
