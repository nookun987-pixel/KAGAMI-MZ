"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const required = [
  "control_plane/commander_bridge/BRIDGE_CONTRACT.md",
  "control_plane/commander_bridge/bridge_schema.json",
  "control_plane/commander_bridge/approval_policy.json",
  "control_plane/commander_bridge/state/system_runtime_snapshot.json",
  "control_plane/commander_bridge/state/latest_agent_report.json",
  "control_plane/commander_bridge/state/pending_actions.json",
  "control_plane/local_control_agent/config.js",
  "control_plane/local_control_agent/index.js",
  "control_plane/local_control_agent/command_router.js",
  "control_plane/local_control_agent/bridge_reader.js",
  "control_plane/local_control_agent/bridge_writer.js",
  "control_plane/local_control_agent/audit_logger.js",
  "control_plane/local_control_agent/repo_manager.js",
  "control_plane/local_control_agent/runtime_operator.js",
  "control_plane/local_control_agent/disk_maintenance_agent.js",
  "control_plane/local_control_agent/codex_dispatcher.js",
  "control_plane/local_control_agent/approval_gate.js",
  "control_plane/local_control_agent/system_map_guard.js",
  "control_plane/local_control_agent/snapshot_writer.js",
  "start_commander_bridge.cmd"
];

for (const relative of required) {
  assert.ok(fs.existsSync(path.join(ROOT, relative)), `missing file: ${relative}`);
}

console.log("PASS");
