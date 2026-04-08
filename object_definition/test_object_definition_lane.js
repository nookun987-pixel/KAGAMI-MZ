/**
 * object_definition/test_object_definition_lane.js
 *
 * End-to-end test for the Object Definition Lane using the Mikage mask lane.
 *
 * Flow:
 *   raw intent → normalizer → spec generator → readability gate → prompt compiler
 *
 * Tests:
 *   1. Generic mask intent → clean skeleton spec → PASS gate → compiled prompt
 *   2. Abstract/texture intent → REJECT at normalizer
 *   3. Vague intent (no object class) → REJECT at normalizer
 *   4. Skeleton spec (unknown object) → REVISE or PASS at gate
 *   5. Full lane on real mask master sample from approved_object_library
 */

"use strict";

const { normalizeIntent } = require("./object_intent_normalizer");
const { generateObjectSpec } = require("./object_spec_generator");
const { evaluateReadability } = require("./object_readability_gate");
const { compilePrompt } = require("./prompt_compiler");

let passed = 0;
let failed = 0;

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`  PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  FAIL: ${testName} — ${detail || ""}`);
    failed++;
  }
}

// -------------------------------------------------------------------------
// TEST 1: Generic mask intent → full lane PASS
// -------------------------------------------------------------------------
console.log("\n=== TEST 1: Generic mask intent (sanitized library fallback) ===");
{
  const raw = "matte black technical ceramic mask, centered front view, severe symmetrical silhouette";
  const norm = normalizeIntent(raw);
  assert(norm.ok === true, "normalizer accepts mask intent");
  assert(norm.design_intent.object_class === "mask", "detected class = mask", norm.design_intent?.object_class);

  const specResult = generateObjectSpec(norm.design_intent);
  assert(specResult.ok === true, "spec generated successfully");
  assert(specResult.source !== "approved_library", "sanitized library does not force contaminated approved reuse", specResult.source);
  assert(specResult.approved_memory_reused === false, "approved memory not reused");

  const gate = evaluateReadability(specResult.spec);
  assert(gate.verdict === "PASS", "readability gate = PASS", `verdict=${gate.verdict}, score=${gate.readability_score}`);
  assert(gate.readability_score >= 80, "readability score >= 80", gate.readability_score);
  assert(gate.fatal_flags.length === 0, "no fatal flags", gate.fatal_flags);

  const compiled = compilePrompt(specResult.spec);
  assert(compiled.prompt.length > 100, "compiled prompt is substantial", compiled.prompt.length);
  assert(compiled.negative_prompt.length > 50, "compiled negative_prompt exists", compiled.negative_prompt.length);
  assert(/ceramic/i.test(compiled.prompt), "prompt includes ceramic");
  assert(/sealed eye region|bilateral symmetry|black void/i.test(compiled.prompt), "prompt includes mask canon locks");
  assert(compiled.negative_prompt.includes("plastic"), "negative includes plastic");

  console.log(`  Compiled prompt length: ${compiled.prompt.length} chars`);
  console.log(`  Compiled negative length: ${compiled.negative_prompt.length} chars`);
}

// -------------------------------------------------------------------------
// TEST 2: Abstract/texture intent → REJECT at normalizer
// -------------------------------------------------------------------------
console.log("\n=== TEST 2: Abstract intent rejection ===");
{
  const raw = "texture field with gradients and mood";
  const norm = normalizeIntent(raw);
  assert(norm.ok === false, "normalizer rejects abstract intent");
  assert(norm.rejection !== null, "rejection reason provided");
  assert(norm.rejection.reason === "ABSTRACT_REJECT" || norm.rejection.reason === "NO_OBJECT_CLASS",
    "rejection is ABSTRACT_REJECT or NO_OBJECT_CLASS", norm.rejection?.reason);
}

// -------------------------------------------------------------------------
// TEST 3: Vague intent (no object class) → REJECT
// -------------------------------------------------------------------------
console.log("\n=== TEST 3: Vague intent rejection ===");
{
  const raw = "something beautiful and epic";
  const norm = normalizeIntent(raw);
  assert(norm.ok === false, "normalizer rejects vague intent");
  assert(norm.rejection !== null, "rejection reason provided");
}

// -------------------------------------------------------------------------
// TEST 4: Empty intent → REJECT
// -------------------------------------------------------------------------
console.log("\n=== TEST 4: Empty intent rejection ===");
{
  const norm = normalizeIntent("");
  assert(norm.ok === false, "normalizer rejects empty intent");
  assert(norm.rejection.reason === "EMPTY_INTENT", "reason = EMPTY_INTENT", norm.rejection?.reason);
}

// -------------------------------------------------------------------------
// TEST 5: Unknown weapon → skeleton spec → gate evaluates
// -------------------------------------------------------------------------
console.log("\n=== TEST 5: Unknown weapon (skeleton spec) ===");
{
  const raw = "a ceremonial bronze katana with etched dragon pattern";
  const norm = normalizeIntent(raw);
  assert(norm.ok === true, "normalizer accepts weapon intent");
  assert(norm.design_intent.object_class === "weapon", "detected class = weapon", norm.design_intent?.object_class);
  assert(norm.design_intent.material_hint === "metal", "detected material = metal", norm.design_intent?.material_hint);

  const specResult = generateObjectSpec(norm.design_intent);
  assert(specResult.ok === true, "skeleton spec generated");
  assert(specResult.source === "bare_skeleton" || specResult.source === "reference_skeleton",
    "source is skeleton-based", specResult.source);

  const gate = evaluateReadability(specResult.spec);
  assert(gate.verdict !== "REJECT" || gate.fatal_flags.length > 0,
    "gate gives verdict (not crash)", gate.verdict);
  console.log(`  Gate verdict: ${gate.verdict}, score: ${gate.readability_score}`);
  console.log(`  Reasons: ${gate.reasons.length}`);
  if (gate.reasons.length > 0) console.log(`    - ${gate.reasons.join("\n    - ")}`);

  const compiled = compilePrompt(specResult.spec);
  assert(compiled.prompt.length > 50, "compiled prompt exists", compiled.prompt.length);
  assert(compiled.prompt.includes("katana") || compiled.prompt.includes("weapon"),
    "prompt includes subject reference");
}

// -------------------------------------------------------------------------
// TEST 6: Sanitized approved library keeps contaminated mask master out of live reuse
// -------------------------------------------------------------------------
console.log("\n=== TEST 6: Sanitized approved library excludes contaminated record ===");
{
  const fs = require("fs");
  const path = require("path");
  const library = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "memory", "approved_object_library.json"), "utf-8")
  );
  assert(Array.isArray(library.objects), "approved library objects is array");
  assert(library.objects.length === 0, "contaminated record removed from live approved library", library.objects.length);
}

// -------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------
console.log(`\n${"=".repeat(60)}`);
console.log(`OBJECT DEFINITION LANE TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log(`${"=".repeat(60)}`);

if (failed > 0) {
  process.exit(1);
}
