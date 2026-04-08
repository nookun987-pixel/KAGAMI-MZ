"use strict";

function planOpsTask(taskSpec) {
  return {
    lane: "ops",
    job_id: taskSpec.job_id,
    action: taskSpec.objective,
    constraints: taskSpec.constraints || [],
  };
}

module.exports = {
  planOpsTask,
};
