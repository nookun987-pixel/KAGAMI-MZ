"use strict";

const fs = require("fs");
const path = require("path");

const service = require("./commander_service");
const config = require("./local_control_agent/config");
const { readApprovalInbox } = require("./approval_inbox_store");
const { readTaskLifecycle } = require("./lifecycle_timeline_writer");
const { readGovernanceReportByWorkflow } = require("./governance_report_writer");
const { getWorkflowSummary } = require("./workflow_summary_view");
const { writeOperationProof } = require("./operation_proof_writer");
const { collectProofAnomalies, recordStabilityAnomaly, readStabilityAnomalyRegistry } = require("./stability_anomaly_registry");
const { writeOperatorFrictionReport } = require("./operator_friction_report_builder");

function ensureTaskPlan(taskId, objective) {
  fs.mkdirSync(config.TASKS_DIR, { recursive: true });
  const filePath = path.join(config.TASKS_DIR, `${taskId}.md`);
  const body = [
    `# ${taskId}`,
    "",
    `Objective: ${objective}`,
    "",
    "Success Criteria:",
    "- approval item created",
    "- executor job dispatched",
    "- execution result ingested",
    "- governance and lifecycle updated",
  ].join("\n");
  fs.writeFileSync(filePath, body, "utf8");
  return filePath;
}

function findApprovalByTask(taskId) {
  const inbox = readApprovalInbox();
  return (inbox.pending || []).find((item) => item.task_id === taskId) || null;
}

function findJobByTask(taskId) {
  const jobs = service.getExecutorJobsView(100).executor_jobs;
  return jobs && jobs.latest_by_task ? jobs.latest_by_task[taskId] || null : null;
}

async function waitFor(getter, timeoutMs = 10000, intervalMs = 250) {
  const started = Date.now();
  while ((Date.now() - started) < timeoutMs) {
    const value = getter();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return null;
}

async function runLiveOperationScenario(options = {}) {
  service.restartAgent();
  await waitFor(() => {
    const health = service.getHealth();
    return health.agent && health.agent.live ? health.agent : null;
  }, 15000, 500);
  const taskId = options.task_id || `task_live_proof_${Date.now()}`;
  const workflowId = `task_${taskId}`;
  const objective = options.objective || "Add test-backed live operation proof visibility for control plane";
  const targetFiles = options.target_files || ["control_plane/local_control_agent/dashboard.html"];
  const testsRequired = options.tests_required || ["node control_plane\\tests\\test_live_operation_proof_flow.js"];
  const scopeIn = options.scope_in || Array.from(new Set(targetFiles.map((item) => {
    const normalized = String(item).replace(/\\/g, "/");
    return normalized.includes("/") ? normalized.split("/").slice(0, -1).join("/") : normalized;
  })));
  const taskPlanPath = ensureTaskPlan(taskId, objective);

  const queued = await service.runBridgeCommand({
    action: "codex.build_task",
    payload: {
      task_id: taskId,
      task: objective,
      objective,
      task_type: "add_test",
      files: targetFiles,
      scope_in: scopeIn,
      scope_out: [
        "start_mikage.bat",
        "MIKAGE/index.js",
        "runtime/drive_queue/runtime.js",
        "runtime/colab_worker/*",
      ],
      success_criteria: [
        "live proof flow is captured end-to-end",
        "required tests pass",
      ],
      tests_required: testsRequired,
    },
    approval_status: "pending",
    requested_by: options.requested_by || "live_operation_runner",
    wait: true,
    timeout_ms: 30000,
  });

  const approvalItem = await waitFor(() => findApprovalByTask(taskId));
  const approved = approvalItem
    ? await service.approveApproval(approvalItem.approval_id, options.reviewed_by || "live_operation_runner")
    : { status: "BLOCKED", reason: "approval_item_not_found" };

  const executorJob = await waitFor(() => findJobByTask(taskId));
  let ingested = { status: "BLOCKED", reason: "executor_job_not_found" };
  if (executorJob) {
    ingested = service.ingestExecutorResult({
      outcome: "success",
      job_id: executorJob.job_id,
      task_id: taskId,
      changed_files: targetFiles,
      tests_executed: testsRequired,
      tests_passed: testsRequired,
      tests_failed: [],
      artifacts_returned: [
        approved.execution && approved.execution.report_path,
        taskPlanPath,
      ].filter(Boolean),
      summary: `live operation proof success for ${taskId}`,
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 500));

  const taskArtifacts = service.getTaskArtifacts(taskId);
  const lifecycle = readTaskLifecycle(taskId);
  const workflowSummary = getWorkflowSummary(workflowId);
  const workflowReport = readGovernanceReportByWorkflow(workflowId);
  const statusView = service.getStatus();
  const nextTask = service.getNextTaskPlan();

  const proofInput = {
    scenario: "live_operator_flow",
    workflow_id: workflowId,
    task_id: taskId,
    command_received: {
      command_id: queued.command_id || null,
      report_path: queued.report_path || null,
      inbox_path: queued.inbox_path || null,
      task_plan_ref: taskPlanPath,
      task_artifacts_ref: taskArtifacts.artifacts || null,
    },
    approval_item: approvalItem,
    executor_job: executorJob,
    result_ingest: {
      status: ingested.status,
      artifact_path: ingested.artifact_path || null,
      summary: ingested.execution_result && ingested.execution_result.summary
        || ingested.execution_failure && ingested.execution_failure.summary
        || ingested.reason
        || null,
    },
    workflow_final_state: {
      workflow_summary: workflowSummary,
      workflow_report: workflowReport,
      lifecycle_ref: path.join(config.TASK_LIFECYCLE_DIR, `${taskId}.json`),
    },
    goal_progress_evidence: nextTask.status === "PASS" ? {
      goal_state: nextTask.goal_state || null,
      progress: nextTask.progress || null,
      decision: nextTask.decision || null,
      refs: [
        nextTask.goal_state && nextTask.goal_state.artifact_ref,
        nextTask.progress && nextTask.progress.artifact_ref,
        nextTask.candidates_ref,
        nextTask.decision && nextTask.decision.artifact_ref,
      ].filter(Boolean),
    } : {
      status: nextTask.status,
      reason: nextTask.reason || null,
    },
    final_verdict: ingested.status === "PASS" ? "PASS" : "BLOCKED",
    refs: [
      queued.report_path,
      approvalItem && approvalItem.preview_ref,
      approvalItem && approvalItem.diff_ref,
      executorJob && executorJob.artifact_path,
      ingested.artifact_path,
      workflowReport && workflowReport.refs && workflowReport.refs[0],
    ].filter(Boolean),
  };
  const proofWritten = writeOperationProof(proofInput);

  const anomalies = collectProofAnomalies({
    proof: proofWritten.proof,
    workflow_summary: workflowSummary,
    status_view: statusView,
    lifecycle,
  }).map((item) => recordStabilityAnomaly(item));

  const frictionWritten = writeOperatorFrictionReport({
    proof: proofWritten.proof,
    proof_ref: proofWritten.artifact_path,
    anomalies,
    anomalies_ref: config.STABILITY_ANOMALY_REGISTRY_PATH,
    lifecycle,
  });

  return {
    status: ingested.status === "PASS" ? "PASS" : "BLOCKED",
    task_id: taskId,
    workflow_id: workflowId,
    command: queued,
    approval: approvalItem,
    approval_execution: approved.execution || approved,
    executor_job: executorJob,
    result_ingest: ingested,
    proof: {
      artifact_path: proofWritten.artifact_path,
      record: proofWritten.proof,
    },
    anomalies: {
      artifact_path: config.STABILITY_ANOMALY_REGISTRY_PATH,
      items: anomalies,
      registry: readStabilityAnomalyRegistry(),
    },
    friction_report: {
      artifact_path: frictionWritten.artifact_path,
      record: frictionWritten.report,
    },
  };
}

module.exports = {
  ensureTaskPlan,
  runLiveOperationScenario,
};
