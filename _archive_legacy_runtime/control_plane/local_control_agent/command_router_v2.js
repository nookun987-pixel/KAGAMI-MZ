"use strict";

const fs = require("fs");
const path = require("path");
const { createTask } = require("./task_writer");
const repo = require("./repo_manager");
const { runCodex } = require("./codex_dispatcher");
const { health } = require("./runtime_operator");
const { runSmartDiskScan } = require("./smart_disk_scan");
const { approveAndCleanSafe } = require("./approve_cleanup");
const { STATE_ROOT } = require("./config");

function readLatestScanReport() {
  const file = path.join(STATE_ROOT, "smart_disk_scan_report.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

async function handle(command) {
  const cmd = String(command || "").trim();

  if (cmd === "repo status") return repo.status();
  if (cmd.startsWith("repo commit")) {
    repo.commit(cmd.replace("repo commit", "").trim());
    return "committed";
  }
  if (cmd === "repo push") {
    repo.push();
    return "pushed";
  }
  if (cmd === "runtime health") return health();
  if (cmd.startsWith("build ")) {
    const task = createTask(cmd);
    return runCodex(task);
  }
  if (cmd.startsWith("disk smart scan")) {
    const target = cmd.replace("disk smart scan", "").trim() || "C:\\";
    return runSmartDiskScan(target);
  }
  if (cmd === "disk latest report") return readLatestScanReport() || { error: "NO_SCAN_REPORT" };
  if (cmd === "disk approve safe clean") return approveAndCleanSafe();
  if (cmd === "disk auto clean") return approveAndCleanSafe();

  return { error: "unknown command", command: cmd };
}

module.exports = { handle, readLatestScanReport };
