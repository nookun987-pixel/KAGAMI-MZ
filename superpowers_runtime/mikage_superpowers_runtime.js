"use strict";

const fs = require("fs");
const path = require("path");

const STAGES = [
  "USER_REQUEST",
  "INTAKE",
  "STATE_CHECK",
  "LANE_CHECK",
  "TASK_BUILD",
  "EXECUTION_READY",
  "DONE_OR_STOP",
];

const PROHIBITED_ACTIONS = [
  {
    key: "image_generation",
    patterns: ["image generation", "generate image", "create image", "txt2img", "img2img"],
  },
  {
    key: "video_generation",
    patterns: ["video generation", "generate video", "create video"],
  },
  {
    key: "render_execution",
    patterns: ["render execution", "execute render", "start render", "run render", "render output"],
  },
  {
    key: "comfyui_use",
    patterns: ["comfyui"],
  },
  {
    key: "blender_use",
    patterns: ["blender"],
  },
  {
    key: "public_deployment",
    patterns: ["public deployment", "deploy public", "publish website", "public deploy"],
  },
  {
    key: "canon_approval",
    patterns: ["canon approval", "approve canon"],
  },
  {
    key: "asset_lock",
    patterns: ["asset lock", "lock asset"],
  },
];

const REQUIRED_FIELDS = [
  "task_id",
  "short_task_code",
  "raw_user_request",
  "normalized_objective",
  "current_stage",
  "assigned_agent",
  "approval_required",
  "approval_status",
  "allowed_actions",
  "forbidden_actions",
  "expected_outputs",
  "report_path",
  "status",
  "blocker",
  "next_safe_task",
];

function normalizeText(value) {
  if (Array.isArray(value)) return value.map(normalizeText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(normalizeText).join(" ");
  return String(value || "").toLowerCase();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function validateTaskShape(task) {
  const missingFields = REQUIRED_FIELDS.filter((field) => !(field in task));
  const typeErrors = [];

  if (task.allowed_actions && !Array.isArray(task.allowed_actions)) {
    typeErrors.push("allowed_actions must be an array");
  }
  if (task.forbidden_actions && !Array.isArray(task.forbidden_actions)) {
    typeErrors.push("forbidden_actions must be an array");
  }
  if (task.expected_outputs && !Array.isArray(task.expected_outputs)) {
    typeErrors.push("expected_outputs must be an array");
  }
  if (task.current_stage && !STAGES.includes(task.current_stage)) {
    typeErrors.push(`current_stage must be one of: ${STAGES.join(", ")}`);
  }

  return {
    valid: missingFields.length === 0 && typeErrors.length === 0,
    missing_fields: missingFields,
    type_errors: typeErrors,
  };
}

function findProhibitedActions(task) {
  const inspectedText = normalizeText({
    raw_user_request: task.raw_user_request,
    normalized_objective: task.normalized_objective,
    allowed_actions: task.allowed_actions,
    expected_outputs: task.expected_outputs,
    requested_actions: task.requested_actions,
  });

  return PROHIBITED_ACTIONS.filter((action) =>
    action.patterns.some((pattern) => inspectedText.includes(pattern))
  ).map((action) => action.key);
}

function buildStageTrace(task, laneGuard) {
  return STAGES.map((stage) => {
    if (stage === "LANE_CHECK" && !laneGuard.allowed) {
      return {
        stage,
        status: "STOP",
        reason: "prohibited_action_detected",
      };
    }
    if (stage === "DONE_OR_STOP") {
      return {
        stage,
        status: laneGuard.allowed ? "DONE" : "STOP",
      };
    }
    return {
      stage,
      status: "PASS",
    };
  });
}

function runSuperpowersRuntime(task, options = {}) {
  const taskShape = validateTaskShape(task);
  if (!taskShape.valid) {
    return {
      RESULT: "BLOCKED",
      task_id: task.task_id || null,
      short_task_code: task.short_task_code || null,
      active_lane: "MIKAGE SUPERPOWER SYSTEM / runtime skeleton / coordination system",
      status: "blocked",
      blocker: {
        reason: "invalid_task_object",
        missing_fields: taskShape.missing_fields,
        type_errors: taskShape.type_errors,
      },
      stages: [],
      prohibited_actions_detected: [],
      next_safe_task: null,
    };
  }

  const prohibitedActions = findProhibitedActions(task);
  const laneGuard = {
    allowed: prohibitedActions.length === 0,
    prohibited_actions_detected: prohibitedActions,
  };

  if (!laneGuard.allowed) {
    return {
      RESULT: "STOPPED_BY_LANE_GUARD",
      task_id: task.task_id,
      short_task_code: task.short_task_code,
      active_lane: "MIKAGE SUPERPOWER SYSTEM / runtime skeleton / coordination system",
      status: "stop",
      blocker: {
        reason: "prohibited_action_detected",
        prohibited_actions: prohibitedActions,
      },
      stages: buildStageTrace(task, laneGuard),
      prohibited_actions_detected: prohibitedActions,
      next_safe_task: null,
    };
  }

  return {
    RESULT: options.forceFail ? "FAIL" : "PASS",
    task_id: task.task_id,
    short_task_code: task.short_task_code,
    active_lane: "MIKAGE SUPERPOWER SYSTEM / runtime skeleton / coordination system",
    status: options.forceFail ? "failed" : "done",
    blocker: options.forceFail ? { reason: "forced_failure" } : null,
    stages: buildStageTrace(task, laneGuard),
    prohibited_actions_detected: [],
    execution_ready: true,
    output_contract: {
      structured_result: true,
      external_apis_used: false,
      autonomous_loop_started: false,
      render_or_media_route_used: false,
    },
    next_safe_task: task.next_safe_task || null,
  };
}

function runCli(argv) {
  const inputPath = argv[2];
  const outputPath = argv[3];

  if (!inputPath) {
    process.stderr.write("Usage: node superpowers_runtime/mikage_superpowers_runtime.js <task.json> [output.json]\n");
    process.exitCode = 2;
    return;
  }

  const task = readJson(path.resolve(inputPath));
  const result = runSuperpowersRuntime(task);

  if (outputPath) {
    writeJson(path.resolve(outputPath), result);
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.RESULT === "BLOCKED" || result.RESULT === "FAIL") {
    process.exitCode = 1;
  }
}

module.exports = {
  STAGES,
  PROHIBITED_ACTIONS,
  REQUIRED_FIELDS,
  runSuperpowersRuntime,
  validateTaskShape,
  findProhibitedActions,
};

if (require.main === module) {
  runCli(process.argv);
}
