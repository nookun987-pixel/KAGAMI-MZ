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
    latest_task_artifacts: {},
    latest_executor_jobs: {},
    latest_execution_results: {},
    latest_execution_failures: {},
    latest_execution_reports: {},
    latest_goal_state: null,
    latest_progress_eval: null,
    latest_next_task_decision: null,
    latest_repo_health_scan: null,
    latest_maintenance_issues: null,
    latest_self_heal_decision: null,
    latest_live_operation_proof: null,
    latest_operator_friction_report: null,
    latest_stability_anomalies: null,
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
  registry.latest_task_artifacts = registry.latest_task_artifacts || {};
  registry.latest_executor_jobs = registry.latest_executor_jobs || {};
  registry.latest_execution_results = registry.latest_execution_results || {};
  registry.latest_execution_failures = registry.latest_execution_failures || {};
  registry.latest_execution_reports = registry.latest_execution_reports || {};
  if (record.task_id) registry.latest_task_runs[record.task_id] = record;
  if (record.task_id) {
    registry.latest_task_artifacts[record.task_id] = {
      task_contract_ref: record.task_contract_ref || null,
      task_brief_ref: record.task_brief_ref || null,
      codex_dispatch_pack_ref: record.codex_dispatch_pack_ref || null,
      execution_report_ref: record.execution_report_ref || null,
    };
    if (record.execution_report_ref) {
      registry.latest_execution_reports[record.task_id] = record.execution_report_ref;
    }
  }
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
    latest_task_artifacts: registry.latest_task_artifacts || {},
    latest_executor_jobs: registry.latest_executor_jobs || {},
    latest_execution_results: registry.latest_execution_results || {},
    latest_execution_failures: registry.latest_execution_failures || {},
    latest_execution_reports: registry.latest_execution_reports || {},
    latest_goal_state: registry.latest_goal_state || null,
    latest_progress_eval: registry.latest_progress_eval || null,
    latest_next_task_decision: registry.latest_next_task_decision || null,
    latest_repo_health_scan: registry.latest_repo_health_scan || null,
    latest_maintenance_issues: registry.latest_maintenance_issues || null,
    latest_self_heal_decision: registry.latest_self_heal_decision || null,
    latest_live_operation_proof: registry.latest_live_operation_proof || null,
    latest_operator_friction_report: registry.latest_operator_friction_report || null,
    latest_stability_anomalies: registry.latest_stability_anomalies || null,
    runs: (registry.runs || []).slice(0, limit),
  };
}

function recordExecutorJob(job) {
  const registry = readRegistry();
  registry.latest_executor_jobs = registry.latest_executor_jobs || {};
  if (job && job.task_id) registry.latest_executor_jobs[job.task_id] = job;
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, {
    type: "executor_job",
    generated_at: new Date().toISOString(),
    job,
  });
  return registry;
}

function recordLiveOperationArtifacts(input = {}) {
  const registry = readRegistry();
  registry.latest_live_operation_proof = input.live_operation_proof || registry.latest_live_operation_proof || null;
  registry.latest_operator_friction_report = input.operator_friction_report || registry.latest_operator_friction_report || null;
  registry.latest_stability_anomalies = input.stability_anomalies || registry.latest_stability_anomalies || null;
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, {
    type: "live_operation",
    generated_at: new Date().toISOString(),
    live_operation_proof: input.live_operation_proof || null,
    operator_friction_report: input.operator_friction_report || null,
    stability_anomalies: input.stability_anomalies || null,
  });
  return registry;
}

function recordExecutionOutcome(outcome) {
  const registry = readRegistry();
  if (outcome && outcome.task_id) {
    if (outcome.changed_files) {
      registry.latest_execution_results = registry.latest_execution_results || {};
      registry.latest_execution_results[outcome.task_id] = outcome;
    } else {
      registry.latest_execution_failures = registry.latest_execution_failures || {};
      registry.latest_execution_failures[outcome.task_id] = outcome;
    }
  }
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, {
    type: "execution_outcome",
    generated_at: new Date().toISOString(),
    outcome,
  });
  return registry;
}

function recordGoalLoopArtifacts(input = {}) {
  const registry = readRegistry();
  registry.latest_goal_state = input.goal_state || registry.latest_goal_state || null;
  registry.latest_progress_eval = input.progress_eval || registry.latest_progress_eval || null;
  registry.latest_next_task_decision = input.next_task_decision || registry.latest_next_task_decision || null;
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, {
    type: "goal_loop",
    generated_at: new Date().toISOString(),
    goal_state: input.goal_state || null,
    progress_eval: input.progress_eval || null,
    next_task_decision: input.next_task_decision || null,
  });
  return registry;
}

function recordMaintenanceArtifacts(input = {}) {
  const registry = readRegistry();
  registry.latest_repo_health_scan = input.repo_health_scan || registry.latest_repo_health_scan || null;
  registry.latest_maintenance_issues = input.maintenance_issues || registry.latest_maintenance_issues || null;
  registry.latest_self_heal_decision = input.self_heal_decision || registry.latest_self_heal_decision || null;
  writeRegistry(registry);
  appendJsonl(config.WORKFLOW_REGISTRY_JSONL, {
    type: "maintenance",
    generated_at: new Date().toISOString(),
    repo_health_scan: input.repo_health_scan || null,
    maintenance_issues: input.maintenance_issues || null,
    self_heal_decision: input.self_heal_decision || null,
  });
  return registry;
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
  recordExecutorJob,
  recordExecutionOutcome,
  recordGoalLoopArtifacts,
  recordMaintenanceArtifacts,
  recordLiveOperationArtifacts,
  readApprovalQueue,
  enqueueApproval,
  resolveApproval,
};
