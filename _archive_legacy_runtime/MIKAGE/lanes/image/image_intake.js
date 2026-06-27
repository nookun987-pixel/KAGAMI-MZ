"use strict";

function splitConstraintPatches(values) {
  const positives = [];
  const negatives = [];

  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value || "").trim();
    if (!text) {
      continue;
    }

    if (text.startsWith("NEGATIVE:")) {
      negatives.push(text.slice("NEGATIVE:".length).trim());
    } else {
      positives.push(text);
    }
  }

  return { positives, negatives };
}

function readModeConstraint(values, prefix) {
  for (const value of Array.isArray(values) ? values : []) {
    const text = String(value || "").trim();
    if (text.toUpperCase().startsWith(`${prefix}:`)) {
      return text.slice(prefix.length + 1).trim();
    }
  }
  return "";
}

function buildStrongRecoveryObjective(objective) {
  const raw = String(objective || "").trim().toLowerCase();
  if (!raw) {
    return "single engineered manufactured object";
  }

  if (raw.includes("mask")) {
    return "single engineered ceramic mask artifact";
  }

  if (raw.includes("helmet")) {
    return "single engineered ceramic helmet artifact";
  }

  if (raw.includes("artifact")) {
    return "single engineered ceramic artifact";
  }

  if (raw.includes("object")) {
    return "single engineered manufactured object";
  }

  return "single engineered ceramic object";
}

function createImageIntake(taskSpec) {
  const repairAction = taskSpec && taskSpec.context && taskSpec.context.repair_action || {};
  const repairPatchPacket = taskSpec && taskSpec.context && taskSpec.context.repair_patch_packet || repairAction.repair_patch_packet || {};
  const shotProfile = readModeConstraint(taskSpec && taskSpec.constraints, "SHOT_PROFILE");
  const renderMode = readModeConstraint(taskSpec && taskSpec.constraints, "RENDER_MODE");
  const dominantReference = taskSpec && taskSpec.context && taskSpec.context.dominant_reference || {};
  const dnaLockPacket = taskSpec && taskSpec.context && taskSpec.context.dna_lock_packet || {};
  const variantSpec = taskSpec && taskSpec.context && taskSpec.context.variant_spec || {};
  const split = splitConstraintPatches(taskSpec && taskSpec.constraints);
  const positiveAdditions = []
    .concat(variantSpec.prompt_controls && variantSpec.prompt_controls.positive_additions || [])
    .concat(dominantReference.silhouette_traits || [])
    .concat(dominantReference.material_traits || [])
    .concat(dominantReference.framing_traits || [])
    .concat(dnaLockPacket.material_dna || [])
    .concat(dnaLockPacket.edge_dna || [])
    .concat(dnaLockPacket.silhouette_grammar || [])
    .concat(dnaLockPacket.identity_anchors || [])
    .concat(repairAction.prompt_patch && repairAction.prompt_patch.positive_additions || [])
    .concat(repairPatchPacket.prompt_patch && repairPatchPacket.prompt_patch.positive_additions || [])
    .concat(split.positives)
    .filter(Boolean);
  const negativeAdditions = []
    .concat(variantSpec.prompt_controls && variantSpec.prompt_controls.negative_additions || [])
    .concat(dominantReference.blocked_traits || [])
    .concat(dnaLockPacket.hard_forbidden_traits || [])
    .concat(repairAction.prompt_patch && repairAction.prompt_patch.negative_additions || [])
    .concat(repairPatchPacket.prompt_patch && repairPatchPacket.prompt_patch.negative_additions || [])
    .concat(split.negatives)
    .filter(Boolean);
  const recoveryMode = taskSpec && taskSpec.context && taskSpec.context.retry_context && taskSpec.context.retry_context.recovery_mode
    || repairPatchPacket.recovery_mode
    || repairAction.recovery_mode
    || "STANDARD_RECOVERY";
  const objectiveAnchor = recoveryMode === "STRONG_OBJECT_RECOVERY"
    ? buildStrongRecoveryObjective(taskSpec.objective)
    : taskSpec.objective;
  const promptSegments = recoveryMode === "STRONG_OBJECT_RECOVERY"
    ? [objectiveAnchor].concat(positiveAdditions)
    : [objectiveAnchor].concat(positiveAdditions);
  if (renderMode === "HERO_LOCK") {
    promptSegments.push("single subject hero frame");
    promptSegments.push("one artifact only");
    promptSegments.push("single mask only");
    promptSegments.push("subject dominates frame");
    promptSegments.push("subject occupies most of frame");
    promptSegments.push("heavy engineered presence");
    promptSegments.push("world-specific industrial ceramic identity");
    promptSegments.push("obsidian void background");
    negativeAdditions.push("multi-object grid");
    negativeAdditions.push("scattered composition");
    negativeAdditions.push("generic product render");
    negativeAdditions.push("multiple masks");
    negativeAdditions.push("alternate angle inserts");
    negativeAdditions.push("contact sheet layout");
  }
  if (shotProfile === "MASK_MACRO") {
    promptSegments.push("mask macro hero artifact");
    promptSegments.push("front dominant silhouette");
  }
  if (shotProfile === "ENTITY_MEDIUM") {
    promptSegments.push("single entity medium shot");
    promptSegments.push("coherent subject hierarchy");
  }
  const variantMode = Boolean(variantSpec && variantSpec.variant_id);
  const boundedPositiveSegments = [...new Set(promptSegments.filter(Boolean))].slice(0, variantMode ? 28 : (recoveryMode === "STRONG_OBJECT_RECOVERY" ? 16 : 12));
  const boundedNegativeSegments = [...new Set(negativeAdditions.filter(Boolean))].slice(0, variantMode ? 24 : (recoveryMode === "STRONG_OBJECT_RECOVERY" ? 18 : 12));

  return {
    lane: "image",
    job_id: taskSpec.job_id,
    objective: taskSpec.objective,
    prompt: boundedPositiveSegments.join(", "),
    negative_prompt: boundedNegativeSegments.join(", "),
    constraints: Array.isArray(taskSpec.constraints) ? [...taskSpec.constraints] : [],
    priority: taskSpec.priority || "normal",
    retry_context: taskSpec && taskSpec.context && taskSpec.context.retry_context || null,
    variant_spec: variantSpec && variantSpec.variant_id ? variantSpec : null,
    render_mode: renderMode || null,
    shot_profile: shotProfile || null,
  };
}

module.exports = {
  createImageIntake,
};
