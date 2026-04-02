// E2E test - run image_test and wait for completion
const router = require('./telegram_bot/router');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function checkLatestTelegramRun() {
  const runsDir = path.join(process.cwd(), 'runs');
  try {
    if (!fs.existsSync(runsDir)) return null;
    const entries = fs.readdirSync(runsDir)
      .filter(e => e.startsWith('telegram_test_'))
      .map(e => {
        const stat = fs.statSync(path.join(runsDir, e));
        return { name: e, mtime: stat.mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);
    
    if (entries.length === 0) return null;
    
    const latest = entries[0];
    const runPath = path.join(runsDir, latest.name);
    const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
    const hasDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
    
    return { name: latest.name, hasOutput, hasDecision, complete: hasOutput && hasDecision };
  } catch (e) {
    return { error: e.message };
  }
}

async function runTest() {
  console.log('=== E2E IMAGE TEST ===\n');
  console.log('Timestamp:', new Date().toISOString());
  
  // Step 1: Run /image_test
  console.log('\n--- STEP 1: /image_test ---');
  const startResult = await router.handleCommand('/image_test', {});
  console.log('START OUTPUT:');
  console.log(startResult);
  console.log('');
  
  // Step 2: Wait for completion (up to 5 min)
  console.log('--- STEP 2: Waiting for completion ---');
  let attempts = 0;
  const maxAttempts = 60;
  let completed = false;
  
  while (attempts < maxAttempts && !completed) {
    await sleep(5000);
    attempts++;
    
    const runStatus = await checkLatestTelegramRun();
    console.log(`[${attempts}/${maxAttempts}] Run status:`, runStatus ? JSON.stringify(runStatus) : 'No runs yet');
    
    if (runStatus && runStatus.complete) {
      completed = true;
      console.log('✓ Job completed!\n');
    }
  }
  
  if (!completed) {
    console.log('✗ Timeout waiting for completion\n');
  }
  
  // Step 3: Run /proof
  console.log('--- STEP 3: /proof (after test) ---');
  const proofResult = await router.handleCommand('/proof', {});
  console.log('PROOF OUTPUT:');
  console.log(proofResult);
  
  console.log('\n=== TEST COMPLETE ===');
}

runTest().catch(e => {
  console.error('FATAL ERROR:', e.message);
  console.error(e.stack);
});
