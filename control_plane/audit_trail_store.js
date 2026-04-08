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

function readAuditTrail() {
  return readJsonSafe(config.AUDIT_TRAIL_PATH, {
    generated_at: null,
    records: [],
  });
}

function writeAuditTrail(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.AUDIT_TRAIL_PATH, store);
}

function appendAuditRecord(input) {
  const store = readAuditTrail();
  const record = {
    audit_id: input.audit_id || `audit_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    actor_type: input.actor_type,
    actor_id: input.actor_id,
    action: input.action,
    decision: input.decision,
    reason: input.reason || "",
    refs: input.refs || [],
    timestamp: new Date().toISOString(),
  };
  store.records = Array.isArray(store.records) ? store.records : [];
  store.records.unshift(record);
  store.records = store.records.slice(0, 500);
  writeAuditTrail(store);
  appendJsonl(config.AUDIT_TRAIL_HISTORY_JSONL, record);
  return record;
}

function getAuditTrailByTask(taskId, limit = 100) {
  const store = readAuditTrail();
  return {
    task_id: taskId,
    records: (store.records || []).filter((record) => record.task_id === taskId).slice(0, limit),
  };
}

module.exports = {
  readAuditTrail,
  appendAuditRecord,
  getAuditTrailByTask,
};
