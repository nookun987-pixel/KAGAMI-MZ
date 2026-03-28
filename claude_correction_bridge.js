"use strict";

function dedupe(list) {
  return [...new Set((list || []).filter(Boolean))];
}

function stripPreviousCorrectionBlocks(text) {
  const raw = String(text || "");
  if (!raw.trim()) return raw;
  return raw
    .replace(/\n{0,2}CORRECTION LOCK[\s\S]*$/m, "")
    .replace(/\n{0,2}EMERGENCY ESCALATION LOCK[\s\S]*$/m, "")
    .trim();
}

function buildCorrectedPromptPackage(promptPackage, fixBrief) {
  const escalationLevel = String(fixBrief.escalation_level || "LOW").toUpperCase();
  const basePrompt = stripPreviousCorrectionBlocks(promptPackage.structured_prompt || "");
  const baseNegativePrompt = String(promptPackage.negative_prompt || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const ruleSpecificLines = dedupe(
    (fixBrief.rule_specific_corrections || []).flatMap((entry) => [
      ...((entry && entry.increase) || []),
      entry && entry.operator,
    ])
  );
  const addedConstraintLines = dedupe([
    "single clear subject",
    "commercial product readability under 1 second",
    "real matte B4C ceramic read",
    "no abstract surface study",
    "no sculpture/plaster/mineral/carved rock read",
    "no macro crop that destroys object identity",
    "no texture-only frame",
    "object silhouette must be explicit",
    "Read as engineered matte B4C ceramic, not plaster, not gypsum, not chalk, not carved stone.",
    "Surface must stay dry, dense, controlled, and non-porous.",
    "Microtexture must remain eggshell-fine, not layered, not striated, not sedimentary.",
    "Cracks must stay sparse, hairline, and premium.",
    ...(fixBrief.required_reads_to_strengthen || []),
    ...(fixBrief.increase_signals || []),
    ...(fixBrief.must_increase || []),
    ...ruleSpecificLines,
    fixBrief.auto_append_material_lock,
    fixBrief.auto_append_abstract_lock,
    ...((fixBrief.hard_recovery_prompt_additions || [])),
    fixBrief.escalation_stage === "SIMPLIFY_BACKGROUND_AND_ATMOSPHERE"
      ? "simplify background, remove fog, particles, decorative atmosphere, and cinematic haze"
      : null,
    fixBrief.escalation_stage === "FORCE_PRODUCT_COMPOSITION"
      ? "force product-photo composition with centered subject dominance and unmistakable manufactured object readability"
      : null,
    escalationLevel !== "LOW" ? "hard lock palette discipline, no ambient color wash, no decorative color noise" : null,
    escalationLevel !== "LOW" ? "if the frame starts to become abstract, force explicit manufactured object boundaries and readable product form" : null,
    escalationLevel === "HIGH" ? "no characterless noise field, no non-object composition, no decorative abstract texture" : null,
    escalationLevel === "HIGH" ? "preserve only canon-compliant ceramic object reads; discard previous ambiguous visual traits completely" : null,
  ]);
  const correctionSections = [
    "CORRECTION LOCK",
    ...addedConstraintLines,
  ];
  const correctedPrompt = [
    basePrompt,
    "",
    ...correctionSections,
  ].join("\n");

  const correctedNegativePrompt = dedupe([
    ...baseNegativePrompt,
    ...(fixBrief.negative_reinforcements || []),
    ...(fixBrief.decrease_signals || []),
    ...(fixBrief.forbidden_reads_to_eliminate || []),
    ...(fixBrief.do_not_preserve_from_previous_attempt || []),
    ...(fixBrief.must_decrease || []),
    ...((fixBrief.hard_recovery_negative_additions || [])),
    fixBrief.escalation_stage === "SIMPLIFY_BACKGROUND_AND_ATMOSPHERE"
      ? "fog, smoke, particles, cinematic haze, decorative atmosphere"
      : null,
    fixBrief.escalation_stage === "FORCE_PRODUCT_COMPOSITION"
      ? "off-center composition, partial crop, abstract crop, weak contour, subject ambiguity"
      : null,
    escalationLevel !== "LOW" ? "ambient color noise" : null,
    escalationLevel !== "LOW" ? "abstract digital noise" : null,
    escalationLevel === "HIGH" ? "purple noise field" : null,
    escalationLevel === "HIGH" ? "non-object image" : null,
  ]).join(", ");

  return {
    corrected_prompt: correctedPrompt,
    corrected_negative_prompt: correctedNegativePrompt,
    corrected_render_spec: {
      ...(promptPackage.render_spec || {}),
      priority: "material_readability",
      disable_refiner: escalationLevel !== "LOW",
      steps: escalationLevel === "HIGH" ? 32 : escalationLevel === "MEDIUM" ? 24 : (promptPackage.render_spec || {}).steps,
    },
    correction_summary: fixBrief.primary_failure,
    scope_lock: ["material_only"],
    substantive_constraints_added: addedConstraintLines,
    locked_prompt_package: {
      ...(promptPackage.locked_prompt_package || {}),
      prompt: correctedPrompt,
      negative_prompt: correctedNegativePrompt,
      composition_rules: dedupe([
        ...((promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.composition_rules) || []),
        "material purity emphasis",
        "single clear subject",
        "commercial product readability under 1 second",
        "full object visibility",
        "centered subject",
        "clean silhouette",
        "plain brutalist background",
        ...(fixBrief.subject_recovery_mode ? [
          "manufactured object clearly readable",
          "hard contour evidence",
          "no abstract frame",
          "no atmospheric-only image",
        ] : []),
        ...(fixBrief.escalation_stage === "SIMPLIFY_BACKGROUND_AND_ATMOSPHERE" ? [
          "reduce atmosphere and background complexity",
          "remove fog, particles, and decorative bloom",
        ] : []),
        ...(fixBrief.escalation_stage === "FORCE_PRODUCT_COMPOSITION" ? [
          "product-photo composition",
          "compositionally dominant subject",
          "subject isolated from background",
        ] : []),
        ...(escalationLevel !== "LOW" ? ["explicit product boundaries", "no ambiguous object read"] : []),
      ]),
      texture: dedupe([
        ...((promptPackage.locked_prompt_package && promptPackage.locked_prompt_package.texture) || []),
        "dry dense engineered ceramic",
        "sparse hairline micro-cracks only",
        "zero plaster or carved stone read",
        "explicit manufactured product geometry",
        "premium industrial product photo",
        ...(escalationLevel !== "LOW" ? ["zero plastic/gloss/PVC/toy read"] : []),
        ...(fixBrief.subject_recovery_mode ? [
          "visible edge, rim, bevel, curve, seam, or manufactured contour",
          "engineered surface finish",
          "manufactured precision",
        ] : []),
        ...(fixBrief.must_increase || []),
      ]),
    },
  };
}

module.exports = {
  buildCorrectedPromptPackage,
};
