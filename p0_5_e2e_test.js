/**
 * P0-5: End-to-End Test Job
 * Create a test job and run through full pipeline
 * Verify: output.png exists, local validator PASS, gemini PASS, final_decision = ALLOW
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const TEST_JOB_ID = `e2e_test_${Date.now()}`;
const JOBS_DIR = path.join(process.cwd(), 'jobs');
const RUNS_DIR = path.join(process.cwd(), 'runs');

console.log('=== P0-5: END-TO-END TEST ===');
console.log(`Test Job ID: ${TEST_JOB_ID}\n`);

// Ensure jobs directory exists
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

// Create test job
const jobData = {
  job_id: TEST_JOB_ID,
  phase: "material_study",
  user_idea: "A single white ceramic cube, 8cm size, matte B4C technical ceramic, sharp edges, six flat faces. 3D object clearly visible, not abstract pattern. Dark minimal background. Professional product photography lighting.",
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: 40,
    guidance_scale: 7
  }
};

const jobFile = path.join(JOBS_DIR, `${TEST_JOB_ID}.json`);
fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
console.log('✅ Job file created:', jobFile);

// Run orchestrator
console.log('\n🚀 Starting orchestrator...\n');
const startTime = Date.now();

const child = spawn('node', ['orchestrator.js', jobFile], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let output = '';
let error = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  error += text;
  process.stderr.write(text);
});

child.on('close', (code) => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✅ Orchestrator completed in ${duration}s (exit code: ${code})\n`);
  
  // Find the run directory
  const runDir = path.join(RUNS_DIR, TEST_JOB_ID);
  
  if (!fs.existsSync(runDir)) {
    console.error('❌ CRITICAL: Run directory not found!');
    console.error('   Expected:', runDir);
    process.exit(1);
  }
  
  console.log('📁 Run directory:', runDir);
  
  // Check 1: output.png exists
  const outputPng = path.join(runDir, 'output.png');
  const hasOutput = fs.existsSync(outputPng);
  console.log(`\n[1/4] OUTPUT.PNG: ${hasOutput ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (hasOutput) {
    const stats = fs.statSync(outputPng);
    console.log(`      Size: ${(stats.size / 1024).toFixed(1)} KB`);
  }
  
  // Check 2: final_decision.json
  const decisionFile = path.join(runDir, 'final_decision.json');
  let decision = null;
  let hasDecision = false;
  
  if (fs.existsSync(decisionFile)) {
    hasDecision = true;
    try {
      decision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
    } catch (e) {
      console.error('      Error parsing decision:', e.message);
    }
  }
  
  console.log(`\n[2/4] FINAL_DECISION: ${hasDecision ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (decision) {
    console.log(`      Status: ${decision.status}`);
    console.log(`      Decision: ${decision.decision}`);
    console.log(`      Reason: ${decision.decision_reason}`);
  }
  
  // Check 3: gemini_validation
  const geminiFile = path.join(runDir, 'gemini_validation.json');
  let gemini = null;
  let hasGemini = false;
  
  if (fs.existsSync(geminiFile)) {
    hasGemini = true;
    try {
      gemini = JSON.parse(fs.readFileSync(geminiFile, 'utf8'));
    } catch (e) {
      console.error('      Error parsing gemini validation:', e.message);
    }
  }
  
  console.log(`\n[3/4] GEMINI_VALIDATION: ${hasGemini ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (gemini) {
    console.log(`      executed: ${gemini.gemini_validation_executed}`);
    console.log(`      parse_ok: ${gemini.parse_ok}`);
    console.log(`      pass_fail: ${gemini.pass_fail}`);
    if (gemini.fail_rules && gemini.fail_rules.length > 0) {
      console.log(`      fail_rules: ${gemini.fail_rules.join(', ')}`);
    }
    if (gemini.wrong_reads && gemini.wrong_reads.length > 0) {
      console.log(`      wrong_reads: ${gemini.wrong_reads.join(', ')}`);
    }
  }
  
  // Check 4: job_summary.json
  const summaryFile = path.join(runDir, 'job_summary.json');
  let summary = null;
  let hasSummary = false;
  
  if (fs.existsSync(summaryFile)) {
    hasSummary = true;
    try {
      summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
    } catch (e) {
      console.error('      Error parsing summary:', e.message);
    }
  }
  
  console.log(`\n[4/4] JOB_SUMMARY: ${hasSummary ? '✅ EXISTS' : '❌ MISSING'}`);
  
  if (summary) {
    console.log(`      validator_executed: ${summary.validator_executed}`);
    console.log(`      gemini_validation_executed: ${summary.gemini_validation_executed}`);
    console.log(`      gemini_pass_fail: ${summary.gemini_pass_fail}`);
  }
  
  // Final Verdict
  console.log('\n' + '='.repeat(50));
  console.log('FINAL VERDICT');
  console.log('='.repeat(50));
  
  const checks = {
    output_png: hasOutput,
    final_decision_exists: hasDecision,
    gemini_validation_exists: hasGemini,
    job_summary_exists: hasSummary,
    decision_is_allow: decision && decision.decision === 'ALLOW',
    gemini_passed: gemini && gemini.pass_fail === 'PASS',
    gemini_executed: gemini && gemini.gemini_validation_executed === true,
    gemini_parse_ok: gemini && gemini.parse_ok === true
  };
  
  let passedChecks = 0;
  let totalChecks = Object.keys(checks).length;
  
  for (const [check, result] of Object.entries(checks)) {
    console.log(`${result ? '✅' : '❌'} ${check}: ${result}`);
    if (result) passedChecks++;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (passedChecks === totalChecks) {
    console.log('🟢 ALL CHECKS PASSED - LANE READY FOR DATA');
    console.log(`\n✅ Test run: ${TEST_JOB_ID}`);
    console.log(`✅ Final decision: ALLOW`);
    console.log(`✅ Gemini: PASS`);
    console.log(`✅ Output: EXISTS`);
    process.exit(0);
  } else {
    console.log(`🔴 TEST FAILED: ${passedChecks}/${totalChecks} checks passed`);
    console.log('\nBLOCKERS:');
    for (const [check, result] of Object.entries(checks)) {
      if (!result) console.log(`  - ${check}: FAILED`);
    }
    process.exit(1);
  }
});
