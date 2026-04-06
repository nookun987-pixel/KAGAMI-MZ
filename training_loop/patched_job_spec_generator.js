/**
 * training_loop/patched_job_spec_generator.js
 * PHASE 3 — Generate patched_job_spec.json from training loop output.
 *
 * Reads:
 *   - training_loop_result.json (failure analysis + patch plan)
 *   - final_decision.json       (correction guidance, wrong reads, failed rules, candidate prompt)
 *   - original job spec          (from jobs/ directory)
 *   - training_cases.json        (historical patterns)
 *
 * Writes:
 *   - patched_job_spec.json to the source run directory
 *
 * NO execution. NO rerender. Output is JSON only.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const RUNS_DIR = path.join(ROOT_DIR, "runs");
const JOBS_DIR = path.join(ROOT_DIR, "jobs");
const MEMORY_DIR = path.join(ROOT_DIR, "memory");

const { classifyFailure } = require(path.join(__dirname, "fail_classifier"));
const { generatePatchPlan } = require(path.join(__dirname, "patch_engine"));

// ---------------------------------------------------------------------------
// ACTION → PROMPT PATCH MAP
// Each action from patch_engine maps to concrete prompt/negative_prompt injections.
// ---------------------------------------------------------------------------
const PROMPT_INJECTIONS = {
  inject_single_object_lock: {
    prompt_append: "one single main subject only, subject must occupy clear central frame presence",
    negative_append: null,
  },
  inject_no_fragment_rule: {
    prompt_append: null,
    negative_append: "fragmented composition, disconnected shapes, scattered elements",
  },
  inject_anti_plastic_negative: {
    prompt_append: null,
    negative_append: "plastic, PVC, glossy surface, toy-like finish, synthetic sheen, injection mold",
  },
  inject_ceramic_microstructure: {
    prompt_append: "visible ceramic microstructure, eggshell microtexture, dry dense engineered surface, fine grain technical ceramic",
    negative_append: null,
  },
  inject_object_readability_rule: {
    prompt_append: "object/entity must be fully readable, clear manufactured artifact, not abstract texture",
    negative_append: null,
  },
  inject_no_texture_only_rule: {
    prompt_append: null,
    negative_append: "abstract texture field, texture-only composition, wall slab floating texture",
  },
  inject_no_eye_visibility_rule: {
    prompt_append: null,
    negative_append: "visible human eyes, face mesh, organic face, real eyes, eye contact",
  },
  reject_disconnected_shapes: {
    prompt_append: null,
    negative_append: "disconnected shapes, multiple separate objects, split composition",
  },
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function dedupeTokens(text) {
  if (!text) return "";
  const tokens = text.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
  }
  return unique.join(", ");
}

// ---------------------------------------------------------------------------
// EXTRACT VALIDATION SIGNALS (mirrors orchestrator logic)
// ---------------------------------------------------------------------------
function extractValidationSignalsForTrainingLoop(postValidation) {
  if (!postValidation) return {};
  const signals = postValidation.analyzer_signals || {};
  const failedRules = (postValidation.rule_engine && postValidation.rule_engine.failed_rules) || [];
  const failedChecks = postValidation.failed_checks || [];
  const forbiddenHits = postValidation.forbidden_hits || [];
  const allFails = [...failedRules, ...failedChecks, ...forbiddenHits].map(s => String(s).toLowerCase());

  return {
    silhouette_clear: signals.mesh_deformation_delta === 0 && signals.boundary_intersection === 0
      ? true
      : (signals.mesh_deformation_delta > 0 || signals.boundary_intersection > 0 ? false : undefined),
    plastic_read: typeof signals.pvc_plastic_read === "number"
      ? signals.pvc_plastic_read >= 0.5
      : allFails.some(f => f.includes("plastic") || f.includes("pvc")),
    texture_only: allFails.some(f => f.includes("texture_only")),
    object_count: allFails.some(f => f.includes("multi_object") || f.includes("disconnected")) ? 2 : 1,
    eyes_visible: typeof signals.human_eyes_detected === "number"
      ? signals.human_eyes_detected >= 0.5
      : allFails.some(f => f.includes("eyes") || f.includes("human_eyes")),
  };
}

// ---------------------------------------------------------------------------
// ENRICH SIGNALS FROM FINAL DECISION
// When post_validation signals are incomplete, extract from final_decision rich data.
// ---------------------------------------------------------------------------
function enrichSignalsFromFinalDecision(signals, fd) {
  if (!fd) return;

  const colorTokens = (fd.color_fail_tokens || []).map(t => t.toLowerCase());
  const wrongReads = (fd.wrong_reads || []).map(t => t.toLowerCase());
  const failedRules = (fd.failed_rules || []).map(t => String(t).toLowerCase());
  const reason = (fd.decision_reason || "").toLowerCase();
  const all = [...colorTokens, ...wrongReads, ...failedRules, reason];

  // Plastic detection from color_fail_tokens and wrong_reads
  if (!signals.plastic_read) {
    signals.plastic_read = all.some(s =>
      s.includes("plastic") || s.includes("pvc") || s.includes("toy-like") || s.includes("injection mold")
    );
  }

  // Texture-only detection
  if (!signals.texture_only) {
    signals.texture_only = all.some(s =>
      s.includes("texture_only") || s.includes("texture field") || s.includes("abstract texture")
    );
  }

  // Multi-object detection
  if (signals.object_count <= 1) {
    if (all.some(s => s.includes("multi_object") || s.includes("multiple objects") || s.includes("disconnected"))) {
      signals.object_count = 2;
    }
  }

  // Silhouette detection
  if (signals.silhouette_clear === undefined || signals.silhouette_clear === true) {
    if (all.some(s => s.includes("silhouette") && (s.includes("fail") || s.includes("unclear") || s.includes("broken")))) {
      signals.silhouette_clear = false;
    }
  }

  // Eyes detection
  if (!signals.eyes_visible) {
    signals.eyes_visible = all.some(s =>
      s.includes("visible eyes") || s.includes("human eyes") || s.includes("eye contact")
    );
  }
}

// ---------------------------------------------------------------------------
// FIND BEST SOURCE RUN
// Priority 1: runs with BOTH training_loop_result.json AND final_decision.json (REJECT)
// Priority 2: runs with final_decision.json (REJECT) + post_validation.json (derive inline)
// ---------------------------------------------------------------------------
function findPatchableRun() {
  if (!fs.existsSync(RUNS_DIR)) return null;
  const candidates = [];
  const entries = fs.readdirSync(RUNS_DIR);

  for (const dir of entries) {
    const runDir = path.join(RUNS_DIR, dir);
    if (!fs.statSync(runDir).isDirectory()) continue;

    const fdPath = path.join(runDir, "final_decision.json");
    if (!fs.existsSync(fdPath)) continue;

    const fd = readJsonSafe(fdPath);
    if (!fd || fd.decision !== "REJECT") continue;
    if (!fd.validator_executed) continue;

    const hasTlr = fs.existsSync(path.join(runDir, "training_loop_result.json"));
    const hasPv = fs.existsSync(path.join(runDir, "post_validation.json"));
    const hasCandidates = fd.candidates && fd.candidates.length > 0;

    if (!hasTlr && !hasPv) continue;
    if (!hasCandidates) continue;

    candidates.push({
      dir,
      runDir,
      mtime: fs.statSync(runDir).mtimeMs,
      hasTlr,
      hasPv,
    });
  }

  if (candidates.length === 0) return null;

  // Prefer runs with training_loop_result, then most recent
  candidates.sort((a, b) => {
    if (a.hasTlr !== b.hasTlr) return a.hasTlr ? -1 : 1;
    return b.mtime - a.mtime;
  });

  return candidates[0];
}

// ---------------------------------------------------------------------------
// FIND ORIGINAL JOB SPEC
// ---------------------------------------------------------------------------
function findOriginalJobSpec(jobId) {
  // Direct match in jobs/
  const directPath = path.join(JOBS_DIR, `${jobId}.json`);
  if (fs.existsSync(directPath)) return readJsonSafe(directPath);

  // Check final_decision for source reference
  return null;
}

// ---------------------------------------------------------------------------
// EXTRACT SOURCE PROMPT FROM FINAL DECISION
// The best candidate's prompt lives inside final_decision.candidates[0]
// ---------------------------------------------------------------------------
function extractSourcePrompt(finalDecision) {
  const candidates = finalDecision.candidates || [];
  if (candidates.length === 0) return { prompt: null, negative_prompt: null, seed: null };

  // Use the winning candidate (first in list = highest score)
  const best = candidates[0];
  return {
    prompt: best.prompt || null,
    negative_prompt: best.negative_prompt || null,
    seed: best.seed || null,
  };
}

// ---------------------------------------------------------------------------
// APPLY PATCH ACTIONS TO PROMPT
// ---------------------------------------------------------------------------
function applyPatchActions(basePrompt, baseNegative, actions) {
  const promptParts = [];
  const negativeParts = [];
  const applied = [];
  const skipped = [];

  for (const action of actions) {
    const injection = PROMPT_INJECTIONS[action];
    if (!injection) {
      skipped.push(action);
      continue;
    }
    applied.push(action);
    if (injection.prompt_append) promptParts.push(injection.prompt_append);
    if (injection.negative_append) negativeParts.push(injection.negative_append);
  }

  // Merge — append new tokens, then dedupe
  let patchedPrompt = basePrompt || "";
  if (promptParts.length > 0) {
    patchedPrompt = patchedPrompt + ", " + promptParts.join(", ");
  }

  let patchedNegative = baseNegative || "";
  if (negativeParts.length > 0) {
    patchedNegative = patchedNegative + ", " + negativeParts.join(", ");
  }

  return {
    prompt: dedupeTokens(patchedPrompt),
    negative_prompt: dedupeTokens(patchedNegative),
    actions_applied: applied,
    actions_skipped: skipped,
  };
}

// ---------------------------------------------------------------------------
// BUILD CORRECTION GUIDANCE FROM FINAL DECISION
// ---------------------------------------------------------------------------
function extractCorrectionContext(finalDecision) {
  return {
    correction_guidance: finalDecision.correction_guidance || [],
    wrong_reads: finalDecision.wrong_reads || [],
    failed_rules: finalDecision.failed_rules || [],
    dominant_fail_reason: finalDecision.dominant_fail_reason || null,
    color_fail_tokens: finalDecision.color_fail_tokens || [],
    gemini_fix_direction: (finalDecision.candidates && finalDecision.candidates[0] &&
      finalDecision.candidates[0].gemini_result && finalDecision.candidates[0].gemini_result.fix_direction) || [],
    gemini_material_read: (finalDecision.candidates && finalDecision.candidates[0] &&
      finalDecision.candidates[0].gemini_result && finalDecision.candidates[0].gemini_result.material_read) || null,
  };
}

// ---------------------------------------------------------------------------
// LOOKUP HISTORICAL PATTERN FROM training_cases.json
// ---------------------------------------------------------------------------
function lookupHistoricalPattern(failureClasses) {
  const casesPath = path.join(MEMORY_DIR, "training_cases.json");
  const cases = readJsonSafe(casesPath);
  if (!cases || !Array.isArray(cases) || failureClasses.length === 0) {
    return { matching_cases: 0, recurring_actions: [] };
  }

  const actionCounts = {};
  let matchCount = 0;

  for (const c of cases) {
    const cClasses = c.failure_class || [];
    const overlap = failureClasses.filter(f => cClasses.includes(f));
    if (overlap.length > 0) {
      matchCount++;
      const actions = (c.patch_plan && c.patch_plan.actions) || [];
      for (const a of actions) {
        actionCounts[a] = (actionCounts[a] || 0) + 1;
      }
    }
  }

  const recurring = Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([action, count]) => ({ action, occurrences: count }));

  return { matching_cases: matchCount, recurring_actions: recurring };
}

// ---------------------------------------------------------------------------
// MAIN: generatePatchedJobSpec()
// Returns { ok, patched_job_spec_path, summary, error }
// ---------------------------------------------------------------------------
function generatePatchedJobSpec() {
  console.log("[PATCH_SPEC_GEN] Starting patched_job_spec generation...");

  // 1. Find patchable run
  const source = findPatchableRun();
  if (!source) {
    return { ok: false, error: "No patchable REJECT run found (need training_loop_result.json + final_decision.json)" };
  }
  console.log(`[PATCH_SPEC_GEN] Source run: ${source.dir}`);

  // 2. Load final decision (needed before inline derivation)
  const fd = readJsonSafe(path.join(source.runDir, "final_decision.json"));
  if (!fd) {
    return { ok: false, error: `Cannot read final_decision.json in ${source.dir}` };
  }

  // 3. Load training loop result (or derive inline from post_validation)
  let tlr = readJsonSafe(path.join(source.runDir, "training_loop_result.json"));
  let derivedInline = false;
  if (!tlr) {
    const pv = readJsonSafe(path.join(source.runDir, "post_validation.json"));
    if (!pv) {
      return { ok: false, error: `No training_loop_result.json or post_validation.json in ${source.dir}` };
    }
    console.log(`[PATCH_SPEC_GEN] No training_loop_result.json — deriving inline from post_validation.json`);
    const validationSignals = extractValidationSignalsForTrainingLoop(pv);
    // Enrich signals from final_decision rich data (color_fail_tokens, wrong_reads)
    enrichSignalsFromFinalDecision(validationSignals, fd);
    console.log(`[PATCH_SPEC_GEN] Enriched signals: ${JSON.stringify(validationSignals)}`);
    const failureAnalysis = classifyFailure(validationSignals, fd);
    const patchPlan = generatePatchPlan(failureAnalysis.failure_class);
    tlr = {
      job_id: fd.job_id,
      triggered: true,
      failure_analysis: failureAnalysis,
      patch_plan: patchPlan,
      ab_result: null,
      timestamp: new Date().toISOString(),
      _derived_inline: true,
    };
    derivedInline = true;
  }

  // 4. Extract source prompt from final decision candidate
  const sourcePrompt = extractSourcePrompt(fd);
  if (!sourcePrompt.prompt) {
    return { ok: false, error: `No candidate prompt found in final_decision.json for ${source.dir}` };
  }
  console.log(`[PATCH_SPEC_GEN] Source prompt length: ${sourcePrompt.prompt.length}`);

  // 5. Load original job spec (best effort)
  const originalSpec = findOriginalJobSpec(fd.job_id);

  // 6. Get patch actions from training loop result
  const patchActions = (tlr.patch_plan && tlr.patch_plan.actions) || [];
  const failureClasses = (tlr.failure_analysis && tlr.failure_analysis.failure_class) || [];
  console.log(`[PATCH_SPEC_GEN] Failure classes: ${JSON.stringify(failureClasses)}`);
  console.log(`[PATCH_SPEC_GEN] Patch actions: ${JSON.stringify(patchActions)}`);

  // 7. Apply patch actions to prompt
  const patchResult = applyPatchActions(sourcePrompt.prompt, sourcePrompt.negative_prompt, patchActions);
  console.log(`[PATCH_SPEC_GEN] Applied ${patchResult.actions_applied.length} actions, skipped ${patchResult.actions_skipped.length}`);

  // 8. Extract correction context from final decision
  const correctionContext = extractCorrectionContext(fd);

  // 9. Lookup historical pattern
  const historical = lookupHistoricalPattern(failureClasses);
  console.log(`[PATCH_SPEC_GEN] Historical matches: ${historical.matching_cases}`);

  // 10. Build patched job spec
  const patchedSpec = {
    _meta: {
      generator: "patched_job_spec_generator",
      version: "1.0.0",
      phase: "PHASE_3",
      generated_at: new Date().toISOString(),
      purpose: "Patched job spec derived from REJECT run training loop output. NOT FOR EXECUTION.",
    },
    provenance: {
      source_run_id: source.dir,
      source_job_id: fd.job_id,
      original_decision: fd.decision,
      original_decision_reason: fd.decision_reason || null,
      training_loop_result_path: path.join(source.runDir, "training_loop_result.json"),
      final_decision_path: path.join(source.runDir, "final_decision.json"),
      original_job_spec_found: !!originalSpec,
      failure_analysis_derived_inline: derivedInline,
    },
    failure_analysis: {
      failure_class: failureClasses,
      primary_failure: (tlr.failure_analysis && tlr.failure_analysis.primary_failure) || "UNKNOWN_FAILURE",
      severity: (tlr.failure_analysis && tlr.failure_analysis.severity) || "LOW",
      failed_rules: correctionContext.failed_rules,
      dominant_fail_reason: correctionContext.dominant_fail_reason,
      color_fail_tokens: correctionContext.color_fail_tokens,
      wrong_reads: correctionContext.wrong_reads,
    },
    patch_actions: {
      actions_from_training_loop: patchActions,
      actions_applied: patchResult.actions_applied,
      actions_skipped: patchResult.actions_skipped,
      patch_targets: (tlr.patch_plan && tlr.patch_plan.patch_targets) || [],
    },
    correction_guidance: {
      from_validator: correctionContext.correction_guidance,
      from_gemini: correctionContext.gemini_fix_direction,
      gemini_material_read: correctionContext.gemini_material_read,
    },
    historical_pattern: historical,
    job_spec: {
      job_id: `PATCHED_${fd.job_id}`,
      type: (originalSpec && originalSpec.type) || "render",
      shot_type: fd.shot_type || (originalSpec && originalSpec.shot_type) || null,
      entity_id: (fd.continuity && fd.continuity.entity_id) || (originalSpec && originalSpec.entity_id) || null,
      entity_class: (fd.continuity && fd.continuity.entity_class) || (originalSpec && originalSpec.entity_class) || null,
      zone: (fd.continuity && fd.continuity.zone) || (originalSpec && originalSpec.zone) || null,
      status: "PATCHED_RETRY",
      render: (originalSpec && originalSpec.render) || {
        width: 1152,
        height: 1152,
        performance: "Quality",
      },
      input: {
        prompt: patchResult.prompt,
        negative_prompt: patchResult.negative_prompt,
      },
    },
    prompt_diff: {
      original_prompt: sourcePrompt.prompt,
      patched_prompt: patchResult.prompt,
      original_negative: sourcePrompt.negative_prompt,
      patched_negative: patchResult.negative_prompt,
      seed_reference: sourcePrompt.seed,
    },
    ab_result: tlr.ab_result || null,
  };

  // 11. Write output
  const outputPath = path.join(source.runDir, "patched_job_spec.json");
  fs.writeFileSync(outputPath, JSON.stringify(patchedSpec, null, 2), "utf-8");
  console.log(`[PATCH_SPEC_GEN] Written: ${outputPath}`);

  return {
    ok: true,
    patched_job_spec_path: outputPath,
    source_run_id: source.dir,
    source_job_id: fd.job_id,
    failure_classes: failureClasses,
    actions_applied: patchResult.actions_applied,
    actions_skipped: patchResult.actions_skipped,
    historical_matches: historical.matching_cases,
    error: null,
  };
}

module.exports = { generatePatchedJobSpec };
