"use strict";

const path = require("path");

const config = require("./local_control_agent/config");
const { normalizeObjectiveText } = require("./task_goal_registry");
const { routeOperatorCommand } = require("./operator_router");

const STEP_SPLIT_PATTERN = /\s+(?:roi|rồi|va|và|then|and|sau\s*do|sau\s*đó)\s+/i;
const WRITE_HINT_PATTERN = /\b(ghi|write|sua|update|tao|create|lap\s*bao\s*cao|tong\s*ket|note|bao\s*cao)\b/i;
const WEB_HINT_PATTERN = /\b(web|url|http|https|grant|sponsor|dashboard|console|cloud|form)\b/i;

function unique(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function extractUrls(text) {
  return unique(String(text || "").match(/https?:\/\/[^\s"'<>]+/gi) || []);
}

function extractRepoPaths(text) {
  return unique((String(text || "").match(/\b(?:control_plane|tests|docs|state)\/[A-Za-z0-9_./-]+\b/g) || []).map((item) => item.replace(/\\/g, "/")));
}

function isMixedCommand(text) {
  return STEP_SPLIT_PATTERN.test(String(text || ""));
}

function splitSteps(text) {
  return String(text || "")
    .split(STEP_SPLIT_PATTERN)
    .map((item) => normalizeObjectiveText(item))
    .filter(Boolean);
}

function buildGeneratedReportPath(parentTaskId, index, suffix = "note") {
  return path.posix.join("control_plane", "commander_bridge", "state", "mixed_task_reports", `${parentTaskId}_step${index + 1}_${suffix}.md`);
}

function inferReportSuffix(stepText) {
  const normalized = String(stepText || "").toLowerCase();
  if (normalized.includes("workflow")) return "workflow_summary";
  if (normalized.includes("grant")) return "grant_report";
  if (normalized.includes("repo")) return "repo_summary";
  if (normalized.includes("note")) return "note";
  return "summary";
}

function buildWriteFollowup(stepText, context = {}) {
  const normalized = normalizeObjectiveText(stepText);
  const explicitPaths = extractRepoPaths(normalized);
  const targetFile = explicitPaths[0] || buildGeneratedReportPath(context.parent_task_id, context.index, inferReportSuffix(normalized));
  const sourceLabel = context.previous_summary || context.previous_step || "previous step";
  return {
    content: `write docs update ${targetFile} based on ${sourceLabel}`,
    task_type: "docs_update",
    scope_in: [targetFile],
    target_files: [targetFile],
    tests_required: [],
    success_criteria: [
      "write a short bounded summary note",
      "only the approved target file changes",
      "report explicit changed_files",
    ],
  };
}

function buildStepDescriptor(stepText, context = {}) {
  const normalized = normalizeObjectiveText(stepText);
  if (context.index > 0 && WRITE_HINT_PATTERN.test(normalized)) {
    return buildWriteFollowup(normalized, context);
  }
  const urls = extractUrls(normalized);
  const repoPaths = extractRepoPaths(normalized);
  const base = routeOperatorCommand(normalized, {
    scope_in: urls.length ? urls : undefined,
    target_files: repoPaths.length ? repoPaths : undefined,
  });
  if (base.executor_lane === "dev_read" && WEB_HINT_PATTERN.test(normalized) && urls.length) {
    return {
      content: normalized,
      task_type: "web_status_check",
      scope_in: urls,
      target_files: [],
      tests_required: [],
      success_criteria: [
        "target web state inspected",
        "short structured summary returned",
        "artifacts captured explicitly",
      ],
    };
  }
  return {
    content: normalized,
    task_type: base.task_type,
    scope_in: base.scope_in,
    target_files: base.target_files,
    tests_required: base.tests_required,
    success_criteria: base.success_criteria,
  };
}

function planMixedTask(input = "", options = {}) {
  const normalized = normalizeObjectiveText(input);
  if (!isMixedCommand(normalized)) {
    return {
      status: "PASS",
      is_mixed: false,
      normalized_input: normalized,
      steps: [],
    };
  }
  const parts = splitSteps(normalized);
  if (parts.length < 2) {
    return {
      status: "PASS",
      is_mixed: false,
      normalized_input: normalized,
      steps: [],
    };
  }
  const parentTaskId = options.parent_task_id || `task_${Date.now()}`;
  const steps = [];
  for (let index = 0; index < parts.length; index += 1) {
    const descriptor = buildStepDescriptor(parts[index], {
      parent_task_id: parentTaskId,
      index,
      previous_step: index > 0 ? parts[index - 1] : null,
      previous_summary: index > 0 ? `step ${index}` : null,
    });
    const routed = routeOperatorCommand(descriptor.content, {
      task_type: descriptor.task_type,
      scope_in: descriptor.scope_in,
      target_files: descriptor.target_files,
      tests_required: descriptor.tests_required,
      success_criteria: descriptor.success_criteria,
    });
    steps.push({
      step_id: `${parentTaskId}_step_${index + 1}`,
      order: index + 1,
      content: descriptor.content,
      route_reason: routed.route_reason,
      executor_lane: routed.executor_lane,
      task_type: routed.task_type,
      scope_in: routed.scope_in,
      target_files: routed.target_files,
      tests_required: routed.tests_required,
      success_criteria: routed.success_criteria,
    });
  }
  const targetFiles = unique(steps.flatMap((step) => step.target_files || []));
  const scopeIn = unique(steps.flatMap((step) => step.scope_in || []));
  const testsRequired = unique(steps.flatMap((step) => step.tests_required || []));
  return {
    status: "PASS",
    is_mixed: true,
    normalized_input: normalized,
    steps,
    task_type: "mixed_plan",
    executor_lane: "mixed_plan",
    title: options.title || `Mixed Task Plan: ${normalized.slice(0, 72)}`,
    scope_in: scopeIn,
    target_files: targetFiles,
    tests_required: testsRequired,
    success_criteria: [
      "all mixed steps execute in order",
      "each step returns explicit result",
      "final short summary returned",
    ],
  };
}

function stepContextFilePath(stateDir, parentTaskId, stepOrder) {
  return path.join(stateDir, `${parentTaskId}_step${stepOrder}_ctx.json`);
}

module.exports = {
  isMixedCommand,
  splitSteps,
  planMixedTask,
  stepContextFilePath,
};
