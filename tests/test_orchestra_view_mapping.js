"use strict";

const assert = require("assert");

const { FIXED_NODES, mapOrchestraState } = require("../control_plane/local_control_agent/orchestra_view");

assert.ok(FIXED_NODES.find((node) => node.id === "commander_api_server"));
assert.ok(FIXED_NODES.find((node) => node.id === "drive_queue"));
assert.ok(FIXED_NODES.find((node) => node.id === "memory"));

const mapped = mapOrchestraState({
  snapshot: {
    bridge_status: "ready",
    agent_status: "watching",
    blockers: ["approval_required"],
  },
  agent: {
    live: true,
    status: "running",
    pid: 1234,
    processes: [{}],
  },
  sessions: {
    user_session: { session_id: "user_1" },
    agent_session: { session_id: "agent_1" },
  },
  latest_report: {
    status: "PASS",
  },
  latest_workflow: {
    workflow: "DAILY_HEALTH",
    final_verdict: "BLOCKED",
    approval_state: "pending",
    execution_state: "blocked",
  },
  workflow_history: {
    latest_blocked_workflow: {
      workflow: "SAFE_SHUTDOWN",
      blocker_reason: "approval_required",
      requested_by: "dashboard",
    },
    runs: [
      {
        id: "wf_1",
        workflow: "DAILY_HEALTH",
        final_verdict: "BLOCKED",
        blocker_reason: "approval_required",
        requested_by: "dashboard",
        ended_at: "2026-04-08T10:00:00.000Z",
      },
    ],
  },
  approval_queue: {
    pending: [{ id: "ap_1" }],
  },
});

assert.strictEqual(mapped.current_workflow, "DAILY_HEALTH");
assert.strictEqual(mapped.verdict_board.verdict, "BLOCKED");
assert.ok(Array.isArray(mapped.timeline_feed));
assert.ok(mapped.timeline_feed.length > 0);
assert.strictEqual(mapped.latest_blocker.latest_blocked_workflow.blocker_reason, "approval_required");

const serviceNode = mapped.nodes.find((node) => node.id === "commander_service");
const bridgeNode = mapped.nodes.find((node) => node.id === "commander_bridge");
const decisionNode = mapped.nodes.find((node) => node.id === "decision");
assert.strictEqual(serviceNode.state, "blocked");
assert.strictEqual(bridgeNode.state, "listening");
assert.strictEqual(decisionNode.state, "blocked");

assert.ok(mapped.edges.some((edge) => edge.active));

console.log("PASS");
