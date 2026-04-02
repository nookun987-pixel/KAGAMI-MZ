"use strict";

const { applyLaneRuleToIntake, getLaneRule, normalizeLaneShotType } = require("./lane_rules");
const { applyColorCanonToIntake, applyColorCanonToSpec } = require("./color_rules");

function buildMaterialPromptPackage(job, intakeRequest, geminiIntake) {
  const colorLockedIntake = applyColorCanonToIntake(geminiIntake || {});
  
  // ANTI-ABSTRACT LOCK: Engineered manufactured form (not character/costume)
  const objectType = "engineered ceramic shell";
  const objectForm = "hard-surface geometric chassis";
  const objectDiscipline = "brutalist industrial form with precision manufacturing";
  
  const structuredPrompt = [
    "PRODUCT PHOTOGRAPHY - STUDIO PRODUCT SHOT",
    `One ${objectType}, ${objectForm}. ${objectDiscipline}. Isolated manufactured object, not character or costume. Catalog object, industrial design prototype.`,
    "",
    "OBJECT ISOLATION (HARD TOKENS)",
    "Single manufactured shell object centered. Product photography framing. Catalog object presentation. Clean white/neutral backdrop. Isolated object on clean background.",
    "",
    "PRODUCT PHOTOGRAPHY DISCIPLINE",
    "Studio product shot. Centered composition. Single object. Sharp edges. Engineered seams. Manufactured object clarity. Industrial design prototype.",
    "",
    "FORM DISCIPLINE",
    "Hard-surface geometric chassis. Precision manufactured contours. Engineered silhouette with defined edges. Industrial ceramic housing. Non-organic, non-character.",
    "",
    "EDGES",
    "Twelve edges visible as sharp lines. Edge highlights define cube boundaries. No rounded corners. Geometric precision. Manufactured seam lines.",
    "",
    "MATERIAL",
    "Matte boron carbide (B4C) technical ceramic. Warm white #FAFAFA. Micro-pitted eggshell texture on flat faces. Zero gloss. Industrial ceramic, not plastic.",
    "",
    "LIGHTING",
    "Directional light from upper left. Three faces at different brightness levels showing 3D form. Clear cast shadow. Dark minimal background. Studio lighting.",
    "",
    "REJECT IF",
    "No cube visible. No sharp edges. Pattern only. Abstract texture. Wall or slab appearance. Environment storytelling. Cinematic scene. Character pose.",
  ].join("\n");

  const negativePrompt = [
    // P8 ANTI-CHARACTER/ANTI-COSTUME BLOCK (highest priority)
    "cosplay",
    "costume",
    "apparel",
    "clothing",
    "outfit",
    "fashion",
    "character",
    "portrait",
    "person",
    "human",
    "face",
    "eyes",
    "skin",
    "expression",
    "warrior",
    "knight",
    "fighter",
    "hero",
    "magical",
    "fantasy",
    "fantasy armor",
    "ornamental",
    "decorative",
    "filigree",
    "embellishment",
    "jewelry",
    "accessory",
    "necklace",
    "crown",
    "tiara",
    "buckle",
    "strap",
    "anime",
    "manga",
    "cartoon",
    "stylized",
    "illustration",
    // P8-7 ANTI-ENVIRONMENT/ANTI-CINEMATIC BLOCK
    "cinematic scene",
    "environment heavy",
    "background complexity",
    "environment storytelling",
    "action framing",
    "corridor",
    // Anti-abstract (highest priority)
    "abstract composition",
    "texture-only frame",
    "pattern without object",
    "background dominates",
    "no clear subject",
    "fragmented composition",
    "decorative texture",
    "material swatch",
    "abstract art",
    "wall texture",
    "slab surface",
    "floating texture",
    "pattern-first",
    "atmospheric-only",
    "no object",
    "surface-only",
    "macro without context",
    "mosaic",
    "rough masonry",
    "porous stone",
    "plaster",
    "gypsum",
    "chalk",
    "concrete dust",
    "mineral banding",
    "layered erosion",
    // Material errors
    "plastic",
    "glossy",
    "shiny",
    "PVC",
    "toy-like",
    "anime",
    "cyberpunk",
    "vibrant colors",
    "neon",
    "glitter",
    "metal",
    "glass",
    "wet",
    "smooth skin",
    "low quality",
    "blurry",
    "watermark",
    "text",
    "messy background",
    "oversaturated",
    "specular highlights",
    "ambient color wash",
    "magenta spill",
    "carved stone",
    "sculpted surface",
  ].join(", ");

  return applyColorCanonToSpec({
    job_id: job.job_id,
    phase_target: intakeRequest.phase,
    structured_prompt: structuredPrompt,
    negative_prompt: negativePrompt,
    render_spec: {
      shot_type: "macro_material_study",
      lighting: "low_key_grazing",
      background: "minimal_brutalist",
      priority: "material_readability",
      width: Number(job.render && job.render.width) || 1024,
      height: Number(job.render && job.render.height) || 1024,
      performance: (job.render && job.render.performance) || "Quality",
    },
    scope_lock: intakeRequest.scope_lock,
    do_not_touch: intakeRequest.do_not_touch,
    intake_summary: colorLockedIntake.direction_summary,
    locked_prompt_package: {
      subject: "Mikage Zenith, matte B4C technical ceramic, porcelain white, silent disciplined material study",
      texture: [
        "Faceless white cybernetic helmet",
        "Long, straight, heavy black hair flowing naturally",
        "matte B4C technical ceramic",
        "porcelain white",
        "eggshell microtexture",
        "subtle hairline fractures",
        "matte black graphene reference",
        "void black optical sensors",
        "Zenith Blade",
      ],
      lighting: [
        "low-key cinematic",
        "no ambient color wash",
        "no magenta spill",
        "no neon",
      ],
      composition_rules: [
        "macro close-up",
        "clean negative space",
        "premium commercial readability",
        "brutalist minimal concrete surface",
      ],
      prompt: structuredPrompt,
      negative_prompt: negativePrompt,
    },
  }, colorLockedIntake);
}

function normalizeText(value) {
  return String(value || "").trim();
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
}

function dedupeStrings(values) {
  const out = [];
  const seen = new Set();
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }
  return out;
}

function normalizeGenerationMode(value) {
  return String(value || "").trim().toLowerCase() === "reproduction" ? "reproduction" : "exploration";
}

function normalizeAnchorMode(value, generationMode) {
  if (generationMode !== "reproduction") return null;
  return String(value || "").trim().toLowerCase() === "image_anchored" ? "image_anchored" : "prompt_anchored";
}

function normalizeAnchorNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveReproductionControl(job, intakeRequest) {
  const generationMode = normalizeGenerationMode(
    (intakeRequest && intakeRequest.generation_mode) ||
    (job && job.generation_mode)
  );
  const referenceMaster =
    (intakeRequest && intakeRequest.reference_master && typeof intakeRequest.reference_master === "object"
      ? intakeRequest.reference_master
      : job && job.reference_master && typeof job.reference_master === "object"
        ? job.reference_master
        : null);
  const reproductionConstraints =
    (intakeRequest && intakeRequest.reproduction_constraints && typeof intakeRequest.reproduction_constraints === "object"
      ? intakeRequest.reproduction_constraints
      : job && job.reproduction_constraints && typeof job.reproduction_constraints === "object"
        ? job.reproduction_constraints
        : null);
  const reproductionActive = generationMode === "reproduction" && !!referenceMaster;
  const reproductionAnchorMode = normalizeAnchorMode(
    (intakeRequest && intakeRequest.reproduction_anchor_mode) ||
    (job && job.reproduction_anchor_mode),
    generationMode
  );
  const anchorImagePath = normalizeText(
    (intakeRequest && intakeRequest.anchor_image_path) ||
    (job && job.anchor_image_path)
  ) || null;
  const imageAnchoredActive =
    reproductionActive &&
    reproductionAnchorMode === "image_anchored" &&
    !!anchorImagePath;
  // WEAPON BASELINE LOCK: enforce strong_preservation for weapon reproduction
  const shotType = normalizeText(
    (intakeRequest && intakeRequest.shot_type) ||
    (job && job.shot_type)
  ).toUpperCase() || null;
  const isWeaponLane = shotType === "WEAPON_MACRO";
  let rawPreservationMode = normalizeText(
    (intakeRequest && intakeRequest.preservation_mode) ||
    (job && job.preservation_mode)
  ).toLowerCase() || null;
  let weaponBaselineApplied = false;
  let weaponBaselineOverrideApplied = false;
  let weaponBaselineOverrideReason = null;
  if (isWeaponLane && generationMode === "reproduction") {
    if (!rawPreservationMode) {
      rawPreservationMode = "strong_preservation";
      weaponBaselineApplied = true;
    } else if (rawPreservationMode !== "strong_preservation") {
      weaponBaselineOverrideApplied = true;
      weaponBaselineOverrideReason = "WEAPON_BASELINE_LOCK";
      rawPreservationMode = "strong_preservation";
      weaponBaselineApplied = true;
    }
  }
  const preservationMode = rawPreservationMode;
  const isStrong = preservationMode === "strong_preservation" && imageAnchoredActive;
  const anchorMethodUsed = isStrong
    ? "fooocus_strong_preservation_vary_ip_cpds_canny"
    : imageAnchoredActive ? "fooocus_ip_plus_vary_cpds_canny" : null;
  const reconstructionPriority = normalizeText(
    (intakeRequest && intakeRequest.reconstruction_priority) ||
    (job && job.reconstruction_priority)
  ) || (isStrong ? "object_first" : null);
  const promptWeightReduction = normalizeAnchorNumber(
    (intakeRequest && intakeRequest.prompt_weight_reduction_when_anchor_present) ??
    (job && job.prompt_weight_reduction_when_anchor_present),
    isStrong ? 0.4 : null
  );
  return {
    generation_mode: generationMode,
    reference_master: referenceMaster,
    reference_master_used: reproductionActive,
    reproduction_constraints: reproductionConstraints,
    reproduction_constraints_used: reproductionActive && !!reproductionConstraints,
    reproduction_anchor_mode: reproductionAnchorMode,
    anchor_image_path: anchorImagePath,
    anchor_strength: normalizeAnchorNumber(
      (intakeRequest && intakeRequest.anchor_strength) ||
      (job && job.anchor_strength),
      isStrong ? 0.95 : 0.85
    ),
    denoise_strength: normalizeAnchorNumber(
      (intakeRequest && intakeRequest.denoise_strength) ||
      (job && job.denoise_strength),
      isStrong ? 0.08 : 0.18
    ),
    composition_lock_strength: normalizeAnchorNumber(
      (intakeRequest && intakeRequest.composition_lock_strength) ||
      (job && job.composition_lock_strength),
      isStrong ? 0.95 : 0.9
    ),
    silhouette_lock_strength: normalizeAnchorNumber(
      (intakeRequest && intakeRequest.silhouette_lock_strength) ||
      (job && job.silhouette_lock_strength),
      isStrong ? 0.98 : 0.95
    ),
    anchor_method_used: anchorMethodUsed,
    anchor_image_used: anchorImagePath,
    anchor_strength_used: imageAnchoredActive ? normalizeAnchorNumber(
      (intakeRequest && intakeRequest.anchor_strength) ||
      (job && job.anchor_strength),
      isStrong ? 0.95 : 0.85
    ) : null,
    denoise_strength_used: imageAnchoredActive ? normalizeAnchorNumber(
      (intakeRequest && intakeRequest.denoise_strength) ||
      (job && job.denoise_strength),
      isStrong ? 0.08 : 0.18
    ) : null,
    image_anchor_success_expected: imageAnchoredActive,
    preservation_mode: preservationMode,
    reconstruction_priority: reconstructionPriority,
    prompt_weight_reduction_when_anchor_present: promptWeightReduction,
    weapon_baseline_applied: weaponBaselineApplied,
    weapon_baseline_override_applied: weaponBaselineOverrideApplied,
    weapon_baseline_override_reason: weaponBaselineOverrideReason,
  };
}

function buildWeaponPromptPackage(job, intakeRequest, geminiIntake) {
  const laneLockedIntake = applyColorCanonToIntake(applyLaneRuleToIntake(geminiIntake));
  const laneRule = getLaneRule(
    laneLockedIntake &&
    laneLockedIntake.composition &&
    laneLockedIntake.composition.shot_type
  );
  const requiredAnchors = laneRule ? laneRule.required.slice() : [];
  const forbiddenAnchors = laneRule ? laneRule.forbidden.slice() : [];
  const subjectIdentity =
    normalizeText(laneLockedIntake.subject && laneLockedIntake.subject.identity) ||
    "Zenith Blade, straight engineered greatsword";
  const materialPrimary =
    normalizeText(laneLockedIntake.material && laneLockedIntake.material.primary) ||
    "forged steel / titanium / dark industrial alloy";
  const materialSurface =
    normalizeText(laneLockedIntake.material && laneLockedIntake.material.surface) ||
    "dark industrial alloy blade with hard forged planes";
  const materialFinish =
    normalizeText(laneLockedIntake.material && laneLockedIntake.material.finish) ||
    "dry forged metal finish with precise hard edges";
  const reproductionControl = resolveReproductionControl(job, intakeRequest);
  const reproductionLines = reproductionControl.reference_master_used
    ? [
        "REPRODUCTION ANCHOR",
        `generation mode: ${reproductionControl.generation_mode}`,
        `visual anchor candidate: ${normalizeText(reproductionControl.reference_master && reproductionControl.reference_master.candidate_id) || "unknown"}`,
        `visual anchor seed: ${reproductionControl.reference_master && Number.isFinite(reproductionControl.reference_master.seed) ? reproductionControl.reference_master.seed : "unknown"}`,
        `visual anchor image path: ${normalizeText(reproductionControl.reference_master && reproductionControl.reference_master.image_path) || "unknown"}`,
        `silhouette anchor: ${normalizeText(reproductionControl.reference_master && reproductionControl.reference_master.silhouette_notes) || "match locked master silhouette exactly"}`,
        `camera anchor: ${normalizeText(reproductionControl.reference_master && reproductionControl.reference_master.camera_notes) || "front-on centered full vertical framing"}`,
        `camera_lock: ${!!(reproductionControl.reproduction_constraints && reproductionControl.reproduction_constraints.camera_lock)}`,
        `silhouette_lock: ${!!(reproductionControl.reproduction_constraints && reproductionControl.reproduction_constraints.silhouette_lock)}`,
        `proportion_lock: ${!!(reproductionControl.reproduction_constraints && reproductionControl.reproduction_constraints.proportion_lock)}`,
        `crimson_restraint_lock: ${!!(reproductionControl.reproduction_constraints && reproductionControl.reproduction_constraints.crimson_restraint_lock)}`,
        `variation_budget: ${normalizeText(reproductionControl.reproduction_constraints && reproductionControl.reproduction_constraints.variation_budget) || "minimal"}`,
        `reproduction_anchor_mode: ${normalizeText(reproductionControl.reproduction_anchor_mode) || "prompt_anchored"}`,
        `anchor_image_path: ${normalizeText(reproductionControl.anchor_image_path) || "none"}`,
        `anchor_strength: ${reproductionControl.anchor_strength}`,
        `denoise_strength: ${reproductionControl.denoise_strength}`,
        `composition_lock_strength: ${reproductionControl.composition_lock_strength}`,
        `silhouette_lock_strength: ${reproductionControl.silhouette_lock_strength}`,
        "Preserve the same front-on centered framing, same outline logic, same guard/body/tip proportion logic, and allow only micro-surface noise variation.",
        "",
      ]
    : [];

  const structuredPrompt = [
    "SUBJECT",
    `${subjectIdentity}. Weapon macro study. Sword first, material second. Visible blade read is mandatory.`,
    "",
    "GEOMETRY",
    "Straight engineered greatsword. Elongated linear form. Hard edge silhouette. Visible sword geometry. Clear blade planes and spine. No rounded industrial object ambiguity.",
    "",
    "MATERIAL",
    `${materialPrimary}. ${materialSurface}. ${materialFinish}. Forged metal read only. Industrial precision. No ceramic drift.`,
    "",
    "LIGHTING",
    "Hard directional industrial macro lighting. Controlled contrast to define edges, spine, blade planes, and heated core without abstract bloom.",
    "",
    "COMPOSITION",
    "Weapon macro framing. Blade-first readability. Macro close-up that preserves elongated sword geometry. Minimal dark industrial background. No sculpture ambiguity. No vessel, pod, or capsule read.",
    "",
    ...reproductionLines,
    "COLOR",
    "subtractive mineral color logic. low saturation, no neon. matte-first material response. shadow-dominant composition (70%). bokashi gradient, non-linear. no flat color, always material texture variation.",
    "",
    "QUALITY",
    "Ultra-detailed industrial weapon study. Crisp engineered edges. No abstract object read.",
  ].join("\n");

  const negativePrompt = dedupeStrings([
    "ceramic",
    "porcelain",
    "plastic",
    "rounded industrial object",
    "mask-like read",
    "abstract object read",
    "vessel",
    "pod",
    "capsule",
    "sculpture ambiguity",
    "soft rounded silhouette",
    "toy-like finish",
    "glossy plastic",
    "anime weapon",
    "metal noise",
    "red blur",
    ...forbiddenAnchors,
    ...toArray(laneLockedIntake.subject && laneLockedIntake.subject.must_not_have),
    ...toArray(laneLockedIntake.material && laneLockedIntake.material.forbidden_reads),
  ]).join(", ");

  const spec = {
    subject: subjectIdentity,
    texture: dedupeStrings([
      materialPrimary,
      materialSurface,
      materialFinish,
      "forged metal read",
      "hard edge silhouette",
      "visible sword geometry",
    ]),
    lighting: [
      "hard directional industrial macro lighting",
      "sword first, material second",
      "no ceramic drift",
    ],
    composition_rules: dedupeStrings([
      "weapon macro framing",
      "elongated linear form",
      "straight engineered greatsword",
      ...requiredAnchors,
    ]),
    negative_prompt: negativePrompt.split(",").map((item) => item.trim()).filter(Boolean),
    shot_type: "WEAPON_MACRO",
  };

  const payload = {
    prompt: structuredPrompt,
    negative_prompt: negativePrompt,
    seed: Number.isFinite(job.render && job.render.seed) ? job.render.seed : -1,
    width: Number(job.render && job.render.width) || 1280,
    height: Number(job.render && job.render.height) || 768,
    steps: Number.isFinite(job.render && job.render.steps) ? job.render.steps : -1,
    disable_refiner: !!(job.render && job.render.disable_refiner),
    performance_selection: (job.render && job.render.performance) || "Quality",
    style_selections: [],
    image_number: 1,
    async_process: false,
    metadata: {
      job_id: job.job_id,
      lane_rule_applied: laneRule ? laneRule.lane : null,
      generation_mode: reproductionControl.generation_mode,
      reference_master_used: reproductionControl.reference_master_used,
      reproduction_constraints_used: reproductionControl.reproduction_constraints_used,
      reproduction_anchor_mode: reproductionControl.reproduction_anchor_mode,
      anchor_image_path: reproductionControl.anchor_image_path,
      anchor_strength: reproductionControl.anchor_strength,
      denoise_strength: reproductionControl.denoise_strength,
      composition_lock_strength: reproductionControl.composition_lock_strength,
      silhouette_lock_strength: reproductionControl.silhouette_lock_strength,
      anchor_method_used: reproductionControl.anchor_method_used,
      anchor_image_used: reproductionControl.anchor_image_used,
      anchor_strength_used: reproductionControl.anchor_strength_used,
      denoise_strength_used: reproductionControl.denoise_strength_used,
      image_anchor_success_expected: reproductionControl.image_anchor_success_expected,
      preservation_mode: reproductionControl.preservation_mode,
      reconstruction_priority: reproductionControl.reconstruction_priority,
      prompt_weight_reduction_when_anchor_present: reproductionControl.prompt_weight_reduction_when_anchor_present,
    },
  };

  return applyColorCanonToSpec({
    job_id: job.job_id,
    phase_target: intakeRequest.phase,
    shot_type: "WEAPON_MACRO",
    spec,
    positivePrompt: structuredPrompt,
    negativePrompt,
    payload,
    structured_prompt: structuredPrompt,
    negative_prompt: negativePrompt,
    render_spec: {
      shot_type: "WEAPON_MACRO",
      lighting: "hard_directional_macro",
      background: "dark_industrial",
      priority: "weapon_identity",
      width: Number(job.render && job.render.width) || 1280,
      height: Number(job.render && job.render.height) || 768,
      performance: (job.render && job.render.performance) || "Quality",
    },
    scope_lock: dedupeStrings([
      ...toArray(intakeRequest.scope_lock),
      "weapon_lane",
      "weapon_only",
      "sword_first",
    ]),
    do_not_touch: dedupeStrings([
      ...toArray(intakeRequest.do_not_touch),
      ...forbiddenAnchors,
    ]),
    intake_summary:
      normalizeText(laneLockedIntake.direction_summary) ||
      "Weapon macro, sword-first, straight engineered greatsword, forged metal read only.",
    lane_rule_applied: laneRule ? laneRule.lane : null,
    lane_required_anchors: requiredAnchors,
    lane_forbidden_anchors: forbiddenAnchors,
    lane_priority_override_applied: !!(laneRule && laneRule.priority_override),
    generation_mode: reproductionControl.generation_mode,
    reference_master: reproductionControl.reference_master,
    reference_master_used: reproductionControl.reference_master_used,
    reproduction_constraints: reproductionControl.reproduction_constraints,
    reproduction_constraints_used: reproductionControl.reproduction_constraints_used,
    reproduction_anchor_mode: reproductionControl.reproduction_anchor_mode,
    anchor_image_path: reproductionControl.anchor_image_path,
    anchor_strength: reproductionControl.anchor_strength,
    denoise_strength: reproductionControl.denoise_strength,
    composition_lock_strength: reproductionControl.composition_lock_strength,
    silhouette_lock_strength: reproductionControl.silhouette_lock_strength,
    anchor_method_used: reproductionControl.anchor_method_used,
    anchor_image_used: reproductionControl.anchor_image_used,
    anchor_strength_used: reproductionControl.anchor_strength_used,
    denoise_strength_used: reproductionControl.denoise_strength_used,
    image_anchor_success_expected: reproductionControl.image_anchor_success_expected,
    preservation_mode: reproductionControl.preservation_mode,
    reconstruction_priority: reproductionControl.reconstruction_priority,
    prompt_weight_reduction_when_anchor_present: reproductionControl.prompt_weight_reduction_when_anchor_present,
    locked_prompt_package: {
      subject: subjectIdentity,
      texture: spec.texture,
      lighting: spec.lighting,
      composition_rules: spec.composition_rules,
      prompt: structuredPrompt,
      negative_prompt: negativePrompt,
      lane_rule_applied: laneRule ? laneRule.lane : null,
      lane_required_anchors: requiredAnchors,
      lane_forbidden_anchors: forbiddenAnchors,
      lane_priority_override_applied: !!(laneRule && laneRule.priority_override),
      generation_mode: reproductionControl.generation_mode,
      reference_master: reproductionControl.reference_master,
      reference_master_used: reproductionControl.reference_master_used,
      reproduction_constraints: reproductionControl.reproduction_constraints,
      reproduction_constraints_used: reproductionControl.reproduction_constraints_used,
      reproduction_anchor_mode: reproductionControl.reproduction_anchor_mode,
      anchor_image_path: reproductionControl.anchor_image_path,
      anchor_strength: reproductionControl.anchor_strength,
      denoise_strength: reproductionControl.denoise_strength,
      composition_lock_strength: reproductionControl.composition_lock_strength,
      silhouette_lock_strength: reproductionControl.silhouette_lock_strength,
      anchor_method_used: reproductionControl.anchor_method_used,
      anchor_image_used: reproductionControl.anchor_image_used,
      anchor_strength_used: reproductionControl.anchor_strength_used,
      denoise_strength_used: reproductionControl.denoise_strength_used,
      image_anchor_success_expected: reproductionControl.image_anchor_success_expected,
    },
  }, laneLockedIntake);
}

function buildPromptPackageFromIntake(job, intakeRequest, geminiIntake) {
  const shotType = normalizeLaneShotType(
    (geminiIntake && geminiIntake.composition && geminiIntake.composition.shot_type) ||
    intakeRequest.shot_type ||
    job.shot_type
  );
  if (shotType === "WEAPON_MACRO") {
    return buildWeaponPromptPackage(job, intakeRequest, geminiIntake);
  }
  if (intakeRequest.phase === "material_study") {
    return buildMaterialPromptPackage(job, intakeRequest, geminiIntake);
  }
  return buildMaterialPromptPackage(job, intakeRequest, geminiIntake);
}

module.exports = {
  buildPromptPackageFromIntake,
};
