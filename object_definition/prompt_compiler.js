/**
 * object_definition/prompt_compiler.js
 *
 * Compiles an ObjectSpec into a render-ready prompt + hard negatives.
 * Uses part_priority_order to weight token placement.
 * Uses anti_misread_rules to build structured negative prompt.
 *
 * INPUT:  ObjectSpec (gate-passed)
 * OUTPUT: { prompt, negative_prompt, compilation_notes[] }
 */

"use strict";

// ---------------------------------------------------------------------------
// PROMPT STRUCTURE TEMPLATES
// ---------------------------------------------------------------------------
const SHOT_PREFIX = "extreme macro product photography, premium studio close-up, single dominant subject";

const LIGHTING_SUFFIX = "premium low-key studio lighting, soft overhead key light, gentle side fill, shallow controlled depth of field, clean dark background, no environmental distraction, object readability first";

const FRAMING_RULES = "one single main subject only, subject must occupy clear central frame presence, object/entity must be fully readable";

// ---------------------------------------------------------------------------
// COMPILE POSITIVE PROMPT
// ---------------------------------------------------------------------------
function compilePositivePrompt(spec) {
  const segments = [];
  const notes = [];

  // 1. Shot prefix
  segments.push(SHOT_PREFIX);

  // 2. Identity anchor — most important, placed early
  if (spec.readable_as) {
    segments.push(spec.readable_as);
    notes.push("identity_anchor: readable_as placed at position 2");
  }

  // 3. Material truth — high priority for surface readability
  if (spec.material_truth) {
    const mt = spec.material_truth;
    if (mt.primary_material && mt.primary_material !== "unknown" && mt.primary_material !== "unspecified") {
      segments.push(`${mt.surface_finish || ""} ${mt.primary_material} surface`.trim());
    }
    if (mt.texture_descriptor) {
      segments.push(mt.texture_descriptor);
    }
    if (mt.secondary_material) {
      segments.push(mt.secondary_material);
    }
  }

  // 4. Must-have parts in priority order
  const priorityOrder = spec.part_priority_order || [];
  const partMap = {};
  for (const part of spec.must_have_parts || []) {
    partMap[part.part_name] = part;
  }

  for (const partName of priorityOrder) {
    const part = partMap[partName];
    if (part && part.visibility === "required_visible") {
      segments.push(part.description);
      notes.push(`part: ${partName} (required_visible)`);
    }
  }

  // Add any required_visible parts not in priority order
  for (const part of spec.must_have_parts || []) {
    if (part.visibility === "required_visible" && !priorityOrder.includes(part.part_name)) {
      segments.push(part.description);
      notes.push(`part: ${part.part_name} (required_visible, unprioritized)`);
    }
  }

  // 5. Anti-misread positive enforcement
  for (const rule of spec.anti_misread_rules || []) {
    if (rule.enforcement === "positive_prompt" || rule.enforcement === "both") {
      segments.push(rule.rule.toLowerCase());
      notes.push(`anti_misread_positive: ${rule.rule.slice(0, 50)}`);
    }
  }

  // 6. Silhouette reinforcement
  if (spec.silhouette_rules && spec.silhouette_rules.key_contour_features) {
    for (const feature of spec.silhouette_rules.key_contour_features) {
      segments.push(feature);
    }
  }

  // 7. Topology hint
  if (spec.topology && spec.topology.primary_form && spec.topology.primary_form !== "unspecified") {
    segments.push(`${spec.topology.primary_form} form`);
    segments.push(`${spec.topology.symmetry} symmetry`);
  }

  // 8. Framing + lighting
  segments.push(FRAMING_RULES);
  segments.push(LIGHTING_SUFFIX);

  return { text: segments.join(", "), notes };
}

// ---------------------------------------------------------------------------
// COMPILE NEGATIVE PROMPT
// ---------------------------------------------------------------------------
function compileNegativePrompt(spec) {
  const segments = [];
  const notes = [];

  // 1. Anti-misread negative enforcement
  for (const rule of spec.anti_misread_rules || []) {
    if (rule.enforcement === "negative_prompt" || rule.enforcement === "both") {
      // Extract key negative concepts from the rule
      const negConcepts = extractNegativeConcepts(rule.rule);
      segments.push(...negConcepts);
      notes.push(`anti_misread_negative: ${rule.rule.slice(0, 50)}`);
    }
  }

  // 2. Forbidden parts
  for (const part of spec.forbidden_parts || []) {
    segments.push(part);
  }

  // 3. Forbidden materials
  if (spec.material_truth && spec.material_truth.forbidden_materials) {
    for (const mat of spec.material_truth.forbidden_materials) {
      segments.push(mat);
    }
  }

  // 4. Forbidden silhouettes
  if (spec.silhouette_rules && spec.silhouette_rules.forbidden_silhouettes) {
    for (const sil of spec.silhouette_rules.forbidden_silhouettes) {
      segments.push(sil);
    }
  }

  // 5. Common misread prevention
  for (const misread of spec.common_misreads || []) {
    if (misread.misread) {
      segments.push(misread.misread);
    }
  }

  // 6. Universal negatives for object photography
  segments.push(
    "abstract texture field",
    "atmosphere-only frame",
    "subject cropped away",
    "painterly",
    "grain",
    "noise",
    "messy background",
    "blurry",
    "watermark",
    "text",
    "logo"
  );

  return { text: segments.join(", "), notes };
}

/**
 * Extract negative prompt concepts from a rule string.
 */
function extractNegativeConcepts(ruleText) {
  const lower = ruleText.toLowerCase();
  const concepts = [];

  // Pattern: "No X" or "Must not X"
  const noMatch = lower.match(/\bno\s+(.+)/);
  if (noMatch) {
    concepts.push(noMatch[1].replace(/[.!]/g, "").trim());
  }

  // Pattern: "not a/an X"
  const notMatch = lower.match(/\bnot\s+(?:a|an)\s+(.+)/);
  if (notMatch) {
    concepts.push(notMatch[1].replace(/[.!]/g, "").trim());
  }

  if (concepts.length === 0) {
    // Fallback: use the whole rule as a concept (it will be soft negative)
    concepts.push(lower.replace(/[.!]/g, "").trim());
  }

  return concepts;
}

// ---------------------------------------------------------------------------
// MAIN COMPILER
// ---------------------------------------------------------------------------

/**
 * Compile an ObjectSpec into render-ready prompt + negative_prompt.
 *
 * @param {object} spec - Gate-passed ObjectSpec
 * @returns {{ prompt: string, negative_prompt: string, compilation_notes: string[] }}
 */
function compilePrompt(spec) {
  if (!spec || !spec.object_class) {
    return {
      prompt: "",
      negative_prompt: "",
      compilation_notes: ["ERROR: no valid spec provided"],
    };
  }

  const positive = compilePositivePrompt(spec);
  const negative = compileNegativePrompt(spec);

  return {
    prompt: positive.text,
    negative_prompt: negative.text,
    compilation_notes: [...positive.notes, ...negative.notes],
  };
}

module.exports = { compilePrompt };
