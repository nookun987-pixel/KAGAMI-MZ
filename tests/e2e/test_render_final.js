const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Create test job
const testJob = {
  job_id: 'test_render_final_' + Date.now(),
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

// Run orchestrator with final logging
async function runOrchestrator() {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    console.log(`[TEST] Running orchestrator: node orchestrator.js ${jobFile}`);
    
    const child = spawn('node', ['orchestrator.js', jobFile], {
      stdio: 'pipe',
      cwd: ROOT,
      env: {
        ...process.env,
        DEBUG: 'render*',
        LOG_LEVEL: 'debug'
      }
    });
    
    let stdout = '';
    let stderr = '';
    let requestSent = false;
    let responseReceived = false;
    let httpStatus = null;
    let responsePreview = null;
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      
      // Check for request sent
      if (text.includes('Sending render to')) {
        requestSent = true;
        console.log(`[TEST] ✓ Render request sent to Fooocus`);
      }
      
      // Check for response
      if (text.includes('HTTP ') && text.includes('response')) {
        responseReceived = true;
        const statusMatch = text.match(/HTTP (\d+)/);
        if (statusMatch) {
          httpStatus = statusMatch[1];
        }
        const previewMatch = text.match(/Response preview: (.+)/);
        if (previewMatch) {
          responsePreview = previewMatch[1];
        }
        console.log(`[TEST] ✓ Response received: HTTP ${httpStatus}`);
      }
      
      // Check for file capture
      if (text.includes('Final saved file path:')) {
        const pathMatch = text.match(/Final saved file path: (.+)/);
        if (pathMatch) {
          console.log(`[TEST] ✓ File captured: ${pathMatch[1]}`);
        }
      }
      
      console.log(`[ORCHESTRATOR] ${text.trim()}`);
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      console.log(`[ORCHESTRATOR ERR] ${text.trim()}`);
    });
    
    child.on('close', (code) => {
      const result = {
        exitCode: code,
        stdout,
        stderr,
        requestSent,
        responseReceived,
        httpStatus,
        responsePreview
      };
      
      console.log(`[TEST] Orchestrator exited with code: ${code}`);
      resolve(result);
    });
    
    // Timeout after 5 minutes
    setTimeout(() => {
      if (!child.killed) {
        child.kill();
        resolve({
          exitCode: -1,
          stdout,
          stderr,
          requestSent,
          responseReceived,
          httpStatus,
          responsePreview,
          timeout: true
        });
      }
    }, 5 * 60 * 1000);
  });
}

// Check final results
function checkResults() {
  const results = {
    output_png: false,
    output_png_path: null,
    output_png_size: 0,
    final_decision: false,
    final_decision_path: null,
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
    console.log('[TEST] Starting final render test...');
    
    // Run orchestrator
    const orchestratorResult = await runOrchestrator();
    
    // Check results
    const results = checkResults();
    
    console.log('\n[TEST] RESULTS:');
    console.log(`  ✓ Request sent to Fooocus: ${orchestratorResult.requestSent}`);
    console.log(`  ✓ Response received: ${orchestratorResult.responseReceived}`);
    console.log(`  ✓ HTTP Status: ${orchestratorResult.httpStatus}`);
    console.log(`  ✓ Response preview: ${orchestratorResult.responsePreview}`);
    console.log(`  ✓ Output PNG exists: ${results.output_png}`);
    console.log(`  ✓ Output PNG size: ${results.output_png_size} bytes`);
    console.log(`  ✓ Final decision exists: ${results.final_decision}`);
    console.log(`  ✓ Artifacts: ${results.artifacts.map(a => a.name).join(', ')}`);
    
    // Write result
    const testResult = {
      job_id: testJob.job_id,
      success: results.output_png && results.final_decision,
      orchestrator_result: orchestratorResult,
      check_results: results,
      analysis: {
        did_trigger_render: orchestratorResult.requestSent,
        did_get_response: orchestratorResult.responseReceived,
        http_status: orchestratorResult.httpStatus,
        output_png_exists: results.output_png,
        final_decision_exists: results.final_decision
      }
    };
    
    fs.writeFileSync(path.join(runDir, 'final_test_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
    
  } catch (error) {
    console.error('[TEST] FAILED:', error.message);
    
    const testResult = {
      job_id: testJob.job_id,
      success: false,
      error: error.message
    };
    
    fs.writeFileSync(path.join(runDir, 'final_test_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
  }
}

// Run test
runTest().then(result => {
  console.log('\n[TEST] FINAL RESULT:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('[TEST] FATAL ERROR:', error);
  process.exit(1);
});
