"use strict";

const { getGeminiConfig } = require("./gemini_env");
const { runGeminiValidator } = require("./gemini_validator");
const { callGeminiWithState } = require("./gemini/gemini_call_adapter");

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
    // Health-check ping: no job context, signature intentionally skipped (jobId=null).
    const { response } = await callGeminiWithState({
      model: config.model,
      apiKey: config.apiKey,
      body: {
        contents: [{ parts: [{ text: "say ok" }] }],
        generationConfig: { temperature: 0 },
      },
      jobId: null,
      role: "runtime",
    });

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
  const result = await runGeminiValidator(imagePath, promptPath, context.job_id || null);

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
