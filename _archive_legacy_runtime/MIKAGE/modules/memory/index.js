"use strict";

const path = require("path");

const { ControlMemory } = require("../../control_plane/control_memory");

function createRuntime(options = {}) {
  const memory = options.memory || new ControlMemory(options.memoryOptions);
  return {
    memory,
    laneRegistry: memory.getLaneRegistry(),
    canonMemory: memory.getCanonMemory(),
    approvedVariantRegistry: memory.getApprovedVariantRegistry(),
    maxAttempts: Number.isInteger(options.maxAttempts) ? options.maxAttempts : 2,
  };
}

function persistFinalRun(memory, payload = {}) {
  if (payload.variantJudgeOutput) {
    memory.recordVariantDecision({
      job_id: payload.job_id,
      dnaLockPacket: payload.dnaLockPacket || null,
      variantSpec: payload.variantSpec || null,
      variantJudgeOutput: payload.variantJudgeOutput,
    });
  }
}

function getInterface() {
  return {
    status: "phase1_ready",
    ingest_ready: true,
    registry_paths: {
      ingest_queue: path.resolve(process.cwd(), "state", "memory_ingest_queue.json"),
      registry: path.resolve(process.cwd(), "state", "memory_registry.json"),
      index_manifest: path.resolve(process.cwd(), "state", "memory_index_manifest.json"),
      promotion_rules: path.resolve(process.cwd(), "state", "memory_promotion_rules.json"),
      decay_rules: path.resolve(process.cwd(), "state", "memory_decay_rules.json"),
    },
    notes: [
      "Phase 1 memory ingestion runs through tools/handoff post-run refresh tooling.",
      "Current module still avoids deep generation-time memory injection.",
    ],
  };
}

module.exports = {
  createRuntime,
  persistFinalRun,
  getInterface,
};
