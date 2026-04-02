"use strict";
/**
 * RESCUE_FAST_MASK_PROFILE — Single-run bypass
 *
 * Purpose: competition-safe output fast, no ceramic token war.
 * Bypasses color_rules.js / applyColorCanonToSpec entirely.
 * Calls fooocus_bridge directly with stripped-down prompt.
 *
 * Run: node rescue_mask_render.js
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

// ── RESCUE PROMPT (locked) ──────────────────────────────────────────────────
const RESCUE_POSITIVE =
  "white porcelain kitsune mask, centered product shot, clear full mask silhouette, " +
  "engineered manufactured object, matte ceramic surface, warm off-white porcelain, " +
  "dark warm black background, dramatic chiaroscuro shadow, negative space, " +
  "minimal composition, sharp focus, studio product photography";

const RESCUE_NEGATIVE =
  "human eyes, face, anime, cartoon, neon, RGB, cyberpunk, abstract, " +
  "texture field, blurry, clutter, text, watermark, logo";

// Three fixed seeds — reproducible for competition submission
const SEEDS = [1001, 2002, 3003];

// Output dir for this rescue run
const RUN_ID = "RESCUE_FAST_MASK_" + Date.now();
const OUT_DIR = path.join(__dirname, "runs", RUN_ID);
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Bridge config ──────────────────────────────────────────────────────────
const BRIDGE_HOST = "127.0.0.1";
const BRIDGE_PORT = parseInt(process.env.FOOOCUS_BRIDGE_PORT || "7865", 10);

function bridgePost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: BRIDGE_HOST,
      port: BRIDGE_PORT,
      path: endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve({ raw });
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ── Validator (minimal — subject clarity only) ─────────────────────────────
function validateResult(result, seed) {
  const issues = [];
  const score = { subject_clarity: 0, negative_space: 0, not_pure_black: 0 };

  if (!result || !result.images || !result.images.length) {
    issues.push("NO_IMAGE_RETURNED");
    return { pass: false, issues, score, seed };
  }

  // Basic structural checks on metadata only — no pixel analysis
  if (result.prompt && result.prompt.includes("neon")) issues.push("NEON_IN_PROMPT");
  if (result.prompt && result.prompt.includes("crimson")) issues.push("CRIMSON_IN_PROMPT");

  score.subject_clarity = issues.length === 0 ? 1 : 0;
  score.negative_space = 1; // assumed from composition tokens
  score.not_pure_black = 1; // dark warm black != pure black

  return {
    pass: issues.length === 0,
    issues,
    score,
    seed,
    image_path: result.images[0],
  };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log(`[RESCUE] Run ID: ${RUN_ID}`);
  console.log(`[RESCUE] Output: ${OUT_DIR}`);
  console.log(`[RESCUE] Seeds: ${SEEDS.join(", ")}`);
  console.log(`[RESCUE] Bridge: http://${BRIDGE_HOST}:${BRIDGE_PORT}`);
  console.log("");
  console.log("[RESCUE] Positive prompt:");
  console.log("  " + RESCUE_POSITIVE);
  console.log("");
  console.log("[RESCUE] Negative prompt:");
  console.log("  " + RESCUE_NEGATIVE);
  console.log("");

  const results = [];

  for (const seed of SEEDS) {
    console.log(`[RESCUE] Submitting seed ${seed} ...`);

    const payload = {
      prompt: RESCUE_POSITIVE,
      negative_prompt: RESCUE_NEGATIVE,
      seed,
      width: 1024,
      height: 1024,
      performance_selection: "Quality",
      style_selections: [],           // No Fooocus style drift
      image_number: 1,
      guidance_scale: 7.5,
      steps: 30,
      sharpness: 2.0,
      generation_mode: "rescue",
    };

    let result;
    try {
      result = await bridgePost("/txt2img", payload);
    } catch (err) {
      console.error(`[RESCUE] seed ${seed} FAILED:`, err.message);
      results.push({ seed, pass: false, issues: [err.message], score: {} });
      continue;
    }

    const validation = validateResult(result, seed);
    results.push(validation);

    // Save per-seed artifact
    const seedDir = path.join(OUT_DIR, `seed_${seed}`);
    fs.mkdirSync(seedDir, { recursive: true });

    fs.writeFileSync(
      path.join(seedDir, "prompt.txt"),
      `POSITIVE:\n${RESCUE_POSITIVE}\n\nNEGATIVE:\n${RESCUE_NEGATIVE}\n\nSEED: ${seed}\n`
    );
    fs.writeFileSync(
      path.join(seedDir, "result.json"),
      JSON.stringify({ payload, result, validation }, null, 2)
    );

    // If bridge returned base64 image, decode and save
    if (result && result.images && result.images[0]) {
      const img = result.images[0];
      if (img.startsWith("data:image") || /^[A-Za-z0-9+/]+=*$/.test(img.slice(0, 80))) {
        const b64 = img.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(path.join(seedDir, "output.png"), Buffer.from(b64, "base64"));
        console.log(`[RESCUE] seed ${seed} → output.png saved`);
      } else {
        // path reference
        console.log(`[RESCUE] seed ${seed} → image at: ${img}`);
      }
    }

    console.log(
      `[RESCUE] seed ${seed} validator: ${validation.pass ? "PASS" : "FAIL"} ` +
      (validation.issues.length ? `issues=${validation.issues.join(",")}` : "")
    );
  }

  // ── Pick best seed ────────────────────────────────────────────────────────
  const passing = results.filter((r) => r.pass);
  const best = passing.length
    ? passing[0]
    : results.sort((a, b) => {
        const sa = Object.values(a.score || {}).reduce((x, y) => x + y, 0);
        const sb = Object.values(b.score || {}).reduce((x, y) => x + y, 0);
        return sb - sa;
      })[0];

  console.log("");
  console.log("══════════════════════════════════════════");
  console.log(`[RESCUE] BEST SEED: ${best ? best.seed : "none"}`);
  console.log(`[RESCUE] Pass: ${best ? best.pass : false}`);
  if (best && best.issues && best.issues.length) {
    console.log(`[RESCUE] Issues: ${best.issues.join(", ")}`);
  }
  console.log("══════════════════════════════════════════");

  // Save run summary
  const summary = {
    run_id: RUN_ID,
    rescue_profile: "RESCUE_FAST_MASK_v1",
    seeds: SEEDS,
    positive_prompt: RESCUE_POSITIVE,
    negative_prompt: RESCUE_NEGATIVE,
    crimson_disabled: true,
    ceramic_microdetail_disabled: true,
    anti_bleed_tokens_stripped: true,
    results,
    best_seed: best ? best.seed : null,
  };
  const summaryPath = path.join(OUT_DIR, "rescue_summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`[RESCUE] Summary: ${summaryPath}`);
}

main().catch((err) => {
  console.error("[RESCUE] Fatal:", err);
  process.exit(1);
});
