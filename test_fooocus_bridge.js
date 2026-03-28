const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = __dirname;
const FOOOCUS_API_URL = 'http://127.0.0.1:7865';
const FOOOCUS_OUTPUT_DIR = 'D:/Fooocus-main/outputs';

// Create test job
const testJob = {
  job_id: 'test_fooocus_bridge_' + Date.now(),
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

// Submit render to Fooocus
async function submitRender() {
  const payload = {
    prompt: testJob.user_idea,
    negative_prompt: '',
    performance_selection: 'Speed',
    aspect_ratios_selection: '1152×896',
    image_seed: -1,
    sharpness: 2.0,
    guidance_scale: 4.0,
    base_model_name: 'juggernautXL_v45.safetensors',
    refiner_model_name: 'None',
    l1_model: 'None',
    l1_weight: 0.0,
    l2_model: 'None',
    l2_weight: 0.0,
    l3_model: 'None',
    l3_weight: 0.0,
    l4_model: 'None',
    l4_weight: 0.0,
    sampler_name: 'dpmpp_2m_sde',
    scheduler_name: 'karras',
    steps: 30
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: '127.0.0.1',
      port: 7865,
      path: '/sdapi/v1/txt2img',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Wait for output file
async function waitForOutput() {
  const maxWait = 120000; // 2 minutes
  const pollInterval = 2000;
  const startTime = Date.now();
  
  console.log('[TEST] Waiting for output file...');
  
  while (Date.now() - startTime < maxWait) {
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
          .filter(file => file.endsWith('.png'));
        
        if (files.length > 0) {
          const outputFile = path.join(latestDir.path, files[0]);
          console.log(`[TEST] Found output: ${outputFile}`);
          return outputFile;
        }
      }
    } catch (e) {
      // Directory might not exist yet
    }
    
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error('Output file not found within timeout');
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
    console.log('[TEST] Starting Fooocus bridge test...');
    
    // Submit render
    const renderResult = await submitRender();
    console.log('[TEST] Render submitted:', renderResult);
    
    // Wait for output
    const outputPath = await waitForOutput();
    
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
      output_path: copiedPath,
      file_exists: fileExists,
      file_size: fileSize,
      render_result: renderResult
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
