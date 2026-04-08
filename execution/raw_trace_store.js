"use strict";

const fs = require("fs");
const path = require("path");

const { ensureDir, writeJson } = require("../MIKAGE/shared/utils/fs_utils");

function getTraceRoot(options = {}) {
  return path.resolve(options.traceRoot || path.join(process.cwd(), "traces"));
}

function getAttemptTraceDir(jobId, attemptIndex, options = {}) {
  const traceRoot = getTraceRoot(options);
  const attemptName = `attempt-${String(attemptIndex).padStart(2, "0")}`;
  return path.join(traceRoot, jobId, attemptName);
}

function writeRawTrace(tracePayload, options = {}) {
  const jobId = tracePayload && tracePayload.taskSpec && tracePayload.taskSpec.job_id
    ? tracePayload.taskSpec.job_id
    : tracePayload && tracePayload.job_id
      ? tracePayload.job_id
      : "UNKNOWN_JOB";
  const attemptIndex = Number.isInteger(options.attemptIndex) ? options.attemptIndex : 1;
  const traceDir = getAttemptTraceDir(jobId, attemptIndex, options);

  ensureDir(traceDir);

  const fullPrompt = String(
    tracePayload && tracePayload.taskSpec && (tracePayload.taskSpec.objective || tracePayload.taskSpec.prompt)
    || tracePayload && tracePayload.intent && tracePayload.intent.goal
    || ""
  );

  const fullResponse = JSON.stringify(tracePayload && tracePayload.laneResult || tracePayload || {}, null, 2);
  const lineage = tracePayload && tracePayload.repairAction && tracePayload.repairAction.lineage
    ? tracePayload.repairAction.lineage
    : tracePayload && tracePayload.taskSpec && tracePayload.taskSpec.context && tracePayload.taskSpec.context.lineage
      ? tracePayload.taskSpec.context.lineage
      : null;
  const laneResult = tracePayload && tracePayload.laneResult || {};
  const validatorResult = laneResult && laneResult.validator_result || {};
  const judgeOutput = validatorResult.judge_output
    || laneResult && laneResult.metadata && laneResult.metadata.judge_output
    || null;

  writeJson(path.join(traceDir, "raw_execution_trace.json"), tracePayload || {});
  writeJson(path.join(traceDir, "analyzer_full.json"), {
    monitorReport: tracePayload && tracePayload.monitorReport || null,
    policyAssessment: tracePayload && tracePayload.monitorReport && tracePayload.monitorReport.policy_assessment || null,
    laneResult: tracePayload && tracePayload.laneResult || null,
  });
  writeJson(path.join(traceDir, "judge_full.json"), {
    decision: tracePayload && tracePayload.decision || null,
    failureRoute: tracePayload && tracePayload.failureRoute || null,
    repairAction: tracePayload && tracePayload.repairAction || null,
  });
  writeJson(path.join(traceDir, "failure_route.json"), tracePayload && tracePayload.failureRoute !== undefined ? tracePayload.failureRoute : {});
  writeJson(path.join(traceDir, "repair_action.json"), tracePayload && tracePayload.repairAction !== undefined ? tracePayload.repairAction : {});
  writeJson(path.join(traceDir, "quality_failure_packet.json"), tracePayload && tracePayload.qualityFailurePacket !== undefined ? tracePayload.qualityFailurePacket : null);
  writeJson(path.join(traceDir, "repair_patch_packet.json"), tracePayload && tracePayload.repairPatchPacket !== undefined ? tracePayload.repairPatchPacket : null);
  writeJson(path.join(traceDir, "quality_retry_decision.json"), tracePayload && tracePayload.qualityRetryDecision !== undefined ? tracePayload.qualityRetryDecision : {});
  writeJson(path.join(traceDir, "quality_score_delta.json"), tracePayload && tracePayload.qualityScoreDelta !== undefined ? tracePayload.qualityScoreDelta : null);
  writeJson(path.join(traceDir, "gemini_validation.json"), judgeOutput ? {
    job_id: tracePayload && tracePayload.taskSpec && tracePayload.taskSpec.job_id || null,
    attempt_index: tracePayload && tracePayload.attempt_index || attemptIndex,
    source: judgeOutput.source || "UNVERIFIED",
    status: judgeOutput.status || "UNVERIFIED",
    quality_score: typeof judgeOutput.quality_score === "number" ? judgeOutput.quality_score : null,
    overall_score: typeof judgeOutput.overall_score === "number" ? judgeOutput.overall_score : null,
    failure_codes: Array.isArray(judgeOutput.failure_codes) ? judgeOutput.failure_codes : [],
    notes: Array.isArray(judgeOutput.notes) ? judgeOutput.notes : judgeOutput.notes ? [judgeOutput.notes] : [],
    judge_output_path: validatorResult && validatorResult.judge_output_path
      || laneResult && laneResult.metadata && laneResult.metadata.judge_output_file_path
      || null,
    validator_executed: Boolean(tracePayload && tracePayload.monitorReport || validatorResult),
    validator_passed: Boolean(validatorResult && validatorResult.passed),
    proof_blocked: Boolean(validatorResult && validatorResult.proof_blocked || tracePayload && tracePayload.proof_blocked),
  } : null);
  writeJson(path.join(traceDir, "dna_lock_packet.json"), tracePayload && tracePayload.dnaLockPacket !== undefined ? tracePayload.dnaLockPacket : null);
  writeJson(path.join(traceDir, "variation_envelope.json"), tracePayload && tracePayload.variationEnvelope !== undefined ? tracePayload.variationEnvelope : null);
  writeJson(path.join(traceDir, "variant_spec.json"), tracePayload && tracePayload.variantSpec !== undefined ? tracePayload.variantSpec : null);
  writeJson(path.join(traceDir, "variant_judge_output.json"), tracePayload && tracePayload.variantJudgeOutput !== undefined ? tracePayload.variantJudgeOutput : null);
  writeJson(path.join(traceDir, "variant_delta_report.json"), tracePayload && tracePayload.variantDeltaReport !== undefined ? tracePayload.variantDeltaReport : null);
  writeJson(path.join(traceDir, "retry_lineage.json"), lineage || {});
  writeJson(path.join(traceDir, "final_decision.json"), {
    job_id: tracePayload && tracePayload.taskSpec && tracePayload.taskSpec.job_id || null,
    attempt_index: tracePayload && tracePayload.attempt_index || attemptIndex,
    decision: tracePayload && tracePayload.decision || null,
    monitorReport: tracePayload && tracePayload.monitorReport || null,
    variantJudgeOutput: tracePayload && tracePayload.variantJudgeOutput || null,
  });
  writeJson(path.join(traceDir, "final_decision_snapshot.json"), {
    job_id: tracePayload && tracePayload.taskSpec && tracePayload.taskSpec.job_id || null,
    attempt_index: tracePayload && tracePayload.attempt_index || attemptIndex,
    decision: tracePayload && tracePayload.decision || null,
    monitorReport: tracePayload && tracePayload.monitorReport || null,
  });

  fs.writeFileSync(path.join(traceDir, "full_prompt.txt"), fullPrompt, "utf-8");
  fs.writeFileSync(path.join(traceDir, "full_response.txt"), fullResponse, "utf-8");

  return {
    trace_dir: traceDir,
    raw_execution_trace_path: path.join(traceDir, "raw_execution_trace.json"),
    full_prompt_path: path.join(traceDir, "full_prompt.txt"),
    full_response_path: path.join(traceDir, "full_response.txt"),
    analyzer_full_path: path.join(traceDir, "analyzer_full.json"),
    judge_full_path: path.join(traceDir, "judge_full.json"),
    failure_route_path: path.join(traceDir, "failure_route.json"),
    repair_action_path: path.join(traceDir, "repair_action.json"),
    quality_failure_packet_path: path.join(traceDir, "quality_failure_packet.json"),
    repair_patch_packet_path: path.join(traceDir, "repair_patch_packet.json"),
    quality_retry_decision_path: path.join(traceDir, "quality_retry_decision.json"),
    quality_score_delta_path: path.join(traceDir, "quality_score_delta.json"),
    gemini_validation_path: path.join(traceDir, "gemini_validation.json"),
    dna_lock_packet_path: path.join(traceDir, "dna_lock_packet.json"),
    variation_envelope_path: path.join(traceDir, "variation_envelope.json"),
    variant_spec_path: path.join(traceDir, "variant_spec.json"),
    variant_judge_output_path: path.join(traceDir, "variant_judge_output.json"),
    variant_delta_report_path: path.join(traceDir, "variant_delta_report.json"),
    retry_lineage_path: path.join(traceDir, "retry_lineage.json"),
    final_decision_path: path.join(traceDir, "final_decision.json"),
    final_decision_snapshot_path: path.join(traceDir, "final_decision_snapshot.json"),
  };
}

module.exports = {
  getTraceRoot,
  getAttemptTraceDir,
  writeRawTrace,
};
