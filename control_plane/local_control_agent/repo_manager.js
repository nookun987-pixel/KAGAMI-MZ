"use strict";

const config = require("./config");
const { governedExecFileSync } = require("../process_governor");

function runGit(args, options = {}) {
  const result = governedExecFileSync({
    command: "git",
    args,
    cwd: options.cwd || config.ROOT,
    owner_module: "repo_manager",
    rate_limit_exempt: true,
    task_id: options.task_id || null,
    workflow_id: options.workflow_id || null,
    timeout_ms: options.timeout_ms || config.PROCESS_LIMITS.default_timeout_ms,
  });
  if (result.status !== "PASS") {
    throw new Error(result.result && (result.result.error || result.result.stderr_preview) || result.reason || "git_command_failed");
  }
  return result.result.stdout;
}

function repoStatus(options = {}) {
  const branch = runGit(["rev-parse", "--abbrev-ref", "HEAD"], options).trim();
  const status = runGit(["status", "--short"], options).trim().split(/\r?\n/).filter(Boolean);
  return {
    branch,
    dirty: status.length > 0,
    files: status,
  };
}

function currentBranch(options = {}) {
  return runGit(["rev-parse", "--abbrev-ref", "HEAD"], options).trim();
}

function diffNameStatus(options = {}) {
  return runGit(["diff", "--name-status", "--cached"], options)
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
}

function stageFiles(files, options = {}) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("reviewed_stage_requires_explicit_files");
  }
  for (const file of files) {
    runGit(["add", "--", file], options);
  }
  return {
    staged_files: files,
    changed_files: diffNameStatus(options),
  };
}

function commitReviewed(message, files, options = {}) {
  const staged = stageFiles(files, options);
  const output = runGit(["commit", "-m", message], options);
  return {
    status: "PASS",
    committed: true,
    message,
    changed_files: staged.staged_files,
    diff_preview: staged.changed_files,
    output,
  };
}

function pushReviewed(branch, options = {}) {
  const targetBranch = branch || "HEAD";
  if (["main", "master"].includes(String(targetBranch).toLowerCase()) && !options.explicitApprovedPath) {
    throw new Error("push_to_main_requires_explicit_reviewed_approval");
  }
  const remote = options.remote || "origin";
  const sourceRef = options.sourceRef || null;
  const pushArgs = sourceRef
    ? ["push", remote, `${sourceRef}:refs/heads/${targetBranch}`]
    : ["push", remote, targetBranch];
  const output = runGit(pushArgs, options);
  return {
    status: "PASS",
    pushed: true,
    remote,
    branch: targetBranch,
    source_ref: sourceRef || targetBranch,
    changed_files: diffNameStatus(options),
    output,
  };
}

module.exports = {
  repoStatus,
  currentBranch,
  diffNameStatus,
  stageFiles,
  commitReviewed,
  pushReviewed,
};
