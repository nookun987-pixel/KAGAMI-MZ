"use strict";

require("dotenv").config();

const { dispatchExecution } = require("../execution/execution_connector");

function buildResult(base = {}) {
  return {
    task_id: base.task_id || "unknown",
    task_type: base.task_type || "run_render_task",
    operator_verdict: base.operator_verdict || "FAIL",
    called_module: base.called_module || "mikage_operator_agent",
    action_executed: base.action_executed !== false,
    result_summary: base.result_summary || "",
    artifacts: base.artifacts || {},
    error: base.error || null,
    completed_at: base.completed_at || new Date().toISOString(),
    worker_id: base.worker_id || null,
    queue_id: base.queue_id || null,
    run_id: base.run_id || null,
    job_id: base.job_id || null,
  };
}

function normalizeTask(rawTask = {}) {
  const taskType = rawTask.task_type || "run_render_task";
  const payload = rawTask.payload || {};
  if (taskType === "run_render_task" && !payload.job_id) {
    return { ok: false, error: "Missing job_id", task: null };
  }
  return {
    ok: true,
    task: {
      task_id: rawTask.task_id || payload.job_id || "task",
      task_type: taskType,
      payload,
    },
  };
}

async function defaultRenderExecutor(job, backend) {
  const dispatched = await dispatchExecution({
    run_id: job.run_id || job.job_id || null,
    attempt: job.attempt || job.attempt_count || 1,
    shot_type: job.shot_type || null,
    target: job.execution_target || null,
    prompt: job.prompt || job.user_idea || "",
    negative_prompt: job.negative_prompt || "",
    canon_packet: job.canon_packet || null,
    job_payload: job,
  }, {
    backend,
  });
  return dispatched.normalized_result;
}

async function runOperatorTask(rawTask = {}, options = {}) {
  try {
    const task = normalizeTask(rawTask);
    if (!task.ok) {
      return buildResult({
        task_id: rawTask.task_id,
        task_type: rawTask.task_type,
        operator_verdict: "REJECT",
        result_summary: task.error,
        error: task.error,
        worker_id: rawTask.worker_id || null,
        queue_id: rawTask.queue_id || null,
        run_id: rawTask.run_id || null,
        job_id: rawTask.job_id || null,
      });
    }

    if (task.task.task_type === "system_status_check") {
      const { runHealthCheck } = require("../orchestrator");
      const health = await runHealthCheck();
      return buildResult({
        task_id: task.task.task_id,
        task_type: task.task.task_type,
        operator_verdict: "DONE",
        called_module: "orchestrator.runHealthCheck",
        result_summary: "health check complete",
        artifacts: { health },
        worker_id: task.task.payload.worker_id || null,
        queue_id: task.task.payload.queue_id || null,
        run_id: task.task.payload.run_id || null,
        job_id: task.task.payload.job_id || null,
      });
    }

    const connectorBackend = options.backend || null;
    const executor = options.executor || ((payload) => defaultRenderExecutor({
      ...payload,
      execution_target: options.execution_target || payload.execution_target || null,
    }, connectorBackend));
    const summary = await executor(task.task.payload);
    const executionStatus = summary && summary.status;
    const decision = summary && summary.decision;
    const isDone = (executionStatus === "SUCCESS") || decision === "ALLOW" || summary && summary.status === "DONE";

    return buildResult({
      task_id: task.task.task_id,
      task_type: task.task.task_type,
      operator_verdict: isDone ? "DONE" : "FAIL",
      called_module: options.executor ? "custom_executor" : "execution.execution_connector",
      result_summary: isDone
        ? `render complete: ${decision || executionStatus || "ALLOW"}`
        : `render failed: ${decision || executionStatus || "FAIL"}`,
      artifacts: {
        execution: summary,
        summary,
        queue_id: task.task.payload.queue_id || null,
        run_id: task.task.payload.run_id || null,
        worker_id: task.task.payload.worker_id || null,
      },
      error: isDone ? null : (summary && (summary.error_reason || summary.error)) || null,
      worker_id: task.task.payload.worker_id || null,
      queue_id: task.task.payload.queue_id || null,
      run_id: task.task.payload.run_id || null,
      job_id: task.task.payload.job_id || null,
    });
  } catch (error) {
    return buildResult({
      task_id: rawTask.task_id || "unknown",
      task_type: rawTask.task_type || "run_render_task",
      operator_verdict: "FAIL",
      result_summary: `operator error: ${error.message}`,
      error: error.message,
      worker_id: rawTask && rawTask.payload && rawTask.payload.worker_id || null,
      queue_id: rawTask && rawTask.payload && rawTask.payload.queue_id || null,
      run_id: rawTask && rawTask.payload && rawTask.payload.run_id || null,
      job_id: rawTask && rawTask.payload && rawTask.payload.job_id || null,
    });
  }
}

module.exports = {
  runOperatorTask,
};
