// Complete test for all 4 operation commands
console.log('=== TESTING ALL 4 OPERATIONS COMMANDS ===\n');

const router = require('./telegram_bot/router');

async function testCommand(command) {
  console.log(`Testing ${command}...`);
  try {
    const result = await router.handleCommand(command, {});
    console.log('✓ SUCCESS');
    console.log('Response preview:');
    console.log(result ? result.split('\n').slice(0, 5).join('\n') : 'EMPTY');
    console.log(result ? '...' : '');
    console.log(`Output length: ${result ? result.length : 0} chars\n`);
    return true;
  } catch (e) {
    console.log('✗ FAILED:', e.message);
    console.log(e.stack, '\n');
    return false;
  }
}

(async () => {
  let passed = 0;
  let failed = 0;
  
  // Test /proof
  if (await testCommand('/proof')) passed++; else failed++;
  
  // Test /master_status
  if (await testCommand('/master_status')) passed++; else failed++;
  
  // Test /boot (may take longer due to service checks)
  console.log('Testing /boot (this may take 10-15 seconds)...');
  if (await testCommand('/boot')) passed++; else failed++;
  
  // Test /heal
  console.log('Testing /heal (this may take 10-15 seconds)...');
  if (await testCommand('/heal')) passed++; else failed++;
  
  console.log('=== RESULTS ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Status: ${failed === 0 ? 'ALL COMMANDS WORKING' : 'SOME COMMANDS FAILED'}`);
})();
