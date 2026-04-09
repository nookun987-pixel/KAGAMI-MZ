"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function buildOperatorFrictionReport(input = {}) {
  const proof = input.proof || {};
  const anomalies = input.anomalies || [];
  const frictionPoints = [];
  const lifecycleLength = (input.lifecycle && input.lifecycle.events || []).length;
  if (lifecycleLength > 8) {
    frictionPoints.push({
      friction_type: "too_many_steps",
      severity: "medium",
      summary: `operator flow required ${lifecycleLength} lifecycle steps`,
    });
  }
  if (proof.approval_item && proof.approval_item.reason === "approval_required") {
    frictionPoints.push({
      friction_type: "unclear_approval_wording",
      severity: "low",
      summary: "approval reason is generic and lacks task-specific wording",
    });
  }
  if (!proof.executor_job || !proof.result_ingest) {
    frictionPoints.push({
      friction_type: "missing_job_visibility",
      severity: "high",
      summary: "executor job or result ingest was not clearly visible in proof chain",
    });
  }
  if (anomalies.some((item) => item.anomaly_type === "TIMELINE_GOVERNANCE_MISMATCH")) {
    frictionPoints.push({
      friction_type: "confusing_state_labels",
      severity: "high",
      summary: "workflow and governance states disagree",
    });
  }
  if ((proof.refs || []).length < 4) {
    frictionPoints.push({
      friction_type: "poor_evidence_readability",
      severity: "medium",
      summary: "proof chain exposes too few direct evidence refs",
    });
  }
  return {
    friction_report_id: input.friction_report_id || `friction_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: proof.workflow_id || input.workflow_id || null,
    task_id: proof.task_id || input.task_id || null,
    scenario: proof.scenario || input.scenario || "live_operator_flow",
    final_verdict: proof.final_verdict || "UNKNOWN",
    friction_points: frictionPoints,
    anomaly_count: anomalies.length,
    anomalies_ref: input.anomalies_ref || null,
    proof_ref: input.proof_ref || null,
    generated_at: input.generated_at || new Date().toISOString(),
  };
}

function writeOperatorFrictionReport(input = {}) {
  const report = buildOperatorFrictionReport(input);
  const filePath = path.join(config.OPERATOR_FRICTION_REPORT_DIR, `${report.task_id || report.friction_report_id}.operator_friction_report.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, report);
  return { report, artifact_path: filePath };
}

function readOperatorFrictionReports(limit = 20) {
  if (!fs.existsSync(config.OPERATOR_FRICTION_REPORT_DIR)) {
    return { generated_at: null, items: [] };
  }
  const items = fs.readdirSync(config.OPERATOR_FRICTION_REPORT_DIR)
    .filter((name) => name.endsWith(".operator_friction_report.json"))
    .map((name) => {
      const filePath = path.join(config.OPERATOR_FRICTION_REPORT_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        path: filePath,
        mtime_ms: stat.mtimeMs,
        report: readJsonSafe(filePath, null),
      };
    })
    .filter((entry) => entry.report)
    .sort((a, b) => b.mtime_ms - a.mtime_ms)
    .slice(0, limit)
    .map((entry) => ({
      artifact_path: entry.path,
      report: entry.report,
    }));
  return {
    generated_at: new Date().toISOString(),
    items,
  };
}

module.exports = {
  buildOperatorFrictionReport,
  writeOperatorFrictionReport,
  readOperatorFrictionReports,
};
