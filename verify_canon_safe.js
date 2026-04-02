// Wait for test completion and verify
const router = require('./telegram_bot/router');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitAndVerify() {
  console.log('Waiting for test job to complete...\n');
  
  let attempts = 0;
  const maxAttempts = 40; // ~3.5 minutes max
  
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
    
    // Find latest telegram_test run
    const runsDir = path.join(process.cwd(), 'runs');
    let latestRun = null;
    try {
      if (fs.existsSync(runsDir)) {
        const entries = fs.readdirSync(runsDir)
          .filter(e => e.startsWith('telegram_test_'))
          .sort();
        if (entries.length > 0) {
          latestRun = entries[entries.length - 1];
        }
      }
    } catch (e) {}
    
    if (latestRun) {
      const runPath = path.join(runsDir, latestRun);
      const hasFinalDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
      const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
      const hasAttempt = fs.existsSync(path.join(runPath, 'attempt-01'));
      
      console.log(`[${attempts}/${maxAttempts}] Run: ${latestRun} | runState: ${state.runState || 'UNKNOWN'} | activeJobId: ${state.activeJobId || 'NONE'} | final: ${hasFinalDecision} | output: ${hasOutput} | attempt: ${hasAttempt}`);
      
      // Check if job is done
      if (!state.activeJobId && hasFinalDecision) {
        console.log('\n✓ Job completed!\n');
        break;
      }
    } else {
      console.log(`[${attempts}/${maxAttempts}] No run folder yet...`);
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
  
  // Check latest run details
  const runsDir = path.join(process.cwd(), 'runs');
  let latestRun = null;
  try {
    if (fs.existsSync(runsDir)) {
      const entries = fs.readdirSync(runsDir)
        .filter(e => e.startsWith('telegram_test_'))
        .sort();
      if (entries.length > 0) {
        latestRun = entries[entries.length - 1];
      }
    }
  } catch (e) {}
  
  if (latestRun) {
    const runPath = path.join(runsDir, latestRun);
    const fdPath = path.join(runPath, 'final_decision.json');
    if (fs.existsSync(fdPath)) {
      const fd = JSON.parse(fs.readFileSync(fdPath, 'utf8'));
      console.log('\n=== FINAL_DECISION SUMMARY ===');
      console.log(`Job ID: ${fd.job_id}`);
      console.log(`Status: ${fd.status}`);
      console.log(`Decision: ${fd.decision}`);
      console.log(`Decision Reason: ${fd.decision_reason}`);
      console.log(`Validator Executed: ${fd.validator_executed}`);
      console.log(`Gemini Validation Executed: ${fd.gemini_validation_executed}`);
      console.log(`Attempt Count: ${fd.attempt_count}`);
      if (fd.precheck_status) {
        console.log(`Precheck Status: ${fd.precheck_status}`);
      }
    }
  }
}

waitAndVerify().catch(console.error);
