/**
 * Execution Lane Router
 * Locks Google Execution Lane as default, marks legacy Fooocus as fallback-only
 */

"use strict";

const fs = require("fs");
const path = require("path");

// Load execution lane lock configuration
const LOCK_CONFIG_PATH = path.join(__dirname, "..", "config", "execution_lane_lock.json");
let lockConfig = null;

try {
  lockConfig = JSON.parse(fs.readFileSync(LOCK_CONFIG_PATH, "utf-8"));
} catch (e) {
  console.warn(`[EXECUTION_LANE] Lock config not found at ${LOCK_CONFIG_PATH}, using defaults`);
  lockConfig = {
    execution_lane_default: "google",
    executor_type_default: "imagen_api",
    legacy_fooocus_status: "FALLBACK_ONLY",
    legacy_fooocus_requires_explicit_override: true
  };
}

/**
 * Determine execution lane for a job
 * Google lane is default; legacy Fooocus requires explicit override
 */
function resolveExecutionLane(job = {}) {
  if (job.execution_lane === "vertex_imagen") {
    return {
      lane: "google",
      executor: "vertex_imagen",
      status: "PRODUCTION",
      model: lockConfig.google_lane?.default_model || "imagen-3.0-generate-001",
      location: lockConfig.google_lane?.default_location || "us-central1",
      requires_explicit_flag: false
    };
  }

  // Check for explicit legacy override
  if (job.USE_LEGACY_FOOOCUS === true || job.execution_lane === "legacy_fooocus") {
    if (lockConfig.legacy_fooocus_requires_explicit_override) {
      console.log("[EXECUTION_LANE] LEGACY FOOOCUS explicitly requested via job flag");
    }
    return {
      lane: "legacy_fooocus",
      executor: "fooocus_api",
      status: "FALLBACK",
      requires_explicit_flag: true
    };
  }

  // Check for legacy override via environment
  if (process.env.USE_LEGACY_FOOOCUS === "true") {
    console.log("[EXECUTION_LANE] LEGACY FOOOCUS explicitly requested via environment");
    return {
      lane: "legacy_fooocus",
      executor: "fooocus_api",
      status: "FALLBACK",
      requires_explicit_flag: true
    };
  }

  // Default: Google Execution Lane
  return {
    lane: "google",
    executor: "imagen_api",
    status: "PRODUCTION",
    model: lockConfig.google_lane?.default_model || "imagen-3.0-generate-001",
    location: lockConfig.google_lane?.default_location || "us-central1",
    requires_explicit_flag: false
  };
}

/**
 * Get execution lane metadata for artifacts
 */
function getExecutionLaneMetadata(job = {}) {
  const lane = resolveExecutionLane(job);
  
  // Check if Colab runner is enabled
  const { isColabRunnerEnabled } = require("../renderers/colab_runner_adapter");
  const useColab = isColabRunnerEnabled();
  
  return {
    execution_lane: lane.lane,
    executor_type: lane.executor,
    execution_lane_status: lane.status,
    execution_runner: useColab ? "colab" : "direct_imagen",
    runner_status: useColab ? "PRIMARY" : "FALLBACK",
    render_model: lane.model || null,
    render_location: lane.location || null,
    requires_explicit_override: lane.requires_explicit_flag,
    lock_version: lockConfig.lock_version || "1.1.0",
    lock_date: lockConfig.lock_date || "2026-04-04"
  };
}

/**
 * Check if Google lane is available
 */
function isGoogleLaneAvailable() {
  const { isGoogleLaneAvailable: checkGoogle } = require("../renderers/google_lane_adapter");
  return checkGoogle();
}

/**
 * Route render execution to appropriate lane
 * Colab runner is default for Google lane; legacy Fooocus requires explicit override
 */
async function routeRenderExecution(job, promptPackage, artifactPaths) {
  const lane = resolveExecutionLane(job);
  
  console.log(`[EXECUTION_LANE] Routing job ${job.job_id} to ${lane.lane} (${lane.status})`);
  
  if (lane.lane === "google") {
    // Use Colab Runner as primary (not direct Imagen)
    const { colabRunnerAdapter, isColabRunnerEnabled } = require("../renderers/colab_runner_adapter");
    
    if (isColabRunnerEnabled()) {
      console.log(`[EXECUTION_LANE] Using Colab Runner (PRIMARY)`);
      return colabRunnerAdapter(job, promptPackage, artifactPaths);
    }
    
    // Fallback to direct Imagen if Colab not enabled
    console.log(`[EXECUTION_LANE] Colab not enabled, using direct Imagen (FALLBACK)`);
    const { renderExecutorAdapter } = require("../renderers/google_lane_adapter");
    return renderExecutorAdapter(job, promptPackage, artifactPaths);
  }
  
  // Use legacy Fooocus path
  console.warn(`[EXECUTION_LANE] WARNING: Using LEGACY FOOOCUS path - this is FALLBACK ONLY`);
  const { executeRender } = require("../render/render_executor");
  return executeRender(job, promptPackage, artifactPaths);
}

module.exports = {
  resolveExecutionLane,
  getExecutionLaneMetadata,
  isGoogleLaneAvailable,
  routeRenderExecution,
  LOCK_CONFIG: lockConfig
};
