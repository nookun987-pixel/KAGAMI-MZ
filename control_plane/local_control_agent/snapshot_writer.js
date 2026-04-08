"use strict";

const path = require("path");
const { writeJson, readPendingActions, readJsonSafe } = require("./bridge_writer");
const config = require("./config");
const repoManager = require("./repo_manager");
const { LAST_OBSERVER_ACTION } = require("./desktop_observer");

function writeSnapshot(extra = {}) {
  const pending = readPendingActions();
  const latestReport = readJsonSafe(config.LATEST_AGENT_REPORT, null);
  const repoState = repoManager.repoStatus();
  const latestDiskScan = readJsonSafe(path.join(config.STATE_DIR, "latest_disk_scan.json"), null);
  const latestReviewedAction = readJsonSafe(config.LOCAL_AGENT_LAST_ACTION, null);
  const latestDesktopAction = readJsonSafe(config.LOCAL_AGENT_LAST_DESKTOP_ACTION, null);
  const latestObserverAction = readJsonSafe(LAST_OBSERVER_ACTION, null);
  const snapshot = {
    generated_at: new Date().toISOString(),
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    bridge_status: extra.bridge_status || "ready",
    agent_status: extra.agent_status || "idle",
    active_runtime: {
      entrypoint: "start_mikage.bat",
      hub: "MIKAGE/index.js",
      queue_runtime: "runtime/drive_queue/runtime.js",
      worker: "runtime/colab_worker/colab_one_click_worker.ipynb",
    },
    pending_actions_count: Array.isArray(pending.pending) ? pending.pending.length : 0,
    latest_completed_action: latestReport ? latestReport.action : null,
    last_action: latestReviewedAction ? latestReviewedAction.intent.action : null,
    approval_status: latestReviewedAction ? latestReviewedAction.approval_decision.approval_status : null,
    result_status: latestReviewedAction ? latestReviewedAction.execution_result.status : null,
    desktop_status: latestDesktopAction ? latestDesktopAction.status : null,
    last_desktop_action: latestDesktopAction ? latestDesktopAction.action : null,
    last_opened_apps: latestDesktopAction ? (latestDesktopAction.opened_apps || []) : [],
    last_opened_urls: latestDesktopAction ? (latestDesktopAction.opened_urls || []) : [],
    last_focused_window: latestDesktopAction ? (latestDesktopAction.focused_window || null) : null,
    last_sent_keys: latestDesktopAction ? (latestDesktopAction.sent_keys || null) : null,
    last_typed_text_hash: latestDesktopAction ? (latestDesktopAction.typed_text_hash || null) : null,
    last_tab_target: latestDesktopAction ? (latestDesktopAction.tab_target || null) : null,
    last_click_action: latestDesktopAction ? (latestDesktopAction.click_action || null) : null,
    active_window: latestObserverAction ? (latestObserverAction.active_window || null) : null,
    open_windows: latestObserverAction ? (latestObserverAction.open_windows || []) : [],
    browser_context: latestObserverAction ? (latestObserverAction.browser_context || null) : null,
    last_verified_window: latestObserverAction ? (latestObserverAction.last_verified_window || null) : null,
    last_verified_tab: latestObserverAction ? (latestObserverAction.last_verified_tab || null) : null,
    desktop_state_last_capture: latestObserverAction ? (latestObserverAction.desktop_state_last_capture || null) : null,
    machine_profile: {
      repo_root: config.MACHINE_PROFILE.repo_root,
      browser_profile_name: config.MACHINE_PROFILE.browser_profile_name,
      localhost_ports: config.MACHINE_PROFILE.localhost_ports,
      desktop_resolution: config.MACHINE_PROFILE.desktop_resolution,
      monitor_layout: config.MACHINE_PROFILE.monitor_layout,
    },
    repo_state: {
      dirty: repoState.dirty,
      branch: repoState.branch,
      changed_files: repoState.files.slice(0, 50),
    },
    disk_scan_summary: latestDiskScan ? {
      candidate_count: latestDiskScan.candidate_count,
    } : null,
  };
  writeJson(config.SYSTEM_RUNTIME_SNAPSHOT, snapshot);
  return snapshot;
}

module.exports = {
  writeSnapshot,
};
