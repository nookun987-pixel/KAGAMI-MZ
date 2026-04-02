/**
 * P0-3: Verify Gemini Final Gate
 * Check API key, response validation, logging
 */

const { getGeminiConfig } = require('./gemini_env');
const { validateGeminiRuntime } = require('./gemini_connector');

console.log('=== P0-3: GEMINI FINAL GATE VERIFICATION ===\n');

// Step 1: Check API Key loading
console.log('STEP 1: API Key Configuration');
console.log('-------------------------------------------');
const config = getGeminiConfig();
console.log('✓ Config loaded from gemini_env.js');
console.log(`  hasKey: ${config.hasKey}`);
console.log(`  source: ${config.source}`);
console.log(`  model: ${config.model}`);
console.log(`  envFileDetected: ${config.envFileDetected}`);
console.log(`  cwd: ${config.cwd}`);

if (!config.hasKey) {
  console.error('\n❌ CRITICAL: No API key found!');
  console.error('   Set GEMINI_API_KEY or GOOGLE_API_KEY in .env file');
  process.exit(1);
}

console.log('\n✅ API Key: LOADED');
console.log(`   Source: ${config.source}`);
console.log(`   Model: ${config.model}`);

// Step 2: Validate Gemini Runtime (API connectivity)
console.log('\n\nSTEP 2: API Connectivity Test');
console.log('-------------------------------------------');

validateGeminiRuntime().then(result => {
  console.log(`✓ API Test completed`);
  console.log(`  ok: ${result.ok}`);
  console.log(`  http_status: ${result.http_status}`);
  console.log(`  error: ${result.error || 'NONE'}`);
  console.log(`  model: ${result.model}`);
  
  if (result.error) {
    console.error('\n❌ CRITICAL: Gemini API connection failed!');
    console.error(`   Error: ${result.error}`);
    if (result.error === 'GEMINI_HTTP_403') {
      console.error('   Reason: API key invalid or quota exceeded');
    }
    process.exit(1);
  }
  
  console.log('\n✅ Gemini API: CONNECTED');
  
  // Summary
  console.log('\n\n=== VERIFICATION SUMMARY ===');
  console.log('✅ API Key: LOADED');
  console.log('✅ API Connection: SUCCESS');
  console.log('✅ Model: ' + config.model);
  console.log('\n🟢 GEMINI FINAL GATE: READY');
  console.log('\nExpected response fields:');
  console.log('  - gemini_validation_executed: true');
  console.log('  - parse_ok: true (if JSON valid)');
  console.log('  - pass_fail: "PASS" or "FAIL"');
  console.log('  - fail_rules: array of failed rules');
  console.log('  - wrong_reads: array of material misreads');
  
}).catch(err => {
  console.error('\n❌ UNEXPECTED ERROR:', err.message);
  process.exit(1);
});
