"use strict";

const { nowIso } = require("../shared/utils/fs_utils");

const PLAN_STEPS = {
  image: ["prepare_prompt", "dispatch_render", "validate_output"],
  cine: ["prepare_sequence_plan", "dispatch_sequence", "validate_output"],
  game: ["prepare_game_spec", "dispatch_game_task", "validate_output"],
  content: ["prepare_content_brief", "dispatch_content_task", "validate_output"],
  ops: ["prepare_ops_action", "dispatch_ops_task", "validate_output"],
};

function createJobId(sequence = 1, date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const serial = String(sequence).padStart(3, "0");
  return `AUTO_${yyyy}${mm}${dd}_${serial}`;
}

function createTaskSpec(intent, options = {}) {
  if (!intent || !intent.intent_type || !intent.goal) {
    throw new Error("Task planner requires a valid intent.");
  }

  const sequence = Number.isInteger(options.sequence) && options.sequence > 0 ? options.sequence : 1;
  const job_id = options.jobId || createJobId(sequence, options.date || new Date());
  const lane = intent.intent_type;

  return {
    job_id,
    lane,
    objective: intent.goal,
    constraints: Array.isArray(intent.constraints) ? [...intent.constraints] : [],
    priority: intent.priority || "normal",
    execution_plan: {
      steps: PLAN_STEPS[lane] || ["prepare_task", "dispatch_task", "validate_output"],
    },
    success_criteria: [
      "real output exists",
      "validator pass",
      "final judge allow",
    ],
    context: {
      planned_at: nowIso(),
      planner_version: "mikage_v2_control_plane",
      signals: intent.signals || {},
      memory_hints: options.memoryHints || [],
    },
  };
}

module.exports = {
  PLAN_STEPS,
  createJobId,
  createTaskSpec,
};
