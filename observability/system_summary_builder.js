"use strict";

const { readMetricsRegistry } = require("./run_metrics_registry");

function round(value) {
  return Number(Number(value || 0).toFixed(2));
}

function buildSystemSummary(registryInput) {
  const registry = registryInput || readMetricsRegistry();
  const runs = Object.values(registry.runs || {});
  const attempts = Array.isArray(registry.attempts) ? registry.attempts : [];
  const status_counts = {};
  const rejectCounts = {};
  const lane_breakdown = {};
  let total_cost = 0;

  for (const run of runs) {
    const status = run.final_status || "UNKNOWN";
    status_counts[status] = (status_counts[status] || 0) + 1;
    total_cost += Number(run.cost_used) || 0;

    if (run.final_reason) {
      rejectCounts[run.final_reason] = (rejectCounts[run.final_reason] || 0) + 1;
    }

    const lane = run.lane || "unknown";
    if (!lane_breakdown[lane]) {
      lane_breakdown[lane] = { runs: 0, allow_rate: 0, allow_count: 0 };
    }
    lane_breakdown[lane].runs += 1;
    if (status === "ALLOW") {
      lane_breakdown[lane].allow_count += 1;
    }
  }

  for (const lane of Object.keys(lane_breakdown)) {
    const bucket = lane_breakdown[lane];
    bucket.allow_rate = bucket.runs > 0 ? round(bucket.allow_count / bucket.runs) : 0;
    delete bucket.allow_count;
  }

  const total_attempts = attempts.length;
  const average_attempts_per_run = runs.length > 0 ? round(total_attempts / runs.length) : 0;
  const top_reject_reasons = Object.entries(rejectCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([reason]) => reason)
    .slice(0, 5);

  return {
    total_runs: runs.length,
    status_counts,
    top_reject_reasons,
    total_cost: round(total_cost),
    average_attempts_per_run,
    lane_breakdown,
  };
}

module.exports = {
  buildSystemSummary,
};
