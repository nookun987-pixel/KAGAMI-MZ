"use strict";

const { fileExists } = require("../../shared/utils/fs_utils");
const { runCritic } = require("../../../critic/critic_merge");

function normalizeSignals(signals) {
  if (Array.isArray(signals)) {
    return signals.filter(Boolean).map((value) => String(value));
  }

  if (Array.isArray(signals && signals.issues)) {
    return signals.issues.filter(Boolean).map((value) => String(value));
  }

  return [];
}

async function validateImageArtifacts(context = {}) {
  const signals = [];
  const payload = context.payload || null;
  const artifacts = Array.isArray(context.artifacts) ? context.artifacts : [];
  const resultPayload = context.resultPayload || null;
  const outputArtifact = artifacts.find((artifact) => artifact && artifact.type === "image");
  const outputPath = outputArtifact && outputArtifact.path || "";
  const judgeOutput = resultPayload && resultPayload.judge_output || null;
  const judgeOutputPath = resultPayload && resultPayload.judge_output_path || null;
  const criticMerge = outputPath && fileExists(outputPath)
    ? await runCritic(outputPath, {
      prompt: payload && payload.prompt || "",
      liveJudgeOutput: judgeOutput,
      judgeOutputPath,
    })
    : {
      source: "unavailable",
      status: "UNAVAILABLE",
      quality_score: null,
      overall_score: null,
      failure_codes: [],
      notes: ["OUTPUT_IMAGE_MISSING"],
      judge_output_path: judgeOutputPath,
    };

  if (!payload || !payload.prompt) {
    signals.push("image prompt missing");
  }

  if (artifacts.length === 0) {
    signals.push("no image lane artifacts produced");
  }

  for (const artifact of artifacts) {
    if (!artifact || !artifact.path || !fileExists(artifact.path)) {
      signals.push(`artifact missing on disk: ${artifact && artifact.label ? artifact.label : "unknown"}`);
    }
  }

  if (resultPayload) {
    if (!resultPayload.job_id) {
      signals.push("result.json missing job_id");
    }

    if (!resultPayload.status) {
      signals.push("result.json missing status");
    }
  }

  if (!outputPath || !fileExists(outputPath)) {
    signals.push("missing output.png");
  }

  if (criticMerge && criticMerge.source === "live" && ["REJECT", "REVIEW"].includes(String(criticMerge.status || ""))) {
    signals.push("live_judge_fail");
    for (const code of criticMerge.failure_codes || []) {
      signals.push(String(code));
    }
  }

  const uniqueSignals = normalizeSignals(signals).filter((value, index, values) => values.indexOf(value) === index);

  return {
    passed: uniqueSignals.length === 0,
    signals: uniqueSignals,
    issues: uniqueSignals,
    judge_output: judgeOutput,
    judge_output_path: judgeOutputPath,
    critic_merge: criticMerge,
    proof_blocked: !(criticMerge && criticMerge.source === "live"),
  };
}

module.exports = {
  validateImageArtifacts,
};
