"use strict";

const path = require("path");
const { resolveMachineProfile } = require("./machine_profile");
const { resolveNodeRole } = require("../node_role");

const ROOT = path.resolve(__dirname, "..", "..");
const BRIDGE_ROOT = path.join(ROOT, "control_plane", "commander_bridge");
const MACHINE_PROFILE = resolveMachineProfile({ hostname: process.env.COMPUTERNAME || process.env.HOSTNAME });
const NODE_ROLE = resolveNodeRole(MACHINE_PROFILE);

module.exports = {
  ROOT,
  BRIDGE_ROOT,
  MACHINE_PROFILE,
  NODE_ROLE,
  INBOX_DIR: path.join(BRIDGE_ROOT, "inbox"),
  OUTBOX_DIR: path.join(BRIDGE_ROOT, "outbox"),
  STATE_DIR: path.join(BRIDGE_ROOT, "state"),
  LOGS_DIR: path.join(BRIDGE_ROOT, "logs"),
  ARCHIVE_DIR: path.join(BRIDGE_ROOT, "archive"),
  AUDIT_LOG: path.join(BRIDGE_ROOT, "logs", "audit.log"),
  LATEST_AGENT_REPORT: path.join(BRIDGE_ROOT, "state", "latest_agent_report.json"),
  PENDING_ACTIONS: path.join(BRIDGE_ROOT, "state", "pending_actions.json"),
  SYSTEM_RUNTIME_SNAPSHOT: path.join(BRIDGE_ROOT, "state", "system_runtime_snapshot.json"),
  LOCAL_AGENT_STATE_DIR: path.join(ROOT, "control_plane", "local_control_agent", "state"),
  LOCAL_AGENT_REPORTS_DIR: path.join(ROOT, "control_plane", "local_control_agent", "state", "reports"),
  LOCAL_AGENT_LAST_ACTION: path.join(ROOT, "control_plane", "local_control_agent", "state", "latest_reviewed_action.json"),
  LOCAL_AGENT_LAST_DESKTOP_ACTION: path.join(ROOT, "control_plane", "local_control_agent", "state", "latest_desktop_action.json"),
  APPROVAL_POLICY: path.join(BRIDGE_ROOT, "approval_policy.json"),
  APPROVAL_MODEL: path.join(ROOT, "control_plane", "approval_model.json"),
  ENTRYPOINTS_REGISTRY: path.join(ROOT, "state", "system_entrypoints.json"),
  STORAGE_POLICY_LOCK: path.join(ROOT, "STORAGE_POLICY_LOCK.md"),
  SAFE_CLEAN_GLOBS: ["__pycache__", ".pytest_cache", ".cache", "Thumbs.db"],
  SAFE_CLEAN_EXTENSIONS: [".log", ".tmp", ".temp", ".cache"],
  PROTECTED_PATH_PREFIXES: [
    ROOT.toLowerCase(),
    "g:\\my drive".toLowerCase(),
    "c:\\users\\this pc\\desktop".toLowerCase(),
    "c:\\users\\this pc\\documents".toLowerCase(),
    "c:\\users\\this pc\\downloads".toLowerCase(),
    "c:\\users\\this pc\\pictures".toLowerCase(),
    "c:\\users\\this pc\\videos".toLowerCase()
  ],
  ARCH_SENSITIVE_PATHS: [
    "start_mikage.bat",
    "MIKAGE/index.js",
    "runtime/drive_queue/runtime.js",
    "runtime/colab_worker/",
    "control_plane/",
    "state/system_entrypoints.json"
  ],
  ALLOWED_WRITE_PREFIXES: [
    path.join(ROOT, "control_plane", "commander_bridge").toLowerCase(),
    path.join(ROOT, "control_plane", "local_control_agent").toLowerCase(),
    path.join(ROOT, "state").toLowerCase(),
    path.join(ROOT, "tests").toLowerCase()
  ]
};
