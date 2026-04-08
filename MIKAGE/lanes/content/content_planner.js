"use strict";

function planContentTask(taskSpec) {
  return {
    lane: "content",
    job_id: taskSpec.job_id,
    brief: taskSpec.objective,
    constraints: taskSpec.constraints || [],
  };
}

module.exports = {
  planContentTask,
};
