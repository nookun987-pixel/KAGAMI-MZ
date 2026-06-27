"use strict";

function buildActionPlan(intake) {
  return {
    task_id: intake.task_id,
    action: intake.action,
    requested_by: intake.requested_by,
    source_file: intake.source_file,
    tool_contract: "command_router_strict_schema",
    planned_steps: [
      "task_intake_resolver",
      "action_planner",
      "execution_state_machine",
      "runtime_boundary_guard",
      "tool_validator",
      "plan_guard",
      "approval_engine",
      "bounded_executor",
      "action_report_writer",
      "workflow_registry_update",
    ],
    created_at: new Date().toISOString(),
  };
}

module.exports = {
  buildActionPlan,
};
