// Wait for test completion and capture /proof
const router = require('./telegram_bot/router');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForCompletion() {
  console.log('Waiting for telegram_test run to complete...\n');
  
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes
  
  while (attempts < maxAttempts) {
    await sleep(5000);
    attempts++;
    
    const runsDir = path.join(process.cwd(), 'runs');
    if (!fs.existsSync(runsDir)) continue;
    
    const runs = fs.readdirSync(runsDir)
      .filter(e => e.startsWith('telegram_test_'))
      .sort();
    
    if (runs.length > 0) {
      const latest = runs[runs.length - 1];
      const runPath = path.join(runsDir, latest);
      const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
      const hasDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
      
      console.log(`[${attempts}/${maxAttempts}] ${latest}: output=${hasOutput} decision=${hasDecision}`);
      
      if (hasOutput && hasDecision) {
        console.log('\n✓ Run completed!\n');
        return latest;
      }
    }
  }
  
  console.log('\n✗ Timeout - run did not complete in time\n');
  return null;
}

async function main() {
  const completedRun = await waitForCompletion();
  
  console.log('=== FINAL /proof OUTPUT ===\n');
  const proofResult = await router.handleCommand('/proof', {});
  console.log(proofResult);
  
  if (completedRun) {
    console.log('\n=== COMPLETED RUN ===');
    console.log('Run ID:', completedRun);
  }
}

main().catch(e => console.error('FATAL:', e.message));
