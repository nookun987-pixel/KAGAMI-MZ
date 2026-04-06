"use strict";

const { normalizeBudgetConfig, evaluateBudgetGuard } = require("./budget_policy");
const {
  ensureRegistryFile,
  readCostRegistry,
  summarizeCosts,
  appendCostRecord,
} = require("./cost_tracker");

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function getAttempt(runState, options = {}) {
  return Math.max(
    1,
    toNumber(
      options.attempt,
      toNumber(options.attempt_count, toNumber(runState && runState.attempt_count, 1))
    )
  );
}

function getRetryCount(runState, options = {}) {
  return Math.max(
    0,
    toNumber(
      options.retry_count,
      toNumber(runState && runState.metadata && runState.metadata.retry_count, 0)
    )
  );
}

function getEstimatedCost(config, options = {}) {
  return Math.max(0, toNumber(options.estimated_cost, config.cost_per_attempt_estimate));
}

function checkExecutionBudget(runState, options = {}) {
  try {
    ensureRegistryFile();
    const config = normalizeBudgetConfig(options.config);
    const records = readCostRegistry();
    const summary = summarizeCosts(records, runState && runState.run_id);
    const attempt = getAttempt(runState, options);
    const retryCount = getRetryCount(runState, options);
    const estimatedCost = getEstimatedCost(config, options);

    const decision = evaluateBudgetGuard({
      config,
      estimated_cost: estimatedCost,
      run_used: summary.run_used,
      global_used: summary.global_used,
      attempt,
      retry_count: retryCount,
    });

    return {
      ...decision,
      run_id: runState && runState.run_id || null,
      attempt,
      retry_count: retryCount,
      run_used: summary.run_used,
      global_used: summary.global_used,
      estimated_cost: estimatedCost,
    };
  } catch (error) {
    return {
      status: "REJECT",
      reason: "COST_AUTHORITY_ERROR",
      allowed: false,
      run_id: runState && runState.run_id || null,
      attempt: 1,
      retry_count: 0,
      run_used: 0,
      global_used: 0,
      estimated_cost: 0,
      error: error.message,
    };
  }
}

function recordExecutionCost(runState, options = {}) {
  try {
    ensureRegistryFile();
    const config = normalizeBudgetConfig(options.config);
    const records = readCostRegistry();
    const summary = summarizeCosts(records, runState && runState.run_id);
    const attempt = getAttempt(runState, options);
    const estimatedCost = getEstimatedCost(config, options);
    const actualCost = Math.max(
      0,
      toNumber(
        options.actual_cost,
        toNumber(options.cost, estimatedCost)
      )
    );
    const flags = [];

    if (actualCost > estimatedCost * 2) {
      flags.push("COST_ANOMALY");
    }

    const entry = {
      run_id: runState && runState.run_id || null,
      attempt,
      cost: actualCost,
      cumulative_run_cost: summary.run_used + actualCost,
      cumulative_global_cost: summary.global_used + actualCost,
      estimated_cost: estimatedCost,
      flags,
      timestamp: options.timestamp || new Date().toISOString(),
    };
    const appended = appendCostRecord(entry);

    return {
      ok: appended.ok,
      flagged: flags.includes("COST_ANOMALY"),
      flags,
      entry: appended.entry,
      cumulative_run_cost: entry.cumulative_run_cost,
      cumulative_global_cost: entry.cumulative_global_cost,
      estimated_cost: estimatedCost,
      actual_cost: actualCost,
    };
  } catch (error) {
    return {
      ok: false,
      flagged: false,
      flags: [],
      entry: null,
      cumulative_run_cost: 0,
      cumulative_global_cost: 0,
      estimated_cost: 0,
      actual_cost: 0,
      reason: error.message,
    };
  }
}

module.exports = {
  checkExecutionBudget,
  recordExecutionCost,
};
