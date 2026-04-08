"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const {
  buildCommandId,
  submitCommand,
  waitForResult,
} = require("./local_control_agent/send_command");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { listInboxCommands, ensureBridgeDirs } = require("./local_control_agent/bridge_reader");
const snapshotWriter = require("./local_control_agent/snapshot_writer");
const { readRuntimeStatus } = require("./runtime_status_reader");
const agentManager = require("./agent_process_manager");
const { getSessionState, writeSessionState } = require("./session_manager");
const { readApprovalInbox, resolveApprovalItem, expireApprovals } = require("./approval_inbox_store");
const { readFailureCenter, updateFailure } = require("./failure_center_store");
const { readRetryQueue, requestRetry } = require("./retry_queue_manager");
const { readTaskLifecycle, appendLifecycleEvent } = require("./lifecycle_timeline_writer");
const { readJsonSafe: readBridgeJsonSafe } = require("./local_control_agent/bridge_writer");
const { writeGovernanceSnapshot } = require("./governance_snapshot_writer");
const { readGovernanceReports, writeGovernanceReport, readGovernanceReportByWorkflow } = require("./governance_report_writer");
const { getActivityFeed, appendActivityFeed } = require("./operator_activity_feed");
const { appendAuditRecord, getAuditTrailByTask } = require("./audit_trail_store");
const { getWorkflowSummary, upsertWorkflowSummary } = require("./workflow_summary_view");
const {
  buildRunId,
  registerWorkflowRun,
  getWorkflowHistory,
  readApprovalQueue,
  enqueueApproval,
  resolveApproval,
} = require("./workflow_registry");

const WORKFLOW_STATE_PATH = path.join(config.STATE_DIR, "latest_workflow_report.json");
const WORKFLOW_POLICIES = {
  WAKE_VERIFY: "safe_auto",
  DESKTOP_CHECK: "safe_auto",
  REPO_CHECK: "safe_auto",
  DAILY_HEALTH: "safe_auto",
  SAFE_SHUTDOWN: "require_approval",
};

function tailLines(filePath, limit = 50) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  return lines.slice(Math.max(0, lines.length - limit));
}

function listLatestLocalReports(limit = 10) {
  if (!fs.existsSync(config.LOCAL_AGENT_REPORTS_DIR)) return [];
  return fs.readdirSync(config.LOCAL_AGENT_REPORTS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const filePath = path.join(config.LOCAL_AGENT_REPORTS_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        name,
        path: filePath,
        mtime_ms: stat.mtimeMs,
      };
    })
    .sort((a, b) => b.mtime_ms - a.mtime_ms)
    .slice(0, limit);
}

function getHealth() {
  ensureBridgeDirs();
  const runtime = readRuntimeStatus();
  const agent = agentManager.getAgentStatus();
  const pending = readJsonSafe(config.PENDING_ACTIONS, { pending: [] });
  return {
    status: "PASS",
    bridge: {
      ready: true,
      inbox: config.INBOX_DIR,
      outbox: config.OUTBOX_DIR,
      state: config.STATE_DIR,
    },
    agent: {
      live: agent.live,
      status: agent.status,
      pid: agent.pid,
      process_count: agent.processes.length,
    },
    runtime,
    queue: {
      pending_actions: Array.isArray(pending.pending) ? pending.pending.length : 0,
    },
    sessions: getSessionState(),
  };
}

function getStatus() {
  const snapshot = readJsonSafe(config.SYSTEM_RUNTIME_SNAPSHOT, {});
  const latestReport = readJsonSafe(config.LATEST_AGENT_REPORT, null);
  const latestWorkflow = readJsonSafe(WORKFLOW_STATE_PATH, null);
  const agent = agentManager.getAgentStatus();
  const sessions = getSessionState();
  const workflowHistory = getWorkflowHistory(10);
  const approvalQueue = readApprovalQueue();
  const approvalInbox = readApprovalInbox();
  const failureCenter = readFailureCenter();
  const retryQueue = readRetryQueue();
  return {
    status: "PASS",
    snapshot,
    latest_report: latestReport,
    latest_workflow: latestWorkflow,
    agent,
    sessions,
    workflow_history: workflowHistory,
    latest_task_runs: workflowHistory.latest_task_runs || {},
    approval_queue: approvalQueue,
    approval_inbox: approvalInbox,
    failure_center: failureCenter,
    retry_queue: retryQueue,
  };
}

async function runBridgeCommand(input = {}) {
  const action = String(input.action || "").trim();
  if (!action) {
    throw new Error("missing_action");
  }
  const command = {
    command_id: input.command_id || buildCommandId(action),
    action,
    payload: input.payload || {},
    approval: {
      status: input.approval_status || (input.approve ? "approved" : "pending"),
    },
    requested_by: input.requested_by || "commander_api",
    created_at: new Date().toISOString(),
  };
  writeSessionState({
    user_session: {
      requested_by: command.requested_by,
      reviewed_by: input.reviewed_by || null,
      approval_state: command.approval.status,
      last_action: action,
      current_task_id: command.payload.task_id || null,
      current_workflow_id: command.payload.task_id ? `task_${command.payload.task_id}` : null,
    },
  });
  const inboxPath = submitCommand(command);
  const wait = input.wait !== false;
  if (!wait) {
    return {
      status: "PASS",
      queued: true,
      command_id: command.command_id,
      inbox_path: inboxPath,
    };
  }
  const found = await waitForResult(command.command_id, input.timeout_ms || 30000, 500);
  if (!found) {
    return {
      status: "BLOCKED",
      queued: true,
      command_id: command.command_id,
      inbox_path: inboxPath,
      reason: "timeout_waiting_for_report",
    };
  }
  return {
    status: found.report.status,
    queued: false,
    command_id: command.command_id,
    inbox_path: inboxPath,
    report_path: found.filePath,
    report: found.report,
  };
}

function getLatestReports() {
  const workflowHistory = getWorkflowHistory(10);
  return {
    status: "PASS",
    latest_agent_report: readJsonSafe(config.LATEST_AGENT_REPORT, null),
    latest_reviewed_action: readJsonSafe(config.LOCAL_AGENT_LAST_ACTION, null),
    latest_desktop_action: readJsonSafe(config.LOCAL_AGENT_LAST_DESKTOP_ACTION, null),
    sessions: getSessionState(),
    workflow_history: workflowHistory,
    latest_task_runs: workflowHistory.latest_task_runs || {},
    local_reports: listLatestLocalReports(15),
  };
}

function getRecentLogs(limit = 50) {
  return {
    status: "PASS",
    audit_log_path: config.AUDIT_LOG,
    recent_lines: tailLines(config.AUDIT_LOG, limit),
  };
}

function getQueueStatus() {
  const pending = readJsonSafe(config.PENDING_ACTIONS, { pending: [] });
  const inbox = listInboxCommands();
  const approvals = readApprovalInbox();
  return {
    status: "PASS",
    pending_actions: pending.pending || [],
    approval_queue: approvals.pending || [],
    inbox_count: inbox.length,
    inbox_commands: inbox.map((entry) => ({
      command_id: entry.payload.command_id,
      action: entry.payload.action,
      file: entry.name,
    })),
  };
}

function getApprovalInbox() {
  expireApprovals();
  return {
    status: "PASS",
    approval_inbox: readApprovalInbox(),
  };
}

function getFailureCenter() {
  return {
    status: "PASS",
    failure_center: readFailureCenter(),
  };
}

function getRetryQueue() {
  return {
    status: "PASS",
    retry_queue: readRetryQueue(),
  };
}

function getTaskLifecycle(taskId) {
  return {
    status: "PASS",
    task_lifecycle: readTaskLifecycle(taskId),
  };
}

function getGovernanceSnapshotLatest() {
  return {
    status: "PASS",
    governance_snapshot: readBridgeJsonSafe(config.GOVERNANCE_SNAPSHOT_LATEST, null),
  };
}

function getGovernanceReports() {
  return {
    status: "PASS",
    governance_reports: readGovernanceReports(),
  };
}

function getActivityFeedView(limit = 50) {
  return {
    status: "PASS",
    activity_feed: getActivityFeed(limit),
  };
}

function getWorkflowSummaryView(workflowId) {
  return {
    status: "PASS",
    workflow_summary: getWorkflowSummary(workflowId),
  };
}

function getAuditTrailView(taskId) {
  return {
    status: "PASS",
    audit_trail: getAuditTrailByTask(taskId),
  };
}

function getWorkflowReport(workflowId) {
  return {
    status: "PASS",
    report: readGovernanceReportByWorkflow(workflowId),
  };
}

function getTaskPlan(taskId) {
  const normalized = String(taskId || "").trim();
  if (!normalized) {
    return { status: "BLOCKED", reason: "missing_task_id" };
  }
  const taskPath = path.join(config.TASKS_DIR, `${normalized}.md`);
  if (!fs.existsSync(taskPath)) {
    return {
      status: "BLOCKED",
      task_id: normalized,
      task_path: taskPath,
      reason: "task_plan_not_found",
    };
  }
  return {
    status: "PASS",
    task_id: normalized,
    task_path: taskPath,
    content: fs.readFileSync(taskPath, "utf8"),
  };
}

function startAgent() {
  const result = agentManager.startAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: result.status === "PASS" ? "watching" : "error" });
  return result;
}

function stopAgent() {
  const result = agentManager.stopAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: "stopped" });
  return result;
}

function restartAgent() {
  const result = agentManager.restartAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: result.status === "PASS" ? "watching" : "error" });
  return result;
}

const WORKFLOW_STEPS = {
  WAKE_VERIFY: [
    { type: "agent.start" },
    { type: "command", action: "desktop.get_active_window", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.capture_desktop_state", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
  ],
  DESKTOP_CHECK: [
    { type: "command", action: "desktop.get_active_window", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.get_browser_context", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.capture_desktop_state", payload: {}, approval_status: "auto_allow" },
  ],
  REPO_CHECK: [
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
  ],
  DAILY_HEALTH: [
    { type: "agent.start" },
    { type: "command", action: "runtime.health", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "disk.smart_scan", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
  ],
  SAFE_SHUTDOWN: [
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
    { type: "agent.stop" },
  ],
};

async function runWorkflow(name, options = {}) {
  const workflowName = String(name || "").trim().toUpperCase();
  const policy = WORKFLOW_POLICIES[workflowName] || "require_approval";
  const requestedBy = options.requested_by || "dashboard";
  const reviewedBy = options.reviewed_by || null;
  const explicitApproval = options.approval_state || null;
  const steps = WORKFLOW_STEPS[workflowName];
  if (!steps) {
    const unknown = {
      id: buildRunId(workflowName),
      workflow: workflowName,
      requested_by: requestedBy,
      reviewed_by: reviewedBy,
      approval_state: explicitApproval || "not_applicable",
      execution_state: "not_started",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      artifacts_written: [WORKFLOW_STATE_PATH],
      final_verdict: "BLOCKED",
      blocker_reason: "unknown_workflow",
      status: "BLOCKED",
      steps: [],
    };
    writeJson(WORKFLOW_STATE_PATH, unknown);
    registerWorkflowRun(unknown);
    return unknown;
  }
  if (policy === "require_approval" && explicitApproval !== "approved") {
    const queued = enqueueApproval({
      id: buildRunId(workflowName),
      workflow: workflowName,
      requested_by: requestedBy,
      reviewed_by: null,
      approval_state: "pending",
      execution_state: "queued_for_approval",
      started_at: new Date().toISOString(),
      ended_at: null,
      artifacts_written: [config.APPROVAL_QUEUE_PATH],
      final_verdict: "BLOCKED",
      blocker_reason: "approval_required",
      policy,
    });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    return {
      status: "BLOCKED",
      workflow: workflowName,
      approval_queue_id: queued.id,
      blocker_reason: "approval_required",
    };
  }
  const results = [];
  const startedAt = new Date().toISOString();
  writeSessionState({
    user_session: {
      requested_by: requestedBy,
      reviewed_by: reviewedBy,
      approval_state: explicitApproval || policy,
      last_action: workflowName,
    },
  });
  for (const step of steps) {
    let result;
    if (step.type === "agent.start") result = startAgent();
    else if (step.type === "agent.stop") result = stopAgent();
    else if (step.type === "agent.restart") result = restartAgent();
    else {
      result = await runBridgeCommand({
        action: step.action,
        payload: step.payload,
        approval_status: step.approval_status,
        requested_by: "workflow",
        wait: true,
        timeout_ms: step.timeout_ms || 30000,
      });
    }
    results.push({
      step: step.type === "command" ? step.action : step.type,
      result,
    });
    if (result.status && !["PASS", "ALLOW", "watching", "running"].includes(String(result.status).toUpperCase())) {
      break;
    }
  }
  const finalStatus = results.every((entry) => String(entry.result.status || "").toUpperCase() === "PASS")
    ? "PASS"
    : (results[results.length - 1] ? results[results.length - 1].result.status : "BLOCKED");
  const report = {
    id: buildRunId(workflowName),
    generated_at: new Date().toISOString(),
    workflow: workflowName,
    requested_by: requestedBy,
    reviewed_by: reviewedBy,
    approval_state: explicitApproval || (policy === "safe_auto" ? "auto_allow" : "approved"),
    execution_state: finalStatus === "PASS" ? "completed" : "blocked",
    started_at: startedAt,
    ended_at: new Date().toISOString(),
    artifacts_written: [WORKFLOW_STATE_PATH, config.WORKFLOW_REGISTRY_JSON, config.WORKFLOW_REGISTRY_JSONL],
    final_verdict: finalStatus,
    blocker_reason: finalStatus === "PASS" ? null : (results[results.length - 1] && (results[results.length - 1].result.reason || results[results.length - 1].result.error || results[results.length - 1].result.blocker_reason)) || "workflow_step_failed",
    status: finalStatus,
    steps: results,
  };
  writeJson(WORKFLOW_STATE_PATH, report);
  registerWorkflowRun(report);
  snapshotWriter.writeSnapshot({ agent_status: finalStatus === "PASS" ? "idle" : "blocked" });
  return report;
}

async function approveWorkflow(id, reviewedBy = "telegram_operator") {
  const resolved = resolveApproval(id, "approved", { reviewed_by: reviewedBy });
  if (!resolved) {
    return { status: "BLOCKED", reason: "approval_id_not_found", id };
  }
  if (!resolved.workflow) {
    return {
      status: "PASS",
      task_id: resolved.task_id || resolved.id,
      approval_state: "approved",
      reviewed_by: reviewedBy,
      resolved,
    };
  }
  return runWorkflow(resolved.workflow, {
    requested_by: resolved.requested_by,
    reviewed_by: reviewedBy,
    approval_state: "approved",
  });
}

function rejectWorkflow(id, reviewedBy = "telegram_operator") {
  const resolved = resolveApproval(id, "rejected", { reviewed_by: reviewedBy });
  if (!resolved) {
    return { status: "BLOCKED", reason: "approval_id_not_found", id };
  }
  if (!resolved.workflow) {
    return {
      status: "BLOCKED",
      task_id: resolved.task_id || resolved.id,
      approval_state: "rejected",
      reviewed_by: reviewedBy,
      blocker_reason: "rejected_by_operator",
      resolved,
    };
  }
  const report = {
    ...resolved,
    ended_at: new Date().toISOString(),
    artifacts_written: [config.APPROVAL_QUEUE_PATH, config.APPROVAL_QUEUE_HISTORY_JSONL],
    final_verdict: "BLOCKED",
    blocker_reason: "rejected_by_operator",
    status: "BLOCKED",
  };
  registerWorkflowRun(report);
  snapshotWriter.writeSnapshot({ agent_status: "blocked" });
  return report;
}

async function approveApproval(approvalId, reviewedBy = "operator") {
  const resolved = resolveApprovalItem(approvalId, "approved", reviewedBy);
  if (!resolved) return { status: "BLOCKED", reason: "approval_id_not_found", approval_id: approvalId };
  appendLifecycleEvent({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    stage: "approved",
    status: "PASS",
    summary: `approval ${approvalId} approved`,
    artifact_refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  appendAuditRecord({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    actor_type: reviewedBy === "telegram_operator" ? "telegram_operator" : "dashboard_operator",
    actor_id: reviewedBy,
    action: "approval.approve",
    decision: "approved",
    reason: `approval ${approvalId} approved`,
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  appendActivityFeed({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    event_type: "approval_approved",
    short_text: `approval ${approvalId} approved`,
    severity: "info",
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  writeGovernanceReport({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    session_id: resolved.session_id || null,
    report_type: "APPROVAL_RESOLVED",
    summary: `approval ${approvalId} approved`,
    risk_level: resolved.risk_level || "medium",
    approval_state: "approved",
    execution_state: "approved",
    failure_state: null,
    retry_state: "none",
    boundary_state: "clear",
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  upsertWorkflowSummary({
    workflow_id: resolved.workflow_id || `task_${resolved.task_id || "unknown"}`,
    task_id: resolved.task_id || "unknown",
    current_stage: "approved",
    approval_state: "approved",
    last_action: resolved.tool_name || "approval.approve",
    latest_refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  writeGovernanceSnapshot({
    workflow_status: "approved",
    current_approval_state: "approved",
    latest_approval_id: approvalId,
    latest_task_id: resolved.task_id || null,
    last_executor_result: "approval_resolved",
  });
  let execution = null;
  if (resolved.command_snapshot && resolved.command_snapshot.action) {
    execution = await runBridgeCommand({
      action: resolved.command_snapshot.action,
      payload: resolved.command_snapshot.payload || {},
      approval_status: "approved",
      requested_by: reviewedBy,
      reviewed_by: reviewedBy,
      wait: true,
    });
  }
  return {
    status: "PASS",
    approval: resolved,
    execution,
  };
}

function rejectApproval(approvalId, reviewedBy = "operator") {
  const resolved = resolveApprovalItem(approvalId, "rejected", reviewedBy);
  if (!resolved) return { status: "BLOCKED", reason: "approval_id_not_found", approval_id: approvalId };
  appendLifecycleEvent({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    stage: "rejected",
    status: "BLOCKED",
    summary: `approval ${approvalId} rejected`,
    artifact_refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  appendAuditRecord({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    actor_type: reviewedBy === "telegram_operator" ? "telegram_operator" : "dashboard_operator",
    actor_id: reviewedBy,
    action: "approval.reject",
    decision: "rejected",
    reason: `approval ${approvalId} rejected`,
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  appendActivityFeed({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    event_type: "approval_rejected",
    short_text: `approval ${approvalId} rejected`,
    severity: "warn",
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  writeGovernanceReport({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    session_id: resolved.session_id || null,
    report_type: "APPROVAL_RESOLVED",
    summary: `approval ${approvalId} rejected`,
    risk_level: resolved.risk_level || "high",
    approval_state: "rejected",
    execution_state: "blocked",
    failure_state: "APPROVAL_REJECTED",
    retry_state: "none",
    boundary_state: "clear",
    refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  upsertWorkflowSummary({
    workflow_id: resolved.workflow_id || `task_${resolved.task_id || "unknown"}`,
    task_id: resolved.task_id || "unknown",
    current_stage: "rejected",
    approval_state: "rejected",
    last_action: resolved.tool_name || "approval.reject",
    latest_refs: [resolved.preview_ref, resolved.diff_ref].filter(Boolean),
  });
  writeGovernanceSnapshot({
    workflow_status: "rejected",
    current_approval_state: "rejected",
    latest_approval_id: approvalId,
    latest_task_id: resolved.task_id || null,
    last_executor_result: "approval_rejected",
  });
  return {
    status: "BLOCKED",
    approval: resolved,
  };
}

function retryFailureAction(failureId) {
  const result = requestRetry(failureId);
  if (result.status === "PASS") {
    updateFailure(failureId, { status: "retrying" });
    appendLifecycleEvent({
      workflow_id: null,
      task_id: result.entry.task_id || "unknown",
      stage: "retrying",
      status: "PASS",
      summary: `retry queued for ${failureId}`,
      artifact_refs: [],
    });
    writeGovernanceSnapshot({
      workflow_status: "retrying",
      current_approval_state: null,
      latest_failure_id: failureId,
      latest_task_id: result.entry.task_id || null,
      last_executor_result: "retry_queued",
    });
    appendAuditRecord({
      workflow_id: null,
      task_id: result.entry.task_id || "unknown",
      actor_type: "dashboard_operator",
      actor_id: "retry_queue_manager",
      action: "failure.retry",
      decision: "queued",
      reason: `retry queued for ${failureId}`,
      refs: [],
    });
    appendActivityFeed({
      workflow_id: null,
      task_id: result.entry.task_id || "unknown",
      event_type: "retry_scheduled",
      short_text: `retry queued for ${failureId}`,
      severity: "warn",
      refs: [],
    });
    writeGovernanceReport({
      workflow_id: null,
      task_id: result.entry.task_id || "unknown",
      session_id: null,
      report_type: "RETRY_TRIGGERED",
      summary: `retry queued for ${failureId}`,
      risk_level: "medium",
      approval_state: null,
      execution_state: "retrying",
      failure_state: failureId,
      retry_state: "queued",
      boundary_state: "clear",
      refs: [],
    });
    upsertWorkflowSummary({
      workflow_id: `task_${result.entry.task_id || "unknown"}`,
      task_id: result.entry.task_id || "unknown",
      current_stage: "retrying",
      approval_state: null,
      last_action: "failure.retry",
      latest_refs: [],
    });
  }
  return result;
}

module.exports = {
  WORKFLOW_STATE_PATH,
  WORKFLOW_STEPS,
  WORKFLOW_POLICIES,
  getHealth,
  getStatus,
  startAgent,
  stopAgent,
  restartAgent,
  runBridgeCommand,
  getLatestReports,
  getRecentLogs,
  getQueueStatus,
  getApprovalInbox,
  getFailureCenter,
  getRetryQueue,
  getTaskLifecycle,
  getGovernanceSnapshotLatest,
  getGovernanceReports,
  getActivityFeedView,
  getWorkflowSummaryView,
  getAuditTrailView,
  getWorkflowReport,
  getTaskPlan,
  runWorkflow,
  approveWorkflow,
  rejectWorkflow,
  approveApproval,
  rejectApproval,
  retryFailureAction,
};
