"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const {
  buildCommandId,
  submitCommand,
  waitForResult,
} = require("./local_control_agent/send_command");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");
const { listInboxCommands, ensureBridgeDirs } = require("./local_control_agent/bridge_reader");
const snapshotWriter = require("./local_control_agent/snapshot_writer");
const { readRuntimeStatus } = require("./runtime_status_reader");
const agentManager = require("./agent_process_manager");

const WORKFLOW_STATE_PATH = path.join(config.STATE_DIR, "latest_workflow_report.json");

function tailLines(filePath, limit = 50) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  return lines.slice(Math.max(0, lines.length - limit));
}

function listLatestLocalReports(limit = 10) {
  if (!fs.existsSync(config.LOCAL_AGENT_REPORTS_DIR)) return [];
  return fs.readdirSync(config.LOCAL_AGENT_REPORTS_DIR)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const filePath = path.join(config.LOCAL_AGENT_REPORTS_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        name,
        path: filePath,
        mtime_ms: stat.mtimeMs,
      };
    })
    .sort((a, b) => b.mtime_ms - a.mtime_ms)
    .slice(0, limit);
}

function getHealth() {
  ensureBridgeDirs();
  const runtime = readRuntimeStatus();
  const agent = agentManager.getAgentStatus();
  const pending = readJsonSafe(config.PENDING_ACTIONS, { pending: [] });
  return {
    status: "PASS",
    bridge: {
      ready: true,
      inbox: config.INBOX_DIR,
      outbox: config.OUTBOX_DIR,
      state: config.STATE_DIR,
    },
    agent: {
      live: agent.live,
      status: agent.status,
      pid: agent.pid,
      process_count: agent.processes.length,
    },
    runtime,
    queue: {
      pending_actions: Array.isArray(pending.pending) ? pending.pending.length : 0,
    },
  };
}

function getStatus() {
  const snapshot = readJsonSafe(config.SYSTEM_RUNTIME_SNAPSHOT, {});
  const latestReport = readJsonSafe(config.LATEST_AGENT_REPORT, null);
  const latestWorkflow = readJsonSafe(WORKFLOW_STATE_PATH, null);
  const agent = agentManager.getAgentStatus();
  return {
    status: "PASS",
    snapshot,
    latest_report: latestReport,
    latest_workflow: latestWorkflow,
    agent,
  };
}

async function runBridgeCommand(input = {}) {
  const action = String(input.action || "").trim();
  if (!action) {
    throw new Error("missing_action");
  }
  const command = {
    command_id: input.command_id || buildCommandId(action),
    action,
    payload: input.payload || {},
    approval: {
      status: input.approval_status || (input.approve ? "approved" : "pending"),
    },
    requested_by: input.requested_by || "commander_api",
    created_at: new Date().toISOString(),
  };
  const inboxPath = submitCommand(command);
  const wait = input.wait !== false;
  if (!wait) {
    return {
      status: "PASS",
      queued: true,
      command_id: command.command_id,
      inbox_path: inboxPath,
    };
  }
  const found = await waitForResult(command.command_id, input.timeout_ms || 30000, 500);
  if (!found) {
    return {
      status: "BLOCKED",
      queued: true,
      command_id: command.command_id,
      inbox_path: inboxPath,
      reason: "timeout_waiting_for_report",
    };
  }
  return {
    status: found.report.status,
    queued: false,
    command_id: command.command_id,
    inbox_path: inboxPath,
    report_path: found.filePath,
    report: found.report,
  };
}

function getLatestReports() {
  return {
    status: "PASS",
    latest_agent_report: readJsonSafe(config.LATEST_AGENT_REPORT, null),
    latest_reviewed_action: readJsonSafe(config.LOCAL_AGENT_LAST_ACTION, null),
    latest_desktop_action: readJsonSafe(config.LOCAL_AGENT_LAST_DESKTOP_ACTION, null),
    local_reports: listLatestLocalReports(15),
  };
}

function getRecentLogs(limit = 50) {
  return {
    status: "PASS",
    audit_log_path: config.AUDIT_LOG,
    recent_lines: tailLines(config.AUDIT_LOG, limit),
  };
}

function getQueueStatus() {
  const pending = readJsonSafe(config.PENDING_ACTIONS, { pending: [] });
  const inbox = listInboxCommands();
  return {
    status: "PASS",
    pending_actions: pending.pending || [],
    inbox_count: inbox.length,
    inbox_commands: inbox.map((entry) => ({
      command_id: entry.payload.command_id,
      action: entry.payload.action,
      file: entry.name,
    })),
  };
}

function startAgent() {
  const result = agentManager.startAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: result.status === "PASS" ? "watching" : "error" });
  return result;
}

function stopAgent() {
  const result = agentManager.stopAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: "stopped" });
  return result;
}

function restartAgent() {
  const result = agentManager.restartAgentProcess();
  snapshotWriter.writeSnapshot({ agent_status: result.status === "PASS" ? "watching" : "error" });
  return result;
}

const WORKFLOW_STEPS = {
  WAKE_VERIFY: [
    { type: "agent.start" },
    { type: "command", action: "desktop.get_active_window", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.capture_desktop_state", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
  ],
  DESKTOP_CHECK: [
    { type: "command", action: "desktop.get_active_window", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.get_browser_context", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "desktop.capture_desktop_state", payload: {}, approval_status: "auto_allow" },
  ],
  REPO_CHECK: [
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
  ],
  DAILY_HEALTH: [
    { type: "agent.start" },
    { type: "command", action: "runtime.health", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "repo.status", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "disk.smart_scan", payload: {}, approval_status: "auto_allow" },
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
  ],
  SAFE_SHUTDOWN: [
    { type: "command", action: "system.snapshot", payload: {}, approval_status: "auto_allow" },
    { type: "agent.stop" },
  ],
};

async function runWorkflow(name) {
  const workflowName = String(name || "").trim().toUpperCase();
  const steps = WORKFLOW_STEPS[workflowName];
  if (!steps) {
    return {
      status: "BLOCKED",
      workflow: workflowName,
      reason: "unknown_workflow",
    };
  }
  const results = [];
  for (const step of steps) {
    let result;
    if (step.type === "agent.start") result = startAgent();
    else if (step.type === "agent.stop") result = stopAgent();
    else if (step.type === "agent.restart") result = restartAgent();
    else {
      result = await runBridgeCommand({
        action: step.action,
        payload: step.payload,
        approval_status: step.approval_status,
        requested_by: "workflow",
        wait: true,
        timeout_ms: step.timeout_ms || 30000,
      });
    }
    results.push({
      step: step.type === "command" ? step.action : step.type,
      result,
    });
    if (result.status && !["PASS", "ALLOW", "watching", "running"].includes(String(result.status).toUpperCase())) {
      break;
    }
  }
  const finalStatus = results.every((entry) => String(entry.result.status || "").toUpperCase() === "PASS")
    ? "PASS"
    : (results[results.length - 1] ? results[results.length - 1].result.status : "BLOCKED");
  const report = {
    generated_at: new Date().toISOString(),
    workflow: workflowName,
    status: finalStatus,
    steps: results,
  };
  writeJson(WORKFLOW_STATE_PATH, report);
  return report;
}

module.exports = {
  WORKFLOW_STATE_PATH,
  WORKFLOW_STEPS,
  getHealth,
  getStatus,
  startAgent,
  stopAgent,
  restartAgent,
  runBridgeCommand,
  getLatestReports,
  getRecentLogs,
  getQueueStatus,
  runWorkflow,
};
