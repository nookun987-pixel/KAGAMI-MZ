"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { readSpawnRegistry, updateSpawn } = require("./spawn_registry");
const { readSpawnRateState } = require("./spawn_rate_limiter");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readProcessIncidents() {
  return readJsonSafe(config.PROCESS_INCIDENT_REGISTRY_PATH, {
    generated_at: null,
    incidents: [],
  });
}

function writeProcessIncidents(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.PROCESS_INCIDENT_REGISTRY_PATH, store);
}

function recordIncident(input) {
  const store = readProcessIncidents();
  const fingerprint = input.fingerprint || crypto.createHash("sha256").update(JSON.stringify({
    incident_type: input.incident_type,
    owner_module: input.owner_module || null,
    process_id: input.process_id || null,
    reason: input.reason || null,
  })).digest("hex");
  const existing = (store.incidents || []).find((item) => item.fingerprint === fingerprint);
  if (existing) {
    existing.count = Number(existing.count || 1) + 1;
    existing.last_seen_at = new Date().toISOString();
    existing.reason = input.reason || existing.reason;
    existing.refs = input.refs || existing.refs || [];
    writeProcessIncidents(store);
    appendJsonl(config.PROCESS_INCIDENT_HISTORY_JSONL, { type: "update", incident: existing });
    return existing;
  }
  const incident = {
    incident_id: input.incident_id || `incident_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    incident_type: input.incident_type,
    owner_module: input.owner_module || "unknown",
    process_id: input.process_id || null,
    reason: input.reason || "",
    refs: input.refs || [],
    requires_operator_review: input.requires_operator_review !== false,
    count: 1,
    first_seen_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    fingerprint,
  };
  store.incidents = Array.isArray(store.incidents) ? store.incidents : [];
  store.incidents.unshift(incident);
  store.incidents = store.incidents.slice(0, 200);
  writeProcessIncidents(store);
  appendJsonl(config.PROCESS_INCIDENT_HISTORY_JSONL, { type: "new", incident });
  const artifactPath = path.join(config.WATCHDOG_ACTION_DIR, `${incident.incident_id}.process_incident.json`);
  writeJson(artifactPath, incident);
  return incident;
}

function writeWatchdogAction(action) {
  const record = {
    action_id: `watchdog_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    generated_at: new Date().toISOString(),
    ...action,
  };
  const filePath = path.join(config.WATCHDOG_ACTION_DIR, `${record.action_id}.watchdog_action.json`);
  writeJson(filePath, record);
  return { record, file_path: filePath };
}

function runWatchdog(now = Date.now()) {
  const incidents = [];
  const registry = readSpawnRegistry();
  const rate = readSpawnRateState();
  const launches = (rate.launches || []).filter((item) => (now - Number(item.at || 0)) < 60000);
  if (launches.length > config.PROCESS_LIMITS.max_launches_per_minute) {
    incidents.push(recordIncident({
      incident_type: "SPAWN_STORM",
      owner_module: "process_governor",
      reason: "launches_per_minute_exceeded",
    }));
  }
  const running = (registry.processes || []).filter((item) => item.status === "RUNNING");
  for (const proc of running) {
    if (proc.started_at && (now - new Date(proc.started_at).getTime()) > config.PROCESS_LIMITS.stale_running_ms) {
      incidents.push(recordIncident({
        incident_type: "ZOMBIE_ORPHAN_CHILD",
        owner_module: proc.owner_module,
        process_id: proc.process_id,
        reason: "stale_running_process",
      }));
      updateSpawn(proc.process_id, { status: "EXPIRED", failure_reason: "watchdog_stale_process" });
      writeWatchdogAction({
        action: "expire_process",
        process_id: proc.process_id,
        reason: "stale_running_process",
      });
    }
  }
  return {
    status: "PASS",
    incidents,
    incident_count: incidents.length,
  };
}

module.exports = {
  readProcessIncidents,
  recordIncident,
  writeWatchdogAction,
  runWatchdog,
};
