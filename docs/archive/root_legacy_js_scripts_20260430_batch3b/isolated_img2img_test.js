/**
 * ISOLATED TEST: Verify buildRenderPacket patches work correctly
 */

const fs = require('fs');
const path = require('path');

// Load the patched render_executor
const { buildRenderPacket } = require('./render/render_executor.js');

const TEST_JOB_ID = `isolated_img2img_test_${Date.now()}`;

// Test anchor path
const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');

console.log('=== ISOLATED buildRenderPacket TEST ===');
console.log(`Job ID: ${TEST_JOB_ID}`);
console.log(`Anchor: ${ANCHOR_IMAGE_PATH}`);

// Pre-flight
if (!fs.existsSync(ANCHOR_IMAGE_PATH)) {
  console.error('❌ ANCHOR_MISSING');
  process.exit(1);
}

// Create test job with render.input_image
const job = {
  job_id: TEST_JOB_ID,
  render: {
    input_image: ANCHOR_IMAGE_PATH,
    denoise_strength: 0.01
  }
};

// Create translation result
const translationResult = {
  positive_prompt: "test prompt",
  negative_prompt: "test negative"
};

// Create render opts
const renderOpts = {
  width: 1024,
  height: 1024
};

console.log('\nCalling buildRenderPacket...');

try {
  const packet = buildRenderPacket(translationResult, renderOpts, job);
  
  console.log('\n=== RESULT ===');
  console.log(`input_image: ${packet.input_image || 'MISSING'}`);
  console.log(`denoise_strength: ${packet.denoise_strength}`);
  console.log(`anchor_image_base64: ${packet.anchor_image_base64 ? 'PRESENT' : 'MISSING'}`);
  console.log(`anchor_image_base64 length: ${packet.anchor_image_base64 ? packet.anchor_image_base64.length : 0}`);
  console.log(`generation_mode: ${packet.generation_mode}`);
  console.log(`reproduction_anchor_mode: ${packet.reproduction_anchor_mode}`);
  console.log(`anchor_image_path: ${packet.anchor_image_path || 'MISSING'}`);
  
  // Check if payload was saved
  const runDir = path.join(process.cwd(), 'runs', TEST_JOB_ID);
  const payloadPath = path.join(runDir, 'render_payload.json');
  
  if (fs.existsSync(payloadPath)) {
    console.log(`\n✅ Payload saved to: ${payloadPath}`);
    const saved = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
    console.log(`Saved input_image: ${saved.input_image ? 'PRESENT' : 'MISSING'}`);
    console.log(`Saved anchor_image_base64: ${saved.anchor_image_base64 ? 'PRESENT' : 'MISSING'}`);
  } else {
    console.log('\n❌ Payload file not saved');
  }
  
  // Verify all assertions
  const checks = [
    ['input_image exists', !!packet.input_image],
    ['denoise_strength set', packet.denoise_strength === 0.01],
    ['anchor_image_base64 exists', !!packet.anchor_image_base64],
    ['anchor_image_base64 length > 100', packet.anchor_image_base64 && packet.anchor_image_base64.length > 100],
    ['generation_mode is reproduction', packet.generation_mode === 'reproduction'],
    ['reproduction_anchor_mode is image_anchored', packet.reproduction_anchor_mode === 'image_anchored'],
    ['anchor_image_path set', !!packet.anchor_image_path]
  ];
  
  console.log('\n=== CHECKS ===');
  let allPassed = true;
  for (const [name, passed] of checks) {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
    if (!passed) allPassed = false;
  }
  
  console.log('\n' + (allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'));
  process.exit(allPassed ? 0 : 1);
  
} catch (err) {
  console.error('\n❌ ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
}
