/**
 * MIKAGE — /critic/critic.test.js
 * Combined test suite for rule_critic + vision_critic + critic_merge
 * Run: node critic/critic.test.js
 */

"use strict";

const ruleCritic = require("./rule_critic");
const visionCritic = require("./vision_critic");
const merge = require("./critic_merge");

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

function approxEq(a, b, tolerance, label) {
  const diff = Math.abs(a - b);
  assert(diff <= tolerance, `${label} — got ${a}, expected ~${b} (±${tolerance})`);
}

// ===================================================================
// RULE CRITIC — ANALYZER INJECTION
// ===================================================================

// Helper: build analyzer with specific values
function makeAnalyzer(overrides) {
  const defaults = {
    negativeSpace: 0.50,
    symmetry: 0.35,
    textureVariance: 0.55,
    smoothness: 0.40,
    subjectRatio: 0.25,
  };
  const v = { ...defaults, ...overrides };
  return {
    measureNegativeSpace: () => ({ ratio: v.negativeSpace }),
    measureSymmetry: () => ({ score: v.symmetry }),
    measureTextureVariance: () => ({ variance: v.textureVariance }),
    measureSmoothness: () => ({ smoothness: v.smoothness }),
    measureSubjectRatio: () => ({ ratio: v.subjectRatio }),
  };
}

// ===================================================================
console.log("\n=== RULE CRITIC — THRESHOLDS INTEGRITY ===");
// ===================================================================

assert(ruleCritic.THRESHOLDS.negative_space_min === 0.40, "Negative space min 0.40");
assert(ruleCritic.THRESHOLDS.symmetry_max === 0.60, "Symmetry max 0.60");
assert(ruleCritic.THRESHOLDS.texture_variance_min === 0.30, "Texture variance min 0.30");
assert(ruleCritic.THRESHOLDS.smoothness_max === 0.55, "Smoothness max 0.55");
assert(ruleCritic.THRESHOLDS.subject_ratio_max === 0.30, "Subject ratio max 0.30");
assert(Object.isFrozen(ruleCritic.THRESHOLDS), "Thresholds frozen");

// ===================================================================
console.log("\n=== RULE CRITIC — PERFECT IMAGE → PASS ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.55,     // above 0.40
    symmetry: 0.30,          // below 0.60
    textureVariance: 0.65,   // above 0.30
    smoothness: 0.30,        // below 0.55
    subjectRatio: 0.20,      // below 0.30
  }));

  const result = ruleCritic.runAllRules("/test/perfect.png");

  assert(result.verdict === "PASS", "Perfect image passes");
  assert(result.rule_score >= 0.75, `Score ${result.rule_score} >= 0.75`);
  assert(result.issues.length === 0, "No issues");
  assert(result.checks.length === 5, "5 checks run");
  assert(result.checks.every((c) => c.pass), "All checks pass");
}

// ===================================================================
console.log("\n=== RULE CRITIC — NEGATIVE SPACE TOO LOW → FAIL ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ negativeSpace: 0.15 }));

  const check = ruleCritic.checkNegativeSpace("/test/cramped.png");
  assert(check.pass === false, "Low negative space fails");
  assert(check.measured === 0.15, "Measured value correct");
  assert(check.detail.includes("below"), "Detail mentions below");

  const result = ruleCritic.runAllRules("/test/cramped.png");
  assert(result.issues.some((i) => i.includes("Negative space")), "Issue reported");
}

// ===================================================================
console.log("\n=== RULE CRITIC — TOO SYMMETRICAL → FAIL ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ symmetry: 0.85 }));

  const check = ruleCritic.checkSymmetry("/test/mirror.png");
  assert(check.pass === false, "High symmetry fails");
  assert(check.detail.includes("too perfect"), "Detail mentions too perfect");
}

// ===================================================================
console.log("\n=== RULE CRITIC — BROKEN SYMMETRY → PASS ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ symmetry: 0.25 }));

  const check = ruleCritic.checkSymmetry("/test/broken.png");
  assert(check.pass === true, "Low symmetry passes");
  assert(check.score >= 0.80, `Score ${check.score} for good broken symmetry`);
}

// ===================================================================
console.log("\n=== RULE CRITIC — TEXTURE TOO UNIFORM → FAIL ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ textureVariance: 0.10 }));

  const check = ruleCritic.checkTextureVariation("/test/flat.png");
  assert(check.pass === false, "Low texture variance fails");
  assert(check.detail.includes("uniform"), "Detail mentions uniform");
}

// ===================================================================
console.log("\n=== RULE CRITIC — SURFACE TOO SMOOTH → FAIL ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ smoothness: 0.80 }));

  const check = ruleCritic.checkSurfaceSmoothness("/test/plastic.png");
  assert(check.pass === false, "High smoothness fails");
  assert(check.detail.includes("AI/plastic"), "Detail mentions AI/plastic");
}

// ===================================================================
console.log("\n=== RULE CRITIC — ROUGH SURFACE → PASS ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ smoothness: 0.20 }));

  const check = ruleCritic.checkSurfaceSmoothness("/test/rough.png");
  assert(check.pass === true, "Low smoothness passes");
  assert(check.score >= 0.85, `Score ${check.score} for rough surface`);
}

// ===================================================================
console.log("\n=== RULE CRITIC — SUBJECT TOO LARGE → FAIL ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({ subjectRatio: 0.60 }));

  const check = ruleCritic.checkSubjectRatio("/test/closeup.png");
  assert(check.pass === false, "Large subject fails");
  assert(check.detail.includes("exceeds"), "Detail mentions exceeds");
}

// ===================================================================
console.log("\n=== RULE CRITIC — ALL FAIL → FAIL VERDICT ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.10,
    symmetry: 0.90,
    textureVariance: 0.05,
    smoothness: 0.90,
    subjectRatio: 0.70,
  }));

  const result = ruleCritic.runAllRules("/test/disaster.png");
  assert(result.verdict === "FAIL", "All-bad image fails");
  assert(result.rule_score < 0.60, `Score ${result.rule_score} < 0.60`);
  assert(result.issues.length === 5, "5 issues reported");
}

// ===================================================================
console.log("\n=== RULE CRITIC — BORDERLINE → REVIEW ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.42,
    symmetry: 0.55,       // close to threshold
    textureVariance: 0.35, // close to threshold
    smoothness: 0.50,     // close to threshold
    subjectRatio: 0.28,
  }));

  const result = ruleCritic.runAllRules("/test/borderline.png");
  assert(
    result.verdict === "REVIEW" || result.verdict === "PASS",
    `Borderline: ${result.verdict} with score ${result.rule_score}`
  );
}

// ===================================================================
console.log("\n=== RULE CRITIC — CATASTROPHIC SINGLE CHECK ===");
// ===================================================================

{
  // One check catastrophically low (< 0.40 score), others perfect
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.55,
    symmetry: 0.25,
    textureVariance: 0.60,
    smoothness: 0.98,      // extreme smoothness → score near 0
    subjectRatio: 0.20,
  }));

  const result = ruleCritic.runAllRules("/test/one_bad.png");
  assert(result.verdict === "FAIL", "Single catastrophic check → FAIL");
}

// ===================================================================
console.log("\n=== RULE CRITIC — NULL PATH THROWS ===");
// ===================================================================

{
  let threw = false;
  try { ruleCritic.runAllRules(null); } catch (e) { threw = true; }
  assert(threw, "Null imagePath throws");
}

// ===================================================================
console.log("\n=== VISION CRITIC — THRESHOLDS INTEGRITY ===");
// ===================================================================

assert(visionCritic.THRESHOLDS.plastic_max === 0.35, "Plastic threshold 0.35");
assert(visionCritic.THRESHOLDS.depth_lack_max === 0.40, "Depth threshold 0.40");
assert(visionCritic.THRESHOLDS.overpolish_max === 0.35, "Overpolish threshold 0.35");
assert(typeof visionCritic.VLM_SYSTEM_PROMPT === "string", "VLM prompt is string");
assert(visionCritic.VLM_SYSTEM_PROMPT.includes("PLASTIC_LOOK"), "Prompt mentions plastic");
assert(visionCritic.VLM_SYSTEM_PROMPT.includes("JSON"), "Prompt requests JSON");

// ===================================================================
console.log("\n=== VISION CRITIC — CLEAN IMAGE → PASS ===");
// ===================================================================

;(async () => {
try {

{
  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.10, lack_of_depth: 0.15, over_polish: 0.10 };
    },
  });

  const result = await visionCritic.runVisionCritic("/test/clean.png");

  assert(result.verdict === "PASS", "Clean image passes vision");
  assert(result.vision_score >= 0.75, `Vision score ${result.vision_score} >= 0.75`);
  assert(result.detections.length === 3, "3 detections");
  assert(result.detections.every((d) => !d.detected), "Nothing detected");
  assert(result.issues.length === 0, "No issues");
}

// ===================================================================
console.log("\n=== VISION CRITIC — PLASTIC DETECTED → FAIL ===");
// ===================================================================

{
  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.80, lack_of_depth: 0.15, over_polish: 0.10 };
    },
  });

  const result = await visionCritic.runVisionCritic("/test/plastic.png");

  assert(result.detections[0].detected === true, "Plastic detected");
  assert(result.detections[0].confidence === 0.80, "Confidence 0.80");
  assert(result.issues.some((i) => i.includes("Plastic")), "Issue mentions plastic");
  // Score should be lower due to high plastic confidence
  assert(result.vision_score < 0.75, `Score ${result.vision_score} penalized`);
}

// ===================================================================
console.log("\n=== VISION CRITIC — LACK OF DEPTH DETECTED ===");
// ===================================================================

{
  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.10, lack_of_depth: 0.70, over_polish: 0.10 };
    },
  });

  const result = await visionCritic.runVisionCritic("/test/flat.png");

  assert(result.detections[1].detected === true, "Depth lack detected");
  assert(result.issues.some((i) => i.includes("separation")), "Issue mentions separation");
}

// ===================================================================
console.log("\n=== VISION CRITIC — OVER-POLISH DETECTED ===");
// ===================================================================

{
  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.10, lack_of_depth: 0.15, over_polish: 0.75 };
    },
  });

  const result = await visionCritic.runVisionCritic("/test/polished.png");

  assert(result.detections[2].detected === true, "Over-polish detected");
  assert(result.issues.some((i) => i.includes("Over-polished")), "Issue mentions over-polished");
}

// ===================================================================
console.log("\n=== VISION CRITIC — ALL BAD → FAIL ===");
// ===================================================================

{
  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.85, lack_of_depth: 0.80, over_polish: 0.90 };
    },
  });

  const result = await visionCritic.runVisionCritic("/test/terrible.png");

  assert(result.verdict === "FAIL", "All-bad vision fails");
  assert(result.vision_score < 0.60, `Score ${result.vision_score} < 0.60`);
  assert(result.issues.length === 3, "3 issues");
  assert(result.detections.every((d) => d.detected), "All 3 detected");
}

// ===================================================================
console.log("\n=== VISION CRITIC — INDIVIDUAL EVALUATORS ===");
// ===================================================================

{
  // Plastic — not detected
  const p1 = visionCritic.evaluatePlasticLook(0.10);
  assert(p1.detected === false, "Low confidence = not detected");
  assert(p1.score === 0.90, "Score = 1.0 - confidence");

  // Plastic — detected
  const p2 = visionCritic.evaluatePlasticLook(0.70);
  assert(p2.detected === true, "High confidence = detected");
  assert(p2.score === 0.30, "Score penalized");

  // Depth — not detected
  const d1 = visionCritic.evaluateLackOfDepth(0.20);
  assert(d1.detected === false, "Depth OK");
  assert(d1.score === 0.80, "Depth score");

  // Over-polish — detected
  const o1 = visionCritic.evaluateOverPolish(0.60);
  assert(o1.detected === true, "Polish detected");
  assert(o1.score === 0.40, "Polish score penalized");

  // Clamping
  const c1 = visionCritic.evaluatePlasticLook(-0.5);
  assert(c1.confidence === 0, "Negative confidence clamped to 0");
  const c2 = visionCritic.evaluatePlasticLook(1.5);
  assert(c2.confidence === 1, "Over-1 confidence clamped to 1");
}

// ===================================================================
console.log("\n=== VISION CRITIC — NULL PATH THROWS ===");
// ===================================================================

{
  let threw = false;
  try { await visionCritic.runVisionCritic(null); } catch (e) { threw = true; }
  assert(threw, "Null imagePath throws");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — WEIGHTS ===");
// ===================================================================

assert(merge.WEIGHTS.rule === 0.6, "Rule weight 0.6");
assert(merge.WEIGHTS.vision === 0.4, "Vision weight 0.4");

// ===================================================================
console.log("\n=== CRITIC MERGE — mergeScores ===");
// ===================================================================

{
  // Basic calculation
  approxEq(merge.mergeScores(0.80, 0.80), 0.80, 0.01, "0.8 * 0.6 + 0.8 * 0.4 = 0.80");
  approxEq(merge.mergeScores(1.00, 1.00), 1.00, 0.01, "Perfect scores = 1.0");
  approxEq(merge.mergeScores(0.00, 0.00), 0.00, 0.01, "Zero scores = 0.0");
  approxEq(merge.mergeScores(0.50, 0.50), 0.50, 0.01, "0.5 + 0.5 = 0.50");

  // Weighted: rule dominates
  approxEq(merge.mergeScores(0.90, 0.60), 0.78, 0.01, "0.9*0.6 + 0.6*0.4 = 0.78");
  approxEq(merge.mergeScores(0.60, 0.90), 0.72, 0.01, "0.6*0.6 + 0.9*0.4 = 0.72");

  // Clamping
  approxEq(merge.mergeScores(-0.5, 1.5), 0.40, 0.01, "Clamped inputs");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — mergeVerdicts ===");
// ===================================================================

{
  // Both PASS, score high → PASS
  assert(merge.mergeVerdicts(0.85, "PASS", "PASS") === "PASS", "Both PASS + high score → PASS");

  // Score high but rule REVIEW → REVIEW (capped)
  assert(merge.mergeVerdicts(0.85, "REVIEW", "PASS") === "REVIEW", "Rule REVIEW caps to REVIEW");

  // Score high but vision REVIEW → REVIEW
  assert(merge.mergeVerdicts(0.80, "PASS", "REVIEW") === "REVIEW", "Vision REVIEW caps to REVIEW");

  // Rule FAIL → REJECT regardless
  assert(merge.mergeVerdicts(0.90, "FAIL", "PASS") === "REJECT", "Rule FAIL → REJECT");

  // Vision FAIL → REJECT regardless
  assert(merge.mergeVerdicts(0.90, "PASS", "FAIL") === "REJECT", "Vision FAIL → REJECT");

  // Low score → REJECT
  assert(merge.mergeVerdicts(0.50, "PASS", "PASS") === "REJECT", "Low score → REJECT");

  // Mid score → REVIEW
  assert(merge.mergeVerdicts(0.68, "PASS", "PASS") === "REVIEW", "Mid score → REVIEW");

  // Both FAIL → REJECT
  assert(merge.mergeVerdicts(0.30, "FAIL", "FAIL") === "REJECT", "Both FAIL → REJECT");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — runCritic FULL PIPELINE (GOOD) ===");
// ===================================================================

{
  // Set up both layers for a good image
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.55,
    symmetry: 0.30,
    textureVariance: 0.65,
    smoothness: 0.30,
    subjectRatio: 0.20,
  }));

  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.10, lack_of_depth: 0.15, over_polish: 0.10 };
    },
  });

  const result = await merge.runCritic("/test/good.png");

  assert(result.verdict === "PASS", "Good image passes full critic");
  assert(result.quality_score >= 0.75, `Quality ${result.quality_score} >= 0.75`);
  assert(result.rule_score >= 0.75, `Rule ${result.rule_score} >= 0.75`);
  assert(result.vision_score >= 0.75, `Vision ${result.vision_score} >= 0.75`);
  assert(result.issues.length === 0, "No issues on good image");

  // Verify formula
  const expected = Math.round((result.rule_score * 0.6 + result.vision_score * 0.4) * 100) / 100;
  approxEq(result.quality_score, expected, 0.01, "Quality score matches formula");

  // Detail objects present
  assert(result.rule_detail !== undefined, "Rule detail present");
  assert(result.vision_detail !== undefined, "Vision detail present");
  assert(result.rule_detail.checks.length === 5, "5 rule checks in detail");
  assert(result.vision_detail.detections.length === 3, "3 vision detections in detail");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — runCritic FULL PIPELINE (BAD) ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.10,
    symmetry: 0.90,
    textureVariance: 0.05,
    smoothness: 0.90,
    subjectRatio: 0.60,
  }));

  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.85, lack_of_depth: 0.75, over_polish: 0.80 };
    },
  });

  const result = await merge.runCritic("/test/bad.png");

  assert(result.verdict === "REJECT", "Bad image rejected");
  assert(result.quality_score < 0.60, `Quality ${result.quality_score} < 0.60`);
  assert(result.issues.length > 0, "Issues reported");
  assert(result.issues.some((i) => i.startsWith("[RULE]")), "Rule issues tagged");
  assert(result.issues.some((i) => i.startsWith("[VISION]")), "Vision issues tagged");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — RULE PASS + VISION FAIL → REJECT ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.55,
    symmetry: 0.30,
    textureVariance: 0.65,
    smoothness: 0.30,
    subjectRatio: 0.20,
  }));

  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.90, lack_of_depth: 0.85, over_polish: 0.90 };
    },
  });

  const result = await merge.runCritic("/test/rule_ok_vision_bad.png");
  assert(result.verdict === "REJECT", "Rule pass + vision fail → REJECT (defense in depth)");
  assert(result.rule_verdict === "PASS", "Rule layer passed");
  assert(result.vision_verdict === "FAIL", "Vision layer failed");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — RULE FAIL + VISION PASS → REJECT ===");
// ===================================================================

{
  ruleCritic.setAnalyzer(makeAnalyzer({
    negativeSpace: 0.10,
    symmetry: 0.90,
    textureVariance: 0.05,
    smoothness: 0.90,
    subjectRatio: 0.60,
  }));

  visionCritic.setVLMBackend({
    async analyze() {
      return { plastic_look: 0.10, lack_of_depth: 0.10, over_polish: 0.10 };
    },
  });

  const result = await merge.runCritic("/test/rule_bad_vision_ok.png");
  assert(result.verdict === "REJECT", "Rule fail + vision pass → REJECT");
  assert(result.rule_verdict === "FAIL", "Rule layer failed");
  assert(result.vision_verdict === "PASS", "Vision layer passed");
}

// ===================================================================
console.log("\n=== CRITIC MERGE — NULL PATH THROWS ===");
// ===================================================================

{
  let threw = false;
  try { await merge.runCritic(null); } catch (e) { threw = true; }
  assert(threw, "Null imagePath throws");
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
