const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Create test job
const testJob = {
  job_id: 'test_render_deep_debug_' + Date.now(),
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

// Monitor Fooocus outputs during test
function monitorFooocusOutputs() {
  const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';
  
  // Get initial state
  const initialFiles = [];
  const scan = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        try {
          const stat = fs.statSync(full);
          initialFiles.push({
            path: full,
            mtimeMs: stat.mtimeMs,
            mtime: stat.mtime.toISOString()
          });
        } catch (e) {
          // skip unreadable file
        }
      }
    }
  };
  
  scan(FOOOCUS_OUTPUT_DIR);
  
  console.log(`[MONITOR] Initial PNG files found: ${initialFiles.length}`);
  initialFiles.forEach((file, i) => {
    console.log(`[MONITOR]   ${i+1}. ${path.basename(file.path)} - ${file.mtime}`);
  });
  
  return initialFiles;
}

// Run orchestrator with enhanced logging
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
    let requestSent = false;
    let responseReceived = false;
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      
      // Extract render start time
      const match = text.match(/Fallback capture: scanning.*after (\d+)/);
      if (match) {
        const timestamp = match[1];
        if (timestamp.length >= 13) {
          renderStartMs = parseInt(timestamp);
          console.log(`[TEST] Found render start time: ${renderStartMs} (${new Date(renderStartMs).toISOString()})`);
        }
      }
      
      // Check for request sent
      if (text.includes('Sending render to') || text.includes('POST /generate')) {
        requestSent = true;
        console.log(`[TEST] Render request sent to Fooocus`);
      }
      
      // Check for response
      if (text.includes('Response shape detected') || text.includes('Final saved file path')) {
        responseReceived = true;
        console.log(`[TEST] Response received from Fooocus`);
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
        renderStartMs,
        requestSent,
        responseReceived
      };
      
      console.log(`[TEST] Orchestrator exited with code: ${code}`);
      console.log(`[TEST] Request sent: ${requestSent}`);
      console.log(`[TEST] Response received: ${responseReceived}`);
      resolve(result);
    });
    
    // Timeout after 10 minutes
    setTimeout(() => {
      if (!child.killed) {
        child.kill();
        resolve({
          exitCode: -1,
          stdout,
          stderr,
          renderStartMs,
          requestSent,
          responseReceived,
          timeout: true
        });
      }
    }, 10 * 60 * 1000);
  });
}

// Check results with detailed PNG analysis
function checkResults(orchestratorResult, initialFiles) {
  const results = {
    output_png: false,
    output_png_path: null,
    output_png_size: 0,
    final_decision: false,
    final_decision_path: null,
    validator_executed: false,
    artifacts: [],
    png_analysis: {
      initial_count: initialFiles.length,
      final_count: 0,
      new_files: [],
      all_files: []
    }
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
  
  // Analyze PNG files
  const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';
  const finalFiles = [];
  
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
          finalFiles.push({
            path: full,
            name: entry.name,
            mtimeMs: stat.mtimeMs,
            mtime: stat.mtime.toISOString()
          });
        } catch (e) {
          console.log(`[DEBUG] Cannot stat ${full}: ${e.message}`);
        }
      }
    }
  };
  
  scan(FOOOCUS_OUTPUT_DIR);
  
  // Find new files
  results.png_analysis.final_count = finalFiles.length;
  results.png_analysis.all_files = finalFiles.sort((a, b) => b.mtimeMs - a.mtimeMs);
  
  initialFiles.forEach(initial => {
    const stillExists = finalFiles.find(f => f.path === initial.path);
    if (!stillExists) {
      console.log(`[DEBUG] Initial file disappeared: ${initial.path}`);
    }
  });
  
  finalFiles.forEach(final => {
    const wasInitial = initialFiles.find(f => f.path === final.path);
    if (!wasInitial) {
      results.png_analysis.new_files.push(final);
      console.log(`[DEBUG] NEW PNG FILE: ${final.name} - ${final.mtime}`);
    }
  });
  
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
    console.log('[TEST] Starting deep render debug test...');
    
    // Monitor initial state
    const initialFiles = monitorFooocusOutputs();
    
    // Run orchestrator
    const orchestratorResult = await runOrchestrator();
    
    // Check results
    const results = checkResults(orchestratorResult, initialFiles);
    
    console.log('\n[TEST] RESULTS:');
    console.log(`  Output PNG exists: ${results.output_png}`);
    console.log(`  Output PNG size: ${results.output_png_size} bytes`);
    console.log(`  Final decision exists: ${results.final_decision}`);
    console.log(`  Validator executed: ${results.validator_executed}`);
    console.log(`  Artifacts: ${results.artifacts.map(a => a.name).join(', ')}`);
    
    console.log('\n[TEST] RENDER ANALYSIS:');
    console.log(`  Request sent to Fooocus: ${orchestratorResult.requestSent}`);
    console.log(`  Response received from Fooocus: ${orchestratorResult.responseReceived}`);
    console.log(`  Initial PNG files: ${results.png_analysis.initial_count}`);
    console.log(`  Final PNG files: ${results.png_analysis.final_count}`);
    console.log(`  New PNG files: ${results.png_analysis.new_files.length}`);
    
    results.png_analysis.new_files.forEach((file, i) => {
      console.log(`    ${i+1}. ${file.name} - ${file.mtime}`);
    });
    
    if (results.png_analysis.new_files.length > 0 && orchestratorResult.renderStartMs) {
      const newestFile = results.png_analysis.new_files[0];
      const wouldCapture = newestFile.mtimeMs > orchestratorResult.renderStartMs;
      console.log(`\n[TEST] CAPTURE ANALYSIS:`);
      console.log(`  Render start time: ${orchestratorResult.renderStartMs} (${new Date(orchestratorResult.renderStartMs).toISOString()})`);
      console.log(`  Newest file time: ${newestFile.mtimeMs} (${newestFile.mtime})`);
      console.log(`  Would capture: ${wouldCapture}`);
    }
    
    // Write result
    const testResult = {
      job_id: testJob.job_id,
      success: results.output_png && results.final_decision,
      orchestrator_result: orchestratorResult,
      check_results: results,
      analysis: {
        did_trigger_render: orchestratorResult.requestSent,
        did_get_response: orchestratorResult.responseReceived,
        new_pngs_created: results.png_analysis.new_files.length > 0,
        would_capture_newest: results.png_analysis.new_files.length > 0 && 
          results.png_analysis.new_files[0].mtimeMs > (orchestratorResult.renderStartMs || 0)
      }
    };
    
    fs.writeFileSync(path.join(runDir, 'deep_debug_result.json'), JSON.stringify(testResult, null, 2));
    
    return testResult;
    
  } catch (error) {
    console.error('[TEST] FAILED:', error.message);
    
    const testResult = {
      job_id: testJob.job_id,
      success: false,
      error: error.message
    };
    
    fs.writeFileSync(path.join(runDir, 'deep_debug_result.json'), JSON.stringify(testResult, null, 2));
    
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
