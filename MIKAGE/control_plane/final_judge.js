"use strict";

const { nowIso } = require("../shared/utils/fs_utils");
const { evaluateLaneResult } = require("../shared/contracts/lane_result_policy");

function judgeTask(taskSpec, laneResult, monitorReport) {
  const reasons = [];
  const fatalIssues = new Set((monitorReport && monitorReport.fatal_issues) || []);
  const policyAssessment = (monitorReport && monitorReport.policy_assessment)
    || evaluateLaneResult(taskSpec, laneResult).assessment;

  if (!laneResult || typeof laneResult !== "object") {
    reasons.push("Lane result malformed.");
    return buildDecision("REJECT", reasons);
  }

  if (fatalIssues.has("malformed result") || fatalIssues.has("malformed result artifact")) {
    reasons.push("Lane result is malformed.");
    return buildDecision("REJECT", reasons);
  }

  if (fatalIssues.has("validator fail")) {
    reasons.push("Lane validator failed.");
    return buildDecision("REJECT", reasons);
  }

  if (fatalIssues.has("timeout")) {
    reasons.push("Run timed out before a valid result arrived.");
    return buildDecision("REJECT", reasons);
  }

  if (fatalIssues.has("stale claim")) {
    reasons.push("Claim became stale without satisfying lane completion policy.");
    return buildDecision("REJECT", reasons);
  }

  if ((policyAssessment.missing_artifacts || []).length > 0) {
    reasons.push(`Required lane artifacts missing: ${(policyAssessment.missing_artifacts || []).join(", ")}.`);
    return buildDecision("REJECT", reasons);
  }

  if (laneResult.status === "failed" || laneResult.status === "rejected" || laneResult.status === "timeout") {
    reasons.push(`Lane ended with terminal state ${laneResult.status}.`);
    return buildDecision("REJECT", reasons);
  }

  if (policyAssessment.success) {
    reasons.push("Lane completion policy satisfied.");
    return buildDecision("ALLOW", reasons);
  }

  reasons.push("Result incomplete under lane completion policy.");
  return buildDecision("REVISE", reasons);
}

function buildDecision(decision, reasons) {
  return {
    decision,
    reasons,
    timestamp: nowIso(),
  };
}

module.exports = {
  judgeTask,
  buildDecision,
};
