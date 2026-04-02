"use strict";
/**
 * PROBE: Live render capture diagnostic
 * Sends a real render to the bridge, captures the exact response shape,
 * tests _captureOutputFromResponse and _fallbackCapture against it,
 * and produces a hard verdict on the capture divergence.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");

// --- CONFIG ---
const BRIDGE_URL = process.env.FOOOCUS_API_URL || process.env.FOOOCUS_API || "http://127.0.0.1:7865";
const PROBE_DIR = path.join(__dirname, "runs", `CAPTURE_PROBE_${Date.now()}`);
fs.mkdirSync(PROBE_DIR, { recursive: true });

function log(msg) {
  const line = `[PROBE ${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(PROBE_DIR, "probe_log.txt"), line + "\n");
}

function saveArtifact(name, data) {
  const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  fs.writeFileSync(path.join(PROBE_DIR, name), content, "utf-8");
  log(`Artifact saved: ${name} (${content.length} bytes)`);
}

function fileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

async function sendRenderRequest() {
  const payload = {
    prompt: "white ceramic cube, studio product shot, minimal dark background, sharp edges",
    negative_prompt: "blurry, watermark, text, person, character",
    seed: 42,
    width: 512,
    height: 512,
    performance_selection: "Speed",
    steps: 4,
    disable_refiner: true,
    image_number: 1,
    async_process: false,
    style_selections: [],
    guidance_scale: 4.0,
    sharpness: 2.0,
    generation_mode: "exploration",
  };

  const body = JSON.stringify(payload);
  const url = new URL(BRIDGE_URL + "/generate");

  log(`Sending render request to ${url.href}`);
  log(`Payload size: ${body.length} bytes`);
  saveArtifact("request_payload.json", payload);

  const startMs = Date.now();

  return new Promise((resolve, reject) => {
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
        timeout: 600000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const elapsed = Date.now() - startMs;
          log(`HTTP ${res.statusCode} received in ${elapsed}ms`);
          log(`Response headers: ${JSON.stringify(res.headers)}`);
          log(`Response body length: ${data.length} bytes`);

          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            rawBody: data,
            startMs,
            elapsed,
          });
        });
      }
    );
    req.on("error", (e) => reject(new Error(`HTTP error: ${e.message}`)));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.write(body);
    req.end();
  });
}

function analyzeResponseShape(rawBody) {
  log("=== RESPONSE SHAPE ANALYSIS ===");

  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch (e) {
    log(`PARSE FAILURE: ${e.message}`);
    log(`Raw body first 500 chars: ${rawBody.slice(0, 500)}`);
    saveArtifact("response_raw.txt", rawBody);
    return { parsed: null, shape: "PARSE_FAILURE" };
  }

  const isArray = Array.isArray(parsed);
  const topType = isArray ? "array" : typeof parsed;
  log(`Top-level type: ${topType}`);

  if (isArray) {
    log(`Array length: ${parsed.length}`);
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      const keys = Object.keys(item);
      log(`  [${i}] keys: ${keys.join(", ")}`);
      log(`  [${i}] has "base64": ${!!item.base64} (length: ${(item.base64 || "").length})`);
      log(`  [${i}] has "url": ${!!item.url} (value: ${item.url || "NONE"})`);
      log(`  [${i}] has "output_file": ${!!item.output_file}`);
      log(`  [${i}] has "file_path": ${!!item.file_path}`);
      log(`  [${i}] has "path": ${!!item.path}`);
      log(`  [${i}] has "filename": ${!!item.filename}`);
      log(`  [${i}] has "seed": ${item.seed}`);
      log(`  [${i}] has "finish_reason": ${item.finish_reason}`);

      // Check if url file exists on disk
      if (item.url) {
        const exists = fs.existsSync(item.url);
        log(`  [${i}] url file exists on disk: ${exists}`);
        if (exists) {
          const stat = fs.statSync(item.url);
          log(`  [${i}] url file size: ${stat.size} bytes`);
          log(`  [${i}] url file mtime: ${stat.mtime.toISOString()}`);
          log(`  [${i}] url file mtimeMs: ${stat.mtimeMs}`);
          log(`  [${i}] url file hash: ${fileHash(item.url)}`);
        }
      }
    }
  } else if (typeof parsed === "object") {
    log(`Object keys: ${Object.keys(parsed).join(", ")}`);
    log(`success: ${parsed.success}`);
    log(`error: ${parsed.error}`);
  }

  // Save sanitized (no base64) for inspection
  const sanitized = JSON.parse(rawBody);
  if (Array.isArray(sanitized)) {
    sanitized.forEach((item) => {
      if (item.base64) item.base64 = `[BASE64_${item.base64.length}_CHARS]`;
    });
  }
  saveArtifact("response_shape.json", sanitized);

  return { parsed, shape: topType };
}

function testCaptureFromResponse(parsed, outputRoot) {
  log("=== _captureOutputFromResponse SIMULATION ===");

  // Replicate _normalizeFooocusResponse
  let results;
  if (!parsed) { results = []; }
  else if (Array.isArray(parsed)) { results = parsed; }
  else if (Array.isArray(parsed.images)) { results = parsed.images; }
  else if (Array.isArray(parsed.results)) { results = parsed.results; }
  else if (Array.isArray(parsed.data)) { results = parsed.data; }
  else if (parsed.result && Array.isArray(parsed.result)) { results = parsed.result; }
  else if (parsed.result && typeof parsed.result === "object") { results = [parsed.result]; }
  else { results = [parsed]; }

  log(`Normalized results count: ${results.length}`);

  for (let i = 0; i < results.length; i++) {
    const payload = results[i];
    log(`--- Result ${i} ---`);

    // Replicate _extractResponseImage
    const base64Data = payload.base64 || payload.image_base64 || payload.imageBase64 ||
                       payload.encoded_image || payload.encodedImage || null;
    const fileCandidate = payload.output_file || payload.file_path || payload.path ||
                          payload.filename || payload.file_name || payload.url || null;

    if (base64Data) {
      log(`  Shape: base64 (${base64Data.length} chars)`);
      // Try to save it
      try {
        const targetPath = path.join(outputRoot, "output_from_base64.png");
        fs.writeFileSync(targetPath, Buffer.from(base64Data, "base64"));
        const stat = fs.statSync(targetPath);
        log(`  base64 decode SUCCESS: ${targetPath} (${stat.size} bytes)`);
        log(`  base64 file hash: ${fileHash(targetPath)}`);

        // Compare with url file if exists
        if (payload.url && fs.existsSync(payload.url)) {
          const urlHash = fileHash(payload.url);
          const b64Hash = fileHash(targetPath);
          log(`  HASH COMPARE: url=${urlHash} vs base64=${b64Hash} → ${urlHash === b64Hash ? "IDENTICAL" : "DIFFERENT"}`);
        }

        return {
          success: true,
          source: "response_base64",
          path: targetPath,
          size: stat.size,
          hash: fileHash(targetPath),
        };
      } catch (e) {
        log(`  base64 decode FAILED: ${e.message}`);
      }
    }

    if (fileCandidate) {
      log(`  File candidate: ${fileCandidate}`);
      const exists = fs.existsSync(fileCandidate);
      log(`  File exists: ${exists}`);
      if (exists) {
        const targetPath = path.join(outputRoot, "output_from_file.png");
        fs.copyFileSync(fileCandidate, targetPath);
        return {
          success: true,
          source: "response_file_path",
          path: targetPath,
          originalPath: fileCandidate,
          size: fs.statSync(targetPath).size,
          hash: fileHash(targetPath),
        };
      }
    }

    log(`  No usable image in result ${i}`);
  }

  log(`  CAPTURE FROM RESPONSE: FAILED (no usable payload)`);
  return { success: false, source: null, reason: "no_usable_image_in_response" };
}

function testFallbackCapture(startMs) {
  log("=== _fallbackCapture SIMULATION ===");

  const fooocusOutputBase = process.env.FOOOCUS_OUTPUT_DIR || "D:/Fooocus-main/outputs";
  log(`Fallback scan directory: ${fooocusOutputBase}`);
  log(`Fallback scan cutoff: ${new Date(startMs).toISOString()} (${startMs})`);

  if (!fs.existsSync(fooocusOutputBase)) {
    log(`FALLBACK DIR DOES NOT EXIST: ${fooocusOutputBase}`);
    return { success: false, reason: "dir_not_found" };
  }

  // Find all PNGs recursively
  const allPngs = [];
  const scan = (dir) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { scan(full); }
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
        try {
          const stat = fs.statSync(full);
          allPngs.push({ path: full, mtimeMs: stat.mtimeMs, mtime: stat.mtime, size: stat.size });
        } catch (_) {}
      }
    }
  };
  scan(fooocusOutputBase);

  allPngs.sort((a, b) => b.mtimeMs - a.mtimeMs);
  log(`Total PNGs found in ${fooocusOutputBase}: ${allPngs.length}`);

  // Show newest 10
  log(`Newest 10 PNGs:`);
  for (let i = 0; i < Math.min(10, allPngs.length); i++) {
    const f = allPngs[i];
    const isNewer = f.mtimeMs > startMs;
    log(`  ${i + 1}. ${path.basename(f.path)} | mtime=${f.mtime.toISOString()} | mtimeMs=${f.mtimeMs} | ${isNewer ? "NEWER ✓" : "OLDER ✗"} | size=${f.size}`);
  }

  // Find newest after startMs
  const match = allPngs.find((f) => f.mtimeMs > startMs);
  if (match) {
    log(`FALLBACK MATCH: ${match.path}`);
    log(`  mtime: ${match.mtime.toISOString()}`);
    log(`  hash: ${fileHash(match.path)}`);
    return {
      success: true,
      source: "fooocus_global_scan",
      path: match.path,
      mtime: match.mtime.toISOString(),
      mtimeMs: match.mtimeMs,
      hash: fileHash(match.path),
    };
  }

  log(`FALLBACK: NO PNG newer than ${new Date(startMs).toISOString()}`);
  return { success: false, reason: "no_png_after_cutoff", cutoff: startMs, newestMtimeMs: allPngs[0]?.mtimeMs || null };
}

async function main() {
  log("========================================");
  log("RENDER CAPTURE PROBE — START");
  log(`Bridge URL: ${BRIDGE_URL}`);
  log(`Probe dir: ${PROBE_DIR}`);
  log("========================================");

  // Step 1: Send live render request
  let response;
  try {
    response = await sendRenderRequest();
  } catch (e) {
    log(`FATAL: Cannot reach bridge: ${e.message}`);
    saveArtifact("verdict.json", { verdict: "BRIDGE_UNREACHABLE", error: e.message });
    process.exit(1);
  }

  saveArtifact("response_meta.json", {
    statusCode: response.statusCode,
    headers: response.headers,
    bodyLength: response.rawBody.length,
    elapsed: response.elapsed,
    startMs: response.startMs,
  });

  if (response.statusCode >= 400) {
    log(`BRIDGE ERROR: HTTP ${response.statusCode}`);
    log(`Body: ${response.rawBody.slice(0, 1000)}`);
    saveArtifact("verdict.json", { verdict: "BRIDGE_HTTP_ERROR", statusCode: response.statusCode });
    process.exit(1);
  }

  // Step 2: Analyze response shape
  const { parsed, shape } = analyzeResponseShape(response.rawBody);
  if (!parsed) {
    saveArtifact("verdict.json", { verdict: "RESPONSE_PARSE_FAILURE", shape });
    process.exit(1);
  }

  // Step 3: Test _captureOutputFromResponse
  const captureResult = testCaptureFromResponse(parsed, PROBE_DIR);
  saveArtifact("capture_from_response.json", captureResult);

  // Step 4: Test _fallbackCapture
  const fallbackResult = testFallbackCapture(response.startMs);
  saveArtifact("fallback_capture.json", fallbackResult);

  // Step 5: Cross-compare
  log("=== CROSS-COMPARISON ===");
  const responseCapturePath = captureResult.success ? captureResult.path : null;
  const fallbackCapturePath = fallbackResult.success ? fallbackResult.path : null;

  if (responseCapturePath && fallbackCapturePath) {
    const respHash = fileHash(responseCapturePath);
    const fbHash = fileHash(fallbackCapturePath);
    log(`Response capture hash: ${respHash}`);
    log(`Fallback capture hash: ${fbHash}`);
    log(`SAME FILE: ${respHash === fbHash}`);
  }

  // Step 6: Determine case
  let caseVerdict;
  let classification;

  if (captureResult.success) {
    if (fallbackResult.success) {
      caseVerdict = "RESPONSE_CAPTURE_WORKS — fallback would also work but is redundant";
      classification = "ARCHITECTURAL_RISK_ONLY";
    } else {
      caseVerdict = "RESPONSE_CAPTURE_WORKS — fallback would FAIL (divergence confirmed but not triggered)";
      classification = "CONTRIBUTING_BUG";
    }
  } else {
    if (fallbackResult.success) {
      caseVerdict = "RESPONSE_CAPTURE_FAILS — fallback would save it but binds to GLOBAL dir (CASE 2 or 3)";
      classification = "PRIMARY_ROOT_CAUSE";
    } else {
      caseVerdict = "BOTH CAPTURE PATHS FAIL — CASE 3: no image captured at all";
      classification = "PRIMARY_ROOT_CAUSE";
    }
  }

  log("========================================");
  log(`CASE VERDICT: ${caseVerdict}`);
  log(`CLASSIFICATION: ${classification}`);
  log("========================================");

  const verdict = {
    timestamp: new Date().toISOString(),
    bridge_url: BRIDGE_URL,
    http_status: response.statusCode,
    response_elapsed_ms: response.elapsed,
    response_shape: shape,
    response_body_length: response.rawBody.length,
    response_capture: captureResult,
    fallback_capture: fallbackResult,
    case_verdict: caseVerdict,
    classification: classification,
    probe_dir: PROBE_DIR,
    fault_domain: captureResult.success ? "NONE_OR_RENDER_ENGINE" : "ARTIFACT_CAPTURE",
  };

  saveArtifact("verdict.json", verdict);
  log(`Full verdict saved to ${path.join(PROBE_DIR, "verdict.json")}`);
  log("PROBE COMPLETE");
}

main().catch((e) => {
  log(`PROBE FATAL: ${e.message}\n${e.stack}`);
  process.exit(1);
});
