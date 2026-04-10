/**
 * PHASE 1: DIRECT FOOOCUS BRIDGE IMG2IMG TEST
 * Bypass orchestrator completely, hit bridge directly
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_ID = `direct_bridge_test_${Date.now()}`;
const TEST_DIR = path.join(process.cwd(), 'runs', TEST_ID);

// Known valid anchor
const ANCHOR_IMAGE_PATH = path.join(process.cwd(), 'runs', 'GOLDEN_CERAMIC_MACRO', 'attempt-01', 'candidates', 'candidate-01', 'output.png');
const BRIDGE_URL = 'http://127.0.0.1:7865/generate';

console.log('=== PHASE 1: DIRECT FOOOCUS BRIDGE IMG2IMG TEST ===');
console.log(`Test ID: ${TEST_ID}`);
console.log(`Bridge: ${BRIDGE_URL}`);
console.log(`Anchor: ${ANCHOR_IMAGE_PATH}`);

// Pre-flight: verify anchor exists
if (!fs.existsSync(ANCHOR_IMAGE_PATH)) {
  console.error('❌ ANCHOR_MISSING');
  process.exit(1);
}

// Create test directory
if (!fs.existsSync(TEST_DIR)) {
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Read and encode anchor image
const imageBuffer = fs.readFileSync(ANCHOR_IMAGE_PATH);
const imageBase64 = imageBuffer.toString('base64');

console.log(`\nAnchor file size: ${imageBuffer.length} bytes`);
console.log(`Base64 length: ${imageBase64.length} chars`);

// Build minimal IMG2IMG payload
const payload = {
  prompt: "minimal transformation test, preserve original shape",
  negative_prompt: "noise, blur, distortion, abstract pattern",
  seed: -1,
  width: 1024,
  height: 1024,
  steps: 10,
  performance_selection: "Speed",
  guidance_scale: 7.0,
  sharpness: 2.0,
  image_number: 1,
  disable_refiner: true,
  // IMG2IMG fields
  input_image: ANCHOR_IMAGE_PATH,
  denoise_strength: 0.01,
  anchor_image_base64: imageBase64,
  generation_mode: "reproduction",
  reproduction_anchor_mode: "image_anchored",
  anchor_image_path: ANCHOR_IMAGE_PATH
};

// Persist payload
const payloadPath = path.join(TEST_DIR, 'direct_payload_sent.json');
fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
console.log(`\n✅ Payload saved: ${payloadPath}`);

// Parse bridge URL
const url = new URL(BRIDGE_URL);

console.log(`\n🚀 Sending to bridge at ${BRIDGE_URL}...`);
const startMs = Date.now();

const req = http.request(
  {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(payload))
    },
    timeout: 300000 // 5 min timeout
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      const duration = ((Date.now() - startMs) / 1000).toFixed(1);
      console.log(`\n✅ Response received (${duration}s)`);
      console.log(`Status: ${res.statusCode}`);
      
      // Save raw response
      const responsePath = path.join(TEST_DIR, 'direct_response_raw.json');
      fs.writeFileSync(responsePath, data);
      console.log(`Response saved: ${responsePath}`);
      
      // Parse and analyze
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        console.error('❌ Failed to parse response:', e.message);
        console.log('\nRaw response (first 500 chars):');
        console.log(data.substring(0, 500));
        process.exit(1);
      }
      
      // Check for output image
      let outputPath = null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        outputPath = parsed[0].url;
      } else if (parsed.url) {
        outputPath = parsed.url;
      }
      
      const outputExists = outputPath && fs.existsSync(outputPath);
      
      console.log('\n' + '='.repeat(60));
      console.log('RESULTS');
      console.log('='.repeat(60));
      console.log(`Output path from bridge: ${outputPath || 'NOT PROVIDED'}`);
      console.log(`Output file exists: ${outputExists ? 'YES' : 'NO'}`);
      
      if (outputExists) {
        const stats = fs.statSync(outputPath);
        console.log(`Output size: ${(stats.size / 1024).toFixed(1)} KB`);
        
        // Copy to test dir for easy access
        const localOutput = path.join(TEST_DIR, 'output.png');
        fs.copyFileSync(outputPath, localOutput);
        console.log(`Copied to: ${localOutput}`);
      }
      
      // Verdict
      console.log('\n' + '='.repeat(60));
      console.log('VERDICT');
      console.log('='.repeat(60));
      
      if (!outputExists) {
        console.log('VERDICT: BRIDGE FAIL - No output image created');
        console.log('\nNext: Check bridge logs for errors');
      } else {
        console.log('VERDICT: BRIDGE EXECUTED - Image generated');
        console.log('\nIMPORTANT: Manually compare output.png to anchor:');
        console.log('  - SAME/NEAR-IDENTICAL = conditioning works ✅');
        console.log('  - RANDOM/DRIFT = conditioning not applied ❌');
      }
      
      process.exit(outputExists ? 0 : 1);
    });
  }
);

req.on('timeout', () => {
  console.error('\n❌ REQUEST TIMEOUT (>5min)');
  req.destroy();
  process.exit(1);
});

req.on('error', (err) => {
  console.error('\n❌ REQUEST ERROR:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.log('\nBridge not running at', BRIDGE_URL);
    console.log('Start bridge with: python scripts/fooocus_bridge.py');
  }
  process.exit(1);
});

req.write(JSON.stringify(payload));
req.end();

console.log('Request sent, waiting for response...');
