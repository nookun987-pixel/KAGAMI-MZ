"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson, readJsonSafe } = require("./local_control_agent/bridge_writer");

function buildExecutionReport(input = {}) {
  const normalized = input.normalized || {};
  const report = {
    report_id: `exec_report_${Date.now()}`,
    job_id: normalized.job_id || input.job_id || null,
    task_id: normalized.task_id || input.task_id || null,
    what_was_done: normalized.output || input.summary || "executor result ingested",
    result: normalized.status || "unknown",
    need_approval: Boolean(input.need_approval),
    next_step: input.next_step || (normalized.status === "success" ? "operator_review_result" : "inspect_failure_and_retry_or_reject"),
    changed_files: normalized.changed_files || [],
    output: normalized.output || null,
    error: normalized.error || null,
    source_artifact_ref: input.source_artifact_ref || normalized.source_artifact_ref || null,
    generated_at: new Date().toISOString(),
    start_time:    normalized.start_time    || null,
    end_time:      normalized.end_time      || null,
    duration_ms:   normalized.duration_ms   != null ? normalized.duration_ms : null,
    estimated_cost: normalized.estimated_cost || null,
  };
  return report;
}

function writeExecutionReport(report) {
  const filePath = path.join(config.EXECUTION_REPORT_DIR, `${report.job_id || report.report_id}.execution_report.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, report);
  return filePath;
}

function getLatestExecutionReport(jobId) {
  const filePath = path.join(config.EXECUTION_REPORT_DIR, `${jobId}.execution_report.json`);
  return readJsonSafe(filePath, null);
}

module.exports = {
  buildExecutionReport,
  writeExecutionReport,
  getLatestExecutionReport,
};
