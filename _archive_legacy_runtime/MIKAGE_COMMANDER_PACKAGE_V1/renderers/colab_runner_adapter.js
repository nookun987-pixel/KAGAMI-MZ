"use strict";

/**
 * Colab Runner Adapter
 * Routes render jobs to Colab as the primary execution runner
 * 
 * FLOW:
 * 1. Local writes render_job_payload.json to shared storage
 * 2. Colab runner picks up payload and executes
 * 3. Colab writes output.png + result_bundle.json
 * 4. Local reads results and continues validation
 */

const fs = require('fs');
const path = require('path');

// Default paths for Colab shared storage (Google Drive)
const DEFAULT_COLAB_INPUT_PATH = process.env.COLAB_INPUT_PATH || './colab_jobs';
const DEFAULT_COLAB_OUTPUT_PATH = process.env.COLAB_OUTPUT_PATH || './colab_outputs';
const COLAB_POLL_INTERVAL_MS = parseInt(process.env.COLAB_POLL_INTERVAL_MS || '5000', 10);
const COLAB_TIMEOUT_MS = parseInt(process.env.COLAB_TIMEOUT_MS || '300000', 10); // 5 minutes

/**
 * Check if Colab runner mode is enabled
 */
function isColabRunnerEnabled() {
  return process.env.USE_COLAB_RUNNER === 'true' || process.env.EXECUTION_RUNNER === 'colab';
}

/**
 * Get runner configuration
 */
function getRunnerConfig() {
  return {
    runner: process.env.EXECUTION_RUNNER || 'colab',
    input_path: process.env.COLAB_INPUT_PATH || DEFAULT_COLAB_INPUT_PATH,
    output_path: process.env.COLAB_OUTPUT_PATH || DEFAULT_COLAB_OUTPUT_PATH,
    poll_interval_ms: COLAB_POLL_INTERVAL_MS,
    timeout_ms: COLAB_TIMEOUT_MS,
    is_primary: true,
    is_local_fallback: process.env.USE_LOCAL_RENDER_FALLBACK === 'true'
  };
}

/**
 * Write render job payload for Colab to pick up
 */
async function submitToColab(job, promptPackage, artifactPaths) {
  const config = getRunnerConfig();
  const jobDir = path.join(config.input_path, job.job_id);
  
  // Ensure directories exist
  if (!fs.existsSync(jobDir)) {
    fs.mkdirSync(jobDir, { recursive: true });
  }
  
  const outputDir = path.join(config.output_path, job.job_id);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Build payload matching the contract
  const renderSpec = promptPackage.render_spec || {};
  const jobRender = job.render || {};
  
  const payload = {
    version: "1.0.0",
    job_id: job.job_id,
    shot_type: promptPackage.shot_type || job.shot_type,
    entity_id: job.entity_id,
    prompt: promptPackage.structured_prompt,
    negative_prompt: promptPackage.negative_prompt || "",
    seed: renderSpec.seed || jobRender.seed || null,
    seed_policy: renderSpec.seed_policy || "fixed",
    aspect_ratio: renderSpec.aspect_ratio || "1:1",
    width: renderSpec.width || jobRender.width || 1024,
    height: renderSpec.height || jobRender.height || 1024,
    rag_enabled: process.env.USE_REAL_VERTEX_RAG === 'true',
    rag_query: `${job.shot_type || ''} ${job.user_idea || ''}`,
    canon_flags: {
      entity_first: true,
      zone_locked: job.zone !== undefined,
      material_locked: promptPackage.shot_type?.includes('CERAMIC') || false,
      reproduction_mode: job.generation_mode === 'reproduction',
      anchor_images: job.anchor_images || []
    },
    // Colab will write outputs here
    output_path: outputDir,
    storage_backend: "colab_drive",
    imagen_config: {
      model: "imagen-3.0-generate-001",
      number_of_images: 1,
      guidance_scale: renderSpec.guidance_scale || 7.5,
      safety_filter_level: "block_some",
      person_generation: "dont_allow"
    },
    control_core_metadata: {
      pipeline_version: "2.0",
      canon_version: "v2",
      intake_timestamp: new Date().toISOString(),
      spec_build_timestamp: new Date().toISOString(),
      claude_model: "claude-sonnet-4-20250514",
      execution_runner: "colab",
      execution_lane: "google",
      executor_type: "imagen_api"
    },
    created_at: new Date().toISOString(),
    submitted_to_runner: "colab"
  };
  
  // Write payload
  const payloadPath = path.join(jobDir, 'render_job_payload.json');
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
  
  // Write marker file to signal Colab
  const markerPath = path.join(jobDir, 'job_ready.marker');
  fs.writeFileSync(markerPath, JSON.stringify({
    job_id: job.job_id,
    submitted_at: new Date().toISOString(),
    status: "PENDING"
  }));
  
  console.log(`[COLAB_RUNNER] Job ${job.job_id} submitted to Colab`);
  console.log(`[COLAB_RUNNER] Payload: ${payloadPath}`);
  console.log(`[COLAB_RUNNER] Expected output: ${outputDir}`);
  
  return {
    payload_path: payloadPath,
    output_path: outputDir,
    marker_path: markerPath,
    job_id: job.job_id
  };
}

/**
 * Poll for Colab completion
 */
async function pollForCompletion(submissionInfo, timeoutMs = COLAB_TIMEOUT_MS) {
  const outputDir = submissionInfo.output_path;
  const resultBundlePath = path.join(outputDir, 'result_bundle.json');
  const outputPngPath = path.join(outputDir, 'output.png');
  const completionMarker = path.join(outputDir, 'completed.marker');
  
  const startTime = Date.now();
  
  console.log(`[COLAB_RUNNER] Polling for completion (timeout: ${timeoutMs}ms)...`);
  
  while (Date.now() - startTime < timeoutMs) {
    // Check for completion marker
    if (fs.existsSync(completionMarker)) {
      const marker = JSON.parse(fs.readFileSync(completionMarker, 'utf-8'));
      
      if (marker.status === 'SUCCESS') {
        // Verify required files exist
        if (!fs.existsSync(resultBundlePath)) {
          throw new Error('Colab completed but result_bundle.json not found');
        }
        if (!fs.existsSync(outputPngPath)) {
          throw new Error('Colab completed but output.png not found');
        }
        
        const resultBundle = JSON.parse(fs.readFileSync(resultBundlePath, 'utf-8'));
        
        console.log(`[COLAB_RUNNER] Job completed successfully`);
        console.log(`[COLAB_RUNNER] Output: ${outputPngPath}`);
        
        return {
          status: "SUCCESS",
          result_bundle: resultBundle,
          output_png: outputPngPath,
          result_bundle_path: resultBundlePath,
          completion_marker: marker
        };
      } else if (marker.status === 'FAILED') {
        throw new Error(`Colab execution failed: ${marker.error || 'Unknown error'}`);
      }
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, COLAB_POLL_INTERVAL_MS));
    
    // Log progress every 30 seconds
    const elapsed = Date.now() - startTime;
    if (elapsed % 30000 < COLAB_POLL_INTERVAL_MS) {
      console.log(`[COLAB_RUNNER] Still waiting... (${Math.round(elapsed / 1000)}s elapsed)`);
    }
  }
  
  throw new Error(`Colab execution timed out after ${timeoutMs}ms`);
}

/**
 * Execute render via Colab runner
 */
async function executeColabRender(job, promptPackage, artifactPaths) {
  console.log(`[COLAB_RUNNER] Starting Colab execution for ${job.job_id}`);
  
  // Submit job to Colab
  const submission = await submitToColab(job, promptPackage, artifactPaths);
  
  // Poll for completion
  const result = await pollForCompletion(submission);
  
  // Copy artifacts to expected local locations
  if (result.output_png && fs.existsSync(result.output_png)) {
    const localOutputPath = artifactPaths.output_png || path.join(artifactPaths.run_dir, 'output.png');
    fs.copyFileSync(result.output_png, localOutputPath);
    console.log(`[COLAB_RUNNER] Copied output to: ${localOutputPath}`);
  }
  
  // Copy result bundle
  if (result.result_bundle_path && fs.existsSync(result.result_bundle_path)) {
    const localBundlePath = path.join(artifactPaths.run_dir, 'result_bundle.json');
    fs.copyFileSync(result.result_bundle_path, localBundlePath);
    console.log(`[COLAB_RUNNER] Copied result bundle to: ${localBundlePath}`);
  }
  
  // Build render result in expected format
  const renderResult = {
    job_id: job.job_id,
    status: result.status,
    output_file_path: artifactPaths.output_png || path.join(artifactPaths.run_dir, 'output.png'),
    output_files: [{
      path: artifactPaths.output_png || path.join(artifactPaths.run_dir, 'output.png'),
      type: "primary"
    }],
    render_time_ms: result.result_bundle.timing?.total_duration_ms || 0,
    render: {
      width: promptPackage.render_spec?.width || 1024,
      height: promptPackage.render_spec?.height || 1024,
      seed: promptPackage.render_spec?.seed || null,
      actual_seed: result.result_bundle.imagen_response?.seed || null,
      guidance_scale: promptPackage.render_spec?.guidance_scale || 7.5,
      profile: "imagen-3.0-generate-001",
      steps: null, // Imagen doesn't expose steps
      render_time_ms: result.result_bundle.timing?.total_duration_ms || 0,
      execution_runner: "colab",
      execution_lane: "google",
      executor_type: "imagen_api"
    },
    // Execution metadata for artifacts
    execution_runner: "colab",
    execution_lane: "google",
    executor_type: "imagen_api",
    runner_status: "PRIMARY",
    result_bundle: result.result_bundle
  };
  
  // Validation - hard fail if no output
  if (result.status !== "SUCCESS" || !fs.existsSync(renderResult.output_file_path)) {
    console.error(`[COLAB_RUNNER] HARD FAIL: No output produced`);
    throw new Error(`Colab render failed: ${result.result_bundle?.error?.message || 'No output'}`);
  }
  
  console.log(`[COLAB_RUNNER] Success: output at ${renderResult.output_file_path}`);
  return renderResult;
}

/**
 * Adapter interface matching legacy render executor
 */
async function colabRunnerAdapter(job, promptPackage, artifactPaths) {
  console.log(`[RENDER_ADAPTER] Using Colab Runner for ${job.job_id}`);
  
  if (!isColabRunnerEnabled()) {
    console.warn(`[COLAB_RUNNER] Colab runner not enabled, falling back to direct Imagen`);
    // Fall back to direct Imagen API call
    const { renderExecutorAdapter } = require('./google_lane_adapter');
    const result = await renderExecutorAdapter(job, promptPackage, artifactPaths);
    // Mark as fallback
    result.execution_runner = "direct_imagen_fallback";
    result.runner_status = "FALLBACK";
    return result;
  }
  
  return executeColabRender(job, promptPackage, artifactPaths);
}

module.exports = {
  isColabRunnerEnabled,
  getRunnerConfig,
  submitToColab,
  pollForCompletion,
  executeColabRender,
  colabRunnerAdapter,
  // Primary exports
  executeRender: colabRunnerAdapter,
  EXECUTION_RUNNER: 'colab'
};
