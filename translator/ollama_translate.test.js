/**
 * MIKAGE — /translator/ollama_translate.test.js
 * Run: node translator/ollama_translate.test.js
 */

"use strict";

const {
  translate,
  translateLocal,
  assemblePositivePrompt,
  assembleNegativePrompt,
  extractTechnicalNotes,
  buildOllamaPayload,
  parseOllamaResponse,
  cleanSegment,
  isMetaRule,
  CONFIG,
} = require("./ollama_translate");

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

// Wrap in async IIFE to allow await with CommonJS require()
(async () => {

// ===================================================================
// Fixtures
// ===================================================================

const FULL_SPEC = {
  subject: "Mikage Zenith, fully mechanical humanoid, strict hard-surface anatomy, " +
    "zero organic influence, full porcelain faceless cybernetic helmet with void black " +
    "optical sensors, narrow straight eye slits, Zenith Blade visible — massive heavy " +
    "industrial straight sword, dark rusty titanium, crimson heated core",
  lighting: [
    "low-key directional light from above 45 degrees",
    "chiaroscuro contrast ratio 4:1",
    "deep shadow falloff into graphite black",
    "minimal fill, protect Ma negative space",
    "thin rim light only, accent Shinogi edges",
    "subsurface scattering on B4C for bone-depth translucency",
  ],
  texture: [
    "micro-cracks matte B4C ceramic with wear",
    "gold kintsugi seams with crimson internal glow",
    "heat-warped carbon fiber matte hex thermal stress",
    "charred wood grain environmental",
    "heat-stress micro-scarring",
    "uneven matte finish",
  ],
  composition_rules: [
    "negative space >= 40%",
    "off-center subject max 30% frame",
    "broken symmetry required",
    "wide establishing 2.76:1",
    "at least 1 micro-humanity motif required",
    "three-axis rule enforced",
    "70/30 ratio — 70% empty to 30% detail",
    "foreground depth element required",
    "film grain present",
    "photorealistic hard sci-fi rendering",
  ],
  negative_prompt: [
    "perfect symmetry", "plastic skin", "glossy luxury finish",
    "clean sterile background", "over-polished face",
    "generic ai beauty", "anime", "organic softness",
    "neon colors", "curved blade", "fantasy ornament overload",
    "sexualized pose", "waifu tropes", "greebling clutter",
    "bloom effects", "magic effects", "curved waist",
    "exaggerated hips", "soft chest contour",
    "silk on subject", "glossy toy look",
  ],
};

const MINIMAL_SPEC = {
  subject: "Mikage Zenith, porcelain armor, Zenith Blade",
  lighting: ["chiaroscuro 4:1 single key light"],
  texture: ["matte B4C ceramic"],
  composition_rules: ["negative space composition"],
  negative_prompt: ["anime", "organic softness"],
};

// ===================================================================
console.log("\n=== CONFIG ===");
// ===================================================================

assert(CONFIG.mode === "LOCAL", "Default mode is LOCAL");
assert(Object.isFrozen(CONFIG), "Config is frozen");

// ===================================================================
console.log("\n=== cleanSegment ===");
// ===================================================================

assert(cleanSegment("  hello  world  ") === "hello world", "Trims and collapses whitespace");
assert(cleanSegment("— description here") === ", description here", "Converts em-dash");
assert(cleanSegment("- bullet item") === "bullet item", "Strips leading bullet");
assert(cleanSegment("• bullet item") === "bullet item", "Strips unicode bullet");
assert(cleanSegment("") === "", "Empty string stays empty");
assert(cleanSegment(null) === "", "Null returns empty");

// ===================================================================
console.log("\n=== isMetaRule ===");
// ===================================================================

assert(isMetaRule("negative space >= 40%") === true, ">= is meta");
assert(isMetaRule("broken symmetry required") === true, "required is meta");
assert(isMetaRule("at least 1 micro-humanity motif required") === true, "at least is meta");
assert(isMetaRule("three-axis rule enforced") === true, "enforce is meta");
assert(isMetaRule("70/30 ratio — detail") === true, "70/30 is meta");
assert(isMetaRule("must be present") === true, "must be is meta");
assert(isMetaRule("wide establishing 2.76:1") === false, "Aspect ratio is NOT meta");
assert(isMetaRule("chiaroscuro 4:1 contrast") === false, "Chiaroscuro is NOT meta");
assert(isMetaRule("film grain present") === false, "Film grain is NOT meta");
assert(isMetaRule("photorealistic hard sci-fi rendering") === false, "Photorealistic is NOT meta");

// ===================================================================
console.log("\n=== assemblePositivePrompt — FULL SPEC ===");
// ===================================================================

{
  const prompt = assemblePositivePrompt(FULL_SPEC);

  assert(typeof prompt === "string", "Returns string");
  assert(prompt.length > 100, `Prompt length: ${prompt.length}`);

  // Contains identity
  assert(prompt.includes("Mikage Zenith"), "Contains identity");
  assert(prompt.includes("Zenith Blade"), "Contains weapon");

  // Contains texture
  assert(prompt.includes("kintsugi"), "Contains kintsugi texture");
  assert(prompt.includes("B4C"), "Contains B4C material");

  // Contains lighting
  assert(prompt.includes("chiaroscuro"), "Contains chiaroscuro");
  assert(prompt.includes("4:1"), "Contains contrast ratio");
  assert(prompt.includes("rim light"), "Contains rim light");
  assert(prompt.includes("subsurface scattering"), "Contains SSS");

  // Contains non-meta composition rules
  assert(prompt.includes("2.76:1"), "Contains aspect ratio");
  assert(prompt.includes("film grain"), "Contains film grain");
  assert(prompt.includes("photorealistic"), "Contains photorealistic");

  // Does NOT contain meta-rules
  assert(!prompt.includes(">= 40%"), "Excludes >= meta-rule");
  assert(!prompt.includes("required"), "Excludes 'required' meta-rule");
  assert(!prompt.includes("at least"), "Excludes 'at least' meta-rule");
  assert(!prompt.includes("three-axis rule"), "Excludes three-axis meta-rule");
  assert(!prompt.includes("70/30"), "Excludes 70/30 meta-rule");

  // Comma-separated format
  assert(prompt.includes(", "), "Comma-separated format");

  // No duplicates — subject keywords shouldn't repeat
  const segments = prompt.split(", ").map((s) => s.trim().toLowerCase());
  const uniqueSegments = new Set(segments);
  assert(uniqueSegments.size === segments.length, `No duplicates: ${segments.length} segments, ${uniqueSegments.size} unique`);
}

// ===================================================================
console.log("\n=== assemblePositivePrompt — MINIMAL SPEC ===");
// ===================================================================

{
  const prompt = assemblePositivePrompt(MINIMAL_SPEC);
  assert(prompt.includes("Mikage Zenith"), "Minimal: contains identity");
  assert(prompt.includes("chiaroscuro"), "Minimal: contains lighting");
  assert(prompt.includes("B4C"), "Minimal: contains texture");
}

// ===================================================================
console.log("\n=== assemblePositivePrompt — NULL THROWS ===");
// ===================================================================

{
  let threw = false;
  try { assemblePositivePrompt(null); } catch (e) { threw = true; }
  assert(threw, "Null spec throws");
}

// ===================================================================
console.log("\n=== assembleNegativePrompt — FULL SPEC ===");
// ===================================================================

{
  const neg = assembleNegativePrompt(FULL_SPEC);

  assert(typeof neg === "string", "Returns string");
  assert(neg.includes("anime"), "Contains anime");
  assert(neg.includes("plastic skin"), "Contains plastic skin");
  assert(neg.includes("curved blade"), "Contains curved blade");
  assert(neg.includes("glossy toy look"), "Contains glossy toy");
  assert(neg.includes(", "), "Comma-separated");

  // Count terms
  const terms = neg.split(", ").filter(Boolean);
  assert(terms.length === FULL_SPEC.negative_prompt.length, `All ${FULL_SPEC.negative_prompt.length} terms preserved: got ${terms.length}`);
}

// ===================================================================
console.log("\n=== assembleNegativePrompt — DEDUPLICATION ===");
// ===================================================================

{
  const spec = {
    negative_prompt: ["anime", "ANIME", "Anime", "organic softness", "organic softness"],
  };
  const neg = assembleNegativePrompt(spec);
  const terms = neg.split(", ").filter(Boolean);
  assert(terms.length === 2, `Deduplication: expected 2, got ${terms.length}`);
}

// ===================================================================
console.log("\n=== extractTechnicalNotes ===");
// ===================================================================

{
  const notes = extractTechnicalNotes(FULL_SPEC);

  assert(Array.isArray(notes), "Returns array");
  assert(notes.length > 0, "Non-empty for full spec");
  assert(notes.some((n) => n.includes("negative space")), "Notes: negative space");
  assert(notes.some((n) => n.includes("symmetry")), "Notes: symmetry");
  assert(notes.some((n) => n.includes("anamorphic")), "Notes: aspect ratio");
  assert(notes.some((n) => n.includes("micro-humanity")), "Notes: motif");
  assert(notes.some((n) => n.includes("foreground")), "Notes: foreground");
  assert(notes.some((n) => n.includes("film grain")), "Notes: film grain");

  // No duplicates
  const uniqueNotes = new Set(notes);
  assert(uniqueNotes.size === notes.length, "Notes deduplicated");
}

// ===================================================================
console.log("\n=== translateLocal — FULL ===");
// ===================================================================

{
  const result = translateLocal(FULL_SPEC);

  assert(typeof result.positive_prompt === "string", "Has positive_prompt");
  assert(typeof result.negative_prompt === "string", "Has negative_prompt");
  assert(Array.isArray(result.technical_notes), "Has technical_notes");
  assert(result.mode === "LOCAL", "Mode is LOCAL");

  assert(result.positive_prompt.length > 100, "Positive prompt substantial");
  assert(result.negative_prompt.length > 50, "Negative prompt substantial");
}

// ===================================================================
console.log("\n=== translateLocal — DETERMINISM ===");
// ===================================================================

{
  const r1 = translateLocal(FULL_SPEC);
  const r2 = translateLocal(FULL_SPEC);

  assert(r1.positive_prompt === r2.positive_prompt, "Positive prompt deterministic");
  assert(r1.negative_prompt === r2.negative_prompt, "Negative prompt deterministic");
  assert(JSON.stringify(r1.technical_notes) === JSON.stringify(r2.technical_notes), "Technical notes deterministic");
}

// ===================================================================
console.log("\n=== translate() LOCAL MODE — GUARD PASS ===");
// ===================================================================

{
  const result = await translate(FULL_SPEC, { mode: "LOCAL" });

  assert(result.valid === true, "Guard validates LOCAL output");
  assert(result.mode === "LOCAL", "Mode is LOCAL");
  assert(result.attempts === 1, "Single attempt for LOCAL");
  assert(result.guard_result.verdict === "PASS", "Guard verdict PASS");
  assert(result.positive_prompt.length > 100, "Positive prompt present");
  assert(result.negative_prompt.length > 50, "Negative prompt present");
}

// ===================================================================
console.log("\n=== translate() DEFAULT MODE ===");
// ===================================================================

{
  // No opts → uses CONFIG.mode which is LOCAL
  const result = await translate(FULL_SPEC);
  assert(result.valid === true, "Default mode works");
  assert(result.mode === "LOCAL", "Default resolves to LOCAL");
}

// ===================================================================
console.log("\n=== translate() NULL SPEC THROWS ===");
// ===================================================================

{
  let threw = false;
  try { await translate(null); } catch (e) { threw = true; }
  assert(threw, "Null spec throws");
}

// ===================================================================
console.log("\n=== translate() UNKNOWN MODE THROWS ===");
// ===================================================================

{
  let threw = false;
  try { await translate(FULL_SPEC, { mode: "BANANA" }); } catch (e) { threw = true; }
  assert(threw, "Unknown mode throws");
}

// ===================================================================
console.log("\n=== PROMPT CONTENT INTEGRITY ===");
// ===================================================================

{
  const result = await translate(FULL_SPEC, { mode: "LOCAL" });

  // Positive prompt must NOT contain negative terms
  const posLower = result.positive_prompt.toLowerCase();
  for (const neg of ["anime", "waifu", "magic effects", "sexualized"]) {
    assert(!posLower.includes(neg), `Positive prompt does not contain "${neg}"`);
  }

  // Negative prompt must preserve input terms
  const negLower = result.negative_prompt.toLowerCase();
  for (const term of FULL_SPEC.negative_prompt) {
    assert(negLower.includes(term.toLowerCase()), `Negative contains "${term}"`);
  }

  // Subject identity must be in positive
  assert(result.positive_prompt.includes("Mikage Zenith"), "Identity preserved in output");
  assert(result.positive_prompt.includes("Zenith Blade"), "Weapon preserved in output");
}

// ===================================================================
console.log("\n=== PROMPT ORDER — CANON TEMPLATE ===");
// ===================================================================

{
  const result = await translate(FULL_SPEC, { mode: "LOCAL" });
  const p = result.positive_prompt;

  // Subject should come BEFORE texture
  const subjectIdx = p.indexOf("Mikage Zenith");
  const textureIdx = p.indexOf("kintsugi");
  assert(subjectIdx < textureIdx, "Subject before texture in prompt order");

  // Texture should come BEFORE composition
  const compIdx = p.indexOf("2.76:1");
  assert(textureIdx < compIdx, "Texture before composition in prompt order");
}

// ===================================================================
console.log("\n=== buildOllamaPayload ===");
// ===================================================================

{
  const payload = buildOllamaPayload(MINIMAL_SPEC);

  assert(payload.model === CONFIG.ollama_model, "Model set");
  assert(payload.stream === false, "Stream disabled");
  assert(payload.options.temperature === 0.0, "Temperature zero");
  assert(payload.options.top_p === 0.1, "Top_p minimal");
  assert(typeof payload.system === "string", "System prompt present");
  assert(typeof payload.prompt === "string", "User prompt present");

  // System prompt must contain restriction language
  const sys = payload.system.toLowerCase();
  assert(sys.includes("do not add"), "System prompt says DO NOT ADD");
  assert(sys.includes("translator"), "System prompt identifies role as translator");
  assert(sys.includes("json"), "System prompt specifies JSON output");
  assert(sys.includes("emotional"), "System prompt warns against emotional words");

  // User prompt must contain the spec data
  assert(payload.prompt.includes("Mikage Zenith"), "User prompt contains subject");
}

// ===================================================================
console.log("\n=== parseOllamaResponse — CLEAN JSON ===");
// ===================================================================

{
  const clean = '{"positive_prompt": "test prompt", "negative_prompt": "test neg"}';
  const result = parseOllamaResponse(clean);
  assert(result !== null, "Clean JSON parsed");
  assert(result.positive_prompt === "test prompt", "Positive extracted");
  assert(result.negative_prompt === "test neg", "Negative extracted");
}

// ===================================================================
console.log("\n=== parseOllamaResponse — MARKDOWN WRAPPED ===");
// ===================================================================

{
  const wrapped = 'Here is the result:\n```json\n{"positive_prompt": "a", "negative_prompt": "b"}\n```';
  const result = parseOllamaResponse(wrapped);
  assert(result !== null, "Markdown-wrapped JSON parsed");
  assert(result.positive_prompt === "a", "Positive from markdown");
}

// ===================================================================
console.log("\n=== parseOllamaResponse — EMBEDDED JSON ===");
// ===================================================================

{
  const embedded = 'I translated the spec. {"positive_prompt": "x", "negative_prompt": "y"} Hope this helps!';
  const result = parseOllamaResponse(embedded);
  assert(result !== null, "Embedded JSON extracted");
  assert(result.positive_prompt === "x", "Positive from embedded");
}

// ===================================================================
console.log("\n=== parseOllamaResponse — GARBAGE ===");
// ===================================================================

{
  assert(parseOllamaResponse(null) === null, "Null returns null");
  assert(parseOllamaResponse("") === null, "Empty returns null");
  assert(parseOllamaResponse("no json here at all") === null, "No JSON returns null");
  assert(parseOllamaResponse('{"wrong_keys": true}') === null, "Wrong keys returns null");
}

// ===================================================================
console.log("\n=== EMPTY SPEC FIELDS ===");
// ===================================================================

{
  const emptyish = {
    subject: "Mikage Zenith test subject for minimum length requirement met here easily",
    lighting: [],
    texture: [],
    composition_rules: [],
    negative_prompt: [],
  };
  const result = translateLocal(emptyish);
  assert(typeof result.positive_prompt === "string", "Empty arrays produce string");
  assert(result.positive_prompt.includes("Mikage Zenith"), "Subject still present");
  assert(result.negative_prompt === "", "Empty negatives produce empty string");
}

// ===================================================================
console.log("\n=== GUARD INTEGRATION — LOCAL OUTPUT PASSES ===");
// ===================================================================

{
  // The core value proposition: LOCAL mode should ALWAYS pass the guard
  // because it's deterministic and doesn't add anything.
  const specs = [FULL_SPEC, MINIMAL_SPEC];

  for (let i = 0; i < specs.length; i++) {
    const result = await translate(specs[i], { mode: "LOCAL" });
    assert(result.valid === true, `Spec ${i + 1}: LOCAL always passes guard`);
    assert(result.guard_result.violations.length === 0, `Spec ${i + 1}: zero violations`);
  }
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

})().catch((err) => {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
});
