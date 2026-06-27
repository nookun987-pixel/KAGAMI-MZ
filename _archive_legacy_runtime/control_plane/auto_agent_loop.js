"use strict";

const fs = require("fs");

const config = require("./local_control_agent/config");
const { logAudit } = require("./local_control_agent/audit_logger");
const snapshotWriter = require("./local_control_agent/snapshot_writer");
const { validateToolCommand } = require("./tool_validator");
const { enforcePlanFirst } = require("./plan_guard");
const { evaluateActionApproval } = require("./approval_engine");
const { registerWorkflowRun } = require("./workflow_registry");
const { buildActionPreview } = require("./action_preview_builder");
const { buildDiffPreview } = require("./diff_preview_builder");
const { recordFailure } = require("./failure_center_store");
const { requestRetry } = require("./retry_queue_manager");
const { appendLifecycleEvent } = require("./lifecycle_timeline_writer");
const { writeGovernanceSnapshot } = require("./governance_snapshot_writer");
const { writeGovernanceReport } = require("./governance_report_writer");
const { appendActivityFeed } = require("./operator_activity_feed");
const { appendAuditRecord } = require("./audit_trail_store");
const { upsertWorkflowSummary } = require("./workflow_summary_view");
const { createIntentFromFailure, createIntentFromRetry, createIntentFromCompletion } = require("./intent_engine");
const { resolveIntentToTask } = require("./intent_resolver");
const { createAutoTask } = require("./auto_task_generator");
const { evaluateLoopSafety, markLoopUsage } = require("./loop_stability_guard");
const { resolveTaskIntake } = require("./task_intake_resolver");
const { buildActionPlan } = require("./action_planner");
const { createExecutionStateRecord, transitionExecutionState } = require("./execution_state_machine");
const { evaluateRuntimeBoundary } = require("./runtime_boundary_guard");
const { executeBounded } = require("./bounded_executor");
const { writeActionReport } = require("./action_report_writer");

function readApprovalModel() {
  return JSON.parse(fs.readFileSync(config.APPROVAL_MODEL, "utf8"));
}

function registerTaskRun(command, stateRecord, details = {}) {
  return registerWorkflowRun({
    id: `task_${stateRecord.task_id}_${Date.now()}`,
    workflow: "AUTO_AGENT_LOOP",
    task_id: stateRecord.task_id,
    action: command.action,
    requested_by: stateRecord.requested_by,
    reviewed_by: details.reviewed_by || null,
    approval_state: stateRecord.approval_status,
    execution_state: stateRecord.state,
    started_at: stateRecord.created_at,
    ended_at: new Date().toISOString(),
    artifacts_written: details.artifacts_written || [],
    final_verdict: details.final_verdict || "BLOCKED",
    blocker_reason: details.blocker_reason || null,
    status: details.status || "BLOCKED",
    steps: stateRecord.history || [],
  });
}

function recordLifecycle(taskId, workflowId, stage, status, summary, artifactRefs = []) {
  return appendLifecycleEvent({
    workflow_id: workflowId,
    task_id: taskId,
    stage,
    status,
    summary,
    artifact_refs: artifactRefs,
  });
}

function trackFailure(command, stateRecord, input = {}) {
  return recordFailure({
    workflow_id: `task_${stateRecord.task_id}`,
    task_id: stateRecord.task_id,
    action_id: command.command_id,
    action_type: input.action_type || "unknown",
    failure_code: input.failure_code,
    failure_stage: input.failure_stage,
    message: input.message,
    retryable: !!input.retryable,
    report_ref: input.report_ref || null,
    command_ref: command.command_id,
    status: input.status || "open",
  });
}

function emitGovernanceBundle(input) {
  const refs = input.refs || [];
  writeGovernanceReport({
    workflow_id: input.workflow_id,
    task_id: input.task_id,
    session_id: input.session_id || null,
    report_type: input.report_type,
    summary: input.summary,
    risk_level: input.risk_level || "medium",
    approval_state: input.approval_state || null,
    execution_state: input.execution_state || null,
    failure_state: input.failure_state || null,
    retry_state: input.retry_state || null,
    boundary_state: input.boundary_state || null,
    refs,
  });
  appendActivityFeed({
    workflow_id: input.workflow_id,
    task_id: input.task_id,
    event_type: input.event_type,
    short_text: input.summary,
    severity: input.severity || "info",
    refs,
  });
  appendAuditRecord({
    workflow_id: input.workflow_id,
    task_id: input.task_id,
    actor_type: input.actor_type || "auto_agent",
    actor_id: input.actor_id || "auto_agent_loop",
    action: input.action,
    decision: input.decision,
    reason: input.summary,
    refs,
  });
  upsertWorkflowSummary({
    workflow_id: input.workflow_id,
    task_id: input.task_id,
    current_stage: input.current_stage,
    approval_state: input.approval_state || null,
    last_action: input.action,
    latest_refs: refs,
  });
}

function runGuardedAutonomyFromIntent(intent, options = {}) {
  const loopCheck = evaluateLoopSafety({
    depth: intent.depth || 1,
    failure_fingerprint: options.failure_fingerprint || null,
    retry_source: options.retry_source || null,
  });
  if (!loopCheck.allowed) {
    appendAuditRecord({
      workflow_id: options.workflow_id || intent.workflow_id || null,
      task_id: intent.task_id || null,
      intent_id: intent.intent_id,
      source_ref: intent.source_ref || null,
      actor_type: "system_guard",
      actor_id: "loop_stability_guard",
      action: "intent.evaluate",
      decision: "blocked",
      reason: loopCheck.reason,
      refs: intent.refs || [],
    });
    return { status: "BLOCKED", reason: loopCheck.reason };
  }

  appendActivityFeed({
    workflow_id: options.workflow_id || intent.workflow_id || null,
    task_id: intent.task_id || null,
    intent_id: intent.intent_id,
    event_type: "intent_created",
    short_text: intent.goal,
    severity: intent.risk_level === "high" ? "high" : "info",
    refs: intent.refs || [],
  });
  appendAuditRecord({
    workflow_id: options.workflow_id || intent.workflow_id || null,
    task_id: intent.task_id || null,
    intent_id: intent.intent_id,
    source_ref: intent.source_ref || null,
    actor_type: "auto_agent",
    actor_id: "intent_engine",
    action: "intent.create",
    decision: "recorded",
    reason: intent.goal,
    refs: intent.refs || [],
  });

  const resolvedTask = resolveIntentToTask(intent);
  const created = createAutoTask(intent, resolvedTask);
  if (created.status !== "PASS") {
    appendAuditRecord({
      workflow_id: options.workflow_id || intent.workflow_id || null,
      task_id: intent.task_id || null,
      intent_id: intent.intent_id,
      source_ref: intent.source_ref || null,
      actor_type: "system_guard",
      actor_id: "auto_task_generator",
      action: "auto_task.create",
      decision: "blocked",
      reason: created.reason,
      refs: intent.refs || [],
    });
    return created;
  }

  markLoopUsage({
    intent_id: intent.intent_id,
    depth: intent.depth || 1,
    failure_fingerprint: options.failure_fingerprint || null,
    retry_source: options.retry_source || null,
  });
  appendActivityFeed({
    workflow_id: options.workflow_id || intent.workflow_id || null,
    task_id: created.task.task_id,
    intent_id: intent.intent_id,
    event_type: "auto_task_generated",
    short_text: `auto task generated ${created.task.task_id}`,
    severity: "info",
    refs: [created.task.task_path],
  });
  appendAuditRecord({
    workflow_id: options.workflow_id || intent.workflow_id || null,
    task_id: created.task.task_id,
    intent_id: intent.intent_id,
    source_ref: intent.source_ref || null,
    generated_task_id: created.task.task_id,
    actor_type: "auto_agent",
    actor_id: "auto_task_generator",
    action: "auto_task.create",
    decision: "created",
    reason: intent.goal,
    refs: [created.task.task_path],
  });
  return created;
}

async function runAutoAgentLoop(commandEntry) {
  const command = commandEntry.payload;
  const intake = resolveTaskIntake(commandEntry);
  const plan = buildActionPlan(intake);
  const workflowId = `task_${intake.task_id}`;
  let stateRecord = createExecutionStateRecord(intake);
  recordLifecycle(intake.task_id, workflowId, "task_received", "PASS", "task received", []);
  emitGovernanceBundle({
    workflow_id: workflowId,
    task_id: intake.task_id,
    session_id: intake.command && intake.command.session_id || null,
    report_type: "WORKFLOW_SUMMARY",
    summary: "task created",
    approval_state: stateRecord.approval_status,
    execution_state: stateRecord.state,
    event_type: "task_created",
    severity: "info",
    action: command.action,
    decision: "recorded",
    current_stage: "task_received",
  });
  recordLifecycle(intake.task_id, workflowId, "resolved", "PASS", "task intake resolved", []);
  emitGovernanceBundle({
    workflow_id: workflowId,
    task_id: intake.task_id,
    report_type: "WORKFLOW_SUMMARY",
    summary: "plan attached",
    approval_state: stateRecord.approval_status,
    execution_state: stateRecord.state,
    event_type: "plan_attached",
    severity: "info",
    action: command.action,
    decision: "resolved",
    current_stage: "resolved",
  });
  stateRecord = transitionExecutionState(stateRecord, "planned", { note: "action_planned", plan });
  recordLifecycle(intake.task_id, workflowId, "planned", "PASS", "action planned", []);

  const runtimeBoundary = evaluateRuntimeBoundary(command);
  if (!runtimeBoundary.allowed) {
    stateRecord = transitionExecutionState(stateRecord, "blocked", {
      note: "runtime_boundary_guard",
      reason: runtimeBoundary.reason,
    });
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "BLOCKED",
      files: runtimeBoundary.touched_files,
      risk: runtimeBoundary.reason,
      next: "review_runtime_boundary",
      result: { plan, runtime_boundary: runtimeBoundary },
    });
    const failure = trackFailure(command, stateRecord, {
      action_type: "unknown",
      failure_code: "BOUNDARY_BLOCK",
      failure_stage: "runtime_boundary_guard",
      message: runtimeBoundary.reason,
      retryable: false,
      report_ref: written.resultPaths.jsonPath,
    });
    recordLifecycle(intake.task_id, workflowId, "blocked", "BLOCKED", runtimeBoundary.reason, [written.resultPaths.jsonPath]);
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "BLOCKED_ACTION",
      summary: runtimeBoundary.reason,
      risk_level: "high",
      approval_state: stateRecord.approval_status,
      execution_state: "blocked",
      failure_state: "BOUNDARY_BLOCK",
      boundary_state: "blocked",
      event_type: "boundary_blocked",
      severity: "high",
      action: command.action,
      decision: "blocked",
      current_stage: "blocked",
      refs: [written.resultPaths.jsonPath],
      actor_type: "system_guard",
      actor_id: "runtime_boundary_guard",
    });
    registerTaskRun(command, stateRecord, {
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath],
      blocker_reason: runtimeBoundary.reason,
      status: "BLOCKED",
      final_verdict: "BLOCKED",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: runtimeBoundary.reason });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    writeGovernanceSnapshot({
      workflow_status: "failed",
      current_approval_state: "blocked",
      last_executor_result: "boundary_block",
      boundary_violations_count: 1,
      latest_failure_id: failure.failure_id,
      latest_task_id: intake.task_id,
    });
    return written.report;
  }

  const approvalModel = readApprovalModel();
  const reviewedRepoActions = ((approvalModel.node_role_policy || {}).reviewed_repo_actions) || [];
  const supportOverrideRequired = !!((approvalModel.node_role_policy || {}).support_node_requires_explicit_override);
  if (!config.NODE_ROLE.permissions.reviewed_repo_mutation && reviewedRepoActions.includes(command.action)) {
    const explicitOverride = !!(command.payload && command.payload.explicit_support_override);
    if (!supportOverrideRequired || !explicitOverride) {
      stateRecord = transitionExecutionState(stateRecord, "blocked", {
        note: "node_role_policy",
        reason: "node_role_blocks_reviewed_repo_mutation",
      });
      const written = writeActionReport(commandEntry, command, stateRecord, {
        status: "BLOCKED",
        files: runtimeBoundary.touched_files,
        risk: "node_role_blocks_reviewed_repo_mutation",
        next: "use_commander_node_or_explicit_override",
        result: { plan, runtime_boundary: runtimeBoundary },
      });
      const failure = trackFailure(command, stateRecord, {
        action_type: "write",
        failure_code: "UNKNOWN_BLOCKED",
        failure_stage: "node_role_policy",
        message: "node_role_blocks_reviewed_repo_mutation",
        retryable: false,
        report_ref: written.resultPaths.jsonPath,
      });
      recordLifecycle(intake.task_id, workflowId, "blocked", "BLOCKED", "node role blocked reviewed repo mutation", [written.resultPaths.jsonPath]);
      emitGovernanceBundle({
        workflow_id: workflowId,
        task_id: intake.task_id,
        report_type: "BLOCKED_ACTION",
        summary: "node role blocked reviewed repo mutation",
        risk_level: "high",
        approval_state: stateRecord.approval_status,
        execution_state: "blocked",
        failure_state: "UNKNOWN_BLOCKED",
        boundary_state: "blocked",
        event_type: "boundary_blocked",
        severity: "high",
        action: command.action,
        decision: "blocked",
        current_stage: "blocked",
        refs: [written.resultPaths.jsonPath],
        actor_type: "system_guard",
        actor_id: "node_role_policy",
      });
      registerTaskRun(command, stateRecord, {
        artifacts_written: [written.resultPaths.jsonPath, written.archivePath],
        blocker_reason: "node_role_blocks_reviewed_repo_mutation",
        status: "BLOCKED",
        final_verdict: "BLOCKED",
      });
      logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: "node_role_blocks_reviewed_repo_mutation" });
      snapshotWriter.writeSnapshot({ agent_status: "blocked" });
      writeGovernanceSnapshot({
        workflow_status: "failed",
        current_approval_state: "blocked",
        last_executor_result: "node_role_block",
        latest_failure_id: failure.failure_id,
        latest_task_id: intake.task_id,
      });
      return written.report;
    }
  }

  const validation = validateToolCommand(command);
  if (!validation.valid) {
    stateRecord = transitionExecutionState(stateRecord, "blocked", {
      note: "tool_validator",
      reason: validation.reason,
    });
    const approval = evaluateActionApproval(command, validation.tool_type, {
      reason: validation.reason,
      artifacts_written: [],
    });
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "BLOCKED",
      files: runtimeBoundary.touched_files,
      risk: validation.reason,
      next: "fix_tool_contract",
      result: { plan, runtime_boundary: runtimeBoundary, validation, approval },
    });
    const failure = trackFailure(command, stateRecord, {
      action_type: validation.tool_type,
      failure_code: "TOOL_SCHEMA_INVALID",
      failure_stage: "tool_validator",
      message: validation.reason,
      retryable: false,
      report_ref: written.resultPaths.jsonPath,
    });
    recordLifecycle(intake.task_id, workflowId, "blocked", "BLOCKED", validation.reason, [written.resultPaths.jsonPath]);
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "BLOCKED_ACTION",
      summary: validation.reason,
      risk_level: "high",
      approval_state: stateRecord.approval_status,
      execution_state: "blocked",
      failure_state: "TOOL_SCHEMA_INVALID",
      boundary_state: "clear",
      event_type: "boundary_blocked",
      severity: "high",
      action: command.action,
      decision: "blocked",
      current_stage: "blocked",
      refs: [written.resultPaths.jsonPath],
      actor_type: "system_guard",
      actor_id: "tool_validator",
    });
    registerTaskRun(command, stateRecord, {
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath],
      blocker_reason: validation.reason,
      status: "BLOCKED",
      final_verdict: "BLOCKED",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: validation.reason });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    writeGovernanceSnapshot({
      workflow_status: "failed",
      current_approval_state: "blocked",
      last_executor_result: "tool_schema_invalid",
      latest_failure_id: failure.failure_id,
      latest_task_id: intake.task_id,
    });
    return written.report;
  }
  recordLifecycle(intake.task_id, workflowId, "validated", "PASS", "tool schema validated", []);

  const planCheck = enforcePlanFirst(validation.tool_type, command);
  if (!planCheck.allowed) {
    stateRecord = transitionExecutionState(stateRecord, "awaiting_approval", {
      note: "plan_guard",
      reason: planCheck.reason,
      task_path: planCheck.task_path,
    });
    const approval = evaluateActionApproval(command, validation.tool_type, {
      reason: planCheck.reason,
      artifacts_written: planCheck.task_path ? [planCheck.task_path] : [],
    });
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "BLOCKED",
      files: runtimeBoundary.touched_files,
      risk: planCheck.reason,
      next: "create_task_plan_or_approve",
      result: { plan, runtime_boundary: runtimeBoundary, validation, plan_check: planCheck, approval },
    });
    const failure = trackFailure(command, stateRecord, {
      action_type: validation.tool_type,
      failure_code: "PLAN_MISSING",
      failure_stage: "plan_guard",
      message: planCheck.reason,
      retryable: false,
      report_ref: written.resultPaths.jsonPath,
    });
    recordLifecycle(intake.task_id, workflowId, "approval_pending", "BLOCKED", planCheck.reason, [written.resultPaths.jsonPath]);
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "APPROVAL_PENDING",
      summary: planCheck.reason,
      risk_level: "medium",
      approval_state: "pending",
      execution_state: "awaiting_approval",
      failure_state: "PLAN_MISSING",
      retry_state: "none",
      boundary_state: "clear",
      event_type: "approval_requested",
      severity: "warn",
      action: command.action,
      decision: "blocked",
      current_stage: "approval_pending",
      refs: [written.resultPaths.jsonPath],
      actor_type: "system_guard",
      actor_id: "plan_guard",
    });
    registerTaskRun(command, stateRecord, {
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath],
      blocker_reason: planCheck.reason,
      status: "BLOCKED",
      final_verdict: "BLOCKED",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: planCheck.reason });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    writeGovernanceSnapshot({
      workflow_status: "approval_pending",
      current_approval_state: "pending",
      last_executor_result: "plan_missing",
      latest_failure_id: failure.failure_id,
      latest_task_id: intake.task_id,
    });
    return written.report;
  }

  let preview = null;
  let diffPreview = null;
  if (validation.tool_type === "write") {
    preview = buildActionPreview(command, {
      tool_type: validation.tool_type,
      risk_note: runtimeBoundary.architecture_sensitive ? "architecture-sensitive write" : "write action requires review",
      boundary_note: runtimeBoundary.reason,
      plan_reference: planCheck.task_path,
    });
    if (preview.status !== "PASS") {
      stateRecord = transitionExecutionState(stateRecord, "blocked", {
        note: "preview_builder",
        reason: preview.reason,
      });
      const written = writeActionReport(commandEntry, command, stateRecord, {
        status: "BLOCKED",
        files: runtimeBoundary.touched_files,
        risk: preview.reason,
        next: "fix_preview_builder",
        result: { plan, runtime_boundary: runtimeBoundary, validation, plan_check: planCheck, preview },
      });
      const failure = trackFailure(command, stateRecord, {
        action_type: validation.tool_type,
        failure_code: "PREVIEW_BUILD_FAILED",
        failure_stage: "action_preview_builder",
        message: preview.reason,
        retryable: true,
        report_ref: written.resultPaths.jsonPath,
      });
      requestRetry(failure.failure_id);
      recordLifecycle(intake.task_id, workflowId, "blocked", "BLOCKED", preview.reason, [written.resultPaths.jsonPath]);
      registerTaskRun(command, stateRecord, {
        artifacts_written: [written.resultPaths.jsonPath, written.archivePath],
        blocker_reason: preview.reason,
        status: "BLOCKED",
        final_verdict: "BLOCKED",
      });
      writeGovernanceSnapshot({
        workflow_status: "retrying",
        current_approval_state: "blocked",
        last_executor_result: "preview_build_failed",
        latest_failure_id: failure.failure_id,
        latest_task_id: intake.task_id,
      });
      return written.report;
    }
    diffPreview = buildDiffPreview(command);
  }

  const approval = evaluateActionApproval(command, validation.tool_type, {
    reason: "approval_required",
    artifacts_written: planCheck.task_path ? [planCheck.task_path] : [],
    workflow_id: workflowId,
    preview_ref: preview && preview.artifact_path || null,
    diff_ref: diffPreview && diffPreview.artifact_path || "NO_DIFF_AVAILABLE",
    summary: preview && preview.preview && preview.preview.action_summary || `Approval required for ${command.action}`,
    risk_level: validation.tool_type === "write" ? "medium" : "low",
  });
  if (!approval.allowed) {
    stateRecord = transitionExecutionState(stateRecord, "awaiting_approval", {
      note: "approval_engine",
      reason: approval.reason,
    });
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "BLOCKED",
      files: runtimeBoundary.touched_files,
      risk: approval.reason,
      next: "wait_for_explicit_approval",
      result: { plan, runtime_boundary: runtimeBoundary, validation, plan_check: planCheck, preview, diff_preview: diffPreview, approval },
    });
    const failure = trackFailure(command, stateRecord, {
      action_type: validation.tool_type,
      failure_code: "APPROVAL_MISSING",
      failure_stage: "approval_engine",
      message: approval.reason,
      retryable: false,
      report_ref: written.resultPaths.jsonPath,
    });
    recordLifecycle(intake.task_id, workflowId, "approval_pending", "BLOCKED", approval.reason, [written.resultPaths.jsonPath, preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean));
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "APPROVAL_PENDING",
      summary: approval.reason,
      risk_level: validation.tool_type === "write" ? "medium" : "low",
      approval_state: approval.approval_state,
      execution_state: "awaiting_approval",
      failure_state: "APPROVAL_MISSING",
      retry_state: "none",
      boundary_state: runtimeBoundary.architecture_sensitive ? "sensitive" : "clear",
      event_type: "approval_requested",
      severity: "warn",
      action: command.action,
      decision: "queued",
      current_stage: "approval_pending",
      refs: [written.resultPaths.jsonPath, preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean),
      actor_type: "auto_agent",
      actor_id: "approval_engine",
    });
    registerTaskRun(command, stateRecord, {
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath, preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean),
      blocker_reason: approval.reason,
      status: "BLOCKED",
      final_verdict: "BLOCKED",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: approval.reason });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    writeGovernanceSnapshot({
      workflow_status: "approval_pending",
      current_approval_state: approval.approval_state,
      last_executor_result: "awaiting_approval",
      latest_approval_id: approval.queued && approval.queued.item && approval.queued.item.approval_id || approval.queued && approval.queued.approval_id || null,
      latest_failure_id: failure.failure_id,
      latest_task_id: intake.task_id,
    });
    return written.report;
  }

  stateRecord = transitionExecutionState(stateRecord, "approved", {
    note: "approval_granted",
    approval_state: approval.approval_state,
  });
  stateRecord.approval_status = approval.approval_state;
  recordLifecycle(intake.task_id, workflowId, "approved", "PASS", "approval granted", [preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean));
  emitGovernanceBundle({
    workflow_id: workflowId,
    task_id: intake.task_id,
    report_type: "APPROVAL_RESOLVED",
    summary: "approval granted",
    risk_level: validation.tool_type === "write" ? "medium" : "low",
    approval_state: approval.approval_state,
    execution_state: "approved",
    failure_state: null,
    retry_state: "none",
    boundary_state: runtimeBoundary.architecture_sensitive ? "sensitive" : "clear",
    event_type: "approval_approved",
    severity: "info",
    action: command.action,
    decision: "approved",
    current_stage: "approved",
    refs: [preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean),
  });
  writeGovernanceSnapshot({
    workflow_status: "approved",
    current_approval_state: approval.approval_state,
    last_executor_result: "approved",
    latest_task_id: intake.task_id,
  });
  stateRecord = transitionExecutionState(stateRecord, "executing", { note: "bounded_executor_start" });
  recordLifecycle(intake.task_id, workflowId, "executing", "PASS", "bounded executor running", []);
  emitGovernanceBundle({
    workflow_id: workflowId,
    task_id: intake.task_id,
    report_type: "WORKFLOW_SUMMARY",
    summary: "execution started",
    risk_level: "low",
    approval_state: approval.approval_state,
    execution_state: "executing",
    event_type: "execution_started",
    severity: "info",
    action: command.action,
    decision: "executing",
    current_stage: "executing",
  });

  try {
    const execution = await executeBounded(command, { inspection: { ok: true, tool_type: validation.tool_type, plan: planCheck } });
    stateRecord = transitionExecutionState(stateRecord, "done", {
      note: "execution_completed",
      duration_ms: execution.duration_ms,
    });
    const changedFiles = execution.execution_result && execution.execution_result.record && execution.execution_result.record.changed_files
      || runtimeBoundary.touched_files;
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "PASS",
      files: changedFiles,
      risk: runtimeBoundary.architecture_sensitive ? "architecture-sensitive but approved" : "low",
      next: "idle",
      result: {
        plan,
        runtime_boundary: runtimeBoundary,
        validation,
        plan_check: planCheck,
        preview,
        diff_preview: diffPreview,
        approval,
        execution,
      },
    });
    recordLifecycle(intake.task_id, workflowId, "succeeded", "PASS", "action execution succeeded", [written.resultPaths.jsonPath]);
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "EXECUTION_SUCCESS",
      summary: "execution succeeded",
      risk_level: "low",
      approval_state: approval.approval_state,
      execution_state: "done",
      failure_state: null,
      retry_state: "none",
      boundary_state: runtimeBoundary.architecture_sensitive ? "sensitive" : "clear",
      event_type: "execution_succeeded",
      severity: "info",
      action: command.action,
      decision: "succeeded",
      current_stage: "succeeded",
      refs: [written.resultPaths.jsonPath],
    });
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "WORKFLOW_SUMMARY",
      summary: "workflow closed successfully",
      risk_level: "low",
      approval_state: approval.approval_state,
      execution_state: "done",
      event_type: "workflow_closed",
      severity: "info",
      action: command.action,
      decision: "closed",
      current_stage: "succeeded",
      refs: [written.resultPaths.jsonPath],
    });
    registerTaskRun(command, stateRecord, {
      reviewed_by: command.approval && command.approval.reviewed_by || null,
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath, preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean),
      blocker_reason: null,
      status: "PASS",
      final_verdict: "PASS",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "PASS" });
    snapshotWriter.writeSnapshot({ agent_status: "idle" });
    writeGovernanceSnapshot({
      workflow_status: "succeeded",
      current_approval_state: approval.approval_state,
      last_executor_result: execution.status,
      latest_task_id: intake.task_id,
    });
    runGuardedAutonomyFromIntent(createIntentFromCompletion({
      workflow_id: workflowId,
      task_id: intake.task_id,
      status: "PASS",
      refs: [written.resultPaths.jsonPath],
    }), { workflow_id: workflowId });
    return written.report;
  } catch (error) {
    stateRecord = transitionExecutionState(stateRecord, "failed", {
      note: "execution_failed",
      error: error.message,
    });
    const written = writeActionReport(commandEntry, command, stateRecord, {
      status: "FAIL",
      files: runtimeBoundary.touched_files,
      risk: error.message,
      next: "inspect_agent_report",
      result: {
        plan,
        runtime_boundary: runtimeBoundary,
        validation,
        plan_check: planCheck,
        preview,
        diff_preview: diffPreview,
        approval,
        error: error.message,
      },
    });
    const failure = trackFailure(command, stateRecord, {
      action_type: validation.tool_type,
      failure_code: "EXECUTION_FAILED",
      failure_stage: "bounded_executor",
      message: error.message,
      retryable: true,
      report_ref: written.resultPaths.jsonPath,
    });
    const retry = requestRetry(failure.failure_id);
    recordLifecycle(intake.task_id, workflowId, retry.status === "PASS" ? "retrying" : "failed", "FAIL", error.message, [written.resultPaths.jsonPath]);
    emitGovernanceBundle({
      workflow_id: workflowId,
      task_id: intake.task_id,
      report_type: "EXECUTION_FAILED",
      summary: error.message,
      risk_level: "high",
      approval_state: approval.approval_state,
      execution_state: "failed",
      failure_state: "EXECUTION_FAILED",
      retry_state: retry.status === "PASS" ? "queued" : "exhausted",
      boundary_state: runtimeBoundary.architecture_sensitive ? "sensitive" : "clear",
      event_type: "execution_failed",
      severity: "high",
      action: command.action,
      decision: "failed",
      current_stage: retry.status === "PASS" ? "retrying" : "failed",
      refs: [written.resultPaths.jsonPath],
    });
    if (retry.status === "PASS") {
      emitGovernanceBundle({
        workflow_id: workflowId,
        task_id: intake.task_id,
        report_type: "RETRY_TRIGGERED",
        summary: `retry scheduled for ${failure.failure_id}`,
        risk_level: "medium",
        approval_state: approval.approval_state,
        execution_state: "failed",
        failure_state: "EXECUTION_FAILED",
        retry_state: "queued",
        boundary_state: "clear",
        event_type: "retry_scheduled",
        severity: "warn",
        action: command.action,
        decision: "retrying",
        current_stage: "retrying",
        refs: [written.resultPaths.jsonPath],
      });
      runGuardedAutonomyFromIntent(createIntentFromRetry({
        ...retry.entry,
      }), {
        workflow_id: workflowId,
        retry_source: retry.entry.failure_id,
      });
    } else {
      emitGovernanceBundle({
        workflow_id: workflowId,
        task_id: intake.task_id,
        report_type: "BLOCKED_ACTION",
        summary: "retry exhausted",
        risk_level: "high",
        approval_state: approval.approval_state,
        execution_state: "failed",
        failure_state: "RETRY_EXHAUSTED",
        retry_state: "exhausted",
        boundary_state: "clear",
        event_type: "workflow_closed",
        severity: "high",
        action: command.action,
        decision: "blocked",
        current_stage: "failed",
        refs: [written.resultPaths.jsonPath],
      });
    }
    runGuardedAutonomyFromIntent(createIntentFromFailure(failure), {
      workflow_id: workflowId,
      failure_fingerprint: failure.fingerprint,
    });
    registerTaskRun(command, stateRecord, {
      artifacts_written: [written.resultPaths.jsonPath, written.archivePath, preview && preview.artifact_path, diffPreview && diffPreview.artifact_path].filter(Boolean),
      blocker_reason: error.message,
      status: "FAIL",
      final_verdict: "FAIL",
    });
    logAudit({ command_id: command.command_id, action: command.action, status: "FAIL", reason: error.message });
    snapshotWriter.writeSnapshot({ agent_status: "error" });
    writeGovernanceSnapshot({
      workflow_status: retry.status === "PASS" ? "retrying" : "failed",
      current_approval_state: approval.approval_state,
      last_executor_result: "execution_failed",
      latest_failure_id: failure.failure_id,
      latest_task_id: intake.task_id,
    });
    return written.report;
  }
}

module.exports = {
  runGuardedAutonomyFromIntent,
  runAutoAgentLoop,
};
