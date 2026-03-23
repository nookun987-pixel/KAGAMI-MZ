/**
 * MIKAGE — /drift/drift.test.js
 * Combined test suite for identity_score + narrative_score + drift_detector
 * Run: node drift/drift.test.js
 */

"use strict";

const identityMod = require("./identity_score");
const narrativeMod = require("./narrative_score");
const driftMod = require("./drift_detector");

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
// Helpers
// ===================================================================

function setIdentityScores(scores) {
  identityMod.setIdentityAnalyzer({
    async analyze() { return scores; },
  });
}

function setNarrativeAnalysis(analysis) {
  narrativeMod.setNarrativeAnalyzer({
    async analyze() { return analysis; },
  });
}

const GOOD_IDENTITY = {
  silhouette: 0.90, material: 0.85, mask: 0.90,
  blade: 0.85, color: 0.95, anti_polish: 0.80,
};

const GOOD_NARRATIVE_ANALYSIS = {
  perceived_intensity: 0.30,
  perceived_tones: ["restrained", "silent", "cold"],
  perceived_energy: "low",
};

const GOOD_NARRATIVE = {
  arc_id: "arc_001",
  chapter: "fragment_03",
  continuity_notes: [
    "must feel restrained, not loud",
    "must preserve melancholy distance",
    "must avoid commercial glamour drift",
  ],
};

// ===================================================================
// IDENTITY SCORE
// ===================================================================

;(async () => {
try {

console.log("\n=== IDENTITY SCORE — MARKERS INTEGRITY ===");

assert(Object.keys(identityMod.IDENTITY_MARKERS).length === 6, "6 identity dimensions");
assert(identityMod.IDENTITY_MARKERS.silhouette.weight === 0.20, "Silhouette weight 0.20");
assert(identityMod.IDENTITY_MARKERS.material.weight === 0.20, "Material weight 0.20");
assert(identityMod.IDENTITY_MARKERS.mask.weight === 0.15, "Mask weight 0.15");
assert(identityMod.IDENTITY_MARKERS.blade.weight === 0.15, "Blade weight 0.15");
assert(identityMod.IDENTITY_MARKERS.color.weight === 0.15, "Color weight 0.15");
assert(identityMod.IDENTITY_MARKERS.anti_polish.weight === 0.15, "Anti-polish weight 0.15");

// Weight sum = 1.0
const weightSum = Object.values(identityMod.IDENTITY_MARKERS).reduce((s, m) => s + m.weight, 0);
assert(Math.abs(weightSum - 1.0) < 0.01, `Weight sum is ${weightSum} ≈ 1.0`);

// ===================================================================
console.log("\n=== IDENTITY SCORE — computeIdentityScore ===");

{
  // All high
  const r = identityMod.computeIdentityScore(GOOD_IDENTITY);
  assert(r.identity_score >= 0.80, `Good identity: ${r.identity_score}`);
  assert(r.failed_dimensions.length === 0, "No failed dimensions");
  assert(r.dimensions.length === 6, "6 dimensions scored");
  assert(r.dimensions.every((d) => d.pass), "All pass");
}

{
  // All low
  const r = identityMod.computeIdentityScore({
    silhouette: 0.20, material: 0.15, mask: 0.10,
    blade: 0.25, color: 0.20, anti_polish: 0.15,
  });
  assert(r.identity_score < 0.30, `Bad identity: ${r.identity_score}`);
  assert(r.failed_dimensions.length === 6, "All 6 failed");
}

{
  // Mixed — some pass some fail
  const r = identityMod.computeIdentityScore({
    silhouette: 0.90, material: 0.85, mask: 0.40,  // mask fails
    blade: 0.85, color: 0.90, anti_polish: 0.45,   // anti_polish fails
  });
  assert(r.failed_dimensions.includes("mask"), "Mask flagged as failed");
  assert(r.failed_dimensions.includes("anti_polish"), "Anti-polish flagged");
  assert(r.failed_dimensions.length === 2, "2 failed");
}

{
  // Missing scores default to 0
  const r = identityMod.computeIdentityScore({});
  assert(r.identity_score === 0, "Empty scores = 0");
  assert(r.failed_dimensions.length === 6, "All fail with no data");
}

{
  // Clamping
  const r = identityMod.computeIdentityScore({
    silhouette: 1.5, material: -0.5, mask: 0.80,
    blade: 0.80, color: 0.80, anti_polish: 0.80,
  });
  assert(r.dimensions[0].score === 1.0, "Clamped to 1.0");
  assert(r.dimensions[1].score === 0.0, "Clamped to 0.0");
}

// ===================================================================
console.log("\n=== IDENTITY SCORE — scoreIdentity (full pipeline) ===");

{
  setIdentityScores(GOOD_IDENTITY);
  const r = await identityMod.scoreIdentity("/test/good.png");
  assert(r.identity_score >= 0.80, `Pipeline: ${r.identity_score}`);
}

{
  let threw = false;
  try { await identityMod.scoreIdentity(null); } catch (_) { threw = true; }
  assert(threw, "Null path throws");
}

// ===================================================================
// NARRATIVE SCORE
// ===================================================================

console.log("\n=== NARRATIVE SCORE — PHASE EXPECTATIONS ===");

assert(Object.keys(narrativeMod.PHASE_EXPECTATIONS).length === 4, "4 E-I-P-R phases");
assert(narrativeMod.PHASE_EXPECTATIONS.establisher.intensity_range[1] <= 0.40, "Establisher low intensity");
assert(narrativeMod.PHASE_EXPECTATIONS.peak.intensity_range[0] >= 0.50, "Peak high intensity");

// ===================================================================
console.log("\n=== NARRATIVE SCORE — inferPhase ===");

assert(narrativeMod.inferPhase("fragment_01") === "establisher", "fragment_01 → establisher");
assert(narrativeMod.inferPhase("fragment_03") === "initial", "fragment_03 → initial");
assert(narrativeMod.inferPhase("climax_01") === "peak", "climax → peak");
assert(narrativeMod.inferPhase("aftermath_01") === "release", "aftermath → release");
assert(narrativeMod.inferPhase("battle_scene") === "peak", "battle → peak");
assert(narrativeMod.inferPhase("epilogue") === "release", "epilogue → release");
assert(narrativeMod.inferPhase("unknown_thing") === "establisher", "Unknown → establisher (safe)");
assert(narrativeMod.inferPhase(null) === "establisher", "Null → establisher");

// ===================================================================
console.log("\n=== NARRATIVE SCORE — scoreIntensityAlignment ===");

{
  // Establisher: range [0.10, 0.35] — 0.25 should be perfect
  const r = narrativeMod.scoreIntensityAlignment(0.25, "establisher");
  assert(r.score >= 0.85, `Centered intensity: ${r.score}`);
}

{
  // Establisher: 0.80 is way above range → penalized
  const r = narrativeMod.scoreIntensityAlignment(0.80, "establisher");
  assert(r.score < 0.50, `Out-of-range intensity: ${r.score}`);
}

{
  // Peak: range [0.60, 0.90] — 0.75 should be good
  const r = narrativeMod.scoreIntensityAlignment(0.75, "peak");
  assert(r.score >= 0.85, `Peak centered: ${r.score}`);
}

// ===================================================================
console.log("\n=== NARRATIVE SCORE — scoreToneAlignment ===");

{
  // All Canon-aligned tones
  const r = narrativeMod.scoreToneAlignment(["restrained", "melancholic", "cold"]);
  assert(r.score >= 0.75, `Aligned tones: ${r.score}`);
  assert(r.aligned.length === 3, "3 aligned");
  assert(r.forbidden_hits.length === 0, "No forbidden");
}

{
  // All forbidden tones
  const r = narrativeMod.scoreToneAlignment(["cheerful", "playful", "happy"]);
  assert(r.score < 0.30, `Forbidden tones: ${r.score}`);
  assert(r.forbidden_hits.length === 3, "3 forbidden hits");
}

{
  // Empty tones
  const r = narrativeMod.scoreToneAlignment([]);
  assert(r.score === 0.70, "Empty tones → neutral 0.70");
}

// ===================================================================
console.log("\n=== NARRATIVE SCORE — scoreContinuityCoherence ===");

{
  // Restrained note + low intensity → pass
  const r = narrativeMod.scoreContinuityCoherence(
    ["must feel restrained, not loud"],
    ["restrained", "cold"],
    0.25
  );
  assert(r.score >= 0.80, `Coherent: ${r.score}`);
  assert(r.violations.length === 0, "No violations");
}

{
  // Restrained note + HIGH intensity → violation
  const r = narrativeMod.scoreContinuityCoherence(
    ["must feel restrained, not loud"],
    ["restrained"],
    0.85
  );
  assert(r.violations.length > 0, "Intensity violation detected");
  assert(r.score < 0.85, `Penalized: ${r.score}`);
}

{
  // Melancholy note + forbidden tone → violation
  const r = narrativeMod.scoreContinuityCoherence(
    ["must preserve melancholy distance"],
    ["cheerful", "happy"],
    0.30
  );
  assert(r.violations.length > 0, "Tone violation detected");
}

{
  // No notes → neutral
  const r = narrativeMod.scoreContinuityCoherence([], [], 0.50);
  assert(r.score === 0.75, "No notes → neutral");
}

// ===================================================================
console.log("\n=== NARRATIVE SCORE — scoreNarrative (full pipeline) ===");

{
  setNarrativeAnalysis(GOOD_NARRATIVE_ANALYSIS);
  const r = await narrativeMod.scoreNarrative("/test/good.png", GOOD_NARRATIVE);
  assert(r.narrative_score >= 0.70, `Good narrative: ${r.narrative_score}`);
  assert(r.phase === "initial", "Phase inferred from fragment_03");
}

{
  let threw = false;
  try { await narrativeMod.scoreNarrative(null, {}); } catch (_) { threw = true; }
  assert(threw, "Null path throws");
}

// ===================================================================
// DRIFT DETECTOR
// ===================================================================

console.log("\n=== DRIFT DETECTOR — FLAGS INTEGRITY ===");

assert(Object.keys(driftMod.DRIFT_FLAGS).length >= 10, `${Object.keys(driftMod.DRIFT_FLAGS).length} flag types`);
assert(driftMod.DRIFT_FLAGS.GLAMOUR_DRIFT === "glamour_drift", "Glamour flag");
assert(driftMod.DRIFT_FLAGS.PLASTIC_FINISH_DRIFT === "plastic_finish_drift", "Plastic flag");
assert(driftMod.DRIFT_FLAGS.NARRATIVE_BREAK === "narrative_break", "Narrative flag");
assert(driftMod.DRIFT_FLAGS.IDENTITY_EROSION === "identity_erosion", "Erosion flag");

// ===================================================================
console.log("\n=== DRIFT DETECTOR — determineVerdict ===");

{
  // High identity, no flags → PASS
  assert(driftMod.determineVerdict(0.90, 0.85, []) === "PASS", "High scores, no flags → PASS");

  // Identity < 0.60 → REJECT
  assert(driftMod.determineVerdict(0.55, 0.85, []) === "REJECT", "Identity < 0.60 → REJECT");

  // Identity in review band → REVIEW
  assert(driftMod.determineVerdict(0.70, 0.85, []) === "REVIEW", "Identity 0.70 → REVIEW");

  // Identity erosion → REJECT even with good score
  assert(driftMod.determineVerdict(0.80, 0.80, ["identity_erosion"]) === "REJECT", "Identity erosion → REJECT");

  // Narrative break + weak identity → REJECT
  assert(driftMod.determineVerdict(0.65, 0.50, ["narrative_break"]) === "REJECT", "Narrative break + weak → REJECT");

  // Severe flag + passing identity → REVIEW
  assert(driftMod.determineVerdict(0.80, 0.80, ["plastic_finish_drift"]) === "REVIEW", "Severe flag → REVIEW");
  assert(driftMod.determineVerdict(0.80, 0.80, ["glamour_drift"]) === "REVIEW", "Glamour flag → REVIEW");
  assert(driftMod.determineVerdict(0.80, 0.80, ["mask_drift"]) === "REVIEW", "Mask flag → REVIEW");

  // Low narrative, no flags, identity passes → REVIEW
  assert(driftMod.determineVerdict(0.85, 0.50, []) === "REVIEW", "Low narrative → REVIEW");

  // Minor flags with moderate identity → REVIEW
  assert(driftMod.determineVerdict(0.80, 0.80, ["color_drift"]) === "REVIEW", "Minor flag + moderate → REVIEW");

  // Perfect everything → PASS
  assert(driftMod.determineVerdict(0.95, 0.90, []) === "PASS", "Perfect → PASS");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — isRefineable ===");

{
  // Terminal: identity erosion
  const r1 = driftMod.isRefineable(["identity_erosion"], ["silhouette", "material", "mask"]);
  assert(r1.refineable === false, "Identity erosion not refineable");

  // Terminal: mask drift
  const r2 = driftMod.isRefineable(["mask_drift"], ["mask"]);
  assert(r2.refineable === false, "Mask drift not refineable");

  // Terminal: glamour drift
  const r3 = driftMod.isRefineable(["glamour_drift"], ["silhouette"]);
  assert(r3.refineable === false, "Glamour drift not refineable");

  // Terminal: 3+ failed dimensions
  const r4 = driftMod.isRefineable([], ["material", "blade", "color"]);
  assert(r4.refineable === false, "3+ failed dimensions not refineable");

  // Terminal: narrative break + 2 identity fails
  const r5 = driftMod.isRefineable(["narrative_break"], ["material", "color"]);
  assert(r5.refineable === false, "Narrative break + 2 fails not refineable");

  // Refineable: plastic finish only
  const r6 = driftMod.isRefineable(["plastic_finish_drift"], ["anti_polish"]);
  assert(r6.refineable === true, "Plastic finish refineable via stronger negatives");

  // Refineable: symmetry drift only
  const r7 = driftMod.isRefineable(["symmetry_drift"], []);
  assert(r7.refineable === true, "Symmetry refineable via composition tweak");

  // Refineable: color drift only
  const r8 = driftMod.isRefineable(["color_drift"], ["color"]);
  assert(r8.refineable === true, "Color drift refineable via palette constraint");

  // Refineable: no flags no fails
  const r9 = driftMod.isRefineable([], []);
  assert(r9.refineable === true, "Clean state is refineable");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — detectFlags ===");

{
  // Good identity, good narrative → no flags
  const identityResult = identityMod.computeIdentityScore(GOOD_IDENTITY);
  const flags = driftMod.detectFlags(identityResult, { narrative_score: 0.85, tone: { forbidden_hits: [] }, continuity: { violations: [] } });
  assert(flags.length === 0, "Good scores → no flags");
}

{
  // Failed mask → mask_drift
  const identityResult = identityMod.computeIdentityScore({
    ...GOOD_IDENTITY, mask: 0.30,
  });
  const flags = driftMod.detectFlags(identityResult, null);
  assert(flags.includes("mask_drift"), "Failed mask → mask_drift flag");
}

{
  // Failed material + color + blade → 3 flags + identity_erosion
  const identityResult = identityMod.computeIdentityScore({
    silhouette: 0.90, material: 0.30, mask: 0.90,
    blade: 0.30, color: 0.30, anti_polish: 0.80,
  });
  const flags = driftMod.detectFlags(identityResult, null);
  assert(flags.includes("material_drift"), "material_drift flagged");
  assert(flags.includes("weapon_drift"), "weapon_drift flagged");
  assert(flags.includes("color_drift"), "color_drift flagged");
  assert(flags.includes("identity_erosion"), "identity_erosion with 3+ fails");
}

{
  // Narrative with forbidden tones → narrative_break
  const identityResult = identityMod.computeIdentityScore(GOOD_IDENTITY);
  const narrativeResult = {
    narrative_score: 0.45,
    tone: { forbidden_hits: ["cheerful"] },
    continuity: { violations: [] },
  };
  const flags = driftMod.detectFlags(identityResult, narrativeResult);
  assert(flags.includes("narrative_break"), "Low narrative → narrative_break");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — detectDrift (full pipeline, GOOD) ===");

{
  setIdentityScores(GOOD_IDENTITY);
  setNarrativeAnalysis(GOOD_NARRATIVE_ANALYSIS);

  const result = await driftMod.detectDrift("/test/good.png", GOOD_NARRATIVE);

  assert(result.identity_score >= 0.80, `Identity: ${result.identity_score}`);
  assert(result.narrative_score >= 0.70, `Narrative: ${result.narrative_score}`);
  assert(result.drift_flags.length === 0, "No drift flags");
  assert(result.verdict === "PASS", "Verdict PASS");
  assert(result.refineable === true, "Refineable");
  assert(result.anti_polish_score >= 0.70, `Anti-polish: ${result.anti_polish_score}`);
  assert(result.identity_detail !== undefined, "Identity detail present");
  assert(result.narrative_detail !== undefined, "Narrative detail present");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — detectDrift (BAD IDENTITY) ===");

{
  setIdentityScores({
    silhouette: 0.30, material: 0.25, mask: 0.20,
    blade: 0.30, color: 0.25, anti_polish: 0.20,
  });
  setNarrativeAnalysis(GOOD_NARRATIVE_ANALYSIS);

  const result = await driftMod.detectDrift("/test/bad.png", GOOD_NARRATIVE);

  assert(result.identity_score < 0.60, `Bad identity: ${result.identity_score}`);
  assert(result.verdict === "REJECT", "Verdict REJECT");
  assert(result.drift_flags.length > 0, "Has drift flags");
  assert(result.drift_flags.includes("identity_erosion"), "Identity erosion flagged");
  assert(result.refineable === false, "Not refineable");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — detectDrift (PLASTIC DRIFT) ===");

{
  setIdentityScores({
    ...GOOD_IDENTITY, anti_polish: 0.35,
  });
  setNarrativeAnalysis(GOOD_NARRATIVE_ANALYSIS);

  const result = await driftMod.detectDrift("/test/plastic.png", GOOD_NARRATIVE);

  assert(result.drift_flags.includes("plastic_finish_drift"), "Plastic drift flagged");
  assert(result.verdict === "REVIEW", "Verdict REVIEW for plastic");
  assert(result.refineable === true, "Plastic is refineable");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — detectDrift WITH CRITIC RESULT ===");

{
  setIdentityScores(GOOD_IDENTITY);
  setNarrativeAnalysis(GOOD_NARRATIVE_ANALYSIS);

  // Critic says symmetry too clean + over-polish detected
  const mockCritic = {
    quality_score: 0.68,
    rule_detail: {
      checks: [
        { check: "symmetry", pass: false, score: 0.35 },
        { check: "surface_smoothness", pass: true, score: 0.80 },
      ],
    },
    vision_detail: {
      detections: [
        { check: "plastic_look", detected: false },
        { check: "over_polish", detected: true, confidence: 0.60 },
      ],
    },
  };

  const result = await driftMod.detectDrift("/test/sym.png", GOOD_NARRATIVE, mockCritic);

  assert(result.drift_flags.includes("symmetry_drift"), "Symmetry drift from critic");
  assert(result.drift_flags.includes("luxury_editorial_overreach"), "Over-polish from critic vision");
  assert(result.aesthetic_integrity_score === 0.68, "Aesthetic score passed through");
}

// ===================================================================
console.log("\n=== DRIFT DETECTOR — NULL PATH THROWS ===");

{
  let threw = false;
  try { await driftMod.detectDrift(null, {}); } catch (_) { threw = true; }
  assert(threw, "Null path throws");
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

} catch (err) {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
}
})();
