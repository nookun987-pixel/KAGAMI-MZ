"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const config = require("./config");
const {
  normalizeWindowList,
  inferBrowserContext,
  verifyWindowTarget,
  verifyTabTarget,
} = require("./window_state");

const LAST_OBSERVER_ACTION = path.join(config.LOCAL_AGENT_STATE_DIR, "latest_desktop_observer_action.json");

function ensureObserverDirs() {
  fs.mkdirSync(config.LOCAL_AGENT_REPORTS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(LAST_OBSERVER_ACTION), { recursive: true });
}

function writeObserverReport(record) {
  ensureObserverDirs();
  const reportPath = path.join(config.LOCAL_AGENT_REPORTS_DIR, `${record.command_id || `observer_${Date.now()}`}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(record, null, 2), "utf8");
  fs.writeFileSync(LAST_OBSERVER_ACTION, JSON.stringify(record, null, 2), "utf8");
  return reportPath;
}

function defaultCollectWindowState() {
  const script = [
    "$typeDef = @\"",
    "using System;",
    "using System.Runtime.InteropServices;",
    "using System.Text;",
    "public static class WinApi {",
    "  [DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();",
    "  [DllImport(\"user32.dll\", CharSet=CharSet.Auto)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);",
    "}",
    "\"@;",
    "Add-Type -TypeDefinition $typeDef;",
    "$sb = New-Object System.Text.StringBuilder 1024;",
    "$hwnd = [WinApi]::GetForegroundWindow();",
    "[void][WinApi]::GetWindowText($hwnd, $sb, $sb.Capacity);",
    "$activeTitle = $sb.ToString();",
    "$windows = Get-Process | Where-Object { $_.MainWindowTitle -and $_.MainWindowTitle.Trim().Length -gt 0 } | ForEach-Object {",
    "  [PSCustomObject]@{ title = $_.MainWindowTitle; process = $_.ProcessName; pid = $_.Id }",
    "};",
    "$payload = [PSCustomObject]@{ active_title = $activeTitle; windows = $windows };",
    "$payload | ConvertTo-Json -Depth 5 -Compress",
  ].join("\n");
  const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(result.stderr ? String(result.stderr).trim() : `observer_collect_failed:${result.status}`);
  }
  const rawStdout = String(result.stdout || "{}");
  const sanitizedStdout = rawStdout.replace(/[\u0000-\u001F]/g, (char) => {
    if (char === "\r" || char === "\n" || char === "\t") return char;
    return "";
  }).trim();
  return JSON.parse(sanitizedStdout || "{}");
}

function collectState(options = {}) {
  const collector = options.collectWindowState || defaultCollectWindowState;
  const raw = collector();
  const windows = normalizeWindowList(raw.windows);
  const activeWindow = windows.find((entry) => entry.title === raw.active_title) || {
    title: String(raw.active_title || "").trim(),
    process: "",
    pid: null,
  };
  const browserContext = inferBrowserContext(activeWindow, windows);
  return {
    active_window: activeWindow,
    open_windows: windows,
    browser_context: browserContext,
  };
}

function finalizeObserverRecord(baseRecord, state, updates = {}) {
  const record = {
    ...baseRecord,
    status: updates.status || "PASS",
    active_window: state.active_window,
    open_windows: state.open_windows,
    browser_context: state.browser_context,
    last_verified_window: updates.last_verified_window || null,
    last_verified_tab: updates.last_verified_tab || null,
    desktop_state_last_capture: new Date().toISOString(),
    result_summary: updates.result_summary || "desktop observer read complete",
    error: updates.error || null,
    finished_at: new Date().toISOString(),
  };
  const reportPath = writeObserverReport(record);
  return {
    status: record.status,
    report_path: reportPath,
    active_window: record.active_window,
    open_windows: record.open_windows,
    browser_context: record.browser_context,
    last_verified_window: record.last_verified_window,
    last_verified_tab: record.last_verified_tab,
    desktop_state_last_capture: record.desktop_state_last_capture,
    result_summary: record.result_summary,
  };
}

function buildBase(action, params, commandId) {
  return {
    command_id: commandId || null,
    action,
    params,
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    started_at: new Date().toISOString(),
  };
}

function getActiveWindow(params = {}, options = {}) {
  const state = collectState(options);
  return finalizeObserverRecord(buildBase("desktop.get_active_window", params, options.commandId), state, {
    result_summary: state.active_window && state.active_window.title ? "active window detected" : "active window unavailable",
  });
}

function listOpenWindows(params = {}, options = {}) {
  const state = collectState(options);
  return finalizeObserverRecord(buildBase("desktop.list_open_windows", params, options.commandId), state, {
    result_summary: `listed ${state.open_windows.length} windows`,
  });
}

function getBrowserContext(params = {}, options = {}) {
  const state = collectState(options);
  return finalizeObserverRecord(buildBase("desktop.get_browser_context", params, options.commandId), state, {
    result_summary: state.browser_context.target ? `browser context ${state.browser_context.target}` : "browser context unknown",
    last_verified_tab: state.browser_context.target || null,
  });
}

function verifyWindow(params = {}, options = {}) {
  const state = collectState(options);
  const verification = verifyWindowTarget(params.target, state.active_window, state.open_windows);
  return finalizeObserverRecord(buildBase("desktop.verify_window", params, options.commandId), state, {
    status: verification.matched ? "PASS" : "BLOCKED",
    result_summary: verification.reason,
    last_verified_window: verification.target,
  });
}

function verifyTab(params = {}, options = {}) {
  const state = collectState(options);
  const verification = verifyTabTarget(params.target, state.browser_context);
  return finalizeObserverRecord(buildBase("desktop.verify_tab", params, options.commandId), state, {
    status: verification.matched ? "PASS" : "BLOCKED",
    result_summary: verification.reason,
    last_verified_tab: verification.target,
  });
}

function captureDesktopState(params = {}, options = {}) {
  const state = collectState(options);
  return finalizeObserverRecord(buildBase("desktop.capture_desktop_state", params, options.commandId), state, {
    result_summary: "desktop state captured",
  });
}

module.exports = {
  LAST_OBSERVER_ACTION,
  collectState,
  getActiveWindow,
  listOpenWindows,
  getBrowserContext,
  verifyWindow,
  verifyTab,
  captureDesktopState,
};
