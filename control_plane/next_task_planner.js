"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");
const { rankTaskCandidates } = require("./task_candidate_ranker");
const { validateTaskGoal } = require("./task_goal_registry");

function buildCandidateFromFailure(goal, progress) {
  const failure = progress.latest_failure;
  if (!failure) return null;
  const objective = `Fix ${String(failure.failure_code || "failure").toLowerCase()} in ${failure.failure_stage}`;
  if (!validateTaskGoal("patch_bug", objective).valid) return null;
  return {
    source: "failure",
    goal_id: goal.goal_id,
    task_type: "patch_bug",
    title: `Patch ${failure.failure_code}`,
    objective,
    scope_in: ["control_plane"],
    scope_out: ["start_mikage.bat", "MIKAGE/index.js", "runtime/drive_queue/runtime.js", "runtime/colab_worker/*"],
    target_files: ["control_plane"],
    success_criteria: [`${failure.failure_code} no longer blocks workflow`, "tests pass"],
    reason: failure.message,
    evidence_refs: [failure.report_ref, failure.command_ref].filter(Boolean),
    goal_relevance: 1,
    unblock_value: 1,
    safety: 1,
    scope_size: 1,
    testability: 1,
    approval_cost: 1,
  };
}

function buildCandidateFromBlocked(goal, progress) {
  const blocked = progress.latest_blocked;
  if (!blocked || !blocked.blocker_reason) return null;
  const objective = `Resolve blocker: ${blocked.blocker_reason}`;
  if (!validateTaskGoal("patch_bug", objective).valid) return null;
  return {
    source: "blocked",
    goal_id: goal.goal_id,
    task_type: "patch_bug",
    title: "Resolve latest blocker",
    objective,
    scope_in: ["control_plane"],
    scope_out: ["start_mikage.bat", "MIKAGE/index.js", "runtime/drive_queue/runtime.js", "runtime/colab_worker/*"],
    target_files: ["control_plane"],
    success_criteria: ["blocker reason removed", "tests pass"],
    reason: blocked.blocker_reason,
    evidence_refs: blocked.artifacts_written || [],
    goal_relevance: 1,
    unblock_value: 1,
    safety: 1,
    scope_size: 1,
    testability: 1,
    approval_cost: 1,
  };
}

function buildCandidateFromSuccess(goal, progress) {
  const success = progress.latest_success;
  if (!success) return null;
  const objective = "Add test coverage for latest successful bounded flow";
  if (!validateTaskGoal("add_test", objective).valid) return null;
  return {
    source: "success",
    goal_id: goal.goal_id,
    task_type: "add_test",
    title: "Add regression test for successful flow",
    objective,
    scope_in: ["control_plane/tests"],
    scope_out: ["start_mikage.bat", "MIKAGE/index.js", "runtime/drive_queue/runtime.js", "runtime/colab_worker/*"],
    target_files: ["control_plane/tests"],
    success_criteria: ["regression test added", "tests pass"],
    reason: success.final_verdict || "latest success",
    evidence_refs: success.artifacts_written || [],
    goal_relevance: 0.8,
    unblock_value: 0.5,
    safety: 1,
    scope_size: 0.5,
    testability: 1,
    approval_cost: 0.5,
  };
}

function planNextTasks(goal, progress) {
  const candidates = [
    buildCandidateFromFailure(goal, progress.progress || progress),
    buildCandidateFromBlocked(goal, progress.progress || progress),
    buildCandidateFromSuccess(goal, progress.progress || progress),
  ].filter(Boolean);

  const ranked = rankTaskCandidates(candidates);
  const decision = ranked[0] || null;
  return {
    status: "PASS",
    candidates: ranked,
    decision,
    rejected_alternatives: ranked.slice(1).map((item) => ({
      title: item.title,
      reason: "lower_ranked",
      score: item.score,
    })),
  };
}

function writeNextTaskCandidatesArtifact(goalId, candidates) {
  const filePath = path.join(config.NEXT_TASK_CANDIDATES_DIR, `${goalId || "global"}.next_task_candidates.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, candidates);
  return filePath;
}

function writeNextTaskDecisionArtifact(goalId, decision) {
  const filePath = path.join(config.NEXT_TASK_DECISION_DIR, `${goalId || "global"}.next_task_decision.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, decision);
  return filePath;
}

module.exports = {
  planNextTasks,
  writeNextTaskCandidatesArtifact,
  writeNextTaskDecisionArtifact,
};
