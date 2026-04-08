"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SNAPSHOT_PATH = path.join(ROOT, "control_plane", "commander_bridge", "state", "system_runtime_snapshot.json");
const ENTRYPOINTS_PATH = path.join(ROOT, "state", "system_entrypoints.json");

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function readRuntimeStatus() {
  const snapshot = readJsonSafe(SNAPSHOT_PATH, {});
  const entrypoints = readJsonSafe(ENTRYPOINTS_PATH, {});
  return {
    machine_id: snapshot.machine_id || null,
    node_role: snapshot.node_role || null,
    active_runtime: snapshot.active_runtime || null,
    bridge_status: snapshot.bridge_status || null,
    agent_status: snapshot.agent_status || null,
    latest_completed_action: snapshot.latest_completed_action || null,
    system_entrypoints: entrypoints,
  };
}

module.exports = {
  readRuntimeStatus,
};
