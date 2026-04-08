"use strict";

const { nowIso } = require("../shared/utils/fs_utils");
const { evaluateLaneResult } = require("../shared/contracts/lane_result_policy");

const RUN_STATES = [
  "started",
  "queued",
  "claimed",
  "running",
  "waiting",
  "completed",
  "failed",
  "timeout",
  "rejected",
];

function createRunRecord(taskSpec) {
  return {
    job_id: taskSpec.job_id,
    lane: taskSpec.lane,
    state: "started",
    timeline: [
      {
        state: "started",
        timestamp: nowIso(),
      },
    ],
  };
}

function transitionRun(runRecord, nextState) {
  if (!RUN_STATES.includes(nextState)) {
    throw new Error(`Invalid run state: ${nextState}`);
  }

  return {
    ...runRecord,
    state: nextState,
    timeline: [
      ...(runRecord.timeline || []),
      {
        state: nextState,
        timestamp: nowIso(),
      },
    ],
  };
}

function detectIssues(taskSpec, laneResult, options = {}) {
  const issues = [];
  const fatalIssues = [];
  const timeoutMs = options.timeoutMs || 300000;
  const startedAt = options.startedAt ? new Date(options.startedAt).getTime() : null;
  const nowMs = options.now ? new Date(options.now).getTime() : Date.now();
  const staleAfterMs = options.staleAfterMs || 120000;
  const queueState = String((laneResult && laneResult.metadata && laneResult.metadata.queue_state) || laneResult && laneResult.status || "");
  const claim = laneResult && laneResult.metadata && laneResult.metadata.claim;
  const claimTimestamp = claim && claim.claimed_at ? Date.parse(claim.claimed_at) : NaN;
  const { policy, assessment } = evaluateLaneResult(taskSpec, laneResult);

  if (!laneResult || typeof laneResult !== "object") {
    issues.push("malformed result");
    fatalIssues.push("malformed result");
    return { issues, fatalIssues, queue_state: "failed", policy_name: policy.lane, policy_assessment: assessment };
  }

  if (!RUN_STATES.includes(String(laneResult.status || ""))) {
    issues.push("malformed result");
    fatalIssues.push("malformed result");
  }

  if (startedAt && nowMs - startedAt > timeoutMs && laneResult.status !== "completed") {
    issues.push("timeout");
    fatalIssues.push("timeout");
  }

  if (laneResult.status === "timeout") {
    issues.push("timeout");
    fatalIssues.push("timeout");
  }

  if (claim && Number.isFinite(claimTimestamp) && nowMs - claimTimestamp > staleAfterMs && !assessment.success) {
    issues.push("stale claim");
    fatalIssues.push("stale claim");
  }

  issues.push(...assessment.issues);
  fatalIssues.push(...assessment.fatal_issues);

  return {
    issues: [...new Set(issues)],
    fatalIssues: [...new Set(fatalIssues)],
    queue_state: queueState || "unknown",
    policy_name: policy.lane,
    policy_assessment: assessment,
  };
}

function finalizeRun(taskSpec, laneResult, options = {}) {
  const issueReport = detectIssues(taskSpec, laneResult, options);
  const state = RUN_STATES.includes(String(laneResult && laneResult.status || ""))
    ? laneResult.status
    : issueReport.fatalIssues.length > 0 ? "failed" : "completed";

  return {
    job_id: taskSpec.job_id,
    lane: taskSpec.lane,
    state,
    queue_state: issueReport.queue_state,
    issues: issueReport.issues,
    fatal_issues: issueReport.fatalIssues,
    policy_name: issueReport.policy_name,
    policy_assessment: issueReport.policy_assessment,
    monitored_at: nowIso(),
  };
}

module.exports = {
  RUN_STATES,
  createRunRecord,
  transitionRun,
  detectIssues,
  finalizeRun,
};
