/**
 * MIKAGE — Rule Engine v2
 * Evaluates 24 rules (T1-T13, I1-I7, C1-C4) against measured signals.
 *
 * Key change from v1: if a required signal is missing → UNKNOWN, not PASS.
 * "No fake pass. If signal missing → mark as UNKNOWN, not PASS."
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ===================================================================
// RULE SIGNAL REQUIREMENTS
// Maps each rule ID to the signals it needs for evaluation.
// If ANY required signal is undefined in the input, the rule → UNKNOWN.
// ===================================================================

const RULE_REQUIRED_SIGNALS = {
  T1:  ["bounding_box_width_percentage"],
  T2:  ["distorted_pixel_ratio"],
  T3:  ["pixel_displacement", "rgb_glitch_count"],
  T4:  ["mesh_deformation_delta", "boundary_intersection"],
  T5:  ["edge_blur_radius", "pixel_bleed_percentage"],
  T6:  ["high_frequency_pixel_density_delta", "edge_halo_detection"],
  T7:  ["z_blue_delta_e", "z_blue_color_shift_detected"],
  T8:  ["saliency_peak_zone"],
  T9:  ["rgb_chromatic_split_noise", "vhs_noise_pattern"],
  T10: ["line_angle_deviation", "grid_snap_variance"],
  T11: ["exposure_value_delta", "histogram_clipping"],
  T12: ["geometry_symmetry_ratio"],  // eye_detection_confidence is VLM-only, partial OK
  T13: ["line_curvature_degree", "ornament_bounding_box"],
  I1:  ["human_eyes_detected", "face_mesh_visible"],
  I2:  ["high_gloss_specular", "pvc_plastic_read"],
  I3:  ["missing_weave_texture", "soft_fabric_folds_on_joints"],
  I4:  ["magenta_neon_spill", "chaotic_particle_bloom"],
  I5:  ["toon_shading", "chibi_proportions"],
  I6:  ["cyan_magenta_overload", "lens_flare_spam"],
  I7:  ["silhouette_read_time", "edge_separation_score"],
  C1:  ["recognition_time_seconds", "primary_subject_confidence"],
  C2:  ["logo_overlap_ratio", "branding_zone_distortion_contact"],
  C3:  ["thumbnail_subject_retention", "thumbnail_saliency_rank"],
  C4:  ["product_color_delta_e", "regional_hsv_shift"],
};

// ===================================================================
// HELPERS
// ===================================================================

function decisionFromPriority(priorities) {
  if (priorities.includes("ABSOLUTE")) {
    return { passed: false, block_level: "ABSOLUTE", decision: "REJECT" };
  }
  if (priorities.includes("CRITICAL")) {
    return { passed: false, block_level: "CRITICAL", decision: "RETRY" };
  }
  if (priorities.includes("HIGH")) {
    return { passed: true, block_level: "HIGH", decision: "ALLOW_WITH_FLAG" };
  }
  return { passed: true, block_level: "NONE", decision: "ALLOW" };
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/**
 * Check if required signals are present (not undefined) in the signal map.
 * Returns list of missing signal names.
 */
function getMissingSignals(ruleId, signals) {
  const required = RULE_REQUIRED_SIGNALS[ruleId] || [];
  return required.filter(s => signals[s] === undefined);
}

// ===================================================================
// RULE EVALUATION
// ===================================================================

/**
 * Evaluate a single rule against signals.
 * Returns:
 *   { status: "PASS"|"FAIL"|"UNKNOWN", rule_id, priority?, missing_signals? }
 */
function evaluateRule(rule, signals) {
  // Check for missing signals first
  const missing = getMissingSignals(rule.id, signals);
  if (missing.length > 0) {
    return {
      status: "UNKNOWN",
      rule_id: rule.id,
      priority: rule.priority,
      missing_signals: missing,
    };
  }

  // All required signals present — evaluate the rule
  let failed = false;

  switch (rule.id) {
    case "T1":
      failed = signals.bounding_box_width_percentage < 35 ||
               signals.bounding_box_width_percentage > 45;
      break;

    case "T2":
      failed = signals.distorted_pixel_ratio > 0.5;
      break;

    case "T3":
      failed = signals.pixel_displacement > 0 || signals.rgb_glitch_count > 0;
      break;

    case "T4":
      failed = signals.mesh_deformation_delta > 0 || signals.boundary_intersection > 0;
      break;

    case "T5":
      failed = signals.edge_blur_radius > 0 || signals.pixel_bleed_percentage > 5;
      break;

    case "T6":
      failed = signals.high_frequency_pixel_density_delta < 0 ||
               signals.edge_halo_detection > 0;
      break;

    case "T7":
      failed = signals.z_blue_delta_e > 0 || signals.z_blue_color_shift_detected > 0;
      break;

    case "T8":
      failed = signals.saliency_peak_zone !== "product_safe_zone";
      break;

    case "T9":
      failed = signals.rgb_chromatic_split_noise > 0 || signals.vhs_noise_pattern > 0;
      break;

    case "T10":
      failed = signals.line_angle_deviation > 5 || signals.grid_snap_variance > 0;
      break;

    case "T11":
      failed = Math.abs(signals.exposure_value_delta) > 0.3 ||
               signals.histogram_clipping > 0;
      break;

    case "T12":
      failed = signals.geometry_symmetry_ratio < 98 ||
               (signals.eye_detection_confidence || 0) > 0;
      break;

    case "T13":
      failed = signals.line_curvature_degree > 0 || signals.ornament_bounding_box > 0;
      break;

    case "I1":
      failed = signals.human_eyes_detected > 0 || signals.face_mesh_visible > 0;
      break;

    case "I2":
      failed = signals.high_gloss_specular > 0 || signals.pvc_plastic_read > 0;
      break;

    case "I3":
      failed = signals.missing_weave_texture > 0 || signals.soft_fabric_folds_on_joints > 0;
      break;

    case "I4":
      failed = signals.magenta_neon_spill > 0 || signals.chaotic_particle_bloom > 0;
      break;

    case "I5":
      failed = signals.toon_shading > 0 || signals.chibi_proportions > 0;
      break;

    case "I6":
      failed = signals.cyan_magenta_overload > 0 || signals.lens_flare_spam > 0;
      break;

    case "I7":
      failed = signals.silhouette_read_time > 1 || signals.edge_separation_score <= 0;
      break;

    case "C1":
      failed = signals.recognition_time_seconds > 1 || signals.primary_subject_confidence <= 0;
      break;

    case "C2":
      failed = signals.logo_overlap_ratio > 0 || signals.branding_zone_distortion_contact > 0;
      break;

    case "C3":
      failed = signals.thumbnail_subject_retention <= 0 ||
               signals.thumbnail_saliency_rank !== "subject";
      break;

    case "C4":
      failed = signals.product_color_delta_e > 0 || signals.regional_hsv_shift > 0;
      break;

    default:
      return { status: "UNKNOWN", rule_id: rule.id, missing_signals: ["unrecognized_rule"] };
  }

  return failed
    ? { status: "FAIL", rule_id: rule.id, priority: rule.priority }
    : { status: "PASS", rule_id: rule.id };
}

// ===================================================================
// MAIN ENTRY
// ===================================================================

/**
 * Run the full Mikage rule engine.
 *
 * @param {{ specPath: string, signals: Object }} opts
 * @returns {{
 *   passed: boolean,
 *   block_level: string,
 *   decision: string,
 *   failed_rules: string[],
 *   unknown_rules: string[],
 *   rule_results: Object[],
 *   stats: { total, passed, failed, unknown, enforced_pct }
 * }}
 */
function runRuleEngine({ specPath, signals }) {
  const spec = loadJson(specPath);
  const results = spec.map(rule => evaluateRule(rule, signals));

  const passed = results.filter(r => r.status === "PASS");
  const failed = results.filter(r => r.status === "FAIL");
  const unknown = results.filter(r => r.status === "UNKNOWN");

  const failedPriorities = failed.map(r => r.priority);
  const decision = decisionFromPriority(failedPriorities);

  const total = results.length;
  const enforcedCount = passed.length + failed.length;
  const enforcedPct = total > 0 ? Math.round((enforcedCount / total) * 100) : 0;

  // [C] NORMALIZED SCHEMA — single contract, no blind merge
  const failedRuleIds   = failed.map(f => f.rule_id);
  const unknownRuleIds  = unknown.map(u => u.rule_id);
  const hardFails       = failed.filter(f => f.priority === "ABSOLUTE" || f.priority === "CRITICAL");
  const softFails       = failed.filter(f => f.priority !== "ABSOLUTE" && f.priority !== "CRITICAL");
  const warnings        = [
    ...unknownRuleIds.map(id => `UNKNOWN_SIGNAL: ${id}`),
    ...softFails.map(f => `SOFT_FAIL: ${f.rule_id} (${f.priority || "HIGH"})`),
  ];

  return {
    // Core pass/fail
    pass: decision.passed,
    passed: decision.passed,           // alias for compatibility
    block_level: decision.block_level,
    decision: decision.decision,
    // [C] Required fields
    failed_rules:    failedRuleIds,
    unknown_rules:   unknownRuleIds,
    hard_fail_count: hardFails.length,
    unknown_count:   unknown.length,
    warnings,
    // Signals echoed as-is for downstream trace (no mutation)
    signals: signals || {},
    // Raw results for deep audit
    rule_results: results,
    stats: {
      total,
      passed:       passed.length,
      failed:       failed.length,
      unknown:      unknown.length,
      hard_fails:   hardFails.length,
      soft_fails:   softFails.length,
      enforced_pct: enforcedPct,
    },
  };
}

module.exports = {
  runRuleEngine,
  evaluateRule,
  getMissingSignals,
  RULE_REQUIRED_SIGNALS,
};
