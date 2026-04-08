"use strict";

const assert = require("assert");
const fs = require("fs");

const config = require("../control_plane/local_control_agent/config");
const service = require("../control_plane/commander_service");

for (const filePath of [config.APPROVAL_QUEUE_PATH, config.APPROVAL_QUEUE_HISTORY_JSONL]) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

(async () => {
  const blocked = await service.runWorkflow("SAFE_SHUTDOWN", {
    requested_by: "test_dashboard",
  });
  assert.strictEqual(blocked.status, "BLOCKED");
  assert.strictEqual(blocked.blocker_reason, "approval_required");
  assert.ok(blocked.approval_queue_id);

  const queue = service.getQueueStatus();
  assert.ok(Array.isArray(queue.approval_queue));
  assert.strictEqual(queue.approval_queue[0].id, blocked.approval_queue_id);

  const rejected = service.rejectWorkflow(blocked.approval_queue_id, "test_operator");
  assert.strictEqual(rejected.status, "BLOCKED");
  assert.strictEqual(rejected.blocker_reason, "rejected_by_operator");

  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
