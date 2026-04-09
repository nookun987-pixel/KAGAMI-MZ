"use strict";

const crypto = require("crypto");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function buildIssueFingerprint(issue) {
  return crypto.createHash("sha256").update(JSON.stringify({
    issue_type: issue.issue_type,
    component: issue.component,
    summary: issue.summary,
    evidence_refs: issue.evidence_refs || [],
  })).digest("hex");
}

function readMaintenanceIssueRegistry() {
  return readJsonSafe(config.MAINTENANCE_ISSUE_REGISTRY_PATH, {
    generated_at: null,
    issues: [],
  });
}

function writeMaintenanceIssueRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.MAINTENANCE_ISSUE_REGISTRY_PATH, store);
}

function registerMaintenanceIssues(scan) {
  const store = readMaintenanceIssueRegistry();
  const issues = Array.isArray(store.issues) ? store.issues : [];
  for (const issue of scan.issues || []) {
    const fingerprint = buildIssueFingerprint(issue);
    const existing = issues.find((item) => item.fingerprint === fingerprint);
    if (existing) {
      existing.last_seen_at = new Date().toISOString();
      existing.seen_count = Number(existing.seen_count || 1) + 1;
      continue;
    }
    issues.unshift({
      issue_id: `issue_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
      issue_type: issue.issue_type,
      severity: issue.severity,
      component: issue.component,
      evidence_refs: issue.evidence_refs || [],
      repairability: issue.repairability || "review_required",
      suggested_task_type: issue.suggested_task_type || "patch_bug",
      detected_at: new Date().toISOString(),
      summary: issue.summary || issue.issue_type,
      fingerprint,
      seen_count: 1,
    });
  }
  store.issues = issues.slice(0, 500);
  writeMaintenanceIssueRegistry(store);
  return store;
}

module.exports = {
  readMaintenanceIssueRegistry,
  writeMaintenanceIssueRegistry,
  registerMaintenanceIssues,
};
