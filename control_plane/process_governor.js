"use strict";

const config = require("./local_control_agent/config");
const { registerSpawn, updateSpawn, listActiveProcesses, listAllProcesses } = require("./spawn_registry");
const { acquireSingletonLock, releaseSingletonLock, readSingletonLocks } = require("./singleton_lock_manager");
const { evaluateSpawnRate, recordSpawnLaunch, recordSpawnFailure, readSpawnRateState } = require("./spawn_rate_limiter");
const { recordIncident, runWatchdog, readProcessIncidents } = require("./process_watchdog");
const { runSpawnSync, runSpawn, runExecFileSync } = require("./safe_spawn_wrapper");
const { writeJson } = require("./local_control_agent/bridge_writer");

function normalizeRequest(input = {}) {
  return {
    command: input.command,
    args: Array.isArray(input.args) ? input.args : [],
    input: Object.prototype.hasOwnProperty.call(input, "input") ? input.input : undefined,
    cwd: input.cwd || config.ROOT,
    timeout_ms: Number(input.timeout_ms || config.PROCESS_LIMITS.default_timeout_ms),
    windowsHide: input.windowsHide !== false,
    visible_window: Boolean(input.visible_window),
    detached: Boolean(input.detached),
    wait_for_exit: input.wait_for_exit !== false,
    shell: Boolean(input.shell),
    rate_limit_exempt: Boolean(input.rate_limit_exempt),
    owner_module: input.owner_module || "unknown",
    task_id: input.task_id || null,
    workflow_id: input.workflow_id || null,
    kill_policy: input.kill_policy || "timeout_kill",
    singleton_key: input.singleton_key || null,
  };
}

function blockSpawn(reason, request, existing = null) {
  const incident = recordIncident({
    incident_type: "SPAWN_BLOCKED",
    owner_module: request.owner_module,
    reason,
    refs: [request.singleton_key, existing && existing.process_id].filter(Boolean),
  });
  return {
    status: "BLOCKED",
    reason,
    incident,
  };
}

function preflight(request) {
  const active = listActiveProcesses().processes || [];
  if (active.length >= config.PROCESS_LIMITS.max_concurrent_children) {
    return blockSpawn("max_concurrent_children_exceeded", request);
  }
  if (!request.rate_limit_exempt) {
    const rate = evaluateSpawnRate(request);
    if (!rate.allowed) return blockSpawn(rate.reason, request);
  }
  if (request.singleton_key) {
    const lock = acquireSingletonLock(request.singleton_key, {
      owner_module: request.owner_module,
      task_id: request.task_id,
      workflow_id: request.workflow_id,
    });
    if (!lock.acquired) return blockSpawn(lock.reason, request, lock.existing);
    return { status: "PASS", lock };
  }
  return { status: "PASS", lock: null };
}

function finalize(processRecord, request, result, lock = null) {
  const nextStatus = result.status === "PASS"
    ? (result.running ? "RUNNING" : "SUCCEEDED")
    : (result.timed_out ? "FAILED" : "FAILED");
  const updated = updateSpawn(processRecord.process_id, {
    status: nextStatus,
    pid: result.pid || processRecord.pid || null,
    exit_code: result.exit_code,
    ended_at: result.running ? null : new Date().toISOString(),
    stdout_preview: result.stdout_preview || "",
    stderr_preview: result.stderr_preview || "",
    failure_reason: result.status === "PASS" ? null : (result.error || result.stderr_preview || "spawn_failed"),
  });
  if (result.status !== "PASS") {
    recordSpawnFailure({
      command: request.command,
      owner_module: request.owner_module,
      reason: result.error || "spawn_failed",
    });
    if (result.timed_out) {
      recordIncident({
        incident_type: "PROCESS_TIMEOUT",
        owner_module: request.owner_module,
        process_id: processRecord.process_id,
        reason: "spawn_timeout",
      });
    }
  }
  if (lock && !result.running) {
    releaseSingletonLock(request.singleton_key, processRecord.process_id);
  }
  const watchdog = runWatchdog();
  writeJson(config.PROCESS_GOVERNOR_STATE_PATH, {
    generated_at: new Date().toISOString(),
    last_process: updated,
    watchdog,
  });
  return {
    status: result.status,
    process: updated,
    result,
    watchdog,
  };
}

function governedSpawnSync(input = {}) {
  const request = normalizeRequest(input);
  const pre = preflight(request);
  if (pre.status !== "PASS") return pre;
  recordSpawnLaunch(request);
  const processRecord = registerSpawn({
    ...request,
    status: "RUNNING",
  });
  const result = runSpawnSync(request);
  return finalize(processRecord, request, result, pre.lock);
}

function governedExecFileSync(input = {}) {
  const request = normalizeRequest(input);
  const pre = preflight(request);
  if (pre.status !== "PASS") return pre;
  recordSpawnLaunch(request);
  const processRecord = registerSpawn({
    ...request,
    status: "RUNNING",
  });
  const result = runExecFileSync(request);
  return finalize(processRecord, request, result, pre.lock);
}

async function governedSpawn(input = {}) {
  const request = normalizeRequest(input);
  const pre = preflight(request);
  if (pre.status !== "PASS") return pre;
  recordSpawnLaunch(request);
  const processRecord = registerSpawn({
    ...request,
    status: request.wait_for_exit === false ? "DISPATCHED" : "RUNNING",
  });
  const result = await runSpawn(request);
  const finalized = finalize(processRecord, request, result, pre.lock);
  if (result.running && request.singleton_key) {
    updateSpawn(processRecord.process_id, { status: "RUNNING", pid: result.pid || null });
  }
  return finalized;
}

function releaseGovernorLock(singletonKey, processId = null) {
  return releaseSingletonLock(singletonKey, processId);
}

function getGovernorStatus(limit = 100) {
  return {
    status: "PASS",
    active_processes: listActiveProcesses(),
    recent_processes: listAllProcesses(limit),
    incidents: readProcessIncidents(),
    locks: readSingletonLocks(),
    rate_limiter: readSpawnRateState(),
  };
}

module.exports = {
  governedSpawnSync,
  governedExecFileSync,
  governedSpawn,
  releaseGovernorLock,
  getGovernorStatus,
};
