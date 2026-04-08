"use strict";

const path = require("path");
const repoManager = require("./repo_manager");
const runtimeOperator = require("./runtime_operator");
const diskAgent = require("./disk_maintenance_agent");
const desktopOperator = require("./desktop_operator");
const desktopObserver = require("./desktop_observer");
const snapshotWriter = require("./snapshot_writer");
const { buildBringupChecklist } = require("./bringup_checklist");
const { writeBringupReport } = require("./bringup_report");
const { writeJson } = require("./bridge_writer");
const config = require("./config");
const { runReviewedOperator } = require("../reviewed_operator_flow");

const REVIEWED_ACTIONS = new Set([
  "repo.commit",
  "repo.push",
  "repo.reviewed_commit_push",
  "disk.safe_clean",
  "codex.build_task",
  "desktop.run_shell",
  "desktop.send_keys",
  "desktop.type_text",
  "desktop.basic_click",
]);

async function routeCommand(command, options = {}) {
  if (REVIEWED_ACTIONS.has(command.action)) {
    return runReviewedOperator({
      command_id: command.command_id,
      action: command.action,
      approval_status: command.approval && command.approval.status || "pending",
      files: command.payload && command.payload.files || [],
      message: command.payload && command.payload.message || "",
      branch: command.payload && command.payload.branch || "HEAD",
      remote: command.payload && command.payload.remote || "origin",
      explicit_approved_path: !!(command.payload && command.payload.explicit_approved_path),
      targets: command.payload && command.payload.targets || [],
      payload: command.payload || {},
    }, options);
  }

  switch (command.action) {
    case "repo.status":
      return repoManager.repoStatus(options);
    case "runtime.health":
      return runtimeOperator.runtimeHealth();
    case "desktop.open_app":
      return desktopOperator.openApp(command.payload || {}, { commandId: command.command_id });
    case "desktop.open_url":
      return desktopOperator.openUrl(command.payload || {}, { commandId: command.command_id });
    case "desktop.startup_workspace":
      return desktopOperator.startupWorkspace(command.payload || {}, { commandId: command.command_id });
    case "desktop.focus_window":
      return desktopOperator.focusWindow(command.payload || {}, { commandId: command.command_id });
    case "desktop.open_tab":
      return desktopOperator.openTab(command.payload || {}, { commandId: command.command_id });
    case "desktop.switch_tab":
      return desktopOperator.switchTab(command.payload || {}, { commandId: command.command_id });
    case "desktop.startup_workspace_full":
      return desktopOperator.startupWorkspaceFull(command.payload || {}, { commandId: command.command_id });
    case "desktop.get_active_window":
      return desktopObserver.getActiveWindow(command.payload || {}, { commandId: command.command_id });
    case "desktop.list_open_windows":
      return desktopObserver.listOpenWindows(command.payload || {}, { commandId: command.command_id });
    case "desktop.get_browser_context":
      return desktopObserver.getBrowserContext(command.payload || {}, { commandId: command.command_id });
    case "desktop.verify_window":
      return desktopObserver.verifyWindow(command.payload || {}, { commandId: command.command_id });
    case "desktop.verify_tab":
      return desktopObserver.verifyTab(command.payload || {}, { commandId: command.command_id });
    case "desktop.capture_desktop_state":
      return desktopObserver.captureDesktopState(command.payload || {}, { commandId: command.command_id });
    case "disk.smart_scan": {
      const report = diskAgent.diskSmartScan();
      writeJson(path.join(config.STATE_DIR, "latest_disk_scan.json"), report);
      return report;
    }
    case "disk.latest_report":
      return diskAgent.diskLatestReport();
    case "system.snapshot":
      return snapshotWriter.writeSnapshot({ agent_status: "snapshot" });
    case "system.resolve_machine_profile":
      return {
        machine_id: config.MACHINE_PROFILE.machine_id,
        node_role: config.MACHINE_PROFILE.node_role,
        profile_path: config.MACHINE_PROFILE.profile_path,
        resolved_hostname: config.MACHINE_PROFILE.resolved_hostname,
      };
    case "system.resolve_node_role":
      return {
        machine_id: config.MACHINE_PROFILE.machine_id,
        node_role: config.NODE_ROLE.role_id,
        role_path: config.NODE_ROLE.role_path,
        permissions: config.NODE_ROLE.permissions,
      };
    case "system.run_bringup_check":
      return buildBringupChecklist();
    case "system.generate_bringup_report":
      return writeBringupReport();
    case "system.map_check":
      return {
        active_runtime_entrypoint: "start_mikage.bat",
        active_hub: "MIKAGE/index.js",
        queue_runtime: "runtime/drive_queue/runtime.js",
        worker: "runtime/colab_worker/colab_one_click_worker.ipynb",
      };
    default:
      throw new Error(`Unsupported action: ${command.action}`);
  }
}

module.exports = {
  routeCommand,
};
