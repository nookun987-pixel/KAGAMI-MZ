"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");
const { resolveActionPolicy } = require("./approval_engine");
const { resolveTaskType, validateTaskGoal } = require("./task_goal_registry");

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value)
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^- /, "").trim())
    .filter(Boolean);
}

function parseTaskMarkdown(taskPath) {
  if (!taskPath || !fs.existsSync(taskPath)) {
    return {
      raw: "",
      title: null,
      objective: "",
      scope_in: [],
      scope_out: [],
      success_criteria: [],
      system_constraints: [],
    };
  }
  const content = fs.readFileSync(taskPath, "utf8");
  const sections = {};
  let current = null;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      current = headingMatch[1].trim().toLowerCase().replace(/\s+/g, "_");
      sections[current] = [];
      continue;
    }
    if (current) sections[current].push(line);
  }
  return {
    raw: content,
    title: (content.match(/^#\s+(.+)$/m) || [null, null])[1] || null,
    objective: normalizeList(sections.objective).join(" ").trim(),
    scope_in: normalizeList(sections.scope_in),
    scope_out: normalizeList(sections.scope_out),
    success_criteria: normalizeList(sections.success_criteria),
    system_constraints: normalizeList(sections.system_constraints),
  };
}

function inferTargetFiles(command = {}, payload = {}, parsedTask = {}) {
  if (Array.isArray(payload.files)) return payload.files.slice();
  if (typeof payload.path === "string") return [payload.path];
  if (Array.isArray(parsedTask.scope_in)) {
    return parsedTask.scope_in.filter((item) => /[\\/]/.test(item) || /\.[a-z0-9]+$/i.test(item));
  }
  return [];
}

function buildObjective(command, payload, parsedTask) {
  return String(
    parsedTask.objective
      || payload.objective
      || payload.task
      || `Execute ${command.action}`
  ).trim();
}

function buildSuccessCriteria(command, payload, parsedTask) {
  const criteria = normalizeList(parsedTask.success_criteria);
  if (criteria.length) return criteria;
  return [
    payload.success_criteria || `Action ${command.action} completes under bounded execution`,
    "Approval and plan guard remain enforced",
  ].filter(Boolean);
}

function buildContractFingerprint(contract) {
  return crypto.createHash("sha256").update(JSON.stringify({
    task_id: contract.task_id,
    task_type: contract.task_type,
    title: contract.title,
    objective: contract.objective,
    scope_in: contract.scope_in,
    scope_out: contract.scope_out,
    target_files: contract.target_files,
    forbidden_paths: contract.forbidden_paths,
    success_criteria: contract.success_criteria,
    system_constraints: contract.system_constraints,
    approval_tier: contract.approval_tier,
    executor: contract.executor,
  })).digest("hex");
}

function buildTaskContract(command, context = {}) {
  const payload = command.payload || {};
  const taskId = String(payload.task_id || command.command_id || "task").trim();
  const parsedTask = parseTaskMarkdown(context.task_path || null);
  const objective = buildObjective(command, payload, parsedTask);
  const taskType = resolveTaskType({
    task_type: payload.task_type || context.task_type,
    objective,
    title: payload.title || parsedTask.title || command.action,
    fallback: context.fallback_task_type || "operator_action",
  });
  const goalValidation = validateTaskGoal(taskType, objective);
  if (!goalValidation.valid) {
    return { status: "BLOCKED", reason: goalValidation.reason, task_type: taskType };
  }

  const inferredScopeIn = parsedTask.scope_in && parsedTask.scope_in.length
    ? parsedTask.scope_in
    : (payload.scope_in || inferTargetFiles(command, payload, parsedTask));
  const scopeIn = normalizeList((Array.isArray(inferredScopeIn) && inferredScopeIn.length) || (typeof inferredScopeIn === "string" && inferredScopeIn.trim())
    ? inferredScopeIn
    : [`command:${command.action}`]);
  const scopeOut = normalizeList(parsedTask.scope_out && parsedTask.scope_out.length ? parsedTask.scope_out : (payload.scope_out || config.ARCH_SENSITIVE_PATHS));
  const successCriteria = buildSuccessCriteria(command, payload, parsedTask);
  if (!scopeIn.length) return { status: "BLOCKED", reason: "missing_scope_in", task_type: taskType };
  if (!scopeOut.length) return { status: "BLOCKED", reason: "missing_scope_out", task_type: taskType };
  if (!successCriteria.length) return { status: "BLOCKED", reason: "missing_success_criteria", task_type: taskType };

  const now = context.now || new Date().toISOString();
  const contract = {
    task_id: taskId,
    session_id: context.session_id || command.session_id || null,
    requested_by: command.requested_by || "local_control_agent",
    task_type: taskType,
    title: String(payload.title || parsedTask.title || command.action).trim(),
    objective,
    scope_in: scopeIn,
    scope_out: scopeOut,
    target_files: inferTargetFiles(command, payload, parsedTask),
    forbidden_paths: normalizeList(payload.forbidden_paths || context.forbidden_paths || config.ARCH_SENSITIVE_PATHS),
    success_criteria: successCriteria,
    system_constraints: normalizeList(parsedTask.system_constraints && parsedTask.system_constraints.length ? parsedTask.system_constraints : (payload.system_constraints || [
      "approval_engine_required",
      "plan_guard_required",
      "bounded_executor_only",
      "image_runtime_untouched",
    ])),
    approval_tier: resolveActionPolicy(context.tool_type || "unknown"),
    executor: payload.executor || context.executor || (command.action === "codex.build_task" ? "codex" : "local_control_agent"),
    status: context.status || "normalized",
    created_at: now,
    updated_at: now,
  };
  contract.contract_fingerprint = buildContractFingerprint(contract);
  return { status: "PASS", contract };
}

function writeTaskContractArtifact(contract) {
  const filePath = path.join(config.TASK_CONTRACT_DIR, `${contract.task_id}.task_contract.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, contract);
  return filePath;
}

module.exports = {
  parseTaskMarkdown,
  buildTaskContract,
  writeTaskContractArtifact,
};
