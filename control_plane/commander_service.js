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
const { listExecutorJobs, getExecutorJob } = require("./executor_job_store");
const { getExecutorStatus } = require("./executor_status_tracker");
const { ingestExecutionOutcome } = require("./execution_result_ingestor");
const { readTaskLifecycle, appendLifecycleEvent } = require("./lifecycle_timeline_writer");
const { readJsonSafe: readBridgeJsonSafe } = require("./local_control_agent/bridge_writer");
const { writeGovernanceSnapshot } = require("./governance_snapshot_writer");
const { readGovernanceReports, writeGovernanceReport, readGovernanceReportByWorkflow } = require("./governance_report_writer");
const { getActivityFeed, appendActivityFeed } = require("./operator_activity_feed");
const { appendAuditRecord, getAuditTrailByTask } = require("./audit_trail_store");
const { getWorkflowSummary, upsertWorkflowSummary } = require("./workflow_summary_view");
const { readGoalStateRegistry, getGoalState, writeGoalStateArtifact } = require("./goal_state_registry");
const { evaluateProgress, writeProgressEvalArtifact } = require("./progress_evaluator");
const { planNextTasks, writeNextTaskCandidatesArtifact, writeNextTaskDecisionArtifact } = require("./next_task_planner");
const { evaluateAutonomyBudget, consumeAutonomyBudget } = require("./autonomy_budget_guard");
const { scanRepoHealth } = require("./repo_health_scanner");
const { registerMaintenanceIssues, readMaintenanceIssueRegistry } = require("./maintenance_issue_registry");
const { planSelfHeal, writeSelfHealCandidatesArtifact, writeSelfHealDecisionArtifact } = require("./self_heal_planner");
const { evaluateMaintenanceBudget, consumeMaintenanceBudget } = require("./maintenance_budget_guard");
const { readOperationProofs } = require("./operation_proof_writer");
const { readStabilityAnomalyRegistry } = require("./stability_anomaly_registry");
const { readOperatorFrictionReports } = require("./operator_friction_report_builder");
const { getGovernorStatus } = require("./process_governor");
const { buildTaskContract, writeTaskContractArtifact } = require("./task_contract");
const { buildSuggestions } = require("./next_task_suggester");
const { buildDigest } = require("./operator_digest_builder");
const { buildTaskBrief, writeTaskBriefArtifact } = require("./task_brief_builder");
const { buildCodexDispatchPack, writeCodexDispatchPackArtifact } = require("./codex_dispatch_pack_builder");
const { planMixedTask, stepContextFilePath } = require("./mixed_task_planner");
const {
  normalizeObjectiveText,
  isDestructiveObjective,
  isVagueObjective,
  buildGoalGuidance,
} = require("./task_goal_registry");
const { routeOperatorCommand } = require("./operator_router");
const { buildActionPreview } = require("./action_preview_builder");
const { createApprovalItem } = require("./approval_inbox_store");
const { createExecutorHandoff } = require("./executor_handoff_manager");
const { ingestExecutorOutput, getLatestResultIngest } = require("./result_ingest");
const { buildExecutionReport, writeExecutionReport, getLatestExecutionReport } = require("./report_builder");
const codexDispatcher = require("./local_control_agent/codex_dispatcher");
const { resolveTaskPath } = require("./plan_guard");
const { upsertQueueItem, getQueueItem } = require("./persistent_task_queue");
const { prepareResume, prepareRetry } = require("./execution_resume_manager");
const {
  buildRunId,
  registerWorkflowRun,
  getWorkflowHistory,
  recordExecutionOutcome,
  recordGoalLoopArtifacts,
  recordMaintenanceArtifacts,
  recordLiveOperationArtifacts,
  readApprovalQueue,
  enqueueApproval,
  resolveApproval,
} = require("./workflow_registry");

const WORKFLOW_STATE_PATH = path.join(config.STATE_DIR, "latest_workflow_report.json");
const SYSTEM_CONTROL_PATH = path.join(config.STATE_DIR, "system_control_state.json");
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
    process_governor: getGovernorStatus(50),
  };
}

function readSystemControlState() {
  return readJsonSafe(SYSTEM_CONTROL_PATH, {
    system_state: "running",
    updated_at: null,
  });
}

function writeSystemControlState(patch = {}) {
  const next = {
    ...readSystemControlState(),
    ...patch,
    updated_at: new Date().toISOString(),
  };
  writeJson(SYSTEM_CONTROL_PATH, next);
  return next;
}

function buildDeterministicTaskRoute(content, input = {}) {
  const mixed = planMixedTask(content, {
    parent_task_id: input.task_id || `task_${Date.now()}`,
    title: input.title,
  });
  if (mixed.status === "PASS" && mixed.is_mixed) {
    return mixed;
  }
  return routeOperatorCommand(content, input);
}

function summarizeMixedExecution(stepResults) {
  const completed = stepResults.filter((step) => step.status === "PASS");
  const failed = stepResults.find((step) => step.status !== "PASS");
  if (failed) {
    return `mixed flow stopped at step ${failed.order}: ${failed.summary || failed.status}`;
  }
  return `mixed flow completed ${completed.length} step(s): ${completed.map((step) => step.executor_lane).join(" -> ")}`;
}

function buildMixedExecutionReport(taskId, stepResults, artifacts) {
  const outPath = path.join(config.EXECUTION_REPORT_DIR, `${taskId}.mixed_execution_report.json`);
  const payload = {
    task_id: taskId,
    result: stepResults.every((step) => step.status === "PASS") ? "success" : "fail",
    summary: summarizeMixedExecution(stepResults),
    steps: stepResults,
    artifacts,
    generated_at: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  writeJson(outPath, payload);
  return { report: payload, path: outPath };
}

function buildSubtaskCommand(parentResolved, step) {
  return {
    command_id: `cmd_${step.step_id}`,
    action: "codex.build_task",
    requested_by: parentResolved.requested_by || "mixed_plan",
    payload: {
      task_id: step.step_id,
      task: step.content,
      objective: step.content,
      title: `${parentResolved.task_id} / step ${step.order}`,
      task_type: step.task_type,
      scope_in: step.scope_in,
      scope_out: [
        "start_mikage.bat",
        "MIKAGE/index.js",
        "runtime/drive_queue/runtime.js",
        "runtime/colab_worker/*",
      ],
      forbidden_paths: [
        "start_mikage.bat",
        "MIKAGE/index.js",
        "runtime/drive_queue/runtime.js",
        "runtime/colab_worker/*",
      ],
      success_criteria: step.success_criteria,
      executor: "codex",
      files: step.target_files,
      tests_required: step.tests_required,
    },
  };
}

function executeMixedApprovedPlan(resolved, dispatch, options = {}) {
  const plan = dispatch.mixed_plan;
  if (!plan || !Array.isArray(plan.steps) || !plan.steps.length) {
    return { status: "BLOCKED", reason: "mixed_plan_missing_steps" };
  }
  const existingQueue = getQueueItem(resolved.task_id) || null;
  const existingResults = Array.isArray(existingQueue && existingQueue.step_results) ? existingQueue.step_results.slice() : [];
  const existingCompleted = Array.isArray(existingQueue && existingQueue.completed_steps) ? existingQueue.completed_steps.slice() : [];
  const startIndex = Number.isFinite(options.start_step_index) ? Number(options.start_step_index) : existingCompleted.length;
  const stepResults = existingResults.filter((step) => step.order <= startIndex);
  const artifactRefs = [];
  let previousStepOutputArtifact = null;
  upsertQueueItem({
    ...(existingQueue || {}),
    task_id: resolved.task_id,
    workflow_id: resolved.workflow_id || `task_${resolved.task_id}`,
    approval_id: resolved.approval_id || null,
    requested_by: resolved.requested_by || "operator",
    dispatch_ref: resolved.codex_dispatch_pack_ref || null,
    queue_kind: plan.steps.length > 1 ? "mixed" : "single",
    total_steps: plan.steps.length,
    current_step_index: startIndex,
    completed_steps: existingCompleted,
    step_results: stepResults,
    status: "running",
    approved_at: resolved.reviewed_at || new Date().toISOString(),
    mixed_plan: plan,
  });
  for (let index = startIndex; index < plan.steps.length; index += 1) {
    const step = plan.steps[index];
    const subCommand = buildSubtaskCommand(resolved, step);
    const contractResult = buildTaskContract(subCommand, {
      tool_type: "write",
      executor: "codex",
      status: "approval_covered_by_parent",
    });
    if (contractResult.status !== "PASS") {
      const blockedStep = {
        order: step.order,
        step_id: step.step_id,
        executor_lane: step.executor_lane,
        status: "BLOCKED",
        summary: contractResult.reason,
      };
      stepResults.push(blockedStep);
      upsertQueueItem({
        ...(getQueueItem(resolved.task_id) || {}),
        task_id: resolved.task_id,
        current_step_index: index,
        failed_steps: [{ order: step.order, failure_type: contractResult.reason }],
        step_results: stepResults,
        status: "step_failed",
        last_error: contractResult.reason,
      });
      break;
    }
    const contract = contractResult.contract;
    const taskPlanPath = ensureTaskPlanFile(contract);
    const taskContractRef = writeTaskContractArtifact(contract);
    const brief = buildTaskBrief(contract, {
      tests_required: subCommand.payload.tests_required,
    }).brief;
    const taskBriefRef = writeTaskBriefArtifact(contract.task_id, brief);
    const subDispatch = buildCodexDispatchPack(contract, brief, {
      files_expected_to_change: contract.target_files,
      executor_lane: step.executor_lane,
    }).dispatch;
    if (previousStepOutputArtifact) {
      if (!subDispatch.implementation_brief) subDispatch.implementation_brief = {};
      subDispatch.implementation_brief.context_from_previous_step = {
        step_order: index,
        ref: previousStepOutputArtifact,
      };
    }
    const dispatchRef = writeCodexDispatchPackArtifact(contract.task_id, subDispatch);
    const preview = buildActionPreview(subCommand, {
      tool_type: "write",
      expected_effect: contract.objective,
      plan_reference: taskPlanPath,
      task_contract_ref: taskContractRef,
      task_brief_ref: taskBriefRef,
      codex_dispatch_pack_ref: dispatchRef,
      task_contract: contract,
      executor_handoff_expected: true,
    });
    artifactRefs.push(taskPlanPath, taskContractRef, taskBriefRef, dispatchRef, preview.artifact_path);
    const handoff = createExecutorHandoff(codexDispatcher, {
      task_id: contract.task_id,
      workflow_id: `${resolved.workflow_id || `task_${resolved.task_id}`}:step:${step.order}`,
      dispatch: subDispatch,
      dispatch_ref: dispatchRef,
      executor: "codex",
    });
    if (handoff.status !== "PASS") {
      stepResults.push({
        order: step.order,
        step_id: step.step_id,
        executor_lane: step.executor_lane,
        status: "FAIL",
        summary: handoff.handoff && handoff.handoff.reason || "executor_handoff_failed",
      });
      break;
    }
    const execution = handoff.handoff && handoff.handoff.execution_result && handoff.job && handoff.job.job_id
      ? ingestExecutorResult({
        job_id: handoff.job.job_id,
        task_id: contract.task_id,
        ...handoff.handoff.execution_result,
      })
      : { status: "BLOCKED", reason: "missing_execution_result" };
    const stepStatus = execution.execution_failure
      ? "FAIL"
      : (execution.execution_result ? "PASS" : execution.status);
    const report = execution.execution_report || null;
    const stepEntry = {
      order: step.order,
      step_id: step.step_id,
      executor_lane: step.executor_lane,
      status: stepStatus,
      summary: report && report.output || execution.reason || execution.execution_failure && execution.execution_failure.summary || "step_complete",
      report_path: execution.execution_report_path || null,
    };
    stepResults.push(stepEntry);
    if (execution.execution_report_path) artifactRefs.push(execution.execution_report_path);
    if (stepStatus === "PASS") {
      const ctxPayload = {
        step_order: step.order,
        output: report && report.output || stepEntry.summary,
        summary: stepEntry.summary,
        report_path: stepEntry.report_path,
        changed_files: execution.execution_result && execution.execution_result.changed_files || [],
        generated_at: new Date().toISOString(),
      };
      const ctxPath = stepContextFilePath(config.STATE_DIR, resolved.task_id, step.order);
      fs.writeFileSync(ctxPath, JSON.stringify(ctxPayload, null, 2), "utf8");
      previousStepOutputArtifact = ctxPath;
      artifactRefs.push(ctxPath);
      upsertQueueItem({
        ...(getQueueItem(resolved.task_id) || {}),
        task_id: resolved.task_id,
        current_step_index: index + 1,
        completed_steps: [...existingCompleted, ...stepResults.filter((item) => item.status === "PASS").map((item) => item.order)].filter((value, idx, arr) => arr.indexOf(value) === idx).sort((a, b) => a - b),
        step_results: stepResults,
        status: index + 1 >= plan.steps.length ? "completed" : "step_succeeded",
        last_error: null,
      });
    } else {
      upsertQueueItem({
        ...(getQueueItem(resolved.task_id) || {}),
        task_id: resolved.task_id,
        current_step_index: index,
        failed_steps: [{
          order: step.order,
          failure_type: execution.execution_failure && execution.execution_failure.failure_type || stepStatus,
          summary: stepEntry.summary,
        }],
        step_results: stepResults,
        status: "step_failed",
        last_error: stepEntry.summary,
      });
    }
    if (!options.resume && Number(plan.pause_after_step || 0) === step.order) {
      const final = buildMixedExecutionReport(resolved.task_id, stepResults, artifactRefs.filter(Boolean));
      return {
        status: "BLOCKED",
        execution_result: null,
        execution_failure: {
          job_id: null,
          task_id: resolved.task_id,
          failure_stage: "mixed_plan_pause",
          failure_type: "resume_required",
          retryable: true,
          summary: `mixed flow paused after step ${step.order}`,
          raw_failure_ref: final.path,
          failed_at: new Date().toISOString(),
        },
        execution_report: {
          report_id: `mixed_exec_${Date.now()}`,
          job_id: null,
          task_id: resolved.task_id,
          what_was_done: `mixed flow paused after step ${step.order}`,
          result: "fail",
          need_approval: false,
          next_step: "resume_task_execution",
          changed_files: [],
          output: `mixed flow paused after step ${step.order}`,
          error: null,
          source_artifact_ref: final.path,
          generated_at: new Date().toISOString(),
        },
        execution_report_path: final.path,
        steps: stepResults,
      };
    }
    if (stepStatus !== "PASS") {
      break;
    }
  }
  const final = buildMixedExecutionReport(resolved.task_id, stepResults, artifactRefs.filter(Boolean));
  const allPassed = stepResults.length === plan.steps.length && stepResults.every((step) => step.status === "PASS");
  upsertQueueItem({
    ...(getQueueItem(resolved.task_id) || {}),
    task_id: resolved.task_id,
    status: allPassed ? "completed" : "blocked",
    current_step_index: allPassed ? plan.steps.length : Number((stepResults.find((step) => step.status !== "PASS") || {}).order || 1) - 1,
    step_results: stepResults,
    finished_at: new Date().toISOString(),
    last_error: allPassed ? null : final.report.summary,
  });
  return {
    status: allPassed ? "PASS" : "BLOCKED",
    execution_result: allPassed ? {
      job_id: null,
      task_id: resolved.task_id,
      changed_files: [],
      tests_executed: [],
      tests_passed: [],
      tests_failed: [],
      artifacts_returned: artifactRefs.filter(Boolean),
      summary: final.report.summary,
      raw_result_ref: final.path,
      completed_at: new Date().toISOString(),
    } : null,
    execution_failure: allPassed ? null : {
      job_id: null,
      task_id: resolved.task_id,
      failure_stage: "mixed_plan",
      failure_type: "mixed_step_failed",
      retryable: false,
      summary: final.report.summary,
      raw_failure_ref: final.path,
      failed_at: new Date().toISOString(),
    },
    execution_report: {
      report_id: `mixed_exec_${Date.now()}`,
      job_id: null,
      task_id: resolved.task_id,
      what_was_done: final.report.summary,
      result: allPassed ? "success" : "fail",
      need_approval: false,
      next_step: allPassed ? "review_result_in_ui_or_telegram" : "review_failure_and_choose_retry",
      changed_files: [],
      output: final.report.summary,
      error: allPassed ? null : final.report.summary,
      source_artifact_ref: final.path,
      generated_at: new Date().toISOString(),
    },
    execution_report_path: final.path,
    steps: stepResults,
  };
}

function buildTaskMarkdown(contract) {
  return [
    `# ${contract.task_id}`,
    "",
    "## Objective",
    contract.objective,
    "",
    "## Scope In",
    ...contract.scope_in.map((item) => `- ${item}`),
    "",
    "## Scope Out",
    ...contract.scope_out.map((item) => `- ${item}`),
    "",
    "## Success Criteria",
    ...contract.success_criteria.map((item) => `- ${item}`),
    "",
    "## System Constraints",
    ...contract.system_constraints.map((item) => `- ${item}`),
    "",
  ].join("\n");
}

function ensureTaskPlanFile(contract) {
  const taskPath = resolveTaskPath(contract.task_id);
  fs.mkdirSync(path.dirname(taskPath), { recursive: true });
  fs.writeFileSync(taskPath, buildTaskMarkdown(contract), "utf8");
  return taskPath;
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
  const executorJobs = listExecutorJobs(20);
  return {
    status: "PASS",
    snapshot,
    latest_report: latestReport,
    latest_workflow: latestWorkflow,
    agent,
    sessions,
    workflow_history: workflowHistory,
    latest_task_runs: workflowHistory.latest_task_runs || {},
    latest_task_artifacts: workflowHistory.latest_task_artifacts || {},
    approval_queue: approvalQueue,
    approval_inbox: approvalInbox,
    failure_center: failureCenter,
    retry_queue: retryQueue,
    executor_jobs: executorJobs,
    goal_state: workflowHistory.latest_goal_state || null,
    next_task_decision: workflowHistory.latest_next_task_decision || null,
    maintenance: {
      repo_health_scan: workflowHistory.latest_repo_health_scan || null,
      maintenance_issues: workflowHistory.latest_maintenance_issues || null,
      self_heal_decision: workflowHistory.latest_self_heal_decision || null,
    },
    live_operation: {
      latest_proof: workflowHistory.latest_live_operation_proof || null,
      latest_anomalies: workflowHistory.latest_stability_anomalies || null,
      latest_friction_report: workflowHistory.latest_operator_friction_report || null,
    },
    system_control: readSystemControlState(),
    process_governor: getGovernorStatus(100),
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
    latest_task_artifacts: workflowHistory.latest_task_artifacts || {},
    latest_executor_jobs: workflowHistory.latest_executor_jobs || {},
    latest_execution_reports: (workflowHistory.latest_execution_reports || {}),
    local_reports: listLatestLocalReports(15),
  };
}

function getTaskArtifacts(taskId) {
  const normalized = String(taskId || "").trim();
  if (!normalized) return { status: "BLOCKED", reason: "missing_task_id" };
  const workflowHistory = getWorkflowHistory(100);
  return {
    status: "PASS",
    task_id: normalized,
    artifacts: (workflowHistory.latest_task_artifacts || {})[normalized] || null,
  };
}

function getExecutorJobsView(limit = 50) {
  return {
    status: "PASS",
    executor_jobs: listExecutorJobs(limit),
  };
}

function getLiveOperationProofs(limit = 20) {
  return {
    status: "PASS",
    live_operation_proofs: readOperationProofs(limit),
  };
}

function getStabilityAnomalies() {
  return {
    status: "PASS",
    stability_anomalies: readStabilityAnomalyRegistry(),
  };
}

function getOperatorFrictionReports(limit = 20) {
  return {
    status: "PASS",
    operator_friction_reports: readOperatorFrictionReports(limit),
  };
}

function getGoalStateView(goalId = null) {
  if (goalId) {
    return { status: "PASS", goal_state: getGoalState(goalId) };
  }
  return { status: "PASS", goal_state_registry: readGoalStateRegistry() };
}

function getNextTaskPlan(goalId = null) {
  const workflowHistory = getWorkflowHistory(50);
  const goal = goalId ? getGoalState(goalId) : (readGoalStateRegistry().goals || []).find((item) => item.current_state === "active");
  if (!goal) return { status: "BLOCKED", reason: "no_active_goal" };
  const progress = evaluateProgress({
    governance_snapshot: readBridgeJsonSafe(config.GOVERNANCE_SNAPSHOT_LATEST, {}),
    failure_center: readFailureCenter(),
    workflow_history: workflowHistory,
    executor_jobs: listExecutorJobs(50),
  });
  const planned = planNextTasks(goal, progress);
  const budget = evaluateAutonomyBudget({
    goal_id: goal.goal_id,
    current_stage: goal.current_state,
    retry_class: progress.progress.latest_failure && progress.progress.latest_failure.failure_code || null,
  });
  const goalStateRef = writeGoalStateArtifact(goal);
  const progressRef = writeProgressEvalArtifact(goal.goal_id, progress);
  const candidatesRef = writeNextTaskCandidatesArtifact(goal.goal_id, planned.candidates);
  const decisionPayload = {
    goal_id: goal.goal_id,
    goal_title: goal.title,
    proposed_task: planned.decision,
    rejected_alternatives: planned.rejected_alternatives,
    budget,
    evidence: {
      latest_success: progress.progress.latest_success,
      latest_failure: progress.progress.latest_failure,
      latest_blocked: progress.progress.latest_blocked,
    },
    generated_at: new Date().toISOString(),
  };
  const decisionRef = writeNextTaskDecisionArtifact(goal.goal_id, decisionPayload);
  recordGoalLoopArtifacts({
    goal_state: { ...goal, artifact_ref: goalStateRef },
    progress_eval: { ...progress, artifact_ref: progressRef },
    next_task_decision: { ...decisionPayload, artifact_ref: decisionRef, candidates_ref: candidatesRef },
  });
  return {
    status: "PASS",
    goal_state: { ...goal, artifact_ref: goalStateRef },
    progress: { ...progress, artifact_ref: progressRef },
    candidates: planned.candidates,
    candidates_ref: candidatesRef,
    decision: { ...decisionPayload, artifact_ref: decisionRef },
  };
}

function getRepoHealthView() {
  const scan = scanRepoHealth();
  const registry = registerMaintenanceIssues(scan.scan);
  recordMaintenanceArtifacts({
    repo_health_scan: { ...scan.scan, artifact_ref: scan.artifact_path },
    maintenance_issues: registry,
  });
  return {
    status: "PASS",
    repo_health_scan: { ...scan.scan, artifact_ref: scan.artifact_path },
    maintenance_issues: registry,
  };
}

function getSelfHealPlan() {
  const scan = scanRepoHealth();
  const registry = registerMaintenanceIssues(scan.scan);
  const plan = planSelfHeal(registry);
  const candidatesRef = writeSelfHealCandidatesArtifact(plan.candidates);
  const decisionRef = writeSelfHealDecisionArtifact({
    decision: plan.decision,
    rejected: plan.rejected,
    generated_at: new Date().toISOString(),
  });
  recordMaintenanceArtifacts({
    repo_health_scan: { ...scan.scan, artifact_ref: scan.artifact_path },
    maintenance_issues: registry,
    self_heal_decision: {
      decision: plan.decision,
      rejected: plan.rejected,
      candidates_ref: candidatesRef,
      artifact_ref: decisionRef,
    },
  });
  return {
    status: "PASS",
    repo_health_scan: { ...scan.scan, artifact_ref: scan.artifact_path },
    maintenance_issues: registry,
    self_heal_plan: {
      ...plan,
      candidates_ref: candidatesRef,
      artifact_ref: decisionRef,
    },
  };
}

function getExecutorJobView(jobId) {
  return {
    status: "PASS",
    executor_job: getExecutorJob(jobId),
    executor_status: getExecutorStatus(jobId),
  };
}

function getSuggestions() {
  return buildSuggestions();
}

function getDigest() {
  return buildDigest();
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
    process_governor: getGovernorStatus(50),
  };
}

function getProcessGovernorView(limit = 100) {
  return getGovernorStatus(limit);
}

async function createTask(input = {}) {
  const content = normalizeObjectiveText(input.content || input.objective || "");
  if (!content) {
    return { status: "BLOCKED", reason: "missing_task_content" };
  }
  if (isDestructiveObjective(content)) {
    return {
      status: "BLOCKED",
      reason: "destructive_objective_blocked",
      guidance: buildGoalGuidance(),
    };
  }
  if (isVagueObjective(content)) {
    return {
      status: "BLOCKED",
      reason: "vague_objective",
      guidance: buildGoalGuidance(),
    };
  }
  const routed = buildDeterministicTaskRoute(content, input);
  const taskId = input.task_id || `task_${Date.now()}`;
  const command = {
    command_id: `cmd_${taskId}`,
    action: "codex.build_task",
    requested_by: input.requested_by || "dashboard_operator",
    payload: {
      task_id: taskId,
      task: content,
      objective: content,
      title: routed.title,
      task_type: routed.task_type,
      internal_action: routed.internal_action,
      executor_lane: routed.executor_lane || null,
      route_reason: routed.route_reason,
      scope_in: routed.scope_in,
      scope_out: routed.scope_out,
      forbidden_paths: input.forbidden_paths || routed.scope_out,
      success_criteria: routed.success_criteria,
      executor: "codex",
      files: routed.target_files,
      tests_required: routed.tests_required,
    },
  };
  const contractResult = buildTaskContract(command, {
    tool_type: "write",
    executor: "codex",
    status: "approval_pending",
  });
  if (contractResult.status !== "PASS") {
    return {
      status: "BLOCKED",
      reason: contractResult.reason,
      guidance: buildGoalGuidance(),
    };
  }
  const contract = contractResult.contract;
  const taskPlanPath = ensureTaskPlanFile(contract);
  const taskContractRef = writeTaskContractArtifact(contract);
  const brief = buildTaskBrief(contract, {
    tests_required: command.payload.tests_required,
  }).brief;
  const taskBriefRef = writeTaskBriefArtifact(contract.task_id, brief);
  const dispatch = buildCodexDispatchPack(contract, brief, {
    files_expected_to_change: contract.target_files,
    executor_lane: routed.executor_lane || null,
    mixed_plan: routed.is_mixed ? {
      title: routed.title,
      steps: routed.steps,
      pause_after_step: input.debug_pause_after_step || null,
    } : null,
  }).dispatch;
  const dispatchRef = writeCodexDispatchPackArtifact(contract.task_id, dispatch);
  const preview = buildActionPreview(command, {
    tool_type: "write",
    expected_effect: contract.objective,
    plan_reference: taskPlanPath,
    task_contract_ref: taskContractRef,
    task_brief_ref: taskBriefRef,
    codex_dispatch_pack_ref: dispatchRef,
    task_contract: contract,
    executor_handoff_expected: true,
  });
  if (preview.status !== "PASS") {
    return { status: "BLOCKED", reason: "preview_build_failed" };
  }
  const isAutoApprovable = routed.executor_lane === "dev_read" && !routed.blocked;
  const approval = createApprovalItem({
    workflow_id: `task_${contract.task_id}`,
    task_id: contract.task_id,
    session_id: input.session_id || null,
    requested_by: command.requested_by,
    action_type: isAutoApprovable ? "read" : "write",
    tool_name: "codex.build_task",
    risk_level: isAutoApprovable ? "low" : "medium",
    summary: contract.title,
    reason: isAutoApprovable ? "auto_approved_safe_read" : "operator_task_created",
    preview_ref: preview.artifact_path,
    diff_ref: "NO_DIFF_AVAILABLE",
    command_ref: command.command_id,
    command_snapshot: command,
    task_contract_ref: taskContractRef,
    task_brief_ref: taskBriefRef,
    codex_dispatch_pack_ref: dispatchRef,
  });
  const workflowId = `task_${contract.task_id}`;
  appendAuditRecord({
    workflow_id: workflowId,
    task_id: contract.task_id,
    actor_type: command.requested_by === "telegram_operator" ? "telegram_operator" : "dashboard_operator",
    actor_id: command.requested_by,
    action: "task.route",
    decision: approval.item.status,
    reason: `${routed.route_reason}:${routed.internal_action || "generic_task"}`,
    refs: [taskContractRef, preview.artifact_path, dispatchRef].filter(Boolean),
  });
  appendActivityFeed({
    workflow_id: workflowId,
    task_id: contract.task_id,
    event_type: "task_created",
    short_text: isAutoApprovable
      ? `${routed.internal_action || "task"} auto-approved (safe read)`
      : `${routed.internal_action || "task"} queued for approval`,
    severity: "info",
    refs: [preview.artifact_path, taskContractRef].filter(Boolean),
  });
  writeGovernanceReport({
    workflow_id: workflowId,
    task_id: contract.task_id,
    session_id: input.session_id || null,
    report_type: isAutoApprovable ? "AUTO_APPROVED_SAFE_READ" : "APPROVAL_PENDING",
    summary: isAutoApprovable
      ? `${contract.title} auto-approved (safe read)`
      : `${contract.title} awaiting approval`,
    risk_level: approval.item.risk_level || "medium",
    approval_state: approval.item.status,
    execution_state: isAutoApprovable ? "executing" : "pending",
    failure_state: null,
    retry_state: null,
    boundary_state: "within_bounds",
  });
  upsertWorkflowSummary({
    workflow_id: workflowId,
    task_id: contract.task_id,
    current_stage: isAutoApprovable ? "auto_approved" : "approval_pending",
    approval_state: approval.item.status,
    last_action: routed.internal_action || "task.route",
    latest_refs: [taskContractRef, preview.artifact_path, dispatchRef].filter(Boolean),
  });
  upsertQueueItem({
    task_id: contract.task_id,
    workflow_id: workflowId,
    approval_id: approval.item.approval_id,
    requested_by: command.requested_by,
    dispatch_ref: dispatchRef,
    queue_kind: routed.is_mixed ? "mixed" : "single",
    status: isAutoApprovable ? "auto_approved" : "pending",
    total_steps: routed.is_mixed ? routed.steps.length : 1,
    current_step_index: 0,
    completed_steps: [],
    failed_steps: [],
    step_results: [],
    mixed_plan: routed.is_mixed ? {
      title: routed.title,
      steps: routed.steps,
      pause_after_step: input.debug_pause_after_step || null,
    } : null,
  });
  if (isAutoApprovable) {
    const executionResult = await approveApprovalCanonical(approval.item.approval_id, "auto_approved_safe_read");
    return {
      status: executionResult.status === "PASS" || executionResult.status === "DISPATCHED" ? "PASS" : executionResult.status,
      auto_approved: true,
      task: {
        task_id: contract.task_id,
        title: contract.title,
        approval_id: approval.item.approval_id,
        task_plan_path: taskPlanPath,
        task_contract_ref: taskContractRef,
        task_brief_ref: taskBriefRef,
        dispatch_ref: dispatchRef,
        preview_ref: preview.artifact_path,
        internal_action: routed.internal_action,
        route_reason: routed.route_reason,
        executor_lane: "dev_read",
        mixed_plan: null,
        status: "auto_approved",
      },
      execution: executionResult,
    };
  }
  return {
    status: "PASS",
    task: {
      task_id: contract.task_id,
      title: contract.title,
      approval_id: approval.item.approval_id,
      task_plan_path: taskPlanPath,
      task_contract_ref: taskContractRef,
      task_brief_ref: taskBriefRef,
      dispatch_ref: dispatchRef,
      preview_ref: preview.artifact_path,
      internal_action: routed.internal_action,
      route_reason: routed.route_reason,
      executor_lane: routed.executor_lane || null,
      mixed_plan: routed.is_mixed ? routed.steps : null,
      status: approval.item.status,
    },
  };
}

function listTasks() {
  const inbox = readApprovalInbox();
  return {
    status: "PASS",
    tasks: {
      pending: inbox.pending || [],
      resolved: inbox.resolved || [],
    },
  };
}

async function approveTask(approvalId, reviewedBy = "dashboard_operator") {
  return approveApprovalCanonical(approvalId, reviewedBy);
}

function rejectTask(approvalId, reviewedBy = "dashboard_operator") {
  return rejectApprovalCanonical(approvalId, reviewedBy);
}

function listJobs() {
  const jobsView = listExecutorJobs(100);
  return {
    status: "PASS",
    jobs: (jobsView.jobs || []).map((job) => ({
      ...job,
      result_ingest: getLatestResultIngest(job.job_id),
      report: getLatestExecutionReport(job.job_id),
    })),
  };
}

function getOperatorSystemStatus() {
  const agent = agentManager.getAgentStatus();
  const control = readSystemControlState();
  const jobs = listExecutorJobs(20).jobs || [];
  const latestJob = jobs[0] || null;
  return {
    status: "PASS",
    system_state: control.system_state,
    agent_live: agent.live,
    agent_status: agent.status,
    latest_commit: getStatus().snapshot && getStatus().snapshot.latest_commit || null,
    branch: getStatus().snapshot && getStatus().snapshot.branch || null,
    pending_tasks: (readApprovalInbox().pending || []).length,
    jobs: jobs.length,
    latest_job: latestJob ? {
      job_id: latestJob.job_id,
      task_id: latestJob.task_id,
      status: latestJob.status,
      report: getLatestExecutionReport(latestJob.job_id),
    } : null,
  };
}

async function pauseSystem() {
  const result = await stopAgent();
  return {
    status: result.status,
    system_state: writeSystemControlState({ system_state: "paused" }).system_state,
    result,
  };
}

async function resumeSystem() {
  const result = await startAgent();
  return {
    status: result.status,
    system_state: writeSystemControlState({ system_state: "running" }).system_state,
    result,
  };
}

async function restartSystem() {
  const result = await restartAgent();
  return {
    status: result.status,
    system_state: writeSystemControlState({ system_state: "running" }).system_state,
    result,
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
    executor_job: (listExecutorJobs(500).latest_by_task || {})[taskId] || null,
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
  const summary = getWorkflowSummary(workflowId);
  return {
    status: "PASS",
    workflow_summary: summary,
    executor_job: summary && summary.task_id ? (listExecutorJobs(500).latest_by_task || {})[summary.task_id] || null : null,
  };
}

function getAuditTrailView(taskId) {
  return {
    status: "PASS",
    audit_trail: getAuditTrailByTask(taskId),
  };
}

function getWorkflowReport(workflowId) {
  const report = readGovernanceReportByWorkflow(workflowId);
  return {
    status: "PASS",
    report,
    executor_job: report && report.task_id ? (listExecutorJobs(500).latest_by_task || {})[report.task_id] || null : null,
    execution_report: report && report.task_id ? getLatestExecutionReport(((listExecutorJobs(500).latest_by_task || {})[report.task_id] || {}).job_id || "") : null,
  };
}

async function runLiveOperationProof(options = {}) {
  const { runLiveOperationScenario } = require("./live_operation_runner");
  const result = await runLiveOperationScenario(options);
  recordLiveOperationArtifacts({
    live_operation_proof: result.proof && {
      task_id: result.task_id,
      workflow_id: result.workflow_id,
      artifact_ref: result.proof.artifact_path,
      final_verdict: result.proof.record.final_verdict,
      generated_at: result.proof.record.generated_at,
    },
    stability_anomalies: result.anomalies && {
      artifact_ref: result.anomalies.artifact_path,
      count: (result.anomalies.items || []).length,
      generated_at: new Date().toISOString(),
    },
    operator_friction_report: result.friction_report && {
      task_id: result.task_id,
      artifact_ref: result.friction_report.artifact_path,
      final_verdict: result.friction_report.record.final_verdict,
      generated_at: result.friction_report.record.generated_at,
    },
  });
  return result;
}

function ingestExecutorResult(input = {}) {
  const ingest = ingestExecutorOutput(input);
  const ingested = ingest.raw_ingest;
  const normalizedLoop = ingest.normalized;
  const executionReport = buildExecutionReport({
    job_id: normalizedLoop.job_id,
    task_id: normalizedLoop.task_id,
    normalized: normalizedLoop,
    need_approval: false,
    next_step: normalizedLoop.status === "success" ? "review_result_in_ui_or_telegram" : "review_failure_and_choose_retry",
    source_artifact_ref: ingest.ingest_artifact_path,
  });
  const executionReportPath = writeExecutionReport(executionReport);
  if (ingested.status !== "PASS") {
    return {
      ...ingest,
      execution_report: executionReport,
      execution_report_path: executionReportPath,
    };
  }
  const taskId = ingested.normalized.task_id;
  const workflowId = `task_${taskId}`;
  if (input.outcome === "success") {
    appendLifecycleEvent({
      workflow_id: workflowId,
      task_id: taskId,
      stage: "succeeded",
      status: "PASS",
      summary: ingested.normalized.summary,
      artifact_refs: [ingested.artifact_path],
    });
    writeGovernanceReport({
      workflow_id: workflowId,
      task_id: taskId,
      session_id: null,
      report_type: "EXECUTION_SUCCESS",
      summary: ingested.normalized.summary,
      risk_level: "low",
      approval_state: "approved",
      execution_state: "done",
      failure_state: null,
      retry_state: "none",
      boundary_state: "clear",
      refs: [ingested.artifact_path],
    });
    appendActivityFeed({
      workflow_id: workflowId,
      task_id: taskId,
      event_type: "execution_succeeded",
      short_text: ingested.normalized.summary,
      severity: "info",
      refs: [ingested.artifact_path],
    });
    appendAuditRecord({
      workflow_id: workflowId,
      task_id: taskId,
      actor_type: "auto_agent",
      actor_id: "execution_result_ingestor",
      action: "executor.ingest",
      decision: "succeeded",
      reason: ingested.normalized.summary,
      refs: [ingested.artifact_path],
    });
    upsertWorkflowSummary({
      workflow_id: workflowId,
      task_id: taskId,
      current_stage: "succeeded",
      approval_state: "approved",
      last_action: "executor.ingest",
      latest_refs: [ingested.artifact_path],
    });
    writeGovernanceSnapshot({
      workflow_status: "succeeded",
      current_approval_state: "approved",
      last_executor_result: "succeeded",
      latest_task_id: taskId,
    });
    recordExecutionOutcome(ingested.normalized);
    const nextTask = getNextTaskPlan();
    if (nextTask.status === "PASS" && nextTask.decision && nextTask.decision.proposed_task && evaluateAutonomyBudget({
      goal_id: nextTask.goal_state.goal_id,
      current_stage: nextTask.goal_state.current_state,
      retry_class: null,
    }).allowed) {
      consumeAutonomyBudget({
        goal_id: nextTask.goal_state.goal_id,
        current_stage: nextTask.goal_state.current_state,
      });
    }
    registerWorkflowRun({
      id: buildRunId("EXECUTOR_RESULT"),
      workflow: "EXECUTOR_RESULT",
      task_id: taskId,
      requested_by: "executor",
      reviewed_by: null,
      approval_state: "approved",
      execution_state: "done",
      started_at: ingested.job.started_at || null,
      ended_at: ingested.normalized.completed_at,
      artifacts_written: [ingested.artifact_path],
      final_verdict: "PASS",
      blocker_reason: null,
      status: "PASS",
      execution_report_ref: executionReportPath,
    });
    return {
      status: "PASS",
      execution_result: ingested.normalized,
      job: ingested.job,
      artifact_path: ingested.artifact_path,
      result_ingest: normalizedLoop,
      result_ingest_path: ingest.ingest_artifact_path,
      execution_report: executionReport,
      execution_report_path: executionReportPath,
    };
  }
  appendLifecycleEvent({
    workflow_id: workflowId,
    task_id: taskId,
    stage: "failed",
    status: "FAIL",
    summary: ingested.normalized.summary,
    artifact_refs: [ingested.artifact_path],
  });
  writeGovernanceReport({
    workflow_id: workflowId,
    task_id: taskId,
    session_id: null,
    report_type: "EXECUTION_FAILED",
    summary: ingested.normalized.summary,
    risk_level: "high",
    approval_state: "approved",
    execution_state: "failed",
    failure_state: ingested.normalized.failure_type,
    retry_state: ingested.normalized.retryable ? "eligible" : "none",
    boundary_state: "clear",
    refs: [ingested.artifact_path],
  });
  appendActivityFeed({
    workflow_id: workflowId,
    task_id: taskId,
    event_type: "execution_failed",
    short_text: ingested.normalized.summary,
    severity: "high",
    refs: [ingested.artifact_path],
  });
  appendAuditRecord({
    workflow_id: workflowId,
    task_id: taskId,
    actor_type: "auto_agent",
    actor_id: "execution_result_ingestor",
    action: "executor.ingest",
    decision: "failed",
    reason: ingested.normalized.summary,
    refs: [ingested.artifact_path],
  });
  upsertWorkflowSummary({
    workflow_id: workflowId,
    task_id: taskId,
    current_stage: "failed",
    approval_state: "approved",
    last_action: "executor.ingest",
    latest_refs: [ingested.artifact_path],
  });
  writeGovernanceSnapshot({
    workflow_status: "failed",
    current_approval_state: "approved",
    last_executor_result: "failed",
    latest_task_id: taskId,
  });
  recordExecutionOutcome(ingested.normalized);
  const nextTask = getNextTaskPlan();
  if (nextTask.status === "PASS" && nextTask.decision && nextTask.decision.proposed_task && evaluateAutonomyBudget({
    goal_id: nextTask.goal_state.goal_id,
    current_stage: nextTask.goal_state.current_state,
    retry_class: ingested.normalized.failure_type,
  }).allowed) {
    consumeAutonomyBudget({
      goal_id: nextTask.goal_state.goal_id,
      current_stage: nextTask.goal_state.current_state,
      retry_class: ingested.normalized.failure_type,
    });
  }
  registerWorkflowRun({
    id: buildRunId("EXECUTOR_FAILURE"),
    workflow: "EXECUTOR_FAILURE",
    task_id: taskId,
    requested_by: "executor",
    reviewed_by: null,
    approval_state: "approved",
    execution_state: "failed",
    started_at: ingested.job.started_at || null,
    ended_at: ingested.normalized.failed_at,
    artifacts_written: [ingested.artifact_path],
    final_verdict: "FAIL",
    blocker_reason: ingested.normalized.summary,
    status: "FAIL",
    execution_report_ref: executionReportPath,
  });
  return {
    status: "PASS",
    execution_failure: ingested.normalized,
    job: ingested.job,
    artifact_path: ingested.artifact_path,
    result_ingest: normalizedLoop,
    result_ingest_path: ingest.ingest_artifact_path,
    execution_report: executionReport,
    execution_report_path: executionReportPath,
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

async function startAgent() {
  const result = await agentManager.startAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: result.status === "PASS" ? "watching" : "error" });
  return result;
}

async function stopAgent() {
  const result = await agentManager.stopAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: "stopped" });
  return result;
}

async function restartAgent() {
  const result = await agentManager.restartAgentProcess();
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
    if (step.type === "agent.start") result = await startAgent();
    else if (step.type === "agent.stop") result = await stopAgent();
    else if (step.type === "agent.restart") result = await restartAgent();
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

async function approveApprovalCanonical(approvalId, reviewedBy = "operator") {
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
  upsertQueueItem({
    ...(getQueueItem(resolved.task_id) || {}),
    task_id: resolved.task_id || "unknown",
    workflow_id: resolved.workflow_id || `task_${resolved.task_id || "unknown"}`,
    approval_id: resolved.approval_id,
    requested_by: resolved.requested_by,
    dispatch_ref: resolved.codex_dispatch_pack_ref || null,
    status: "approved",
    approved_at: resolved.reviewed_at || new Date().toISOString(),
  });
  if (!resolved.codex_dispatch_pack_ref) {
    return {
      status: "BLOCKED",
      reason: "missing_dispatch_pack_ref",
      approval: resolved,
    };
  }
  const dispatch = readJsonSafe(resolved.codex_dispatch_pack_ref, null);
  if (!dispatch) {
    return {
      status: "BLOCKED",
      reason: "dispatch_pack_missing",
      approval: resolved,
    };
  }
  if (dispatch.mixed_plan && Array.isArray(dispatch.mixed_plan.steps) && dispatch.mixed_plan.steps.length) {
    const execution = executeMixedApprovedPlan(resolved, dispatch, { resume: false });
    return {
      status: execution.status,
      approval: resolved,
      job: null,
      handoff: null,
      execution,
    };
  }
  appendLifecycleEvent({
    workflow_id: resolved.workflow_id || null,
    task_id: resolved.task_id || "unknown",
    stage: "executing",
    status: "PASS",
    summary: `executor handoff started for ${resolved.task_id || "unknown"}`,
    artifact_refs: [resolved.codex_dispatch_pack_ref].filter(Boolean),
  });
  upsertWorkflowSummary({
    workflow_id: resolved.workflow_id || `task_${resolved.task_id || "unknown"}`,
    task_id: resolved.task_id || "unknown",
    current_stage: "executing",
    approval_state: "approved",
    last_action: "executor.handoff",
    latest_refs: [resolved.codex_dispatch_pack_ref].filter(Boolean),
  });
  const handoff = createExecutorHandoff(codexDispatcher, {
    task_id: resolved.task_id,
    workflow_id: resolved.workflow_id,
    dispatch,
    dispatch_ref: resolved.codex_dispatch_pack_ref,
    executor: "codex",
  });
  if (handoff.status !== "PASS") {
    return {
      status: "FAIL",
      reason: handoff.handoff && handoff.handoff.reason || "executor_handoff_failed",
      approval: resolved,
      job: handoff.job || null,
      handoff: handoff.handoff || null,
    };
  }
  const execution = handoff.handoff && handoff.handoff.execution_result && handoff.job && handoff.job.job_id
    ? ingestExecutorResult({
      job_id: handoff.job.job_id,
      task_id: resolved.task_id,
      ...handoff.handoff.execution_result,
    })
    : {
      status: "BLOCKED",
      reason: "missing_execution_result",
    };
  return {
    status: execution.status,
    approval: resolved,
    job: handoff.job || null,
    handoff: handoff.handoff || null,
    execution,
  };
}

function resumeTaskExecution(taskId, reviewedBy = "operator") {
  const prepared = prepareResume(taskId);
  if (prepared.status !== "PASS") return prepared;
  const queueItem = prepared.queue_item;
  const dispatch = readJsonSafe(queueItem.dispatch_ref, null);
  if (!dispatch || !dispatch.mixed_plan) {
    return { status: "BLOCKED", reason: "mixed_dispatch_missing_for_resume", task_id: taskId };
  }
  const resolved = {
    task_id: queueItem.task_id,
    workflow_id: queueItem.workflow_id,
    requested_by: queueItem.requested_by,
    reviewed_at: new Date().toISOString(),
    codex_dispatch_pack_ref: queueItem.dispatch_ref,
    approval_id: queueItem.approval_id,
    reviewed_by: reviewedBy,
  };
  return executeMixedApprovedPlan(resolved, dispatch, {
    resume: true,
    start_step_index: prepared.next_step_index,
  });
}

function retryTaskExecution(taskId, reviewedBy = "operator") {
  const queueItem = getQueueItem(taskId);
  if (!queueItem) return { status: "BLOCKED", reason: "task_queue_item_not_found", task_id: taskId };
  const lastFailure = (((queueItem.failed_steps || []).slice(-1)[0]) || {});
  const prepared = prepareRetry(taskId, lastFailure.failure_type || "unknown_failure");
  if (prepared.status !== "PASS") return prepared;
  const dispatch = readJsonSafe(queueItem.dispatch_ref, null);
  if (!dispatch || !dispatch.mixed_plan) {
    return { status: "BLOCKED", reason: "mixed_dispatch_missing_for_retry", task_id: taskId };
  }
  const resolved = {
    task_id: queueItem.task_id,
    workflow_id: queueItem.workflow_id,
    requested_by: queueItem.requested_by,
    reviewed_at: new Date().toISOString(),
    codex_dispatch_pack_ref: queueItem.dispatch_ref,
    approval_id: queueItem.approval_id,
    reviewed_by: reviewedBy,
  };
  return executeMixedApprovedPlan(resolved, dispatch, {
    resume: true,
    start_step_index: prepared.next_step_index,
  });
}

function approveApproval(approvalId, reviewedBy = "operator") {
  return approveApprovalCanonical(approvalId, reviewedBy);
}

function rejectApprovalCanonical(approvalId, reviewedBy = "operator") {
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

function rejectApproval(approvalId, reviewedBy = "operator") {
  return rejectApprovalCanonical(approvalId, reviewedBy);
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
  getProcessGovernorView,
  createTask,
  listTasks,
  approveTask,
  rejectTask,
  listJobs,
  getOperatorSystemStatus,
  pauseSystem,
  resumeSystem,
  restartSystem,
  getApprovalInbox,
  getFailureCenter,
  getRetryQueue,
  getTaskLifecycle,
  getExecutorJobsView,
  getExecutorJobView,
  getLiveOperationProofs,
  getStabilityAnomalies,
  getOperatorFrictionReports,
  getGoalStateView,
  getNextTaskPlan,
  getRepoHealthView,
  getSelfHealPlan,
  getGovernanceSnapshotLatest,
  getGovernanceReports,
  getActivityFeedView,
  getWorkflowSummaryView,
  getSuggestions,
  getDigest,
  getAuditTrailView,
  getWorkflowReport,
  runLiveOperationProof,
  getTaskPlan,
  getTaskArtifacts,
  ingestExecutorResult,
  runWorkflow,
  approveWorkflow,
  rejectWorkflow,
  approveApproval,
  rejectApproval,
  retryFailureAction,
  resumeTaskExecution,
  retryTaskExecution,
};
