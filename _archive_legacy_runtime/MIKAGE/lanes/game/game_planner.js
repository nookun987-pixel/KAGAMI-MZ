"use strict";

function planGameTask(taskSpec) {
  return {
    lane: "game",
    job_id: taskSpec.job_id,
    objective: taskSpec.objective,
    constraints: taskSpec.constraints || [],
  };
}

module.exports = {
  planGameTask,
};
