"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

function createTempWorkspace(prefix = "mikage-memory-") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const traceRoot = path.join(root, "traces");
  const outputsRoot = path.join(root, "outputs");
  const stateRoot = path.join(root, "state");
  fs.mkdirSync(traceRoot, { recursive: true });
  fs.mkdirSync(outputsRoot, { recursive: true });
  fs.mkdirSync(stateRoot, { recursive: true });
  return { root, traceRoot, outputsRoot, stateRoot };
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
}

function createAttemptFixture(workspace, config = {}) {
  const jobId = config.jobId || "JOB_001";
  const attemptIndex = config.attemptIndex || 1;
  const attemptDir = path.join(workspace.traceRoot, jobId, `attempt-${String(attemptIndex).padStart(2, "0")}`);
  const outputDir = path.join(workspace.outputsRoot, jobId);
  const outputPath = path.join(outputDir, "output.png");
  const judgeOutputPath = path.join(outputDir, "judge_output.json");

  fs.mkdirSync(attemptDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  if (config.withImage !== false) {
    writeText(outputPath, "png-bytes");
  }

  const rawTrace = {
    job_id: jobId,
    attempt_index: attemptIndex,
    taskSpec: {
      job_id: jobId,
      lane: config.lane || "image",
      constraints: config.constraints || ["SHOT_PROFILE:MASK_MACRO"],
    },
    laneResult: {
      artifacts: config.withImage === false ? [] : [
        { type: "image", path: outputPath },
        { type: "judge_output_json", path: judgeOutputPath },
      ],
      validator_result: {
        passed: config.validatorPassed !== false,
        signals: [],
        judge_output: config.judgeOutput || {
          source: "live",
          status: "PASS",
          quality_score: 0.91,
          overall_score: 0.9,
          failure_codes: [],
          notes: ["fixture pass"],
        },
        proof_blocked: false,
      },
      metadata: {
        output_image_path: outputPath,
        judge_output_file_path: judgeOutputPath,
      },
    },
    monitorReport: {
      state: (config.finalDecision || "ALLOW") === "ALLOW" ? "completed" : "failed",
    },
  };

  const finalDecision = {
    job_id: jobId,
    attempt_index: attemptIndex,
    decision: {
      decision: config.finalDecision || "ALLOW",
      reasons: config.finalDecision === "REJECT" ? ["fixture reject"] : ["fixture allow"],
      timestamp: "2026-04-08T00:00:00.000Z",
    },
    monitorReport: {
      lane: config.lane || "image",
    },
  };

  const geminiValidation = {
    job_id: jobId,
    attempt_index: attemptIndex,
    source: config.geminiSource || "live",
    status: config.geminiStatus || "PASS",
    quality_score: 0.91,
    overall_score: 0.9,
    failure_codes: [],
    notes: ["fixture validation"],
    judge_output_path: judgeOutputPath,
    validator_executed: config.validatorExecuted !== false,
    validator_passed: config.validatorPassed !== false,
    proof_blocked: false,
  };

  const variantJudgeOutput = config.variantJudgeOutput || {
    job_id: jobId,
    variant_id: `${config.baseDnaId || "DNA_BASE"}_${config.variantFamily || "HERO_LOCK"}_${config.variantSlot || "A"}`,
    variant_family: config.variantFamily || "HERO_LOCK",
    base_dna_id: config.baseDnaId || "DNA_BASE",
    allowed_differences: ["wear_level:medium"],
    output_hash: config.outputHash || `${jobId}_HASH`,
    verdict: config.variantVerdict || "PASS_CANON_VARIANT",
    dna_retention: { passed: true, blocked_by: [] },
    variant_distinctness: { passed: true, sibling_collision_variant_id: "" },
    drift_violation: { passed: true, codes: [] },
    identity_loss: { passed: true, codes: [] },
    material_integrity: { passed: true, codes: [] },
    silhouette_integrity: { passed: true, codes: [] },
    score: 0.91,
  };

  const dnaLockPacket = {
    dna_id: config.baseDnaId || "DNA_BASE",
    source_job_id: config.baseSourceJobId || "AUTO_BASE",
    material_dna: ["dark matte technical ceramic shell"],
    edge_dna: ["micro erosion on exposed edges"],
    silhouette_grammar: ["front dominant silhouette"],
    color_law: ["restricted charcoal ceramic palette"],
    identity_anchors: ["single mounted mask artifact"],
    hard_forbidden_traits: ["generic product render"],
  };

  const variantSpec = {
    variant_id: variantJudgeOutput.variant_id,
    variant_family: config.variantFamily || "HERO_LOCK",
    base_dna_id: config.baseDnaId || "DNA_BASE",
    allowed_differences: ["wear_level:medium"],
  };

  writeJson(path.join(attemptDir, "raw_execution_trace.json"), rawTrace);
  if (config.writeFinalDecision !== false) {
    writeJson(path.join(attemptDir, "final_decision.json"), finalDecision);
  } else {
    writeJson(path.join(attemptDir, "final_decision_snapshot.json"), finalDecision);
  }
  if (config.writeGeminiValidation !== false) {
    writeJson(path.join(attemptDir, "gemini_validation.json"), geminiValidation);
  }
  writeJson(path.join(attemptDir, "variant_judge_output.json"), variantJudgeOutput);
  writeJson(path.join(attemptDir, "dna_lock_packet.json"), dnaLockPacket);
  writeJson(path.join(attemptDir, "variant_spec.json"), variantSpec);
  writeJson(path.join(attemptDir, "variation_envelope.json"), {
    strict: true,
    bounded_axes: {
      wear_level: { selected: "medium" },
    },
  });

  if (config.writeJudgeOutput !== false) {
    writeJson(judgeOutputPath, rawTrace.laneResult.validator_result.judge_output);
  }

  return {
    attemptDir,
    outputPath,
    judgeOutputPath,
  };
}

module.exports = {
  createTempWorkspace,
  createAttemptFixture,
  writeJson,
};
