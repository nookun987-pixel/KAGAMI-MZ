"use strict";

const { getGeminiConfig } = require("./gemini_env");
const { runGeminiValidator } = require("./gemini_validator");

async function validateGeminiRuntime() {
  const config = getGeminiConfig();
  if (!config.hasKey) {
    return {
      ok: false,
      http_status: null,
      error: "GEMINI_API_KEY_MISSING",
      model: config.model,
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "say ok" }] }],
          generationConfig: { temperature: 0 },
        }),
      }
    );

    return {
      ok: response.ok,
      http_status: response.status,
      error: response.ok
        ? null
        : response.status === 403
          ? "GEMINI_HTTP_403"
          : response.status === 404
            ? "GEMINI_HTTP_404"
            : "GEMINI_REQUEST_FAILED",
      model: config.model,
    };
  } catch (error) {
    return {
      ok: false,
      http_status: null,
      error: "GEMINI_REQUEST_FAILED",
      model: config.model,
      message: error.message,
    };
  }
}

async function judgeRenderedImage(imagePath, context = {}) {
  const promptPath = context.promptPath || context.rubricPath;
  const result = await runGeminiValidator(imagePath, promptPath);

  return {
    decision: result && result.pass_fail === "PASS" && result.parse_ok === true ? "PASS" : "FAIL",
    material_read: result ? result.material_read : "unknown",
    drift_flags: result ? (Array.isArray(result.wrong_reads) ? result.wrong_reads : []) : [],
    fail_rules: result ? (Array.isArray(result.fail_rules) ? result.fail_rules : []) : [],
    corrections: result ? (Array.isArray(result.fix_direction) ? result.fix_direction : []) : [],
    confidence: typeof result.confidence === "number" ? result.confidence : 0,
    raw: result,
  };
}

module.exports = {
  judgeRenderedImage,
  validateGeminiRuntime,
};
