/**
 * object_definition/object_definition_bridge.js
 *
 * Thin bridge that runs the full Object Definition Lane V1 and returns
 * a structured result for the orchestrator to consume.
 *
 * Flow: raw intent → normalizer → spec generator → readability gate → prompt compiler
 *
 * HARD LOCK: If gate returns REJECT, the run must be blocked before spec stage.
 * No fallback to freeform object invention when object_definition exists.
 */

"use strict";

const { normalizeIntent } = require("./object_intent_normalizer");
const { generateObjectSpec } = require("./object_spec_generator");
const { evaluateReadability } = require("./object_readability_gate");
const { compilePrompt } = require("./prompt_compiler");

/**
 * Run the full Object Definition Lane.
 *
 * @param {string} rawIntent - Raw creative intent (prompt text from intake)
 * @param {object} [context={}] - Optional context: { shot_type, lane, entity_id }
 * @returns {{
 *   ok: boolean,
 *   verdict: "PASS"|"REVISE"|"REJECT"|"NORMALIZER_REJECT",
 *   object_spec: object|null,
 *   compiled_prompt: string|null,
 *   compiled_negative: string|null,
 *   compilation_notes: string[],
 *   gate_result: object|null,
 *   normalizer_result: object|null,
 *   spec_source: string|null,
 *   rejection_reason: string|null,
 *   fatal_flags: string[],
 *   readability_score: number|null,
 *   timestamp: string
 * }}
 */
function runObjectDefinitionLane(rawIntent, context = {}) {
  const timestamp = new Date().toISOString();
  const log = (msg) => console.log(`[OBJECT_DEF] ${msg}`);

  // --- STEP 1: Normalize intent ---
  log(`Normalizing intent: "${String(rawIntent).slice(0, 80)}..."`);
  const normResult = normalizeIntent(rawIntent);

  if (!normResult.ok) {
    log(`Normalizer REJECT: ${normResult.rejection ? normResult.rejection.reason : "unknown"}`);
    return {
      ok: false,
      verdict: "NORMALIZER_REJECT",
      object_spec: null,
      compiled_prompt: null,
      compiled_negative: null,
      compilation_notes: [],
      gate_result: null,
      normalizer_result: normResult,
      spec_source: null,
      rejection_reason: normResult.rejection
        ? `${normResult.rejection.reason}: ${normResult.rejection.detail}`
        : "Normalizer rejected intent",
      fatal_flags: [normResult.rejection ? normResult.rejection.reason : "NORMALIZER_REJECT"],
      readability_score: null,
      timestamp,
    };
  }

  const designIntent = normResult.design_intent;
  log(`Normalized: class=${designIntent.object_class}, material=${designIntent.material_hint || "none"}`);

  // --- STEP 2: Generate object spec ---
  const specResult = generateObjectSpec(designIntent);

  if (!specResult.ok) {
    log(`Spec generation FAILED: ${specResult.errors.join(", ")}`);
    return {
      ok: false,
      verdict: "REJECT",
      object_spec: specResult.spec,
      compiled_prompt: null,
      compiled_negative: null,
      compilation_notes: [],
      gate_result: null,
      normalizer_result: normResult,
      spec_source: specResult.source,
      approved_memory_reused: !!specResult.approved_memory_reused,
      approved_memory_identity: specResult.approved_memory_identity || null,
      memory_sanitation_applied: !!specResult.memory_sanitation_applied,
      canon_evolution_reused: !!specResult.canon_evolution_reused,
      canon_evolution_source_keys: specResult.canon_evolution_source_keys || [],
      rejection_reason: `Spec generation failed: ${specResult.errors.join("; ")}`,
      fatal_flags: ["SPEC_GENERATION_FAILED"],
      readability_score: null,
      timestamp,
    };
  }

  log(`Spec generated: ${specResult.spec.object_id} (source=${specResult.source})`);

  // --- STEP 3: Readability gate ---
  const gateResult = evaluateReadability(specResult.spec);
  log(`Gate: verdict=${gateResult.verdict}, score=${gateResult.readability_score}`);

  if (gateResult.verdict === "REJECT") {
    log(`Gate REJECT: ${gateResult.fatal_flags.join(", ")}`);
    return {
      ok: false,
      verdict: "REJECT",
      object_spec: specResult.spec,
      compiled_prompt: null,
      compiled_negative: null,
      compilation_notes: [],
      gate_result: gateResult,
      normalizer_result: normResult,
      spec_source: specResult.source,
      rejection_reason: `Readability gate REJECT: ${gateResult.reasons.join("; ")}`,
      fatal_flags: gateResult.fatal_flags,
      readability_score: gateResult.readability_score,
      timestamp,
    };
  }

  // --- STEP 4: Compile prompt ---
  const compiled = compilePrompt(specResult.spec);
  log(`Compiled: prompt=${compiled.prompt.length}c, negative=${compiled.negative_prompt.length}c`);

  // REVISE passes through but is flagged — downstream can decide to block or continue
  const isPass = gateResult.verdict === "PASS";

  return {
    ok: isPass,
    verdict: gateResult.verdict,
    object_spec: specResult.spec,
    compiled_prompt: compiled.prompt,
    compiled_negative: compiled.negative_prompt,
    compilation_notes: compiled.compilation_notes,
    gate_result: gateResult,
    normalizer_result: normResult,
    spec_source: specResult.source,
    approved_memory_reused: !!specResult.approved_memory_reused,
    approved_memory_identity: specResult.approved_memory_identity || null,
    memory_sanitation_applied: !!specResult.memory_sanitation_applied,
    canon_evolution_reused: !!specResult.canon_evolution_reused,
    canon_evolution_source_keys: specResult.canon_evolution_source_keys || [],
    rejection_reason: isPass ? null : `Readability gate ${gateResult.verdict}: ${gateResult.reasons.join("; ")}`,
    fatal_flags: gateResult.fatal_flags,
    readability_score: gateResult.readability_score,
    timestamp,
  };
}

/**
 * Extract the fields that Claude Spec must inherit from object_definition.
 * No silent drop allowed.
 *
 * @param {object} objectSpec - The full ObjectSpec from the lane
 * @returns {object} Fields for spec inheritance
 */
function extractSpecInheritance(objectSpec) {
  if (!objectSpec) return null;

  return {
    object_identity: {
      object_class: objectSpec.object_class,
      object_id: objectSpec.object_id,
      readable_as: objectSpec.readable_as,
      identity_core: objectSpec.identity_core,
    },
    material_lock: objectSpec.material_truth || null,
    silhouette_lock: objectSpec.silhouette_rules || null,
    structure_lock: objectSpec.topology || null,
    must_have: (objectSpec.must_have_parts || []).map((p) => p.part_name),
    must_not_have: objectSpec.forbidden_parts || [],
    anti_drift_rules: (objectSpec.anti_misread_rules || []).map((r) => r.rule),
    part_priority_order: objectSpec.part_priority_order || [],
  };
}

module.exports = {
  runObjectDefinitionLane,
  extractSpecInheritance,
};
