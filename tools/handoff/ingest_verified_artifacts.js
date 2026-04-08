"use strict";

const path = require("path");

const {
  rootPath,
  listAttemptDirs,
  normalizeAttemptArtifacts,
  loadAttemptContext,
  isVerifiedPassAttempt,
  createCandidateEntries,
  writeJsonFile,
} = require("./memory_common");

function ingestVerifiedArtifacts(options = {}) {
  const traceRoot = path.resolve(options.traceRoot || rootPath("traces"));
  const queuePath = path.resolve(options.queuePath || rootPath("state", "memory_ingest_queue.json"));
  const attemptDirs = listAttemptDirs({ traceRoot });
  const candidates = [];
  const skipped = [];

  for (const attemptDir of attemptDirs) {
    normalizeAttemptArtifacts(attemptDir, {
      generatedBy: "tools/handoff/ingest_verified_artifacts.js",
    });

    const context = loadAttemptContext(attemptDir);
    if (!isVerifiedPassAttempt(context)) {
      skipped.push({
        source_run: context.jobId,
        attempt: context.attemptIndex,
        reason: inferSkipReason(context),
      });
      continue;
    }

    for (const entry of createCandidateEntries(context)) {
      candidates.push(entry);
    }
  }

  const payload = {
    generated_at: new Date().toISOString(),
    generated_by: "tools/handoff/ingest_verified_artifacts.js",
    trace_root: traceRoot,
    candidates,
    skipped,
  };

  writeJsonFile(queuePath, payload);
  return payload;
}

function inferSkipReason(context) {
  if (!context.outputExists) {
    return "missing_output_png";
  }
  if (!context.finalDecisionExists) {
    return "missing_final_decision_json";
  }
  if (!context.geminiValidationExists) {
    return "missing_gemini_validation_json";
  }
  if (!context.geminiValidation || context.geminiValidation.validator_executed !== true) {
    return "validator_not_executed";
  }
  const decision = context.finalDecision && context.finalDecision.decision && context.finalDecision.decision.decision || "";
  if (decision !== "ALLOW") {
    return `decision_not_allow:${decision || "UNKNOWN"}`;
  }
  if (String(context.geminiValidation && context.geminiValidation.source || "").toLowerCase() !== "live") {
    return "gemini_validation_not_live";
  }
  if (context.variantJudgeOutput && String(context.variantJudgeOutput.verdict || "").startsWith("REJECT_")) {
    return `canon_hard_fail:${context.variantJudgeOutput.verdict}`;
  }
  return "unverified";
}

module.exports = {
  ingestVerifiedArtifacts,
};

if (require.main === module) {
  const result = ingestVerifiedArtifacts();
  console.log(JSON.stringify({
    candidates: result.candidates.length,
    skipped: result.skipped.length,
    queue_path: rootPath("state", "memory_ingest_queue.json"),
  }, null, 2));
}
