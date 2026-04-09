"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe } = require("./local_control_agent/bridge_writer");
const { buildSuggestions } = require("./next_task_suggester");
const { formatDuration } = require("./cost_estimator");

const MAX_REPORT_AGE_MS = 24 * 60 * 60 * 1000;
const MAX_COST_REPORTS = 20;

const STALE_APPROVAL_MS = 30 * 60 * 1000; // 30 min
const MAX_DIGEST_SUGGESTIONS = 3;
const MAX_FAILURE_ITEMS = 3;
const MAX_STALLED_ITEMS = 2;
const MAX_APPROVAL_ITEMS = 2;

// ---------- readers (read-only, no side effects) -----------------------------

function readSnapshot() {
  return readJsonSafe(config.SYSTEM_RUNTIME_SNAPSHOT, {});
}

function readApprovalInbox() {
  return readJsonSafe(config.APPROVAL_INBOX_PATH, { pending: [], resolved: [] });
}

function readFailureCenter() {
  return readJsonSafe(config.FAILURE_CENTER_PATH, { failures: [] });
}

function readPersistentQueue() {
  return readJsonSafe(config.PERSISTENT_TASK_QUEUE_PATH, { tasks: [] });
}

// ---------- section builders -------------------------------------------------

function buildSystemSection(snapshot) {
  return {
    state: snapshot.agent_status || snapshot.system_state || "unknown",
    branch: snapshot.branch || null,
    repo_clean: snapshot.repo_clean != null ? Boolean(snapshot.repo_clean) : null,
    latest_commit: snapshot.latest_commit || null,
  };
}

function buildApprovalsSection(pending, now) {
  const stale = pending.filter((p) => {
    const created = p.created_at ? new Date(p.created_at).getTime() : 0;
    return created > 0 && now - created > STALE_APPROVAL_MS;
  });
  return {
    pending_count: pending.length,
    stale_count: stale.length,
    items: pending.slice(0, MAX_APPROVAL_ITEMS).map((p) => ({
      approval_id: p.approval_id,
      summary: String(p.summary || p.tool_name || "").slice(0, 60),
      risk_level: p.risk_level || "unknown",
      age_minutes: p.created_at
        ? Math.floor((now - new Date(p.created_at).getTime()) / 60000)
        : null,
    })),
  };
}

function buildFailuresSection(failures) {
  const open = failures.filter((f) => f.status === "open");
  const retryable = open.filter((f) => f.retryable);
  // Group non-retryable by failure_code for compact display
  const codeGroups = {};
  open.forEach((f) => {
    if (!codeGroups[f.failure_code]) codeGroups[f.failure_code] = 0;
    codeGroups[f.failure_code] += 1;
  });
  return {
    total_open: open.length,
    retryable_count: retryable.length,
    code_summary: Object.entries(codeGroups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code, count]) => ({ code, count })),
    items: open.slice(0, MAX_FAILURE_ITEMS).map((f) => ({
      failure_id: f.failure_id,
      failure_code: f.failure_code,
      task_id: String(f.task_id || "").slice(-24),
      retryable: f.retryable,
    })),
  };
}

function buildStalledSection(tasks) {
  const stalled = tasks.filter(
    (t) => t.status === "step_failed" || t.status === "blocked"
  );
  return {
    count: stalled.length,
    items: stalled.slice(0, MAX_STALLED_ITEMS).map((t) => ({
      task_id: t.task_id,
      current_step: t.current_step_index,
      total_steps: t.total_steps,
      last_error: String(t.last_error || "").slice(0, 60) || null,
    })),
  };
}

// ---------- cost + timing aggregator -----------------------------------------

function buildCostTimingSection() {
  try {
    const dir = config.EXECUTION_REPORT_DIR;
    if (!fs.existsSync(dir)) return null;
    const now = Date.now();
    const reports = fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".execution_report.json"))
      .map((name) => {
        try {
          const fp = path.join(dir, name);
          const stat = fs.statSync(fp);
          if (now - stat.mtimeMs > MAX_REPORT_AGE_MS) return null;
          return readJsonSafe(fp, null);
        } catch (_) { return null; }
      })
      .filter(Boolean)
      .slice(0, MAX_COST_REPORTS);

    if (!reports.length) return null;

    let totalDurationMs = 0;
    let totalCostUnits = 0;
    let timedCount = 0;
    let costedCount = 0;

    for (const r of reports) {
      if (r.duration_ms != null && r.duration_ms > 0) {
        totalDurationMs += r.duration_ms;
        timedCount++;
      }
      if (r.estimated_cost && r.estimated_cost.model_units != null) {
        totalCostUnits += r.estimated_cost.model_units;
        costedCount++;
      }
    }

    return {
      reports_in_window: reports.length,
      total_duration_label: timedCount > 0 ? formatDuration(totalDurationMs) : null,
      avg_duration_label:   timedCount > 0 ? formatDuration(Math.round(totalDurationMs / timedCount)) : null,
      total_cost_units:     costedCount > 0 ? +totalCostUnits.toFixed(4) : null,
      avg_cost_units:       costedCount > 0 ? +(totalCostUnits / costedCount).toFixed(4) : null,
    };
  } catch (_) {
    return null;
  }
}

// ---------- public entry point -----------------------------------------------

function buildDigest() {
  const snapshot = readSnapshot();
  const inbox = readApprovalInbox();
  const failureCenter = readFailureCenter();
  const queue = readPersistentQueue();
  const suggestResult = buildSuggestions();

  const now = Date.now();
  const pending = inbox.pending || [];
  const failures = failureCenter.failures || [];
  const tasks = queue.tasks || [];

  const costTiming = buildCostTimingSection();

  return {
    status: "PASS",
    generated_at: new Date().toISOString(),
    system: buildSystemSection(snapshot),
    approvals: buildApprovalsSection(pending, now),
    failures: buildFailuresSection(failures),
    stalled: buildStalledSection(tasks),
    suggestions: (suggestResult.suggestions || []).slice(0, MAX_DIGEST_SUGGESTIONS),
    cost_timing: costTiming,
    _meta: { ...suggestResult._meta, cost_timing: costTiming },
  };
}

module.exports = { buildDigest };
