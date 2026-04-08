"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { shouldEmitReport } = require("./report_dedupe_guard");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readGovernanceReports() {
  return readJsonSafe(config.GOVERNANCE_REPORTS_PATH, {
    generated_at: null,
    reports: [],
    latest_by_workflow: {},
  });
}

function writeGovernanceReports(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.GOVERNANCE_REPORTS_PATH, store);
}

function buildReportFingerprint(input) {
  return crypto.createHash("sha256").update(JSON.stringify({
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    report_type: input.report_type || null,
    summary: input.summary || null,
    approval_state: input.approval_state || null,
    execution_state: input.execution_state || null,
    failure_state: input.failure_state || null,
    retry_state: input.retry_state || null,
    boundary_state: input.boundary_state || null,
  })).digest("hex");
}

function writeGovernanceReport(input) {
  const fingerprint = buildReportFingerprint(input);
  if (!shouldEmitReport("governance_report", fingerprint)) {
    return { emitted: false, report: null };
  }
  const store = readGovernanceReports();
  const report = {
    report_id: input.report_id || `govr_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    session_id: input.session_id || null,
    report_type: input.report_type,
    summary: input.summary || "",
    risk_level: input.risk_level || "medium",
    approval_state: input.approval_state || null,
    execution_state: input.execution_state || null,
    failure_state: input.failure_state || null,
    retry_state: input.retry_state || null,
    boundary_state: input.boundary_state || null,
    generated_at: new Date().toISOString(),
    refs: input.refs || [],
    fingerprint,
  };
  store.reports = Array.isArray(store.reports) ? store.reports : [];
  store.reports.unshift(report);
  store.reports = store.reports.slice(0, 300);
  store.latest_by_workflow = store.latest_by_workflow || {};
  if (report.workflow_id) store.latest_by_workflow[report.workflow_id] = report;
  writeGovernanceReports(store);
  appendJsonl(config.GOVERNANCE_REPORTS_HISTORY_JSONL, report);
  return { emitted: true, report };
}

function readGovernanceReportByWorkflow(workflowId) {
  const store = readGovernanceReports();
  return store.latest_by_workflow && store.latest_by_workflow[workflowId] || null;
}

module.exports = {
  readGovernanceReports,
  writeGovernanceReport,
  readGovernanceReportByWorkflow,
};
