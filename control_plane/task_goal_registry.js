"use strict";

const SAFE_OPERATOR_PATTERNS = [
  /\b(inspect|check|read|report|build|continue|status|workflow|repo|operator|review|summarize)\b/i,
  /\b(kiem\s*tra|bao\s*cao|doc|xem|trang\s*thai|he\s*thong|workflow|repo|build|tiep|hien\s*tai|ngan)\b/i,
];

const DESTRUCTIVE_PATTERNS = [
  /\b(delete|remove|reset|destroy|drop|wipe|format)\b/i,
  /\b(billing|pay|purchase|buy|invoice)\b/i,
  /\b(xoa|huy|dat\s*lai|pha\s*huy|thanh\s*toan|mua)\b/i,
];

const OPERATOR_INTENT_ROUTES = [
  {
    internal_action: "web_status_check",
    pattern: /\b(web\s*status|status\s*page|trang\s*thai\s*web)\b/i,
    title_prefix: "Web Status Check",
    task_type: "web_status_check",
    scope_in: ["web:status"],
    target_files: [],
    success_criteria: [
      "target web status inspected",
      "response status and short summary returned",
      "no uncontrolled browser loop used",
    ],
    tests_required: [],
  },
  {
    internal_action: "dashboard_read",
    pattern: /\b(dashboard|bang\s*dieu\s*khien)\b.*\b(read|doc|xem|inspect|kiem\s*tra)?\b/i,
    title_prefix: "Dashboard Read",
    task_type: "dashboard_read",
    scope_in: ["web:dashboard"],
    target_files: [],
    success_criteria: [
      "dashboard page inspected",
      "short operator summary returned",
      "links or capture artifacts recorded",
    ],
    tests_required: [],
  },
  {
    internal_action: "grant_research",
    pattern: /\b(grant|tai\s*tro|funding)\b.*\b(research|nghien\s*c[uứ]u|tim)\b|\bnghien\s*c[uứ]u\b.*\bgrant\b/i,
    title_prefix: "Grant Research",
    task_type: "grant_research",
    scope_in: ["web:research:grant"],
    target_files: [],
    success_criteria: [
      "grant research sources collected",
      "short findings returned",
      "captured links are explicit",
    ],
    tests_required: [],
  },
  {
    internal_action: "sponsorship_research",
    pattern: /\b(sponsorship|sponsor|tai\s*tro)\b.*\b(research|nghien\s*c[uứ]u|tim)\b/i,
    title_prefix: "Sponsorship Research",
    task_type: "sponsorship_research",
    scope_in: ["web:research:sponsorship"],
    target_files: [],
    success_criteria: [
      "sponsorship sources collected",
      "short findings returned",
      "captured links are explicit",
    ],
    tests_required: [],
  },
  {
    internal_action: "page_capture",
    pattern: /\b(page\s*capture|capture\s*page|chup\s*trang|luu\s*trang)\b/i,
    title_prefix: "Page Capture",
    task_type: "page_capture",
    scope_in: ["web:capture"],
    target_files: [],
    success_criteria: [
      "target page captured",
      "artifact path returned",
      "page summary returned",
    ],
    tests_required: [],
  },
  {
    internal_action: "form_prepare",
    pattern: /\b(form\s*prepare|prepare\s*form|chuan\s*bi\s*form)\b/i,
    title_prefix: "Form Prepare",
    task_type: "form_prepare",
    scope_in: ["web:form"],
    target_files: [],
    success_criteria: [
      "form target prepared without submit",
      "action log recorded",
      "no sensitive submit executed",
    ],
    tests_required: [],
  },
  {
    internal_action: "cloud_console_inspect",
    pattern: /\b(cloud\s*console|console\s*inspect|kiem\s*tra\s*console)\b/i,
    title_prefix: "Cloud Console Inspect",
    task_type: "cloud_console_inspect",
    scope_in: ["web:cloud_console"],
    target_files: [],
    success_criteria: [
      "console target inspected or opened",
      "action log recorded",
      "no uncontrolled account action executed",
    ],
    tests_required: [],
  },
  {
    internal_action: "failure_retry",
    pattern: /\b(retry|thu\s*lai)\b.*\b(loi|failure)\b|\b(loi|failure)\b.*\b(retry|thu\s*lai)\b/i,
    title_prefix: "Failure Retry",
    scope_in: ["control_plane", "commander_bridge/state", "retry_queue"],
    target_files: ["control_plane", "control_plane/commander_bridge/state"],
    success_criteria: [
      "latest failure state inspected",
      "retry path reviewed and queued only if valid",
      "no uncontrolled write executed",
    ],
  },
  {
    internal_action: "runtime_checker",
    pattern: /\bkiem\s*tra\b.*\b(he\s*thong|trang\s*thai)\b|\btrang\s*thai\b.*\bhe\s*thong\b/i,
    title_prefix: "Runtime Checker",
    scope_in: ["control_plane", "state", "runtime status"],
    target_files: ["control_plane", "state"],
    success_criteria: [
      "current system status inspected",
      "runtime snapshot summarized",
      "no runtime-sensitive file changed",
    ],
  },
  {
    internal_action: "workflow_reader",
    pattern: /\b(doc|xem|bao\s*cao)\b.*\bworkflow\b|\bworkflow\b.*\b(hien\s*tai|ngan|bao\s*cao|doc|xem)\b/i,
    title_prefix: "Workflow Reader",
    scope_in: ["control_plane", "workflow_registry", "commander_bridge/state"],
    target_files: ["control_plane", "control_plane/commander_bridge/state"],
    success_criteria: [
      "current workflow state inspected",
      "latest workflow summarized",
      "no executor path changed",
    ],
  },
  {
    internal_action: "repo_inspector",
    pattern: /\bkiem\s*tra\b.*\brepo\b|\brepo\b.*\b(control_plane|dang\s*thieu|thieu\s*gi|trang\s*thai|hien\s*tai)\b/i,
    title_prefix: "Repo Inspector",
    scope_in: ["control_plane", "repo status", "tracked state"],
    target_files: ["control_plane", ".gitignore"],
    success_criteria: [
      "repo/control_plane state inspected",
      "missing or suspicious repo items identified",
      "no unrestricted repo mutation performed",
    ],
  },
  {
    internal_action: "report_reader",
    pattern: /\bbao\s*cao\s*ngan\b|\bbao\s*cao\b.*\b(he\s*thong|workflow|repo)\b|\bdoc\b.*\bbao\s*cao\b/i,
    title_prefix: "Report Reader",
    scope_in: ["control_plane", "reports", "commander_bridge/state"],
    target_files: ["control_plane", "control_plane/commander_bridge/state"],
    success_criteria: [
      "latest operator-facing report inspected",
      "short summary prepared",
      "no write outside approved path",
    ],
  },
];

const GOAL_TYPES = {
  add_module: {
    allowed_patterns: [/\b(add|create|build|introduce)\b/i, /\b(module|component|service|builder|store|writer|guard)\b/i],
  },
  patch_bug: {
    allowed_patterns: [/\b(fix|patch|repair|resolve|stabilize|correct)\b/i],
  },
  add_test: {
    allowed_patterns: [/\b(add|create|write)\b/i, /\b(test|spec|coverage|assertion)\b/i],
  },
  refactor_safe: {
    allowed_patterns: [/\b(refactor|normalize|restructure|separate|organize)\b/i],
  },
  docs_update: {
    allowed_patterns: [/\b(update|write|document|refresh)\b/i, /\b(doc|docs|readme|handoff|guide)\b/i],
  },
  mixed_plan: {
    allowed_patterns: [/.+/],
  },
  web_status_check: {
    allowed_patterns: [/.+/],
  },
  dashboard_read: {
    allowed_patterns: [/.+/],
  },
  grant_research: {
    allowed_patterns: [/.+/],
  },
  sponsorship_research: {
    allowed_patterns: [/.+/],
  },
  page_capture: {
    allowed_patterns: [/.+/],
  },
  form_prepare: {
    allowed_patterns: [/.+/],
  },
  cloud_console_inspect: {
    allowed_patterns: [/.+/],
  },
  operator_action: {
    allowed_patterns: [/.+/],
  },
};

const VAGUE_PATTERNS = [
  /\bimprove system\b/i,
  /\bmake it better\b/i,
  /\boptimi[sz]e everything\b/i,
  /\bfix all\b/i,
  /\bhandle everything\b/i,
  /\bmisc(?:ellaneous)? update\b/i,
];

function listTaskTypes() {
  return Object.keys(GOAL_TYPES);
}

function isVagueObjective(objective) {
  const text = String(objective || "").trim();
  if (!text) return true;
  return VAGUE_PATTERNS.some((pattern) => pattern.test(text));
}

function normalizeObjectiveText(objective) {
  return String(objective || "")
    .replace(/^task\s*:\s*/i, "")
    .replace(/^muc\s*tieu\s*:\s*/i, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isDestructiveObjective(objective) {
  const text = normalizeObjectiveText(objective);
  return DESTRUCTIVE_PATTERNS.some((pattern) => pattern.test(text));
}

function isSafeOperatorIntent(objective) {
  const text = normalizeObjectiveText(objective);
  return SAFE_OPERATOR_PATTERNS.some((pattern) => pattern.test(text));
}

function routeOperatorIntent(objective) {
  const text = normalizeObjectiveText(objective);
  if (!text) {
    return {
      matched: false,
      safe_fallback: false,
      internal_action: null,
      task_type: "operator_action",
      normalized_input: text,
      route_reason: "missing_objective",
    };
  }
  const matchedRoute = OPERATOR_INTENT_ROUTES.find((entry) => entry.pattern.test(text));
  if (matchedRoute) {
    return {
      matched: true,
      safe_fallback: false,
      internal_action: matchedRoute.internal_action,
      task_type: matchedRoute.task_type || "operator_action",
      normalized_input: text,
      route_reason: `deterministic:${matchedRoute.internal_action}`,
      title: `${matchedRoute.title_prefix}: ${text.slice(0, 72)}`,
      scope_in: matchedRoute.scope_in.slice(),
      target_files: matchedRoute.target_files.slice(),
      success_criteria: matchedRoute.success_criteria.slice(),
      tests_required: Array.isArray(matchedRoute.tests_required) ? matchedRoute.tests_required.slice() : ["node MIKAGE\\mikage.test.js"],
    };
  }
  if (isSafeOperatorIntent(text)) {
    return {
      matched: false,
      safe_fallback: true,
      internal_action: "inspection_fallback",
      task_type: "operator_action",
      normalized_input: text,
      route_reason: "safe_read_only_fallback",
      title: `Inspection Fallback: ${text.slice(0, 68)}`,
      scope_in: ["control_plane", "commander_bridge/state", "workflow_registry"],
      target_files: ["control_plane", "control_plane/commander_bridge/state"],
      success_criteria: [
        "safe operator intent inspected",
        "read-only fallback summary prepared",
        "no unrestricted tool access used",
      ],
      tests_required: ["node MIKAGE\\mikage.test.js"],
    };
  }
  return {
    matched: false,
    safe_fallback: false,
    internal_action: null,
    task_type: "operator_action",
    normalized_input: text,
    route_reason: "no_safe_route",
  };
}

function buildGoalGuidance() {
  return {
    examples: [
      "kiem tra trang thai he thong",
      "kiem tra repo control_plane dang thieu gi",
      "bao cao ngan tinh trang he thong",
    ],
  };
}

function inferTaskTypeFromObjective(objective, fallback = "operator_action") {
  const text = normalizeObjectiveText(objective);
  if (isSafeOperatorIntent(text)) {
    return "operator_action";
  }
  for (const [taskType, entry] of Object.entries(GOAL_TYPES)) {
    if ((entry.allowed_patterns || []).every((pattern) => pattern.test(text))) {
      return taskType;
    }
  }
  return fallback;
}

function resolveTaskType(input = {}) {
  const explicit = String(input.task_type || "").trim();
  if (explicit && GOAL_TYPES[explicit]) return explicit;
  return inferTaskTypeFromObjective(normalizeObjectiveText(input.objective || input.title || ""), input.fallback || "operator_action");
}

function validateTaskGoal(taskType, objective) {
  const normalizedTaskType = GOAL_TYPES[taskType] ? taskType : "operator_action";
  const text = normalizeObjectiveText(objective);
  if (!text) {
    return { valid: false, reason: "missing_objective", task_type: normalizedTaskType };
  }
  if (isDestructiveObjective(text)) {
    return { valid: false, reason: "destructive_objective_blocked", task_type: normalizedTaskType, guidance: buildGoalGuidance() };
  }
  if (isVagueObjective(text)) {
    return { valid: false, reason: "vague_objective", task_type: normalizedTaskType, guidance: buildGoalGuidance() };
  }
  const entry = GOAL_TYPES[normalizedTaskType];
  if ((entry.allowed_patterns || []).every((pattern) => pattern.test(text))) {
    return { valid: true, reason: "goal_valid", task_type: normalizedTaskType };
  }
  if (normalizedTaskType === "operator_action") {
    return { valid: true, reason: "goal_valid", task_type: normalizedTaskType };
  }
  if (isSafeOperatorIntent(text)) {
    return { valid: true, reason: "goal_valid", task_type: "operator_action" };
  }
  return { valid: false, reason: "objective_not_allowed_for_task_type", task_type: normalizedTaskType, guidance: buildGoalGuidance() };
}

module.exports = {
  GOAL_TYPES,
  listTaskTypes,
  isVagueObjective,
  normalizeObjectiveText,
  isDestructiveObjective,
  isSafeOperatorIntent,
  routeOperatorIntent,
  buildGoalGuidance,
  inferTaskTypeFromObjective,
  resolveTaskType,
  validateTaskGoal,
};
