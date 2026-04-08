"use strict";

const STATES = [
  "pending",
  "planned",
  "awaiting_approval",
  "approved",
  "executing",
  "done",
  "blocked",
  "failed",
];

const TRANSITIONS = {
  pending: new Set(["planned", "blocked", "failed"]),
  planned: new Set(["awaiting_approval", "approved", "executing", "blocked", "failed"]),
  awaiting_approval: new Set(["approved", "blocked", "failed"]),
  approved: new Set(["executing", "blocked", "failed"]),
  executing: new Set(["done", "blocked", "failed"]),
  done: new Set([]),
  blocked: new Set([]),
  failed: new Set([]),
};

function createExecutionStateRecord(input) {
  return {
    task_id: input.task_id,
    action: input.action,
    state: "pending",
    requested_by: input.requested_by || "local_control_agent",
    approval_status: input.approval_status || "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    history: [
      {
        state: "pending",
        at: new Date().toISOString(),
        note: "task_received",
      },
    ],
  };
}

function transitionExecutionState(record, nextState, details = {}) {
  if (!STATES.includes(nextState)) {
    throw new Error(`invalid_state:${nextState}`);
  }
  const allowed = TRANSITIONS[record.state] || new Set();
  if (!allowed.has(nextState)) {
    throw new Error(`invalid_transition:${record.state}->${nextState}`);
  }
  const entry = {
    state: nextState,
    at: new Date().toISOString(),
    ...details,
  };
  return {
    ...record,
    state: nextState,
    updated_at: entry.at,
    history: [...(record.history || []), entry],
  };
}

module.exports = {
  STATES,
  createExecutionStateRecord,
  transitionExecutionState,
};
