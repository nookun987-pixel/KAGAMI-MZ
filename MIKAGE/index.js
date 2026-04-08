"use strict";

const path = require("path");

const { createRetryTaskSpec } = require("../execution/repair_engine");
const { writeRawTrace } = require("../execution/raw_trace_store");
const { writeQualityDeltaReport } = require("../execution/quality_delta_reporter");
const intakeModule = require("./modules/intake");
const generationModule = require("./modules/generation");
const validationModule = require("./modules/validation");
const decisionModule = require("./modules/decision");
const memoryModule = require("./modules/memory");
const visualContract = require("../canon/MIKAGE_VISUAL_CONTRACT_V1.json");

async function runSingleAttempt(taskSpec, intent, attemptIndex, options = {}) {
  const { runRecord, laneResult } = await generationModule.run(taskSpec, options);
  const validation = validationModule.run({
    taskSpec,
    laneResult,
    runRecord,
    attemptIndex,
    options,
  });
  const decisionState = decisionModule.run({
    taskSpec,
    intent,
    laneResult,
    monitorReport: validation.monitorReport,
    qualityFailurePacket: validation.qualityFailurePacket,
    variantJudgeOutput: validation.variantJudgeOutput,
    proofBlocked: validation.proofBlocked,
    attemptIndex,
    options,
  });

  const tracePayload = {
    job_id: taskSpec.job_id,
    attempt_index: attemptIndex,
    options: {
      timeoutMs: options.timeoutMs,
      pollIntervalMs: options.pollIntervalMs,
      staleClaimMs: options.staleClaimMs,
    },
    intent,
    taskSpec,
    runRecord,
    laneResult,
    monitorReport: validation.monitorReport,
    decision: decisionState.effectiveDecision,
    qualityFailurePacket: decisionState.effectiveQualityFailurePacket,
    failureRoute: decisionState.effectiveFailureRoute,
    repairPatchPacket: decisionState.effectiveRepairPatchPacket,
    qualityRetryDecision: decisionState.qualityRetryDecision,
    qualityScoreDelta: decisionState.qualityScoreDelta,
    dnaLockPacket: taskSpec && taskSpec.context && taskSpec.context.dna_lock_packet || null,
    variationEnvelope: taskSpec && taskSpec.context && taskSpec.context.variation_envelope || null,
    variantSpec: taskSpec && taskSpec.context && taskSpec.context.variant_spec || null,
    variantJudgeOutput: validation.variantJudgeOutput,
    variantDeltaReport: validation.variantDeltaReport,
    proof_blocked: validation.proofBlocked,
  };

  const tracePaths = writeRawTrace(tracePayload, {
    traceRoot: options.traceRoot,
    attemptIndex,
  });

  const repairAction = decisionModule.finalizeRepair(tracePaths, {
    attemptIndex,
    options,
    qualityRetryDecision: decisionState.qualityRetryDecision,
    effectiveFailureRoute: decisionState.effectiveFailureRoute,
    effectiveQualityFailurePacket: decisionState.effectiveQualityFailurePacket,
    effectiveRepairPatchPacket: decisionState.effectiveRepairPatchPacket,
  });

  const traceWithRepair = {
    ...tracePayload,
    repairAction,
  };

  const finalTracePaths = writeRawTrace(traceWithRepair, {
    traceRoot: options.traceRoot,
    attemptIndex,
  });

  return {
    attemptIndex,
    intent,
    taskSpec,
    runRecord,
    laneResult,
    monitorReport: validation.monitorReport,
    decision: decisionState.effectiveDecision,
    qualityFailurePacket: decisionState.effectiveQualityFailurePacket,
    failureRoute: decisionState.effectiveFailureRoute,
    repairPatchPacket: decisionState.effectiveRepairPatchPacket,
    qualityRetryDecision: decisionState.qualityRetryDecision,
    qualityScoreDelta: decisionState.qualityScoreDelta,
    variantJudgeOutput: validation.variantJudgeOutput,
    variantDeltaReport: validation.variantDeltaReport,
    repairAction,
    tracePaths: finalTracePaths,
  };
}

async function runMikage(input, options = {}) {
  const runtime = memoryModule.createRuntime(options);
  const memory = runtime.memory;
  const prepared = intakeModule.run(input, {
    memory,
    laneRegistry: runtime.laneRegistry,
    canonMemory: runtime.canonMemory,
    approvedVariantRegistry: runtime.approvedVariantRegistry,
    maxAttempts: runtime.maxAttempts,
    variantRequest: options.variantRequest,
    sequence: options.sequence,
    date: options.date,
  });
  const intent = prepared.intent;
  const canonMemory = prepared.canonMemory;
  const maxAttempts = prepared.maxAttempts;
  const initialTaskSpec = prepared.taskSpec;

  const attempts = [];
  let currentTaskSpec = initialTaskSpec;
  const lineageRoot = {
    original_job_id: initialTaskSpec.job_id,
  };
  let attemptIndex = 1;

  while (attemptIndex <= maxAttempts) {
    const attemptResult = await runSingleAttempt(currentTaskSpec, intent, attemptIndex, {
      ...options,
      maxAttempts,
      canonMemory,
      approvedVariantRegistry: memory.getApprovedVariantRegistry(),
      previousAttempts: attempts,
    });

    attempts.push(attemptResult);

    if (attemptResult.decision.decision === "ALLOW" || !attemptResult.repairAction.repairable || attemptIndex >= maxAttempts) {
      const finalResult = {
        ...attemptResult,
        attempts: attempts.map((attempt) => ({
          job_id: attempt.taskSpec.job_id,
          attempt_index: attempt.attemptIndex,
          decision: attempt.decision.decision,
          qualityFailurePacket: attempt.qualityFailurePacket,
          failureRoute: attempt.failureRoute,
          repairAction: attempt.repairAction,
          tracePaths: attempt.tracePaths,
          qualityScoreDelta: attempt.qualityScoreDelta,
          lineage: attempt.repairAction && attempt.repairAction.lineage || null,
        })),
      };
      if (attempts.length >= 2) {
        finalResult.qualityDeltaReport = writeQualityDeltaReport(lineageRoot.original_job_id, attempts, {
          traceRoot: options.traceRoot,
        });
      }
      finalResult.visualContractVersion = visualContract.contract_version || "MIKAGE_VISUAL_CONTRACT_V1";
      finalResult.dnaLockPacket = attemptResult.taskSpec.context && attemptResult.taskSpec.context.dna_lock_packet || null;
      finalResult.variationEnvelope = attemptResult.taskSpec.context && attemptResult.taskSpec.context.variation_envelope || null;
      finalResult.variantSpec = attemptResult.taskSpec.context && attemptResult.taskSpec.context.variant_spec || null;
      finalResult.variantJudgeOutput = attemptResult.variantJudgeOutput || null;
      finalResult.variantDeltaReport = attemptResult.variantDeltaReport || null;

      memory.recordRun({
        job_id: attemptResult.taskSpec.job_id,
        intent,
        taskSpec: attemptResult.taskSpec,
        runRecord: attemptResult.runRecord,
        laneResult: attemptResult.laneResult,
        monitorReport: attemptResult.monitorReport,
        decision: attemptResult.decision,
        qualityFailurePacket: attemptResult.qualityFailurePacket,
        failureRoute: attemptResult.failureRoute,
        repairAction: attemptResult.repairAction,
        attempts: attempts.map((attempt) => ({
          job_id: attempt.taskSpec.job_id,
          decision: attempt.decision,
          qualityFailurePacket: attempt.qualityFailurePacket,
          failureRoute: attempt.failureRoute,
          repairAction: attempt.repairAction,
          tracePaths: attempt.tracePaths,
          qualityScoreDelta: attempt.qualityScoreDelta,
          variantJudgeOutput: attempt.variantJudgeOutput,
          variantDeltaReport: attempt.variantDeltaReport,
          lineage: attempt.repairAction && attempt.repairAction.lineage || null,
        })),
      });
      memoryModule.persistFinalRun(memory, {
        job_id: attemptResult.taskSpec.job_id,
        variantJudgeOutput: attemptResult.variantJudgeOutput,
        dnaLockPacket: attemptResult.taskSpec.context && attemptResult.taskSpec.context.dna_lock_packet || null,
        variantSpec: attemptResult.taskSpec.context && attemptResult.taskSpec.context.variant_spec || null,
      });

      return finalResult;
    }

    attemptIndex += 1;
    const retryAction = {
      ...attemptResult.repairAction,
      lineage: {
        ...(attemptResult.repairAction.lineage || {}),
        original_job_id: lineageRoot.original_job_id,
        parent_job_id: attemptResult.taskSpec.job_id,
        next_attempt: attemptIndex,
      },
    };
    currentTaskSpec = createRetryTaskSpec(initialTaskSpec, attemptIndex, retryAction);
    options = {
      ...options,
      ...attemptResult.repairAction.next_options,
    };
  }

  throw new Error("MIKAGE outer loop exited without final result.");
}

if (require.main === module) {
  const goal = process.argv.slice(2).join(" ").trim();
  const input = goal || "create ceramic mask hero frame";

  runMikage(input, {
    artifactsRoot: path.resolve(__dirname, "shared", "memory", "artifacts", "cli"),
  })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error("[MIKAGE] control plane run failed:", error.message);
      process.exit(1);
    });
}

module.exports = {
  runMikage,
  runSingleAttempt,
};
