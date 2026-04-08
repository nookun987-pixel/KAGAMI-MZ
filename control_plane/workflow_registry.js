"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./local_control_agent/config");
const {
  readApprovalInbox,
  createApprovalItem,
  resolveApprovalItem,
} = require("./approval_inbox_store");

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
    latest_task_runs: {},
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
  registry.latest_task_runs = registry.latest_task_runs || {};
  if (record.task_id) registry.latest_task_runs[record.task_id] = record;
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
    latest_task_runs: registry.latest_task_runs || {},
    runs: (registry.runs || []).slice(0, limit),
  };
}

function readApprovalQueue() {
  const inbox = readApprovalInbox();
  return {
    generated_at: inbox.generated_at || null,
    pending: inbox.pending || [],
  };
}

function writeApprovalQueue(queue) {
  writeJson(config.APPROVAL_QUEUE_PATH, queue);
}

function enqueueApproval(item) {
  return createApprovalItem(item).item;
}

function resolveApproval(id, decision, extra = {}) {
  const resolved = resolveApprovalItem(id, decision, extra.reviewed_by || "commander_operator");
  if (!resolved) return null;
  const compat = {
    ...resolved,
    id: resolved.approval_id,
    approval_state: resolved.status,
  };
  appendJsonl(config.APPROVAL_QUEUE_HISTORY_JSONL, compat);
  return compat;
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
