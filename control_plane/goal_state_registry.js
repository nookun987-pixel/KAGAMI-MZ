"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

const DEFAULT_GOALS = [
  {
    goal_id: "goal_executor_reliability",
    title: "Executor Reliability",
    category: "execution",
    target_outcomes: ["real executor job tracked", "execution result ingested", "workflow closes on real outcome"],
    current_state: "active",
    blockers: [],
    allowed_task_types: ["patch_bug", "add_test", "add_module", "refactor_safe"],
    forbidden_task_types: ["docs_update"],
    completion_rules: ["executor_jobs_visible", "real_results_ingested", "no_placeholder_success"],
  },
  {
    goal_id: "goal_operator_visibility",
    title: "Operator Visibility",
    category: "visibility",
    target_outcomes: ["next task reason visible", "goal state visible", "alternatives visible"],
    current_state: "active",
    blockers: [],
    allowed_task_types: ["add_module", "add_test", "docs_update", "refactor_safe"],
    forbidden_task_types: [],
    completion_rules: ["goal_state_reported", "next_task_reason_visible"],
  },
  {
    goal_id: "goal_guarded_autonomy",
    title: "Guarded Autonomy",
    category: "autonomy",
    target_outcomes: ["bounded next tasks only", "no vague task generation", "budget guard enforced"],
    current_state: "active",
    blockers: [],
    allowed_task_types: ["patch_bug", "add_test", "add_module", "refactor_safe"],
    forbidden_task_types: ["docs_update"],
    completion_rules: ["goal_loop_bounded", "no_vague_next_task"],
  },
];

function readGoalStateRegistry() {
  return readJsonSafe(config.GOAL_STATE_REGISTRY_PATH, {
    generated_at: null,
    goals: DEFAULT_GOALS,
  });
}

function writeGoalStateRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.GOAL_STATE_REGISTRY_PATH, store);
}

function getGoalState(goalId) {
  return (readGoalStateRegistry().goals || []).find((goal) => goal.goal_id === goalId) || null;
}

function updateGoalState(goalId, patch = {}) {
  const store = readGoalStateRegistry();
  const goals = Array.isArray(store.goals) ? store.goals : [];
  const index = goals.findIndex((goal) => goal.goal_id === goalId);
  if (index === -1) return null;
  goals[index] = {
    ...goals[index],
    ...patch,
  };
  store.goals = goals;
  writeGoalStateRegistry(store);
  return goals[index];
}

function writeGoalStateArtifact(goal) {
  const filePath = path.join(config.NEXT_TASK_DECISION_DIR, `${goal.goal_id}.goal_state.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, goal);
  return filePath;
}

module.exports = {
  DEFAULT_GOALS,
  readGoalStateRegistry,
  writeGoalStateRegistry,
  getGoalState,
  updateGoalState,
  writeGoalStateArtifact,
};
