"use strict";

const { normalizeObjectiveText, isDestructiveObjective, isVagueObjective, routeOperatorIntent } = require("./task_goal_registry");

const WEB_TASK_TYPES = new Set([
  "web_status_check",
  "dashboard_read",
  "grant_research",
  "sponsorship_research",
  "page_capture",
  "form_prepare",
  "cloud_console_inspect",
]);
const DEV_WRITE_TASK_TYPES = new Set(["add_module", "patch_bug", "add_test", "refactor_safe", "docs_update"]);

const DEFAULT_SCOPE_OUT = [
  "start_mikage.bat",
  "MIKAGE/index.js",
  "runtime/drive_queue/runtime.js",
  "runtime/colab_worker/*",
];

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function extractUrls(text) {
  return unique(String(text || "").match(/https?:\/\/[^\s"'<>]+/gi) || []);
}

function extractRepoPaths(text) {
  const matches = String(text || "").match(/\b(?:control_plane|tests|docs|state)\/[A-Za-z0-9_./-]+\b/g) || [];
  return unique(matches.map((item) => item.replace(/\\/g, "/")));
}

function inferDevTaskType(text) {
  const normalized = normalizeObjectiveText(text).toLowerCase();
  if (/\b(test|spec|coverage|assert)\b/.test(normalized)) return "add_test";
  if (/\b(doc|docs|readme|guide|handoff)\b/.test(normalized)) return "docs_update";
  if (/\b(refactor|normalize|restructure|organize)\b/.test(normalized)) return "refactor_safe";
  if (/\b(fix|patch|repair|resolve|parser|bug)\b/.test(normalized)) return "patch_bug";
  return "add_module";
}

function inferWebTaskType(text) {
  const normalized = normalizeObjectiveText(text).toLowerCase();
  if (/\b(grant|funding)\b/.test(normalized)) return "grant_research";
  if (/\b(sponsor|sponsorship|tai\s*tro)\b/.test(normalized)) return "sponsorship_research";
  if (/\b(cloud\s*console|console)\b/.test(normalized)) return "cloud_console_inspect";
  if (/\b(form)\b/.test(normalized)) return "form_prepare";
  if (/\b(capture|screenshot|snapshot|page capture|chup\s*trang|luu\s*trang)\b/.test(normalized)) return "page_capture";
  if (/\b(dashboard|bang\s*dieu\s*khien)\b/.test(normalized)) return "dashboard_read";
  return "web_status_check";
}

function inferLane(text, routed) {
  if (WEB_TASK_TYPES.has(String(routed.task_type || ""))) return "web_ops";
  if (String(routed.task_type || "") === "operator_action") return "dev_read";
  if (DEV_WRITE_TASK_TYPES.has(String(routed.task_type || ""))) return "dev_write";
  const normalized = normalizeObjectiveText(text).toLowerCase();
  if (/\b(web|url|http|https|grant|sponsor|dashboard|console|cloud|form)\b/.test(normalized)) return "web_ops";
  return "dev_read";
}

function buildLaneDefaults(lane, taskType, normalizedInput, urls, repoPaths) {
  if (lane === "web_ops") {
    const scopeIn = urls.length ? urls : [`web:${taskType}`];
    const successByType = {
      web_status_check: [
        "target web status inspected",
        "response status and short summary returned",
        "artifacts captured explicitly",
      ],
      dashboard_read: [
        "dashboard content inspected",
        "short operator summary returned",
        "artifacts captured explicitly",
      ],
      grant_research: [
        "grant research findings collected",
        "source links captured",
        "short structured summary returned",
      ],
      sponsorship_research: [
        "sponsorship research findings collected",
        "source links captured",
        "short structured summary returned",
      ],
      page_capture: [
        "page capture artifact returned",
        "page summary returned",
        "captured links are explicit",
      ],
      form_prepare: [
        "form target prepared without submit",
        "action log recorded",
        "no sensitive submit executed",
      ],
      cloud_console_inspect: [
        "console target inspected or opened",
        "action log recorded",
        "no uncontrolled console mutation executed",
      ],
    };
    return {
      scope_in: scopeIn,
      target_files: [],
      tests_required: [],
      success_criteria: successByType[taskType] || [
        "web task completed under bounded execution",
        "artifacts captured explicitly",
      ],
    };
  }
  if (lane === "dev_read") {
    return {
      scope_in: repoPaths.length ? repoPaths : ["control_plane", "control_plane/commander_bridge/state"],
      target_files: repoPaths,
      tests_required: ["node MIKAGE\\mikage.test.js"],
      success_criteria: [
        "requested state inspected",
        "short structured summary returned",
        "no unrestricted repo mutation performed",
      ],
    };
  }
  return {
    scope_in: repoPaths.length ? repoPaths : ["control_plane/"],
    target_files: repoPaths,
    tests_required: ["node MIKAGE\\mikage.test.js"],
    success_criteria: [
      "bounded implementation completed",
      "required tests pass",
      "changed files stay within approved targets",
    ],
  };
}

function routeOperatorCommand(input = "", overrides = {}) {
  const normalizedInput = normalizeObjectiveText(input);
  const operatorRoute = routeOperatorIntent(normalizedInput);
  const urls = extractUrls(normalizedInput);
  const repoPaths = extractRepoPaths(normalizedInput);
  const inferredTaskType = urls.length ? inferWebTaskType(normalizedInput) : inferDevTaskType(normalizedInput);
  const routeProvidedType = operatorRoute.matched || operatorRoute.safe_fallback
    ? operatorRoute.task_type
    : null;
  const taskType = String(overrides.task_type || routeProvidedType || inferredTaskType || "").trim() || "operator_action";
  const routeSeed = {
    ...operatorRoute,
    task_type: taskType,
  };
  const lane = overrides.executor_lane || inferLane(normalizedInput, routeSeed);
  const defaults = buildLaneDefaults(lane, routeSeed.task_type, normalizedInput, urls, repoPaths);
  return {
    matched: Boolean(operatorRoute.matched),
    safe_fallback: Boolean(operatorRoute.safe_fallback),
    normalized_input: normalizedInput,
    route_reason: operatorRoute.route_reason || `lane:${lane}`,
    internal_action: operatorRoute.internal_action || null,
    executor_lane: lane,
    task_type: routeSeed.task_type,
    title: overrides.title || operatorRoute.title || normalizedInput.slice(0, 80),
    scope_in: overrides.scope_in || ((lane === "web_ops" && urls.length) ? defaults.scope_in : (operatorRoute.scope_in || defaults.scope_in)),
    scope_out: overrides.scope_out || DEFAULT_SCOPE_OUT,
    target_files: overrides.target_files || ((lane === "dev_write" && repoPaths.length) ? defaults.target_files : (operatorRoute.target_files || defaults.target_files)),
    success_criteria: overrides.success_criteria || operatorRoute.success_criteria || defaults.success_criteria,
    tests_required: overrides.tests_required || operatorRoute.tests_required || defaults.tests_required,
    inferred_urls: urls,
    inferred_paths: repoPaths,
    blocked: !normalizedInput || isDestructiveObjective(normalizedInput) || isVagueObjective(normalizedInput),
    blocked_reason: !normalizedInput
      ? "missing_objective"
      : isDestructiveObjective(normalizedInput)
        ? "destructive_objective_blocked"
        : (isVagueObjective(normalizedInput) ? "vague_objective" : null),
  };
}

module.exports = {
  WEB_TASK_TYPES,
  DEV_WRITE_TASK_TYPES,
  routeOperatorCommand,
  extractUrls,
  extractRepoPaths,
};
