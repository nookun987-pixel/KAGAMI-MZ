// Live verification test for all operation commands
const path = require('path');
process.chdir('d:\\KAGAMI-MZ');

console.log('=== LIVE VERIFICATION TEST ===\n');
console.log('Testing /boot, /master_status, /proof, /heal commands\n');

const router = require('./telegram_bot/router');

async function runTest(name, command) {
  console.log(`\n--- ${name} ---`);
  console.log(`Command: ${command}`);
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    const start = Date.now();
    const result = await router.handleCommand(command, {});
    const elapsed = Date.now() - start;
    
    console.log(`Elapsed: ${elapsed}ms`);
    console.log('Output:');
    console.log(result);
    console.log('--- END ---\n');
    return { success: true, output: result, elapsed };
  } catch (e) {
    console.log('ERROR:', e.message);
    console.log('Stack:', e.stack);
    console.log('--- END ---\n');
    return { success: false, error: e.message };
  }
}

(async () => {
  const results = {};
  
  // Test 1: /master_status BEFORE boot
  results.status_before = await runTest('1. /master_status BEFORE boot', '/master_status');
  
  // Test 2: /proof BEFORE boot
  results.proof_before = await runTest('2. /proof BEFORE boot', '/proof');
  
  // Test 3: /boot
  results.boot = await runTest('3. /boot', '/boot');
  
  // Wait for services to start
  console.log('Waiting 15 seconds for services to start...');
  await new Promise(r => setTimeout(r, 15000));
  
  // Test 4: /master_status AFTER boot
  results.status_after = await runTest('4. /master_status AFTER boot', '/master_status');
  
  // Test 5: /proof AFTER boot
  results.proof_after = await runTest('5. /proof AFTER boot', '/proof');
  
  // Test 6: /heal
  results.heal = await runTest('6. /heal', '/heal');
  
  // Summary
  console.log('\n=== SUMMARY ===');
  for (const [name, result] of Object.entries(results)) {
    console.log(`${name}: ${result.success ? '✓ PASS' : '✗ FAIL'} ${result.elapsed ? `(${result.elapsed}ms)` : ''}`);
  }
  
  // Check services status
  console.log('\n=== SERVICE STATUS CHECK ===');
  const serviceRunner = require('./lib/service_runner');
  for (const svc of ['fooocus', 'ollama']) {
    const status = await serviceRunner.healthCheck(svc);
    console.log(`${svc}: ${status.status} (port ${status.port})`);
  }
})();
