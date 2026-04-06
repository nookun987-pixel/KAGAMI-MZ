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
const DEFAULT_HTTP_TIMEOUT_MS = 300000;  // 5 min for img2img tests
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
  // --- DEBUG: Log before any transformation ---
  console.log(`[RENDER_EXECUTOR] _applyEffectiveRenderProfile INPUT:`);
  console.log(`[RENDER_EXECUTOR]   anchor_image_base64: ${payloadObject.anchor_image_base64 ? 'PRESENT' : 'NONE'}`);
  console.log(`[RENDER_EXECUTOR]   denoise_strength: ${payloadObject.denoise_strength}`);
  
  const fast = _getFastProfileSettings();
  if (!fast) {
    console.log(`[RENDER_EXECUTOR] _applyEffectiveRenderProfile: No fast profile, returning unchanged`);
    return payloadObject;
  }
  
  const result = {
    ...payloadObject,
    width: fast.width,
    height: fast.height,
    steps: fast.steps,
    disable_refiner: fast.disable_refiner,
    style_selections: [],
    render_profile: fast.profile,
  };
  
  console.log(`[RENDER_EXECUTOR] _applyEffectiveRenderProfile OUTPUT:`);
  console.log(`[RENDER_EXECUTOR]   anchor_image_base64: ${result.anchor_image_base64 ? 'PRESENT' : 'NONE'}`);
  console.log(`[RENDER_EXECUTOR]   denoise_strength: ${result.denoise_strength}`);
  
  return result;
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
  let pollCount = 0;

  while (Date.now() < deadline) {
    pollCount++;
    console.log(`[RENDER_EXECUTOR] Poll cycle ${pollCount}: ${new Date().toISOString()}`);
    
    // Log newest PNGs during polling
    const fooocusOutputBase = _getFooocusOutputBase();
    const newestFiles = _getNewestPNGs(fooocusOutputBase, 5);
    console.log(`[RENDER_EXECUTOR] Newest 5 PNGs:`);
    newestFiles.forEach((file, i) => {
      const isNewer = file.mtimeMs > startMs;
      console.log(`[RENDER_EXECUTOR]   ${i+1}. ${path.basename(file.path)} - ${file.mtime} (${isNewer ? 'NEWER' : 'OLDER'})`);
    });
    
    const captured = _fallbackCapture(startMs, outputRoot);
    if (captured) {
      console.log(`[RENDER_EXECUTOR] Final saved file path: ${captured}`);
      return _normalizeOutputFilePath(captured);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

function _getNewestPNGs(baseDir, count) {
  if (!fs.existsSync(baseDir)) return [];

  const files = [];
  
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
          files.push({
            path: full,
            mtimeMs: stat.mtimeMs,
            mtime: stat.mtime
          });
        } catch (_) {
          // skip unreadable file
        }
      }
    }
  };

  scan(baseDir);
  return files.sort((a, b) => b.mtimeMs - a.mtimeMs).slice(0, count);
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
    guidance_scale: 4.0,
    sampler: renderPacket.sampler || null,
    scheduler: renderPacket.scheduler || null,
    sharpness: Number.isFinite(renderPacket.sharpness) ? renderPacket.sharpness : 2.0,
    style_selections: [],
    styles: [],
    base_model: "realvisxlV50_v40Bakedvae.safetensors",
    image_number: Number.isFinite(renderPacket.image_number) ? renderPacket.image_number : 1,
    async_process: false,
    // Bridge img2img fields (must match TextToImgRequest in fooocus_bridge.py)
    anchor_image_base64: renderPacket.anchor_image_base64 || null,
    generation_mode: renderPacket.generation_mode || "exploration",
    reproduction_anchor_mode: renderPacket.reproduction_anchor_mode || null,
    anchor_image_path: renderPacket.anchor_image_path || null,
    denoise_strength: Number.isFinite(renderPacket.denoise_strength) ? renderPacket.denoise_strength : null,
    // LoRA support
    lora_name: renderPacket.lora_name || null,
    lora_weight: Number.isFinite(renderPacket.lora_weight) ? renderPacket.lora_weight : 0.7,
  };
  
  // --- IMG2IMG VALIDATION for bridge ---
  const isImg2Img = renderPacket.generation_mode === "reproduction" &&
                    renderPacket.reproduction_anchor_mode === "image_anchored" &&
                    renderPacket.anchor_image_path;

  if (isImg2Img) {
    if (!renderPacket.anchor_image_base64) {
      throw new Error("IMG2IMG_TRANSPORT_FAIL: anchor_image_base64 missing - cannot send img2img without real image payload");
    }

    const inputPath = _normalizeOutputFilePath(renderPacket.anchor_image_path);
    if (!fs.existsSync(inputPath)) {
      throw new Error(`IMG2IMG_PREFLIGHT_FAIL: anchor_image_path file not found: ${inputPath}`);
    }
    const imgStat = fs.statSync(inputPath);
    console.log(`[RENDER_EXECUTOR] IMG2IMG DISPATCH CONFIRMED:`);
    console.log(`[RENDER_EXECUTOR]   anchor_image_base64: PRESENT (${renderPacket.anchor_image_base64.length} chars)`);
    console.log(`[RENDER_EXECUTOR]   anchor_image_path: ${inputPath}`);
    console.log(`[RENDER_EXECUTOR]   File size: ${imgStat.size} bytes`);
    console.log(`[RENDER_EXECUTOR]   denoise_strength: ${renderPacket.denoise_strength}`);
    console.log(`[RENDER_EXECUTOR]   generation_mode: reproduction`);
    console.log(`[RENDER_EXECUTOR]   reproduction_anchor_mode: image_anchored`);
  }
  const bodyObject = _applyEffectiveRenderProfile(requestedPayload);

  // --- HARD OVERRIDE: Final enforcement before HTTP dispatch ---
  bodyObject.base_model = "realvisxlV50_v40Bakedvae.safetensors";
  bodyObject.guidance_scale = 4.0;
  bodyObject.styles = [];
  bodyObject.style_selections = [];

  _writeFinalPayload(outputRoot, bodyObject);

  // --- PERSIST SUBMITTED PAYLOAD ---
  const submittedDir = path.join(process.cwd(), "runs", renderPacket._job_id || "unknown");
  if (!fs.existsSync(submittedDir)) {
    fs.mkdirSync(submittedDir, { recursive: true });
  }
  const submittedPayloadPath = path.join(submittedDir, "render_payload_submitted.json");
  fs.writeFileSync(submittedPayloadPath, JSON.stringify(bodyObject, null, 2));
  console.log(`[RENDER_EXECUTOR] PAYLOAD SUBMITTED SAVED: ${submittedPayloadPath}`);

  // --- HARD DISPATCH LOG ---
  const bodyKeys = Object.keys(bodyObject);
  const b64Len = bodyObject.anchor_image_base64 ? bodyObject.anchor_image_base64.length : 0;
  console.log(`[DISPATCH] TARGET: ${url.href}`);
  console.log(`[DISPATCH] METHOD: POST`);
  console.log(`[DISPATCH] TIMEOUT: ${timeoutMs}ms`);
  console.log(`[DISPATCH] BODY KEYS: ${bodyKeys.join(", ")}`);
  console.log(`[DISPATCH] generation_mode: ${bodyObject.generation_mode}`);
  console.log(`[DISPATCH] reproduction_anchor_mode: ${bodyObject.reproduction_anchor_mode}`);
  console.log(`[DISPATCH] anchor_image_path: ${bodyObject.anchor_image_path || "NONE"}`);
  console.log(`[DISPATCH] anchor_image_base64: ${b64Len > 0 ? `YES (${b64Len} chars)` : "NONE"}`);
  console.log(`[DISPATCH] denoise_strength: ${bodyObject.denoise_strength}`);
  console.log(`[DISPATCH] prompt: ${String(bodyObject.prompt || "").slice(0, 100)}...`);
  console.log(`[DISPATCH] PAYLOAD SIZE: ${JSON.stringify(bodyObject).length} bytes`);

  // --- RENDER FINAL PAYLOAD CHECK ---
  console.log(`[RENDER FINAL PAYLOAD CHECK] base_model = ${bodyObject.base_model}`);
  console.log(`[RENDER FINAL PAYLOAD CHECK] guidance_scale = ${bodyObject.guidance_scale}`);
  console.log(`[RENDER FINAL PAYLOAD CHECK] styles = ${JSON.stringify(bodyObject.styles)}`);
  console.log(`[RENDER FINAL PAYLOAD CHECK] style_selections = ${JSON.stringify(bodyObject.style_selections)}`);

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
          console.log(`[RENDER_EXECUTOR] Response received at: ${new Date().toISOString()}`);
          console.log(`[RENDER_EXECUTOR] Response preview: ${data.slice(0, 200)}${data.length > 200 ? "..." : ""}`);

          if (res.statusCode >= 400) {
            console.log(`[RENDER_EXECUTOR] HTTP ERROR: ${res.statusCode} - ${data.slice(0, 500)}`);
            resolve({
              kind: "error",
              error: new Error(`HTTP ${res.statusCode}: ${data.slice(0, 500)}`),
              renderStartMs: startMs
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

    req.on("timeout", () => {
      resolve({
        kind: "error",
        error: new Error(`Render timeout after ${timeoutMs}ms`),
        renderStartMs: startMs
      });
    });

    req.on("error", (err) => {
      resolve({
        kind: "error",
        error: new Error(`Connection error: ${err.message}`),
        renderStartMs: startMs
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
  // --- BRIDGE IMG2IMG VALIDATION for folder capture ---
  const isImg2Img = renderPacket.generation_mode === "reproduction" && 
                    renderPacket.reproduction_anchor_mode === "image_anchored" &&
                    renderPacket.anchor_image_path;
  
  if (isImg2Img) {
    if (!renderPacket.anchor_image_path) {
      return {
        output_file: null,
        seed_used: renderPacket.seed || null,
        render_time_ms: 0,
        status: "RENDER_FAILED",
        error: "IMG2IMG_NOT_AVAILABLE: folder_capture transport cannot process img2img without anchor_image_path",
      };
    }
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

function buildRenderPacket(translationResult, renderOpts, job) {
  const opts = renderOpts || {};
  const render = (job && job.render) || {};

  const packet = {
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
    _job_id: (job && job.job_id) || null,
    // LoRA support
    lora_name: opts.lora_name || null,
    lora_weight: Number.isFinite(opts.lora_weight) ? opts.lora_weight : 0.7,
    // Initialize IMG2IMG fields
    input_image: null,
    denoise_strength: null,
    anchor_image_base64: null,
    generation_mode: "exploration",
    reproduction_anchor_mode: null,
    anchor_image_path: null,
  };

  // --- IMG2IMG: Read ONLY from job.render ---
  if (render.input_image) {
    packet.input_image = render.input_image;
    packet.denoise_strength = render.denoise_strength ?? 0.05;
  }

  // --- LOAD REAL FILE AND ENCODE BASE64 ---
  if (packet.input_image) {
    const fs = require("fs");

    if (!fs.existsSync(packet.input_image)) {
      throw new Error(`[IMG2IMG] input_image file not found: ${packet.input_image}`);
    }

    const buf = fs.readFileSync(packet.input_image);
    const b64 = buf.toString("base64");

    if (!b64 || b64.length < 100) {
      throw new Error("[IMG2IMG] base64 encoding failed or too short");
    }

    packet.anchor_image_base64 = b64;
    packet.generation_mode = "reproduction";
    packet.reproduction_anchor_mode = "image_anchored";
    packet.anchor_image_path = packet.input_image;
  }

  // --- HARD ASSERT after packet build ---
  if (job.render?.input_image && !packet.input_image) {
    throw new Error("IMG2IMG DATA FLOW BROKEN: job.render.input_image exists but packet.input_image missing");
  }

  if (packet.input_image && !packet.anchor_image_base64) {
    throw new Error("IMG2IMG DATA FLOW BROKEN: input_image exists but anchor_image_base64 missing");
  }

  // --- PERSIST render packet ---
  const fs = require("fs");
  const path = require("path");
  const jobId = job?.job_id || "unknown";
  const runDir = path.join(process.cwd(), "runs", jobId);
  if (!fs.existsSync(runDir)) {
    fs.mkdirSync(runDir, { recursive: true });
  }
  const payloadPath = path.join(runDir, "render_payload.json");
  fs.writeFileSync(payloadPath, JSON.stringify(packet, null, 2));

  // --- EXACT LOGS ---
  console.log(`[RENDER_EXECUTOR] IMG2IMG input_image=${packet.input_image || "MISSING"}`);
  console.log(`[RENDER_EXECUTOR] IMG2IMG denoise=${packet.denoise_strength}`);
  console.log(`[RENDER_EXECUTOR] IMG2IMG base64_present=${packet.anchor_image_base64 ? "YES" : "NO"}`);
  console.log(`[RENDER_EXECUTOR] IMG2IMG base64_len=${packet.anchor_image_base64 ? packet.anchor_image_base64.length : 0}`);
  console.log(`[RENDER_EXECUTOR] PAYLOAD SAVED: ${payloadPath}`);

  return packet;
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

    // --- TRACE SOURCE OF input_image ---
    console.log(`[RENDER_EXECUTOR] PRE-BUILD - opts contains:`);
    console.log(`[RENDER_EXECUTOR]   opts.input_image: ${opts.input_image || 'MISSING'}`);
    console.log(`[RENDER_EXECUTOR]   opts.denoise_strength: ${opts.denoise_strength}`);
    console.log(`[RENDER_EXECUTOR]   All opts keys: ${Object.keys(opts).join(', ')}`);
    
    // --- Check job.render if available ---
    if (job && job.render) {
      console.log(`[RENDER_EXECUTOR] JOB RENDER - job.render contains:`);
      console.log(`[RENDER_EXECUTOR]   job.render.input_image: ${job.render.input_image || 'MISSING'}`);
      console.log(`[RENDER_EXECUTOR]   job.render.denoise_strength: ${job.render.denoise_strength}`);
    }

    const renderPacket = buildRenderPacket(translationResult, opts, job);
    
    // --- HARD ASSERT: data flow validation ---
    if (job && job.render && job.render.input_image && !renderPacket.anchor_image_path) {
      throw new Error("IMG2IMG DATA FLOW BROKEN: job.render.input_image exists but packet.anchor_image_path missing");
    }
    
    // --- LOG STEP 1: Bridge img2img fields ---
    console.log(`[RENDER_EXECUTOR] STEP 1 - After buildRenderPacket:`);
    console.log(`[RENDER_EXECUTOR]   generation_mode: ${renderPacket.generation_mode}`);
    console.log(`[RENDER_EXECUTOR]   reproduction_anchor_mode: ${renderPacket.reproduction_anchor_mode}`);
    console.log(`[RENDER_EXECUTOR]   anchor_image_path: ${renderPacket.anchor_image_path || 'MISSING'}`);
    console.log(`[RENDER_EXECUTOR]   denoise_strength: ${renderPacket.denoise_strength}`);
    console.log(`[RENDER_EXECUTOR]   input_image (log only): ${renderPacket.input_image || 'MISSING'}`);
    console.log(`[RENDER_EXECUTOR] Submitting render for job ${jobId}`);

    // --- STEP 2: Before final payload merge ---
    console.log(`[RENDER_EXECUTOR] STEP 2 - Before _submitRenderViaHttp:`);
    console.log(`[RENDER_EXECUTOR]   generation_mode: ${renderPacket.generation_mode}`);
    console.log(`[RENDER_EXECUTOR]   reproduction_anchor_mode: ${renderPacket.reproduction_anchor_mode}`);
    console.log(`[RENDER_EXECUTOR]   anchor_image_path: ${renderPacket.anchor_image_path || 'MISSING'}`);
    console.log(`[RENDER_EXECUTOR]   denoise_strength: ${renderPacket.denoise_strength}`);
    
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
