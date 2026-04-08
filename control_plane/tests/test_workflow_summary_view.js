"use strict";

const assert = require("assert");

const { appendLifecycleEvent } = require("../lifecycle_timeline_writer");
const { upsertWorkflowSummary, getWorkflowSummary } = require("../workflow_summary_view");

const workflowId = `wf_summary_${Date.now()}`;
const taskId = `task_summary_${Date.now()}`;
appendLifecycleEvent({
  workflow_id: workflowId,
  task_id: taskId,
  stage: "planned",
  status: "PASS",
  summary: "planned",
  artifact_refs: [],
});

upsertWorkflowSummary({
  workflow_id: workflowId,
  task_id: taskId,
  current_stage: "planned",
  approval_state: "pending",
  last_action: "repo.commit",
  latest_refs: [],
});

const summary = getWorkflowSummary(workflowId);
assert.strictEqual(summary.workflow_id, workflowId);
assert.strictEqual(summary.task_id, taskId);

console.log("PASS");
