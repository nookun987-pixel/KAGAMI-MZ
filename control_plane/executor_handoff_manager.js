"use strict";

const { createExecutorJob, updateExecutorJob } = require("./executor_job_store");
const { setExecutorStatus } = require("./executor_status_tracker");
const { recordExecutorJob } = require("./workflow_registry");

function createExecutorHandoff(dispatcher, input = {}) {
  const created = createExecutorJob({
    task_id: input.task_id,
    workflow_id: input.workflow_id || null,
    dispatch_id: input.dispatch.dispatch_id,
    executor: input.executor || "codex",
    repo_path: input.dispatch.repo_path,
    branch_policy: input.dispatch.branch_policy,
    status: "PENDING",
    dispatch_ref: input.dispatch_ref,
  });
  const handoff = dispatcher.handoffDispatchPack({
    job_id: created.job.job_id,
    dispatch_pack_path: input.dispatch_ref,
    dispatch: input.dispatch,
    workflow_id: input.workflow_id || null,
  });
  let status = "FAILED";
  if (handoff.status === "DISPATCHED" && handoff.execution_result) {
    status = "RUNNING";
  } else if (handoff.status === "DISPATCHED") {
    status = "DISPATCHED";
  }
  const updated = updateExecutorJob(created.job.job_id, {
    status,
    started_at: ["DISPATCHED", "RUNNING"].includes(status) ? new Date().toISOString() : null,
    handoff_ref: handoff.handoff_ref || null,
    failure_ref: handoff.status === "DISPATCHED" ? null : handoff.reason || "handoff_failed",
  }) || created.job;
  setExecutorStatus(updated.job_id, status, {
    task_id: updated.task_id,
    workflow_id: updated.workflow_id,
  });
  recordExecutorJob(updated);
  return {
    status: handoff.status === "DISPATCHED" ? "PASS" : "FAIL",
    job: updated,
    handoff,
  };
}

module.exports = {
  createExecutorHandoff,
};
