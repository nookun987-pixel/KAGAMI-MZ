"use strict";

const fs = require("fs");
const path = require("path");
const config = require("./config");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureBridgeDirs() {
  for (const dir of [
    config.BRIDGE_ROOT,
    config.INBOX_DIR,
    config.OUTBOX_DIR,
    config.STATE_DIR,
    config.LOGS_DIR,
    config.ARCHIVE_DIR,
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listInboxCommands() {
  ensureBridgeDirs();
  return fs.readdirSync(config.INBOX_DIR)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .sort()
    .map((name) => {
      const filePath = path.join(config.INBOX_DIR, name);
      return { name, filePath, payload: readJson(filePath) };
    });
}

function readNextCommand() {
  const commands = listInboxCommands();
  return commands.length ? commands[0] : null;
}

module.exports = {
  ensureBridgeDirs,
  listInboxCommands,
  readNextCommand,
};
