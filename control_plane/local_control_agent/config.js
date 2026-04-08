"use strict";

const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const STATE_ROOT = path.join(REPO_ROOT, "control_plane", "local_control_agent", "state");
const TASK_ROOT = path.join(REPO_ROOT, "control_plane", "local_control_agent", "tasks");
const LOG_ROOT = path.join(REPO_ROOT, "control_plane", "local_control_agent", "logs");
const DRIVE_ROOT = process.env.MIKAGE_DRIVE_ROOT || "G:\\My Drive\\mikage_runner";

module.exports = {
  REPO_ROOT,
  STATE_ROOT,
  TASK_ROOT,
  LOG_ROOT,
  DRIVE_ROOT,
  CONTROL_PORT: Number(process.env.MIKAGE_CONTROL_PORT || 3032),
  CONTROL_HOST: process.env.MIKAGE_CONTROL_HOST || "127.0.0.1",
  POLL_INTERVAL_MS: Number(process.env.MIKAGE_CONTROL_POLL_MS || 4000),
  CODEX_COMMAND: process.env.MIKAGE_CODEX_COMMAND || "codex",
  CODEX_ARGS: (process.env.MIKAGE_CODEX_ARGS || "").split(" ").filter(Boolean),
  TELEGRAM_BOT_TOKEN: process.env.MIKAGE_TELEGRAM_BOT_TOKEN || "",
  TELEGRAM_CHAT_ID: process.env.MIKAGE_TELEGRAM_CHAT_ID || "",
  DEFAULT_BRANCH: process.env.MIKAGE_DEFAULT_BRANCH || "main",
  STARTUP_PROFILE: {
    required_paths: [
      REPO_ROOT,
      DRIVE_ROOT,
    ],
    service_ports: [3000, 3030, 7865, 11434],
    required_tabs: [
      "ChatGPT",
      "Chrome",
      "VSCode/Codex",
    ],
  },
};
