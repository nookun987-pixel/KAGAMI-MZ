"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function readStabilityAnomalyRegistry() {
  return readJsonSafe(config.STABILITY_ANOMALY_REGISTRY_PATH, {
    generated_at: null,
    latest_by_fingerprint: {},
    anomalies: [],
  });
}

function writeStabilityAnomalyRegistry(store) {
  store.generated_at = new Date().toISOString();
  writeJson(config.STABILITY_ANOMALY_REGISTRY_PATH, store);
}

function buildAnomalyFingerprint(input = {}) {
  return crypto.createHash("sha256").update(JSON.stringify({
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    anomaly_type: input.anomaly_type || null,
    summary: input.summary || null,
    refs: input.refs || [],
  })).digest("hex");
}

function recordStabilityAnomaly(input = {}) {
  const store = readStabilityAnomalyRegistry();
  const fingerprint = buildAnomalyFingerprint(input);
  const existing = store.latest_by_fingerprint && store.latest_by_fingerprint[fingerprint];
  const now = new Date().toISOString();
  if (existing) {
    existing.last_seen_at = now;
    existing.count = Number(existing.count || 1) + 1;
    existing.refs = Array.from(new Set([...(existing.refs || []), ...(input.refs || [])]));
    writeStabilityAnomalyRegistry(store);
    appendJsonl(config.STABILITY_ANOMALY_HISTORY_JSONL, { type: "update", anomaly: existing });
    return existing;
  }
  const anomaly = {
    anomaly_id: input.anomaly_id || `anomaly_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    anomaly_type: input.anomaly_type || "UNKNOWN",
    severity: input.severity || "medium",
    summary: input.summary || "",
    refs: input.refs || [],
    status: input.status || "open",
    first_seen_at: now,
    last_seen_at: now,
    count: 1,
    fingerprint,
  };
  store.anomalies = Array.isArray(store.anomalies) ? store.anomalies : [];
  store.anomalies.unshift(anomaly);
  store.anomalies = store.anomalies.slice(0, 300);
  store.latest_by_fingerprint = store.latest_by_fingerprint || {};
  store.latest_by_fingerprint[fingerprint] = anomaly;
  writeStabilityAnomalyRegistry(store);
  appendJsonl(config.STABILITY_ANOMALY_HISTORY_JSONL, { type: "create", anomaly });
  return anomaly;
}

function collectProofAnomalies(input = {}) {
  const proof = input.proof || {};
  const workflowSummary = input.workflow_summary || null;
  const statusView = input.status_view || {};
  const lifecycle = input.lifecycle || { events: [] };
  const anomalies = [];
  const refs = proof.refs || [];
  const requiredLinks = [
    proof.command_received && proof.command_received.report_path,
    proof.approval_item && proof.approval_item.preview_ref,
    proof.executor_job && proof.executor_job.artifact_path,
    proof.result_ingest && proof.result_ingest.artifact_path,
  ].filter(Boolean);
  if (requiredLinks.length < 3) {
    anomalies.push({
      workflow_id: proof.workflow_id,
      task_id: proof.task_id,
      anomaly_type: "MISSING_ARTIFACT_LINK",
      severity: "high",
      summary: "proof is missing linked command/approval/executor/result artifacts",
      refs,
    });
  }
  const duplicateStages = [];
  for (let index = 1; index < (lifecycle.events || []).length; index += 1) {
    const prev = lifecycle.events[index - 1];
    const current = lifecycle.events[index];
    if (prev.stage === current.stage && prev.status === current.status) {
      duplicateStages.push(current.stage);
    }
  }
  if (duplicateStages.length) {
    anomalies.push({
      workflow_id: proof.workflow_id,
      task_id: proof.task_id,
      anomaly_type: "DUPLICATE_STATE_TRANSITION",
      severity: "medium",
      summary: `duplicate lifecycle transitions detected: ${Array.from(new Set(duplicateStages)).join(", ")}`,
      refs,
    });
  }
  const latestTaskRun = statusView.latest_task_runs && proof.task_id ? statusView.latest_task_runs[proof.task_id] : null;
  const latestJob = statusView.latest_executor_jobs && proof.task_id
    ? statusView.latest_executor_jobs[proof.task_id]
    : (statusView.executor_jobs && statusView.executor_jobs.latest_by_task && proof.task_id
      ? statusView.executor_jobs.latest_by_task[proof.task_id]
      : null);
  if (!latestTaskRun || !latestJob) {
    anomalies.push({
      workflow_id: proof.workflow_id,
      task_id: proof.task_id,
      anomaly_type: "STALE_OPERATOR_STATE",
      severity: "medium",
      summary: "status view did not surface the latest task run or executor job",
      refs,
    });
  }
  const finalVerdict = proof.final_verdict || null;
  if (workflowSummary && finalVerdict && workflowSummary.current_stage) {
    const summaryStage = String(workflowSummary.current_stage).toLowerCase();
    const verdictStage = String(finalVerdict).toLowerCase();
    if ((verdictStage === "pass" && summaryStage !== "succeeded")
      || (verdictStage === "fail" && summaryStage !== "failed")
      || (verdictStage === "blocked" && summaryStage !== "blocked" && summaryStage !== "rejected")) {
      anomalies.push({
        workflow_id: proof.workflow_id,
        task_id: proof.task_id,
        anomaly_type: "TIMELINE_GOVERNANCE_MISMATCH",
        severity: "high",
        summary: `workflow summary stage ${workflowSummary.current_stage} does not match proof verdict ${proof.final_verdict}`,
        refs,
      });
    }
  }
  if (proof.approval_item && proof.approval_item.reason === "approval_required") {
    anomalies.push({
      workflow_id: proof.workflow_id,
      task_id: proof.task_id,
      anomaly_type: "OPERATOR_CONFUSION_POINT",
      severity: "low",
      summary: "approval wording is generic and may be unclear to operators",
      refs,
    });
  }
  return anomalies;
}

module.exports = {
  readStabilityAnomalyRegistry,
  recordStabilityAnomaly,
  collectProofAnomalies,
};
