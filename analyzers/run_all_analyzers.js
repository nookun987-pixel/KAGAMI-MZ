/**
 * MIKAGE — Master Analyzer Runner
 * Runs all image analyzers and returns a complete signal map
 * for the Mikage rule engine.
 */

"use strict";

const { analyzePixels } = require("./pixel_analyzer");
const { detectZBlue } = require("./z_blue_detector");
const { analyzeSafeZone } = require("./safe_zone_mask");
const { analyzeSilhouette } = require("./silhouette_check");
const { analyzeSaliency } = require("./saliency_map");
const { analyzeSemantics, setVLMClient } = require("./vlm_semantic_analyzer");

/**
 * Run all analyzers on an image and return the merged signal map.
 * All analyzers run in parallel for speed.
 *
 * @param {string} imagePath - Absolute path to the rendered image
 * @returns {Promise<Object>} Combined signal map with all measurable signals
 */
async function runAllAnalyzers(imagePath) {
  const [pixels, zBlue, safeZone, silhouette, saliency, semantics] = await Promise.all([
    analyzePixels(imagePath).catch(err => ({ _error: `pixel_analyzer: ${err.message}` })),
    detectZBlue(imagePath).catch(err => ({ _error: `z_blue_detector: ${err.message}` })),
    analyzeSafeZone(imagePath).catch(err => ({ _error: `safe_zone_mask: ${err.message}` })),
    analyzeSilhouette(imagePath).catch(err => ({ _error: `silhouette_check: ${err.message}` })),
    analyzeSaliency(imagePath).catch(err => ({ _error: `saliency_map: ${err.message}` })),
    analyzeSemantics(imagePath).catch(err => ({ _error: `vlm_semantic_analyzer: ${err.message}` })),
  ]);

  // Collect errors
  const errors = [];
  for (const result of [pixels, zBlue, safeZone, silhouette, saliency, semantics]) {
    if (result._error) errors.push(result._error);
  }

  // Merge all signals into flat map
  const signals = {
    ...pixels,
    ...zBlue,
    ...safeZone,
    ...silhouette,
    ...saliency,
    ...semantics,
  };

  // Remove internal _error keys from merged object
  delete signals._error;

  // Tag which analyzers succeeded
  signals._analyzer_status = {
    pixel_analyzer: !pixels._error,
    z_blue_detector: !zBlue._error,
    safe_zone_mask: !safeZone._error,
    silhouette_check: !silhouette._error,
    saliency_map: !saliency._error,
    vlm_semantic_analyzer: !semantics._error,
    errors: errors.length > 0 ? errors : undefined,
  };

  return signals;
}

module.exports = { runAllAnalyzers };
