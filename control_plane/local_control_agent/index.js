"use strict";

const fs = require("fs");
const path = require("path");
const { ensureBridgeDirs, readNextCommand, listInboxCommands } = require("./bridge_reader");
const { writeReport, archiveCommand, updatePendingActions } = require("./bridge_writer");
const { logAudit } = require("./audit_logger");
const { evaluateApproval } = require("./approval_gate");
const { analyzeWriteTargets, protectedDeleteCheck } = require("./system_map_guard");
const { routeCommand } = require("./command_router");
const snapshotWriter = require("./snapshot_writer");
const config = require("./config");

function readApprovalModel() {
  return JSON.parse(fs.readFileSync(config.APPROVAL_MODEL, "utf8"));
}

function buildReport(command, status, details = {}) {
  return {
    command_id: command.command_id,
    action: command.action,
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    status,
    files: details.files || [],
    risk: details.risk || "none",
    next: details.next || "none",
    created_at: new Date().toISOString(),
    result: details.result || null,
  };
}

function isReviewedAction(action) {
  return [
    "repo.commit",
    "repo.push",
    "repo.reviewed_commit_push",
    "disk.safe_clean",
    "codex.build_task",
    "desktop.run_shell",
    "desktop.send_keys",
    "desktop.type_text",
    "desktop.basic_click",
  ].includes(action);
}

function extractTouchedFiles(command) {
  const touched = [];
  if (Array.isArray(command.payload && command.payload.files)) {
    for (const filePath of command.payload.files) {
      touched.push(path.resolve(config.ROOT, filePath));
    }
  }
  if (Array.isArray(command.payload && command.payload.targets)) {
    for (const target of command.payload.targets) {
      if (target && target.path) touched.push(String(target.path));
    }
  }
  return touched;
}

async function processCommand(commandEntry) {
  const command = commandEntry.payload;
  const approvalModel = readApprovalModel();
  const touchedFiles = extractTouchedFiles(command);
  const systemImpact = analyzeWriteTargets(touchedFiles);
  if (command.action === "disk.safe_clean") {
    const deleteBlock = protectedDeleteCheck(touchedFiles);
    if (deleteBlock) systemImpact.hard_block_reason = deleteBlock;
  }

  const reviewedRepoActions = ((approvalModel.node_role_policy || {}).reviewed_repo_actions) || [];
  const supportOverrideRequired = !!((approvalModel.node_role_policy || {}).support_node_requires_explicit_override);
  if (!config.NODE_ROLE.permissions.reviewed_repo_mutation && reviewedRepoActions.includes(command.action)) {
    const explicitOverride = !!(command.payload && command.payload.explicit_support_override);
    if (!supportOverrideRequired || !explicitOverride) {
      const blockedReport = buildReport(command, "BLOCKED", {
        files: touchedFiles,
        risk: "node_role_blocks_reviewed_repo_mutation",
        next: "use_commander_node_or_explicit_override",
        result: {
          machine_id: config.MACHINE_PROFILE.machine_id,
          node_role: config.NODE_ROLE.role_id,
        },
      });
      const resultPaths = writeReport(blockedReport);
      archiveCommand(commandEntry.filePath, command, resultPaths);
      logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: "node_role_blocks_reviewed_repo_mutation" });
      snapshotWriter.writeSnapshot({ agent_status: "blocked" });
      return blockedReport;
    }
  }

  const approval = evaluateApproval(command, systemImpact);
  if (!approval.allowed) {
    const blockedReport = buildReport(command, "BLOCKED", {
      files: touchedFiles,
      risk: approval.reason,
      next: "wait_for_explicit_approval",
      result: { approval, system_impact: systemImpact },
    });
    const resultPaths = writeReport(blockedReport);
    archiveCommand(commandEntry.filePath, command, resultPaths);
    logAudit({ command_id: command.command_id, action: command.action, status: "BLOCKED", reason: approval.reason });
    snapshotWriter.writeSnapshot({ agent_status: "blocked" });
    return blockedReport;
  }

  try {
    const result = await routeCommand(command);
    const passReport = buildReport(command, "PASS", {
      files: result && result.record && result.record.changed_files || touchedFiles,
      risk: systemImpact.architecture_sensitive ? "architecture-sensitive but approved" : "low",
      next: "idle",
      result,
    });
    const resultPaths = writeReport(passReport);
    archiveCommand(commandEntry.filePath, command, resultPaths);
    logAudit({ command_id: command.command_id, action: command.action, status: "PASS" });
    snapshotWriter.writeSnapshot({ agent_status: "idle" });
    return passReport;
  } catch (error) {
    const failReport = buildReport(command, "FAIL", {
      files: touchedFiles,
      risk: error.message,
      next: "inspect_agent_report",
      result: { error: error.message },
    });
    const resultPaths = writeReport(failReport);
    archiveCommand(commandEntry.filePath, command, resultPaths);
    logAudit({ command_id: command.command_id, action: command.action, status: "FAIL", reason: error.message });
    snapshotWriter.writeSnapshot({ agent_status: "error" });
    return failReport;
  }
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
