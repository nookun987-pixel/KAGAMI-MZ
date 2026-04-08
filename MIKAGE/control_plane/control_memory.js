"use strict";

const path = require("path");

const { ensureDir, readJson, writeJson, nowIso } = require("../shared/utils/fs_utils");

class ControlMemory {
  constructor(options = {}) {
    const memoryRoot = options.memoryRoot || path.resolve(__dirname, "..", "shared", "memory");

    this.paths = {
      memoryRoot,
      runHistory: options.runHistoryPath || path.join(memoryRoot, "run_history.json"),
      laneRegistry: options.laneRegistryPath || path.join(memoryRoot, "lane_registry.json"),
      canonMemory: options.canonMemoryPath || path.join(memoryRoot, "canon_memory.json"),
      canonMemoryRegistry: options.canonMemoryRegistryPath || path.join(memoryRoot, "canon_memory_registry.json"),
      approvedVariantRegistry: options.approvedVariantRegistryPath || path.resolve(__dirname, "..", "..", "memory", "approved_variant_registry.json"),
    };

    ensureDir(memoryRoot);
    this.ensureStore();
  }

  ensureStore() {
    if (!readJson(this.paths.runHistory, null)) {
      writeJson(this.paths.runHistory, { runs: [] });
    }

    if (!readJson(this.paths.laneRegistry, null)) {
      writeJson(this.paths.laneRegistry, { lanes: {} });
    }

    if (!readJson(this.paths.canonMemory, null)) {
      writeJson(this.paths.canonMemory, { patterns: [] });
    }

    if (!readJson(this.paths.canonMemoryRegistry, null)) {
      writeJson(this.paths.canonMemoryRegistry, { dominant_reference: null, entries: [] });
    }

    if (!readJson(this.paths.approvedVariantRegistry, null)) {
      writeJson(this.paths.approvedVariantRegistry, {
        base_artifacts: [],
        approved_variants: [],
        rejected_drift_reasons: [],
      });
    }
  }

  getRunHistory() {
    return readJson(this.paths.runHistory, { runs: [] });
  }

  getLaneRegistry() {
    return readJson(this.paths.laneRegistry, { lanes: {} });
  }

  getCanonMemory() {
    const base = readJson(this.paths.canonMemory, { patterns: [] });
    const registry = readJson(this.paths.canonMemoryRegistry, { dominant_reference: null, entries: [] });
    return {
      ...base,
      dominant_reference: registry.dominant_reference || base.dominant_reference || null,
      signature_registry: registry.entries || [],
    };
  }

  getApprovedVariantRegistry() {
    return readJson(this.paths.approvedVariantRegistry, {
      base_artifacts: [],
      approved_variants: [],
      rejected_drift_reasons: [],
    });
  }

  getNextSequence(date = new Date()) {
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const history = this.getRunHistory();

    return history.runs
      .filter((run) => String(run.job_id || "").includes(`AUTO_${stamp}_`))
      .length + 1;
  }

  getPatternHints(intent) {
    const canonMemory = this.getCanonMemory();
    return (canonMemory.patterns || [])
      .filter((pattern) => pattern.lane === intent.intent_type)
      .filter((pattern) => !intent.goal || String(intent.goal).toLowerCase().includes(String(pattern.match || "").toLowerCase()))
      .slice(0, 5);
  }

  recordIntent(intent) {
    return {
      captured_at: nowIso(),
      intent,
    };
  }

  recordTaskPlan(taskSpec) {
    return {
      planned_at: nowIso(),
      taskSpec,
    };
  }

  recordRun(payload) {
    const history = this.getRunHistory();
    const entry = {
      recorded_at: nowIso(),
      ...payload,
    };

    history.runs.push(entry);
    writeJson(this.paths.runHistory, history);

    if (payload && payload.decision && payload.decision.decision === "ALLOW") {
      const canonMemory = this.getCanonMemory();
      canonMemory.patterns.push({
        lane: payload.intent.intent_type,
        match: payload.intent.goal,
        effective: true,
        decision: payload.decision.decision,
        recorded_at: nowIso(),
      });
      writeJson(this.paths.canonMemory, canonMemory);
    }

    return entry;
  }

  recordVariantDecision(payload) {
    const registry = this.getApprovedVariantRegistry();
    const variantJudgeOutput = payload && payload.variantJudgeOutput || {};
    const variantSpec = payload && payload.variantSpec || {};
    const dnaLockPacket = payload && payload.dnaLockPacket || {};
    const existingBase = registry.base_artifacts.find((entry) => entry.base_dna_id === dnaLockPacket.dna_id);

    if (!existingBase && dnaLockPacket.dna_id) {
      registry.base_artifacts.push({
        base_dna_id: dnaLockPacket.dna_id,
        source_job_id: dnaLockPacket.source_job_id || "",
        material_dna: dnaLockPacket.material_dna || [],
        edge_dna: dnaLockPacket.edge_dna || [],
        silhouette_grammar: dnaLockPacket.silhouette_grammar || [],
        color_law: dnaLockPacket.color_law || [],
        identity_anchors: dnaLockPacket.identity_anchors || [],
        hard_forbidden_traits: dnaLockPacket.hard_forbidden_traits || [],
      });
    }

    if (variantJudgeOutput.verdict === "PASS_CANON_VARIANT") {
      const existingVariant = registry.approved_variants.find((entry) => entry.variant_id === variantJudgeOutput.variant_id);
      if (!existingVariant) {
        registry.approved_variants.push({
          job_id: payload.job_id,
          base_dna_id: variantJudgeOutput.base_dna_id,
          variant_id: variantJudgeOutput.variant_id,
          variant_family: variantJudgeOutput.variant_family,
          output_hash: variantJudgeOutput.output_hash,
          allowed_differences: variantSpec.allowed_differences || [],
          branch_family: variantSpec.variant_family || "",
          base_artifact: dnaLockPacket.source_job_id || "",
          recorded_at: nowIso(),
        });
      }
    } else if (String(variantJudgeOutput.verdict || "").startsWith("REJECT_")) {
      registry.rejected_drift_reasons.push({
        job_id: payload.job_id,
        base_dna_id: variantJudgeOutput.base_dna_id || "",
        variant_id: variantJudgeOutput.variant_id || "",
        variant_family: variantJudgeOutput.variant_family || "",
        verdict: variantJudgeOutput.verdict,
        reasons: []
          .concat(variantJudgeOutput.drift_violation && variantJudgeOutput.drift_violation.codes || [])
          .concat(variantJudgeOutput.identity_loss && variantJudgeOutput.identity_loss.codes || [])
          .concat(variantJudgeOutput.material_integrity && variantJudgeOutput.material_integrity.codes || [])
          .concat(variantJudgeOutput.silhouette_integrity && variantJudgeOutput.silhouette_integrity.codes || []),
        recorded_at: nowIso(),
      });
    }

    writeJson(this.paths.approvedVariantRegistry, registry);
    return registry;
  }
}

module.exports = {
  ControlMemory,
};
