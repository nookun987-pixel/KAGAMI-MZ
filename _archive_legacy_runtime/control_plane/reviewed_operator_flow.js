"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const repoManager = require("./local_control_agent/repo_manager");
const diskAgent = require("./local_control_agent/disk_maintenance_agent");
const codexDispatcher = require("./local_control_agent/codex_dispatcher");
const desktopOperator = require("./local_control_agent/desktop_operator");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureStateDirs() {
  fs.mkdirSync(config.LOCAL_AGENT_STATE_DIR, { recursive: true });
  fs.mkdirSync(config.LOCAL_AGENT_REPORTS_DIR, { recursive: true });
}

function resolveActionPolicy(action) {
  const model = readJson(config.APPROVAL_MODEL);
  if ((model.auto_allow || []).includes(action)) return "auto_allow";
  if ((model.require_approval || []).includes(action)) return "require_approval";
  return "hard_block";
}

function writeReviewedState(record) {
  ensureStateDirs();
  fs.writeFileSync(config.LOCAL_AGENT_LAST_ACTION, JSON.stringify(record, null, 2), "utf8");
  const reportPath = path.join(config.LOCAL_AGENT_REPORTS_DIR, `${record.intent.command_id}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(record, null, 2), "utf8");
  return reportPath;
}

function buildReviewedBranchName(intent) {
  const seed = String(intent.command_id || Date.now()).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
  return `reviewed/${seed}`;
}

async function runReviewedOperator(intent, options = {}) {
  ensureStateDirs();
  const started = Date.now();
  const action = intent.action;
  const policy = resolveActionPolicy(action);
  const approvalStatus = intent.approval_status || "pending";
  const preview = {
    requested_files: intent.files || [],
    changed_files: [],
  };

  if (action === "repo.push" && ["main", "master"].includes(String(intent.branch || "").toLowerCase()) && !intent.explicit_approved_path) {
    const record = {
      intent,
      preview,
      approval_decision: { policy: "hard_block", approval_status: approvalStatus },
      execution_result: { status: "BLOCKED", reason: "push_to_main_blocked_without_explicit_review" },
      changed_files: [],
      duration_ms: Date.now() - started,
      ts: new Date().toISOString(),
    };
    const reportPath = writeReviewedState(record);
    return { reviewed: true, status: "BLOCKED", report_path: reportPath, record };
  }

  if (policy === "hard_block") {
    const record = {
      intent,
      preview,
      approval_decision: { policy, approval_status: approvalStatus },
      execution_result: { status: "BLOCKED", reason: "action_hard_blocked" },
      changed_files: [],
      duration_ms: Date.now() - started,
      ts: new Date().toISOString(),
    };
    const reportPath = writeReviewedState(record);
    return { reviewed: true, status: "BLOCKED", report_path: reportPath, record };
  }

  if (policy === "require_approval" && approvalStatus !== "approved") {
    const record = {
      intent,
      preview,
      approval_decision: { policy, approval_status: approvalStatus },
      execution_result: { status: "BLOCKED", reason: "approval_required" },
      changed_files: [],
      duration_ms: Date.now() - started,
      ts: new Date().toISOString(),
    };
    const reportPath = writeReviewedState(record);
    return { reviewed: true, status: "BLOCKED", report_path: reportPath, record };
  }

  let executionResult;
  switch (action) {
    case "repo.commit": {
      preview.changed_files = repoManager.diffNameStatus(options);
      executionResult = repoManager.commitReviewed(
        intent.message || "reviewed operator commit",
        intent.files || [],
        options
      );
      break;
    }
    case "repo.push": {
      preview.changed_files = repoManager.diffNameStatus(options);
      executionResult = repoManager.pushReviewed(
        intent.branch || "HEAD",
        {
          remote: intent.remote || "origin",
          explicitApprovedPath: !!intent.explicit_approved_path,
          ...options,
        }
      );
      break;
    }
    case "repo.reviewed_commit_push": {
      preview.changed_files = repoManager.diffNameStatus(options);
      const requestedBranch = String(intent.branch || "").trim();
      const effectiveBranch = ["", "head", "main", "master"].includes(requestedBranch.toLowerCase())
        ? buildReviewedBranchName(intent)
        : requestedBranch;
      const commitResult = repoManager.commitReviewed(
        intent.message || "reviewed operator commit",
        intent.files || [],
        options
      );
      const pushResult = repoManager.pushReviewed(
        effectiveBranch,
        {
          remote: intent.remote || "origin",
          explicitApprovedPath: true,
          sourceRef: "HEAD",
          ...options,
        }
      );
      executionResult = {
        status: "PASS",
        committed: true,
        pushed: true,
        branch: pushResult.branch,
        remote: pushResult.remote,
        changed_files: commitResult.changed_files,
        commit_output: commitResult.output,
        push_output: pushResult.output,
      };
      break;
    }
    case "disk.safe_clean": {
      executionResult = diskAgent.diskSafeClean((intent.targets || []).map((target) => ({
        path: target.path,
      })));
      break;
    }
    case "codex.build_task": {
      executionResult = codexDispatcher.buildCodexTask({
        command_id: intent.command_id,
        action,
        payload: intent.payload || {},
        approval: { status: approvalStatus },
      });
      break;
    }
    case "desktop.run_shell": {
      executionResult = desktopOperator.runShell(intent.payload || {}, { commandId: intent.command_id });
      break;
    }
    case "desktop.send_keys": {
      executionResult = desktopOperator.sendKeys(intent.payload || {}, { commandId: intent.command_id });
      break;
    }
    case "desktop.type_text": {
      executionResult = desktopOperator.typeText(intent.payload || {}, { commandId: intent.command_id });
      break;
    }
    case "desktop.basic_click": {
      executionResult = desktopOperator.basicClick(intent.payload || {}, { commandId: intent.command_id });
      break;
    }
    default: {
      executionResult = { status: "BLOCKED", reason: "unsupported_reviewed_action" };
      break;
    }
  }

  const changedFiles = executionResult.changed_files || executionResult.removed || intent.files || [];
  const record = {
    intent,
    preview,
    approval_decision: { policy, approval_status: approvalStatus },
    execution_result: executionResult,
    changed_files: changedFiles,
    duration_ms: Date.now() - started,
    ts: new Date().toISOString(),
  };
  const reportPath = writeReviewedState(record);
  return {
    reviewed: true,
    status: executionResult.status || "PASS",
    report_path: reportPath,
    record,
  };
}

module.exports = {
  resolveActionPolicy,
  runReviewedOperator,
};
