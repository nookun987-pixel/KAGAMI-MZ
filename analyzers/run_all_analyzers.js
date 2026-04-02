/**
 * MIKAGE — Master Analyzer Runner
 * Stage-based analyzer orchestration for deterministic execution,
 * clearer debug logs, and cleaner dependency boundaries.
 */

"use strict";

const { analyzePixels } = require("./pixel_analyzer");
const { detectZBlue } = require("./z_blue_detector");
const { analyzeSafeZone } = require("./safe_zone_mask");
const { analyzeSilhouette } = require("./silhouette_check");
const { analyzeSaliency } = require("./saliency_map");
const { analyzeSemantics, setVLMClient } = require("./vlm_semantic_analyzer");

function nowMs() {
  return Date.now();
}

async function runStage(stageName, analyzerName, fn, imagePath, options = {}) {
  const startedAt = nowMs();
  try {
    const result = await fn(imagePath, options);
    const endedAt = nowMs();
    return {
      ok: true,
      stage: stageName,
      analyzer: analyzerName,
      started_at_ms: startedAt,
      ended_at_ms: endedAt,
      duration_ms: endedAt - startedAt,
      result: result && typeof result === "object" ? result : {},
    };
  } catch (err) {
    const endedAt = nowMs();
    return {
      ok: false,
      stage: stageName,
      analyzer: analyzerName,
      started_at_ms: startedAt,
      ended_at_ms: endedAt,
      duration_ms: endedAt - startedAt,
      error: `${analyzerName}: ${err.message}`,
      result: {},
    };
  }
}

function mergeStageResult(target, stageResult) {
  if (!stageResult || !stageResult.result) return;
  for (const [key, value] of Object.entries(stageResult.result)) {
    if (key === "_error") continue;
    target[key] = value;
  }
}

function buildAnalyzerStatus(stageResults) {
  const status = {
    pixel_analyzer: false,
    silhouette_check: false,
    saliency_map: false,
    safe_zone_mask: false,
    z_blue_detector: false,
    vlm_semantic_analyzer: false,
    errors: undefined,
    timings_ms: {},
    stage_order: [],
  };

  const errors = [];

  for (const stageResult of stageResults) {
    status.stage_order.push(stageResult.stage);
    status.timings_ms[stageResult.analyzer] = stageResult.duration_ms;

    switch (stageResult.analyzer) {
      case "pixel_analyzer":
        status.pixel_analyzer = stageResult.ok;
        break;
      case "silhouette_check":
        status.silhouette_check = stageResult.ok;
        break;
      case "saliency_map":
        status.saliency_map = stageResult.ok;
        break;
      case "safe_zone_mask":
        status.safe_zone_mask = stageResult.ok;
        break;
      case "z_blue_detector":
        status.z_blue_detector = stageResult.ok;
        break;
      case "vlm_semantic_analyzer":
        status.vlm_semantic_analyzer = stageResult.ok;
        break;
      default:
        break;
    }

    if (!stageResult.ok && stageResult.error) {
      errors.push(stageResult.error);
    }
  }

  if (errors.length > 0) {
    status.errors = errors;
  }

  return status;
}

function shouldStopBeforeSemantics(signals, options = {}) {
  if (!options.stop_before_semantics_on_hard_fail) return false;

  if (signals.edge_blur_radius === 1) return true;
  if (signals.histogram_clipping === 1) return true;
  if (signals.mesh_deformation_delta === 1) return true;
  if (signals.boundary_intersection === 1) return true;

  return false;
}

/**
 * Run all analyzers in a deterministic stage order.
 *
 * Stage order:
 *   1. pixel_integrity      -> pixel_analyzer
 *   2. geometry_integrity   -> silhouette_check
 *   3. visual_hierarchy     -> saliency_map
 *   4. safe_zone_integrity  -> safe_zone_mask
 *   5. color_fidelity       -> z_blue_detector
 *   6. semantic_validation  -> vlm_semantic_analyzer
 *
 * @param {string} imagePath
 * @param {Object} options
 * @param {boolean} [options.stop_before_semantics_on_hard_fail=false]
 * @returns {Promise<Object>}
 */
async function runAllAnalyzers(imagePath, options = {}) {
  const stageResults = [];
  const signals = {};
  const pipelineStartedAt = nowMs();

  const pixelStage = await runStage(
    "pixel_integrity",
    "pixel_analyzer",
    analyzePixels,
    imagePath,
    options,
  );
  stageResults.push(pixelStage);
  mergeStageResult(signals, pixelStage);

  const geometryStage = await runStage(
    "geometry_integrity",
    "silhouette_check",
    analyzeSilhouette,
    imagePath,
    options,
  );
  stageResults.push(geometryStage);
  mergeStageResult(signals, geometryStage);

  const saliencyStage = await runStage(
    "visual_hierarchy",
    "saliency_map",
    analyzeSaliency,
    imagePath,
    options,
  );
  stageResults.push(saliencyStage);
  mergeStageResult(signals, saliencyStage);

  const safeZoneStage = await runStage(
    "safe_zone_integrity",
    "safe_zone_mask",
    analyzeSafeZone,
    imagePath,
    options,
  );
  stageResults.push(safeZoneStage);
  mergeStageResult(signals, safeZoneStage);

  const colorStage = await runStage(
    "color_fidelity",
    "z_blue_detector",
    detectZBlue,
    imagePath,
    options,
  );
  stageResults.push(colorStage);
  mergeStageResult(signals, colorStage);

  if (shouldStopBeforeSemantics(signals, options)) {
    signals._vlm_status = "skipped_due_to_hard_fail";
    signals._vlm_signals_provided = 0;

    const pipelineEndedAt = nowMs();
    signals._analyzer_status = buildAnalyzerStatus(stageResults);
    signals._pipeline_status = {
      mode: "stage_based",
      semantic_stage_executed: false,
      stopped_early: true,
      started_at_ms: pipelineStartedAt,
      ended_at_ms: pipelineEndedAt,
      duration_ms: pipelineEndedAt - pipelineStartedAt,
    };

    return signals;
  }

  const semanticStage = await runStage(
    "semantic_validation",
    "vlm_semantic_analyzer",
    analyzeSemantics,
    imagePath,
    options,
  );
  stageResults.push(semanticStage);
  mergeStageResult(signals, semanticStage);

  const pipelineEndedAt = nowMs();
  signals._analyzer_status = buildAnalyzerStatus(stageResults);
  signals._pipeline_status = {
    mode: "stage_based",
    semantic_stage_executed: true,
    stopped_early: false,
    started_at_ms: pipelineStartedAt,
    ended_at_ms: pipelineEndedAt,
    duration_ms: pipelineEndedAt - pipelineStartedAt,
  };

  return signals;
}

module.exports = {
  runAllAnalyzers,
  setVLMClient,
};