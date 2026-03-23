/**
 * MIKAGE — /control/precheck.test.js
 * Full test suite for precheck.js
 * Run: node control/precheck.test.js
 */

"use strict";

const {
  precheck,
  scoreIdentity,
  scoreNarrative,
  scoreStrategic,
  calculateRisk,
  decide,
  issueToken,
  validateToken,
  CANON,
} = require("./precheck");

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

function assertRange(value, min, max, label) {
  assert(value >= min && value <= max, `${label} — got ${value}, expected [${min}, ${max}]`);
}

// ===================================================================
// Helper: build a clean Canon-compliant job
// ===================================================================
function makeJob(overrides) {
  const base = {
    job_id: "mikage_test_001",
    identity: {
      character_id: "mikage_core",
      persona: "controlled poetic visual entity",
      identity_version: "v1.0",
    },
    narrative: {
      arc_id: "arc_001",
      chapter: "fragment_03",
      continuity_notes: [
        "must feel restrained, not loud",
        "must preserve melancholy distance",
        "must avoid commercial glamour drift",
      ],
    },
    strategy: {
      objective: "identity_consistency",
      secondary_objective: "aesthetic_integrity",
      campaign_tag: "core_visual_language",
    },
    art_direction: {
      mood: ["melancholic", "restrained", "sacred stillness"],
      material: ["weathered ceramic", "charred wood", "heat-warped carbon fiber"],
      style: ["wabi-sabi", "editorial cinematic"],
      composition: {
        negative_space_min: 0.4,
        broken_symmetry_required: true,
        imperfection_required: true,
        texture_variation_required: true,
      },
      forbidden: ["perfect skin", "plastic look", "anime"],
    },
  };

  if (!overrides) return base;

  // Deep merge one level
  const result = { ...base };
  for (const key of Object.keys(overrides)) {
    if (typeof overrides[key] === "object" && !Array.isArray(overrides[key]) && base[key]) {
      result[key] = { ...base[key], ...overrides[key] };
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

// ===================================================================
console.log("\n=== CANON DATA INTEGRITY ===");
// ===================================================================

assert(CANON.MATERIALS_SUBJECT.length > 0, "Canon has subject materials");
assert(CANON.MATERIALS_ENVIRONMENT.length > 0, "Canon has environment materials");
assert(CANON.FORBIDDEN_ABSOLUTE.length > 0, "Canon has forbidden list");
assert(CANON.GLAM_DRIFT_SIGNALS.length > 0, "Canon has glam drift signals");
assert(CANON.FORBIDDEN_ABSOLUTE.includes("anime"), "Anime is forbidden");
assert(CANON.FORBIDDEN_ABSOLUTE.includes("magic effects"), "Magic effects forbidden");
assert(CANON.FORBIDDEN_ABSOLUTE.includes("curved blade"), "Curved blade forbidden");
assert(CANON.COLORS_FORBIDDEN.includes("cyan"), "Cyan forbidden on subject");
assert(Object.isFrozen(CANON), "Canon is frozen");
assert(Object.isFrozen(CANON.MATERIALS_SUBJECT), "Canon materials frozen");

// ===================================================================
console.log("\n=== PERFECT CANON JOB → ALLOW ===");
// ===================================================================

{
  const job = makeJob();
  const result = precheck(job);

  assert(result.decision === "ALLOW", "Perfect Canon job gets ALLOW");
  assertRange(result.identity_check, 0.75, 1.0, "Identity score high");
  assertRange(result.narrative_check, 0.75, 1.0, "Narrative score high");
  assertRange(result.strategic_check, 0.75, 1.0, "Strategic score high");
  assertRange(result.risk_score, 0, 0.34, "Risk score low");
  assert(result.control_token !== null, "Control token issued on ALLOW");
  assert(result.control_token.control_token.startsWith("prechecked_"), "Token has correct prefix");
  assert(result.control_token.expires_in === 300, "Token TTL is 300s");
}

// ===================================================================
console.log("\n=== NON-CANON MATERIAL → REVIEW ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic", "restrained"],
      material: ["weathered ceramic", "charred wood", "aged silk"],
      style: ["wabi-sabi"],
      composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(
    result.decision === "REVIEW" || result.decision === "ALLOW",
    `Non-Canon material: decision is ${result.decision}`
  );
  // "aged silk" is not in Canon stack — should penalize identity
  const hasMatWarning = result.reasons.some((r) => r.toLowerCase().includes("silk") || r.toLowerCase().includes("not in canon"));
  assert(hasMatWarning, "Reason mentions non-Canon material");
  assert(result.control_token === null || result.decision === "ALLOW", "Token only on ALLOW");
}

// ===================================================================
console.log("\n=== FORBIDDEN ELEMENT → REJECT ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic"],
      material: ["porcelain"],
      style: ["anime style"],  // Contains "anime"
      composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(result.decision === "REJECT", "Anime style triggers REJECT");
  assert(result.control_token === null, "No token on REJECT");
  assert(result.flags.includes("forbidden_element"), "Flagged as forbidden_element");
}

// ===================================================================
console.log("\n=== FORBIDDEN COLOR → REJECT ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic"],
      material: ["porcelain"],
      style: ["editorial cinematic"],
      color_mode: "cyan dominant",
      composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(result.decision === "REJECT", "Cyan color triggers REJECT");
  assert(result.flags.includes("forbidden_color"), "Flagged as forbidden_color");
}

// ===================================================================
console.log("\n=== ENGAGEMENT BAIT STRATEGY → REJECT ===");
// ===================================================================

{
  const job = makeJob({
    strategy: {
      objective: "virality",
      secondary_objective: "follower_acquisition",
      campaign_tag: "viral_push",
    },
  });
  const result = precheck(job);

  assert(result.decision === "REJECT", "Virality objective triggers REJECT");
  assert(
    result.flags.includes("engagement_drift") || result.flags.includes("engagement_bait"),
    "Flagged engagement drift"
  );
}

// ===================================================================
console.log("\n=== CHEERFUL MOOD → NARRATIVE PENALTY ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["cheerful", "playful", "fun"],
      material: ["porcelain", "carbon fiber"],
      style: ["editorial cinematic"],
      composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(result.narrative_check < 0.75, `Cheerful mood penalizes narrative: ${result.narrative_check}`);
  assert(
    result.reasons.some((r) => r.includes("cheerful") || r.includes("playful") || r.includes("fun")),
    "Reason mentions forbidden tone"
  );
}

// ===================================================================
console.log("\n=== GLAM DRIFT SIGNALS → REVIEW ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic"],
      material: ["porcelain"],
      style: ["high fashion beauty photography"],
      composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(
    result.decision === "REVIEW" || result.decision === "REJECT",
    `Glam drift: decision is ${result.decision}`
  );
  assert(result.flags.includes("glamour_drift"), "Flagged as glamour_drift");
}

// ===================================================================
console.log("\n=== MISSING NARRATIVE CONTEXT → PENALTY ===");
// ===================================================================

{
  const job = makeJob({
    narrative: {
      arc_id: null,
      chapter: null,
      continuity_notes: [],
    },
  });
  const result = precheck(job);

  assert(result.narrative_check < 1.0, `Missing narrative penalized: ${result.narrative_check}`);
  assert(
    result.reasons.some((r) => r.includes("Missing arc_id") || r.includes("Missing chapter")),
    "Reason mentions missing narrative fields"
  );
}

// ===================================================================
console.log("\n=== NEGATIVE SPACE BELOW CANON → PENALTY ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic"],
      material: ["porcelain"],
      style: ["editorial cinematic"],
      composition: {
        negative_space_min: 0.20,   // Below Canon 0.40
        broken_symmetry_required: true,
        imperfection_required: true,
      },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(
    result.reasons.some((r) => r.includes("Negative space")),
    "Negative space violation reported"
  );
}

// ===================================================================
console.log("\n=== BROKEN SYMMETRY DISABLED → PENALTY ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["melancholic"],
      material: ["porcelain"],
      style: ["editorial cinematic"],
      composition: {
        negative_space_min: 0.4,
        broken_symmetry_required: false,   // Canon requires true
        imperfection_required: true,
      },
      forbidden: [],
    },
  });
  const result = precheck(job);

  assert(
    result.reasons.some((r) => r.includes("symmetry")),
    "Symmetry violation reported"
  );
}

// ===================================================================
console.log("\n=== AUTO_SAFE — MODERATE RISK, PASSES SCORES ===");
// ===================================================================

{
  // Manually test decide() with borderline risk
  const decision = decide(0.80, 0.80, 0.80, 0.40, [], []);
  assert(decision.decision === "AUTO_SAFE", `Moderate risk (0.40) with passing scores → AUTO_SAFE: got ${decision.decision}`);
}

// ===================================================================
console.log("\n=== DECIDE — DIRECT THRESHOLD TESTS ===");
// ===================================================================

{
  // All high, low risk → ALLOW
  const d1 = decide(0.90, 0.85, 0.88, 0.10, [], []);
  assert(d1.decision === "ALLOW", "High scores + low risk → ALLOW");

  // Identity below 0.60 → REJECT
  const d2 = decide(0.55, 0.90, 0.90, 0.10, [], []);
  assert(d2.decision === "REJECT", "Identity < 0.60 → REJECT");

  // Identity in review band → REVIEW
  const d3 = decide(0.70, 0.85, 0.88, 0.10, [], []);
  assert(d3.decision === "REVIEW", "Identity 0.70 → REVIEW");

  // Narrative in review band → REVIEW
  const d4 = decide(0.85, 0.70, 0.88, 0.10, [], []);
  assert(d4.decision === "REVIEW", "Narrative 0.70 → REVIEW");

  // Strategic in review band → REVIEW
  const d5 = decide(0.85, 0.85, 0.70, 0.10, [], []);
  assert(d5.decision === "REVIEW", "Strategic 0.70 → REVIEW");

  // Forbidden element flag → REJECT regardless of score
  const d6 = decide(0.95, 0.95, 0.95, 0.05, ["forbidden_element"], []);
  assert(d6.decision === "REJECT", "Forbidden element flag → REJECT even with perfect scores");

  // Engagement bait flag → REJECT
  const d7 = decide(0.85, 0.85, 0.85, 0.20, [], ["engagement_bait"]);
  assert(d7.decision === "REJECT", "Engagement bait flag → REJECT");

  // Narrative critically low → REJECT
  const d8 = decide(0.85, 0.45, 0.85, 0.20, [], []);
  assert(d8.decision === "REJECT", "Narrative < 0.50 → REJECT");

  // High risk → REVIEW
  const d9 = decide(0.80, 0.80, 0.80, 0.55, [], []);
  assert(d9.decision === "REVIEW", "Risk >= 0.50 → REVIEW");

  // Glamour drift flag → REVIEW
  const d10 = decide(0.85, 0.85, 0.85, 0.20, ["glamour_drift"], []);
  assert(d10.decision === "REVIEW", "Glamour drift flag → REVIEW");
}

// ===================================================================
console.log("\n=== TOKEN ISSUANCE AND VALIDATION ===");
// ===================================================================

{
  const token = issueToken("mikage_test_001", 300);
  assert(token.job_id === "mikage_test_001", "Token has correct job_id");
  assert(token.control_token.startsWith("prechecked_"), "Token prefix correct");
  assert(token.expires_in === 300, "Token TTL correct");
  assert(token.issued_at !== undefined, "Token has issued_at");

  // Validate fresh token
  assert(validateToken(token) === true, "Fresh token validates");

  // Null/empty token fails
  assert(validateToken(null) === false, "Null token fails");
  assert(validateToken({}) === false, "Empty object fails");
  assert(validateToken({ control_token: "bad" }) === false, "Bad prefix fails");

  // Expired token (simulate by backdating)
  const expired = {
    ...token,
    issued_at: new Date(Date.now() - 400000).toISOString(),
    expires_in: 300,
  };
  assert(validateToken(expired) === false, "Expired token fails validation");
}

// ===================================================================
console.log("\n=== SCORE IDENTITY — CANON MATERIALS ONLY ===");
// ===================================================================

{
  // All Canon materials → high score
  const r1 = scoreIdentity(
    { material: ["porcelain", "carbon fiber", "dark titanium"], composition: {} },
    { character_id: "mikage_core" }
  );
  assertRange(r1.score, 0.90, 1.0, "All Canon materials score high");

  // Mixed Canon + non-Canon
  const r2 = scoreIdentity(
    { material: ["porcelain", "velvet fabric", "titanium"], composition: {} },
    { character_id: "mikage_core" }
  );
  assert(r2.score < r1.score, "Non-Canon material lowers score");
  assert(r2.reasons.some((r) => r.includes("velvet")), "Reason mentions non-Canon material");
}

// ===================================================================
console.log("\n=== SCORE NARRATIVE — TONE ALIGNMENT ===");
// ===================================================================

{
  // Perfect alignment
  const r1 = scoreNarrative(
    { arc_id: "arc_001", chapter: "fragment_03", continuity_notes: ["must feel restrained"] },
    { mood: ["melancholic", "restrained", "sacred"] }
  );
  assertRange(r1.score, 0.85, 1.0, "Aligned moods score high");

  // Forbidden tones
  const r2 = scoreNarrative(
    { arc_id: "arc_001", chapter: "fragment_03", continuity_notes: [] },
    { mood: ["happy", "cheerful", "warm"] }
  );
  assert(r2.score < r1.score, "Forbidden tones lower narrative score");
}

// ===================================================================
console.log("\n=== RISK CALCULATION ===");
// ===================================================================

{
  const r1 = calculateRisk(0.90, 0.85, 0.88, [], []);
  assertRange(r1, 0, 0.25, "Clean job has low risk");

  const r2 = calculateRisk(0.60, 0.60, 0.60, ["forbidden_element"], ["engagement_bait"]);
  assertRange(r2, 0.5, 1.0, "Flagged + low scores = high risk");

  assert(r2 > r1, "Flags amplify risk");
}

// ===================================================================
console.log("\n=== FULL PRECHECK — MULTIPLE VIOLATIONS STACK ===");
// ===================================================================

{
  const job = makeJob({
    art_direction: {
      mood: ["cheerful", "sexy", "playful"],  // forbidden tone + forbidden absolute
      material: ["silk", "velvet"],             // non-Canon materials
      style: ["anime cute kawaii"],             // forbidden absolute
      color_mode: "neon green rainbow",         // forbidden colors
      composition: {
        negative_space_min: 0.15,
        broken_symmetry_required: false,
        imperfection_required: false,
      },
      forbidden: [],
    },
    strategy: {
      objective: "virality",
      secondary_objective: "mass_appeal",
      campaign_tag: "promo_ad",
    },
  });

  const result = precheck(job);
  assert(result.decision === "REJECT", "Multiple violations → REJECT");
  assert(result.reasons.length > 3, `Multiple reasons reported: ${result.reasons.length}`);
  assert(result.flags.length > 0, "Multiple flags raised");
  assert(result.control_token === null, "No token on REJECT");
}

// ===================================================================
console.log("\n=== PRECHECK THROWS ON NULL JOB ===");
// ===================================================================

{
  let threw = false;
  try {
    precheck(null);
  } catch (e) {
    threw = true;
  }
  assert(threw, "precheck(null) throws");
}

// ===================================================================
console.log("\n=== EMPTY JOB → STILL FUNCTIONAL (degraded) ===");
// ===================================================================

{
  const result = precheck({ job_id: "mikage_empty" });
  assert(typeof result.decision === "string", "Empty job still returns a decision");
  assert(typeof result.identity_check === "number", "Returns numeric identity_check");
  assert(typeof result.risk_score === "number", "Returns numeric risk_score");
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
