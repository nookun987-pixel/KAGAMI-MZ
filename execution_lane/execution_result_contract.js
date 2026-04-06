/**
 * execution_lane/execution_result_contract.js
 * PHASE 4 — Execution Result Contract
 *
 * Defines the standardized result shape for all execution adapters.
 * Required output states: EXECUTED, REJECTED, EXECUTION_UNAVAILABLE, FAILED
 *
 * Brain decides. Execution only executes. No validator/judge inside execution.
 */

"use strict";

const EXECUTION_STATES = ["EXECUTED", "REJECTED", "EXECUTION_UNAVAILABLE", "FAILED"];

// ---------------------------------------------------------------------------
// VALIDATE PATCHED JOB SPEC INPUT
// Checks that the spec has the minimum required fields for execution.
// Returns { ok, errors[] }
// ---------------------------------------------------------------------------
function validatePatchedJobSpec(spec) {
  const errors = [];

  if (!spec) {
    return { ok: false, errors: ["spec is null or undefined"] };
  }

  // Must have _meta
  if (!spec._meta || !spec._meta.generator) {
    errors.push("missing _meta.generator");
  }

  // Must have provenance
  if (!spec.provenance || !spec.provenance.source_run_id) {
    errors.push("missing provenance.source_run_id");
  }

  // Must have job_spec
  if (!spec.job_spec) {
    errors.push("missing job_spec");
  } else {
    if (!spec.job_spec.job_id) errors.push("missing job_spec.job_id");
    if (!spec.job_spec.type) errors.push("missing job_spec.type");
    if (!spec.job_spec.input) errors.push("missing job_spec.input");
    if (spec.job_spec.input && !spec.job_spec.input.prompt) errors.push("missing job_spec.input.prompt");
    if (!spec.job_spec.render) errors.push("missing job_spec.render");
  }

  // Must have patch_actions
  if (!spec.patch_actions) {
    errors.push("missing patch_actions");
  }

  return { ok: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// BUILD EXECUTION RESULT
// Every execution adapter must return this shape.
// ---------------------------------------------------------------------------
function buildExecutionResult({
  execution_id,
  patched_job_id,
  source_run_id,
  adapter_name,
  execution_state,
  output_path,
  output_exists,
  render_time_ms,
  error,
  adapter_response,
  artifacts,
}) {
  if (!EXECUTION_STATES.includes(execution_state)) {
    throw new Error(`Invalid execution_state: "${execution_state}". Must be one of: ${EXECUTION_STATES.join(", ")}`);
  }

  return {
    execution_id: execution_id || null,
    patched_job_id: patched_job_id || null,
    source_run_id: source_run_id || null,
    adapter_name: adapter_name || null,
    execution_state,
    ok: execution_state === "EXECUTED",
    output_path: output_path || null,
    output_exists: output_exists || false,
    render_time_ms: render_time_ms || null,
    error: error || null,
    adapter_response: adapter_response || null,
    artifacts: artifacts || [],
    executed_at: new Date().toISOString(),
  };
}

module.exports = {
  EXECUTION_STATES,
  validatePatchedJobSpec,
  buildExecutionResult,
};
