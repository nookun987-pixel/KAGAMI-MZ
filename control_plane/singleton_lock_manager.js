"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function readSingletonLocks() {
  return readJsonSafe(config.SINGLETON_LOCKS_PATH, {
    generated_at: null,
    locks: {},
  });
}

function writeSingletonLocks(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.SINGLETON_LOCKS_PATH, store);
}

function acquireSingletonLock(key, value = {}) {
  const normalizedKey = String(key || "").trim();
  if (!normalizedKey) {
    return { acquired: false, reason: "missing_singleton_key" };
  }
  const store = readSingletonLocks();
  store.locks = store.locks || {};
  if (store.locks[normalizedKey]) {
    return {
      acquired: false,
      reason: "singleton_already_locked",
      existing: store.locks[normalizedKey],
    };
  }
  const record = {
    key: normalizedKey,
    owner_module: value.owner_module || "unknown",
    task_id: value.task_id || null,
    workflow_id: value.workflow_id || null,
    process_id: value.process_id || null,
    created_at: new Date().toISOString(),
  };
  store.locks[normalizedKey] = record;
  writeSingletonLocks(store);
  return { acquired: true, lock: record };
}

function releaseSingletonLock(key, processId = null) {
  const normalizedKey = String(key || "").trim();
  const store = readSingletonLocks();
  store.locks = store.locks || {};
  const existing = store.locks[normalizedKey];
  if (!existing) return false;
  if (processId && existing.process_id && existing.process_id !== processId) return false;
  delete store.locks[normalizedKey];
  writeSingletonLocks(store);
  return true;
}

module.exports = {
  readSingletonLocks,
  acquireSingletonLock,
  releaseSingletonLock,
};
