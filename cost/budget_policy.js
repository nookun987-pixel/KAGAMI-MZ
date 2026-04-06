"use strict";

const DEFAULT_BUDGET_CONFIG = {
  global_budget: 50,
  global_used: 0,
  run_budget: 2.0,
  run_used: 0,
  max_attempt_per_run: 5,
  max_retry_per_failure: 2,
  cost_per_attempt_estimate: 0.25,
};

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeBudgetConfig(input = {}) {
  const merged = {
    ...DEFAULT_BUDGET_CONFIG,
    ...(input || {}),
  };

  return {
    global_budget: toNumber(merged.global_budget, DEFAULT_BUDGET_CONFIG.global_budget),
    global_used: toNumber(merged.global_used, DEFAULT_BUDGET_CONFIG.global_used),
    run_budget: toNumber(merged.run_budget, DEFAULT_BUDGET_CONFIG.run_budget),
    run_used: toNumber(merged.run_used, DEFAULT_BUDGET_CONFIG.run_used),
    max_attempt_per_run: Math.max(0, toNumber(merged.max_attempt_per_run, DEFAULT_BUDGET_CONFIG.max_attempt_per_run)),
    max_retry_per_failure: Math.max(0, toNumber(merged.max_retry_per_failure, DEFAULT_BUDGET_CONFIG.max_retry_per_failure)),
    cost_per_attempt_estimate: Math.max(0, toNumber(merged.cost_per_attempt_estimate, DEFAULT_BUDGET_CONFIG.cost_per_attempt_estimate)),
  };
}

function evaluateBudgetGuard(context = {}) {
  const config = normalizeBudgetConfig(context.config);
  const estimatedCost = Math.max(0, toNumber(context.estimated_cost, config.cost_per_attempt_estimate));
  const runUsed = Math.max(0, toNumber(context.run_used, config.run_used));
  const globalUsed = Math.max(0, toNumber(context.global_used, config.global_used));
  const attempt = Math.max(1, toNumber(context.attempt, 1));
  const retryCount = Math.max(0, toNumber(context.retry_count, 0));

  if (runUsed + estimatedCost > config.run_budget) {
    return {
      status: "REJECT",
      reason: "BUDGET_EXCEEDED",
      allowed: false,
      estimated_cost: estimatedCost,
      run_used: runUsed,
      global_used: globalUsed,
      config,
    };
  }

  if (globalUsed + estimatedCost > config.global_budget) {
    return {
      status: "REJECT",
      reason: "GLOBAL_BUDGET_EXCEEDED",
      allowed: false,
      estimated_cost: estimatedCost,
      run_used: runUsed,
      global_used: globalUsed,
      config,
    };
  }

  if (retryCount > config.max_retry_per_failure) {
    return {
      status: "STOP",
      reason: "RETRY_LIMIT_REACHED",
      allowed: false,
      estimated_cost: estimatedCost,
      run_used: runUsed,
      global_used: globalUsed,
      config,
    };
  }

  if (attempt > config.max_attempt_per_run) {
    return {
      status: "STOP",
      reason: "ATTEMPT_LIMIT_REACHED",
      allowed: false,
      estimated_cost: estimatedCost,
      run_used: runUsed,
      global_used: globalUsed,
      config,
    };
  }

  return {
    status: "PASS",
    reason: null,
    allowed: true,
    estimated_cost: estimatedCost,
    run_used: runUsed,
    global_used: globalUsed,
    config,
  };
}

module.exports = {
  DEFAULT_BUDGET_CONFIG,
  normalizeBudgetConfig,
  evaluateBudgetGuard,
};
