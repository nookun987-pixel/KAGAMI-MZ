"use strict";

const assert = require("assert");
const fs = require("fs");

const { createIntentFromFailure } = require("../intent_engine");
const { runGuardedAutonomyFromIntent } = require("../auto_agent_loop");
const { getAuditTrailByTask } = require("../audit_trail_store");
const { getActivityFeed } = require("../operator_activity_feed");

(async () => {
  const taskId = `task_guarded_${Date.now()}`;
  const intent = createIntentFromFailure({
    failure_id: `failure_guarded_${Date.now()}`,
    workflow_id: `task_${taskId}`,
    task_id: taskId,
    failure_code: "EXECUTION_FAILED",
    failure_stage: "bounded_executor",
    retryable: true,
  });

  const result = runGuardedAutonomyFromIntent(intent, {
    workflow_id: `task_${taskId}`,
    failure_fingerprint: `${intent.fingerprint}_unique`,
  });
  assert.strictEqual(result.status, "PASS");
  assert.ok(fs.existsSync(result.task.task_path));

  const audit = getAuditTrailByTask(result.task.task_id);
  assert.ok(Array.isArray(audit.records));

  const feed = getActivityFeed(20);
  assert.ok(feed.items.some((item) => item.event_type === "intent_created" && item.intent_id === intent.intent_id));
  assert.ok(feed.items.some((item) => item.event_type === "auto_task_generated" && item.intent_id === intent.intent_id));

  fs.unlinkSync(result.task.task_path);
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
