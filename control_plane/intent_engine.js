"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readIntentRegistry() {
  return readJsonSafe(config.INTENT_REGISTRY_PATH, {
    generated_at: null,
    intents: [],
  });
}

function writeIntentRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.INTENT_REGISTRY_PATH, store);
}

function buildIntentFingerprint(payload) {
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function recordIntent(intent) {
  const store = readIntentRegistry();
  store.intents = Array.isArray(store.intents) ? store.intents : [];
  store.intents.unshift(intent);
  store.intents = store.intents.slice(0, 300);
  writeIntentRegistry(store);
  appendJsonl(config.INTENT_HISTORY_JSONL, intent);
  return intent;
}

function createIntentBase(source, goal, constraints, riskLevel, extra = {}) {
  const payload = {
    source,
    goal,
    constraints,
    risk_level: riskLevel,
    refs: extra.refs || [],
    source_ref: extra.source_ref || null,
    task_id: extra.task_id || null,
    workflow_id: extra.workflow_id || null,
    depth: Number(extra.depth || 1),
  };
  const intent = {
    intent_id: `intent_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    ...payload,
    fingerprint: buildIntentFingerprint(payload),
    created_at: new Date().toISOString(),
  };
  return recordIntent(intent);
}

function createIntentFromFailure(failure, extra = {}) {
  return createIntentBase(
    "failure",
    `Resolve ${failure.failure_code}`,
    {
      failure_code: failure.failure_code,
      failure_stage: failure.failure_stage,
      retryable: !!failure.retryable,
      bounded_scope: ["tasks_only", "no_runtime_mutation"],
    },
    failure.failure_code === "UNKNOWN_BLOCKED" ? "high" : "medium",
    {
      refs: [failure.report_ref, failure.command_ref].filter(Boolean),
      source_ref: failure.failure_id,
      task_id: failure.task_id,
      workflow_id: failure.workflow_id,
      depth: extra.depth || 1,
    }
  );
}

function createIntentFromRetry(retryEntry, extra = {}) {
  return createIntentBase(
    "retry",
    `Prepare guarded retry follow-up for ${retryEntry.failure_id}`,
    {
      retry_count: retryEntry.retry_count,
      staged_retry_marker: retryEntry.staged_retry_marker,
      bounded_scope: ["tasks_only", "approval_preserved"],
    },
    "medium",
    {
      refs: [retryEntry.failure_id],
      source_ref: retryEntry.retry_id,
      task_id: retryEntry.task_id,
      workflow_id: extra.workflow_id || `task_${retryEntry.task_id}`,
      depth: extra.depth || 1,
    }
  );
}

function createIntentFromCompletion(summary, extra = {}) {
  return createIntentBase(
    "completion",
    `Review completed workflow ${summary.workflow_id || summary.task_id || "task"}`,
    {
      completion_status: summary.status || "PASS",
      bounded_scope: ["tasks_only", "read_followup"],
    },
    "low",
    {
      refs: summary.refs || [],
      source_ref: summary.workflow_id || null,
      task_id: summary.task_id || null,
      workflow_id: summary.workflow_id || null,
      depth: extra.depth || 1,
    }
  );
}

function createIntentFromOperatorHint(hint, extra = {}) {
  return createIntentBase(
    "operator_hint",
    hint.goal || "Operator follow-up",
    {
      hint: hint.hint || "",
      bounded_scope: ["tasks_only", "approval_preserved"],
    },
    hint.risk_level || "medium",
    {
      refs: hint.refs || [],
      source_ref: hint.source_ref || null,
      task_id: hint.task_id || null,
      workflow_id: hint.workflow_id || null,
      depth: extra.depth || 1,
    }
  );
}

module.exports = {
  readIntentRegistry,
  createIntentFromFailure,
  createIntentFromRetry,
  createIntentFromCompletion,
  createIntentFromOperatorHint,
};
