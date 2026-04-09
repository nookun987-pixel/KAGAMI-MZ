"use strict";

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function readSpawnRateState() {
  return readJsonSafe(config.SPAWN_RATE_LIMITER_PATH, {
    generated_at: null,
    launches: [],
    failures: [],
    cooldown_until: null,
  });
}

function writeSpawnRateState(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.SPAWN_RATE_LIMITER_PATH, store);
}

function recent(items, windowMs, now) {
  return (items || []).filter((item) => (now - Number(item.at || 0)) < windowMs);
}

function evaluateSpawnRate(input = {}, now = Date.now()) {
  const store = readSpawnRateState();
  const launches = recent(store.launches, 60000, now);
  const failures = recent(store.failures, config.PROCESS_LIMITS.failure_cooldown_ms, now);
  if (store.cooldown_until && now < store.cooldown_until) {
    return { allowed: false, reason: "spawn_cooldown_active", cooldown_until: store.cooldown_until };
  }
  if (launches.length >= config.PROCESS_LIMITS.max_launches_per_minute) {
    return { allowed: false, reason: "spawn_rate_limit_exceeded" };
  }
  const visibleCmdLaunches = launches.filter((item) => item.visible_window && String(item.command || "").toLowerCase().includes("cmd"));
  if (input.visible_window && String(input.command || "").toLowerCase().includes("cmd") && visibleCmdLaunches.length >= config.PROCESS_LIMITS.max_visible_cmd_launches_per_minute) {
    return { allowed: false, reason: "visible_cmd_launch_rate_limit_exceeded" };
  }
  if (failures.length >= config.PROCESS_LIMITS.crash_loop_threshold) {
    return { allowed: false, reason: "spawn_failure_cooldown_needed" };
  }
  return { allowed: true, reason: "spawn_allowed" };
}

function recordSpawnLaunch(input = {}, now = Date.now()) {
  const store = readSpawnRateState();
  store.launches = recent(store.launches, 60000, now);
  store.launches.unshift({
    at: now,
    command: input.command || "",
    visible_window: Boolean(input.visible_window),
    owner_module: input.owner_module || "unknown",
  });
  writeSpawnRateState(store);
  return store;
}

function recordSpawnFailure(input = {}, now = Date.now()) {
  const store = readSpawnRateState();
  store.failures = recent(store.failures, config.PROCESS_LIMITS.failure_cooldown_ms, now);
  store.failures.unshift({
    at: now,
    command: input.command || "",
    owner_module: input.owner_module || "unknown",
    reason: input.reason || "spawn_failed",
  });
  if (store.failures.length >= config.PROCESS_LIMITS.crash_loop_threshold) {
    store.cooldown_until = now + config.PROCESS_LIMITS.failure_cooldown_ms;
  }
  writeSpawnRateState(store);
  return store;
}

module.exports = {
  readSpawnRateState,
  evaluateSpawnRate,
  recordSpawnLaunch,
  recordSpawnFailure,
};
