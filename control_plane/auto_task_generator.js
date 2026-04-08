"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readAutoTaskRegistry() {
  return readJsonSafe(config.AUTO_TASK_REGISTRY_PATH, {
    generated_at: null,
    tasks: [],
  });
}

function writeAutoTaskRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.AUTO_TASK_REGISTRY_PATH, store);
}

function buildAutoTaskFingerprint(intent, resolvedTask) {
  return crypto.createHash("sha256").update(JSON.stringify({
    intent_fingerprint: intent.fingerprint || intent.intent_id,
    goal: intent.goal,
    constraints: intent.constraints || {},
  })).digest("hex");
}

function isWithinBoundary(taskPath) {
  const normalized = path.resolve(taskPath).toLowerCase();
  return normalized.startsWith(path.resolve(config.TASKS_DIR).toLowerCase());
}

function createAutoTask(intent, resolvedTask) {
  if (!isWithinBoundary(resolvedTask.task_path)) {
    return { status: "BLOCKED", reason: "task_path_outside_tasks_dir" };
  }
  const registry = readAutoTaskRegistry();
  const fingerprint = buildAutoTaskFingerprint(intent, resolvedTask);
  const existing = (registry.tasks || []).find((item) => item.fingerprint === fingerprint);
  if (existing) {
    return { status: "BLOCKED", reason: "duplicate_auto_task", task: existing };
  }
  fs.mkdirSync(path.dirname(resolvedTask.task_path), { recursive: true });
  fs.writeFileSync(resolvedTask.task_path, resolvedTask.content, "utf8");
  const record = {
    auto_task_id: `autotask_${Date.now()}`,
    task_id: resolvedTask.task_id,
    task_path: resolvedTask.task_path,
    intent_ref: intent.intent_id,
    source: intent.source,
    goal: intent.goal,
    fingerprint,
    created_at: new Date().toISOString(),
  };
  registry.tasks = Array.isArray(registry.tasks) ? registry.tasks : [];
  registry.tasks.unshift(record);
  registry.tasks = registry.tasks.slice(0, 300);
  writeAutoTaskRegistry(registry);
  appendJsonl(config.AUTO_TASK_HISTORY_JSONL, record);
  return { status: "PASS", task: record };
}

module.exports = {
  readAutoTaskRegistry,
  createAutoTask,
};
