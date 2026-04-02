// Simple command test - just run commands and output results
const router = require('./telegram_bot/router');

async function runCommands() {
  console.log('=== COMMAND OUTPUTS ===\n');
  
  // 1. /master_status
  console.log('--- /master_status ---');
  try {
    const r1 = await router.handleCommand('/master_status', {});
    console.log(r1);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  
  console.log('\n--- /proof ---');
  try {
    const r2 = await router.handleCommand('/proof', {});
    console.log(r2);
  } catch(e) {
    console.log('ERROR:', e.message);
  }
  
  console.log('\n--- /image_test ---');
  try {
    const r3 = await router.handleCommand('/image_test', {});
    console.log(r3);
  } catch(e) {
    console.log('ERROR:', e.message);
    console.log(e.stack);
  }
  
  console.log('\n=== END ===');
}

runCommands();
