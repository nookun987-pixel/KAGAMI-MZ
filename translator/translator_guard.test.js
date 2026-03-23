/**
 * MIKAGE — /translator/translator_guard.test.js
 * Run: node translator/translator_guard.test.js
 */

"use strict";

const {
  validateTranslation,
  checkNoAddedConcepts,
  checkNoToneShift,
  checkNoPersonaCreation,
  checkNoNarrativeBreak,
  checkNoForbiddenInPositive,
  checkNegativePreserved,
  checkOutputStructure,
  buildStricterInput,
  TONE_SHIFT_MARKERS,
  PERSONA_MARKERS,
  STRUCTURAL_ADDITIONS,
} = require("./translator_guard");

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, label) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(label);
    console.error(`  FAIL: ${label}`);
  }
}

// ===================================================================
// Test fixtures
// ===================================================================

const VALID_INPUT_SPEC = {
  subject: "Mikage Zenith, fully mechanical humanoid, strict hard-surface anatomy, " +
    "zero organic influence, full porcelain faceless cybernetic helmet, void black " +
    "optical sensors, narrow straight eye slits, Zenith Blade visible, massive heavy " +
    "industrial straight sword, dark rusty titanium, crimson heated core",
  lighting: [
    "low-key directional light from above 45 degrees",
    "chiaroscuro contrast ratio 4:1",
    "minimal fill — protect Ma negative space",
    "thin rim light only — accent Shinogi edges",
    "subsurface scattering on B4C ceramic",
  ],
  texture: [
    "micro-cracks matte B4C ceramic with wear",
    "gold kintsugi seams with crimson internal glow",
    "heat-warped carbon fiber matte hex thermal stress",
    "charred wood grain environmental",
  ],
  composition_rules: [
    "negative space >= 40%",
    "off-center subject max 30% frame",
    "broken symmetry",
    "wide establishing 2.76:1",
    "1+ micro-humanity motif",
  ],
  negative_prompt: [
    "perfect symmetry", "plastic skin", "glossy luxury finish",
    "anime", "organic softness", "curved blade",
    "fantasy ornament overload", "greebling clutter",
    "bloom effects", "magic effects",
  ],
};

// A GOOD translation — faithful to input, no additions
const GOOD_OUTPUT = {
  positive_prompt: "Mikage Zenith, fully mechanical humanoid, strict hard-surface anatomy, " +
    "zero organic influence, full porcelain faceless cybernetic helmet with void black " +
    "optical sensors, narrow straight eye slits, massive heavy industrial straight sword, " +
    "dark rusty titanium scrap, crimson heated core, low-key directional light from above " +
    "45 degrees, chiaroscuro contrast 4:1, minimal fill light, thin rim light, subsurface " +
    "scattering on matte B4C ceramic, micro-cracks with gold kintsugi seams, crimson " +
    "internal glow, heat-warped carbon fiber hex texture, charred wood grain background, " +
    "negative space composition, off-center subject, broken symmetry, wide 2.76:1 " +
    "anamorphic framing, film grain, photorealistic hard sci-fi",
  negative_prompt: "perfect symmetry, plastic skin, glossy luxury finish, anime, " +
    "organic softness, curved blade, fantasy ornament overload, greebling clutter, " +
    "bloom effects, magic effects",
  technical_notes: ["preserve negative space", "avoid centered symmetry"],
};

// ===================================================================
console.log("\n=== GUARD DATA INTEGRITY ===");
// ===================================================================

assert(TONE_SHIFT_MARKERS.length > 20, `Tone markers: ${TONE_SHIFT_MARKERS.length}`);
assert(PERSONA_MARKERS.length > 10, `Persona markers: ${PERSONA_MARKERS.length}`);
assert(STRUCTURAL_ADDITIONS.length > 10, `Structural markers: ${STRUCTURAL_ADDITIONS.length}`);
assert(Object.isFrozen(TONE_SHIFT_MARKERS), "Tone markers frozen");
assert(Object.isFrozen(PERSONA_MARKERS), "Persona markers frozen");

// ===================================================================
console.log("\n=== GOOD TRANSLATION → PASS ===");
// ===================================================================

{
  const result = validateTranslation(VALID_INPUT_SPEC, GOOD_OUTPUT);
  assert(result.valid === true, "Good translation passes");
  assert(result.verdict === "PASS", "Verdict is PASS");
  assert(result.violations.length === 0, "No violations");
  assert(result.summary.length === 0, "No summary entries");
}

// ===================================================================
console.log("\n=== TONE SHIFT → REJECT ===");
// ===================================================================

{
  const badOutput = {
    ...GOOD_OUTPUT,
    positive_prompt: GOOD_OUTPUT.positive_prompt +
      ", beautiful ethereal goddess, stunning breathtaking divine presence, " +
      "gorgeous magnificent masterwork",
  };
  const result = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(result.valid === false, "Tone shift detected");
  assert(result.verdict === "REJECT", "Verdict is REJECT");
  assert(
    result.violations.some((v) => v.check === "no_tone_shift"),
    "Tone shift check failed"
  );
  assert(result.summary.some((s) => s.includes("TONE_SHIFT")), "Summary mentions tone shift");
}

// ===================================================================
console.log("\n=== PERSONA CREATION → REJECT ===");
// ===================================================================

{
  const badOutput = {
    ...GOOD_OUTPUT,
    positive_prompt: GOOD_OUTPUT.positive_prompt +
      ", she feels the weight of centuries, the warrior goddess dreams of freedom, " +
      "with a smile hidden behind the mask, tears in her void eyes",
  };
  const result = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(result.valid === false, "Persona creation detected");
  assert(
    result.violations.some((v) => v.check === "no_persona_creation"),
    "Persona check failed"
  );
  assert(result.summary.some((s) => s.includes("PERSONA")), "Summary mentions persona");
}

// ===================================================================
console.log("\n=== NARRATIVE BREAK → REJECT ===");
// ===================================================================

{
  const badOutput = {
    ...GOOD_OUTPUT,
    positive_prompt: GOOD_OUTPUT.positive_prompt +
      ", scene: the aftermath of battle, camera slowly pans across destruction, " +
      "inspired by Blade Runner 2049, fade to black ending",
  };
  const result = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(result.valid === false, "Narrative break detected");
  assert(
    result.violations.some((v) => v.check === "no_narrative_break"),
    "Narrative check failed"
  );
  assert(result.summary.some((s) => s.includes("NARRATIVE")), "Summary mentions narrative");
}

// ===================================================================
console.log("\n=== CANON FORBIDDEN IN POSITIVE → REJECT ===");
// ===================================================================

{
  const badOutput = {
    ...GOOD_OUTPUT,
    positive_prompt: GOOD_OUTPUT.positive_prompt +
      ", anime style eyes, magic effects swirling, sexy waifu pose",
  };
  const result = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(result.valid === false, "Forbidden in positive detected");
  assert(
    result.violations.some((v) => v.check === "no_forbidden_in_positive"),
    "Forbidden check failed"
  );
  assert(result.summary.some((s) => s.includes("FORBIDDEN")), "Summary mentions forbidden");
}

// ===================================================================
console.log("\n=== NEGATIVE PROMPT DROPPED → REJECT ===");
// ===================================================================

{
  const badOutput = {
    ...GOOD_OUTPUT,
    negative_prompt: "bad quality, blurry",  // dropped all Canon negatives
  };
  const result = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(result.valid === false, "Dropped negatives detected");
  assert(
    result.violations.some((v) => v.check === "negative_preserved"),
    "Negative preservation check failed"
  );
  assert(result.summary.some((s) => s.includes("NEG_DROP")), "Summary mentions dropped negatives");
}

// ===================================================================
console.log("\n=== NEGATIVE PROMPT MOSTLY PRESERVED → PASS ===");
// ===================================================================

{
  // Keep 9/10 negatives (90% > 80% threshold)
  const okOutput = {
    ...GOOD_OUTPUT,
    negative_prompt: "perfect symmetry, plastic skin, glossy luxury finish, anime, " +
      "organic softness, curved blade, fantasy ornament overload, greebling clutter, " +
      "bloom effects",  // dropped "magic effects" only — 90% preserved
  };
  const c = checkNegativePreserved(VALID_INPUT_SPEC, okOutput);
  assert(c.passed === true, "90% preserved passes threshold");
  assert(c.preservationRate >= 0.80, `Rate: ${c.preservationRate}`);
}

// ===================================================================
console.log("\n=== OUTPUT STRUCTURE — MISSING FIELDS ===");
// ===================================================================

{
  const c1 = checkOutputStructure(null);
  assert(c1.passed === false, "Null output fails structure");

  const c2 = checkOutputStructure({});
  assert(c2.passed === false, "Empty output fails structure");

  const c3 = checkOutputStructure({ positive_prompt: "", negative_prompt: "" });
  assert(c3.passed === false, "Empty strings fail structure");

  const c4 = checkOutputStructure({ positive_prompt: "short", negative_prompt: "ok terms here enough" });
  assert(c4.passed === false, "Short positive prompt fails");

  const c5 = checkOutputStructure({
    positive_prompt: "x".repeat(3500),
    negative_prompt: "enough text here",
  });
  assert(c5.passed === false, "Excessively long prompt fails");
}

// ===================================================================
console.log("\n=== OUTPUT STRUCTURE — VALID ===");
// ===================================================================

{
  const c = checkOutputStructure(GOOD_OUTPUT);
  assert(c.passed === true, "Good output passes structure check");
}

// ===================================================================
console.log("\n=== ADDED CONCEPTS — CLEAN OUTPUT ===");
// ===================================================================

{
  const c = checkNoAddedConcepts(VALID_INPUT_SPEC, GOOD_OUTPUT);
  assert(c.passed === true, `Clean output has <= 3 foreign tokens: ${c.foreignTokens.length}`);
}

// ===================================================================
console.log("\n=== ADDED CONCEPTS — CREATIVE INJECTION ===");
// ===================================================================

{
  const badOutput = {
    positive_prompt: GOOD_OUTPUT.positive_prompt +
      ", surrounded by butterflies, underwater palace, dragon wings, " +
      "crystal chandelier, velvet curtains, moonlight serenade, " +
      "ancient prophecy, enchanted forest, diamond tiara",
  };
  const c = checkNoAddedConcepts(VALID_INPUT_SPEC, badOutput);
  assert(c.passed === false, "Creative injection detected as foreign tokens");
  assert(c.foreignTokens.length > 3, `Foreign tokens: ${c.foreignTokens.length}`);
}

// ===================================================================
console.log("\n=== INDIVIDUAL TONE MARKERS ===");
// ===================================================================

{
  // Each tone marker should trigger
  for (const marker of ["beautiful", "gorgeous", "ethereal", "sexy", "epic"]) {
    const c = checkNoToneShift({ positive_prompt: `test ${marker} test output` });
    assert(c.passed === false, `Tone marker "${marker}" detected`);
  }

  // Clean text should pass
  const c = checkNoToneShift({ positive_prompt: "matte porcelain ceramic surface with kintsugi gold seams" });
  assert(c.passed === true, "Technical text passes tone check");
}

// ===================================================================
console.log("\n=== INDIVIDUAL PERSONA MARKERS ===");
// ===================================================================

{
  for (const marker of ["she feels", "the warrior", "with a smile", "tears in"]) {
    const c = checkNoPersonaCreation({ positive_prompt: `test ${marker} test output` });
    assert(c.passed === false, `Persona marker "${marker}" detected`);
  }

  const c = checkNoPersonaCreation({ positive_prompt: "mechanical humanoid with porcelain armor" });
  assert(c.passed === true, "Technical text passes persona check");
}

// ===================================================================
console.log("\n=== INDIVIDUAL STRUCTURAL MARKERS ===");
// ===================================================================

{
  for (const marker of ["scene:", "camera slowly", "inspired by", "fade to"]) {
    const c = checkNoNarrativeBreak({ positive_prompt: `test ${marker} test output` });
    assert(c.passed === false, `Structural marker "${marker}" detected`);
  }

  const c = checkNoNarrativeBreak({ positive_prompt: "wide angle composition with negative space" });
  assert(c.passed === true, "Technical text passes structural check");
}

// ===================================================================
console.log("\n=== MULTIPLE VIOLATIONS STACK ===");
// ===================================================================

{
  const terribleOutput = {
    positive_prompt: "A beautiful gorgeous anime goddess warrior, she feels the cosmic " +
      "energy, scene: epic battle, inspired by Sailor Moon, sexy waifu, magic effects, " +
      "camera slowly pans, stunning ethereal divine enchanting, butterfly wings, crystal palace",
    negative_prompt: "blurry",
  };

  const result = validateTranslation(VALID_INPUT_SPEC, terribleOutput);
  assert(result.valid === false, "Multiple violations → REJECT");
  assert(result.verdict === "REJECT", "Verdict REJECT");
  assert(result.violations.length >= 4, `Multiple checks failed: ${result.violations.length}`);
  assert(result.summary.length >= 4, `Multiple summaries: ${result.summary.length}`);
}

// ===================================================================
console.log("\n=== buildStricterInput ===");
// ===================================================================

{
  const stricter = buildStricterInput(VALID_INPUT_SPEC, [
    "Tone shift: beautiful, gorgeous",
    "Persona: she feels",
  ]);

  assert(stricter.task === "translate_to_render_prompt_only", "Task preserved");
  assert(stricter.rules.no_creativity === true, "No creativity preserved");
  assert(stricter.rules.strict_mode === true, "Strict mode enabled");
  assert(stricter.rules.previous_violations.length === 2, "Previous violations attached");
  assert(stricter.rules.explicit_warnings.length > 0, "Explicit warnings added");
  assert(
    stricter.rules.explicit_warnings.some((w) => w.includes("DO NOT")),
    "Warnings contain DO NOT instructions"
  );
  assert(
    stricter.rules.explicit_warnings.some((w) => w.includes("PREVIOUS ATTEMPT REJECTED")),
    "Warnings reference previous rejection"
  );
  assert(stricter.structured_prompt_spec === VALID_INPUT_SPEC, "Input spec passed through");
}

// ===================================================================
console.log("\n=== FULL PIPELINE SIMULATION ===");
// ===================================================================

{
  // Simulate: good translation on first attempt
  const attempt1 = validateTranslation(VALID_INPUT_SPEC, GOOD_OUTPUT);
  assert(attempt1.valid === true, "Attempt 1: good translation passes");

  // Simulate: bad translation → reject → build stricter → re-validate
  const badOutput = {
    positive_prompt: GOOD_OUTPUT.positive_prompt + ", beautiful ethereal scene: aftermath",
    negative_prompt: GOOD_OUTPUT.negative_prompt,
  };
  const attempt2 = validateTranslation(VALID_INPUT_SPEC, badOutput);
  assert(attempt2.valid === false, "Attempt 2: bad translation rejected");

  const stricterInput = buildStricterInput(VALID_INPUT_SPEC, attempt2.summary);
  assert(stricterInput.rules.strict_mode === true, "Stricter input built");

  // Simulate: Ollama responds correctly on retry
  const attempt3 = validateTranslation(stricterInput.structured_prompt_spec, GOOD_OUTPUT);
  assert(attempt3.valid === true, "Attempt 3: corrected translation passes");
}

// ===================================================================
console.log("\n=== EDGE: EMPTY INPUT SPEC ===");
// ===================================================================

{
  const emptySpec = { subject: "", lighting: [], texture: [], composition_rules: [], negative_prompt: [] };
  const result = validateTranslation(emptySpec, GOOD_OUTPUT);
  // Should still work (foreign token check may be loose with empty vocab)
  assert(typeof result.valid === "boolean", "Empty spec doesn't crash");
  assert(typeof result.verdict === "string", "Returns verdict string");
}

// ===================================================================
// RESULTS
// ===================================================================

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
}

console.log("=".repeat(60) + "\n");

process.exit(failed > 0 ? 1 : 0);
