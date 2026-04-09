"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe } = require("./local_control_agent/bridge_writer");

const MAX_SUGGESTIONS = 5;
const STALE_APPROVAL_MS = 30 * 60 * 1000; // 30 min
const IDLE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_REPORT_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------- readers ----------------------------------------------------------

function readRegistry() {
  return readJsonSafe(config.WORKFLOW_REGISTRY_JSON, {
    runs: [],
    latest_failed_workflow: null,
    latest_successful_workflow: null,
    generated_at: null,
  });
}

function readFailureCenter() {
  return readJsonSafe(config.FAILURE_CENTER_PATH, { failures: [] });
}

function readApprovalInbox() {
  return readJsonSafe(config.APPROVAL_INBOX_PATH, { pending: [], resolved: [] });
}

function readPersistentQueue() {
  return readJsonSafe(config.PERSISTENT_TASK_QUEUE_PATH, { tasks: [] });
}

function readRecentExecutionReports(limit = 10) {
  try {
    const dir = config.EXECUTION_REPORT_DIR;
    if (!fs.existsSync(dir)) return [];
    const now = Date.now();
    return fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".execution_report.json"))
      .map((name) => {
        const filePath = path.join(dir, name);
        try {
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs > MAX_REPORT_AGE_MS) return null;
          const data = readJsonSafe(filePath, null);
          return data ? { ...data, mtime_ms: stat.mtimeMs } : null;
        } catch (_) {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.mtime_ms - a.mtime_ms)
      .slice(0, limit);
  } catch (_) {
    return [];
  }
}

// ---------- rule 1: open retryable failures ----------------------------------
// Priority: highest. A broken task is always the first thing to fix.

function suggestFromFailures(failures) {
  const open = (failures || []).filter((f) => f.status === "open" && f.retryable);
  return open.slice(0, 2).map((f, i) => ({
    rank: i + 1,
    rule: "FAILURE_RETRY",
    reason: `Open retryable failure: ${f.failure_code} in task ${f.task_id || "unknown"}`,
    task_content: `inspect and fix failure ${f.failure_id}: ${f.failure_code} in ${f.task_id || "unknown"}`,
    executor_lane: "dev_read",
    estimated_risk: "low",
    source_ref: f.failure_id,
    trigger_command: `/thulai ${f.failure_id}`,
  }));
}

// ---------- rule 2: blocked/failed mixed task in queue -----------------------
// Priority: high. An in-progress multi-step job stalled means work is lost.

function suggestFromBlockedQueue(tasks) {
  const blocked = (tasks || []).filter(
    (item) => item.status === "step_failed" || item.status === "blocked"
  );
  return blocked.slice(0, 1).map((item) => {
    const nextStep = (item.current_step_index || 0) + 1;
    const totalSteps = item.total_steps || "?";
    return {
      rank: 10,
      rule: "INCOMPLETE_MIXED",
      reason: `Mixed task stalled at step ${nextStep}/${totalSteps}: ${item.task_id}`,
      task_content: `resume mixed task ${item.task_id} from step ${nextStep}`,
      executor_lane: "dev_read",
      estimated_risk: "low",
      source_ref: item.task_id,
      trigger_command: `/taotask resume mixed task ${item.task_id} from step ${nextStep}`,
    };
  });
}

// ---------- rule 3: stale pending approvals ----------------------------------
// Priority: medium-high. A task waiting >30min suggests operator missed it.

function suggestFromStaleApprovals(pending) {
  const now = Date.now();
  const stale = (pending || []).filter((item) => {
    const created = item.created_at ? new Date(item.created_at).getTime() : 0;
    return created > 0 && now - created > STALE_APPROVAL_MS;
  });
  return stale.slice(0, 1).map((item) => ({
    rank: 20,
    rule: "STALE_APPROVAL",
    reason: `Approval pending >30 min: ${item.summary || item.tool_name || item.approval_id}`,
    task_content: `review pending approval ${item.approval_id}: ${String(item.summary || "").slice(0, 60)}`,
    executor_lane: "dev_read",
    estimated_risk: "low",
    source_ref: item.approval_id,
    trigger_command: `/duyet ${item.approval_id}`,
  }));
}

// ---------- rule 4: recent success with changed files → suggest summary ------
// Priority: medium. Changed files deserve a quick review or doc note.

function suggestFromRecentReports(reports) {
  const eligible = reports.filter(
    (r) => r.result === "success" && (r.changed_files || []).length > 0
  );
  return eligible.slice(0, 1).map((r) => {
    const fileList = (r.changed_files || []).slice(0, 3).join(", ");
    // Keep task_id to ≤40 chars so trigger_command stays within 61 bytes
    // ("/taotask summarize task " = 24 chars + 40 = 64 - 3 prefix = 61 ✓)
    const shortTaskId = String(r.task_id || "").slice(0, 40);
    return {
      rank: 30,
      rule: "REPO_CHANGED",
      reason: `Recent task changed files: ${fileList}`,
      task_content: `summarize changes from task ${r.task_id}: ${String(r.what_was_done || "").slice(0, 60)}`,
      executor_lane: "dev_read",
      estimated_risk: "low",
      source_ref: r.job_id,
      trigger_command: `/taotask summarize task ${shortTaskId}`,
    };
  });
}

// ---------- rule 5: system idle → suggest inspection -------------------------
// Priority: lowest. Only fires when nothing else is pending.

function suggestIdle(registry) {
  const runs = registry.runs || [];
  const latestTs = runs.length
    ? new Date(runs[0].started_at || runs[0].generated_at || 0).getTime()
    : 0;
  const isIdle = !latestTs || Date.now() - latestTs > IDLE_THRESHOLD_MS;
  if (!isIdle) return [];
  return [
    {
      rank: 40,
      rule: "IDLE_INSPECTION",
      reason: "No recent task activity — system is idle",
      task_content: "check current workflow status and repo health",
      executor_lane: "dev_read",
      estimated_risk: "low",
      source_ref: null,
      trigger_command: "/taotask check current workflow status and repo health",
    },
    {
      rank: 41,
      rule: "IDLE_INSPECTION",
      reason: "System idle — suggest reviewing latest agent reports",
      task_content: "review latest execution reports and summarize system state",
      executor_lane: "dev_read",
      estimated_risk: "low",
      source_ref: null,
      trigger_command: "/taotask review latest execution reports and summarize system state",
    },
  ];
}

// ---------- rank + trim ------------------------------------------------------

function rankAndTrim(suggestions) {
  const seen = new Set();
  return suggestions
    .filter((s) => {
      // deduplicate by rule+source_ref
      const key = `${s.rule}:${s.source_ref || s.task_content}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, MAX_SUGGESTIONS)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ---------- public entry point -----------------------------------------------

function buildSuggestions() {
  const registry = readRegistry();
  const failureCenter = readFailureCenter();
  const inbox = readApprovalInbox();
  const queue = readPersistentQueue();
  const reports = readRecentExecutionReports(10);

  const openFailures = (failureCenter.failures || []).filter((f) => f.status === "open");
  const pendingApprovals = inbox.pending || [];
  const blockedTasks = (queue.tasks || []).filter(
    (t) => t.status === "step_failed" || t.status === "blocked"
  );

  const raw = [
    ...suggestFromFailures(failureCenter.failures),
    ...suggestFromBlockedQueue(queue.tasks),
    ...suggestFromStaleApprovals(pendingApprovals),
    ...suggestFromRecentReports(reports),
    ...suggestIdle(registry),
  ];

  const suggestions = rankAndTrim(raw);

  return {
    status: "PASS",
    generated_at: new Date().toISOString(),
    suggestion_count: suggestions.length,
    suggestions,
    _meta: {
      open_failures: openFailures.length,
      retryable_failures: openFailures.filter((f) => f.retryable).length,
      pending_approvals: pendingApprovals.length,
      blocked_queue_tasks: blockedTasks.length,
      recent_reports_checked: reports.length,
    },
  };
}

module.exports = { buildSuggestions };
