"use strict";

const { fileExists } = require("../utils/fs_utils");

function normalizeArtifacts(laneResult) {
  return Array.isArray(laneResult && laneResult.artifacts) ? laneResult.artifacts : [];
}

function findArtifact(artifacts, type) {
  return artifacts.find((artifact) => artifact && artifact.type === type);
}

function normalizeSignals(laneResult) {
  return []
    .concat((laneResult && laneResult.validator_result && laneResult.validator_result.signals) || [])
    .concat((laneResult && laneResult.validator_result && laneResult.validator_result.issues) || [])
    .filter(Boolean)
    .map((value) => String(value));
}

function dedupe(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function defaultPolicy() {
  return {
    lane: "default",
    required_artifact_types: [],
    terminal_statuses: ["completed", "failed", "rejected", "timeout"],
    success_statuses: ["completed"],
    describeSuccess() {
      return "Lane satisfied its completion policy.";
    },
    evaluate(taskSpec, laneResult) {
      const artifacts = normalizeArtifacts(laneResult);
      const validatorSignals = normalizeSignals(laneResult);
      const issues = [];
      const fatal_issues = [];

      if (!laneResult || typeof laneResult !== "object") {
        issues.push("malformed result");
        fatal_issues.push("malformed result");
      }

      const missing_artifacts = this.required_artifact_types
        .filter((type) => !findArtifact(artifacts, type));

      for (const type of missing_artifacts) {
        issues.push(`missing artifact:${type}`);
        if (this.terminal_statuses.includes(String(laneResult && laneResult.status || ""))) {
          fatal_issues.push(`missing artifact:${type}`);
        }
      }

      if (validatorSignals.length > 0 || (laneResult && laneResult.validator_result && laneResult.validator_result.passed === false)) {
        issues.push("validator fail");
        fatal_issues.push("validator fail");
      }

      return {
        lane: taskSpec && taskSpec.lane || "unknown",
        required_artifact_types: this.required_artifact_types,
        missing_artifacts,
        artifacts_present: artifacts.map((artifact) => artifact.type),
        validator_signals: dedupe(validatorSignals),
        issues: dedupe(issues),
        fatal_issues: dedupe(fatal_issues),
        success: this.success_statuses.includes(String(laneResult && laneResult.status || ""))
          && missing_artifacts.length === 0
          && validatorSignals.length === 0
          && laneResult
          && laneResult.validator_result
          && laneResult.validator_result.passed === true,
      };
    },
  };
}

function imagePolicy() {
  const base = defaultPolicy();

  return {
    ...base,
    lane: "image",
    required_artifact_types: ["result_json", "image"],
    describeSuccess() {
      return "Image lane produced a valid result artifact set.";
    },
    evaluate(taskSpec, laneResult) {
      const assessment = base.evaluate.call(this, taskSpec, laneResult);
      const artifacts = normalizeArtifacts(laneResult);
      const resultArtifact = findArtifact(artifacts, "result_json");
      const imageArtifact = findArtifact(artifacts, "image");
      const metadata = laneResult && laneResult.metadata || {};
      const issues = [...assessment.issues];
      const fatal_issues = [...assessment.fatal_issues];

      if (resultArtifact && !fileExists(resultArtifact.path)) {
        issues.push("malformed result.json");
        fatal_issues.push("malformed result.json");
      }

      if (metadata.malformed_result) {
        issues.push("malformed result.json");
        fatal_issues.push("malformed result.json");
      }

      if (imageArtifact && !fileExists(imageArtifact.path)) {
        issues.push("missing output.png");
        fatal_issues.push("missing output.png");
      }

      if (metadata.stale_claim) {
        issues.push("stale claim");
        fatal_issues.push("stale claim");
      }

      if (laneResult && laneResult.status === "timeout") {
        issues.push("timeout");
        fatal_issues.push("timeout");
      }

      if (laneResult && ["failed", "rejected"].includes(String(laneResult.status || ""))) {
        issues.push(`lane ${laneResult.status}`);
        fatal_issues.push(`lane ${laneResult.status}`);
      }

      if (assessment.missing_artifacts.includes("result_json")) {
        issues.push("missing result.json");
        fatal_issues.push("missing result.json");
      }

      if (assessment.missing_artifacts.includes("image")) {
        issues.push("missing output.png");
        fatal_issues.push("missing output.png");
      }

      return {
        ...assessment,
        issues: dedupe(issues),
        fatal_issues: dedupe(fatal_issues),
        success: assessment.success
          && !metadata.malformed_result
          && !metadata.stale_claim
          && fileExists(resultArtifact && resultArtifact.path)
          && fileExists(imageArtifact && imageArtifact.path),
      };
    },
  };
}

const POLICY_REGISTRY = {
  image: imagePolicy(),
  cine: defaultPolicy(),
  game: defaultPolicy(),
  content: defaultPolicy(),
  ops: defaultPolicy(),
};

function getLaneResultPolicy(lane) {
  return POLICY_REGISTRY[lane] || defaultPolicy();
}

function evaluateLaneResult(taskSpec, laneResult) {
  const policy = getLaneResultPolicy(taskSpec && taskSpec.lane);
  return {
    policy,
    assessment: policy.evaluate(taskSpec, laneResult),
  };
}

module.exports = {
  POLICY_REGISTRY,
  getLaneResultPolicy,
  evaluateLaneResult,
};
