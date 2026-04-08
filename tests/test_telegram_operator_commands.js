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
assert.strictEqual(parseApprovalCommand("/plan task_123", "plan"), "task_123");
assert.strictEqual(parseApprovalCommand("/retry failure_123", "retry"), "failure_123");
assert.strictEqual(parseApprovalCommand("/task task_999", "task"), "task_999");
assert.strictEqual(parseApprovalCommand("/audit task_888", "audit"), "task_888");
assert.strictEqual(parseApprovalCommand("/report wf_777", "report"), "wf_777");

const calls = [];
const service = {
  getStatus: async () => { calls.push("status"); return { status: "PASS", workflow_history: [], latest_task_runs: {} }; },
  getHealth: async () => { calls.push("health"); return { status: "PASS" }; },
  startAgent: async () => { calls.push("start"); return { status: "PASS" }; },
  stopAgent: async () => { calls.push("stop"); return { status: "PASS" }; },
  restartAgent: async () => { calls.push("restart"); return { status: "PASS" }; },
  runBridgeCommand: async (payload) => { calls.push(payload.action); return { status: "PASS", action: payload.action }; },
  approveApproval: async (id) => { calls.push(`approve:${id}`); return { status: "PASS", id }; },
  rejectApproval: async (id) => { calls.push(`reject:${id}`); return { status: "PASS", id }; },
  getTaskPlan: async (id) => { calls.push(`plan:${id}`); return { status: "PASS", id }; },
  getApprovalInbox: async () => { calls.push("approvals"); return { status: "PASS", approval_inbox: { pending: [] } }; },
  getFailureCenter: async () => { calls.push("failures"); return { status: "PASS", failure_center: { failures: [] } }; },
  getGovernanceSnapshotLatest: async () => { calls.push("snapshot"); return { status: "PASS", governance_snapshot: {} }; },
  getActivityFeedView: async () => { calls.push("feed"); return { status: "PASS", activity_feed: { items: [] } }; },
  retryFailureAction: async (id) => { calls.push(`retry:${id}`); return { status: "PASS", id }; },
  getTaskLifecycle: async (id) => { calls.push(`task:${id}`); return { status: "PASS", task_lifecycle: { task_id: id, events: [] } }; },
  getAuditTrailView: async (id) => { calls.push(`audit:${id}`); return { status: "PASS", audit_trail: { task_id: id, records: [] } }; },
  getWorkflowReport: async (id) => { calls.push(`report:${id}`); return { status: "PASS", report: { workflow_id: id } }; },
  getWorkflowSummaryView: async (id) => { calls.push(`workflow:${id}`); return { status: "PASS", workflow_summary: { workflow_id: id } }; },
  getQueueStatus: () => ({ approval_queue: [] }),
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
assert.ok(handlers["/approvals"]);
assert.ok(handlers["/failures"]);
assert.ok(handlers["/feed"]);
assert.ok(handlers["/queue"]);
assert.ok(handlers["/history"]);

(async () => {
  await handlers["/repo"]();
  await handlers["/desk"]();
  await handlers["/snapshot"]();
  await handlers["/approvals"]();
  await handlers["/failures"]();
  await handlers["/feed"]();
  await handlers["/queue"]();
  await handlers["/history"]();
  await service.getTaskPlan("task_123");
  await service.retryFailureAction("failure_123");
  await service.getTaskLifecycle("task_999");
  await service.getAuditTrailView("task_888");
  await service.getWorkflowReport("wf_777");
  await service.getWorkflowSummaryView("wf_summary");
  assert.ok(calls.includes("repo.status"));
  assert.ok(calls.includes("desktop.capture_desktop_state"));
  assert.ok(calls.includes("snapshot"));
  assert.ok(calls.includes("plan:task_123"));
  assert.ok(calls.includes("retry:failure_123"));
  assert.ok(calls.includes("task:task_999"));
  assert.ok(calls.includes("feed"));
  assert.ok(calls.includes("audit:task_888"));
  assert.ok(calls.includes("report:wf_777"));
  assert.ok(calls.includes("workflow:wf_summary"));
  console.log("PASS");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
