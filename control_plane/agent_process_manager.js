"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { governedSpawn, governedSpawnSync, releaseGovernorLock } = require("./process_governor");

const AGENT_ENTRYPOINT = path.join(config.ROOT, "control_plane", "local_control_agent", "index.js");
const AGENT_STATE_PATH = path.join(config.STATE_DIR, "agent_process.json");

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

function runPowerShell(script) {
  const result = governedSpawnSync({
    command: "powershell.exe",
    args: ["-NoProfile", "-Command", script],
    cwd: config.ROOT,
    owner_module: "agent_process_manager",
    rate_limit_exempt: true,
    timeout_ms: 15000,
  });
  return {
    status: result.status === "PASS" ? 0 : 1,
    stdout: result.result && result.result.stdout || "",
    stderr: result.result && result.result.stderr || result.reason || "",
  };
}

function normalizeProcesses(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Boolean)
    .map((entry) => ({
      pid: Number(entry.ProcessId || entry.pid || 0),
      command_line: String(entry.CommandLine || entry.command_line || "").trim(),
      name: String(entry.Name || entry.name || "").trim(),
    }))
    .filter((entry) => entry.pid > 0);
}

function findAgentProcesses() {
  const escaped = AGENT_ENTRYPOINT.replace(/\\/g, "\\\\");
  const script = [
    `$target = "${escaped}"`,
    "$items = Get-CimInstance Win32_Process | Where-Object {",
    "  $_.Name -eq 'node.exe' -and $_.CommandLine -like ('*' + $target + '*')",
    "} | Select-Object ProcessId, CommandLine, Name",
    "$items | ConvertTo-Json -Depth 4 -Compress",
  ].join("\n");
  const result = runPowerShell(script);
  if (result.status !== 0) return [];
  const stdout = String(result.stdout || "").trim();
  if (!stdout) return [];
  try {
    const parsed = JSON.parse(stdout);
    return normalizeProcesses(Array.isArray(parsed) ? parsed : [parsed]);
  } catch (_) {
    return [];
  }
}

function readAgentState() {
  return readJsonSafe(AGENT_STATE_PATH, {
    pid: null,
    process_id: null,
    singleton_key: "auto_agent_loop",
    status: "stopped",
    started_at: null,
    command_line: null,
  });
}

function writeAgentState(state) {
  writeJson(AGENT_STATE_PATH, state);
}

function clearAgentState() {
  if (fs.existsSync(AGENT_STATE_PATH)) fs.unlinkSync(AGENT_STATE_PATH);
}

function getAgentStatus() {
  const processes = findAgentProcesses();
  if (!processes.length) {
    return {
      live: false,
      status: "stopped",
      pid: null,
      processes: [],
      state: readAgentState(),
    };
  }
  const primary = processes[0];
  return {
    live: true,
    status: "running",
    pid: primary.pid,
    processes,
    state: readAgentState(),
  };
}

async function startAgentProcess() {
  const current = getAgentStatus();
  if (current.live) {
    return {
      status: "PASS",
      action: "agent.start",
      already_running: true,
      pid: current.pid,
      processes: current.processes,
    };
  }
  const launch = await governedSpawn({
    command: process.execPath,
    args: [AGENT_ENTRYPOINT],
    cwd: config.ROOT,
    detached: true,
    wait_for_exit: false,
    windowsHide: true,
    owner_module: "agent_process_manager",
    singleton_key: "auto_agent_loop",
    kill_policy: "manual_stop",
    timeout_ms: 10000,
  });
  if (launch.status !== "PASS") {
    return {
      status: "FAIL",
      action: "agent.start",
      already_running: false,
      pid: null,
      processes: [],
      reason: launch.reason || launch.result && launch.result.error || "agent_spawn_failed",
    };
  }
  writeAgentState({
    pid: launch.result && launch.result.pid || null,
    process_id: launch.process && launch.process.process_id || null,
    singleton_key: "auto_agent_loop",
    status: "running",
    started_at: new Date().toISOString(),
    command_line: `${process.execPath} ${AGENT_ENTRYPOINT}`,
  });
  const verified = getAgentStatus();
  return {
    status: verified.live ? "PASS" : "FAIL",
    action: "agent.start",
    already_running: false,
    pid: verified.pid || launch.result && launch.result.pid || null,
    processes: verified.processes || [],
  };
}

async function stopAgentProcess() {
  const current = getAgentStatus();
  if (!current.live) {
    clearAgentState();
    return {
      status: "PASS",
      action: "agent.stop",
      already_stopped: true,
      stopped_pids: [],
    };
  }
  const stopped = [];
  for (const proc of current.processes) {
    governedSpawnSync({
      command: "taskkill",
      args: ["/PID", String(proc.pid), "/T", "/F"],
      cwd: config.ROOT,
      owner_module: "agent_process_manager",
      timeout_ms: 15000,
    });
    stopped.push(proc.pid);
  }
  const state = readAgentState();
  if (state.singleton_key) releaseGovernorLock(state.singleton_key, state.process_id || null);
  clearAgentState();
  const verified = getAgentStatus();
  return {
    status: verified.live ? "FAIL" : "PASS",
    action: "agent.stop",
    already_stopped: false,
    stopped_pids: stopped,
  };
}

async function restartAgentProcess() {
  const stopped = await stopAgentProcess();
  const started = await startAgentProcess();
  return {
    status: started.status === "PASS" ? "PASS" : "FAIL",
    action: "agent.restart",
    stop_result: stopped,
    start_result: started,
    pid: started.pid || null,
  };
}

module.exports = {
  AGENT_ENTRYPOINT,
  AGENT_STATE_PATH,
  readAgentState,
  getAgentStatus,
  findAgentProcesses,
  startAgentProcess,
  stopAgentProcess,
  restartAgentProcess,
};
