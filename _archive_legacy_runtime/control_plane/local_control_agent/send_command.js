"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const config = require("./config");
const { ensureBridgeDirs } = require("./bridge_reader");
const { writeJson, readJsonSafe } = require("./bridge_writer");

const DIRECT_AUTO_ALLOW = new Set([
  "repo.status",
  "runtime.health",
  "disk.smart_scan",
  "disk.latest_report",
  "system.snapshot",
  "system.map_check",
  "desktop.open_app",
  "desktop.open_url",
  "desktop.startup_workspace",
  "desktop.focus_window",
  "desktop.open_tab",
  "desktop.switch_tab",
  "desktop.startup_workspace_full",
]);

const REVIEWED_ACTIONS = new Set([
  "repo.commit",
  "repo.push",
  "repo.reviewed_commit_push",
  "codex.build_task",
  "disk.safe_clean",
  "desktop.run_shell",
  "desktop.send_keys",
  "desktop.type_text",
  "desktop.basic_click",
]);

function parseArgv(argv) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function splitCsv(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildCommandId(action) {
  const slug = String(action || "command").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  const nonce = crypto.randomBytes(3).toString("hex");
  return `cmd_${slug}_${Date.now()}_${nonce}`;
}

function submitCommand(command) {
  return writeInboxCommand(command);
}

function resolveApprovalStatus(action, flags) {
  if (flags["approval-status"]) return String(flags["approval-status"]);
  if (DIRECT_AUTO_ALLOW.has(action)) return "auto_allow";
  if (REVIEWED_ACTIONS.has(action)) return "approved";
  return "pending";
}

function buildPathsPayload() {
  return {
    inbox: config.INBOX_DIR,
    outbox: config.OUTBOX_DIR,
    archive: config.ARCHIVE_DIR,
    state: config.STATE_DIR,
    reports: config.LOCAL_AGENT_REPORTS_DIR,
    latest_report: config.LATEST_AGENT_REPORT,
    latest_reviewed_action: config.LOCAL_AGENT_LAST_ACTION,
  };
}

function buildCommandFromFlags(input) {
  const parsed = Array.isArray(input) ? parseArgv(input) : input;
  const requestedAction = parsed._[0];
  if (!requestedAction) {
    throw new Error("missing_action");
  }

  if (requestedAction === "paths") {
    return { mode: "paths", paths: buildPathsPayload() };
  }

  const action = requestedAction === "reviewed_commit_push"
    ? "repo.reviewed_commit_push"
    : requestedAction;

  const command = {
    command_id: buildCommandId(action),
    action,
    payload: {},
    approval: {
      status: resolveApprovalStatus(action, parsed),
    },
    requested_by: "local_cli",
    created_at: new Date().toISOString(),
  };

  if (parsed.message) command.payload.message = String(parsed.message);
  if (parsed.branch) command.payload.branch = String(parsed.branch);
  if (parsed.remote) command.payload.remote = String(parsed.remote);
  if (parsed.task) command.payload.task = String(parsed.task);
  if (parsed["task-id"]) command.payload.task_id = String(parsed["task-id"]);
  if (parsed.scope) command.payload.scope = String(parsed.scope);
  if (parsed.app) command.payload.app = String(parsed.app);
  if (parsed.url) command.payload.url = String(parsed.url);
  if (parsed.command) command.payload.command = String(parsed.command);
  if (parsed.target) command.payload.target = String(parsed.target);
  if (parsed.keys) command.payload.keys = String(parsed.keys);
  if (parsed.text) command.payload.text = String(parsed.text);
  if (parsed.x) command.payload.x = Number(parsed.x);
  if (parsed.y) command.payload.y = Number(parsed.y);
  if (parsed.files) command.payload.files = splitCsv(parsed.files);
  if (parsed.targets) {
    command.payload.targets = splitCsv(parsed.targets).map((targetPath) => ({ path: targetPath }));
  }
  if (parsed.approve) {
    command.approval.status = "approved";
  }
  if (parsed["explicit-approved-path"]) {
    command.payload.explicit_approved_path = true;
  }

  if (action === "repo.reviewed_commit_push" && !command.payload.branch) {
    command.payload.branch = "main";
  }

  return {
    mode: "command",
    wait: Boolean(parsed.wait),
    command,
  };
}

function writeInboxCommand(command) {
  ensureBridgeDirs();
  const inboxPath = path.join(config.INBOX_DIR, `${command.command_id}.json`);
  writeJson(inboxPath, command);
  return inboxPath;
}

function findOutboxReport(commandId) {
  if (!fs.existsSync(config.OUTBOX_DIR)) return null;
  const names = fs.readdirSync(config.OUTBOX_DIR)
    .filter((name) => name.endsWith(".json") && name.startsWith(`${commandId}_`))
    .sort();
  if (!names.length) return null;
  const filePath = path.join(config.OUTBOX_DIR, names[names.length - 1]);
  return {
    filePath,
    report: readJsonSafe(filePath, null),
  };
}

async function waitForResult(commandId, timeoutMs = 30000, pollMs = 500) {
  const started = Date.now();
  while ((Date.now() - started) < timeoutMs) {
    const found = findOutboxReport(commandId);
    if (found && found.report) {
      return found;
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
  return null;
}

function printPaths(paths) {
  console.log(`inbox: ${paths.inbox}`);
  console.log(`outbox: ${paths.outbox}`);
  console.log(`archive: ${paths.archive}`);
  console.log(`state: ${paths.state}`);
  console.log(`reports: ${paths.reports}`);
  console.log(`latest_report: ${paths.latest_report}`);
  console.log(`latest_reviewed_action: ${paths.latest_reviewed_action}`);
}

function printQueuedCommand(command, inboxPath) {
  console.log(`command_id: ${command.command_id}`);
  console.log(`action: ${command.action}`);
  if (command.payload && command.payload.task_id) console.log(`task_id: ${command.payload.task_id}`);
  console.log(`inbox_file: ${inboxPath}`);
  console.log(`next_check: ${config.OUTBOX_DIR}`);
  console.log(`review_reports: ${config.LOCAL_AGENT_REPORTS_DIR}`);
}

function collectChangedFiles(report) {
  if (!report) return [];
  if (Array.isArray(report.files) && report.files.length) return report.files;
  const nested = report.result && report.result.record && report.result.record.changed_files;
  return Array.isArray(nested) ? nested : [];
}

function printWaitResult(found) {
  const report = found.report;
  console.log(`result_status: ${report.status}`);
  console.log(`report_path: ${found.filePath}`);
  const changedFiles = collectChangedFiles(report);
  console.log(`changed_files: ${changedFiles.join(", ") || "-"}`);
  const branch = report.result && (report.result.branch || report.result.record && report.result.record.execution_result && report.result.record.execution_result.branch);
  if (branch) console.log(`branch: ${branch}`);
  const commitOutput = report.result && report.result.record && report.result.record.execution_result && report.result.record.execution_result.commit_output;
  if (commitOutput) {
    const firstLine = String(commitOutput).trim().split(/\r?\n/).find(Boolean) || "-";
    console.log(`commit: ${firstLine}`);
  }
}

async function main(argv = process.argv.slice(2)) {
  const parsed = parseArgv(argv);
  const built = buildCommandFromFlags(parsed);

  if (built.mode === "paths") {
    printPaths(built.paths);
    return { mode: "paths", paths: built.paths };
  }

  const inboxPath = writeInboxCommand(built.command);
  printQueuedCommand(built.command, inboxPath);

  if (!built.wait) {
    return { mode: "queued", command: built.command, inboxPath };
  }

  const found = await waitForResult(built.command.command_id);
  if (!found) {
    console.log("result_status: BLOCKED");
    console.log("report_path: -");
    console.log("changed_files: -");
    return { mode: "timeout", command: built.command, inboxPath };
  }

  printWaitResult(found);
  return { mode: "complete", command: built.command, inboxPath, report: found.report, reportPath: found.filePath };
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  parseArgv,
  buildCommandId,
  buildCommandFromFlags,
  submitCommand,
  writeInboxCommand,
  waitForResult,
  main,
};
