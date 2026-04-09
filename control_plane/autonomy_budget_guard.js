"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const DEFAULT_LIMITS = {
  max_tasks_per_goal_stage: 3,
  max_retries_per_class: 2,
  max_consecutive_self_generated_tasks: 3,
  mandatory_operator_review_threshold: 2,
};

function readAutonomyBudgetState() {
  return readJsonSafe(config.AUTONOMY_BUDGET_STATE_PATH, {
    generated_at: null,
    limits: DEFAULT_LIMITS,
    by_goal_stage: {},
    retries_by_class: {},
    consecutive_self_generated_tasks: 0,
  });
}

function writeAutonomyBudgetState(state) {
  state.generated_at = new Date().toISOString();
  writeJson(config.AUTONOMY_BUDGET_STATE_PATH, state);
}

function evaluateAutonomyBudget(input = {}) {
  const state = readAutonomyBudgetState();
  const limits = state.limits || DEFAULT_LIMITS;
  const goalStageKey = `${input.goal_id || "unknown"}::${input.current_stage || "unknown"}`;
  const goalStageCount = Number((state.by_goal_stage || {})[goalStageKey] || 0);
  const retryCount = Number((state.retries_by_class || {})[input.retry_class || "none"] || 0);
  const consecutive = Number(state.consecutive_self_generated_tasks || 0);

  if (goalStageCount >= limits.max_tasks_per_goal_stage) {
    return { allowed: false, reason: "goal_stage_budget_exhausted" };
  }
  if (input.retry_class && retryCount >= limits.max_retries_per_class) {
    return { allowed: false, reason: "retry_class_budget_exhausted" };
  }
  if (consecutive >= limits.max_consecutive_self_generated_tasks) {
    return { allowed: false, reason: "consecutive_self_generated_budget_exhausted" };
  }
  return {
    allowed: true,
    require_operator_review: consecutive >= limits.mandatory_operator_review_threshold,
    reason: "budget_ok",
  };
}

function consumeAutonomyBudget(input = {}) {
  const state = readAutonomyBudgetState();
  const goalStageKey = `${input.goal_id || "unknown"}::${input.current_stage || "unknown"}`;
  state.by_goal_stage = state.by_goal_stage || {};
  state.retries_by_class = state.retries_by_class || {};
  state.by_goal_stage[goalStageKey] = Number(state.by_goal_stage[goalStageKey] || 0) + 1;
  if (input.retry_class) {
    state.retries_by_class[input.retry_class] = Number(state.retries_by_class[input.retry_class] || 0) + 1;
  }
  state.consecutive_self_generated_tasks = Number(state.consecutive_self_generated_tasks || 0) + 1;
  writeAutonomyBudgetState(state);
  return state;
}

module.exports = {
  DEFAULT_LIMITS,
  readAutonomyBudgetState,
  writeAutonomyBudgetState,
  evaluateAutonomyBudget,
  consumeAutonomyBudget,
};
