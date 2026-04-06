/**
 * execution_lane/adapters/fooocus_adapter.js
 * PHASE 5 — Real Fooocus Render Adapter
 *
 * Calls the local Fooocus bridge at http://127.0.0.1:7865/generate
 * to execute a real render from a validated patched_job_spec.
 *
 * Brain decides. Execution only executes. No validator/judge inside execution.
 * No canon promotion. No auto retry. No second patch loop.
 * Fail closed if output.png does not exist after render.
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const { BaseAdapter } = require("./adapter_interface");
const { buildExecutionResult } = require("../execution_result_contract");

const FOOOCUS_URL = process.env.FOOOCUS_API || "http://127.0.0.1:7866";
const FOOOCUS_TIMEOUT_MS = parseInt(process.env.FOOOCUS_TIMEOUT_MS) || 600000;
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const RUNS_DIR = path.join(ROOT_DIR, "runs");

// ---------------------------------------------------------------------------
// ASPECT RATIO MATCHING (mirrors fooocus_bridge.py)
// ---------------------------------------------------------------------------
const ASPECT_PRESETS = [
  [704, 1408, "704\u00d71408"], [704, 1344, "704\u00d71344"],
  [768, 1344, "768\u00d71344"], [768, 1280, "768\u00d71280"],
  [832, 1216, "832\u00d71216"], [832, 1152, "832\u00d71152"],
  [896, 1152, "896\u00d71152"], [896, 1088, "896\u00d71088"],
  [960, 1088, "960\u00d71088"], [960, 1024, "960\u00d71024"],
  [1024, 1024, "1024\u00d71024"],
  [1024, 960, "1024\u00d7960"], [1088, 960, "1088\u00d7960"],
  [1088, 896, "1088\u00d7896"], [1152, 896, "1152\u00d7896"],
  [1152, 832, "1152\u00d7832"], [1216, 832, "1216\u00d7832"],
  [1280, 768, "1280\u00d7768"], [1344, 768, "1344\u00d7768"],
  [1344, 704, "1344\u00d7704"], [1408, 704, "1408\u00d7704"],
];

function matchAspect(width, height) {
  const target = width / height;
  let best = "1024\u00d71024";
  let bestDiff = Infinity;
  for (const [w, h, label] of ASPECT_PRESETS) {
    const diff = Math.abs((w / h) - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = label;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// CONVERT PATCHED JOB SPEC → FOOOCUS RENDER PAYLOAD
// ---------------------------------------------------------------------------
function buildFooocusPayload(spec) {
  const jobSpec = spec.job_spec;
  const render = jobSpec.render || {};
  const input = jobSpec.input || {};
  const width = render.width || 1152;
  const height = render.height || 1152;

  return {
    prompt: input.prompt || "",
    negative_prompt: input.negative_prompt || "",
    seed: (spec.prompt_diff && spec.prompt_diff.seed_reference) || -1,
    width,
    height,
    performance_selection: render.performance || "Speed",
    style_selections: [],
    image_number: 1,
    guidance_scale: 7.0,
    sharpness: 2.0,
    async_process: false,
  };
}

// ---------------------------------------------------------------------------
// HTTP POST TO FOOOCUS BRIDGE
// ---------------------------------------------------------------------------
function callFooocusBridge(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const urlObj = new URL(FOOOCUS_URL);
    const endpoint = "/generate";

    const timer = setTimeout(() => {
      req.destroy();
      reject(new Error(`Fooocus render timeout after ${FOOOCUS_TIMEOUT_MS}ms`));
    }, FOOOCUS_TIMEOUT_MS);

    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: endpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          clearTimeout(timer);
          if (res.statusCode >= 400) {
            reject(new Error(`Fooocus HTTP ${res.statusCode}: ${data.slice(0, 500)}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Fooocus response parse error: ${e.message}`));
          }
        });
      }
    );

    req.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`Fooocus connection error: ${e.message}`));
    });

    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// CHECK FOOOCUS HEALTH
// ---------------------------------------------------------------------------
function checkFooocusHealth() {
  return new Promise((resolve) => {
    const urlObj = new URL(FOOOCUS_URL);
    const timer = setTimeout(() => {
      req.destroy();
      resolve(false);
    }, 5000);

    const req = http.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: "/",
        method: "GET",
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          clearTimeout(timer);
          resolve(res.statusCode === 200);
        });
      }
    );

    req.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });

    req.end();
  });
}

// ---------------------------------------------------------------------------
// SAVE OUTPUT IMAGE
// ---------------------------------------------------------------------------
function saveOutputImage(response, runDir) {
  const results = Array.isArray(response) ? response : [response];
  const first = results[0] || {};

  // Case 1: Fooocus returns a file path (url field)
  if (first.url) {
    const sourcePath = first.url;
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(runDir, "output.png");
      fs.copyFileSync(sourcePath, destPath);
      return { outputPath: destPath, seed: first.seed || null };
    }
    return { outputPath: null, seed: first.seed || null, error: `File not found: ${sourcePath}` };
  }

  // Case 2: Fooocus returns base64 image data
  if (first.base64) {
    const destPath = path.join(runDir, "output.png");
    fs.writeFileSync(destPath, Buffer.from(first.base64, "base64"));
    return { outputPath: destPath, seed: first.seed || null };
  }

  return { outputPath: null, seed: null, error: "No url or base64 in Fooocus response" };
}

// ---------------------------------------------------------------------------
// FOOOCUS ADAPTER CLASS
// ---------------------------------------------------------------------------
class FooocusAdapter extends BaseAdapter {
  constructor() {
    super();
    this._available = null;
    this._lastCheck = 0;
  }

  name() {
    return "fooocus_local";
  }

  available() {
    // Sync check: cache health for 30s to avoid blocking on every resolve
    const now = Date.now();
    if (this._available !== null && (now - this._lastCheck) < 30000) {
      return this._available;
    }
    // Default to false for sync call — async availability checked in execute
    return false;
  }

  async checkAvailableAsync() {
    const healthy = await checkFooocusHealth();
    this._available = healthy;
    this._lastCheck = Date.now();
    return healthy;
  }

  async execute(spec, executionId) {
    const startMs = Date.now();
    const jobSpec = spec.job_spec;
    const sourceRunId = spec.provenance ? spec.provenance.source_run_id : null;
    const runDir = sourceRunId ? path.join(RUNS_DIR, sourceRunId) : null;

    console.log(`[FOOOCUS_ADAPTER] Starting execution ${executionId}`);

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

    // Check health before render
    const healthy = await checkFooocusHealth();
    if (!healthy) {
      console.log(`[FOOOCUS_ADAPTER] Fooocus bridge not reachable at ${FOOOCUS_URL}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "EXECUTION_UNAVAILABLE",
        error: `Fooocus bridge not reachable at ${FOOOCUS_URL}`,
        artifacts: [],
      });
    }

    // Build payload
    const payload = buildFooocusPayload(spec);
    console.log(`[FOOOCUS_ADAPTER] Payload: prompt_len=${payload.prompt.length} neg_len=${payload.negative_prompt.length} ${payload.width}x${payload.height} seed=${payload.seed}`);

    // Save render payload for audit
    if (runDir && fs.existsSync(runDir)) {
      const payloadPath = path.join(runDir, "fooocus_render_payload.json");
      fs.writeFileSync(payloadPath, JSON.stringify(payload, null, 2), "utf-8");
    }

    // Call Fooocus
    let response;
    try {
      response = await callFooocusBridge(payload);
    } catch (err) {
      console.error(`[FOOOCUS_ADAPTER] Render call failed: ${err.message}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: Date.now() - startMs,
        error: `Fooocus render failed: ${err.message}`,
        artifacts: [],
      });
    }

    const renderTimeMs = Date.now() - startMs;
    console.log(`[FOOOCUS_ADAPTER] Fooocus responded in ${renderTimeMs}ms`);

    // Save output image
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

    const saved = saveOutputImage(response, runDir);

    // FAIL CLOSED: output.png must exist
    if (!saved.outputPath || !fs.existsSync(saved.outputPath)) {
      console.error(`[FOOOCUS_ADAPTER] FAIL CLOSED: output.png does not exist. ${saved.error || ""}`);
      return buildExecutionResult({
        execution_id: executionId,
        patched_job_id: jobSpec.job_id,
        source_run_id: sourceRunId,
        adapter_name: this.name(),
        execution_state: "FAILED",
        render_time_ms: renderTimeMs,
        error: `FAIL_CLOSED: output.png does not exist after render. ${saved.error || ""}`,
        adapter_response: { raw_response_keys: Object.keys(Array.isArray(response) ? response[0] || {} : response) },
        artifacts: [],
      });
    }

    const outputSize = fs.statSync(saved.outputPath).size;
    console.log(`[FOOOCUS_ADAPTER] Output: ${saved.outputPath} (${outputSize} bytes)`);

    const adapterResponse = {
      dry_run: false,
      real_render: true,
      fooocus_url: FOOOCUS_URL,
      output_file: saved.outputPath,
      output_size_bytes: outputSize,
      seed_used: saved.seed,
      render_time_ms: renderTimeMs,
      payload_summary: {
        prompt_length: payload.prompt.length,
        negative_prompt_length: payload.negative_prompt.length,
        width: payload.width,
        height: payload.height,
        performance: payload.performance_selection,
      },
    };

    return buildExecutionResult({
      execution_id: executionId,
      patched_job_id: jobSpec.job_id,
      source_run_id: sourceRunId,
      adapter_name: this.name(),
      execution_state: "EXECUTED",
      output_path: saved.outputPath,
      output_exists: true,
      render_time_ms: renderTimeMs,
      error: null,
      adapter_response: adapterResponse,
      artifacts: [saved.outputPath],
    });
  }
}

module.exports = { FooocusAdapter };
