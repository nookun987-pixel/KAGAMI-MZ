const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';

// Create test job
const testJob = {
  job_id: 'test_fooocus_capture_' + Date.now(),
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

console.log(`[TEST] Created job: ${testJob.job_id}`);
console.log(`[TEST] Run directory: ${runDir}`);

// Find newest output file
function findNewestOutput() {
  try {
    // Find newest output directory
    const outputDirs = fs.readdirSync(FOOOCUS_OUTPUT_DIR)
      .filter(name => name.match(/^\d{4}-\d{2}-\d{2}$/))
      .map(name => ({
        name,
        path: path.join(FOOOCUS_OUTPUT_DIR, name),
        mtime: fs.statSync(path.join(FOOOCUS_OUTPUT_DIR, name)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);
    
    if (outputDirs.length > 0) {
      const latestDir = outputDirs[0];
      const files = fs.readdirSync(latestDir.path)
        .filter(file => file.endsWith('.png'))
        .map(file => ({
          name: file,
          path: path.join(latestDir.path, file),
          mtime: fs.statSync(path.join(latestDir.path, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      if (files.length > 0) {
        return files[0].path;
      }
    }
  } catch (e) {
    console.error('[TEST] Error finding output:', e.message);
  }
  
  return null;
}

// Copy output to run directory
async function copyOutput(sourcePath) {
  const targetPath = path.join(runDir, 'output.png');
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`[TEST] Copied output to: ${targetPath}`);
    return targetPath;
  } catch (e) {
    throw new Error(`Failed to copy output: ${e.message}`);
  }
}

// Main execution
async function runTest() {
  try {
    console.log('[TEST] Starting Fooocus capture test...');
    
    // Find newest output
    const outputPath = findNewestOutput();
    
    if (!outputPath) {
      throw new Error('No output file found');
    }
    
    console.log(`[TEST] Found output: ${outputPath}`);
    
    // Copy to run directory
    const copiedPath = await copyOutput(outputPath);
    
    // Verify file exists
    const fileExists = fs.existsSync(copiedPath);
    const fileSize = fileExists ? fs.statSync(copiedPath).size : 0;
    
    console.log(`[TEST] SUCCESS: File exists=${fileExists}, Size=${fileSize} bytes`);
    
    // Write result
    const result = {
      job_id: testJob.job_id,
      success: true,
      source_path: outputPath,
      output_path: copiedPath,
      file_exists: fileExists,
      file_size: fileSize
    };
    
    fs.writeFileSync(path.join(runDir, 'test_result.json'), JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('[TEST] FAILED:', error.message);
    
    const result = {
      job_id: testJob.job_id,
      success: false,
      error: error.message
    };
    
    fs.writeFileSync(path.join(runDir, 'test_result.json'), JSON.stringify(result, null, 2));
    
    return result;
  }
}

// Run test
runTest().then(result => {
  console.log('[TEST] Final result:', JSON.stringify(result, null, 2));
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('[TEST] Fatal error:', error);
  process.exit(1);
});
