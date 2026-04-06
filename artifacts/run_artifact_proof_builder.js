"use strict";

const fs = require("fs");
const path = require("path");
const { getRunMetrics } = require("../observability/metrics_collector");
const { listAttemptMetrics } = require("../observability/run_metrics_registry");
const { buildProofSummaryMarkdown } = require("./run_artifact_summary_writer");
const { appendProofPackRecord } = require("./proof_pack_registry");

function safeClone(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function getRunsDir() {
  return process.env.RUNS_DIR || path.join(__dirname, "..", "runs");
}

function ensureRunDir(run_id) {
  const runDir = path.join(getRunsDir(), String(run_id || "unknown"));
  if (!fs.existsSync(runDir)) fs.mkdirSync(runDir, { recursive: true });
  return runDir;
}

function fileArtifact(type, filePath) {
  if (!filePath) return null;
  return {
    type,
    path: filePath,
    exists: fs.existsSync(filePath),
  };
}

function extractExecutionArtifacts(execution = {}) {
  const executionArtifact = execution.artifacts && execution.artifacts.execution;
  const normalizedArtifacts = executionArtifact && Array.isArray(executionArtifact.artifacts)
    ? executionArtifact.artifacts
    : [];
  return normalizedArtifacts.map((artifact) => ({
    type: artifact.type || "artifact",
    path: artifact.path || null,
    exists: artifact.path ? fs.existsSync(artifact.path) : false,
  })).filter((artifact) => artifact.path);
}

function buildRunArtifactProof(runState, execution = {}, options = {}) {
  try {
    const run_id = runState && runState.run_id || options.run_id || null;
    if (!run_id) return { ok: false, proof_pack: null, reason: "missing_run_id" };
    const runDir = ensureRunDir(run_id);
    const metrics = getRunMetrics(run_id) || {};
    const attemptMetrics = listAttemptMetrics().filter((entry) => entry && entry.run_id === run_id);
    const selfRepairUsed = attemptMetrics.some((entry) => entry.patch_applied === true) ||
      !!(runState && Array.isArray(runState.patch_history) && runState.patch_history.length > 0) ||
      !!(execution.artifacts && execution.artifacts.loop_trace && execution.artifacts.loop_trace.patch_plan_summary);
    const decisionArtifact = fileArtifact("decision", path.join(runDir, "final_decision.json"));
    const summaryArtifact = fileArtifact("summary", path.join(runDir, "summary.txt"));
    const proofJsonPath = path.join(runDir, "proof_pack.json");
    const proofMdPath = path.join(runDir, "proof_summary.md");

    const artifactList = [
      ...extractExecutionArtifacts(execution),
      decisionArtifact,
      summaryArtifact,
      fileArtifact("response", path.join(runDir, "response.json")),
      fileArtifact("request", path.join(runDir, "request.json")),
    ].filter(Boolean);

    const hasRealImage = artifactList.some((artifact) => artifact.type === "image" && artifact.exists);
    const executionArtifact = execution.artifacts && execution.artifacts.execution;
    const proofPack = {
      run_id,
      lane: metrics.lane || options.lane || "unknown",
      attempts: metrics.attempts ?? (attemptMetrics.length || 0),
      retry_count: metrics.retry_count ?? 0,
      final_status: metrics.final_status || execution.final_status || (execution.operator_verdict === "DONE" ? "ALLOW" : "REJECT"),
      final_reason: metrics.final_reason || execution.reason || execution.error || null,
      self_repair_used: selfRepairUsed,
      canon_packet_applied: metrics.canon_packet_applied === true || !!options.canon_packet_applied,
      cost_used: Number(metrics.cost_used || 0),
      artifacts: artifactList,
      key_signals: {
        transport_ok: executionArtifact ? executionArtifact.transport_ok === true : true,
        execution_ok: executionArtifact ? executionArtifact.execution_ok === true : (execution.operator_verdict === "DONE"),
        has_real_image: hasRealImage,
      },
      timestamps: {
        started_at: metrics.started_at || (runState && runState.created_at) || null,
        finished_at: metrics.finished_at || (runState && runState.updated_at) || null,
      },
    };

    return {
      ok: true,
      proof_pack: proofPack,
      proof_pack_path: proofJsonPath,
      proof_summary_path: proofMdPath,
    };
  } catch (error) {
    return {
      ok: false,
      proof_pack: null,
      reason: error.message,
    };
  }
}

function writeRunArtifactProof(runState, execution = {}, options = {}) {
  try {
    const built = buildRunArtifactProof(runState, execution, options);
    if (!built.ok || !built.proof_pack) return built;

    fs.writeFileSync(built.proof_pack_path, JSON.stringify(built.proof_pack, null, 2), "utf8");
    fs.writeFileSync(built.proof_summary_path, buildProofSummaryMarkdown(built.proof_pack), "utf8");
    appendProofPackRecord({
      run_id: built.proof_pack.run_id,
      final_status: built.proof_pack.final_status,
      final_reason: built.proof_pack.final_reason,
      proof_pack_path: built.proof_pack_path,
      proof_summary_path: built.proof_summary_path,
      timestamp: new Date().toISOString(),
    });

    return {
      ...built,
      proof_pack: safeClone(built.proof_pack, null),
    };
  } catch (error) {
    return {
      ok: false,
      proof_pack: null,
      reason: error.message,
    };
  }
}

module.exports = {
  buildRunArtifactProof,
  writeRunArtifactProof,
};
