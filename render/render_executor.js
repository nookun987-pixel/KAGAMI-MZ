/**
 * MIKAGE — /render/render_executor.js
 * Orchestrates the complete render pipeline with control token validation.
 *
 * Sequence (from spec §14):
 *   1. validateToken()
 *   2. vram_manager.beginOllamaPhase()
 *   3. translate() — skipped if pre-translated prompts provided
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

const fs = require("fs");
const path = require("path");
const http = require("http");
const sharp = require("sharp");

const { validateToken } = require("../control/precheck");
const { translate } = require("../translator/ollama_translate");
const vram = require("./vram_manager");

// ===================================================================
// CONFIG
// ===================================================================

const DEFAULT_FOOOCUS_OUTPUT_DIR = "D:/Fooocus-main/outputs";
const DEFAULT_FOOOCUS_API_URL = "http://127.0.0.1:7865";
const DEFAULT_HTTP_TIMEOUT_MS = 600000;
const DEFAULT_CAPTURE_TIMEOUT_MS = 240000;
const DEFAULT_CAPTURE_POLL_MS = 2000;

// ===================================================================
// HELPERS
// ===================================================================

function _getTransportMode() {
  const raw = String(process.env.FOOOCUS_TRANSPORT || "http").trim().toLowerCase();
  if (raw === "http") return "http";
  return "folder_capture";
}

function _getFooocusOutputBase() {
  return process.env.FOOOCUS_OUTPUT_DIR || DEFAULT_FOOOCUS_OUTPUT_DIR;
}

function _getFooocusBaseUrl() {
  return process.env.FOOOCUS_API || process.env.FOOOCUS_API_URL || DEFAULT_FOOOCUS_API_URL;
}

function _isImageAnchoredReproduction(renderPacket) {
  return (
    renderPacket &&
    renderPacket.generation_mode === "reproduction" &&
    renderPacket.reproduction_anchor_mode === "image_anchored"
  );
}

function _getFastProfileSettings() {
  const profile = String(process.env.RENDER_PROFILE || "").trim().toUpperCase();
  if (profile !== "FAST_TEST") return null;
  return {
    profile,
    width: parseInt(process.env.FAST_WIDTH || "512", 10),
    height: parseInt(process.env.FAST_HEIGHT || "512", 10),
    steps: parseInt(process.env.FAST_STEPS || "16", 10),
    disable_refiner: String(process.env.FAST_DISABLE_REFINER || "true").toLowerCase() === "true",
  };
}

function _applyEffectiveRenderProfile(payloadObject) {
  const fast = _getFastProfileSettings();
  if (!fast) return payloadObject;
  return {
    ...payloadObject,
    width: fast.width,
    height: fast.height,
    steps: fast.steps,
    disable_refiner: fast.disable_refiner,
    style_selections: [],
    render_profile: fast.profile,
  };
}

function _findNewestPNG(baseDir, afterMs) {
  if (!fs.existsSync(baseDir)) return null;

  let newest = null;
  let newestMtime = afterMs;

  const scan = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      return;
    }

    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
        try {
          const stat = fs.statSync(full);
          if (stat.mtimeMs > newestMtime) {
            newestMtime = stat.mtimeMs;
            newest = full;
          }
        } catch (_) {
          // skip unreadable file
        }
      }
    }
  };

  scan(baseDir);
  return newest;
}

function _normalizeOutputFilePath(filePath) {
  if (!filePath) return null;
  return path.resolve(filePath);
}

function _ensureOutputRoot(outputRoot) {
  const normalizedRoot = _normalizeOutputFilePath(outputRoot || "./output");
  if (!fs.existsSync(normalizedRoot)) {
    fs.mkdirSync(normalizedRoot, { recursive: true });
  }
  return normalizedRoot;
}

function _writeFinalPayload(outputRoot, payloadObject) {
  try {
    const normalizedRoot = _ensureOutputRoot(outputRoot);
    const target = path.join(normalizedRoot, "render_payload.json");
    const body =
      typeof payloadObject === "string"
        ? payloadObject
        : JSON.stringify(payloadObject, null, 2);
    fs.writeFileSync(target, body, "utf-8");
    fs.writeFileSync(path.join(normalizedRoot, "final_payload.json"), body, "utf-8");
  } catch (err) {
    console.log(`[RENDER_EXECUTOR] Failed to write final payload: ${err.message}`);
  }
}

function _writeJsonArtifact(outputRoot, name, payload) {
  try {
    const normalizedRoot = _ensureOutputRoot(outputRoot);
    fs.writeFileSync(path.join(normalizedRoot, name), JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.log(`[RENDER_EXECUTOR] Failed to write ${name}: ${err.message}`);
  }
}

function _copyResolvedFileToOutput(resolvedPath, outputRoot, responseShape) {
  if (!resolvedPath) return null;

  try {
    const normalizedRoot = _ensureOutputRoot(outputRoot);
    const targetPath = path.join(normalizedRoot, "output.png");
    const normalizedSource = _normalizeOutputFilePath(resolvedPath);

    if (!fs.existsSync(normalizedSource) || !fs.statSync(normalizedSource).isFile()) {
      throw new Error("source file missing");
    }

    if (normalizedSource !== _normalizeOutputFilePath(targetPath)) {
      fs.copyFileSync(normalizedSource, targetPath);
    }

    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size <= 0) {
      throw new Error("copied image file is empty");
    }

    console.log(`[RENDER_EXECUTOR] Response shape detected: ${responseShape}`);
    console.log(`[RENDER_EXECUTOR] Final saved file path: ${targetPath}`);
    return targetPath;
  } catch (err) {
    console.log(`[RENDER_EXECUTOR] Failed to normalize response file ${resolvedPath}: ${err.message}`);
    return null;
  }
}

function _saveBase64ToOutput(base64Data, outputRoot) {
  if (!base64Data || typeof base64Data !== "string") return null;

  try {
    const normalizedRoot = _ensureOutputRoot(outputRoot);
    const targetPath = path.join(normalizedRoot, "output.png");
    fs.writeFileSync(targetPath, Buffer.from(base64Data, "base64"));

    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size <= 0) {
      throw new Error("decoded image file is empty");
    }

    console.log("[RENDER_EXECUTOR] Response shape detected: base64");
    console.log(`[RENDER_EXECUTOR] Final saved file path: ${targetPath}`);
    return targetPath;
  } catch (err) {
    console.log(`[RENDER_EXECUTOR] Failed to save base64 image: ${err.message}`);
    return null;
  }
}

function _resolveExistingImagePath(candidatePath, outputRoot) {
  if (!candidatePath || typeof candidatePath !== "string") return null;

  const fooocusOutputBase = _getFooocusOutputBase();
  const normalizedRoot = _ensureOutputRoot(outputRoot);
  const attempts = [];

  if (path.isAbsolute(candidatePath)) {
    attempts.push(candidatePath);
  } else {
    attempts.push(path.join(normalizedRoot, candidatePath));
    attempts.push(path.join(fooocusOutputBase, candidatePath));
    attempts.push(path.resolve(candidatePath));
  }

  for (const attempt of attempts) {
    const normalized = _normalizeOutputFilePath(attempt);
    try {
      if (fs.existsSync(normalized) && fs.statSync(normalized).isFile()) {
        return normalized;
      }
    } catch (_) {
      // skip bad path
    }
  }

  return null;
}

function _extractResponseImage(payload) {
  if (!payload) return { shape: "invalid", filePath: null };

  const base64Data =
    payload.base64 ||
    payload.image_base64 ||
    payload.imageBase64 ||
    payload.encoded_image ||
    payload.encodedImage ||
    null;

  if (base64Data) {
    return { shape: "base64", base64Data };
  }

  const fileCandidate =
    payload.output_file ||
    payload.file_path ||
    payload.path ||
    payload.filename ||
    payload.file_name ||
    payload.url ||
    null;

  if (fileCandidate) {
    return { shape: "file", filePath: fileCandidate };
  }

  return { shape: "invalid", filePath: null };
}

function _normalizeFooocusResponse(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.images)) return response.images;
  if (Array.isArray(response.results)) return response.results;
  if (Array.isArray(response.data)) return response.data;
  if (response.result && Array.isArray(response.result)) return response.result;
  if (response.result && typeof response.result === "object") return [response.result];
  return [response];
}

function _extractNestedValue(payload, paths) {
  for (const pathParts of paths) {
    let current = payload;
    let ok = true;
    for (const part of pathParts) {
      if (!current || typeof current !== "object" || !(part in current)) {
        ok = false;
        break;
      }
      current = current[part];
    }
    if (ok && current !== undefined && current !== null && current !== "") {
      return current;
    }
  }
  return null;
}

async function _readPngMetadata(imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) return {};
  try {
    const meta = await sharp(imagePath).metadata();
    return {
      pixel_width: meta.width || null,
      pixel_height: meta.height || null,
      width: meta.width || null,
      height: meta.height || null,
      density: meta.density || null,
      format: meta.format || null,
      channels: meta.channels || null,
      text: meta.text || {},
    };
  } catch (err) {
    return { error: err.message };
  }
}

function _extractTelemetryFromResponse(response) {
  const results = _normalizeFooocusResponse(response);
  const first = results[0] || {};
  const actualSteps = _extractNestedValue(first, [
    ["steps"],
    ["params", "steps"],
    ["advanced_params", "steps"],
    ["meta", "steps"],
    ["image_info", "steps"],
  ]);
  const actualWidth = _extractNestedValue(first, [
    ["width"],
    ["params", "width"],
    ["advanced_params", "width"],
    ["meta", "width"],
    ["image_info", "width"],
  ]);
  const actualHeight = _extractNestedValue(first, [
    ["height"],
    ["params", "height"],
    ["advanced_params", "height"],
    ["meta", "height"],
    ["image_info", "height"],
  ]);
  const sampler = _extractNestedValue(first, [
    ["sampler"],
    ["params", "sampler"],
    ["advanced_params", "sampler"],
    ["meta", "sampler"],
    ["image_info", "sampler"],
  ]);
  const scheduler = _extractNestedValue(first, [
    ["scheduler"],
    ["params", "scheduler"],
    ["advanced_params", "scheduler"],
    ["meta", "scheduler"],
    ["image_info", "scheduler"],
  ]);
  return {
    actual_steps: actualSteps,
    actual_width: actualWidth,
    actual_height: actualHeight,
    sampler,
    scheduler,
    response_keys: Object.keys(first),
  };
}

function _captureOutputFromResponse(response, outputRoot) {
  const results = _normalizeFooocusResponse(response);
  const first = results[0] || {};
  console.log(
    `[RENDER_EXECUTOR] Response has ${results.length} result(s), keys: ${Object.keys(first).join(",")}`
  );

  for (const payload of results) {
    const extracted = _extractResponseImage(payload);

    if (extracted.shape === "base64") {
      const saved = _saveBase64ToOutput(extracted.base64Data, outputRoot);
      if (saved) return saved;
    }

    if (extracted.shape === "file") {
      const resolved = _resolveExistingImagePath(extracted.filePath, outputRoot);
      if (resolved) {
        const responseShape = path.isAbsolute(extracted.filePath) ? "path" : "filename";
        const saved = _copyResolvedFileToOutput(resolved, outputRoot, responseShape);
        if (saved) return saved;
      }
      console.log(`[RENDER_EXECUTOR] Response referenced missing file: ${extracted.filePath}`);
    }
  }

  console.log("[RENDER_EXECUTOR] Response shape detected: invalid");
  return null;
}

function _fallbackCapture(startMs, outputRoot) {
  const fooocusOutputBase = _getFooocusOutputBase();
  console.log(
    `[RENDER_EXECUTOR] Fallback capture: scanning ${fooocusOutputBase} for PNGs after ${new Date(
      startMs
    ).toISOString()}`
  );

  try {
    const newest = _findNewestPNG(fooocusOutputBase, startMs);
    if (newest) {
      const normalizedRoot = _ensureOutputRoot(outputRoot);
      const destPath = path.join(normalizedRoot, "output.png");
      fs.copyFileSync(newest, destPath);

      if (!fs.existsSync(destPath) || fs.statSync(destPath).size <= 0) {
        throw new Error("captured output file is empty");
      }

      console.log(
        `[RENDER_EXECUTOR] Fallback captured: ${newest} → ${destPath} (${fs.statSync(destPath).size} bytes)`
      );
      return destPath;
    }

    console.log(`[RENDER_EXECUTOR] Fallback: no PNG found after ${startMs}`);
  } catch (scanErr) {
    console.log(`[RENDER_EXECUTOR] Fallback scan error: ${scanErr.message}`);
  }

  return null;
}

async function _waitForCapturedOutput(startMs, outputRoot, maxWaitMs, pollIntervalMs) {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const captured = _fallbackCapture(startMs, outputRoot);
    if (captured) {
      console.log(`[RENDER_EXECUTOR] Final saved file path: ${captured}`);
      return _normalizeOutputFilePath(captured);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

async function _clearFooocusQueue() {
  const transportMode = _getTransportMode();

  if (transportMode !== "http") {
    console.log("[RENDER_EXECUTOR] Queue clear skipped in Fooocus UI mode");
    return;
  }

  const baseUrl = _getFooocusBaseUrl();

  try {
    const url = new URL(baseUrl + "/v1/generation/stop");
    await new Promise((resolve) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        },
        (res) => {
          let data = "";
          res.on("data", (c) => {
            data += c;
          });
          res.on("end", () => {
            console.log(`[RENDER_EXECUTOR] Queue clear response: ${data}`);
            resolve();
          });
        }
      );

      req.on("error", () => resolve());
      req.on("timeout", () => {
        req.destroy();
        resolve();
      });
      req.end();
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch (_) {
    // best effort
  }
}

async function _submitRenderViaHttp(renderPacket, outputRoot, startMs) {
  const baseUrl = _getFooocusBaseUrl();
  const timeoutMs = parseInt(process.env.FOOOCUS_TIMEOUT_MS, 10) || DEFAULT_HTTP_TIMEOUT_MS;
  const captureTimeoutMs =
    parseInt(process.env.FOOOCUS_CAPTURE_TIMEOUT_MS, 10) || DEFAULT_CAPTURE_TIMEOUT_MS;
  const pollIntervalMs =
    parseInt(process.env.FOOOCUS_CAPTURE_POLL_MS, 10) || DEFAULT_CAPTURE_POLL_MS;

  const url = new URL(baseUrl + "/generate");
  const requestedPayload = {
    prompt: renderPacket.prompt,
    negative_prompt: renderPacket.negative_prompt,
    seed: renderPacket.seed || -1,
    width: renderPacket.width || 1024,
    height: renderPacket.height || 384,
    steps: Number.isFinite(renderPacket.steps) ? renderPacket.steps : -1,
    disable_refiner: !!renderPacket.disable_refiner,
    performance_selection: renderPacket.performance || "Quality",
    guidance_scale: Number.isFinite(renderPacket.guidance_scale) ? renderPacket.guidance_scale : 7.0,
    sampler: renderPacket.sampler || null,
    scheduler: renderPacket.scheduler || null,
    sharpness: Number.isFinite(renderPacket.sharpness) ? renderPacket.sharpness : 2.0,
    style_selections: [],
    image_number: Number.isFinite(renderPacket.image_number) ? renderPacket.image_number : 1,
    async_process: false,
    generation_mode: renderPacket.generation_mode || "exploration",
    reference_master: renderPacket.reference_master || null,
    reproduction_constraints: renderPacket.reproduction_constraints || null,
    reproduction_anchor_mode: renderPacket.reproduction_anchor_mode || null,
    anchor_image_path: renderPacket.anchor_image_path || null,
    anchor_strength: Number.isFinite(renderPacket.anchor_strength) ? renderPacket.anchor_strength : null,
    denoise_strength: Number.isFinite(renderPacket.denoise_strength) ? renderPacket.denoise_strength : null,
    composition_lock_strength: Number.isFinite(renderPacket.composition_lock_strength) ? renderPacket.composition_lock_strength : null,
    silhouette_lock_strength: Number.isFinite(renderPacket.silhouette_lock_strength) ? renderPacket.silhouette_lock_strength : null,
    anchor_method_used: renderPacket.anchor_method_used || null,
    image_anchor_success_expected: renderPacket.image_anchor_success_expected === true,
    preservation_mode: renderPacket.preservation_mode || null,
    reconstruction_priority: renderPacket.reconstruction_priority || null,
    prompt_weight_reduction_when_anchor_present: Number.isFinite(renderPacket.prompt_weight_reduction_when_anchor_present) ? renderPacket.prompt_weight_reduction_when_anchor_present : null,
  };
  // --- Preflight fail-fast: strong preservation requires valid anchor ---
  if (renderPacket.preservation_mode === "strong_preservation") {
    if (!renderPacket.anchor_image_path) {
      throw new Error("STRONG_PRESERVATION_PREFLIGHT_FAIL: anchor_image_path missing — cannot proceed with strong_preservation mode");
    }
    const preflightPath = _normalizeOutputFilePath(renderPacket.anchor_image_path);
    if (!fs.existsSync(preflightPath)) {
      throw new Error(`STRONG_PRESERVATION_PREFLIGHT_FAIL: anchor image not found on disk: ${preflightPath}`);
    }
  }
  if (_isImageAnchoredReproduction(renderPacket)) {
    if (!renderPacket.anchor_image_path) {
      throw new Error("IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE: anchor_image_path missing");
    }
    const normalizedAnchorPath = _normalizeOutputFilePath(renderPacket.anchor_image_path);
    if (!fs.existsSync(normalizedAnchorPath)) {
      throw new Error(`IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE: anchor image missing on disk: ${normalizedAnchorPath}`);
    }
  }
  const bodyObject = _applyEffectiveRenderProfile(requestedPayload);

  _writeFinalPayload(outputRoot, bodyObject);

  console.log(`[RENDER_EXECUTOR] Sending render to ${url.href}`);
  console.log(`[RENDER_EXECUTOR] Prompt: ${String(renderPacket.prompt || "").slice(0, 120)}...`);
  console.log(`[RENDER_EXECUTOR] style_selections: ${JSON.stringify(bodyObject.style_selections)}`);
  console.log(`[RENDER_EXECUTOR] Output dir: ${outputRoot}`);
  console.log(`[RENDER_EXECUTOR] HTTP timeout: ${timeoutMs}ms`);
  console.log(`[RENDER_EXECUTOR] Capture timeout: ${captureTimeoutMs}ms`);

  let responseSeed = null;
  let responseTelemetry = null;

  const requestOutcome = await new Promise((resolve) => {
    const body = JSON.stringify(bodyObject);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          console.log(`[RENDER_EXECUTOR] HTTP ${res.statusCode}, response ${data.length} bytes`);

          if (res.statusCode >= 400) {
            resolve({
              kind: "error",
              error: new Error(`HTTP ${res.statusCode}: ${data.slice(0, 500)}`),
            });
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const normalized = _normalizeFooocusResponse(parsed);
            if (normalized[0] && normalized[0].seed) {
              responseSeed = normalized[0].seed;
            }
            responseTelemetry = _extractTelemetryFromResponse(parsed);
            _writeJsonArtifact(outputRoot, "render_response_raw.json", parsed);
            resolve({ kind: "response", response: parsed });
          } catch (err) {
            resolve({
              kind: "error",
              error: new Error(`Response parse error: ${err.message}`),
            });
          }
        });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Render timeout after ${timeoutMs}ms`));
    });

    req.on("error", (err) => {
      resolve({
        kind: "error",
        error: new Error(`Connection error: ${err.message}`),
      });
    });

    req.write(body);
    req.end();
  });

  let capturedOutputFile = null;

  if (requestOutcome.kind === "response") {
    capturedOutputFile = _captureOutputFromResponse(requestOutcome.response, outputRoot);
  } else {
    console.log(`[RENDER_EXECUTOR] Failure reason: ${requestOutcome.error.message}`);
  }

  if (!capturedOutputFile) {
    capturedOutputFile = await _waitForCapturedOutput(
      startMs,
      outputRoot,
      captureTimeoutMs,
      pollIntervalMs
    );
  }

  _writeJsonArtifact(outputRoot, "render_timing.json", {
    started_at: new Date(startMs).toISOString(),
    ended_at: new Date().toISOString(),
    requested_steps: bodyObject.steps,
    requested_width: bodyObject.width,
    requested_height: bodyObject.height,
    disable_refiner: bodyObject.disable_refiner,
    render_profile: bodyObject.render_profile || "DEFAULT",
  });

  if (capturedOutputFile && (!fs.existsSync(capturedOutputFile) || fs.statSync(capturedOutputFile).size <= 0)) {
    console.log(
      `[RENDER_EXECUTOR] Failure reason: verified output file missing or empty at ${capturedOutputFile}`
    );
    capturedOutputFile = null;
  }

  const renderTimeMs = Date.now() - startMs;

  if (capturedOutputFile) {
    const pngMeta = await _readPngMetadata(capturedOutputFile);
    let actualSteps = responseTelemetry && responseTelemetry.actual_steps;
    let actualStepsSource = "response";
    if (actualSteps === null || actualSteps === undefined || actualSteps === "" || Number(actualSteps) < 0) {
      const pngTextSteps =
        pngMeta && pngMeta.text
          ? pngMeta.text.steps || pngMeta.text.Steps || pngMeta.text.parameters || null
          : null;
      if (pngTextSteps && /^\d+$/.test(String(pngTextSteps))) {
        actualSteps = parseInt(String(pngTextSteps), 10);
        actualStepsSource = "png_metadata";
      } else {
        actualSteps = bodyObject.steps > 0 ? bodyObject.steps : 16;
        actualStepsSource = "fallback_requested";
      }
    }
    const requestedWidth = bodyObject.width;
    const requestedHeight = bodyObject.height;
    const responseWidth = responseTelemetry && responseTelemetry.actual_width
      ? Number(responseTelemetry.actual_width)
      : null;
    const responseHeight = responseTelemetry && responseTelemetry.actual_height
      ? Number(responseTelemetry.actual_height)
      : null;
    const embeddedMetadataWidth =
      pngMeta && pngMeta.text
        ? Number(pngMeta.text.width || pngMeta.text.Width || pngMeta.text.image_width || pngMeta.text.ImageWidth || null)
        : null;
    const embeddedMetadataHeight =
      pngMeta && pngMeta.text
        ? Number(pngMeta.text.height || pngMeta.text.Height || pngMeta.text.image_height || pngMeta.text.ImageHeight || null)
        : null;
    const actualFileWidth = pngMeta && pngMeta.pixel_width ? Number(pngMeta.pixel_width) : null;
    const actualFileHeight = pngMeta && pngMeta.pixel_height ? Number(pngMeta.pixel_height) : null;
    const hasSizeMismatch =
      !!actualFileWidth &&
      !!actualFileHeight &&
      (
        requestedWidth !== actualFileWidth ||
        requestedHeight !== actualFileHeight ||
        (responseWidth !== null && responseWidth !== actualFileWidth) ||
        (responseHeight !== null && responseHeight !== actualFileHeight)
      );
    const telemetryWarnings = [];
    if (pngMeta && pngMeta.error) {
      telemetryWarnings.push("WARN_TELEMETRY");
    }
    if (!actualFileWidth || !actualFileHeight) {
      telemetryWarnings.push("WARN_TELEMETRY");
    }
    if (hasSizeMismatch) {
      telemetryWarnings.push("SIZE_MISMATCH");
    }
    const outputMetadata = {
      requested_steps: bodyObject.steps > 0 ? bodyObject.steps : 16,
      actual_steps: Number(actualSteps),
      actual_steps_source: actualStepsSource,
      requested_width: requestedWidth,
      requested_height: requestedHeight,
      requested_size: `${requestedWidth}x${requestedHeight}`,
      response_width: responseWidth,
      response_height: responseHeight,
      response_reported_size:
        responseWidth && responseHeight ? `${responseWidth}x${responseHeight}` : null,
      embedded_metadata_width: embeddedMetadataWidth,
      embedded_metadata_height: embeddedMetadataHeight,
      actual_file_width: actualFileWidth,
      actual_file_height: actualFileHeight,
      actual_file_size:
        actualFileWidth && actualFileHeight ? `${actualFileWidth}x${actualFileHeight}` : null,
      actual_file_size_source: "png_pixels",
      truth_width: actualFileWidth || requestedWidth,
      truth_height: actualFileHeight || requestedHeight,
      size_truth_source: "png_pixels",
      actual_width: actualFileWidth || requestedWidth,
      actual_height: actualFileHeight || requestedHeight,
      actual_size: `${actualFileWidth || requestedWidth}x${actualFileHeight || requestedHeight}`,
      sampler: (responseTelemetry && responseTelemetry.sampler) || null,
      scheduler: (responseTelemetry && responseTelemetry.scheduler) || null,
      source_job_response_path: path.join(_ensureOutputRoot(outputRoot), "render_response_raw.json"),
      telemetry_warning: telemetryWarnings[0] || null,
      telemetry_warnings: telemetryWarnings,
      png_metadata: pngMeta,
    };
    _writeJsonArtifact(outputRoot, "output_metadata.json", outputMetadata);
    console.log(`[RENDER_EXECUTOR] Render complete: ${capturedOutputFile} (${renderTimeMs}ms)`);
    return {
      output_file: _normalizeOutputFilePath(capturedOutputFile),
      seed_used: responseSeed || renderPacket.seed || null,
      render_time_ms: renderTimeMs,
      status: "RENDERED",
      requested_steps: outputMetadata.requested_steps,
      actual_steps: outputMetadata.actual_steps,
      actual_steps_source: outputMetadata.actual_steps_source,
      requested_size: outputMetadata.requested_size,
      response_reported_size: outputMetadata.response_reported_size,
      actual_file_size: outputMetadata.actual_file_size,
      actual_size: outputMetadata.actual_size,
      actual_file_width: outputMetadata.actual_file_width,
      actual_file_height: outputMetadata.actual_file_height,
      actual_width: outputMetadata.actual_width,
      actual_height: outputMetadata.actual_height,
      size_truth_source: outputMetadata.size_truth_source,
      sampler: outputMetadata.sampler,
      scheduler: outputMetadata.scheduler,
      telemetry_warning: outputMetadata.telemetry_warning,
      telemetry_warnings: outputMetadata.telemetry_warnings,
      source_job_response_path: outputMetadata.source_job_response_path,
    };
  }

  const failureReason =
    requestOutcome && requestOutcome.kind === "error"
      ? requestOutcome.error.message
      : "response contained no usable image payload";

  console.log(`[RENDER_EXECUTOR] Failure reason: ${failureReason}`);

  return {
    output_file: null,
    seed_used: responseSeed || renderPacket.seed || null,
    render_time_ms: renderTimeMs,
    status: "RENDER_FAILED",
    error: failureReason,
  };
}

async function _submitRenderViaFolderCapture(renderPacket, outputRoot, startMs) {
  if (_isImageAnchoredReproduction(renderPacket)) {
    return {
      output_file: null,
      seed_used: renderPacket.seed || null,
      render_time_ms: 0,
      status: "RENDER_FAILED",
      error: "IMAGE_ANCHORED_REPRODUCTION_NOT_AVAILABLE: folder_capture transport cannot apply anchor image controls",
    };
  }
  const captureTimeoutMs =
    parseInt(process.env.FOOOCUS_CAPTURE_TIMEOUT_MS, 10) || DEFAULT_CAPTURE_TIMEOUT_MS;
  const pollIntervalMs =
    parseInt(process.env.FOOOCUS_CAPTURE_POLL_MS, 10) || DEFAULT_CAPTURE_POLL_MS;

  const payloadObject = {
    engine: "fooocus_ui_mode",
    prompt: renderPacket.prompt,
    negative_prompt: renderPacket.negative_prompt,
    seed: renderPacket.seed || -1,
    width: renderPacket.width || 1024,
    height: renderPacket.height || 384,
    steps: Number.isFinite(renderPacket.steps) ? renderPacket.steps : -1,
    disable_refiner: !!renderPacket.disable_refiner,
    performance_selection: renderPacket.performance || "Quality",
    guidance_scale: Number.isFinite(renderPacket.guidance_scale) ? renderPacket.guidance_scale : 7.0,
    sampler: renderPacket.sampler || null,
    scheduler: renderPacket.scheduler || null,
    sharpness: Number.isFinite(renderPacket.sharpness) ? renderPacket.sharpness : 2.0,
    style_selections: [],
    image_number: Number.isFinite(renderPacket.image_number) ? renderPacket.image_number : 1,
    async_process: false,
    transport_mode: "folder_capture",
  };

  _writeFinalPayload(outputRoot, payloadObject);

  console.log("[RENDER_EXECUTOR] Fooocus UI mode detected — using fallback folder capture only");
  console.log(`[RENDER_EXECUTOR] style_selections: ${JSON.stringify(payloadObject.style_selections)}`);
  console.log(`[RENDER_EXECUTOR] Output dir: ${outputRoot}`);
  console.log(`[RENDER_EXECUTOR] Capture timeout: ${captureTimeoutMs}ms`);

  const capturedOutputFile = await _waitForCapturedOutput(
    startMs,
    outputRoot,
    captureTimeoutMs,
    pollIntervalMs
  );

  const renderTimeMs = Date.now() - startMs;

  if (capturedOutputFile && fs.existsSync(capturedOutputFile) && fs.statSync(capturedOutputFile).size > 0) {
    const pngMeta = await _readPngMetadata(capturedOutputFile);
    const outputMetadata = {
      requested_steps: payloadObject.steps > 0 ? payloadObject.steps : 16,
      actual_steps: payloadObject.steps > 0 ? payloadObject.steps : 16,
      actual_steps_source: "fallback_requested",
      requested_width: payloadObject.width,
      requested_height: payloadObject.height,
      requested_size: `${payloadObject.width}x${payloadObject.height}`,
      response_width: null,
      response_height: null,
      response_reported_size: null,
      embedded_metadata_width: pngMeta && pngMeta.text
        ? Number(pngMeta.text.width || pngMeta.text.Width || pngMeta.text.image_width || pngMeta.text.ImageWidth || null)
        : null,
      embedded_metadata_height: pngMeta && pngMeta.text
        ? Number(pngMeta.text.height || pngMeta.text.Height || pngMeta.text.image_height || pngMeta.text.ImageHeight || null)
        : null,
      actual_file_width: pngMeta && pngMeta.pixel_width ? Number(pngMeta.pixel_width) : null,
      actual_file_height: pngMeta && pngMeta.pixel_height ? Number(pngMeta.pixel_height) : null,
      actual_file_size:
        pngMeta && pngMeta.pixel_width && pngMeta.pixel_height
          ? `${pngMeta.pixel_width}x${pngMeta.pixel_height}`
          : null,
      actual_file_size_source: "png_pixels",
      truth_width: pngMeta && pngMeta.pixel_width ? Number(pngMeta.pixel_width) : payloadObject.width,
      truth_height: pngMeta && pngMeta.pixel_height ? Number(pngMeta.pixel_height) : payloadObject.height,
      size_truth_source: "png_pixels",
      actual_width: pngMeta && pngMeta.pixel_width ? Number(pngMeta.pixel_width) : payloadObject.width,
      actual_height: pngMeta && pngMeta.pixel_height ? Number(pngMeta.pixel_height) : payloadObject.height,
      actual_size: `${pngMeta && pngMeta.pixel_width ? pngMeta.pixel_width : payloadObject.width}x${pngMeta && pngMeta.pixel_height ? pngMeta.pixel_height : payloadObject.height}`,
      sampler: null,
      scheduler: null,
      source_job_response_path: null,
      telemetry_warning:
        pngMeta && pngMeta.pixel_width && pngMeta.pixel_height &&
        (pngMeta.pixel_width !== payloadObject.width || pngMeta.pixel_height !== payloadObject.height)
          ? "SIZE_MISMATCH"
          : null,
      telemetry_warnings:
        pngMeta && pngMeta.pixel_width && pngMeta.pixel_height &&
        (pngMeta.pixel_width !== payloadObject.width || pngMeta.pixel_height !== payloadObject.height)
          ? ["SIZE_MISMATCH"]
          : [],
      png_metadata: pngMeta,
    };
    _writeJsonArtifact(outputRoot, "output_metadata.json", outputMetadata);
    console.log(`[RENDER_EXECUTOR] Render complete via folder capture: ${capturedOutputFile} (${renderTimeMs}ms)`);
    return {
      output_file: _normalizeOutputFilePath(capturedOutputFile),
      seed_used: renderPacket.seed || null,
      render_time_ms: renderTimeMs,
      status: "RENDERED_FALLBACK",
      requested_steps: outputMetadata.requested_steps,
      actual_steps: outputMetadata.actual_steps,
      actual_steps_source: outputMetadata.actual_steps_source,
      requested_size: outputMetadata.requested_size,
      response_reported_size: outputMetadata.response_reported_size,
      actual_file_size: outputMetadata.actual_file_size,
      actual_size: outputMetadata.actual_size,
      actual_file_width: outputMetadata.actual_file_width,
      actual_file_height: outputMetadata.actual_file_height,
      actual_width: outputMetadata.actual_width,
      actual_height: outputMetadata.actual_height,
      size_truth_source: outputMetadata.size_truth_source,
      telemetry_warning: outputMetadata.telemetry_warning,
      telemetry_warnings: outputMetadata.telemetry_warnings,
    };
  }

  return {
    output_file: null,
    seed_used: null,
    render_time_ms: renderTimeMs,
    status: "RENDER_FAILED",
    error: "No output detected from Fooocus output folder",
  };
}

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

let _fooocusClient = {
  async submitRender(renderPacket) {
    const transportMode = _getTransportMode();
    const startMs = Date.now();
    const outputRoot = _ensureOutputRoot(
      renderPacket._output_dir || process.env.OUTPUT_ROOT || "./output"
    );

    if (transportMode === "http") {
      return _submitRenderViaHttp(renderPacket, outputRoot, startMs);
    }

    return _submitRenderViaFolderCapture(renderPacket, outputRoot, startMs);
  },

  async abortRender(jobId) {
    const transportMode = _getTransportMode();

    if (transportMode !== "http") {
      console.log(`[RENDER_EXECUTOR] Abort skipped in Fooocus UI mode for job ${jobId}`);
      return "";
    }

    const baseUrl = _getFooocusBaseUrl();
    const url = new URL(baseUrl + "/v1/generation/stop");

    await new Promise((resolve) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => resolve(data));
        }
      );

      req.on("error", () => resolve(""));
      req.on("timeout", () => {
        req.destroy();
        resolve("");
      });
      req.end();
    });
  },
};

function setFooocusClient(client) {
  if (!client || typeof client.submitRender !== "function") {
    throw new Error("[RENDER_EXECUTOR] Fooocus client must have submitRender()");
  }
  _fooocusClient = client;
}

function getFooocusClient() {
  return _fooocusClient;
}

// ===================================================================
// RENDER PACKET BUILDER
// ===================================================================

function buildRenderPacket(translationResult, renderOpts) {
  const opts = renderOpts || {};

  return {
    engine: "fooocus",
    prompt: translationResult.positive_prompt,
    negative_prompt: translationResult.negative_prompt,
    seed: opts.seed || null,
    width: opts.width || 1024,
    height: opts.height || 384,
    steps: Number.isFinite(opts.steps) ? opts.steps : -1,
    disable_refiner: !!opts.disable_refiner,
    guidance_scale: Number.isFinite(opts.guidance_scale) ? opts.guidance_scale : 7.0,
    sampler: opts.sampler || null,
    scheduler: opts.scheduler || null,
    sharpness: Number.isFinite(opts.sharpness) ? opts.sharpness : 2.0,
    image_number: Number.isFinite(opts.image_number) ? opts.image_number : 1,
    styles: [],
    performance: opts.performance || "Quality",
    attempt: opts.attempt || 1,
    _output_dir: opts.output_dir || null,
    generation_mode: opts.generation_mode || "exploration",
    reference_master: opts.reference_master || null,
    reproduction_constraints: opts.reproduction_constraints || null,
    reproduction_anchor_mode: opts.reproduction_anchor_mode || null,
    anchor_image_path: opts.anchor_image_path || null,
    anchor_strength: Number.isFinite(opts.anchor_strength) ? opts.anchor_strength : null,
    denoise_strength: Number.isFinite(opts.denoise_strength) ? opts.denoise_strength : null,
    composition_lock_strength: Number.isFinite(opts.composition_lock_strength) ? opts.composition_lock_strength : null,
    silhouette_lock_strength: Number.isFinite(opts.silhouette_lock_strength) ? opts.silhouette_lock_strength : null,
    anchor_method_used: opts.anchor_method_used || null,
    image_anchor_success_expected: opts.image_anchor_success_expected === true,
    preservation_mode: opts.preservation_mode || null,
    reconstruction_priority: opts.reconstruction_priority || null,
    prompt_weight_reduction_when_anchor_present: Number.isFinite(opts.prompt_weight_reduction_when_anchor_present) ? opts.prompt_weight_reduction_when_anchor_present : null,
  };
}

// ===================================================================
// MAIN EXECUTION
// ===================================================================

async function executeRender(job, controlToken, normalizedSpec, renderOpts) {
  const startTime = Date.now();
  const jobId = job.job_id;
  const opts = renderOpts || {};
  const vramTrace = [];

  enforceToken(controlToken, jobId);

  let ollamaPhase = null;
  let fooocusPhase = null;

  try {
    let translationResult;

    if (opts.prompt && opts.negative_prompt) {
      console.log("[RENDER_EXECUTOR] Using pre-translated prompts (skip Ollama phase)");
      translationResult = {
        valid: true,
        positive_prompt: opts.prompt,
        negative_prompt: opts.negative_prompt,
        technical_notes: [],
        mode: "PRE_TRANSLATED",
        guard_result: { verdict: "PASS", violations: [], summary: [] },
        attempts: 0,
      };

      ollamaPhase = vram.beginOllamaPhase(jobId);
      vramTrace.push(...ollamaPhase.steps);
      vramTrace.push(...ollamaPhase.complete());
      ollamaPhase = null;
    } else {
      ollamaPhase = vram.beginOllamaPhase(jobId);
      vramTrace.push(...ollamaPhase.steps);

      translationResult = await translate(normalizedSpec, {
        mode: opts.translate_mode || "LOCAL",
      });

      vramTrace.push(...ollamaPhase.complete());
      ollamaPhase = null;
    }

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

    console.log("[RENDER_EXECUTOR] Clearing Fooocus queue before render...");
    await _clearFooocusQueue();

    fooocusPhase = vram.beginFooocusPhase(jobId);
    vramTrace.push(...fooocusPhase.steps);

    const renderPacket = buildRenderPacket(translationResult, opts);
    console.log(`[RENDER_EXECUTOR] Submitting render for job ${jobId}`);

    let renderResult;

    try {
      renderResult = await _fooocusClient.submitRender(renderPacket);
    } catch (renderErr) {
      console.log(`[RENDER_EXECUTOR] submitRender threw: ${renderErr.message}`);

      const outputRoot = opts.output_dir || process.env.OUTPUT_ROOT || "./output";
      console.log("[RENDER_EXECUTOR] Waiting 15s before last-resort fallback capture...");
      await new Promise((resolve) => setTimeout(resolve, 15000));

      let fallbackFile = _fallbackCapture(
        renderErr.renderStartMs || startTime,
        outputRoot
      );

      if (!fallbackFile) {
        console.log("[RENDER_EXECUTOR] Retrying fallback with wider window (-120s)");
        fallbackFile = _fallbackCapture(
          (renderErr.renderStartMs || startTime) - 120000,
          outputRoot
        );
      }

      vramTrace.push(...fooocusPhase.complete());
      fooocusPhase = null;

      if (fallbackFile) {
        console.log(`[RENDER_EXECUTOR] Recovered via fallback: ${fallbackFile}`);
        return {
          success: true,
          job_id: jobId,
          translation: translationResult,
          render: {
            output_file: _normalizeOutputFilePath(fallbackFile),
            seed_used: opts.seed || null,
            render_time_ms: Date.now() - startTime,
            status: "RENDERED_VIA_FALLBACK",
          },
          render_packet: renderPacket,
          vram_trace: vramTrace,
          total_time_ms: Date.now() - startTime,
          status: "RENDERED",
        };
      }

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

    vramTrace.push(...fooocusPhase.complete());
    fooocusPhase = null;

    if (renderResult.seed_used) {
      renderPacket.seed = renderResult.seed_used;
    }

    return {
      success: !!renderResult.output_file,
      job_id: jobId,
      translation: translationResult,
      render: renderResult,
      render_packet: renderPacket,
      vram_trace: vramTrace,
      total_time_ms: Date.now() - startTime,
      status: renderResult.output_file ? "RENDERED" : "RENDER_FAILED",
    };
  } catch (err) {
    try {
      if (ollamaPhase) ollamaPhase.complete();
    } catch (_) {
      // best effort
    }

    try {
      if (fooocusPhase) fooocusPhase.complete();
    } catch (_) {
      // best effort
    }

    vram.forceReset(`Unexpected error in job ${jobId}: ${err.message}`);
    throw err;
  }
}

async function abortRender(jobId, reason) {
  try {
    await _fooocusClient.abortRender(jobId);
  } catch (_) {
    // best effort
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
  executeRender,
  abortRender,
  enforceToken,
  buildRenderPacket,
  setFooocusClient,
  getFooocusClient,
  RenderTokenError,
  RenderAbortError,
  _findNewestPNG,
  _fallbackCapture,
  _clearFooocusQueue,
  _waitForCapturedOutput,
};
