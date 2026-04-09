"use strict";

const { spawn, spawnSync, execFileSync } = require("child_process");

function preview(text) {
  return String(text || "").trim().split(/\r?\n/).slice(0, 20).join("\n");
}

function resolveStdio(request = {}) {
  const stdio = request.stdio || ["ignore", "pipe", "pipe"];
  if (Object.prototype.hasOwnProperty.call(request, "input")) {
    const next = stdio.slice();
    next[0] = "pipe";
    return next;
  }
  return stdio;
}

function runSpawnSync(request = {}) {
  const result = spawnSync(request.command, request.args || [], {
    cwd: request.cwd,
    encoding: "utf8",
    windowsHide: request.windowsHide !== false,
    stdio: resolveStdio(request),
    shell: Boolean(request.shell),
    timeout: request.timeout_ms || 0,
    input: Object.prototype.hasOwnProperty.call(request, "input") ? request.input : undefined,
  });
  return {
    status: typeof result.status === "number" && result.status === 0 ? "PASS" : "FAIL",
    exit_code: result.status,
    signal: result.signal || null,
    stdout: String(result.stdout || ""),
    stderr: String(result.stderr || ""),
    stdout_preview: preview(result.stdout),
    stderr_preview: preview(result.stderr),
    timed_out: Boolean(result.error && String(result.error.message || "").includes("ETIMEDOUT")),
    error: result.error ? result.error.message : null,
  };
}

function runExecFileSync(request = {}) {
  try {
    const stdout = execFileSync(request.command, request.args || [], {
      cwd: request.cwd,
      encoding: "utf8",
      windowsHide: request.windowsHide !== false,
      stdio: resolveStdio(request),
      shell: Boolean(request.shell),
      timeout: request.timeout_ms || 0,
      input: Object.prototype.hasOwnProperty.call(request, "input") ? request.input : undefined,
    });
    return {
      status: "PASS",
      exit_code: 0,
      stdout: String(stdout || ""),
      stderr: "",
      stdout_preview: preview(stdout),
      stderr_preview: "",
      timed_out: false,
      error: null,
    };
  } catch (error) {
    return {
      status: "FAIL",
      exit_code: typeof error.status === "number" ? error.status : 1,
      stdout: String(error.stdout || ""),
      stderr: String(error.stderr || error.message || ""),
      stdout_preview: preview(error.stdout),
      stderr_preview: preview(error.stderr || error.message),
      timed_out: String(error.message || "").includes("ETIMEDOUT"),
      error: error.message,
    };
  }
}

function runSpawn(request = {}) {
  return new Promise((resolve) => {
    const child = spawn(request.command, request.args || [], {
      cwd: request.cwd,
      windowsHide: request.windowsHide !== false,
      stdio: request.stdio || ["ignore", "pipe", "pipe"],
      detached: Boolean(request.detached),
      shell: Boolean(request.shell),
    });
    const stdout = [];
    const stderr = [];
    let finished = false;
    let timeoutHandle = null;
    if (child.stdout) child.stdout.on("data", (chunk) => stdout.push(String(chunk)));
    if (child.stderr) child.stderr.on("data", (chunk) => stderr.push(String(chunk)));
    const finish = (payload) => {
      if (finished) return;
      finished = true;
      if (timeoutHandle) clearTimeout(timeoutHandle);
      resolve({
        pid: child.pid,
        stdout: stdout.join(""),
        stderr: stderr.join(""),
        stdout_preview: preview(stdout.join("")),
        stderr_preview: preview(stderr.join("")),
        ...payload,
      });
    };
    child.on("error", (error) => finish({
      status: "FAIL",
      exit_code: 1,
      error: error.message,
      timed_out: false,
    }));
    if (request.wait_for_exit === false) {
      finish({
        status: "PASS",
        exit_code: null,
        error: null,
        timed_out: false,
        detached: Boolean(request.detached),
        running: true,
      });
      if (request.detached && typeof child.unref === "function") child.unref();
      return;
    }
    child.on("close", (code, signal) => finish({
      status: code === 0 ? "PASS" : "FAIL",
      exit_code: code,
      signal: signal || null,
      error: null,
      timed_out: false,
    }));
    if (request.timeout_ms) {
      timeoutHandle = setTimeout(() => {
        try {
          child.kill("SIGTERM");
        } catch (_) {}
        finish({
          status: "FAIL",
          exit_code: null,
          error: "spawn_timeout",
          timed_out: true,
        });
      }, request.timeout_ms);
    }
  });
}

module.exports = {
  runSpawnSync,
  runExecFileSync,
  runSpawn,
};
