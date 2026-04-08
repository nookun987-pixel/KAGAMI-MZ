"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./local_control_agent/config");

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function buildRunId(workflow) {
  return `wf_${String(workflow || "workflow").toLowerCase()}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
}

function readRegistry() {
  return readJsonSafe(config.WORKFLOW_REGISTRY_JSON, {
    generated_at: null,
    latest_successful_workflow: null,
    latest_blocked_workflow: null,
    latest_failed_workflow: null,
    runs: [],
  });
}

function writeRegistry(registry) {
  writeJson(config.WORKFLOW_REGISTRY_JSON, registry);
}

function registerWorkflowRun(record) {
  const registry = readRegistry();
  registry.generated_at = new Date().toISOString();
  registry.runs = Array.isArray(registry.runs) ? registry.runs : [];
  registry.runs.unshift(record);
  registry.runs = registry.runs.slice(0, 100);
  if (record.final_verdict === "PASS") registry.latest_successful_workflow = record;
  if (record.final_verdict === "BLOCKED") registry.latest_blocked_workflow = record;
  if (record.final_verdict === "FAIL") registry.latest_failed_workflow = record;
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, record);
  return registry;
}

function getWorkflowHistory(limit = 20) {
  const registry = readRegistry();
  return {
    latest_successful_workflow: registry.latest_successful_workflow || null,
    latest_blocked_workflow: registry.latest_blocked_workflow || null,
    latest_failed_workflow: registry.latest_failed_workflow || null,
    runs: (registry.runs || []).slice(0, limit),
  };
}

function readApprovalQueue() {
  return readJsonSafe(config.APPROVAL_QUEUE_PATH, {
    generated_at: null,
    pending: [],
  });
}

function writeApprovalQueue(queue) {
  queue.generated_at = new Date().toISOString();
  writeJson(config.APPROVAL_QUEUE_PATH, queue);
}

function enqueueApproval(item) {
  const queue = readApprovalQueue();
  queue.pending = Array.isArray(queue.pending) ? queue.pending : [];
  queue.pending.unshift(item);
  writeApprovalQueue(queue);
  return item;
}

function resolveApproval(id, decision, extra = {}) {
  const queue = readApprovalQueue();
  const pending = Array.isArray(queue.pending) ? queue.pending : [];
  const index = pending.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const item = pending[index];
  pending.splice(index, 1);
  queue.pending = pending;
  writeApprovalQueue(queue);
  const resolved = {
    ...item,
    approval_state: decision,
    reviewed_by: extra.reviewed_by || "commander_operator",
    reviewed_at: new Date().toISOString(),
  };
  appendJsonl(config.APPROVAL_QUEUE_HISTORY_JSONL, resolved);
  return resolved;
}

module.exports = {
  buildRunId,
  readRegistry,
  registerWorkflowRun,
  getWorkflowHistory,
  readApprovalQueue,
  enqueueApproval,
  resolveApproval,
};
