// Run /image_test then wait and capture /proof
const router = require('./telegram_bot/router');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function checkRun() {
  const runsDir = path.join(process.cwd(), 'runs');
  const entries = fs.readdirSync(runsDir)
    .filter(e => e.startsWith('telegram_test_'))
    .sort();
  return entries.length > 0 ? entries[entries.length - 1] : null;
}

async function runTest() {
  console.log('=== RUNNING /image_test ===');
  const result1 = await router.handleCommand('/image_test', {});
  console.log(result1);
  console.log('');
  
  // Wait for completion
  console.log('=== WAITING FOR COMPLETION (5 min max) ===');
  let attempts = 0;
  let completed = false;
  
  while (attempts < 60 && !completed) {
    await sleep(5000);
    attempts++;
    
    const run = await checkRun();
    if (run) {
      const runPath = path.join(process.cwd(), 'runs', run);
      const hasOutput = fs.existsSync(path.join(runPath, 'output.png'));
      const hasDecision = fs.existsSync(path.join(runPath, 'final_decision.json'));
      
      process.stdout.write(`[${attempts}/60] ${run} - output:${hasOutput} decision:${hasDecision}  \r`);
      
      if (hasOutput && hasDecision) {
        completed = true;
        console.log(`\n✓ Completed: ${run}`);
      }
    } else {
      process.stdout.write(`[${attempts}/60] No run yet...  \r`);
    }
  }
  
  console.log('');
  console.log('=== RUNNING /proof AFTER TEST ===');
  const result2 = await router.handleCommand('/proof', {});
  console.log(result2);
}

runTest().catch(e => {
  console.error('FATAL:', e.message);
  console.error(e.stack);
});
