"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");

function evaluateProgress(input = {}) {
  const snapshot = input.governance_snapshot || {};
  const failures = input.failure_center && input.failure_center.failures || [];
  const workflowHistory = input.workflow_history || {};
  const latestSuccess = workflowHistory.latest_successful_workflow || null;
  const latestBlocked = workflowHistory.latest_blocked_workflow || null;
  const latestFailed = workflowHistory.latest_failed_workflow || null;
  const executorJobs = input.executor_jobs && input.executor_jobs.jobs || [];

  const moved_forward = [];
  const blocked = [];
  const regressed = [];
  const complete = [];

  if (latestSuccess) moved_forward.push(`latest_success:${latestSuccess.task_id || latestSuccess.workflow}`);
  if (executorJobs.some((job) => job.status === "SUCCEEDED")) complete.push("executor_success_recorded");
  if (snapshot.workflow_status === "approval_pending") blocked.push("approval_pending");
  if (latestBlocked) blocked.push(latestBlocked.blocker_reason || "workflow_blocked");
  if (latestFailed) regressed.push(latestFailed.blocker_reason || "workflow_failed");
  if (failures.some((item) => item.status === "RETRY_EXHAUSTED")) regressed.push("retry_exhausted_present");

  return {
    status: "PASS",
    progress: {
      moved_forward,
      blocked,
      regressed,
      complete,
      latest_success: latestSuccess,
      latest_blocked: latestBlocked,
      latest_failed: latestFailed,
      latest_failure: failures[0] || null,
      evaluator_timestamp: new Date().toISOString(),
    },
  };
}

function writeProgressEvalArtifact(goalId, progress) {
  const filePath = path.join(config.PROGRESS_EVAL_DIR, `${goalId || "global"}.progress_eval.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, progress);
  return filePath;
}

module.exports = {
  evaluateProgress,
  writeProgressEvalArtifact,
};
