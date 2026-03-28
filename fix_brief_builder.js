"use strict";

const SUBJECT_RECOVERY_TAGS = {
  SUBJECT_ABSENT: "SUBJECT_ABSENT",
  MATERIAL_ABSENT: "MATERIAL_ABSENT",
  ABSTRACT_FRAME: "ABSTRACT_FRAME",
  NO_MANUFACTURED_OBJECT_READ: "NO_MANUFACTURED_OBJECT_READ",
};

const RULE_CORRECTION_MAP = {
  T5: {
    label: "silhouette/readability drift",
    increase: [
      "centered dominant product object",
      "full object visibility",
      "explicit outer contour",
      "clean negative space around silhouette",
    ],
    decrease: [
      "partial crop",
      "edge loss",
      "busy composition",
      "texture-only framing",
    ],
    operator: "T5: make the object read instantly as one complete manufactured form with hard boundaries and clean surrounding space.",
  },
  T6: {
    label: "material fidelity drift",
    increase: [
      "dense matte ceramic shell",
      "dry non-porous eggshell microtexture",
      "sparse premium hairline fractures",
      "engineered ceramic hardness",
    ],
    decrease: [
      "painted panel look",
      "smooth laminate finish",
      "plaster softness",
      "plastic sheen",
    ],
    operator: "T6: push the shell toward hard engineered ceramic, not painted panel, plaster, laminate, or any soft cosmetic surface.",
  },
  T11: {
    label: "Mikage tone drift",
    increase: [
      "sacred brutalist discipline",
      "cold restrained luxury",
      "minimal industrial severity",
      "canon-specific atmosphere",
    ],
    decrease: [
      "generic product studio vibe",
      "fashion-soft mood",
      "decorative styling noise",
      "non-canon ambience",
    ],
    operator: "T11: restore Mikage sacred-tech austerity and remove generic commercial or decorative styling cues.",
  },
  T12: {
    label: "identity/shape drift",
    increase: [
      "controlled Mikage geometry",
      "precise designed form language",
      "symmetry and engineered discipline",
      "non-organic hard-surface read",
    ],
    decrease: [
      "organic face cues",
      "rounded toy form",
      "casual asymmetry",
      "ambiguous identity cues",
    ],
    operator: "T12: tighten canonical form language so the image feels intentionally designed, symmetrical, and unmistakably Mikage.",
  },
};

function hasPattern(values, pattern) {
  return (values || []).some((item) => pattern.test(String(item || "")));
}

function deriveRecoveryTags(localFailed, geminiFailed, wrongReads) {
  const source = [
    ...(localFailed || []),
    ...(geminiFailed || []),
    ...(wrongReads || []),
  ].map((item) => String(item || ""));
  const tags = [];

  if (
    hasPattern(source, /subject material.*absent|subject.*entirely absent|subject absent|no subject|missing subject/i)
  ) {
    tags.push(SUBJECT_RECOVERY_TAGS.SUBJECT_ABSENT);
  }
  if (
    hasPattern(source, /does not depict.*white ceramic material|material absent|absent ceramic|no ceramic|material.*missing/i)
  ) {
    tags.push(SUBJECT_RECOVERY_TAGS.MATERIAL_ABSENT);
  }
  if (
    hasPattern(source, /abstract|noise field|pixelated texture|ambiguous object|texture study|material swatch|fragmented form/i)
  ) {
    tags.push(SUBJECT_RECOVERY_TAGS.ABSTRACT_FRAME);
  }
  if (
    hasPattern(source, /plaster|gypsum|chalk|stone|mineral|wall|slab|concrete|porous masonry|manufactured object.*absent/i)
  ) {
    tags.push(SUBJECT_RECOVERY_TAGS.NO_MANUFACTURED_OBJECT_READ);
  }

  return [...new Set(tags)];
}

function countConsecutiveRecoveryTag(trace, tag) {
  let count = 0;
  for (let i = (trace || []).length - 1; i >= 0; i -= 1) {
    const entry = trace[i];
    const tags = Array.isArray(entry && entry.recovery_tags) ? entry.recovery_tags : [];
    if (!tags.includes(tag)) {
      break;
    }
    count += 1;
  }
  return count;
}

function buildFixBrief(job, localValidation, geminiValidation, promptPackage, phaseContext) {
  const trace = phaseContext && Array.isArray(phaseContext.previous_trace) ? phaseContext.previous_trace : [];
  const attempt = Number(phaseContext && phaseContext.attempt ? phaseContext.attempt : trace.length + 1);
  const wrongReads = [
    ...(geminiValidation && Array.isArray(geminiValidation.wrong_reads) ? geminiValidation.wrong_reads : []),
  ];
  const localFailed = localValidation && localValidation.rule_engine ? localValidation.rule_engine.failed_rules : [];
  const geminiFailed = geminiValidation && Array.isArray(geminiValidation.fail_rules) ? geminiValidation.fail_rules : [];
  const currentFailRules = [...localFailed, ...geminiFailed].map((item) => String(item || "").trim()).filter(Boolean);
  const previousFailRules = trace.flatMap((entry) => Array.isArray(entry.fail_rules) ? entry.fail_rules : []);
  const repeatedFailures = [...new Set(currentFailRules.filter((rule) => previousFailRules.includes(rule)))];
  const repeatedCanonHardFails = repeatedFailures.filter((rule) => RULE_CORRECTION_MAP[rule]);
  const canonHardFails = currentFailRules.filter((rule) => RULE_CORRECTION_MAP[rule]);
  const recoveryTags = deriveRecoveryTags(localFailed, geminiFailed, wrongReads);
  const combinedSignals = [
    ...wrongReads,
    ...localFailed,
    ...geminiFailed,
  ].map((item) => String(item || "").toLowerCase());
  const hasMaterialDrift = combinedSignals.some((item) =>
    item.includes("material") ||
    item.includes("ceramic") ||
    item.includes("plaster") ||
    item.includes("gypsum") ||
    item.includes("chalk") ||
    item.includes("stone") ||
    item.includes("mineral") ||
    item.includes("toy") ||
    item.includes("plastic") ||
    item.includes("pvc")
  );
  const hasAbstractDrift = combinedSignals.some((item) =>
    item.includes("abstract") ||
    item.includes("pattern") ||
    item.includes("texture study") ||
    item.includes("swatch") ||
    item.includes("macro") ||
    item.includes("fragment") ||
    item.includes("ambiguous")
  );
  const primaryFailure =
    wrongReads[0] ||
    (localFailed && localFailed[0]) ||
    "material drift";
  const consecutiveSubjectAbsent = countConsecutiveRecoveryTag(trace, SUBJECT_RECOVERY_TAGS.SUBJECT_ABSENT) + (recoveryTags.includes(SUBJECT_RECOVERY_TAGS.SUBJECT_ABSENT) ? 1 : 0);
  const forbiddenReadsToEliminate = [
    ...wrongReads,
    ...geminiFailed.filter((item) => /glossy|plastic|pvc|toy|abstract|plaster|mineral|chalk|stone|noise|mosaic/i.test(String(item || ""))),
  ];
  const requiredReadsToStrengthen = [];
  if (currentFailRules.some((item) => /T3|material|ceramic|porcelain|engineered/i.test(String(item)))) {
    requiredReadsToStrengthen.push(
      "matte B4C technical ceramic",
      "porcelain-white #FAFAFA",
      "dry dense engineered read",
      "eggshell microtexture",
      "sparse fine hairline cracking"
    );
  }
  if (currentFailRules.some((item) => /T5|T6|T7|T8|shape|silhouette|readability/i.test(String(item)))) {
    requiredReadsToStrengthen.push(
      "single clear subject",
      "full object visibility",
      "clean silhouette",
      "commercial readability under 1 second",
      "controlled geometry with explicit edges"
    );
  }
  if (currentFailRules.some((item) => /T11|T12|canon|identity|tone/i.test(String(item)))) {
    requiredReadsToStrengthen.push(
      "premium industrial product photo",
      "plain brutalist background",
      "no abstract composition",
      "no decorative noise",
      "no partial crop"
    );
  }
  const increaseSignals = [...new Set(requiredReadsToStrengthen)];
  const decreaseSignals = [...new Set([
    ...forbiddenReadsToEliminate,
    ...geminiFailed.filter((item) => /abstract|pattern|noise|macro|crop|fragment|ambiguous/i.test(String(item || ""))),
  ])];
  const doNotPreserve = [];
  if (hasAbstractDrift) {
    doNotPreserve.push("abstract patterning", "texture-only frame", "fragmented composition", "macro-only crop");
  }
  if (hasMaterialDrift) {
    doNotPreserve.push("plaster-like surface", "stone/mineral resemblance", "plastic gloss cues");
  }
  const ruleSpecificCorrections = canonHardFails.map((rule) => ({
    rule,
    label: RULE_CORRECTION_MAP[rule].label,
    increase: RULE_CORRECTION_MAP[rule].increase,
    decrease: RULE_CORRECTION_MAP[rule].decrease,
    operator: RULE_CORRECTION_MAP[rule].operator,
  }));
  const operatorGuidance = [...new Set(ruleSpecificCorrections.map((entry) => entry.operator))];
  const mustIncrease = [...new Set(ruleSpecificCorrections.flatMap((entry) => entry.increase))];
  const mustDecrease = [...new Set(ruleSpecificCorrections.flatMap((entry) => entry.decrease))];
  if (recoveryTags.includes(SUBJECT_RECOVERY_TAGS.SUBJECT_ABSENT)) {
    mustIncrease.push(
      "single clearly visible subject",
      "subject must occupy clear central frame presence",
      "manufactured object clearly readable",
      "hard contour evidence",
      "compositionally dominant subject"
    );
    mustDecrease.push(
      "empty scene",
      "subject cropped away",
      "atmospheric-only image",
      "decorative light bloom",
      "blurred atmosphere"
    );
    operatorGuidance.push("Subject absence: force one dominant subject with central presence and readable object boundaries.");
  }
  if (recoveryTags.includes(SUBJECT_RECOVERY_TAGS.MATERIAL_ABSENT)) {
    mustIncrease.push(
      "single clearly readable manufactured ceramic object",
      "visible edges, contour, curvature",
      "product-photo readability",
      "subject isolated from background"
    );
    mustDecrease.push(
      "wall texture",
      "plaster slab",
      "mineral rock",
      "marble wall",
      "ambiguous surface"
    );
    operatorGuidance.push("Material absence: show a manufactured ceramic object, not a flat field or random wall texture.");
  }
  if (recoveryTags.includes(SUBJECT_RECOVERY_TAGS.ABSTRACT_FRAME)) {
    mustIncrease.push(
      "full object visibility",
      "explicit manufactured object boundaries",
      "plain brutalist background",
      "clean silhouette"
    );
    mustDecrease.push(
      "abstract composition",
      "noise field",
      "experimental composition",
      "fragmented form"
    );
    operatorGuidance.push("Abstract frame: collapse scene complexity and force explicit product-object readability.");
  }
  if (recoveryTags.includes(SUBJECT_RECOVERY_TAGS.NO_MANUFACTURED_OBJECT_READ)) {
    mustIncrease.push(
      "visible edge, rim, bevel, curve, seam, or manufactured contour",
      "engineered surface finish",
      "manufactured precision"
    );
    mustDecrease.push(
      "flat texture field",
      "random wall surface",
      "stone slab read"
    );
    operatorGuidance.push("Need manufactured contour evidence, not flat texture field.");
  }
  const ruleDrivenDoNotPreserve = [...new Set([
    ...doNotPreserve,
    ...mustDecrease,
  ])];
  const escalationLevel = repeatedFailures.length >= 3 || attempt >= 3 ? "HIGH" : repeatedFailures.length > 0 || attempt >= 2 ? "MEDIUM" : "LOW";

  return {
    job_id: job.job_id,
    target_phase: "material_only",
    attempt,
    escalation_level: escalationLevel,
    primary_failure: primaryFailure,
    dominant_fail_reason: recoveryTags.length ? recoveryTags[0] : primaryFailure,
    repeated_failures: repeatedFailures,
    repeated_canon_hard_fails: repeatedCanonHardFails,
    recovery_tags: recoveryTags,
    subject_recovery_mode: recoveryTags.includes(SUBJECT_RECOVERY_TAGS.SUBJECT_ABSENT) || recoveryTags.includes(SUBJECT_RECOVERY_TAGS.MATERIAL_ABSENT) || recoveryTags.includes(SUBJECT_RECOVERY_TAGS.ABSTRACT_FRAME) || recoveryTags.includes(SUBJECT_RECOVERY_TAGS.NO_MANUFACTURED_OBJECT_READ),
    subject_absent_consecutive_count: consecutiveSubjectAbsent,
    wrong_reads: wrongReads,
    forbidden_reads_to_eliminate: [...new Set(forbiddenReadsToEliminate)],
    required_reads_to_strengthen: increaseSignals,
    increase_signals: increaseSignals,
    decrease_signals: decreaseSignals,
    do_not_preserve_from_previous_attempt: ruleDrivenDoNotPreserve,
    rule_specific_corrections: ruleSpecificCorrections,
    operator_guidance: operatorGuidance,
    must_increase: mustIncrease,
    must_decrease: mustDecrease,
    corrective_goal: "1-look premium matte B4C ceramic read",
    required_shifts: [
      "increase engineered dense ceramic read",
      "reduce plaster and carved mineral resemblance",
      "tighten controlled eggshell microtexture",
      "keep cracks sparse and hairline only",
      "single clear subject",
      "commercial product readability under 1 second",
      "object silhouette must be explicit",
      "no texture-only frame",
      ...mustIncrease,
    ],
    negative_reinforcements: [
      "plaster",
      "gypsum",
      "chalk",
      "concrete",
      "carved stone",
      "mineral banding",
      "striated grooves",
      "powdery porous masonry",
      "glossy plastic",
      "PVC sheen",
      "toy-like finish",
      "abstract",
      "texture study",
      "material swatch",
      "stone artifact",
      "mineral slab",
      "experimental composition",
      "extreme close-up",
      "ambiguous object",
      "fragmented form",
      ...mustDecrease,
    ],
    lighting_adjustments: [
      "keep low-key directional lighting",
      "avoid ambient wash",
      "use shadow to separate grain from grooves",
    ],
    surface_adjustments: [
      "dry dense non-porous ceramic",
      "eggshell microtexture only",
      "no sedimentary layering",
      "no sculpted carving read",
    ],
    auto_append_material_lock: hasMaterialDrift
      ? "engineered ceramic product object, clearly manufactured, controlled geometry, explicit edges, premium industrial product photo"
      : null,
    auto_append_abstract_lock: hasAbstractDrift
      ? "full object visibility, centered subject, clean silhouette, plain brutalist background, no partial crop, no macro-only composition"
      : null,
    hard_recovery_prompt_additions: recoveryTags.length > 0 ? [
      "single clearly readable manufactured ceramic object",
      "visible edges, contour, curvature",
      "product-photo readability",
      "subject isolated from background",
      "no abstraction",
      "no ambiguous surface",
    ] : [],
    hard_recovery_negative_additions: recoveryTags.length > 0 ? [
      "abstract composition",
      "empty scene",
      "wall texture",
      "plaster slab",
      "mineral rock",
      "marble wall",
      "blurred atmosphere",
      "fog-only frame",
      "noise field",
      "decorative light bloom",
      "subject cropped away",
      "unrecognizable object",
    ] : [],
    escalation_stage:
      consecutiveSubjectAbsent >= 3 ? "FORCE_PRODUCT_COMPOSITION" :
      consecutiveSubjectAbsent === 2 ? "SIMPLIFY_BACKGROUND_AND_ATMOSPHERE" :
      consecutiveSubjectAbsent === 1 ? "ADD_SUBJECT_LOCK" :
      "BASE",
    retry_escalation: repeatedFailures.length > 0
      ? [
          "harden negative locks tied to repeated failures",
          "increase required reads tied to repeated failures",
          "do not preserve drift traits from previous attempt",
          ...operatorGuidance,
        ]
      : [],
    do_not_touch: phaseContext && Array.isArray(phaseContext.do_not_touch) ? phaseContext.do_not_touch : [],
    source_fail_rules: localFailed,
  };
}

module.exports = {
  buildFixBrief,
};
