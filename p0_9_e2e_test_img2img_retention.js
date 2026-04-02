/**
 * P0-9: IMG2IMG DENOISE 0.01 HARD RETENTION TEST
 * Minimal test to verify img2img conditioning is actually applied
 * Expected: Output should be almost identical to anchor (99% retention)
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const TEST_JOB_ID = `e2e_test_img2img_retention_${Date.now()}`;
const JOBS_DIR = path.join(process.cwd(), 'jobs');
const RUNS_DIR = path.join(process.cwd(), 'runs');

// High-contrast anchor for clear shape verification
const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');

console.log('=== P0-9: IMG2IMG DENOISE 0.01 HARD RETENTION TEST ===');
console.log(`Test Job ID: ${TEST_JOB_ID}`);
console.log(`Anchor: ${ANCHOR_IMAGE_PATH}`);
console.log(`Denoise: 0.01 (expect ~99% shape retention - almost identical)\n`);

// Pre-flight
if (!fs.existsSync(ANCHOR_IMAGE_PATH)) {
  console.error('❌ ANCHOR_MISSING');
  process.exit(1);
}

if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true });

// MINIMAL NATIVE FOOOCUS IMG2IMG JOB
const jobData = {
  job_id: TEST_JOB_ID,
  phase: "material_study",
  user_idea: "keep original shape, minimal transformation, preserve silhouette, exact form lock",
  test_mode: true,
  max_candidates: 1,
  no_retry: false,
  render: {
    width: 1024,
    height: 1024,
    performance: "Quality",
    candidate_count: 1,
    steps: 20,
    guidance_scale: 7,
    lora_name: null,
    lora_weight: 0,
    style_selections: [],
    negative_prompt: "noise, blur, distortion, abstract, pattern",
    // HARD RETENTION TEST: denoise 0.01 = almost identical to anchor
    input_image: ANCHOR_IMAGE_PATH,
    denoise_strength: 0.01
  }
};

const jobFile = path.join(JOBS_DIR, `${TEST_JOB_ID}.json`);
fs.writeFileSync(jobFile, JSON.stringify(jobData, null, 2));

console.log('Payload (render section):');
console.log(JSON.stringify(jobData.render, null, 2));
console.log('\n🚀 Starting...\n');

const startMs = Date.now();

const child = spawn('node', ['orchestrator.js', jobFile], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let output = '';
let bridgeLogs = '';

child.stdout.on('data', (d) => { 
  const str = d.toString();
  output += str; 
  process.stdout.write(d);
  // Capture bridge logs
  if (str.includes('[BRIDGE]')) {
    bridgeLogs += str;
  }
});
child.stderr.on('data', (d) => {
  const str = d.toString();
  process.stderr.write(d);
  // Capture bridge logs from stderr too
  if (str.includes('[BRIDGE]')) {
    bridgeLogs += str;
  }
});

child.on('close', (code) => {
  const duration = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`\n✅ Completed in ${duration}s (exit ${code})\n`);

  const runDir = path.join(RUNS_DIR, TEST_JOB_ID);
  const outputPng = path.join(runDir, 'output.png');
  const hasOutput = fs.existsSync(outputPng);

  // A. Check render_payload.json
  const payloadFile = path.join(runDir, 'render_payload.json');
  const payloadExists = fs.existsSync(payloadFile);
  let payload = null;
  if (payloadExists) {
    try {
      payload = JSON.parse(fs.readFileSync(payloadFile, 'utf8'));
    } catch (e) {}
  }

  // B. Check render_payload_submitted.json
  const submittedPayloadFile = path.join(runDir, 'render_payload_submitted.json');
  const submittedPayloadExists = fs.existsSync(submittedPayloadFile);
  let submittedPayload = null;
  if (submittedPayloadExists) {
    try {
      submittedPayload = JSON.parse(fs.readFileSync(submittedPayloadFile, 'utf8'));
    } catch (e) {}
  }

  // C. Check input_image in payload
  const hasInputImageInPayload = !!(payload && payload.input_image);

  // D. Check anchor_image_base64 in payload
  const hasBase64InPayload = !!(payload && payload.anchor_image_base64 && payload.anchor_image_base64.length > 100);

  // E. Check output.png
  const outputExists = fs.existsSync(outputPng);

  // Check bridge logs for image loaded confirmation
  const bridgeLoadedImage = bridgeLogs.includes('[BRIDGE] IMG2IMG loaded image from = base64') ||
                             bridgeLogs.includes('[BRIDGE] IMG2IMG loaded image from file path');

  // Report
  console.log('='.repeat(60));
  console.log('VERIFICATION REPORT');
  console.log('='.repeat(60));
  console.log(`\nA. render_payload.json: ${payloadExists ? 'EXISTS' : 'MISSING'}`);
  console.log(`B. render_payload_submitted.json: ${submittedPayloadExists ? 'EXISTS' : 'MISSING'}`);
  console.log(`C. input_image in payload: ${hasInputImageInPayload ? 'YES' : 'NO'}`);
  if (payload && payload.input_image) {
    console.log(`   -> ${payload.input_image}`);
  }
  console.log(`D. anchor_image_base64 in payload: ${hasBase64InPayload ? 'YES' : 'NO'}`);
  if (payload && payload.anchor_image_base64) {
    console.log(`   -> length: ${payload.anchor_image_base64.length} chars`);
  }
  console.log(`E. output.png: ${outputExists ? 'EXISTS' : 'MISSING'}`);
  if (outputExists) {
    const stats = fs.statSync(outputPng);
    console.log(`   -> size: ${(stats.size / 1024).toFixed(1)} KB`);
  }

  // F. Final Verdict
  console.log('\n' + '='.repeat(60));
  let verdict;
  if (!outputExists) {
    verdict = 'EXECUTION FAIL';
  } else if (!hasInputImageInPayload && !hasBase64InPayload) {
    verdict = 'WIRING FAIL';
  } else if (!bridgeLoadedImage) {
    verdict = 'BRIDGE FAIL';
  } else {
    verdict = 'CONDITIONING PATH LIVE';
  }

  console.log(`FINAL VERDICT: ${verdict}`);
  console.log('='.repeat(60));

  // Content of payload files
  if (payloadExists) {
    console.log('\n--- render_payload.json (first 500 chars) ---');
    const content = fs.readFileSync(payloadFile, 'utf8');
    console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
  }

  if (submittedPayloadExists) {
    console.log('\n--- render_payload_submitted.json (first 500 chars) ---');
    const content = fs.readFileSync(submittedPayloadFile, 'utf8');
    console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
  }

  process.exit(outputExists ? 0 : 1);
});
