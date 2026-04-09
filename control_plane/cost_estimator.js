"use strict";

// Weight-based cost estimator. All values are abstract "cost units" (not real dollars).
// Weights tuned to reflect relative model usage and I/O load per executor lane.

const WEIGHTS = {
  dev_read:    { base: 0.01, per_file: 0.002,  per_test: 0.001, per_request: 0.000 },
  dev_write:   { base: 0.03, per_file: 0.008,  per_test: 0.004, per_request: 0.000 },
  web_ops:     { base: 0.02, per_file: 0.001,  per_test: 0.000, per_request: 0.012 },
  mixed_plan:  { base: 0.05, per_file: 0.006,  per_test: 0.003, per_request: 0.008 },
};

const DEFAULT_WEIGHTS = { base: 0.02, per_file: 0.003, per_test: 0.002, per_request: 0.005 };

function formatDuration(ms) {
  if (!ms || ms < 0) return null;
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${rem}s`;
}

function costLabel(units) {
  if (units < 0.02) return "minimal";
  if (units < 0.05) return "low";
  if (units < 0.12) return "moderate";
  if (units < 0.25) return "high";
  return "very high";
}

/**
 * estimateCost({ executor_lane, changed_files, tests_executed, requests_made, duration_ms })
 * Returns { model_units, label, duration_label, summary }
 */
function estimateCost({ executor_lane, changed_files, tests_executed, requests_made, duration_ms } = {}) {
  const w = WEIGHTS[executor_lane] || DEFAULT_WEIGHTS;
  const fileCount    = Array.isArray(changed_files)   ? changed_files.length   : (Number(changed_files)   || 0);
  const testCount    = Array.isArray(tests_executed)  ? tests_executed.length  : (Number(tests_executed)  || 0);
  const requestCount = Number(requests_made) || 0;

  const units = +(
    w.base +
    fileCount    * w.per_file +
    testCount    * w.per_test +
    requestCount * w.per_request
  ).toFixed(4);

  const dLabel = formatDuration(duration_ms);

  return {
    model_units:    units,
    label:          costLabel(units),
    duration_label: dLabel,
    summary:        dLabel ? `${dLabel} / ${costLabel(units)} cost` : `${costLabel(units)} cost`,
  };
}

module.exports = { estimateCost, formatDuration };
