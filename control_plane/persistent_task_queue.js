"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readPersistentTaskQueue() {
  return readJsonSafe(config.PERSISTENT_TASK_QUEUE_PATH, {
    generated_at: null,
    tasks: [],
    latest_by_task: {},
  });
}

function writePersistentTaskQueue(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.PERSISTENT_TASK_QUEUE_PATH, store);
}

function writeQueueArtifact(task) {
  const artifactPath = path.join(config.STATE_DIR, "persistent_task_queue", `${task.task_id}.queue_item.json`);
  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  writeJson(artifactPath, task);
  return artifactPath;
}

function upsertQueueItem(input = {}) {
  const store = readPersistentTaskQueue();
  const tasks = Array.isArray(store.tasks) ? store.tasks : [];
  const index = tasks.findIndex((item) => item.task_id === input.task_id);
  const now = new Date().toISOString();
  const base = index >= 0 ? tasks[index] : {
    task_id: input.task_id,
    workflow_id: input.workflow_id || `task_${input.task_id}`,
    created_at: now,
    completed_steps: [],
    failed_steps: [],
    retry_state: {
      retry_count: 0,
      retryable_failure_types: [],
      last_failure_type: null,
      last_retry_at: null,
    },
  };
  const next = {
    ...base,
    ...input,
    completed_steps: input.completed_steps || base.completed_steps || [],
    failed_steps: input.failed_steps || base.failed_steps || [],
    retry_state: {
      ...(base.retry_state || {}),
      ...(input.retry_state || {}),
    },
    updated_at: now,
  };
  const artifactPath = writeQueueArtifact(next);
  next.artifact_path = artifactPath;
  if (index >= 0) tasks[index] = next;
  else tasks.unshift(next);
  store.tasks = tasks.slice(0, 1000);
  store.latest_by_task = store.latest_by_task || {};
  store.latest_by_task[next.task_id] = next;
  writePersistentTaskQueue(store);
  appendJsonl(config.PERSISTENT_TASK_QUEUE_HISTORY_JSONL, next);
  return next;
}

function getQueueItem(taskId) {
  const store = readPersistentTaskQueue();
  return (store.tasks || []).find((item) => item.task_id === taskId) || null;
}

function listQueueItems(limit = 100) {
  const store = readPersistentTaskQueue();
  return {
    generated_at: store.generated_at,
    tasks: (store.tasks || []).slice(0, limit),
  };
}

module.exports = {
  readPersistentTaskQueue,
  writePersistentTaskQueue,
  upsertQueueItem,
  getQueueItem,
  listQueueItems,
};
