"use strict";

const visualContract = require("../canon/MIKAGE_VISUAL_CONTRACT_V1.json");

function dedupe(values) {
  return [...new Set((values || []).filter(Boolean).map((value) => String(value)))];
}

function collectCanonTraits(taskSpec, canonMemory = {}) {
  const directTraits = canonMemory.traits || {};
  const patterns = Array.isArray(canonMemory.patterns) ? canonMemory.patterns : [];
  const goal = String(taskSpec && taskSpec.objective || "").toLowerCase();
  const lane = String(taskSpec && taskSpec.lane || "");
  const matchedPatterns = patterns.filter((pattern) => {
    if (pattern.lane && String(pattern.lane) !== lane) {
      return false;
    }
    if (!pattern.match) {
      return true;
    }
    return goal.includes(String(pattern.match).toLowerCase());
  });

  return {
    dominant_traits: dedupe([]
      .concat(directTraits.dominant_traits || [])
      .concat(matchedPatterns.flatMap((pattern) => pattern.dominant_traits || []))),
    supportive_traits: dedupe([]
      .concat(directTraits.supportive_traits || [])
      .concat(matchedPatterns.flatMap((pattern) => pattern.supportive_traits || []))),
    blocked_traits: dedupe([]
      .concat(directTraits.blocked_traits || [])
      .concat(matchedPatterns.flatMap((pattern) => pattern.blocked_traits || []))),
    must_have_traits: dedupe([]
      .concat(directTraits.must_have_traits || [])
      .concat(matchedPatterns.flatMap((pattern) => pattern.must_have_traits || []))),
  };
}

function collectDominantReference(canonMemory = {}) {
  return canonMemory && canonMemory.dominant_reference && typeof canonMemory.dominant_reference === "object"
    ? canonMemory.dominant_reference
    : {};
}

function getPatchHints(code) {
  return visualContract.PATCH_HINTS && visualContract.PATCH_HINTS[code]
    ? visualContract.PATCH_HINTS[code]
    : { prompt: [], negative: [], canon: [], targets: [] };
}

function compileCanonPatchPacket(context = {}) {
  const taskSpec = context.taskSpec || {};
  const qualityFailurePacket = context.qualityFailurePacket || {};
  const failureCodes = qualityFailurePacket.failure_codes || [];
  const primaryFailureCodes = qualityFailurePacket.primary_failure_codes || (failureCodes[0] ? [failureCodes[0]] : []);
  const canonTraits = collectCanonTraits(taskSpec, context.canonMemory || {});
  const dominantReference = collectDominantReference(context.canonMemory || {});
  const promptPatch = {
    positive_additions: [],
    negative_additions: [],
  };
  const canonReinforcements = [];
  const patchTargets = new Set();
  const primaryStrongRecovery = primaryFailureCodes.some((code) => ["ABSTRACT_COMPOSITION", "OBJECT_UNREADABLE", "FUNCTIONAL_FORM_WEAK", "OBJECT_CENTRALITY_WEAK", "GENERIC_OBJECT", "WEAK_IDENTITY"].includes(code));

  for (const code of failureCodes) {
    const hints = getPatchHints(code);
    for (const item of hints.prompt || []) promptPatch.positive_additions.push(item);
    for (const item of hints.negative || []) promptPatch.negative_additions.push(item);
    for (const item of hints.canon || []) canonReinforcements.push(item);
    for (const item of hints.targets || []) patchTargets.add(item);
  }

  if (failureCodes.includes("OBJECT_UNREADABLE")) {
    promptPatch.positive_additions.push("clear readable hero object");
    promptPatch.positive_additions.push("single dominant subject silhouette");
  }

  if (failureCodes.includes("ABSTRACT_COMPOSITION")) {
    promptPatch.positive_additions.push("literal subject framing");
    promptPatch.positive_additions.push("single engineered ceramic object centered in frame");
    promptPatch.positive_additions.push("front readable silhouette with one-glance object recognition");
    promptPatch.negative_additions.push("abstract composition");
    promptPatch.negative_additions.push("symbolic non-literal framing");
    promptPatch.negative_additions.push("mood-first composition");
    promptPatch.negative_additions.push("texture-first composition");
  }

  if (failureCodes.includes("TEXTURE_ONLY_FRAME")) {
    promptPatch.positive_additions.push("full object readable in frame");
    promptPatch.negative_additions.push("texture-only frame");
  }

  if (failureCodes.includes("CERAMIC_NOT_CONVINCING")) {
    promptPatch.positive_additions.push("convincing fired ceramic surface");
    promptPatch.positive_additions.push("ceramic glaze material read");
  }

  if (failureCodes.includes("SILHOUETTE_BREAK")) {
    promptPatch.positive_additions.push("clean intact silhouette edge");
  }

  if (failureCodes.includes("COMPOSITION_COLLAPSE")) {
    promptPatch.positive_additions.push("stable centered composition");
    promptPatch.positive_additions.push("clear foreground subject separation");
  }

  if (failureCodes.includes("CANON_DRIFT")) {
    promptPatch.negative_additions.push("off-canon drift");
  }

  if (String(taskSpec.context && taskSpec.context.render_mode || "").toUpperCase() === "HERO_LOCK" || String(taskSpec.context && taskSpec.context.requested_render_mode || "").toUpperCase() === "HERO_LOCK") {
    promptPatch.positive_additions = promptPatch.positive_additions
      .concat(dominantReference.silhouette_traits || [])
      .concat(dominantReference.material_traits || [])
      .concat(dominantReference.framing_traits || []);
    promptPatch.negative_additions = promptPatch.negative_additions
      .concat(dominantReference.blocked_traits || []);
  }

  return {
    contract_version: visualContract.contract_version || "MIKAGE_VISUAL_CONTRACT_V1",
    repair_class: qualityFailurePacket.repair_class || "",
    recovery_mode: primaryStrongRecovery ? "STRONG_OBJECT_RECOVERY" : "STANDARD_RECOVERY",
    failure_codes: failureCodes,
    primary_failure_codes: primaryFailureCodes,
    patch_targets: [...patchTargets],
    prompt_patch: {
      positive_additions: dedupe(promptPatch.positive_additions.concat(canonTraits.must_have_traits, canonTraits.supportive_traits)),
      negative_additions: dedupe(promptPatch.negative_additions.concat(canonTraits.blocked_traits)),
    },
    canon_reinforcements: dedupe(canonReinforcements),
    canon_patch: {
      dominant_traits: canonTraits.dominant_traits,
      supportive_traits: canonTraits.supportive_traits,
      blocked_traits: canonTraits.blocked_traits,
      must_have_traits: canonTraits.must_have_traits,
      dominant_reference: dominantReference,
    },
  };
}

module.exports = {
  compileCanonPatchPacket,
};
