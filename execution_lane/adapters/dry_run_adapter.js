/**
 * execution_lane/adapters/dry_run_adapter.js
 * PHASE 4 — Dry Run Adapter (First Execution Adapter)
 *
 * Validates the contract and simulates execution without calling any external API.
 * Proves the full execution pipeline end-to-end.
 *
 * Brain decides. Execution only executes. No validator/judge inside execution.
 * No canon promotion. No auto retry. No second patch loop.
 */

"use strict";

const { BaseAdapter } = require("./adapter_interface");
const { buildExecutionResult } = require("../execution_result_contract");

class DryRunAdapter extends BaseAdapter {
  name() {
    return "dry_run";
  }

  available() {
    return true;
  }

  execute(spec, executionId) {
    const startMs = Date.now();
    console.log(`[DRY_RUN_ADAPTER] Executing ${executionId}`);

    const jobSpec = spec.job_spec;
    if (!jobSpec || !jobSpec.input || !jobSpec.input.prompt) {
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec ? jobSpec.job_id : null,
        source_run_id: spec.provenance ? spec.provenance.source_run_id : null,
        adapter_name: this.name(),
        execution_state: "FAILED",
        error: "Invalid job_spec: missing input.prompt",
        artifacts: [],
      });
    }

    // Simulate render timing (no actual API call)
    const simulatedRenderMs = 150 + Math.floor(Math.random() * 100);

    const adapterResponse = {
      dry_run: true,
      simulated: true,
      prompt_length: jobSpec.input.prompt.length,
      negative_prompt_length: (jobSpec.input.negative_prompt || "").length,
      render_config: jobSpec.render || {},
      shot_type: jobSpec.shot_type || null,
      entity_id: jobSpec.entity_id || null,
      patch_actions_count: (spec.patch_actions && spec.patch_actions.actions_applied)
        ? spec.patch_actions.actions_applied.length : 0,
      simulated_render_ms: simulatedRenderMs,
      message: "DRY_RUN: Contract validated. No image generated. Pipeline proven end-to-end.",
    };

    const elapsed = Date.now() - startMs;
    console.log(`[DRY_RUN_ADAPTER] Completed ${executionId} in ${elapsed}ms (simulated render: ${simulatedRenderMs}ms)`);

    return buildExecutionResult({
      execution_id: executionId,
      patched_job_id: jobSpec.job_id,
      source_run_id: spec.provenance ? spec.provenance.source_run_id : null,
      adapter_name: this.name(),
      execution_state: "EXECUTED",
      output_path: null,
      output_exists: false,
      render_time_ms: simulatedRenderMs,
      error: null,
      adapter_response: adapterResponse,
      artifacts: [],
    });
  }
}

module.exports = { DryRunAdapter };
