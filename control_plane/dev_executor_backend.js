"use strict";

const fs = require("fs");
const path = require("path");

const service = require("./commander_service");
const config = require("./local_control_agent/config");
const { governedSpawnSync } = require("./process_governor");
const { analyzeWriteTargets } = require("./local_control_agent/system_map_guard");
const { normalizeObjectiveText, routeOperatorIntent } = require("./task_goal_registry");

const WRITE_TASK_TYPES = new Set(["add_module", "patch_bug", "add_test", "refactor_safe", "docs_update"]);
const HARD_BLOCK_PATTERNS = [
  /^start_mikage\.bat$/i,
  /^mikage\/index\.js$/i,
  /^runtime\/drive_queue\/runtime\.js$/i,
  /^runtime\/colab_worker(\/|$)/i,
];
const ALLOWED_TEST_PREFIXES = [/^node\s+/i, /^npm\s+test(?:\s|$)/i];
const SHELL_META_PATTERN = /[|&;<>`]/;

function normalizeRepoPath(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\.?\//, "").trim();
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function unique(items) {
  return [...new Set((items || []).filter(Boolean))];
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
    failure_stage: extras.failure_stage || "backend_execution",
    failure_type: reason,
    retryable,
    summary: extras.summary || reason,
    raw_failure_ref: extras.raw_failure_ref || null,
    failed_at: new Date().toISOString(),
  };
}

function summarizeStatus(payload) {
  return `system=${payload.system_state || "unknown"} agent=${payload.agent_status || "unknown"} pending=${payload.pending_tasks || 0} jobs=${payload.jobs || 0}`;
}

function summarizeWorkflow(payload) {
  const latest = payload.latest_workflow || payload.latest_failed_workflow || payload.latest_successful_workflow || null;
  if (!latest) return "workflow summary prepared: no recent workflow";
  return `workflow=${latest.workflow || "unknown"} verdict=${latest.final_verdict || latest.status || "unknown"} task=${latest.task_id || "none"}`;
}

function summarizeRepo(payload) {
  const issues = (((payload || {}).maintenance_issue_registry || {}).issues || []).length;
  return `repo health inspected: issues=${issues}`;
}

function summarizeReports(payload) {
  const latest = payload.latest_agent_report || null;
  if (!latest) return "latest reports reviewed: no report available";
  return `latest report reviewed: ${latest.action || latest.status || "available"}`;
}

function latestFailureId(payload) {
  return ((((payload || {}).failure_center || {}).failures || [])[0] || {}).failure_id || null;
}

function executeOperatorAction(internalAction, jobId, taskId) {
  switch (internalAction) {
    case "runtime_checker": {
      const result = service.getOperatorSystemStatus();
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "runtime_checker_failed");
      return buildSuccess(jobId, taskId, summarizeStatus(result));
    }
    case "workflow_reader": {
      const result = service.getStatus();
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "workflow_reader_failed");
      return buildSuccess(jobId, taskId, summarizeWorkflow(result), {
        artifacts_returned: [result.latest_workflow && result.latest_workflow.id].filter(Boolean),
      });
    }
    case "repo_inspector": {
      const result = service.getRepoHealthView();
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "repo_inspector_failed");
      return buildSuccess(jobId, taskId, summarizeRepo(result), {
        artifacts_returned: [result.repo_health_scan && result.repo_health_scan.artifact_path].filter(Boolean),
      });
    }
    case "report_reader": {
      const result = service.getLatestReports();
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "report_reader_failed");
      return buildSuccess(jobId, taskId, summarizeReports(result), {
        artifacts_returned: [result.latest_agent_report && result.latest_agent_report.path].filter(Boolean),
      });
    }
    case "failure_retry": {
      const failurePayload = service.getFailureCenter();
      const failureId = latestFailureId(failurePayload);
      if (!failureId) return buildFailure(jobId, taskId, "no_retryable_failure");
      const result = service.retryFailureAction(failureId);
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "failure_retry_failed");
      return buildSuccess(jobId, taskId, `retry queued for ${failureId}`);
    }
    case "inspection_fallback": {
      const result = service.getStatus();
      if (result.status !== "PASS") return buildFailure(jobId, taskId, result.reason || "inspection_fallback_failed");
      return buildSuccess(jobId, taskId, "safe inspection fallback completed");
    }
    default:
      return buildFailure(jobId, taskId, `unsupported_internal_action:${internalAction}`);
  }
}

function buildWriteActions(taskType) {
  switch (taskType) {
    case "add_module":
      return ["code_patch_apply", "file_create_allowed", "file_modify_allowed", "test_runner", "repo_stage_review"];
    case "patch_bug":
      return ["code_patch_apply", "file_modify_allowed", "test_runner", "repo_stage_review"];
    case "add_test":
      return ["code_patch_apply", "file_create_allowed", "file_modify_allowed", "test_runner", "repo_stage_review"];
    case "refactor_safe":
      return ["code_patch_apply", "file_modify_allowed", "test_runner", "repo_stage_review"];
    case "docs_update":
      return ["code_patch_apply", "file_create_allowed", "file_modify_allowed", "repo_stage_review"];
    default:
      return [];
  }
}

function validateDispatchTargets(dispatch) {
  const targets = (dispatch.files_expected_to_change || []).map(normalizeRepoPath).filter(Boolean);
  if (!targets.length) return { ok: false, reason: "missing_files_expected_to_change" };
  const blocked = targets.find((target) => HARD_BLOCK_PATTERNS.some((pattern) => pattern.test(target)));
  if (blocked) return { ok: false, reason: `forbidden_target:${blocked}` };
  const outside = targets.find((target) => {
    return !(target.startsWith("control_plane/") || target.startsWith("tests/") || target.startsWith("docs/") || target.startsWith("state/"));
  });
  if (outside) return { ok: false, reason: `target_outside_allowed_dev_scope:${outside}` };
  const forbidden = (dispatch.forbidden_paths || []).map(normalizeRepoPath);
  const conflict = targets.find((target) => forbidden.some((rule) => rule && (target === rule || target.startsWith(rule.replace(/\/\*$/, "")))));
  if (conflict) return { ok: false, reason: `target_conflicts_with_forbidden_paths:${conflict}` };
  const mapCheck = analyzeWriteTargets(targets.map((item) => path.resolve(config.ROOT, item)));
  if (mapCheck.hard_block_reason) return { ok: false, reason: mapCheck.hard_block_reason };
  return {
    ok: true,
    targets,
    architecture_sensitive: Boolean(mapCheck.architecture_sensitive),
    sensitive_paths: mapCheck.sensitive_paths || [],
  };
}

function runtimeArtifactDir() {
  const dir = path.join(config.STATE_DIR, "dev_executor_runtime");
  ensureDir(dir);
  return dir;
}

function writeRuntimeArtifact(name, value) {
  const filePath = path.join(runtimeArtifactDir(), name);
  fs.writeFileSync(filePath, value, "utf8");
  return filePath;
}

function buildOutputSchemaArtifact(jobId, targets) {
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["status", "changed_files", "tests_executed", "tests_passed", "tests_failed", "artifacts_returned", "summary", "error"],
    properties: {
      status: { type: "string", enum: ["PASS", "FAIL", "BLOCKED"] },
      changed_files: {
        type: "array",
        items: { type: "string", enum: targets },
      },
      tests_executed: { type: "array", items: { type: "string" } },
      tests_passed: { type: "array", items: { type: "string" } },
      tests_failed: { type: "array", items: { type: "string" } },
      artifacts_returned: { type: "array", items: { type: "string" } },
      summary: { type: "string" },
      error: { type: "string" },
    },
  };
  return writeRuntimeArtifact(`${jobId}.schema.json`, JSON.stringify(schema, null, 2));
}

function buildCodexPrompt(dispatch, targets, executorActions) {
  const prevCtx = dispatch.implementation_brief && dispatch.implementation_brief.context_from_previous_step || null;
  return [
    "You are executing an approved bounded development task inside the KAGAMI-MZ repository.",
    `Task ID: ${dispatch.task_id}`,
    `Task Type: ${dispatch.task_type || "unknown"}`,
    `Objective: ${(dispatch.implementation_brief && dispatch.implementation_brief.what_to_build) || ""}`,
    ...(prevCtx ? [
      "",
      `Previous step context (step ${prevCtx.step_order}): ${prevCtx.ref}`,
      "Read that artifact file to obtain the real output of the previous step before proceeding.",
    ] : []),
    "",
    "Allowed executor actions:",
    ...executorActions.map((item) => `- ${item}`),
    "",
    "Files you may change:",
    ...targets.map((item) => `- ${item}`),
    "",
    "Forbidden paths:",
    ...((dispatch.forbidden_paths || []).map((item) => `- ${item}`)),
    "",
    "Required constraints:",
    ...((dispatch.system_constraints || []).map((item) => `- ${item}`)),
    "- Do not touch image runtime files.",
    "- Do not use destructive git history actions.",
    "- Do not modify files outside the allowed targets.",
    "- If you run tests, report them exactly in tests_executed/tests_passed/tests_failed.",
    "",
    "Tests that must be run if applicable:",
    ...((dispatch.tests_required || []).map((item) => `- ${item}`)),
    "",
    "Return exactly one JSON object matching the provided output schema and nothing else in the final message.",
  ].join("\n");
}

function buildDebugArtifacts(jobId, codexRun) {
  const stdoutPath = writeRuntimeArtifact(`${jobId}.codex_stdout.log`, codexRun.result && codexRun.result.stdout || "");
  const stderrPath = writeRuntimeArtifact(`${jobId}.codex_stderr.log`, codexRun.result && codexRun.result.stderr || "");
  return { stdoutPath, stderrPath };
}

function runCodexWriteExecution(dispatch, handoff, targets, executorActions) {
  const prompt = buildCodexPrompt(dispatch, targets, executorActions);
  const promptPath = writeRuntimeArtifact(`${handoff.job_id}.prompt.txt`, prompt);
  const schemaPath = buildOutputSchemaArtifact(handoff.job_id, targets);
  const outputPath = path.join(runtimeArtifactDir(), `${handoff.job_id}.codex_result.json`);
  const codexRun = governedSpawnSync({
    command: "codex",
    args: [
      "exec",
      "-s",
      "workspace-write",
      "-C",
      dispatch.repo_path || config.ROOT,
      "--skip-git-repo-check",
      "--output-schema",
      schemaPath,
      "-o",
      outputPath,
      "-",
    ],
    input: prompt,
    cwd: dispatch.repo_path || config.ROOT,
    timeout_ms: 300000,
    windowsHide: true,
    visible_window: false,
    owner_module: "dev_executor_backend",
    task_id: handoff.task_id || dispatch.task_id || null,
    workflow_id: handoff.workflow_id || null,
    singleton_key: `codex_cli_exec:${handoff.job_id}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  const debugArtifacts = buildDebugArtifacts(handoff.job_id, codexRun);
  if (codexRun.status !== "PASS") {
    return {
      status: "FAIL",
      reason: codexRun.reason || (codexRun.result && codexRun.result.error) || "codex_exec_failed",
      raw_failure_ref: promptPath,
      artifacts_returned: [promptPath, schemaPath, debugArtifacts.stdoutPath, debugArtifacts.stderrPath],
    };
  }
  if (!fs.existsSync(outputPath)) {
    return {
      status: "FAIL",
      reason: "codex_result_missing",
      raw_failure_ref: promptPath,
      artifacts_returned: [promptPath, schemaPath, debugArtifacts.stdoutPath, debugArtifacts.stderrPath],
    };
  }
  let parsed = null;
  try {
    parsed = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  } catch (_) {
    return {
      status: "FAIL",
      reason: "codex_result_invalid_json",
      raw_failure_ref: outputPath,
      artifacts_returned: [promptPath, schemaPath, outputPath, debugArtifacts.stdoutPath, debugArtifacts.stderrPath],
    };
  }
  return {
    status: "PASS",
    parsed,
    raw_result_ref: outputPath,
    artifacts_returned: [promptPath, schemaPath, outputPath, debugArtifacts.stdoutPath, debugArtifacts.stderrPath],
  };
}

function parseCommandLine(commandLine) {
  const raw = String(commandLine || "").trim();
  if (!raw) return null;
  if (SHELL_META_PATTERN.test(raw)) return null;
  if (!ALLOWED_TEST_PREFIXES.some((pattern) => pattern.test(raw))) return null;
  const parts = raw.match(/"[^"]+"|'[^']+'|\S+/g) || [];
  const normalized = parts.map((part) => part.replace(/^['"]|['"]$/g, ""));
  if (!normalized.length) return null;
  return {
    command: normalized[0],
    args: normalized.slice(1),
    raw,
  };
}

function runBoundedTests(dispatch, handoff, shouldRunTests) {
  if (!shouldRunTests) {
    return {
      executed: [],
      passed: [],
      failed: [],
      artifacts: [],
    };
  }
  const tests = Array.isArray(dispatch.tests_required) ? dispatch.tests_required : [];
  const executed = [];
  const passed = [];
  const failed = [];
  const artifacts = [];
  for (const testCommand of tests) {
    const parsed = parseCommandLine(testCommand);
    if (!parsed) {
      failed.push(`${testCommand}:blocked_test_command`);
      continue;
    }
    const run = governedSpawnSync({
      command: parsed.command,
      args: parsed.args,
      cwd: dispatch.repo_path || config.ROOT,
      timeout_ms: 180000,
      windowsHide: true,
      visible_window: false,
      owner_module: "dev_executor_backend",
      task_id: handoff.task_id || dispatch.task_id || null,
      workflow_id: handoff.workflow_id || null,
      singleton_key: `test_runner:${handoff.job_id}:${Buffer.from(parsed.raw).toString("hex").slice(0, 12)}`,
      kill_policy: "timeout_kill",
      rate_limit_exempt: true,
    });
    const artifactPath = writeRuntimeArtifact(`${handoff.job_id}.${executed.length}.test_runner.json`, JSON.stringify({
      command: parsed.raw,
      status: run.status,
      exit_code: run.result && run.result.exit_code,
      stdout_preview: run.result && run.result.stdout_preview || "",
      stderr_preview: run.result && run.result.stderr_preview || "",
    }, null, 2));
    artifacts.push(artifactPath);
    executed.push(parsed.raw);
    if (run.status === "PASS") passed.push(parsed.raw);
    else failed.push(parsed.raw);
  }
  return { executed, passed, failed, artifacts };
}

function reviewRepoStage(dispatch, handoff, targets) {
  const statusRun = governedSpawnSync({
    command: "git",
    args: ["status", "--short", "--", ...targets],
    cwd: dispatch.repo_path || config.ROOT,
    timeout_ms: 30000,
    windowsHide: true,
    visible_window: false,
    owner_module: "dev_executor_backend",
    task_id: handoff.task_id || dispatch.task_id || null,
    workflow_id: handoff.workflow_id || null,
    singleton_key: `repo_stage_review:${handoff.job_id}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  const lines = String(statusRun.result && statusRun.result.stdout || "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  const changedFiles = unique(lines.map((line) => normalizeRepoPath(line.slice(3))).filter(Boolean));
  const outside = changedFiles.find((item) => !targets.includes(item));
  const artifactPath = writeRuntimeArtifact(`${handoff.job_id}.repo_stage_review.json`, JSON.stringify({
    status: statusRun.status,
    changed_files: changedFiles,
    outside_targets: outside ? [outside] : [],
    lines,
  }, null, 2));
  return {
    status: statusRun.status,
    changed_files: changedFiles,
    outside_target: outside || null,
    artifact_path: artifactPath,
  };
}

function mapCodexResult(result, dispatch, handoff, repoReview, testReview) {
  const parsed = result.parsed || {};
  const status = String(parsed.status || "FAIL").toUpperCase();
  const changedFiles = unique([...(Array.isArray(parsed.changed_files) ? parsed.changed_files : []), ...(repoReview.changed_files || [])]);
  const outsideTarget = changedFiles.find((item) => !(dispatch.files_expected_to_change || []).map(normalizeRepoPath).includes(normalizeRepoPath(item)));
  if (repoReview.outside_target || outsideTarget) {
    return buildFailure(
      handoff.job_id || null,
      handoff.task_id || dispatch.task_id || null,
      "changed_file_outside_approved_targets",
      false,
      {
        failure_stage: "repo_stage_review",
        raw_failure_ref: repoReview.artifact_path,
        summary: `executor changed file outside approved targets: ${repoReview.outside_target || outsideTarget}`,
      }
    );
  }
  if (status !== "PASS") {
    return buildFailure(
      handoff.job_id || null,
      handoff.task_id || dispatch.task_id || null,
      parsed.error || parsed.summary || "codex_exec_reported_failure",
      false,
      {
        failure_stage: "codex_exec",
        raw_failure_ref: result.raw_result_ref || null,
        summary: parsed.summary || parsed.error || "codex execution failed",
      }
    );
  }
  if ((testReview.failed || []).length) {
    return buildFailure(
      handoff.job_id || null,
      handoff.task_id || dispatch.task_id || null,
      "test_runner_failed",
      false,
      {
        failure_stage: "test_runner",
        raw_failure_ref: (testReview.artifacts || [])[0] || null,
        summary: `one or more required tests failed: ${testReview.failed.join(", ")}`,
      }
    );
  }
  return buildSuccess(
    handoff.job_id || null,
    handoff.task_id || dispatch.task_id || null,
    parsed.summary || "codex execution completed",
    {
      changed_files: changedFiles,
      tests_executed: unique([...(Array.isArray(parsed.tests_executed) ? parsed.tests_executed : []), ...(testReview.executed || [])]),
      tests_passed: unique([...(Array.isArray(parsed.tests_passed) ? parsed.tests_passed : []), ...(testReview.passed || [])]),
      tests_failed: unique([...(Array.isArray(parsed.tests_failed) ? parsed.tests_failed : []), ...(testReview.failed || [])]),
      artifacts_returned: [
        result.raw_result_ref || null,
        ...(result.artifacts_returned || []),
        repoReview.artifact_path || null,
        ...((testReview.artifacts || [])),
        ...(Array.isArray(parsed.artifacts_returned) ? parsed.artifacts_returned : []),
      ],
      raw_result_ref: result.raw_result_ref || null,
    }
  );
}

function commitWriteChanges(dispatch, handoff, changedFiles, summary) {
  const taskId = handoff.task_id || dispatch.task_id || "unknown";
  const targets = unique((changedFiles || []).map(normalizeRepoPath).filter(Boolean));
  if (!targets.length) {
    return { status: "SKIP", reason: "no_changed_files_to_commit" };
  }
  const addRun = governedSpawnSync({
    command: "git",
    args: ["add", "--", ...targets],
    cwd: dispatch.repo_path || config.ROOT,
    timeout_ms: 30000,
    windowsHide: true,
    visible_window: false,
    owner_module: "dev_executor_backend",
    task_id: taskId,
    workflow_id: handoff.workflow_id || null,
    singleton_key: `git_add:${handoff.job_id}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  if (addRun.status !== "PASS") {
    return { status: "FAIL", reason: addRun.reason || "git_add_failed", stage: "git_add" };
  }
  const message = `task:${taskId}: ${String(summary || "bounded write completed").slice(0, 120)}`;
  const commitRun = governedSpawnSync({
    command: "git",
    args: ["commit", "-m", message],
    cwd: dispatch.repo_path || config.ROOT,
    timeout_ms: 30000,
    windowsHide: true,
    visible_window: false,
    owner_module: "dev_executor_backend",
    task_id: taskId,
    workflow_id: handoff.workflow_id || null,
    singleton_key: `git_commit:${handoff.job_id}`,
    kill_policy: "timeout_kill",
    rate_limit_exempt: true,
  });
  if (commitRun.status !== "PASS") {
    const stderr = commitRun.result && commitRun.result.stderr_preview || "";
    if (/nothing to commit|nothing added to commit/i.test(stderr)) {
      return { status: "SKIP", reason: "nothing_to_commit" };
    }
    return { status: "FAIL", reason: commitRun.reason || "git_commit_failed", stage: "git_commit" };
  }
  return { status: "PASS", message, committed_files: targets };
}

function executeWriteTask(dispatch, handoff = {}) {
  const targetCheck = validateDispatchTargets(dispatch);
  if (!targetCheck.ok) {
    return buildFailure(handoff.job_id || null, handoff.task_id || dispatch.task_id || null, targetCheck.reason, false, {
      failure_stage: "dispatch_validation",
    });
  }
  const executorActions = buildWriteActions(dispatch.task_type);
  if (!executorActions.length) {
    return buildFailure(handoff.job_id || null, handoff.task_id || dispatch.task_id || null, "unsupported_write_task_type", false, {
      failure_stage: "dispatch_validation",
    });
  }
  const codexResult = runCodexWriteExecution(dispatch, handoff, targetCheck.targets, executorActions);
  if (codexResult.status !== "PASS") {
    return buildFailure(handoff.job_id || null, handoff.task_id || dispatch.task_id || null, codexResult.reason, false, {
      failure_stage: "codex_exec",
      raw_failure_ref: codexResult.raw_failure_ref || null,
      summary: codexResult.reason,
    });
  }
  const repoReview = reviewRepoStage(dispatch, handoff, targetCheck.targets);
  if (repoReview.status !== "PASS") {
    return buildFailure(handoff.job_id || null, handoff.task_id || dispatch.task_id || null, "repo_stage_review_failed", false, {
      failure_stage: "repo_stage_review",
      raw_failure_ref: repoReview.artifact_path || null,
    });
  }
  const testReview = runBoundedTests(dispatch, handoff, executorActions.includes("test_runner"));
  const result = mapCodexResult(codexResult, dispatch, handoff, repoReview, testReview);
  if (result.outcome === "success" && (result.changed_files || []).length > 0) {
    const commitResult = commitWriteChanges(dispatch, handoff, result.changed_files, result.summary);
    result.commit = commitResult;
    if (commitResult.status === "PASS") {
      result.summary = `${result.summary} [committed: ${commitResult.committed_files.length} file(s)]`;
    } else if (commitResult.status === "FAIL") {
      result.summary = `${result.summary} [commit failed: ${commitResult.reason}]`;
    }
  }
  return result;
}

function executeDispatch(dispatch, handoff = {}) {
  if (WRITE_TASK_TYPES.has(dispatch.task_type)) {
    return executeWriteTask(dispatch, handoff);
  }
  const objective = normalizeObjectiveText(
    dispatch
    && dispatch.implementation_brief
    && dispatch.implementation_brief.what_to_build
    || ""
  );
  const route = routeOperatorIntent(objective);
  if (!route.internal_action) {
    return buildFailure(handoff.job_id || null, handoff.task_id || dispatch.task_id || null, "unsupported_dispatch_objective");
  }
  return executeOperatorAction(route.internalAction || route.internal_action, handoff.job_id || null, handoff.task_id || dispatch.task_id || null);
}

module.exports = {
  executeDispatch,
};
