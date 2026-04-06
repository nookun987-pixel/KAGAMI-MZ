/**
 * MIKAGE — /render/render_executor.js
 * Orchestrates the complete render pipeline with control token validation.
 *
 * Sequence (from spec §14):
 *   1. validateToken()
 *   2. vram_manager.beginOllamaPhase()
 *   3. ollama_translate.translate()
 *   4. translator_guard validates (inside translate())
 *   5. ollamaPhase.complete() → unload + clear + zombie check
 *   6. vram_manager.beginFooocusPhase()
 *   7. fooocus_client.submitRender()
 *   8. fooocusPhase.complete() → unload + clear + zombie check
 *   9. Return result for critic
 *
 * Non-bypass enforcement:
 *   - No render without valid control_token from precheck.js
 *   - Token must not be expired
 *   - Token job_id must match executing job
 */

"use strict";

const { validateToken } = require("../control/precheck");
const { translate } = require("../translator/ollama_translate");
const vram = require("./vram_manager");

// ===================================================================
// ERRORS
// ===================================================================

class RenderTokenError extends Error {
  constructor(reason) {
    super(`[RENDER_EXECUTOR] Token validation failed: ${reason}`);
    this.name = "RenderTokenError";
    this.reason = reason;
  }
}

class RenderAbortError extends Error {
  constructor(jobId, reason) {
    super(`[RENDER_EXECUTOR] Render aborted for job ${jobId}: ${reason}`);
    this.name = "RenderAbortError";
    this.job_id = jobId;
    this.reason = reason;
  }
}

// ===================================================================
// TOKEN VALIDATION — non-bypass enforcement
// ===================================================================

/**
 * Validate control token against job.
 * Enforces spec §14: no render without valid token.
 *
 * @param {Object} controlToken  Token from precheck.issueToken()
 * @param {string} jobId         Job ID being executed
 * @throws {RenderTokenError}
 */
function enforceToken(controlToken, jobId) {
  if (!controlToken) {
    throw new RenderTokenError("No control token provided");
  }

  if (!validateToken(controlToken)) {
    throw new RenderTokenError("Token invalid or expired");
  }

  if (controlToken.job_id !== jobId) {
    throw new RenderTokenError(
      `Token job_id "${controlToken.job_id}" does not match executing job "${jobId}"`
    );
  }
}

// ===================================================================
// FOOOCUS CLIENT — injectable interface
// ===================================================================

/**
 * Default Fooocus client. Calls the real Fooocus API via HTTP.
 * Replace via setFooocusClient() for testing.
 */
let _fooocusClient = {
  /**
   * Submit a render job to Fooocus.
   *
   * @param {Object} renderPacket  { prompt, negative_prompt, seed, width, height, performance }
   * @returns {Promise<Object>}    { output_file, seed_used, render_time_ms, status }
   */
  async submitRender(renderPacket) {
    const baseUrl = process.env.FOOOCUS_API || "http://127.0.0.1:7865";
    const timeoutMs = parseInt(process.env.FOOOCUS_TIMEOUT_MS) || 300000;
    const http = require("http");
    const fs = require("fs");
    const path = require("path");

    // Force bridge endpoint — /generate only, no Gradio / /api/predict / /v1/ paths
    const endpoint = "/generate";
    const urlStr = baseUrl.replace(/\/$/, "") + endpoint;
    console.log("Calling bridge:", urlStr);

    const body = JSON.stringify({
      prompt: renderPacket.prompt,
      negative_prompt: renderPacket.negative_prompt,
      seed: renderPacket.seed || -1,
      width: renderPacket.width || 1024,
      height: renderPacket.height || 384,
      performance_selection: renderPacket.performance || "Quality",
      style_selections: renderPacket.styles || [],
      async_process: false,
    });

    const startMs = Date.now();

    const response = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        req.destroy();
        reject(new Error(`[FOOOCUS] Render timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      const reqUrl = new URL(urlStr);
      const req = http.request(
        {
          hostname: reqUrl.hostname,
          port: reqUrl.port,
          path: reqUrl.pathname,
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
              reject(new Error(`[FOOOCUS] HTTP ${res.statusCode}: ${data.slice(0, 500)}`));
              return;
            }
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`[FOOOCUS] Response parse error: ${e.message}`));
            }
          });
        }
      );

      req.on("error", (e) => {
        clearTimeout(timer);
        reject(new Error(`[FOOOCUS] Connection error: ${e.message}`));
      });

      req.write(body);
      req.end();
    });

    const renderTimeMs = Date.now() - startMs;

    // Fooocus returns an array of results; take the first image
    const results = Array.isArray(response) ? response : [response];
    const first = results[0] || {};

    let outputFile = null;
    if (first.url) {
      outputFile = first.url;
    } else if (first.base64) {
      // Save base64 image to output directory
      const outputRoot = process.env.OUTPUT_ROOT || "./output";
      if (!fs.existsSync(outputRoot)) fs.mkdirSync(outputRoot, { recursive: true });
      const filename = `render_${Date.now()}_${Math.floor(Math.random() * 9999)}.png`;
      const outputPath = path.join(outputRoot, filename);
      fs.writeFileSync(outputPath, Buffer.from(first.base64, "base64"));
      outputFile = outputPath;
    }

    return {
      output_file: outputFile,
      seed_used: first.seed || renderPacket.seed || null,
      render_time_ms: renderTimeMs,
      status: "RENDERED",
    };
  },

  /**
   * Abort an in-progress render.
   * @param {string} jobId
   * @returns {Promise<void>}
   */
  async abortRender(jobId) {
    const baseUrl = process.env.FOOOCUS_API || "http://127.0.0.1:7865";
    const http = require("http");
    // Force bridge endpoint — /generate only
    const urlStr = baseUrl.replace(/\/$/, "") + "/generate";
    console.log("Calling bridge (abort):", urlStr);
    const reqUrl = new URL(urlStr);

    await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: reqUrl.hostname,
          port: reqUrl.port,
          path: reqUrl.pathname,
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => { data += chunk; });
          res.on("end", () => resolve(data));
        }
      );
      req.on("error", (e) => reject(e));
      req.end();
    });
  },
};

/**
 * Inject a custom Fooocus client (for testing or alternative backends).
 * @param {Object} client  Must have submitRender(packet) and abortRender(jobId)
 */
function setFooocusClient(client) {
  if (!client || typeof client.submitRender !== "function") {
    throw new Error("[RENDER_EXECUTOR] Fooocus client must have submitRender()");
  }
  _fooocusClient = client;
}

/** Get current Fooocus client. */
function getFooocusClient() {
  return _fooocusClient;
}

// ===================================================================
// RENDER PACKET BUILDER
// ===================================================================

/**
 * Build a Fooocus render packet from translation output.
 *
 * @param {Object} translationResult  From ollama_translate.translate()
 * @param {Object} renderOpts         { seed, width, height, performance, attempt }
 * @returns {Object}                   Fooocus-compatible render packet
 */
function buildRenderPacket(translationResult, renderOpts) {
  const opts = renderOpts || {};

  return {
    engine: "fooocus",
    prompt: translationResult.positive_prompt,
    negative_prompt: translationResult.negative_prompt,
    seed: opts.seed || null,
    width: opts.width || 1024,
    height: opts.height || 384,     // 2.76:1 at 1024 wide
    styles: [],                      // No Fooocus style presets — all style is upstream
    performance: opts.performance || "Quality",
    attempt: opts.attempt || 1,
  };
}

// ===================================================================
// MAIN EXECUTION
// ===================================================================

/**
 * @typedef {Object} RenderResult
 * @property {boolean}  success
 * @property {string}   job_id
 * @property {Object}   translation     Translation result (prompt strings)
 * @property {Object}   render          Fooocus render result
 * @property {Object}   render_packet   The packet sent to Fooocus
 * @property {Object[]} vram_trace      All VRAM lifecycle steps
 * @property {number}   total_time_ms   End-to-end execution time
 * @property {string}   status          "RENDERED" | "TRANSLATION_FAILED" | "RENDER_FAILED" | "ABORTED"
 */

/**
 * Execute the complete render pipeline for a job.
 *
 * @param {Object} job            Full job object
 * @param {Object} controlToken   Token from precheck.issueToken()
 * @param {Object} normalizedSpec Normalized prompt spec from mapper.normalize()
 * @param {Object} [renderOpts]   { seed, width, height, performance, attempt, translate_mode }
 * @returns {Promise<RenderResult>}
 */
async function executeRender(job, controlToken, normalizedSpec, renderOpts) {
  const startTime = Date.now();
  const jobId = job.job_id;
  const opts = renderOpts || {};
  const vramTrace = [];

  // === STEP 1: Validate token ===
  enforceToken(controlToken, jobId);

  let ollamaPhase = null;
  let fooocusPhase = null;

  try {
    // === STEP 2: Begin Ollama VRAM phase ===
    ollamaPhase = vram.beginOllamaPhase(jobId);
    vramTrace.push(...ollamaPhase.steps);

    // === STEP 3-4: Translate (includes guard validation) ===
    const translationResult = await translate(normalizedSpec, {
      mode: opts.translate_mode || "LOCAL",
    });

    // === STEP 5: Complete Ollama phase (unload + clear + zombies) ===
    vramTrace.push(...ollamaPhase.complete());
    ollamaPhase = null;

    // Check translation validity
    if (!translationResult.valid) {
      return {
        success: false,
        job_id: jobId,
        translation: translationResult,
        render: null,
        render_packet: null,
        vram_trace: vramTrace,
        total_time_ms: Date.now() - startTime,
        status: "TRANSLATION_FAILED",
      };
    }

    // === STEP 6: Begin Fooocus VRAM phase ===
    fooocusPhase = vram.beginFooocusPhase(jobId);
    vramTrace.push(...fooocusPhase.steps);

    // === STEP 7: Submit render to Fooocus ===
    const renderPacket = buildRenderPacket(translationResult, opts);
    let renderResult;

    try {
      renderResult = await _fooocusClient.submitRender(renderPacket);
    } catch (renderErr) {
      // Fooocus error — still need to clean up VRAM
      vramTrace.push(...fooocusPhase.complete());
      fooocusPhase = null;

      return {
        success: false,
        job_id: jobId,
        translation: translationResult,
        render: null,
        render_packet: renderPacket,
        vram_trace: vramTrace,
        total_time_ms: Date.now() - startTime,
        status: "RENDER_FAILED",
        error: renderErr.message,
      };
    }

    // === STEP 8: Complete Fooocus phase (unload + clear + zombies) ===
    vramTrace.push(...fooocusPhase.complete());
    fooocusPhase = null;

    // Populate seed from render result
    if (renderResult.seed_used) {
      renderPacket.seed = renderResult.seed_used;
    }

    return {
      success: true,
      job_id: jobId,
      translation: translationResult,
      render: renderResult,
      render_packet: renderPacket,
      vram_trace: vramTrace,
      total_time_ms: Date.now() - startTime,
      status: "RENDERED",
    };

  } catch (err) {
    // Ensure VRAM is cleaned up on any unexpected error
    try {
      if (ollamaPhase) ollamaPhase.complete();
    } catch (_) { /* best effort */ }
    try {
      if (fooocusPhase) fooocusPhase.complete();
    } catch (_) { /* best effort */ }

    // Force reset as last resort
    vram.forceReset(`Unexpected error in job ${jobId}: ${err.message}`);

    throw err;
  }
}

/**
 * Abort a render in progress.
 * Sends abort to Fooocus and forces VRAM cleanup.
 *
 * @param {string} jobId
 * @param {string} reason
 * @returns {Promise<Object>}
 */
async function abortRender(jobId, reason) {
  try {
    await _fooocusClient.abortRender(jobId);
  } catch (_) {
    // Best effort
  }

  const resetResult = vram.forceReset(reason);

  return {
    action: "ABORT",
    job_id: jobId,
    reason,
    vram_reset: resetResult,
    timestamp: new Date().toISOString(),
  };
}

// ===================================================================
// EXPORTS
// ===================================================================

module.exports = {
  // Main entry
  executeRender,
  abortRender,

  // Token enforcement
  enforceToken,

  // Render packet
  buildRenderPacket,

  // Fooocus client injection
  setFooocusClient,
  getFooocusClient,

  // Errors
  RenderTokenError,
  RenderAbortError,
};
