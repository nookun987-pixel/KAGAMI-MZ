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
  TASKS_DIR: path.join(ROOT, "tasks"),
  CONTROL_API_HOST: process.env.MIKAGE_CONTROL_API_HOST || "127.0.0.1",
  CONTROL_API_PORT: Number(process.env.MIKAGE_CONTROL_API_PORT || 3032),
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
  LOCAL_AGENT_LAST_OBSERVER_ACTION: path.join(ROOT, "control_plane", "local_control_agent", "state", "latest_desktop_observer_action.json"),
  USER_SESSION_STATE: path.join(BRIDGE_ROOT, "state", "user_session.json"),
  AGENT_SESSION_STATE: path.join(BRIDGE_ROOT, "state", "agent_session.json"),
  WORKFLOW_REGISTRY_JSON: path.join(BRIDGE_ROOT, "state", "workflow_run_registry.json"),
  WORKFLOW_REGISTRY_JSONL: path.join(BRIDGE_ROOT, "state", "workflow_run_history.jsonl"),
  APPROVAL_QUEUE_PATH: path.join(BRIDGE_ROOT, "state", "approval_queue.json"),
  APPROVAL_QUEUE_HISTORY_JSONL: path.join(BRIDGE_ROOT, "state", "approval_queue_history.jsonl"),
  APPROVAL_INBOX_PATH: path.join(BRIDGE_ROOT, "state", "approval_inbox.json"),
  APPROVAL_INBOX_HISTORY_JSONL: path.join(BRIDGE_ROOT, "state", "approval_inbox_history.jsonl"),
  ACTION_PREVIEW_DIR: path.join(BRIDGE_ROOT, "state", "action_previews"),
  DIFF_PREVIEW_DIR: path.join(BRIDGE_ROOT, "state", "diff_previews"),
  FAILURE_CENTER_PATH: path.join(BRIDGE_ROOT, "state", "failure_center.json"),
  FAILURE_CENTER_HISTORY_JSONL: path.join(BRIDGE_ROOT, "state", "failure_center_history.jsonl"),
  RETRY_QUEUE_PATH: path.join(BRIDGE_ROOT, "state", "retry_queue.json"),
  RETRY_QUEUE_HISTORY_JSONL: path.join(BRIDGE_ROOT, "state", "retry_queue_history.jsonl"),
  TASK_LIFECYCLE_DIR: path.join(BRIDGE_ROOT, "state", "task_lifecycle"),
  GOVERNANCE_SNAPSHOT_LATEST: path.join(BRIDGE_ROOT, "state", "governance_snapshot_latest.json"),
  GOVERNANCE_SNAPSHOT_HISTORY_JSONL: path.join(BRIDGE_ROOT, "state", "governance_snapshot_history.jsonl"),
  OPERATOR_REPORTS_JSONL: path.join(BRIDGE_ROOT, "state", "operator_reports.jsonl"),
  REPORT_DEDUPE_CACHE_PATH: path.join(BRIDGE_ROOT, "state", "report_dedupe_cache.json"),
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
