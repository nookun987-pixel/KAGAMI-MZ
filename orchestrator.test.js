/**
 * MIKAGE — orchestrator.test.js
 * End-to-end pipeline test.
 * Run: node orchestrator.test.js
 */

"use strict";

const { run, postControl } = require("./orchestrator");
const { setNotionClient } = require("./memory/notion_logger");
const { setFooocusClient } = require("./render/render_executor");
const { setShellExecutor } = require("./render/vram_manager");
const { forceReset } = require("./render/vram_manager");
const { setAnalyzer } = require("./critic/rule_critic");
const { setVLMBackend } = require("./critic/vision_critic");
const { setIdentityAnalyzer } = require("./drift/identity_score");
const { setNarrativeAnalyzer } = require("./drift/narrative_score");

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

// --- Mocks ---
setShellExecutor({ exec() { return ""; } });
setNotionClient({
  pages: [],
  async createPage(p) { this.pages.push(p); return { id: "page_0", url: "https://notion.so/test" }; },
  async updatePage(p) { return { id: p.page_id, updated: true }; },
});
setFooocusClient({
  async submitRender(packet) {
    return { output_file: "/tmp/mikage_render.png", seed_used: 999, render_time_ms: 3000, status: "OK" };
  },
  async abortRender() {},
});
setAnalyzer({
  measureNegativeSpace: () => ({ ratio: 0.55 }),
  measureSymmetry: () => ({ score: 0.30 }),
  measureTextureVariance: () => ({ variance: 0.60 }),
  measureSmoothness: () => ({ smoothness: 0.30 }),
  measureSubjectRatio: () => ({ ratio: 0.22 }),
});
setVLMBackend({
  async analyze() { return { plastic_look: 0.10, lack_of_depth: 0.15, over_polish: 0.10 }; },
});
setIdentityAnalyzer({
  async analyze() {
    return { silhouette: 0.90, material: 0.85, mask: 0.90, blade: 0.85, color: 0.95, anti_polish: 0.80 };
  },
});
setNarrativeAnalyzer({
  async analyze() {
    return { perceived_intensity: 0.30, perceived_tones: ["restrained", "silent", "cold"], perceived_energy: "low" };
  },
});

const GOOD_JOB = {
  job_id: "mikage_e2e_001",
  source: "notion",
  mode: "AUTO_DRAFT",
  identity: { character_id: "mikage_core", persona: "controlled poetic visual entity", identity_version: "v1.0" },
  narrative: { arc_id: "arc_001", chapter: "fragment_03", continuity_notes: ["must feel restrained, not loud", "must preserve melancholy distance", "must avoid commercial glamour drift"] },
  strategy: { objective: "identity_consistency", secondary_objective: "aesthetic_integrity", campaign_tag: "core_visual_language" },
  art_direction: {
    mood: ["melancholic", "restrained", "sacred stillness"],
    material: ["weathered ceramic", "charred wood", "heat-warped carbon fiber"],
    style: ["wabi-sabi", "editorial cinematic"],
    composition: { negative_space_min: 0.4, broken_symmetry_required: true, imperfection_required: true, texture_variation_required: true },
    forbidden: ["perfect skin", "plastic look", "over-smooth surfaces"],
  },
  render: { engine: "fooocus", seed: null, max_iteration: 3 },
};

;(async () => {
try {

// ===================================================================
console.log("\n=== E2E — GOOD JOB → PASS ===");
// ===================================================================

forceReset("test");

{
  const result = await run(GOOD_JOB);

  assert(result.status === "DONE", `Status: ${result.status}`);
  assert(result.decision === "PASS", `Decision: ${result.decision}`);
  assert(result.attempt_count === 1, `Attempts: ${result.attempt_count}`);
  assert(result.identity_score >= 0.75, `Identity: ${result.identity_score}`);
  assert(result.critic_score >= 0.75, `Critic: ${result.critic_score}`);
  assert(result.output_files.length > 0, "Output files present");
  assert(result.rejected_samples.length === 0, "No rejected samples");
  assert(result.drift_flags.length === 0, "No drift flags");
  assert(result.prompt !== null, "Prompt populated");
  assert(result.negative_prompt !== null, "Negative prompt populated");
  assert(result.audit.trace.length > 10, `Trace entries: ${result.audit.trace.length}`);

  // Verify trace includes all major steps
  const steps = result.audit.trace.map((e) => e.step);
  assert(steps.includes("INGESTED"), "Trace: INGESTED");
  assert(steps.includes("STRUCTURED"), "Trace: STRUCTURED");
  assert(steps.includes("PRECHECKED"), "Trace: PRECHECKED");
  assert(steps.includes("PRE_CONTROL"), "Trace: PRE_CONTROL");
  assert(steps.includes("NORMALIZED"), "Trace: NORMALIZED");
  assert(steps.includes("TRANSLATED"), "Trace: TRANSLATED");
  assert(steps.includes("RENDERING"), "Trace: RENDERING");
  assert(steps.includes("CRITIQUED"), "Trace: CRITIQUED");
  assert(steps.includes("DRIFT_CHECKED"), "Trace: DRIFT_CHECKED");
  assert(steps.includes("POSTCHECKED"), "Trace: POSTCHECKED");
  assert(steps.includes("DECIDED"), "Trace: DECIDED");
  assert(steps.includes("LOGGED"), "Trace: LOGGED");
  assert(steps.includes("DONE"), "Trace: DONE");
}

// ===================================================================
console.log("\n=== E2E — FORBIDDEN ELEMENT → REJECT AT PRE_CONTROL ===");
// ===================================================================

forceReset("test");

{
  const badJob = {
    ...GOOD_JOB,
    job_id: "mikage_e2e_reject_001",
    art_direction: {
      ...GOOD_JOB.art_direction,
      style: ["anime cute kawaii"],
    },
  };

  const result = await run(badJob);

  assert(result.status === "DONE", `Status: ${result.status}`);
  assert(result.decision === "REJECT", `Decision: ${result.decision}`);
  assert(result.rejected_reason && result.rejected_reason.length > 0, "Rejected reason set");
}

// ===================================================================
console.log("\n=== E2E — CONSTRAINT VIOLATION → FAIL AT MIDDLEWARE ===");
// ===================================================================

forceReset("test");

{
  const badJob = {
    ...GOOD_JOB,
    job_id: "mikage_e2e_constraint_001",
    art_direction: {
      ...GOOD_JOB.art_direction,
      composition: { negative_space_min: 0.10, broken_symmetry_required: false, imperfection_required: false, texture_variation_required: false },
    },
  };

  const result = await run(badJob);
  // PRE_CONTROL catches composition violations before middleware
  assert(result.decision !== "PASS", `Should not pass: ${result.decision}`);
  assert(
    result.status === "DONE" || result.status === "REVIEW",
    `Status terminal or review: ${result.status}`
  );
}

// ===================================================================
console.log("\n=== postControl — DIRECT TESTS ===");
// ===================================================================

{
  // Both pass → PASS
  const r1 = postControl(
    { verdict: "PASS", quality_score: 0.85, issues: [] },
    { verdict: "PASS", identity_score: 0.90, drift_flags: [], refineable: true },
    1, 3
  );
  assert(r1.decision === "PASS", "Both pass → PASS");
  assert(r1.publish_safe === true, "Publish safe on PASS");
}

{
  // Drift reject → REJECT
  const r2 = postControl(
    { verdict: "PASS", quality_score: 0.85, issues: [] },
    { verdict: "REJECT", identity_score: 0.50, drift_flags: ["identity_erosion"], refineable: false },
    1, 3
  );
  assert(r2.decision === "REJECT", "Drift reject → REJECT");
}

{
  // Critic reject → REJECT
  const r3 = postControl(
    { verdict: "REJECT", quality_score: 0.40, issues: ["too smooth"] },
    { verdict: "PASS", identity_score: 0.85, drift_flags: [], refineable: true },
    1, 3
  );
  assert(r3.decision === "REJECT", "Critic reject → REJECT");
}

{
  // Refineable + attempts left → CONDITIONAL
  const r4 = postControl(
    { verdict: "REVIEW", quality_score: 0.70, issues: ["texture weak"] },
    { verdict: "REVIEW", identity_score: 0.78, drift_flags: ["plastic_finish_drift"], refineable: true, refine_reason: "fixable" },
    1, 3
  );
  assert(r4.decision === "CONDITIONAL", "Refineable + attempts → CONDITIONAL");
}

{
  // Not refineable + review → REVIEW
  const r5 = postControl(
    { verdict: "REVIEW", quality_score: 0.70, issues: [] },
    { verdict: "REVIEW", identity_score: 0.78, drift_flags: ["mask_drift"], refineable: false, refine_reason: "terminal" },
    3, 3
  );
  assert(r5.decision === "REVIEW", "Not refineable → REVIEW");
}

// ===================================================================
// RESULTS
// ===================================================================

console.log("\n" + "=".repeat(60));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log("\nFAILURES:");
  for (const f of failures) console.log(`  • ${f}`);
}
console.log("=".repeat(60) + "\n");
process.exit(failed > 0 ? 1 : 0);

} catch (err) {
  console.error("TEST RUNNER ERROR:", err);
  process.exit(1);
}
})();
