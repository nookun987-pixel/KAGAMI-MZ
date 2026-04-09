"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const config = require("./local_control_agent/config");
const { readJsonSafe, writeJson } = require("./local_control_agent/bridge_writer");

function buildOperationProof(input = {}) {
  const generatedAt = input.generated_at || new Date().toISOString();
  return {
    proof_id: input.proof_id || `proof_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
    scenario: input.scenario || "live_operator_flow",
    workflow_id: input.workflow_id || null,
    task_id: input.task_id || null,
    command_received: input.command_received || null,
    approval_item: input.approval_item || null,
    executor_job: input.executor_job || null,
    result_ingest: input.result_ingest || null,
    workflow_final_state: input.workflow_final_state || null,
    goal_progress_evidence: input.goal_progress_evidence || null,
    final_verdict: input.final_verdict || "UNKNOWN",
    refs: input.refs || [],
    generated_at: generatedAt,
  };
}

function proofPath(proof) {
  const base = proof.task_id || proof.workflow_id || proof.proof_id;
  return path.join(config.LIVE_OPERATION_PROOF_DIR, `${base}.live_operation_proof.json`);
}

function writeOperationProof(input = {}) {
  const proof = buildOperationProof(input);
  const filePath = proofPath(proof);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeJson(filePath, proof);
  return { proof, artifact_path: filePath };
}

function readOperationProofs(limit = 20) {
  if (!fs.existsSync(config.LIVE_OPERATION_PROOF_DIR)) {
    return { generated_at: null, items: [] };
  }
  const items = fs.readdirSync(config.LIVE_OPERATION_PROOF_DIR)
    .filter((name) => name.endsWith(".live_operation_proof.json"))
    .map((name) => {
      const filePath = path.join(config.LIVE_OPERATION_PROOF_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        path: filePath,
        mtime_ms: stat.mtimeMs,
        proof: readJsonSafe(filePath, null),
      };
    })
    .filter((entry) => entry.proof)
    .sort((a, b) => b.mtime_ms - a.mtime_ms)
    .slice(0, limit)
    .map((entry) => ({
      artifact_path: entry.path,
      proof: entry.proof,
    }));
  return {
    generated_at: new Date().toISOString(),
    items,
  };
}

module.exports = {
  buildOperationProof,
  writeOperationProof,
  readOperationProofs,
};
