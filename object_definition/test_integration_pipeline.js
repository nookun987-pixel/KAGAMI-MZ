/**
 * object_definition/test_integration_pipeline.js
 *
 * Integration tests for Object Definition Lane wired into the Mikage pipeline.
 *
 * Tests:
 *   A. Existing lane test (35/35)
 *   B. Pipeline blocks when object definition REJECTS (abstract intent)
 *   C. Pipeline writes object_definition.json on PASS
 *   D. MASK_MACRO live-style dry run: object definition enters pipeline, reaches spec stage
 */

"use strict";

const fs = require("fs");
const path = require("path");

const { runObjectDefinitionLane, extractSpecInheritance } = require("./object_definition_bridge");
const { applyObjectDefinitionPromptOverride, getRenderPromptFields } = require("../orchestrator");

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

const RUNS_DIR = path.resolve(__dirname, "..", "runs");

function ensureRunDir(jobId) {
  const dir = path.join(RUNS_DIR, jobId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// =========================================================================
// TEST B: Pipeline blocks when object definition REJECTS (abstract intent)
// =========================================================================
console.log("\n=== TEST B: Object Definition REJECT blocks pipeline ===");
{
  const result = runObjectDefinitionLane("abstract texture gradient mood", {
    shot_type: "MATERIAL_MACRO",
  });
  assert(result.ok === false, "abstract intent returns ok=false");
  assert(
    result.verdict === "REJECT" || result.verdict === "NORMALIZER_REJECT",
    "verdict is REJECT or NORMALIZER_REJECT",
    result.verdict
  );
  assert(result.rejection_reason !== null, "rejection_reason is set", result.rejection_reason);
  assert(result.fatal_flags.length > 0, "fatal_flags present", result.fatal_flags);
  assert(result.compiled_prompt === null, "no compiled prompt on reject");
  assert(result.compiled_negative === null, "no compiled negative on reject");

  // Simulate orchestrator behavior: write artifact, verify hard block
  const testJobId = `INTEGRATION_REJECT_${Date.now()}`;
  const runDir = ensureRunDir(testJobId);
  const artifactPath = path.join(runDir, "object_definition.json");
  fs.writeFileSync(artifactPath, JSON.stringify(result, null, 2), "utf-8");
  assert(fs.existsSync(artifactPath), "object_definition.json written on reject");

  const loaded = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  assert(loaded.ok === false, "persisted artifact shows ok=false");
  assert(
    loaded.verdict === "REJECT" || loaded.verdict === "NORMALIZER_REJECT",
    "persisted verdict is REJECT",
    loaded.verdict
  );

  // Cleanup
  fs.rmSync(runDir, { recursive: true, force: true });
}

// =========================================================================
// TEST C: Pipeline writes object_definition.json on PASS
// =========================================================================
console.log("\n=== TEST C: Object Definition PASS writes artifact ===");
{
  const result = runObjectDefinitionLane(
    "a symmetrical japanese kitsune porcelain mask, matte ceramic, fox-shaped",
    { shot_type: "MASK_MACRO" }
  );
  assert(result.ok === true, "kitsune mask returns ok=true");
  assert(result.verdict === "PASS", "verdict is PASS", result.verdict);
  assert(result.object_spec !== null, "object_spec present");
  assert(result.compiled_prompt !== null, "compiled_prompt present");
  assert(result.compiled_negative !== null, "compiled_negative present");
  assert(result.readability_score >= 80, "readability_score >= 80", result.readability_score);

  // Simulate orchestrator: write artifact
  const testJobId = `INTEGRATION_PASS_${Date.now()}`;
  const runDir = ensureRunDir(testJobId);
  const artifactPath = path.join(runDir, "object_definition.json");
  fs.writeFileSync(artifactPath, JSON.stringify(result, null, 2), "utf-8");
  assert(fs.existsSync(artifactPath), "object_definition.json written on pass");

  const loaded = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  assert(loaded.ok === true, "persisted artifact shows ok=true");
  assert(loaded.verdict === "PASS", "persisted verdict is PASS");
  assert(loaded.object_spec.object_id === "MASK_KITSUNE_CERAMIC_001", "spec is mask master");

  // Test extractSpecInheritance
  const inheritance = extractSpecInheritance(result.object_spec);
  assert(inheritance !== null, "extractSpecInheritance returns non-null");
  assert(inheritance.object_identity !== null, "object_identity present");
  assert(inheritance.object_identity.object_class === "mask", "object_class = mask");
  assert(inheritance.material_lock !== null, "material_lock present");
  assert(inheritance.silhouette_lock !== null, "silhouette_lock present");
  assert(inheritance.structure_lock !== null, "structure_lock present");
  assert(inheritance.must_have.length > 0, "must_have has items", inheritance.must_have.length);
  assert(inheritance.must_not_have.length > 0, "must_not_have has items", inheritance.must_not_have.length);
  assert(inheritance.anti_drift_rules.length > 0, "anti_drift_rules has items", inheritance.anti_drift_rules.length);

  // Cleanup
  fs.rmSync(runDir, { recursive: true, force: true });
}

// =========================================================================
// TEST D: MASK_MACRO live-style dry run — full pipeline simulation
// =========================================================================
console.log("\n=== TEST D: MASK_MACRO live-style dry run ===");
{
  const testJobId = `MASK_MACRO_LIVE_${Date.now()}`;
  const runDir = ensureRunDir(testJobId);

  // Step 1: Simulate intake producing a mask prompt
  const intakePrompt = "porcelain kitsune mask, thin crimson seam at jawline, obsidian void background, chiaroscuro dramatic shadow, industrial precision";

  // Step 2: Run Object Definition Lane
  const objDefResult = runObjectDefinitionLane(intakePrompt, {
    shot_type: "MASK_MACRO",
    lane: "mask",
  });
  const artifactPath = path.join(runDir, "object_definition.json");
  fs.writeFileSync(artifactPath, JSON.stringify(objDefResult, null, 2), "utf-8");

  assert(objDefResult.ok === true, "MASK_MACRO intake passes object definition");
  assert(objDefResult.verdict === "PASS", "verdict = PASS", objDefResult.verdict);
  assert(objDefResult.spec_source === "approved_library", "source = approved_library", objDefResult.spec_source);
  assert(objDefResult.object_spec.object_class === "mask", "object_class = mask");

  // Step 3: Verify compiled prompt contains key terms
  const prompt = objDefResult.compiled_prompt || "";
  assert(prompt.includes("kitsune"), "compiled prompt has kitsune");
  assert(prompt.includes("ceramic"), "compiled prompt has ceramic");
  assert(prompt.includes("fox"), "compiled prompt has fox");
  assert(prompt.includes("studio"), "compiled prompt has studio framing");

  const negative = objDefResult.compiled_negative || "";
  assert(negative.includes("plastic"), "compiled negative blocks plastic");
  assert(negative.includes("fur") || negative.includes("hair"), "compiled negative blocks fur/hair");

  // Step 4: Extract inheritance, simulate injection into promptPackage
  const inheritance = extractSpecInheritance(objDefResult.object_spec);
  const mockPromptPackage = {
    structured_prompt: objDefResult.compiled_prompt,
    negative_prompt: objDefResult.compiled_negative,
    object_definition_inheritance: inheritance,
    object_definition_applied: true,
    object_definition_prompt_override: true,
    object_definition_negative_override: true,
  };
  const ppPath = path.join(runDir, "prompt_package.json");
  fs.writeFileSync(ppPath, JSON.stringify(mockPromptPackage, null, 2), "utf-8");

  assert(mockPromptPackage.object_definition_applied === true, "promptPackage has object_definition_applied");
  assert(mockPromptPackage.object_definition_inheritance !== null, "promptPackage has inheritance");
  assert(
    mockPromptPackage.object_definition_inheritance.object_identity.readable_as.includes("kitsune"),
    "inheritance preserves readable_as"
  );
  assert(
    mockPromptPackage.object_definition_inheritance.material_lock.primary_material.includes("ceramic"),
    "inheritance preserves material_lock"
  );
  assert(
    mockPromptPackage.object_definition_inheritance.silhouette_lock.must_read_as.includes("mask"),
    "inheritance preserves silhouette_lock"
  );

  // Step 5: Verify run artifacts exist
  assert(fs.existsSync(artifactPath), "object_definition.json in run dir");
  assert(fs.existsSync(ppPath), "prompt_package.json in run dir");

  console.log(`\n  Run dir: ${runDir}`);
  console.log(`  Object spec: ${objDefResult.object_spec.object_id}`);
  console.log(`  Prompt: ${prompt.length} chars`);
  console.log(`  Negative: ${negative.length} chars`);
  console.log(`  Inheritance keys: ${Object.keys(inheritance).join(", ")}`);

  // Cleanup
  fs.rmSync(runDir, { recursive: true, force: true });
}

// =========================================================================
// TEST E: Object Definition override reaches executeRender prompt fields
// =========================================================================
console.log("\n=== TEST E: Object Definition override reaches executeRender fields ===");
{
  const objDefResult = runObjectDefinitionLane(
    "engineered ceremonial mask artifact, matte ceramic, non-human object",
    { shot_type: "MASK_MACRO", lane: "mask" }
  );
  assert(objDefResult.verdict === "PASS", "object definition returns PASS", objDefResult.verdict);

  const inheritance = extractSpecInheritance(objDefResult.object_spec);
  const promptPackage = {
    structured_prompt: "OLD_STRUCTURED_PROMPT",
    positivePrompt: "OLD_POSITIVE_PROMPT",
    negative_prompt: "OLD_NEGATIVE_PROMPT",
    negativePrompt: "OLD_NEGATIVE_ALIAS",
  };

  applyObjectDefinitionPromptOverride(promptPackage, objDefResult, inheritance);
  const renderPrompts = getRenderPromptFields(promptPackage);

  assert(promptPackage.structured_prompt === objDefResult.compiled_prompt, "structured_prompt overridden");
  assert(promptPackage.positivePrompt === objDefResult.compiled_prompt, "positivePrompt overridden for executeRender");
  assert(promptPackage.negative_prompt === objDefResult.compiled_negative, "negative_prompt overridden");
  assert(promptPackage.negativePrompt === objDefResult.compiled_negative, "negativePrompt overridden for executeRender");
  assert(renderPrompts.prompt === objDefResult.compiled_prompt, "render payload prompt uses object definition compiled prompt");
  assert(renderPrompts.negative_prompt === objDefResult.compiled_negative, "render payload negative uses object definition compiled negative");
}

// =========================================================================
// SUMMARY
// =========================================================================
console.log(`\n${"=".repeat(60)}`);
console.log(`INTEGRATION TEST RESULTS: ${passed} passed, ${failed} failed`);
console.log(`${"=".repeat(60)}`);

if (failed > 0) {
  process.exit(1);
}
