/**
 * P0-7: ANCHOR CONTROL OBJECT-FORM TEST (DEBUG VERSION)
 * End-to-End test with image-to-image anchor control + full stage logging & timeouts
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const TEST_JOB_ID = `e2e_test_anchor_control_${Date.now()}`;
const JOBS_DIR = path.join(process.cwd(), 'jobs');
const RUNS_DIR = path.join(process.cwd(), 'runs');
const DEBUG_REPORT_PATH = path.join(RUNS_DIR, 'debug_anchor_control_report.json');

// Use existing ceramic reference as anchor
const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');

// Timeout constants (ms)
const TIMEOUTS = {
  PRECHECK: 10000,        // 10s for file checks
  RENDER_REQUEST: 60000,  // 60s for render request to be sent
  RENDER_POLLING: 600000, // 10min for render to complete
  OVERALL_TEST: 900000    // 15min overall test timeout
};

// Debug report structure
const debugReport = {
  test_job_id: TEST_JOB_ID,
  anchor_path: ANCHOR_IMAGE_PATH,
  anchor_exists: false,
  anchor_size_bytes: 0,
  anchor_readable: false,
  payload_built: false,
  payload_fields_checked: false,
  unsupported_control_fields: [],
  request_sent: false,
  response_received: false,
  run_dir_created: false,
  output_found: false,
  last_completed_stage: 'START_TEST',
  timeout_type: null,
  error_message: null,
  stages: {},
  timestamps: {},
  orchestrator_exit_code: null,
  orchestrator_duration_ms: 0
};

function logStage(stageName, message = '') {
  const timestamp = new Date().toISOString();
  debugReport.stages[stageName] = { timestamp, message };
  debugReport.timestamps[stageName] = Date.now();
  debugReport.last_completed_stage = stageName;
  console.log(`[${timestamp}] ${stageName}${message ? ': ' + message : ''}`);
}

function saveDebugReport() {
  try {
    fs.writeFileSync(DEBUG_REPORT_PATH, JSON.stringify(debugReport, null, 2));
    console.log(`\n📄 Debug report saved: ${DEBUG_REPORT_PATH}`);
  } catch (e) {
    console.error('Failed to save debug report:', e.message);
  }
}

function exitWithError(errorType, message) {
  debugReport.error_message = message;
  console.error(`\n❌ ${errorType}: ${message}`);
  saveDebugReport();
  process.exit(1);
}

// ==================== START TEST ====================
logStage('START_TEST', `Job ID: ${TEST_JOB_ID}`);
console.log('=== P0-7: ANCHOR CONTROL OBJECT-FORM TEST (DEBUG) ===\n');

// ==================== PRECHECK START ====================
logStage('PRECHECK_START');
const precheckStart = Date.now();

// 1. Verify anchor file path exists
const anchorExists = fs.existsSync(ANCHOR_IMAGE_PATH);
debugReport.anchor_exists = anchorExists;
logStage('PRECHECK_ANCHOR_EXISTS', `${anchorExists}`);

if (!anchorExists) {
  exitWithError('ANCHOR_PRECHECK_FAIL', `Anchor file missing: ${ANCHOR_IMAGE_PATH}`);
}

// 2. Get anchor file stats
let anchorStats;
try {
  anchorStats = fs.statSync(ANCHOR_IMAGE_PATH);
  debugReport.anchor_size_bytes = anchorStats.size;
  debugReport.anchor_readable = !!(anchorStats.mode & 0o444);
  logStage('PRECHECK_ANCHOR_STATS', `Size: ${anchorStats.size} bytes, Readable: ${debugReport.anchor_readable}`);
} catch (e) {
  exitWithError('ANCHOR_PRECHECK_FAIL', `Cannot stat anchor file: ${e.message}`);
}

// 3. Verify anchor file size > 0
if (anchorStats.size === 0) {
  exitWithError('ANCHOR_PRECHECK_FAIL', 'Anchor file is empty (0 bytes)');
}

// 4. Verify extension is valid image type
const validExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
const anchorExt = path.extname(ANCHOR_IMAGE_PATH).toLowerCase();
if (!validExtensions.includes(anchorExt)) {
  exitWithError('ANCHOR_PRECHECK_FAIL', `Invalid anchor extension: ${anchorExt}`);
}

// 5. Print exact normalized absolute anchor path
const normalizedAnchorPath = path.resolve(ANCHOR_IMAGE_PATH);
logStage('PRECHECK_NORMALIZED_PATH', normalizedAnchorPath);

// Check precheck timeout
const precheckDuration = Date.now() - precheckStart;
if (precheckDuration > TIMEOUTS.PRECHECK) {
  exitWithError('PRECHECK_TIMEOUT', `Precheck took ${precheckDuration}ms, exceeded ${TIMEOUTS.PRECHECK}ms`);
}

logStage('PRECHECK_OK', `Completed in ${precheckDuration}ms`);

// ==================== BUILD PAYLOAD ====================
logStage('BUILD_PAYLOAD_START');

// Ensure jobs directory exists
if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

// Define anchor control fields for compatibility check
const ANCHOR_CONTROL_FIELDS = [
  'generation_mode',
  'reproduction_anchor_mode',
  'anchor_strength',
  'denoise_strength',
  'silhouette_lock_strength',
  'composition_lock_strength',
  'preservation_mode',
  'anchor_method_used'
];

// Create test job with IMAGE-TO-IMAGE anchor control
const jobData = {
  job_id: TEST_JOB_ID,
  phase: "material_study",
  user_idea: "front-facing engineered ceramic industrial component, precision-manufactured matte white boron-carbide ceramic housing, exact symmetrical hard-surface geometry, clean beveled edges, visible mounting holes, readable industrial object silhouette, non-decorative, non-organic, premium studio isolation, controlled shadow, minimal environment, precision product photograph, tactile ceramic density, subtle mineral surface variation, no consumer gadget styling, no fashion styling",
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: 40,
    guidance_scale: 7,
    lora_name: null,
    lora_weight: 0,
    style_selections: [],
    negative_prompt: "toy, toy-like, plastic, pvc, glossy polymer, glossy plastic, rubber, resin figurine, cute rounded object, abstract sculpture, decorative ceramic art, vase, ornament, porcelain decor, soft form, fashion lighting, product ad glow, neon, magenta spill, cyberpunk, emissive lighting, overexposed studio wash, reflective plastic sheen, translucent material, glassy surface, consumer electronics look, cheap commercial render, oversaturated, crimson overuse, color drift, bloom, neon light, emissive",
    // ANCHOR CONTROL SETTINGS
    generation_mode: "reproduction",
    reproduction_anchor_mode: "image_anchored",
    anchor_image_path: normalizedAnchorPath,
    anchor_strength: 0.75,
    denoise_strength: 0.25,
    silhouette_lock_strength: 0.90,
    composition_lock_strength: 0.85,
    preservation_mode: "strong_preservation",
    anchor_method_used: "fooocus_ip_plus_vary"
  }
};

debugReport.payload_built = true;
logStage('BUILD_PAYLOAD_OK', `Anchor fields: ${ANCHOR_CONTROL_FIELDS.join(', ')}`);

// Write job file
const jobFile = path.join(JOBS_DIR, `${TEST_JOB_ID}.json`);
fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));
logStage('JOB_FILE_WRITTEN', jobFile);

// ==================== RENDER REQUEST ====================
logStage('RENDER_REQUEST_START');
console.log('\n🚀 Starting orchestrator with anchor control...');
console.log(`   Timeout settings:`);
console.log(`   - Render request: ${TIMEOUTS.RENDER_REQUEST}ms`);
console.log(`   - Render polling: ${TIMEOUTS.RENDER_POLLING}ms`);
console.log(`   - Overall test: ${TIMEOUTS.OVERALL_TEST}ms\n`);

const orchestratorStart = Date.now();
let renderRequestTimeout;
let overallTimeout;
let processExited = false;

const child = spawn('node', ['orchestrator.js', jobFile], {
  cwd: process.cwd(),
  stdio: 'pipe',
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
});

// Set up overall test timeout
overallTimeout = setTimeout(() => {
  if (!processExited) {
    debugReport.timeout_type = 'OVERALL_TEST_TIMEOUT';
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 5000);
    exitWithError('OVERALL_TEST_TIMEOUT', `Test exceeded ${TIMEOUTS.OVERALL_TEST}ms`);
  }
}, TIMEOUTS.OVERALL_TEST);

// Set up render request timeout (if no output after this time, something is wrong)
renderRequestTimeout = setTimeout(() => {
  if (!processExited && !debugReport.response_received) {
    debugReport.timeout_type = 'RENDER_REQUEST_TIMEOUT';
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 5000);
    exitWithError('RENDER_REQUEST_TIMEOUT', `No render response after ${TIMEOUTS.RENDER_REQUEST}ms`);
  }
}, TIMEOUTS.RENDER_REQUEST);

let stdoutData = '';
let stderrData = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  stdoutData += text;
  process.stdout.write(text);
  
  // Detect if we're past render request phase
  if (text.includes('Render request sent') || text.includes('render_payload') || text.includes('submitRender')) {
    if (!debugReport.request_sent) {
      debugReport.request_sent = true;
      logStage('RENDER_REQUEST_SENT');
    }
  }
  
  // Detect if render response received
  if (text.includes('output.png') || text.includes('render complete') || text.includes('Render response')) {
    if (!debugReport.response_received) {
      debugReport.response_received = true;
      clearTimeout(renderRequestTimeout);
      logStage('RENDER_RESPONSE_RECEIVED');
    }
  }
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  stderrData += text;
  process.stderr.write(text);
});

child.on('error', (err) => {
  debugReport.error_message = `Spawn error: ${err.message}`;
  exitWithError('SPAWN_ERROR', err.message);
});

child.on('close', (code) => {
  processExited = true;
  clearTimeout(overallTimeout);
  clearTimeout(renderRequestTimeout);
  
  const duration = Date.now() - orchestratorStart;
  debugReport.orchestrator_exit_code = code;
  debugReport.orchestrator_duration_ms = duration;
  
  logStage('ORCHESTRATOR_EXIT', `Exit code: ${code}, Duration: ${duration}ms`);
  
  if (code !== 0 && code !== null) {
    exitWithError('ORCHESTRATOR_ERROR', `Orchestrator exited with code ${code}`);
  }
  
  // ==================== OUTPUT VERIFY ====================
  logStage('OUTPUT_VERIFY_START');
  
  const runDir = path.join(RUNS_DIR, TEST_JOB_ID);
  debugReport.run_dir_created = fs.existsSync(runDir);
  
  if (!debugReport.run_dir_created) {
    // Check if we can find any run directory that was created
    const possibleRuns = fs.readdirSync(RUNS_DIR).filter(d => d.startsWith(TEST_JOB_ID.substring(0, 20)));
    if (possibleRuns.length > 0) {
      logStage('RUN_DIR_FOUND_ALT', `Found alternative run dir: ${possibleRuns[0]}`);
    }
    exitWithError('RUN_DIR_MISSING', `Run directory not created: ${runDir}`);
  }
  
  logStage('RUN_DIR_CREATED', runDir);
  
  // Check output.png
  const outputPng = path.join(runDir, 'output.png');
  debugReport.output_found = fs.existsSync(outputPng);
  
  if (debugReport.output_found) {
    const stats = fs.statSync(outputPng);
    logStage('OUTPUT_VERIFY_OK', `output.png exists, size: ${stats.size} bytes`);
  } else {
    logStage('OUTPUT_VERIFY_FAIL', 'output.png not found');
  }
  
  // ==================== VALIDATOR ====================
  logStage('VALIDATOR_START');
  const validatorFile = path.join(runDir, 'validator.json');
  const hasValidator = fs.existsSync(validatorFile);
  logStage('VALIDATOR_DONE', hasValidator ? 'validator.json exists' : 'validator.json missing');
  
  // ==================== GEMINI ====================
  logStage('GEMINI_START');
  const geminiFile = path.join(runDir, 'gemini_validation.json');
  const hasGemini = fs.existsSync(geminiFile);
  let gemini = null;
  
  if (hasGemini) {
    try {
      gemini = JSON.parse(fs.readFileSync(geminiFile, 'utf8'));
      logStage('GEMINI_DONE', `Status: ${gemini.pass_fail || 'unknown'}`);
    } catch (e) {
      logStage('GEMINI_DONE', `Error parsing: ${e.message}`);
    }
  } else {
    logStage('GEMINI_DONE', 'gemini_validation.json not found');
  }
  
  // ==================== FINAL DECISION ====================
  logStage('FINAL_DECISION_READ');
  const decisionFile = path.join(runDir, 'final_decision.json');
  const hasDecision = fs.existsSync(decisionFile);
  let decision = null;
  
  if (hasDecision) {
    try {
      decision = JSON.parse(fs.readFileSync(decisionFile, 'utf8'));
      logStage('FINAL_DECISION_WRITTEN', `Decision: ${decision.decision || 'unknown'}`);
    } catch (e) {
      logStage('FINAL_DECISION_ERROR', e.message);
    }
  } else {
    logStage('FINAL_DECISION_MISSING', 'final_decision.json not found');
  }
  
  // ==================== SUMMARY ====================
  console.log('\n' + '='.repeat(60));
  console.log('FINAL VERDICT - ANCHOR CONTROL OBJECT-FORM (i2i)');
  console.log('='.repeat(60));
  
  const checks = {
    anchor_exists: debugReport.anchor_exists,
    anchor_readable: debugReport.anchor_readable,
    payload_built: debugReport.payload_built,
    run_dir_created: debugReport.run_dir_created,
    output_found: debugReport.output_found,
    final_decision_exists: hasDecision,
    gemini_validation_exists: hasGemini,
    decision_is_allow: decision && decision.decision === 'ALLOW',
    gemini_passed: gemini && gemini.pass_fail === 'PASS'
  };
  
  let passedChecks = 0;
  let totalChecks = Object.keys(checks).length;
  
  for (const [check, result] of Object.entries(checks)) {
    console.log(`${result ? '✅' : '❌'} ${check}: ${result}`);
    if (result) passedChecks++;
  }
  
  console.log('='.repeat(60));
  console.log(`Result: ${passedChecks}/${totalChecks} checks passed`);
  
  // Save final debug report
  debugReport.checks = checks;
  debugReport.passed_checks = passedChecks;
  debugReport.total_checks = totalChecks;
  saveDebugReport();
  
  if (passedChecks === totalChecks) {
    console.log('\n🟢 ALL CHECKS PASSED - ANCHOR CONTROL TEST SUCCESS');
    process.exit(0);
  } else {
    console.log('\n🔴 TEST FAILED');
    process.exit(1);
  }
});
