"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const DEFAULT_EXPIRY_MS = 30 * 60 * 1000;

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readApprovalInbox() {
  return readJsonSafe(config.APPROVAL_INBOX_PATH, {
    generated_at: null,
    pending: [],
    resolved: [],
  });
}

function writeApprovalInbox(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.APPROVAL_INBOX_PATH, store);
}

function buildApprovalFingerprint(input) {
  return crypto.createHash("sha256").update(JSON.stringify({
    task_id: input.task_id || null,
    action_type: input.action_type || null,
    tool_name: input.tool_name || null,
    summary: input.summary || null,
    reason: input.reason || null,
    preview_ref: input.preview_ref || null,
    diff_ref: input.diff_ref || null,
  })).digest("hex");
}

function expireApprovals(now = new Date()) {
  const store = readApprovalInbox();
  const nowMs = now.getTime();
  const stillPending = [];
  const expired = [];
  for (const item of store.pending || []) {
    if (item.status === "pending" && item.expires_at && new Date(item.expires_at).getTime() <= nowMs) {
      const next = {
        ...item,
        status: "expired",
        expired_at: now.toISOString(),
      };
      store.resolved.unshift(next);
      expired.push(next);
      appendJsonl(config.APPROVAL_INBOX_HISTORY_JSONL, next);
    } else {
      stillPending.push(item);
    }
  }
  store.pending = stillPending;
  writeApprovalInbox(store);
  return expired;
}

function createApprovalItem(input) {
  expireApprovals();
  const store = readApprovalInbox();
  const fingerprint = buildApprovalFingerprint(input);
  const existing = (store.pending || []).find((item) => item.status === "pending" && item.fingerprint === fingerprint);
  if (existing) {
    return { created: false, item: existing, deduped: true };
  }
  const createdAt = new Date();
  const item = {
    approval_id: input.approval_id || `approval_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    session_id: input.session_id || null,
    requested_by: input.requested_by || "local_control_agent",
    action_type: input.action_type || "write",
    tool_name: input.tool_name || "unknown",
    risk_level: input.risk_level || "medium",
    summary: input.summary || "",
    reason: input.reason || "approval_required",
    preview_ref: input.preview_ref || null,
    diff_ref: input.diff_ref || "NO_DIFF_AVAILABLE",
    created_at: createdAt.toISOString(),
    expires_at: new Date(createdAt.getTime() + (input.expires_in_ms || DEFAULT_EXPIRY_MS)).toISOString(),
    status: "pending",
    fingerprint,
    command_ref: input.command_ref || null,
    command_snapshot: input.command_snapshot || null,
    report_ref: input.report_ref || null,
  };
  store.pending = Array.isArray(store.pending) ? store.pending : [];
  store.pending.unshift(item);
  writeApprovalInbox(store);
  appendJsonl(config.APPROVAL_INBOX_HISTORY_JSONL, item);
  return { created: true, item, deduped: false };
}

function resolveApprovalItem(approvalId, decision, reviewedBy = "operator") {
  const store = readApprovalInbox();
  const pending = Array.isArray(store.pending) ? store.pending : [];
  const index = pending.findIndex((item) => item.approval_id === approvalId);
  if (index === -1) return null;
  const item = pending[index];
  pending.splice(index, 1);
  const resolved = {
    ...item,
    status: decision,
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
  };
  store.pending = pending;
  store.resolved = Array.isArray(store.resolved) ? store.resolved : [];
  store.resolved.unshift(resolved);
  store.resolved = store.resolved.slice(0, 200);
  writeApprovalInbox(store);
  appendJsonl(config.APPROVAL_INBOX_HISTORY_JSONL, resolved);
  return resolved;
}

module.exports = {
  DEFAULT_EXPIRY_MS,
  readApprovalInbox,
  writeApprovalInbox,
  buildApprovalFingerprint,
  expireApprovals,
  createApprovalItem,
  resolveApprovalItem,
};
