const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Create test job
const testJob = {
  job_id: 'test_render_debug_' + Date.now(),
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

// Run orchestrator with detailed logging
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
    let renderStartMs = null;
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      
      // Extract render start time
      const match = text.match(/Fallback capture: scanning.*after (\d+)/);
      if (match) {
        const timestamp = match[1];
        // Check if it's a full timestamp (13+ digits) or truncated
        if (timestamp.length >= 13) {
          renderStartMs = parseInt(timestamp);
        } else {
          // If truncated, this is likely the year 2026 - ignore and use current time
          console.log(`[TEST] Truncated timestamp detected: ${timestamp}, using current time`);
          renderStartMs = Date.now();
        }
        console.log(`[TEST] Found render start time: ${renderStartMs} (${new Date(renderStartMs).toISOString()})`);
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
        renderStartMs
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
          stderr: 'Process timed out after 10 minutes',
          renderStartMs
        });
      }
    }, 10 * 60 * 1000);
  });
}

// Check results and debug capture
function checkResults(orchestratorResult) {
  const results = {
    output_png: false,
    output_png_path: null,
    output_png_size: 0,
    final_decision: false,
    final_decision_path: null,
    validator_executed: false,
    artifacts: [],
    capture_debug: {}
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
  
  // Debug capture logic if we have render start time
  if (orchestratorResult.renderStartMs) {
    console.log(`[DEBUG] Analyzing capture with renderStartMs=${orchestratorResult.renderStartMs}`);
    
    const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';
    let newest = null;
    let newestMtime = orchestratorResult.renderStartMs;
    
    const scan = (dir) => {
      let entries;
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch (e) {
        console.log(`[DEBUG] Cannot read directory ${dir}: ${e.message}`);
        return;
      }
      
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(full);
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
          try {
            const stat = fs.statSync(full);
            if (stat.mtimeMs > newestMtime) {
              newestMtime = stat.mtimeMs;
              newest = full;
              console.log(`[DEBUG] Found newer PNG: ${full} (mtimeMs=${stat.mtimeMs})`);
            }
          } catch (e) {
            console.log(`[DEBUG] Cannot stat ${full}: ${e.message}`);
          }
        }
      }
    };
    
    scan(FOOOCUS_OUTPUT_DIR);
    
    results.capture_debug = {
      renderStartMs: orchestratorResult.renderStartMs,
      renderStartIso: new Date(orchestratorResult.renderStartMs).toISOString(),
      newestFound: newest,
      newestMtime: newestMtime,
      newestMtimeIso: newest ? new Date(newestMtime).toISOString() : null,
      wouldCapture: newest && newestMtime > orchestratorResult.renderStartMs
    };
    
    console.log(`[DEBUG] Capture analysis:`, JSON.stringify(results.capture_debug, null, 2));
  }
  
  return results;
}

// Main execution
async function runTest() {
  try {
    console.log('[TEST] Starting orchestrator render debug test...');
    
    // Run orchestrator
    const orchestratorResult = await runOrchestrator();
    
    // Check results
    const results = checkResults(orchestratorResult);
    
    console.log('[TEST] RESULTS:');
    console.log(`  Output PNG exists: ${results.output_png}`);
    console.log(`  Output PNG size: ${results.output_png_size} bytes`);
    console.log(`  Final decision exists: ${results.final_decision}`);
    console.log(`  Validator executed: ${results.validator_executed}`);
    console.log(`  Artifacts: ${results.artifacts.map(a => a.name).join(', ')}`);
    
    if (results.capture_debug.renderStartMs) {
      console.log(`  Render start time: ${results.capture_debug.renderStartIso}`);
      console.log(`  Would capture: ${results.capture_debug.wouldCapture}`);
      console.log(`  Newest found: ${results.capture_debug.newestFound}`);
    }
    
    // Write result
    const testResult = {
      job_id: testJob.job_id,
      success: results.output_png && results.final_decision,
      orchestrator_result: orchestratorResult,
      check_results: results
    };
    
    fs.writeFileSync(path.join(runDir, 'render_debug_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
    
  } catch (error) {
    console.error('[TEST] FAILED:', error.message);
    
    const testResult = {
      job_id: testJob.job_id,
      success: false,
      error: error.message
    };
    
    fs.writeFileSync(path.join(runDir, 'render_debug_result.json'), JSON.stringify(testResult, null, 2));
    
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
