const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Create test job
const testJob = {
  job_id: 'test_orchestrator_e2e_' + Date.now(),
  user_idea: 'Single manufactured ceramic respirator shell, matte B4C technical ceramic, macro product shot',
  job_type: 'test',
  priority: 'normal',
  mode: 'debug',
  requested_outputs: ['png', 'json']
};

// Create run directory
const runDir = path.join(ROOT, 'runs', testJob.job_id);
if (!fs.existsSync(runDir)) {
  fs.mkdirSync(runDir, { recursive: true });
}

// Write job file
const jobFile = path.join(ROOT, 'jobs', `${testJob.job_id}.json`);
const jobsDir = path.dirname(jobFile);
if (!fs.existsSync(jobsDir)) {
  fs.mkdirSync(jobsDir, { recursive: true });
}

fs.writeFileSync(jobFile, JSON.stringify(testJob, null, 2), 'utf8');

console.log(`[TEST] Created job: ${testJob.job_id}`);
console.log(`[TEST] Job file: ${jobFile}`);
console.log(`[TEST] Run directory: ${runDir}`);

// Run orchestrator
async function runOrchestrator() {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    console.log(`[TEST] Running orchestrator: node orchestrator.js ${jobFile}`);
    
    const child = spawn('node', ['orchestrator.js', jobFile], {
      stdio: 'pipe',
      cwd: ROOT
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log(`[ORCHESTRATOR] ${data.toString().trim()}`);
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log(`[ORCHESTRATOR ERR] ${data.toString().trim()}`);
    });
    
    child.on('close', (code) => {
      const result = {
        exitCode: code,
        stdout,
        stderr
      };
      
      console.log(`[TEST] Orchestrator exited with code: ${code}`);
      resolve(result);
    });
    
    // Timeout after 10 minutes
    setTimeout(() => {
      if (!child.killed) {
        child.kill();
        resolve({
          exitCode: -1,
          stdout,
          stderr: 'Process timed out after 10 minutes'
        });
      }
    }, 10 * 60 * 1000);
  });
}

// Check results
function checkResults() {
  const results = {
    output_png: false,
    output_png_path: null,
    output_png_size: 0,
    final_decision: false,
    final_decision_path: null,
    validator_executed: false,
    artifacts: []
  };
  
  // Check output.png
  const outputPath = path.join(runDir, 'output.png');
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    results.output_png = true;
    results.output_png_path = outputPath;
    results.output_png_size = stats.size;
  }
  
  // Check final_decision.json
  const decisionPath = path.join(runDir, 'final_decision.json');
  if (fs.existsSync(decisionPath)) {
    results.final_decision = true;
    results.final_decision_path = decisionPath;
    try {
      const decision = JSON.parse(fs.readFileSync(decisionPath, 'utf8'));
      results.final_decision_content = decision;
    } catch (e) {
      results.final_decision_error = e.message;
    }
  }
  
  // Check validator files
  const validatorPath = path.join(runDir, 'validator.json');
  if (fs.existsSync(validatorPath)) {
    results.validator_executed = true;
    try {
      const validator = JSON.parse(fs.readFileSync(validatorPath, 'utf8'));
      results.validator_content = validator;
    } catch (e) {
      results.validator_error = e.message;
    }
  }
  
  // List all artifacts
  try {
    const files = fs.readdirSync(runDir);
    results.artifacts = files.map(file => {
      const filePath = path.join(runDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        type: stats.isDirectory() ? 'directory' : 'file'
      };
    });
  } catch (e) {
    results.artifacts_error = e.message;
  }
  
  return results;
}

// Main execution
async function runTest() {
  try {
    console.log('[TEST] Starting orchestrator end-to-end test...');
    
    // Run orchestrator
    const orchestratorResult = await runOrchestrator();
    
    // Check results
    const results = checkResults();
    
    console.log('[TEST] RESULTS:');
    console.log(`  Output PNG exists: ${results.output_png}`);
    console.log(`  Output PNG size: ${results.output_png_size} bytes`);
    console.log(`  Final decision exists: ${results.final_decision}`);
    console.log(`  Validator executed: ${results.validator_executed}`);
    console.log(`  Artifacts: ${results.artifacts.map(a => a.name).join(', ')}`);
    
    // Write result
    const testResult = {
      job_id: testJob.job_id,
      success: results.output_png && results.final_decision,
      orchestrator_result: orchestratorResult,
      check_results: results
    };
    
    fs.writeFileSync(path.join(runDir, 'e2e_test_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
    
  } catch (error) {
    console.error('[TEST] FAILED:', error.message);
    
    const testResult = {
      job_id: testJob.job_id,
      success: false,
      error: error.message
    };
    
    fs.writeFileSync(path.join(runDir, 'e2e_test_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
  }
}

// Run test
runTest().then(result => {
  console.log('[TEST] FINAL RESULT:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('[TEST] FATAL ERROR:', error);
  process.exit(1);
});
