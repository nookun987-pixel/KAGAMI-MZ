"use strict";

const assert = require("assert");

const { appendLifecycleEvent, readTaskLifecycle } = require("../lifecycle_timeline_writer");

appendLifecycleEvent({
  workflow_id: "wf_lifecycle",
  task_id: "task_lifecycle",
  stage: "task_received",
  status: "PASS",
  summary: "received",
  artifact_refs: [],
});
appendLifecycleEvent({
  workflow_id: "wf_lifecycle",
  task_id: "task_lifecycle",
  stage: "planned",
  status: "PASS",
  summary: "planned",
  artifact_refs: [],
});

const lifecycle = readTaskLifecycle("task_lifecycle");
assert.ok(lifecycle.events.length >= 2);

console.log("PASS");
