/**
 * LIVE REJECT JOB INTEGRATION TEST
 * Tests runTrainingLoopOnReject() with REAL data from an existing REJECT run.
 * This exercises the EXACT same code path as the orchestrator hook.
 */

"use strict";

const fs = require("fs");
const path = require("path");

// Load the orchestrator module to get access to the hook function
// We need to test the exact code that runs inside orchestrator.js
// Since runTrainingLoopOnReject is not exported, we test the same logic directly.

const { classifyFailure } = require("./training_loop/fail_classifier");
const { generatePatchPlan } = require("./training_loop/patch_engine");
const { runABRetest } = require("./training_loop/ab_retest_runner");
const { writeTrainingCase } = require("./training_loop/training_case_writer");

const RUNS_DIR = path.join(__dirname, "runs");
const TEST_JOB_ID = "TRAINING_LOOP_LIVE_TEST_001";
const SOURCE_JOB_ID = "USABLE_ENTITY_TEST_003";

// --- Load REAL data from existing REJECT run ---
const sourceRunDir = path.join(RUNS_DIR, SOURCE_JOB_ID);
const finalDecision = JSON.parse(fs.readFileSync(path.join(sourceRunDir, "final_decision.json"), "utf-8"));
const postValidation = JSON.parse(fs.readFileSync(path.join(sourceRunDir, "post_validation.json"), "utf-8"));
const job = JSON.parse(fs.readFileSync(path.join(__dirname, "jobs", `${SOURCE_JOB_ID}.json`), "utf-8"));

// Override job_id to avoid colliding with existing run
job.job_id = TEST_JOB_ID;
finalDecision.job_id = TEST_JOB_ID;

// Use the real output.png from the source run
const outputFilePath = path.join(sourceRunDir, "candidate-01", "output.png");

console.log("=".repeat(60));
console.log("LIVE REJECT JOB — INTEGRATION TEST");
console.log("=".repeat(60));
console.log(`Source run: ${SOURCE_JOB_ID}`);
console.log(`Test job_id: ${TEST_JOB_ID}`);
console.log(`Final decision: ${finalDecision.decision}`);
console.log(`Validator executed: ${postValidation.validator_executed}`);
console.log(`Output files: ${JSON.stringify(finalDecision.output_files)}`);
console.log(`Output exists on disk: ${fs.existsSync(outputFilePath)}`);
console.log("=".repeat(60));

// --- Replicate extractValidationSignalsForTrainingLoop (exact same code from orchestrator.js) ---
function extractValidationSignalsForTrainingLoop(postValidation) {
  if (!postValidation) return {};
  const signals = postValidation.analyzer_signals || {};
  const failedRules = (postValidation.rule_engine && postValidation.rule_engine.failed_rules) || [];
  const failedChecks = postValidation.failed_checks || [];
  const forbiddenHits = postValidation.forbidden_hits || [];
  const allFails = [...failedRules, ...failedChecks, ...forbiddenHits].map(s => String(s).toLowerCase());

  return {
    silhouette_clear: signals.mesh_deformation_delta === 0 && signals.boundary_intersection === 0
      ? true
      : (signals.mesh_deformation_delta > 0 || signals.boundary_intersection > 0 ? false : undefined),
    plastic_read: typeof signals.pvc_plastic_read === "number"
      ? signals.pvc_plastic_read >= 0.5
      : allFails.some(f => f.includes("plastic") || f.includes("pvc")),
    texture_only: allFails.some(f => f.includes("texture_only")),
    object_count: allFails.some(f => f.includes("multi_object") || f.includes("disconnected")) ? 2 : 1,
    eyes_visible: typeof signals.human_eyes_detected === "number"
      ? signals.human_eyes_detected >= 0.5
      : allFails.some(f => f.includes("eyes") || f.includes("human_eyes")),
  };
}

// --- Replicate runTrainingLoopOnReject (exact same code from orchestrator.js) ---
function nowIso() { return new Date().toISOString(); }
function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  return filePath;
}

const runDir = path.join(RUNS_DIR, TEST_JOB_ID);
fs.mkdirSync(runDir, { recursive: true });

const trainingLoopArtifactPath = path.join(runDir, "training_loop_result.json");

// --- GATE: Check all trigger conditions ---
const isReject = finalDecision && (finalDecision.decision === "REJECT" || finalDecision.status === "FAIL");
const validatorExecuted = !!(postValidation && postValidation.validator_executed === true);
const hasOutputFiles = !!(finalDecision && finalDecision.output_files && finalDecision.output_files.length > 0);
const hasRealImage = !!(outputFilePath && fs.existsSync(outputFilePath));

console.log("\n--- GATE CHECK ---");
console.log(`isReject: ${isReject}`);
console.log(`validatorExecuted: ${validatorExecuted}`);
console.log(`hasOutputFiles: ${hasOutputFiles}`);
console.log(`hasRealImage: ${hasRealImage}`);

const allGatesPassed = isReject && validatorExecuted && hasOutputFiles && hasRealImage;
console.log(`ALL GATES PASSED: ${allGatesPassed}`);

if (!allGatesPassed) {
  console.error("\n[FAIL] Gate check failed — cannot proceed with training loop test.");
  process.exit(1);
}

// --- Run training loop (exact same flow as orchestrator hook) ---
let testPassed = true;
const results = {};

try {
  console.log(`\n[TRAINING_LOOP] triggered for REJECT job: ${TEST_JOB_ID}`);

  // Step 1: Extract signals and classify
  const validationSignals = extractValidationSignalsForTrainingLoop(postValidation);
  console.log(`\n--- Extracted Validation Signals ---`);
  console.log(JSON.stringify(validationSignals, null, 2));

  const failureAnalysis = classifyFailure(validationSignals, finalDecision);
  console.log(`[TRAINING_LOOP] failure_class: ${JSON.stringify(failureAnalysis.failure_class)}`);
  results.failure_analysis = failureAnalysis;

  // Step 2: Generate patch plan
  const patchPlan = generatePatchPlan(failureAnalysis.failure_class);
  console.log(`[TRAINING_LOOP] patch actions: ${JSON.stringify(patchPlan.actions)}`);
  results.patch_plan = patchPlan;

  // Step 3: Mock A/B retest
  const jobForRetest = { ...job, failure_class: failureAnalysis.failure_class };
  const abResult = runABRetest(jobForRetest, patchPlan);
  console.log(`[TRAINING_LOOP] ab improved: ${abResult.delta.improved}`);
  results.ab_result = abResult;

  // Step 4: Write training case to memory
  writeTrainingCase({
    job_id: TEST_JOB_ID,
    failure_class: failureAnalysis.failure_class,
    patch_plan: patchPlan,
    ab_result: abResult,
  });
  console.log(`[TRAINING_LOOP] case written`);

  // Step 5: Write artifact
  writeJson(trainingLoopArtifactPath, {
    job_id: TEST_JOB_ID,
    triggered: true,
    failure_analysis: {
      failure_class: failureAnalysis.failure_class,
      primary_failure: failureAnalysis.primary_failure,
      severity: failureAnalysis.severity,
    },
    patch_plan: {
      patch_targets: patchPlan.patch_targets,
      actions: patchPlan.actions,
    },
    ab_result: abResult,
    timestamp: nowIso(),
  });

} catch (err) {
  console.warn(`[TRAINING_LOOP][WARN] ${err.message}`);
  writeJson(trainingLoopArtifactPath, {
    job_id: TEST_JOB_ID,
    triggered: true,
    error: err.message,
    timestamp: nowIso(),
  });
  testPassed = false;
}

// --- VERIFICATION ---
console.log("\n" + "=".repeat(60));
console.log("VERIFICATION");
console.log("=".repeat(60));

// Check 1: training_loop_result.json exists
const artifactExists = fs.existsSync(trainingLoopArtifactPath);
console.log(`\n[CHECK] training_loop_result.json exists: ${artifactExists}`);
if (artifactExists) {
  const artifact = JSON.parse(fs.readFileSync(trainingLoopArtifactPath, "utf-8"));
  console.log(`[CHECK] triggered: ${artifact.triggered}`);
  console.log(`[CHECK] failure_analysis present: ${!!artifact.failure_analysis}`);
  console.log(`[CHECK] patch_plan present: ${!!artifact.patch_plan}`);
  console.log(`[CHECK] ab_result present: ${!!artifact.ab_result}`);
  if (artifact.error) {
    console.log(`[CHECK] ERROR: ${artifact.error}`);
    testPassed = false;
  }
}

// Check 2: memory/training_cases.json has entry
const memoryCasesPath = path.join(__dirname, "memory", "training_cases.json");
const memoryCasesExist = fs.existsSync(memoryCasesPath);
console.log(`\n[CHECK] memory/training_cases.json exists: ${memoryCasesExist}`);
if (memoryCasesExist) {
  const cases = JSON.parse(fs.readFileSync(memoryCasesPath, "utf-8"));
  const ourCase = cases.find(c => c.job_id === TEST_JOB_ID);
  console.log(`[CHECK] Case for ${TEST_JOB_ID} found: ${!!ourCase}`);
  if (!ourCase) testPassed = false;
}

// Check 3: finalDecision not modified
console.log(`\n[CHECK] finalDecision.decision still: ${finalDecision.decision}`);
console.log(`[CHECK] finalDecision.status still: ${finalDecision.status}`);
if (finalDecision.decision !== "REJECT") testPassed = false;

console.log("\n" + "=".repeat(60));
if (testPassed) {
  console.log("✅ LIVE REJECT JOB TEST — PASSED");
} else {
  console.log("❌ LIVE REJECT JOB TEST — FAILED");
}
console.log("=".repeat(60));
