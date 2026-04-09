async function api(route, method = "GET", body) {
  const response = await fetch(route, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  payload.__http_ok = response.ok;
  payload.__route = route;
  return payload;
}

const uiState = {
  latestApprovalId: null,
  latestFailureId: null,
  latestTaskId: null,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mapStatusBadge({ pendingApprovals, latestJob }) {
  if (pendingApprovals.length) return { label: "WAITING_APPROVAL", className: "status-waiting" };
  if (!latestJob) return { label: "DONE", className: "status-done" };
  const status = String(latestJob.status || "").toUpperCase();
  if (["RUNNING", "DISPATCHED", "PENDING"].includes(status)) return { label: "RUNNING", className: "status-running" };
  if (["FAILED", "FAIL", "BLOCKED", "INGEST_ERROR", "EXPIRED"].includes(status)) return { label: "FAILED", className: "status-failed" };
  return { label: "DONE", className: "status-done" };
}

function jobStepStates(job) {
  const status = String((job && job.status) || "").toUpperCase();
  const hasReport = !!(job && job.report);
  const hasIngest = !!(job && job.result_ingest);
  return [
    { key: "GPT", active: !!job, done: !!job },
    { key: "CODEX", active: ["PENDING", "DISPATCHED", "RUNNING"].includes(status), done: ["SUCCEEDED", "FAILED", "INGEST_ERROR"].includes(status) },
    { key: "INGEST", active: ["SUCCEEDED", "FAILED", "INGEST_ERROR"].includes(status) && !hasReport, done: hasIngest },
    { key: "REPORT", active: hasIngest && !hasReport, done: hasReport },
  ];
}

function renderApprovalFocus(items) {
  const root = document.getElementById("approval-focus");
  const count = document.getElementById("pending-count");
  count.textContent = String(items.length);
  uiState.latestApprovalId = items.length ? items[0].approval_id : null;
  uiState.latestTaskId = items.length ? (items[0].task_id || null) : null;

  if (!items.length) {
    root.className = "focus-card empty-state";
    root.innerHTML = "No pending approval.";
    return;
  }

  const item = items[0];
  root.className = "focus-card";
  root.innerHTML = `
    <div class="focus-title">${escapeHtml(item.summary || item.task_id || item.approval_id)}</div>
    <div class="focus-meta">${escapeHtml(item.tool_name || "task")} · ${escapeHtml(item.risk_level || "unknown")}</div>
    <div class="focus-text">Approval needed before write execution.</div>
  `;
}

function renderCurrentJob(jobs) {
  const root = document.getElementById("current-job-view");
  const caption = document.getElementById("job-caption");
  const latest = Array.isArray(jobs) && jobs.length ? jobs[0] : null;

  if (!latest) {
    caption.textContent = "No active job";
    root.innerHTML = `<div class="empty-state">No job running.</div>`;
    return latest;
  }

  caption.textContent = latest.task_id || latest.job_id;
  const steps = jobStepStates(latest).map((step) => {
    const className = step.done ? "step done" : step.active ? "step active" : "step";
    return `<div class="${className}">${step.key}</div>`;
  }).join("");

  root.innerHTML = `
    <div class="job-topline">
      <div class="job-id">${escapeHtml(latest.job_id)}</div>
      <div class="job-meta">${escapeHtml(latest.status || "UNKNOWN")}</div>
    </div>
    <div class="step-row">${steps}</div>
    <div class="job-times">
      <span>${escapeHtml(latest.started_at || "-")}</span>
      <span>${escapeHtml(latest.finished_at || "-")}</span>
    </div>
  `;
  return latest;
}

function renderShortResult({ latestJob, latestFailure }) {
  const root = document.getElementById("short-result");
  uiState.latestFailureId = latestFailure && latestFailure.failure_id ? latestFailure.failure_id : null;

  if (latestJob && latestJob.report) {
    const report = latestJob.report;
    root.innerHTML = `
      <div>${escapeHtml(report.what_was_done || "Work completed.")}</div>
      <div class="result-subline">${escapeHtml(report.result || "unknown")} · ${escapeHtml(report.next_step || "review_and_decide")}</div>
    `;
    return;
  }

  if (latestFailure) {
    root.innerHTML = `
      <div>${escapeHtml(latestFailure.message || "Execution failed.")}</div>
      <div class="result-subline">${escapeHtml(latestFailure.failure_code || "failure")} · review then retry or reject</div>
    `;
    return;
  }

  root.textContent = "Waiting for the next operator decision.";
}

function renderSystemStatus(payload, badge) {
  const badgeNode = document.getElementById("status-badge");
  badgeNode.textContent = badge.label;
  badgeNode.className = `status-badge ${badge.className}`;

  const quick = document.getElementById("system-quick");
  quick.innerHTML = `
    <div>System: ${escapeHtml(payload.system_state || payload.status || "unknown")}</div>
    <div>Agent: ${escapeHtml(payload.agent_status || "unknown")}</div>
    <div>Branch: ${escapeHtml(payload.branch || "-")}</div>
  `;
}

function setFeedback(message, type = "neutral") {
  const node = document.getElementById("action-feedback");
  node.textContent = message;
  node.className = type === "success"
    ? "feedback-text feedback-success"
    : type === "fail"
      ? "feedback-text feedback-fail"
      : "feedback-text";
}

function extractFailureReason(payload) {
  return payload.reason
    || payload.error
    || payload.blocker_reason
    || (payload.report && (payload.report.reason || payload.report.error || payload.report.blocker_reason))
    || "unknown_failure";
}

function updateActionButtons({ pendingApprovals, latestFailure, systemStatus }) {
  document.getElementById("approve-latest").disabled = !pendingApprovals.length;
  document.getElementById("reject-latest").disabled = !pendingApprovals.length;
  document.getElementById("retry-latest").disabled = !(latestFailure && latestFailure.failure_id);
  document.getElementById("pause-system").disabled = String(systemStatus || "").toLowerCase() === "paused";
  document.getElementById("resume-system").disabled = String(systemStatus || "").toLowerCase() === "running";
}

async function refresh() {
  const [tasks, jobs, status, failures] = await Promise.all([
    api("/api/task/list"),
    api("/api/job/list"),
    api("/api/system/status"),
    api("/api/failure-center"),
  ]);

  const pendingApprovals = (tasks.tasks && tasks.tasks.pending) || [];
  const jobList = jobs.jobs || [];
  const latestFailure = ((failures.failure_center && failures.failure_center.failures) || [])[0] || null;

  renderApprovalFocus(pendingApprovals);
  const latestJob = renderCurrentJob(jobList);
  renderShortResult({ latestJob, latestFailure });
  const badge = mapStatusBadge({ pendingApprovals, latestJob });
  renderSystemStatus(status, badge);
  updateActionButtons({ pendingApprovals, latestFailure, systemStatus: status.system_state });
}

function isActionSuccess(payload, mode) {
  if (!payload || payload.__http_ok === false) return false;
  if (mode === "reject") {
    return payload.approval || payload.reason === "approval_not_found" ? !!payload.approval : payload.status === "BLOCKED";
  }
  return payload.status === "PASS";
}

async function runAction(executor, successText, mode = "pass") {
  try {
    const payload = await executor();
    if (!isActionSuccess(payload, mode)) {
      setFeedback(`ACTION FAILED: ${extractFailureReason(payload)}`, "fail");
      await refresh();
      return payload;
    }
    setFeedback(successText, "success");
    await refresh();
    return payload;
  } catch (error) {
    setFeedback(`ACTION FAILED: ${error.message}`, "fail");
    await refresh();
    return null;
  }
}

async function handleCreateTask() {
  const input = document.getElementById("task-input");
  const content = input.value.trim();
  if (!content) return;
  const payload = await runAction(
    () => api("/api/task/create", "POST", { content, requested_by: "dashboard_operator" }),
    "TASK CREATED"
  );
  if (payload && payload.status === "PASS") {
    input.value = "";
  }
}

async function handleApprove() {
  if (!uiState.latestApprovalId) return;
  await runAction(
    () => api("/api/task/approve", "POST", { id: uiState.latestApprovalId, reviewed_by: "dashboard_operator" }),
    "APPROVED"
  );
}

async function handleReject() {
  if (!uiState.latestApprovalId) return;
  await runAction(
    () => api("/api/task/reject", "POST", { id: uiState.latestApprovalId, reviewed_by: "dashboard_operator" }),
    "REJECTED",
    "reject"
  );
}

async function handleRetry() {
  if (!uiState.latestFailureId) return;
  await runAction(
    () => api(`/api/retry/${encodeURIComponent(uiState.latestFailureId)}`, "POST"),
    "RETRY STARTED"
  );
}

async function init() {
  document.getElementById("create-task").addEventListener("click", handleCreateTask);
  document.getElementById("approve-latest").addEventListener("click", handleApprove);
  document.getElementById("reject-latest").addEventListener("click", handleReject);
  document.getElementById("retry-latest").addEventListener("click", handleRetry);

  document.getElementById("pause-system").addEventListener("click", async () => {
    await runAction(() => api("/api/system/pause", "POST", {}), "SYSTEM PAUSED");
  });
  document.getElementById("resume-system").addEventListener("click", async () => {
    await runAction(() => api("/api/system/resume", "POST", {}), "SYSTEM RESUMED");
  });
  document.getElementById("restart-system").addEventListener("click", async () => {
    await runAction(() => api("/api/system/restart", "POST", {}), "SYSTEM RESTARTED");
  });

  await refresh();
  setInterval(refresh, 3000);
}

init();
