// Wait for test completion and verify
const router = require('./telegram_bot/router');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitAndVerify() {
  console.log('Waiting for telegram_test_1774765069657 to complete...\n');
  
  let attempts = 0;
  const maxAttempts = 30; // 2.5 minutes max
  
  while (attempts < maxAttempts) {
    await sleep(5000);
    attempts++;
    
    // Check shared_state
    const statePath = path.join(process.cwd(), 'data/shared_state.json');
    let state = {};
    try {
      if (fs.existsSync(statePath)) {
        state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      }
    } catch (e) {}
    
    // Check if run folder exists with final_decision.json
    const runPath = path.join(process.cwd(), 'runs/telegram_test_1774765069657');
    const hasFinalDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
    const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
    
    console.log(`[${attempts}/${maxAttempts}] runState: ${state.runState || 'UNKNOWN'} | activeJobId: ${state.activeJobId || 'NONE'} | final_decision: ${hasFinalDecision} | output: ${hasOutput}`);
    
    // Check if job is done
    if (!state.activeJobId && hasFinalDecision) {
      console.log('\n✓ Job completed!\n');
      break;
    }
  }
  
  console.log('\n=== RUNNING /proof ===\n');
  const proofResult = await router.handleCommand('/proof', {});
  console.log(proofResult);
  
  // Check final state
  const statePath = path.join(process.cwd(), 'data/shared_state.json');
  let finalState = {};
  try {
    if (fs.existsSync(statePath)) {
      finalState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    }
  } catch (e) {}
  
  console.log('\n=== FINAL SHARED_STATE ===');
  console.log(JSON.stringify(finalState, null, 2));
}

waitAndVerify().catch(console.error);
