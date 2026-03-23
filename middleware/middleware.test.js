/**
 * MIKAGE — /middleware/middleware.test.js
 * Combined test suite for constraints.js + mapper.js
 * Run: node middleware/middleware.test.js
 */

"use strict";

const constraints = require("./constraints");
const mapper = require("./mapper");

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
console.log("\n=== CONSTRAINTS — DATA INTEGRITY ===");
// ===================================================================

assert(constraints.HARD_CONSTRAINTS.negative_space_min === 0.4, "Negative space min is 0.4");
assert(constraints.HARD_CONSTRAINTS.subject_max_ratio === 0.30, "Subject max ratio is 0.30");
assert(constraints.HARD_CONSTRAINTS.broken_symmetry_required === true, "Broken symmetry required");
assert(constraints.HARD_CONSTRAINTS.imperfection_required === true, "Imperfection required");
assert(constraints.HARD_CONSTRAINTS.texture_variation_required === true, "Texture variation required");
assert(constraints.HARD_CONSTRAINTS.symmetry_tolerance === 0.4, "Symmetry tolerance 0.4");
assert(constraints.HARD_CONSTRAINTS.micro_humanity_motif_min === 1, "Micro motif min 1");
assert(Object.isFrozen(constraints.HARD_CONSTRAINTS), "Hard constraints frozen");

assert(constraints.NEGATIVE_PROMPT_CORE.length > 40, `Core negatives count: ${constraints.NEGATIVE_PROMPT_CORE.length}`);
assert(constraints.NEGATIVE_PROMPT_CORE.includes("perfect skin"), "Core negatives: perfect skin");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("plastic look"), "Core negatives: plastic look");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("over-smooth surfaces"), "Core negatives: over-smooth");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("AI polished look"), "Core negatives: AI polished");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("perfect symmetry"), "Core negatives: symmetry");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("anime"), "Core negatives: anime");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("organic softness"), "Core negatives: organic");
assert(constraints.NEGATIVE_PROMPT_CORE.includes("curved katana"), "Core negatives: curved katana");

assert(constraints.TEXTURE_REQUIREMENTS.length >= 5, "Texture requirements populated");
assert(constraints.MICRO_HUMANITY_MOTIFS.length >= 8, "Micro motifs populated");

// ===================================================================
console.log("\n=== CONSTRAINTS — getConstraints() ===");
// ===================================================================

{
  const c = constraints.getConstraints();
  assert(c.hard === constraints.HARD_CONSTRAINTS, "getConstraints returns hard ref");
  assert(Array.isArray(c.texture_requirements), "Has texture_requirements");
  assert(Array.isArray(c.micro_humanity_motifs), "Has micro_humanity_motifs");
  assert(typeof c.color === "object", "Has color constraints");
  assert(typeof c.composition === "object", "Has composition constraints");
}

// ===================================================================
console.log("\n=== CONSTRAINTS — compileNegativePrompt ===");
// ===================================================================

{
  // Core only
  const np1 = constraints.compileNegativePrompt();
  assert(np1.length > 0, "Core negatives returned");
  assert(np1.includes("anime"), "Contains anime");

  // Core + art_direction forbidden
  const np2 = constraints.compileNegativePrompt(["silk on subject", "flower ornament"]);
  assert(np2.length > np1.length, "Art direction adds to negatives");
  assert(np2.some((n) => n === "silk on subject"), "Custom negative included");

  // Deduplication
  const np3 = constraints.compileNegativePrompt(["anime", "ANIME", "Anime"]);
  const animeCount = np3.filter((n) => n.toLowerCase() === "anime").length;
  assert(animeCount === 1, `Deduplication works: anime appears ${animeCount} time(s)`);

  // Sort by length (shorter first = higher SD priority)
  for (let i = 1; i < np3.length; i++) {
    assert(np3[i].length >= np3[i - 1].length, `Sort order: "${np3[i - 1]}" before "${np3[i]}"`);
    if (np3[i].length < np3[i - 1].length) break;  // stop on first fail
  }
}

// ===================================================================
console.log("\n=== CONSTRAINTS — validateComposition ===");
// ===================================================================

{
  // Valid composition
  const v1 = constraints.validateComposition({
    negative_space_min: 0.45,
    broken_symmetry_required: true,
    imperfection_required: true,
    texture_variation_required: true,
  });
  assert(v1.valid === true, "Valid composition passes");
  assert(v1.violations.length === 0, "No violations on valid");

  // Negative space too low
  const v2 = constraints.validateComposition({ negative_space_min: 0.20 });
  assert(v2.valid === false, "Low negative space fails");
  assert(v2.violations[0].rule === "negative_space_min", "Reports correct rule");
  assert(v2.violations[0].severity === "REJECT", "Severity is REJECT");

  // Broken symmetry disabled
  const v3 = constraints.validateComposition({ broken_symmetry_required: false });
  assert(v3.valid === false, "Symmetry disabled fails");

  // Imperfection disabled
  const v4 = constraints.validateComposition({ imperfection_required: false });
  assert(v4.valid === false, "Imperfection disabled fails");

  // Texture variation disabled
  const v5 = constraints.validateComposition({ texture_variation_required: false });
  assert(v5.valid === false, "Texture variation disabled fails");

  // Empty composition — passes (undefined fields don't violate)
  const v6 = constraints.validateComposition({});
  assert(v6.valid === true, "Empty composition passes (no explicit violations)");

  // Multiple violations
  const v7 = constraints.validateComposition({
    negative_space_min: 0.10,
    broken_symmetry_required: false,
    imperfection_required: false,
    texture_variation_required: false,
  });
  assert(v7.valid === false, "Multiple violations fail");
  assert(v7.violations.length === 4, `4 violations found: got ${v7.violations.length}`);
}

// ===================================================================
console.log("\n=== CONSTRAINTS — validateArtDirection ===");
// ===================================================================

{
  // Full valid
  const v1 = constraints.validateArtDirection({
    mood: ["melancholic"],
    material: ["porcelain"],
    style: ["wabi-sabi"],
    composition: {
      negative_space_min: 0.4,
      broken_symmetry_required: true,
      imperfection_required: true,
      texture_variation_required: true,
    },
  });
  assert(v1.valid === true, "Full valid art_direction passes");

  // Missing fields → warnings not rejections
  const v2 = constraints.validateArtDirection({});
  assert(v2.valid === true, "Empty art_direction has warnings but no REJECT");
  assert(v2.violations.length > 0, "Warnings present for missing fields");
  assert(v2.violations.every((v) => v.severity === "WARN"), "All are WARN severity");

  // Constraint violation → REJECT
  const v3 = constraints.validateArtDirection({
    mood: ["melancholic"],
    material: ["porcelain"],
    style: ["wabi-sabi"],
    composition: { negative_space_min: 0.15 },
  });
  assert(v3.valid === false, "Constraint violation → invalid");
}

// ===================================================================
console.log("\n=== MAPPER — MOOD → LIGHTING ===");
// ===================================================================

{
  // Known mood
  const l1 = mapper.mapMoodToLighting(["melancholic"]);
  assert(l1.length > 0, "Melancholic maps to lighting");
  assert(l1.some((l) => l.includes("chiaroscuro")), "Contains chiaroscuro");
  assert(l1.some((l) => l.includes("4:1")), "Contains 4:1 ratio");

  // Multiple moods — deduplicated
  const l2 = mapper.mapMoodToLighting(["melancholic", "restrained", "sacred"]);
  assert(l2.length > l1.length, "Multiple moods produce more lighting specs");
  const unique = new Set(l2);
  assert(unique.size === l2.length, "No duplicates in multi-mood output");

  // Color mode override
  const l3 = mapper.mapMoodToLighting(["crimson overclock"]);
  assert(l3.some((l) => l.includes("crimson")), "Crimson overclock maps to crimson lighting");

  // Unknown mood → fallback
  const l4 = mapper.mapMoodToLighting(["banana_mood"]);
  assert(l4.length > 0, "Unknown mood gets fallback");
  assert(l4.some((l) => l.includes("single dominant")), "Fallback has Canon-safe defaults");

  // Empty array → fallback
  const l5 = mapper.mapMoodToLighting([]);
  assert(l5.length > 0, "Empty mood array gets fallback");

  // Partial match: "sacred stillness" should match "sacred" or "stillness"
  const l6 = mapper.mapMoodToLighting(["sacred stillness"]);
  assert(l6.length > 0, "Partial match works for compound mood");
}

// ===================================================================
console.log("\n=== MAPPER — MATERIAL → TEXTURE ===");
// ===================================================================

{
  // Canon subject material
  const t1 = mapper.mapMaterialToTexture(["porcelain"]);
  assert(t1.length > 0, "Porcelain maps to texture");
  assert(t1.some((t) => t.includes("B4C")), "Contains B4C reference");
  assert(t1.some((t) => t.includes("kintsugi")), "Contains kintsugi");
  assert(t1.some((t) => t.includes("subsurface")), "Contains SSS");

  // Canon environment material
  const t2 = mapper.mapMaterialToTexture(["charred wood"]);
  assert(t2.length > 0, "Charred wood maps to texture");
  assert(t2.some((t) => t.includes("char")), "Contains char reference");

  // Multiple materials — deduplicated
  const t3 = mapper.mapMaterialToTexture(["porcelain", "carbon fiber", "titanium"]);
  assert(t3.length > t1.length, "Multiple materials produce more textures");
  const unique = new Set(t3);
  assert(unique.size === t3.length, "No duplicates in multi-material output");

  // Unknown material → fallback
  const t4 = mapper.mapMaterialToTexture(["velvet"]);
  assert(t4.length > 0, "Unknown material gets fallback");

  // Heat-warped carbon fiber (Canon environment material)
  const t5 = mapper.mapMaterialToTexture(["heat-warped carbon fiber"]);
  assert(t5.some((t) => t.includes("thermal")), "Heat-warped maps to thermal texture");
}

// ===================================================================
console.log("\n=== MAPPER — STYLE → COMPOSITION ===");
// ===================================================================

{
  // Wabi-sabi
  const c1 = mapper.mapStyleToComposition(["wabi-sabi"]);
  assert(c1.length > 0, "Wabi-sabi maps to composition");
  assert(c1.some((c) => c.includes("negative space")), "Contains negative space rule");
  assert(c1.some((c) => c.includes("broken symmetry")), "Contains broken symmetry");
  assert(c1.some((c) => c.includes("imperfection")), "Contains imperfection");
  assert(c1.some((c) => c.includes("70/30")), "Contains 70/30 ratio");

  // Editorial cinematic
  const c2 = mapper.mapStyleToComposition(["editorial cinematic"]);
  assert(c2.some((c) => c.includes("ARRI")), "Editorial has ARRI reference");
  assert(c2.some((c) => c.includes("2.76:1")), "Editorial has aspect ratio");
  assert(c2.some((c) => c.includes("film grain")), "Editorial has film grain");

  // Multiple styles
  const c3 = mapper.mapStyleToComposition(["wabi-sabi", "editorial cinematic"]);
  assert(c3.length > c1.length, "Multiple styles produce more rules");

  // Unknown style → fallback
  const c4 = mapper.mapStyleToComposition(["impressionism"]);
  assert(c4.length > 0, "Unknown style gets fallback");
}

// ===================================================================
console.log("\n=== MAPPER — LOCKED SUBJECT ===");
// ===================================================================

{
  assert(mapper.LOCKED_SUBJECT.includes("Mikage Zenith"), "Subject starts with identity");
  assert(mapper.LOCKED_SUBJECT.includes("hard-surface"), "Subject includes hard-surface");
  assert(mapper.LOCKED_SUBJECT.includes("Zenith Blade"), "Subject includes weapon");
  assert(mapper.LOCKED_SUBJECT.includes("no curvature"), "Subject includes blade constraint");
  assert(mapper.LOCKED_SUBJECT.includes("straight"), "Subject includes straight blade");
  assert(!mapper.LOCKED_SUBJECT.includes("kitsune mask"), "Subject does NOT use forbidden 'kitsune mask' phrase");
}

// ===================================================================
console.log("\n=== MAPPER — normalize() FULL PIPELINE ===");
// ===================================================================

{
  // Valid full normalization
  const result = mapper.normalize({
    mood: ["melancholic", "restrained", "sacred stillness"],
    material: ["weathered ceramic", "charred wood", "heat-warped carbon fiber"],
    style: ["wabi-sabi", "editorial cinematic"],
    composition: {
      negative_space_min: 0.4,
      broken_symmetry_required: true,
      imperfection_required: true,
      texture_variation_required: true,
    },
    forbidden: ["perfect skin", "plastic look"],
  });

  assert(result.valid === true, "Full normalization succeeds");
  assert(result.spec !== null, "Spec returned");
  assert(result.spec.subject === mapper.LOCKED_SUBJECT, "Subject is locked identity");
  assert(result.spec.lighting.length > 0, "Lighting mapped");
  assert(result.spec.texture.length > 0, "Texture mapped");
  assert(result.spec.composition_rules.length > 0, "Composition mapped");
  assert(result.spec.negative_prompt.length > 40, `Negative prompt compiled: ${result.spec.negative_prompt.length} terms`);

  // Micro-humanity motif injected
  assert(
    result.spec.composition_rules.some((r) => r.includes("micro-humanity")),
    "Micro-humanity motif requirement injected"
  );

  // Negative prompt includes art_direction.forbidden
  assert(
    result.spec.negative_prompt.includes("perfect skin"),
    "Art direction forbidden merged into negative prompt"
  );
}

{
  // Reject on constraint violation
  const result = mapper.normalize({
    mood: ["melancholic"],
    material: ["porcelain"],
    style: ["wabi-sabi"],
    composition: {
      negative_space_min: 0.15,
      broken_symmetry_required: false,
    },
  });

  assert(result.valid === false, "Constraint violation causes rejection");
  assert(result.spec === null, "No spec on rejection");
  assert(result.violations.length > 0, "Violations reported");
  assert(
    result.violations.some((v) => v.rule === "negative_space_min"),
    "Specific violation identified"
  );
}

{
  // Empty art_direction — should still produce valid spec (with fallbacks + warnings)
  const result = mapper.normalize({});
  assert(result.valid === true, "Empty art_direction valid (warnings only)");
  assert(result.spec !== null, "Spec produced with fallbacks");
  assert(result.spec.lighting.length > 0, "Fallback lighting present");
  assert(result.spec.texture.length > 0, "Fallback texture present");
  assert(result.spec.composition_rules.length > 0, "Fallback composition present");
  assert(result.violations.length > 0, "Warnings present for missing inputs");
}

// ===================================================================
console.log("\n=== MAPPER — DETERMINISM CHECK ===");
// ===================================================================

{
  // Same input twice → identical output
  const input = {
    mood: ["melancholic", "cold"],
    material: ["porcelain", "titanium"],
    style: ["wabi-sabi", "cinematic"],
    composition: {
      negative_space_min: 0.4,
      broken_symmetry_required: true,
      imperfection_required: true,
      texture_variation_required: true,
    },
    forbidden: [],
  };

  const r1 = mapper.normalize(input);
  const r2 = mapper.normalize(input);

  assert(
    JSON.stringify(r1.spec.lighting) === JSON.stringify(r2.spec.lighting),
    "Lighting output is deterministic"
  );
  assert(
    JSON.stringify(r1.spec.texture) === JSON.stringify(r2.spec.texture),
    "Texture output is deterministic"
  );
  assert(
    JSON.stringify(r1.spec.composition_rules) === JSON.stringify(r2.spec.composition_rules),
    "Composition output is deterministic"
  );
  assert(
    JSON.stringify(r1.spec.negative_prompt) === JSON.stringify(r2.spec.negative_prompt),
    "Negative prompt output is deterministic"
  );
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
