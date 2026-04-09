"use strict";

const fs = require("fs");
const path = require("path");
const { getGeminiConfig } = require("./gemini_env");
const { callGeminiWithState, extractResponseText } = require("./gemini/gemini_call_adapter");

function sanitizeGeminiText(text) {
  let s = String(text || "").trim();
  // Remove markdown fences: ```json ... ``` or ``` ... ```
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  // Strip any text before first { and after last }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return "";
  return s.slice(first, last + 1);
}

function extractJson(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  // 1. Direct parse
  try {
    return JSON.parse(raw);
  } catch (_) {}
  // 2. Sanitize (strip fences, extract { ... })
  const sanitized = sanitizeGeminiText(raw);
  if (!sanitized) return null;
  try {
    return JSON.parse(sanitized);
  } catch (_) {}
  // 3. Greedy regex fallback
  const match = sanitized.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (_) {
    return null;
  }
}

function buildFailure(errorMessage) {
  return {
    pass_fail: "FAIL",
    fail_rules: [errorMessage],
    material_read: "unknown",
    correct_reads: [],
    wrong_reads: [],
    severity: "HIGH",
    fix_direction: [],
    summary: errorMessage,
    gemini_validation_executed: false,
    parse_ok: false,
  };
}

async function runGeminiValidator(imagePath, promptPath, jobId = null) {
  const rubric = fs.readFileSync(path.resolve(promptPath), "utf-8");
  const gemini = getGeminiConfig();

  if (!fs.existsSync(imagePath)) {
    return buildFailure("GEMINI_IMAGE_READ_FAILED");
  }

  if (!gemini.hasKey) {
    return buildFailure("GEMINI_API_KEY_MISSING");
  }

  const imageBase64 = fs.readFileSync(imagePath).toString("base64");
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: rubric },
          {
            inlineData: {
              mimeType: "image/png",
              data: imageBase64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const { payload, response, geminiTrace } = await callGeminiWithState({
    model: gemini.model,
    apiKey: gemini.apiKey,
    body,
    jobId,
    role: "validator",
  });

  const text = extractResponseText(payload);

  const parsed = extractJson(text);
  if (!response.ok || !parsed) {
    let exactError = "GEMINI_REQUEST_FAILED";
    if (response.status === 403) exactError = "GEMINI_HTTP_403";
    else if (response.status === 404) exactError = "GEMINI_HTTP_404";
    else if (response.ok && !parsed) exactError = "GEMINI_INVALID_JSON";
    return {
      ...buildFailure(exactError),
      gemini_validation_executed: true,
      http_status: response.status,
      raw_text: String(text || "").slice(0, 2000),
      error: exactError,
      gemini_trace: geminiTrace,
    };
  }

  return {
    ...parsed,
    gemini_validation_executed: true,
    parse_ok: true,
    model: gemini.model,
    error: null,
    gemini_trace: geminiTrace,
  };
}

module.exports = {
  runGeminiValidator,
};
