"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./local_control_agent/config");
const { writeJson, readPendingActions } = require("./local_control_agent/bridge_writer");
const { readApprovalInbox } = require("./approval_inbox_store");
const { readFailureCenter } = require("./failure_center_store");
const { readRetryQueue } = require("./retry_queue_manager");
const { shouldEmitReport } = require("./report_dedupe_guard");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function writeGovernanceSnapshot(input = {}) {
  const approvals = readApprovalInbox();
  const failures = readFailureCenter();
  const retryQueue = readRetryQueue();
  const pending = readPendingActions();
  const snapshot = {
    workflow_status: input.workflow_status || "idle",
    current_approval_state: input.current_approval_state || null,
    pending_actions_count: Array.isArray(pending.pending) ? pending.pending.length : 0,
    failure_count: (failures.failures || []).length,
    retry_count: (retryQueue.queued || []).length,
    last_executor_result: input.last_executor_result || null,
    boundary_violations_count: Number(input.boundary_violations_count || 0),
    reporting_timestamp: new Date().toISOString(),
    latest_approval_id: input.latest_approval_id || null,
    latest_failure_id: input.latest_failure_id || null,
    latest_task_id: input.latest_task_id || null,
  };
  writeJson(config.GOVERNANCE_SNAPSHOT_LATEST, snapshot);
  appendJsonl(config.GOVERNANCE_SNAPSHOT_HISTORY_JSONL, snapshot);

  const emitStatuses = new Set(["approval_pending", "approved", "rejected", "failed", "retrying", "succeeded"]);
  if (emitStatuses.has(String(snapshot.workflow_status))) {
    const fingerprint = crypto.createHash("sha256").update(JSON.stringify({
      workflow_status: snapshot.workflow_status,
      current_approval_state: snapshot.current_approval_state,
      latest_approval_id: snapshot.latest_approval_id,
      latest_failure_id: snapshot.latest_failure_id,
      latest_task_id: snapshot.latest_task_id,
      last_executor_result: snapshot.last_executor_result,
    })).digest("hex");
    if (shouldEmitReport("governance", fingerprint)) {
      appendJsonl(config.OPERATOR_REPORTS_JSONL, snapshot);
    }
  }
  return snapshot;
}

module.exports = {
  writeGovernanceSnapshot,
};
