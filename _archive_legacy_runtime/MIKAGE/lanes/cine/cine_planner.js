"use strict";

function planCineTask(taskSpec) {
  return {
    lane: "cine",
    job_id: taskSpec.job_id,
    beats: [taskSpec.objective],
    constraints: taskSpec.constraints || [],
  };
}

module.exports = {
  planCineTask,
};
