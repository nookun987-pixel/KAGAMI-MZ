"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function taskLifecyclePath(taskId) {
  return path.join(config.TASK_LIFECYCLE_DIR, `${String(taskId).trim()}.json`);
}

function appendLifecycleEvent(input) {
  const filePath = taskLifecyclePath(input.task_id);
  const current = readJsonSafe(filePath, {
    task_id: input.task_id,
    events: [],
  });
  const event = {
    event_id: `evt_${Date.now()}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id,
    stage: input.stage,
    status: input.status,
    summary: input.summary || "",
    artifact_refs: input.artifact_refs || [],
    timestamp: new Date().toISOString(),
  };
  current.events = Array.isArray(current.events) ? current.events : [];
  current.events.push(event);
  writeJson(filePath, current);
  return event;
}

function readTaskLifecycle(taskId) {
  return readJsonSafe(taskLifecyclePath(taskId), {
    task_id: taskId,
    events: [],
  });
}

module.exports = {
  appendLifecycleEvent,
  readTaskLifecycle,
};
