"use strict";

const { finalizeRun } = require("../../control_plane/run_monitor");
const { extractQualityFailurePacket } = require("../../../evaluation/quality_failure_extractor");
const { judgeVariant, buildVariantDeltaReport } = require("../../../evaluation/variant_judge");

function run(context = {}) {
  const { taskSpec, laneResult, runRecord, attemptIndex, options = {} } = context;
  const monitorReport = finalizeRun(taskSpec, laneResult, {
    startedAt: runRecord.timeline[0].timestamp,
    timeoutMs: options.timeoutMs,
    lastHeartbeatAt: runRecord.timeline[runRecord.timeline.length - 1].timestamp,
  });

  const liveJudgeOutput = laneResult && laneResult.metadata && laneResult.metadata.judge_output
    && String(laneResult.metadata.judge_output.source || "").toLowerCase() === "live"
      ? laneResult.metadata.judge_output
      : null;
  const proofBlocked = !liveJudgeOutput;
  const qualityFailurePacket = liveJudgeOutput
    ? extractQualityFailurePacket({
      judgeOutput: liveJudgeOutput,
      validatorResult: laneResult && laneResult.validator_result || {},
      laneResult,
      monitorReport,
    })
    : null;

  const variantJudgeOutput = taskSpec && taskSpec.context && taskSpec.context.variant_spec
    ? judgeVariant({
      jobId: taskSpec.job_id,
      taskSpec,
      variantSpec: taskSpec.context.variant_spec,
      qualityFailurePacket: qualityFailurePacket || {},
      judgeOutput: liveJudgeOutput || laneResult && laneResult.metadata && laneResult.metadata.judge_output || {},
      laneResult,
      approvedVariantRegistry: options.approvedVariantRegistry || {},
      traceRoot: options.traceRoot,
      judgeCachePath: options.judgeCachePath,
    })
    : null;
  const variantDeltaReport = variantJudgeOutput
    ? buildVariantDeltaReport({
      jobId: taskSpec.job_id,
      variantJudgeOutput,
      approvedVariantRegistry: options.approvedVariantRegistry || {},
    })
    : null;

  if (qualityFailurePacket) {
    qualityFailurePacket.job_id = taskSpec.job_id;
    qualityFailurePacket.attempt = attemptIndex;
    qualityFailurePacket.source_artifacts = {
      output_png: laneResult && laneResult.metadata && laneResult.metadata.output_image_path || null,
      judge_output_json: laneResult && laneResult.metadata && laneResult.metadata.judge_output_file_path || null,
    };
  }

  return {
    monitorReport,
    liveJudgeOutput,
    proofBlocked,
    qualityFailurePacket,
    variantJudgeOutput,
    variantDeltaReport,
  };
}

module.exports = {
  run,
};
