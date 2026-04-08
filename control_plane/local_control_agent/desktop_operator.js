"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync, execSync } = require("child_process");
const crypto = require("crypto");

const config = require("./config");
const { getAppTarget, getFocusTitle, getTabTarget } = require("./window_registry");
const { buildStartupWorkspacePlan, buildStartupWorkspaceFullPlan } = require("./startup_workspace");

function ensureReportDirs() {
  fs.mkdirSync(config.LOCAL_AGENT_REPORTS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(config.LOCAL_AGENT_LAST_DESKTOP_ACTION), { recursive: true });
}

function reportFilePath(commandId, fallbackPrefix = "desktop") {
  const base = commandId || `${fallbackPrefix}_${Date.now()}`;
  return path.join(config.LOCAL_AGENT_REPORTS_DIR, `${base}.json`);
}

function writeDesktopReport(record) {
  ensureReportDirs();
  const reportPath = reportFilePath(record.command_id, "desktop");
  fs.writeFileSync(reportPath, JSON.stringify(record, null, 2), "utf8");
  fs.writeFileSync(config.LOCAL_AGENT_LAST_DESKTOP_ACTION, JSON.stringify(record, null, 2), "utf8");
  return reportPath;
}

function defaultStartProcess(target, args = []) {
  return spawnSync("cmd", ["/c", "start", "", target, ...args], {
    windowsHide: true,
    stdio: "ignore",
  });
}

function defaultPowerShell(script) {
  return spawnSync("powershell.exe", ["-NoProfile", "-Command", script], {
    windowsHide: true,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function escapePowerShellSingleQuoted(value) {
  return String(value || "").replace(/'/g, "''");
}

function escapeSendKeysText(text) {
  return String(text || "").replace(/([+^%~(){}[\]])/g, "{$1}");
}

const KEY_MAP = {
  "ctrl+l": "^l",
  "ctrl+t": "^t",
  "ctrl+tab": "^{TAB}",
  "ctrl+shift+tab": "^+{TAB}",
  "enter": "{ENTER}",
  "alt+tab": "%{TAB}",
  "esc": "{ESC}",
  "tab": "{TAB}",
};

function buildRecordBase(action, params, commandId) {
  return {
    command_id: commandId || null,
    action,
    params,
    machine_id: config.MACHINE_PROFILE.machine_id,
    node_role: config.NODE_ROLE.role_id,
    started_at: new Date().toISOString(),
  };
}

function finalizeRecord(record, updates) {
  const finalRecord = {
    ...record,
    ...updates,
    finished_at: new Date().toISOString(),
  };
  const reportPath = writeDesktopReport(finalRecord);
  return {
    status: finalRecord.status,
    report_path: reportPath,
    opened_targets: finalRecord.opened_targets || [],
    opened_apps: finalRecord.opened_apps || [],
    opened_urls: finalRecord.opened_urls || [],
    focused_window: finalRecord.focused_window || null,
    sent_keys: finalRecord.sent_keys || null,
    typed_text_hash: finalRecord.typed_text_hash || null,
    tab_target: finalRecord.tab_target || null,
    click_action: finalRecord.click_action || null,
    stdout_preview: finalRecord.stdout_preview || "",
    result_summary: finalRecord.result_summary,
  };
}

function openApp(params = {}, options = {}) {
  const target = getAppTarget(params.app);
  const record = buildRecordBase("desktop.open_app", params, options.commandId);
  if (!target) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "unsupported_app",
      opened_targets: [],
      error: `unsupported_app:${params.app || ""}`,
    });
  }
  const launcher = options.startProcess || defaultStartProcess;
  const launchResult = launcher(target.app, target.args);
  if (launchResult && typeof launchResult.status === "number" && launchResult.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "app_open_failed",
      opened_targets: [],
      error: launchResult.stderr ? String(launchResult.stderr) : `exit_${launchResult.status}`,
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: `opened ${params.app}`,
    opened_targets: [params.app],
    opened_apps: [params.app],
    opened_urls: [],
  });
}

function openUrl(params = {}, options = {}) {
  const url = String(params.url || "").trim();
  const record = buildRecordBase("desktop.open_url", params, options.commandId);
  if (!url) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "missing_url",
      opened_targets: [],
      error: "missing_url",
    });
  }
  const launcher = options.startProcess || defaultStartProcess;
  const launchResult = launcher("chrome", [url]);
  if (launchResult && typeof launchResult.status === "number" && launchResult.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "url_open_failed",
      opened_targets: [],
      error: launchResult.stderr ? String(launchResult.stderr) : `exit_${launchResult.status}`,
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "opened url",
    opened_targets: [url],
    opened_apps: ["chrome"],
    opened_urls: [url],
  });
}

function startupWorkspace(params = {}, options = {}) {
  const plan = buildStartupWorkspacePlan();
  const record = buildRecordBase("desktop.startup_workspace", params, options.commandId);
  const launcher = options.startProcess || defaultStartProcess;
  const openedApps = [];
  const openedUrls = [];
  for (const app of plan.apps) {
    const target = getAppTarget(app.app);
    if (!target) continue;
    launcher(target.app, target.args);
    openedApps.push(app.app);
  }
  for (const url of plan.urls) {
    launcher("chrome", [url]);
    openedUrls.push(url);
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "startup workspace opened",
    opened_targets: [...openedApps, ...openedUrls],
    opened_apps: openedApps,
    opened_urls: openedUrls,
  });
}

function startupWorkspaceFull(params = {}, options = {}) {
  const plan = buildStartupWorkspaceFullPlan();
  const record = buildRecordBase("desktop.startup_workspace_full", params, options.commandId);
  const launcher = options.startProcess || defaultStartProcess;
  const openedApps = [];
  const openedUrls = [];
  for (const app of plan.apps) {
    const target = getAppTarget(app.app);
    if (!target) continue;
    launcher(target.app, target.args);
    openedApps.push(app.app);
  }
  for (const url of plan.urls) {
    launcher("chrome", [url]);
    openedUrls.push(url);
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "startup workspace full opened",
    opened_targets: [...openedApps, ...openedUrls],
    opened_apps: openedApps,
    opened_urls: openedUrls,
    tab_target: openedUrls.length ? "workspace_full" : null,
  });
}

function readApprovalModel() {
  return JSON.parse(fs.readFileSync(config.APPROVAL_MODEL, "utf8"));
}

function validateShellCommand(commandText) {
  const normalized = ` ${String(commandText || "").toLowerCase()} `;
  const policy = readApprovalModel();
  const blockedPatterns = (((policy.hard_block || {})["desktop.run_shell"] || {}).blocked_patterns) || [];
  const matched = blockedPatterns.find((pattern) => normalized.includes(String(pattern).toLowerCase()));
  if (matched) {
    throw new Error(`blocked_shell_pattern:${matched.trim()}`);
  }
}

function validateKeys(keys) {
  const normalized = String(keys || "").trim().toLowerCase();
  const policy = readApprovalModel();
  const blockedKeys = (((policy.hard_block || {})["desktop.send_keys"] || {}).blocked_keys) || [];
  if (blockedKeys.includes(normalized)) {
    throw new Error(`blocked_key_combo:${normalized}`);
  }
  if (!KEY_MAP[normalized]) {
    throw new Error(`unsupported_key_combo:${normalized}`);
  }
  return normalized;
}

function focusWindow(params = {}, options = {}) {
  const target = String(params.target || "").trim().toLowerCase();
  const title = getFocusTitle(target);
  const record = buildRecordBase("desktop.focus_window", params, options.commandId);
  if (!title) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "unsupported_focus_target",
      opened_targets: [],
      error: `unsupported_focus_target:${target}`,
    });
  }
  const executor = options.uiExecutor || defaultPowerShell;
  const script = `$ws = New-Object -ComObject WScript.Shell; if (-not $ws.AppActivate('${escapePowerShellSingleQuoted(title)}')) { exit 1 }`;
  const result = executor(script);
  if (result && typeof result.status === "number" && result.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "focus_window_failed",
      opened_targets: [],
      focused_window: target,
      error: result.stderr ? String(result.stderr) : `exit_${result.status}`,
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: `focused ${target}`,
    opened_targets: [target],
    focused_window: target,
    opened_apps: [],
    opened_urls: [],
  });
}

function sendKeys(params = {}, options = {}) {
  const record = buildRecordBase("desktop.send_keys", params, options.commandId);
  try {
    const normalized = validateKeys(params.keys);
    const executor = options.uiExecutor || defaultPowerShell;
    const script = `$ws = New-Object -ComObject WScript.Shell; $ws.SendKeys('${escapePowerShellSingleQuoted(KEY_MAP[normalized])}')`;
    const result = executor(script);
    if (result && typeof result.status === "number" && result.status !== 0) {
      throw new Error(result.stderr ? String(result.stderr) : `exit_${result.status}`);
    }
    return finalizeRecord(record, {
      status: "PASS",
      result_summary: "keys sent",
      opened_targets: [],
      sent_keys: normalized,
      opened_apps: [],
      opened_urls: [],
    });
  } catch (error) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "send_keys_failed",
      opened_targets: [],
      sent_keys: String(params.keys || "").trim().toLowerCase(),
      error: error.message,
      opened_apps: [],
      opened_urls: [],
    });
  }
}

function typeText(params = {}, options = {}) {
  const text = String(params.text || "");
  const record = buildRecordBase("desktop.type_text", params, options.commandId);
  if (!text) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "missing_text",
      opened_targets: [],
      error: "missing_text",
    });
  }
  const executor = options.uiExecutor || defaultPowerShell;
  const script = `$ws = New-Object -ComObject WScript.Shell; $ws.SendKeys('${escapePowerShellSingleQuoted(escapeSendKeysText(text))}')`;
  const result = executor(script);
  if (result && typeof result.status === "number" && result.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "type_text_failed",
      opened_targets: [],
      typed_text_hash: crypto.createHash("sha256").update(text).digest("hex"),
      error: result.stderr ? String(result.stderr) : `exit_${result.status}`,
      opened_apps: [],
      opened_urls: [],
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "text typed",
    opened_targets: [],
    typed_text_hash: crypto.createHash("sha256").update(text).digest("hex"),
    opened_apps: [],
    opened_urls: [],
  });
}

function openTab(params = {}, options = {}) {
  const url = String(params.url || "").trim();
  const record = buildRecordBase("desktop.open_tab", params, options.commandId);
  if (!url) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "missing_url",
      opened_targets: [],
      error: "missing_url",
    });
  }
  const launcher = options.startProcess || defaultStartProcess;
  const launchResult = launcher("chrome", ["--new-tab", url]);
  if (launchResult && typeof launchResult.status === "number" && launchResult.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "open_tab_failed",
      opened_targets: [],
      error: launchResult.stderr ? String(launchResult.stderr) : `exit_${launchResult.status}`,
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "opened tab",
    opened_targets: [url],
    opened_apps: ["chrome"],
    opened_urls: [url],
    tab_target: url,
  });
}

function switchTab(params = {}, options = {}) {
  const target = String(params.target || "").trim().toLowerCase();
  const url = getTabTarget(target);
  const record = buildRecordBase("desktop.switch_tab", params, options.commandId);
  if (!url) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "unsupported_tab_target",
      opened_targets: [],
      error: `unsupported_tab_target:${target}`,
    });
  }
  const launcher = options.startProcess || defaultStartProcess;
  const launchResult = launcher("chrome", [url]);
  if (launchResult && typeof launchResult.status === "number" && launchResult.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "switch_tab_failed",
      opened_targets: [],
      tab_target: target,
      error: launchResult.stderr ? String(launchResult.stderr) : `exit_${launchResult.status}`,
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "switched tab target",
    opened_targets: [url],
    opened_apps: ["chrome"],
    opened_urls: [url],
    tab_target: target,
  });
}

function basicClick(params = {}, options = {}) {
  const x = Number(params.x);
  const y = Number(params.y);
  const record = buildRecordBase("desktop.basic_click", params, options.commandId);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "invalid_click_coordinates",
      opened_targets: [],
      error: "invalid_click_coordinates",
    });
  }
  const executor = options.uiExecutor || defaultPowerShell;
  const script = [
    "Add-Type -TypeDefinition @'",
    "using System.Runtime.InteropServices;",
    "public static class MouseOps {",
    "  [DllImport(\"user32.dll\")] public static extern bool SetCursorPos(int X, int Y);",
    "  [DllImport(\"user32.dll\")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);",
    "}",
    "'@;",
    `[MouseOps]::SetCursorPos(${Math.round(x)}, ${Math.round(y)}) | Out-Null;`,
    "[MouseOps]::mouse_event(2,0,0,0,0);",
    "[MouseOps]::mouse_event(4,0,0,0,0);",
  ].join(" ");
  const result = executor(script);
  if (result && typeof result.status === "number" && result.status !== 0) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "basic_click_failed",
      opened_targets: [],
      click_action: { x, y },
      error: result.stderr ? String(result.stderr) : `exit_${result.status}`,
      opened_apps: [],
      opened_urls: [],
    });
  }
  return finalizeRecord(record, {
    status: "PASS",
    result_summary: "basic click executed",
    opened_targets: [],
    click_action: { x, y },
    opened_apps: [],
    opened_urls: [],
  });
}

function runShell(params = {}, options = {}) {
  const commandText = String(params.command || "").trim();
  const record = buildRecordBase("desktop.run_shell", params, options.commandId);
  if (!commandText) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "missing_shell_command",
      opened_targets: [],
      error: "missing_shell_command",
    });
  }

  try {
    validateShellCommand(commandText);
    const executor = options.execShell || ((cmd) => execSync(cmd, {
      cwd: config.ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      shell: "powershell.exe",
    }));
    const stdout = executor(commandText);
    const preview = String(stdout || "").trim().split(/\r?\n/).slice(0, 20).join("\n");
    return finalizeRecord(record, {
      status: "PASS",
      result_summary: "shell command executed",
      opened_targets: [],
      stdout_preview: preview,
      opened_apps: [],
      opened_urls: [],
    });
  } catch (error) {
    return finalizeRecord(record, {
      status: "FAIL",
      result_summary: "shell command failed",
      opened_targets: [],
      error: error.message,
      stdout_preview: "",
      opened_apps: [],
      opened_urls: [],
    });
  }
}

module.exports = {
  openApp,
  openUrl,
  startupWorkspace,
  startupWorkspaceFull,
  focusWindow,
  sendKeys,
  typeText,
  openTab,
  switchTab,
  basicClick,
  runShell,
  validateShellCommand,
  validateKeys,
};
