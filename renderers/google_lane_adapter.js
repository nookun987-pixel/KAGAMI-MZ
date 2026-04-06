"use strict";

/**
 * Orchestrator Integration for Google Execution Lane
 * Adapter to bridge Control Core with Imagen/Colab render pipeline
 * 
 * REPLACES: Fooocus/self-host render calls
 * USES: Imagen API via direct call or Colab job runner
 */

const fs = require('fs');
const path = require('path');
const { executeRenderJob } = require('../renderers/imagen_adapter');

/**
 * Build render job payload from prompt package
 * @param {Object} job - Original job
 * @param {Object} promptPackage - Built prompt package
 * @returns {Object} - Render job payload per contract
 */
function buildRenderJobPayload(job, promptPackage) {
  const renderSpec = promptPackage.render_spec || {};
  const jobRender = job.render || {};
  
  return {
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
    output_path: path.join(process.env.RUNS_DIR || './runs', job.job_id),
    storage_backend: "local",
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
      claude_model: "claude-sonnet-4-20250514"
    },
    created_at: new Date().toISOString()
  };
}

/**
 * Execute render via Google Execution Lane
 * @param {Object} job - Job definition
 * @param {Object} promptPackage - Built prompt package
 * @param {Object} artifactPaths - Artifact path configuration
 * @returns {Promise<Object>} - Render result summary
 */
async function executeGoogleRender(job, promptPackage, artifactPaths) {
  console.log(`[GOOGLE_RENDER] Building job payload for ${job.job_id}`);
  
  // Build payload
  const payload = buildRenderJobPayload(job, promptPackage);
  
  // Save payload artifact
  const payloadPath = path.join(path.dirname(artifactPaths.render_payload), 'render_job_payload.json');
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
  console.log(`[GOOGLE_RENDER] Payload saved: ${payloadPath}`);
  
  // Execute via Imagen adapter
  console.log(`[GOOGLE_RENDER] Calling execution lane...`);
  const resultBundle = await executeRenderJob(payload);
  
  // Process result
  const renderResult = {
    job_id: job.job_id,
    status: resultBundle.status === "SUCCESS" ? "PASS" : "FAIL",
    output_file_path: resultBundle.primary_output,
    output_files: resultBundle.output_files.map(f => f.path),
    render_time_ms: resultBundle.timing.total_duration_ms,
    render: {
      width: payload.width,
      height: payload.height,
      seed: payload.seed,
      actual_seed: payload.seed, // Imagen returns actual seed used
      guidance_scale: payload.imagen_config.guidance_scale,
      profile: payload.imagen_config.model,
      steps: null, // Imagen doesn't expose step count
      render_time_ms: resultBundle.timing.total_duration_ms
    },
    // Include raw response for debugging
    _raw_response: resultBundle.render_response_raw
  };
  
  // Copy artifacts to expected locations
  if (resultBundle.primary_output && fs.existsSync(resultBundle.primary_output)) {
    // Determine output directory - use run_dir from artifactPaths
    const outputDir = artifactPaths.run_dir || 
                      path.dirname(artifactPaths.render_payload) || 
                      path.dirname(artifactPaths.final_payload) ||
                      payload.output_path;
    
    const standardOutputPath = path.join(outputDir, 'output.png');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.copyFileSync(resultBundle.primary_output, standardOutputPath);
    renderResult.output_file_path = standardOutputPath;
    
    console.log(`[GOOGLE_RENDER] Output copied: ${standardOutputPath}`);
  }
  
  // Copy result bundle for reference
  if (fs.existsSync(path.join(payload.output_path, 'result_bundle.json'))) {
    fs.copyFileSync(
      path.join(payload.output_path, 'result_bundle.json'),
      path.join(path.dirname(artifactPaths.render_payload), 'result_bundle.json')
    );
  }
  
  // Validation
  if (resultBundle.status !== "SUCCESS" || !resultBundle.primary_output) {
    console.error(`[GOOGLE_RENDER] HARD FAIL: ${resultBundle.error?.message || 'No output'}`);
    throw new Error(`Render failed: ${resultBundle.error?.message || 'Unknown error'}`);
  }
  
  console.log(`[GOOGLE_RENDER] Success: ${resultBundle.output_files.length} files`);
  return renderResult;
}

/**
 * Check if Google Execution Lane is available
 * @returns {boolean}
 */
function isGoogleLaneAvailable() {
  // Check for required credentials
  const hasCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                   fs.existsSync('service-account-key.json');
  
  return hasCreds;
}

/**
 * Adapter interface matching legacy render executor
 * @param {Object} job - Job definition
 * @param {Object} promptPackage - Built prompt package
 * @param {Object} artifactPaths - Artifact paths
 * @returns {Promise<Object>} - Render result
 */
async function renderExecutorAdapter(job, promptPackage, artifactPaths) {
  console.log(`[RENDER_ADAPTER] Using Google Execution Lane for ${job.job_id}`);
  
  if (!isGoogleLaneAvailable()) {
    throw new Error("Google Execution Lane not available - missing credentials");
  }
  
  return executeGoogleRender(job, promptPackage, artifactPaths);
}

module.exports = {
  buildRenderJobPayload,
  executeGoogleRender,
  isGoogleLaneAvailable,
  renderExecutorAdapter,
  // Legacy compatibility
  executeRender: renderExecutorAdapter
};
