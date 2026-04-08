"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const { runMikage } = require("../MIKAGE");
const { ControlMemory } = require("../MIKAGE/control_plane/control_memory");
const { readJson } = require("../MIKAGE/shared/utils/fs_utils");
const { judgeVariant, buildNormalizedJudgeInput } = require("../evaluation/variant_judge");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(label);
    console.error(`FAIL: ${label}`);
  }
}

function makeTempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "mikage-controlled-evo-"));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
}

function buildRegistry(root) {
  return {
    image: {
      async execute(taskSpec) {
        const variantSpec = taskSpec.context.variant_spec || {};
        const outDir = path.join(root, "outputs", taskSpec.job_id);
        fs.mkdirSync(outDir, { recursive: true });
        const imagePath = path.join(outDir, "output.png");
        const resultPath = path.join(outDir, "result.json");
        const signatureMap = {
          A: "variant-A-signature",
          B: "variant-B-signature",
          C: "variant-C-signature",
          D: "variant-D-drift",
        };
        const content = signatureMap[variantSpec.variant_slot] || "variant-A-signature";
        fs.writeFileSync(imagePath, content, "utf-8");
        writeJson(resultPath, { job_id: taskSpec.job_id, status: "completed" });

        const drift = variantSpec.variant_slot === "D";
        const judgeOutput = drift
          ? {
            source: "live",
            status: "REJECT",
            quality_score: 0.62,
            failure_codes: ["SIGNATURE_DRIFT"],
            notes: ["silhouette inconsistent"],
          }
          : {
            source: "live",
            status: "PASS",
            quality_score: 0.91,
            failure_codes: [],
            notes: [],
          };

        return {
          job_id: taskSpec.job_id,
          lane: "image",
          status: drift ? "rejected" : "completed",
          summary: drift ? "variant drift" : "variant pass",
          artifacts: [
            { type: "result_json", path: resultPath },
            { type: "image", path: imagePath },
          ],
          validator_result: {
            passed: !drift,
            signals: drift ? ["signature_drift"] : [],
            issues: drift ? ["signature_drift"] : [],
            quality_score: judgeOutput.quality_score,
          },
          error: drift ? "signature_drift" : null,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          metadata: {
            judge_output: judgeOutput,
          },
        };
      },
    },
  };
}

async function runVariant(memory, traceRoot, registry, variantSlot, sequence) {
  return runMikage({
    goal: "create ceramic mask hero frame",
    constraints: ["RENDER_MODE:HERO_LOCK", "SHOT_PROFILE:MASK_MACRO"],
  }, {
    memory,
    traceRoot,
    registry,
    maxAttempts: 1,
    timeoutMs: 50,
    date: new Date("2026-04-08T00:00:00Z"),
    variantRequest: {
      enabled: true,
      variantFamily: "HERO_LOCK",
      variantSlot,
    },
    sequence,
  });
}

(async () => {
  try {
    const tempRoot = makeTempRoot();
    const memoryRoot = path.join(tempRoot, "memory-root");
    const traceRoot = path.join(tempRoot, "traces");
    const memory = new ControlMemory({
      memoryRoot,
      approvedVariantRegistryPath: path.join(memoryRoot, "approved_variant_registry.json"),
    });

    writeJson(path.join(memoryRoot, "canon_memory_registry.json"), {
      dominant_reference: {
        job_id: "AUTO_20260408_015",
        silhouette_traits: ["front dominant silhouette", "fixed narrow eye cavity ratio", "layered jaw-vent geometry"],
        material_traits: ["dark matte technical ceramic shell", "subtle ceramic micro-pitting", "uneven reflectance"],
        framing_traits: ["single mounted mask artifact", "centered hero framing", "industrial frame backdrop"],
        blocked_traits: ["generic product render", "white glossy plastic shell"],
      },
      entries: [],
    });

    const registry = buildRegistry(tempRoot);

    const resultA1 = await runVariant(memory, traceRoot, registry, "A", 1);
    const resultB = await runVariant(memory, traceRoot, registry, "B", 2);
    const resultC = await runVariant(memory, traceRoot, registry, "C", 3);
    const resultA2 = await runVariant(memory, traceRoot, registry, "A", 4);
    const resultDrift = await runVariant(memory, traceRoot, registry, "D", 5);

    assert(resultA1.variantJudgeOutput.verdict === "PASS_CANON_VARIANT", "variant A passes canon variant judge");
    assert(resultB.variantJudgeOutput.verdict === "PASS_CANON_VARIANT", "variant B passes canon variant judge");
    assert(resultC.variantJudgeOutput.verdict === "PASS_CANON_VARIANT", "variant C passes canon variant judge");
    assert(resultA2.variantJudgeOutput.repeatability_confirmed === true, "repeatability exists per variant family");
    assert(resultDrift.variantJudgeOutput.verdict === "REJECT_DRIFT", "drifting variant is rejected");

    const registryState = memory.getApprovedVariantRegistry();
    assert(registryState.approved_variants.length >= 3, "at least 3 approved distinct variants stored");
    assert(registryState.rejected_drift_reasons.length >= 1, "rejected drift reasons stored");

    const attemptAPath = path.join(traceRoot, "AUTO_20260408_001", "attempt-01");
    assert(fs.existsSync(path.join(attemptAPath, "dna_lock_packet.json")), "dna_lock_packet.json written");
    assert(fs.existsSync(path.join(attemptAPath, "variation_envelope.json")), "variation_envelope.json written");
    assert(fs.existsSync(path.join(attemptAPath, "variant_spec.json")), "variant_spec.json written");
    assert(fs.existsSync(path.join(attemptAPath, "variant_judge_output.json")), "variant_judge_output.json written");
    assert(fs.existsSync(path.join(attemptAPath, "variant_delta_report.json")), "variant_delta_report.json written");

    const packetA = readJson(path.join(attemptAPath, "dna_lock_packet.json"), {});
    const specB = readJson(path.join(traceRoot, "AUTO_20260408_002", "attempt-01", "variant_spec.json"), {});
    const specC = readJson(path.join(traceRoot, "AUTO_20260408_003", "attempt-01", "variant_spec.json"), {});
    const judgeA2 = readJson(path.join(traceRoot, "AUTO_20260408_004", "attempt-01", "variant_judge_output.json"), {});

    assert(Array.isArray(packetA.material_dna) && packetA.material_dna.length > 0, "dna lock packet contains immutable material dna");
    assert(specB.variant_id !== specC.variant_id, "variants B and C are distinct");
    assert(judgeA2.repeatability_confirmed === true, "variant judge records repeatability");

    const deterministicRoot = path.join(tempRoot, "deterministic-judge");
    const deterministicTraceRoot = path.join(deterministicRoot, "traces");
    const deterministicCachePath = path.join(deterministicRoot, "judge_cache.json");
    const outputDir = path.join(deterministicRoot, "outputs");
    fs.mkdirSync(outputDir, { recursive: true });
    const imagePath = path.join(outputDir, "shared.png");
    fs.writeFileSync(imagePath, "same-image", "utf-8");
    const taskSpec = {
      lane: "image",
      constraints: ["SHOT_PROFILE:MASK_MACRO"],
      context: { requested_render_mode: "HERO_LOCK" },
    };
    const variantSpec = {
      variant_id: "DNA_AUTO_20260408_015_HERO_LOCK_B",
      variant_family: "HERO_LOCK",
      base_dna_id: "DNA_AUTO_20260408_015",
      allowed_differences: ["silhouette_variant:brow_guard_delta"],
    };
    const sharedHash = require("crypto").createHash("sha256").update(fs.readFileSync(imagePath)).digest("hex").toUpperCase();
    const historicalPayload = {
      job_id: "AUTO_20260408_HIST",
      variant_id: variantSpec.variant_id,
      variant_family: variantSpec.variant_family,
      base_dna_id: variantSpec.base_dna_id,
      output_hash: sharedHash,
      normalized_input_hash: "",
      observed_verdict: "PASS_CANON_VARIANT",
      verdict: "PASS_CANON_VARIANT",
      raw_failure_codes: [],
    };
    const normalizedInput = buildNormalizedJudgeInput({ taskSpec, variantSpec }, historicalPayload.output_hash);
    historicalPayload.normalized_input_hash = require("crypto").createHash("sha256").update(JSON.stringify(normalizedInput)).digest("hex").toUpperCase();
    const historicalAttempt = path.join(deterministicTraceRoot, "AUTO_20260408_HIST", "attempt-01");
    fs.mkdirSync(historicalAttempt, { recursive: true });
    fs.writeFileSync(path.join(historicalAttempt, "variant_judge_output.json"), JSON.stringify(historicalPayload, null, 2), "utf-8");

    const deterministicResult = judgeVariant({
      jobId: "AUTO_20260408_NOW",
      taskSpec,
      variantSpec,
      laneResult: {
        artifacts: [{ type: "image", path: imagePath }],
      },
      judgeOutput: {
        source: "live",
        status: "REJECT",
        quality_score: 0.7,
        failure_codes: ["CANON_DRIFT"],
      },
      qualityFailurePacket: {
        failure_codes: ["CANON_DRIFT"],
        primary_failure_codes: ["CANON_DRIFT"],
      },
      approvedVariantRegistry: { approved_variants: [], rejected_drift_reasons: [] },
      traceRoot: deterministicTraceRoot,
      judgeCachePath: deterministicCachePath,
    });

    assert(deterministicResult.output_hash === historicalPayload.output_hash, "deterministic judge test uses same image hash");
    assert(deterministicResult.verdict === "PASS_CANON_VARIANT", "same hash resolves to cached/historical consensus verdict");
    assert(deterministicResult.consistency_control.unstable_judge === true, "conflicting live judge outputs mark unstable judge");
    assert(fs.existsSync(deterministicCachePath), "judge cache file written");

    console.log(`RESULTS: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("TEST RUNNER ERROR:", error);
    process.exit(1);
  }
})();
