"use strict";
/**
 * SEAM_PASS — img2img crimson seam injection (safe mode)
 * denoise_strength: 0.15  image_strength: 0.85
 * No geometry change. No lighting change. Seam only.
 */

const fs   = require("fs");
const path = require("path");
const http = require("http");

// ── Input ──────────────────────────────────────────────────────────────────
const LAST_JOB_DIR  = "D:/KAGAMI-MZ/runs/20260401_031831_7f116e";
const INPUT_IMAGE   = path.join(LAST_JOB_DIR, "output.png");

// ── Seam prompt additions (appended to base rescue prompt) ────────────────
const SEAM_PROMPT_ADD =
  "very thin internal kintsugi-style crimson seam only at micro fracture lines, " +
  "no spread, no bloom, no glow, mask surface remains white porcelain";

const SEAM_NEGATIVE_ADD =
  "full red mask, red surface, glowing red, emissive red, bloom, neon, spill, glossy, polished";

// ── Params ─────────────────────────────────────────────────────────────────
const DENOISE_STRENGTH = 0.15;
const IMAGE_STRENGTH   = 0.85;

// ── Output dir ─────────────────────────────────────────────────────────────
const TS      = Date.now();
const RUN_ID  = `SEAM_PASS_${TS}`;
const OUT_DIR = path.join("D:/KAGAMI-MZ/runs", RUN_ID);
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Bridge ─────────────────────────────────────────────────────────────────
const BRIDGE_PORT = parseInt(process.env.FOOOCUS_BRIDGE_PORT || "7865", 10);

function bridgePost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req  = http.request(
      { hostname: "127.0.0.1", port: BRIDGE_PORT, path: endpoint,
        method: "POST", headers: { "Content-Type": "application/json",
                                   "Content-Length": Buffer.byteLength(data) } },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => { try { resolve(JSON.parse(raw)); } catch { resolve({ raw }); } });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(INPUT_IMAGE)) {
    console.error(`[SEAM] Input not found: ${INPUT_IMAGE}`);
    process.exit(1);
  }

  // Load input as base64
  const imgB64 = fs.readFileSync(INPUT_IMAGE).toString("base64");

  const payload = {
    prompt:           SEAM_PROMPT_ADD,
    negative_prompt:  SEAM_NEGATIVE_ADD,
    seed:             -1,
    width:            1024,
    height:           1024,
    performance_selection: "Quality",
    style_selections: [],
    image_number:     1,
    guidance_scale:   7.0,
    steps:            30,
    sharpness:        2.0,
    denoise_strength: DENOISE_STRENGTH,
    // img2img fields
    anchor_image_base64: `data:image/png;base64,${imgB64}`,
    anchor_strength:     IMAGE_STRENGTH,
    generation_mode:     "img2img",
    preservation_mode:   "surface_only",
  };

  console.log(`[SEAM] Input:   ${INPUT_IMAGE}`);
  console.log(`[SEAM] Denoise: ${DENOISE_STRENGTH}`);
  console.log(`[SEAM] Output:  ${OUT_DIR}`);
  console.log(`[SEAM] Submitting to bridge :${BRIDGE_PORT} ...`);

  let result;
  try {
    result = await bridgePost("/txt2img", payload);
  } catch (err) {
    console.error("[SEAM] Bridge error:", err.message);
    process.exit(1);
  }

  // ── Save prompt.txt ───────────────────────────────────────────────────────
  const promptText =
    `SEAM PROMPT ADD:\n${SEAM_PROMPT_ADD}\n\n` +
    `NEGATIVE ADD:\n${SEAM_NEGATIVE_ADD}\n\n` +
    `INPUT IMAGE: ${INPUT_IMAGE}\n`;
  fs.writeFileSync(path.join(OUT_DIR, "prompt.txt"), promptText);

  // ── Save params.json ──────────────────────────────────────────────────────
  const params = {
    mode:             "img2img",
    denoise_strength: DENOISE_STRENGTH,
    image_strength:   IMAGE_STRENGTH,
    guidance_scale:   7.0,
    steps:            30,
    style_selections: [],
    seed:             result.seed ?? -1,
    input_image:      INPUT_IMAGE,
  };
  fs.writeFileSync(path.join(OUT_DIR, "params.json"), JSON.stringify(params, null, 2));

  // ── Save output.png ───────────────────────────────────────────────────────
  const outputPath = path.join(OUT_DIR, "output.png");
  if (result && result.images && result.images[0]) {
    const img = result.images[0];
    const b64 = img.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(outputPath, Buffer.from(b64, "base64"));
    console.log(`[SEAM] Saved: ${outputPath}`);
  } else if (result && result.image_path) {
    fs.copyFileSync(result.image_path, outputPath);
    console.log(`[SEAM] Copied: ${outputPath}`);
  } else {
    console.warn("[SEAM] No image in response — raw result saved");
    fs.writeFileSync(path.join(OUT_DIR, "raw_result.json"), JSON.stringify(result, null, 2));
  }

  console.log("");
  console.log(`OUTPUT: ${outputPath}`);
  console.log(`denoise=${DENOISE_STRENGTH}`);
}

main().catch((err) => { console.error("[SEAM] Fatal:", err); process.exit(1); });
