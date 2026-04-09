"use strict";

const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { writeJson } = require("./local_control_agent/bridge_writer");
const { evaluateCleanupScope } = require("./cleanup_scope_guard");
const { evaluateMaintenanceBudget } = require("./maintenance_budget_guard");

function buildRepairCandidate(issue) {
  const componentPath = String(issue.component || "control_plane").replace(/\./g, "/");
  const inferredScope = componentPath.startsWith("control_plane")
    ? componentPath
    : `control_plane/${componentPath}`;
  return {
    issue_id: issue.issue_id,
    task_type: issue.suggested_task_type || "patch_bug",
    title: `Repair ${issue.issue_type}`,
    objective: `Repair ${issue.issue_type} in ${issue.component}`,
    scope_in: [inferredScope],
    scope_out: ["start_mikage.bat", "MIKAGE/index.js", "runtime/drive_queue/runtime.js", "runtime/colab_worker/*"],
    forbidden_paths: ["start_mikage.bat", "MIKAGE/index.js", "runtime/drive_queue/runtime.js", "runtime/colab_worker/*"],
    target_files: [inferredScope],
    success_criteria: [`${issue.issue_type} no longer detected`, "bounded tests pass"],
    evidence_refs: issue.evidence_refs || [],
    reason: issue.summary,
    severity: issue.severity,
  };
}

function planSelfHeal(registry) {
  const candidates = [];
  const rejected = [];
  for (const issue of registry.issues || []) {
    if (issue.repairability !== "repairable") {
      rejected.push({ issue_id: issue.issue_id, reason: "issue_not_repairable" });
      continue;
    }
    const candidate = buildRepairCandidate(issue);
    const cleanupGuard = evaluateCleanupScope(candidate);
    if (!cleanupGuard.allowed) {
      rejected.push({ issue_id: issue.issue_id, reason: cleanupGuard.reason });
      continue;
    }
    const budget = evaluateMaintenanceBudget({ issue_id: issue.issue_id, severity: issue.severity });
    if (!budget.allowed) {
      rejected.push({ issue_id: issue.issue_id, reason: budget.reason });
      continue;
    }
    candidates.push({
      ...candidate,
      require_operator_review: !!budget.require_operator_review,
    });
  }
  const decision = candidates[0] || null;
  return {
    status: "PASS",
    candidates,
    decision,
    rejected,
  };
}

function writeSelfHealCandidatesArtifact(candidates) {
  const filePath = path.join(config.SELF_HEAL_CANDIDATES_DIR, `self_heal_${Date.now()}.self_heal_candidates.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, candidates);
  return filePath;
}

function writeSelfHealDecisionArtifact(decision) {
  const filePath = path.join(config.SELF_HEAL_DECISION_DIR, `self_heal_${Date.now()}.self_heal_decision.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, decision);
  return filePath;
}

module.exports = {
  planSelfHeal,
  writeSelfHealCandidatesArtifact,
  writeSelfHealDecisionArtifact,
};
