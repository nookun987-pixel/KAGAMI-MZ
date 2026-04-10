// Full end-to-end test: /image_test -> wait -> /proof
const path = require('path');
process.chdir('d:\\KAGAMI-MZ');

const router = require('./telegram_bot/router');
const proofReader = require('./mikage-operator/lib/proof_reader');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function checkJobStatus() {
  const statePath = path.join(process.cwd(), 'data/shared_state.json');
  try {
    if (!fs.existsSync(statePath)) return { running: false };
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return {
      running: !!state.activeJobId,
      jobId: state.activeJobId,
      step: state.currentStep,
      runState: state.runState
    };
  } catch (e) {
    return { running: false, error: e.message };
  }
}

async function checkLatestRun() {
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
    
    // Check for completion markers
    const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
    const hasFinalDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
    
    let decision = null;
    if (hasFinalDecision) {
      try {
        const fd = JSON.parse(fs.readFileSync(path.join(runPath, 'final_decision.json'), 'utf8'));
        decision = fd.decision || fd.status;
      } catch (e) {}
    }
    
    return {
      runId: latest.name,
      hasOutput,
      hasFinalDecision,
      decision,
      complete: hasOutput && hasFinalDecision
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function runTest() {
  console.log('=== END-TO-END IMAGE TEST ===\n');
  console.log('Timestamp:', new Date().toISOString());
  
  // Step 1: Check initial state
  console.log('\n--- STEP 1: Initial State ---');
  const initialRun = await checkLatestRun();
  console.log('Initial run status:', initialRun ? JSON.stringify(initialRun, null, 2) : 'No runs');
  
  // Step 2: Run /image_test
  console.log('\n--- STEP 2: Running /image_test ---');
  const testResult = await router.handleCommand('/image_test', {});
  console.log('Telegram output:');
  console.log(testResult);
  
  // Step 3: Wait for completion
  console.log('\n--- STEP 3: Waiting for completion ---');
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max (5s intervals)
  
  while (attempts < maxAttempts) {
    await sleep(5000);
    attempts++;
    
    const status = await checkJobStatus();
    const runStatus = await checkLatestRun();
    
    console.log(`\n[Attempt ${attempts}/${maxAttempts}]`);
    console.log('Job status:', status.running ? `RUNNING (${status.jobId})` : 'NOT RUNNING');
    if (runStatus) {
      console.log('Run status:', runStatus.complete ? 'COMPLETE' : 'INCOMPLETE');
      console.log('  Run ID:', runStatus.runId);
      console.log('  Has output.png:', runStatus.hasOutput);
      console.log('  Has final_decision.json:', runStatus.hasFinalDecision);
      console.log('  Decision:', runStatus.decision || 'N/A');
    }
    
    // Check if job finished and run is complete
    if (!status.running && runStatus && runStatus.complete) {
      console.log('\n✓ Job completed!');
      break;
    }
    
    // Check if job finished but no run created
    if (!status.running && !runStatus) {
      console.log('\n✗ Job finished but no run created');
      break;
    }
  }
  
  // Step 4: Final /proof
  console.log('\n--- STEP 4: Final /proof ---');
  const proofResult = await router.handleCommand('/proof', {});
  console.log('Telegram output:');
  console.log(proofResult);
  
  // Step 5: Summary
  console.log('\n=== SUMMARY ===');
  const finalRun = await checkLatestRun();
  console.log('Final run:', finalRun ? JSON.stringify(finalRun, null, 2) : 'None');
  
  const sysProof = await proofReader.getSystemProof();
  console.log('\nSystem status:');
  console.log('  Fooocus:', sysProof.fooocus);
  console.log('  Ollama:', sysProof.ollama);
  console.log('  Gemini:', sysProof.gemini);
  console.log('  Vision:', sysProof.vision);
  
  const imageLane = await proofReader.getImageLaneProof();
  console.log('\nImage Lane:');
  console.log('  Latest run:', imageLane.latest_run_path || 'NONE');
  console.log('  Verdict:', imageLane.verdict);
  
  console.log('\n=== END ===');
}

runTest();
