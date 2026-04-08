"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BRIDGE_ROOT = path.join(ROOT, "control_plane", "commander_bridge");

function ensureBridgeFolders() {
  for (const dir of ["inbox", "outbox", "state", "logs", "archive"]) {
    fs.mkdirSync(path.join(BRIDGE_ROOT, dir), { recursive: true });
  }
}

function resetBridge() {
  ensureBridgeFolders();
  for (const dir of ["inbox", "outbox", "archive", "logs"]) {
    const full = path.join(BRIDGE_ROOT, dir);
    for (const name of fs.readdirSync(full)) {
      fs.rmSync(path.join(full, name), { recursive: true, force: true });
    }
  }
}

function writeInboxCommand(command) {
  ensureBridgeFolders();
  const filePath = path.join(BRIDGE_ROOT, "inbox", `${command.command_id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(command, null, 2), "utf8");
  return filePath;
}

function readLatestOutboxJson() {
  const outboxDir = path.join(BRIDGE_ROOT, "outbox");
  const files = fs.readdirSync(outboxDir).filter((name) => name.endsWith(".json")).sort();
  if (!files.length) return null;
  return JSON.parse(fs.readFileSync(path.join(outboxDir, files[files.length - 1]), "utf8"));
}

module.exports = {
  ROOT,
  BRIDGE_ROOT,
  resetBridge,
  writeInboxCommand,
  readLatestOutboxJson,
};
