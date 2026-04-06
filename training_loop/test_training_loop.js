/**
 * training_loop/test_training_loop.js
 * End-to-end test for training loop
 */

const { classifyFailure } = require('./fail_classifier');
const { generatePatchPlan } = require('./patch_engine');
const { runABRetest } = require('./ab_retest_runner');
const { writeTrainingCase } = require('./training_case_writer');

console.log('='.repeat(60));
console.log('MIKAGE TRAINING LOOP V1 - END-TO-END TEST');
console.log('='.repeat(60));

// Mock input
const validationSignals = {
  silhouette_clear: false,
  plastic_read: true,
  texture_only: false,
  object_count: 2,
  eyes_visible: false
};

const finalDecision = {
  status: 'REJECT',
  reason: 'canon hard fail'
};

const originalJob = {
  job_id: 'TRAINING_LOOP_TEST_001'
};

console.log('\n[TEST] Mock Input:');
console.log(JSON.stringify({ validationSignals, finalDecision, originalJob }, null, 2));

console.log('\n' + '-'.repeat(60));
console.log('STEP 1: classifyFailure()');
console.log('-'.repeat(60));

const classification = classifyFailure(validationSignals, finalDecision);
console.log('\nResult:');
console.log(JSON.stringify(classification, null, 2));

console.log('\n' + '-'.repeat(60));
console.log('STEP 2: generatePatchPlan()');
console.log('-'.repeat(60));

const patchPlan = generatePatchPlan(classification.failure_class);
console.log('\nResult:');
console.log(JSON.stringify(patchPlan, null, 2));

console.log('\n' + '-'.repeat(60));
console.log('STEP 3: runABRetest()');
console.log('-'.repeat(60));

// Attach failure_class to job for retest
const jobWithFailures = {
  ...originalJob,
  failure_class: classification.failure_class
};

const abResult = runABRetest(jobWithFailures, patchPlan);
console.log('\nResult:');
console.log(JSON.stringify(abResult, null, 2));

console.log('\n' + '-'.repeat(60));
console.log('STEP 4: writeTrainingCase()');
console.log('-'.repeat(60));

const caseData = {
  job_id: originalJob.job_id,
  failure_class: classification.failure_class,
  patch_plan: patchPlan,
  ab_result: abResult
};

const writeSuccess = writeTrainingCase(caseData);

console.log('\n' + '='.repeat(60));
console.log('TEST VERIFICATION');
console.log('='.repeat(60));

// Verify expected values
const expectedFailures = [
  'SILHOUETTE_FAIL',
  'PLASTIC_MATERIAL_FAIL',
  'MULTI_OBJECT_FAIL'
];

console.log('\nExpected Failure Classes:');
console.log(JSON.stringify(expectedFailures));
console.log('Actual Failure Classes:');
console.log(JSON.stringify(classification.failure_class));

const expectedPrimary = 'MULTI_OBJECT_FAIL';
console.log(`\nExpected Primary: ${expectedPrimary}`);
console.log(`Actual Primary: ${classification.primary_failure}`);

const expectedSeverity = 'HIGH';
console.log(`\nExpected Severity: ${expectedSeverity}`);
console.log(`Actual Severity: ${classification.severity}`);

const expectedActions = [
  'inject_single_object_lock',
  'inject_no_fragment_rule',
  'inject_anti_plastic_negative',
  'inject_ceramic_microstructure',
  'reject_disconnected_shapes'
];

console.log('\nExpected Patch Actions:');
console.log(JSON.stringify(expectedActions.sort()));
console.log('Actual Patch Actions:');
console.log(JSON.stringify(patchPlan.actions.sort()));

console.log(`\nAB Result Improved: ${abResult.delta.improved}`);
console.log(`File Write Success: ${writeSuccess}`);

// Final pass/fail
const allChecks = [
  classification.failure_class.length === expectedFailures.length,
  classification.primary_failure === expectedPrimary,
  classification.severity === expectedSeverity,
  patchPlan.actions.length === expectedActions.length,
  abResult.delta.improved === true,
  writeSuccess === true
];

const allPassed = allChecks.every(Boolean);

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('✅ ALL TESTS PASSED');
} else {
  console.log('❌ SOME TESTS FAILED');
}
console.log('='.repeat(60));

// Show file location
const path = require('path');
const fs = require('fs');
const trainingFile = path.join(__dirname, '..', 'memory', 'training_cases.json');
if (fs.existsSync(trainingFile)) {
  console.log(`\nTraining cases file: ${trainingFile}`);
  const content = fs.readFileSync(trainingFile, 'utf-8');
  const cases = JSON.parse(content);
  console.log(`Total cases written: ${cases.length}`);
}
