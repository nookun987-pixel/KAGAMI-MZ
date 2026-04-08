"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const agentManager = require("./agent_process_manager");

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function buildUserSession(extra = {}) {
  const previous = readJsonSafe(config.USER_SESSION_STATE, {});
  return {
    session_type: "user_session",
    session_id: extra.session_id || previous.session_id || `user_${config.MACHINE_PROFILE.machine_id}`,
    requested_by: extra.requested_by || previous.requested_by || "local_user",
    reviewed_by: extra.reviewed_by || previous.reviewed_by || null,
    approval_state: extra.approval_state || previous.approval_state || "visible",
    active: true,
    started_at: previous.started_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_action: extra.last_action || previous.last_action || null,
    current_task_id: extra.current_task_id || previous.current_task_id || null,
    current_approval_id: extra.current_approval_id || previous.current_approval_id || null,
    current_workflow_id: extra.current_workflow_id || previous.current_workflow_id || null,
  };
}

function buildAgentSession() {
  const status = agentManager.getAgentStatus();
  return {
    session_type: "agent_session",
    session_id: `agent_${config.MACHINE_PROFILE.machine_id}`,
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    active: status.live,
    pid: status.pid,
    process_count: status.processes.length,
    started_at: status.state && status.state.started_at || null,
    updated_at: new Date().toISOString(),
    execution_state: status.status,
  };
}

function writeSessionState(extra = {}) {
  const userSession = buildUserSession(extra.user_session || {});
  const agentSession = buildAgentSession();
  writeJson(config.USER_SESSION_STATE, userSession);
  writeJson(config.AGENT_SESSION_STATE, agentSession);
  return { user_session: userSession, agent_session: agentSession };
}

function getSessionState() {
  return {
    user_session: readJsonSafe(config.USER_SESSION_STATE, buildUserSession()),
    agent_session: readJsonSafe(config.AGENT_SESSION_STATE, buildAgentSession()),
  };
}

module.exports = {
  getSessionState,
  writeSessionState,
};
