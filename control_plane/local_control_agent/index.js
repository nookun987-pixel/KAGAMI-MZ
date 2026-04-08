"use strict";

const fs = require("fs");
const path = require("path");
const { ensureBridgeDirs, readNextCommand, listInboxCommands } = require("./bridge_reader");
const { updatePendingActions } = require("./bridge_writer");
const snapshotWriter = require("./snapshot_writer");
const { runAutoAgentLoop } = require("../auto_agent_loop");

async function processCommand(commandEntry) {
  return runAutoAgentLoop(commandEntry);
}

async function runOnce() {
  ensureBridgeDirs();
  const pending = listInboxCommands().map((entry) => ({
    command_id: entry.payload.command_id,
    action: entry.payload.action,
    file: entry.name,
  }));
  updatePendingActions(pending);
  const next = readNextCommand();
  if (!next) {
    updatePendingActions([]);
    snapshotWriter.writeSnapshot({ agent_status: "idle" });
    return null;
  }
  const result = await processCommand(next);
  const remaining = listInboxCommands().map((entry) => ({
    command_id: entry.payload.command_id,
    action: entry.payload.action,
    file: entry.name,
  }));
  updatePendingActions(remaining);
  snapshotWriter.writeSnapshot({ agent_status: "idle" });
  return result;
}

async function startAgent(options = {}) {
  ensureBridgeDirs();
  if (options.once) return runOnce();
  snapshotWriter.writeSnapshot({ bridge_status: "watching", agent_status: "watching" });
  setInterval(() => {
    runOnce().catch((error) => {
      logAudit({ action: "agent.loop", status: "FAIL", reason: error.message });
    });
  }, options.pollIntervalMs || 3000);
  return { started: true };
}

if (require.main === module) {
  const once = process.argv.includes("--once");
  startAgent({ once }).then((result) => {
    if (once) {
      console.log(JSON.stringify(result || { status: "PASS", action: "idle", next: "wait_for_inbox" }, null, 2));
    }
  }).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  runOnce,
  startAgent,
  processCommand,
};
