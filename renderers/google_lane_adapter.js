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
const { runAllAnalyzers } = require("../analyzers/run_all_analyzers");
const { isVLMAvailable } = require("../analyzers/vlm_semantic_analyzer");
const { runRuleEngine } = require("../validators/mikage_rule_engine");
const { getSpecPath } = require("../validators/load_mikage_specs");

const HARD_REJECT_SIGNALS = [
  "human_eyes_detected",
  "pvc_plastic_read",
  "toon_shading",
  "magenta_neon_spill",
  "logo_overlap_ratio",
];

function normalizeCredentialInput(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function resolveGoogleLaneCredentialSource() {
  const googleApplicationCredentials = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (googleApplicationCredentials) {
    return { source: 'GOOGLE_APPLICATION_CREDENTIALS', path: googleApplicationCredentials };
  }

  const mikageGoogleApplicationCredentials = normalizeCredentialInput(process.env.MIKAGE_GOOGLE_APPLICATION_CREDENTIALS);
  if (mikageGoogleApplicationCredentials) {
    return { source: 'MIKAGE_GOOGLE_APPLICATION_CREDENTIALS', path: mikageGoogleApplicationCredentials };
  }

  const googleApplicationCredentialsJson = normalizeCredentialInput(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  if (googleApplicationCredentialsJson) {
    return { source: 'GOOGLE_APPLICATION_CREDENTIALS_JSON', json: googleApplicationCredentialsJson };
  }

  const repoCredentialsPath = path.join(process.cwd(), 'repo_credentials', 'gsheet_key.json');
  if (fs.existsSync(repoCredentialsPath)) {
    return { source: 'repo_credentials/gsheet_key.json', path: repoCredentialsPath };
  }

  return null;
}

function dedupeStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values || []) {
    const normalized = String(value || '').trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(normalized);
  }
  return output;
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

function collectBlockingUnknownRules(ruleResults) {
  if (String(process.env.MIKAGE_STRICT_UNKNOWN_RULES || "false").toLowerCase() !== "true") {
    return [];
  }
  return (ruleResults || [])
    .filter((result) => result.status === "UNKNOWN" && (result.priority === "CRITICAL" || result.priority === "ABSOLUTE"))
    .map((result) => result.rule_id);
}

function collectCriticalFailedRules(ruleResults) {
  return (ruleResults || [])
    .filter((result) => result.status === "FAIL" && (result.priority === "CRITICAL" || result.priority === "ABSOLUTE"))
    .map((result) => result.rule_id);
}

function collectHardRejectSignals(signals = {}) {
  return HARD_REJECT_SIGNALS.filter((key) => Number(signals[key] || 0) > 0);
}

function isRecoveredPostValidationEnabled() {
  return String(process.env.MIKAGE_ENABLE_POSTVALIDATION || "true").toLowerCase() !== "false";
}

async function runRecoveredPostValidation(outputPath, artifactPaths = {}) {
  const signals = await runAllAnalyzers(outputPath, {
    stop_before_semantics_on_hard_fail: true,
  });
  const lane = artifactPaths.lane || artifactPaths.shot_type || "unknown";
  const ruleEngine = runRuleEngine({
    specPath: getSpecPath("image_control"),
    signals,
    lane,
  });
  const hardRejectHits = collectHardRejectSignals(signals);
  const criticalFailedRules = collectCriticalFailedRules(ruleEngine.rule_results);
  const blockingUnknownRules = collectBlockingUnknownRules(ruleEngine.rule_results);
  const failedChecks = dedupeStrings([...(ruleEngine.failed_rules || []), ...hardRejectHits]);
  const criticalFailures = dedupeStrings([...criticalFailedRules, ...hardRejectHits]);
  const semanticVlmExecuted =
    isVLMAvailable() &&
    signals._vlm_status !== "unavailable" &&
    signals._vlm_status !== "disabled" &&
    signals._vlm_status !== "skipped_due_to_hard_fail" &&
    signals._vlm_status !== "unconfigured";
  const semanticRejectSignals = dedupeStrings(ruleEngine.semantic_reject_signals || []);
  const canonHardFailures = dedupeStrings(ruleEngine.canon_hard_failures || []);
  const semanticBlocking = semanticVlmExecuted && semanticRejectSignals.length > 0;
  const canonBlocking = canonHardFailures.length > 0 || criticalFailures.length > 0 || blockingUnknownRules.length > 0;
  const pass =
    fs.existsSync(outputPath) &&
    ruleEngine.passed === true &&
    semanticBlocking === false &&
    canonBlocking === false;
  const semanticMode = signals._vlm_mode || (isVLMAvailable() ? "local+semantic" : "local_only");
  const payload = {
    stage: "post_render_image",
    verdict: pass ? "PASS" : "REJECT",
    validator_executed: true,
    validator_verdict: ruleEngine.validator_verdict || (pass ? "PASS" : "REJECT"),
    validation_mode: semanticMode,
    semantic_vlm_executed: semanticVlmExecuted,
    semantic_vlm_mode: semanticMode,
    semantic_reject_signals: semanticRejectSignals,
    semantic_summary: {
      status: signals._vlm_status || "unknown",
      mode: semanticMode,
      local_only: semanticVlmExecuted === false,
      executed: semanticVlmExecuted,
      reject_signal_count: semanticRejectSignals.length,
    },
    semantic_blocking: semanticBlocking,
    canon_hard_failures: canonHardFailures,
    canon_blocking: canonBlocking,
    failed_checks: failedChecks,
    critical_failures: criticalFailures,
    forbidden_hits: hardRejectHits,
    hard_reject_hits: hardRejectHits,
    blocking_unknown_rules: blockingUnknownRules,
    analyzer_signals: signals,
    analyzer_summary: {
      vlm_backend_ready: isVLMAvailable(),
      vlm_status: signals._vlm_status || "unknown",
      analyzer_status: signals._analyzer_status || {},
    },
    missing_signals: (ruleEngine.rule_results || []).flatMap((result) => result.missing_signals || []),
    rule_engine: {
      decision: ruleEngine.decision,
      passed: ruleEngine.passed,
      block_level: ruleEngine.block_level,
      failed_rules: ruleEngine.failed_rules,
      unknown_rules: ruleEngine.unknown_rules,
      stats: ruleEngine.stats,
      rule_results: ruleEngine.rule_results,
    },
    source_files: {
      image_control_spec: getSpecPath("image_control"),
    },
  };

  if (artifactPaths.run_dir) {
    writeJson(path.join(artifactPaths.run_dir, 'post_validation.json'), payload);
    writeJson(path.join(artifactPaths.run_dir, 'validation.json'), payload);
  }
  return payload;
}

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

  const postValidation = isRecoveredPostValidationEnabled()
    ? await runRecoveredPostValidation(renderResult.output_file_path, {
        ...(artifactPaths || {}),
        lane: job.lane || job.shot_type || promptPackage.shot_type || "unknown",
        shot_type: promptPackage.shot_type || job.shot_type || job.lane || "unknown",
      })
    : {
        stage: "post_render_image",
        verdict: "PASS",
        validator_executed: false,
        validation_mode: "disabled",
      };
  if (postValidation.verdict !== "PASS") {
    return {
      job_id: job.job_id,
      status: "FAIL",
      result_type: "execution_dispatch",
      output_file_path: renderResult.output_file_path,
      output_files: renderResult.output_file_path ? [renderResult.output_file_path] : [],
      error: "LOCAL_VALIDATION_REJECT",
      error_reason: `Local validation rejected render: ${(postValidation.critical_failures || postValidation.failed_checks || []).join(", ") || "UNKNOWN"}`,
      post_validation: postValidation,
      _raw_response: resultBundle.render_response_raw,
    };
  }
  
  console.log(`[GOOGLE_RENDER] Success: ${resultBundle.output_files.length} files`);
  return {
    ...renderResult,
    post_validation: postValidation,
  };
}

/**
 * Check if Google Execution Lane is available
 * @returns {boolean}
 */
function isGoogleLaneAvailable() {
  // Check for required credentials
  const credentialSource = resolveGoogleLaneCredentialSource();
  const hasCreds = !!credentialSource;
  
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
