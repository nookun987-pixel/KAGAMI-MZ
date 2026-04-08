"use strict";

const assert = require("assert");

const {
  parseWorkflowCommand,
  parseApprovalCommand,
  buildTelegramHandlers,
} = require("../control_plane/telegram_operator");

assert.strictEqual(parseWorkflowCommand("/workflow wake_verify"), "WAKE_VERIFY");
assert.strictEqual(parseWorkflowCommand("/workflow daily_health"), "DAILY_HEALTH");
assert.strictEqual(parseWorkflowCommand("/status"), null);
assert.strictEqual(parseApprovalCommand("/approve abc123", "approve"), "abc123");
assert.strictEqual(parseApprovalCommand("/reject xyz789", "reject"), "xyz789");

const calls = [];
const service = {
  getStatus: async () => { calls.push("status"); return { status: "PASS" }; },
  getHealth: async () => { calls.push("health"); return { status: "PASS" }; },
  startAgent: async () => { calls.push("start"); return { status: "PASS" }; },
  stopAgent: async () => { calls.push("stop"); return { status: "PASS" }; },
  restartAgent: async () => { calls.push("restart"); return { status: "PASS" }; },
  runBridgeCommand: async (payload) => { calls.push(payload.action); return { status: "PASS", action: payload.action }; },
  approveWorkflow: async (id) => { calls.push(`approve:${id}`); return { status: "PASS", id }; },
  rejectWorkflow: async (id) => { calls.push(`reject:${id}`); return { status: "PASS", id }; },
  getQueueStatus: () => ({ approval_queue: [] }),
  getStatus: async () => ({ status: "PASS", workflow_history: [] }),
};

const handlers = buildTelegramHandlers(service);

assert.ok(handlers["/status"]);
assert.ok(handlers["/start_agent"]);
assert.ok(handlers["/stop_agent"]);
assert.ok(handlers["/restart_agent"]);
assert.ok(handlers["/health"]);
assert.ok(handlers["/repo"]);
assert.ok(handlers["/desk"]);
assert.ok(handlers["/snapshot"]);
assert.ok(handlers["/alerts"]);
assert.ok(handlers["/queue"]);
assert.ok(handlers["/history"]);

(async () => {
  await handlers["/repo"]();
  await handlers["/desk"]();
  await handlers["/snapshot"]();
  await handlers["/queue"]();
  await handlers["/history"]();
  assert.ok(calls.includes("repo.status"));
  assert.ok(calls.includes("desktop.capture_desktop_state"));
  assert.ok(calls.includes("system.snapshot"));
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
