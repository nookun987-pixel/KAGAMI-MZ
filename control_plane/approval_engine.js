"use strict";

const fs = require("fs");
const path = require("path");

const { getSessionState } = require("./session_manager");
const {
  createApprovalItem,
  resolveApprovalItem,
  readApprovalInbox,
} = require("./approval_inbox_store");
const RULES_PATH = path.join(__dirname, "approval_rules.json");

function readRules() {
  return JSON.parse(fs.readFileSync(RULES_PATH, "utf8"));
}

function resolveActionPolicy(toolType) {
  const rules = readRules();
  const tiers = rules.tiers || {};
  return tiers[String(toolType || "unknown")] || tiers.unknown || "block";
}

function requiresExecutorHandoff(command) {
  return !!(command && command.action === "codex.build_task");
}

function queueApproval(command, toolType, reason, extra = {}) {
  const taskId = command && command.payload && command.payload.task_id;
  const sessions = getSessionState();
  return createApprovalItem({
    workflow_id: extra.workflow_id || command.command_id,
    task_id: taskId || null,
    session_id: sessions.user_session && sessions.user_session.session_id || null,
    requested_by: command.requested_by || "local_control_agent",
    action_type: toolType,
    tool_name: command.action,
    risk_level: extra.risk_level || (toolType === "write" ? "medium" : "high"),
    summary: extra.summary || `Approval required for ${command.action}`,
    reason,
    preview_ref: extra.preview_ref || null,
    diff_ref: extra.diff_ref || "NO_DIFF_AVAILABLE",
    task_contract_ref: extra.task_contract_ref || null,
    task_brief_ref: extra.task_brief_ref || null,
    codex_dispatch_pack_ref: extra.codex_dispatch_pack_ref || null,
    goal_state_ref: extra.goal_state_ref || null,
    progress_eval_ref: extra.progress_eval_ref || null,
    next_task_decision_ref: extra.next_task_decision_ref || null,
    repo_health_scan_ref: extra.repo_health_scan_ref || null,
    maintenance_issues_ref: extra.maintenance_issues_ref || null,
    self_heal_decision_ref: extra.self_heal_decision_ref || null,
    command_ref: command.command_id,
    command_snapshot: {
      action: command.action,
      payload: command.payload || {},
      requested_by: command.requested_by || "local_control_agent",
    },
  });
}

function evaluateActionApproval(command, toolType, context = {}) {
  const policy = resolveActionPolicy(toolType);
  const reason = context.reason || "approval_required";
  const planFailureReasons = new Set(["missing_task_id", "missing_task_plan_file"]);
  if (planFailureReasons.has(reason)) {
    const queued = queueApproval(command, toolType, reason, {
      artifacts_written: context.artifacts_written || [],
      summary: context.summary,
      preview_ref: context.preview_ref,
      diff_ref: context.diff_ref,
      task_contract_ref: context.task_contract_ref,
      task_brief_ref: context.task_brief_ref,
      codex_dispatch_pack_ref: context.codex_dispatch_pack_ref,
    });
    return {
      allowed: false,
      policy,
      approval_state: "pending",
      reason,
      queued,
    };
  }
  if (policy === "auto") {
    return {
      allowed: true,
      policy,
      approval_state: "auto_allow",
      reason: "auto_allow_read",
      queued: null,
    };
  }
  if (policy === "block") {
    return {
      allowed: false,
      policy,
      approval_state: "blocked",
      reason,
      queued: null,
    };
  }

  const approvalStatus = command && command.approval && command.approval.status;
  if (approvalStatus === "approved") {
    return {
      allowed: true,
      policy,
      approval_state: "approved",
      reason: "explicit_approval_present",
      queued: null,
    };
  }

  const queued = queueApproval(command, toolType, context.reason || "approval_required", {
    artifacts_written: context.artifacts_written || [],
    summary: context.summary,
    preview_ref: context.preview_ref,
    diff_ref: context.diff_ref,
    task_contract_ref: context.task_contract_ref,
    task_brief_ref: context.task_brief_ref,
    codex_dispatch_pack_ref: context.codex_dispatch_pack_ref,
  });
  return {
    allowed: false,
    policy,
    approval_state: "pending",
    reason: context.reason || "approval_required",
    queued,
  };
}

function approveTask(taskId, reviewedBy = "telegram_operator") {
  return resolveApprovalItem(taskId, "approved", reviewedBy);
}

function rejectTask(taskId, reviewedBy = "telegram_operator") {
  return resolveApprovalItem(taskId, "rejected", reviewedBy);
}

module.exports = {
  RULES_PATH,
  readRules,
  readApprovalQueue: readApprovalInbox,
  resolveActionPolicy,
  requiresExecutorHandoff,
  evaluateActionApproval,
  queueApproval,
  approveTask,
  rejectTask,
};
