"use strict";

const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const config = require("./local_control_agent/config");

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
  return spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
    cwd: config.ROOT,
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
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
  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch (_) {
    return [];
  }
  return normalizeProcesses(Array.isArray(parsed) ? parsed : [parsed]);
}

function readAgentState() {
  return readJsonSafe(AGENT_STATE_PATH, {
    pid: null,
    status: "stopped",
    started_at: null,
    command_line: null,
  });
}

function writeAgentState(state) {
  writeJson(AGENT_STATE_PATH, state);
}

function clearAgentState() {
  if (fs.existsSync(AGENT_STATE_PATH)) {
    fs.unlinkSync(AGENT_STATE_PATH);
  }
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

function startAgentProcess() {
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

  const child = spawn(process.execPath, [AGENT_ENTRYPOINT], {
    cwd: config.ROOT,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  child.unref();

  writeAgentState({
    pid: child.pid,
    status: "running",
    started_at: new Date().toISOString(),
    command_line: `${process.execPath} ${AGENT_ENTRYPOINT}`,
  });

  const verified = getAgentStatus();
  return {
    status: verified.live ? "PASS" : "FAIL",
    action: "agent.start",
    already_running: false,
    pid: verified.pid || child.pid,
    processes: verified.processes || [],
  };
}

function stopAgentProcess() {
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
    spawnSync("taskkill", ["/PID", String(proc.pid), "/T", "/F"], {
      cwd: config.ROOT,
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    stopped.push(proc.pid);
  }

  clearAgentState();
  const verified = getAgentStatus();
  return {
    status: verified.live ? "FAIL" : "PASS",
    action: "agent.stop",
    already_stopped: false,
    stopped_pids: stopped,
  };
}

function restartAgentProcess() {
  const stopped = stopAgentProcess();
  const started = startAgentProcess();
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
