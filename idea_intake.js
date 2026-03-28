"use strict";

const { normalizeLaneShotType } = require("./lane_rules");

function normalizeGenerationMode(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "reproduction" ? "reproduction" : "exploration";
}

function normalizeReferenceMaster(value, shotType) {
  if (!value || typeof value !== "object") return null;
  const imagePath = String(value.image_path || "").trim();
  return {
    candidate_id: String(value.candidate_id || "").trim() || null,
    seed: Number.isFinite(value.seed) ? value.seed : null,
    image_path: imagePath || null,
    lane: normalizeLaneShotType(value.lane || shotType || ""),
    silhouette_notes: String(value.silhouette_notes || "").trim() || null,
    camera_notes: String(value.camera_notes || "").trim() || null,
  };
}

function normalizeReproductionConstraints(value, generationMode) {
  if (generationMode !== "reproduction") return null;
  const source = value && typeof value === "object" ? value : {};
  return {
    camera_lock: source.camera_lock !== false,
    silhouette_lock: source.silhouette_lock !== false,
    proportion_lock: source.proportion_lock !== false,
    crimson_restraint_lock: source.crimson_restraint_lock !== false,
    variation_budget: String(source.variation_budget || "minimal").trim().toLowerCase() || "minimal",
  };
}

function normalizeReproductionAnchorMode(value, generationMode) {
  if (generationMode !== "reproduction") return null;
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "image_anchored" ? "image_anchored" : "prompt_anchored";
}

function normalizeAnchorNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizePreservationMode(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "strong_preservation" || normalized === "strong") return "strong_preservation";
  if (normalized === "standard") return "standard";
  return null;
}

function normalizeReconstructionPriority(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "object_first" || normalized === "object") return "object_first";
  if (normalized === "aesthetic_first" || normalized === "aesthetic") return "aesthetic_first";
  return null;
}

function normalizeImageAnchorConfig(job, generationMode, shotType) {
  if (generationMode !== "reproduction") return null;
  const isWeaponLane = shotType === "WEAPON_MACRO";
  const explicitMode = normalizePreservationMode(job.preservation_mode);

  // WEAPON BASELINE LOCK: weapon reproduction defaults to strong_preservation
  // unless job explicitly requests "standard"
  let preservationMode = explicitMode;
  let baselineApplied = false;
  let overrideApplied = false;
  let overrideReason = null;

  if (isWeaponLane) {
    if (!preservationMode) {
      // No explicit mode — apply weapon baseline default
      preservationMode = "strong_preservation";
      baselineApplied = true;
    } else if (preservationMode !== "strong_preservation") {
      // Explicit weaker mode on weapon lane — override back to strong
      overrideApplied = true;
      overrideReason = "WEAPON_BASELINE_LOCK";
      preservationMode = "strong_preservation";
      baselineApplied = true;
    }
  }

  const isStrong = preservationMode === "strong_preservation";
  return {
    reproduction_anchor_mode: normalizeReproductionAnchorMode(job.reproduction_anchor_mode, generationMode),
    anchor_image_path: String(job.anchor_image_path || "").trim() || null,
    anchor_strength: normalizeAnchorNumber(job.anchor_strength, isStrong ? 0.95 : 0.85),
    denoise_strength: normalizeAnchorNumber(job.denoise_strength, isStrong ? 0.08 : 0.18),
    composition_lock_strength: normalizeAnchorNumber(job.composition_lock_strength, isStrong ? 0.95 : 0.9),
    silhouette_lock_strength: normalizeAnchorNumber(job.silhouette_lock_strength, isStrong ? 0.98 : 0.95),
    preservation_mode: preservationMode,
    reconstruction_priority: normalizeReconstructionPriority(job.reconstruction_priority) || (isStrong ? "object_first" : null),
    prompt_weight_reduction_when_anchor_present: normalizeAnchorNumber(job.prompt_weight_reduction_when_anchor_present, isStrong ? 0.4 : null),
    weapon_baseline_applied: baselineApplied,
    weapon_baseline_override_applied: overrideApplied,
    weapon_baseline_override_reason: overrideReason,
  };
}

function normalizeIdeaRequest(job) {
  const phase = String(job.phase || "material_study");
  const shotType = normalizeLaneShotType(job.shot_type || (job.render && job.render.shot_type) || "");
  const weaponMacro = shotType === "WEAPON_MACRO";
  const materialOnly = phase === "material_study" && !weaponMacro;
  const generationMode = normalizeGenerationMode(job.generation_mode);
  const referenceMaster = normalizeReferenceMaster(job.reference_master, shotType);
  const reproductionConstraints = normalizeReproductionConstraints(job.reproduction_constraints, generationMode);
  const imageAnchorConfig = normalizeImageAnchorConfig(job, generationMode, shotType);
  return {
    job_id: String(job.job_id),
    phase,
    shot_type: shotType,
    user_idea: String(job.user_idea || ""),
    generation_mode: generationMode,
    reference_master: referenceMaster,
    reproduction_constraints: reproductionConstraints,
    reproduction_anchor_mode: imageAnchorConfig ? imageAnchorConfig.reproduction_anchor_mode : null,
    anchor_image_path: imageAnchorConfig ? imageAnchorConfig.anchor_image_path : null,
    anchor_strength: imageAnchorConfig ? imageAnchorConfig.anchor_strength : null,
    denoise_strength: imageAnchorConfig ? imageAnchorConfig.denoise_strength : null,
    composition_lock_strength: imageAnchorConfig ? imageAnchorConfig.composition_lock_strength : null,
    silhouette_lock_strength: imageAnchorConfig ? imageAnchorConfig.silhouette_lock_strength : null,
    preservation_mode: imageAnchorConfig ? imageAnchorConfig.preservation_mode : null,
    reconstruction_priority: imageAnchorConfig ? imageAnchorConfig.reconstruction_priority : null,
    prompt_weight_reduction_when_anchor_present: imageAnchorConfig ? imageAnchorConfig.prompt_weight_reduction_when_anchor_present : null,
    weapon_baseline_applied: imageAnchorConfig ? imageAnchorConfig.weapon_baseline_applied === true : false,
    weapon_baseline_override_applied: imageAnchorConfig ? imageAnchorConfig.weapon_baseline_override_applied === true : false,
    weapon_baseline_override_reason: imageAnchorConfig ? imageAnchorConfig.weapon_baseline_override_reason : null,
    priority_target: weaponMacro
      ? "straight engineered greatsword read, sword first, forged metal second"
      : materialOnly
      ? "clean matte B4C technical ceramic read"
      : String(job.priority_target || "canon pass"),
    scope_lock: weaponMacro
      ? ["weapon_lane", "weapon_only", "sword_first"]
      : materialOnly ? ["material_only"] : ["general"],
    do_not_touch: weaponMacro
      ? ["ceramic", "porcelain", "rounded industrial object", "mask-like read", "abstract object read"]
      : materialOnly
      ? ["mask", "identity", "weapon", "silhouette"]
      : [],
  };
}

module.exports = {
  normalizeIdeaRequest,
};
