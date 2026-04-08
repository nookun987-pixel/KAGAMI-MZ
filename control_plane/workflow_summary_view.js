"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { readTaskLifecycle } = require("./lifecycle_timeline_writer");
const { readFailureCenter } = require("./failure_center_store");
const { readRetryQueue } = require("./retry_queue_manager");
const { readGovernanceReportByWorkflow } = require("./governance_report_writer");

function readWorkflowSummaries() {
  return readJsonSafe(config.WORKFLOW_SUMMARY_PATH, {
    generated_at: null,
    summaries: {},
  });
}

function writeWorkflowSummaries(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.WORKFLOW_SUMMARY_PATH, store);
}

function upsertWorkflowSummary(input) {
  const lifecycle = readTaskLifecycle(input.task_id);
  const failureCenter = readFailureCenter();
  const retryQueue = readRetryQueue();
  const lastEvent = (lifecycle.events || [])[lifecycle.events.length - 1] || null;
  const failures = (failureCenter.failures || []).filter((item) => item.task_id === input.task_id);
  const retries = (retryQueue.queued || []).filter((item) => item.task_id === input.task_id);
  const report = readGovernanceReportByWorkflow(input.workflow_id);
  const summary = {
    workflow_id: input.workflow_id,
    task_id: input.task_id,
    current_stage: input.current_stage || (lastEvent && lastEvent.stage) || null,
    approval_state: input.approval_state || null,
    last_action: input.last_action || null,
    failure_count: failures.length,
    retry_count: retries.length,
    last_report_type: report && report.report_type || null,
    latest_refs: input.latest_refs || (report && report.refs) || [],
    updated_at: new Date().toISOString(),
  };
  const store = readWorkflowSummaries();
  store.summaries = store.summaries || {};
  store.summaries[input.workflow_id] = summary;
  writeWorkflowSummaries(store);
  return summary;
}

function getWorkflowSummary(workflowId) {
  const store = readWorkflowSummaries();
  return store.summaries && store.summaries[workflowId] || null;
}

module.exports = {
  readWorkflowSummaries,
  upsertWorkflowSummary,
  getWorkflowSummary,
};
