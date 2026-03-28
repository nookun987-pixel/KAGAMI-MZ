// Test script to verify command handlers work correctly
const path = require('path');

// Set up process.cwd() to be KAGAMI-MZ root
process.chdir('d:\\KAGAMI-MZ');

console.log('Testing command handlers...\n');

// Test 1: Check if master_control loads
console.log('TEST 1: Loading master_control...');
try {
  const masterControl = require('./lib/master_control');
  console.log('✓ master_control loaded');
  console.log('  - boot:', typeof masterControl.boot);
  console.log('  - heal:', typeof masterControl.heal);
  console.log('  - proof:', typeof masterControl.proof);
  console.log('  - masterStatus:', typeof masterControl.masterStatus);
} catch (e) {
  console.log('✗ master_control failed:', e.message);
}

// Test 2: Check if router loads
console.log('\nTEST 2: Loading router...');
try {
  const router = require('./telegram_bot/router');
  console.log('✓ router loaded');
  console.log('  - handleCommand:', typeof router.handleCommand);
} catch (e) {
  console.log('✗ router failed:', e.message);
  console.log('  Stack:', e.stack);
}

// Test 3: Test command parsing
console.log('\nTEST 3: Testing command parsing...');
try {
  const text1 = '/boot';
  const parts1 = text1.split(' ');
  const rawCommand1 = parts1[0];
  const command1 = rawCommand1.split('@')[0];
  console.log('  Input: "', text1, '" -> command: "', command1, '"');
  
  const text2 = '/boot@MyBot';
  const parts2 = text2.split(' ');
  const rawCommand2 = parts2[0];
  const command2 = rawCommand2.split('@')[0];
  console.log('  Input: "', text2, '" -> command: "', command2, '"');
} catch (e) {
  console.log('✗ parsing failed:', e.message);
}

// Test 4: Call proof handler directly (quick test)
console.log('\nTEST 4: Testing /proof handler...');
(async () => {
  try {
    const router = require('./telegram_bot/router');
    console.log('  Calling handleCommand("/proof")...');
    const result = await router.handleCommand('/proof', {});
    console.log('✓ /proof returned:', result ? result.substring(0, 100) + '...' : 'EMPTY');
  } catch (e) {
    console.log('✗ /proof failed:', e.message);
    console.log('  Stack:', e.stack);
  }
  
  // Test 5: Call master_status handler
  console.log('\nTEST 5: Testing /master_status handler...');
  try {
    const router = require('./telegram_bot/router');
    console.log('  Calling handleCommand("/master_status")...');
    const result = await router.handleCommand('/master_status', {});
    console.log('✓ /master_status returned:', result ? result.substring(0, 100) + '...' : 'EMPTY');
  } catch (e) {
    console.log('✗ /master_status failed:', e.message);
    console.log('  Stack:', e.stack);
  }
  
  console.log('\n--- All tests completed ---');
})();
