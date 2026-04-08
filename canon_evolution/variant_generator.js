"use strict";

function mapAxisToPrompt(axis, value) {
  const promptMap = {
    silhouette_variant: {
      anchor: [],
      brow_guard_delta: ["slightly reinforced brow guard within locked silhouette grammar"],
      jaw_vent_delta: ["slightly emphasized jaw vent geometry within locked silhouette grammar"],
      cheek_notch_delta: ["slightly notched cheek planes within locked silhouette grammar"],
    },
    wear_level: {
      low: ["controlled low wear ceramic surface"],
      medium: ["moderate wear concentration on exposed ceramic surfaces"],
      high: ["heavier wear concentration on exposed ceramic surfaces"],
    },
    microtexture_profile: {
      fine_pitting: ["fine ceramic micro-pitting across major surfaces"],
      striated_erosion: ["subtle striated erosion traces across ceramic shell"],
      sintered_grain: ["sintered grain microtexture across ceramic shell"],
    },
    seam_intensity: {
      minimal: ["minimal seam visibility within locked structural design"],
      visible: ["visible seam logic within locked structural design"],
      pronounced: ["pronounced seam articulation within locked structural design"],
    },
    asymmetry_tolerance: {
      tight: ["tight symmetry bias with only slight asymmetry tolerance"],
      balanced: ["balanced asymmetry within manufacturable tolerance"],
      expressive: ["expressive asymmetry within manufacturable tolerance"],
    },
  };
  return promptMap[axis] && promptMap[axis][value] ? promptMap[axis][value] : [];
}

function mapAxisToDifference(axis, value) {
  return `${axis}:${value}`;
}

function getFamilyGuardrails(variantSlot) {
  const commonPositive = [
    "single hero artifact only",
    "one frontal mask only",
    "one manufactured subject readable at first glance",
    "subject occupies dominant frame area",
    "clear subject separation from background",
    "obsidian void background",
    "technical ceramic B4C material read",
  ];
  const commonNegative = [
    "multiple masks",
    "extra view panels",
    "alternate angle inserts",
    "secondary miniatures",
    "contact sheet layout",
    "sculptural cluster",
    "small background masks",
    "split composition board",
  ];

  const familyMap = {
    A: {
      positive: [
        "anchor silhouette only with no branching beyond lock",
      ],
      negative: [],
    },
    B: {
      positive: [
        "controlled brow guard variation only",
        "keep central single-mask presentation",
        "preserve exact core silhouette while reinforcing brow guard",
        "standalone mounted mask artifact only",
        "no wearer and no human presence",
      ],
      negative: [
        "mask cluster",
        "secondary masks",
        "multi-mask composition",
        "human wearer",
        "human face",
        "portrait photo",
        "skin integration",
        "fashion editorial",
        "person wearing mask",
      ],
    },
    C: {
      positive: [
        "controlled jaw vent variation only",
        "retain exact core silhouette while increasing sintered grain",
        "single dominant mask with no auxiliary views",
      ],
      negative: [
        "organic lattice drift",
        "extra lattice subviews",
        "auxiliary side renders",
      ],
    },
  };

  const family = familyMap[variantSlot] || { positive: [], negative: [] };
  return {
    positive: commonPositive.concat(family.positive),
    negative: commonNegative.concat(family.negative),
  };
}

function generateVariantSpec(context = {}) {
  const dnaLockPacket = context.dnaLockPacket || {};
  const variationEnvelope = context.variationEnvelope || {};
  const axes = variationEnvelope.bounded_axes || {};
  const variantFamily = context.variantFamily || context.renderMode || "HERO_LOCK";
  const variantSlot = variationEnvelope.variant_slot || "A";
  const baseDnaId = dnaLockPacket.dna_id || "DNA_UNKNOWN";
  const variantId = `${baseDnaId}_${variantFamily}_${variantSlot}`;

  const selectedAxes = {
    silhouette_variant: axes.silhouette_variant && axes.silhouette_variant.selected || "anchor",
    wear_level: axes.wear_level && axes.wear_level.selected || "low",
    microtexture_profile: axes.microtexture_profile && axes.microtexture_profile.selected || "fine_pitting",
    seam_intensity: axes.seam_intensity && axes.seam_intensity.selected || "minimal",
    asymmetry_tolerance: axes.asymmetry_tolerance && axes.asymmetry_tolerance.selected || "tight",
  };

  const allowedDifferences = Object.entries(selectedAxes).map(([axis, value]) => mapAxisToDifference(axis, value));
  const promptPatches = Object.entries(selectedAxes).flatMap(([axis, value]) => mapAxisToPrompt(axis, value));
  const familyGuardrails = getFamilyGuardrails(variantSlot);

  return {
    variant_id: variantId,
    variant_family: variantFamily,
    variant_slot: variantSlot,
    base_dna_id: baseDnaId,
    allowed_axes: selectedAxes,
    allowed_differences: allowedDifferences,
    prompt_controls: {
      positive_additions: familyGuardrails.positive.concat(promptPatches),
      negative_additions: familyGuardrails.negative.concat(dnaLockPacket.hard_forbidden_traits || []),
    },
  };
}

module.exports = {
  generateVariantSpec,
};
