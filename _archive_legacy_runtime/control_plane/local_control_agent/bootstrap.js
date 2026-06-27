"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const config = require("./config");
const { log } = require("./audit_logger");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function commandExists(command) {
  if (!command) return false;
  const probe = process.platform === "win32"
    ? spawnSync("where", [command], { stdio: "pipe", shell: true })
    : spawnSync("which", [command], { stdio: "pipe" });
  return probe.status === 0;
}

function runBootstrap() {
  ensureDir(config.STATE_ROOT);
  ensureDir(config.TASK_ROOT);
  ensureDir(config.LOG_ROOT);

  const snapshot = {
    ts: new Date().toISOString(),
    node_version: process.version,
    repo_root: config.REPO_ROOT,
    drive_root: config.DRIVE_ROOT,
    codex_command: config.CODEX_COMMAND,
    codex_available: commandExists(config.CODEX_COMMAND),
    drive_root_exists: fs.existsSync(config.DRIVE_ROOT),
    repo_root_exists: fs.existsSync(config.REPO_ROOT),
  };

  fs.writeFileSync(
    path.join(config.STATE_ROOT, "bootstrap_status.json"),
    JSON.stringify(snapshot, null, 2)
  );
  log("bootstrap.completed", snapshot);
  return snapshot;
}

module.exports = { runBootstrap };
