"use strict";

function normalizeExecutionSuccess(input = {}) {
  if (!input.job_id || !input.task_id) return { status: "BLOCKED", reason: "missing_job_or_task_id" };
  if (!Array.isArray(input.changed_files)) return { status: "BLOCKED", reason: "missing_changed_files" };
  if (!Array.isArray(input.tests_executed)) return { status: "BLOCKED", reason: "missing_tests_executed" };
  if (!Array.isArray(input.tests_passed)) return { status: "BLOCKED", reason: "missing_tests_passed" };
  if (!Array.isArray(input.tests_failed)) return { status: "BLOCKED", reason: "missing_tests_failed" };
  if (!Array.isArray(input.artifacts_returned)) return { status: "BLOCKED", reason: "missing_artifacts_returned" };
  if (!String(input.summary || "").trim()) return { status: "BLOCKED", reason: "missing_summary" };
  return {
    status: "PASS",
    result: {
      job_id: input.job_id,
      task_id: input.task_id,
      changed_files: input.changed_files,
      tests_executed: input.tests_executed,
      tests_passed: input.tests_passed,
      tests_failed: input.tests_failed,
      artifacts_returned: input.artifacts_returned,
      summary: input.summary,
      raw_result_ref: input.raw_result_ref || null,
      completed_at: input.completed_at || new Date().toISOString(),
      start_time:   input.start_time   || null,
      end_time:     input.end_time     || null,
      duration_ms:  input.duration_ms  != null ? input.duration_ms : null,
      estimated_cost: input.estimated_cost || null,
    },
  };
}

function normalizeExecutionFailure(input = {}) {
  if (!input.job_id || !input.task_id) return { status: "BLOCKED", reason: "missing_job_or_task_id" };
  if (!String(input.failure_stage || "").trim()) return { status: "BLOCKED", reason: "missing_failure_stage" };
  if (!String(input.failure_type || "").trim()) return { status: "BLOCKED", reason: "missing_failure_type" };
  if (!String(input.summary || "").trim()) return { status: "BLOCKED", reason: "missing_summary" };
  return {
    status: "PASS",
    failure: {
      job_id: input.job_id,
      task_id: input.task_id,
      failure_stage: input.failure_stage,
      failure_type: input.failure_type,
      retryable: !!input.retryable,
      summary: input.summary,
      raw_failure_ref: input.raw_failure_ref || null,
      failed_at: input.failed_at || new Date().toISOString(),
    },
  };
}

module.exports = {
  normalizeExecutionSuccess,
  normalizeExecutionFailure,
};
