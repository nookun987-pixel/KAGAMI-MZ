/**
 * object_definition/test_object_definition_lane.js
 *
 * End-to-end test for the Object Definition Lane using the Mikage mask lane.
 *
 * Flow:
 *   raw intent → normalizer → spec generator → readability gate → prompt compiler
 *
 * Tests:
 *   1. Known kitsune mask intent → approved spec → PASS gate → compiled prompt
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
// TEST 1: Known kitsune mask intent → full lane PASS
// -------------------------------------------------------------------------
console.log("\n=== TEST 1: Kitsune mask intent (approved library match) ===");
{
  const raw = "a symmetrical japanese kitsune porcelain mask, matte ceramic, fox-shaped";
  const norm = normalizeIntent(raw);
  assert(norm.ok === true, "normalizer accepts kitsune intent");
  assert(norm.design_intent.object_class === "mask", "detected class = mask", norm.design_intent?.object_class);

  const specResult = generateObjectSpec(norm.design_intent);
  assert(specResult.ok === true, "spec generated successfully");
  assert(specResult.source === "approved_library", "source = approved_library", specResult.source);
  assert(specResult.spec.object_id === "MASK_KITSUNE_CERAMIC_001", "matched approved MASK_KITSUNE_CERAMIC_001", specResult.spec?.object_id);

  const gate = evaluateReadability(specResult.spec);
  assert(gate.verdict === "PASS", "readability gate = PASS", `verdict=${gate.verdict}, score=${gate.readability_score}`);
  assert(gate.readability_score >= 80, "readability score >= 80", gate.readability_score);
  assert(gate.fatal_flags.length === 0, "no fatal flags", gate.fatal_flags);

  const compiled = compilePrompt(specResult.spec);
  assert(compiled.prompt.length > 100, "compiled prompt is substantial", compiled.prompt.length);
  assert(compiled.negative_prompt.length > 50, "compiled negative_prompt exists", compiled.negative_prompt.length);
  assert(compiled.prompt.includes("kitsune"), "prompt includes kitsune");
  assert(compiled.prompt.includes("ceramic"), "prompt includes ceramic");
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
// TEST 6: Full lane on real mask master (direct spec from library)
// -------------------------------------------------------------------------
console.log("\n=== TEST 6: Direct approved spec → gate → compile (mask master) ===");
{
  const fs = require("fs");
  const path = require("path");
  const library = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "memory", "approved_object_library.json"), "utf-8")
  );
  const maskSpec = library.objects[0];
  assert(maskSpec.object_id === "MASK_KITSUNE_CERAMIC_001", "loaded mask master spec");

  const gate = evaluateReadability(maskSpec);
  assert(gate.verdict === "PASS", "mask master passes gate", gate.verdict);
  assert(gate.readability_score >= 90, "mask master score >= 90", gate.readability_score);

  const compiled = compilePrompt(maskSpec);
  assert(compiled.prompt.includes("fox"), "prompt includes fox");
  assert(compiled.prompt.includes("eye_slits") || compiled.prompt.includes("eye") || compiled.prompt.includes("slit"),
    "prompt includes eye slit reference");
  assert(compiled.negative_prompt.includes("fur") || compiled.negative_prompt.includes("hair"),
    "negative blocks fur/hair");
  assert(compiled.compilation_notes.length > 0, "compilation notes generated", compiled.compilation_notes.length);

  console.log(`\n  === COMPILED MASK MASTER PROMPT ===`);
  console.log(`  PROMPT (${compiled.prompt.length} chars):`);
  console.log(`  ${compiled.prompt.slice(0, 200)}...`);
  console.log(`  NEGATIVE (${compiled.negative_prompt.length} chars):`);
  console.log(`  ${compiled.negative_prompt.slice(0, 200)}...`);
  console.log(`  NOTES: ${compiled.compilation_notes.length} entries`);
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
