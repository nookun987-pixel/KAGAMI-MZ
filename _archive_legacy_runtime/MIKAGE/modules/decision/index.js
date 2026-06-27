"use strict";

const { judgeTask } = require("../../control_plane/final_judge");
const { routeFailure } = require("../../../execution/failure_router");
const { compileCanonPatchPacket } = require("../../../canon_evolution/canon_patch_compiler");
const { buildQualityRetryDecision } = require("../../../execution/quality_retry_policy");
const { evaluateQualityRetryGuard } = require("../../../safe_loop/quality_retry_guard");
const { buildRepairAction } = require("../../../execution/repair_engine");

function computeQualityScoreDelta(previousAttempt, qualityFailurePacket) {
  const currentScore = typeof qualityFailurePacket.quality_score === "number" ? qualityFailurePacket.quality_score : 0;
  const previousScore = previousAttempt && previousAttempt.qualityFailurePacket && typeof previousAttempt.qualityFailurePacket.quality_score === "number"
    ? previousAttempt.qualityFailurePacket.quality_score
    : null;

  return {
    previous_score: previousScore,
    current_score: currentScore,
    delta: previousScore === null ? null : currentScore - previousScore,
    improved: previousScore === null ? null : currentScore > previousScore,
  };
}

function run(context = {}) {
  const {
    taskSpec,
    intent,
    laneResult,
    monitorReport,
    qualityFailurePacket,
    variantJudgeOutput,
    proofBlocked,
    attemptIndex,
    options = {},
  } = context;

  const decision = judgeTask(taskSpec, laneResult, monitorReport);
  const failureRoute = routeFailure({
    taskSpec,
    intent,
    laneResult,
    monitorReport,
    decision,
    qualityFailurePacket,
  });
  const repairPatchPacket = qualityFailurePacket && !proofBlocked
    ? compileCanonPatchPacket({
      taskSpec,
      qualityFailurePacket,
      canonMemory: options.canonMemory || {},
    })
    : null;

  if (qualityFailurePacket) {
    qualityFailurePacket.pass = decision.decision === "ALLOW";
    qualityFailurePacket.contract_version = "MIKAGE_VISUAL_CONTRACT_V1";
    qualityFailurePacket.critical_failure = decision.decision !== "ALLOW" && (qualityFailurePacket.primary_failure_codes || []).length > 0;
    qualityFailurePacket.patch_targets = repairPatchPacket && repairPatchPacket.patch_targets || qualityFailurePacket.patch_targets || [];
  }

  const qualityRetryGuard = evaluateQualityRetryGuard({
    attempts: options.previousAttempts,
    qualityFailurePacket: qualityFailurePacket || {},
    currentAttempt: attemptIndex,
    maxAttempts: options.maxAttempts,
  });
  let qualityRetryDecision = buildQualityRetryDecision({
    failureRoute,
    qualityFailurePacket: qualityFailurePacket || {},
    guard: qualityRetryGuard,
    proofBlocked,
  });
  const qualityScoreDelta = computeQualityScoreDelta(
    Array.isArray(options.previousAttempts) && options.previousAttempts.length > 0
      ? options.previousAttempts[options.previousAttempts.length - 1]
      : null,
    qualityFailurePacket || {}
  );

  let effectiveDecision = decision;
  let effectiveQualityFailurePacket = qualityFailurePacket;
  let effectiveFailureRoute = failureRoute;
  let effectiveRepairPatchPacket = repairPatchPacket;

  if (
    variantJudgeOutput
    && variantJudgeOutput.verdict === "PASS_CANON_VARIANT"
    && variantJudgeOutput.observed_verdict
    && variantJudgeOutput.observed_verdict !== variantJudgeOutput.verdict
  ) {
    effectiveDecision = {
      ...decision,
      decision: "ALLOW",
      reason: "Deterministic judge cache consensus override.",
    };
    if (qualityFailurePacket) {
      effectiveQualityFailurePacket = {
        ...qualityFailurePacket,
        raw_failure_codes: qualityFailurePacket.failure_codes || [],
        primary_failure_code: "",
        primary_failure_codes: [],
        secondary_failure_codes: [],
        failure_codes: [],
        critical_failure: false,
        deterministic_override: true,
      };
    }
    effectiveFailureRoute = {
      failure_type: "",
      responsible_module: "evaluation/variant_judge.js",
      repair_strategy: "deterministic_cache_override",
      repair_class: "",
      retry_allowed: false,
    };
    effectiveRepairPatchPacket = null;
    qualityRetryDecision = {
      retry_allowed: false,
      repair_class: "",
      decision_reason: "DETERMINISTIC_JUDGE_CACHE_HIT",
      hard_stop: true,
      repeated_failure_code: "",
      proof_blocked: false,
    };
  }

  return {
    decision,
    failureRoute,
    repairPatchPacket,
    qualityRetryDecision,
    qualityScoreDelta,
    effectiveDecision,
    effectiveQualityFailurePacket,
    effectiveFailureRoute,
    effectiveRepairPatchPacket,
  };
}

function finalizeRepair(tracePaths, context = {}) {
  const repairAction = buildRepairAction(tracePaths, context.effectiveFailureRoute, {
    attemptIndex: context.attemptIndex,
    maxAttempts: context.options && context.options.maxAttempts,
    timeoutMs: context.options && context.options.timeoutMs,
    qualityFailurePacket: context.effectiveQualityFailurePacket,
    qualityRetryDecision: context.qualityRetryDecision,
    repairPatchPacket: context.effectiveRepairPatchPacket,
    canonMemory: context.options && context.options.canonMemory,
  });

  if (repairAction && context.effectiveRepairPatchPacket && tracePaths && tracePaths.repair_patch_packet_path) {
    repairAction.repair_patch_packet_path = tracePaths.repair_patch_packet_path;
  }

  return repairAction;
}

module.exports = {
  run,
  finalizeRepair,
};
