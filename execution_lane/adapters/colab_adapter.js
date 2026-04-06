/**
 * execution_lane/adapters/colab_adapter.js
 * PHASE 5 — Colab Runner Adapter
 *
 * Routes patched_job_spec execution to Colab runner → Imagen/Vertex.
 * Local = control plane only. Colab = job runner. Google = render execution.
 *
 * Brain decides. Execution only executes. No validator/judge inside execution.
 * No canon promotion. No auto retry. No second patch loop.
 * Fail closed if output.png does not exist after render.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const { BaseAdapter } = require("./adapter_interface");
const { buildExecutionResult } = require("../execution_result_contract");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const RUNS_DIR = path.join(ROOT_DIR, "runs");

// Colab shared storage paths (Google Drive mount or local staging)
const COLAB_INPUT_PATH = process.env.COLAB_INPUT_PATH || path.join(ROOT_DIR, "colab_jobs");
const COLAB_OUTPUT_PATH = process.env.COLAB_OUTPUT_PATH || path.join(ROOT_DIR, "colab_outputs");
const COLAB_POLL_INTERVAL_MS = parseInt(process.env.COLAB_POLL_INTERVAL_MS || "5000", 10);
const COLAB_TIMEOUT_MS = parseInt(process.env.COLAB_TIMEOUT_MS || "600000", 10); // 10 min

// ---------------------------------------------------------------------------
// TRANSLATE PATCHED_JOB_SPEC → COLAB RENDER JOB PAYLOAD
// ---------------------------------------------------------------------------
function buildColabPayload(spec) {
  const jobSpec = spec.job_spec;
  const input = jobSpec.input || {};
  const render = jobSpec.render || {};
  const provenance = spec.provenance || {};

  return {
    version: "1.0.0",
    job_id: jobSpec.job_id || provenance.source_run_id || `JOB-${Date.now()}`,
    shot_type: provenance.shot_type || jobSpec.shot_type || null,
    entity_id: provenance.entity_id || jobSpec.entity_id || null,
    prompt: input.prompt || "",
    negative_prompt: input.negative_prompt || "",
    seed: (spec.prompt_diff && spec.prompt_diff.seed_reference) || render.seed || null,
    seed_policy: render.seed_policy || "fixed",
    aspect_ratio: render.aspect_ratio || "1:1",
    width: render.width || 1024,
    height: render.height || 1024,
    rag_enabled: process.env.USE_REAL_VERTEX_RAG === "true",
    rag_query: `${provenance.shot_type || ""} ${input.prompt || ""}`.trim(),
    canon_flags: {
      entity_first: true,
      zone_locked: false,
      material_locked: false,
      reproduction_mode: false,
      anchor_images: [],
    },
    imagen_config: {
      model: "imagen-3.0-generate-001",
      number_of_images: 1,
      guidance_scale: render.guidance_scale || 7.5,
      safety_filter_level: "block_some",
      person_generation: "dont_allow",
    },
    control_core_metadata: {
      pipeline_version: "2.0",
      canon_version: "v2",
      intake_timestamp: new Date().toISOString(),
      spec_build_timestamp: new Date().toISOString(),
      execution_runner: "colab",
      execution_lane: "google",
      executor_type: "imagen_api",
    },
    created_at: new Date().toISOString(),
    submitted_to_runner: "colab",
  };
}

// ---------------------------------------------------------------------------
// SUBMIT JOB TO COLAB (write payload to shared storage)
// ---------------------------------------------------------------------------
function submitJob(payload) {
  const jobDir = path.join(COLAB_INPUT_PATH, payload.job_id);
  const outputDir = path.join(COLAB_OUTPUT_PATH, payload.job_id);

  if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Write render payload
  const payloadPath = path.join(jobDir, "render_job_payload.json");
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2), "utf-8");

  // Write output_path into payload for Colab to know where to write
  payload.output_path = outputDir;
  fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2), "utf-8");

  // Write marker to signal Colab
  const markerPath = path.join(jobDir, "job_ready.marker");
  fs.writeFileSync(
    markerPath,
    JSON.stringify({
      job_id: payload.job_id,
      submitted_at: new Date().toISOString(),
      status: "PENDING",
    }),
    "utf-8"
  );

  console.log(`[COLAB_ADAPTER] Job submitted: ${payloadPath}`);
  console.log(`[COLAB_ADAPTER] Expected output: ${outputDir}`);

  return { payloadPath, outputDir, markerPath, jobId: payload.job_id };
}

// ---------------------------------------------------------------------------
// POLL FOR COLAB COMPLETION
// ---------------------------------------------------------------------------
function pollForCompletion(submission) {
  return new Promise((resolve, reject) => {
    const outputDir = submission.outputDir;
    const completionMarker = path.join(outputDir, "completed.marker");
    const resultBundlePath = path.join(outputDir, "result_bundle.json");
    const outputPngPath = path.join(outputDir, "output.png");
    const startTime = Date.now();

    console.log(`[COLAB_ADAPTER] Polling for completion (timeout: ${COLAB_TIMEOUT_MS}ms)...`);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Timeout check
      if (elapsed >= COLAB_TIMEOUT_MS) {
        clearInterval(interval);
        reject(new Error(`Colab execution timed out after ${COLAB_TIMEOUT_MS}ms`));
        return;
      }

      // Check for completion marker
      if (fs.existsSync(completionMarker)) {
        clearInterval(interval);
        try {
          const marker = JSON.parse(fs.readFileSync(completionMarker, "utf-8"));

          if (marker.status === "SUCCESS") {
            if (!fs.existsSync(outputPngPath)) {
              reject(new Error("Colab completed but output.png not found"));
              return;
            }

            let resultBundle = null;
            if (fs.existsSync(resultBundlePath)) {
              resultBundle = JSON.parse(fs.readFileSync(resultBundlePath, "utf-8"));
            }

            resolve({
              status: "SUCCESS",
              outputPng: outputPngPath,
              resultBundle,
              marker,
            });
          } else if (marker.status === "FAILED") {
            reject(new Error(`Colab execution failed: ${marker.error || "Unknown error"}`));
          } else {
            reject(new Error(`Unknown completion status: ${marker.status}`));
          }
        } catch (err) {
          reject(new Error(`Failed to parse completion marker: ${err.message}`));
        }
        return;
      }

      // Progress logging every 30s
      if (elapsed % 30000 < COLAB_POLL_INTERVAL_MS) {
        console.log(`[COLAB_ADAPTER] Waiting... (${Math.round(elapsed / 1000)}s elapsed)`);
      }
    }, COLAB_POLL_INTERVAL_MS);
  });
}

// ---------------------------------------------------------------------------
// COLAB RUNNER ADAPTER
// ---------------------------------------------------------------------------
class ColabRunnerAdapter extends BaseAdapter {
  name() {
    return "colab_runner";
  }

  available() {
    // Colab runner is enabled via env var
    return (
      process.env.USE_COLAB_RUNNER === "true" ||
      process.env.EXECUTION_RUNNER === "colab"
    );
  }

  async checkAvailableAsync() {
    // Verify Colab shared storage paths are accessible
    const inputOk = fs.existsSync(COLAB_INPUT_PATH) || this._tryCreateDir(COLAB_INPUT_PATH);
    const outputOk = fs.existsSync(COLAB_OUTPUT_PATH) || this._tryCreateDir(COLAB_OUTPUT_PATH);
    return this.available() && inputOk && outputOk;
  }

  _tryCreateDir(dirPath) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      return true;
    } catch {
      return false;
    }
  }

  async execute(spec, executionId) {
    const startMs = Date.now();
    const jobSpec = spec.job_spec;
    const sourceRunId = spec.provenance ? spec.provenance.source_run_id : null;
    const runDir = sourceRunId ? path.join(RUNS_DIR, sourceRunId) : null;

    console.log(`[COLAB_ADAPTER] Starting execution ${executionId}`);

    // Validate input
    if (!jobSpec || !jobSpec.input || !jobSpec.input.prompt) {
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec ? jobSpec.job_id : null,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        error: "Invalid job_spec: missing input.prompt",
        artifacts: [],
      });
    }

    // Build Colab payload from patched_job_spec
    const payload = buildColabPayload(spec);
    console.log(`[COLAB_ADAPTER] Payload: job_id=${payload.job_id} prompt_len=${payload.prompt.length} ${payload.width}x${payload.height}`);

    // Save payload to run dir for audit
    if (runDir && fs.existsSync(runDir)) {
      const auditPath = path.join(runDir, "colab_render_payload.json");
      fs.writeFileSync(auditPath, JSON.stringify(payload, null, 2), "utf-8");
    }

    // Submit to Colab
    let submission;
    try {
      submission = submitJob(payload);
    } catch (err) {
      console.error(`[COLAB_ADAPTER] Submit failed: ${err.message}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: Date.now() - startMs,
        error: `Colab submit failed: ${err.message}`,
        artifacts: [],
      });
    }

    // Poll for completion
    let colabResult;
    try {
      colabResult = await pollForCompletion(submission);
    } catch (err) {
      console.error(`[COLAB_ADAPTER] Execution failed: ${err.message}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: Date.now() - startMs,
        error: `Colab execution failed: ${err.message}`,
        artifacts: [],
      });
    }

    const renderTimeMs = Date.now() - startMs;
    console.log(`[COLAB_ADAPTER] Colab completed in ${renderTimeMs}ms`);

    // Copy output.png to run directory
    if (!runDir || !fs.existsSync(runDir)) {
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: renderTimeMs,
        error: `Run directory not found: ${runDir}`,
        artifacts: [],
      });
    }

    const outputDest = path.join(runDir, "output.png");
    try {
      fs.copyFileSync(colabResult.outputPng, outputDest);
      console.log(`[COLAB_ADAPTER] Output copied: ${outputDest}`);
    } catch (err) {
      console.error(`[COLAB_ADAPTER] Copy failed: ${err.message}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: renderTimeMs,
        error: `Output copy failed: ${err.message}`,
        artifacts: [],
      });
    }

    // Copy result_bundle if available
    if (colabResult.resultBundle) {
      const bundleDest = path.join(runDir, "result_bundle.json");
      fs.writeFileSync(bundleDest, JSON.stringify(colabResult.resultBundle, null, 2), "utf-8");
    }

    // FAIL CLOSED: output.png must exist
    if (!fs.existsSync(outputDest)) {
      console.error(`[COLAB_ADAPTER] FAIL CLOSED: output.png does not exist at ${outputDest}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: renderTimeMs,
        error: "FAIL_CLOSED: output.png does not exist after Colab render",
        artifacts: [],
      });
    }

    const outputSize = fs.statSync(outputDest).size;
    console.log(`[COLAB_ADAPTER] Output: ${outputDest} (${outputSize} bytes)`);

    const adapterResponse = {
      dry_run: false,
      real_render: true,
      execution_runner: "colab",
      execution_lane: "google",
      executor_type: "imagen_api",
      output_file: outputDest,
      output_size_bytes: outputSize,
      seed_used: payload.seed,
      render_time_ms: renderTimeMs,
      colab_job_id: payload.job_id,
      colab_output_dir: submission.outputDir,
      payload_summary: {
        prompt_length: payload.prompt.length,
        negative_prompt_length: payload.negative_prompt.length,
        width: payload.width,
        height: payload.height,
        model: payload.imagen_config.model,
      },
    };

    return buildExecutionResult({
      execution_id: executionId,
      patched_job_id: jobSpec.job_id,
      source_run_id: sourceRunId,
      adapter_name: this.name(),
      execution_state: "EXECUTED",
      output_path: outputDest,
      output_exists: true,
      render_time_ms: renderTimeMs,
      error: null,
      adapter_response: adapterResponse,
      artifacts: [outputDest],
    });
  }
}

module.exports = { ColabRunnerAdapter };
