"use strict";

require("dotenv").config();

const { spawn } = require("child_process");

function envFlag(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return String(raw).trim().toLowerCase() === "true";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probeJson(url, timeoutMs = 5000) {
  if (!url) {
    return { ok: false, status: 0, error: "URL_MISSING", body: null };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch (_) {
      body = text;
    }
    return { ok: response.ok, status: response.status, error: null, body };
  } catch (error) {
    return { ok: false, status: 0, error: error.message, body: null };
  } finally {
    clearTimeout(timer);
  }
}

function startDetached(command, cwd) {
  if (!command) {
    return { started: false, reason: "START_CMD_MISSING", pid: null };
  }
  try {
    const child = spawn(command, {
      cwd: cwd || process.cwd(),
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
    return { started: true, reason: null, pid: child.pid || null };
  } catch (error) {
    return { started: false, reason: error.message, pid: null };
  }
}

async function ensureOneService(config) {
  const before = await probeJson(config.healthUrl, config.timeoutMs);
  if (before.ok) {
    return {
      name: config.name,
      ok: true,
      auto_started: false,
      health: before,
      pid: null,
    };
  }

  let startResult = { started: false, reason: null, pid: null };
  if (config.required !== false && config.autoStart) {
    startResult = startDetached(config.startCmd, config.cwd);
    await sleep(config.startupDelayMs || 8000);
  }

  const after = await probeJson(config.healthUrl, config.timeoutMs);
  return {
    name: config.name,
    ok: after.ok,
    auto_started: !!startResult.started,
    health: after,
    pid: startResult.pid,
    start_error: startResult.started ? null : startResult.reason,
  };
}

async function ensureServicesReady() {
  const fooocus = await ensureOneService({
    name: "fooocus",
    required: true,
    healthUrl: process.env.FOOOCUS_HEALTH_URL || "http://127.0.0.1:7865/",
    autoStart: envFlag("AUTO_START_FOOOCUS", false),
    startCmd: process.env.FOOOCUS_START_CMD || "",
    cwd: process.env.FOOOCUS_START_CWD || process.cwd(),
    timeoutMs: 5000,
    startupDelayMs: 10000,
  });

  const requireOllama = envFlag("REQUIRE_OLLAMA", false);
  const ollama = await ensureOneService({
    name: "ollama",
    required: requireOllama,
    healthUrl: process.env.OLLAMA_HEALTH_URL || "http://127.0.0.1:11434/api/tags",
    autoStart: envFlag("AUTO_START_OLLAMA", false),
    startCmd: process.env.OLLAMA_START_CMD || "",
    cwd: process.env.OLLAMA_START_CWD || process.cwd(),
    timeoutMs: 5000,
    startupDelayMs: 5000,
  });

  const geminiBridgeUrl = process.env.GEMINI_BRIDGE_HEALTH_URL || "";
  const claudeBridgeUrl = process.env.CLAUDE_BRIDGE_HEALTH_URL || "";
  const gemini_bridge = geminiBridgeUrl
    ? await ensureOneService({
        name: "gemini_bridge",
        required: false,
        healthUrl: geminiBridgeUrl,
        autoStart: envFlag("AUTO_START_GEMINI_BRIDGE", false),
        startCmd: process.env.GEMINI_BRIDGE_START_CMD || "",
        cwd: process.env.GEMINI_BRIDGE_START_CWD || process.cwd(),
        timeoutMs: 5000,
        startupDelayMs: 5000,
      })
    : { name: "gemini_bridge", ok: true, skipped: true };
  const claude_bridge = claudeBridgeUrl
    ? await ensureOneService({
        name: "claude_bridge",
        required: false,
        healthUrl: claudeBridgeUrl,
        autoStart: envFlag("AUTO_START_CLAUDE_BRIDGE", false),
        startCmd: process.env.CLAUDE_BRIDGE_START_CMD || "",
        cwd: process.env.CLAUDE_BRIDGE_START_CWD || process.cwd(),
        timeoutMs: 5000,
        startupDelayMs: 5000,
      })
    : { name: "claude_bridge", ok: true, skipped: true };

  const overall = fooocus.ok && (!requireOllama || ollama.ok);
  return {
    overall_ok: overall,
    timestamp: new Date().toISOString(),
    services: {
      fooocus,
      ollama,
      gemini_bridge,
      claude_bridge,
    },
  };
}

module.exports = {
  ensureServicesReady,
  probeJson,
};
