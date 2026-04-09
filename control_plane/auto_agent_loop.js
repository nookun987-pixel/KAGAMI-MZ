"use strict";

const { createExecutionStateRecord, transitionExecutionState } = require("./execution_state_machine");
const { evaluateActionApproval } = require("./approval_engine");
const { writeActionReport } = require("./action_report_writer");
const { executeBounded } = require("./bounded_executor");
const { inspectCommand } = require("./local_control_agent/command_router");
const { createAutoTask } = require("./auto_task_generator");
const { resolveIntentToTask } = require("./intent_resolver");
const { evaluateLoopSafety, markLoopUsage } = require("./loop_stability_guard");
const { appendAuditRecord } = require("./audit_trail_store");
const { appendActivityFeed } = require("./operator_activity_feed");

async function runAutoAgentLoop(commandEntry) {
  const command = commandEntry.payload;
  let stateRecord = createExecutionStateRecord({
    task_id: command.payload && command.payload.task_id || null,
    action: command.action,
    requested_by: command.requested_by,
    approval_status: command.approval && command.approval.status || "pending",
  });
  stateRecord = transitionExecutionState(stateRecord, "planned", { note: "command_inspected" });
  const inspection = inspectCommand(command);
  const approval = evaluateActionApproval(command, inspection.tool_type, { reason: inspection.reason });
  if (!inspection.ok || !approval.allowed) {
    const nextState = approval.approval_state === "pending" ? "awaiting_approval" : "blocked";
    stateRecord = transitionExecutionState(stateRecord, nextState, { note: inspection.reason || approval.reason });
    const reportInfo = writeActionReport(commandEntry, command, stateRecord, {
      status: nextState === "awaiting_approval" ? "BLOCKED" : "FAIL",
      risk: approval.policy || inspection.tool_type || "unknown",
      next: nextState === "awaiting_approval" ? "wait_for_approval" : "review_blocker",
      result: {
        inspection,
        approval,
      },
    });
    return {
      status: nextState === "awaiting_approval" ? "BLOCKED" : "FAIL",
      task_id: stateRecord.task_id,
      result: reportInfo.report.result,
      report: reportInfo.report,
    };
  }
  stateRecord = transitionExecutionState(stateRecord, "approved", { note: approval.reason });
  stateRecord = transitionExecutionState(stateRecord, "executing", { note: "bounded_executor_start" });
  const execution = await executeBounded(command);
  stateRecord = transitionExecutionState(stateRecord, execution.status === "PASS" ? "done" : "failed", { note: execution.status });
  const reportInfo = writeActionReport(commandEntry, command, stateRecord, {
    status: execution.status,
    risk: approval.policy || inspection.tool_type || "unknown",
    next: execution.status === "PASS" ? "none" : "review_failure",
    result: {
      inspection,
      approval,
      execution,
    },
    files: execution.execution_result && execution.execution_result.changed_files || [],
  });
  return {
    status: execution.status,
    task_id: stateRecord.task_id,
    result: reportInfo.report.result,
    report: reportInfo.report,
  };
}

function runGuardedAutonomyFromIntent(intent, context = {}) {
  const safety = evaluateLoopSafety({
    depth: intent.depth,
    failure_fingerprint: context.failure_fingerprint || null,
    retry_source: context.retry_source || null,
  });
  if (!safety.allowed) {
    appendAuditRecord({
      workflow_id: context.workflow_id || intent.workflow_id || null,
      task_id: intent.task_id || null,
      intent_id: intent.intent_id,
      actor_type: "system_guard",
      actor_id: "loop_stability_guard",
      action: "intent.evaluate",
      decision: "blocked",
      reason: safety.reason,
      refs: [intent.source_ref].filter(Boolean),
    });
    return { status: "BLOCKED", reason: safety.reason };
  }
  appendActivityFeed({
    workflow_id: context.workflow_id || intent.workflow_id || null,
    task_id: intent.task_id || null,
    intent_id: intent.intent_id,
    event_type: "intent_created",
    short_text: intent.goal,
    severity: intent.risk_level || "info",
    refs: [intent.source_ref].filter(Boolean),
  });
  const resolvedTask = resolveIntentToTask(intent);
  const created = createAutoTask(intent, resolvedTask);
  if (created.status !== "PASS") {
    return created;
  }
  markLoopUsage({
    failure_fingerprint: context.failure_fingerprint || null,
    retry_source: context.retry_source || null,
    intent_id: intent.intent_id,
    depth: intent.depth,
  });
  appendAuditRecord({
    workflow_id: context.workflow_id || intent.workflow_id || null,
    task_id: created.task.task_id,
    intent_id: intent.intent_id,
    source_ref: intent.source_ref || null,
    generated_task_id: created.task.task_id,
    actor_type: "auto_agent",
    actor_id: "auto_agent_loop",
    action: "intent.resolve",
    decision: "task_generated",
    reason: intent.goal,
    refs: [created.task.task_path],
  });
  appendActivityFeed({
    workflow_id: context.workflow_id || intent.workflow_id || null,
    task_id: created.task.task_id,
    intent_id: intent.intent_id,
    event_type: "auto_task_generated",
    short_text: created.task.task_id,
    severity: "info",
    refs: [created.task.task_path],
  });
  return {
    status: "PASS",
    task: created.task,
    resolved_task: resolvedTask,
  };
}

module.exports = {
  runAutoAgentLoop,
  runGuardedAutonomyFromIntent,
};
