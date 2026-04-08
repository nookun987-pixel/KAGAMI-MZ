"use strict";

const { handle } = require("./local_control_agent/command_router");
const fs = require("fs");
const path = require("path");

function writeSnapshot(data) {
  const file = path.join(__dirname, "local_control_agent", "state", "commander_snapshot.json");
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function runReviewedOperator(intent) {
  const start = Date.now();

  // 1. validate intent (basic)
  if (!intent || !intent.command) {
    throw new Error("Invalid intent");
  }

  // 2. preview
  const preview = {
    command: intent.command,
    ts: new Date().toISOString()
  };

  // 3. (approval assumed external)

  // 4. execute
  const result = await handle(intent.command);

  // 5. report
  const report = {
    intent,
    result,
    duration_ms: Date.now() - start
  };

  // 6. snapshot
  writeSnapshot({
    last_action: intent.command,
    last_operator: "reviewed_operator",
    approval_status: "assumed",
    changed_files: []
  });

  return report;
}

module.exports = { runReviewedOperator };