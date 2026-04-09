"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { governedSpawnSync } = require("./process_governor");
const desktopOperator = require("./local_control_agent/desktop_operator");
const desktopObserver = require("./local_control_agent/desktop_observer");

const WEB_TASK_TYPES = new Set([
  "web_status_check",
  "dashboard_read",
  "grant_research",
  "sponsorship_research",
  "page_capture",
  "form_prepare",
  "cloud_console_inspect",
]);
const SENSITIVE_PATTERNS = [
  /\b(submit|approve payment|purchase|buy|delete account|remove account)\b/i,
  /\b(gui|dang\s*nhap|login|sign\s*in|submit|xac\s*nhan|thanh\s*toan|mua)\b/i,
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function runtimeDir() {
  const dir = path.join(config.STATE_DIR, "web_ops_runtime");
  ensureDir(dir);
  return dir;
}

function writeArtifact(jobId, suffix, value) {
  const filePath = path.join(runtimeDir(), `${jobId}.${suffix}`);
  fs.writeFileSync(filePath, value, "utf8");
  return filePath;
}

function writeJsonArtifact(jobId, suffix, value) {
  const filePath = path.join(runtimeDir(), `${jobId}.${suffix}.json`);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
  return filePath;
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapePowerShellSingleQuoted(value) {
  return String(value || "").replace(/'/g, "''");
}

function extractUrls(text, fallback = []) {
  const fromText = String(text || "").match(/https?:\/\/[^\s"'<>]+/gi) || [];
  return unique([...(fallback || []), ...fromText]);
}

function isSensitiveObjective(objective) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(String(objective || "")));
}

function buildSuccess(jobId, taskId, summary, extras = {}) {
  return {
    outcome: "success",
    job_id: jobId,
    task_id: taskId,
    changed_files: extras.changed_files || [],
    tests_executed: extras.tests_executed || [],
    tests_passed: extras.tests_passed || [],
    tests_failed: extras.tests_failed || [],
    artifacts_returned: unique(extras.artifacts_returned || []),
    summary,
    raw_result_ref: extras.raw_result_ref || null,
    completed_at: new Date().toISOString(),
  };
}

function buildFailure(jobId, taskId, reason, retryable = false, extras = {}) {
  return {
    outcome: "failure",
    job_id: jobId,
    task_id: taskId,
    failure_stage: extras.failure_stage || "web_ops_execution",
    failure_type: reason,
    retryable,
    summary: extras.summary || reason,
    raw_failure_ref: extras.raw_failure_ref || null,
    failed_at: new Date().toISOString(),
  };
}

function buildActionLog(jobId, dispatch, actions) {
  return writeJsonArtifact(jobId, "action_log", {
    job_id: jobId,
    task_id: dispatch.task_id,
    task_type: dispatch.task_type,
    objective: dispatch.implementation_brief && dispatch.implementation_brief.what_to_build || "",
    actions,
    generated_at: new Date().toISOString(),
  });
}

async function fetchUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "user-agent": "MIKAGE-WebOps/1.0",
        "accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    const text = await response.text();
    return {
      ok: true,
      url: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      text,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function fetchUrlWithPowerShell(url) {
  const script = [
    "$ProgressPreference = 'SilentlyContinue'",
    `$response = Invoke-WebRequest -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30 -Uri '${escapePowerShellSingleQuoted(url)}'`,
    "$payload = [PSCustomObject]@{",
    "  url = $response.BaseResponse.ResponseUri.AbsoluteUri",
    "  status = [int]$response.StatusCode",
    "  text = $response.Content",
    "}",
    "$payload | ConvertTo-Json -Depth 4 -Compress",
  ].join("\n");
  const run = governedSpawnSync({
    command: "powershell.exe",
    args: ["-NoProfile", "-Command", script],
    cwd: config.ROOT,
    timeout_ms: 45000,
    windowsHide: true,
    visible_window: false,
    owner_module: "web_ops_backend",
    singleton_key: `web_fetch:${Buffer.from(url).toString("hex").slice(0, 16)}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  if (run.status !== "PASS") {
    return {
      ok: false,
      error: run.reason || (run.result && run.result.stderr_preview) || "powershell_fetch_failed",
    };
  }
  try {
    const parsed = JSON.parse(String(run.result && run.result.stdout || "{}").trim());
    return {
      ok: true,
      url: parsed.url || url,
      status: Number(parsed.status || 0),
      headers: {},
      text: String(parsed.text || ""),
    };
  } catch (error) {
    return {
      ok: false,
      error: `powershell_fetch_parse_failed:${error.message}`,
    };
  }
}

function extractTitle(html) {
  const match = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return normalizeText(match && match[1] || "");
}

function stripHtml(html) {
  return normalizeText(String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&"));
}

function extractLinks(html, limit = 12) {
  const links = [];
  const pattern = /href\s*=\s*["']([^"'#]+)["']/gi;
  let match = null;
  while ((match = pattern.exec(String(html || ""))) && links.length < limit) {
    links.push(match[1]);
  }
  return unique(links);
}

async function inspectFetchedPage(jobId, url, mode = "inspect") {
  let fetched = await fetchUrl(url);
  if (!fetched.ok) {
    fetched = fetchUrlWithPowerShell(url);
  }
  if (!fetched.ok) {
    return {
      status: "FAIL",
      reason: "page_fetch_failed",
      summary: `failed to fetch ${url}: ${fetched.error}`,
      raw_failure_ref: null,
      artifacts: [],
    };
  }
  const title = extractTitle(fetched.text);
  const text = stripHtml(fetched.text);
  const links = extractLinks(fetched.text);
  const htmlRef = writeArtifact(jobId, `${mode}.html`, fetched.text);
  const metaRef = writeJsonArtifact(jobId, `${mode}.meta`, {
    requested_url: url,
    final_url: fetched.url,
    status: fetched.status,
    title,
    text_preview: text.slice(0, 500),
    links,
    captured_at: new Date().toISOString(),
  });
  return {
    status: "PASS",
    title,
    status_code: fetched.status,
    final_url: fetched.url,
    text_preview: text.slice(0, 240),
    links,
    raw_result_ref: metaRef,
    artifacts: [htmlRef, metaRef],
  };
}

function summarizePageInspection(label, inspection) {
  return `${label}: status=${inspection.status_code} title=${inspection.title || "n/a"} url=${inspection.final_url}`;
}

async function runReadOnlyWebTask(dispatch, handoff, taskType, urls) {
  if (!urls.length) {
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "missing_target_url", false, {
      failure_stage: "web_ops_validation",
      summary: "no target url found in objective or scope",
    });
  }
  const limited = urls.slice(0, taskType === "grant_research" || taskType === "sponsorship_research" ? 3 : 1);
  const actions = [];
  const artifacts = [];
  const findings = [];
  for (const url of limited) {
    actions.push({ type: "fetch", url, started_at: new Date().toISOString() });
    const inspection = await inspectFetchedPage(handoff.job_id, url, taskType);
    actions[actions.length - 1].status = inspection.status;
    actions[actions.length - 1].summary = inspection.summary || inspection.text_preview || null;
    artifacts.push(...(inspection.artifacts || []));
    if (inspection.status !== "PASS") {
      const actionLogRef = buildActionLog(handoff.job_id, dispatch, actions);
      return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, inspection.reason, false, {
        failure_stage: "page_fetch",
        raw_failure_ref: inspection.raw_failure_ref || actionLogRef,
        summary: inspection.summary,
      });
    }
    findings.push(inspection);
  }
  const actionLogRef = buildActionLog(handoff.job_id, dispatch, actions);
  artifacts.push(actionLogRef);
  const summaryPrefixMap = {
    web_status_check: "web status checked",
    dashboard_read: "dashboard read complete",
    grant_research: "grant research collected",
    sponsorship_research: "sponsorship research collected",
    page_capture: "page capture complete",
  };
  const summary = taskType === "grant_research" || taskType === "sponsorship_research"
    ? `${summaryPrefixMap[taskType]}: ${findings.map((item) => item.title || item.final_url).join(" | ")}`
    : summarizePageInspection(summaryPrefixMap[taskType] || "web task complete", findings[0]);
  return buildSuccess(handoff.job_id, handoff.task_id || dispatch.task_id, summary, {
    artifacts_returned: artifacts,
    raw_result_ref: findings[0] && findings[0].raw_result_ref || actionLogRef,
  });
}

function runDesktopWebTask(dispatch, handoff, taskType, urls) {
  const objective = dispatch.implementation_brief && dispatch.implementation_brief.what_to_build || "";
  if (isSensitiveObjective(objective) && taskType !== "form_prepare") {
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "sensitive_web_action_blocked", false, {
      failure_stage: "web_ops_validation",
      summary: "sensitive web action blocked by policy",
    });
  }
  const url = urls[0];
  if (!url) {
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "missing_target_url", false, {
      failure_stage: "web_ops_validation",
      summary: "no target url found for browser task",
    });
  }
  const actions = [];
  const artifacts = [];
  actions.push({ type: "open_tab", url, started_at: new Date().toISOString() });
  const opened = desktopOperator.openTab({ url }, { commandId: `${handoff.job_id}_open_tab` });
  actions[actions.length - 1].status = opened.status;
  actions[actions.length - 1].report_path = opened.report_path || null;
  if (opened.report_path) artifacts.push(opened.report_path);
  if (opened.status !== "PASS") {
    const actionLogRef = buildActionLog(handoff.job_id, dispatch, actions);
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "browser_open_failed", false, {
      failure_stage: "browser_open",
      raw_failure_ref: actionLogRef,
      summary: opened.result_summary || "failed to open target page",
    });
  }
  actions.push({ type: "capture_desktop_state", started_at: new Date().toISOString() });
  const observed = desktopObserver.captureDesktopState({}, { commandId: `${handoff.job_id}_capture_state` });
  actions[actions.length - 1].status = observed.status;
  actions[actions.length - 1].report_path = observed.report_path || null;
  if (observed.report_path) artifacts.push(observed.report_path);
  const actionLogRef = buildActionLog(handoff.job_id, dispatch, actions);
  artifacts.push(actionLogRef);
  if (observed.status !== "PASS") {
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "desktop_state_capture_failed", false, {
      failure_stage: "browser_observe",
      raw_failure_ref: actionLogRef,
      summary: observed.result_summary || "browser page opened but state capture failed",
    });
  }
  const summaryMap = {
    form_prepare: "form prepared without submit",
    cloud_console_inspect: "cloud console inspected",
  };
  return buildSuccess(handoff.job_id, handoff.task_id || dispatch.task_id, `${summaryMap[taskType]}: ${url}`, {
    artifacts_returned: artifacts,
    raw_result_ref: actionLogRef,
  });
}

async function executeDispatch(dispatch, handoff = {}) {
  const taskType = String(dispatch.task_type || "").trim();
  if (!WEB_TASK_TYPES.has(taskType)) {
    return buildFailure(handoff.job_id, handoff.task_id || dispatch.task_id, "unsupported_web_task_type", false, {
      failure_stage: "web_ops_validation",
    });
  }
  const objective = dispatch.implementation_brief && dispatch.implementation_brief.what_to_build || "";
  const urls = extractUrls(objective, dispatch.scope_in || []);
  if (taskType === "form_prepare" || taskType === "cloud_console_inspect") {
    return runDesktopWebTask(dispatch, handoff, taskType, urls);
  }
  return runReadOnlyWebTask(dispatch, handoff, taskType, urls);
}

module.exports = {
  WEB_TASK_TYPES,
  executeDispatch,
};
