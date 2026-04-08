"use strict";

const { writeReport, archiveCommand } = require("./local_control_agent/bridge_writer");

function buildAgentReport(command, stateRecord, details = {}) {
  return {
    command_id: command.command_id,
    action: command.action,
    task_id: stateRecord.task_id,
    status: details.status,
    files: details.files || [],
    risk: details.risk || "none",
    next: details.next || "none",
    created_at: new Date().toISOString(),
    result: {
      state_record: stateRecord,
      ...details.result,
    },
  };
}

function writeActionReport(commandEntry, command, stateRecord, details) {
  const report = buildAgentReport(command, stateRecord, details);
  const resultPaths = writeReport(report);
  const archivePath = archiveCommand(commandEntry.filePath, command, resultPaths);
  return {
    report,
    resultPaths,
    archivePath,
  };
}

module.exports = {
  buildAgentReport,
  writeActionReport,
};
