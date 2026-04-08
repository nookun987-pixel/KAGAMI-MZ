"use strict";

const fs = require("fs");
const path = require("path");

const TASKS_ROOT = path.join(__dirname, "..", "tasks");

function resolveTaskPath(taskId) {
  if (!taskId) return null;
  return path.join(TASKS_ROOT, `${String(taskId).trim()}.md`);
}

function enforcePlanFirst(toolType, command) {
  if (!["write", "destructive"].includes(String(toolType || ""))) {
    return {
      allowed: true,
      reason: "plan_not_required",
      task_id: null,
      task_path: null,
    };
  }
  const taskId = command && command.payload && command.payload.task_id;
  if (!taskId) {
    return {
      allowed: false,
      reason: "missing_task_id",
      task_id: null,
      task_path: null,
    };
  }
  const taskPath = resolveTaskPath(taskId);
  if (!fs.existsSync(taskPath)) {
    return {
      allowed: false,
      reason: "missing_task_plan_file",
      task_id: taskId,
      task_path: taskPath,
    };
  }
  return {
    allowed: true,
    reason: "plan_present",
    task_id: taskId,
    task_path: taskPath,
  };
}

module.exports = {
  TASKS_ROOT,
  resolveTaskPath,
  enforcePlanFirst,
};
