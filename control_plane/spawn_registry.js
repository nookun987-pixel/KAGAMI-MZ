"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readSpawnRegistry() {
  return readJsonSafe(config.SPAWN_REGISTRY_PATH, {
    generated_at: null,
    processes: [],
  });
}

function writeSpawnRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.SPAWN_REGISTRY_PATH, store);
}

function normalizeRecord(input) {
  return {
    process_id: input.process_id || `proc_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    task_id: input.task_id || null,
    workflow_id: input.workflow_id || null,
    command: String(input.command || "").trim(),
    args: Array.isArray(input.args) ? input.args.map((item) => String(item)) : [],
    started_at: input.started_at || new Date().toISOString(),
    status: input.status || "PENDING",
    owner_module: input.owner_module || "unknown",
    visible_window: Boolean(input.visible_window),
    kill_policy: input.kill_policy || "timeout_kill",
    pid: Number(input.pid || 0) || null,
    timeout_ms: Number(input.timeout_ms || 0) || null,
    detached: Boolean(input.detached),
    exit_code: input.exit_code ?? null,
    ended_at: input.ended_at || null,
    stdout_preview: input.stdout_preview || "",
    stderr_preview: input.stderr_preview || "",
    failure_reason: input.failure_reason || null,
    singleton_key: input.singleton_key || null,
  };
}

function registerSpawn(input) {
  const store = readSpawnRegistry();
  const record = normalizeRecord(input);
  store.processes = Array.isArray(store.processes) ? store.processes : [];
  store.processes.unshift(record);
  store.processes = store.processes.slice(0, 500);
  writeSpawnRegistry(store);
  appendJsonl(config.SPAWN_REGISTRY_HISTORY_JSONL, { type: "register", record });
  return record;
}

function updateSpawn(processId, patch = {}) {
  const store = readSpawnRegistry();
  const index = (store.processes || []).findIndex((item) => item.process_id === processId);
  if (index === -1) return null;
  const next = {
    ...store.processes[index],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  store.processes[index] = next;
  writeSpawnRegistry(store);
  appendJsonl(config.SPAWN_REGISTRY_HISTORY_JSONL, { type: "update", process_id: processId, patch });
  return next;
}

function listActiveProcesses() {
  const store = readSpawnRegistry();
  return {
    generated_at: store.generated_at || null,
    processes: (store.processes || []).filter((item) => ["PENDING", "DISPATCHED", "RUNNING"].includes(String(item.status || "").toUpperCase())),
  };
}

function listAllProcesses(limit = 100) {
  const store = readSpawnRegistry();
  return {
    generated_at: store.generated_at || null,
    processes: (store.processes || []).slice(0, limit),
  };
}

module.exports = {
  readSpawnRegistry,
  writeSpawnRegistry,
  registerSpawn,
  updateSpawn,
  listActiveProcesses,
  listAllProcesses,
};
