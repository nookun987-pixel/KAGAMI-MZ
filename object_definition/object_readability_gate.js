/**
 * object_definition/object_readability_gate.js
 *
 * Readability gate: rejects vague / abstract / texture-only specs before render.
 * Every ObjectSpec must pass this gate to proceed to prompt compilation.
 *
 * INPUT:  ObjectSpec (from object_spec_generator)
 * OUTPUT: { verdict: "PASS"|"REVISE"|"REJECT", reasons[], fatal_flags[],
 *           object_readable_as, readability_score }
 */

"use strict";

/**
 * Run all readability checks on an ObjectSpec.
 *
 * @param {object} spec - Full ObjectSpec
 * @returns {{ verdict: string, reasons: string[], fatal_flags: string[],
 *             object_readable_as: string, readability_score: number }}
 */
function evaluateReadability(spec) {
  const reasons = [];
  const fatal_flags = [];
  let score = 100;

  // --- FATAL checks (any one = REJECT) ---

  if (!spec.object_class) {
    fatal_flags.push("MISSING_OBJECT_CLASS");
    score -= 100;
  }

  if (!spec.readable_as || spec.readable_as.length < 10) {
    fatal_flags.push("MISSING_READABLE_AS");
    reasons.push("readable_as is missing or too short — viewer cannot identify the object");
    score -= 50;
  }

  if (!spec.identity_core || !spec.identity_core.one_sentence) {
    fatal_flags.push("MISSING_IDENTITY_CORE");
    reasons.push("identity_core.one_sentence is required — defines what the object IS");
    score -= 40;
  }

  if (!spec.must_have_parts || spec.must_have_parts.length === 0) {
    fatal_flags.push("NO_MUST_HAVE_PARTS");
    reasons.push("Object has no defined must_have_parts — nothing guarantees structural readability");
    score -= 30;
  }

  if (!spec.silhouette_rules || !spec.silhouette_rules.must_read_as) {
    fatal_flags.push("NO_SILHOUETTE_RULES");
    reasons.push("No silhouette rules — object outline is undefined, will likely produce abstract blob");
    score -= 30;
  }

  // --- QUALITY checks (reduce score, may trigger REVISE) ---

  // Check part count
  const requiredParts = (spec.must_have_parts || []).filter(
    (p) => p.visibility === "required_visible"
  );
  if (requiredParts.length < 2) {
    reasons.push(`Only ${requiredParts.length} required_visible parts — needs at least 2 for structural readability`);
    score -= 15;
  }

  // Check material truth
  if (!spec.material_truth || !spec.material_truth.primary_material) {
    reasons.push("No primary_material defined — AI will default to random surface");
    score -= 10;
  } else if (spec.material_truth.primary_material === "unknown" || spec.material_truth.primary_material === "unspecified") {
    reasons.push("primary_material is unspecified — should be concrete (ceramic, metal, wood, etc.)");
    score -= 10;
  }

  if (!spec.material_truth || !spec.material_truth.texture_descriptor) {
    reasons.push("No texture_descriptor — prompt will lack specific surface language");
    score -= 5;
  }

  // Check anti-misread coverage
  if (!spec.anti_misread_rules || spec.anti_misread_rules.length === 0) {
    reasons.push("No anti_misread_rules — known failure modes will not be prevented");
    score -= 15;
  }

  if (!spec.common_misreads || spec.common_misreads.length === 0) {
    reasons.push("No common_misreads documented — failure modes unknown");
    score -= 10;
  }

  // Check forbidden parts exist
  if (!spec.forbidden_parts || spec.forbidden_parts.length === 0) {
    reasons.push("No forbidden_parts — nothing prevents unwanted elements");
    score -= 5;
  }

  // Check part priority order
  if (!spec.part_priority_order || spec.part_priority_order.length === 0) {
    reasons.push("No part_priority_order — prompt compiler cannot weight tokens");
    score -= 5;
  }

  // Check topology completeness
  if (spec.topology) {
    if (spec.topology.primary_form === "unspecified") {
      reasons.push("topology.primary_form is unspecified — object geometry undefined");
      score -= 10;
    }
  } else {
    reasons.push("No topology defined");
    score -= 15;
  }

  // Check silhouette forbidden list
  if (
    spec.silhouette_rules &&
    (!spec.silhouette_rules.forbidden_silhouettes ||
      spec.silhouette_rules.forbidden_silhouettes.length === 0)
  ) {
    reasons.push("No forbidden_silhouettes — silhouette gate is incomplete");
    score -= 5;
  }

  // --- Abstract/texture trap detection ---
  const readableAs = (spec.readable_as || "").toLowerCase();
  const abstractTraps = ["texture", "abstract", "pattern", "gradient", "atmosphere", "mood"];
  for (const trap of abstractTraps) {
    if (readableAs.includes(trap) && !readableAs.includes("object") && !readableAs.includes("mask") && !readableAs.includes("artifact")) {
      fatal_flags.push("ABSTRACT_TRAP_IN_READABLE_AS");
      reasons.push(`readable_as contains '${trap}' without an object anchor — will produce texture, not object`);
      score -= 30;
      break;
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // --- Verdict ---
  let verdict;
  if (fatal_flags.length > 0) {
    verdict = "REJECT";
  } else if (score < 60) {
    verdict = "REVISE";
  } else {
    verdict = "PASS";
  }

  return {
    verdict,
    reasons,
    fatal_flags,
    object_readable_as: spec.readable_as || null,
    readability_score: score,
  };
}

module.exports = { evaluateReadability };
