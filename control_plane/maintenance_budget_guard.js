"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const DEFAULT_LIMITS = {
  max_maintenance_tasks_per_cycle: 2,
  max_heal_attempts_per_issue: 2,
  destructive_class_proposals: 0,
  operator_review_for_medium_or_high: true,
};

function readMaintenanceBudgetState() {
  return readJsonSafe(config.MAINTENANCE_BUDGET_STATE_PATH, {
    generated_at: null,
    limits: DEFAULT_LIMITS,
    maintenance_tasks_this_cycle: 0,
    heal_attempts_by_issue: {},
  });
}

function writeMaintenanceBudgetState(state) {
  state.generated_at = new Date().toISOString();
  writeJson(config.MAINTENANCE_BUDGET_STATE_PATH, state);
}

function evaluateMaintenanceBudget(input = {}) {
  const state = readMaintenanceBudgetState();
  const limits = state.limits || DEFAULT_LIMITS;
  if (Number(state.maintenance_tasks_this_cycle || 0) >= limits.max_maintenance_tasks_per_cycle) {
    return { allowed: false, reason: "maintenance_cycle_budget_exhausted" };
  }
  if (Number((state.heal_attempts_by_issue || {})[input.issue_id] || 0) >= limits.max_heal_attempts_per_issue) {
    return { allowed: false, reason: "issue_heal_budget_exhausted" };
  }
  return {
    allowed: true,
    require_operator_review: limits.operator_review_for_medium_or_high && ["medium", "high"].includes(String(input.severity || "").toLowerCase()),
    reason: "maintenance_budget_ok",
  };
}

function consumeMaintenanceBudget(input = {}) {
  const state = readMaintenanceBudgetState();
  state.maintenance_tasks_this_cycle = Number(state.maintenance_tasks_this_cycle || 0) + 1;
  state.heal_attempts_by_issue = state.heal_attempts_by_issue || {};
  if (input.issue_id) {
    state.heal_attempts_by_issue[input.issue_id] = Number(state.heal_attempts_by_issue[input.issue_id] || 0) + 1;
  }
  writeMaintenanceBudgetState(state);
  return state;
}

module.exports = {
  DEFAULT_LIMITS,
  readMaintenanceBudgetState,
  writeMaintenanceBudgetState,
  evaluateMaintenanceBudget,
  consumeMaintenanceBudget,
};
