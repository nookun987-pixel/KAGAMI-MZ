"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson, readJsonSafe } = require("./local_control_agent/bridge_writer");

function exists(filePath) {
  return !!filePath && fs.existsSync(filePath);
}

function scanRepoHealth() {
  const issues = [];
  const approvalInbox = readJsonSafe(config.APPROVAL_INBOX_PATH, { pending: [] });
  const retryQueue = readJsonSafe(config.RETRY_QUEUE_PATH, { queued: [] });
  const workflowRegistry = readJsonSafe(config.WORKFLOW_REGISTRY_JSON, {});
  const dashboardPath = path.join(config.ROOT, "control_plane", "local_control_agent", "dashboard.html");
  const apiPath = path.join(config.ROOT, "control_plane", "commander_api_server.js");

  for (const item of approvalInbox.pending || []) {
    if (item.expires_at && new Date(item.expires_at).getTime() < Date.now()) {
      issues.push({
        issue_type: "stale_pending_approval",
        severity: "medium",
        component: "approval_inbox",
        evidence_refs: [config.APPROVAL_INBOX_PATH, item.preview_ref, item.diff_ref].filter(Boolean),
        repairability: "repairable",
        suggested_task_type: "patch_bug",
        summary: `stale approval ${item.approval_id}`,
      });
    }
  }

  for (const entry of retryQueue.queued || []) {
    if (entry.next_retry_at && new Date(entry.next_retry_at).getTime() < Date.now() - 10 * 60 * 1000) {
      issues.push({
        issue_type: "stale_retry_entry",
        severity: "medium",
        component: "retry_queue",
        evidence_refs: [config.RETRY_QUEUE_PATH, entry.failure_id].filter(Boolean),
        repairability: "repairable",
        suggested_task_type: "patch_bug",
        summary: `stale retry ${entry.retry_id}`,
      });
    }
  }

  const latestArtifacts = workflowRegistry.latest_task_artifacts || {};
  for (const [taskId, refs] of Object.entries(latestArtifacts)) {
    for (const ref of [refs.task_contract_ref, refs.task_brief_ref, refs.codex_dispatch_pack_ref]) {
      if (ref && !exists(ref)) {
        issues.push({
          issue_type: "dead_report_link",
          severity: "medium",
          component: "workflow_registry",
          evidence_refs: [config.WORKFLOW_REGISTRY_JSON, ref, taskId],
          repairability: "repairable",
          suggested_task_type: "patch_bug",
          summary: `missing artifact ref for ${taskId}`,
        });
      }
    }
  }

  if (!exists(dashboardPath) || !exists(apiPath)) {
    issues.push({
      issue_type: "missing_dashboard_api_linkage",
      severity: "high",
      component: "visibility",
      evidence_refs: [dashboardPath, apiPath],
      repairability: "repairable",
      suggested_task_type: "patch_bug",
      summary: "dashboard/api linkage missing",
    });
  }

  const scan = {
    generated_at: new Date().toISOString(),
    issues,
  };
  const outPath = path.join(config.REPO_HEALTH_SCAN_DIR, `repo_health_${Date.now()}.repo_health_scan.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  writeJson(outPath, scan);
  return { status: "PASS", scan, artifact_path: outPath };
}

module.exports = {
  scanRepoHealth,
};
