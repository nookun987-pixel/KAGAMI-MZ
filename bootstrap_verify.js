"use strict";

const fs = require("fs");
const path = require("path");
const { getGeminiConfig } = require("./gemini_env");

async function checkFooocusHealth(url) {
  try {
    const response = await fetch(`${url}/`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return {
      available: response.ok || response.status === 200,
      status: response.status,
      url,
    };
  } catch (error) {
    return {
      available: false,
      status: null,
      url,
      error: error.message,
    };
  }
}

async function verifyBootstrap() {
  console.log("[BOOTSTRAP] Starting verification...\n");

  const gemini = getGeminiConfig();
  console.log("[BOOTSTRAP] Gemini Config:");
  console.log(`  - API Key Present: ${gemini.hasKey}`);
  console.log(`  - Source: ${gemini.source}`);
  console.log(`  - Model: ${gemini.model}`);
  console.log(`  - .env File Detected: ${gemini.envFileDetected}\n`);

  const fooocusUrl = process.env.FOOOCUS_API || process.env.FOOOCUS_API_URL || "http://127.0.0.1:7865";
  console.log("[BOOTSTRAP] Checking Fooocus health...");
  const fooocusHealth = await checkFooocusHealth(fooocusUrl);
  console.log(`  - URL: ${fooocusHealth.url}`);
  console.log(`  - Available: ${fooocusHealth.available}`);
  console.log(`  - Status: ${fooocusHealth.status || "N/A"}`);
  if (fooocusHealth.error) {
    console.log(`  - Error: ${fooocusHealth.error}`);
  }
  console.log();

  const validatorRubricPath = path.resolve(__dirname, "prompts", "gemini_validator_rubric.txt");
  const validatorRubricExists = fs.existsSync(validatorRubricPath);
  console.log("[BOOTSTRAP] Validator Rubric:");
  console.log(`  - Path: ${validatorRubricPath}`);
  console.log(`  - Exists: ${validatorRubricExists}\n`);

  const renderExecutorPath = path.resolve(__dirname, "render", "render_executor.js");
  const renderExecutorExists = fs.existsSync(renderExecutorPath);
  console.log("[BOOTSTRAP] Render Executor:");
  console.log(`  - Path: ${renderExecutorPath}`);
  console.log(`  - Exists: ${renderExecutorExists}\n`);

  const blockers = [];
  if (!gemini.hasKey) {
    blockers.push("GEMINI_API_KEY not found in environment");
  }
  if (!fooocusHealth.available) {
    blockers.push(`Fooocus API not available at ${fooocusUrl}`);
  }
  if (!validatorRubricExists) {
    blockers.push(`Validator rubric not found at ${validatorRubricPath}`);
  }
  if (!renderExecutorExists) {
    blockers.push(`Render executor not found at ${renderExecutorPath}`);
  }

  console.log("[BOOTSTRAP] Summary:");
  if (blockers.length === 0) {
    console.log("  ✓ All dependencies verified - READY FOR EXECUTION\n");
    return { ready: true, blockers: [] };
  } else {
    console.log("  ✗ BLOCKERS DETECTED:\n");
    blockers.forEach((blocker, i) => {
      console.log(`  ${i + 1}. ${blocker}`);
    });
    console.log();
    return { ready: false, blockers };
  }
}

if (require.main === module) {
  verifyBootstrap()
    .then((result) => {
      process.exit(result.ready ? 0 : 1);
    })
    .catch((error) => {
      console.error("[BOOTSTRAP] Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { verifyBootstrap, checkFooocusHealth };
