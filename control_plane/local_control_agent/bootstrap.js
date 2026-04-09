"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");
const { log } = require("./audit_logger");
const { governedSpawnSync } = require("../process_governor");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function commandExists(command) {
  if (!command) return false;
  const probe = process.platform === "win32"
    ? governedSpawnSync({ command: "where", args: [command], shell: true, owner_module: "bootstrap", timeout_ms: 5000, rate_limit_exempt: true })
    : governedSpawnSync({ command: "which", args: [command], owner_module: "bootstrap", timeout_ms: 5000, rate_limit_exempt: true });
  return probe.status === "PASS";
}

function runBootstrap() {
  ensureDir(config.STATE_DIR);
  ensureDir(config.TASKS_DIR);
  ensureDir(config.LOGS_DIR);

  const snapshot = {
    ts: new Date().toISOString(),
    node_version: process.version,
    repo_root: config.ROOT,
    drive_root: "G:\\My Drive\\mikage_runner",
    codex_command: "node",
    codex_available: commandExists("node"),
    drive_root_exists: fs.existsSync("G:\\My Drive\\mikage_runner"),
    repo_root_exists: fs.existsSync(config.ROOT),
  };

  fs.writeFileSync(
    path.join(config.STATE_DIR, "bootstrap_status.json"),
    JSON.stringify(snapshot, null, 2)
  );
  log("bootstrap.completed", snapshot);
  return snapshot;
}

module.exports = { runBootstrap };
