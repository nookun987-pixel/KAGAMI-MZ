"use strict";

const assert = require("assert");

const { appendActivityFeed, getActivityFeed } = require("../operator_activity_feed");

const workflowId = `wf_feed_${Date.now()}`;
appendActivityFeed({
  workflow_id: workflowId,
  task_id: "task_feed",
  event_type: "task_created",
  short_text: "task created",
  severity: "info",
  refs: [],
});

const feed = getActivityFeed(10);
assert.ok(feed.items.some((item) => item.workflow_id === workflowId));

console.log("PASS");
