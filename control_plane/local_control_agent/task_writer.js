"use strict";

const fs = require("fs");
const path = require("path");
const { TASK_ROOT } = require("./config");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function createTask(command) {
  ensureDir(TASK_ROOT);
  const id = `TASK_${Date.now()}`;
  const task = {
    id,
    command,
    prompt: `Implement: ${command}`,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(TASK_ROOT, id + ".json"), JSON.stringify(task, null, 2));
  return task;
}

module.exports = { createTask };