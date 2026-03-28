const fs = require('fs');

try {
  const { spawn } = require('child_process');
  
  console.log('=== RUNNING ORCHESTRATOR TEST ===');
  
  const child = spawn('node', ['orchestrator.js', 'weapon_baseline_test_job.json'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: __dirname
  });
  
  let stdout = '';
  let stderr = '';
  
  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });
  
  child.on('close', (code) => {
    console.log('Exit code:', code);
    console.log('STDOUT:');
    console.log(stdout);
    console.log('STDERR:');
    console.log(stderr);
    
    // Check if run directory was created
    if (fs.existsSync('runs/WEAPON_BASELINE_TEST_001')) {
      console.log('=== RUN DIRECTORY CREATED ===');
      const files = fs.readdirSync('runs/WEAPON_BASELINE_TEST_001');
      console.log('Files:', files);
      
      if (fs.existsSync('runs/WEAPON_BASELINE_TEST_001/final_decision.json')) {
        const decision = JSON.parse(fs.readFileSync('runs/WEAPON_BASELINE_TEST_001/final_decision.json', 'utf8'));
        console.log('=== FINAL DECISION ===');
        console.log('Status:', decision.status);
        console.log('Decision:', decision.decision);
        console.log('Reason:', decision.decision_reason);
        console.log('Baseline applied:', decision.baseline_applied);
        console.log('Preservation mode used:', decision.preservation_mode_used);
      }
    } else {
      console.log('=== NO RUN DIRECTORY CREATED ===');
    }
  });
  
  child.on('error', (error) => {
    console.error('Process error:', error);
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
